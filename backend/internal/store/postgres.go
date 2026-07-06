package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrAdminNotFound = errors.New("admin not found")

type Admin struct {
	ID           string
	Email        string
	Name         string
	PasswordHash string
}

type Postgres struct {
	pool *pgxpool.Pool
}

func Open(ctx context.Context, databaseURL string) (*Postgres, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, err
	}
	config.MaxConns = 5
	config.MaxConnLifetime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, err
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, err
	}

	return &Postgres{pool: pool}, nil
}

func (p *Postgres) Close() {
	p.pool.Close()
}

func (p *Postgres) Ping(ctx context.Context) error {
	return p.pool.Ping(ctx)
}

func (p *Postgres) AdminByEmail(ctx context.Context, email string) (Admin, error) {
	return scanAdmin(p.pool.QueryRow(ctx, `
		SELECT id::text, email, name, password_hash
		FROM admins
		WHERE email = $1
	`, email))
}

func (p *Postgres) AdminByID(ctx context.Context, id string) (Admin, error) {
	return scanAdmin(p.pool.QueryRow(ctx, `
		SELECT id::text, email, name, password_hash
		FROM admins
		WHERE id = $1
	`, id))
}

func (p *Postgres) UpsertAdmin(ctx context.Context, email, name, passwordHash string) error {
	_, err := p.pool.Exec(ctx, `
		INSERT INTO admins (email, name, password_hash)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO UPDATE SET
			name = EXCLUDED.name,
			password_hash = EXCLUDED.password_hash,
			updated_at = CURRENT_TIMESTAMP
	`, email, name, passwordHash)
	return err
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanAdmin(row rowScanner) (Admin, error) {
	var admin Admin
	if err := row.Scan(&admin.ID, &admin.Email, &admin.Name, &admin.PasswordHash); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Admin{}, ErrAdminNotFound
		}
		return Admin{}, err
	}
	return admin, nil
}

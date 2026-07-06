package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	ErrTutorialNotFound = errors.New("tutorial not found")
)

type Tutorial struct {
	ID               string
	Slug             string
	Title            string
	Category         string
	ShortDescription string
	VideoURL         *string
	IsActive         bool
	OrderIndex       int
	CreatedAt        time.Time
}

type TutorialStep struct {
	ID          string
	TutorialID  string
	StepNumber  int
	Title       string
	Description string
	Highlight   *string
}

const tutorialCols = `id::text, slug, title, category, short_description, video_url, is_active, order_index, created_at`

func scanTutorial(row pgx.Row, t *Tutorial) error {
	return row.Scan(
		&t.ID,
		&t.Slug,
		&t.Title,
		&t.Category,
		&t.ShortDescription,
		&t.VideoURL,
		&t.IsActive,
		&t.OrderIndex,
		&t.CreatedAt,
	)
}

func (p *Postgres) ListPublicTutorials(ctx context.Context) ([]Tutorial, error) {
	query := `SELECT ` + tutorialCols + ` FROM tutorials WHERE is_active = true ORDER BY order_index ASC, created_at DESC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Tutorial
	for rows.Next() {
		var t Tutorial
		if err := scanTutorial(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []Tutorial{}
	}
	return items, rows.Err()
}

func (p *Postgres) GetPublicTutorialBySlug(ctx context.Context, slug string) (Tutorial, error) {
	query := `SELECT ` + tutorialCols + ` FROM tutorials WHERE slug = $1 AND is_active = true`
	var t Tutorial
	err := scanTutorial(p.pool.QueryRow(ctx, query, slug), &t)
	if errors.Is(err, pgx.ErrNoRows) {
		return Tutorial{}, ErrTutorialNotFound
	}
	return t, err
}

func (p *Postgres) ListAdminTutorials(ctx context.Context) ([]Tutorial, error) {
	query := `SELECT ` + tutorialCols + ` FROM tutorials ORDER BY order_index ASC, created_at DESC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Tutorial
	for rows.Next() {
		var t Tutorial
		if err := scanTutorial(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []Tutorial{}
	}
	return items, rows.Err()
}

func (p *Postgres) GetTutorialByID(ctx context.Context, id string) (Tutorial, error) {
	query := `SELECT ` + tutorialCols + ` FROM tutorials WHERE id::uuid = $1`
	var t Tutorial
	err := scanTutorial(p.pool.QueryRow(ctx, query, id), &t)
	if errors.Is(err, pgx.ErrNoRows) {
		return Tutorial{}, ErrTutorialNotFound
	}
	return t, err
}

func (p *Postgres) StepsByTutorialID(ctx context.Context, tutorialID string) ([]TutorialStep, error) {
	query := `
		SELECT id::text, tutorial_id::text, step_number, title, description, highlight
		FROM tutorial_steps
		WHERE tutorial_id::uuid = $1
		ORDER BY step_number ASC
	`
	rows, err := p.pool.Query(ctx, query, tutorialID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var steps []TutorialStep
	for rows.Next() {
		var s TutorialStep
		if err := rows.Scan(&s.ID, &s.TutorialID, &s.StepNumber, &s.Title, &s.Description, &s.Highlight); err != nil {
			return nil, err
		}
		steps = append(steps, s)
	}
	if steps == nil {
		steps = []TutorialStep{}
	}
	return steps, rows.Err()
}

func (p *Postgres) CreateTutorial(ctx context.Context, t Tutorial, steps []TutorialStep) (string, error) {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var id string
	query := `
		INSERT INTO tutorials (slug, title, category, short_description, video_url, is_active, order_index)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id::text
	`
	err = tx.QueryRow(ctx, query, t.Slug, t.Title, t.Category, t.ShortDescription, t.VideoURL, t.IsActive, t.OrderIndex).Scan(&id)
	if err != nil {
		if isUniqueViolation(err) {
			return "", ErrSlugConflict
		}
		return "", err
	}

	if err := insertTutorialSteps(ctx, tx, id, steps); err != nil {
		return "", err
	}

	return id, tx.Commit(ctx)
}

func (p *Postgres) UpdateTutorial(ctx context.Context, id string, t Tutorial, steps []TutorialStep) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
		UPDATE tutorials
		SET slug = $1, title = $2, category = $3, short_description = $4, video_url = $5, is_active = $6, order_index = $7
		WHERE id::uuid = $8
	`
	tag, err := tx.Exec(ctx, query, t.Slug, t.Title, t.Category, t.ShortDescription, t.VideoURL, t.IsActive, t.OrderIndex, id)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrSlugConflict
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrTutorialNotFound
	}

	if _, err = tx.Exec(ctx, "DELETE FROM tutorial_steps WHERE tutorial_id::uuid = $1", id); err != nil {
		return err
	}

	if err := insertTutorialSteps(ctx, tx, id, steps); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *Postgres) DeleteTutorial(ctx context.Context, id string) error {
	query := `DELETE FROM tutorials WHERE id::uuid = $1`
	tag, err := p.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrTutorialNotFound
	}
	return nil
}

func insertTutorialSteps(ctx context.Context, tx pgx.Tx, tutorialID string, steps []TutorialStep) error {
	for i, s := range steps {
		stepNum := s.StepNumber
		if stepNum <= 0 {
			stepNum = i + 1
		}
		query := `
			INSERT INTO tutorial_steps (tutorial_id, step_number, title, description, highlight)
			VALUES ($1::uuid, $2, $3, $4, $5)
		`
		if _, err := tx.Exec(ctx, query, tutorialID, stepNum, s.Title, s.Description, s.Highlight); err != nil {
			return err
		}
	}
	return nil
}

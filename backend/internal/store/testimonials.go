package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	ErrTestimonialNotFound = errors.New("testimonial not found")
)

type Testimonial struct {
	ID           string
	Title        string
	Description  string
	ImageURL     *string
	ImageAlt     string
	RoleLocation *string
	Rating       int
	IsActive     bool
	OrderIndex   int
	CreatedAt    time.Time
}

const testimonialCols = `id::text, title, description, image_url, image_alt, role_location, rating, is_active, order_index, created_at`

func scanTestimonial(row pgx.Row, t *Testimonial) error {
	return row.Scan(
		&t.ID,
		&t.Title,
		&t.Description,
		&t.ImageURL,
		&t.ImageAlt,
		&t.RoleLocation,
		&t.Rating,
		&t.IsActive,
		&t.OrderIndex,
		&t.CreatedAt,
	)
}

func (p *Postgres) ListPublicTestimonials(ctx context.Context) ([]Testimonial, error) {
	query := `SELECT ` + testimonialCols + ` FROM testimonials WHERE is_active = true ORDER BY order_index ASC, created_at DESC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Testimonial
	for rows.Next() {
		var t Testimonial
		if err := scanTestimonial(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []Testimonial{}
	}
	return items, rows.Err()
}

func (p *Postgres) ListAdminTestimonials(ctx context.Context) ([]Testimonial, error) {
	query := `SELECT ` + testimonialCols + ` FROM testimonials ORDER BY order_index ASC, created_at DESC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Testimonial
	for rows.Next() {
		var t Testimonial
		if err := scanTestimonial(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []Testimonial{}
	}
	return items, rows.Err()
}

func (p *Postgres) GetTestimonialByID(ctx context.Context, id string) (Testimonial, error) {
	query := `SELECT ` + testimonialCols + ` FROM testimonials WHERE id::uuid = $1`
	var t Testimonial
	err := scanTestimonial(p.pool.QueryRow(ctx, query, id), &t)
	if errors.Is(err, pgx.ErrNoRows) {
		return Testimonial{}, ErrTestimonialNotFound
	}
	return t, err
}

func (p *Postgres) CreateTestimonial(ctx context.Context, t *Testimonial) error {
	query := `
		INSERT INTO testimonials (title, description, image_url, image_alt, role_location, rating, is_active, order_index)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id::text, created_at
	`
	return p.pool.QueryRow(
		ctx,
		query,
		t.Title,
		t.Description,
		t.ImageURL,
		t.ImageAlt,
		t.RoleLocation,
		t.Rating,
		t.IsActive,
		t.OrderIndex,
	).Scan(&t.ID, &t.CreatedAt)
}

func (p *Postgres) UpdateTestimonial(ctx context.Context, t *Testimonial) error {
	query := `
		UPDATE testimonials
		SET title = $1, description = $2, image_url = $3, image_alt = $4, role_location = $5, rating = $6, is_active = $7, order_index = $8
		WHERE id::uuid = $9
	`
	tag, err := p.pool.Exec(
		ctx,
		query,
		t.Title,
		t.Description,
		t.ImageURL,
		t.ImageAlt,
		t.RoleLocation,
		t.Rating,
		t.IsActive,
		t.OrderIndex,
		t.ID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrTestimonialNotFound
	}
	return nil
}

func (p *Postgres) DeleteTestimonial(ctx context.Context, id string) error {
	query := `DELETE FROM testimonials WHERE id::uuid = $1`
	tag, err := p.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrTestimonialNotFound
	}
	return nil
}

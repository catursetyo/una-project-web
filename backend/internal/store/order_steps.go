package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

type OrderStep struct {
	ID          string
	StepNumber  string
	Title       string
	Description string
	IconName    string
	IsActive    bool
	OrderIndex  int
}

const orderStepCols = `id::text, step_number, title, description, icon_name, is_active, order_index`

func scanOrderStep(row pgx.Row, s *OrderStep) error {
	return row.Scan(
		&s.ID,
		&s.StepNumber,
		&s.Title,
		&s.Description,
		&s.IconName,
		&s.IsActive,
		&s.OrderIndex,
	)
}

func (p *Postgres) ListPublicOrderSteps(ctx context.Context) ([]OrderStep, error) {
	query := `SELECT ` + orderStepCols + ` FROM order_steps WHERE is_active = true ORDER BY order_index ASC, step_number ASC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []OrderStep
	for rows.Next() {
		var s OrderStep
		if err := scanOrderStep(rows, &s); err != nil {
			return nil, err
		}
		items = append(items, s)
	}
	if items == nil {
		items = []OrderStep{}
	}
	return items, rows.Err()
}

func (p *Postgres) ListAdminOrderSteps(ctx context.Context) ([]OrderStep, error) {
	query := `SELECT ` + orderStepCols + ` FROM order_steps ORDER BY order_index ASC, step_number ASC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []OrderStep
	for rows.Next() {
		var s OrderStep
		if err := scanOrderStep(rows, &s); err != nil {
			return nil, err
		}
		items = append(items, s)
	}
	if items == nil {
		items = []OrderStep{}
	}
	return items, rows.Err()
}

// ReplaceAllOrderSteps performs an atomic bulk update by replacing all order steps in one transaction.
func (p *Postgres) ReplaceAllOrderSteps(ctx context.Context, steps []OrderStep) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, "DELETE FROM order_steps"); err != nil {
		return err
	}

	for i, s := range steps {
		stepNum := s.StepNumber
		if stepNum == "" {
			stepNum = fmt.Sprintf("%02d", i+1)
		}
		icon := s.IconName
		if icon == "" {
			icon = "whatsapp"
		}
		orderIdx := s.OrderIndex
		if orderIdx <= 0 {
			orderIdx = i + 1
		}

		query := `
			INSERT INTO order_steps (step_number, title, description, icon_name, is_active, order_index)
			VALUES ($1, $2, $3, $4, $5, $6)
		`
		if _, err := tx.Exec(ctx, query, stepNum, s.Title, s.Description, icon, s.IsActive, orderIdx); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}


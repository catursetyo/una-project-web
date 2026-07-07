package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	ErrWhatsAppTemplateNotFound = errors.New("whatsapp template not found")
	ErrTemplateNameConflict     = errors.New("template name already exists")
)

type WhatsAppTemplate struct {
	ID             string
	TemplateName   string
	Category       string
	MessagePattern string
	IsDefault      bool
	IsActive       bool
	CreatedAt      time.Time
}

const whatsappTemplateCols = `id::text, template_name, category, message_pattern, is_default, is_active, created_at`

func scanWhatsAppTemplate(row pgx.Row, t *WhatsAppTemplate) error {
	return row.Scan(
		&t.ID,
		&t.TemplateName,
		&t.Category,
		&t.MessagePattern,
		&t.IsDefault,
		&t.IsActive,
		&t.CreatedAt,
	)
}

func (p *Postgres) ListPublicWhatsAppTemplates(ctx context.Context) ([]WhatsAppTemplate, error) {
	query := `SELECT ` + whatsappTemplateCols + ` FROM whatsapp_templates WHERE is_active = true ORDER BY is_default DESC, template_name ASC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []WhatsAppTemplate
	for rows.Next() {
		var t WhatsAppTemplate
		if err := scanWhatsAppTemplate(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []WhatsAppTemplate{}
	}
	return items, rows.Err()
}

func (p *Postgres) GetPublicWhatsAppTemplateByName(ctx context.Context, name string) (WhatsAppTemplate, error) {
	query := `SELECT ` + whatsappTemplateCols + ` FROM whatsapp_templates WHERE template_name = $1 AND is_active = true`
	var t WhatsAppTemplate
	err := scanWhatsAppTemplate(p.pool.QueryRow(ctx, query, name), &t)
	if errors.Is(err, pgx.ErrNoRows) {
		return WhatsAppTemplate{}, ErrWhatsAppTemplateNotFound
	}
	return t, err
}

func (p *Postgres) ListAdminWhatsAppTemplates(ctx context.Context) ([]WhatsAppTemplate, error) {
	query := `SELECT ` + whatsappTemplateCols + ` FROM whatsapp_templates ORDER BY category ASC, is_default DESC, template_name ASC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []WhatsAppTemplate
	for rows.Next() {
		var t WhatsAppTemplate
		if err := scanWhatsAppTemplate(rows, &t); err != nil {
			return nil, err
		}
		items = append(items, t)
	}
	if items == nil {
		items = []WhatsAppTemplate{}
	}
	return items, rows.Err()
}

func (p *Postgres) GetWhatsAppTemplateByID(ctx context.Context, id string) (WhatsAppTemplate, error) {
	query := `SELECT ` + whatsappTemplateCols + ` FROM whatsapp_templates WHERE id::uuid = $1`
	var t WhatsAppTemplate
	err := scanWhatsAppTemplate(p.pool.QueryRow(ctx, query, id), &t)
	if errors.Is(err, pgx.ErrNoRows) {
		return WhatsAppTemplate{}, ErrWhatsAppTemplateNotFound
	}
	return t, err
}

func (p *Postgres) CreateWhatsAppTemplate(ctx context.Context, t *WhatsAppTemplate) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if t.IsDefault {
		if _, err := tx.Exec(ctx, "UPDATE whatsapp_templates SET is_default = false WHERE category = $1", t.Category); err != nil {
			return err
		}
	}

	query := `
		INSERT INTO whatsapp_templates (template_name, category, message_pattern, is_default, is_active)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id::text, created_at
	`
	err = tx.QueryRow(ctx, query, t.TemplateName, t.Category, t.MessagePattern, t.IsDefault, t.IsActive).Scan(&t.ID, &t.CreatedAt)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrTemplateNameConflict
		}
		return err
	}
	if err := ensureWhatsAppCategoryDefault(ctx, tx, t.Category); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *Postgres) UpdateWhatsAppTemplate(ctx context.Context, t *WhatsAppTemplate) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var oldCategory string
	err = tx.QueryRow(ctx, "SELECT category FROM whatsapp_templates WHERE id::uuid = $1", t.ID).Scan(&oldCategory)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrWhatsAppTemplateNotFound
	}
	if err != nil {
		return err
	}

	if t.IsDefault {
		if _, err := tx.Exec(ctx, "UPDATE whatsapp_templates SET is_default = false WHERE category = $1 AND id::uuid != $2", t.Category, t.ID); err != nil {
			return err
		}
	}

	query := `
		UPDATE whatsapp_templates
		SET template_name = $1, category = $2, message_pattern = $3, is_default = $4, is_active = $5
		WHERE id::uuid = $6
	`
	tag, err := tx.Exec(ctx, query, t.TemplateName, t.Category, t.MessagePattern, t.IsDefault, t.IsActive, t.ID)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrTemplateNameConflict
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrWhatsAppTemplateNotFound
	}
	if err := ensureWhatsAppCategoryDefault(ctx, tx, oldCategory); err != nil {
		return err
	}
	if err := ensureWhatsAppCategoryDefault(ctx, tx, t.Category); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *Postgres) DeleteWhatsAppTemplate(ctx context.Context, id string) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var category string
	err = tx.QueryRow(ctx, "SELECT category FROM whatsapp_templates WHERE id::uuid = $1", id).Scan(&category)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrWhatsAppTemplateNotFound
	}
	if err != nil {
		return err
	}

	query := `DELETE FROM whatsapp_templates WHERE id::uuid = $1`
	tag, err := tx.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrWhatsAppTemplateNotFound
	}
	if err := ensureWhatsAppCategoryDefault(ctx, tx, category); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func ensureWhatsAppCategoryDefault(ctx context.Context, tx pgx.Tx, category string) error {
	if category == "" {
		return nil
	}

	var hasDefault bool
	if err := tx.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM whatsapp_templates
			WHERE category = $1 AND is_active = true AND is_default = true
		)
	`, category).Scan(&hasDefault); err != nil {
		return err
	}
	if hasDefault {
		return nil
	}

	_, err := tx.Exec(ctx, `
		UPDATE whatsapp_templates
		SET is_default = true
		WHERE id = (
			SELECT id FROM whatsapp_templates
			WHERE category = $1 AND is_active = true
			ORDER BY created_at ASC
			LIMIT 1
		)
	`, category)
	return err
}

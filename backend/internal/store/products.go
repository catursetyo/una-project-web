package store

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrProductNotFound = errors.New("product not found")
	ErrSlugConflict    = errors.New("slug already exists")
)

type Product struct {
	ID               string
	Slug             string
	Name             string
	Category         string
	ShortDescription string
	Description      string
	Dimensions       *string
	Features         []string
	PriceStartFrom   float64
	ImageURL         *string
	VideoURL         *string
	IsFeatured       bool
	IsActive         bool
	OrderIndex       int
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type ProductVariant struct {
	ID          string
	ProductID   string
	Name        string
	Price       float64
	Description *string
	OrderIndex  int
}

const productCols = `id::text, slug, name, category, short_description, description,
	dimensions, features, price_start_from, image_url, video_url,
	is_featured, is_active, order_index, created_at, updated_at`

// --- Public queries ---

func (p *Postgres) ActiveProducts(ctx context.Context, category string, featured *bool) ([]Product, error) {
	q := "SELECT " + productCols + " FROM products WHERE is_active = true"
	var args []any
	n := 0

	if category != "" {
		n++
		q += " AND category = $" + strconv.Itoa(n)
		args = append(args, category)
	}
	if featured != nil {
		n++
		q += " AND is_featured = $" + strconv.Itoa(n)
		args = append(args, *featured)
	}
	q += " ORDER BY order_index, name"

	rows, err := p.pool.Query(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return collectProducts(rows)
}

func (p *Postgres) ActiveProductBySlug(ctx context.Context, slug string) (Product, error) {
	return scanProduct(p.pool.QueryRow(ctx,
		"SELECT "+productCols+" FROM products WHERE slug = $1 AND is_active = true", slug))
}

// --- Admin queries ---

func (p *Postgres) AllProducts(ctx context.Context, activeOnly *bool, limit, offset int) ([]Product, int, error) {
	var total int
	var rows pgx.Rows
	var err error

	// ponytail: dua branch lebih jelas daripada dynamic query builder
	if activeOnly != nil {
		if err = p.pool.QueryRow(ctx,
			"SELECT count(*) FROM products WHERE is_active = $1", *activeOnly).Scan(&total); err != nil {
			return nil, 0, err
		}
		rows, err = p.pool.Query(ctx,
			"SELECT "+productCols+" FROM products WHERE is_active = $1 ORDER BY order_index, name LIMIT $2 OFFSET $3",
			*activeOnly, limit, offset)
	} else {
		if err = p.pool.QueryRow(ctx, "SELECT count(*) FROM products").Scan(&total); err != nil {
			return nil, 0, err
		}
		rows, err = p.pool.Query(ctx,
			"SELECT "+productCols+" FROM products ORDER BY order_index, name LIMIT $1 OFFSET $2",
			limit, offset)
	}
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	products, err := collectProducts(rows)
	return products, total, err
}

func (p *Postgres) ProductByID(ctx context.Context, id string) (Product, error) {
	return scanProduct(p.pool.QueryRow(ctx,
		"SELECT "+productCols+" FROM products WHERE id = $1", id))
}

func (p *Postgres) VariantsByProductID(ctx context.Context, productID string) ([]ProductVariant, error) {
	rows, err := p.pool.Query(ctx, `
		SELECT id::text, product_id::text, name, price, description, order_index
		FROM product_variants WHERE product_id = $1 ORDER BY order_index`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var variants []ProductVariant
	for rows.Next() {
		var v ProductVariant
		if err := rows.Scan(&v.ID, &v.ProductID, &v.Name, &v.Price, &v.Description, &v.OrderIndex); err != nil {
			return nil, err
		}
		variants = append(variants, v)
	}
	return variants, rows.Err()
}

// CreateProduct inserts product and variants in one transaction.
func (p *Postgres) CreateProduct(ctx context.Context, prod Product, variants []ProductVariant) (string, error) {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var id string
	err = tx.QueryRow(ctx, `
		INSERT INTO products (slug, name, category, short_description, description,
			dimensions, features, price_start_from, image_url, video_url,
			is_featured, is_active, order_index)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
		RETURNING id::text`,
		prod.Slug, prod.Name, prod.Category, prod.ShortDescription, prod.Description,
		prod.Dimensions, prod.Features, prod.PriceStartFrom, prod.ImageURL, prod.VideoURL,
		prod.IsFeatured, prod.IsActive, prod.OrderIndex).Scan(&id)
	if err != nil {
		if isUniqueViolation(err) {
			return "", ErrSlugConflict
		}
		return "", err
	}

	if err := insertVariants(ctx, tx, id, variants); err != nil {
		return "", err
	}
	return id, tx.Commit(ctx)
}

// UpdateProduct replaces product fields and all variants in one transaction.
func (p *Postgres) UpdateProduct(ctx context.Context, id string, prod Product, variants []ProductVariant) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `
		UPDATE products SET slug=$2, name=$3, category=$4, short_description=$5,
			description=$6, dimensions=$7, features=$8, price_start_from=$9,
			image_url=$10, video_url=$11, is_featured=$12, is_active=$13,
			order_index=$14, updated_at=CURRENT_TIMESTAMP
		WHERE id=$1`,
		id, prod.Slug, prod.Name, prod.Category, prod.ShortDescription,
		prod.Description, prod.Dimensions, prod.Features, prod.PriceStartFrom,
		prod.ImageURL, prod.VideoURL, prod.IsFeatured, prod.IsActive, prod.OrderIndex)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrSlugConflict
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrProductNotFound
	}

	// ponytail: replace all variants — simpler than diffing individual changes
	if _, err = tx.Exec(ctx, "DELETE FROM product_variants WHERE product_id = $1", id); err != nil {
		return err
	}
	if err := insertVariants(ctx, tx, id, variants); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

// DeleteProduct removes a product; variants cascade via FK.
func (p *Postgres) DeleteProduct(ctx context.Context, id string) error {
	tag, err := p.pool.Exec(ctx, "DELETE FROM products WHERE id = $1", id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrProductNotFound
	}
	return nil
}

// --- helpers ---

func insertVariants(ctx context.Context, tx pgx.Tx, productID string, variants []ProductVariant) error {
	for _, v := range variants {
		if _, err := tx.Exec(ctx, `
			INSERT INTO product_variants (product_id, name, price, description, order_index)
			VALUES ($1, $2, $3, $4, $5)`,
			productID, v.Name, v.Price, v.Description, v.OrderIndex); err != nil {
			return err
		}
	}
	return nil
}

func scanProduct(row pgx.Row) (Product, error) {
	var prod Product
	err := row.Scan(&prod.ID, &prod.Slug, &prod.Name, &prod.Category,
		&prod.ShortDescription, &prod.Description, &prod.Dimensions,
		&prod.Features, &prod.PriceStartFrom, &prod.ImageURL, &prod.VideoURL,
		&prod.IsFeatured, &prod.IsActive, &prod.OrderIndex,
		&prod.CreatedAt, &prod.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Product{}, ErrProductNotFound
		}
		return Product{}, err
	}
	return prod, nil
}

func collectProducts(rows pgx.Rows) ([]Product, error) {
	var products []Product
	for rows.Next() {
		var prod Product
		if err := rows.Scan(&prod.ID, &prod.Slug, &prod.Name, &prod.Category,
			&prod.ShortDescription, &prod.Description, &prod.Dimensions,
			&prod.Features, &prod.PriceStartFrom, &prod.ImageURL, &prod.VideoURL,
			&prod.IsFeatured, &prod.IsActive, &prod.OrderIndex,
			&prod.CreatedAt, &prod.UpdatedAt); err != nil {
			return nil, err
		}
		products = append(products, prod)
	}
	return products, rows.Err()
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}

package store

import (
	"context"
	"time"
)

type AnalyticsEvent struct {
	EventType   string
	ProductSlug *string
	SourcePath  *string
	Referrer    *string
	UserAgent   *string
}

type AnalyticsProductMetric struct {
	ProductSlug    string `json:"product_slug"`
	ProductViews   int    `json:"product_views"`
	WhatsAppClicks int    `json:"whatsapp_clicks"`
}

type AnalyticsSummary struct {
	Days           int                      `json:"days"`
	WebsiteViews   int                      `json:"website_views"`
	ProductViews   int                      `json:"product_views"`
	WhatsAppClicks int                      `json:"whatsapp_clicks"`
	Products       []AnalyticsProductMetric `json:"products"`
}

func (p *Postgres) TrackAnalyticsEvent(ctx context.Context, event AnalyticsEvent) error {
	_, err := p.pool.Exec(ctx, `
		INSERT INTO analytics_events (event_type, product_slug, source_path, referrer, user_agent)
		VALUES ($1, $2, $3, $4, $5)
	`, event.EventType, event.ProductSlug, event.SourcePath, event.Referrer, event.UserAgent)
	return err
}

func (p *Postgres) AnalyticsSummary(ctx context.Context, days int) (AnalyticsSummary, error) {
	if days < 1 || days > 365 {
		days = 30
	}

	var summary AnalyticsSummary
	summary.Days = days
	err := p.pool.QueryRow(ctx, `
		SELECT
			COUNT(*) FILTER (WHERE event_type = 'website_view')::int,
			COUNT(*) FILTER (WHERE event_type = 'product_view')::int,
			COUNT(*) FILTER (WHERE event_type = 'whatsapp_cta_click')::int
		FROM analytics_events
		WHERE created_at >= $1
	`, time.Now().AddDate(0, 0, -days)).Scan(&summary.WebsiteViews, &summary.ProductViews, &summary.WhatsAppClicks)
	if err != nil {
		return AnalyticsSummary{}, err
	}

	rows, err := p.pool.Query(ctx, `
		SELECT
			product_slug,
			COUNT(*) FILTER (WHERE event_type = 'product_view')::int AS product_views,
			COUNT(*) FILTER (WHERE event_type = 'whatsapp_cta_click')::int AS whatsapp_clicks
		FROM analytics_events
		WHERE created_at >= $1 AND product_slug IS NOT NULL
		GROUP BY product_slug
		ORDER BY product_views DESC, whatsapp_clicks DESC, product_slug
		LIMIT 20
	`, time.Now().AddDate(0, 0, -days))
	if err != nil {
		return AnalyticsSummary{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var metric AnalyticsProductMetric
		if err := rows.Scan(&metric.ProductSlug, &metric.ProductViews, &metric.WhatsAppClicks); err != nil {
			return AnalyticsSummary{}, err
		}
		summary.Products = append(summary.Products, metric)
	}
	if summary.Products == nil {
		summary.Products = []AnalyticsProductMetric{}
	}
	return summary, rows.Err()
}

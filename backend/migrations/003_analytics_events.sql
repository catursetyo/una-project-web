CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(40) NOT NULL CHECK (event_type IN ('website_view', 'product_view', 'whatsapp_cta_click')),
    product_slug VARCHAR(150),
    source_path VARCHAR(255),
    referrer VARCHAR(500),
    user_agent VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_time ON analytics_events(product_slug, created_at DESC);

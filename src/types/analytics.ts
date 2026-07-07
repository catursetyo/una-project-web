export type AnalyticsProductMetric = {
  product_slug: string;
  product_views: number;
  whatsapp_clicks: number;
};

export type AnalyticsSummary = {
  days: number;
  website_views: number;
  product_views: number;
  whatsapp_clicks: number;
  products: AnalyticsProductMetric[];
};

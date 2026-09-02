-- Wave 11 PWA & notifications — extends CRM consent + OMS/Wave 9 events. No second inventory/CRM.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  endpoint_hash TEXT NOT NULL,
  user_agent_class TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  token_server_side_only BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  customer_id TEXT PRIMARY KEY,
  order_notifications BOOLEAN NOT NULL DEFAULT true,
  service_notifications BOOLEAN NOT NULL DEFAULT true,
  warranty_notifications BOOLEAN NOT NULL DEFAULT true,
  restock_notifications BOOLEAN NOT NULL DEFAULT false,
  price_alerts BOOLEAN NOT NULL DEFAULT false,
  firmware_alerts BOOLEAN NOT NULL DEFAULT true,
  marketing_notifications BOOLEAN NOT NULL DEFAULT false,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  analytics_consent BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS restock_alert_subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT,
  locale TEXT NOT NULL,
  country_code TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_alert_subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  target_price_eur NUMERIC,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS push_delivery_events (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  category TEXT NOT NULL,
  channel_class TEXT NOT NULL CHECK (channel_class IN ('transactional','marketing')),
  template_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  suppression_reason TEXT,
  opened BOOLEAN NOT NULL DEFAULT false,
  product_id TEXT REFERENCES products(id),
  order_number TEXT,
  rma_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pwa_install_events (
  id BIGSERIAL PRIMARY KEY,
  customer_id TEXT,
  event_type TEXT NOT NULL,
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cache_invalidation_events (
  id TEXT PRIMARY KEY,
  tags JSONB NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_delivery_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS push_delivery_customer_idx ON push_delivery_events (customer_id);
CREATE INDEX IF NOT EXISTS restock_alert_product_idx ON restock_alert_subscriptions (product_id);

-- Neon Postgres schema for DJI Store EU production
-- Apply once: psql "$DATABASE_URL_UNPOOLED" -f neon/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Catalog ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  model_name TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price_eur NUMERIC(12,2) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  sku TEXT UNIQUE NOT NULL,
  combo_name TEXT NOT NULL,
  price_eur NUMERIC(12,2) NOT NULL,
  weight_grams INT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INT NOT NULL DEFAULT 0,
  included_items JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS inventory_depot_stock (
  variant_id TEXT NOT NULL REFERENCES product_variants(id),
  depot_id TEXT NOT NULL,
  stock_units INT NOT NULL,
  reserved_units INT NOT NULL DEFAULT 0,
  incoming_units INT NOT NULL DEFAULT 0,
  reorder_point INT NOT NULL,
  backorder_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (variant_id, depot_id)
);

-- ── Database-backed asset storage (replaces Supabase Storage / external CDN) ─

CREATE TABLE IF NOT EXISTS db_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  file_name TEXT,
  data BYTEA,
  content_hash TEXT NOT NULL UNIQUE,
  byte_size INT NOT NULL,
  storage_url TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT db_assets_has_payload CHECK (data IS NOT NULL OR storage_url IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS db_assets_hash_idx ON db_assets (content_hash);

CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id),
  role TEXT NOT NULL,
  asset_id UUID REFERENCES db_assets(id),
  source_url TEXT,
  cdn_url TEXT,
  content_hash TEXT NOT NULL,
  format TEXT NOT NULL,
  CONSTRAINT product_media_has_asset CHECK (asset_id IS NOT NULL OR (source_url IS NOT NULL AND cdn_url IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS product_media_asset_idx ON product_media (asset_id);

-- ── Orders & push ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  payment_intent_id TEXT,
  status TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  endpoint_hash TEXT NOT NULL UNIQUE,
  user_agent_class TEXT NOT NULL DEFAULT 'mobile',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  token_server_side_only BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Support attachments: metadata in Neon; binary in Supabase Storage or legacy db_assets BYTEA
CREATE TABLE IF NOT EXISTS support_attachments (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  asset_id UUID NOT NULL REFERENCES db_assets(id),
  virus_scan_status TEXT NOT NULL DEFAULT 'pending',
  retention_until DATE,
  audit_log_id TEXT,
  private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_attachments_asset_idx ON support_attachments (asset_id);

-- ── Email system ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  audience TEXT NOT NULL,
  locale TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  payload JSONB NOT NULL DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_outbox_template_idx ON email_outbox (template_id);
CREATE INDEX IF NOT EXISTS email_outbox_recipient_idx ON email_outbox (recipient);

CREATE TABLE IF NOT EXISTS email_unsubscribe_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  customer_email TEXT PRIMARY KEY,
  customer_id TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  order_updates BOOLEAN NOT NULL DEFAULT TRUE,
  service_updates BOOLEAN NOT NULL DEFAULT TRUE,
  warranty_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  firmware_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  product_restocks BOOLEAN NOT NULL DEFAULT FALSE,
  price_drop_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS restock_alert_subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  locale TEXT NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_email, product_id)
);

CREATE TABLE IF NOT EXISTS price_alert_subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  locale TEXT NOT NULL DEFAULT 'en',
  price_threshold_eur NUMERIC(12,2),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_email, product_id)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  locale TEXT NOT NULL DEFAULT 'en',
  marketing_consent BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS warranty_registrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  serial_number TEXT NOT NULL,
  remote_serial TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rma_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  rma_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  rating INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gdpr_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  request_id TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Authentication (email + password, shared customer/admin login) ───────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS auth_sessions_expires_idx ON auth_sessions (expires_at);

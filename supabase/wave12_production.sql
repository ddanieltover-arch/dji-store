-- Wave 12 — production activation. No duplicate SoR tables.
-- Applies after Waves 1–11 SQL. Ensures publish flag + idempotent orders.

ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS model_name TEXT;

ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS base_price_eur NUMERIC(12,2);

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

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Rollback path: retain Vite prototype; production app in /production
COMMENT ON TABLE orders IS 'Wave 12 OMS orders — idempotent checkout';

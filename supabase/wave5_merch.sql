-- Wave 5 merchandising — commercial layer only. No product/catalog duplication.

CREATE TABLE IF NOT EXISTS merch_ranking_signals (
  product_id TEXT PRIMARY KEY REFERENCES products(id),
  sales_velocity NUMERIC(8,2) NOT NULL,
  conversion_rate NUMERIC(6,3) NOT NULL,
  margin_pct NUMERIC(6,2) NOT NULL,
  search_demand NUMERIC(8,2) NOT NULL,
  wishlist_count INT NOT NULL,
  freshness_days INT NOT NULL,
  manual_priority INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merch_manual_overrides (
  product_id TEXT NOT NULL REFERENCES products(id),
  slot TEXT NOT NULL,
  position INT NOT NULL,
  boost INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, slot)
);

CREATE TABLE IF NOT EXISTS merch_promotions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL,
  product_ids JSONB,
  categories JSONB,
  coupon_code TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  free_shipping_threshold_eur NUMERIC(12,2),
  stackable BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS merch_experiments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  variants JSONB NOT NULL,
  metric TEXT NOT NULL,
  status TEXT NOT NULL,
  rollback_variant_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS merch_price_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id),
  sale_price_eur NUMERIC(12,2) NOT NULL,
  delta_pct NUMERIC(8,2) NOT NULL,
  decision TEXT NOT NULL,
  catalog_diff_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS merch_promotions_active_idx ON merch_promotions (active);

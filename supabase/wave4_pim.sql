-- Wave 4 coverage / governance — no second catalog. FK to products only.

CREATE TABLE IF NOT EXISTS wave4_category_coverage (
  id TEXT PRIMARY KEY,
  store_url TEXT NOT NULL,
  catalog_category TEXT NOT NULL,
  discovery_status TEXT NOT NULL,
  extraction_status TEXT NOT NULL,
  population_status TEXT NOT NULL,
  certification_status TEXT NOT NULL,
  sku_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pending_catalog_records (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  slug TEXT NOT NULL,
  model_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval',
  mapped_product_id TEXT REFERENCES products(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wave4_sku_coverage (
  source_url TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  mapped_product_id TEXT REFERENCES products(id),
  lifecycle TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pending_catalog_status_idx ON pending_catalog_records (status);

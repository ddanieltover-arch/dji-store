-- Wave 1 PIM execution — extends certified schema. No second catalog.
-- Maps 1:1 to DJI_PRODUCTS / ProductVariant / inventory / reviews / firmware / SEO / sync_jobs.

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;

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

CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id),
  role TEXT NOT NULL, -- hero | gallery | cutout | video | spin360
  source_url TEXT NOT NULL,
  cdn_url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  format TEXT NOT NULL -- avif | webp
);

CREATE TABLE IF NOT EXISTS firmware_releases (
  product_id TEXT NOT NULL REFERENCES products(id),
  version TEXT NOT NULL,
  release_date DATE NOT NULL,
  release_notes TEXT,
  PRIMARY KEY (product_id, version)
);

CREATE TABLE IF NOT EXISTS product_seo (
  product_id TEXT NOT NULL REFERENCES products(id),
  locale TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  PRIMARY KEY (product_id, locale)
);

CREATE TABLE IF NOT EXISTS catalog_sync_jobs (
  job_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL DEFAULT 'src-store',
  stage TEXT NOT NULL,
  checkpoint JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS catalog_diffs (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES catalog_sync_jobs(job_id),
  product_id TEXT NOT NULL,
  change_category TEXT NOT NULL,
  field TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  risk_score INT NOT NULL,
  trust_decision TEXT NOT NULL, -- auto-approve | review-required | block
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS pim_queue (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL, -- discovery | extract | media | firmware | seo | inventory
  payload JSONB NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  next_run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dlq BOOLEAN NOT NULL DEFAULT FALSE
);

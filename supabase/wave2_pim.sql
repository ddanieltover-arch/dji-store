-- Wave 2 Official Store acquisition — connector state only.
-- Does NOT create a second products catalog. FK to existing products.

CREATE TABLE IF NOT EXISTS official_store_discovery (
  url TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  discovered_at TIMESTAMPTZ NOT NULL,
  source_hash TEXT NOT NULL,
  mapped_product_id TEXT REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS official_store_extract_checkpoint (
  product_id TEXT PRIMARY KEY REFERENCES products(id),
  source_url TEXT NOT NULL,
  jsonld_hash TEXT NOT NULL,
  extracted_at TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL
);

ALTER TABLE official_store_discovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_store_extract_checkpoint ENABLE ROW LEVEL SECURITY;

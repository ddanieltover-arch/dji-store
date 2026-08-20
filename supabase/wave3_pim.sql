-- Wave 3 enrichment — linked to existing products. No second catalog.

CREATE TABLE IF NOT EXISTS product_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id),
  topic TEXT NOT NULL,
  locale TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_relationships (
  from_product_id TEXT NOT NULL REFERENCES products(id),
  to_product_id TEXT NOT NULL REFERENCES products(id),
  relation_type TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  PRIMARY KEY (from_product_id, to_product_id, relation_type)
);

CREATE TABLE IF NOT EXISTS product_comparisons (
  left_product_id TEXT NOT NULL REFERENCES products(id),
  right_product_id TEXT NOT NULL REFERENCES products(id),
  title TEXT NOT NULL,
  rows JSONB NOT NULL,
  PRIMARY KEY (left_product_id, right_product_id)
);

CREATE TABLE IF NOT EXISTS product_seo_enhancements (
  product_id TEXT NOT NULL REFERENCES products(id),
  locale TEXT NOT NULL,
  long_tail JSONB NOT NULL,
  structured_snippet TEXT NOT NULL,
  comparison_snippet TEXT NOT NULL,
  buying_guide TEXT NOT NULL,
  internal_link_ids JSONB NOT NULL,
  PRIMARY KEY (product_id, locale)
);

CREATE INDEX IF NOT EXISTS product_faqs_product_idx ON product_faqs (product_id);
CREATE INDEX IF NOT EXISTS product_relationships_from_idx ON product_relationships (from_product_id);

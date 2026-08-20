-- Wave 7 lifecycle — extends CRM/CDP. No second customer or loyalty tables as SoR.

CREATE TABLE IF NOT EXISTS lifecycle_transitions (
  id BIGSERIAL PRIMARY KEY,
  customer_id TEXT NOT NULL,
  previous_stage TEXT NOT NULL,
  current_stage TEXT NOT NULL,
  trigger TEXT NOT NULL,
  evidence TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifecycle_messages (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  journey_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  locale TEXT NOT NULL,
  subject TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  suppression_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS lifecycle_messages_fingerprint_queued_uidx
  ON lifecycle_messages (fingerprint)
  WHERE status IN ('queued', 'sent');

CREATE TABLE IF NOT EXISTS lifecycle_ownership (
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  purchase_date DATE,
  warranty_expiry DATE,
  care_plan_status TEXT NOT NULL,
  firmware_status TEXT NOT NULL,
  PRIMARY KEY (customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS lifecycle_churn_scores (
  customer_id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  score INT NOT NULL,
  signals JSONB NOT NULL,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lifecycle_messages_customer_idx ON lifecycle_messages (customer_id);

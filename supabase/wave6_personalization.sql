-- Wave 6 personalization — session/customer signals only. No second catalog.

CREATE TABLE IF NOT EXISTS personalization_sessions (
  session_id TEXT PRIMARY KEY,
  customer_id TEXT,
  locale TEXT NOT NULL,
  country TEXT,
  currency TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS personalization_events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES personalization_sessions(session_id),
  event_type TEXT NOT NULL, -- view | search | wishlist | compare | cart | category
  product_id TEXT REFERENCES products(id),
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS personalization_decisions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  surface TEXT NOT NULL, -- home | plp | pdp | cart | search
  product_id TEXT REFERENCES products(id),
  score NUMERIC(8,2),
  reason TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  source_signal TEXT NOT NULL,
  fallback_behavior TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS personalization_events_session_idx ON personalization_events (session_id);
CREATE INDEX IF NOT EXISTS personalization_decisions_session_idx ON personalization_decisions (session_id);

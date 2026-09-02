-- Wave 9 service — extends Phase 8 warranty/RMA + CRM. No second catalog/CRM/inventory.

CREATE TABLE IF NOT EXISTS product_ownership (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  organization_id TEXT,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT,
  serial_number TEXT NOT NULL,
  order_id TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  delivery_date DATE,
  registration_date DATE,
  warranty_start DATE NOT NULL,
  warranty_end DATE NOT NULL,
  care_plan_id TEXT,
  status TEXT NOT NULL,
  warranty_registration_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_ownership_serial_uidx ON product_ownership (serial_number);

CREATE TABLE IF NOT EXISTS warranty_events (
  id BIGSERIAL PRIMARY KEY,
  ownership_id TEXT NOT NULL REFERENCES product_ownership(id),
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  source_records JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  organization_id TEXT,
  product_id TEXT REFERENCES products(id),
  serial_masked TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_agent_id TEXT,
  first_response_due_at TIMESTAMPTZ NOT NULL,
  escalated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id BIGSERIAL PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_attachments (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  signed_url_expires_at TIMESTAMPTZ NOT NULL,
  virus_scan_status TEXT NOT NULL,
  retention_until DATE NOT NULL,
  audit_log_id TEXT NOT NULL,
  private BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS repair_cases (
  id TEXT PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  ticket_id TEXT REFERENCES support_tickets(id),
  customer_id TEXT NOT NULL,
  organization_id TEXT,
  product_id TEXT NOT NULL REFERENCES products(id),
  serial_masked TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  depot_code TEXT NOT NULL,
  legacy_rma_id TEXT,
  sla_due_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repair_events (
  id BIGSERIAL PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES repair_cases(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repair_parts (
  part_sku TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  warehouse_code TEXT NOT NULL,
  quantity_available INT NOT NULL,
  reserved INT NOT NULL DEFAULT 0,
  incoming INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_knowledge (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  locale TEXT NOT NULL,
  source TEXT NOT NULL,
  version TEXT NOT NULL,
  approval_status TEXT NOT NULL,
  published_at DATE,
  reviewer TEXT,
  body TEXT NOT NULL
);

ALTER TABLE product_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_attachments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS support_tickets_customer_idx ON support_tickets (customer_id);
CREATE INDEX IF NOT EXISTS repair_cases_status_idx ON repair_cases (status);
CREATE INDEX IF NOT EXISTS product_ownership_customer_idx ON product_ownership (customer_id);

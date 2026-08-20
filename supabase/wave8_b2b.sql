-- Wave 8 B2B / enterprise — extends Phase 8. No second catalog, inventory, or CRM.

CREATE TABLE IF NOT EXISTS b2b_organizations (
  id TEXT PRIMARY KEY,
  crm_customer_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  legal_entity TEXT NOT NULL,
  vat_id TEXT NOT NULL,
  registration_number TEXT,
  billing_country TEXT NOT NULL,
  billing_address TEXT,
  pricing_tier TEXT NOT NULL DEFAULT 'standard',
  contract_discount_pct NUMERIC NOT NULL DEFAULT 0,
  account_manager TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_org_memberships (
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('OWNER','ADMIN','PROCUREMENT','FINANCE','OPERATOR','VIEWER')),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS b2b_vat_validations (
  id BIGSERIAL PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  vat_id TEXT NOT NULL,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL,
  reverse_charge_eligible BOOLEAN NOT NULL DEFAULT false,
  never_assume_exemption BOOLEAN NOT NULL DEFAULT true,
  validated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_enterprise_quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  workflow_status TEXT NOT NULL,
  subtotal_net_eur NUMERIC NOT NULL,
  discount_eur NUMERIC NOT NULL,
  vat_eur NUMERIC NOT NULL,
  shipping_eur NUMERIC NOT NULL,
  total_eur NUMERIC NOT NULL,
  approval_level TEXT NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  terms TEXT,
  notes TEXT,
  customer_po_number TEXT,
  delivery_location_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_quote_lines (
  id BIGSERIAL PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES b2b_enterprise_quotes(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_net_eur NUMERIC NOT NULL,
  vat_eur NUMERIC NOT NULL,
  inventory_ok BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS b2b_quote_approvals (
  id BIGSERIAL PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES b2b_enterprise_quotes(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  decided_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS b2b_purchase_orders (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  customer_po_number TEXT NOT NULL,
  quote_id TEXT NOT NULL REFERENCES b2b_enterprise_quotes(id),
  status TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_documents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  doc_type TEXT NOT NULL,
  ref_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_shipping_locations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES b2b_organizations(id),
  label TEXT NOT NULL,
  country_code TEXT NOT NULL,
  city TEXT NOT NULL,
  preferred_depot_code TEXT NOT NULL
);

ALTER TABLE b2b_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_enterprise_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS b2b_quotes_org_idx ON b2b_enterprise_quotes (organization_id);
CREATE INDEX IF NOT EXISTS b2b_memberships_user_idx ON b2b_org_memberships (user_id);

import { B2bCompanyProfile, B2bQuote, Locale, Product, ProductVariant } from './index';

export type OrgRole = 'OWNER' | 'ADMIN' | 'PROCUREMENT' | 'FINANCE' | 'OPERATOR' | 'VIEWER';

export type PricingLayer = 'BASE' | 'CUSTOMER_TIER' | 'CONTRACT' | 'VOLUME' | 'PROMOTION' | 'VAT';

export type QuoteWorkflowStatus =
  | 'request'
  | 'sales_review'
  | 'pricing_approval'
  | 'issued'
  | 'accepted'
  | 'order_created'
  | 'rejected';

export type ApprovalLevel = 'none' | 'manager' | 'finance_executive';

export interface OrganizationAccount {
  id: string;
  crmCustomerId: string;
  companyName: string;
  legalEntity: string;
  vatId: string;
  registrationNumber: string;
  billingCountry: string;
  billingAddress: string;
  shippingLocations: { id: string; label: string; countryCode: string; city: string; preferredDepotCode: string }[];
  primaryContact: string;
  financeContact: string;
  procurementContact: string;
  accountManager: string;
  pricingTier: 'standard' | 'dealer' | 'enterprise';
  contractDiscountPct: number;
  b2bProfile: B2bCompanyProfile;
}

export interface OrgMembership {
  organizationId: string;
  userId: string;
  role: OrgRole;
}

export interface ViesValidationResult {
  vatId: string;
  countryCode: string;
  status: 'valid' | 'invalid' | 'unverified';
  reverseChargeEligible: boolean;
  validatedAt: string;
  companyNameHint?: string;
  neverAssumeExemption: true;
}

export interface VolumeTier {
  minQty: number;
  maxQty: number | null;
  discountPct: number;
  label: string;
}

export interface B2bPriceBreakdown {
  productId: string;
  variantId: string;
  quantity: number;
  baseUnitEur: number;
  tierDiscountPct: number;
  contractDiscountPct: number;
  volumeDiscountPct: number;
  promotionDiscountPct: number;
  unitNetEur: number;
  lineNetEur: number;
  vatRatePct: number;
  vatEur: number;
  lineGrossEur: number;
  layers: PricingLayer[];
  priceDecision: 'auto-approve' | 'review-required' | 'block';
  inventoryOk: boolean;
  availableUnits: number;
}

export interface QuoteLineInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface EnterpriseQuote {
  id: string;
  quoteNumber: string;
  organizationId: string;
  workflowStatus: QuoteWorkflowStatus;
  legacyStatus: B2bQuote['status'];
  items: B2bPriceBreakdown[];
  subtotalNetEur: number;
  discountEur: number;
  vatEur: number;
  shippingEur: number;
  totalEur: number;
  validUntil: string;
  terms: string;
  notes: string;
  customerPoNumber?: string;
  approvalLevelRequired: ApprovalLevel;
  approvals: { role: string; status: 'pending' | 'approved' | 'rejected'; at?: string }[];
  deliveryLocationId?: string;
  createdAt: string;
}

export interface FleetBuilderConfig {
  organizationId: string;
  aircraftProductId: string;
  aircraftQty: number;
  batteriesPerAircraft: number;
  hubs: number;
  controllers: number;
  cases: number;
  carePlans: number;
  deliveryLocationId?: string;
}

export interface FleetBuilderResult {
  lines: QuoteLineInput[];
  equipmentCount: number;
  quote: EnterpriseQuote;
  inventoryWarnings: string[];
}

export interface PurchaseOrderRecord {
  id: string;
  organizationId: string;
  customerPoNumber: string;
  quoteId: string;
  status: 'uploaded' | 'internal_review' | 'finance_review' | 'converted' | 'rejected';
  uploadedAt: string;
}

export interface EnterpriseDocument {
  id: string;
  organizationId: string;
  type: 'quote' | 'proforma' | 'vat_invoice' | 'purchase_order' | 'packing_list' | 'delivery_note';
  refId: string;
  title: string;
  createdAt: string;
}

export interface AiEnterpriseRecommendation {
  id: string;
  question: string;
  answer: string;
  dataSources: string[];
  confidence: number;
  proposedAction: string;
  requiresApproval: boolean;
}

export interface EnterpriseAnalytics {
  b2bRevenueEur: number;
  pipelineValueEur: number;
  quoteConversionPct: number;
  averageContractValueEur: number;
  averageOrderValueEur: number;
  volumeDiscountPctAvg: number;
  salesCycleDays: number;
  accountGrowthPct: number;
  repeatEnterprisePct: number;
}

export interface Wave8Certification {
  organizationIsolationPct: number;
  pricingAccuracyPct: number;
  vatValidationIntegrityPct: number;
  quoteCalculationAccuracyPct: number;
  inventoryValidationPct: number;
  approvalCoveragePct: number;
  unauthorizedAccessAttempts: number;
  certified: boolean;
}

export interface Wave8EnterpriseBundle {
  organizations: OrganizationAccount[];
  memberships: OrgMembership[];
  quotes: EnterpriseQuote[];
  fleetSample: FleetBuilderResult;
  purchaseOrders: PurchaseOrderRecord[];
  documents: EnterpriseDocument[];
  analytics: EnterpriseAnalytics;
  ai: AiEnterpriseRecommendation[];
  certification: Wave8Certification;
}

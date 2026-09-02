import { DjiCarePlan, Locale, ReturnRequest, WarrantyRegistration } from './index';

export type OwnershipStatus = 'active' | 'warranty_expired' | 'returned' | 'replaced' | 'transferred';

export type SerialVerificationOutcome =
  | 'verified'
  | 'already_registered'
  | 'order_mismatch'
  | 'invalid'
  | 'needs_manual_review';

export type WarrantyEvalStatus = 'active' | 'expiring_soon' | 'expired' | 'pending_verification' | 'not_eligible';

export type SupportTicketCategory =
  | 'product_question'
  | 'technical_issue'
  | 'firmware_issue'
  | 'compatibility_question'
  | 'battery_issue'
  | 'controller_issue'
  | 'camera_issue'
  | 'transmission_issue'
  | 'warranty_question'
  | 'care_plan_question';

export type SupportTicketStatus =
  | 'open'
  | 'triaged'
  | 'in_progress'
  | 'waiting_customer'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type SupportPriority = 'low' | 'normal' | 'high' | 'critical';

export type RepairRmaCategory =
  | 'warranty_repair'
  | 'warranty_replacement'
  | 'doa'
  | 'physical_damage'
  | 'accidental_damage'
  | 'care_claim'
  | 'out_of_warranty_repair';

export type ExtendedRmaStatus =
  | 'requested'
  | 'eligibility_review'
  | 'approved'
  | 'label_created'
  | 'in_transit'
  | 'received'
  | 'inspection'
  | 'repair'
  | 'replacement'
  | 'ready_to_ship'
  | 'shipped'
  | 'completed'
  | 'rejected';

export type KnowledgeContentType =
  | 'product_guide'
  | 'troubleshooting'
  | 'warranty_policy'
  | 'care_documentation'
  | 'firmware_notes'
  | 'compatibility_guide'
  | 'faq'
  | 'internal_sop';

export type ServiceRole =
  | 'support_agent'
  | 'senior_support_agent'
  | 'technical_specialist'
  | 'warranty_manager'
  | 'service_manager'
  | 'enterprise_service_manager';

export interface ProductOwnership {
  id: string;
  customerId?: string;
  organizationId?: string;
  productId: string;
  variantId?: string;
  serialNumber: string;
  orderId: string;
  purchaseDate: string;
  deliveryDate?: string;
  registrationDate?: string;
  warrantyStart: string;
  warrantyEnd: string;
  carePlanId?: string;
  status: OwnershipStatus;
  /** Linked Phase 8 warranty registration id when present */
  warrantyRegistrationId?: string;
}

export interface SerialVerificationResult {
  outcome: SerialVerificationOutcome;
  serialMasked: string;
  productId?: string;
  orderId?: string;
  ownershipId?: string;
  reason: string;
  sourceRecords: string[];
}

export interface WarrantyEvaluation {
  status: WarrantyEvalStatus;
  warrantyStart: string;
  warrantyEnd: string;
  daysRemaining: number;
  eligible: boolean;
  reason: string;
  sourceRecords: string[];
}

export interface CarePlanView {
  plan: DjiCarePlan;
  eligible: boolean;
  renewalStatus: 'active' | 'expiring_soon' | 'expired' | 'not_enrolled';
  coverageType: string;
  remainingClaims: number;
  reason: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  organizationId?: string;
  productId?: string;
  serialNumber?: string;
  category: SupportTicketCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  firstResponseDueAt: string;
  escalated: boolean;
}

export interface TroubleshootingStep {
  id: string;
  title: string;
  instruction: string;
  knowledgeArticleId: string;
}

export interface TroubleshootingFlow {
  id: string;
  symptom: string;
  productId?: string;
  steps: TroubleshootingStep[];
  suggestedResolution: string;
  escalateIfUnresolved: boolean;
  sources: string[];
}

export interface FirmwareSupportView {
  productId: string;
  installedVersion: string | 'unknown';
  latestKnownVersion?: string;
  releaseDate?: string;
  compatibilityNotes?: string;
  releaseNotes?: string;
  outdatedClaimed: false | true;
  reason: string;
  sources: string[];
}

export interface RepairCase {
  id: string;
  caseNumber: string;
  ticketId?: string;
  customerId: string;
  organizationId?: string;
  productId: string;
  serialNumber: string;
  category: RepairRmaCategory;
  status: ExtendedRmaStatus;
  priority: SupportPriority;
  warrantyEval: WarrantyEvaluation;
  legacyRmaId?: string;
  depotCode: string;
  slaDueAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairPartStock {
  partSku: string;
  productId: string;
  compatibleProductIds: string[];
  quantityAvailable: number;
  reserved: number;
  incoming: number;
  warehouseCode: string;
}

export interface ServiceAttachment {
  id: string;
  ownerType: 'ticket' | 'rma' | 'ownership';
  ownerId: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
  signedUrlExpiresAt: string;
  virusScanStatus: 'pending' | 'clean' | 'rejected';
  retentionUntil: string;
  auditLogId: string;
  private: true;
}

export interface KnowledgeArticle {
  id: string;
  type: KnowledgeContentType;
  title: string;
  locale: Locale;
  source: string;
  version: string;
  approvalStatus: 'draft' | 'pending_review' | 'approved' | 'published';
  publishedAt?: string;
  reviewer?: string;
  body: string;
  productIds?: string[];
}

export interface AiSupportRecommendation {
  id: string;
  question: string;
  answer: string;
  sourceDocuments: string[];
  confidence: number;
  recommendedAction: string;
  escalationRequired: boolean;
  unsupportedClaimRate: 0;
  highRiskRequiresHumanApproval: true;
}

export interface ServiceAnalytics {
  openTickets: number;
  firstResponseHoursAvg: number;
  resolutionHoursAvg: number;
  rmaRatePct: number;
  repairRatePct: number;
  replacementRatePct: number;
  warrantyClaimRatePct: number;
  customerSatisfaction: number;
  repeatIssueRatePct: number;
  topFailureCategories: { category: string; count: number }[];
  productSupportVolume: { productId: string; tickets: number }[];
}

export interface ProductQualitySignal {
  productId: string;
  signal:
    | 'high_support_volume'
    | 'repeated_failure'
    | 'firmware_related'
    | 'accessory_compatibility'
    | 'recurring_complaint';
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  altersOfficialSpecs: false;
}

export interface ServiceToSalesHint {
  customerId: string;
  trigger: string;
  action: string;
  productId?: string;
  consentRequired: true;
  marketingConsent: boolean;
  allowed: boolean;
}

export interface Wave9Certification {
  ownershipAccuracyPct: number;
  warrantyCalculationAccuracyPct: number;
  unauthorizedServiceDataAccess: number;
  rmaStateIntegrityPct: number;
  inventoryPartConsistencyPct: number;
  supportSlaTrackingAccuracyPct: number;
  aiUnsupportedClaimRate: number;
  localizationCoveragePct: number;
  consentViolations: number;
  certified: boolean;
}

export interface Wave9ServiceBundle {
  ownership: ProductOwnership[];
  warranties: WarrantyRegistration[];
  careViews: CarePlanView[];
  tickets: SupportTicket[];
  troubleshooting: TroubleshootingFlow[];
  firmware: FirmwareSupportView[];
  repairCases: RepairCase[];
  parts: RepairPartStock[];
  attachments: ServiceAttachment[];
  knowledge: KnowledgeArticle[];
  analytics: ServiceAnalytics;
  qualitySignals: ProductQualitySignal[];
  serviceToSales: ServiceToSalesHint[];
  ai: AiSupportRecommendation[];
  fleetByOrg: Record<string, ProductOwnership[]>;
  certification: Wave9Certification;
}

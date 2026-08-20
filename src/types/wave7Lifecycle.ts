import { Locale, LoyaltyTier, CustomerProfile } from './index';

export type LifecycleStage =
  | 'VISITOR'
  | 'ENGAGED_VISITOR'
  | 'LEAD'
  | 'FIRST_TIME_CUSTOMER'
  | 'ACTIVE_CUSTOMER'
  | 'REPEAT_CUSTOMER'
  | 'PROFESSIONAL_CUSTOMER'
  | 'VIP_ENTERPRISE'
  | 'AT_RISK'
  | 'DORMANT'
  | 'REACTIVATED';

export type LifecycleChannel = 'email' | 'sms' | 'push' | 'in_site';

export type ChurnRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LifecycleTransition {
  customerId: string;
  previousStage: LifecycleStage;
  currentStage: LifecycleStage;
  trigger: string;
  evidence: string;
  timestamp: string;
}

export interface OnboardingStep {
  day: 0 | 1 | 3 | 7 | 14 | 30;
  key: string;
  title: string;
  templateKey: string;
}

export interface OwnedProductJourney {
  customerId: string;
  productId: string;
  productSlug: string;
  modelName: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  carePlanStatus: 'none' | 'eligible' | 'active' | 'expiring';
  compatibleAccessoryIds: string[];
  recommendedAccessoryIds: string[];
  firmwareStatus: 'current' | 'update_available' | 'unknown';
  lifecycleHint: string;
}

export interface CareWarrantyEvent {
  id: string;
  customerId: string;
  productId: string;
  type: 'warranty_expiry' | 'care_expiry' | 'care_eligible' | 'registration_incomplete' | 'firmware_update';
  dueDate: string;
  locale: Locale;
  channel: LifecycleChannel;
}

export interface ReplenishmentHint {
  customerId: string;
  accessoryId: string;
  reason: string;
  intervalDays?: number;
  inventoryAvailable: boolean;
  officialIntervalKnown: boolean;
}

export interface ChurnScore {
  customerId: string;
  level: ChurnRiskLevel;
  score: number;
  signals: { factor: string; weight: number; note: string }[];
}

export interface ConsentGateResult {
  allowed: boolean;
  reason: string;
  channel: LifecycleChannel;
}

export interface LifecycleMessage {
  id: string;
  customerId: string;
  journeyKey: string;
  channel: LifecycleChannel;
  locale: Locale;
  subject: string;
  fingerprint: string;
  scheduledFor: string;
  status: 'queued' | 'suppressed' | 'sent' | 'failed';
  suppressionReason?: string;
}

export interface ReferralAttribution {
  referralId: string;
  referrerCustomerId: string;
  referredEmail: string;
  campaign: string;
  status: 'invited' | 'registered' | 'ordered' | 'rewarded';
  rewardPoints: number;
}

export interface LoyaltyProgressView {
  customerId: string;
  tier: LoyaltyTier;
  points: number;
  lifetimePoints: number;
  nextTier?: LoyaltyTier;
  progressPct: number;
  availableRewards: number;
}

export interface AttributionMetrics {
  campaignRevenueEur: number;
  influencedRevenueEur: number;
  repeatPurchaseRatePct: number;
  accessoryAttachmentPct: number;
  retentionPct: number;
  churnReductionPct: number;
  loyaltyRevenueEur: number;
  referralRevenueEur: number;
  causationClaimed: false;
}

export interface AiLifecycleRecommendation {
  id: string;
  question: string;
  answer: string;
  dataSources: string[];
  metrics: Record<string, number | string>;
  confidence: number;
  proposedAction: string;
  requiresApproval: boolean;
}

export interface Wave7Certification {
  lifecycleTransitionIntegrityPct: number;
  consentViolations: number;
  duplicateCampaignSends: number;
  productOwnershipAccuracyPct: number;
  localizationCoveragePct: number;
  loyaltyIntegrationIntegrityPct: number;
  revenueAttributionIntegrityPct: number;
  certified: boolean;
}

export interface Wave7LifecycleBundle {
  transitions: LifecycleTransition[];
  onboarding: OnboardingStep[];
  ownership: OwnedProductJourney[];
  careEvents: CareWarrantyEvent[];
  replenishment: ReplenishmentHint[];
  churn: ChurnScore[];
  messages: LifecycleMessage[];
  loyalty: LoyaltyProgressView[];
  referrals: ReferralAttribution[];
  attribution: AttributionMetrics;
  ai: AiLifecycleRecommendation[];
  certification: Wave7Certification;
  customers: CustomerProfile[];
}

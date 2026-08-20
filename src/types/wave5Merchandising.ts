import { Product } from './index';

export type MerchSlot =
  | 'featured'
  | 'new_releases'
  | 'best_sellers'
  | 'trending'
  | 'seasonal'
  | 'ai_ranked';

export type PromotionType =
  | 'percent'
  | 'fixed'
  | 'bundle'
  | 'free_shipping'
  | 'seasonal'
  | 'product'
  | 'category'
  | 'coupon';

export type PriceDecision = 'auto-approve' | 'review-required' | 'block';

export interface ProductCommerceSignals {
  productId: string;
  salesVelocity: number;
  conversionRate: number;
  marginPct: number;
  inventoryUnits: number;
  incomingUnits: number;
  searchDemand: number;
  wishlistCount: number;
  freshnessDays: number;
  manualPriority: number;
  restricted: boolean;
}

export interface RankingReason {
  factor: string;
  weight: number;
  contribution: number;
  note: string;
}

export interface RankedProduct {
  productId: string;
  score: number;
  reasons: RankingReason[];
  slotHints: MerchSlot[];
}

export interface HomepageMerchPlan {
  featured: string[];
  newReleases: string[];
  bestSellers: string[];
  trending: string[];
  seasonal: string[];
  aiRanked: string[];
  manualOverrides: { productId: string; position: number; slot: MerchSlot }[];
}

export interface PriceProposal {
  productId: string;
  basePriceEur: number;
  salePriceEur: number;
  compareAtPriceEur?: number;
  marginPct: number;
  deltaPct: number;
  decision: PriceDecision;
  reason: string;
}

export interface PromotionCampaign {
  id: string;
  name: string;
  type: PromotionType;
  value: number;
  productIds?: string[];
  categories?: Product['category'][];
  couponCode?: string;
  startsAt: string;
  endsAt: string;
  freeShippingThresholdEur?: number;
  stackable: boolean;
  active: boolean;
}

export interface PromotionConflict {
  campaignA: string;
  campaignB: string;
  reason: string;
}

export interface AppliedPromotion {
  campaignId: string;
  discountEur: number;
  freeShipping: boolean;
}

export interface MerchBundle {
  id: string;
  title: string;
  kind: 'fbt' | 'essential' | 'professional' | 'travel' | 'care' | 'battery';
  productId: string;
  accessoryIds: string[];
  discountEur: number;
  attachmentScore: number;
}

export interface InventoryMerchFlag {
  productId: string;
  available: boolean;
  lowStock: boolean;
  overstock: boolean;
  promote: boolean;
  reason: string;
}

export interface AbExperiment {
  id: string;
  name: string;
  variants: { id: string; weight: number; description: string }[];
  metric: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  rollbackVariantId: string;
}

export interface AbAssignment {
  experimentId: string;
  variantId: string;
  subjectKey: string;
}

export interface AiMerchRecommendation {
  id: string;
  question: string;
  answer: string;
  metrics: Record<string, number | string>;
  confidence: number;
  proposedAction: string;
  requiresApproval: boolean;
}

export interface ExecutiveMerchKpis {
  revenueEur: number;
  conversionPct: number;
  aovEur: number;
  grossMarginPct: number;
  productVelocity: number;
  bundleAttachmentPct: number;
  recommendationConversionPct: number;
  inventoryEfficiencyPct: number;
  promotionLiftPct: number;
  categoryPerformance: { category: string; revenueEur: number; conversionPct: number }[];
}

export interface Wave5Certification {
  pricingConflicts: number;
  promotionErrors: number;
  merchandisingCoveragePct: number;
  recommendationIntegrityPct: number;
  highRiskApprovalCoveragePct: number;
  certified: boolean;
}

export interface Wave5MerchBundle {
  homepage: HomepageMerchPlan;
  rankings: RankedProduct[];
  priceProposals: PriceProposal[];
  promotions: PromotionCampaign[];
  conflicts: PromotionConflict[];
  bundles: MerchBundle[];
  inventoryFlags: InventoryMerchFlag[];
  experiments: AbExperiment[];
  aiRecommendations: AiMerchRecommendation[];
  kpis: ExecutiveMerchKpis;
  certification: Wave5Certification;
}

import { Locale, LoyaltyTier, Product } from './index';

export interface PersonalizationContext {
  sessionId: string;
  customerId?: string;
  locale: Locale;
  country?: string;
  currency?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  viewedProducts: string[];
  searchedTerms: string[];
  cartProductIds: string[];
  wishlistProductIds: string[];
  compareProductIds: string[];
  ownedProductIds: string[];
  loyaltyTier?: LoyaltyTier;
  categoriesVisited?: string[];
}

export type PersonalizationIntent =
  | 'beginner'
  | 'travel'
  | 'creator'
  | 'professional'
  | 'enterprise'
  | 'fpv'
  | 'general';

export interface ExplainableDecision {
  productId: string;
  score: number;
  reason: string;
  confidence: number;
  sourceSignal: string;
  fallbackBehavior: string;
}

export type HomepagePersonalizedSlot =
  | 'hero'
  | 'featured'
  | 'trending'
  | 'recommended_for_you'
  | 'recently_viewed'
  | 'continue_exploring'
  | 'accessories_for_setup'
  | 'upgrade_path';

export interface PersonalizedHomepage {
  slots: Record<HomepagePersonalizedSlot, ExplainableDecision[]>;
  intent: PersonalizationIntent;
  localeSuggestion?: { locale: Locale; country: string; reason: string };
}

export interface PersonalizedPlpOrdering {
  productIds: string[];
  decisions: ExplainableDecision[];
  preservedManualOverrides: boolean;
  seoSafe: true;
}

export interface PersonalizedPdpModules {
  productId: string;
  accessories: ExplainableDecision[];
  upgrades: ExplainableDecision[];
  alternatives: ExplainableDecision[];
  care: ExplainableDecision[];
  recentlyViewed: ExplainableDecision[];
  bundles: ExplainableDecision[];
}

export interface PersonalizedCartSuggestions {
  accessories: ExplainableDecision[];
  missingEssentials: ExplainableDecision[];
  carePlans: ExplainableDecision[];
  upgrades: ExplainableDecision[];
  shippingNudge?: string;
}

export interface DepotPreference {
  country: string;
  preferredDepotId: string;
  preferredDepotCode: string;
  reason: string;
}

export interface PersonalizedSearchResult {
  productIds: string[];
  exactMatch: boolean;
  boosts: ExplainableDecision[];
}

export interface PersonalizedContentModule {
  id: string;
  title: string;
  intent: PersonalizationIntent;
  body: string;
  relatedProductIds: string[];
}

export interface LocaleSuggestion {
  detectedCountry?: string;
  suggestedLocale: Locale;
  suggestedCurrency: string;
  reason: string;
  forceRedirect: false;
}

export interface Wave6Certification {
  explainabilityCoveragePct: number;
  recommendationIntegrityPct: number;
  unavailableFilteredPct: number;
  exactSearchPriority: boolean;
  localeSuggestionNonForced: boolean;
  catalogFactsOnly: boolean;
  certified: boolean;
}

export interface Wave6PersonalizationBundle {
  context: PersonalizationContext;
  intent: PersonalizationIntent;
  homepage: PersonalizedHomepage;
  plp: PersonalizedPlpOrdering;
  pdpSample: PersonalizedPdpModules;
  cart: PersonalizedCartSuggestions;
  depot: DepotPreference;
  searchSample: PersonalizedSearchResult;
  content: PersonalizedContentModule;
  localeSuggestion: LocaleSuggestion;
  certification: Wave6Certification;
}

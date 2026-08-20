import { PersonalizationContext, PersonalizedContentModule, PersonalizationIntent } from '../types/wave6Personalization';
import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE6_DEMO_CONTEXTS: Record<string, PersonalizationContext> = {
  anonymousMini: {
    sessionId: 'sess-anon-mini-01',
    locale: 'en',
    country: 'DE',
    currency: 'EUR',
    deviceType: 'desktop',
    viewedProducts: ['prod-mini-4-pro', 'prod-mini-4k', 'prod-neo'],
    searchedTerms: ['lightweight', 'c0', 'mini'],
    cartProductIds: [],
    wishlistProductIds: ['prod-mini-4-pro'],
    compareProductIds: ['prod-mini-4-pro', 'prod-air-3s'],
    ownedProductIds: [],
    categoriesVisited: ['camera-drones']
  },
  returningOwner: {
    sessionId: 'sess-owner-01',
    customerId: 'cust-eu-4421',
    locale: 'de',
    country: 'DE',
    currency: 'EUR',
    deviceType: 'mobile',
    viewedProducts: ['acc-bat-m4p'],
    searchedTerms: ['battery', 'nd filter'],
    cartProductIds: [],
    wishlistProductIds: [],
    compareProductIds: [],
    ownedProductIds: ['prod-mavic-4-pro'],
    loyaltyTier: 'professional',
    categoriesVisited: ['accessories']
  },
  creatorFr: {
    sessionId: 'sess-creator-fr',
    locale: 'fr',
    country: 'FR',
    currency: 'EUR',
    viewedProducts: ['prod-osmo-pocket-3', 'prod-mic-2'],
    searchedTerms: ['pocket', 'vlog'],
    cartProductIds: ['prod-osmo-pocket-3'],
    wishlistProductIds: [],
    compareProductIds: [],
    ownedProductIds: [],
    categoriesVisited: ['handheld']
  }
};

export const WAVE6_CONTENT_GUIDES: Omit<PersonalizedContentModule, 'relatedProductIds'>[] = [
  {
    id: 'guide-beginner',
    title: 'Beginner Guide',
    intent: 'beginner',
    body: 'Start with C0 / sub-249g aircraft from the official catalog — Mini, Neo, and Flip series for EU Open Category A1.'
  },
  {
    id: 'guide-travel',
    title: 'Travel Guide',
    intent: 'travel',
    body: 'Travel-ready Mini and Air models with compact combos mapped from store.dji.com for European holidays.'
  },
  {
    id: 'guide-creator',
    title: 'Creator Guide',
    intent: 'creator',
    body: 'Osmo Pocket, Action, Mobile, and Mic kits for creators — facts from existing DJI_PRODUCTS specifications.'
  },
  {
    id: 'guide-pro',
    title: 'Professional Guide',
    intent: 'professional',
    body: 'Mavic and Inspire cinema workflows with official variants and Care plans from the certified catalog.'
  },
  {
    id: 'guide-enterprise',
    title: 'Commercial / Enterprise Guide',
    intent: 'enterprise',
    body: 'Matrice, Agras, and Dock platforms for EU B2B operations — enterprise category mapping only.'
  },
  {
    id: 'guide-fpv',
    title: 'FPV Guide',
    intent: 'fpv',
    body: 'Avata, Goggles, and Motion Controller combos for immersive flight using catalog-compatible accessories.'
  }
];

export const WAVE6_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W6-R0',
    window: 'T-36h',
    action: 'Apply supabase/wave6_personalization.sql; wire session signal capture (views/search)',
    owner: 'Platform',
    gate: 'SQL migrate green'
  },
  {
    id: 'W6-R1',
    window: 'T-24h',
    action: 'Enable anonymous personalization (session) on homepage + PLP Featured',
    owner: 'Experience',
    gate: 'explainability ≥ 95%'
  },
  {
    id: 'W6-R2',
    window: 'T-16h',
    action: 'Returning-customer ownership signals → accessories/care (Wave 3 inputs)',
    owner: 'CRM',
    gate: 'recommendationIntegrity ≥ 95%'
  },
  {
    id: 'W6-R3',
    window: 'T-10h',
    action: 'Locale/country suggestions (non-forced) + FRA/AMS/CDG depot preference',
    owner: 'Localization',
    gate: 'forceRedirect = false'
  },
  {
    id: 'W6-R4',
    window: 'T-6h',
    action: 'Personalized search (exact match first) + cart essentials/shipping nudge',
    owner: 'Conversion',
    gate: 'exactSearchPriority true'
  },
  {
    id: 'W6-R5',
    window: 'T-2h',
    action: 'Content guides by intent; PDP modules enrich Wave 3 without replacing them',
    owner: 'Merch',
    gate: 'catalogFactsOnly'
  },
  {
    id: 'W6-R6',
    window: 'T0',
    action: 'Certify Wave 6; publish Personalization workstation under Ops',
    owner: 'Launch Commander',
    gate: 'all Wave 6 floors green'
  }
];

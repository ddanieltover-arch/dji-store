import { AbExperiment, ProductCommerceSignals, PromotionCampaign } from '../types/wave5Merchandising';
import { Wave1RolloutStep } from '../types/wave1Execution';
import { MerchSlot } from '../types/wave5Merchandising';

export const WAVE5_MANUAL_OVERRIDES: { productId: string; position: number; slot: MerchSlot; boost: number }[] = [
  { productId: 'prod-osmo-action-5-pro', position: 1, slot: 'featured', boost: 96 },
  { productId: 'prod-rs-4-mini', position: 2, slot: 'featured', boost: 92 },
  { productId: 'prod-osmo-action-4', position: 3, slot: 'featured', boost: 88 },
  { productId: 'prod-power-500', position: 4, slot: 'seasonal', boost: 85 },
  { productId: 'prod-mavic-4-pro', position: 5, slot: 'featured', boost: 95 },
  { productId: 'prod-air-3s', position: 6, slot: 'featured', boost: 80 },
  { productId: 'prod-mini-4-pro', position: 7, slot: 'seasonal', boost: 70 }
];

export const WAVE5_SIGNAL_OVERRIDES: Partial<Record<string, Partial<ProductCommerceSignals>>> = {
  'prod-mavic-4-pro': { salesVelocity: 98, conversionRate: 5.1, searchDemand: 96, manualPriority: 95 },
  'prod-air-3s': { salesVelocity: 94, conversionRate: 4.9, searchDemand: 90, manualPriority: 80 },
  'prod-neo': { freshnessDays: 10, wishlistCount: 210, salesVelocity: 88 }
};

export const WAVE5_PROMOTIONS: PromotionCampaign[] = [
  {
    id: 'promo-eu-shipping',
    name: 'Free EU Shipping €149+',
    type: 'free_shipping',
    value: 0,
    freeShippingThresholdEur: 149,
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-12-31T23:59:59Z',
    stackable: true,
    active: true
  },
  {
    id: 'promo-summer-drone',
    name: 'Summer Camera Drone −5%',
    type: 'percent',
    value: 5,
    categories: ['camera-drones'],
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-09-15T23:59:59Z',
    stackable: true,
    active: true
  },
  {
    id: 'promo-bundle-fbt',
    name: 'FBT Bundle Save €50',
    type: 'bundle',
    value: 50,
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-12-31T23:59:59Z',
    stackable: true,
    active: true
  },
  {
    id: 'promo-coupon-fly10',
    name: 'Coupon FLYEU10',
    type: 'coupon',
    value: 10,
    couponCode: 'FLYEU10',
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-10-31T23:59:59Z',
    stackable: false,
    active: true
  },
  {
    id: 'promo-neo-fixed',
    name: 'Neo Launch −€20',
    type: 'product',
    value: 20,
    productIds: ['prod-neo'],
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-09-30T23:59:59Z',
    stackable: true,
    active: true
  },
  {
    id: 'promo-conflict-b',
    name: 'Duplicate Coupon Trap (inactive in production set)',
    type: 'coupon',
    value: 15,
    couponCode: 'FLYEU10',
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-10-31T23:59:59Z',
    stackable: false,
    active: true
  }
];

export const WAVE5_EXPERIMENTS: AbExperiment[] = [
  {
    id: 'exp-home-hero',
    name: 'Homepage hero product',
    variants: [
      { id: 'control', weight: 50, description: 'Mavic 4 Pro hero' },
      { id: 'variant-air', weight: 50, description: 'Air 3S hero' }
    ],
    metric: 'homepage_ctr',
    status: 'running',
    rollbackVariantId: 'control'
  },
  {
    id: 'exp-cta-copy',
    name: 'PDP sticky CTA copy',
    variants: [
      { id: 'control', weight: 50, description: 'Add to Bag' },
      { id: 'variant-fly', weight: 50, description: 'Start Flying Today' }
    ],
    metric: 'add_to_cart_rate',
    status: 'running',
    rollbackVariantId: 'control'
  },
  {
    id: 'exp-bundle-config',
    name: 'FBT discount amount',
    variants: [
      { id: 'control', weight: 50, description: '€50 off' },
      { id: 'variant-40', weight: 50, description: '€40 off' }
    ],
    metric: 'bundle_attachment',
    status: 'draft',
    rollbackVariantId: 'control'
  }
];

export const WAVE5_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W5-R0',
    window: 'T-48h',
    action: 'Apply supabase/wave5_merch.sql; seed commerce signals from analytics',
    owner: 'Platform',
    gate: 'SQL migrate green'
  },
  {
    id: 'W5-R1',
    window: 'T-36h',
    action: 'Enable ranking engine + homepage/PLP merch slots (manual overrides honored)',
    owner: 'Merch',
    gate: 'merchandisingCoverage ≥ 95%'
  },
  {
    id: 'W5-R2',
    window: 'T-24h',
    action: 'Wire pricing proposals through existing catalog_diffs; extreme moves blocked',
    owner: 'Pricing',
    gate: '100% high-risk approval coverage'
  },
  {
    id: 'W5-R3',
    window: 'T-16h',
    action: 'Activate stackable promotions; conflict detector must report zero conflicts',
    owner: 'Growth',
    gate: '0 pricing/promo conflicts'
  },
  {
    id: 'W5-R4',
    window: 'T-8h',
    action: 'Bundle optimization from Wave 3 relationships on PDP/cart',
    owner: 'Conversion',
    gate: 'recommendationIntegrity ≥ 95%'
  },
  {
    id: 'W5-R5',
    window: 'T-4h',
    action: 'Start A/B experiments (hero, CTA, bundles) with rollback variants',
    owner: 'Growth',
    gate: 'assignments deterministic'
  },
  {
    id: 'W5-R6',
    window: 'T0',
    action: 'Certify Wave 5; publish Merchandising workstation to Ops',
    owner: 'Launch Commander',
    gate: 'all Wave 5 floors green + tests pass'
  }
];

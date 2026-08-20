import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE5_EXPERIMENTS, WAVE5_PROMOTIONS } from '../../data/wave5MerchandisingData';
import {
  applyBestPromotion,
  assignAbVariant,
  buildOptimizedBundles,
  calculatePromotionDiscount,
  detectPromotionConflicts,
  inventoryAwareFlags,
  proposePriceChange,
  rankCatalog,
  rankCategory,
  runWave5Merchandising,
  buildCommerceSignals,
  urgencyMessage
} from './wave5Merchandising';
import { initializeInventoryFromCatalog } from '../pim/wave1Execution';

describe('Wave 5 merchandising & conversion', () => {
  const bundle = runWave5Merchandising(DJI_PRODUCTS);
  const inventory = initializeInventoryFromCatalog(DJI_PRODUCTS);
  const signals = buildCommerceSignals(DJI_PRODUCTS, inventory);

  it('ranks products with explainable scores; Mavic 4 Pro near the top', () => {
    const rankings = rankCatalog(signals);
    expect(rankings.length).toBe(DJI_PRODUCTS.length);
    expect(rankings[0].reasons.length).toBeGreaterThanOrEqual(6);
    expect(rankings.some((r) => r.productId === 'prod-mavic-4-pro' && r.score >= rankings[5].score)).toBe(true);
    const cat = rankCategory(DJI_PRODUCTS, 'camera-drones', rankings);
    expect(cat.every((r) => DJI_PRODUCTS.find((p) => p.id === r.productId)?.category === 'camera-drones')).toBe(true);
  });

  it('blocks extreme price moves and requires approval for mid moves', () => {
    const p = DJI_PRODUCTS.find((x) => x.id === 'prod-air-3s')!;
    expect(proposePriceChange(p, Math.round(p.basePriceEur * 0.5), 20).decision).toBe('block');
    expect(proposePriceChange(p, Math.round(p.basePriceEur * 0.8), 20).decision).toBe('review-required');
    expect(proposePriceChange(p, p.basePriceEur, 20).decision).toBe('auto-approve');
    expect(proposePriceChange(p, p.basePriceEur * 0.95, 8).decision).toBe('block');
  });

  it('detects promotion conflicts and calculates discounts without errors', () => {
    const conflicts = detectPromotionConflicts(WAVE5_PROMOTIONS);
    expect(conflicts.some((c) => c.reason.includes('coupon'))).toBe(true);
    expect(detectPromotionConflicts(WAVE5_PROMOTIONS.filter((p) => p.id !== 'promo-conflict-b'))).toHaveLength(0);
    const percent = WAVE5_PROMOTIONS.find((p) => p.id === 'promo-summer-drone')!;
    expect(calculatePromotionDiscount(1000, percent)).toBe(950);
    expect(calculatePromotionDiscount(200, WAVE5_PROMOTIONS.find((p) => p.id === 'promo-bundle-fbt')!)).toBe(150);
    expect(() => calculatePromotionDiscount(100, { ...percent, value: 150 })).toThrow();
  });

  it('applies best eligible promotion and free-shipping threshold', () => {
    const ok = applyBestPromotion(
      200,
      ['prod-neo'],
      ['camera-drones'],
      WAVE5_PROMOTIONS.filter((p) => p.id !== 'promo-conflict-b'),
      'FLYEU10'
    );
    expect('error' in ok).toBe(false);
    if (!('error' in ok)) {
      expect(ok.discountEur).toBeGreaterThan(0);
    }
    const ship = applyBestPromotion(160, ['prod-neo'], ['camera-drones'], [
      WAVE5_PROMOTIONS.find((p) => p.id === 'promo-eu-shipping')!
    ]);
    expect('error' in ship ? false : ship.freeShipping).toBe(true);
  });

  it('keeps inventory-aware merchandising honest (no promote when unavailable)', () => {
    const flags = inventoryAwareFlags(DJI_PRODUCTS, signals);
    expect(flags.length).toBe(DJI_PRODUCTS.length);
    const restricted = inventoryAwareFlags(DJI_PRODUCTS, signals.map((s, i) => (i === 0 ? { ...s, inventoryUnits: 0, restricted: true } : s)));
    expect(restricted[0].promote).toBe(false);
    expect(urgencyMessage(restricted[0], 0)).toBeNull();
    const low = { ...flags[0], lowStock: true, available: true };
    expect(urgencyMessage(low, 3)).toContain('Only 3 left');
  });

  it('builds Wave 3-linked bundles with discounts', () => {
    const bundles = buildOptimizedBundles(DJI_PRODUCTS);
    expect(bundles.length).toBeGreaterThan(0);
    expect(bundles.some((b) => b.kind === 'fbt' || b.kind === 'essential')).toBe(true);
  });

  it('assigns A/B variants deterministically and supports rollback id', () => {
    const exp = WAVE5_EXPERIMENTS[0];
    const a = assignAbVariant(exp, 'user-42');
    const b = assignAbVariant(exp, 'user-42');
    expect(a.variantId).toBe(b.variantId);
    expect(exp.variants.some((v) => v.id === a.variantId)).toBe(true);
    expect(exp.rollbackVariantId).toBe('control');
  });

  it('requires approval metadata on high-risk AI actions and certifies Wave 5', () => {
    expect(bundle.aiRecommendations.every((r) => r.confidence >= 0.85 && r.proposedAction)).toBe(true);
    expect(bundle.aiRecommendations.some((r) => r.requiresApproval)).toBe(true);
    expect(bundle.certification.pricingConflicts).toBe(0);
    expect(bundle.certification.promotionErrors).toBe(0);
    expect(bundle.certification.merchandisingCoveragePct).toBeGreaterThanOrEqual(95);
    expect(bundle.certification.recommendationIntegrityPct).toBeGreaterThanOrEqual(95);
    expect(bundle.certification.highRiskApprovalCoveragePct).toBe(100);
    expect(bundle.certification.certified).toBe(true);
    expect(bundle.homepage.featured[0]).toBe('prod-mavic-4-pro');
  });
});

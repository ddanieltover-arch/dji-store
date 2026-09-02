import { describe, expect, it } from 'vitest';
import { applyUsdPricingToProduct } from './applyUsdPricing';
import { parseOfficialUsdPricesFromHtml } from './fetchOfficialUsdPrices';
import { Product } from '../../types';

const sampleProduct: Product = {
  id: 'prod-air-3s',
  sku: 'X',
  slug: 'dji-air-3s',
  modelName: 'DJI Air 3S',
  series: 'Air',
  category: 'camera-drones',
  categoryLabel: 'Drone',
  tagline: 't',
  description: 'd',
  basePriceEur: 1099,
  compareAtPriceEur: 1199,
  weightGrams: 724,
  images: { hero: '/x.png', cutout: '/x.png', gallery: [] },
  variants: [
    {
      id: 'v1',
      sku: 'S',
      comboName: 'Standard Package (DJI RC-N3)',
      priceEur: 1099,
      weightGrams: 724,
      inStock: true,
      stockQuantity: 1,
      includedItems: []
    },
    {
      id: 'v2',
      sku: 'F',
      comboName: 'Fly More Combo (DJI RC 2 Screen Remote)',
      priceEur: 1599,
      weightGrams: 724,
      inStock: true,
      stockQuantity: 1,
      includedItems: []
    }
  ],
  specifications: [],
  features: [],
  rating: 4.8,
  reviewCount: 1
};

describe('applyUsdPricingToProduct', () => {
  it('maps US combo prices to EUR with 10% discount', () => {
    const priced = applyUsdPricingToProduct(sampleProduct, {
      slug: 'dji-air-3s',
      status: 200,
      fetchedAt: '2026-01-01',
      combos: [
        { title: 'DJI Air 3S (DJI RC-N3)', usd: 1099 },
        { title: 'DJI Air 3S Fly More Combo (DJI RC 2)', usd: 1599 }
      ]
    });

    expect(priced.basePriceEur).toBe(916); // 1099 * 0.9 / 1.08
    expect(priced.compareAtPriceEur).toBe(1018); // 1099 / 1.08
    expect(priced.variants[0].priceEur).toBe(916);
    expect(priced.variants[1].priceEur).toBe(1333); // 1599 * 0.9 / 1.08
  });

  it('prefers standard fly-more combo over lite/plus when variant does not specify tier', () => {
    const priced = applyUsdPricingToProduct(sampleProduct, {
      slug: 'dji-air-3s',
      status: 200,
      fetchedAt: '2026-01-01',
      combos: [
        { title: 'DJI Air 3S Fly More Combo Lite (DJI RC 2)', usd: 2250 },
        { title: 'DJI Air 3S (DJI RC-N3)', usd: 1099 },
        { title: 'DJI Air 3S Fly More Combo (DJI RC 2)', usd: 1599 }
      ]
    });
    expect(priced.variants[1].priceEur).toBe(1333);
  });
});

describe('parseOfficialUsdPricesFromHtml', () => {
  it('extracts combo originalPrice values near titles', () => {
    const html = `"title":"","originalPrice":99,"title":"DJI Air 3S (DJI RC-N3)","originalPrice":1099,"title":"DJI Air 3S Fly More Combo (DJI RC 2)","originalPrice":1599`;
    const combos = parseOfficialUsdPricesFromHtml(html, 'dji-air-3s');
    expect(combos.some((c) => c.usd === 1099)).toBe(true);
    expect(combos.some((c) => c.usd === 1599)).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { changeRiskScore, generateSeoPack, normalizeComboName, scoreCatalogHealth } from './catalogIntelligence';
import { DJI_PRODUCTS } from '../../data/products';
import { PIM_ANALYTICS } from '../../data/productIntelligenceData';

describe('PIM catalog intelligence', () => {
  it('normalizes Fly More combos', () => {
    expect(normalizeComboName('DJI Air 3S Fly More Combo (RC 2)')).toBe('Fly More');
    expect(normalizeComboName('Fly More Combo Plus')).toBe('Fly More Combo Plus');
    expect(normalizeComboName('Cine Combo')).toBe('Cine');
  });

  it('builds locale SEO titles', () => {
    const seo = generateSeoPack(DJI_PRODUCTS[0], 'de');
    expect(seo.title).toContain('Offizieller');
  });

  it('meets catalog health target on scored sample', () => {
    expect(PIM_ANALYTICS.catalogHealth).toBeGreaterThanOrEqual(90);
    expect(scoreCatalogHealth({ description: 96, media: 97, specs: 95, seo: 94, translation: 91, relationships: 93 })).toBeGreaterThanOrEqual(94);
  });

  it('flags large price moves for review', () => {
    expect(changeRiskScore('price', -18).recommend).toBe('review');
  });
});

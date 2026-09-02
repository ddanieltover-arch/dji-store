import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE6_SELLABLE_SLUGS } from '../../data/wave6CategoryManifest';
import { WAVE6_MANUAL_SLUGS } from '../../data/wave6ManualSlugs';
import { WAVE6_HIGH_TRAFFIC_ENRICHMENT } from '../../data/wave6HighTrafficEnrichment';
import {
  inferWave6Category,
  runWave6CategoryExpansion,
  slugToModelName,
  slugToWave6Product,
  WAVE6_CATEGORY_MATRIX,
  WAVE6_OFFICIAL_EXPANSION,
  WAVE6_ALL_SLUGS,
  applyWave6Enrichment,
  getWave6EnrichmentCoverage
} from './wave6CategoryExpansion';

describe('Wave 6 Official Category Expansion', () => {
  it('defines nine official-store category rows', () => {
    expect(WAVE6_CATEGORY_MATRIX).toHaveLength(9);
    expect(WAVE6_CATEGORY_MATRIX.map((r) => r.id)).toContain('w6-refurbished');
  });

  it('materializes every sellable crawl slug into DJI_PRODUCTS', () => {
    const slugs = new Set(DJI_PRODUCTS.map((p) => p.slug));
    const missing = WAVE6_ALL_SLUGS.filter((s) => !slugs.has(s));
    expect(missing).toEqual([]);
    expect(WAVE6_OFFICIAL_EXPANSION).toHaveLength(WAVE6_ALL_SLUGS.length);
  });

  it('maps slugs to readable model names', () => {
    expect(slugToModelName('dji-air-3s-fly-more-combo')).toContain('DJI Air 3S');
    expect(slugToModelName('osmo-action-4')).toBe('Osmo Action 4');
  });

  it('assigns local cutout images to generated SKUs', () => {
    const sample = slugToWave6Product('dji-air-3-intelligent-flight-battery');
    expect(sample.images.hero).toMatch(/^\/products\/w6-/);
    expect(sample.images.cutout).toMatch(/^\/products\/w6-/);
    expect(inferWave6Category(sample.slug)).toBe('accessories');
  });

  it('reports full coverage against the crawl manifest', () => {
    const report = runWave6CategoryExpansion(DJI_PRODUCTS);
    expect(report.total).toBe(WAVE6_ALL_SLUGS.length);
    expect(report.coveragePct).toBe(100);
    expect(report.added).toBe(0);
  });

  it('enriches high-traffic SKUs with curated EU prices and copy', () => {
    const coverage = getWave6EnrichmentCoverage(DJI_PRODUCTS);
    expect(coverage.enriched).toBe(Object.keys(WAVE6_HIGH_TRAFFIC_ENRICHMENT).length);
    expect(coverage.missing).toEqual([]);

    const flip = DJI_PRODUCTS.find((p) => p.slug === 'dji-flip-fly-more-combo-rc-2');
    expect(flip?.basePriceEur).toBe(779);
    expect(flip?.tagline).toContain('RC 2');

    const care = DJI_PRODUCTS.find((p) => p.slug === 'dji-care-refresh-dji-neo');
    expect(care?.basePriceEur).toBe(29);
    expect(care?.modelName).toContain('Neo');
  });
});

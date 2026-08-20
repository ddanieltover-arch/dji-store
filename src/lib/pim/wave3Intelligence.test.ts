import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import {
  buildRelationshipGraph,
  enrichProductContent,
  generateComparison,
  generateProductFaqs,
  runWave3Intelligence
} from './wave3Intelligence';

describe('Wave 3 catalog intelligence', () => {
  const air = DJI_PRODUCTS.find((p) => p.id === 'prod-air-3s')!;
  const mini = DJI_PRODUCTS.find((p) => p.id === 'prod-mini-4-pro')!;
  const bundle = runWave3Intelligence(DJI_PRODUCTS);

  it('enriches Air 3S commercial content from catalog fields', () => {
    const copy = enrichProductContent(air);
    expect(copy.headline).toBe('Dual-Camera Freedom for Every Adventure');
    expect(copy.summary.toLowerCase()).toContain('camera');
    expect(copy.canonicalSource).toBe('https://store.dji.com');
  });

  it('generates flight FAQs from specifications', () => {
    const faq = generateProductFaqs(air).find((f) => f.topic === 'flight');
    expect(faq?.answer).toMatch(/minutes/);
    expect(faq?.question).toContain('Air 3S');
  });

  it('builds Mini 4 Pro UPGRADE_TO Air 3S on the existing catalog', () => {
    const rel = buildRelationshipGraph(DJI_PRODUCTS);
    expect(rel.some((e) => e.fromProductId === 'prod-mini-4-pro' && e.toProductId === 'prod-air-3s' && e.type === 'UPGRADE_TO')).toBe(
      true
    );
    expect(rel.some((e) => e.fromProductId === 'prod-air-3s' && e.toProductId === 'prod-mavic-4-pro' && e.type === 'UPGRADE_TO')).toBe(
      true
    );
  });

  it('compares Air 3S vs Mini 4 Pro across required categories', () => {
    const cmp = generateComparison(air, mini);
    expect(cmp.title).toContain('vs');
    const cats = cmp.rows.map((r) => r.category);
    expect(cats).toEqual(['Camera', 'Flight Time', 'Weight', 'Transmission', 'Battery', 'Price', 'EASA Class']);
  });

  it('certifies Wave 3 coverage floors without a second PIM', () => {
    const c = bundle.certification;
    expect(c.catalogHealth).toBeGreaterThanOrEqual(90);
    expect(c.relationshipCoveragePct).toBeGreaterThanOrEqual(95);
    expect(c.faqCoveragePct).toBeGreaterThanOrEqual(95);
    expect(c.seoCoveragePct).toBeGreaterThanOrEqual(95);
    expect(c.compatibilityCoveragePct).toBeGreaterThanOrEqual(95);
    expect(c.productIntelligenceScore).toBeGreaterThanOrEqual(95);
    expect(c.catalogIntelligenceScore).toBeGreaterThanOrEqual(95);
    expect(c.certified).toBe(true);
    expect(bundle.seo.length).toBe(DJI_PRODUCTS.length * 6);
    expect(bundle.comparisons.some((x) => x.leftProductId === 'prod-matrice-4e')).toBe(true);
  });
});

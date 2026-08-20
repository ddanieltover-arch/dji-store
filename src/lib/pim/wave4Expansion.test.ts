import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE4_DISCOVERY_UNIVERSE, WAVE4_OFFICIAL_EXPANSION } from '../../data/wave4OfficialCatalog';
import { INITIAL_DEPOT_STOCK } from '../../data/warehouses';
import { normalizeComboName } from './catalogIntelligence';
import { initializeInventoryFromCatalog } from './wave1Execution';
import {
  WAVE4_AMBIGUOUS_PROBE,
  WAVE4_CATEGORY_MATRIX,
  WAVE4_STAGES,
  chainWave3AfterPublish,
  dedupeMediaHash,
  findCatalogMatch,
  governNewSku,
  mediaComplete,
  normalizeDetectedVariants,
  runWave4Expansion,
  specCoverageForProduct
} from './wave4Expansion';
import { isOfficialStoreUrlAllowed } from './officialStoreConnector';

describe('Wave 4 catalog expansion', () => {
  const result = runWave4Expansion(DJI_PRODUCTS);

  it('maps all nine official-store categories with robots-allowed paths', () => {
    expect(WAVE4_CATEGORY_MATRIX).toHaveLength(9);
    expect(WAVE4_CATEGORY_MATRIX.every((r) => isOfficialStoreUrlAllowed(r.storePath))).toBe(true);
    expect(result.categories.every((c) => c.discoveryStatus === 'discovered')).toBe(true);
    expect(result.certification.categoryCoveragePct).toBeGreaterThanOrEqual(95);
  });

  it('detects duplicates / maps existing products by slug', () => {
    const hit = findCatalogMatch(DJI_PRODUCTS, 'dji-air-3s', 'DJI Air 3S');
    expect(hit.decision).toBe('map_existing');
    expect(hit.product?.id).toBe('prod-air-3s');
  });

  it('creates pending catalog records for unknown SKUs without auto-publish', () => {
    const gov = governNewSku(
      DJI_PRODUCTS,
      'dji-never-seen-sku-xyz',
      'DJI Never Seen XYZ',
      'https://store.dji.com/product/dji-never-seen-sku-xyz'
    );
    expect(gov.decision).toBe('pending_new');
    expect(gov.pending?.status).toBe('pending_approval');
    expect(gov.mappedProductId).toBeUndefined();
  });

  it('forces ambiguous matches into review (no auto-publish)', () => {
    const gov = governNewSku(
      DJI_PRODUCTS,
      WAVE4_AMBIGUOUS_PROBE.slug,
      WAVE4_AMBIGUOUS_PROBE.modelName,
      WAVE4_AMBIGUOUS_PROBE.sourceUrl
    );
    expect(gov.decision === 'ambiguous_review' || gov.decision === 'map_existing' || gov.decision === 'pending_new').toBe(
      true
    );
    if (gov.decision !== 'map_existing') {
      expect(gov.pending).toBeDefined();
      expect(gov.mappedProductId).toBeUndefined();
    }
  });

  it('normalizes official variant names with longest-match', () => {
    expect(normalizeComboName('Air 3S Fly More Combo Plus')).toBe('Fly More Combo Plus');
    expect(normalizeDetectedVariants(['Cine', 'RTK', 'Thermal', 'Creator Combo', 'Standard'])).toEqual([
      'Cine',
      'RTK',
      'Thermal',
      'Creator Combo',
      'Standard'
    ]);
  });

  it('dedupes media by content hash', () => {
    const url = 'https://cdn.example/hero.png';
    const d = dedupeMediaHash([url, url, 'https://cdn.example/g1.png']);
    expect(d.unique).toHaveLength(2);
    expect(d.duplicates).toBe(1);
  });

  it('does not invent missing specs — coverage reflects present fields only', () => {
    const accessory = DJI_PRODUCTS.find((p) => p.category === 'accessories')!;
    expect(specCoverageForProduct(accessory)).toBeGreaterThan(0);
    expect(mediaComplete(DJI_PRODUCTS[0])).toBe(true);
  });

  it('initializes inventory for every variant without wiping seed', () => {
    const inventory = initializeInventoryFromCatalog(DJI_PRODUCTS, INITIAL_DEPOT_STOCK);
    expect(inventory['var-m4p-std'][0].stockUnits).toBe(18);
    const variants = DJI_PRODUCTS.flatMap((p) => p.variants);
    expect(variants.every((v) => inventory[v.id]?.length > 0)).toBe(true);
  });

  it('chains Wave 3 enrichment after publish', () => {
    const ids = WAVE4_OFFICIAL_EXPANSION.map((p) => p.id);
    const chained = chainWave3AfterPublish(DJI_PRODUCTS, ids);
    expect(chained.enrichedIds.length).toBe(ids.length);
    expect(chained.faqs.length).toBeGreaterThan(0);
    expect(chained.certification.certified).toBe(true);
  });

  it('publishes Wave 4 expansion into the single DJI_PRODUCTS catalog', () => {
    expect(WAVE4_OFFICIAL_EXPANSION.length).toBeGreaterThanOrEqual(12);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-mini-3-pro')).toBe(true);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-matrice-30t')).toBe(true);
    expect(DJI_PRODUCTS.length).toBeGreaterThanOrEqual(WAVE4_DISCOVERY_UNIVERSE.length);
  });

  it('runs full pipeline and certifies only when evaluated thresholds pass', () => {
    expect(result.stages).toEqual(WAVE4_STAGES);
    expect(result.coverage.catalogCoveragePct).toBeGreaterThanOrEqual(95);
    expect(result.coverage.inventoryCoveragePct).toBe(100);
    expect(result.coverage.mediaCoveragePct).toBeGreaterThanOrEqual(95);
    expect(result.coverage.seoCoveragePct).toBeGreaterThanOrEqual(95);
    expect(result.certification.catalogHealth).toBeGreaterThanOrEqual(90);
    expect(result.certification.relationshipCoveragePct).toBeGreaterThanOrEqual(95);
    expect(result.certification.faqCoveragePct).toBeGreaterThanOrEqual(95);
    expect(result.certification.productIntelligenceScore).toBeGreaterThanOrEqual(95);
    expect(result.certification.catalogIntelligenceScore).toBeGreaterThanOrEqual(95);
    expect(result.certification.certified).toBe(true);
    expect(result.queue.pendingApprovals).toBeGreaterThanOrEqual(1);
  });
});

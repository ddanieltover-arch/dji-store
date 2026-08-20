import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE2_OFFICIAL_EXPANSION } from '../../data/wave2OfficialCatalog';
import {
  CATEGORY_ACQUISITION_MATRIX,
  discoverOfficialCatalog,
  extractOfficialProduct,
  runWave2Acquisition,
  WAVE2_STAGES
} from './wave2Acquisition';
import { isOfficialStoreUrlAllowed } from './officialStoreConnector';

describe('Wave 2 Official DJI Catalog Acquisition', () => {
  it('covers all five official-store categories with robots-allowed paths', () => {
    expect(CATEGORY_ACQUISITION_MATRIX).toHaveLength(5);
    expect(CATEGORY_ACQUISITION_MATRIX.every((r) => isOfficialStoreUrlAllowed(r.storePath))).toBe(true);
    const cats = new Set(CATEGORY_ACQUISITION_MATRIX.map((r) => r.catalogCategory));
    expect(cats.has('camera-drones')).toBe(true);
    expect(cats.has('handheld')).toBe(true);
    expect(cats.has('professional')).toBe(true);
    expect(cats.has('accessories')).toBe(true);
    expect(cats.has('power-care')).toBe(true);
  });

  it('maps every catalog SKU to a store.dji.com PDP and extracts into existing Product ids', () => {
    const discovery = discoverOfficialCatalog(DJI_PRODUCTS);
    const products = discovery.filter((d) => d.entityType === 'product');
    expect(products).toHaveLength(DJI_PRODUCTS.length);
    expect(products.every((d) => d.mappedProductId && d.url.startsWith('https://store.dji.com/product/'))).toBe(true);
    const sample = extractOfficialProduct('https://store.dji.com/product/dji-neo', DJI_PRODUCTS);
    expect(sample?.productId).toBe('prod-neo');
    expect(sample?.variants.some((v) => v.normalizedName === 'Fly More' || v.normalizedName === 'Standard')).toBe(true);
  });

  it('publishes Wave 2 expansion into DJI_PRODUCTS (single catalog)', () => {
    expect(WAVE2_OFFICIAL_EXPANSION.length).toBeGreaterThanOrEqual(12);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-rs4-pro')).toBe(true);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-matrice-4e')).toBe(true);
    expect(DJI_PRODUCTS.length).toBeGreaterThanOrEqual(40);
  });

  it('runs the full pipeline and certifies health', () => {
    const result = runWave2Acquisition(DJI_PRODUCTS);
    expect(result.stages).toEqual(WAVE2_STAGES);
    expect(result.extracts.length).toBe(DJI_PRODUCTS.length);
    expect(result.seoLocaleCount).toBe(DJI_PRODUCTS.length * 6);
    expect(result.health.inventoryCoveragePct).toBe(100);
    expect(result.health.mappingCoveragePct).toBeGreaterThanOrEqual(98);
    expect(result.health.wave2Certified).toBe(true);
    expect(result.firmware.length).toBeGreaterThanOrEqual(3);
  });

  it('refuses cart/checkout extraction', () => {
    expect(extractOfficialProduct('https://store.dji.com/cart', DJI_PRODUCTS)).toBeUndefined();
  });
});

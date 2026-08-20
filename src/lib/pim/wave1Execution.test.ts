import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_DEPOT_STOCK } from '../../data/warehouses';
import { FIRMWARE_HISTORY } from '../../data/productIntelligenceData';
import {
  certifyWave1Catalog,
  initializeInventoryFromCatalog,
  populateSeoForCatalog,
  retryOrDlq,
  enqueueWave1
} from './wave1Execution';

describe('Wave 1 catalog execution', () => {
  const inventory = initializeInventoryFromCatalog(DJI_PRODUCTS, INITIAL_DEPOT_STOCK);

  it('initializes depot stock for every variant without dropping Mavic seed', () => {
    expect(inventory['var-m4p-std'][0].stockUnits).toBe(18);
    const variants = DJI_PRODUCTS.flatMap((p) => p.variants);
    expect(variants.every((v) => inventory[v.id]?.length > 0)).toBe(true);
  });

  it('populates SEO for all six EU locales', () => {
    const seo = populateSeoForCatalog(DJI_PRODUCTS);
    expect(seo[DJI_PRODUCTS[0].id]).toHaveLength(6);
    expect(seo[DJI_PRODUCTS[0].id].some((r) => r.locale === 'nl')).toBe(true);
  });

  it('certifies Wave 1 when inventory is complete', () => {
    const report = certifyWave1Catalog(
      DJI_PRODUCTS,
      inventory,
      FIRMWARE_HISTORY.map((f) => f.productId)
    );
    expect(report.skuCount).toBeGreaterThanOrEqual(28);
    expect(report.inventoryCoveragePct).toBe(100);
    expect(report.certified).toBe(true);
  });

  it('dead-letters after three retries', () => {
    let job = enqueueWave1('extract', { sku: 'x' }, 'c0');
    job = retryOrDlq(job);
    job = retryOrDlq(job);
    job = retryOrDlq(job);
    expect(job.dlq).toBe(true);
  });
});

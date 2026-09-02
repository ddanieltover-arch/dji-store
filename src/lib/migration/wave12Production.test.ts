import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE12_ENV_VARS, WAVE12_INVENTORY, WAVE12_ROUTES } from '../../data/wave12ProductionData';
import {
  assertNoBrowserSecrets,
  depotCodes,
  inventoryStatus,
  loadCatalog,
  mapProductToCatalogRow,
  resolveDataMode,
  runWave12Migration,
  verifyCheckoutIdempotency
} from './wave12Production';

describe('Wave 12 production migration', () => {
  const bundle = runWave12Migration({
    dataMode: 'production',
    supabaseUrl: 'https://example.supabase.co',
    testsPassedPct: 100
  });

  it('classifies migration inventory without losing critical items', () => {
    expect(WAVE12_INVENTORY.length).toBeGreaterThan(20);
    expect(['KEEP', 'ADAPT', 'REWRITE', 'DEPRECATE']).toEqual(
      expect.arrayContaining(Object.keys(bundle.dispositions))
    );
    expect(bundle.criticalMigratedPct).toBe(100);
    expect(bundle.viteRemainsAsReference).toBe(true);
  });

  it('covers 100% of production App Router routes', () => {
    expect(WAVE12_ROUTES.every((r) => r.implemented)).toBe(true);
    expect(bundle.gates.productionRouteCoveragePct).toBe(100);
  });

  it('forbids mock catalog in production data mode', () => {
    const blocked = loadCatalog({ dataMode: 'production', supabaseRows: null });
    expect(blocked.rows).toHaveLength(0);
    expect(blocked.source).toBe('prototype_forbidden');
    expect(blocked.mockUsed).toBe(false);

    const live = loadCatalog({
      dataMode: 'production',
      supabaseRows: DJI_PRODUCTS.map(mapProductToCatalogRow)
    });
    expect(live.mockUsed).toBe(false);
    expect(live.source).toBe('supabase');
    expect(bundle.certification.mockCatalogInProduction).toBe(0);
  });

  it('integrates FRA/AMS/CDG inventory status without stale-as-live claims', () => {
    expect(depotCodes()).toEqual(expect.arrayContaining(['FRA-01', 'AMS-02', 'CDG-03']));
    expect(inventoryStatus(20, 1, 0)).toBe('available');
    expect(inventoryStatus(3, 0, 0)).toBe('low_stock');
    expect(inventoryStatus(0, 0, 5)).toBe('preorder');
    expect(inventoryStatus(0, 0, 0)).toBe('unavailable');
    expect(bundle.gates.realInventoryIntegrationPct).toBe(100);
  });

  it('keeps checkout idempotent via Phase 12 helpers', () => {
    expect(verifyCheckoutIdempotency()).toBe(true);
    expect(bundle.gates.commerceIntegrationPct).toBe(100);
  });

  it('isolates secrets from the browser bundle', () => {
    expect(WAVE12_ENV_VARS.filter((e) => e.key === 'SUPABASE_SERVICE_ROLE_KEY')[0].browserExposed).toBe(false);
    expect(
      assertNoBrowserSecrets({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
        SUPABASE_SERVICE_ROLE_KEY: 'secret'
      })
    ).toHaveLength(0);
    expect(
      assertNoBrowserSecrets({
        NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: 'leaked'
      }).length
    ).toBeGreaterThan(0);
    expect(resolveDataMode('production')).toBe('production');
  });

  it('reconciles prototype catalog against production contract rows', () => {
    expect(bundle.reconciliation.find((r) => r.entity === 'products')?.ok).toBe(true);
    expect(bundle.connectivity.every((c) => c.usesMockInProduction === false)).toBe(true);
  });

  it('certifies Wave 12 gates', () => {
    const c = bundle.certification;
    expect(c.productionRouteCoveragePct).toBe(100);
    expect(c.realCatalogIntegrationPct).toBe(100);
    expect(c.realInventoryIntegrationPct).toBe(100);
    expect(c.commerceIntegrationPct).toBe(100);
    expect(c.pimIntegrationPct).toBe(100);
    expect(c.authenticationIntegrationPct).toBe(100);
    expect(c.securityRegression).toBe('Pass');
    expect(c.performanceRegression).toBe('Pass');
    expect(c.automatedTestsPct).toBe(100);
    expect(c.criticalDefects).toBe(0);
    expect(c.rollbackPathVerified).toBe(true);
    expect(c.certified).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import {
  isOfficialStoreUrlAllowed,
  mapOfficialUrlToCatalogProduct,
  normalizeOfficialVariant,
  trustDecisionForChange,
  toProductDiff
} from './officialStoreConnector';
import { CONNECTOR_CERTIFICATION } from '../../data/officialStoreConnectorData';
import { normalizeComboName } from './catalogIntelligence';

describe('DJI Official Store connector', () => {
  it('respects robots.txt disallows', () => {
    expect(isOfficialStoreUrlAllowed('https://store.dji.com/product/mavic-4-pro')).toBe(true);
    expect(isOfficialStoreUrlAllowed('https://store.dji.com/cart')).toBe(false);
    expect(isOfficialStoreUrlAllowed('/api/checkout')).toBe(false);
  });

  it('maps store URLs onto existing DJI_PRODUCTS slugs', () => {
    const p = mapOfficialUrlToCatalogProduct('https://store.dji.com/product/dji-mavic-4-pro', DJI_PRODUCTS);
    expect(p?.id).toBe('prod-mavic-4-pro');
  });

  it('publishes official-store expansion into the live catalog (not a 10-SKU seed)', () => {
    expect(DJI_PRODUCTS.length).toBeGreaterThanOrEqual(28);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-neo')).toBe(true);
    expect(DJI_PRODUCTS.some((p) => p.id === 'prod-osmo-360')).toBe(true);
  });

  it('normalizes Fly More Combo Plus before Fly More', () => {
    expect(normalizeComboName('Air 3S Fly More Combo Plus')).toBe('Fly More Combo Plus');
    expect(normalizeOfficialVariant('Creator Combo', 'SKU-1', ['RC']).normalizedVariantName).toBe('Creator Combo');
  });

  it('auto-approves firmware and reviews price', () => {
    expect(trustDecisionForChange('firmware')).toBe('auto-approve');
    expect(trustDecisionForChange('price', 20)).toBe('review-required');
    expect(toProductDiff('prod-air-3s', 'price', 1399, 1349, 'price', 3.5).riskScore).toBe(25);
  });

  it('meets connector certification floor of 95', () => {
    const scores = [
      CONNECTOR_CERTIFICATION.extractionAccuracy,
      CONNECTOR_CERTIFICATION.syncReliability,
      CONNECTOR_CERTIFICATION.catalogCompleteness,
      CONNECTOR_CERTIFICATION.mediaCoverage,
      CONNECTOR_CERTIFICATION.seoReadiness
    ];
    expect(Math.min(...scores)).toBeGreaterThanOrEqual(95);
  });
});

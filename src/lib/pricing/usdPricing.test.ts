import { describe, expect, it } from 'vitest';
import {
  EU_STORE_USD_DISCOUNT_PERCENT,
  USD_TO_EUR_RATE,
  eurPricesFromUsd,
  usdToCompareAtEur,
  usdToSaleEur
} from './usdPricing';

describe('USD reference pricing for EU store', () => {
  it('uses the fixed USD→EUR rate from currency config', () => {
    expect(USD_TO_EUR_RATE).toBe(1.08);
    expect(EU_STORE_USD_DISCOUNT_PERCENT).toBe(10);
  });

  it('converts full USD list price to compare-at EUR (rounded)', () => {
    expect(usdToCompareAtEur(2199)).toBe(2036); // 2199 / 1.08 = 2036.11…
    expect(usdToCompareAtEur(108)).toBe(100);
  });

  it('applies 10% discount before EUR conversion for sale prices', () => {
    expect(usdToSaleEur(2199)).toBe(1833); // 2199 * 0.9 / 1.08 = 1832.5 → 1833
    expect(usdToSaleEur(108)).toBe(90); // 97.2 / 1.08 = 90
  });

  it('returns paired base and compare-at prices', () => {
    expect(eurPricesFromUsd(2199)).toEqual({
      basePriceEur: 1833,
      compareAtPriceEur: 2036
    });
  });

  it('rejects negative USD input', () => {
    expect(() => usdToSaleEur(-1)).toThrow('USD price must be non-negative');
  });
});

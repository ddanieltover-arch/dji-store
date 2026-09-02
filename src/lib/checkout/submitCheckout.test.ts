import { describe, expect, it } from 'vitest';
import { buildCartFingerprint } from './submitCheckout';

describe('submitCheckout', () => {
  it('builds stable cart fingerprint from line items', () => {
    const fp = buildCartFingerprint([
      { productName: 'A', comboName: 'X', sku: 'B-SKU', priceEur: 10, quantity: 2, imageUrl: '' },
      { productName: 'B', comboName: 'Y', sku: 'A-SKU', priceEur: 20, quantity: 1, imageUrl: '' }
    ]);
    expect(fp).toBe('A-SKU:1|B-SKU:2');
  });
});

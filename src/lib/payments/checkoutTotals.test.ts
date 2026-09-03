import { describe, expect, it } from 'vitest';
import {
  calculateCheckoutTotals,
  CRYPTO_PAYMENT_DISCOUNT_RATE,
  isManualSettlementMethod,
  paymentMethodDisplayName
} from './checkoutTotals';

describe('calculateCheckoutTotals', () => {
  it('applies 5% discount for crypto payment methods', () => {
    const totals = calculateCheckoutTotals({
      subtotalEur: 200,
      shippingEur: 19,
      paymentMethod: 'crypto_usdt'
    });

    expect(CRYPTO_PAYMENT_DISCOUNT_RATE).toBe(0.05);
    expect(totals.discountEur).toBe(10.95);
    expect(totals.totalEur).toBe(208.05);
    expect(totals.discountLabel).toContain('5%');
  });

  it('does not discount SEPA bank wire payments', () => {
    const totals = calculateCheckoutTotals({
      subtotalEur: 200,
      shippingEur: 19,
      paymentMethod: 'sepa_bank_wire'
    });

    expect(totals.discountEur).toBe(0);
    expect(totals.totalEur).toBe(219);
  });

  it('does not discount Revolut banking payments', () => {
    const totals = calculateCheckoutTotals({
      subtotalEur: 200,
      shippingEur: 19,
      paymentMethod: 'revolut_bank'
    });

    expect(totals.discountEur).toBe(0);
    expect(totals.totalEur).toBe(219);
  });

  it('discounts BTC and ETH rails the same as USDT', () => {
    const btc = calculateCheckoutTotals({
      subtotalEur: 100,
      shippingEur: 0,
      paymentMethod: 'crypto_btc'
    });
    const eth = calculateCheckoutTotals({
      subtotalEur: 100,
      shippingEur: 0,
      paymentMethod: 'crypto_eth'
    });

    expect(btc.discountEur).toBe(5);
    expect(eth.discountEur).toBe(5);
    expect(btc.totalEur).toBe(95);
  });

  it('treats Revolut as a manual settlement rail', () => {
    expect(isManualSettlementMethod('revolut_bank')).toBe(true);
    expect(paymentMethodDisplayName('revolut_bank')).toBe('Revolut Banking');
  });
});

export const CRYPTO_PAYMENT_DISCOUNT_RATE = 0.05;

export type CheckoutPaymentMethod =
  | 'sepa_bank_wire'
  | 'revolut_bank'
  | 'crypto_usdt'
  | 'crypto_btc'
  | 'crypto_eth';

export function isCryptoPaymentMethod(method: string): boolean {
  return method.startsWith('crypto_');
}

export function isBankingPaymentMethod(method: string): boolean {
  return method === 'sepa_bank_wire' || method === 'revolut_bank' || method === 'bank_transfer_sepa';
}

/** SEPA, Revolut, and crypto rails settle after order placement. */
export function isManualSettlementMethod(method: string): boolean {
  return isBankingPaymentMethod(method) || isCryptoPaymentMethod(method);
}

export function paymentMethodDisplayName(method: string): string {
  switch (method) {
    case 'sepa_bank_wire':
    case 'bank_transfer_sepa':
      return 'SEPA Bank Wire';
    case 'revolut_bank':
      return 'Revolut Banking';
    case 'crypto_usdt':
    case 'crypto_btc':
    case 'crypto_eth':
      return 'Web3 Cryptocurrency';
    default:
      return method;
  }
}

export interface CheckoutTotalsInput {
  subtotalEur: number;
  shippingEur: number;
  paymentMethod: string;
}

export interface CheckoutTotals {
  subtotalEur: number;
  shippingEur: number;
  discountEur: number;
  discountLabel?: string;
  totalEur: number;
}

function roundEur(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Applies 5% discount when paying with Web3 cryptocurrency (USDT / BTC / ETH). */
export function calculateCheckoutTotals(input: CheckoutTotalsInput): CheckoutTotals {
  const preDiscountTotal = input.subtotalEur + input.shippingEur;
  const discountEur = isCryptoPaymentMethod(input.paymentMethod)
    ? roundEur(preDiscountTotal * CRYPTO_PAYMENT_DISCOUNT_RATE)
    : 0;
  const totalEur = roundEur(preDiscountTotal - discountEur);

  return {
    subtotalEur: input.subtotalEur,
    shippingEur: input.shippingEur,
    discountEur,
    discountLabel: discountEur > 0 ? 'Web3 Cryptocurrency (5% off)' : undefined,
    totalEur
  };
}

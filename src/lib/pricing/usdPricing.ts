import { CURRENCIES } from '../../data/currency';

/** Fixed USD→EUR rate: 1 EUR = 1.08 USD (see `CURRENCIES.USD.rateToEur`). */
export const USD_TO_EUR_RATE = CURRENCIES.USD.rateToEur;

/** EU store discount applied to US reference prices before EUR conversion. */
export const EU_STORE_USD_DISCOUNT_PERCENT = 10;

export interface EurPricesFromUsd {
  basePriceEur: number;
  compareAtPriceEur: number;
}

function roundWholeEur(amountEur: number): number {
  return Math.round(amountEur);
}

/** Full US list price converted to EUR (no discount) — used for compare-at / strike-through. */
export function usdToCompareAtEur(usd: number): number {
  if (usd < 0) throw new Error('USD price must be non-negative');
  return roundWholeEur(usd / USD_TO_EUR_RATE);
}

/** US reference price with 10% EU discount, then converted to EUR — used for sale prices. */
export function usdToSaleEur(usd: number): number {
  if (usd < 0) throw new Error('USD price must be non-negative');
  const discountedUsd = usd * (1 - EU_STORE_USD_DISCOUNT_PERCENT / 100);
  return roundWholeEur(discountedUsd / USD_TO_EUR_RATE);
}

/** Derive base and compare-at EUR prices from a single US reference list price. */
export function eurPricesFromUsd(usd: number): EurPricesFromUsd {
  return {
    basePriceEur: usdToSaleEur(usd),
    compareAtPriceEur: usdToCompareAtEur(usd)
  };
}

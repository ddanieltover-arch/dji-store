import { CurrencyCode } from '../types';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToEur: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateToEur: 1.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rateToEur: 1.08 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rateToEur: 0.86 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)', rateToEur: 0.96 }
};

export function formatPrice(amountEur: number, currency: CurrencyCode = 'EUR'): string {
  const c = CURRENCIES[currency] || CURRENCIES.EUR;
  const converted = amountEur * c.rateToEur;

  if (currency === 'EUR') {
    return `€ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === 'USD') {
    return `$ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === 'GBP') {
    return `£ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CHF`;
}

/** EU OSS VAT helpers used by commerce tests and checkout. Amounts in EUR cents. */

export const OSS_VAT_RATES: Record<string, number> = {
  DE: 19,
  FR: 20,
  NL: 21,
  IT: 22,
  ES: 21,
  PL: 23,
  AT: 20,
  IE: 23
};

export function roundCents(amount: number): number {
  return Math.round(amount);
}

export function vatInclusiveSplit(grossCents: number, vatRatePercent: number): { netCents: number; vatCents: number } {
  const vatCents = roundCents((grossCents * vatRatePercent) / (100 + vatRatePercent));
  return { netCents: grossCents - vatCents, vatCents };
}

export function applyPromotion(grossCents: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid discount');
  }
  return roundCents(grossCents * (1 - discountPercent / 100));
}

export function bundlePrice(itemGrossCents: number[], bundleDiscountPercent: number): number {
  const sum = itemGrossCents.reduce((a, b) => a + b, 0);
  return applyPromotion(sum, bundleDiscountPercent);
}

export function loyaltyPointsAccrued(paidEur: number, earnRatePerEuro: number): number {
  return Math.floor(paidEur * earnRatePerEuro);
}

export function evaluateAiCitationConfidence(score: number, min = 0.94): 'pass' | 'hallucination_block' {
  return score >= min ? 'pass' : 'hallucination_block';
}

export function detectPromptInjection(payload: string): boolean {
  const p = payload.toLowerCase();
  return ['ignore previous', 'system override', 'jailbreak', 'bypass guard'].some((t) => p.includes(t));
}

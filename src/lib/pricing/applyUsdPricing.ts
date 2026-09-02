import { Product, ProductVariant } from '../../types';
import { OfficialComboUsd, OfficialUsdPriceEntry } from './fetchOfficialUsdPrices';
import { usdToCompareAtEur, usdToSaleEur } from './usdPricing';

export type OfficialUsdPriceCache = Record<string, OfficialUsdPriceEntry>;

function normalizeComboName(value: string): string {
  return value
    .toLowerCase()
    .replace(/dji\s+/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function comboMatchScore(variantName: string, comboTitle: string): number {
  const vNorm = normalizeComboName(variantName);
  const cNorm = normalizeComboName(comboTitle);
  if (!vNorm || !cNorm) return 0;
  if (cNorm.includes(vNorm) || vNorm.includes(cNorm)) return 100;

  const vTokens = new Set(vNorm.split(' ').filter((t) => t.length > 1));
  let score = 0;
  for (const token of cNorm.split(' ')) {
    if (token.length > 1 && vTokens.has(token)) score += 1;
  }

  for (const hint of ['fly more combo plus', 'fly more combo lite', 'fly more combo', 'fly more', 'creator combo', 'cine', 'standard', 'drone only']) {
    if (vNorm.includes(hint) && cNorm.includes(hint)) score += 5;
  }

  if (/\blite\b/.test(cNorm) && !/\blite\b/.test(vNorm)) score -= 8;
  if (/\bplus\b/.test(cNorm) && !/\bplus\b/.test(vNorm)) score -= 8;
  if (/\blite\b/.test(vNorm) && /\blite\b/.test(cNorm)) score += 4;
  if (/\bplus\b/.test(vNorm) && /\bplus\b/.test(cNorm)) score += 4;

  const vRc2 = /\brc\s*2\b|\brc2\b/.test(vNorm);
  const cRc2 = /\brc\s*2\b|\brc2\b/.test(cNorm);
  const vRcN3 = /\brc[\s-]*n3\b|\brcn3\b/.test(vNorm);
  const cRcN3 = /\brc[\s-]*n3\b|\brcn3\b/.test(cNorm);
  if (vRc2 && cRc2) score += 8;
  if (vRcN3 && cRcN3) score += 8;
  if (vRc2 && cRcN3) score -= 8;
  if (vRcN3 && cRc2) score -= 8;

  return score;
}

function isAccessoryComboTitle(title: string): boolean {
  const t = title.toLowerCase();
  return /care refresh|intelligent flight battery|propeller|nd filter|filter set|charging hub|parallel charging|adapter|cable|case|shoulder bag|sling bag|micro sd|memory card|license|plan \(|refresh \d/i.test(
    t
  );
}

export function productLevelCombos(combos: OfficialComboUsd[]): OfficialComboUsd[] {
  const primary = combos.filter((c) => !isAccessoryComboTitle(c.title));
  return (primary.length ? primary : combos).filter((c) => c.usd > 0);
}

/** Drop cross-sell combos from sibling SKUs on the same official PDP payload. */
export function combosForProduct(product: Product, combos: OfficialComboUsd[]): OfficialComboUsd[] {
  const primary = productLevelCombos(combos);
  const slugNorm = product.slug.replace(/^dji-|^osmo-/, '').replace(/-/g, ' ');
  const filtered = primary.filter((combo) => {
    const titleNorm = normalizeComboName(combo.title).replace(/^dji\s+/, '');
    if (!titleNorm.includes(slugNorm)) return false;
    const extra = titleNorm.replace(slugNorm, '').trim().split(' ').filter(Boolean);
    for (const token of ['pro', 'plus', 'max', 'ultra', 'enterprise']) {
      if (extra.includes(token) && !slugNorm.split(' ').includes(token)) return false;
    }
    return true;
  });
  return filtered.length ? filtered : primary;
}

function pickComboUsd(variant: ProductVariant, combos: OfficialComboUsd[]): number | null {
  const pool = productLevelCombos(combos);
  if (!pool.length) return null;

  const vNorm = normalizeComboName(variant.comboName);

  if (/standard|drone only|basic|essential|aircraft only/.test(vNorm) || vNorm === 'standard') {
    const stdCandidates = pool.filter((c) => {
      const t = normalizeComboName(c.title);
      return !/fly more|creator|cine|combo plus|combo lite|vlog combo|adventure combo/.test(t);
    });
    if (stdCandidates.length) {
      return Math.min(...stdCandidates.map((c) => c.usd));
    }
  }

  if (/fly more|creator|cine|adventure|vlog combo/.test(vNorm)) {
    const keyed = pool.filter((c) => {
      const t = normalizeComboName(c.title);
      if (/fly more/.test(vNorm)) return t.includes('fly more');
      if (/creator/.test(vNorm)) return t.includes('creator');
      if (/cine/.test(vNorm)) return t.includes('cine');
      if (/adventure/.test(vNorm)) return t.includes('adventure');
      return false;
    });
    if (keyed.length) {
      let best = keyed[0];
      let bestScore = comboMatchScore(variant.comboName, best.title);
      for (const combo of keyed) {
        const score = comboMatchScore(variant.comboName, combo.title);
        if (score > bestScore || (score === bestScore && combo.usd < best.usd)) {
          best = combo;
          bestScore = score;
        }
      }
      return best.usd;
    }
  }

  let best: { usd: number; score: number } | null = null;
  for (const combo of pool) {
    const score = comboMatchScore(variant.comboName, combo.title);
    if (!best || score > best.score) best = { usd: combo.usd, score };
  }
  if (best && best.score >= 2) return best.usd;

  if (pool.length === 1) return pool[0].usd;

  return null;
}

function impliedUsdListFromSaleEur(saleEur: number): number {
  return Math.round((saleEur * 1.08) / 0.9);
}

function resolveVariantUsd(variant: ProductVariant, combos: OfficialComboUsd[]): number {
  const matched = pickComboUsd(variant, combos);
  if (matched != null) return matched;
  return impliedUsdListFromSaleEur(variant.priceEur);
}

export function applyUsdPricingToProduct(product: Product, entry?: OfficialUsdPriceEntry): Product {
  const pool = combosForProduct(product, entry?.combos ?? []);
  const usedUsd = new Set<number>();

  const pricedVariants = product.variants.map((variant) => {
    let usd = pickComboUsd(variant, pool);
    if (usd != null && usedUsd.has(usd)) {
      const ranked = pool
        .filter((c) => !usedUsd.has(c.usd))
        .map((c) => ({ usd: c.usd, score: comboMatchScore(variant.comboName, c.title) }))
        .sort((a, b) => b.score - a.score);
      if (ranked[0]) usd = ranked[0].usd;
    }
    const resolved = usd ?? resolveVariantUsd(variant, pool);
    usedUsd.add(resolved);
    return { variant: { ...variant, priceEur: usdToSaleEur(resolved) }, usd: resolved };
  });

  const variants = pricedVariants.map((row) => row.variant);
  const cheapest = pricedVariants.reduce((min, row) => (row.variant.priceEur < min.variant.priceEur ? row : min));
  const baseUsd = cheapest.usd;

  return {
    ...product,
    basePriceEur: cheapest.variant.priceEur,
    compareAtPriceEur: usdToCompareAtEur(baseUsd),
    variants: variants.length ? variants : product.variants
  };
}

export function applyUsdPricingToProducts(products: Product[], cache: OfficialUsdPriceCache): Product[] {
  return products.map((product) => applyUsdPricingToProduct(product, cache[product.slug]));
}

import type { DatabaseMediaCache } from './databaseMediaCache';

function normalizeTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/^dji\s+/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((token) => token.length > 1);
}

/** Match an official combo title to the best child slug (e.g. osmo-action-5-pro-surfing-combo). */
export function resolveComboMediaSlug(
  productSlug: string,
  comboTitle: string,
  knownSlugs: string[]
): string {
  const candidates = knownSlugs.filter((slug) => slug === productSlug || slug.startsWith(`${productSlug}-`));
  if (!candidates.length) return productSlug;

  const titleTokens = new Set(normalizeTokens(comboTitle));
  let bestSlug = productSlug;
  let bestScore = -1;

  for (const slug of candidates) {
    const suffix = slug === productSlug ? '' : slug.slice(productSlug.length + 1);
    const slugTokens = suffix ? suffix.split('-').filter(Boolean) : ['standard'];

    let score = 0;
    for (const token of slugTokens) {
      if (titleTokens.has(token)) score += 3;
      for (const titleToken of titleTokens) {
        if (titleToken.includes(token) || token.includes(titleToken)) score += 1;
      }
    }

    if (/\bstandard\b/i.test(comboTitle) && slug === productSlug) score += 5;
    if (/\bstandard combo\b/i.test(comboTitle) && slug.endsWith('-standard-combo')) score += 6;
    if (/\bstandard combo\b/i.test(comboTitle) && slug === productSlug) score += 5;
    if (/\bcombo\b/i.test(comboTitle) && !/\bcreator\b/i.test(comboTitle) && slug.endsWith('-combo') && !slug.includes('creator')) score += 5;
    if (/\bsurfing\b/i.test(comboTitle) && slug.includes('surfing')) score += 6;
    if (/\bstreet photography\b/i.test(comboTitle) && slug.includes('street-photography')) score += 6;
    if (/\bvlog\b/i.test(comboTitle) && slug.includes('vlog')) score += 4;
    if (/\bcreator\b/i.test(comboTitle) && slug.includes('creator')) score += 6;
    if (/\bmic mini\b/i.test(comboTitle) && slug.includes('mic-mini')) score += 4;
    if (/\bmic 3\b/i.test(comboTitle) && slug.includes('mic-3')) score += 4;

    if (score > bestScore) {
      bestScore = score;
      bestSlug = slug;
    }
  }

  return bestSlug;
}

export function resolveVariantImageUrl(args: {
  productSlug: string;
  comboTitle: string;
  databaseMediaCache?: DatabaseMediaCache;
  fallback?: string;
}): string | undefined {
  const knownSlugs = Object.keys(args.databaseMediaCache ?? {});
  const mediaSlug = resolveComboMediaSlug(args.productSlug, args.comboTitle, knownSlugs);
  const entry = args.databaseMediaCache?.[mediaSlug];
  return entry?.cutout || entry?.hero || entry?.gallery?.[0] || args.fallback;
}

export function comboSlugsForProduct(productSlug: string, knownSlugs: string[]): string[] {
  return knownSlugs.filter((slug) => slug === productSlug || slug.startsWith(`${productSlug}-`));
}

/**
 * Copy fetched USD cache into src/data and regenerate catalog EUR snapshots.
 * Run after: npx tsx scripts/fetch-official-usd-prices.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { RAW_DJI_PRODUCTS } from '../src/data/products';
import { applyUsdPricingToProducts } from '../src/lib/pricing/applyUsdPricing';
import type { OfficialUsdPriceCache } from '../src/lib/pricing/applyUsdPricing';

const CACHE_SRC = '.tmp/official-usd-prices.json';
const CACHE_DEST = 'src/data/officialUsdPriceCache.json';

if (!existsSync(CACHE_SRC)) {
  console.error(`Missing ${CACHE_SRC}. Run fetch-official-usd-prices.ts first.`);
  process.exit(1);
}

const cache = JSON.parse(readFileSync(CACHE_SRC, 'utf8')) as OfficialUsdPriceCache;
writeFileSync(CACHE_DEST, JSON.stringify(cache, null, 2));

const priced = applyUsdPricingToProducts(RAW_DJI_PRODUCTS, cache);
const withStore = Object.values(cache).filter((e) => e.combos.length > 0).length;

console.log(`Wrote ${CACHE_DEST}`);
console.log(`Store USD prices: ${withStore}/${Object.keys(cache).length} slugs`);
console.log('Sample priced products:');
for (const slug of ['dji-air-3s', 'dji-mini-4-pro', 'dji-mavic-4-pro', 'dji-neo']) {
  const p = priced.find((x) => x.slug === slug);
  if (p) {
    console.log(
      `  ${slug}: €${p.basePriceEur}${p.compareAtPriceEur ? ` (was €${p.compareAtPriceEur})` : ''} · ${p.variants.length} variants`
    );
  }
}

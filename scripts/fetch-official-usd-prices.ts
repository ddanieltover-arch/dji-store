/**
 * Fetch store.dji.com USD list prices for all catalog slugs.
 * Run: npx tsx scripts/fetch-official-usd-prices.ts
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { RAW_DJI_PRODUCTS } from '../src/data/products';
import { fetchOfficialUsdPrices, OfficialUsdPriceEntry } from '../src/lib/pricing/fetchOfficialUsdPrices';

const CACHE_PATH = '.tmp/official-usd-prices.json';
const CONCURRENCY = 8;
const DELAY_MS = 150;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runPool<T, R>(items: T[], worker: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  async function next(): Promise<void> {
    const idx = i++;
    if (idx >= items.length) return;
    results[idx] = await worker(items[idx]);
    await sleep(DELAY_MS);
    await next();
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => next()));
  return results;
}

const existing: Record<string, OfficialUsdPriceEntry> = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  : {};

const slugs = [...new Set(RAW_DJI_PRODUCTS.map((p) => p.slug))].sort();
const pending = slugs.filter((s) => !existing[s]?.combos?.length);

console.log(`Catalog slugs: ${slugs.length}, cached: ${slugs.length - pending.length}, to fetch: ${pending.length}`);

mkdirSync('.tmp', { recursive: true });

let done = 0;
await runPool(
  pending,
  async (slug) => {
    try {
      const entry = await fetchOfficialUsdPrices(slug);
      existing[slug] = entry;
      done += 1;
      if (done % 25 === 0 || done === pending.length) {
        writeFileSync(CACHE_PATH, JSON.stringify(existing, null, 2));
        console.log(`Progress ${done}/${pending.length} — last ${slug} status=${entry.status} combos=${entry.combos.length}`);
      }
      return entry;
    } catch (err) {
      existing[slug] = {
        slug,
        status: 0,
        combos: [],
        fetchedAt: new Date().toISOString()
      };
      console.warn(`Failed ${slug}`, err);
      return existing[slug];
    }
  },
  CONCURRENCY
);

writeFileSync(CACHE_PATH, JSON.stringify(existing, null, 2));

const withPrices = Object.values(existing).filter((e) => e.combos.length > 0).length;
console.log(`Done. ${withPrices}/${slugs.length} slugs have USD combo prices.`);

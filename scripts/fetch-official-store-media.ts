/**
 * Fetch store.dji.com cover images for all catalog slugs.
 * Run: npx tsx scripts/fetch-official-store-media.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { RAW_DJI_PRODUCTS } from '../src/data/products';
import {
  fetchOfficialStoreMedia,
  OfficialStoreMediaCache
} from '../src/lib/pim/fetchOfficialStoreMedia';

const CACHE_PATH = 'src/data/officialStoreMediaCache.json';
const CONCURRENCY = 10;
const DELAY_MS = 120;

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

const existing: OfficialStoreMediaCache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  : {};

const slugs = [...new Set(RAW_DJI_PRODUCTS.map((p) => p.slug))].sort();
const pending = slugs.filter((s) => !existing[s]?.coverOriginal || !existing[s]?.carouselGallery?.length);

console.log(`Catalog slugs: ${slugs.length}, cached: ${slugs.length - pending.length}, to fetch: ${pending.length}`);

let done = 0;
await runPool(
  pending,
  async (slug) => {
    try {
      const entry = await fetchOfficialStoreMedia(slug);
      existing[slug] = entry;
      done += 1;
      if (done % 25 === 0 || done === pending.length) {
        writeFileSync(CACHE_PATH, JSON.stringify(existing, null, 2));
        console.log(`Progress ${done}/${pending.length} — last ${slug} status=${entry.status}`);
      }
      return entry;
    } catch (err) {
      existing[slug] = {
        slug,
        status: 0,
        fetchedAt: new Date().toISOString()
      };
      console.warn(`Failed ${slug}`, err);
      return existing[slug];
    }
  },
  CONCURRENCY
);

writeFileSync(CACHE_PATH, JSON.stringify(existing, null, 2));

const withCover = Object.values(existing).filter((e) => e.coverOriginal).length;
console.log(`Done. ${withCover}/${slugs.length} slugs have official cover URLs.`);

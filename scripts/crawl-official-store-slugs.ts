/**
 * BFS crawl of store.dji.com PDP pages — extracts embedded product slugs from SSR HTML.
 * Run: npx tsx scripts/crawl-official-store-slugs.ts
 */
import { writeFileSync } from 'node:fs';
import { DJI_PRODUCTS } from '../src/data/products';
import { WAVE4_DISCOVERY_UNIVERSE } from '../src/data/wave4OfficialCatalog';
import { OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS } from '../src/data/officialStoreHomepageManifest';

const SKIP = new Set([
  'accessories',
  'affirm-instalment',
  'product-layout',
  'pc-benefit-block',
  'parameter-contrast-dji-inspire-3',
  'product-warehouse-dji-inspire-3',
  'product-warehouse-inspire-2'
]);

const SKIP_PREFIX = /^(nav-|benefit|fullscreen|guide|mobile|product-columns|store-new|new-arrival|product-page-benefit|product-warehouse)/;

function extractSlugs(html: string): string[] {
  const re = /"slug":"([a-z0-9-]+)"/g;
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const slug = m[1];
    if (SKIP.has(slug) || SKIP_PREFIX.test(slug)) continue;
    if (/^[a-f0-9]{32}$/.test(slug)) continue;
    if (/^[A-Z]/.test(slug)) continue;
    out.add(slug);
  }
  return [...out];
}

async function fetchSlugs(slug: string): Promise<string[]> {
  const url = `https://store.dji.com/product/${slug}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (DJI Store EU catalog sync)' }
  });
  if (!res.ok) return [];
  const html = await res.text();
  return extractSlugs(html);
}

async function main() {
  const seeds = [
    ...new Set([
      ...DJI_PRODUCTS.map((p) => p.slug),
      ...WAVE4_DISCOVERY_UNIVERSE.map((u) => u.slug),
      ...OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS
    ])
  ];

  const discovered = new Set<string>(seeds);
  const queue = [...seeds];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const batch = queue.splice(0, 8);
    const results = await Promise.all(
      batch.map(async (slug) => {
        if (visited.has(slug)) return [] as string[];
        visited.add(slug);
        try {
          return await fetchSlugs(slug);
        } catch {
          return [] as string[];
        }
      })
    );

    for (const found of results.flat()) {
      if (!discovered.has(found)) {
        discovered.add(found);
        queue.push(found);
      }
    }
    process.stdout.write(`\rvisited ${visited.size} · discovered ${discovered.size} · queue ${queue.length}   `);
  }

  console.log('\n');
  const sorted = [...discovered].sort();
  const catalogSlugs = new Set(DJI_PRODUCTS.map((p) => p.slug));
  const missing = sorted.filter((s) => !catalogSlugs.has(s));

  const outPath = '.tmp/wave6-official-slugs.json';
  writeFileSync(
    outPath,
    JSON.stringify({ crawledAt: new Date().toISOString(), total: sorted.length, slugs: sorted, missingFromCatalog: missing }, null, 2)
  );

  console.log(`Discovered ${sorted.length} official slugs`);
  console.log(`Missing from DJI_PRODUCTS: ${missing.length}`);
  missing.slice(0, 40).forEach((s) => console.log(`  - ${s}`));
  if (missing.length > 40) console.log(`  ... and ${missing.length - 40} more`);
  console.log(`\nWrote ${outPath}`);
}

main();

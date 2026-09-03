/**
 * Ingest 1 listing image per placeholder product into public/media/listings/
 * without writing BYTEA to Neon (use when db_assets hits storage limits).
 *
 *   npm run media:ingest:static
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAW_DJI_PRODUCTS } from '../../src/data/products';
import officialStoreMediaCache from '../../src/data/officialStoreMediaCache.json';
import type { OfficialStoreMediaCache } from '../../src/lib/pim/fetchOfficialStoreMedia';
import type { DatabaseMediaCache } from '../../src/lib/pim/databaseMediaCache';
import { formatFromContentType, mimeFromFileName, normalizeContentType } from '../../src/lib/storage/assetHelpers';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const CACHE_PATH = path.join(repoRoot, 'src', 'data', 'productDatabaseMediaCache.json');
const OUT_DIR = path.join(repoRoot, 'public', 'media', 'listings');
const mediaCache = officialStoreMediaCache as OfficialStoreMediaCache;

const limitArg = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? 0);
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSourceUrl(url: string): string {
  return url.split('?')[0];
}

function listingSource(slug: string): string | null {
  const media = mediaCache[slug];
  if (media?.coverOriginal) return normalizeSourceUrl(media.coverOriginal);
  if (media?.coverLarge) return normalizeSourceUrl(media.coverLarge);
  const frame = media?.carouselGallery?.find((f) => f.startsWith('http'));
  return frame ? normalizeSourceUrl(frame) : null;
}

function readCache(): DatabaseMediaCache {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as DatabaseMediaCache;
}

function writeCache(cache: DatabaseMediaCache): void {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function download(url: string): Promise<{ data: Buffer; ext: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DJI-Store-EU-StaticIngest/1.0', Accept: 'image/*' }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  const contentType =
    normalizeContentType(response.headers.get('content-type') ?? undefined, url) ??
    mimeFromFileName(url) ??
    'image/jpeg';
  return { data, ext: formatFromContentType(contentType) };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const cache = readCache();

  let products = RAW_DJI_PRODUCTS.filter((p) => {
    if (cache[p.slug]?.hero || cache[p.slug]?.cutout) return false;
    return Boolean(listingSource(p.slug));
  });

  if (slugArg) products = products.filter((p) => p.slug === slugArg);
  if (limitArg > 0) products = products.slice(0, limitArg);

  console.log(`Static listing ingest for ${products.length} products → ${OUT_DIR}`);
  let ingested = 0;
  let failed = 0;

  for (const product of products) {
    const source = listingSource(product.slug);
    if (!source) continue;

    try {
      const { data, ext } = await download(source);
      const fileName = `${product.slug}.${ext}`;
      writeFileSync(path.join(OUT_DIR, fileName), data);
      const url = `/media/listings/${fileName}`;
      cache[product.slug] = {
        slug: product.slug,
        hero: url,
        cutout: url,
        gallery: [url],
        ingestedAt: new Date().toISOString()
      };
      ingested += 1;
      console.log(`✓ ${product.slug}`);

      if (ingested % 25 === 0) writeCache(cache);
    } catch (err) {
      failed += 1;
      console.warn(`skip ${product.slug}:`, err instanceof Error ? err.message : err);
    }

    await sleep(150);
  }

  writeCache(cache);
  console.log(`Done. ${ingested} ingested, ${failed} failed. Total cached: ${Object.keys(cache).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

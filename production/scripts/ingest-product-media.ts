/**
 * Ingest product images into Postgres db_assets and write productDatabaseMediaCache.json.
 *
 * Run from repo root:
 *   npm run media:ingest
 *   npm run media:ingest -- --slug=dji-mavic-3-pro
 *   npm run media:ingest -- --limit=25
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { RAW_DJI_PRODUCTS } from '../../src/data/products';
import officialStoreMediaCache from '../../src/data/officialStoreMediaCache.json';
import type { OfficialStoreMediaCache } from '../../src/lib/pim/fetchOfficialStoreMedia';
import type { DatabaseMediaCache } from '../../src/lib/pim/databaseMediaCache';
import {
  assetPublicUrl,
  ingestAssetFromUrl,
  ingestUploadedFile,
  linkProductMedia
} from '../src/lib/storage/assets';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const productionRoot = path.resolve(scriptDir, '..');

config({ path: path.join(productionRoot, '.env.local') });

const CACHE_PATH = path.join(repoRoot, 'src', 'data', 'productDatabaseMediaCache.json');
const PUBLIC_PRODUCTS = path.join(repoRoot, 'public', 'products');
const mediaCache = officialStoreMediaCache as OfficialStoreMediaCache;

const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];
const limitArg = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? 0);

function collectSourceUrls(slug: string, productId: string): string[] {
  const media = mediaCache[slug];
  const urls = new Set<string>();

  if (media?.coverOriginal) urls.add(media.coverOriginal);
  if (media?.coverLarge) urls.add(media.coverLarge);
  for (const frame of media?.carouselGallery ?? []) {
    if (frame.startsWith('http')) urls.add(frame);
  }

  for (const suffix of ['-cutout.png', '-gallery-2.png', '-gallery-3.png']) {
    const localPath = path.join(PUBLIC_PRODUCTS, `${productId}${suffix}`);
    if (existsSync(localPath)) {
      urls.add(`/products/${productId}${suffix}`);
    }
  }

  return [...urls];
}

async function ingestUrl(url: string, fileName: string) {
  if (url.startsWith('/')) {
    const localPath = path.join(repoRoot, 'public', url.replace(/^\//, ''));
    const data = readFileSync(localPath);
    return ingestUploadedFile({
      data,
      fileName: path.basename(localPath)
    });
  }

  return ingestAssetFromUrl(url, fileName);
}

async function ingestProduct(slug: string, productId: string): Promise<DatabaseMediaCache[string] | null> {
  const sources = collectSourceUrls(slug, productId);
  if (!sources.length) return null;

  const gallery: string[] = [];
  let hero: string | undefined;
  let cutout: string | undefined;

  for (const [index, sourceUrl] of sources.entries()) {
    try {
      const stored = await ingestUrl(sourceUrl, `${slug}-${index}`);
      gallery.push(stored.url);
      if (!hero) hero = stored.url;
      if (sourceUrl.includes('cutout') || sourceUrl.includes('cover')) {
        cutout = stored.url;
      }

      try {
        await linkProductMedia({
          productId,
          assetId: stored.id,
          role: index === 0 ? 'hero' : 'gallery',
          contentHash: stored.contentHash,
          contentType: stored.contentType,
          sourceUrl
        });
      } catch {
        // product row may not exist in DB yet during migration
      }
    } catch (err) {
      console.warn(`skip ${slug} ${sourceUrl}:`, err instanceof Error ? err.message : err);
    }
  }

  if (gallery.length < 1) return null;

  return {
    slug,
    hero: hero ?? gallery[0],
    cutout: cutout ?? gallery[0],
    gallery,
    ingestedAt: new Date().toISOString()
  };
}

async function main() {
  const existing: DatabaseMediaCache = existsSync(CACHE_PATH)
    ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
    : {};

  let products = RAW_DJI_PRODUCTS;
  if (slugArg) {
    products = products.filter((p) => p.slug === slugArg);
    if (!products.length) {
      console.error(`slug not found: ${slugArg}`);
      process.exit(1);
    }
  } else if (limitArg > 0) {
    products = products
      .filter((p) => {
        const media = mediaCache[p.slug];
        return Boolean(media?.carouselGallery?.length || media?.coverOriginal);
      })
      .slice(0, limitArg);
  }

  console.log(`Ingesting media for ${products.length} products → ${CACHE_PATH}`);
  let ingested = 0;

  for (const product of products) {
    if (existing[product.slug]?.gallery?.length) {
      continue;
    }

    const entry = await ingestProduct(product.slug, product.id);
    if (entry) {
      existing[product.slug] = entry;
      ingested += 1;
      console.log(`✓ ${product.slug} (${entry.gallery?.length ?? 0} frames)`);
    }
  }

  writeFileSync(CACHE_PATH, JSON.stringify(existing, null, 2));
  console.log(`Done. ${ingested} products ingested. Total cached: ${Object.keys(existing).length}`);
  console.log(`Asset base: ${assetPublicUrl('00000000-0000-0000-0000-000000000001').replace(/\/api\/assets\/.*$/, '')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

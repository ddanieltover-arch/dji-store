/**
 * Ingest product images into Postgres db_assets and write productDatabaseMediaCache.json.
 *
 * Run from repo root:
 *   npm run media:ingest
 *   npm run media:ingest -- --slug=osmo-action-5-pro
 *   npm run media:ingest -- --limit=50
 *   npm run media:ingest -- --force
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { RAW_DJI_PRODUCTS } from '../../src/data/products';
import { OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS } from '../../src/data/officialStoreHomepageManifest';
import officialStoreMediaCache from '../../src/data/officialStoreMediaCache.json';
import type { OfficialStoreMediaCache } from '../../src/lib/pim/fetchOfficialStoreMedia';
import type { DatabaseMediaCache } from '../../src/lib/pim/databaseMediaCache';
import { comboSlugsForProduct } from '../../src/lib/pim/comboSlugResolver';
import {
  assetServePath,
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
const force = process.argv.includes('--force');
const priority = process.argv.includes('--priority');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSourceUrl(url: string): string {
  return url.split('?')[0];
}

function collectSourceUrls(slug: string, productId: string): string[] {
  const media = mediaCache[slug];
  const urls = new Set<string>();

  if (media?.coverOriginal) urls.add(normalizeSourceUrl(media.coverOriginal));
  if (media?.coverLarge) urls.add(normalizeSourceUrl(media.coverLarge));
  for (const frame of media?.carouselGallery ?? []) {
    if (frame.startsWith('http')) urls.add(normalizeSourceUrl(frame));
  }

  const catalogProduct = RAW_DJI_PRODUCTS.find((product) => product.slug === slug);
  if (catalogProduct) {
    for (const suffix of ['-cutout.png', '-gallery-2.png', '-gallery-3.png']) {
      const localPath = path.join(PUBLIC_PRODUCTS, `${catalogProduct.id}${suffix}`);
      if (existsSync(localPath)) {
        urls.add(`/products/${catalogProduct.id}${suffix}`);
      }
    }
  } else if (slug === RAW_DJI_PRODUCTS.find((p) => p.id === productId)?.slug) {
    for (const suffix of ['-cutout.png', '-gallery-2.png', '-gallery-3.png']) {
      const localPath = path.join(PUBLIC_PRODUCTS, `${productId}${suffix}`);
      if (existsSync(localPath)) {
        urls.add(`/products/${productId}${suffix}`);
      }
    }
  }

  return [...urls];
}

function readCache(): DatabaseMediaCache {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as DatabaseMediaCache;
}

function persistCache(mutator: (cache: DatabaseMediaCache) => void): void {
  const lockPath = `${CACHE_PATH}.lock`;
  const tmpPath = `${CACHE_PATH}.tmp`;
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let acquired = false;
    try {
      if (existsSync(lockPath)) {
        const start = Date.now();
        while (existsSync(lockPath) && Date.now() - start < 5000) {
          // spin-wait for concurrent ingest
        }
        if (existsSync(lockPath)) continue;
      }

      writeFileSync(lockPath, String(process.pid), { flag: 'wx' });
      acquired = true;
      const current = readCache();
      mutator(current);
      writeFileSync(tmpPath, JSON.stringify(current, null, 2));
      renameSync(tmpPath, CACHE_PATH);
      return;
    } catch {
      if (existsSync(tmpPath)) {
        try {
          unlinkSync(tmpPath);
        } catch {
          // ignore
        }
      }
    } finally {
      if (acquired && existsSync(lockPath)) {
        try {
          unlinkSync(lockPath);
        } catch {
          // ignore
        }
      }
    }
  }

  throw new Error(`Could not persist media cache after ${maxAttempts} attempts`);
}

async function ingestUrl(url: string, fileName: string, attempt = 0) {
  try {
    if (url.startsWith('/')) {
      const localPath = path.join(repoRoot, 'public', url.replace(/^\//, ''));
      const data = readFileSync(localPath);
      const stored = await ingestUploadedFile({
        data,
        fileName: path.basename(localPath)
      });
      return { ...stored, url: assetServePath(stored.id) };
    }

    const stored = await ingestAssetFromUrl(url, fileName);
    return { ...stored, url: assetServePath(stored.id) };
  } catch (err) {
    if (attempt < 2) {
      await sleep(1500 * (attempt + 1));
      return ingestUrl(url, fileName, attempt + 1);
    }
    throw err;
  }
}

async function ingestSlug(slug: string, productId: string): Promise<DatabaseMediaCache[string] | null> {
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
  const lockPath = `${CACHE_PATH}.lock`;
  if (existsSync(lockPath)) {
    console.error(
      `Another media ingest appears to be running (lock: ${lockPath}). ` +
        'Stop it before starting a new ingest to avoid cache corruption.'
    );
    process.exit(1);
  }

  let products = RAW_DJI_PRODUCTS.filter((p) => {
    const media = mediaCache[p.slug];
    return Boolean(media?.carouselGallery?.length || media?.coverOriginal);
  });

  if (priority) {
    const prioritySet = new Set<string>(OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS);
    for (const slug of OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS) {
      for (const child of comboSlugsForProduct(slug, Object.keys(mediaCache))) {
        prioritySet.add(child);
      }
    }
    products = RAW_DJI_PRODUCTS.filter((p) => prioritySet.has(p.slug));
  } else if (slugArg) {
    products = products.filter((p) => p.slug === slugArg);
    if (!products.length) {
      const fallback = RAW_DJI_PRODUCTS.filter((p) => p.slug === slugArg);
      if (!fallback.length) {
        console.error(`slug not found: ${slugArg}`);
        process.exit(1);
      }
      products = fallback;
    }
  } else if (limitArg > 0) {
    products = products.slice(0, limitArg);
  }

  console.log(`Ingesting media for ${products.length} products → ${CACHE_PATH}`);
  let ingested = 0;

  for (const product of products) {
    const slugsToIngest = [
      product.slug,
      ...comboSlugsForProduct(product.slug, Object.keys(mediaCache)).filter((slug) => slug !== product.slug)
    ];

    const cached = readCache();
    const batch: DatabaseMediaCache = {};

    for (const slug of slugsToIngest) {
      if (!force && cached[slug]?.gallery?.length) {
        continue;
      }

      const entry = await ingestSlug(slug, product.id);
      if (entry) {
        batch[slug] = entry;
        ingested += 1;
        console.log(`✓ ${slug} (${entry.gallery?.length ?? 0} frames)`);
      }
      await sleep(250);
    }

    if (Object.keys(batch).length) {
      persistCache((cache) => {
        Object.assign(cache, batch);
      });
    }
  }

  console.log(`Done. ${ingested} products ingested. Total cached: ${Object.keys(readCache()).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

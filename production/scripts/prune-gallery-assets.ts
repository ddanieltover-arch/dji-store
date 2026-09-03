/**
 * Free Neon space by keeping only listing images (hero/cutout) referenced in
 * productDatabaseMediaCache.json. Deletes unused gallery BYTEA rows.
 *
 *   npx tsx --tsconfig production/tsconfig.json production/scripts/prune-gallery-assets.ts
 *   npx tsx --tsconfig production/tsconfig.json production/scripts/prune-gallery-assets.ts --dry-run
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import type { DatabaseMediaCache } from '../../src/lib/pim/databaseMediaCache';
import { createDb } from '../src/lib/db/client';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const productionRoot = path.resolve(scriptDir, '..');
config({ path: path.join(productionRoot, '.env.local') });

const CACHE_PATH = path.join(repoRoot, 'src', 'data', 'productDatabaseMediaCache.json');
const dryRun = process.argv.includes('--dry-run');
const listingOnly = process.argv.includes('--listing-only');

const ASSET_RE = /\/api\/assets\/([0-9a-f-]{36})/i;

function assetIdFromUrl(url?: string): string | null {
  if (!url) return null;
  const m = url.match(ASSET_RE);
  return m?.[1] ?? null;
}

async function main() {
  if (!existsSync(CACHE_PATH)) {
    console.error('Missing cache');
    process.exit(1);
  }

  const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as DatabaseMediaCache;
  const keep = new Set<string>();

  for (const [slug, entry] of Object.entries(cache)) {
    const hero = assetIdFromUrl(entry.hero) ?? assetIdFromUrl(entry.cutout) ?? assetIdFromUrl(entry.gallery?.[0]);
    const cutout = assetIdFromUrl(entry.cutout) ?? hero;
    if (hero) keep.add(hero);
    if (cutout) keep.add(cutout);

    if (listingOnly && hero) {
      const url = entry.hero || entry.cutout || entry.gallery?.[0];
      if (url) {
        cache[slug] = {
          slug,
          hero: url,
          cutout: url,
          gallery: [url],
          ingestedAt: entry.ingestedAt
        };
      }
    } else {
      for (const g of entry.gallery ?? []) {
        const id = assetIdFromUrl(g);
        if (id) keep.add(id);
      }
    }
  }

  const sql = createDb();
  const sizeRows = await sql`
    SELECT
      COUNT(*)::int AS asset_count,
      COALESCE(SUM(byte_size), 0)::bigint AS total_bytes
    FROM db_assets
  `;
  const beforeCount = Number(sizeRows[0].asset_count);
  const beforeBytes = Number(sizeRows[0].total_bytes);

  const allRows = await sql`SELECT id::text AS id FROM db_assets`;
  const allIds = allRows.map((r) => String(r.id));
  const deleteIds = allIds.filter((id) => !keep.has(id));

  console.log(
    JSON.stringify(
      {
        dryRun,
        listingOnly,
        keep: keep.size,
        delete: deleteIds.length,
        beforeAssets: beforeCount,
        beforeMB: Math.round(beforeBytes / 1024 / 1024)
      },
      null,
      2
    )
  );

  if (dryRun || !deleteIds.length) {
    if (listingOnly && !dryRun) {
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
      console.log('Cache slimmed to listing-only URLs.');
    }
    return;
  }

  // Delete in chunks to avoid huge queries
  const chunkSize = 50;
  let deleted = 0;
  for (let i = 0; i < deleteIds.length; i += chunkSize) {
    const chunk = deleteIds.slice(i, i + chunkSize);
    await sql`DELETE FROM product_media WHERE asset_id = ANY(${chunk}::uuid[])`;
    await sql`DELETE FROM support_attachments WHERE asset_id = ANY(${chunk}::uuid[])`;
    await sql`DELETE FROM db_assets WHERE id = ANY(${chunk}::uuid[])`;
    deleted += chunk.length;
    console.log(`… deleted ${deleted}/${deleteIds.length}`);
  }

  if (listingOnly) {
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  }

  const afterRows = await sql`
    SELECT
      COUNT(*)::int AS asset_count,
      COALESCE(SUM(byte_size), 0)::bigint AS total_bytes
    FROM db_assets
  `;
  console.log(
    `Done. Assets ${beforeCount} → ${afterRows[0].asset_count}, ` +
      `${Math.round(beforeBytes / 1024 / 1024)}MB → ${Math.round(Number(afterRows[0].total_bytes) / 1024 / 1024)}MB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Free Neon space by deleting product image BYTEA that is already on disk
 * (public/media) and not linked as a support attachment (receipts).
 *
 *   npx tsx --tsconfig production/tsconfig.json production/scripts/free-neon-media-bytes.ts
 *   npx tsx --tsconfig production/tsconfig.json production/scripts/free-neon-media-bytes.ts --dry-run
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { createDb } from '../src/lib/db/client';

const productionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(productionRoot, '..');
config({ path: path.join(productionRoot, '.env.local') });

const dryRun = process.argv.includes('--dry-run');
const CACHE_PATH = path.join(repoRoot, 'src', 'data', 'productDatabaseMediaCache.json');
const ASSET_RE = /\/api\/assets\/([0-9a-f-]{36})/gi;

function collectCacheAssetIds(): Set<string> {
  if (!existsSync(CACHE_PATH)) return new Set();
  const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as Record<
    string,
    { hero?: string; cutout?: string; gallery?: string[] }
  >;
  const ids = new Set<string>();
  for (const entry of Object.values(cache)) {
    for (const url of [entry.hero, entry.cutout, ...(entry.gallery ?? [])]) {
      if (!url) continue;
      ASSET_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = ASSET_RE.exec(url))) ids.add(m[1]);
    }
  }
  return ids;
}

async function main() {
  const sql = createDb();
  const productAssetIds = [...collectCacheAssetIds()];

  const before = await sql`
    SELECT COUNT(*)::int AS n, COALESCE(SUM(byte_size), 0)::bigint AS bytes
    FROM db_assets WHERE data IS NOT NULL
  `;

  console.log(
    JSON.stringify(
      {
        dryRun,
        productAssetsInCache: productAssetIds.length,
        beforeRowsWithData: before[0].n,
        beforeMB: Math.round(Number(before[0].bytes) / 1024 / 1024)
      },
      null,
      2
    )
  );

  if (dryRun || !productAssetIds.length) return;

  // Unlink product_media → delete assets not used by support_attachments
  const chunkSize = 40;
  let deleted = 0;
  for (let i = 0; i < productAssetIds.length; i += chunkSize) {
    const chunk = productAssetIds.slice(i, i + chunkSize);
    await sql`DELETE FROM product_media WHERE asset_id = ANY(${chunk}::uuid[])`;
    const removable = await sql`
      SELECT a.id::text AS id
      FROM db_assets a
      WHERE a.id = ANY(${chunk}::uuid[])
        AND NOT EXISTS (
          SELECT 1 FROM support_attachments s WHERE s.asset_id = a.id
        )
    `;
    const ids = removable.map((r) => String(r.id));
    if (ids.length) {
      await sql`DELETE FROM db_assets WHERE id = ANY(${ids}::uuid[])`;
      deleted += ids.length;
    }
    console.log(`… processed ${Math.min(i + chunkSize, productAssetIds.length)}/${productAssetIds.length}, deleted ${deleted}`);
  }

  const after = await sql`
    SELECT COUNT(*)::int AS n, COALESCE(SUM(byte_size), 0)::bigint AS bytes
    FROM db_assets WHERE data IS NOT NULL
  `;
  console.log(
    `Done. BYTEA rows ${before[0].n} → ${after[0].n}, ` +
      `${Math.round(Number(before[0].bytes) / 1024 / 1024)}MB → ${Math.round(Number(after[0].bytes) / 1024 / 1024)}MB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

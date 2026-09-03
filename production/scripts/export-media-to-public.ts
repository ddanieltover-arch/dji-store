/**
 * Export db_assets to public/media/assets for static Vite deploys (djii.eu).
 * Rewrites are not required — images load from /media/assets/{id}.{ext}.
 *
 *   npm run media:export
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { formatFromContentType } from '../../src/lib/storage/assetHelpers';
import type { DatabaseMediaCache } from '../../src/lib/pim/databaseMediaCache';
import { fetchAsset } from '../src/lib/storage/assets';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const productionRoot = path.resolve(scriptDir, '..');

config({ path: path.join(productionRoot, '.env.local') });

const CACHE_PATH = path.join(repoRoot, 'src', 'data', 'productDatabaseMediaCache.json');
const MANIFEST_PATH = path.join(repoRoot, 'src', 'data', 'staticAssetManifest.json');
const OUTPUT_DIR = path.join(repoRoot, 'public', 'media', 'assets');

function collectAssetIds(cache: DatabaseMediaCache): Set<string> {
  const ids = new Set<string>();
  const re = /\/api\/assets\/([0-9a-f-]{36})/gi;

  for (const entry of Object.values(cache)) {
    for (const url of [entry.hero, entry.cutout, ...(entry.gallery ?? [])]) {
      if (!url) continue;
      let match: RegExpExecArray | null;
      const haystack = url;
      re.lastIndex = 0;
      while ((match = re.exec(haystack))) {
        ids.add(match[1]);
      }
    }
  }

  return ids;
}

async function main() {
  if (!existsSync(CACHE_PATH)) {
    console.error(`Missing cache: ${CACHE_PATH}`);
    process.exit(1);
  }

  const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as DatabaseMediaCache;
  const assetIds = [...collectAssetIds(cache)];
  const manifest: Record<string, string> = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
    : {};

  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Exporting ${assetIds.length} assets → ${OUTPUT_DIR}`);

  let exported = 0;
  let skipped = 0;

  for (const assetId of assetIds) {
    const ext = manifest[assetId];
    const outPath = ext ? path.join(OUTPUT_DIR, `${assetId}.${ext}`) : null;
    if (outPath && existsSync(outPath)) {
      skipped += 1;
      continue;
    }

    try {
      const asset = await fetchAsset(assetId);
      if (!asset) {
        console.warn(`skip missing asset ${assetId}`);
        continue;
      }

      const format = formatFromContentType(asset.contentType);
      const filePath = path.join(OUTPUT_DIR, `${assetId}.${format}`);
      writeFileSync(filePath, asset.data);
      manifest[assetId] = format;
      exported += 1;

      if (exported % 25 === 0) {
        writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log(`… ${exported} exported`);
      }
    } catch (err) {
      console.warn(`skip ${assetId}:`, err instanceof Error ? err.message : err);
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Done. ${exported} exported, ${skipped} already present. Manifest: ${Object.keys(manifest).length} assets.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

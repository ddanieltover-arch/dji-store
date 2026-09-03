import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { formatFromContentType, mimeFromFileName, normalizeContentType } from '../src/lib/storage/assetHelpers';

const OUT_DIR = path.join('public', 'media', 'listings');
const MEDIA_CACHE = path.join('src', 'data', 'officialStoreMediaCache.json');
const DB_CACHE = path.join('src', 'data', 'productDatabaseMediaCache.json');

const covers: Record<string, string> = {
  'dji-65w-car-charger':
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/dcb346f25755659b6bf53b45e843c837@origin.png',
  'dji-mavic-3-battery-charging-hub':
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/407649266c3cfa5fd5783554eac3a690@origin.png',
  'dji-mic-3-mobile-phone-adapter-lightning':
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/c900c6d37d5e6ee64405d99b768355d9@origin.png',
  'osmo-action-combo-battery':
    'https://se-cdn.djiits.com/tpc/uploads/spu_bundle/cover/76083cabaff1971e8cf3983bcad6f8e7@origin.png',
  'osmo-flexible-mount':
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/8378a3c90a0a7e1168db988120e9f277@origin.png',
  'pgytech-mavic-2-dji-goggles-protector-case':
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/7ae0f61d-9a43-479f-975c-1926c4e7e8fc@origin.png'
};

mkdirSync(OUT_DIR, { recursive: true });
const media = JSON.parse(readFileSync(MEDIA_CACHE, 'utf8'));
const db = JSON.parse(readFileSync(DB_CACHE, 'utf8'));

for (const [slug, url] of Object.entries(covers)) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DJI-Store-EU/1.0', Accept: 'image/*' }
  });
  if (!res.ok) {
    console.warn('fail', slug, res.status);
    continue;
  }
  const data = Buffer.from(await res.arrayBuffer());
  const ct =
    normalizeContentType(res.headers.get('content-type') ?? undefined, url) ??
    mimeFromFileName(url) ??
    'image/png';
  const ext = formatFromContentType(ct);
  writeFileSync(path.join(OUT_DIR, `${slug}.${ext}`), data);
  const publicUrl = `/media/listings/${slug}.${ext}`;
  media[slug] = {
    slug,
    status: 200,
    coverOriginal: url,
    coverLarge: url.replace('@origin', '@large'),
    fetchedAt: new Date().toISOString()
  };
  db[slug] = {
    slug,
    hero: publicUrl,
    cutout: publicUrl,
    gallery: [publicUrl],
    ingestedAt: new Date().toISOString()
  };
  console.log('✓', slug, publicUrl);
}

writeFileSync(MEDIA_CACHE, JSON.stringify(media, null, 2));
writeFileSync(DB_CACHE, JSON.stringify(db, null, 2));
console.log('Total cached:', Object.keys(db).length);

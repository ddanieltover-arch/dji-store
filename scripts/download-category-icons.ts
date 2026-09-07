/**
 * Download official store.dji.com homepage series icons into public/.
 * Run: npx tsx scripts/download-category-icons.ts
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'public/home/category-strip';
mkdirSync(OUT_DIR, { recursive: true });

const items = existsSync('.tmp/category-icons.json')
  ? (JSON.parse(readFileSync('.tmp/category-icons.json', 'utf8')) as Array<{ label: string; image: string }>)
  : [];

if (!items.length) {
  console.error('Missing .tmp/category-icons.json — run _probe-category-icons.ts first');
  process.exit(1);
}

const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const manifest: Array<{ id: string; label: string; imageSrc: string; remote: string }> = [];

for (const item of items) {
  if (!item.image) {
    console.warn('skip (no image)', item.label);
    continue;
  }
  const id = slugify(item.label);
  const fileName = `${id}.png`;
  const dest = path.join(OUT_DIR, fileName);
  const remote = item.image.startsWith('//') ? `https:${item.image}` : item.image;

  const res = await fetch(remote, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  });
  if (!res.ok) {
    console.warn('failed', item.label, res.status, remote);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log('saved', dest, buf.length);
  manifest.push({
    id,
    label: item.label,
    imageSrc: `/home/category-strip/${fileName}`,
    remote
  });
}

writeFileSync('.tmp/category-icons-manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Done: ${manifest.length}/${items.length}`);

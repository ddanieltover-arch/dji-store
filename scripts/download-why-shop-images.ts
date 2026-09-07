/**
 * Download official store.dji.com "Why shop with DJI Store" card images.
 * Run: npx tsx scripts/download-why-shop-images.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'public/home/why-shop';
mkdirSync(OUT_DIR, { recursive: true });

const items = [
  {
    id: 'credit',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/b32772747fa866ff571cd1f570b996ce.jpg'
  },
  {
    id: 'free-shipping',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/58e1314444efe9e1306bd48d297c27ea.jpg?h=256&w=576'
  },
  {
    id: 'in-stock',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/5f0a644fb1e5d36de0b8bf33256d41f4.jpg?h=1536&w=2304'
  },
  {
    id: 'fast-delivery',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/a1c0a74cebf70d4f4f11cc4f11103b8f.jpg'
  },
  {
    id: 'refurbished',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/360470791393a60bf3eca6efce83c643.png?h=768&w=1152'
  },
  {
    id: 'returns',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/2c7c0d0507b34dbe2363f636b09b445e.jpg'
  },
  {
    id: 'expert-help',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/2f9c9750c0b510ed1cd0736aa45dca92.jpg'
  }
];

for (const item of items) {
  const ext = item.url.includes('.png') ? 'png' : 'jpg';
  const dest = path.join(OUT_DIR, `${item.id}.${ext}`);
  const res = await fetch(item.url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  });
  if (!res.ok) {
    console.warn('failed', item.id, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log('saved', dest, buf.length);
}

console.log('done');

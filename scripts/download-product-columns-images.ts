/**
 * Download official Handheld · Pro Shooting product-column images.
 * Run: npx tsx scripts/download-product-columns-images.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT = 'public/home/product-columns/handheld';
mkdirSync(OUT, { recursive: true });

const files: Array<{ file: string; url: string }> = [
  // Primary RS 5
  {
    file: 'rs-5-primary.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/4048945693033536766234ce05dc0243.jpg?h=1330&w=3328'
  },
  // RS 4 Mini gallery
  {
    file: 'rs-4-mini-1.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/fbde6ad1a4fbefcc990b5f38ec790243.jpg?h=576&w=576'
  },
  {
    file: 'rs-4-mini-2.png',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/533dbcd0bb5368cc672c0e81b5c481ee.png?h=576&w=576'
  },
  {
    file: 'rs-4-mini-3.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/5022397088e5a7092de7a72c0503d955.jpg?h=576&w=576'
  },
  // RS 4 Pro gallery
  {
    file: 'rs-4-pro-1.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/05707c24af02c48cb41db740e1c73244.jpg?h=576&w=576'
  },
  {
    file: 'rs-4-pro-2.png',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/035bc171495421038c2e2c43c10138ef.png?h=576&w=576'
  },
  {
    file: 'rs-4-pro-3.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/f5402c39b7acd9975b773643ef8c9325.jpg?h=576&w=576'
  },
  // Ronin 4D
  {
    file: 'ronin-4d-1.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/6c1962a71e5fc73e88a8bb0a538ea49b.jpg'
  },
  // SDR Transmission
  {
    file: 'sdr-1.png',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/eae865c6917daa0d8ed14e471ed9781c.png?h=576&w=576'
  },
  {
    file: 'sdr-2.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/a97dff4249b315fd953da0aa0fca34f1.jpg?h=576&w=576'
  },
  {
    file: 'sdr-3.jpg',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/82415be2a3061785f5190a8391b14cae.jpg?h=576&w=576'
  },
  // Side rail
  {
    file: 'buying-guide.png',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/eba0befc0de6d12bb208c6184fac5097.png'
  },
  {
    file: 'buying-guide-alt.png',
    url: 'https://se-cdn.djiits.com/stormsend/uploads/af2c60d77cc90754150def9c77c858b8.png'
  }
];

for (const item of files) {
  const dest = path.join(OUT, item.file);
  const res = await fetch(item.url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' }
  });
  if (!res.ok) {
    console.warn('fail', item.file, res.status);
    continue;
  }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log('saved', dest);
}
console.log('done');

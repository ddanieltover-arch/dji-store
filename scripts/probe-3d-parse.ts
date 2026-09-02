import { parseOfficialMediaFromHtml } from '../src/lib/pim/fetchOfficialStoreMedia';

const slug = process.argv[2] || 'dji-mini-4-pro';
const r = await fetch(`https://store.dji.com/product/${slug}`, {
  headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' }
});
const html = await r.text();

const parsed = parseOfficialMediaFromHtml(html, slug);
console.log('parsed model3d:', JSON.stringify(parsed.model3d, null, 2));

// Count threeD blocks in page
let idx = 0;
let n = 0;
while ((idx = html.indexOf('"threeD":', idx + 1)) >= 0 && n < 8) {
  const snippet = html.slice(idx, idx + 120);
  console.log(`threeD block ${n}:`, snippet.replace(/\n/g, ' '));
  n++;
}

// GLB count on page
const glbs = [...html.matchAll(/https:\\u002F\\u002F[^"]+?\.glb/g)].map((m) =>
  m[0].replace(/\\u002F/g, '/')
);
console.log('page GLBs:', [...new Set(glbs)]);

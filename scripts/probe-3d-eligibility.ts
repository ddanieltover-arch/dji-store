/** Probe which DJI products expose real threeD GLB vs empty threeD:{} */
const slugs = [
  'dji-mini-4-pro',
  'dji-mavic-3-pro',
  'dji-avata-2',
  'dji-flip',
  'osmo-action-5-pro',
  'dji-rc-2',
  'dji-mavic-4-pro',
  'nd-filter-set-air-3s'
];

for (const slug of slugs) {
  const r = await fetch(`https://store.dji.com/product/${slug}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' }
  });
  const html = await r.text();
  const idx = html.indexOf(`"slug":"${slug}"`);
  const chunk = idx >= 0 ? html.slice(idx, idx + 250000) : '';

  const hasGlb = /uploads\\u002F3d\\u002F[^"]+\\.glb/.test(chunk) || /uploads\/3d\/[^"]+\.glb/.test(chunk);
  const emptyThreeD = chunk.includes('"threeD":{}');
  const hasSource = chunk.includes('"threeD":{"source"');

  console.log(
    slug.padEnd(35),
    'glb:',
    hasGlb,
    '| empty threeD:',
    emptyThreeD,
    '| has source:',
    hasSource
  );
}

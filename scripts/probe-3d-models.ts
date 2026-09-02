const slug = process.argv[2] || 'dji-mini-4-pro';
const r = await fetch(`https://store.dji.com/product/${slug}`, {
  headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' }
});
const html = await r.text();

function decodeJsonUrl(value: string): string {
  return value.replace(/\\u002F/g, '/').replace(/^\/\//, 'https://');
}

// Extract slug block
const slugIdx = html.indexOf(`"slug":"${slug}"`);
const chunk = slugIdx >= 0 ? html.slice(slugIdx, slugIdx + 300000) : html.slice(0, 500000);

// threeD object
const threeDStart = chunk.indexOf('"threeD":');
if (threeDStart >= 0) {
  const from = chunk.indexOf('{', threeDStart);
  let depth = 0;
  for (let i = from; i < chunk.length; i++) {
    if (chunk[i] === '{') depth++;
    if (chunk[i] === '}') {
      depth--;
      if (depth === 0) {
        const raw = chunk.slice(from, i + 1).replace(/\\u002F/g, '/');
        console.log('threeD JSON:', raw.slice(0, 1500));
        break;
      }
    }
  }
}

// intro / video fields in chunk
for (const key of ['pcVideo', 'mVideo', 'pcVideoPoster', 'mVideoPoster', 'videoUrl', 'videos']) {
  const idx = chunk.indexOf(`"${key}":`);
  if (idx >= 0) {
    console.log(`\n${key}:`, chunk.slice(idx, idx + 600));
  }
}

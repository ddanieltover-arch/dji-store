const slug = process.argv[2] || 'dji-mavic-3-pro';
const r = await fetch(`https://store.dji.com/product/${slug}`, {
  headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' }
});
const html = await r.text();

const re = /"title":"(DJI Mavic 3 Pro[^"]*)"[\s\S]{0,1200}?"cover":\{([^}]+)\}/g;
let m;
while ((m = re.exec(html)) !== null) {
  const orig = m[2].match(/"original":"([^"]+)"/)?.[1]?.replace(/\\u002F/g, '/');
  console.log(m[1]);
  console.log(' ', orig);
}

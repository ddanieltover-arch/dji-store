import { WAVE6_HIGH_TRAFFIC_SLUGS } from '../src/data/wave6HighTrafficSlugs';
import { writeFileSync } from 'node:fs';

function extractSlugPrice(html: string, slug: string): number | null {
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const forward = new RegExp(`"slug":"${esc}"[\\s\\S]{0,8000}?"originalPrice":(\\d+)`);
  const backward = new RegExp(`"originalPrice":(\\d+)[\\s\\S]{0,8000}?"slug":"${esc}"`);
  const f = html.match(forward);
  if (f) return Number(f[1]);
  const b = html.match(backward);
  return b ? Number(b[1]) : null;
}

async function main() {
  const prices: Record<string, number> = {};
  const failed: string[] = [];

  for (const slug of WAVE6_HIGH_TRAFFIC_SLUGS) {
    const res = await fetch(`https://store.dji.com/ie/product/${slug}`, {
      headers: { 'User-Agent': 'DJI Store EU catalog sync' }
    });
    if (!res.ok) {
      failed.push(slug);
      continue;
    }
    const html = await res.text();
    const p = extractSlugPrice(html, slug);
    if (p != null) prices[slug] = p;
    else failed.push(slug);
    process.stdout.write(`\r${Object.keys(prices).length + failed.length}/${WAVE6_HIGH_TRAFFIC_SLUGS.length}`);
    await new Promise((r) => setTimeout(r, 250));
  }

  writeFileSync('.tmp/wave6-eu-prices.json', JSON.stringify({ locale: 'ie', prices, failed }, null, 2));
  console.log(`\nOK ${Object.keys(prices).length} failed ${failed.length}`);
  for (const [k, v] of Object.entries(prices)) console.log(k, v);
}

main();

import { readFileSync, writeFileSync } from 'node:fs';
import { DJI_PRODUCTS } from '../src/data/products';

const data = JSON.parse(readFileSync('.tmp/wave6-official-slugs.json', 'utf8')) as { slugs: string[] };
const catalog = new Set(DJI_PRODUCTS.map((p) => p.slug));

const EXCLUDE =
  /^(care-popover|comparison-|content-page|content-contrast|parameter-|product-page|product-warehouse|business-link|pc-|affirm|guide-|nav-|benefit|fullscreen|store-new|new-arrival|mobile-custom|product-columns|product-layout|master-wheels|wb37|f8855|b5a5|bef5|shipping-|return-|warranty-|faq-|spec-|tab-|section-|dji-care-popover)/;

const LEGACY =
  /^(dji-action-2|dji-mini-2|mini-2|content-page-mini-2|dji-spark|dji-phantom|dji-mavic-pro|dji-mavic-air|wm161|wm232|wm260|wm261|inspire-2|mavic-2)/;

const isSellable = (s: string) =>
  !EXCLUDE.test(s) &&
  !LEGACY.test(s) &&
  !/^[a-f0-9]{32}$/.test(s) &&
  !s.includes('popover') &&
  !s.includes('comparison') &&
  !s.includes('warehouse') &&
  !s.endsWith('-jp') &&
  s.length > 3;

function inferCategory(slug: string): string {
  if (slug.includes('refurb') || slug.includes('refurbished') || slug.includes('-ref-')) return 'refurbished';
  if (slug.includes('care-refresh') || slug.includes('care-pro') || slug.includes('dji-care')) return 'power-care';
  if (slug.includes('power-') || slug.includes('solar-panel') || slug.startsWith('zignes')) return 'power';
  if (
    slug.includes('battery') ||
    slug.includes('charger') ||
    slug.includes('charging-hub') ||
    slug.includes('nd-filter') ||
    slug.includes('propeller') ||
    slug.includes('gimbal') ||
    slug.includes('case') ||
    slug.includes('adapter') ||
    slug.includes('cable') ||
    slug.includes('mount') ||
    slug.includes('tripod') ||
    slug.includes('lens') ||
    slug.includes('filter') ||
    slug.includes('bag') ||
    slug.includes('dongle') ||
    slug.includes('goggles') ||
    slug.includes('remote-controller') ||
    slug.includes('rc-') ||
    slug.includes('fly-more') ||
    slug.includes('combo') ||
    slug.includes('cynova') ||
    slug.includes('adam-elements') ||
    slug.includes('zenmuse') ||
    slug.includes('d-rtk') ||
    slug.includes('tb51') ||
    slug.includes('prossd')
  ) {
    return 'accessories';
  }
  if (
    slug.includes('matrice') ||
    slug.includes('inspire') ||
    slug.includes('agras') ||
    slug.includes('dock') ||
    slug.includes('enterprise') ||
    slug.includes('ronin-4d') ||
    slug.includes('robomaster')
  ) {
    return 'professional';
  }
  if (
    slug.includes('osmo') ||
    slug.includes('rs-') ||
    slug.includes('rs3') ||
    slug.includes('rs4') ||
    slug.includes('rs5') ||
    slug.includes('mic') ||
    slug.includes('transmission') ||
    slug.includes('pocket')
  ) {
    return 'handheld';
  }
  return 'camera-drones';
}

const sellable = data.slugs.filter(isSellable);
const missing = sellable.filter((s) => !catalog.has(s));

const byCategory: Record<string, string[]> = {};
for (const slug of missing) {
  const cat = inferCategory(slug);
  (byCategory[cat] ??= []).push(slug);
}

writeFileSync(
  '.tmp/wave6-sellable-missing.json',
  JSON.stringify({ missingCount: missing.length, byCategory, missing }, null, 2)
);

console.log(`Sellable official slugs: ${sellable.length}`);
console.log(`Missing sellable: ${missing.length}`);
for (const [cat, slugs] of Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${cat}: ${slugs.length}`);
}

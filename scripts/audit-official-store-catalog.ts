/**
 * Wave 6 category crawl audit — sellable store.dji.com PDP parity.
 * Run: npx tsx scripts/audit-official-store-catalog.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { DJI_PRODUCTS } from '../src/data/products';
import { OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS } from '../src/data/officialStoreHomepageManifest';
import { WAVE6_SELLABLE_SLUGS } from '../src/data/wave6CategoryManifest';

const catalogSlugs = new Set(DJI_PRODUCTS.map((p) => p.slug));

const homepageMissing = OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS.filter((slug) => !catalogSlugs.has(slug));
const wave6Missing = WAVE6_SELLABLE_SLUGS.filter((slug) => !catalogSlugs.has(slug));

const missingImages = DJI_PRODUCTS.filter((p) => {
  const cutout = p.images.cutout ?? '';
  const hero = p.images.hero ?? '';
  return !cutout.startsWith('/products/') || !hero.startsWith('/products/');
});

const crawlMeta = existsSync('.tmp/wave6-official-slugs.json')
  ? (JSON.parse(readFileSync('.tmp/wave6-official-slugs.json', 'utf8')) as { total?: number })
  : null;

console.log('=== DJI Store EU — Official Store Parity Audit ===\n');
console.log(`Catalog products: ${DJI_PRODUCTS.length}`);
if (crawlMeta?.total) console.log(`Official crawl universe: ${crawlMeta.total} slugs`);
console.log(`Wave 6 sellable target: ${WAVE6_SELLABLE_SLUGS.length}`);
console.log(`Homepage slugs covered: ${OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS.length - homepageMissing.length}/${OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS.length}`);
console.log(`Wave 6 sellable covered: ${WAVE6_SELLABLE_SLUGS.length - wave6Missing.length}/${WAVE6_SELLABLE_SLUGS.length}`);
console.log(`Local image coverage: ${DJI_PRODUCTS.length - missingImages.length}/${DJI_PRODUCTS.length}`);

if (homepageMissing.length) {
  console.log('\nHomepage gaps:');
  homepageMissing.forEach((slug) => console.log(`  - ${slug}`));
}

if (wave6Missing.length) {
  console.log('\nWave 6 gaps:');
  wave6Missing.slice(0, 30).forEach((slug) => console.log(`  - ${slug}`));
  if (wave6Missing.length > 30) console.log(`  ... and ${wave6Missing.length - 30} more`);
}

if (missingImages.length) {
  console.log('\nImage gaps:');
  missingImages.slice(0, 20).forEach((p) => console.log(`  - ${p.slug}`));
}

const ok = homepageMissing.length === 0 && wave6Missing.length === 0 && missingImages.length === 0;
if (ok) console.log('\n✓ Full Wave 6 category parity achieved.');
process.exit(ok ? 0 : 1);

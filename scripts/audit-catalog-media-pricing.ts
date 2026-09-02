/**
 * Audit catalog images, galleries, variant pricing, and variant images.
 * Run: npx tsx scripts/audit-catalog-media-pricing.ts
 */
import { DJI_PRODUCTS } from '../src/data/products';
import officialUsdPriceCache from '../src/data/officialUsdPriceCache.json';
import { combosForProduct } from '../src/lib/pricing/applyUsdPricing';

const PLACEHOLDER_TAGLINE = /Mapped from store\.dji\.com/i;

let thinGallery = 0;
let singleVariant = 0;
let placeholderTagline = 0;
let nonLocalHero = 0;
let missingVariantPrices = 0;
let missingVariantImages = 0;
let expandableNotExpanded = 0;

const issues: string[] = [];

for (const product of DJI_PRODUCTS) {
  const uniqueGallery = new Set(product.images.gallery || []);
  if (uniqueGallery.size < 3) thinGallery += 1;

  if (!product.images.hero?.startsWith('/products/') && !product.images.hero?.startsWith('http')) {
    nonLocalHero += 1;
  }

  if (product.variants.length <= 1) singleVariant += 1;

  if (PLACEHOLDER_TAGLINE.test(product.tagline)) placeholderTagline += 1;

  const entry = officialUsdPriceCache[product.slug as keyof typeof officialUsdPriceCache];
  const combos = entry?.combos ? combosForProduct(product, entry.combos) : [];
  if (combos.length >= 2 && product.variants.length === 1 && product.variants[0]?.comboName === 'Standard') {
  const dedicated = /-(fly-more-combo|fly-smart-combo|creator-combo|standard-combo|sport-bundle)(-|$)/i.test(
      product.slug
    );
    if (!dedicated) {
      expandableNotExpanded += 1;
      if (issues.length < 15) issues.push(`expandable: ${product.slug} (${combos.length} combos)`);
    }
  }

  if (product.variants.length > 1) {
    const prices = new Set(product.variants.map((v) => v.priceEur));
    if (prices.size < product.variants.length) {
      missingVariantPrices += 1;
      if (issues.length < 20) issues.push(`duplicate variant prices: ${product.slug}`);
    }
    const withImages = product.variants.filter((v) => v.imageUrl).length;
    if (withImages < product.variants.length) {
      missingVariantImages += 1;
    }
  }
}

console.log('=== Catalog media & pricing audit ===');
console.log(`Total products: ${DJI_PRODUCTS.length}`);
console.log(`Thin gallery (<3 unique): ${thinGallery}`);
console.log(`Single variant only: ${singleVariant}`);
console.log(`Placeholder Wave 6 taglines: ${placeholderTagline}`);
console.log(`Non-local/missing hero: ${nonLocalHero}`);
console.log(`Parent PDPs not expanded (sample): ${expandableNotExpanded}`);
console.log(`Multi-variant duplicate prices: ${missingVariantPrices}`);
console.log(`Multi-variant missing imageUrl: ${missingVariantImages}`);
if (issues.length) {
  console.log('\nSample issues:');
  for (const line of issues) console.log(`  - ${line}`);
}

const samples = ['dji-flip', 'dji-air-3s', 'dji-mavic-4-pro', 'osmo-action-5-pro', 'dji-flip-fly-more-combo-rc-2'];
console.log('\n=== Sample pricing ===');
for (const slug of samples) {
  const p = DJI_PRODUCTS.find((x) => x.slug === slug);
  if (!p) {
    console.log(`${slug}: NOT IN CATALOG`);
    continue;
  }
  const variants = p.variants.map((v) => `${v.comboName}=€${v.priceEur}`).join(', ');
  const gallery = new Set(p.images.gallery || []).size;
  console.log(`${slug}: ${variants} | gallery=${gallery} hero=${p.images.hero?.slice(0, 60)}`);
}

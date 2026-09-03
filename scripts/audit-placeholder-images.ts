import { DJI_PRODUCTS } from '../src/data/products';
import {
  productListingImage,
  hasStorefrontListingImage,
  isLocalPlaceholderUrl
} from '../src/lib/pim/productListingImage';
import productDatabaseMediaCache from '../src/data/productDatabaseMediaCache.json';
import officialStoreMediaCache from '../src/data/officialStoreMediaCache.json';
import type { DatabaseMediaCache } from '../src/lib/pim/databaseMediaCache';
import type { OfficialStoreMediaCache } from '../src/lib/pim/fetchOfficialStoreMedia';
import { existsSync } from 'node:fs';
import path from 'node:path';

const dbCache = productDatabaseMediaCache as DatabaseMediaCache;
const mediaCache = officialStoreMediaCache as OfficialStoreMediaCache;
const publicProducts = path.join(process.cwd(), 'public', 'products');

const placeholders = DJI_PRODUCTS.filter((p) => isLocalPlaceholderUrl(productListingImage(p)));
const withReal = DJI_PRODUCTS.filter((p) => hasStorefrontListingImage(p));
const withOfficialMedia = placeholders.filter((p) => {
  const m = mediaCache[p.slug];
  return Boolean(m?.coverOriginal || m?.coverLarge || m?.carouselGallery?.length);
});
const withLocalPng = placeholders.filter((p) =>
  existsSync(path.join(publicProducts, `${p.id}-cutout.png`))
);

const byCategory = placeholders.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      totalProducts: DJI_PRODUCTS.length,
      withRealListingImage: withReal.length,
      placeholderCount: placeholders.length,
      placeholdersWithOfficialStoreMedia: withOfficialMedia.length,
      placeholdersWithLocalPng: withLocalPng.length,
      dbCacheSlugs: Object.keys(dbCache).length,
      byCategory
    },
    null,
    2
  )
);

console.log('\n--- PLACEHOLDER SLUGS ---');
for (const p of placeholders) {
  const hasOfficial = Boolean(mediaCache[p.slug]?.coverOriginal || mediaCache[p.slug]?.carouselGallery?.length);
  console.log(`${p.slug}\t${p.category}\tofficial=${hasOfficial}`);
}

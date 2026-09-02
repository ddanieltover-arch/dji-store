import { MEGA_MENU_PANELS } from '../src/data/megaMenu';
import { DJI_PRODUCTS } from '../src/data/products';
import { isStorefrontImageUrl, productListingImage } from '../src/lib/pim/productListingImage';
import officialStoreMediaCache from '../src/data/officialStoreMediaCache.json';

const ids = [...new Set(MEGA_MENU_PANELS.flatMap((p) => p.groups.flatMap((g) => g.productIds)))];

const missing: { id: string; slug: string; model: string; img: string; hasCache: boolean }[] = [];

for (const id of ids) {
  const product = DJI_PRODUCTS.find((p) => p.id === id);
  if (!product) continue;
  const img = productListingImage(product);
  const cache = officialStoreMediaCache[product.slug as keyof typeof officialStoreMediaCache] as
    | { coverOriginal?: string }
    | undefined;
  if (!isStorefrontImageUrl(img)) {
    missing.push({
      id,
      slug: product.slug,
      model: product.modelName,
      img,
      hasCache: Boolean(cache?.coverOriginal)
    });
  }
}

console.log(`Mega menu products: ${ids.length}`);
console.log(`Missing CDN listing image: ${missing.length}`);
for (const row of missing) {
  console.log(`- ${row.model} (${row.slug}) cache=${row.hasCache} img=${row.img}`);
}

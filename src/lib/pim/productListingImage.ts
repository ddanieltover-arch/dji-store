import type { Product } from '../../types';
import productDatabaseMediaCacheJson from '../../data/productDatabaseMediaCache.json';
import {
  DatabaseMediaCache,
  databaseListingImage,
  isDatabaseAssetUrl,
  isExternalCdnUrl
} from './databaseMediaCache';
import { resolveMediaUrl } from './resolveMediaUrl';

const databaseMediaCache = productDatabaseMediaCacheJson as DatabaseMediaCache;

/** URL is served from our own database asset API. */
export { isDatabaseAssetUrl, isExternalCdnUrl } from './databaseMediaCache';

/** True when URL is a real storefront asset (DB API or static /media/). */
export function isStorefrontImageUrl(url?: string): boolean {
  if (!url) return false;
  if (isDatabaseAssetUrl(url)) return true;
  if (url.startsWith('/media/')) return true;
  if (isExternalCdnUrl(url)) return false;
  if (url.startsWith('/api/assets/')) return true;
  if (url.startsWith('https://')) return false;
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
    return isDatabaseAssetUrl(url) || url.includes('/media/');
  }
  return false;
}

/** Missing bundled PNG paths under /products/ — fallback until ingest completes. */
export function isLocalPlaceholderUrl(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith('/media/')) return false;
  return url.startsWith('/products/') || url.startsWith('/images/');
}

/**
 * Product card / cart thumbnail.
 * Priority: database-ingested asset → local bundled cutout. Never the reference CDN.
 */
export function productListingImage(
  product: Pick<Product, 'images' | 'slug' | 'id'>
): string {
  const fromDb = databaseListingImage(product.slug, databaseMediaCache);
  if (fromDb) return resolveMediaUrl(fromDb) ?? fromDb;

  const { cutout, hero } = product.images;

  if (isDatabaseAssetUrl(cutout)) return resolveMediaUrl(cutout) ?? cutout;
  if (isDatabaseAssetUrl(hero)) return resolveMediaUrl(hero) ?? hero;
  if (cutout && !isExternalCdnUrl(cutout)) return cutout;
  if (hero && !isExternalCdnUrl(hero)) return hero;

  return `/products/${product.id}-cutout.png`;
}

/** True when the listing resolves to a real asset (DB or static media), not a placeholder. */
export function hasStorefrontListingImage(product: Pick<Product, 'images' | 'slug' | 'id'>): boolean {
  return isStorefrontImageUrl(productListingImage(product));
}

export function getDatabaseMediaCache(): DatabaseMediaCache {
  return databaseMediaCache;
}

import type { Product } from '../../types';
import type { OfficialStoreMediaCache } from './fetchOfficialStoreMedia';
import officialStoreMediaCacheJson from '../../data/officialStoreMediaCache.json';

const officialStoreMediaCache = officialStoreMediaCacheJson as OfficialStoreMediaCache;

/** Remote URL suitable for `<img src>` in the Vite storefront (excludes localhost ingested assets). */
export function isStorefrontImageUrl(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith('https://')) return true;
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return false;
  return url.startsWith('http://');
}

/** Missing bundled PNG paths under /products/ — not valid listing images. */
export function isLocalPlaceholderUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('/products/') || url.startsWith('/images/');
}

export function officialListingCoverForSlug(slug: string): string | undefined {
  const entry = officialStoreMediaCache[slug];
  const cover = entry?.coverOriginal || entry?.coverLarge;
  return isStorefrontImageUrl(cover) ? cover : undefined;
}

function firstStorefrontGalleryUrl(gallery?: string[]): string | undefined {
  return gallery?.find((url) => isStorefrontImageUrl(url) && !isLocalPlaceholderUrl(url));
}

/**
 * Official white-background SPU cover used on store.dji.com category grids.
 * Resolves in order: media cache by slug → remote cutout/hero → remote gallery frame.
 */
export function productListingImage(
  product: Pick<Product, 'images' | 'slug'>
): string {
  const official = officialListingCoverForSlug(product.slug);
  if (official) return official;

  const { cutout, hero, gallery } = product.images;

  if (isStorefrontImageUrl(cutout) && !isLocalPlaceholderUrl(cutout)) return cutout;
  if (isStorefrontImageUrl(hero) && !isLocalPlaceholderUrl(hero)) return hero;

  const galleryCdn = firstStorefrontGalleryUrl(gallery);
  if (galleryCdn) return galleryCdn;

  return cutout || hero;
}

/** True when the listing helper resolves to a loadable CDN URL. */
export function hasStorefrontListingImage(product: Pick<Product, 'images' | 'slug'>): boolean {
  return isStorefrontImageUrl(productListingImage(product));
}

export function getOfficialStoreMediaCache(): OfficialStoreMediaCache {
  return officialStoreMediaCache;
}

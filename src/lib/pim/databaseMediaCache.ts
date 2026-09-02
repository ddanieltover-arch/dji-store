export type DatabaseMediaCacheEntry = {
  slug: string;
  hero?: string;
  cutout?: string;
  gallery?: string[];
  ingestedAt: string;
};

export type DatabaseMediaCache = Record<string, DatabaseMediaCacheEntry>;

const EXTERNAL_CDN_HOST = 'se-cdn.djiits.com';

export function isExternalCdnUrl(url?: string): boolean {
  return Boolean(url?.includes(EXTERNAL_CDN_HOST));
}

export function isDatabaseAssetUrl(url?: string): boolean {
  return Boolean(url?.includes('/api/assets/'));
}

export function hasDatabaseMedia(entry?: DatabaseMediaCacheEntry): boolean {
  return Boolean(entry?.gallery?.length || entry?.hero || entry?.cutout);
}

/** @deprecated use hasDatabaseMedia */
export function hasDatabaseGallery(entry?: DatabaseMediaCacheEntry): boolean {
  return Boolean(entry?.gallery && entry.gallery.length >= 3);
}

export function databaseListingImage(
  slug: string,
  cache: DatabaseMediaCache
): string | undefined {
  const entry = cache[slug];
  if (!entry) return undefined;
  return entry.cutout || entry.hero || entry.gallery?.[0];
}

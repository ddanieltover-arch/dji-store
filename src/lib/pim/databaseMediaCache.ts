export type DatabaseMediaCacheEntry = {
  slug: string;
  hero?: string;
  cutout?: string;
  gallery?: string[];
  ingestedAt: string;
};

export type DatabaseMediaCache = Record<string, DatabaseMediaCacheEntry>;

export function hasDatabaseGallery(entry?: DatabaseMediaCacheEntry): boolean {
  return Boolean(entry?.gallery && entry.gallery.length >= 3);
}

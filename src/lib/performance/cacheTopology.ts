import { CacheLayer } from '../../types/performanceReliability';

export function cacheControlHeader(layer: Pick<CacheLayer, 'ttlSeconds' | 'staleWhileRevalidateSeconds'>): string {
  return `public, s-maxage=${layer.ttlSeconds}, stale-while-revalidate=${layer.staleWhileRevalidateSeconds}`;
}

export function productCacheTags(sku: string, category: string, locale: string): string[] {
  return [`product:${sku}`, `plp:${category}`, `locale:${locale}`];
}

export const SEARCH_CACHE_KEY_PREFIX = 'search:v3:';

export function searchCacheKey(query: string, locale: string): string {
  return `${SEARCH_CACHE_KEY_PREFIX}${locale}:${query.trim().toLowerCase()}`;
}

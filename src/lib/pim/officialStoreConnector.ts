import { CatalogDiffItem, Product } from '../../types';
import { changeRiskScore, normalizeComboName } from './catalogIntelligence';
import { SourceConnectorConfig } from '../../types/officialStoreConnector';

export const DJI_OFFICIAL_STORE_CONNECTOR: SourceConnectorConfig = {
  sourceId: 'src-store',
  sourceName: 'DJI Official Store',
  baseUrl: 'https://store.dji.com',
  trustLevel: 'canonical',
  syncMode: 'incremental',
  enabled: true,
  sitemapUrl: 'https://store.dji.com/sitemap.xml',
  robotsTxtUrl: 'https://store.dji.com/robots.txt',
  rateLimitRpm: 20,
  attribution: 'Canonical source: DJI Official Store (store.dji.com). EU catalog mapping only; no scrape of /cart, /checkout, /user, /order, /api.'
};

const ROBOTS_DISALLOW = ['/cart', '/checkout', '/success', '/fail', '/search', '/product-search', '/user/', '/order/', '/api/', '/klapi/', '/pwa/', '/coupons'];

export function isOfficialStoreUrlAllowed(pathOrUrl: string): boolean {
  const path = pathOrUrl.replace('https://store.dji.com', '');
  return !ROBOTS_DISALLOW.some((d) => path.includes(d.replace('*', '')));
}

export function mapOfficialUrlToCatalogProduct(url: string, catalog: Product[]): Product | undefined {
  const slug = url.split('/').filter(Boolean).pop()?.split('?')[0]?.toLowerCase();
  if (!slug) return undefined;
  return catalog.find((p) => p.slug === slug || p.slug.includes(slug) || slug.includes(p.slug.replace('dji-', '')));
}

export function normalizeOfficialVariant(sourceVariantName: string, sku: string, includedItems: string[]): {
  sourceVariantName: string;
  normalizedVariantName: string;
  sku: string;
  includedItems: string[];
} {
  return {
    sourceVariantName,
    normalizedVariantName: normalizeComboName(sourceVariantName),
    sku,
    includedItems
  };
}

export type TrustDecision = 'auto-approve' | 'review-required' | 'block';

const AUTO_CATEGORIES = new Set(['firmware', 'media', 'description']);
const REVIEW_CATEGORIES = new Set(['price', 'specs', 'easa_status', 'new_product', 'new_variant']);

export function trustDecisionForChange(category: CatalogDiffItem['changeCategory'] | string, deltaPct = 0): TrustDecision {
  const risk = changeRiskScore(category, deltaPct);
  if (risk.recommend === 'block') return 'block';
  if (REVIEW_CATEGORIES.has(category)) return 'review-required';
  if (AUTO_CATEGORIES.has(category)) return 'auto-approve';
  return risk.recommend === 'auto' ? 'auto-approve' : 'review-required';
}

export function toProductDiff(
  productId: string,
  field: string,
  oldValue: unknown,
  newValue: unknown,
  category: string,
  deltaPct = 0
): { field: string; oldValue: unknown; newValue: unknown; riskScore: number; category: string; productId: string } {
  return {
    field,
    oldValue,
    newValue,
    riskScore: changeRiskScore(category, deltaPct).score,
    category,
    productId
  };
}

export function hashSourceUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i += 1) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return `src_${h.toString(16)}`;
}

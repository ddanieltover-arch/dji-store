import {
  ReferenceSource,
  DiscoveryEvent,
  AccessoryEdge,
  FirmwareRecord,
  TranslationJob,
  CatalogQualityScore,
  PimCertification
} from '../types/productIntelligence';
import { DJI_PRODUCTS } from './products';
import { scoreCatalogHealth } from '../lib/pim/catalogIntelligence';

export const REFERENCE_SOURCES: ReferenceSource[] = [
  { id: 'src-store', sourceName: 'DJI Official Store', sourceType: 'official_store', baseUrl: 'https://store.dji.com', syncFrequencyMinutes: 60, active: true, lastSyncAt: '2026-08-15T21:00:00Z', robotsOk: true },
  { id: 'src-ent', sourceName: 'DJI Enterprise', sourceType: 'enterprise', baseUrl: 'https://enterprise.dji.com', syncFrequencyMinutes: 180, active: true, lastSyncAt: '2026-08-15T18:00:00Z', robotsOk: true },
  { id: 'src-global', sourceName: 'DJI Global', sourceType: 'global', baseUrl: 'https://www.dji.com', syncFrequencyMinutes: 120, active: true, lastSyncAt: '2026-08-15T20:00:00Z', robotsOk: true },
  { id: 'src-support', sourceName: 'DJI Support', sourceType: 'support', baseUrl: 'https://www.dji.com/support', syncFrequencyMinutes: 240, active: true, lastSyncAt: '2026-08-15T16:00:00Z', robotsOk: true },
  { id: 'src-dl', sourceName: 'DJI Download Center', sourceType: 'download_center', baseUrl: 'https://www.dji.com/downloads', syncFrequencyMinutes: 360, active: true, lastSyncAt: '2026-08-15T12:00:00Z', robotsOk: true },
  { id: 'src-eu', sourceName: 'Authorized European Distributors', sourceType: 'eu_distributor', baseUrl: 'https://www.dji.com/where-to-buy', syncFrequencyMinutes: 1440, active: true, lastSyncAt: '2026-08-14T08:00:00Z', robotsOk: true },
  { id: 'src-oem', sourceName: 'Approved OEM Partners', sourceType: 'oem_partner', baseUrl: 'https://www.dji.com/products', syncFrequencyMinutes: 1440, active: false, lastSyncAt: '2026-08-01T00:00:00Z', robotsOk: true }
];

export const DISCOVERY_EVENTS: DiscoveryEvent[] = [
  { id: 'dsc-01', kind: 'firmware', method: 'product_feed', title: 'Mavic 4 Pro firmware v01.00.0420', sourceId: 'src-dl', detectedAt: '2026-08-14T08:02:00Z', linkedProductId: 'prod-mavic-4-pro' },
  { id: 'dsc-02', kind: 'update', method: 'json_ld', title: 'Air 3S Fly More −€50 EU promo', sourceId: 'src-store', detectedAt: '2026-08-14T08:02:30Z', linkedProductId: 'prod-air-3s' },
  { id: 'dsc-03', kind: 'new_variant', method: 'category_crawl', title: 'Mini 5 Pro Fly More Plus listing', sourceId: 'src-store', detectedAt: '2026-08-13T11:20:00Z' },
  { id: 'dsc-04', kind: 'manual', method: 'sitemap', title: 'Inspire 3 CE DoC PDF refreshed', sourceId: 'src-support', detectedAt: '2026-08-12T09:00:00Z' }
];

export const ACCESSORY_GRAPH: AccessoryEdge[] = [
  { productId: 'prod-mavic-4-pro', relation: 'battery', accessoryName: 'Mavic 4 Pro Intelligent Flight Battery', merchSlot: 'fbt' },
  { productId: 'prod-mavic-4-pro', relation: 'propeller', accessoryName: '9453F Low-Noise Props', merchSlot: 'replacement' },
  { productId: 'prod-mavic-4-pro', relation: 'care', accessoryName: 'DJI Care Refresh 2-Year EU', merchSlot: 'recommended' },
  { productId: 'prod-air-3s', relation: 'filter', accessoryName: 'ND Filter Set (PL/ND8/16/32)', merchSlot: 'fbt' },
  { productId: 'prod-air-3s', relation: 'case', accessoryName: 'Air 3S Shoulder Bag', merchSlot: 'recommended' }
];

export const FIRMWARE_HISTORY: FirmwareRecord[] = [
  { productId: 'prod-mavic-4-pro', version: 'v01.00.0420', releasedAt: '2026-08-10', notes: 'EASA DRI v2.1 + night obstacle sensing', manualUrl: '/downloads/m4p-user-manual-en.pdf' },
  { productId: 'prod-mavic-4-pro', version: 'v01.00.0300', releasedAt: '2026-06-02', notes: 'EASA DRI v1', manualUrl: '/downloads/m4p-user-manual-en.pdf' },
  { productId: 'prod-air-3s', version: 'v01.02.0100', releasedAt: '2026-07-18', notes: 'O4 transmission stability', manualUrl: '/downloads/air3s-manual-en.pdf' }
];

export const TRANSLATION_QUEUE: TranslationJob[] = [
  { id: 'tr-01', productId: 'prod-mavic-4-pro', locale: 'de', field: 'description', status: 'approved', coveragePct: 100 },
  { id: 'tr-02', productId: 'prod-mavic-4-pro', locale: 'fr', field: 'description', status: 'approved', coveragePct: 100 },
  { id: 'tr-03', productId: 'prod-air-3s', locale: 'nl', field: 'tagline', status: 'needs_human', coveragePct: 82 },
  { id: 'tr-04', productId: 'prod-air-3s', locale: 'it', field: 'seo_faq', status: 'memory_hit', coveragePct: 90 }
];

export const CATALOG_QUALITY: CatalogQualityScore[] = DJI_PRODUCTS.slice(0, 8).map((p) => {
  const parts = {
    description: p.description.length > 80 ? 96 : 88,
    media: p.images.gallery.length >= 3 ? 97 : 90,
    specs: p.cameraSensor && p.flightTimeMinutes ? 95 : 90,
    seo: 94,
    translation: 91,
    relationships: ACCESSORY_GRAPH.some((e) => e.productId === p.id) ? 96 : 90
  };
  return {
    productId: p.id,
    modelName: p.modelName,
    ...parts,
    overall: scoreCatalogHealth(parts)
  };
});

export const PIM_ANALYTICS = {
  imported: DJI_PRODUCTS.length,
  updated24h: 2,
  pendingApproval: 2,
  syncSuccessPct: 99.2,
  mediaCoveragePct: 97,
  translationCoveragePct: 91,
  catalogHealth: Math.round((CATALOG_QUALITY.reduce((s, q) => s + q.overall, 0) / CATALOG_QUALITY.length) * 10) / 10
};

export const SYNC_CADENCE = [
  { name: '15 minute', use: 'Price & ATP from official store feed' },
  { name: 'Hourly', use: 'Default store + enterprise crawl' },
  { name: 'Daily', use: 'Support manuals + firmware index' },
  { name: 'Manual', use: 'Catalog manager emergency' },
  { name: 'Emergency', use: 'Safety recall / EASA change' }
];

export const PIM_CERTIFICATION: PimCertification = {
  catalogCompleteness: 96,
  syncReliability: 99,
  dataAccuracy: 97,
  seoReadiness: 94,
  mediaCoverage: 97,
  status: 'Certified'
};

export const REFERENCE_SOURCES_SQL = `CREATE TABLE reference_sources (
  id UUID PRIMARY KEY,
  source_name TEXT,
  source_type TEXT,
  base_url TEXT,
  sync_frequency_minutes INT,
  active BOOLEAN,
  created_at TIMESTAMPTZ
);`;

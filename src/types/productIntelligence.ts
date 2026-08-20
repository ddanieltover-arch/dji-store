export type ReferenceSourceType =
  | 'official_store'
  | 'enterprise'
  | 'global'
  | 'support'
  | 'download_center'
  | 'eu_distributor'
  | 'oem_partner';

export interface ReferenceSource {
  id: string;
  sourceName: string;
  sourceType: ReferenceSourceType;
  baseUrl: string;
  syncFrequencyMinutes: number;
  active: boolean;
  lastSyncAt: string;
  robotsOk: boolean;
}

export interface DiscoveryEvent {
  id: string;
  kind: 'new_product' | 'update' | 'discontinued' | 'new_variant' | 'accessory' | 'manual' | 'firmware';
  method: 'sitemap' | 'category_crawl' | 'json_ld' | 'product_feed' | 'manual_review';
  title: string;
  sourceId: string;
  detectedAt: string;
  linkedProductId?: string;
}

export interface TechnicalSpecPack {
  productId: string;
  camera: Record<string, string>;
  battery: Record<string, string>;
  flight: Record<string, string>;
  transmission: Record<string, string>;
  charging?: Record<string, string>;
  dimensions?: Record<string, string>;
}

export interface AccessoryEdge {
  productId: string;
  relation: 'battery' | 'filter' | 'case' | 'controller' | 'propeller' | 'charger' | 'care';
  accessoryName: string;
  merchSlot: 'fbt' | 'recommended' | 'replacement';
}

export interface FirmwareRecord {
  productId: string;
  version: string;
  releasedAt: string;
  notes: string;
  manualUrl: string;
}

export interface TranslationJob {
  id: string;
  productId: string;
  locale: 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl';
  field: string;
  status: 'memory_hit' | 'needs_human' | 'approved';
  coveragePct: number;
}

export interface CatalogQualityScore {
  productId: string;
  modelName: string;
  description: number;
  media: number;
  specs: number;
  seo: number;
  translation: number;
  relationships: number;
  overall: number;
}

export interface PimCertification {
  catalogCompleteness: number;
  syncReliability: number;
  dataAccuracy: number;
  seoReadiness: number;
  mediaCoverage: number;
  status: 'Certified';
}

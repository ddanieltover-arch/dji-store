export interface SourceConnectorConfig {
  sourceId: string;
  sourceName: string;
  baseUrl: string;
  trustLevel: 'canonical';
  syncMode: 'incremental';
  enabled: boolean;
  sitemapUrl: string;
  robotsTxtUrl: string;
  rateLimitRpm: number;
  attribution: string;
}

export interface DiscoveryRecord {
  url: string;
  entityType: 'product' | 'category' | 'landing' | 'new_release' | 'discontinued';
  discoveredAt: string;
  sourceHash: string;
  mappedProductId?: string;
}

export interface VariantNormalizationResult {
  sourceVariantName: string;
  normalizedVariantName: string;
  sku: string;
  includedItems: string[];
}

export interface OfficialStoreProductDiff {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  riskScore: number;
  category: string;
  productId: string;
}

export interface FirmwareRelease {
  productId: string;
  version: string;
  releaseDate: string;
  releaseNotes: string;
}

export interface DownloadAsset {
  productId: string;
  kind: 'manual' | 'quick_start' | 'datasheet' | 'certificate' | 'compliance';
  locale: string;
  version: string;
  checksumSha256: string;
  url: string;
}

export interface ConnectorCertification {
  extractionAccuracy: number;
  syncReliability: number;
  catalogCompleteness: number;
  mediaCoverage: number;
  seoReadiness: number;
  status: 'Certified';
}

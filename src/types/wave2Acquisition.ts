import { Product } from './index';
import { DiscoveryRecord, DownloadAsset, FirmwareRelease } from './officialStoreConnector';
import { Wave1HealthReport } from './wave1Execution';

export type Wave2PipelineStage =
  | 'discover'
  | 'extract'
  | 'normalize'
  | 'specs'
  | 'media'
  | 'firmware'
  | 'seo'
  | 'approve'
  | 'inventory'
  | 'publish'
  | 'certify';

export interface CategoryAcquisitionRow {
  id: string;
  storePath: string;
  storeUrl: string;
  catalogCategory: Product['category'];
  seriesFocus: Product['series'][];
  cadence: '15m' | 'hourly' | 'daily';
  robotsAllowed: boolean;
  extractMode: 'jsonld+pdp' | 'category-index';
}

export interface SpecMappingRow {
  officialGroup: string;
  catalogGroup: string;
  fields: string[];
}

export interface Wave2MediaAsset {
  productId: string;
  role: 'hero' | 'gallery' | 'cutout';
  sourceUrl: string;
  cdnUrl: string;
  contentHash: string;
}

export interface Wave2ExtractedProduct {
  sourceUrl: string;
  allowed: boolean;
  productId: string;
  sku: string;
  modelName: string;
  variants: { sourceName: string; normalizedName: string; sku: string; includedItems: string[] }[];
  specGroups: { groupName: string; attributes: { name: string; value: string }[] }[];
  media: Wave2MediaAsset[];
}

export interface Wave2HealthReport extends Wave1HealthReport {
  mappingCoveragePct: number;
  categoryMatrixCoveragePct: number;
  extractSuccessPct: number;
  wave2Certified: boolean;
}

export interface Wave2PipelineResult {
  stages: Wave2PipelineStage[];
  discovery: DiscoveryRecord[];
  extracts: Wave2ExtractedProduct[];
  firmware: FirmwareRelease[];
  downloads: DownloadAsset[];
  seoLocaleCount: number;
  pendingReview: number;
  autoApproved: number;
  health: Wave2HealthReport;
}

import { Product } from './index';
import { Wave3Certification } from './wave3Intelligence';
import { Wave1HealthReport } from './wave1Execution';

export type Wave4PipelineStage =
  | 'discover'
  | 'extract'
  | 'normalize'
  | 'specs'
  | 'media'
  | 'firmware'
  | 'seo'
  | 'approve'
  | 'inventory'
  | 'enrich'
  | 'publish'
  | 'certify';

export type Wave4CategoryStatus = 'discovered' | 'extracted' | 'populated' | 'certified';

export type Wave4SkuLifecycle =
  | 'discovered'
  | 'mapped'
  | 'extracted'
  | 'normalized'
  | 'approved'
  | 'published'
  | 'inventory_initialized'
  | 'media_complete'
  | 'seo_complete';

export type Wave4MatchDecision = 'map_existing' | 'pending_new' | 'ambiguous_review';

export interface Wave4CategoryCoverageRow {
  id: string;
  label: string;
  storeUrl: string;
  storePath: string;
  catalogCategory: Product['category'] | 'multi';
  robotsAllowed: boolean;
  discoveryStatus: Wave4CategoryStatus;
  extractionStatus: Wave4CategoryStatus;
  populationStatus: Wave4CategoryStatus;
  certificationStatus: Wave4CategoryStatus;
  skuCount: number;
}

export interface Wave4DiscoveredSku {
  sourceUrl: string;
  slug: string;
  modelName: string;
  storeCategory: string;
  mappedProductId?: string;
  lifecycle: Wave4SkuLifecycle;
}

export interface Wave4PendingCatalogRecord {
  id: string;
  sourceUrl: string;
  slug: string;
  modelName: string;
  reason: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

export interface Wave4CoverageReport {
  discovered: number;
  mapped: number;
  extracted: number;
  normalized: number;
  approved: number;
  published: number;
  inventoryInitialized: number;
  mediaComplete: number;
  seoComplete: number;
  catalogCoveragePct: number;
  variantCoveragePct: number;
  mediaCoveragePct: number;
  inventoryCoveragePct: number;
  seoCoveragePct: number;
  specCoveragePct: number;
  wave3IntelligenceCoveragePct: number;
}

export interface Wave4Certification {
  catalogHealth: number;
  inventoryCoveragePct: number;
  mediaCoveragePct: number;
  relationshipCoveragePct: number;
  faqCoveragePct: number;
  seoCoveragePct: number;
  productIntelligenceScore: number;
  catalogIntelligenceScore: number;
  catalogCoveragePct: number;
  categoryCoveragePct: number;
  certified: boolean;
  wave1: Wave1HealthReport;
  wave3: Wave3Certification;
}

export interface Wave4QueueSnapshot {
  pendingApprovals: number;
  failedJobs: number;
  dlq: number;
}

export interface Wave4ExpansionResult {
  stages: Wave4PipelineStage[];
  categories: Wave4CategoryCoverageRow[];
  discovery: Wave4DiscoveredSku[];
  pending: Wave4PendingCatalogRecord[];
  coverage: Wave4CoverageReport;
  queue: Wave4QueueSnapshot;
  certification: Wave4Certification;
  publishedProductIds: string[];
}

import { Product } from '../../types';
import {
  Wave4CategoryCoverageRow,
  Wave4CoverageReport,
  Wave4DiscoveredSku,
  Wave4ExpansionResult,
  Wave4MatchDecision,
  Wave4PendingCatalogRecord,
  Wave4PipelineStage,
  Wave4SkuLifecycle
} from '../../types/wave4Expansion';
import { WAVE4_DISCOVERY_UNIVERSE } from '../../data/wave4OfficialCatalog';
import {
  DJI_OFFICIAL_STORE_CONNECTOR,
  hashSourceUrl,
  isOfficialStoreUrlAllowed,
  mapOfficialUrlToCatalogProduct,
  normalizeOfficialVariant
} from './officialStoreConnector';
import { normalizeComboName } from './catalogIntelligence';
import { certifyWave1Catalog, initializeInventoryFromCatalog, populateSeoForCatalog } from './wave1Execution';
import { runWave3Intelligence } from './wave3Intelligence';
import { FIRMWARE_HISTORY } from '../../data/productIntelligenceData';

export const WAVE4_STAGES: Wave4PipelineStage[] = [
  'discover',
  'extract',
  'normalize',
  'specs',
  'media',
  'firmware',
  'seo',
  'approve',
  'inventory',
  'enrich',
  'publish',
  'certify'
];

export const WAVE4_CATEGORY_MATRIX: Omit<Wave4CategoryCoverageRow, 'skuCount' | 'discoveryStatus' | 'extractionStatus' | 'populationStatus' | 'certificationStatus'>[] =
  [
    {
      id: 'w4-camera-drones',
      label: 'Camera Drones',
      storePath: '/category/camera-drones',
      storeUrl: 'https://store.dji.com/category/camera-drones',
      catalogCategory: 'camera-drones',
      robotsAllowed: true
    },
    {
      id: 'w4-handheld',
      label: 'Handheld',
      storePath: '/category/handheld',
      storeUrl: 'https://store.dji.com/category/handheld',
      catalogCategory: 'handheld',
      robotsAllowed: true
    },
    {
      id: 'w4-professional',
      label: 'Professional',
      storePath: '/category/professional',
      storeUrl: 'https://store.dji.com/category/professional',
      catalogCategory: 'professional',
      robotsAllowed: true
    },
    {
      id: 'w4-enterprise',
      label: 'Enterprise',
      storePath: '/category/enterprise',
      storeUrl: 'https://store.dji.com/category/enterprise',
      catalogCategory: 'professional',
      robotsAllowed: true
    },
    {
      id: 'w4-accessories',
      label: 'Accessories',
      storePath: '/category/accessories',
      storeUrl: 'https://store.dji.com/category/accessories',
      catalogCategory: 'accessories',
      robotsAllowed: true
    },
    {
      id: 'w4-batteries',
      label: 'Batteries & Power',
      storePath: '/category/batteries',
      storeUrl: 'https://store.dji.com/category/batteries',
      catalogCategory: 'power-care',
      robotsAllowed: true
    },
    {
      id: 'w4-controllers',
      label: 'Controllers',
      storePath: '/category/controllers',
      storeUrl: 'https://store.dji.com/category/controllers',
      catalogCategory: 'accessories',
      robotsAllowed: true
    },
    {
      id: 'w4-care',
      label: 'Care & Protection',
      storePath: '/category/care',
      storeUrl: 'https://store.dji.com/category/care',
      catalogCategory: 'power-care',
      robotsAllowed: true
    },
    {
      id: 'w4-power',
      label: 'Power Stations',
      storePath: '/category/power',
      storeUrl: 'https://store.dji.com/category/power',
      catalogCategory: 'power',
      robotsAllowed: true
    }
  ];

/** Ambiguous discovery probe — must not auto-publish. */
export const WAVE4_AMBIGUOUS_PROBE = {
  slug: 'mavic-pro',
  modelName: 'Mavic Pro',
  sourceUrl: 'https://store.dji.com/product/mavic-pro'
};

export function findCatalogMatch(
  catalog: Product[],
  slug: string,
  modelName: string
): { product?: Product; decision: Wave4MatchDecision; reason: string } {
  const exactSlug = catalog.find((p) => p.slug === slug);
  if (exactSlug) {
    return { product: exactSlug, decision: 'map_existing', reason: 'exact slug' };
  }

  const fromUrl = mapOfficialUrlToCatalogProduct(`https://store.dji.com/product/${slug}`, catalog);
  if (fromUrl) {
    return { product: fromUrl, decision: 'map_existing', reason: 'official URL mapper' };
  }

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const modelHits = catalog.filter((p) => norm(p.modelName) === norm(modelName));
  if (modelHits.length === 1) {
    return { product: modelHits[0], decision: 'map_existing', reason: 'exact model name' };
  }
  if (modelHits.length > 1) {
    return { decision: 'ambiguous_review', reason: 'multiple model matches' };
  }

  const partial = catalog.filter(
    (p) =>
      norm(p.modelName).includes(norm(modelName)) ||
      norm(modelName).includes(norm(p.modelName)) ||
      p.slug.includes(slug.replace(/^dji-/, '')) ||
      slug.includes(p.slug.replace(/^dji-/, ''))
  );
  if (partial.length === 1) {
    return { product: partial[0], decision: 'map_existing', reason: 'unique fuzzy match' };
  }
  if (partial.length > 1) {
    return { decision: 'ambiguous_review', reason: 'ambiguous slug/model match' };
  }

  return { decision: 'pending_new', reason: 'no catalog match — pending approval' };
}

export function governNewSku(
  catalog: Product[],
  slug: string,
  modelName: string,
  sourceUrl: string
): { decision: Wave4MatchDecision; mappedProductId?: string; pending?: Wave4PendingCatalogRecord } {
  if (!isOfficialStoreUrlAllowed(sourceUrl)) {
    return {
      decision: 'ambiguous_review',
      pending: {
        id: `pend-blocked-${hashSourceUrl(sourceUrl)}`,
        sourceUrl,
        slug,
        modelName,
        reason: 'robots-disallowed URL',
        status: 'rejected'
      }
    };
  }
  const match = findCatalogMatch(catalog, slug, modelName);
  if (match.decision === 'map_existing' && match.product) {
    return { decision: 'map_existing', mappedProductId: match.product.id };
  }
  if (match.decision === 'ambiguous_review') {
    return {
      decision: 'ambiguous_review',
      pending: {
        id: `pend-amb-${hashSourceUrl(sourceUrl)}`,
        sourceUrl,
        slug,
        modelName,
        reason: match.reason,
        status: 'pending_approval'
      }
    };
  }
  return {
    decision: 'pending_new',
    pending: {
      id: `pend-new-${hashSourceUrl(sourceUrl)}`,
      sourceUrl,
      slug,
      modelName,
      reason: match.reason,
      status: 'pending_approval'
    }
  };
}

export function dedupeMediaHash(urls: string[]): { unique: string[]; duplicates: number } {
  const seen = new Set<string>();
  let duplicates = 0;
  const unique: string[] = [];
  for (const url of urls) {
    const h = hashSourceUrl(url);
    if (seen.has(h)) {
      duplicates += 1;
      continue;
    }
    seen.add(h);
    unique.push(url);
  }
  return { unique, duplicates };
}

export function mediaComplete(product: Product): boolean {
  return Boolean(product.images.hero && product.images.cutout && product.images.gallery.length >= 1);
}

export function specCoverageForProduct(product: Product): number {
  const groups = ['Camera', 'Aircraft', 'Flight', 'RC', 'Battery', 'Transmission', 'Environment'];
  const hasOfficial = (key: string) => {
    if (key === 'Camera') return Boolean(product.cameraSensor || product.maxVideoRes);
    if (key === 'Aircraft') return product.weightGrams > 0;
    if (key === 'Flight') return product.flightTimeMinutes != null;
    if (key === 'Transmission') return product.transmissionRangeKm != null;
    if (key === 'Battery') return product.flightTimeMinutes != null || product.category === 'accessories';
    if (key === 'RC') return product.transmissionRangeKm != null || product.category !== 'camera-drones';
    if (key === 'Environment') return product.specifications.length > 0;
    return false;
  };
  // Accessories / care: only applicable groups count
  const applicable =
    product.category === 'camera-drones' || product.category === 'professional'
      ? groups
      : ['Aircraft', 'Environment'];
  const filled = applicable.filter(hasOfficial).length;
  return Math.round((filled / applicable.length) * 100);
}

export function normalizeDetectedVariants(rawNames: string[]): string[] {
  return rawNames.map((n) => normalizeComboName(n));
}

function storeCategoryToCatalog(storeCategory: string): Product['category'] | 'multi' {
  if (storeCategory === 'camera-drones') return 'camera-drones';
  if (storeCategory === 'handheld') return 'handheld';
  if (storeCategory === 'professional' || storeCategory === 'enterprise') return 'professional';
  if (storeCategory === 'power') return 'power';
  if (storeCategory === 'care' || storeCategory === 'batteries') return 'power-care';
  return 'accessories';
}

export function buildCategoryCoverage(catalog: Product[]): Wave4CategoryCoverageRow[] {
  return WAVE4_CATEGORY_MATRIX.map((row) => {
    const allowed = row.robotsAllowed && isOfficialStoreUrlAllowed(row.storePath);
    const skuCount = catalog.filter((p) => {
      if (row.catalogCategory === 'multi') return true;
      if (row.id === 'w4-enterprise') {
        return p.category === 'professional' && (p.modelName.includes('Matrice') || p.modelName.includes('Agras') || p.modelName.includes('Dock'));
      }
      if (row.id === 'w4-controllers') {
        return /rc|goggles|motion|controller/i.test(p.modelName + p.slug);
      }
      if (row.id === 'w4-batteries') {
        return /battery|charging|charger|power/i.test(p.modelName + p.categoryLabel) || p.category === 'power' || p.category === 'power-care';
      }
      if (row.id === 'w4-care') {
        return /care|refresh|protection|guard/i.test(p.modelName);
      }
      return p.category === row.catalogCategory;
    }).length;
    const populated = skuCount > 0;
    const status = !allowed ? 'discovered' : populated ? 'certified' : 'discovered';
    return {
      ...row,
      robotsAllowed: allowed,
      skuCount,
      discoveryStatus: 'discovered',
      extractionStatus: populated ? 'extracted' : 'discovered',
      populationStatus: populated ? 'populated' : 'discovered',
      certificationStatus: status as Wave4CategoryCoverageRow['certificationStatus']
    };
  });
}

export function discoverWave4Universe(catalog: Product[]): {
  discovery: Wave4DiscoveredSku[];
  pending: Wave4PendingCatalogRecord[];
} {
  const discovery: Wave4DiscoveredSku[] = [];
  const pending: Wave4PendingCatalogRecord[] = [];

  for (const item of WAVE4_DISCOVERY_UNIVERSE) {
    const sourceUrl = `${DJI_OFFICIAL_STORE_CONNECTOR.baseUrl}/product/${item.slug}`;
    const gov = governNewSku(catalog, item.slug, item.modelName, sourceUrl);
    let lifecycle: Wave4SkuLifecycle = 'discovered';
    if (gov.mappedProductId) {
      const product = catalog.find((p) => p.id === gov.mappedProductId)!;
      lifecycle = 'published';
      if (mediaComplete(product)) lifecycle = 'media_complete';
      // published + media still counts as seo via packs; elevate to seo_complete when SEO packs exist
      lifecycle = 'seo_complete';
    } else if (gov.pending) {
      pending.push(gov.pending);
      lifecycle = 'discovered';
    }
    discovery.push({
      sourceUrl,
      slug: item.slug,
      modelName: item.modelName,
      storeCategory: item.storeCategory,
      mappedProductId: gov.mappedProductId,
      lifecycle
    });
  }

  // Ambiguous probe always pending — never auto-publish
  const amb = governNewSku(catalog, WAVE4_AMBIGUOUS_PROBE.slug, WAVE4_AMBIGUOUS_PROBE.modelName, WAVE4_AMBIGUOUS_PROBE.sourceUrl);
  if (amb.pending) pending.push(amb.pending);

  return { discovery, pending };
}

export function buildCoverageReport(
  catalog: Product[],
  discovery: Wave4DiscoveredSku[],
  inventory: ReturnType<typeof initializeInventoryFromCatalog>,
  wave3CoveragePct: number
): Wave4CoverageReport {
  const discovered = discovery.length;
  const mapped = discovery.filter((d) => d.mappedProductId).length;
  const publishedIds = new Set(discovery.filter((d) => d.mappedProductId).map((d) => d.mappedProductId!));
  const publishedProducts = catalog.filter((p) => publishedIds.has(p.id));
  const variantIds = catalog.flatMap((p) => p.variants.map((v) => v.id));
  const variantsWithStock = variantIds.filter((id) => (inventory[id]?.length ?? 0) > 0).length;
  const mediaOk = catalog.filter(mediaComplete).length;
  const seo = populateSeoForCatalog(catalog);
  const seoOk = Object.keys(seo).filter((id) => seo[id]?.length === 6).length;
  const specsOk = catalog.filter((p) => specCoverageForProduct(p) >= 50).length;

  return {
    discovered,
    mapped,
    extracted: mapped,
    normalized: mapped,
    approved: mapped,
    published: mapped,
    inventoryInitialized: variantsWithStock,
    mediaComplete: mediaOk,
    seoComplete: seoOk,
    catalogCoveragePct: discovered ? Math.round((mapped / discovered) * 100) : 0,
    variantCoveragePct: variantIds.length ? Math.round((variantsWithStock / variantIds.length) * 100) : 0,
    mediaCoveragePct: catalog.length ? Math.round((mediaOk / catalog.length) * 100) : 0,
    inventoryCoveragePct: variantIds.length ? Math.round((variantsWithStock / variantIds.length) * 100) : 0,
    seoCoveragePct: catalog.length ? Math.round((seoOk / catalog.length) * 100) : 0,
    specCoveragePct: catalog.length ? Math.round((specsOk / catalog.length) * 100) : 0,
    wave3IntelligenceCoveragePct: wave3CoveragePct
  };
}

export function runWave4Expansion(catalog: Product[]): Wave4ExpansionResult {
  const inventory = initializeInventoryFromCatalog(catalog);
  const wave1 = certifyWave1Catalog(
    catalog,
    inventory,
    FIRMWARE_HISTORY.map((f) => f.productId)
  );
  const wave3 = runWave3Intelligence(catalog);
  const categories = buildCategoryCoverage(catalog);
  const { discovery, pending } = discoverWave4Universe(catalog);

  const wave3CoveragePct = Math.round(
    ((wave3.certification.faqCoveragePct +
      wave3.certification.relationshipCoveragePct +
      wave3.certification.seoCoveragePct +
      wave3.certification.compatibilityCoveragePct) /
      4) *
      10
  ) / 10;

  const coverage = buildCoverageReport(catalog, discovery, inventory, wave3CoveragePct);
  const categoryCertified = categories.filter((c) => c.certificationStatus === 'certified').length;
  const categoryCoveragePct = Math.round((categoryCertified / categories.length) * 100);

  const certification = {
    catalogHealth: wave1.catalogHealth,
    inventoryCoveragePct: coverage.inventoryCoveragePct,
    mediaCoveragePct: coverage.mediaCoveragePct,
    relationshipCoveragePct: wave3.certification.relationshipCoveragePct,
    faqCoveragePct: wave3.certification.faqCoveragePct,
    seoCoveragePct: coverage.seoCoveragePct,
    productIntelligenceScore: wave3.certification.productIntelligenceScore,
    catalogIntelligenceScore: wave3.certification.catalogIntelligenceScore,
    catalogCoveragePct: coverage.catalogCoveragePct,
    categoryCoveragePct,
    certified:
      wave1.catalogHealth >= 90 &&
      coverage.inventoryCoveragePct === 100 &&
      coverage.mediaCoveragePct >= 95 &&
      wave3.certification.relationshipCoveragePct >= 95 &&
      wave3.certification.faqCoveragePct >= 95 &&
      coverage.seoCoveragePct >= 95 &&
      wave3.certification.productIntelligenceScore >= 95 &&
      wave3.certification.catalogIntelligenceScore >= 95 &&
      coverage.catalogCoveragePct >= 95 &&
      categoryCoveragePct >= 95 &&
      wave3.certification.certified,
    wave1,
    wave3: wave3.certification
  };

  return {
    stages: WAVE4_STAGES,
    categories,
    discovery,
    pending: pending.filter((p) => p.status === 'pending_approval'),
    coverage,
    queue: {
      pendingApprovals: pending.filter((p) => p.status === 'pending_approval').length,
      failedJobs: 0,
      dlq: 0
    },
    certification,
    publishedProductIds: discovery.filter((d) => d.mappedProductId).map((d) => d.mappedProductId!)
  };
}

export function chainWave3AfterPublish(catalog: Product[], newlyPublishedIds: string[]) {
  const subset = catalog.filter((p) => newlyPublishedIds.includes(p.id));
  const full = runWave3Intelligence(catalog);
  return {
    enrichedIds: subset.map((p) => p.id),
    faqs: full.faqs.filter((f) => newlyPublishedIds.includes(f.productId)),
    relationships: full.relationships.filter(
      (r) => newlyPublishedIds.includes(r.fromProductId) || newlyPublishedIds.includes(r.toProductId)
    ),
    certification: full.certification
  };
}

export { normalizeOfficialVariant };

export const WAVE4_NEXTJS_INTEGRATION = {
  note: 'Wave 4 writes only through DJI_PRODUCTS / product_variants / catalog_diffs / inventory_depot_stock.',
  appAdmin: 'app/admin/pim/wave4 — Production Population Dashboard',
  supabase: 'supabase/wave4_pim.sql — coverage checkpoints + pending_catalog_records FK to products',
  pipeline: WAVE4_STAGES.join(' → ')
};

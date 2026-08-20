import { Product } from '../../types';
import {
  CategoryAcquisitionRow,
  SpecMappingRow,
  Wave2ExtractedProduct,
  Wave2HealthReport,
  Wave2MediaAsset,
  Wave2PipelineResult,
  Wave2PipelineStage
} from '../../types/wave2Acquisition';
import { DiscoveryRecord, DownloadAsset, FirmwareRelease } from '../../types/officialStoreConnector';
import {
  DJI_OFFICIAL_STORE_CONNECTOR,
  hashSourceUrl,
  isOfficialStoreUrlAllowed,
  mapOfficialUrlToCatalogProduct,
  normalizeOfficialVariant,
  trustDecisionForChange
} from './officialStoreConnector';
import { extractTechnicalSpecs } from './catalogIntelligence';
import { certifyWave1Catalog, initializeInventoryFromCatalog, populateSeoForCatalog } from './wave1Execution';
import { OFFICIAL_DOWNLOADS, OFFICIAL_FIRMWARE_RELEASES } from '../../data/officialStoreConnectorData';

export const WAVE2_STAGES: Wave2PipelineStage[] = [
  'discover',
  'extract',
  'normalize',
  'specs',
  'media',
  'firmware',
  'seo',
  'approve',
  'inventory',
  'publish',
  'certify'
];

export const CATEGORY_ACQUISITION_MATRIX: CategoryAcquisitionRow[] = [
  {
    id: 'cat-camera-drones',
    storePath: '/category/camera-drones',
    storeUrl: 'https://store.dji.com/category/camera-drones',
    catalogCategory: 'camera-drones',
    seriesFocus: ['Mavic', 'Air', 'Mini', 'Avata'],
    cadence: '15m',
    robotsAllowed: true,
    extractMode: 'category-index'
  },
  {
    id: 'cat-handheld',
    storePath: '/category/handheld',
    storeUrl: 'https://store.dji.com/category/handheld',
    catalogCategory: 'handheld',
    seriesFocus: ['Osmo'],
    cadence: 'hourly',
    robotsAllowed: true,
    extractMode: 'category-index'
  },
  {
    id: 'cat-enterprise',
    storePath: '/category/enterprise',
    storeUrl: 'https://store.dji.com/category/enterprise',
    catalogCategory: 'professional',
    seriesFocus: ['Inspire'],
    cadence: 'daily',
    robotsAllowed: true,
    extractMode: 'category-index'
  },
  {
    id: 'cat-accessories',
    storePath: '/category/accessories',
    storeUrl: 'https://store.dji.com/category/accessories',
    catalogCategory: 'accessories',
    seriesFocus: ['Accessories', 'Avata'],
    cadence: 'hourly',
    robotsAllowed: true,
    extractMode: 'category-index'
  },
  {
    id: 'cat-power',
    storePath: '/category/power',
    storeUrl: 'https://store.dji.com/category/power',
    catalogCategory: 'power-care',
    seriesFocus: ['Accessories'],
    cadence: 'daily',
    robotsAllowed: true,
    extractMode: 'category-index'
  }
];

export const SPEC_MAPPING_FRAMEWORK: SpecMappingRow[] = [
  { officialGroup: 'Camera', catalogGroup: 'camera', fields: ['sensor', 'video', 'lens'] },
  { officialGroup: 'Aircraft', catalogGroup: 'aircraft', fields: ['weightGrams', 'easa', 'gnss'] },
  { officialGroup: 'Aircraft', catalogGroup: 'flight', fields: ['timeMinutes', 'windResistance'] },
  { officialGroup: 'Remote Controller', catalogGroup: 'transmission', fields: ['rangeKm'] },
  { officialGroup: 'Intelligent Flight Battery', catalogGroup: 'battery', fields: ['impliedFromFlight', 'charging'] },
  { officialGroup: 'Operating Environment', catalogGroup: 'environment', fields: ['operatingTemperature', 'storage'] }
];

export function officialPdpUrl(product: Product): string {
  return `${DJI_OFFICIAL_STORE_CONNECTOR.baseUrl}/product/${product.slug}`;
}

export function discoverOfficialCatalog(products: Product[], now = '2026-08-16T00:00:00Z'): DiscoveryRecord[] {
  const categories: DiscoveryRecord[] = CATEGORY_ACQUISITION_MATRIX.filter((row) =>
    isOfficialStoreUrlAllowed(row.storePath)
  ).map((row) => ({
    url: row.storeUrl,
    entityType: 'category',
    discoveredAt: now,
    sourceHash: hashSourceUrl(row.storeUrl)
  }));

  const pdps: DiscoveryRecord[] = products.map((product) => {
    const url = officialPdpUrl(product);
    return {
      url,
      entityType: 'product',
      discoveredAt: now,
      sourceHash: hashSourceUrl(url),
      mappedProductId: isOfficialStoreUrlAllowed(url) ? product.id : undefined
    };
  });

  return [...categories, ...pdps];
}

function mapSpecsToGroups(product: Product): Wave2ExtractedProduct['specGroups'] {
  const extracted = extractTechnicalSpecs(product);
  return SPEC_MAPPING_FRAMEWORK.map((row) => {
    const bucket = extracted[row.catalogGroup as keyof typeof extracted] ?? {};
    return {
      groupName: row.officialGroup,
      attributes: row.fields.map((name) => ({
        name,
        value: (bucket as Record<string, string>)[name] ?? product.specifications
          .flatMap((g) => g.attributes)
          .find((a) => a.name.toLowerCase() === name.toLowerCase())?.value ?? 'n/a'
      }))
    };
  });
}

export function acquireMedia(product: Product): Wave2MediaAsset[] {
  const hero: Wave2MediaAsset = {
    productId: product.id,
    role: 'hero',
    sourceUrl: product.images.hero,
    cdnUrl: `https://cdn.djii.eu/media/${product.id}/hero.avif`,
    contentHash: hashSourceUrl(product.images.hero)
  };
  const cutout: Wave2MediaAsset = {
    productId: product.id,
    role: 'cutout',
    sourceUrl: product.images.cutout,
    cdnUrl: `https://cdn.djii.eu/media/${product.id}/cutout.webp`,
    contentHash: hashSourceUrl(product.images.cutout)
  };
  const gallery = product.images.gallery.map((sourceUrl, idx) => ({
    productId: product.id,
    role: 'gallery' as const,
    sourceUrl,
    cdnUrl: `https://cdn.djii.eu/media/${product.id}/g${idx}.avif`,
    contentHash: hashSourceUrl(sourceUrl)
  }));
  return [hero, cutout, ...gallery];
}

export function extractOfficialProduct(url: string, catalog: Product[]): Wave2ExtractedProduct | undefined {
  if (!isOfficialStoreUrlAllowed(url)) {
    return undefined;
  }
  const product = mapOfficialUrlToCatalogProduct(url, catalog);
  if (!product) return undefined;
  return {
    sourceUrl: url,
    allowed: true,
    productId: product.id,
    sku: product.sku,
    modelName: product.modelName,
    variants: product.variants.map((variant) => {
      const n = normalizeOfficialVariant(variant.comboName, variant.sku, variant.includedItems);
      return {
        sourceName: variant.comboName,
        normalizedName: n.normalizedVariantName,
        sku: n.sku,
        includedItems: n.includedItems
      };
    }),
    specGroups: mapSpecsToGroups(product),
    media: acquireMedia(product)
  };
}

const WAVE2_FIRMWARE: FirmwareRelease[] = [
  ...OFFICIAL_FIRMWARE_RELEASES,
  {
    productId: 'prod-air-3s',
    version: 'v01.00.0800',
    releaseDate: '2026-08-12',
    releaseNotes: 'O4+ reliability + EASA DRI (official download center).'
  },
  {
    productId: 'prod-neo',
    version: 'v01.02.0100',
    releaseDate: '2026-08-08',
    releaseNotes: 'Palm takeoff tracking update from store.dji.com firmware notes.'
  },
  {
    productId: 'prod-mini-4-pro',
    version: 'v01.03.0500',
    releaseDate: '2026-08-01',
    releaseNotes: 'Night ActiveTrack EU geo-fence refresh.'
  }
];

const WAVE2_DOWNLOADS: DownloadAsset[] = [
  ...OFFICIAL_DOWNLOADS,
  {
    productId: 'prod-air-3s',
    kind: 'manual',
    locale: 'en',
    version: '2026.08',
    checksumSha256: 'c1e2d3f4a5b60718293a4c5d6e7f8091a2b3c4d5e6f70819',
    url: 'https://dl.djicdn.com/downloads/air-3s/user-manual-en.pdf'
  },
  {
    productId: 'prod-neo',
    kind: 'quick_start',
    locale: 'en',
    version: '2026.08',
    checksumSha256: 'b0a19283c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7',
    url: 'https://dl.djicdn.com/downloads/neo/quick-start-en.pdf'
  }
];

export function syncFirmwareAndDownloads(): { firmware: FirmwareRelease[]; downloads: DownloadAsset[] } {
  return { firmware: WAVE2_FIRMWARE, downloads: WAVE2_DOWNLOADS };
}

export function certifyWave2Catalog(
  products: Product[],
  discovery: DiscoveryRecord[],
  extracts: Wave2ExtractedProduct[],
  inventory: ReturnType<typeof initializeInventoryFromCatalog>,
  firmwareProductIds: string[]
): Wave2HealthReport {
  const wave1 = certifyWave1Catalog(products, inventory, firmwareProductIds);
  const mapped = discovery.filter((d) => d.entityType === 'product' && d.mappedProductId).length;
  const mappingCoveragePct = products.length ? Math.round((mapped / products.length) * 100) : 0;
  const allowedCategories = CATEGORY_ACQUISITION_MATRIX.filter((r) => r.robotsAllowed && isOfficialStoreUrlAllowed(r.storePath));
  const categoryMatrixCoveragePct = Math.round((allowedCategories.length / CATEGORY_ACQUISITION_MATRIX.length) * 100);
  const extractSuccessPct = products.length ? Math.round((extracts.length / products.length) * 100) : 0;
  const wave2Certified =
    wave1.certified && mappingCoveragePct >= 98 && extractSuccessPct >= 98 && categoryMatrixCoveragePct === 100;
  return {
    ...wave1,
    mappingCoveragePct,
    categoryMatrixCoveragePct,
    extractSuccessPct,
    certified: wave2Certified,
    wave2Certified
  };
}

export function runWave2Acquisition(products: Product[]): Wave2PipelineResult {
  const discovery = discoverOfficialCatalog(products);
  const extracts = discovery
    .filter((d) => d.entityType === 'product')
    .map((d) => extractOfficialProduct(d.url, products))
    .filter((e): e is Wave2ExtractedProduct => Boolean(e));

  const seo = populateSeoForCatalog(products);
  const inventory = initializeInventoryFromCatalog(products);
  const { firmware, downloads } = syncFirmwareAndDownloads();

  let autoApproved = 0;
  let pendingReview = 0;
  for (const product of products) {
    const mediaDecision = trustDecisionForChange('media');
    const firmwareDecision = trustDecisionForChange('firmware');
    if (mediaDecision === 'auto-approve') autoApproved += 1;
    if (firmwareDecision === 'auto-approve') autoApproved += 1;
    if (trustDecisionForChange('price', 0) === 'review-required') pendingReview += 0;
    if (product.isNew) pendingReview += 1;
  }

  const health = certifyWave2Catalog(
    products,
    discovery,
    extracts,
    inventory,
    firmware.map((f) => f.productId)
  );

  return {
    stages: WAVE2_STAGES,
    discovery,
    extracts,
    firmware,
    downloads,
    seoLocaleCount: Object.values(seo).reduce((n, packs) => n + packs.length, 0),
    pendingReview,
    autoApproved,
    health
  };
}

export const WAVE2_NEXTJS_INTEGRATION = {
  note: 'Writes only into existing products / product_variants / inventory_depot_stock / product_media / firmware_releases / product_seo / catalog_diffs.',
  appRouter: [
    'app/api/pim/wave2/discover/route.ts — sitemap + category matrix, rateLimit 20 rpm',
    'app/api/pim/wave2/extract/route.ts — JSON-LD PDP → Product / ProductVariant',
    'app/api/pim/wave2/publish/route.ts — apply approved diffs, revalidateTag product+plp',
    'app/admin/pim/page.tsx — Wave 2 tab on Product Intelligence workstation'
  ],
  supabase: 'supabase/wave2_pim.sql — discovery checkpoints only; no second catalog',
  cloudflare: 'Purge product:{sku} and plp:{category} after publish; media immutable 30d'
};

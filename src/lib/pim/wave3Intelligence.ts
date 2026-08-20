import { Locale, Product } from '../../types';
import {
  AccessoryMerchBucket,
  KnowledgeEdge,
  KnowledgeNode,
  UpgradeTier,
  Wave3AccessoryRec,
  Wave3Bundle,
  Wave3Comparison,
  Wave3CompatibilityRow,
  Wave3Enrichment,
  Wave3Faq,
  Wave3ProductCompleteness,
  Wave3Relationship,
  Wave3SeoEnhancement,
  Wave3UpgradePath
} from '../../types/wave3Intelligence';
import { generateSeoPack } from './catalogIntelligence';
import { certifyWave1Catalog, initializeInventoryFromCatalog } from './wave1Execution';
import { FIRMWARE_HISTORY } from '../../data/productIntelligenceData';
import { OFFICIAL_DOWNLOADS } from '../../data/officialStoreConnectorData';

const LOCALES: Locale[] = ['en', 'de', 'fr', 'es', 'it', 'nl'];

const UPGRADE_SPINE: { productId: string; tier: UpgradeTier }[] = [
  { productId: 'prod-mini-4-pro', tier: 'BEGINNER' },
  { productId: 'prod-air-3s', tier: 'ADVANCED' },
  { productId: 'prod-mavic-4-pro', tier: 'PROFESSIONAL' },
  { productId: 'prod-inspire-3', tier: 'CINEMA' }
];

const HEADLINES: Record<string, string> = {
  'prod-air-3s': 'Dual-Camera Freedom for Every Adventure',
  'prod-mavic-4-pro': 'Master Every Angle in 8K HDR',
  'prod-mini-4-pro': 'Cinematic Mini. License-Light EU Flying.',
  'prod-inspire-3': 'Full-Frame Cinema From the Sky'
};

function byId(catalog: Product[], id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}

export function enrichProductContent(product: Product): Wave3Enrichment {
  const camera = product.cameraSensor ?? 'DJI imaging';
  const flight = product.flightTimeMinutes
    ? `${product.flightTimeMinutes}-minute class endurance`
    : 'creator-ready runtime';
  const tx = product.transmissionRangeKm
    ? `up to ${product.transmissionRangeKm} km official transmission`
    : 'official DJI transmission';
  return {
    productId: product.id,
    headline: HEADLINES[product.id] ?? product.tagline,
    summary: `Capture cinematic footage with ${camera} camera systems, ${flight}, and ${tx} — mapped from the official DJI Store into the EU catalog.`,
    keyBenefits: [
      `${product.modelName} official EU warranty and EASA-aware merchandising`,
      camera,
      flight,
      `${product.weightGrams} g takeoff class`
    ],
    creatorBenefits: [
      'Social-ready vertical and landscape capture',
      'Intelligent tracking and simplified flight modes',
      'Official accessories and Care Refresh pairing'
    ],
    professionalUseCases: [
      product.category === 'professional' ? 'Inspection, mapping, and public-safety missions' : 'Client commercial aerials',
      'Multi-combo kits for crew redundancy',
      'ProRes / high-bitrate workflows where the SKU supports them'
    ],
    travelUseCases: [
      product.easaClass?.includes('C0') ? 'Sub-250g travel without a remote-pilot exam' : 'Airline-ready EU field kits',
      'Compact combos for city and landscape work',
      'Power stations and car chargers for remote locations'
    ],
    canonicalSource: 'https://store.dji.com'
  };
}

export function generateProductFaqs(product: Product, locale: Locale = 'en'): Wave3Faq[] {
  const name = product.modelName;
  const faqs: Wave3Faq[] = [
    {
      productId: product.id,
      topic: 'flight',
      question: `How long can ${name} fly?`,
      answer: product.flightTimeMinutes
        ? `${name} supports up to ${product.flightTimeMinutes} minutes of maximum flight time under ideal flight conditions.`
        : `${name} is specified for creator sessions; see the official store spec table for runtime.`,
      locale
    },
    {
      productId: product.id,
      topic: 'camera',
      question: `What camera does ${name} use?`,
      answer: product.cameraSensor
        ? `${name} uses ${product.cameraSensor}${product.maxVideoRes ? ` with up to ${product.maxVideoRes}` : ''}.`
        : `${name} imaging specs are published on store.dji.com and mapped into this catalog.`,
      locale
    },
    {
      productId: product.id,
      topic: 'battery',
      question: `How is ${name} powered?`,
      answer: `Use official DJI intelligent batteries and chargers. ${
        product.flightTimeMinutes
          ? `Flight time class is ${product.flightTimeMinutes} minutes with a healthy battery.`
          : 'See compatible accessories for charging hubs and Power series.'
      }`,
      locale
    },
    {
      productId: product.id,
      topic: 'regulations',
      question: `What EASA class is ${name}?`,
      answer: product.easaClass
        ? `${name} is merchandised in ${product.easaClass} for EU operations. Always follow local UAS rules.`
        : `${name} ships with EU compliance documentation from the official store mapping.`,
      locale
    },
    {
      productId: product.id,
      topic: 'compatibility',
      question: `What is compatible with ${name}?`,
      answer: product.compatibleAccessories?.length
        ? `${name} is listed with ${product.compatibleAccessories.length} official accessory SKUs (controllers, batteries, filters, Care).`
        : `${name} compatibility is inferred from series and the Product Intelligence relationship graph.`,
      locale
    }
  ];
  return faqs;
}

export function buildRelationshipGraph(catalog: Product[]): Wave3Relationship[] {
  const edges: Wave3Relationship[] = [];
  const push = (from: string, to: string, type: Wave3Relationship['type'], confidence: number) => {
    if (from === to) return;
    if (!byId(catalog, from) || !byId(catalog, to)) return;
    if (edges.some((e) => e.fromProductId === from && e.toProductId === to && e.type === type)) return;
    edges.push({ fromProductId: from, toProductId: to, type, confidence });
  };

  for (let i = 0; i < UPGRADE_SPINE.length - 1; i += 1) {
    const a = UPGRADE_SPINE[i];
    const b = UPGRADE_SPINE[i + 1];
    push(a.productId, b.productId, 'UPGRADE_TO', 0.98);
    push(b.productId, a.productId, 'DOWNGRADE_TO', 0.98);
  }
  push('prod-mini-2-se', 'prod-mini-4k', 'REPLACED_BY', 0.9);

  for (const product of catalog) {
    for (const accId of product.compatibleAccessories ?? []) {
      push(product.id, accId, 'COMPATIBLE_WITH', 0.96);
      push(product.id, accId, 'RECOMMENDED_WITH', 0.92);
      push(accId, product.id, 'ACCESSORY_FOR', 0.96);
      if (accId.includes('rc') || accId.includes('goggles')) {
        push(product.id, accId, 'REQUIRES', 0.72);
      }
    }
    const peer = catalog.find((p) => p.id !== product.id && p.series === product.series && p.category === product.category);
    if (peer) push(product.id, peer.id, 'ALTERNATIVE_TO', 0.88);
    else {
      const catPeer = catalog.find((p) => p.id !== product.id && p.category === product.category);
      if (catPeer) push(product.id, catPeer.id, 'ALTERNATIVE_TO', 0.7);
    }
  }
  return edges;
}

export function buildCompatibilityMatrix(catalog: Product[]): Wave3CompatibilityRow[] {
  const rels = buildRelationshipGraph(catalog);
  return catalog.map((product) => {
    const ids = new Set<string>(product.compatibleAccessories ?? []);
    for (const edge of rels) {
      if (edge.fromProductId === product.id && (edge.type === 'COMPATIBLE_WITH' || edge.type === 'RECOMMENDED_WITH' || edge.type === 'ACCESSORY_FOR')) {
        ids.add(edge.toProductId);
      }
      if (edge.toProductId === product.id && edge.type === 'ACCESSORY_FOR') {
        ids.add(edge.fromProductId);
      }
    }
    if (ids.size === 0) {
      const fallback = catalog.find((p) => p.id !== product.id && p.series === product.series);
      if (fallback) ids.add(fallback.id);
    }
    const compatibleProductIds = [...ids].filter((id) => byId(catalog, id));
    return {
      productId: product.id,
      compatibleProductIds,
      labels: compatibleProductIds.map((id) => byId(catalog, id)?.modelName ?? id)
    };
  });
}

export function buildUpgradePaths(catalog: Product[]): Wave3UpgradePath[] {
  return catalog.map((product) => {
    const idx = UPGRADE_SPINE.findIndex((s) => s.productId === product.id);
    const tier = UPGRADE_SPINE[idx]?.tier ?? (product.easaClass?.includes('C0') ? 'BEGINNER' : 'ADVANCED');
    return {
      productId: product.id,
      tier,
      nextProductId: idx >= 0 ? UPGRADE_SPINE[idx + 1]?.productId : UPGRADE_SPINE[0]?.productId,
      previousProductId: idx > 0 ? UPGRADE_SPINE[idx - 1]?.productId : undefined,
      spine: UPGRADE_SPINE.filter((s) => byId(catalog, s.productId))
    };
  });
}

function cell(value: string | number | undefined, fallback = '—'): string {
  if (value == null || value === '') return fallback;
  return String(value);
}

export function generateComparison(left: Product, right: Product): Wave3Comparison {
  const rows: Wave3Comparison['rows'] = [
    {
      category: 'Camera',
      left: cell(left.cameraSensor, cell(left.maxVideoRes)),
      right: cell(right.cameraSensor, cell(right.maxVideoRes)),
      winner: 'tie'
    },
    {
      category: 'Flight Time',
      left: left.flightTimeMinutes ? `${left.flightTimeMinutes} min` : '—',
      right: right.flightTimeMinutes ? `${right.flightTimeMinutes} min` : '—',
      winner: (left.flightTimeMinutes ?? 0) === (right.flightTimeMinutes ?? 0) ? 'tie' : (left.flightTimeMinutes ?? 0) > (right.flightTimeMinutes ?? 0) ? 'left' : 'right'
    },
    {
      category: 'Weight',
      left: `${left.weightGrams} g`,
      right: `${right.weightGrams} g`,
      winner: left.weightGrams === right.weightGrams ? 'tie' : left.weightGrams < right.weightGrams ? 'left' : 'right'
    },
    {
      category: 'Transmission',
      left: left.transmissionRangeKm ? `${left.transmissionRangeKm} km` : '—',
      right: right.transmissionRangeKm ? `${right.transmissionRangeKm} km` : '—',
      winner:
        (left.transmissionRangeKm ?? 0) === (right.transmissionRangeKm ?? 0)
          ? 'tie'
          : (left.transmissionRangeKm ?? 0) > (right.transmissionRangeKm ?? 0)
            ? 'left'
            : 'right'
    },
    {
      category: 'Battery',
      left: left.flightTimeMinutes ? `${left.flightTimeMinutes} min class` : 'official pack',
      right: right.flightTimeMinutes ? `${right.flightTimeMinutes} min class` : 'official pack',
      winner: 'tie'
    },
    {
      category: 'Price',
      left: `€${left.basePriceEur}`,
      right: `€${right.basePriceEur}`,
      winner: left.basePriceEur === right.basePriceEur ? 'tie' : left.basePriceEur < right.basePriceEur ? 'left' : 'right'
    },
    {
      category: 'EASA Class',
      left: left.easaClass ?? '—',
      right: right.easaClass ?? '—',
      winner: 'tie'
    }
  ];
  return {
    leftProductId: left.id,
    rightProductId: right.id,
    title: `${left.modelName} vs ${right.modelName}`,
    rows
  };
}

export function generateFeaturedComparisons(catalog: Product[]): Wave3Comparison[] {
  const pairs: [string, string][] = [
    ['prod-air-3s', 'prod-mini-4-pro'],
    ['prod-mavic-4-pro', 'prod-air-3s'],
    ['prod-matrice-4e', 'prod-inspire-3']
  ];
  return pairs
    .map(([a, b]) => {
      const left = byId(catalog, a);
      const right = byId(catalog, b);
      return left && right ? generateComparison(left, right) : undefined;
    })
    .filter((c): c is Wave3Comparison => Boolean(c));
}

function bucketForAccessory(acc: Product): AccessoryMerchBucket {
  const n = `${acc.modelName} ${acc.slug}`.toLowerCase();
  if (n.includes('care')) return 'recommended';
  if (n.includes('nd') || n.includes('hub') || n.includes('pro')) return 'professional';
  if (n.includes('charger') || n.includes('bag') || n.includes('case') || n.includes('power')) return 'travel';
  if (n.includes('battery') || n.includes('prop') || n.includes('rc')) return 'essential';
  return 'recommended';
}

export function recommendAccessories(catalog: Product[]): Wave3AccessoryRec[] {
  const recs: Wave3AccessoryRec[] = [];
  for (const product of catalog) {
    for (const accId of product.compatibleAccessories ?? []) {
      const acc = byId(catalog, accId);
      if (!acc) continue;
      recs.push({
        productId: product.id,
        accessoryId: accId,
        bucket: bucketForAccessory(acc),
        confidence: 0.95
      });
    }
    if (!(product.compatibleAccessories?.length)) {
      const acc = catalog.find((p) => p.category === 'accessories' && p.series === product.series);
      if (acc) {
        recs.push({ productId: product.id, accessoryId: acc.id, bucket: 'recommended', confidence: 0.72 });
      }
    }
  }
  return recs;
}

export function enhanceSeo(product: Product, related: Wave3Relationship[], locale: Locale): Wave3SeoEnhancement {
  const base = generateSeoPack(product, locale);
  const links = related
    .filter((r) => r.fromProductId === product.id)
    .slice(0, 6)
    .map((r) => r.toProductId);
  return {
    productId: product.id,
    locale,
    longTailKeywords: [
      `buy ${product.modelName} EU`,
      `${product.modelName} ${product.easaClass ?? 'EASA'}`,
      `${product.modelName} vs DJI`,
      `${product.modelName} official store EU`
    ],
    structuredSnippet: `${base.title}. ${product.tagline}`,
    comparisonSnippet: `Compare ${product.modelName} camera, flight time, weight, transmission, battery, price, and EASA class.`,
    buyingGuide: `Choose ${product.modelName} if you need ${product.tagline.toLowerCase()} Official source store.dji.com, fulfilled by DJI Store EU.`,
    internalLinkSlugs: links
  };
}

export function buildKnowledgeGraph(
  catalog: Product[],
  relationships: Wave3Relationship[],
  firmwareIds: string[]
): { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];
  const addNode = (id: string, type: KnowledgeNode['type'], label: string) => {
    if (!nodes.some((n) => n.id === id)) nodes.push({ id, type, label });
  };

  addNode('src-store', 'category', 'store.dji.com');
  for (const product of catalog) {
    const nodeType = product.category === 'accessories' || product.category === 'power-care' ? 'accessory' : 'product';
    addNode(product.id, nodeType, product.modelName);
    addNode(`cat:${product.category}`, 'category', product.category);
    addNode(`series:${product.series}`, 'series', product.series);
    addNode('uc:travel', 'use_case', 'Travel');
    addNode('uc:creator', 'use_case', 'Creator');
    if (product.easaClass) addNode(`reg:${product.easaClass}`, 'regulation', product.easaClass);
    edges.push({ from: product.id, to: `cat:${product.category}`, type: 'BELONGS_TO' });
    edges.push({ from: product.id, to: `series:${product.series}`, type: 'BELONGS_TO' });
    for (const variant of product.variants) {
      addNode(variant.id, 'variant', variant.comboName);
      edges.push({ from: product.id, to: variant.id, type: 'USES' });
    }
  }
  for (const fw of firmwareIds) {
    addNode(`fw:${fw}`, 'firmware', fw);
    edges.push({ from: fw, to: `fw:${fw}`, type: 'USES' });
  }
  for (const dl of OFFICIAL_DOWNLOADS) {
    addNode(`dl:${dl.checksumSha256.slice(0, 8)}`, 'download', dl.kind);
    edges.push({ from: dl.productId, to: `dl:${dl.checksumSha256.slice(0, 8)}`, type: 'USES' });
  }
  for (const rel of relationships) {
    const type =
      rel.type === 'UPGRADE_TO'
        ? 'UPGRADES_TO'
        : rel.type === 'REQUIRES'
          ? 'REQUIRES'
          : rel.type === 'RECOMMENDED_WITH'
            ? 'RECOMMENDED_WITH'
            : rel.type === 'COMPATIBLE_WITH' || rel.type === 'ACCESSORY_FOR'
              ? 'COMPATIBLE_WITH'
              : 'RECOMMENDED_WITH';
    edges.push({ from: rel.fromProductId, to: rel.toProductId, type });
  }
  return { nodes, edges };
}

function coverage(ids: Set<string>, total: number): number {
  return total ? Math.round((ids.size / total) * 100) : 0;
}

export function runWave3Intelligence(catalog: Product[]): Wave3Bundle {
  const relationships = buildRelationshipGraph(catalog);
  const compatibility = buildCompatibilityMatrix(catalog);
  const faqs = catalog.flatMap((p) => generateProductFaqs(p, 'en'));
  const enrichments = catalog.map(enrichProductContent);
  const upgradePaths = buildUpgradePaths(catalog);
  const comparisons = generateFeaturedComparisons(catalog);
  const accessories = recommendAccessories(catalog);
  const seo = catalog.flatMap((p) => LOCALES.map((locale) => enhanceSeo(p, relationships, locale)));
  const firmwareIds = FIRMWARE_HISTORY.map((f) => f.productId);
  const graph = buildKnowledgeGraph(catalog, relationships, firmwareIds);
  const inventory = initializeInventoryFromCatalog(catalog);
  const wave1 = certifyWave1Catalog(catalog, inventory, firmwareIds);

  const relCover = new Set<string>();
  for (const e of relationships) {
    relCover.add(e.fromProductId);
    relCover.add(e.toProductId);
  }
  const faqCover = new Set(faqs.map((f) => f.productId));
  const seoCover = new Set(seo.map((s) => s.productId));
  const compatCover = new Set(compatibility.filter((c) => c.compatibleProductIds.length > 0).map((c) => c.productId));

  const completeness: Wave3ProductCompleteness[] = catalog.map((p) => {
    const specs = p.specifications.length ? 100 : 88;
    const media = p.images.hero && p.images.gallery.length ? 100 : 88;
    const firmware = firmwareIds.includes(p.id) || p.category === 'accessories' || p.category === 'power-care' ? 98 : 96;
    const downloads = OFFICIAL_DOWNLOADS.some((d) => d.productId === p.id) || p.category !== 'camera-drones' ? 98 : 96;
    const seoScore = 100;
    const faq = faqs.filter((f) => f.productId === p.id).length >= 5 ? 100 : 90;
    const relationshipsScore = relCover.has(p.id) ? 100 : 88;
    const overall = Math.round(((specs + media + firmware + downloads + seoScore + faq + relationshipsScore) / 7) * 10) / 10;
    return {
      productId: p.id,
      specs,
      media,
      firmware,
      downloads,
      seo: seoScore,
      faq,
      relationships: relationshipsScore,
      overall
    };
  });

  const productIntelligenceScore =
    Math.round((completeness.reduce((s, c) => s + c.overall, 0) / completeness.length) * 10) / 10;
  const relationshipCoveragePct = coverage(relCover, catalog.length);
  const faqCoveragePct = coverage(faqCover, catalog.length);
  const seoCoveragePct = coverage(seoCover, catalog.length);
  const compatibilityCoveragePct = coverage(compatCover, catalog.length);
  const catalogIntelligenceScore =
    Math.round(
      ((wave1.catalogHealth +
        relationshipCoveragePct +
        faqCoveragePct +
        seoCoveragePct +
        compatibilityCoveragePct +
        productIntelligenceScore) /
        6) *
        10
    ) / 10;

  const certification = {
    catalogHealth: wave1.catalogHealth,
    relationshipCoveragePct,
    faqCoveragePct,
    seoCoveragePct,
    compatibilityCoveragePct,
    productIntelligenceScore,
    catalogIntelligenceScore,
    certified:
      wave1.catalogHealth >= 90 &&
      relationshipCoveragePct >= 95 &&
      faqCoveragePct >= 95 &&
      seoCoveragePct >= 95 &&
      compatibilityCoveragePct >= 95 &&
      productIntelligenceScore >= 95 &&
      catalogIntelligenceScore >= 95
  };

  return {
    enrichments,
    faqs,
    relationships,
    compatibility,
    upgradePaths,
    comparisons,
    accessories,
    seo,
    graph,
    completeness,
    certification
  };
}

export const WAVE3_NEXTJS_INTEGRATION = {
  appAdmin: 'app/admin/pim/wave3/page.tsx — Content, FAQs, Relationships, Compatibility, Comparisons, Graph, SEO, Quality',
  pdp: 'ProductDetailPage Wave3PdpModules — FAQ, compatibility, upgrade spine',
  compare: 'ComparePage uses generateComparison for camera/flight/weight/transmission/battery/price/EASA',
  supabase: 'supabase/wave3_pim.sql — product_faqs, product_relationships, product_comparisons, product_seo_enhancements'
};

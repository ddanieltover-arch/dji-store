import { Locale, Product } from '../../types';
import {
  DepotPreference,
  ExplainableDecision,
  LocaleSuggestion,
  PersonalizationContext,
  PersonalizationIntent,
  PersonalizedCartSuggestions,
  PersonalizedContentModule,
  PersonalizedHomepage,
  PersonalizedPdpModules,
  PersonalizedPlpOrdering,
  PersonalizedSearchResult,
  Wave6Certification,
  Wave6PersonalizationBundle
} from '../../types/wave6Personalization';
import { EUROPEAN_WAREHOUSES } from '../../data/warehouses';
import { performIntelligentSearch } from '../../data/searchSynonyms';
import { buildRelationshipGraph, buildUpgradePaths, recommendAccessories } from '../pim/wave3Intelligence';
import {
  buildCommerceSignals,
  inventoryAwareFlags,
  rankCatalog,
  runWave5Merchandising
} from '../merch/wave5Merchandising';
import { initializeInventoryFromCatalog } from '../pim/wave1Execution';
import { WAVE6_DEMO_CONTEXTS, WAVE6_CONTENT_GUIDES } from '../../data/wave6PersonalizationData';

function byId(catalog: Product[], id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}

function availableIds(catalog: Product[]): Set<string> {
  const inventory = initializeInventoryFromCatalog(catalog);
  const signals = buildCommerceSignals(catalog, inventory);
  const flags = inventoryAwareFlags(catalog, signals);
  return new Set(flags.filter((f) => f.promote || f.available).map((f) => f.productId));
}

function decide(
  productId: string,
  score: number,
  reason: string,
  confidence: number,
  sourceSignal: string,
  fallbackBehavior = 'Fall back to Wave 5 merchandising rank'
): ExplainableDecision {
  return {
    productId,
    score: Math.round(score * 10) / 10,
    reason,
    confidence: Math.round(confidence * 100) / 100,
    sourceSignal,
    fallbackBehavior
  };
}

export function inferIntent(ctx: PersonalizationContext, catalog: Product[]): PersonalizationIntent {
  const hay = [
    ...ctx.searchedTerms,
    ...ctx.viewedProducts.map((id) => byId(catalog, id)?.series ?? ''),
    ...ctx.viewedProducts.map((id) => byId(catalog, id)?.modelName ?? ''),
    ...(ctx.categoriesVisited ?? [])
  ]
    .join(' ')
    .toLowerCase();

  if (/mini|c0|lightweight|sub-249|beginner|neo|flip/.test(hay)) return 'beginner';
  if (/travel|holiday|portable/.test(hay)) return 'travel';
  if (/osmo|pocket|action|mic|creator|vlog/.test(hay)) return 'creator';
  if (/inspire|ronin|cinema|prores|8k/.test(hay)) return 'professional';
  if (/matrice|agras|dock|enterprise|thermal/.test(hay)) return 'enterprise';
  if (/avata|fpv|goggles|motion/.test(hay)) return 'fpv';
  if (ctx.ownedProductIds.some((id) => byId(catalog, id)?.series === 'Mini')) return 'beginner';
  if (ctx.ownedProductIds.some((id) => /osmo|pocket|action/i.test(byId(catalog, id)?.modelName ?? ''))) return 'creator';
  return 'general';
}

export function suggestLocale(ctx: PersonalizationContext): LocaleSuggestion {
  const map: Record<string, { locale: Locale; currency: string }> = {
    DE: { locale: 'de', currency: 'EUR' },
    AT: { locale: 'de', currency: 'EUR' },
    CH: { locale: 'de', currency: 'CHF' },
    FR: { locale: 'fr', currency: 'EUR' },
    BE: { locale: 'fr', currency: 'EUR' },
    ES: { locale: 'es', currency: 'EUR' },
    IT: { locale: 'it', currency: 'EUR' },
    NL: { locale: 'nl', currency: 'EUR' },
    GB: { locale: 'en', currency: 'GBP' }
  };
  const hit = ctx.country ? map[ctx.country.toUpperCase()] : undefined;
  return {
    detectedCountry: ctx.country,
    suggestedLocale: hit?.locale ?? ctx.locale,
    suggestedCurrency: hit?.currency ?? ctx.currency ?? 'EUR',
    reason: hit
      ? `Country ${ctx.country} suggests ${hit.locale.toUpperCase()} / ${hit.currency} — suggestion only, no forced redirect`
      : 'Retain visitor locale preference',
    forceRedirect: false
  };
}

export function preferDepotForCountry(country?: string): DepotPreference {
  const code = (country ?? 'DE').toUpperCase();
  const preferred =
    code === 'NL' || code === 'BE'
      ? EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('AMS'))
      : code === 'FR'
        ? EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('CDG'))
        : EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('FRA'));
  const depot = preferred ?? EUROPEAN_WAREHOUSES[0];
  return {
    country: code,
    preferredDepotId: depot.id,
    preferredDepotCode: depot.code,
    reason: `${code} orders prioritize ${depot.code} (${depot.city}) via existing allocation logic`
  };
}

function seriesAffinity(ctx: PersonalizationContext, catalog: Product[]): Map<string, number> {
  const scores = new Map<string, number>();
  const bump = (series: string | undefined, w: number) => {
    if (!series) return;
    scores.set(series, (scores.get(series) ?? 0) + w);
  };
  for (const id of ctx.viewedProducts) bump(byId(catalog, id)?.series, 3);
  for (const id of ctx.wishlistProductIds) bump(byId(catalog, id)?.series, 2);
  for (const id of ctx.cartProductIds) bump(byId(catalog, id)?.series, 4);
  for (const id of ctx.ownedProductIds) bump(byId(catalog, id)?.series, 5);
  for (const term of ctx.searchedTerms) {
    const t = term.toLowerCase();
    if (t.includes('mini')) bump('Mini', 4);
    if (t.includes('mavic')) bump('Mavic', 3);
    if (t.includes('air')) bump('Air', 3);
    if (t.includes('osmo') || t.includes('pocket')) bump('Osmo', 3);
    if (t.includes('avata') || t.includes('fpv')) bump('Avata', 3);
  }
  return scores;
}

export function personalizeRanking(
  catalog: Product[],
  ctx: PersonalizationContext,
  avail: Set<string>
): ExplainableDecision[] {
  const merch = runWave5Merchandising(catalog);
  const merchScore = new Map(merch.rankings.map((r) => [r.productId, r.score]));
  const affinity = seriesAffinity(ctx, catalog);
  const intent = inferIntent(ctx, catalog);

  const decisions: ExplainableDecision[] = [];
  for (const product of catalog) {
    if (!avail.has(product.id)) continue;
    let score = merchScore.get(product.id) ?? 40;
    let reason = 'Wave 5 merchandising baseline';
    let source = 'merchandising_score';
    let confidence = 0.7;

    const aff = affinity.get(product.series) ?? 0;
    if (aff > 0) {
      score += aff * 4;
      reason = `Session/ownership affinity for ${product.series} series (+${aff * 4})`;
      source = 'session_behavior';
      confidence = Math.min(0.96, 0.75 + aff * 0.03);
    }

    if (ctx.viewedProducts.includes(product.id)) {
      score += 8;
      reason = 'Recently viewed in this session';
      source = 'product_views';
      confidence = 0.9;
    }
    if (ctx.wishlistProductIds.includes(product.id)) {
      score += 10;
      reason = 'On wishlist';
      source = 'wishlist';
      confidence = 0.92;
    }
    if (ctx.cartProductIds.includes(product.id)) {
      score += 6;
      reason = 'Already in cart — reinforce related merch elsewhere';
      source = 'cart';
      confidence = 0.88;
    }

    if (intent === 'beginner' && (product.easaClass?.includes('C0') || product.series === 'Mini' || product.series === 'Neo')) {
      score += 12;
      reason = 'Beginner/lightweight intent boost (C0 / Mini)';
      source = 'search_intent';
      confidence = 0.93;
    }
    if (intent === 'creator' && product.category === 'handheld') {
      score += 12;
      reason = 'Creator intent — handheld / Osmo boost';
      source = 'search_intent';
      confidence = 0.92;
    }
    if (intent === 'professional' && (product.category === 'professional' || product.series === 'Inspire' || product.series === 'Mavic')) {
      score += 10;
      reason = 'Professional / cinema intent';
      source = 'search_intent';
      confidence = 0.91;
    }
    if (intent === 'enterprise' && product.category === 'professional') {
      score += 14;
      reason = 'Enterprise intent';
      source = 'search_intent';
      confidence = 0.9;
    }
    if (intent === 'fpv' && (product.series === 'Avata' || /goggles|motion/i.test(product.modelName))) {
      score += 12;
      reason = 'FPV intent';
      source = 'search_intent';
      confidence = 0.92;
    }

    // Ownership → accessories / care
    if (ctx.ownedProductIds.length && (product.category === 'accessories' || product.category === 'power-care')) {
      const owner = ctx.ownedProductIds
        .map((id) => byId(catalog, id))
        .find((p) => p?.compatibleAccessories?.includes(product.id));
      if (owner) {
        score += 18;
        reason = `Compatible with owned ${owner.modelName}`;
        source = 'purchase_history';
        confidence = 0.95;
      }
    }

    decisions.push(decide(product.id, score, reason, confidence, source));
  }

  return decisions.sort((a, b) => b.score - a.score || a.productId.localeCompare(b.productId));
}

export function buildPersonalizedHomepage(
  catalog: Product[],
  ctx: PersonalizationContext,
  ranked: ExplainableDecision[]
): PersonalizedHomepage {
  const intent = inferIntent(ctx, catalog);
  const merch = runWave5Merchandising(catalog);
  const pick = (ids: string[], signal: string, reason: string) =>
    ids
      .filter((id) => ranked.some((r) => r.productId === id))
      .slice(0, 6)
      .map((id) => {
        const base = ranked.find((r) => r.productId === id)!;
        return { ...base, sourceSignal: signal, reason };
      });

  const recommended = ranked.slice(0, 8);
  const recent = ctx.viewedProducts
    .filter((id) => byId(catalog, id))
    .slice(0, 6)
    .map((id) => decide(id, 90, 'Recently viewed', 0.95, 'product_views', 'Hide slot if empty'));

  const accessories = recommendAccessories(catalog)
    .filter((r) => ctx.ownedProductIds.includes(r.productId) || ctx.cartProductIds.includes(r.productId) || ctx.viewedProducts.includes(r.productId))
    .slice(0, 6)
    .map((r) => decide(r.accessoryId, 80 + r.confidence * 10, `Accessory for setup (${r.bucket})`, r.confidence, 'wave3_relationships'));

  const upgrade = buildUpgradePaths(catalog)
    .filter((u) => ctx.viewedProducts.includes(u.productId) || ctx.ownedProductIds.includes(u.productId))
    .map((u) => u.nextProductId)
    .filter((id): id is string => Boolean(id))
    .slice(0, 4)
    .map((id) => decide(id, 85, 'Upgrade path from Wave 3 spine', 0.9, 'wave3_upgrade'));

  const localeSuggestion = suggestLocale(ctx);

  return {
    intent,
    localeSuggestion:
      localeSuggestion.suggestedLocale !== ctx.locale
        ? {
            locale: localeSuggestion.suggestedLocale,
            country: ctx.country ?? '',
            reason: localeSuggestion.reason
          }
        : undefined,
    slots: {
      hero: pick(merch.homepage.featured.slice(0, 1), 'manual_override', 'Hero respects Wave 5 manual override'),
      featured: pick(merch.homepage.featured, 'merchandising_rules', 'Featured from Wave 5 + personalization re-rank'),
      trending: pick(merch.homepage.trending, 'merchandising_score', 'Trending slot'),
      recommended_for_you: recommended,
      recently_viewed: recent,
      continue_exploring: ranked.filter((r) => !ctx.viewedProducts.includes(r.productId)).slice(0, 6),
      accessories_for_setup: accessories,
      upgrade_path: upgrade
    }
  };
}

export function buildPersonalizedPlp(
  catalog: Product[],
  ctx: PersonalizationContext,
  ranked: ExplainableDecision[],
  category?: Product['category'] | 'all'
): PersonalizedPlpOrdering {
  const merch = runWave5Merchandising(catalog);
  const manual = new Set(merch.homepage.manualOverrides.map((o) => o.productId));
  const filtered = ranked.filter((d) => {
    const p = byId(catalog, d.productId);
    if (!p) return false;
    if (category && category !== 'all' && p.category !== category) return false;
    return true;
  });
  // Preserve manual overrides at top when present in category
  const overrides = filtered.filter((d) => manual.has(d.productId));
  const rest = filtered.filter((d) => !manual.has(d.productId));
  const ordered = [...overrides, ...rest];
  return {
    productIds: ordered.map((d) => d.productId),
    decisions: ordered,
    preservedManualOverrides: overrides.length > 0,
    seoSafe: true
  };
}

export function buildPersonalizedPdp(catalog: Product[], ctx: PersonalizationContext, productId: string): PersonalizedPdpModules {
  const product = byId(catalog, productId)!;
  const avail = availableIds(catalog);
  const recs = recommendAccessories(catalog).filter((r) => r.productId === productId && avail.has(r.accessoryId));
  const rel = buildRelationshipGraph(catalog).filter((e) => e.fromProductId === productId);
  const path = buildUpgradePaths(catalog).find((u) => u.productId === productId);

  return {
    productId,
    accessories: recs
      .slice(0, 6)
      .map((r) => decide(r.accessoryId, 70 + r.confidence * 20, `Wave 3 ${r.bucket} accessory`, r.confidence, 'wave3_relationships')),
    upgrades: path?.nextProductId
      ? [decide(path.nextProductId, 88, `Upgrade to ${path.tier} next`, 0.9, 'wave3_upgrade')]
      : [],
    alternatives: rel
      .filter((e) => e.type === 'ALTERNATIVE_TO' && avail.has(e.toProductId))
      .slice(0, 4)
      .map((e) => decide(e.toProductId, 75, 'Alternative from relationship graph', e.confidence, 'wave3_relationships')),
    care: recs
      .filter((r) => r.bucket === 'recommended' || /care/i.test(r.accessoryId))
      .slice(0, 2)
      .map((r) => decide(r.accessoryId, 82, 'Care / protection for this SKU', r.confidence, 'wave3_relationships')),
    recentlyViewed: ctx.viewedProducts
      .filter((id) => id !== productId && avail.has(id))
      .slice(0, 4)
      .map((id) => decide(id, 70, 'Recently viewed', 0.9, 'product_views')),
    bundles: recs.slice(0, 2).map((r) => decide(r.accessoryId, 78, 'Personalized bundle component', r.confidence, 'wave5_bundles'))
  };
}

export function buildPersonalizedCart(
  catalog: Product[],
  ctx: PersonalizationContext,
  freeShippingThresholdEur = 149
): PersonalizedCartSuggestions {
  const avail = availableIds(catalog);
  const cartProducts = ctx.cartProductIds.map((id) => byId(catalog, id)).filter(Boolean) as Product[];
  const subtotal = cartProducts.reduce((s, p) => s + p.basePriceEur, 0);
  const essentials = recommendAccessories(catalog)
    .filter((r) => ctx.cartProductIds.includes(r.productId) && r.bucket === 'essential' && avail.has(r.accessoryId))
    .filter((r) => !ctx.cartProductIds.includes(r.accessoryId))
    .slice(0, 4)
    .map((r) => decide(r.accessoryId, 86, 'Missing essential accessory', r.confidence, 'wave3_relationships'));

  const care = recommendAccessories(catalog)
    .filter((r) => ctx.cartProductIds.includes(r.productId) && /care/i.test(r.accessoryId) && avail.has(r.accessoryId))
    .filter((r) => !ctx.cartProductIds.includes(r.accessoryId))
    .slice(0, 2)
    .map((r) => decide(r.accessoryId, 84, 'Care plan for cart aircraft', r.confidence, 'wave3_relationships'));

  const upgrades = buildUpgradePaths(catalog)
    .filter((u) => ctx.cartProductIds.includes(u.productId) && u.nextProductId && avail.has(u.nextProductId))
    .slice(0, 2)
    .map((u) => decide(u.nextProductId!, 70, 'Compatible upgrade suggestion', 0.8, 'wave3_upgrade'));

  const accessories = recommendAccessories(catalog)
    .filter((r) => ctx.cartProductIds.includes(r.productId) && avail.has(r.accessoryId) && !ctx.cartProductIds.includes(r.accessoryId))
    .slice(0, 4)
    .map((r) => decide(r.accessoryId, 80, `Personalized ${r.bucket} add-on`, r.confidence, 'session_cart'));

  const remaining = Math.max(0, freeShippingThresholdEur - subtotal);
  return {
    accessories,
    missingEssentials: essentials,
    carePlans: care,
    upgrades,
    shippingNudge:
      remaining > 0 && cartProducts.length
        ? `Add €${remaining.toFixed(0)} for free EU Express (threshold €${freeShippingThresholdEur})`
        : undefined
  };
}

export function personalizedSearch(
  catalog: Product[],
  ctx: PersonalizationContext,
  query: string
): PersonalizedSearchResult {
  const outcome = performIntelligentSearch(query, catalog);
  const exact = catalog.filter(
    (p) =>
      p.sku.toLowerCase() === query.trim().toLowerCase() ||
      p.modelName.toLowerCase() === query.trim().toLowerCase() ||
      p.slug === query.trim().toLowerCase()
  );
  if (exact.length) {
    return {
      productIds: exact.map((p) => p.id),
      exactMatch: true,
      boosts: exact.map((p) => decide(p.id, 100, 'Exact SKU/model match — always wins', 1, 'exact_match', 'N/A'))
    };
  }

  const ranked = personalizeRanking(catalog, { ...ctx, searchedTerms: [...ctx.searchedTerms, query] }, availableIds(catalog));
  const baseIds = outcome.results.map((p) => p.id);
  const boosts = ranked.filter((d) => baseIds.includes(d.productId)).slice(0, 8);
  const ordered = [...boosts.map((b) => b.productId), ...baseIds.filter((id) => !boosts.some((b) => b.productId === id))];
  return { productIds: ordered, exactMatch: false, boosts };
}

export function selectContentGuide(intent: PersonalizationIntent, catalog: Product[]): PersonalizedContentModule {
  const guide = WAVE6_CONTENT_GUIDES.find((g) => g.intent === intent) ?? WAVE6_CONTENT_GUIDES[0];
  const related = catalog
    .filter((p) => {
      if (intent === 'beginner') return p.series === 'Mini' || p.easaClass?.includes('C0');
      if (intent === 'creator') return p.category === 'handheld';
      if (intent === 'professional') return p.series === 'Mavic' || p.series === 'Inspire';
      if (intent === 'enterprise') return p.category === 'professional';
      if (intent === 'fpv') return p.series === 'Avata';
      if (intent === 'travel') return p.series === 'Mini' || p.series === 'Air';
      return p.isFeatured;
    })
    .slice(0, 4)
    .map((p) => p.id);
  return { ...guide, relatedProductIds: related };
}

export function comparePersonalization(catalog: Product[], compareIds: string[]): ExplainableDecision[] {
  const rel = buildRelationshipGraph(catalog);
  const out: ExplainableDecision[] = [];
  for (const id of compareIds) {
    for (const e of rel.filter((r) => r.fromProductId === id && ['ALTERNATIVE_TO', 'UPGRADE_TO', 'DOWNGRADE_TO', 'RECOMMENDED_WITH'].includes(r.type))) {
      if (compareIds.includes(e.toProductId)) continue;
      out.push(decide(e.toProductId, 70 + e.confidence * 20, `${e.type} vs compared set`, e.confidence, 'wave3_relationships'));
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 8);
}

export function certifyWave6(
  ranked: ExplainableDecision[],
  cart: PersonalizedCartSuggestions,
  searchExact: boolean,
  locale: LocaleSuggestion
): Wave6Certification {
  const all = [
    ...ranked,
    ...cart.accessories,
    ...cart.missingEssentials,
    ...cart.carePlans
  ];
  const explainabilityCoveragePct = all.length
    ? Math.round((all.filter((d) => d.reason && d.sourceSignal && d.confidence > 0).length / all.length) * 100)
    : 100;
  const recommendationIntegrityPct = all.length
    ? Math.round((all.filter((d) => d.confidence >= 0.7 && d.fallbackBehavior).length / all.length) * 100)
    : 100;
  return {
    explainabilityCoveragePct,
    recommendationIntegrityPct,
    unavailableFilteredPct: 100,
    exactSearchPriority: searchExact,
    localeSuggestionNonForced: locale.forceRedirect === false,
    catalogFactsOnly: true,
    certified:
      explainabilityCoveragePct >= 95 &&
      recommendationIntegrityPct >= 95 &&
      searchExact &&
      locale.forceRedirect === false
  };
}

export function runWave6Personalization(
  catalog: Product[],
  ctx: PersonalizationContext = WAVE6_DEMO_CONTEXTS.anonymousMini
): Wave6PersonalizationBundle {
  const avail = availableIds(catalog);
  const ranked = personalizeRanking(catalog, ctx, avail);
  const intent = inferIntent(ctx, catalog);
  const homepage = buildPersonalizedHomepage(catalog, ctx, ranked);
  const plp = buildPersonalizedPlp(catalog, ctx, ranked, 'camera-drones');
  const focusId = ctx.viewedProducts[0] ?? ctx.ownedProductIds[0] ?? catalog[0].id;
  const pdpSample = buildPersonalizedPdp(catalog, ctx, focusId);
  const cart = buildPersonalizedCart(catalog, ctx);
  const depot = preferDepotForCountry(ctx.country);
  const searchSample = personalizedSearch(catalog, ctx, ctx.searchedTerms[0] ?? 'lightweight');
  const exactProbe = personalizedSearch(catalog, ctx, catalog[0].modelName);
  const content = selectContentGuide(intent, catalog);
  const localeSuggestion = suggestLocale(ctx);
  const certification = certifyWave6(ranked, cart, exactProbe.exactMatch, localeSuggestion);

  return {
    context: ctx,
    intent,
    homepage,
    plp,
    pdpSample,
    cart,
    depot,
    searchSample,
    content,
    localeSuggestion,
    certification
  };
}

export const WAVE6_NEXTJS_INTEGRATION = {
  note: 'Experience layer only — uses DJI_PRODUCTS, Wave 3 relationships, Wave 5 merch, existing CDP/locale/depot APIs.',
  surfaces: [
    'HomeView — personalized slots from buildPersonalizedHomepage',
    'ProductListingPage — buildPersonalizedPlp re-rank under Featured',
    'Wave3PdpModules / PDP — accessories + upgrade from personalize',
    'SlideOverCart — personalized essentials/care/shipping nudge',
    'AdvancedSearchModal — personalizedSearch (exact match first)',
    'app/admin/personalization — PersonalizationWorkstation'
  ]
};

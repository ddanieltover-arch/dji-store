import { SynonymMapping, Product, EasaClass } from '../types';

export const SEARCH_SYNONYMS: SynonymMapping[] = [
  {
    trigger: 'goggles',
    synonyms: ['fpv', 'vr', 'headset', 'goggles 3', 'immersive', 'first person view', 'acro'],
    targetCategory: 'camera-drones',
    targetSeries: 'Avata'
  },
  {
    trigger: 'sub-249g',
    synonyms: [
      'c0',
      'no license',
      'license-free',
      'lightweight',
      'travel drone',
      'under 250g',
      'mini',
      'pocket drone',
      'beginners'
    ],
    targetCategory: 'camera-drones',
    targetSeries: 'Mini',
    easaHint: 'C0 (<249g)'
  },
  {
    trigger: 'cinema',
    synonyms: ['8k', 'hasselblad', 'prores', 'raw', 'filmmaking', 'hollywood', 'full-frame', 'inspire', 'zenmuse'],
    targetCategory: 'professional',
    targetSeries: 'Inspire'
  },
  {
    trigger: 'action',
    synonyms: ['gopro', 'waterproof', 'vlog', 'actioncam', 'osmo action', 'adventure', 'cycling camera'],
    targetCategory: 'handheld',
    targetSeries: 'Osmo'
  },
  {
    trigger: 'pocket',
    synonyms: ['vlogging', 'mic', 'youtube', 'tiktok', 'gimbal camera', '1-inch sensor', 'face tracking'],
    targetCategory: 'handheld',
    targetSeries: 'Osmo'
  },
  {
    trigger: 'battery',
    synonyms: ['charger', 'flight battery', 'intelligent battery', 'power hub', 'charging hub', 'spare battery'],
    targetCategory: 'accessories',
    targetSeries: 'Accessories'
  }
];

export const TYPO_DICTIONARY: Record<string, string> = {
  mavick: 'mavic',
  mavik: 'mavic',
  marvic: 'mavic',
  avatta: 'avata',
  avta: 'avata',
  pcket: 'pocket',
  poket: 'pocket',
  osmoo: 'osmo',
  insipre: 'inspire',
  haselblad: 'hasselblad',
  batery: 'battery',
  gogles: 'goggles',
  goggels: 'goggles',
  controler: 'controller',
  remot: 'remote'
};

export function performIntelligentSearch(
  query: string,
  catalog: Product[]
): {
  results: Product[];
  correctedQuery?: string;
  appliedSynonyms: string[];
  matchedEasaHint?: EasaClass;
  executionTimeMs: number;
} {
  const startTime = performance.now();
  const rawQ = query.trim().toLowerCase();

  if (!rawQ) {
    return {
      results: [],
      appliedSynonyms: [],
      executionTimeMs: 0
    };
  }

  // 1. Typo correction check
  const words = rawQ.split(/\s+/);
  let correctedWords = [...words];
  let hasTypoFix = false;

  words.forEach((w, idx) => {
    if (TYPO_DICTIONARY[w]) {
      correctedWords[idx] = TYPO_DICTIONARY[w];
      hasTypoFix = true;
    }
  });

  const activeQuery = hasTypoFix ? correctedWords.join(' ') : rawQ;

  // 2. Check Synonyms
  const appliedSynonyms: string[] = [];
  let easaHint: EasaClass | undefined;
  let targetSeriesMatch: string | undefined;

  SEARCH_SYNONYMS.forEach((map) => {
    if (
      activeQuery.includes(map.trigger) ||
      map.synonyms.some((s) => activeQuery.includes(s))
    ) {
      appliedSynonyms.push(map.trigger);
      if (map.easaHint) easaHint = map.easaHint;
      if (map.targetSeries) targetSeriesMatch = map.targetSeries;
    }
  });

  // 3. Search and Score Catalog
  const scoredProducts = catalog.map((product) => {
    let score = 0;
    const nameLower = product.modelName.toLowerCase();
    const taglineLower = product.tagline.toLowerCase();
    const descLower = product.description.toLowerCase();
    const catLower = product.categoryLabel.toLowerCase();
    const seriesLower = product.series.toLowerCase();

    // Exact name match
    if (nameLower === activeQuery) score += 100;
    else if (nameLower.includes(activeQuery)) score += 60;

    // Partial word matches in model name
    words.forEach((w) => {
      if (nameLower.includes(w)) score += 25;
      if (seriesLower.includes(w)) score += 30;
      if (taglineLower.includes(w)) score += 15;
      if (descLower.includes(w)) score += 8;
      if (catLower.includes(w)) score += 15;
    });

    // Synonym match boost
    if (targetSeriesMatch && product.series.toLowerCase() === targetSeriesMatch.toLowerCase()) {
      score += 40;
    }

    // EASA Class match
    if (easaHint && product.easaClass === easaHint) {
      score += 50;
    }

    // High rating boost
    if (product.rating >= 4.8) score += 5;
    if (product.isBestSeller) score += 10;

    return { product, score };
  });

  const filtered = scoredProducts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  const endTime = performance.now();

  return {
    results: filtered,
    correctedQuery: hasTypoFix ? activeQuery : undefined,
    appliedSynonyms,
    matchedEasaHint: easaHint,
    executionTimeMs: Math.round(endTime - startTime)
  };
}

import { Product } from '../../types';

const COMBO_ALIASES: Record<string, string> = {
  'fly more combo plus': 'Fly More Combo Plus',
  'fly more plus': 'Fly More Plus',
  'fly more': 'Fly More',
  'creator combo': 'Creator Combo',
  'special edition': 'Special Editions',
  standard: 'Standard',
  cine: 'Cine',
  enterprise: 'Enterprise',
  thermal: 'Thermal',
  rtk: 'RTK'
};

export function normalizeComboName(raw: string): string {
  const lower = raw.toLowerCase();
  const hit = Object.keys(COMBO_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((k) => lower.includes(k));
  return hit ? COMBO_ALIASES[hit] : 'Standard';
}

export function extractTechnicalSpecs(product: Product): {
  camera: Record<string, string>;
  flight: Record<string, string>;
  battery: Record<string, string>;
  transmission: Record<string, string>;
  aircraft: Record<string, string>;
  environment: Record<string, string>;
} {
  return {
    camera: {
      sensor: product.cameraSensor ?? 'n/a',
      video: product.maxVideoRes ?? 'n/a',
      lens: 'mapped from official spec table when present'
    },
    flight: {
      timeMinutes: product.flightTimeMinutes != null ? String(product.flightTimeMinutes) : 'n/a',
      windResistance: 'from official spec table'
    },
    battery: {
      impliedFromFlight: product.flightTimeMinutes ? `${product.flightTimeMinutes} min class` : 'n/a',
      charging: 'from official spec table'
    },
    transmission: {
      rangeKm: product.transmissionRangeKm != null ? String(product.transmissionRangeKm) : 'n/a'
    },
    aircraft: {
      weightGrams: String(product.weightGrams),
      easa: product.easaClass ?? 'Open Category',
      gnss: 'GPS + Galileo + BeiDou (EU ops)'
    },
    environment: {
      operatingTemperature: 'official store spec',
      storage: 'microSD / onboard'
    }
  };
}

export function generateSeoPack(product: Product, locale: 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl'): {
  title: string;
  description: string;
} {
  const titles: Record<string, string> = {
    en: `${product.modelName} | Official DJI Store EU`,
    de: `${product.modelName} | Offizieller DJI Store EU`,
    fr: `${product.modelName} | Boutique officielle DJI UE`,
    es: `${product.modelName} | Tienda oficial DJI UE`,
    it: `${product.modelName} | Store ufficiale DJI UE`,
    nl: `${product.modelName} | Officiële DJI Store EU`
  };
  return {
    title: titles[locale],
    description: product.tagline.slice(0, 155)
  };
}

export function scoreCatalogHealth(parts: {
  description: number;
  media: number;
  specs: number;
  seo: number;
  translation: number;
  relationships: number;
}): number {
  const avg =
    (parts.description + parts.media + parts.specs + parts.seo + parts.translation + parts.relationships) / 6;
  return Math.round(avg * 10) / 10;
}

export function changeRiskScore(category: string, deltaPct: number): { score: number; recommend: 'auto' | 'review' | 'block' } {
  if (category === 'price' && Math.abs(deltaPct) > 40) return { score: 98, recommend: 'block' };
  if (category === 'price' && Math.abs(deltaPct) > 15) return { score: 85, recommend: 'review' };
  if (category === 'easa_status' || category === 'new_product' || category === 'new_variant') {
    return { score: 90, recommend: 'review' };
  }
  return { score: 25, recommend: 'auto' };
}

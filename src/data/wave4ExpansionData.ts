import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE4_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W4-R0',
    window: 'T-48h',
    action: 'Discovery baseline — robots-allowed category matrix + WAVE4_DISCOVERY_UNIVERSE from store.dji.com',
    owner: 'Platform',
    gate: 'Category matrix 9 rows · robots green'
  },
  {
    id: 'W4-R1',
    window: 'T-36h',
    action: 'Category population — map Camera/Handheld/Professional/Enterprise/Accessories/Batteries/Controllers/Care/Power',
    owner: 'Catalog',
    gate: 'categoryCoverage ≥ 95%'
  },
  {
    id: 'W4-R2',
    window: 'T-24h',
    action: 'Product/variant population into DJI_PRODUCTS via existing approval workflow; longest-match combo normalize',
    owner: 'PIM',
    gate: 'catalogCoverage ≥ 95%'
  },
  {
    id: 'W4-R3',
    window: 'T-16h',
    action: 'Media hashing/CDN dedupe + firmware/downloads auto-approve + SEO EN–NL packs',
    owner: 'Merch',
    gate: 'media ≥ 95% · seo ≥ 95%'
  },
  {
    id: 'W4-R4',
    window: 'T-10h',
    action: 'Chain Wave 3 enrichment for newly published SKUs (FAQ/relationships/compatibility/SEO)',
    owner: 'PIM',
    gate: 'Wave 3 intelligence ≥ 95%'
  },
  {
    id: 'W4-R5',
    window: 'T-6h',
    action: 'initializeInventoryFromCatalog FRA/AMS/CDG — never wipe Mavic seed rows',
    owner: 'OMS',
    gate: 'inventoryCoverage = 100%'
  },
  {
    id: 'W4-R6',
    window: 'T-2h',
    action: 'Health certification against Wave 1+3 floors + Wave 4 catalog/category coverage',
    owner: 'CAB',
    gate: 'all Wave 4 thresholds green'
  },
  {
    id: 'W4-R7',
    window: 'T0',
    action: 'Production publication 100% · incremental SyncJob from store.dji.com',
    owner: 'Launch Commander',
    gate: 'error rate < 0.1%'
  }
];

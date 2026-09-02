import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE6_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W6-R0',
    window: 'T-48h',
    action: 'BFS crawl store.dji.com PDP graph — seed from DJI_PRODUCTS + WAVE4 universe',
    owner: 'Platform',
    gate: '≥800 sellable slugs discovered'
  },
  {
    id: 'W6-R1',
    window: 'T-36h',
    action: 'Filter noise (content-page, care-popover, legacy) → WAVE6_SELLABLE_SLUGS manifest',
    owner: 'Catalog',
    gate: 'sellable manifest frozen'
  },
  {
    id: 'W6-R2',
    window: 'T-24h',
    action: 'Programmatic slug→Product via wave6CategoryExpansion + merge into DJI_PRODUCTS',
    owner: 'PIM',
    gate: '100% sellable slug coverage'
  },
  {
    id: 'W6-R3',
    window: 'T-12h',
    action: 'Generate cutouts for all product ids (export-product-ids → generate-cutouts.py)',
    owner: 'Merch',
    gate: 'local /products/* coverage 100%'
  },
  {
    id: 'W6-R4',
    window: 'T0',
    action: 'audit-official-store-catalog.ts green · incremental SyncJob',
    owner: 'Launch Commander',
    gate: 'Wave 6 parity certified'
  }
];

import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE3_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W3-R0',
    window: 'T-24h',
    action: 'Apply supabase/wave3_pim.sql; confirm FKs to products only',
    owner: 'Platform',
    gate: 'SQL migrate green'
  },
  {
    id: 'W3-R1',
    window: 'T-12h',
    action: 'Generate FAQs + enrichment for every DJI_PRODUCTS SKU',
    owner: 'PIM',
    gate: 'FAQ coverage ≥ 95%'
  },
  {
    id: 'W3-R2',
    window: 'T-8h',
    action: 'Publish relationship graph + compatibility matrices; keep ACCESSORY_GRAPH FBT slots',
    owner: 'Catalog',
    gate: 'relationship + compatibility ≥ 95%'
  },
  {
    id: 'W3-R3',
    window: 'T-4h',
    action: 'SEO enhancement packs EN–NL on top of existing generateSeoPack; no pack rewrite',
    owner: 'Merch',
    gate: 'SEO coverage ≥ 95%'
  },
  {
    id: 'W3-R4',
    window: 'T-1h',
    action: 'Enable PDP modules + comparison engine canary 10%',
    owner: 'SRE',
    gate: 'Product Intelligence Score ≥ 95'
  },
  {
    id: 'W3-R5',
    window: 'T0',
    action: 'Certify Wave 3; incremental enrichment on Official Store sync',
    owner: 'Launch Commander',
    gate: 'Catalog Intelligence Score ≥ 95'
  }
];

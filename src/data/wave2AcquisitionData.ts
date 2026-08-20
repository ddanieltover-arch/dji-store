import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE2_APPROVAL_WORKFLOW = {
  auto: ['firmware', 'media', 'description', 'download-checksum'],
  review: ['price', 'specs', 'new_product', 'new_variant', 'easa_status', 'discontinued'],
  block: ['price delta > 40%', 'robots-disallowed URL'],
  queue: 'Existing catalog_diffs + SyncJob.pendingDiffs — same IDs as Wave 1 / Official Store connector'
};

export const WAVE2_INVENTORY_STRATEGY = {
  depots: ['FRA', 'AMS', 'CDG'],
  rule: 'initializeInventoryFromCatalog — never drop Mavic 4 Pro seed rows; fill missing variants only',
  reorderPoint: 3,
  backorderAllowed: true,
  incomingEta: '2026-08-28'
};

export const WAVE2_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W2-R0',
    window: 'T-24h',
    action: 'Apply supabase/wave2_pim.sql; confirm robots allowlist on store.dji.com category+PDP only',
    owner: 'Platform',
    gate: 'SQL migrate green'
  },
  {
    id: 'W2-R1',
    window: 'T-12h',
    action: 'Run discovery across category matrix; map every DJI_PRODUCTS slug to /product/{slug}',
    owner: 'Catalog',
    gate: 'mappingCoverage ≥ 98%'
  },
  {
    id: 'W2-R2',
    window: 'T-8h',
    action: 'Extract + normalize variants/specs/media; enqueue firmware/downloads auto-approve',
    owner: 'PIM',
    gate: 'extractSuccess ≥ 98%'
  },
  {
    id: 'W2-R3',
    window: 'T-4h',
    action: 'Catalog Mgr reviews new_product / price diffs; inventory backfill FRA/AMS/CDG',
    owner: 'Merch + OMS',
    gate: 'no block-risk diffs open'
  },
  {
    id: 'W2-R4',
    window: 'T-1h',
    action: 'SEO EN–NL populate; Cloudflare purge plp+product tags; canary 10% PLP',
    owner: 'SRE',
    gate: 'Wave 2 health certified'
  },
  {
    id: 'W2-R5',
    window: 'T0',
    action: 'Publish 100% into DJI_PRODUCTS; incremental 15-min SyncJob from store.dji.com',
    owner: 'Launch Commander',
    gate: 'error rate < 0.1%'
  }
];

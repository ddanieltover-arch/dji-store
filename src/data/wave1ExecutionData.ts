import { Wave1QueueJob, Wave1RolloutStep } from '../types/wave1Execution';
import { enqueueWave1 } from '../lib/pim/wave1Execution';

export const WAVE1_QUEUE_SEED: Wave1QueueJob[] = [
  enqueueWave1('discovery', { source: 'store.dji.com/sitemap.xml' }, 'sitemap-offset-0'),
  enqueueWave1('extract', { sku: 'dji-neo' }, 'html-jsonld'),
  enqueueWave1('normalize', { sku: 'dji-neo' }, 'variant-combo'),
  enqueueWave1('media', { sku: 'dji-neo' }, 'hash-dedupe'),
  enqueueWave1('firmware', { productId: 'prod-mavic-4-pro' }, 'version-cursor'),
  enqueueWave1('seo', { productId: 'prod-neo' }, 'locales-en-nl'),
  enqueueWave1('inventory', { variantId: 'var-neo-std' }, 'fra-ams-cdg'),
  enqueueWave1('health', { batch: 'full-catalog' }, 'certify')
];

export const WAVE1_ROLLOUT: Wave1RolloutStep[] = [
  { id: 'R0', window: 'T-24h', action: 'Apply supabase/wave1_pim.sql on EU project; dry-run connector robots allowlist', owner: 'Platform', gate: 'SQL migrate green' },
  { id: 'R1', window: 'T-12h', action: 'Backfill inventory for all ProductVariant IDs; keep FRA seed for Mavic 4 Pro', owner: 'OMS', gate: 'inventoryCoverage 100%' },
  { id: 'R2', window: 'T-6h', action: 'Populate product_seo for 6 locales; purge Cloudflare plp/product tags', owner: 'Merch', gate: 'SEO rows = SKU × 6' },
  { id: 'R3', window: 'T-2h', action: 'Canary 5% traffic to expanded PLP; CAB reviews Wave 1 health report', owner: 'SRE + Catalog Mgr', gate: 'catalogHealth ≥ 90' },
  { id: 'R4', window: 'T0', action: 'Promote 100%; incremental 15-min sync from store.dji.com via existing SyncJob', owner: 'Launch Commander', gate: 'error rate < 0.1%' }
];

export const WAVE1_APPROVAL_SOP = {
  auto: ['firmware', 'media', 'minor description'],
  review: ['price', 'specs', 'new_product', 'new_variant', 'discontinued'],
  queue: 'Existing SyncJob.pendingDiffs + catalog_diffs (same IDs, no second PIM)'
};

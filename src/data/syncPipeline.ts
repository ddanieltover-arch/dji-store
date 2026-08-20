import { SyncJobState, CatalogDiffItem, SyncLogEntry } from '../types';

export const INITIAL_SYNC_JOB: SyncJobState = {
  jobId: 'job-sync-eu-2026-0814',
  targetUrl: 'https://store.dji.com/de/category/camera-drones',
  currentStage: 'awaiting_approval',
  progressPercent: 100,
  startedAt: '2026-08-14T08:00:12Z',
  completedAt: '2026-08-14T08:02:45Z',
  stats: {
    pagesCrawled: 18,
    productsDetected: 10,
    specsExtracted: 240,
    mediaAssetsSynced: 64,
    priceChangesFound: 2,
    schemaValidationPassRate: 100
  },
  logs: [
    {
      id: 'log-1',
      timestamp: '08:00:12',
      stage: 'crawling_reference',
      level: 'info',
      message: 'Headless Chromium session initialized with European proxy (Frankfurt IP: 194.233.16.8).'
    },
    {
      id: 'log-2',
      timestamp: '08:00:25',
      stage: 'extracting_dom',
      level: 'info',
      message: 'Extracted raw DOM AST from 18 category and product detail pages.'
    },
    {
      id: 'log-3',
      timestamp: '08:01:05',
      stage: 'normalizing_schema',
      level: 'info',
      message: 'Normalized 240 product attributes into canonical DJI EU TypeScript schema.'
    },
    {
      id: 'log-4',
      timestamp: '08:01:30',
      stage: 'validating_easa',
      level: 'success',
      message: 'EASA Class C0, C1, and C2 regulatory markings verified against EU Regulations 2019/945 and 2019/947.'
    },
    {
      id: 'log-5',
      timestamp: '08:02:10',
      stage: 'media_cdn_sync',
      level: 'info',
      message: '64 High-res WebP/AVIF hero and gallery image assets downloaded and optimized to Cloud CDN.'
    },
    {
      id: 'log-6',
      timestamp: '08:02:40',
      stage: 'diffing_revisions',
      level: 'warn',
      message: 'Detected 2 pending catalog delta changes requiring store manager approval.'
    }
  ],
  pendingDiffs: [
    {
      id: 'diff-01',
      productId: 'prod-mavic-4-pro',
      modelName: 'DJI Mavic 4 Pro',
      changeCategory: 'firmware',
      field: 'Firmware Version & Remote ID (DRI)',
      oldValue: 'v01.00.0300 (EASA DRI v1)',
      newValue: 'v01.00.0420 (EASA DRI v2.1 + Night Obstacle Sensing boost)',
      status: 'pending',
      suggestedAction: 'Update PDP technical specs group and customer firmware badge'
    },
    {
      id: 'diff-02',
      productId: 'prod-air-3s',
      modelName: 'DJI Air 3S',
      changeCategory: 'price',
      field: 'Fly More Combo (DJI RC 2) Base EUR',
      oldValue: '€1,399.00',
      newValue: '€1,349.00 (EU Summer Promotion -€50)',
      status: 'pending',
      suggestedAction: 'Apply promotional €50 discount across all 27 EU member states'
    }
  ]
};

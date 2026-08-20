import {
  DiscoveryRecord,
  DownloadAsset,
  FirmwareRelease,
  ConnectorCertification
} from '../types/officialStoreConnector';
import { DJI_OFFICIAL_STORE_CONNECTOR } from '../lib/pim/officialStoreConnector';

export { DJI_OFFICIAL_STORE_CONNECTOR };

export const OFFICIAL_STORE_DISCOVERY: DiscoveryRecord[] = [
  {
    url: 'https://store.dji.com/product/mavic-4-pro',
    entityType: 'product',
    discoveredAt: '2026-08-15T21:00:00Z',
    sourceHash: 'src_m4p',
    mappedProductId: 'prod-mavic-4-pro'
  },
  {
    url: 'https://store.dji.com/category/camera-drones',
    entityType: 'category',
    discoveredAt: '2026-08-15T21:00:00Z',
    sourceHash: 'src_cat_cd'
  },
  {
    url: 'https://store.dji.com/product/air-3s',
    entityType: 'product',
    discoveredAt: '2026-08-15T21:01:00Z',
    sourceHash: 'src_air3s',
    mappedProductId: 'prod-air-3s'
  },
  {
    url: 'https://store.dji.com/product/dji-neo',
    entityType: 'product',
    discoveredAt: '2026-08-15T21:02:00Z',
    sourceHash: 'src_neo',
    mappedProductId: 'prod-neo'
  },
  {
    url: 'https://store.dji.com/product/osmo-360',
    entityType: 'product',
    discoveredAt: '2026-08-15T21:02:00Z',
    sourceHash: 'src_o360',
    mappedProductId: 'prod-osmo-360'
  }
];

export const OFFICIAL_FIRMWARE_RELEASES: FirmwareRelease[] = [
  {
    productId: 'prod-mavic-4-pro',
    version: 'v01.00.0420',
    releaseDate: '2026-08-10',
    releaseNotes: 'EASA DRI v2.1 + night obstacle sensing (canonical store + download center).'
  }
];

export const OFFICIAL_DOWNLOADS: DownloadAsset[] = [
  {
    productId: 'prod-mavic-4-pro',
    kind: 'manual',
    locale: 'en',
    version: '2026.08',
    checksumSha256: '9f83acb10a29384918e7d23a104b29c991823a1290384c71',
    url: 'https://dl.djicdn.com/downloads/mavic-4-pro/user-manual-en.pdf'
  },
  {
    productId: 'prod-mavic-4-pro',
    kind: 'certificate',
    locale: 'en',
    version: 'CE-2026',
    checksumSha256: 'a718b2918349182a1019f83acb10a29384918e7d23a104b2',
    url: 'https://store.dji.com/guides/ce-declaration'
  }
];

export const CONNECTOR_CERTIFICATION: ConnectorCertification = {
  extractionAccuracy: 97,
  syncReliability: 99,
  catalogCompleteness: 96,
  mediaCoverage: 97,
  seoReadiness: 95,
  status: 'Certified'
};

export const CONNECTOR_GOVERNANCE = {
  robots: 'User-agent * — disallow cart/checkout/user/order/api; sitemap https://store.dji.com/sitemap.xml',
  rateLimit: `${DJI_OFFICIAL_STORE_CONNECTOR.rateLimitRpm} req/min + exponential retry + DLQ`,
  audit: 'Phase 11 WORM log on approve/reject; source attribution on every publish',
  retention: 'Discovery hashes 90d; rejected diffs 30d; published diffs follow product retention'
};

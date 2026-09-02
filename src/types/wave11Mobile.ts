import { Locale } from './index';

export type ConnectivityState = 'online' | 'offline' | 'reconnecting' | 'stale_data';

export type PushCategory =
  | 'order_updates'
  | 'shipment_updates'
  | 'warranty_reminders'
  | 'care_reminders'
  | 'product_restocks'
  | 'price_drop_alerts'
  | 'firmware_notifications'
  | 'service_rma_updates'
  | 'lifecycle_approved';

export type NotificationChannelClass = 'transactional' | 'marketing';

export type CacheClass =
  | 'static_assets'
  | 'product_imagery'
  | 'approved_catalog'
  | 'category_content'
  | 'public_knowledge'
  | 'offline_safe_shell'
  | 'never_cache_sensitive';

export interface PwaManifestSpec {
  name: string;
  shortName: string;
  startUrl: string;
  display: 'standalone' | 'browser';
  backgroundColor: string;
  themeColor: string;
  icons: { src: string; sizes: string; type: string; purpose?: string }[];
  orientation: 'any';
  scope: string;
  lang: string;
  categories: string[];
}

export interface ServiceWorkerStrategy {
  version: string;
  scope: string;
  precache: string[];
  runtimeCache: { pattern: string; strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate'; cacheClass: CacheClass }[];
  updateStrategy: 'prompt-user' | 'silent-safe';
  offlineFallback: string;
  neverCache: string[];
}

export interface OfflineSafePayload {
  productPages: string[];
  recentlyViewedProductIds: string[];
  wishlistProductIds: string[];
  comparisonProductIds: string[];
  helpArticleIds: string[];
  manualUrls: string[];
  accountShell: true;
  stockLive: false;
  priceLive: false;
  paymentStatusLive: false;
  orderStatusLive: false;
  shippingEstimateLive: false;
  banner: string;
}

export interface DeviceNotificationPreferences {
  customerId: string;
  orderNotifications: boolean;
  serviceNotifications: boolean;
  warrantyNotifications: boolean;
  restockNotifications: boolean;
  priceAlerts: boolean;
  firmwareAlerts: boolean;
  marketingNotifications: boolean;
  pushEnabled: boolean;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  updatedAt: string;
}

export interface PushSubscriptionRecord {
  id: string;
  customerId: string;
  endpointHash: string;
  userAgentClass: 'mobile' | 'tablet' | 'desktop';
  createdAt: string;
  active: boolean;
  /** Never store raw push secrets in client caches */
  tokenStoredServerSideOnly: true;
}

export interface NotificationTemplate {
  id: string;
  category: PushCategory;
  channelClass: NotificationChannelClass;
  locale: Locale;
  title: string;
  body: string;
  requiresMarketingConsent: boolean;
  requiresPreferenceKey: keyof Omit<
    DeviceNotificationPreferences,
    'customerId' | 'pushEnabled' | 'marketingConsent' | 'analyticsConsent' | 'updatedAt'
  >;
}

export interface RestockAlertSubscription {
  id: string;
  customerId: string;
  productId: string;
  variantId?: string;
  locale: Locale;
  countryCode: string;
  active: boolean;
  createdAt: string;
}

export interface PriceAlertSubscription {
  id: string;
  customerId: string;
  productId: string;
  targetPriceEur?: number;
  active: boolean;
  createdAt: string;
}

export interface ApprovedPriceChangeEvent {
  productId: string;
  oldPriceEur: number;
  newPriceEur: number;
  source: 'catalog_diffs';
  approved: true;
  at: string;
}

export interface InventoryAvailabilityChange {
  productId: string;
  variantId: string;
  previousAvailable: boolean;
  nowAvailable: boolean;
  depotCode: string;
  at: string;
}

export interface PushDeliveryEvent {
  id: string;
  customerId: string;
  category: PushCategory;
  channelClass: NotificationChannelClass;
  templateId: string;
  title: string;
  body: string;
  status: 'queued' | 'sent' | 'suppressed' | 'failed';
  suppressionReason?: string;
  opened: boolean;
  createdAt: string;
  productId?: string;
  orderNumber?: string;
  rmaNumber?: string;
}

export interface DeviceContext {
  layout: 'mobile' | 'tablet' | 'desktop';
  connectionQuality: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
  pushCapable: boolean;
  prefersReducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  invasiveTracking: false;
}

export interface PwaInstallState {
  installPromptAvailable: boolean;
  installed: boolean;
  standalone: boolean;
  updateAvailable: boolean;
  version: string;
}

export interface CacheInvalidationEvent {
  id: string;
  tags: string[];
  reason: 'product_publish' | 'price_approved' | 'manual' | 'firmware_publish';
  at: string;
  integrityOk: true;
}

export interface MobileAccessibilityChecklist {
  wcag22aa: true;
  reducedMotion: true;
  keyboardNavigation: true;
  screenReaders: true;
  touchTargetsMinPx: 44;
  largeText: true;
  highContrast: true;
  focusManagement: true;
}

export interface Wave11Analytics {
  pwaInstallRatePct: number;
  notificationOptInRatePct: number;
  deliveryRatePct: number;
  openRatePct: number;
  restockConversionPct: number;
  priceAlertConversionPct: number;
  pushDrivenRevenueEur: number;
  mobileConversionRatePct: number;
  offlineUsagePct: number;
  pwaRetentionPct: number;
  analyticsConsentRequired: true;
}

export interface Wave11PerformanceGuard {
  lcpMs: number;
  inpMs: number;
  cls: number;
  ttfbMs: number;
  apiP95Ms: number;
  pwaDoesNotDegradeFirstLoad: true;
  phase12SlasGreen: boolean;
}

export interface Wave11Certification {
  pwaInstallFlowPct: number;
  notificationPreferenceEnforcementPct: number;
  consentViolations: number;
  sensitiveDataOfflineExposure: number;
  cacheInvalidationIntegrityPct: number;
  restockAlertIntegrityPct: number;
  priceAlertIntegrityPct: number;
  transactionalNotificationIntegrityPct: number;
  mobileAccessibilityWcag22aa: true;
  phase12SlasGreen: boolean;
  certified: boolean;
}

export interface Wave11MobileBundle {
  manifest: PwaManifestSpec;
  serviceWorker: ServiceWorkerStrategy;
  offline: OfflineSafePayload;
  preferences: DeviceNotificationPreferences[];
  subscriptions: PushSubscriptionRecord[];
  templates: NotificationTemplate[];
  restockAlerts: RestockAlertSubscription[];
  priceAlerts: PriceAlertSubscription[];
  deliveries: PushDeliveryEvent[];
  invalidations: CacheInvalidationEvent[];
  deviceContext: DeviceContext;
  install: PwaInstallState;
  analytics: Wave11Analytics;
  performance: Wave11PerformanceGuard;
  accessibility: MobileAccessibilityChecklist;
  connectivityDemo: ConnectivityState;
  certification: Wave11Certification;
}

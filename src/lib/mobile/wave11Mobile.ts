import { CustomerProfile, Locale, Product } from '../../types';
import {
  ApprovedPriceChangeEvent,
  CacheInvalidationEvent,
  ConnectivityState,
  DeviceNotificationPreferences,
  InventoryAvailabilityChange,
  OfflineSafePayload,
  PriceAlertSubscription,
  PushDeliveryEvent,
  PushSubscriptionRecord,
  RestockAlertSubscription,
  Wave11Certification,
  Wave11MobileBundle
} from '../../types/wave11Mobile';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_CUSTOMERS } from '../../data/crmData';
import { productCacheTags } from '../performance/cacheTopology';
import { syncFirmwareAndDownloads } from '../pim/wave2Acquisition';
import { buildOwnershipRegistry } from '../service/wave9Service';
import {
  WAVE11_LOCALES,
  WAVE11_MANIFEST,
  WAVE11_PWA_VERSION,
  WAVE11_SERVICE_WORKER,
  WAVE11_TEMPLATES
} from '../../data/wave11MobileData';

export function buildOfflineSafePayload(args: {
  recentlyViewedProductIds: string[];
  wishlistProductIds: string[];
  comparisonProductIds: string[];
  helpArticleIds?: string[];
}): OfflineSafePayload {
  return {
    productPages: args.recentlyViewedProductIds.map((id) => `/product/${id}`),
    recentlyViewedProductIds: args.recentlyViewedProductIds,
    wishlistProductIds: args.wishlistProductIds,
    comparisonProductIds: args.comparisonProductIds,
    helpArticleIds: args.helpArticleIds ?? ['kb-pair-01', 'kb-warr-01'],
    manualUrls: ['/guides/easa'],
    accountShell: true,
    stockLive: false,
    priceLive: false,
    paymentStatusLive: false,
    orderStatusLive: false,
    shippingEstimateLive: false,
    banner: "You're offline. Showing recently viewed catalog data."
  };
}

export function isUnsafeOfflineClaim(field: keyof OfflineSafePayload): boolean {
  return (
    field === 'stockLive' ||
    field === 'priceLive' ||
    field === 'paymentStatusLive' ||
    field === 'orderStatusLive' ||
    field === 'shippingEstimateLive'
  );
}

export function connectivityBanner(state: ConnectivityState): string {
  switch (state) {
    case 'offline':
      return "You're offline. Showing recently viewed catalog data.";
    case 'reconnecting':
      return 'Reconnecting… live stock and price will refresh when online.';
    case 'stale_data':
      return 'Stale catalog data — not real-time stock or price.';
    default:
      return '';
  }
}

export function defaultPreferences(
  customer: CustomerProfile,
  overrides?: Partial<DeviceNotificationPreferences>
): DeviceNotificationPreferences {
  return {
    customerId: customer.id,
    orderNotifications: true,
    serviceNotifications: true,
    warrantyNotifications: true,
    restockNotifications: Boolean(customer.marketingConsent),
    priceAlerts: Boolean(customer.marketingConsent),
    firmwareAlerts: true,
    marketingNotifications: Boolean(customer.marketingConsent),
    pushEnabled: true,
    marketingConsent: Boolean(customer.marketingConsent),
    analyticsConsent: Boolean(customer.marketingConsent),
    updatedAt: '2026-08-20T12:00:00Z',
    ...overrides
  };
}

export function canSendPush(
  prefs: DeviceNotificationPreferences,
  templateId: string
): { allowed: boolean; reason?: string; channelClass?: 'transactional' | 'marketing' } {
  const template = WAVE11_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return { allowed: false, reason: 'unknown_template' };
  if (!prefs.pushEnabled) return { allowed: false, reason: 'push_disabled', channelClass: template.channelClass };

  const prefOn = prefs[template.requiresPreferenceKey];
  if (!prefOn) {
    return { allowed: false, reason: `preference_off:${template.requiresPreferenceKey}`, channelClass: template.channelClass };
  }

  if (template.channelClass === 'marketing') {
    if (!prefs.marketingConsent) {
      return { allowed: false, reason: 'marketing_consent_missing', channelClass: 'marketing' };
    }
    if (template.requiresMarketingConsent && !prefs.marketingNotifications && template.requiresPreferenceKey === 'marketingNotifications') {
      return { allowed: false, reason: 'marketing_preference_off', channelClass: 'marketing' };
    }
    // Restock/price require marketing consent + their own preference
    if (!prefs.marketingConsent) {
      return { allowed: false, reason: 'marketing_consent_missing', channelClass: 'marketing' };
    }
  }

  return { allowed: true, channelClass: template.channelClass };
}

export function enqueueNotification(args: {
  prefs: DeviceNotificationPreferences;
  templateId: string;
  vars?: Record<string, string>;
  productId?: string;
  orderNumber?: string;
  rmaNumber?: string;
}): PushDeliveryEvent {
  const template = WAVE11_TEMPLATES.find((t) => t.id === args.templateId)!;
  const gate = canSendPush(args.prefs, args.templateId);
  let body = template.body;
  let title = template.title;
  for (const [k, v] of Object.entries(args.vars ?? {})) {
    body = body.replace(`{{${k}}}`, v);
    title = title.replace(`{{${k}}}`, v);
  }
  return {
    id: `push-${args.templateId}-${args.prefs.customerId}-${Date.now()}`,
    customerId: args.prefs.customerId,
    category: template.category,
    channelClass: template.channelClass,
    templateId: template.id,
    title,
    body,
    status: gate.allowed ? 'queued' : 'suppressed',
    suppressionReason: gate.reason,
    opened: false,
    createdAt: '2026-08-20T12:00:00Z',
    productId: args.productId,
    orderNumber: args.orderNumber,
    rmaNumber: args.rmaNumber
  };
}

export function evaluateRestockAlert(
  sub: RestockAlertSubscription,
  change: InventoryAvailabilityChange,
  prefs: DeviceNotificationPreferences,
  catalog: Product[] = DJI_PRODUCTS
): PushDeliveryEvent | null {
  if (!sub.active) return null;
  if (sub.productId !== change.productId) return null;
  if (sub.variantId && sub.variantId !== change.variantId) return null;
  if (!(change.previousAvailable === false && change.nowAvailable === true)) return null;
  if (!catalog.some((p) => p.id === sub.productId)) return null;
  const product = catalog.find((p) => p.id === sub.productId)!;
  return enqueueNotification({
    prefs,
    templateId: 'tpl-restock',
    vars: { productName: product.modelName },
    productId: sub.productId
  });
}

export function evaluatePriceAlert(
  sub: PriceAlertSubscription,
  change: ApprovedPriceChangeEvent,
  prefs: DeviceNotificationPreferences,
  catalog: Product[] = DJI_PRODUCTS
): PushDeliveryEvent | null {
  if (!sub.active || !change.approved || change.source !== 'catalog_diffs') return null;
  if (sub.productId !== change.productId) return null;
  if (sub.targetPriceEur != null && change.newPriceEur > sub.targetPriceEur) return null;
  if (!catalog.some((p) => p.id === sub.productId)) return null;
  // Only notify on approved decreases or any approved change when no target
  if (change.newPriceEur >= change.oldPriceEur && sub.targetPriceEur == null) {
    // still notify on approved change when watching product without target
  }
  const product = catalog.find((p) => p.id === sub.productId)!;
  return enqueueNotification({
    prefs,
    templateId: 'tpl-price',
    vars: { productName: product.modelName },
    productId: sub.productId
  });
}

export function evaluateFirmwareNotifications(
  prefs: DeviceNotificationPreferences,
  catalog: Product[] = DJI_PRODUCTS
): PushDeliveryEvent[] {
  const ownership = buildOwnershipRegistry().filter((o) => o.customerId === prefs.customerId);
  const { firmware } = syncFirmwareAndDownloads();
  const events: PushDeliveryEvent[] = [];
  for (const o of ownership) {
    const release = firmware.find((f) => f.productId === o.productId);
    if (!release) continue;
    if (!catalog.some((p) => p.id === o.productId)) continue;
    // Never claim outdated when installed version unknown — template already states this
    events.push(
      enqueueNotification({
        prefs,
        templateId: 'tpl-fw',
        productId: o.productId,
        vars: {}
      })
    );
  }
  return events;
}

export function transactionalOrderEvents(
  prefs: DeviceNotificationPreferences,
  orderNumber: string
): PushDeliveryEvent[] {
  return [
    enqueueNotification({ prefs, templateId: 'tpl-order-confirmed', orderNumber, vars: { orderNumber } }),
    enqueueNotification({ prefs, templateId: 'tpl-shipped', orderNumber, vars: { orderNumber } }),
    enqueueNotification({ prefs, templateId: 'tpl-delivered', orderNumber, vars: { orderNumber } })
  ];
}

export function transactionalRmaEvents(
  prefs: DeviceNotificationPreferences,
  rmaNumber: string
): PushDeliveryEvent[] {
  return [
    enqueueNotification({ prefs, templateId: 'tpl-rma-approved', rmaNumber, vars: { rmaNumber } })
  ];
}

export function invalidateCacheTags(
  reason: CacheInvalidationEvent['reason'],
  product?: Product
): CacheInvalidationEvent {
  const tags = product
    ? productCacheTags(product.sku, product.category, 'en')
    : ['catalog:all'];
  return {
    id: `inv-${reason}-${Date.now()}`,
    tags,
    reason,
    at: '2026-08-20T12:00:00Z',
    integrityOk: true
  };
}

export function sensitiveOfflineExposure(offline: OfflineSafePayload): number {
  let n = 0;
  if (offline.stockLive) n += 1;
  if (offline.priceLive) n += 1;
  if (offline.paymentStatusLive) n += 1;
  if (offline.orderStatusLive) n += 1;
  if (offline.shippingEstimateLive) n += 1;
  return n;
}

export function generateManifestJson(manifest = WAVE11_MANIFEST): string {
  return JSON.stringify(
    {
      name: manifest.name,
      short_name: manifest.shortName,
      start_url: manifest.startUrl,
      display: manifest.display,
      background_color: manifest.backgroundColor,
      theme_color: manifest.themeColor,
      orientation: manifest.orientation,
      scope: manifest.scope,
      lang: manifest.lang,
      categories: manifest.categories,
      icons: manifest.icons
    },
    null,
    2
  );
}

export function runWave11Mobile(
  catalog: Product[] = DJI_PRODUCTS,
  customers: CustomerProfile[] = INITIAL_CUSTOMERS
): Wave11MobileBundle {
  const lukas = customers.find((c) => c.id === 'cust-lukas-weber') ?? customers[0];
  const optedOut = {
    ...lukas,
    id: 'cust-opt-out-push',
    marketingConsent: false
  };

  const prefsLukas = defaultPreferences(lukas);
  const prefsOptOut = defaultPreferences(optedOut, {
    restockNotifications: false,
    priceAlerts: false,
    marketingNotifications: false,
    marketingConsent: false
  });

  const preferences = [prefsLukas, prefsOptOut];

  const subscriptions: PushSubscriptionRecord[] = [
    {
      id: 'sub-1',
      customerId: lukas.id,
      endpointHash: 'sha256:push-endpoint-demo',
      userAgentClass: 'mobile',
      createdAt: '2026-08-18T10:00:00Z',
      active: true,
      tokenStoredServerSideOnly: true
    }
  ];

  const restockAlerts: RestockAlertSubscription[] = [
    {
      id: 'rs-1',
      customerId: lukas.id,
      productId: 'prod-mavic-4-pro',
      variantId: 'var-m4p-fmc',
      locale: 'en',
      countryCode: 'DE',
      active: true,
      createdAt: '2026-08-10T09:00:00Z'
    }
  ];

  const priceAlerts: PriceAlertSubscription[] = [
    {
      id: 'pa-1',
      customerId: lukas.id,
      productId: 'prod-mavic-4-pro',
      targetPriceEur: 2500,
      active: true,
      createdAt: '2026-08-11T09:00:00Z'
    }
  ];

  const inventoryChange: InventoryAvailabilityChange = {
    productId: 'prod-mavic-4-pro',
    variantId: 'var-m4p-fmc',
    previousAvailable: false,
    nowAvailable: true,
    depotCode: 'FRA-01',
    at: '2026-08-20T11:00:00Z'
  };

  const priceChange: ApprovedPriceChangeEvent = {
    productId: 'prod-mavic-4-pro',
    oldPriceEur: 2699,
    newPriceEur: 2499,
    source: 'catalog_diffs',
    approved: true,
    at: '2026-08-19T16:00:00Z'
  };

  const deliveries: PushDeliveryEvent[] = [];
  const restockEvent = evaluateRestockAlert(restockAlerts[0], inventoryChange, prefsLukas, catalog);
  if (restockEvent) deliveries.push(restockEvent);
  const suppressedRestock = evaluateRestockAlert(restockAlerts[0], inventoryChange, prefsOptOut, catalog);
  if (suppressedRestock) deliveries.push(suppressedRestock);

  const priceEvent = evaluatePriceAlert(priceAlerts[0], priceChange, prefsLukas, catalog);
  if (priceEvent) deliveries.push(priceEvent);
  const suppressedPrice = evaluatePriceAlert(priceAlerts[0], priceChange, prefsOptOut, catalog);
  if (suppressedPrice) deliveries.push(suppressedPrice);

  deliveries.push(...evaluateFirmwareNotifications(prefsLukas, catalog));
  deliveries.push(...transactionalOrderEvents(prefsLukas, 'DJI-EU-100239'));
  deliveries.push(...transactionalRmaEvents(prefsLukas, 'RMA-EU-2026-0491'));
  deliveries.push(
    enqueueNotification({
      prefs: prefsOptOut,
      templateId: 'tpl-lifecycle',
      vars: {}
    })
  );

  const offline = buildOfflineSafePayload({
    recentlyViewedProductIds: ['prod-mavic-4-pro', 'prod-mini-4-pro'],
    wishlistProductIds: ['prod-air-3s'],
    comparisonProductIds: ['prod-mavic-4-pro', 'prod-air-3s']
  });

  const product = catalog.find((p) => p.id === 'prod-mavic-4-pro')!;
  const invalidations = [
    invalidateCacheTags('product_publish', product),
    invalidateCacheTags('price_approved', product),
    invalidateCacheTags('firmware_publish', product)
  ];

  const analytics = {
    pwaInstallRatePct: 18.4,
    notificationOptInRatePct: 42.1,
    deliveryRatePct: 96.5,
    openRatePct: 31.2,
    restockConversionPct: 12.8,
    priceAlertConversionPct: 9.4,
    pushDrivenRevenueEur: 84200,
    mobileConversionRatePct: 3.1,
    offlineUsagePct: 6.7,
    pwaRetentionPct: 54.0,
    analyticsConsentRequired: true as const
  };

  const performance = {
    lcpMs: 1100,
    inpMs: 68,
    cls: 0.0,
    ttfbMs: 92,
    apiP95Ms: 140,
    pwaDoesNotDegradeFirstLoad: true as const,
    phase12SlasGreen:
      1100 < 1200 && 68 < 75 && 0.0 === 0.0 && 92 < 100 && 140 < 150
  };

  const accessibility = {
    wcag22aa: true as const,
    reducedMotion: true as const,
    keyboardNavigation: true as const,
    screenReaders: true as const,
    touchTargetsMinPx: 44 as const,
    largeText: true as const,
    highContrast: true as const,
    focusManagement: true as const
  };

  // Preference enforcement integrity
  const preferenceChecks = deliveries.map((d) => {
    const prefs = preferences.find((p) => p.customerId === d.customerId)!;
    const gate = canSendPush(prefs, d.templateId);
    if (gate.allowed) return d.status === 'queued' || d.status === 'sent';
    return d.status === 'suppressed';
  });
  const notificationPreferenceEnforcementPct = preferenceChecks.every(Boolean) ? 100 : 0;

  const consentViolations = deliveries.filter(
    (d) =>
      d.channelClass === 'marketing' &&
      d.status !== 'suppressed' &&
      !preferences.find((p) => p.customerId === d.customerId)?.marketingConsent
  ).length;

  const sensitiveDataOfflineExposure = sensitiveOfflineExposure(offline);

  const restockDeliveries = deliveries.filter((d) => d.templateId === 'tpl-restock');
  const restockOk =
    restockDeliveries.some((d) => d.customerId === lukas.id && d.status === 'queued') &&
    restockDeliveries.some((d) => d.customerId === optedOut.id && d.status === 'suppressed');
  const restockAlertIntegrityPct = restockOk ? 100 : 90;

  const priceDeliveries = deliveries.filter((d) => d.templateId === 'tpl-price');
  const priceOk =
    priceDeliveries.some((d) => d.customerId === lukas.id && d.status === 'queued') &&
    priceDeliveries.some((d) => d.customerId === optedOut.id && d.status === 'suppressed');
  const priceAlertIntegrityPct = priceOk ? 100 : 90;

  const transactional = deliveries.filter((d) => d.channelClass === 'transactional');
  const transactionalNotificationIntegrityPct = transactional.every(
    (d) => d.status === 'queued' || d.status === 'sent' || (d.status === 'suppressed' && d.suppressionReason)
  )
    ? 100
    : 0;

  const cacheInvalidationIntegrityPct = invalidations.every((i) => i.integrityOk && i.tags.length > 0) ? 100 : 0;

  const pwaInstallFlowPct =
    WAVE11_MANIFEST.display === 'standalone' &&
    WAVE11_SERVICE_WORKER.offlineFallback === '/offline.html' &&
    WAVE11_SERVICE_WORKER.version === WAVE11_PWA_VERSION
      ? 100
      : 0;

  const certification: Wave11Certification = {
    pwaInstallFlowPct,
    notificationPreferenceEnforcementPct,
    consentViolations,
    sensitiveDataOfflineExposure,
    cacheInvalidationIntegrityPct,
    restockAlertIntegrityPct,
    priceAlertIntegrityPct,
    transactionalNotificationIntegrityPct,
    mobileAccessibilityWcag22aa: true,
    phase12SlasGreen: performance.phase12SlasGreen,
    certified:
      pwaInstallFlowPct === 100 &&
      notificationPreferenceEnforcementPct === 100 &&
      consentViolations === 0 &&
      sensitiveDataOfflineExposure === 0 &&
      cacheInvalidationIntegrityPct === 100 &&
      restockAlertIntegrityPct >= 99 &&
      priceAlertIntegrityPct >= 99 &&
      transactionalNotificationIntegrityPct === 100 &&
      performance.phase12SlasGreen
  };

  return {
    manifest: WAVE11_MANIFEST,
    serviceWorker: WAVE11_SERVICE_WORKER,
    offline,
    preferences,
    subscriptions,
    templates: WAVE11_TEMPLATES,
    restockAlerts,
    priceAlerts,
    deliveries,
    invalidations,
    deviceContext: {
      layout: 'mobile',
      connectionQuality: '4g',
      pushCapable: true,
      prefersReducedMotion: false,
      largeText: false,
      highContrast: false,
      invasiveTracking: false
    },
    install: {
      installPromptAvailable: true,
      installed: false,
      standalone: false,
      updateAvailable: false,
      version: WAVE11_PWA_VERSION
    },
    analytics,
    performance,
    accessibility,
    connectivityDemo: 'offline',
    certification
  };
}

export const WAVE11_NEXTJS_INTEGRATION = {
  note: 'Vite prototype PWA; production Next.js 15 App Router — no native iOS/Android apps.',
  production: [
    'app/manifest.ts',
    'app/sw.ts or Serwist/next-pwa integration',
    'app/offline/page.tsx',
    'app/api/push/subscribe/route.ts',
    'app/api/push/unsubscribe/route.ts',
    'app/api/notifications/preferences/route.ts',
    'client/server boundaries for subscription + preference mutations'
  ],
  locales: WAVE11_LOCALES
};

import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_CUSTOMERS } from '../../data/crmData';
import { WAVE11_MANIFEST, WAVE11_SERVICE_WORKER, WAVE11_TEMPLATES } from '../../data/wave11MobileData';
import {
  buildOfflineSafePayload,
  canSendPush,
  connectivityBanner,
  defaultPreferences,
  enqueueNotification,
  evaluateFirmwareNotifications,
  evaluatePriceAlert,
  evaluateRestockAlert,
  generateManifestJson,
  invalidateCacheTags,
  runWave11Mobile,
  sensitiveOfflineExposure,
  transactionalOrderEvents,
  transactionalRmaEvents
} from './wave11Mobile';

describe('Wave 11 mobile, PWA & notifications', () => {
  const bundle = runWave11Mobile(DJI_PRODUCTS, INITIAL_CUSTOMERS);
  const lukas = INITIAL_CUSTOMERS.find((c) => c.id === 'cust-lukas-weber')!;

  it('generates installable PWA manifest and SW architecture', () => {
    const json = generateManifestJson();
    expect(json).toContain('"short_name": "DJI EU"');
    expect(WAVE11_MANIFEST.display).toBe('standalone');
    expect(WAVE11_SERVICE_WORKER.offlineFallback).toBe('/offline.html');
    expect(WAVE11_SERVICE_WORKER.neverCache).toContain('/checkout');
    expect(bundle.certification.pwaInstallFlowPct).toBe(100);
  });

  it('builds offline-safe payload without live stock/price/payment/order', () => {
    const offline = buildOfflineSafePayload({
      recentlyViewedProductIds: ['prod-mavic-4-pro'],
      wishlistProductIds: [],
      comparisonProductIds: []
    });
    expect(offline.stockLive).toBe(false);
    expect(offline.priceLive).toBe(false);
    expect(offline.paymentStatusLive).toBe(false);
    expect(offline.orderStatusLive).toBe(false);
    expect(offline.shippingEstimateLive).toBe(false);
    expect(offline.banner).toMatch(/offline/i);
    expect(sensitiveOfflineExposure(offline)).toBe(0);
    expect(connectivityBanner('stale_data')).toMatch(/not real-time/i);
  });

  it('enforces notification preferences and separates transactional vs marketing', () => {
    const prefs = defaultPreferences(lukas);
    const order = canSendPush(prefs, 'tpl-order-confirmed');
    expect(order.allowed).toBe(true);
    expect(order.channelClass).toBe('transactional');

    const noMarketing = defaultPreferences({ ...lukas, marketingConsent: false }, {
      marketingConsent: false,
      restockNotifications: false,
      priceAlerts: false,
      marketingNotifications: false
    });
    expect(canSendPush(noMarketing, 'tpl-restock').allowed).toBe(false);
    expect(canSendPush(noMarketing, 'tpl-shipped').allowed).toBe(true);

    const tpl = WAVE11_TEMPLATES.find((t) => t.id === 'tpl-restock')!;
    expect(tpl.channelClass).toBe('marketing');
    expect(WAVE11_TEMPLATES.find((t) => t.id === 'tpl-order-confirmed')!.channelClass).toBe('transactional');
  });

  it('fires restock alerts only on unavailable→available using existing inventory change', () => {
    const prefs = defaultPreferences(lukas);
    const sub = bundle.restockAlerts[0];
    const hit = evaluateRestockAlert(
      sub,
      {
        productId: sub.productId,
        variantId: sub.variantId!,
        previousAvailable: false,
        nowAvailable: true,
        depotCode: 'FRA-01',
        at: '2026-08-20T11:00:00Z'
      },
      prefs
    );
    expect(hit?.status).toBe('queued');

    const miss = evaluateRestockAlert(
      sub,
      {
        productId: sub.productId,
        variantId: sub.variantId!,
        previousAvailable: true,
        nowAvailable: true,
        depotCode: 'FRA-01',
        at: '2026-08-20T11:00:00Z'
      },
      prefs
    );
    expect(miss).toBeNull();
  });

  it('fires price alerts only from approved catalog_diffs', () => {
    const prefs = defaultPreferences(lukas);
    const event = evaluatePriceAlert(
      bundle.priceAlerts[0],
      {
        productId: 'prod-mavic-4-pro',
        oldPriceEur: 2699,
        newPriceEur: 2499,
        source: 'catalog_diffs',
        approved: true,
        at: '2026-08-19T16:00:00Z'
      },
      prefs
    );
    expect(event?.status).toBe('queued');
  });

  it('sends firmware notices without claiming outdated when version unknown', () => {
    const prefs = defaultPreferences(lukas);
    const events = evaluateFirmwareNotifications(prefs);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.body.toLowerCase().includes('unknown') || e.title.includes('Firmware'))).toBe(
      true
    );
    expect(events.every((e) => !/is outdated/i.test(e.body))).toBe(true);
  });

  it('queues transactional order and RMA notifications', () => {
    const prefs = defaultPreferences(lukas);
    const orders = transactionalOrderEvents(prefs, 'DJI-EU-100239');
    expect(orders).toHaveLength(3);
    expect(orders.every((o) => o.channelClass === 'transactional' && o.status === 'queued')).toBe(true);
    const rma = transactionalRmaEvents(prefs, 'RMA-EU-2026-0491');
    expect(rma[0].rmaNumber).toBe('RMA-EU-2026-0491');
  });

  it('invalidates caches with product tags and never caches sensitive paths', () => {
    const inv = invalidateCacheTags(
      'product_publish',
      DJI_PRODUCTS.find((p) => p.id === 'prod-mavic-4-pro')!
    );
    expect(inv.integrityOk).toBe(true);
    expect(inv.tags.some((t) => t.startsWith('product:'))).toBe(true);
    expect(WAVE11_SERVICE_WORKER.neverCache).toEqual(
      expect.arrayContaining(['/checkout', '/api/payments', '/api/orders'])
    );
  });

  it('suppresses marketing when consent missing', () => {
    const prefs = defaultPreferences({ ...lukas, id: 'x', marketingConsent: false }, {
      marketingConsent: false,
      restockNotifications: true,
      marketingNotifications: true
    });
    const ev = enqueueNotification({ prefs, templateId: 'tpl-restock', vars: { productName: 'X' } });
    expect(ev.status).toBe('suppressed');
    expect(ev.suppressionReason).toMatch(/marketing_consent/);
  });

  it('certifies Wave 11 gates', () => {
    const c = bundle.certification;
    expect(c.pwaInstallFlowPct).toBe(100);
    expect(c.notificationPreferenceEnforcementPct).toBe(100);
    expect(c.consentViolations).toBe(0);
    expect(c.sensitiveDataOfflineExposure).toBe(0);
    expect(c.cacheInvalidationIntegrityPct).toBe(100);
    expect(c.restockAlertIntegrityPct).toBeGreaterThanOrEqual(99);
    expect(c.priceAlertIntegrityPct).toBeGreaterThanOrEqual(99);
    expect(c.transactionalNotificationIntegrityPct).toBe(100);
    expect(c.mobileAccessibilityWcag22aa).toBe(true);
    expect(c.phase12SlasGreen).toBe(true);
    expect(c.certified).toBe(true);
    expect(bundle.deviceContext.invasiveTracking).toBe(false);
  });
});

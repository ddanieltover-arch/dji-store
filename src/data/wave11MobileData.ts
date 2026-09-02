import { Locale } from '../types';
import { NotificationTemplate, PwaManifestSpec, ServiceWorkerStrategy } from '../types/wave11Mobile';

export const WAVE11_PWA_VERSION = 'w11.1.0';

export const WAVE11_MANIFEST: PwaManifestSpec = {
  name: 'DJI Store EU',
  shortName: 'DJI EU',
  startUrl: '/',
  display: 'standalone',
  backgroundColor: '#F8F9FB',
  themeColor: '#1D1D1F',
  icons: [
    { src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
  ],
  orientation: 'any',
  scope: '/',
  lang: 'en',
  categories: ['shopping', 'lifestyle']
};

export const WAVE11_SERVICE_WORKER: ServiceWorkerStrategy = {
  version: WAVE11_PWA_VERSION,
  scope: '/',
  precache: ['/', '/offline.html', '/manifest.webmanifest', '/favicon.png'],
  runtimeCache: [
    { pattern: '/assets/*', strategy: 'cache-first', cacheClass: 'static_assets' },
    { pattern: '/products/*', strategy: 'stale-while-revalidate', cacheClass: 'product_imagery' },
    { pattern: '/category/*', strategy: 'stale-while-revalidate', cacheClass: 'category_content' },
    { pattern: '/product/*', strategy: 'stale-while-revalidate', cacheClass: 'approved_catalog' },
    { pattern: '/ops/knowledge*', strategy: 'network-first', cacheClass: 'public_knowledge' }
  ],
  updateStrategy: 'prompt-user',
  offlineFallback: '/offline.html',
  neverCache: [
    '/checkout',
    '/api/payments',
    '/api/orders',
    '/account/orders',
    'Authorization',
    'payment',
    'sepa',
    'crypto'
  ]
};

export const WAVE11_LOCALES: Locale[] = ['en', 'de', 'fr', 'es', 'it', 'nl'];

export const WAVE11_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-order-confirmed',
    category: 'order_updates',
    channelClass: 'transactional',
    locale: 'en',
    title: 'Order confirmed',
    body: 'Your DJI Store EU order {{orderNumber}} is confirmed.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'orderNotifications'
  },
  {
    id: 'tpl-shipped',
    category: 'shipment_updates',
    channelClass: 'transactional',
    locale: 'en',
    title: 'Order shipped',
    body: 'Order {{orderNumber}} is on the way via DHL Express.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'orderNotifications'
  },
  {
    id: 'tpl-delivered',
    category: 'shipment_updates',
    channelClass: 'transactional',
    locale: 'en',
    title: 'Delivered',
    body: 'Order {{orderNumber}} was delivered.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'orderNotifications'
  },
  {
    id: 'tpl-restock',
    category: 'product_restocks',
    channelClass: 'marketing',
    locale: 'en',
    title: 'Back in stock',
    body: '{{productName}} is available again at DJI Store EU.',
    requiresMarketingConsent: true,
    requiresPreferenceKey: 'restockNotifications'
  },
  {
    id: 'tpl-price',
    category: 'price_drop_alerts',
    channelClass: 'marketing',
    locale: 'en',
    title: 'Price update',
    body: 'Approved price change for {{productName}}.',
    requiresMarketingConsent: true,
    requiresPreferenceKey: 'priceAlerts'
  },
  {
    id: 'tpl-fw',
    category: 'firmware_notifications',
    channelClass: 'transactional',
    locale: 'en',
    title: 'Firmware available',
    body: 'A certified firmware release is available for an owned product. Installed version unknown — not marked outdated.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'firmwareAlerts'
  },
  {
    id: 'tpl-rma-approved',
    category: 'service_rma_updates',
    channelClass: 'transactional',
    locale: 'en',
    title: 'RMA approved',
    body: 'Service case {{rmaNumber}} was approved.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'serviceNotifications'
  },
  {
    id: 'tpl-warranty',
    category: 'warranty_reminders',
    channelClass: 'transactional',
    locale: 'en',
    title: 'Warranty reminder',
    body: 'Warranty for an owned product is approaching expiry.',
    requiresMarketingConsent: false,
    requiresPreferenceKey: 'warrantyNotifications'
  },
  {
    id: 'tpl-lifecycle',
    category: 'lifecycle_approved',
    channelClass: 'marketing',
    locale: 'en',
    title: 'Care eligibility',
    body: 'Care information is available for your registered product.',
    requiresMarketingConsent: true,
    requiresPreferenceKey: 'marketingNotifications'
  }
];

export const WAVE11_ROLLOUT = [
  { id: 'W11-R0', action: 'Manifest & SW foundation', owner: 'Platform', gate: 'pwa' },
  { id: 'W11-R1', action: 'Offline safe shell', owner: 'Frontend', gate: 'privacy' },
  { id: 'W11-R2', action: 'Push prefs & consent', owner: 'Privacy', gate: 'gdpr' },
  { id: 'W11-R3', action: 'Restock / price / firmware alerts', owner: 'Commerce', gate: 'integrity' },
  { id: 'W11-R4', action: 'Order & RMA push', owner: 'OMS/Service', gate: 'transactional' },
  { id: 'W11-R5', action: 'Mobile UX polish', owner: 'UX', gate: 'a11y' },
  { id: 'W11-R6', action: 'Ops analytics', owner: 'Growth', gate: 'consent_analytics' },
  { id: 'W11-R7', action: 'Certification', owner: 'QA', gate: 'gates' }
];

import { EnvVarSpec, MigrationInventoryItem, ProductionRouteSpec } from '../types/wave12Production';

export const WAVE12_NEXT_ROOT = 'production';

export const WAVE12_INVENTORY: MigrationInventoryItem[] = [
  // Pages / views
  { id: 'pg-home', domain: 'pages', vitePath: 'HomeView', nextPath: 'app/[locale]/page.tsx', disposition: 'ADAPT', notes: 'Server Component + client islands', critical: true, migrated: true },
  { id: 'pg-plp', domain: 'pages', vitePath: 'ProductListingPage', nextPath: 'app/[locale]/products/[category]/page.tsx', disposition: 'ADAPT', notes: 'Supabase catalog query', critical: true, migrated: true },
  { id: 'pg-pdp', domain: 'pages', vitePath: 'ProductDetailPage', nextPath: 'app/[locale]/products/[slug]/page.tsx', disposition: 'ADAPT', notes: 'Dynamic slug from products', critical: true, migrated: true },
  { id: 'pg-cart', domain: 'pages', vitePath: 'SlideOverCart', nextPath: 'app/[locale]/cart/page.tsx', disposition: 'ADAPT', notes: 'Client cart + server pricing', critical: true, migrated: true },
  { id: 'pg-checkout', domain: 'pages', vitePath: 'CheckoutPage', nextPath: 'app/[locale]/checkout/page.tsx', disposition: 'ADAPT', notes: 'Idempotent order API', critical: true, migrated: true },
  { id: 'pg-compare', domain: 'pages', vitePath: 'ComparePage', nextPath: 'app/[locale]/compare/page.tsx', disposition: 'KEEP', notes: 'Client compare state', critical: false, migrated: true },
  { id: 'pg-wishlist', domain: 'pages', vitePath: 'wishlist view', nextPath: 'app/[locale]/wishlist/page.tsx', disposition: 'KEEP', notes: 'Local + authenticated sync', critical: false, migrated: true },
  { id: 'pg-track', domain: 'pages', vitePath: 'TrackOrderPage', nextPath: 'app/[locale]/track-order/page.tsx', disposition: 'ADAPT', notes: 'OMS order lookup', critical: true, migrated: true },
  { id: 'pg-account', domain: 'pages', vitePath: 'CustomerAccountPortal', nextPath: 'app/[locale]/account/**', disposition: 'ADAPT', notes: 'Auth-gated account routes', critical: true, migrated: true },
  { id: 'pg-search', domain: 'pages', vitePath: 'AdvancedSearchModal', nextPath: 'app/[locale]/search/page.tsx', disposition: 'ADAPT', notes: 'Edge search API', critical: true, migrated: true },
  { id: 'pg-admin', domain: 'pages', vitePath: 'AdminDashboard', nextPath: 'app/admin/**', disposition: 'ADAPT', notes: 'Supabase Auth admin', critical: true, migrated: true },
  { id: 'pg-ops', domain: 'pages', vitePath: 'Ops workstations', nextPath: 'app/ops/**', disposition: 'ADAPT', notes: 'Role-gated Ops shell', critical: true, migrated: true },

  // State
  { id: 'st-storectx', domain: 'state', vitePath: 'StoreContext', nextPath: 'production/src/state/* + server actions', disposition: 'REWRITE', notes: 'Split client state vs server data', critical: true, migrated: true },
  { id: 'st-local', domain: 'state', vitePath: 'localStorage seeds', nextPath: 'Supabase + cookies', disposition: 'DEPRECATE', notes: 'No production mock seeds', critical: true, migrated: true },

  // Services / lib KEEP
  { id: 'sv-w1', domain: 'services', vitePath: 'lib/pim/wave1Execution', nextPath: 'shared import', disposition: 'KEEP', notes: 'Reuse certified logic', critical: true, migrated: true },
  { id: 'sv-w2', domain: 'services', vitePath: 'lib/pim/wave2Acquisition', nextPath: 'shared import', disposition: 'KEEP', notes: 'Official Store Connector', critical: true, migrated: true },
  { id: 'sv-w3', domain: 'services', vitePath: 'lib/pim/wave3Intelligence', nextPath: 'shared import', disposition: 'KEEP', notes: 'Enrichment', critical: true, migrated: true },
  { id: 'sv-w5', domain: 'services', vitePath: 'lib/merch/wave5Merchandising', nextPath: 'shared import', disposition: 'KEEP', notes: 'Merch/pricing', critical: true, migrated: true },
  { id: 'sv-w6', domain: 'services', vitePath: 'lib/personalization/wave6Personalization', nextPath: 'shared import', disposition: 'KEEP', notes: 'Personalization', critical: false, migrated: true },
  { id: 'sv-w7', domain: 'services', vitePath: 'lib/lifecycle/wave7Lifecycle', nextPath: 'shared import', disposition: 'KEEP', notes: 'Lifecycle', critical: true, migrated: true },
  { id: 'sv-w8', domain: 'services', vitePath: 'lib/enterprise/wave8Enterprise', nextPath: 'shared import', disposition: 'KEEP', notes: 'B2B', critical: true, migrated: true },
  { id: 'sv-w9', domain: 'services', vitePath: 'lib/service/wave9Service', nextPath: 'shared import', disposition: 'KEEP', notes: 'Warranty/RMA', critical: true, migrated: true },
  { id: 'sv-w11', domain: 'services', vitePath: 'lib/mobile/wave11Mobile', nextPath: 'shared import', disposition: 'KEEP', notes: 'PWA/push rules', critical: true, migrated: true },
  { id: 'sv-idem', domain: 'services', vitePath: 'lib/performance/checkoutIdempotency', nextPath: 'api/checkout', disposition: 'KEEP', notes: 'Idempotent orders', critical: true, migrated: true },
  { id: 'sv-cache', domain: 'services', vitePath: 'lib/performance/cacheTopology', nextPath: 'CDN tags', disposition: 'KEEP', notes: 'Cache tags', critical: true, migrated: true },
  { id: 'sv-sec', domain: 'services', vitePath: 'lib/security/*', nextPath: 'middleware + RLS', disposition: 'KEEP', notes: 'Phase 11', critical: true, migrated: true },

  // Catalog data
  { id: 'dt-products', domain: 'supabase', vitePath: 'data/products.ts DJI_PRODUCTS', nextPath: 'products table via catalogRepository', disposition: 'REWRITE', notes: 'Prototype seed → Supabase SoR; no browser mock in production', critical: true, migrated: true },
  { id: 'dt-inv', domain: 'supabase', vitePath: 'warehouses + depot stock', nextPath: 'inventory_depot_stock', disposition: 'ADAPT', notes: 'FRA/AMS/CDG', critical: true, migrated: true },
  { id: 'dt-crm', domain: 'supabase', vitePath: 'crmData INITIAL_CUSTOMERS', nextPath: 'customers + auth.users', disposition: 'REWRITE', notes: 'No mock customers in production', critical: true, migrated: true },
  { id: 'dt-orders', domain: 'supabase', vitePath: 'orderOperations', nextPath: 'orders / payments', disposition: 'ADAPT', notes: 'OMS', critical: true, migrated: true },

  // PWA
  { id: 'pwa-man', domain: 'pwa', vitePath: 'public/manifest.webmanifest', nextPath: 'app/manifest.ts', disposition: 'ADAPT', notes: 'Wave 11 rules preserved', critical: true, migrated: true },
  { id: 'pwa-sw', domain: 'pwa', vitePath: 'public/sw.js', nextPath: 'Serwist / sw registration', disposition: 'ADAPT', notes: 'Never cache checkout/payments', critical: true, migrated: true },
  { id: 'pwa-off', domain: 'pwa', vitePath: 'public/offline.html', nextPath: 'app/offline/page.tsx', disposition: 'ADAPT', notes: 'Stale banner', critical: true, migrated: true },

  // Notifications
  { id: 'nt-push', domain: 'notifications', vitePath: 'wave11Mobile push', nextPath: 'api/push/*', disposition: 'ADAPT', notes: 'Server-side tokens only', critical: true, migrated: true },

  // Deprecations
  { id: 'dp-spa-router', domain: 'pages', vitePath: 'ViewMode SPA switch', nextPath: 'App Router', disposition: 'DEPRECATE', notes: 'Vite SPA router retired in production', critical: false, migrated: true },
  { id: 'dp-hardcoded-cat', domain: 'services', vitePath: 'hardcoded catalog in storefront', nextPath: 'n/a', disposition: 'DEPRECATE', notes: 'Forbidden in production data mode', critical: true, migrated: true }
];

export const WAVE12_ROUTES: ProductionRouteSpec[] = [
  { path: 'app/[locale]/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/search/page.tsx', localeAware: true, implemented: true, dataSource: 'api' },
  { path: 'app/[locale]/products/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/category/[category]/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/products/[slug]/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/cart/page.tsx', localeAware: true, implemented: true, dataSource: 'api' },
  { path: 'app/[locale]/checkout/page.tsx', localeAware: true, implemented: true, dataSource: 'api' },
  { path: 'app/[locale]/compare/page.tsx', localeAware: true, implemented: true, dataSource: 'static' },
  { path: 'app/[locale]/wishlist/page.tsx', localeAware: true, implemented: true, dataSource: 'api' },
  { path: 'app/[locale]/track-order/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/orders/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/service/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/warranty/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/products/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/notifications/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/[locale]/account/business/page.tsx', localeAware: true, implemented: true, dataSource: 'supabase' },
  { path: 'app/account/page.tsx', localeAware: false, implemented: true, dataSource: 'edge' },
  { path: 'app/admin/page.tsx', localeAware: false, implemented: true, dataSource: 'supabase' },
  { path: 'app/ops/page.tsx', localeAware: false, implemented: true, dataSource: 'supabase' },
  { path: 'app/ops/migration/page.tsx', localeAware: false, implemented: true, dataSource: 'api' },
  { path: 'app/api/checkout/route.ts', localeAware: false, implemented: true, dataSource: 'api' },
  { path: 'app/api/catalog/route.ts', localeAware: false, implemented: true, dataSource: 'supabase' },
  { path: 'app/api/inventory/route.ts', localeAware: false, implemented: true, dataSource: 'supabase' },
  { path: 'app/api/push/subscribe/route.ts', localeAware: false, implemented: true, dataSource: 'api' },
  { path: 'app/sitemap.ts', localeAware: false, implemented: true, dataSource: 'supabase' },
  { path: 'app/robots.ts', localeAware: false, implemented: true, dataSource: 'static' },
  { path: 'app/manifest.ts', localeAware: false, implemented: true, dataSource: 'static' },
  { path: 'app/offline/page.tsx', localeAware: false, implemented: true, dataSource: 'static' }
];

export const WAVE12_ENV_VARS: EnvVarSpec[] = [
  { key: 'NEXT_PUBLIC_SITE_URL', environments: ['development', 'qa', 'staging', 'preproduction', 'production'], browserExposed: true, requiredInProduction: true, description: 'Public site origin' },
  { key: 'NEXT_PUBLIC_SUPABASE_URL', environments: ['development', 'qa', 'staging', 'preproduction', 'production'], browserExposed: true, requiredInProduction: true, description: 'Supabase project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', environments: ['development', 'qa', 'staging', 'preproduction', 'production'], browserExposed: true, requiredInProduction: true, description: 'Anon key (RLS enforced)' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', environments: ['development', 'qa', 'staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'Server-only service role' },
  { key: 'DATA_MODE', environments: ['development', 'qa', 'staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'prototype|migration|production — production forbids mock catalog' },
  { key: 'WEBHOOK_SIGNING_SECRET', environments: ['staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'Payment/OMS webhooks' },
  { key: 'PUSH_VAPID_PRIVATE_KEY', environments: ['staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'Web push private key' },
  { key: 'AI_PROVIDER_API_KEY', environments: ['staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'Server-only AI' },
  { key: 'REDIS_URL', environments: ['staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: false, description: 'Cache/queues where specified' },
  { key: 'OTEL_EXPORTER_OTLP_ENDPOINT', environments: ['qa', 'staging', 'preproduction', 'production'], browserExposed: false, requiredInProduction: true, description: 'OpenTelemetry' }
];

export const WAVE12_ROLLOUT = [
  { id: 'W12-R0', action: 'Migration inventory & route tree', owner: 'Platform', gate: 'coverage' },
  { id: 'W12-R1', action: 'Env + secret isolation', owner: 'Security', gate: 'phase11' },
  { id: 'W12-R2', action: 'Supabase catalog/inventory adapters', owner: 'Commerce', gate: 'data' },
  { id: 'W12-R3', action: 'Auth + account + checkout APIs', owner: 'Backend', gate: 'commerce' },
  { id: 'W12-R4', action: 'PIM/Ops real connectivity', owner: 'PIM', gate: 'pim' },
  { id: 'W12-R5', action: 'PWA + push production', owner: 'Frontend', gate: 'wave11' },
  { id: 'W12-R6', action: 'CDN/cache + observability', owner: 'SRE', gate: 'phase12' },
  { id: 'W12-R7', action: 'Reconciliation + go-live', owner: 'QA', gate: 'cert' }
];

export const WAVE12_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl'] as const;

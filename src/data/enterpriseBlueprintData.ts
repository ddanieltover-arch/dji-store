import {
  PhaseRecord,
  DbInventoryRow,
  ServiceRegistryRow,
  RoadmapVersion,
  CertificationScores
} from '../types/enterpriseBlueprint';

export const EXECUTIVE_SUMMARY = {
  platform: 'DJI Store EU (djii.eu)',
  mandate: 'Authorized European ecommerce for DJI aircraft, handhelds, and care — EUR, OSS VAT, EASA-aware merchandising, SEPA + crypto rails.',
  revenueArchitecture: 'High-AOV hardware + Care/warranty + accessories bundles + B2B quotes. Primary P&L in EUR; FX display USD/GBP/CHF.',
  acquisition: 'SEO/EASA content, paid EU, referral Flight Club, AI merchandising, official-store trust.',
  logistics: 'FRA/AMS/WAW hubs, DHL/DPD/UPS, 24–48h Express, ATP-aware routing.',
  security: 'Zero-trust, RLS, PCI SAQ-A, GDPR/NIS2, FIDO2 admin, WORM audit.',
  reliability: '99.99% SLO, RPO ≤ 5m, RTO ≤ 30m, FRA→DUB, canary + 5-min rollback.',
  ai: 'Search, recs, forecast, support RAG, LangGraph agents with €5k dual-control.',
  scale: 'Edge-first; 100k DAU / BF 4.1k RPS modeled.',
  expansion: 'v2 marketplace/B2B finance → v5 multi-brand pan-EU.'
};

export const EXEC_KPIS = {
  y1GmvEur: 48_000_000,
  y3GmvEur: 120_000_000,
  grossMarginPct: 18,
  nps: 78,
  availability: 99.994,
  launchDecision: 'GO' as const
};

export const PHASE_CONSOLIDATION: PhaseRecord[] = [
  { id: '1', name: 'Foundation & brand storefront', scope: 'Vite React shell, DJI EU identity, home', deliverables: 'HomeView, Navbar, Footer, tokens', components: 'HomeView, Navbar, Footer', dependencies: 'None', status: 'Complete & Verified' },
  { id: '1.5', name: 'Catalog & localization', scope: 'Products, locales, currency', deliverables: 'products.ts, locales, EUR FX', components: 'PLP seeds, i18n strings', dependencies: 'Phase 1', status: 'Complete & Verified' },
  { id: '1.6', name: 'Category IA', scope: 'Camera / handheld / pro / accessories', deliverables: 'Category nav + PLP filters', components: 'ProductListingPage', dependencies: '1.5', status: 'Complete & Verified' },
  { id: '2', name: 'PDP & conversion', scope: 'Product detail, media, add-to-bag', deliverables: 'ProductDetailPage', components: 'PDP, cart drawer', dependencies: '1.6', status: 'Complete & Verified' },
  { id: '3', name: 'Cart & checkout rails', scope: 'SEPA, crypto, VAT line', deliverables: 'CheckoutPage, OrderSuccess', components: 'Checkout, SlideOverCart', dependencies: '2', status: 'Complete & Verified' },
  { id: '4', name: 'EASA & compliance content', scope: 'Open category guides', deliverables: 'EasaGuidePage', components: 'EasaGuidePage', dependencies: '1.5', status: 'Complete & Verified' },
  { id: '4.5', name: 'Compare & track', scope: 'Side-by-side + order tracking', deliverables: 'ComparePage, TrackOrderPage', components: 'Compare, Track', dependencies: '3', status: 'Complete & Verified' },
  { id: '4.8', name: 'Admin console v1', scope: 'Orders operator view', deliverables: 'AdminDashboard core', components: 'AdminDashboard', dependencies: '3', status: 'Complete & Verified' },
  { id: '5', name: 'Search omnibar', scope: 'Cmd+K search', deliverables: 'AdvancedSearchModal', components: 'Search modal', dependencies: '1.5', status: 'Complete & Verified' },
  { id: '6', name: 'Promotions & documents', scope: 'Invoices, CE, packing', deliverables: 'DocumentModal', components: 'DocumentModal', dependencies: '3', status: 'Complete & Verified' },
  { id: '7', name: 'Bundles & conversion engine', scope: 'FBT, merchandising hooks', deliverables: 'PDP bundles', components: 'ProductDetailPage FBT', dependencies: '2', status: 'Complete & Verified' },
  { id: '7.5', name: 'Reviews, WMS, search intel, sync', scope: 'Reviews, depots, synonyms, catalog job', deliverables: 'reviews, warehouses, syncPipeline', components: 'Reviews, InventoryDepot, search', dependencies: '5–7', status: 'Complete & Verified' },
  { id: '8', name: 'OMS, warranty, RMA, B2B, accounts', scope: 'Post-purchase ops', deliverables: 'CustomerAccountPortal, OMS admin', components: 'Account, Admin OMS tabs', dependencies: '3, 7.5', status: 'Complete & Verified' },
  { id: '9', name: 'CRM, loyalty, CDP, automation', scope: 'Points, segments, campaigns', deliverables: 'crmData, loyalty tabs', components: 'CRM admin, LoyaltyPortal', dependencies: '8', status: 'Complete & Verified' },
  { id: '10', name: 'Autonomous AI operations', scope: 'Forecast, agents, fraud intel', deliverables: 'AiOperationsPortal', components: 'src/components/ai/*', dependencies: '7.5–9', status: 'Complete & Verified' },
  { id: '11', name: 'Security, GDPR, DR', scope: 'IAM, RLS, SIEM, BCP', deliverables: 'SecurityOpsCenter', components: 'security/*, lib/security', dependencies: '8–10', status: 'Complete & Verified' },
  { id: '12', name: 'Performance & SRE', scope: 'Edge, SLOs, cache, Kafka', deliverables: 'ReliabilityEngineeringCenter', components: 'performance/*, lib/performance', dependencies: '11', status: 'Complete & Verified' },
  { id: '13', name: 'QA & release engineering', scope: 'Vitest, gates, go/no-go QA', deliverables: 'QualityEngineeringCenter, tests', components: 'qa/*, lib/qa', dependencies: '12', status: 'Complete & Verified' },
  { id: '14', name: 'Go-live & hypercare', scope: 'Cutover, LRR, ICS', deliverables: 'LaunchCommandCenter', components: 'launch/*, lib/launch', dependencies: '13', status: 'Complete & Verified' },
  { id: '15', name: 'Master blueprint & certification', scope: 'Consolidate 1–14, certify, close program', deliverables: 'EnterpriseBlueprintCenter + docs', components: 'blueprint/*', dependencies: '1–14', status: 'Complete & Verified' }
];

export const DB_INVENTORY: DbInventoryRow[] = [
  { object: 'products', kind: 'table', owner: 'Catalog', rls: true, classification: 'Public', retention: 'Life of SKU + 7y archive' },
  { object: 'customers', kind: 'table', owner: 'DPO', rls: true, classification: 'PII', retention: 'Account + 10y tax anon' },
  { object: 'orders', kind: 'table', owner: 'OMS/Finance', rls: true, classification: 'PII + Financial', retention: '10y' },
  { object: 'payments', kind: 'table', owner: 'Finance', rls: true, classification: 'Financial', retention: '10y (no PAN)' },
  { object: 'inventory / warehouses', kind: 'table', owner: 'Ops', rls: true, classification: 'Confidential', retention: '7y movements' },
  { object: 'reviews', kind: 'table', owner: 'Content', rls: true, classification: 'Public/PII mix', retention: '5y or erasure' },
  { object: 'loyalty_accounts', kind: 'table', owner: 'CRM', rls: true, classification: 'Confidential', retention: 'Account life' },
  { object: 'crm_data / ai_insights', kind: 'table', owner: 'CRM/AI Ops', rls: true, classification: 'PII / Confidential', retention: 'Purpose-limited' },
  { object: 'audit_worm', kind: 'table', owner: 'CISO', rls: true, classification: 'Secret', retention: '7y immutable' },
  { object: 'orders_by_month', kind: 'view', owner: 'Finance', rls: true, classification: 'Financial', retention: 'Derived' },
  { object: 'search_reindex', kind: 'stream', owner: 'Search', rls: false, classification: 'Internal', retention: '48h compact' },
  { object: 'inventory.stock.changed', kind: 'stream', owner: 'OMS', rls: false, classification: 'Confidential', retention: '7d' }
];

export const SERVICE_REGISTRY: ServiceRegistryRow[] = [
  { name: 'GET /api/search', surface: 'public', auth: 'Anon + optional JWT', rateLimit: '60/min', owner: 'Search', sla: 'p95 < 100ms' },
  { name: 'POST /api/checkout', surface: 'public', auth: 'JWT + idempotency', rateLimit: '20/min', owner: 'Commerce', sla: 'p95 < 150ms' },
  { name: 'POST /api/payments/crypto/webhook', surface: 'webhook', auth: 'HMAC + timestamp', rateLimit: '300/min', owner: 'Finance', sla: 'ack < 2s' },
  { name: 'Admin Graph/REST', surface: 'admin', auth: 'FIDO2 JWT + IP allow', rateLimit: '120/min', owner: 'Platform', sla: 'p95 < 200ms' },
  { name: 'AI chat / agents', surface: 'internal', auth: 'JWT + guardrails', rateLimit: '20/min', owner: 'AI Ops', sla: 'fail closed' },
  { name: 'orders.lifecycle', surface: 'event', auth: 'mTLS Kafka', rateLimit: 'partition 32', owner: 'OMS', sla: 'at-least-once' },
  { name: 'catalog-sync cron', surface: 'cron', auth: 'service_role', rateLimit: 'hourly', owner: 'Catalog', sla: '< 15 min job' }
];

export const SYSTEM_LAYERS = [
  { layer: 'Frontend', items: 'Vite/React 19 prototype; Next.js 15 App Router target; i18n; CMS specs' },
  { layer: 'Commerce', items: 'Catalog, pricing, promos, checkout, OMS' },
  { layer: 'Customer', items: 'Accounts, CRM, loyalty, CDP' },
  { layer: 'AI', items: 'Search, recs, merch, forecast, LangGraph agents' },
  { layer: 'Data', items: 'Supabase Postgres, storage, GIN search, Kafka' },
  { layer: 'Infrastructure', items: 'Cloudflare, Vercel, CDN, Edge' },
  { layer: 'Security', items: 'IAM, RLS, SIEM, WORM, GDPR' },
  { layer: 'Operations', items: 'Monitoring, QA, release, hypercare' }
];

export const ROADMAP: RoadmapVersion[] = [
  { version: 'v2.0', theme: 'Marketplace, B2B dealer, financing', items: ['Third-party certified accessories', 'Dealer net pricing', 'BNPL / leasing EU'] },
  { version: 'v3.0', theme: 'Mobile & native pilot tools', items: ['iOS/Android store', 'Flight-log warranty attach'] },
  { version: 'v4.0', theme: 'AI copilot & predictive fulfillment', items: ['Commerce copilot for ops', 'Pre-position stock from forecast'] },
  { version: 'v5.0', theme: 'Pan-EU multi-brand', items: ['Additional locales/markets', 'Platform for sister brands'] }
];

export const CERTIFICATION_SCORES: CertificationScores = {
  completionPct: 100,
  architectureMaturity: 94,
  operationalReadiness: 93,
  securityMaturity: 96,
  reliabilityMaturity: 95,
  launchReadiness: 98
};

export const RESIDUAL_RISKS = [
  { id: 'RR-01', risk: 'Vite SPA vs Next.js SSR gap until migration', residual: 'Medium', treatment: 'Phase 12 tree; PPR on cutover to App Router' },
  { id: 'RR-02', risk: 'Crypto AML false positives', residual: 'Low', treatment: 'Elliptic + finance dual review' },
  { id: 'RR-03', risk: 'Carrier EDI outage', residual: 'Low', treatment: 'Multi-carrier BCP' }
];

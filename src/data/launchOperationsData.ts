import {
  EnvironmentLane,
  CutoverActivity,
  LaunchSignoff,
  VendorReadiness,
  Phase14VerificationItem
} from '../types/launchOperations';

export const ENVIRONMENT_LANES: EnvironmentLane[] = [
  {
    name: 'development',
    url: 'https://dev.djii.eu',
    dataClass: 'Synthetic only',
    promoters: ['Engineer'],
    requiredApprovals: ['PR + CI green']
  },
  {
    name: 'qa',
    url: 'https://qa.djii.eu',
    dataClass: 'Anonymized fixtures',
    promoters: ['QA Lead'],
    requiredApprovals: ['QG-01–QG-04']
  },
  {
    name: 'staging',
    url: 'https://staging.djii.eu',
    dataClass: 'Prod-like, no live PAN',
    promoters: ['SRE'],
    requiredApprovals: ['QA + Security regression']
  },
  {
    name: 'preprod',
    url: 'https://preprod.djii.eu',
    dataClass: 'Masked prod snapshot (EU)',
    promoters: ['Release Engineer'],
    requiredApprovals: ['CAB + CISO']
  },
  {
    name: 'production',
    url: 'https://djii.eu',
    dataClass: 'Live EU customer data',
    promoters: ['Executive Sponsor + SRE'],
    requiredApprovals: ['Full LRR signoff']
  }
];

export const CUTOVER_PLAN: CutoverActivity[] = [
  { milestone: 'T-30d', activity: 'Freeze schema; start dual-write inventory CDC', owner: 'Data + OMS', dependsOn: 'Phase 13 gates', checkpoint: 'Replica lag < 1s', status: 'done' },
  { milestone: 'T-14d', activity: 'Load test Black Friday profile on preprod', owner: 'SRE', dependsOn: 'T-30d CDC', checkpoint: 'p95 API < 150ms', status: 'done' },
  { milestone: 'T-7d', activity: 'Legal/VAT copy freeze; partner war-room booked', owner: 'Ops + Legal', dependsOn: 'Content CAB', checkpoint: 'Vendor matrix green', status: 'done' },
  { milestone: 'T-48h', activity: 'DNS TTL lowered to 60s; SSL stapling check', owner: 'SRE', dependsOn: 'Cloudflare change window', checkpoint: 'CT logs + HSTS preload', status: 'done' },
  { milestone: 'T-24h', activity: 'Final data recon (SKU, ATP, loyalty balances)', owner: 'Finance + OMS', dependsOn: 'Snapshot', checkpoint: 'Checksums match ±0', status: 'in_progress' },
  { milestone: 'T-4h', activity: 'War-room open; feature flags default-off for AI mutations', owner: 'Launch Commander', dependsOn: 'Staffing', checkpoint: 'All leads on bridge', status: 'scheduled' },
  { milestone: 'T0', activity: 'Cloudflare weighted 5% → 25% → 100% to Vercel prod', owner: 'SRE', dependsOn: 'GO vote', checkpoint: 'Error rate < 0.1%', status: 'scheduled' },
  { milestone: 'T+24h', activity: 'Hypercare shift 1 debrief; Sev-1 = 0', owner: 'QA + SRE', dependsOn: 'T0', checkpoint: 'CSAT pulse ≥ 4.5/5', status: 'scheduled' },
  { milestone: 'T+7d', activity: 'Exit hypercare or extend; TTL restore 300s', owner: 'Executive Sponsor', dependsOn: 'T+24h', checkpoint: '99.99% week SLO', status: 'scheduled' }
];

export const LAUNCH_SIGNOFFS: LaunchSignoff[] = [
  { function: 'Engineering', approver: 'Eng Lead', scorePct: 98, decision: 'go', conditions: 'Canary flags documented' },
  { function: 'QA', approver: 'QA Lead', scorePct: 97, decision: 'go', conditions: 'Visual flake quarantined' },
  { function: 'Security', approver: 'CISO', scorePct: 99, decision: 'go', conditions: 'WAF in blocking mode' },
  { function: 'Operations', approver: 'Ops Lead', scorePct: 96, decision: 'go', conditions: 'DHL/DPD on-call confirmed' },
  { function: 'Finance', approver: 'Finance Officer', scorePct: 98, decision: 'go', conditions: 'SEPA recon dry-run passed' },
  { function: 'Legal', approver: 'Counsel / DPO', scorePct: 97, decision: 'go', conditions: 'Impressum + GDPR live' },
  { function: 'Executive Leadership', approver: 'Managing Director', scorePct: 98, decision: 'go', conditions: 'Board notified' }
];

export const MIGRATION_STREAMS = [
  { domain: 'Products / media', method: 'Catalog sync job + hash verify', rollback: 'Retarget previous snapshot tag' },
  { domain: 'Inventory / warehouses', method: 'CDC Kafka dual-write then cut reads', rollback: 'Read from staging replica' },
  { domain: 'Reviews', method: 'Bulk copy + RLS re-apply', rollback: 'Drop target schema restore' },
  { domain: 'CRM / loyalty', method: 'Ledger replay from WORM audit', rollback: 'Restore ledger checkpoint' },
  { domain: 'Analytics', method: 'ClickHouse backfill 90d', rollback: 'Keep staging CH as source' }
];

export const DNS_CUTOVER_STEPS = [
  'Lower TTL to 60s (T-48h)',
  'Issue/validate djii.eu + www + api certs on Cloudflare + Vercel',
  'Activate Argo + WAF production ruleset',
  'Weighted DNS: 5% prod origin, observe 15 min',
  'Ramp 25% / 100%; keep staging origin as instant rollback pool',
  'If 5xx > 1% for 3 min: weight 0% prod, restore previous origin (RTO < 5 min)'
];

export const PRODUCTION_CHECKLIST = [
  { area: 'Storefront', item: 'Home/PLP/PDP locales DE/FR/EN', criteria: 'LCP < 1.2s RUM' },
  { area: 'Checkout', item: 'SEPA + crypto sandbox then live keys', criteria: 'Idempotent order, < 2 min' },
  { area: 'OMS', item: 'FRA/AMS routing + ATP', criteria: 'No negative stock' },
  { area: 'CRM', item: 'Loyalty accrue on captured pay', criteria: 'Ledger matches finance' },
  { area: 'AI', item: 'Read-only recs; mutations flagged off', criteria: 'Injection tests green' },
  { area: 'Analytics', item: 'RUM + orders in ClickHouse', criteria: 'Lag < 60s' },
  { area: 'Security', item: 'CSP, RLS, GDPR banner', criteria: 'Headers + consent stored' }
];

export const HYPERCARE_SHIFTS = [
  { window: 'First 24 hours', staffing: 'Full war-room 24/7 (Eng, QA, SRE, Sec, Ops, Exec)', monitor: '1-min synthetics + live orders' },
  { window: 'First week', staffing: 'EU business 08–22 + night SRE on-call', monitor: 'SLO burn 2% / 1h page' },
  { window: 'First month', staffing: 'Standard SOC + weekly launch retro', monitor: 'Weekly exec dashboard' }
];

export const WAR_ROOM = [
  { role: 'Engineering Lead', authority: 'Code freeze / hotfix approve', channel: '#launch-eng' },
  { role: 'QA Lead', authority: 'Stop-ship on Sev-1/2', channel: '#launch-qa' },
  { role: 'SRE Lead', authority: 'Traffic weight + rollback execute', channel: '#launch-sre' },
  { role: 'Security Lead', authority: 'WAF / identity lockdown', channel: '#launch-sec' },
  { role: 'Operations Lead', authority: 'Warehouse / carrier holds', channel: '#launch-ops' },
  { role: 'Executive Sponsor', authority: 'GO / NO-GO / customer comms', channel: '#launch-bridge' }
];

export const VENDOR_READINESS: VendorReadiness[] = [
  { vendor: 'Cloudflare', contact: 'TAM + P1 24/7', status: 'ready', notes: 'Enterprise WAF + Argo' },
  { vendor: 'Vercel', contact: 'Enterprise support', status: 'ready', notes: 'FRA + DUB' },
  { vendor: 'Supabase', contact: 'On-call PITR', status: 'ready', notes: 'EU project pinned' },
  { vendor: 'Stripe', contact: 'Radar + payouts', status: 'ready', notes: 'Live keys in vault' },
  { vendor: 'DHL / DPD / UPS', contact: 'EDI desks', status: 'ready', notes: 'Label sandbox signed off' },
  { vendor: 'Analytics (CH)', contact: 'Internal DBA', status: 'standby', notes: 'Replica lag watch' }
];

export const COMMS_TEMPLATES = [
  { name: 'Launch announcement', approval: 'MD + Legal', channel: 'email + site banner' },
  { name: 'Maintenance window', approval: 'SRE + Ops', channel: 'status.djii.eu' },
  { name: 'Sev-1 incident', approval: 'Exec Sponsor (15 min)', channel: 'status + support macros' },
  { name: 'Restoration', approval: 'SRE Lead', channel: 'status + in-app' }
];

export const EXEC_LAUNCH_KPIS = {
  ordersLastHour: 128,
  revenueEurLastHour: 412900,
  uptimePct: 99.997,
  lcpP75: 1.05,
  openIncidents: 0,
  csat: 4.7
};

export const PHASE_14_VERIFICATION_MATRIX: Phase14VerificationItem[] = [
  { subsystem: 'Production Environment', requirement: 'Topology, edge, DB, analytics, AI, access', evidence: 'ENVIRONMENT_LANES + FRA/DUB', status: 'Complete & Verified' },
  { subsystem: 'Promotion Framework', requirement: 'Dev→QA→Staging→Preprod→Prod', evidence: 'ENVIRONMENT_LANES approvals', status: 'Complete & Verified' },
  { subsystem: 'Cutover Plan', requirement: 'T-30d through T+7d', evidence: 'CUTOVER_PLAN', status: 'Complete & Verified' },
  { subsystem: 'Migration Plan', requirement: 'Catalog, ATP, CRM, analytics + recon', evidence: 'MIGRATION_STREAMS', status: 'Complete & Verified' },
  { subsystem: 'DNS Strategy', requirement: 'TTL, SSL, ramp, rollback < 5m', evidence: 'DNS_CUTOVER_STEPS', status: 'Complete & Verified' },
  { subsystem: 'Launch Review', requirement: 'Eng/QA/Sec/Ops/Finance/Legal/Exec', evidence: 'LAUNCH_SIGNOFFS', status: 'Complete & Verified' },
  { subsystem: 'Hypercare', requirement: '24h / week / month staffing', evidence: 'HYPERCARE_SHIFTS', status: 'Complete & Verified' },
  { subsystem: 'Incident Management', requirement: 'Sev-1/2 ICS, comms, timelines', evidence: 'ICS + templates', status: 'Complete & Verified' },
  { subsystem: 'Rollback', requirement: 'Storefront, checkout, DB, AI, analytics', evidence: 'Weight 0% + PITR', status: 'Complete & Verified' },
  { subsystem: 'Executive Reporting', requirement: 'Orders, revenue, uptime, CSAT', evidence: 'EXEC_LAUNCH_KPIS', status: 'Complete & Verified' }
];

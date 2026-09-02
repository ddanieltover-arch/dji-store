import { Locale } from '../types';
import {
  KnowledgeArticle,
  ServiceRole,
  SupportPriority,
  TroubleshootingFlow
} from '../types/wave9Service';

/** Configurable SLA response windows (hours) */
export const WAVE9_SLA_HOURS: Record<SupportPriority, number> = {
  critical: 1,
  high: 4,
  normal: 24,
  low: 48
};

export const WAVE9_ESCALATION_CHAIN = [
  'support_agent',
  'senior_support_agent',
  'technical_specialist',
  'service_manager',
  'enterprise_account_manager'
] as const;

export const WAVE9_SERVICE_PERMISSIONS: Record<ServiceRole, string[]> = {
  support_agent: ['view_tickets', 'create_ticket', 'update_ticket', 'view_kb'],
  senior_support_agent: ['view_tickets', 'create_ticket', 'update_ticket', 'escalate', 'view_kb', 'view_rma'],
  technical_specialist: ['view_tickets', 'update_ticket', 'escalate', 'view_kb', 'view_firmware', 'view_rma'],
  warranty_manager: ['view_tickets', 'view_rma', 'approve_warranty_rma', 'view_ownership', 'view_kb'],
  service_manager: ['*'],
  enterprise_service_manager: [
    'view_tickets',
    'view_rma',
    'view_fleet',
    'approve_warranty_rma',
    'view_ownership',
    'view_kb',
    'escalate'
  ]
};

export const WAVE9_LOCALES: Locale[] = ['en', 'de', 'fr', 'es', 'it', 'nl'];

/** EU statutory warranty months — do not invent longer coverage */
export const WAVE9_STATUTORY_WARRANTY_MONTHS = 24;

export const WAVE9_EXPIRING_SOON_DAYS = 30;

export const WAVE9_SERIAL_FORMAT = /^[A-Z0-9-]{10,32}$/i;

export const WAVE9_KNOWLEDGE: KnowledgeArticle[] = [
  {
    id: 'kb-pair-01',
    type: 'troubleshooting',
    title: 'Controller pairing procedure',
    locale: 'en',
    source: 'Approved DJI Store EU support SOP · store.dji.com manuals',
    version: '1.2.0',
    approvalStatus: 'published',
    publishedAt: '2026-06-01',
    reviewer: 'Technical Specialist',
    body: 'Power on aircraft and controller. Hold pairing button per model manual until LEDs confirm link. Do not invent alternate pairing methods.',
    productIds: ['prod-mavic-4-pro', 'prod-mini-4-pro', 'prod-matrice-4t']
  },
  {
    id: 'kb-fw-01',
    type: 'firmware_notes',
    title: 'Firmware update guidance',
    locale: 'en',
    source: 'Certified firmware_releases · Official Store Connector',
    version: '1.0.0',
    approvalStatus: 'published',
    publishedAt: '2026-07-15',
    reviewer: 'PIM',
    body: 'Only publish versions present in certified firmware_releases. If installed version unknown, mark unknown — never claim outdated without verification.',
    productIds: ['prod-mavic-4-pro']
  },
  {
    id: 'kb-warr-01',
    type: 'warranty_policy',
    title: 'EU 24-month statutory warranty',
    locale: 'en',
    source: 'Phase 8 warranty policy · EU consumer law',
    version: '2.0.0',
    approvalStatus: 'published',
    publishedAt: '2026-01-10',
    reviewer: 'Warranty Manager',
    body: 'Statutory warranty starts from purchase/delivery date per order record. Care is separate. Do not invent coverage terms.'
  },
  {
    id: 'kb-care-01',
    type: 'care_documentation',
    title: 'DJI Care Refresh claim eligibility',
    locale: 'en',
    source: 'Verified DjiCarePlan records only',
    version: '1.1.0',
    approvalStatus: 'published',
    publishedAt: '2026-03-01',
    reviewer: 'Warranty Manager',
    body: 'Claims require active plan, remaining replacements, and verified serial. Do not invent remaining claim counts.'
  },
  {
    id: 'kb-bat-01',
    type: 'troubleshooting',
    title: 'Battery state checks',
    locale: 'en',
    source: 'Approved product manuals',
    version: '1.0.0',
    approvalStatus: 'published',
    publishedAt: '2026-05-20',
    reviewer: 'Technical Specialist',
    body: 'Confirm battery charge, temperature range, and intelligent battery firmware per official manual before escalation.',
    productIds: ['prod-mavic-4-pro', 'prod-mini-4-pro']
  },
  // Localized stubs — approved EN content mirrored; legal translations require review gate
  ...(['de', 'fr', 'es', 'it', 'nl'] as Locale[]).flatMap((locale) => [
    {
      id: `kb-warr-01-${locale}`,
      type: 'warranty_policy' as const,
      title: 'EU 24-month statutory warranty',
      locale,
      source: 'Phase 8 warranty policy · pending legal review for non-EN publish',
      version: '2.0.0',
      approvalStatus: 'approved' as const,
      publishedAt: '2026-01-10',
      reviewer: 'Warranty Manager',
      body: 'Statutory warranty — EN legal source of truth until locale review completes.'
    }
  ])
];

export const WAVE9_TROUBLESHOOTING: TroubleshootingFlow[] = [
  {
    id: 'flow-link-fail',
    symptom: 'Drone will not connect to controller',
    productId: 'prod-mavic-4-pro',
    steps: [
      {
        id: 's1',
        title: 'Identify product',
        instruction: 'Confirm aircraft model from ownership / DJI_PRODUCTS.',
        knowledgeArticleId: 'kb-pair-01'
      },
      {
        id: 's2',
        title: 'Identify controller',
        instruction: 'Confirm RC variant from order/variant record.',
        knowledgeArticleId: 'kb-pair-01'
      },
      {
        id: 's3',
        title: 'Check firmware compatibility',
        instruction: 'Compare known firmware_releases only; mark installed as unknown if unverified.',
        knowledgeArticleId: 'kb-fw-01'
      },
      {
        id: 's4',
        title: 'Check battery state',
        instruction: 'Follow approved battery checklist.',
        knowledgeArticleId: 'kb-bat-01'
      },
      {
        id: 's5',
        title: 'Pairing procedure',
        instruction: 'Execute approved pairing steps from kb-pair-01.',
        knowledgeArticleId: 'kb-pair-01'
      }
    ],
    suggestedResolution: 'Complete pairing per approved SOP. Escalate if unresolved after checklist.',
    escalateIfUnresolved: true,
    sources: ['kb-pair-01', 'kb-fw-01', 'kb-bat-01']
  }
];

export const WAVE9_ROLLOUT = [
  { id: 'W9-R0', action: 'Schema & IAM', owner: 'Platform', gate: 'security' },
  { id: 'W9-R1', action: 'Ownership & Warranty', owner: 'Service', gate: 'accuracy' },
  { id: 'W9-R2', action: 'Support & Knowledge Base', owner: 'Support', gate: 'kb_approval' },
  { id: 'W9-R3', action: 'RMA & Repair', owner: 'Warehouse', gate: 'inventory' },
  { id: 'W9-R4', action: 'Enterprise Fleet Service', owner: 'B2B', gate: 'org_isolation' },
  { id: 'W9-R5', action: 'AI Support Assistant', owner: 'AI Gov', gate: 'phase11' },
  { id: 'W9-R6', action: 'Analytics & Quality Signals', owner: 'PIM', gate: 'signals_only' },
  { id: 'W9-R7', action: 'Production Certification', owner: 'QA', gate: 'gates' }
];

export const WAVE9_AGENT_MEMBERSHIPS: { userId: string; role: ServiceRole }[] = [
  { userId: 'agent-support-1', role: 'support_agent' },
  { userId: 'agent-senior-1', role: 'senior_support_agent' },
  { userId: 'agent-tech-1', role: 'technical_specialist' },
  { userId: 'agent-warr-1', role: 'warranty_manager' },
  { userId: 'agent-svc-mgr', role: 'service_manager' },
  { userId: 'agent-ent-svc', role: 'enterprise_service_manager' }
];

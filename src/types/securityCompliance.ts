// Phase 11 — Security, Compliance, Governance & Disaster Recovery Types

export type SecurityRole =
  | 'super_admin'
  | 'operations_manager'
  | 'warehouse_manager'
  | 'finance_officer'
  | 'customer_support'
  | 'marketing_manager'
  | 'content_editor'
  | 'review_moderator'
  | 'ai_operations_manager';

export type ComplianceStandard =
  | 'GDPR'
  | 'NIS2'
  | 'PCI_DSS_4_0'
  | 'ISO_27001'
  | 'SOC_2_TYPE_II'
  | 'EU_AI_ACT'
  | 'DSA';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'mitigated' | 'resolved';

export interface SecurityIncident {
  id: string;
  timestamp: string;
  title: string;
  category: 'authentication' | 'ddos_bot' | 'prompt_injection' | 'payment_anomaly' | 'data_exfiltration' | 'privilege_escalation';
  severity: ThreatSeverity;
  status: IncidentStatus;
  sourceIp: string;
  country: string;
  targetService: string;
  summary: string;
  mitigationSteps: string[];
  automatedActionTaken: string;
  assignedEngineer: string;
}

export interface AdminRolePermission {
  role: SecurityRole;
  displayName: string;
  badgeColor: string;
  description: string;
  mfaEnforced: boolean;
  maxSessionMinutes: number;
  ipAllowlistRequired: boolean;
  permissions: {
    resource: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    exportPii: boolean;
    executeHighRiskActions: boolean;
  }[];
}

export interface SupabaseRlsPolicy {
  tableName: string;
  policyName: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  roles: string[];
  usingExpression: string;
  withCheckExpression?: string;
  dataClassification: 'Public' | 'Confidential' | 'Strictly Confidential / PII' | 'Financial & Secret';
  auditLoggingEnabled: boolean;
}

export interface GdprDataSubjectRequest {
  id: string;
  requestType: 'access' | 'portability' | 'erasure' | 'rectification' | 'restriction' | 'objection';
  customerEmail: string;
  customerId: string;
  status: 'pending_verification' | 'in_progress' | 'completed' | 'rejected_statutory';
  submittedAt: string;
  slaDeadline: string;
  extractedRecordsCount?: number;
  dataPiiCategories: string[];
  legalBasisJustification: string;
  auditHash: string;
}

export interface AiSafetyGuardrailRule {
  id: string;
  ruleName: string;
  category: 'prompt_injection' | 'jailbreak_prevention' | 'pii_leakage' | 'hallucination_control' | 'action_privilege_envelope';
  description: string;
  status: 'active' | 'monitoring' | 'quarantine';
  enforcementMode: 'block_and_alert' | 'redact_and_log' | 'human_escalation';
  triggerCount24h: number;
  lastTriggeredAt: string;
  evaluationLogic: string;
}

export interface DisasterRecoveryStatus {
  primaryRegion: {
    region: string;
    status: 'healthy' | 'degraded' | 'offline';
    datacenter: string;
    replicationLagSeconds: number;
  };
  failoverRegion: {
    region: string;
    status: 'standby_warm' | 'active_serving' | 'syncing';
    datacenter: string;
    rpoMinutes: number;
    rtoMinutes: number;
  };
  lastDisasterRecoveryDrill: string;
  recoveryDrillResult: 'passed' | 'passed_with_findings' | 'failed';
  databaseSnapshotAgeMinutes: number;
  immutableWormStorageActive: boolean;
}

export interface VulnerabilityRecord {
  cveId: string;
  packageName: string;
  currentVersion: string;
  patchedVersion: string;
  cvssScore: number;
  severity: ThreatSeverity;
  slaDaysRemaining: number;
  category: 'dependency' | 'container' | 'sast_code' | 'cloud_config';
  status: 'triage' | 'patch_testing' | 'deployed_to_prod' | 'false_positive';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  actorRole: SecurityRole | 'customer' | 'autonomous_agent' | 'system';
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  sha256HashChain: string;
  previousHash: string;
  status: 'success' | 'blocked_by_policy' | 'mfa_challenged';
}

export interface PaymentTrustControl {
  id: string;
  rail: 'SEPA' | 'CRYPTO_BTC' | 'CRYPTO_ETH' | 'CRYPTO_USDT' | 'STRIPE_SCA';
  controlName: string;
  description: string;
  fraudSignal: string;
  reconciliationCadence: string;
  status: 'active' | 'monitoring';
}

export interface BusinessContinuityRunbook {
  id: string;
  scenario: string;
  trigger: string;
  rtoMinutes: number;
  owner: string;
  escalation: string[];
  steps: string[];
}

export interface SocShiftRole {
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'CISO on-call';
  coverage: string;
  headcount: number;
  responsibilities: string[];
  mttdMinutes: number;
  mttrMinutes: number;
}

export interface GovernanceBoard {
  board: 'Security Committee' | 'Compliance Committee' | 'AI Governance Board' | 'Change Advisory Board';
  chair: string;
  cadence: string;
  quorum: string;
  approvalAuthority: string[];
  evidenceRequired: string[];
}

export interface EncryptionControl {
  domain: 'PostgreSQL' | 'Redis' | 'Object Storage' | 'Backups' | 'TLS in transit' | 'Internal mTLS';
  algorithm: string;
  keyManager: string;
  rotation: string;
  residency: string;
}

export interface Phase11VerificationItem {
  subsystem: string;
  requirement: string;
  evidence: string;
  status: 'Complete & Verified';
}

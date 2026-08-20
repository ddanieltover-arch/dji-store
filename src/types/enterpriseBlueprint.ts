export interface PhaseRecord {
  id: string;
  name: string;
  scope: string;
  deliverables: string;
  components: string;
  dependencies: string;
  status: 'Complete & Verified';
}

export interface DbInventoryRow {
  object: string;
  kind: 'table' | 'view' | 'function' | 'policy' | 'trigger' | 'queue' | 'stream';
  owner: string;
  rls: boolean;
  classification: string;
  retention: string;
}

export interface ServiceRegistryRow {
  name: string;
  surface: 'public' | 'internal' | 'admin' | 'webhook' | 'event' | 'cron';
  auth: string;
  rateLimit: string;
  owner: string;
  sla: string;
}

export interface RoadmapVersion {
  version: string;
  theme: string;
  items: string[];
}

export interface CertificationScores {
  completionPct: number;
  architectureMaturity: number;
  operationalReadiness: number;
  securityMaturity: number;
  reliabilityMaturity: number;
  launchReadiness: number;
}

export type MigrationDisposition = 'KEEP' | 'ADAPT' | 'REWRITE' | 'DEPRECATE';

export type MigrationDomain =
  | 'pages'
  | 'components'
  | 'hooks'
  | 'state'
  | 'services'
  | 'api'
  | 'supabase'
  | 'ops'
  | 'pwa'
  | 'analytics'
  | 'notifications';

export type DataMode = 'prototype' | 'migration' | 'production';

export type EnvironmentName = 'development' | 'qa' | 'staging' | 'preproduction' | 'production';

export interface MigrationInventoryItem {
  id: string;
  domain: MigrationDomain;
  vitePath: string;
  nextPath: string;
  disposition: MigrationDisposition;
  notes: string;
  critical: boolean;
  migrated: boolean;
}

export interface ProductionRouteSpec {
  path: string;
  localeAware: boolean;
  implemented: boolean;
  dataSource: 'supabase' | 'edge' | 'static' | 'api';
}

export interface EnvVarSpec {
  key: string;
  environments: EnvironmentName[];
  browserExposed: boolean;
  requiredInProduction: boolean;
  description: string;
}

export interface ConnectivityCheck {
  id: string;
  system: string;
  status: 'connected' | 'contract_verified' | 'pending_credentials' | 'failed';
  evidence: string;
  usesMockInProduction: false;
}

export interface ReconciliationRow {
  entity: string;
  prototypeCount: number;
  productionContractCount: number;
  matched: number;
  gaps: string[];
  ok: boolean;
}

export interface Wave12GateScores {
  productionRouteCoveragePct: number;
  realCatalogIntegrationPct: number;
  realInventoryIntegrationPct: number;
  commerceIntegrationPct: number;
  pimIntegrationPct: number;
  authenticationIntegrationPct: number;
  securityRegression: 'Pass' | 'Fail';
  performanceRegression: 'Pass' | 'Fail';
  automatedTestsPct: number;
  criticalDefects: number;
}

export interface Wave12Certification extends Wave12GateScores {
  mockCatalogInProduction: number;
  mockInventoryInProduction: number;
  liveSupabaseConnected: boolean;
  rollbackPathVerified: boolean;
  certified: boolean;
  certificationNote: string;
}

export interface Wave12MigrationBundle {
  inventory: MigrationInventoryItem[];
  routes: ProductionRouteSpec[];
  envVars: EnvVarSpec[];
  connectivity: ConnectivityCheck[];
  reconciliation: ReconciliationRow[];
  dispositions: Record<MigrationDisposition, number>;
  criticalMigratedPct: number;
  gates: Wave12GateScores;
  certification: Wave12Certification;
  nextjsRoot: string;
  viteRemainsAsReference: true;
}

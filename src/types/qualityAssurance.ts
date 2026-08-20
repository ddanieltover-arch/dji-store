// Phase 13 — Quality Assurance, Testing & Release Engineering

export type DefectSeverity = 'sev1' | 'sev2' | 'sev3' | 'sev4';
export type GateResult = 'pass' | 'fail' | 'waived';
export type TestLayer = 'unit' | 'integration' | 'e2e' | 'contract' | 'component' | 'visual';

export interface DefectSeverityRule {
  severity: DefectSeverity;
  name: string;
  slaHours: number;
  launchBlocker: boolean;
  examples: string[];
}

export interface QualityGate {
  id: string;
  name: string;
  owner: string;
  criterion: string;
  result: GateResult;
  evidence: string;
}

export interface TestSuiteStat {
  layer: TestLayer;
  tool: string;
  suites: number;
  cases: number;
  coveragePct: number;
  lastRun: string;
  status: 'green' | 'flaky' | 'red';
}

export interface ReleaseSignoff {
  role: string;
  person: string;
  decision: 'go' | 'no-go' | 'pending';
  notes: string;
}

export interface Phase13VerificationItem {
  subsystem: string;
  requirement: string;
  evidence: string;
  status: 'Complete & Verified';
}

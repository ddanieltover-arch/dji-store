export type EnvName = 'development' | 'qa' | 'staging' | 'preprod' | 'production';
export type CutoverMilestone =
  | 'T-30d'
  | 'T-14d'
  | 'T-7d'
  | 'T-48h'
  | 'T-24h'
  | 'T-4h'
  | 'T0'
  | 'T+24h'
  | 'T+7d';
export type SignoffDecision = 'go' | 'no-go' | 'conditional';

export interface EnvironmentLane {
  name: EnvName;
  url: string;
  dataClass: string;
  promoters: string[];
  requiredApprovals: string[];
}

export interface CutoverActivity {
  milestone: CutoverMilestone;
  activity: string;
  owner: string;
  dependsOn: string;
  checkpoint: string;
  status: 'done' | 'in_progress' | 'scheduled';
}

export interface LaunchSignoff {
  function: string;
  approver: string;
  scorePct: number;
  decision: SignoffDecision;
  conditions: string;
}

export interface VendorReadiness {
  vendor: string;
  contact: string;
  status: 'ready' | 'standby';
  notes: string;
}

export interface Phase14VerificationItem {
  subsystem: string;
  requirement: string;
  evidence: string;
  status: 'Complete & Verified';
}

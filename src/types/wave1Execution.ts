export type Wave1QueueTopic =
  | 'discovery'
  | 'extract'
  | 'normalize'
  | 'media'
  | 'firmware'
  | 'seo'
  | 'inventory'
  | 'health';

export interface Wave1QueueJob {
  id: string;
  topic: Wave1QueueTopic;
  payload: Record<string, string>;
  attempts: number;
  maxAttempts: number;
  dlq: boolean;
  checkpoint: string;
}

export interface Wave1HealthReport {
  skuCount: number;
  variantCount: number;
  inventoryCoveragePct: number;
  seoLocaleCoveragePct: number;
  mediaCoveragePct: number;
  firmwareCoveragePct: number;
  catalogHealth: number;
  certified: boolean;
}

export interface Wave1RolloutStep {
  id: string;
  window: string;
  action: string;
  owner: string;
  gate: string;
}

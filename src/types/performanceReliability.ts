// Phase 12 — Performance, Scalability & Enterprise Reliability

export type SloStatus = 'healthy' | 'at_risk' | 'breached';

export interface CoreWebVitalBudget {
  surface: 'homepage' | 'plp' | 'pdp' | 'checkout' | 'account';
  lcpMs: number;
  inpMs: number;
  cls: number;
  ttfbMs: number;
  targetLcpMs: number;
  targetInpMs: number;
  targetCls: number;
  targetTtfbMs: number;
  renderingStrategy: string;
}

export interface EdgePoP {
  id: string;
  city: string;
  provider: 'Cloudflare' | 'Vercel Edge';
  role: 'anycast_ingress' | 'origin_shield' | 'compute_edge' | 'failover_origin';
  cacheHitRatio: number;
  ttfbP95Ms: number;
  status: 'healthy' | 'degraded';
}

export interface CacheLayer {
  layer: string;
  store: string;
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
  invalidation: string;
  hitRatioPct: number;
}

export interface PostgresScalePlan {
  object: string;
  strategy: string;
  indexOrPartition: string;
  p95Ms: number;
  targetP95Ms: number;
}

export interface KafkaTopicContract {
  topic: string;
  key: string;
  payload: string;
  partitions: number;
  retentionHours: number;
  retryPolicy: string;
  dlq: string;
}

export interface SloDefinition {
  name: string;
  sli: string;
  slo: string;
  current: string;
  errorBudgetRemainingPct: number;
  status: SloStatus;
}

export interface LoadProfile {
  scenario: string;
  concurrentUsers: number;
  rps: number;
  checkoutSharePct: number;
  searchSharePct: number;
  originCpuPct: number;
  edgeOffloadPct: number;
}

export interface MediaPipelineStep {
  assetClass: string;
  ingest: string;
  output: string;
  maxBytes: string;
  cdnPath: string;
}

export interface CostForecastRow {
  category: string;
  monthlyEur: number;
  driver: string;
  optimization: string;
  savingsPct: number;
}

export interface Phase12VerificationItem {
  subsystem: string;
  requirement: string;
  evidence: string;
  status: 'Complete & Verified';
}

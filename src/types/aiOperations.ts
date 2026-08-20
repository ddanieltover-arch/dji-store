import { CurrencyCode, Product } from './index';

// ---------------------------------------------------------------------------
// 1. EXECUTIVE COMMAND CENTER & REAL-TIME METRICS
// ---------------------------------------------------------------------------
export interface ExecutiveKpiSummary {
  revenueTodayEur: number;
  revenueTodayChangePct: number;
  revenueMtdEur: number;
  revenueMtdTargetEur: number;
  revenueMtdChangePct: number;
  revenueYtdEur: number;
  revenueYtdTargetEur: number;
  ordersTodayCount: number;
  ordersTodayChangePct: number;
  conversionRatePct: number;
  conversionRateChangePct: number;
  averageOrderValueEur: number;
  aovChangePct: number;
  grossMarginPct: number;
  netMarginPct: number;
  refundRatePct: number;
  chargebackRatePct: number;
  activePilotsOnline: number;
  aiAutonomyRatePct: number; // % of decisions executed autonomously without human intervention
}

export interface LiveActivityFeedItem {
  id: string;
  timestamp: string;
  type: 'order' | 'inventory_alert' | 'logistics_pulse' | 'ai_decision' | 'fraud_alert' | 'price_update';
  title: string;
  description: string;
  severity?: 'info' | 'success' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

export interface CountryPerformanceMetric {
  countryCode: string;
  countryName: string;
  revenueEur: number;
  orderCount: number;
  aovEur: number;
  growthPct: number;
  topProduct: string;
  flag: string;
}

export interface PaymentMethodBreakdown {
  method: string;
  channel: 'sepa' | 'crypto_usdt' | 'crypto_btc' | 'crypto_eth' | 'b2b_credit';
  volumeEur: number;
  percentage: number;
  settlementTimeAvg: string;
  failureRatePct: number;
  feeSavedVsCreditCardEur: number;
}

// ---------------------------------------------------------------------------
// 2. PREDICTIVE REVENUE FORECASTING ENGINE
// ---------------------------------------------------------------------------
export interface ForecastTimePoint {
  date: string;
  actualRevenueEur?: number;
  forecastBaselineEur: number;
  forecastUpper95Eur: number;
  forecastLower95Eur: number;
  scenarioConservativeEur?: number;
  scenarioAggressiveEur?: number;
  seasonalFactor: number;
  events?: string[];
}

export interface RevenueForecastModel {
  horizon: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  generatedAt: string;
  confidenceScore: number;
  projectedTotalEur: number;
  expectedGrowthPct: number;
  keyDrivers: string[];
  riskFactors: string[];
  points: ForecastTimePoint[];
}

// ---------------------------------------------------------------------------
// 3. INVENTORY PREDICTION & AUTONOMOUS REPLENISHMENT
// ---------------------------------------------------------------------------
export interface InventoryDepotRisk {
  sku: string;
  productName: string;
  depotCode: string; // FRA-01, AMS-02, WAW-03, MAD-04, MXP-05
  depotCity: string;
  currentStock: number;
  dailyBurnRate: number;
  predictedDaysUntilStockout: number;
  safetyStockThreshold: number;
  reorderPoint: number;
  recommendedOrderQuantity: number;
  estimatedLeadTimeDays: number;
  riskLevel: 'healthy' | 'monitor' | 'warning' | 'critical_stockout' | 'overstock';
  actionStatus: 'pending_approval' | 'auto_dispatched' | 'in_transit' | 'resolved';
}

export interface DepotRebalancingPlan {
  id: string;
  sourceDepot: string;
  targetDepot: string;
  sku: string;
  productName: string;
  transferQuantity: number;
  estimatedCostEur: number;
  transitDays: number;
  urgency: 'routine' | 'high' | 'critical';
  reason: string;
  status: 'recommended' | 'approved' | 'in_transit' | 'completed';
}

export interface AutonomousPurchaseOrder {
  id: string;
  supplierName: string;
  targetWarehouse: string;
  skuList: { sku: string; name: string; quantity: number; unitCostEur: number; totalCostEur: number }[];
  totalAmountEur: number;
  createdReason: string;
  projectedDeliveryDate: string;
  approvalStatus: 'auto_approved' | 'requires_ceo_approval' | 'approved' | 'rejected';
  riskScore: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// 4. AUTONOMOUS MERCHANDISING & RANKING ENGINE
// ---------------------------------------------------------------------------
export interface MerchandisingScore {
  productId: string;
  productName: string;
  currentPosition: number;
  recommendedPosition: number;
  velocityScore: number; // 0-100
  marginContributionScore: number; // 0-100
  inventoryHealthScore: number; // 0-100
  searchTrendMultiplier: number;
  compositeRankScore: number;
  recommendedAction: 'boost_hero' | 'maintain' | 'promote_accessories' | 'bundle_discount';
}

export interface DynamicAccessoryBundle {
  id: string;
  title: string;
  parentProductId: string;
  parentProductName: string;
  bundledProducts: { productId: string; name: string; priceEur: number }[];
  totalRegularPriceEur: number;
  bundlePriceEur: number;
  discountEur: number;
  marginPreservedPct: number;
  projectedAovUpliftPct: number;
  status: 'active' | 'testing' | 'archived';
}

export interface MerchandisingExperiment {
  id: string;
  name: string;
  variantA: string;
  variantB: string;
  trafficSplitPct: number;
  status: 'running' | 'stat_sig_reached' | 'concluded';
  conversionLiftPct: number;
  revenueLiftEur: number;
  confidencePct: number;
}

// ---------------------------------------------------------------------------
// 5. AI PRICING INTELLIGENCE & ELASTICITY
// ---------------------------------------------------------------------------
export interface CompetitorPriceRecord {
  competitorName: string; // Fnac France, MediaMarkt DE, Digitec CH, Amazon DE, Coolblue NL
  sku: string;
  productName: string;
  scrapedPriceEur: number;
  scrapedAt: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited';
  shippingCostEur: number;
  priceDeltaEur: number; // Our price - Competitor price
  deltaPct: number;
}

export interface DynamicPricingRecommendation {
  id: string;
  sku: string;
  productName: string;
  currentPriceEur: number;
  suggestedPriceEur: number;
  minPriceFloorEur: number; // strict margin guardrail
  maxPriceCeilingEur: number;
  targetGrossMarginPct: number;
  elasticityIndex: number; // -1.2 means 10% price decrease -> 12% demand increase
  expectedVolumeChangePct: number;
  expectedRevenueImpactEur: number;
  rationale: string;
  competitorBenchmark: CompetitorPriceRecord[];
  requiresApproval: boolean;
  status: 'pending' | 'applied' | 'rejected' | 'rolled_back';
}

// ---------------------------------------------------------------------------
// 6. CUSTOMER INTELLIGENCE & CHURN PREDICTION
// ---------------------------------------------------------------------------
export interface CustomerSegmentInsight {
  segmentKey: 'first_time_pilots' | 'enthusiast_creators' | 'commercial_pros' | 'enterprise_fleets' | 'high_value_vips' | 'churn_risk';
  segmentName: string;
  customerCount: number;
  avgLtvEur: number;
  totalRevenueContributionEur: number;
  churnRatePct: number;
  topCategory: string;
  recommendedPlaybook: string;
}

export interface ChurnRiskProfile {
  customerId: string;
  customerName: string;
  email: string;
  companyName?: string;
  lifetimeValueEur: number;
  lastOrderDate: string;
  daysInactive: number;
  churnProbabilityPct: number; // 0-100
  primaryRiskFactor: string;
  suggestedAction: string;
  automatedCampaignTriggered: boolean;
}

// ---------------------------------------------------------------------------
// 7. REVIEW INTELLIGENCE & SENTIMENT NLP
// ---------------------------------------------------------------------------
export interface SentimentCluster {
  id: string;
  category: 'firmware_performance' | 'battery_cold_weather' | 'gimbal_smoothness' | 'delivery_speed' | 'easa_compliance' | 'pricing_value';
  label: string;
  sentimentScore: number; // -1.0 to +1.0
  reviewCount: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  sampleQuotes: string[];
  detectedIssues: string[];
  engineeringEscalated: boolean;
}

// ---------------------------------------------------------------------------
// 8. AUTONOMOUS COMMERCE AGENTS & MULTI-AGENT ORCHESTRATION
// ---------------------------------------------------------------------------
export type AgentRole =
  | 'executive_insights'
  | 'inventory_replenisher'
  | 'merchandising_optimizer'
  | 'pricing_strategist'
  | 'logistics_sentinel'
  | 'customer_support_copilot'
  | 'fraud_risk_analyst'
  | 'search_optimizer';

export interface AgentLogTrace {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  agentName: string;
  action: string;
  reasoning: string;
  confidenceScore: number;
  status: 'executing' | 'completed' | 'awaiting_human_approval' | 'error';
  impactSummary: string;
}

export interface CommerceAgentDefinition {
  role: AgentRole;
  name: string;
  callsign: string;
  avatarIcon: string;
  description: string;
  status: 'active' | 'standby' | 'processing';
  autonomyLevel: 'fully_autonomous' | 'semi_autonomous' | 'read_only';
  tasksCompleted24h: number;
  avgLatencyMs: number;
  successRatePct: number;
  currentGoal: string;
}

// ---------------------------------------------------------------------------
// 9. LOGISTICS INTELLIGENCE & COURIER SLA
// ---------------------------------------------------------------------------
export interface CourierSlaPerformance {
  courierCode: 'dhl_express' | 'dpd_europe' | 'ups_saver';
  courierName: string;
  activeShipmentsCount: number;
  onTimeDeliveryRatePct: number;
  avgTransitHours: number;
  customsClearanceAvgHours: number;
  activeDelayedCount: number;
  incidentHotspots: string[];
  reliabilityScore: number; // 0-100
}

export interface LogisticsBottleneckAlert {
  id: string;
  route: string; // e.g. Frankfurt -> Madrid Express Corridor
  affectedShipmentCount: number;
  delayHoursAvg: number;
  rootCause: string;
  suggestedMitigation: string;
  rerouteWarehouse?: string;
  status: 'active' | 'mitigating' | 'resolved';
}

// ---------------------------------------------------------------------------
// 10. SEARCH INTELLIGENCE & SYNONYM GENERATION
// ---------------------------------------------------------------------------
export interface SearchQueryInsight {
  query: string;
  searchVolume30d: number;
  zeroResultRatePct: number;
  clickThroughRatePct: number;
  conversionRatePct: number;
  suggestedSynonymAction?: string;
  autoGeneratedSynonym?: string;
  status: 'optimized' | 'needs_synonym' | 'typo_detected';
}

// ---------------------------------------------------------------------------
// 11. FRAUD DETECTION & TRANSACTION RISK
// ---------------------------------------------------------------------------
export interface FraudRiskAssessment {
  id: string;
  orderNumber: string;
  customerName: string;
  totalEur: number;
  paymentMethod: string;
  ipLocation: string;
  riskScore: number; // 0-100 (0-30 low, 31-70 review, 71-100 block)
  riskFactors: string[];
  cryptoTaintScore?: number; // 0-100
  deviceFingerprintRisk: 'clean' | 'vpn_detected' | 'tor_node' | 'geo_mismatch';
  status: 'cleared_auto' | 'held_for_investigation' | 'rejected_fraud' | 'force_approved_by_admin';
  evaluatedAt: string;
}

// ---------------------------------------------------------------------------
// 12. CLICKHOUSE & BI ANALYTICS QUERIES
// ---------------------------------------------------------------------------
export interface BiAnalyticsQuery {
  id: string;
  name: string;
  category: 'revenue_retention' | 'depot_velocity' | 'margin_contribution' | 'payment_economics' | 'customer_cohorts';
  description: string;
  sqlQuery: string;
  executionTimeMs: number;
  recordsReturned: number;
  columns: string[];
  rows: (string | number)[][];
}

// ---------------------------------------------------------------------------
// 13. ANOMALY DETECTION & REAL-TIME ALERTS
// ---------------------------------------------------------------------------
export interface OperationalAnomalyAlert {
  id: string;
  timestamp: string;
  metric: string;
  expectedValue: string;
  observedValue: string;
  deviationPct: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCauseAnalysis: string;
  aiSuggestedFix: string;
  status: 'active' | 'investigating' | 'resolved';
}

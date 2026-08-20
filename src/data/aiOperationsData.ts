import {
  ExecutiveKpiSummary,
  LiveActivityFeedItem,
  CountryPerformanceMetric,
  PaymentMethodBreakdown,
  RevenueForecastModel,
  InventoryDepotRisk,
  DepotRebalancingPlan,
  AutonomousPurchaseOrder,
  MerchandisingScore,
  DynamicAccessoryBundle,
  MerchandisingExperiment,
  DynamicPricingRecommendation,
  CompetitorPriceRecord,
  CustomerSegmentInsight,
  ChurnRiskProfile,
  SentimentCluster,
  CommerceAgentDefinition,
  AgentLogTrace,
  CourierSlaPerformance,
  LogisticsBottleneckAlert,
  SearchQueryInsight,
  FraudRiskAssessment,
  BiAnalyticsQuery,
  OperationalAnomalyAlert
} from '../types/aiOperations';

// ---------------------------------------------------------------------------
// 1. EXECUTIVE KPI SUMMARY & LIVE TELEMETRY
// ---------------------------------------------------------------------------
export const INITIAL_EXECUTIVE_KPIS: ExecutiveKpiSummary = {
  revenueTodayEur: 148920,
  revenueTodayChangePct: 18.4,
  revenueMtdEur: 3842100,
  revenueMtdTargetEur: 4200000,
  revenueMtdChangePct: 22.1,
  revenueYtdEur: 28940500,
  revenueYtdTargetEur: 32000000,
  ordersTodayCount: 142,
  ordersTodayChangePct: 14.8,
  conversionRatePct: 3.84,
  conversionRateChangePct: 0.42,
  averageOrderValueEur: 1048.73,
  aovChangePct: 3.2,
  grossMarginPct: 34.2,
  netMarginPct: 21.6,
  refundRatePct: 0.84,
  chargebackRatePct: 0.01,
  activePilotsOnline: 1248,
  aiAutonomyRatePct: 91.4
};

export const INITIAL_LIVE_ACTIVITY_FEED: LiveActivityFeedItem[] = [
  {
    id: 'act-001',
    timestamp: 'Just now',
    type: 'ai_decision',
    title: 'Autonomous Price Optimization Deployed',
    description: 'Adjusted Mavic 4 Pro Fly More Combo price by -€20 to match MediaMarkt DE flash campaign while preserving 24.8% net margin.',
    severity: 'info'
  },
  {
    id: 'act-002',
    timestamp: '2 mins ago',
    type: 'order',
    title: 'High-Value Enterprise Order Placed',
    description: 'Order #DJI-EU-948122 (€18,420 - 4x Matrice 350 RTK + Zenmuse L2) confirmed via SEPA Direct Wire from Nordic Aerial Tech AB.',
    severity: 'success'
  },
  {
    id: 'act-003',
    timestamp: '5 mins ago',
    type: 'inventory_alert',
    title: 'Depot Rebalance Triggered: AMS-02 -> MAD-04',
    description: 'Dispatched 45x Mini 4 Pro Intelligent Flight Batteries from Amsterdam to Madrid to prevent forecasted weekend stockout.',
    severity: 'warning'
  },
  {
    id: 'act-004',
    timestamp: '11 mins ago',
    type: 'logistics_pulse',
    title: 'DHL Express Flight Hub Clearance Complete',
    description: '98 European parcels cleared customs at Frankfurt Airport Hub (FRA-01); on-time delivery metric at 99.2%.',
    severity: 'success'
  },
  {
    id: 'act-005',
    timestamp: '18 mins ago',
    type: 'fraud_alert',
    title: 'High-Risk Crypto Order Auto-Quarantined',
    description: 'USDT payment flagged for TOR exit node IP mismatch and high transaction velocity. Assigned to Risk Desk.',
    severity: 'critical'
  }
];

export const INITIAL_TOP_COUNTRIES: CountryPerformanceMetric[] = [
  {
    countryCode: 'DE',
    countryName: 'Germany',
    revenueEur: 10420000,
    orderCount: 8940,
    aovEur: 1165.54,
    growthPct: 24.6,
    topProduct: 'DJI Mavic 4 Pro Creator Combo',
    flag: '🇩🇪'
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    revenueEur: 6120000,
    orderCount: 5640,
    aovEur: 1085.1,
    growthPct: 19.8,
    topProduct: 'DJI Mini 4 Pro (C0 EASA)',
    flag: '🇫🇷'
  },
  {
    countryCode: 'NL',
    countryName: 'Netherlands',
    revenueEur: 3890000,
    orderCount: 3210,
    aovEur: 1211.83,
    growthPct: 31.2,
    topProduct: 'DJI Avata 2 FPV Explorer',
    flag: '🇳🇱'
  },
  {
    countryCode: 'ES',
    countryName: 'Spain',
    revenueEur: 2940000,
    orderCount: 3010,
    aovEur: 976.74,
    growthPct: 17.5,
    topProduct: 'DJI Osmo Pocket 3 Creator',
    flag: '🇪🇸'
  },
  {
    countryCode: 'IT',
    countryName: 'Italy',
    revenueEur: 2680000,
    orderCount: 2840,
    aovEur: 943.66,
    growthPct: 15.3,
    topProduct: 'DJI Air 3 Fly More Combo',
    flag: '🇮🇹'
  },
  {
    countryCode: 'SE',
    countryName: 'Sweden & Nordics',
    revenueEur: 2190000,
    orderCount: 1680,
    aovEur: 1303.57,
    growthPct: 28.4,
    topProduct: 'DJI Matrice 350 RTK Enterprise',
    flag: '🇸🇪'
  }
];

export const INITIAL_PAYMENT_BREAKDOWN: PaymentMethodBreakdown[] = [
  {
    method: 'SEPA Direct Wire (Deutsche Bank AG)',
    channel: 'sepa',
    volumeEur: 18420000,
    percentage: 63.6,
    settlementTimeAvg: '2.4 hours',
    failureRatePct: 0.12,
    feeSavedVsCreditCardEur: 534180
  },
  {
    method: 'Tether USDT (TRC-20 & ERC-20)',
    channel: 'crypto_usdt',
    volumeEur: 5680000,
    percentage: 19.6,
    settlementTimeAvg: '4.8 mins',
    failureRatePct: 0.05,
    feeSavedVsCreditCardEur: 164720
  },
  {
    method: 'Bitcoin (BTC On-Chain & Lightning)',
    channel: 'crypto_btc',
    volumeEur: 2840000,
    percentage: 9.8,
    settlementTimeAvg: '18.2 mins',
    failureRatePct: 0.02,
    feeSavedVsCreditCardEur: 82360
  },
  {
    method: 'Ethereum (ETH Settlement)',
    channel: 'crypto_eth',
    volumeEur: 1420000,
    percentage: 4.9,
    settlementTimeAvg: '6.1 mins',
    failureRatePct: 0.04,
    feeSavedVsCreditCardEur: 41180
  },
  {
    method: 'B2B Enterprise Net-30 Invoicing',
    channel: 'b2b_credit',
    volumeEur: 580500,
    percentage: 2.1,
    settlementTimeAvg: '14.2 days',
    failureRatePct: 0.0,
    feeSavedVsCreditCardEur: 16830
  }
];

// ---------------------------------------------------------------------------
// 2. PREDICTIVE REVENUE FORECASTING MODELS
// ---------------------------------------------------------------------------
export const PREDICTIVE_REVENUE_MODELS: Record<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly', RevenueForecastModel> = {
  daily: {
    horizon: 'daily',
    generatedAt: 'Today, 06:00 CET via Gemini AI Enterprise Forecast Engine',
    confidenceScore: 0.94,
    projectedTotalEur: 154200,
    expectedGrowthPct: 16.2,
    keyDrivers: [
      'Good flying weather in Central & Southern Europe (Germany, France, Spain)',
      'Mid-month B2B cinematic equipment purchase orders',
      'Positive reception of Mavic 4 Pro firmware update 02.04'
    ],
    riskFactors: [
      'High wind forecast in North Sea coastal regions (minor flight restriction)',
      'Temporary customs inspection delay at Warsaw depot'
    ],
    points: [
      { date: '06:00', actualRevenueEur: 18200, forecastBaselineEur: 16500, forecastUpper95Eur: 19800, forecastLower95Eur: 14200, seasonalFactor: 0.82 },
      { date: '09:00', actualRevenueEur: 46800, forecastBaselineEur: 44200, forecastUpper95Eur: 51000, forecastLower95Eur: 39000, seasonalFactor: 1.15 },
      { date: '12:00', actualRevenueEur: 88400, forecastBaselineEur: 84900, forecastUpper95Eur: 96000, forecastLower95Eur: 76000, seasonalFactor: 1.34 },
      { date: '15:00', actualRevenueEur: 124900, forecastBaselineEur: 119800, forecastUpper95Eur: 134000, forecastLower95Eur: 108000, seasonalFactor: 1.42 },
      { date: '18:00', forecastBaselineEur: 142000, forecastUpper95Eur: 158000, forecastLower95Eur: 128000, seasonalFactor: 1.28 },
      { date: '21:00', forecastBaselineEur: 151500, forecastUpper95Eur: 168000, forecastLower95Eur: 138000, seasonalFactor: 0.95 },
      { date: '24:00', forecastBaselineEur: 154200, forecastUpper95Eur: 172000, forecastLower95Eur: 141000, seasonalFactor: 0.62 }
    ]
  },
  weekly: {
    horizon: 'weekly',
    generatedAt: 'This Week (Mon-Sun) Forecast',
    confidenceScore: 0.92,
    projectedTotalEur: 1140000,
    expectedGrowthPct: 18.5,
    keyDrivers: [
      'European Spring outdoor cinematography surge',
      'Special B2B drone pilot academy bulk voucher redemption',
      'Payday shopping spike across DACH & France'
    ],
    riskFactors: ['Potential logistics strike in Milan regional hub'],
    points: [
      { date: 'Mon', actualRevenueEur: 152000, forecastBaselineEur: 148000, forecastUpper95Eur: 164000, forecastLower95Eur: 134000, seasonalFactor: 0.95 },
      { date: 'Tue', actualRevenueEur: 168400, forecastBaselineEur: 162000, forecastUpper95Eur: 178000, forecastLower95Eur: 148000, seasonalFactor: 1.05 },
      { date: 'Wed', actualRevenueEur: 174900, forecastBaselineEur: 170000, forecastUpper95Eur: 189000, forecastLower95Eur: 154000, seasonalFactor: 1.10 },
      { date: 'Thu', forecastBaselineEur: 165000, forecastUpper95Eur: 182000, forecastLower95Eur: 149000, seasonalFactor: 1.02 },
      { date: 'Fri', forecastBaselineEur: 188000, forecastUpper95Eur: 210000, forecastLower95Eur: 168000, seasonalFactor: 1.25 },
      { date: 'Sat', forecastBaselineEur: 154000, forecastUpper95Eur: 174000, forecastLower95Eur: 136000, seasonalFactor: 0.98 },
      { date: 'Sun', forecastBaselineEur: 147000, forecastUpper95Eur: 166000, forecastLower95Eur: 130000, seasonalFactor: 0.92 }
    ]
  },
  monthly: {
    horizon: 'monthly',
    generatedAt: 'Current Month Forecast',
    confidenceScore: 0.89,
    projectedTotalEur: 4680000,
    expectedGrowthPct: 24.2,
    keyDrivers: [
      'Seasonal European wedding & commercial filming boom',
      'High conversion on trade-in upgrade campaign',
      'EASA Open Category C0/C1 certification awareness campaigns'
    ],
    riskFactors: ['OEM component supply allocation from Shenzhen HQ'],
    points: [
      { date: 'Week 1', actualRevenueEur: 1040000, forecastBaselineEur: 980000, forecastUpper95Eur: 1120000, forecastLower95Eur: 870000, seasonalFactor: 1.05 },
      { date: 'Week 2', actualRevenueEur: 1180000, forecastBaselineEur: 1120000, forecastUpper95Eur: 1260000, forecastLower95Eur: 990000, seasonalFactor: 1.18 },
      { date: 'Week 3', forecastBaselineEur: 1240000, forecastUpper95Eur: 1390000, forecastLower95Eur: 1090000, seasonalFactor: 1.24 },
      { date: 'Week 4', forecastBaselineEur: 1340000, forecastUpper95Eur: 1520000, forecastLower95Eur: 1180000, seasonalFactor: 1.32 }
    ]
  },
  quarterly: {
    horizon: 'quarterly',
    generatedAt: 'Q3 2026 European Forecast',
    confidenceScore: 0.86,
    projectedTotalEur: 14850000,
    expectedGrowthPct: 28.1,
    keyDrivers: [
      'Summer European holiday tourism flight sales',
      'Autumn harvest agricultural mapping drone demand',
      'New Enterprise thermal payload launch'
    ],
    riskFactors: ['Foreign currency exchange fluctuations (EUR/USD, EUR/CNY)'],
    points: [
      { date: 'Jul', actualRevenueEur: 4200000, forecastBaselineEur: 4100000, forecastUpper95Eur: 4500000, forecastLower95Eur: 3750000, seasonalFactor: 1.28 },
      { date: 'Aug', forecastBaselineEur: 4850000, forecastUpper95Eur: 5350000, forecastLower95Eur: 4350000, seasonalFactor: 1.44 },
      { date: 'Sep', forecastBaselineEur: 5800000, forecastUpper95Eur: 6450000, forecastLower95Eur: 5200000, seasonalFactor: 1.62 }
    ]
  },
  yearly: {
    horizon: 'yearly',
    generatedAt: 'Full Year 2026 Strategic Forecast',
    confidenceScore: 0.83,
    projectedTotalEur: 56400000,
    expectedGrowthPct: 34.5,
    keyDrivers: [
      'Black Friday & Cyber Week record volume across Europe',
      'Full deployment of next-gen 8K sensor drones',
      'Enterprise B2B fleet contracts expansion in renewable energy & inspection'
    ],
    riskFactors: ['Global microchip freight tariffs', 'New EU flight regulation adjustments'],
    points: [
      { date: 'Q1', actualRevenueEur: 11200000, forecastBaselineEur: 10800000, forecastUpper95Eur: 12000000, forecastLower95Eur: 9800000, seasonalFactor: 0.88 },
      { date: 'Q2', actualRevenueEur: 14100000, forecastBaselineEur: 13600000, forecastUpper95Eur: 15200000, forecastLower95Eur: 12200000, seasonalFactor: 1.15 },
      { date: 'Q3', forecastBaselineEur: 14850000, forecastUpper95Eur: 16500000, forecastLower95Eur: 13400000, seasonalFactor: 1.25 },
      { date: 'Q4', forecastBaselineEur: 16250000, forecastUpper95Eur: 18400000, forecastLower95Eur: 14600000, seasonalFactor: 1.55 }
    ]
  }
};

// ---------------------------------------------------------------------------
// 3. INVENTORY PREDICTION & AUTONOMOUS REPLENISHMENT DATA
// ---------------------------------------------------------------------------
export const INITIAL_INVENTORY_DEPOT_RISKS: InventoryDepotRisk[] = [
  {
    sku: 'DJI-M4P-CREATOR',
    productName: 'DJI Mavic 4 Pro Creator Combo',
    depotCode: 'MAD-04',
    depotCity: 'Madrid Depot (ES/PT Hub)',
    currentStock: 14,
    dailyBurnRate: 4.8,
    predictedDaysUntilStockout: 2.9,
    safetyStockThreshold: 25,
    reorderPoint: 35,
    recommendedOrderQuantity: 80,
    estimatedLeadTimeDays: 2,
    riskLevel: 'critical_stockout',
    actionStatus: 'pending_approval'
  },
  {
    sku: 'DJI-BAT-M4P',
    productName: 'Mavic 4 Pro Intelligent Flight Battery',
    depotCode: 'FRA-01',
    depotCity: 'Frankfurt Central Hub (DE)',
    currentStock: 82,
    dailyBurnRate: 18.5,
    predictedDaysUntilStockout: 4.4,
    safetyStockThreshold: 60,
    reorderPoint: 120,
    recommendedOrderQuantity: 300,
    estimatedLeadTimeDays: 3,
    riskLevel: 'warning',
    actionStatus: 'auto_dispatched'
  },
  {
    sku: 'DJI-M350-RTK',
    productName: 'DJI Matrice 350 RTK Enterprise',
    depotCode: 'AMS-02',
    depotCity: 'Amsterdam Hub (NL/BE/Nordics)',
    currentStock: 19,
    dailyBurnRate: 1.2,
    predictedDaysUntilStockout: 15.8,
    safetyStockThreshold: 8,
    reorderPoint: 12,
    recommendedOrderQuantity: 20,
    estimatedLeadTimeDays: 5,
    riskLevel: 'healthy',
    actionStatus: 'resolved'
  },
  {
    sku: 'DJI-AVATA2-FPV',
    productName: 'DJI Avata 2 FPV Explorer Combo',
    depotCode: 'WAW-03',
    depotCity: 'Warsaw Hub (PL/CEE Hub)',
    currentStock: 6,
    dailyBurnRate: 3.1,
    predictedDaysUntilStockout: 1.9,
    safetyStockThreshold: 15,
    reorderPoint: 25,
    recommendedOrderQuantity: 50,
    estimatedLeadTimeDays: 2,
    riskLevel: 'critical_stockout',
    actionStatus: 'pending_approval'
  },
  {
    sku: 'DJI-POCK3-CREATOR',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    depotCode: 'MXP-05',
    depotCity: 'Milan Hub (IT/CH/SE Europe)',
    currentStock: 140,
    dailyBurnRate: 2.1,
    predictedDaysUntilStockout: 66.7,
    safetyStockThreshold: 30,
    reorderPoint: 45,
    recommendedOrderQuantity: 0,
    estimatedLeadTimeDays: 3,
    riskLevel: 'overstock',
    actionStatus: 'pending_approval'
  }
];

export const INITIAL_DEPOT_REBALANCING_PLANS: DepotRebalancingPlan[] = [
  {
    id: 'REBAL-2026-081',
    sourceDepot: 'AMS-02 (Amsterdam)',
    targetDepot: 'MAD-04 (Madrid)',
    sku: 'DJI-M4P-CREATOR',
    productName: 'DJI Mavic 4 Pro Creator Combo',
    transferQuantity: 40,
    estimatedCostEur: 380,
    transitDays: 1.5,
    urgency: 'critical',
    reason: 'Prevent impending stockout in Iberian Peninsula; Amsterdam holds 18 days excess stock.',
    status: 'recommended'
  },
  {
    id: 'REBAL-2026-082',
    sourceDepot: 'MXP-05 (Milan)',
    targetDepot: 'FRA-01 (Frankfurt)',
    sku: 'DJI-POCK3-CREATOR',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    transferQuantity: 65,
    estimatedCostEur: 290,
    transitDays: 1.0,
    urgency: 'high',
    reason: 'Rebalance Italian overstock to high-velocity DACH market before summer travel peak.',
    status: 'approved'
  }
];

export const INITIAL_AUTONOMOUS_PURCHASE_ORDERS: AutonomousPurchaseOrder[] = [
  {
    id: 'PO-AI-2026-904',
    supplierName: 'DJI Logistics Europe B.V. (Rotterdam Bonded)',
    targetWarehouse: 'Frankfurt Central Hub (FRA-01)',
    skuList: [
      { sku: 'DJI-BAT-M4P', name: 'Mavic 4 Pro Flight Battery', quantity: 500, unitCostEur: 110, totalCostEur: 55000 },
      { sku: 'DJI-M4P-PROP', name: 'Mavic 4 Pro Low-Noise Propellers (Pair)', quantity: 1200, unitCostEur: 9.5, totalCostEur: 11400 },
      { sku: 'DJI-CARE-M4P-2Y', name: 'DJI Care Refresh 2-Year Plan Code', quantity: 300, unitCostEur: 145, totalCostEur: 43500 }
    ],
    totalAmountEur: 109900,
    createdReason: 'Forecasted 28% demand surge across Central Europe based on seasonal flying conditions & campaign schedule.',
    projectedDeliveryDate: '2026-08-20',
    approvalStatus: 'requires_ceo_approval',
    riskScore: 12,
    createdAt: 'Today, 04:30 CET'
  },
  {
    id: 'PO-AI-2026-905',
    supplierName: 'DJI Authorized Distribution GmbH',
    targetWarehouse: 'Warsaw Hub (WAW-03)',
    skuList: [
      { sku: 'DJI-AVATA2-FPV', name: 'DJI Avata 2 FPV Explorer Combo', quantity: 100, unitCostEur: 690, totalCostEur: 69000 },
      { sku: 'DJI-GOGGLES3', name: 'DJI Goggles 3 Video Headset', quantity: 60, unitCostEur: 420, totalCostEur: 25200 }
    ],
    totalAmountEur: 94200,
    createdReason: 'Depot stock depletion risk identified; 1.9 days remaining inventory.',
    projectedDeliveryDate: '2026-08-18',
    approvalStatus: 'approved',
    riskScore: 8,
    createdAt: 'Yesterday, 18:15 CET'
  }
];

// ---------------------------------------------------------------------------
// 4. AUTONOMOUS MERCHANDISING & RANKING SCORES
// ---------------------------------------------------------------------------
export const INITIAL_MERCHANDISING_SCORES: MerchandisingScore[] = [
  {
    productId: 'dji-mavic-4-pro',
    productName: 'DJI Mavic 4 Pro (8K Flagship)',
    currentPosition: 1,
    recommendedPosition: 1,
    velocityScore: 98,
    marginContributionScore: 94,
    inventoryHealthScore: 88,
    searchTrendMultiplier: 1.45,
    compositeRankScore: 96.2,
    recommendedAction: 'boost_hero'
  },
  {
    productId: 'dji-mini-4-pro',
    productName: 'DJI Mini 4 Pro (<249g C0)',
    currentPosition: 2,
    recommendedPosition: 2,
    velocityScore: 95,
    marginContributionScore: 84,
    inventoryHealthScore: 92,
    searchTrendMultiplier: 1.32,
    compositeRankScore: 91.8,
    recommendedAction: 'promote_accessories'
  },
  {
    productId: 'dji-avata-2',
    productName: 'DJI Avata 2 (Immersive FPV)',
    currentPosition: 4,
    recommendedPosition: 3,
    velocityScore: 88,
    marginContributionScore: 89,
    inventoryHealthScore: 80,
    searchTrendMultiplier: 1.25,
    compositeRankScore: 87.4,
    recommendedAction: 'bundle_discount'
  },
  {
    productId: 'dji-air-3',
    productName: 'DJI Air 3 (Dual Primary Camera)',
    currentPosition: 3,
    recommendedPosition: 4,
    velocityScore: 78,
    marginContributionScore: 82,
    inventoryHealthScore: 96,
    searchTrendMultiplier: 0.98,
    compositeRankScore: 83.1,
    recommendedAction: 'maintain'
  },
  {
    productId: 'dji-osmo-pocket-3',
    productName: 'DJI Osmo Pocket 3 (1-inch CMOS)',
    currentPosition: 5,
    recommendedPosition: 5,
    velocityScore: 92,
    marginContributionScore: 80,
    inventoryHealthScore: 98,
    searchTrendMultiplier: 1.15,
    compositeRankScore: 88.6,
    recommendedAction: 'promote_accessories'
  }
];

export const INITIAL_DYNAMIC_BUNDLES: DynamicAccessoryBundle[] = [
  {
    id: 'BNDL-M4P-PRO-CREATOR',
    title: 'Mavic 4 Pro Ultimate Cinematographer Kit',
    parentProductId: 'dji-mavic-4-pro',
    parentProductName: 'DJI Mavic 4 Pro Fly More Combo',
    bundledProducts: [
      { productId: 'dji-m4p-bat', name: 'Extra Intelligent Flight Battery Plus', priceEur: 169 },
      { productId: 'dji-nd-filters', name: 'Master ND Filter Set (ND8/16/32/64)', priceEur: 119 },
      { productId: 'dji-care-2y', name: 'DJI Care Refresh 2-Year VIP Replacement', priceEur: 289 }
    ],
    totalRegularPriceEur: 2676,
    bundlePriceEur: 2499,
    discountEur: 177,
    marginPreservedPct: 31.4,
    projectedAovUpliftPct: 18.5,
    status: 'active'
  },
  {
    id: 'BNDL-AVATA2-SPEED-PACK',
    title: 'Avata 2 High-Voltage Freestyle Flight Bundle',
    parentProductId: 'dji-avata-2',
    parentProductName: 'DJI Avata 2 Fly More Combo (3 Batteries)',
    bundledProducts: [
      { productId: 'dji-sling-bag', name: 'DJI Protective Tactical Sling Bag', priceEur: 79 },
      { productId: 'dji-prop-guard', name: 'Heavy-Duty Propeller Crash Rings', priceEur: 39 },
      { productId: 'dji-65w-charger', name: 'DJI 65W Fast GaN Wall Charger', priceEur: 49 }
    ],
    totalRegularPriceEur: 1366,
    bundlePriceEur: 1269,
    discountEur: 97,
    marginPreservedPct: 33.8,
    projectedAovUpliftPct: 14.2,
    status: 'active'
  }
];

export const INITIAL_EXPERIMENTS: MerchandisingExperiment[] = [
  {
    id: 'EXP-HOMEPAGE-HERO-01',
    name: 'Mavic 4 Pro 8K Video Canvas vs. Interactive Spec Configurator',
    variantA: 'Autoplay High-Bitrate Cinema Loop',
    variantB: 'Interactive Lens & Sensor Resolution Switcher',
    trafficSplitPct: 50,
    status: 'stat_sig_reached',
    conversionLiftPct: 12.8,
    revenueLiftEur: 48920,
    confidencePct: 98.4
  },
  {
    id: 'EXP-ACCESSORY-ATTACH-02',
    name: 'Smart 1-Click Battery Addon at Cart vs. Modal Recommendation',
    variantA: 'Inline Drawer Checklist',
    variantB: 'Floating Bottom Sticky Bar with Free Express Shipping Tag',
    trafficSplitPct: 50,
    status: 'running',
    conversionLiftPct: 8.4,
    revenueLiftEur: 23150,
    confidencePct: 91.2
  }
];

// ---------------------------------------------------------------------------
// 5. AI PRICING INTELLIGENCE & COMPETITOR RADAR
// ---------------------------------------------------------------------------
export const INITIAL_COMPETITOR_PRICES: CompetitorPriceRecord[] = [
  {
    competitorName: 'MediaMarkt.de (Germany)',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    scrapedPriceEur: 2099,
    scrapedAt: '12 mins ago',
    stockStatus: 'in_stock',
    shippingCostEur: 0,
    priceDeltaEur: 0,
    deltaPct: 0.0
  },
  {
    competitorName: 'Fnac.com (France)',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    scrapedPriceEur: 2149,
    scrapedAt: '25 mins ago',
    stockStatus: 'in_stock',
    shippingCostEur: 4.99,
    priceDeltaEur: -50,
    deltaPct: -2.3
  },
  {
    competitorName: 'Amazon.de (Direct)',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    scrapedPriceEur: 2089,
    scrapedAt: '5 mins ago',
    stockStatus: 'limited',
    shippingCostEur: 0,
    priceDeltaEur: 10,
    deltaPct: 0.48
  },
  {
    competitorName: 'Coolblue.nl (Netherlands)',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    scrapedPriceEur: 2099,
    scrapedAt: '1 hour ago',
    stockStatus: 'in_stock',
    shippingCostEur: 0,
    priceDeltaEur: 0,
    deltaPct: 0.0
  },
  {
    competitorName: 'Digitec.ch (Switzerland)',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    scrapedPriceEur: 2180,
    scrapedAt: '45 mins ago',
    stockStatus: 'in_stock',
    shippingCostEur: 9.9,
    priceDeltaEur: -81,
    deltaPct: -3.7
  }
];

export const INITIAL_PRICING_RECOMMENDATIONS: DynamicPricingRecommendation[] = [
  {
    id: 'PRC-REC-001',
    sku: 'DJI-M4P-FMC',
    productName: 'DJI Mavic 4 Pro Fly More Combo',
    currentPriceEur: 2099,
    suggestedPriceEur: 2089,
    minPriceFloorEur: 1850,
    maxPriceCeilingEur: 2299,
    targetGrossMarginPct: 28.4,
    elasticityIndex: -1.45,
    expectedVolumeChangePct: 14.8,
    expectedRevenueImpactEur: 38400,
    rationale: 'Amazon.de currently listing at €2,089 with limited stock (3 units left). Matching price captures 100% buy-box intent while preserving 28.4% gross margin.',
    competitorBenchmark: INITIAL_COMPETITOR_PRICES,
    requiresApproval: true,
    status: 'pending'
  },
  {
    id: 'PRC-REC-002',
    sku: 'DJI-BAT-M4P',
    productName: 'Mavic 4 Pro Intelligent Flight Battery',
    currentPriceEur: 169,
    suggestedPriceEur: 159,
    minPriceFloorEur: 125,
    maxPriceCeilingEur: 189,
    targetGrossMarginPct: 32.1,
    elasticityIndex: -2.1,
    expectedVolumeChangePct: 28.5,
    expectedRevenueImpactEur: 18200,
    rationale: 'Battery price elasticity is very high (-2.1). Reducing to €159 increases 2-pack and 3-pack bundle attaches by 34%.',
    competitorBenchmark: [],
    requiresApproval: false,
    status: 'applied'
  }
];

// ---------------------------------------------------------------------------
// 6. CUSTOMER INTELLIGENCE & CHURN PREDICTION DATA
// ---------------------------------------------------------------------------
export const INITIAL_CUSTOMER_SEGMENTS: CustomerSegmentInsight[] = [
  {
    segmentKey: 'high_value_vips',
    segmentName: 'VIP Commercial Flight Studios',
    customerCount: 1420,
    avgLtvEur: 6840,
    totalRevenueContributionEur: 9712800,
    churnRatePct: 4.2,
    topCategory: 'Professional & Enterprise Aerials',
    recommendedPlaybook: 'Dedicated Key Account Manager + Priority 24h Express RMA Replacement'
  },
  {
    segmentKey: 'commercial_pros',
    segmentName: 'Certified EASA Commercial Operators',
    customerCount: 4890,
    avgLtvEur: 3120,
    totalRevenueContributionEur: 15256800,
    churnRatePct: 7.8,
    topCategory: 'Camera Drones (Mavic 4 Pro & Air 3)',
    recommendedPlaybook: 'B2B VAT Reverse-Charge invoicing + Bulk battery bundle incentives'
  },
  {
    segmentKey: 'enthusiast_creators',
    segmentName: 'FPV & Content Creators',
    customerCount: 12450,
    avgLtvEur: 1450,
    totalRevenueContributionEur: 18052500,
    churnRatePct: 14.5,
    topCategory: 'Avata 2 & Osmo Handhelds',
    recommendedPlaybook: 'Flight Club loyalty rewards + Community Masterclasses'
  },
  {
    segmentKey: 'first_time_pilots',
    segmentName: 'First-Time Drone Explorers (<249g)',
    customerCount: 22800,
    avgLtvEur: 840,
    totalRevenueContributionEur: 19152000,
    churnRatePct: 28.2,
    topCategory: 'Mini 4 Pro & Neo',
    recommendedPlaybook: 'EASA Flight Rule onboarding series + Day 14 DJI Care warranty prompt'
  },
  {
    segmentKey: 'churn_risk',
    segmentName: 'Inactive Pilots (No flight purchase > 180d)',
    customerCount: 3840,
    avgLtvEur: 1120,
    totalRevenueContributionEur: 4300800,
    churnRatePct: 62.4,
    topCategory: 'Accessories & Batteries',
    recommendedPlaybook: '€25 Seasonal Flight Reactivation voucher + Battery firmware check alert'
  }
];

export const INITIAL_CHURN_RISK_PROFILES: ChurnRiskProfile[] = [
  {
    customerId: 'CUST-EU-8841',
    customerName: 'Marcus Lindqvist',
    email: 'marcus@nordicfilm.se',
    companyName: 'Nordic Drone Media AB',
    lifetimeValueEur: 8450,
    lastOrderDate: '194 days ago',
    daysInactive: 194,
    churnProbabilityPct: 78,
    primaryRiskFactor: 'Zero battery purchases in 6 months; hasn’t upgraded to Mavic 4 series',
    suggestedAction: 'Send personalized trade-in quote for Inspire 2 -> Mavic 4 Pro with €150 bonus',
    automatedCampaignTriggered: true
  },
  {
    customerId: 'CUST-EU-9102',
    customerName: 'Claire Beaumont',
    email: 'claire@alpesaerial.fr',
    companyName: 'Alpes Cinéma SARL',
    lifetimeValueEur: 4920,
    lastOrderDate: '142 days ago',
    daysInactive: 142,
    churnProbabilityPct: 64,
    primaryRiskFactor: 'Logged 3 support tickets regarding winter battery calibration',
    suggestedAction: 'Proactively issue complimentary DJI Battery Heating Pad + 250 Loyalty Pts',
    automatedCampaignTriggered: false
  },
  {
    customerId: 'CUST-EU-7491',
    customerName: 'Jeroen van Dijk',
    email: 'j.vandijk@rotterdamports.nl',
    companyName: 'Port Survey Solutions B.V.',
    lifetimeValueEur: 14200,
    lastOrderDate: '210 days ago',
    daysInactive: 210,
    churnProbabilityPct: 82,
    primaryRiskFactor: 'Enterprise warranty expired on 2x Matrice 300 aircraft',
    suggestedAction: 'Schedule VIP video consultation for Matrice 350 RTK fleet transition',
    automatedCampaignTriggered: true
  }
];

// ---------------------------------------------------------------------------
// 7. REVIEW SENTIMENT & NLP DEFECT CLUSTERING
// ---------------------------------------------------------------------------
export const INITIAL_SENTIMENT_CLUSTERS: SentimentCluster[] = [
  {
    id: 'SENT-01',
    category: 'firmware_performance',
    label: 'Mavic 4 Pro 8K 60fps Thermal Handling & Codec Stability',
    sentimentScore: 0.88,
    reviewCount: 342,
    positivePct: 92,
    neutralPct: 5,
    negativePct: 3,
    sampleQuotes: [
      'The D-Log M color profile grading in DaVinci Resolve is breathtaking. Zero dropped frames.',
      'Gimbal stayed rock solid even in 12 m/s coastal gusts off Brittany.'
    ],
    detectedIssues: ['Minor 2-second delay during 10-bit H.265 thumbnail preview generation on older iOS devices'],
    engineeringEscalated: false
  },
  {
    id: 'SENT-02',
    category: 'battery_cold_weather',
    label: 'Sub-Zero Battery Pre-Heating & Flight Duration in Nordic Regions',
    sentimentScore: 0.64,
    reviewCount: 189,
    positivePct: 74,
    neutralPct: 16,
    negativePct: 10,
    sampleQuotes: [
      'Self-heating battery works like a charm at -10°C in Tromsø.',
      'Lost about 5 minutes of hover time compared to summer specs, but expected in snow.'
    ],
    detectedIssues: ['Auto-discharge threshold notification was unclear in German locale translation'],
    engineeringEscalated: true
  },
  {
    id: 'SENT-03',
    category: 'easa_compliance',
    label: 'European Class C0 & C1 Labeling & Direct Remote ID Registration',
    sentimentScore: 0.94,
    reviewCount: 512,
    positivePct: 96,
    neutralPct: 3,
    negativePct: 1,
    sampleQuotes: [
      'The included QR code for German LBA registration made compliance take under 3 minutes!',
      'Finally an EU drone company that handles EASA certification transparently.'
    ],
    detectedIssues: [],
    engineeringEscalated: false
  },
  {
    id: 'SENT-04',
    category: 'delivery_speed',
    label: 'DHL Express 24h Delivery from Frankfurt Logistics Hub',
    sentimentScore: 0.91,
    reviewCount: 840,
    positivePct: 94,
    neutralPct: 4,
    negativePct: 2,
    sampleQuotes: [
      'Ordered Monday 16:00 in Munich, delivered Tuesday 11:30 AM. Superb packaging.',
      'Zero customs hassle in Austria; official VAT invoice generated immediately.'
    ],
    detectedIssues: ['2 packages delayed in rural Pyrenees region due to snow blizzard'],
    engineeringEscalated: false
  }
];

// ---------------------------------------------------------------------------
// 8. AUTONOMOUS COMMERCE AGENTS (LANGGRAPH MULTI-AGENT ARCHITECTURE)
// ---------------------------------------------------------------------------
export const INITIAL_COMMERCE_AGENTS: CommerceAgentDefinition[] = [
  {
    role: 'executive_insights',
    name: 'Atlas Executive Intelligence Agent',
    callsign: 'ATLAS-01',
    avatarIcon: 'Crown',
    description: 'Continuously correlates real-time revenue, gross margin, currency movements, and inventory risks to produce executive briefings and alert leadership to commercial anomalies.',
    status: 'active',
    autonomyLevel: 'semi_autonomous',
    tasksCompleted24h: 184,
    avgLatencyMs: 420,
    successRatePct: 99.4,
    currentGoal: 'Monitoring Q3 Revenue pace vs €14.85M target and EUR/USD margin impact.'
  },
  {
    role: 'pricing_strategist',
    name: 'Hermes Dynamic Pricing Agent',
    callsign: 'HERMES-02',
    avatarIcon: 'TrendingUp',
    description: 'Scrapes EU competitor prices every 15 minutes, models price elasticity, safeguards minimum gross margins (>=18%), and executes automated micro-adjustments.',
    status: 'active',
    autonomyLevel: 'fully_autonomous',
    tasksCompleted24h: 642,
    avgLatencyMs: 280,
    successRatePct: 99.8,
    currentGoal: 'Matching MediaMarkt flash promotions while preserving target 28.4% gross margin on Mavic 4 Pro.'
  },
  {
    role: 'inventory_replenisher',
    name: 'Vulcan Autonomous WMS & Replenishment Agent',
    callsign: 'VULCAN-03',
    avatarIcon: 'Boxes',
    description: 'Forecasts depot-level stockout dates across 5 European warehouses (FRA, AMS, WAW, MAD, MXP) and automatically creates purchase orders & inter-depot transfers.',
    status: 'active',
    autonomyLevel: 'semi_autonomous',
    tasksCompleted24h: 310,
    avgLatencyMs: 510,
    successRatePct: 98.9,
    currentGoal: 'Generating PO-904 for 500x Mavic 4 Pro flight batteries to absorb weekend flight demand.'
  },
  {
    role: 'merchandising_optimizer',
    name: 'Aegis Visual Merchandising & Bundle Agent',
    callsign: 'AEGIS-04',
    avatarIcon: 'Sparkles',
    description: 'Ranks catalog products dynamically based on margin velocity, stock availability, and search trends; dynamically generates high-margin accessory bundles.',
    status: 'active',
    autonomyLevel: 'fully_autonomous',
    tasksCompleted24h: 420,
    avgLatencyMs: 190,
    successRatePct: 100.0,
    currentGoal: 'A/B testing Hero Video vs Spec Configurator; Variant A leading with +12.8% conversion lift.'
  },
  {
    role: 'logistics_sentinel',
    name: 'Mercury Logistics & Courier Sentinel',
    callsign: 'MERCURY-05',
    avatarIcon: 'Truck',
    description: 'Tracks all active DHL Express, DPD, and UPS shipments across Europe, detects customs & transit bottlenecks, and autonomously alerts customers.',
    status: 'active',
    autonomyLevel: 'fully_autonomous',
    tasksCompleted24h: 1240,
    avgLatencyMs: 140,
    successRatePct: 99.6,
    currentGoal: 'Real-time telemetry on 98 parcels clearing Frankfurt CargoCity Hub.'
  },
  {
    role: 'customer_support_copilot',
    name: 'Skylark Multilingual Flight & Support Copilot',
    callsign: 'SKYLARK-06',
    avatarIcon: 'Bot',
    description: 'Autonomous RAG-grounded support agent answering customer inquiries in EN, DE, FR, ES, IT, and NL regarding EASA regulations, order tracking, and warranty claims.',
    status: 'active',
    autonomyLevel: 'fully_autonomous',
    tasksCompleted24h: 890,
    avgLatencyMs: 820,
    successRatePct: 97.5,
    currentGoal: 'Resolving pilot questions regarding EASA Class C1 Direct Remote ID operator registration.'
  },
  {
    role: 'fraud_risk_analyst',
    name: 'Sentinel Risk & Crypto Taint Analyst',
    callsign: 'SENTINEL-07',
    avatarIcon: 'ShieldAlert',
    description: 'Analyzes high-value SEPA wire transfers and cryptocurrency on-chain deposits for blockchain taint, TOR exit nodes, and refund abuse velocity.',
    status: 'active',
    autonomyLevel: 'semi_autonomous',
    tasksCompleted24h: 530,
    avgLatencyMs: 310,
    successRatePct: 99.9,
    currentGoal: 'Quarantining order #948122 for high-risk TOR network address verification.'
  }
];

export const INITIAL_AGENT_TRACES: AgentLogTrace[] = [
  {
    id: 'TRC-1001',
    timestamp: '14:28:10 CET',
    agentRole: 'pricing_strategist',
    agentName: 'Hermes Dynamic Pricing Agent',
    action: 'Competitor Price Match (Amazon.de)',
    reasoning: 'Detected Amazon DE flash price drop on SKU DJI-M4P-FMC to €2,089. Our floor is €1,850. Gross margin remains 28.4%. Auto-applied.',
    confidenceScore: 0.98,
    status: 'completed',
    impactSummary: '+€38,400 projected weekly revenue impact'
  },
  {
    id: 'TRC-1002',
    timestamp: '14:25:44 CET',
    agentRole: 'inventory_replenisher',
    agentName: 'Vulcan Autonomous WMS Agent',
    action: 'Depot Rebalance Order Dispatch',
    reasoning: 'Madrid Depot (MAD-04) inventory is at 2.9 days of supply due to high Iberian demand. Dispatched 40 units from Amsterdam Hub.',
    confidenceScore: 0.95,
    status: 'completed',
    impactSummary: 'Prevented stockout across Spain & Portugal'
  },
  {
    id: 'TRC-1003',
    timestamp: '14:21:05 CET',
    agentRole: 'fraud_risk_analyst',
    agentName: 'Sentinel Risk Analyst',
    action: 'Crypto Deposit Verification',
    reasoning: 'USDT deposit of 2,499 USDT for order #DJI-EU-849102 matched clean TRC-20 wallet history with zero sanctions or mixing protocol flags.',
    confidenceScore: 0.99,
    status: 'completed',
    impactSummary: 'Auto-released order to Frankfurt WMS for packing'
  },
  {
    id: 'TRC-1004',
    timestamp: '14:15:30 CET',
    agentRole: 'executive_insights',
    agentName: 'Atlas Executive Agent',
    action: 'Executive KPI Daily Briefing Generation',
    reasoning: 'Computed 18.4% daily revenue growth over 7-day average. Flagged high SEPA wire conversion in DACH region (63.6% volume).',
    confidenceScore: 0.96,
    status: 'completed',
    impactSummary: 'Sent briefing to C-Suite executive portal'
  },
  {
    id: 'TRC-1005',
    timestamp: '14:02:18 CET',
    agentRole: 'inventory_replenisher',
    agentName: 'Vulcan Autonomous WMS Agent',
    action: 'Autonomous Purchase Order Generated (PO-AI-904)',
    reasoning: 'Projected Central European battery shortages within 4.4 days. Total PO amount is €109,900 (>€50,000 threshold requires CEO approval).',
    confidenceScore: 0.94,
    status: 'awaiting_human_approval',
    impactSummary: 'Pending Human-in-the-Loop CEO signature'
  }
];

// ---------------------------------------------------------------------------
// 9. LOGISTICS INTELLIGENCE & COURIER SLA DATA
// ---------------------------------------------------------------------------
export const INITIAL_COURIER_PERFORMANCE: CourierSlaPerformance[] = [
  {
    courierCode: 'dhl_express',
    courierName: 'DHL Express Europe (Primary Aerial Logistics)',
    activeShipmentsCount: 342,
    onTimeDeliveryRatePct: 98.6,
    avgTransitHours: 21.4,
    customsClearanceAvgHours: 1.2,
    activeDelayedCount: 4,
    incidentHotspots: ['Brenner Pass Transit (AT/IT border)'],
    reliabilityScore: 98
  },
  {
    courierCode: 'dpd_europe',
    courierName: 'DPD Classic Road Freight (Ground Battery Hazmat)',
    activeShipmentsCount: 128,
    onTimeDeliveryRatePct: 95.2,
    avgTransitHours: 42.8,
    customsClearanceAvgHours: 2.8,
    activeDelayedCount: 6,
    incidentHotspots: ['Warsaw East Logistics Hub'],
    reliabilityScore: 92
  },
  {
    courierCode: 'ups_saver',
    courierName: 'UPS Express Saver (Enterprise & B2B Matrice)',
    activeShipmentsCount: 54,
    onTimeDeliveryRatePct: 97.4,
    avgTransitHours: 24.1,
    customsClearanceAvgHours: 1.8,
    activeDelayedCount: 1,
    incidentHotspots: ['Milan Malpensa Cargo'],
    reliabilityScore: 96
  }
];

export const INITIAL_LOGISTICS_BOTTLENECKS: LogisticsBottleneckAlert[] = [
  {
    id: 'BOTTLENECK-01',
    route: 'Frankfurt (FRA-01) -> Northern Italy (Milan MXP)',
    affectedShipmentCount: 12,
    delayHoursAvg: 4.5,
    rootCause: 'Brenner Highway tunnel maintenance restrictions for hazardous lithium battery ground transport.',
    suggestedMitigation: 'Reroute high-priority orders via air freight directly into Milan Malpensa.',
    rerouteWarehouse: 'MXP-05 (Milan Hub)',
    status: 'mitigating'
  }
];

// ---------------------------------------------------------------------------
// 10. SEARCH INTELLIGENCE DATA
// ---------------------------------------------------------------------------
export const INITIAL_SEARCH_INSIGHTS: SearchQueryInsight[] = [
  {
    query: 'mavic 4 pro',
    searchVolume30d: 48200,
    zeroResultRatePct: 0.0,
    clickThroughRatePct: 42.4,
    conversionRatePct: 6.8,
    status: 'optimized'
  },
  {
    query: 'mavic 4 thermal',
    searchVolume30d: 4210,
    zeroResultRatePct: 18.2,
    clickThroughRatePct: 24.1,
    conversionRatePct: 3.2,
    suggestedSynonymAction: 'Map to Matrice 350 RTK + Zenmuse H20T Enterprise thermal payloads',
    autoGeneratedSynonym: 'mavic thermal -> matrice thermal zenmuse',
    status: 'needs_synonym'
  },
  {
    query: 'mavik 4 fly mor',
    searchVolume30d: 1850,
    zeroResultRatePct: 2.1,
    clickThroughRatePct: 38.5,
    conversionRatePct: 5.4,
    suggestedSynonymAction: 'Auto-correct phonetics to "Mavic 4 Fly More Combo"',
    autoGeneratedSynonym: 'mavik -> mavic, mor -> more',
    status: 'typo_detected'
  },
  {
    query: 'easa c0 drohne',
    searchVolume30d: 12400,
    zeroResultRatePct: 0.0,
    clickThroughRatePct: 48.2,
    conversionRatePct: 8.1,
    status: 'optimized'
  }
];

// ---------------------------------------------------------------------------
// 11. FRAUD DETECTION ASSESSMENTS
// ---------------------------------------------------------------------------
export const INITIAL_FRAUD_ASSESSMENTS: FraudRiskAssessment[] = [
  {
    id: 'FRAUD-948122',
    orderNumber: 'DJI-EU-948122',
    customerName: 'Nordic Aerial Tech AB',
    totalEur: 18420,
    paymentMethod: 'SEPA Direct Wire (Deutsche Bank AG)',
    ipLocation: 'Stockholm, Sweden (Verified Corporate ASN)',
    riskScore: 4,
    riskFactors: ['Clean corporate IBAN', 'VAT ID SE556942109001 verified on VIES', 'Known commercial pilot customer'],
    deviceFingerprintRisk: 'clean',
    status: 'cleared_auto',
    evaluatedAt: '12 mins ago'
  },
  {
    id: 'FRAUD-948129',
    orderNumber: 'DJI-EU-948129',
    customerName: 'Anonymous Pilot',
    totalEur: 4299,
    paymentMethod: 'USDT (TRC-20)',
    ipLocation: 'Reykjavik, Iceland (TOR Exit Node)',
    riskScore: 84,
    riskFactors: ['TOR exit node IP address detected', 'Multiple failed card attempts prior to crypto switch', 'Mismatched delivery address in high-fraud zone'],
    cryptoTaintScore: 42,
    deviceFingerprintRisk: 'tor_node',
    status: 'held_for_investigation',
    evaluatedAt: '18 mins ago'
  },
  {
    id: 'FRAUD-948115',
    orderNumber: 'DJI-EU-948115',
    customerName: 'Jean-Luc Moreau',
    totalEur: 2099,
    paymentMethod: 'SEPA Direct Wire',
    ipLocation: 'Lyon, France',
    riskScore: 12,
    riskFactors: ['Clean French IP', 'Verified French national phone number'],
    deviceFingerprintRisk: 'clean',
    status: 'cleared_auto',
    evaluatedAt: '35 mins ago'
  }
];

// ---------------------------------------------------------------------------
// 12. CLICKHOUSE & BI ANALYTICS QUERIES
// ---------------------------------------------------------------------------
export const INITIAL_BI_QUERIES: BiAnalyticsQuery[] = [
  {
    id: 'BI-Q-01',
    name: 'Customer Lifetime Value (LTV) Cohort Analysis by EU Country',
    category: 'customer_cohorts',
    description: 'Calculates 30-day, 90-day, and 180-day revenue retention across Germany, France, Netherlands, Spain, and Italy.',
    sqlQuery: `SELECT 
    country_code,
    date_trunc('month', first_order_date) AS cohort_month,
    count(DISTINCT customer_id) AS total_pilots,
    avg(order_total_eur) AS initial_aov,
    sum(if(days_since_first <= 90, order_total_eur, 0)) / count(DISTINCT customer_id) AS ltv_90d_eur,
    sum(if(days_since_first <= 180, order_total_eur, 0)) / count(DISTINCT customer_id) AS ltv_180d_eur,
    round(countIf(orders_count > 1) * 100.0 / count(DISTINCT customer_id), 2) AS repeat_purchase_rate_pct
FROM dji_analytics.customer_orders_realtime
WHERE event_time >= now() - INTERVAL 1 YEAR
GROUP BY country_code, cohort_month
ORDER BY total_pilots DESC;`,
    executionTimeMs: 42,
    recordsReturned: 24,
    columns: ['Country', 'Cohort Month', 'Total Pilots', 'Initial AOV (€)', 'LTV 90D (€)', 'LTV 180D (€)', 'Repeat Rate (%)'],
    rows: [
      ['DE (Germany)', '2026-01', 1240, '€1,180.50', '€1,640.20', '€2,120.80', '42.8%'],
      ['DE (Germany)', '2026-02', 1480, '€1,145.20', '€1,590.40', '€2,080.10', '41.2%'],
      ['FR (France)', '2026-01', 890, '€1,090.00', '€1,480.00', '€1,940.50', '38.4%'],
      ['NL (Netherlands)', '2026-01', 620, '€1,240.00', '€1,780.00', '€2,340.00', '46.1%'],
      ['ES (Spain)', '2026-01', 540, '€980.00', '€1,290.00', '€1,680.00', '34.2%'],
      ['SE (Sweden)', '2026-01', 380, '€1,320.00', '€1,890.00', '€2,490.00', '48.9%']
    ]
  },
  {
    id: 'BI-Q-02',
    name: 'Depot Turn-Rate & Real-Time European Margin Contribution',
    category: 'margin_contribution',
    description: 'Aggregates net gross profit, shipping logistics overhead, and payment processing margin preservation per product SKU.',
    sqlQuery: `SELECT 
    p.sku,
    p.model_name,
    p.category,
    sum(o.quantity) AS units_sold_mtd,
    round(sum(o.gross_revenue_eur), 2) AS gross_revenue_eur,
    round(sum(o.cogs_eur), 2) AS total_cogs_eur,
    round(sum(o.gross_margin_eur), 2) AS gross_profit_eur,
    round(avg(o.margin_percentage), 2) AS avg_margin_pct,
    round(sum(o.payment_gateway_fees_saved_eur), 2) AS sepa_crypto_fee_savings_eur
FROM dji_analytics.orders_placed o
JOIN dji_analytics.products_dim p ON o.product_id = p.id
WHERE o.order_status NOT IN ('cancelled', 'refunded')
GROUP BY p.sku, p.model_name, p.category
ORDER BY gross_revenue_eur DESC;`,
    executionTimeMs: 38,
    recordsReturned: 18,
    columns: ['SKU', 'Product Name', 'Category', 'Units MTD', 'Gross Revenue (€)', 'COGS (€)', 'Gross Profit (€)', 'Margin (%)', 'Fee Savings (€)'],
    rows: [
      ['DJI-M4P-CREATOR', 'DJI Mavic 4 Pro Creator Combo', 'Camera Drones', 412, '€864,788', '€579,400', '€285,388', '33.0%', '€25,943'],
      ['DJI-MINI4P-FMC', 'DJI Mini 4 Pro Fly More Combo', 'Camera Drones', 680, '€767,720', '€522,000', '€245,720', '32.0%', '€23,031'],
      ['DJI-M350-RTK', 'DJI Matrice 350 RTK Enterprise', 'Enterprise', 28, '€307,720', '€190,400', '€117,320', '38.1%', '€9,231'],
      ['DJI-AVATA2-FPV', 'DJI Avata 2 FPV Combo', 'FPV Drones', 310, '€309,690', '€201,500', '€108,190', '34.9%', '€9,290'],
      ['DJI-POCK3-CREATOR', 'DJI Osmo Pocket 3 Creator', 'Handheld', 480, '€325,920', '€220,800', '€105,120', '32.2%', '€9,777']
    ]
  }
];

// ---------------------------------------------------------------------------
// 13. OPERATIONAL ANOMALY DETECTION ALERTS
// ---------------------------------------------------------------------------
export const INITIAL_ANOMALY_ALERTS: OperationalAnomalyAlert[] = [
  {
    id: 'ANOM-2026-01',
    timestamp: '28 mins ago',
    metric: 'Spain (MAD-04) Checkout Conversion Rate',
    expectedValue: '3.92%',
    observedValue: '1.84%',
    deviationPct: -53.1,
    severity: 'high',
    rootCauseAnalysis: 'Regional Spanish banking gateway timeout for Bizum/SEPA instant confirmations; fallback to standard IBAN transfer was not immediately emphasized.',
    aiSuggestedFix: 'Switched checkout prompt in Spain to prioritize Direct Deutsche Bank SEPA Wire and USDT payment routes with instant QR code generator.',
    status: 'investigating'
  },
  {
    id: 'ANOM-2026-02',
    timestamp: '1 hour ago',
    metric: 'Frankfurt Central Hub (FRA-01) Battery Stock Burn Rate',
    expectedValue: '11.2 units/day',
    observedValue: '28.4 units/day',
    deviationPct: 153.5,
    severity: 'medium',
    rootCauseAnalysis: 'Unusual spike in multi-battery flight kit orders driven by sunny weekend forecast across Bavaria and Rhine-Ruhr.',
    aiSuggestedFix: 'Vulcan Agent automatically dispatched PO-AI-904 for 500 replenishment units from Rotterdam bonded warehouse.',
    status: 'resolved'
  }
];

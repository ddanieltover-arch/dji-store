import {
  CustomerProfile,
  LoyaltyRewardItem,
  MarketingAutomationTrigger,
  MarketingCampaign,
  CdpEvent,
  ReferralRecord,
  LoyaltyTier,
  Product
} from '../types';
import { DJI_PRODUCTS } from './products';

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-lukas-weber',
    email: 'lukas.weber@creatives.de',
    firstName: 'Lukas',
    lastName: 'Weber',
    phone: '+49 170 554 9812',
    company: 'Weber Aerial Cinematography',
    countryCode: 'DE',
    countryName: 'Germany',
    loyaltyTier: 'advanced',
    loyaltyAccount: {
      id: 'loyalty-acc-lukas',
      customerId: 'cust-lukas-weber',
      pointsBalance: 4850,
      tier: 'advanced',
      lifetimePoints: 6350,
      tierExpiresAt: '2027-12-31',
      perks: [
        'Early Product Access 48h Prior to Public Launch',
        '5% Exclusive Accessory Discount',
        'Priority Technical Support Queue',
        'Flight Club Creator Verified Badge'
      ]
    },
    lifetimeValueEur: 4297,
    totalOrders: 3,
    ownedProducts: ['dji-mavic-4-pro', 'dji-osmo-pocket-3', 'dji-care-m4p-2y'],
    ownedSerialNumbers: ['1581F6XBC2304910', '0891F4OP3882910'],
    averageOrderValue: 1432.33,
    leadScore: 620,
    leadCategory: 'vip',
    healthStatus: 'excellent',
    engagementScore: 92,
    reviewScore: 5,
    lastPurchaseDate: '2026-03-28',
    lastActivityDate: '2026-04-12',
    marketingConsent: true,
    flightClubMember: true,
    flightClubDetails: {
      pilotHandle: 'SkyLukas_DE',
      droneFleetCount: 2,
      totalFlightHours: 148.5,
      communityRank: 'Master Flight Instructor',
      referralCode: 'LUKAS-FLY-89',
      referralsCount: 4,
      earningsPoints: 2000
    },
    tags: ['Cinema Creator', 'Care Refresh Active', 'Commercial Pilot', 'High Engagement'],
    notes: 'Key creative beta tester for European firmware tests. Prefers express DHL delivery.',
    createdAt: '2025-04-10T10:00:00Z'
  },
  {
    id: 'cust-elena-rossi',
    email: 'elena.rossi@skycine.it',
    firstName: 'Elena',
    lastName: 'Rossi',
    phone: '+39 02 8849 2011',
    company: 'SkyCine Milano S.r.l.',
    countryCode: 'IT',
    countryName: 'Italy',
    loyaltyTier: 'professional',
    loyaltyAccount: {
      id: 'loyalty-acc-elena',
      customerId: 'cust-elena-rossi',
      pointsBalance: 15400,
      tier: 'professional',
      lifetimePoints: 17900,
      tierExpiresAt: '2027-12-31',
      perks: [
        'Exclusive Launch Invitations (Berlin/Paris Gala)',
        '10% Care Refresh & Accessory Discount',
        'Extended 30-Day European Return Window',
        'Dedicated VIP Account Executive'
      ]
    },
    lifetimeValueEur: 14890,
    totalOrders: 6,
    ownedProducts: ['dji-inspire-3', 'dji-ronin-4d-8k', 'dji-mavic-4-pro'],
    ownedSerialNumbers: ['4920F9INS9920199', '2019F8R4D8830199'],
    averageOrderValue: 2481.66,
    leadScore: 780,
    leadCategory: 'vip',
    healthStatus: 'excellent',
    engagementScore: 88,
    reviewScore: 4.8,
    lastPurchaseDate: '2026-04-02',
    lastActivityDate: '2026-04-11',
    marketingConsent: true,
    flightClubMember: true,
    flightClubDetails: {
      pilotHandle: 'Elena_Milano_Cinema',
      droneFleetCount: 4,
      totalFlightHours: 320.0,
      communityRank: 'Commercial Cine Director',
      referralCode: 'ELENA-CINE-IT',
      referralsCount: 8,
      earningsPoints: 4000
    },
    tags: ['Enterprise B2B', 'Cinema Fleet', 'Reverse Charge Verified', 'VIP Studio'],
    notes: 'Milano-based aerial film production house. Bulk accessory purchases.',
    createdAt: '2024-11-15T09:30:00Z'
  },
  {
    id: 'cust-marc-vandijk',
    email: 'marc.vandijk@rotterdam-media.nl',
    firstName: 'Marc',
    lastName: 'Van Dijk',
    phone: '+31 10 740 9182',
    countryCode: 'NL',
    countryName: 'Netherlands',
    loyaltyTier: 'pilot',
    loyaltyAccount: {
      id: 'loyalty-acc-marc',
      customerId: 'cust-marc-vandijk',
      pointsBalance: 950,
      tier: 'pilot',
      lifetimePoints: 1200,
      tierExpiresAt: '2026-12-31',
      perks: [
        'Priority European Firmware Bulletins',
        'DJI Flight Club Community Membership',
        'Verified Product Review Points Rewards'
      ]
    },
    lifetimeValueEur: 899,
    totalOrders: 1,
    ownedProducts: ['dji-mini-4-pro'],
    ownedSerialNumbers: ['1082M4P9940182'],
    averageOrderValue: 899,
    leadScore: 220,
    leadCategory: 'warm',
    healthStatus: 'good',
    engagementScore: 65,
    reviewScore: 4.5,
    lastPurchaseDate: '2026-02-14',
    lastActivityDate: '2026-04-05',
    marketingConsent: true,
    flightClubMember: true,
    flightClubDetails: {
      pilotHandle: 'DutchSkyPilot',
      droneFleetCount: 1,
      totalFlightHours: 24.5,
      communityRank: 'Novice Flight Member',
      referralCode: 'MARC-NL-44',
      referralsCount: 1,
      earningsPoints: 500
    },
    tags: ['C0 Sub-249g', 'Travel Photographer', 'Newsletter Subscriber'],
    createdAt: '2026-01-20T14:20:00Z'
  },
  {
    id: 'cust-henrik-lindqvist',
    email: 'henrik.l@nordic-geosurvey.se',
    firstName: 'Henrik',
    lastName: 'Lindqvist',
    phone: '+46 8 501 9283',
    company: 'Nordic GeoSurvey AB',
    countryCode: 'SE',
    countryName: 'Sweden',
    loyaltyTier: 'enterprise',
    loyaltyAccount: {
      id: 'loyalty-acc-henrik',
      customerId: 'cust-henrik-lindqvist',
      pointsBalance: 31200,
      tier: 'enterprise',
      lifetimePoints: 34500,
      tierExpiresAt: '2028-12-31',
      perks: [
        'Dedicated Enterprise Key Account Director',
        'Custom European Fleet Net Pricing',
        'Direct Engineering Firmware Escalation',
        'On-Site Hardware Swap Guarantee in 24h'
      ]
    },
    lifetimeValueEur: 28500,
    totalOrders: 8,
    ownedProducts: ['dji-matrice-350-rtk', 'dji-zenmuse-p1', 'dji-inspire-3'],
    ownedSerialNumbers: ['8821M350RTK991', '7730ZP1002910'],
    averageOrderValue: 3562.5,
    leadScore: 940,
    leadCategory: 'vip',
    healthStatus: 'excellent',
    engagementScore: 95,
    reviewScore: 5.0,
    lastPurchaseDate: '2026-03-10',
    lastActivityDate: '2026-04-10',
    marketingConsent: true,
    flightClubMember: false,
    tags: ['Enterprise Fleet', 'Thermal & LiDAR', 'Surveying & Mapping', 'Contract Account'],
    notes: 'Large industrial infrastructure mapping client in Scandinavia.',
    createdAt: '2024-05-18T08:00:00Z'
  },
  {
    id: 'cust-sophie-dubois',
    email: 'sophie.dubois@paris-vlog.fr',
    firstName: 'Sophie',
    lastName: 'Dubois',
    phone: '+33 6 49 10 29 48',
    countryCode: 'FR',
    countryName: 'France',
    loyaltyTier: 'pilot',
    loyaltyAccount: {
      id: 'loyalty-acc-sophie',
      customerId: 'cust-sophie-dubois',
      pointsBalance: 520,
      tier: 'pilot',
      lifetimePoints: 520,
      tierExpiresAt: '2026-12-31',
      perks: [
        'Priority European Firmware Bulletins',
        'DJI Flight Club Community Membership'
      ]
    },
    lifetimeValueEur: 499,
    totalOrders: 1,
    ownedProducts: ['dji-osmo-action-4'],
    ownedSerialNumbers: ['0481ACT499201'],
    averageOrderValue: 499,
    leadScore: 85,
    leadCategory: 'cold',
    healthStatus: 'at_risk',
    engagementScore: 28,
    reviewScore: 0,
    lastPurchaseDate: '2025-09-12',
    lastActivityDate: '2025-11-04',
    marketingConsent: true,
    flightClubMember: false,
    tags: ['Action Camera', 'Inactive 180+ Days', 'Vlogger'],
    notes: 'Has not engaged in over 6 months. Candidate for win-back coupon campaign.',
    createdAt: '2025-09-12T16:00:00Z'
  },
  {
    id: 'cust-mateo-fernandez',
    email: 'mateo.f@madrid-drones.es',
    firstName: 'Mateo',
    lastName: 'Fernandez',
    phone: '+34 612 884 910',
    countryCode: 'ES',
    countryName: 'Spain',
    loyaltyTier: 'advanced',
    loyaltyAccount: {
      id: 'loyalty-acc-mateo',
      customerId: 'cust-mateo-fernandez',
      pointsBalance: 2400,
      tier: 'advanced',
      lifetimePoints: 2900,
      tierExpiresAt: '2027-12-31',
      perks: [
        'Early Product Access 48h Prior to Launch',
        '5% Exclusive Accessory Discount',
        'Priority Technical Support Queue'
      ]
    },
    lifetimeValueEur: 2150,
    totalOrders: 2,
    ownedProducts: ['dji-air-3s', 'dji-mic-2'],
    ownedSerialNumbers: ['2201AIR3S99481'],
    averageOrderValue: 1075,
    leadScore: 380,
    leadCategory: 'hot',
    healthStatus: 'good',
    engagementScore: 78,
    reviewScore: 5.0,
    lastPurchaseDate: '2026-03-01',
    lastActivityDate: '2026-04-09',
    marketingConsent: true,
    flightClubMember: true,
    flightClubDetails: {
      pilotHandle: 'Mateo_FPV_Madrid',
      droneFleetCount: 2,
      totalFlightHours: 62.0,
      communityRank: 'Advanced Aerial Pilot',
      referralCode: 'MATEO-ES-91',
      referralsCount: 2,
      earningsPoints: 1000
    },
    tags: ['Air Series Enthusiast', 'Audio Creator', 'EASA A1/A3 Certified'],
    createdAt: '2025-10-04T12:00:00Z'
  }
];

export const INITIAL_LOYALTY_REWARDS: LoyaltyRewardItem[] = [
  {
    id: 'rew-voucher-25',
    title: '€25 Official Store Voucher',
    description: 'Instant discount code valid on all DJI drones, cameras, and accessories on djii.eu.',
    pointsCost: 2500,
    voucherCode: 'DJI-PILOT-25-REWARD',
    discountEur: 25,
    type: 'voucher',
    category: 'Vouchers',
    badge: 'Popular'
  },
  {
    id: 'rew-voucher-50',
    title: '€50 Premium Gear Voucher',
    description: 'Valid for orders above €200. Ideal for intelligent flight batteries, ND filters, and charging hubs.',
    pointsCost: 5000,
    voucherCode: 'DJI-PILOT-50-PLUS',
    discountEur: 50,
    type: 'voucher',
    category: 'Vouchers',
    badge: 'Best Value'
  },
  {
    id: 'rew-voucher-100',
    title: '€100 Pro Fleet Credit',
    description: 'Major discount applicable to Mavic 4 Pro, Inspire 3, or enterprise sensor payloads.',
    pointsCost: 10000,
    voucherCode: 'DJI-PRO-100-FLEET',
    discountEur: 100,
    type: 'voucher',
    category: 'Vouchers'
  },
  {
    id: 'rew-props-set',
    title: 'DJI Low-Noise Propeller Set (Pair)',
    description: 'OEM low-noise replacement propellers for your registered drone model with quick-release locks.',
    pointsCost: 3000,
    type: 'accessory',
    category: 'Accessories',
    badge: 'Zero Euro Shipped'
  },
  {
    id: 'rew-rc-hood',
    title: 'DJI RC 2 Professional Sunshade & Lanyard',
    description: 'High-density matte monitor hood and CNC aluminum lanyard clamp for clear outdoor visibility.',
    pointsCost: 3500,
    type: 'accessory',
    category: 'Accessories'
  },
  {
    id: 'rew-care-upgrade',
    title: 'DJI Care Refresh 1-Year Extension Certificate',
    description: 'Extends accidental crash and flyaway replacement coverage by an additional 12 full months.',
    pointsCost: 15000,
    type: 'care_upgrade',
    category: 'Protection',
    badge: 'Exclusive'
  },
  {
    id: 'rew-flight-academy',
    title: 'VIP Masterclass — EASA Night & Urban Flight Operations',
    description: 'Live interactive certification workshop with certified DJI European Flight Instructors.',
    pointsCost: 8000,
    type: 'service',
    category: 'Experiences'
  },
  {
    id: 'rew-carbon-pack',
    title: 'Limited Edition DJI Pilot Carbon Fiber Hard Case',
    description: 'Waterproof IP67 tactical drone case customized with your Flight Club callsign plaque.',
    pointsCost: 18000,
    type: 'swag',
    category: 'Gear',
    badge: 'Collector Edition'
  }
];

export const INITIAL_AUTOMATION_TRIGGERS: MarketingAutomationTrigger[] = [
  {
    id: 'trig-cart-1hr',
    name: 'Abandoned Cart 1-Hour Recovery Pulse',
    type: 'abandoned_cart',
    triggerCondition: 'Cart active with items > 60 min, no checkout init',
    delayHours: 1,
    channel: 'email',
    subject: 'Your DJI aerial setup is reserved at our European Depot',
    previewText: 'Stock held in Frankfurt Hub for 24h. Complete your order with express DHL dispatch.',
    contentTemplate: 'Hi {{firstName}}, your {{cartItemNames}} is ready for dispatch with our 2-Year European Warranty.',
    isActive: true,
    totalSent: 1840,
    openRate: 58.4,
    clickRate: 22.1,
    conversionRate: 14.8,
    revenueGeneratedEur: 42900
  },
  {
    id: 'trig-cart-24hr',
    name: 'Abandoned Cart 24-Hour Creator Review Highlights',
    type: 'abandoned_cart',
    triggerCondition: 'Cart uncompleted after 24 hours',
    delayHours: 24,
    channel: 'email',
    subject: 'See what European filmmakers are capturing with {{primaryCartItem}}',
    previewText: '4.9/5 stars from 850+ European creators. 14-day free returns included.',
    contentTemplate: 'See aerial 4K HDR footage samples and creator benchmarks before your stock reservation expires.',
    isActive: true,
    totalSent: 1120,
    openRate: 44.2,
    clickRate: 14.6,
    conversionRate: 8.2,
    revenueGeneratedEur: 21400
  },
  {
    id: 'trig-cart-72hr',
    name: 'Abandoned Cart 72-Hour €25 Loyalty Incentive',
    type: 'abandoned_cart',
    triggerCondition: 'Cart uncompleted after 72 hours',
    delayHours: 72,
    channel: 'email',
    subject: 'Special pilot invitation: €25 voucher on your cart inside',
    previewText: 'Use voucher CODE: FLY25NOW before European depot allocation releases.',
    contentTemplate: 'Enjoy €25 off your reserved order. Enter FLY25NOW during checkout.',
    isActive: true,
    totalSent: 940,
    openRate: 49.0,
    clickRate: 19.5,
    conversionRate: 11.4,
    revenueGeneratedEur: 36800
  },
  {
    id: 'trig-browse-48hr',
    name: 'Browse Abandonment — Flagship Specs & Showcase',
    type: 'browse_abandonment',
    triggerCondition: 'Product viewed 3+ times, no add-to-cart in 48h',
    delayHours: 48,
    channel: 'email',
    subject: 'Discover why {{viewedProduct}} sets the European benchmark',
    previewText: 'EASA C1 compliance guide, Hasselblad color science, and 45-min flight time breakdown.',
    contentTemplate: 'Compare {{viewedProduct}} side-by-side with our interactive drone comparison suite.',
    isActive: true,
    totalSent: 2310,
    openRate: 51.2,
    clickRate: 16.8,
    conversionRate: 6.4,
    revenueGeneratedEur: 18500
  },
  {
    id: 'trig-day14-guide',
    name: 'Day 14 Post-Purchase EASA Compliance & Flight Guide',
    type: 'post_purchase_lifecycle',
    triggerCondition: '14 days post delivery confirmation',
    delayHours: 336,
    channel: 'email',
    subject: 'Master your new {{ownedProduct}}: Free European Flight Guide',
    previewText: 'Download airspace registration guidelines, DJI Fly setup tips, and cinematography LUTs.',
    contentTemplate: 'Congratulations on 2 weeks with your {{ownedProduct}}! Access your pilot resource pack.',
    isActive: true,
    totalSent: 3400,
    openRate: 68.7,
    clickRate: 38.2,
    conversionRate: 12.0,
    revenueGeneratedEur: 0
  },
  {
    id: 'trig-day30-review',
    name: 'Day 30 Verified Review Request (+500 Reward Points)',
    type: 'post_purchase_lifecycle',
    triggerCondition: '30 days post delivery confirmation',
    delayHours: 720,
    channel: 'email',
    subject: 'Share your aerial flight experience and earn 500 Loyalty Points',
    previewText: 'Help the European DJI community. Add photo/video for an extra 500 bonus points.',
    contentTemplate: 'Rate your {{ownedProduct}} on djii.eu and unlock immediate points towards free accessories.',
    isActive: true,
    totalSent: 2980,
    openRate: 62.1,
    clickRate: 29.4,
    conversionRate: 24.5,
    revenueGeneratedEur: 0
  },
  {
    id: 'trig-day90-accessories',
    name: 'Day 90 Intelligent Battery & ND Filter Upsell',
    type: 'care_plan_upsell',
    triggerCondition: '90 days post drone delivery, no extra batteries owned',
    delayHours: 2160,
    channel: 'email',
    subject: 'Extend your flight time: Official Intelligent Batteries in stock',
    previewText: 'Special 10% loyalty bundle discount on ND Filter sets and Two-Way Charging Hubs.',
    contentTemplate: 'Double your airtime with European Depot-certified Intelligent Flight Batteries for {{ownedProduct}}.',
    isActive: true,
    totalSent: 2650,
    openRate: 41.5,
    clickRate: 15.2,
    conversionRate: 9.8,
    revenueGeneratedEur: 54200
  },
  {
    id: 'trig-day300-care',
    name: 'Day 300 DJI Care Refresh Renewal & Health Check',
    type: 'warranty_renewal',
    triggerCondition: '60 days before 1-Year Care Refresh expiry',
    delayHours: 7200,
    channel: 'email',
    subject: 'Your DJI Care Refresh protection expires soon — Renew for Year 2',
    previewText: 'Maintain full accidental crash and flyaway replacement coverage with one click.',
    contentTemplate: 'Keep your {{ownedProduct}} protected across Europe with zero deductible renewal rates.',
    isActive: true,
    totalSent: 1420,
    openRate: 55.8,
    clickRate: 27.6,
    conversionRate: 18.2,
    revenueGeneratedEur: 29100
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-spring-2026',
    title: 'Spring 2026 Flight Season — Flagship Gear Upgrade',
    targetAudience: 'high_value',
    audienceCount: 1482,
    channel: 'multi_channel',
    status: 'completed',
    subject: 'Exclusive VIP Preview: Spring Aerial Cinematography Kit',
    content: 'Special invitation for Professional & Enterprise Pilots. Upgrade to the Mavic 4 Pro with complimentary ND Filter Kit and priority DHL Express Air dispatch.',
    incentiveVoucher: 'SPRING-VIP-100',
    sentCount: 1482,
    openRate: 52.6,
    clickRate: 18.4,
    revenueGeneratedEur: 82944,
    launchedAt: '2026-03-15T08:30:00Z'
  },
  {
    id: 'camp-winback-pilots',
    title: 'Dormant Pilots Re-engagement — €25 Propeller Voucher',
    targetAudience: 'inactive_pilots',
    audienceCount: 840,
    channel: 'email',
    status: 'completed',
    subject: 'We miss your flights: Claim your €25 Season Kickoff Credit',
    content: 'It has been a while since your last flight! Renew your gear for the new season with a €25 store voucher valid across our full European catalog.',
    incentiveVoucher: 'PILOT-RESTART-25',
    sentCount: 840,
    openRate: 38.2,
    clickRate: 12.1,
    revenueGeneratedEur: 19200,
    launchedAt: '2026-03-25T11:00:00Z'
  },
  {
    id: 'camp-battery-bundle',
    title: 'Summer Endurance Bundle — Intelligent Batteries & Hubs',
    targetAudience: 'accessory_buyers',
    audienceCount: 2190,
    channel: 'email',
    status: 'running',
    subject: 'Triple your flight sessions with Official Flight Batteries',
    content: 'Stock up for European summer road trips. Enjoy 15% off when bundling 2+ Intelligent Flight Batteries with a Fast Charging Hub.',
    incentiveVoucher: 'SUMMER-POWER-15',
    sentCount: 2190,
    openRate: 46.1,
    clickRate: 17.5,
    revenueGeneratedEur: 48150,
    launchedAt: '2026-04-01T09:00:00Z'
  }
];

export const INITIAL_CDP_EVENTS: CdpEvent[] = [
  {
    id: 'cdp-evt-101',
    customerId: 'cust-lukas-weber',
    customerEmail: 'lukas.weber@creatives.de',
    sessionId: 'sess-8942-de',
    eventType: 'payment_completed',
    timestamp: '2026-04-12T14:22:10Z',
    metadata: {
      orderNumber: 'DJI-EU-100239',
      totalEur: 2998,
      currency: 'EUR',
      paymentMethod: 'sepa_bank_wire',
      itemsCount: 2
    },
    scoreDelta: 100
  },
  {
    id: 'cdp-evt-102',
    customerId: 'cust-lukas-weber',
    customerEmail: 'lukas.weber@creatives.de',
    sessionId: 'sess-8942-de',
    eventType: 'warranty_registered',
    timestamp: '2026-04-12T14:35:00Z',
    metadata: {
      serialNumber: '1581F6XBC2304910',
      productName: 'DJI Mavic 4 Pro'
    },
    scoreDelta: 50
  },
  {
    id: 'cdp-evt-103',
    customerId: 'cust-elena-rossi',
    customerEmail: 'elena.rossi@skycine.it',
    sessionId: 'sess-3391-it',
    eventType: 'product_compared',
    timestamp: '2026-04-11T16:10:45Z',
    metadata: {
      comparedSkus: ['DJI-M4P-FMC-RC2', 'DJI-INS3-8K-PRO']
    },
    scoreDelta: 15
  },
  {
    id: 'cdp-evt-104',
    customerId: 'cust-mateo-fernandez',
    customerEmail: 'mateo.f@madrid-drones.es',
    sessionId: 'sess-1940-es',
    eventType: 'review_submitted',
    timestamp: '2026-04-09T18:40:12Z',
    metadata: {
      productSku: 'DJI-AIR3S-FMC',
      rating: 5,
      hasMedia: true
    },
    scoreDelta: 50
  },
  {
    id: 'cdp-evt-105',
    sessionId: 'sess-anon-7819',
    customerEmail: 'alex.k@vienna-video.at',
    eventType: 'add_to_cart',
    timestamp: '2026-04-13T09:15:22Z',
    metadata: {
      sku: 'DJI-OP3-CREATOR-COMBO',
      priceEur: 679
    },
    scoreDelta: 25
  },
  {
    id: 'cdp-evt-106',
    sessionId: 'sess-anon-7819',
    customerEmail: 'alex.k@vienna-video.at',
    eventType: 'checkout_started',
    timestamp: '2026-04-13T09:18:00Z',
    metadata: {
      step: 'shipping_address',
      country: 'AT'
    },
    scoreDelta: 40
  },
  {
    id: 'cdp-evt-107',
    customerId: 'cust-lukas-weber',
    customerEmail: 'lukas.weber@creatives.de',
    sessionId: 'sess-8942-de',
    eventType: 'flight_club_joined',
    timestamp: '2026-04-01T10:00:00Z',
    metadata: {
      pilotHandle: 'SkyLukas_DE',
      tier: 'Advanced'
    },
    scoreDelta: 30
  }
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-1',
    referrerCustomerId: 'cust-lukas-weber',
    refereeEmail: 'thomas.mueller@bavaria-cine.de',
    refereeName: 'Thomas Müller',
    status: 'ordered',
    voucherCode: 'REF-LUKAS-TM99',
    orderNumber: 'DJI-EU-100412',
    pointsAwarded: 500,
    createdAt: '2026-03-15',
    completedAt: '2026-03-20'
  },
  {
    id: 'ref-2',
    referrerCustomerId: 'cust-lukas-weber',
    refereeEmail: 'felix.s@alpinedrones.at',
    refereeName: 'Felix Schneider',
    status: 'rewarded',
    voucherCode: 'REF-LUKAS-FS12',
    orderNumber: 'DJI-EU-100588',
    pointsAwarded: 500,
    createdAt: '2026-03-22',
    completedAt: '2026-03-28'
  },
  {
    id: 'ref-3',
    referrerCustomerId: 'cust-lukas-weber',
    refereeEmail: 'sarah.k@berlin-aerials.de',
    refereeName: 'Sarah Krause',
    status: 'registered',
    voucherCode: 'REF-LUKAS-SK44',
    pointsAwarded: 0,
    createdAt: '2026-04-05'
  }
];

// Helper Functions
export function computeLeadCategory(score: number): 'cold' | 'warm' | 'hot' | 'vip' {
  if (score >= 500) return 'vip';
  if (score >= 250) return 'hot';
  if (score >= 100) return 'warm';
  return 'cold';
}

export function determineLoyaltyTier(ltvEur: number): LoyaltyTier {
  if (ltvEur >= 20000) return 'enterprise';
  if (ltvEur >= 5000) return 'professional';
  if (ltvEur >= 1000) return 'advanced';
  return 'pilot';
}

export function getTierPerks(tier: LoyaltyTier): string[] {
  switch (tier) {
    case 'enterprise':
      return [
        'Dedicated Enterprise Key Account Director',
        'Custom European Fleet Net Pricing',
        'Direct Engineering Firmware Escalation',
        'On-Site Hardware Swap Guarantee in 24h',
        'Private Product Briefings in Frankfurt HQ'
      ];
    case 'professional':
      return [
        'Exclusive Launch Invitations (Berlin/Paris Gala)',
        '10% Care Refresh & Accessory Discount',
        'Extended 30-Day European Return Window',
        'Dedicated VIP Account Executive'
      ];
    case 'advanced':
      return [
        'Early Product Access 48h Prior to Launch',
        '5% Exclusive Accessory Discount',
        'Priority Technical Support Queue',
        'Flight Club Creator Verified Badge'
      ];
    case 'pilot':
    default:
      return [
        'Priority European Firmware Bulletins',
        'DJI Flight Club Community Membership',
        'Verified Product Review Points Rewards'
      ];
  }
}

export function getTierThreshold(tier: LoyaltyTier): { min: number; max: number; label: string; nextTier?: LoyaltyTier } {
  switch (tier) {
    case 'pilot':
      return { min: 0, max: 999, label: '€0 - €999', nextTier: 'advanced' };
    case 'advanced':
      return { min: 1000, max: 4999, label: '€1,000 - €4,999', nextTier: 'professional' };
    case 'professional':
      return { min: 5000, max: 19999, label: '€5,000 - €19,999', nextTier: 'enterprise' };
    case 'enterprise':
      return { min: 20000, max: 100000, label: '€20,000+', nextTier: undefined };
  }
}

export const getNextTierThreshold = getTierThreshold;

export function segmentCustomers(
  customers: CustomerProfile[],
  segment: 'all' | 'high_value' | 'inactive_pilots' | 'accessory_buyers' | 'care_plan_eligible' | 'warranty_expiring' | 'flight_club_vip'
): CustomerProfile[] {
  switch (segment) {
    case 'high_value':
      return customers.filter((c) => c.lifetimeValueEur >= 5000 || c.loyaltyTier === 'professional' || c.loyaltyTier === 'enterprise');
    case 'inactive_pilots':
      return customers.filter((c) => c.healthStatus === 'at_risk' || c.healthStatus === 'dormant' || c.leadCategory === 'cold');
    case 'accessory_buyers':
      return customers.filter((c) => c.ownedProducts.some((p) => p.includes('mavic') || p.includes('air') || p.includes('mini')));
    case 'care_plan_eligible':
      return customers.filter((c) => c.ownedProducts.length > 0 && !c.ownedProducts.some((p) => p.includes('care')));
    case 'warranty_expiring':
      return customers.filter((c) => c.lifetimeValueEur > 0);
    case 'flight_club_vip':
      return customers.filter((c) => c.flightClubMember && (c.leadCategory === 'vip' || c.loyaltyTier === 'advanced' || c.loyaltyTier === 'professional'));
    case 'all':
    default:
      return customers;
  }
}

export function getPersonalizedRecommendations(
  ownedProductSlugs: string[] = [],
  cartProductSlugs: string[] = []
): { title: string; subtitle: string; products: Product[] }[] {
  const allRelated = new Set([...ownedProductSlugs, ...cartProductSlugs]);

  const sections: { title: string; subtitle: string; products: Product[] }[] = [];

  // Section 1: Power & Endurance (Batteries & Charging Hubs)
  const powerCare = DJI_PRODUCTS.filter((p) => p.category === 'power-care' || p.category === 'accessories');
  if (powerCare.length > 0) {
    sections.push({
      title: '🔋 Recommended Power & Extended Airtime',
      subtitle: 'Official DJI Intelligent Flight Batteries and Multi-Battery Fast Hubs matched to your fleet.',
      products: powerCare.slice(0, 3)
    });
  }

  // Section 2: Cinema Optics & Precision Audio
  const accessories = DJI_PRODUCTS.filter((p) => p.category === 'accessories' || p.category === 'handheld');
  if (accessories.length > 0) {
    sections.push({
      title: '🎙️ Precision Cinematography & Audio Gear',
      subtitle: 'Complement your aerial footage with studio-grade wireless mics and handheld gimbals.',
      products: accessories.slice(0, 3)
    });
  }

  // Section 3: Flagship Next-Gen Drones
  const drones = DJI_PRODUCTS.filter((p) => p.category === 'camera-drones' && !allRelated.has(p.id));
  if (drones.length > 0) {
    sections.push({
      title: '✨ Flagship Aerial Ecosystem Upgrades',
      subtitle: 'Explore European C1-certified triple-camera systems and Hasselblad optical sensors.',
      products: drones.slice(0, 3)
    });
  }

  return sections;
}

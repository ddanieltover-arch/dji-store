import { Product } from '../types';

const GALLERY = [
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80'
];

export function sku(partial: Omit<Product, 'images' | 'variants' | 'features' | 'specifications' | 'rating' | 'reviewCount'> & Partial<Pick<Product, 'images' | 'variants' | 'features' | 'specifications' | 'rating' | 'reviewCount'>>): Product {
  return {
    rating: 4.7,
    reviewCount: 64,
    images: {
      hero: `/products/${partial.id}-cutout.png`,
      cutout: `/products/${partial.id}-cutout.png`,
      gallery: [`/products/${partial.id}-cutout.png`, ...GALLERY]
    },
    variants: [
      {
        id: `var-${partial.id}-std`,
        sku: `${partial.sku}-STD`,
        comboName: 'Standard',
        priceEur: partial.basePriceEur,
        weightGrams: partial.weightGrams,
        inStock: true,
        stockQuantity: 28,
        includedItems: [partial.modelName, '2-Year Official EU Warranty']
      }
    ],
    features: [
      {
        title: 'Official DJI Store EU',
        description: 'Mapped from the canonical store.dji.com catalog into the certified PIM.'
      }
    ],
    specifications: [
      {
        groupName: 'Aircraft',
        attributes: [
          { name: 'Weight', value: `${partial.weightGrams} g`, isHighlight: true },
          ...(partial.easaClass ? [{ name: 'EASA Class', value: partial.easaClass, isHighlight: true }] : [])
        ]
      }
    ],
    ...partial
  };
}

/** Additional official-store SKUs published into the existing DJI_PRODUCTS catalog. */
export const OFFICIAL_STORE_EXPANSION: Product[] = [
  sku({
    id: 'prod-neo',
    sku: 'DJI-DRONE-NEO',
    slug: 'dji-neo',
    modelName: 'DJI Neo',
    series: 'Neo',
    category: 'camera-drones',
    categoryLabel: 'Selfie & Beginner Drone',
    tagline: 'Palm Takeoff. Cinematic Vlog in Your Pocket.',
    description:
      'Ultra-light palm takeoff drone for European beginners. Sub-250g class with voice control, subject tracking, and 4K video — no remote required for first flights.',
    basePriceEur: 199,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 18,
    weightGrams: 135,
    cameraSensor: '1/2" CMOS',
    maxVideoRes: '4K/30fps',
    transmissionRangeKm: 10,
    isNew: true,
    isBestSeller: true,
    compatibleAccessories: ['acc-bat-neo', 'acc-props-neo', 'prod-goggles-n3'],
    variants: [
      {
        id: 'var-neo-std',
        sku: 'DJI-NEO-STD',
        comboName: 'Standard',
        priceEur: 199,
        weightGrams: 135,
        inStock: true,
        stockQuantity: 80,
        includedItems: ['DJI Neo Aircraft', 'Spare props', 'USB-C cable']
      },
      {
        id: 'var-neo-fmc',
        sku: 'DJI-NEO-FMC',
        comboName: 'Fly More Combo',
        priceEur: 309,
        weightGrams: 135,
        inStock: true,
        stockQuantity: 45,
        includedItems: ['DJI Neo', 'RC-N3', '2 extra batteries', 'Charging hub', 'Bag']
      }
    ]
  }),
  sku({
    id: 'prod-flip',
    sku: 'DJI-DRONE-FLIP',
    slug: 'dji-flip',
    modelName: 'DJI Flip',
    series: 'Flip',
    category: 'camera-drones',
    categoryLabel: 'Foldable Travel Drone',
    tagline: 'Flip. Fly. Share — Full-Coverage Props.',
    description: 'Compact foldable drone with full propeller guards, 4K imaging, and C0-friendly weight for EU travel without a remote-pilot exam.',
    basePriceEur: 439,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 31,
    weightGrams: 249,
    cameraSensor: '1/1.3" CMOS',
    maxVideoRes: '4K/60fps',
    transmissionRangeKm: 13,
    isNew: true,
    compatibleAccessories: ['acc-nd-flip', 'acc-bat-mini']
  }),
  sku({
    id: 'prod-mini-4k',
    sku: 'DJI-DRONE-MINI4K',
    slug: 'dji-mini-4k',
    modelName: 'DJI Mini 4K',
    series: 'Mini',
    category: 'camera-drones',
    categoryLabel: 'Entry Camera Drone',
    tagline: '4K Aerials Under 249g.',
    description: 'The accessible Mini with 4K video, 31-minute flights, and license-free C0 operations across the EU.',
    basePriceEur: 339,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 31,
    weightGrams: 249,
    cameraSensor: '1/2.3" CMOS',
    maxVideoRes: '4K/30fps',
    transmissionRangeKm: 10,
    isBestSeller: true
  }),
  sku({
    id: 'prod-mini-3',
    sku: 'DJI-DRONE-MINI3',
    slug: 'dji-mini-3',
    modelName: 'DJI Mini 3',
    series: 'Mini',
    category: 'camera-drones',
    categoryLabel: 'Travel Camera Drone',
    tagline: 'True Vertical 4K. True Lightweight.',
    description: 'True vertical shooting, 38-minute flight time class, and under-249g C0 compliance for European holidays.',
    basePriceEur: 419,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 38,
    weightGrams: 248,
    cameraSensor: '1/1.3" CMOS',
    maxVideoRes: '4K/30fps',
    transmissionRangeKm: 10
  }),
  sku({
    id: 'prod-air-3',
    sku: 'DJI-DRONE-AIR3',
    slug: 'dji-air-3',
    modelName: 'DJI Air 3',
    series: 'Air',
    category: 'camera-drones',
    categoryLabel: 'Dual-Camera Travel Drone',
    tagline: 'Dual Primary Cameras. Dual Adventure.',
    description: 'Wide + 3x medium tele cameras, omnidirectional sensing, and O4 transmission for serious travel filmmaking in C1 class.',
    basePriceEur: 1099,
    easaClass: 'C1',
    flightTimeMinutes: 46,
    weightGrams: 720,
    cameraSensor: 'Dual 1/1.3" CMOS',
    maxVideoRes: '4K/60fps HDR',
    transmissionRangeKm: 20
  }),
  sku({
    id: 'prod-mavic-3-pro',
    sku: 'DJI-DRONE-M3P',
    slug: 'dji-mavic-3-pro',
    modelName: 'DJI Mavic 3 Pro',
    series: 'Mavic',
    category: 'camera-drones',
    categoryLabel: 'Triple-Camera Flagship',
    tagline: 'Hasselblad Triple Cam. Cinema Reach.',
    description: 'Hasselblad wide plus dual telephoto cameras with Apple ProRes option on Cine, C2 class for European professional ops.',
    basePriceEur: 1899,
    easaClass: 'C2',
    flightTimeMinutes: 43,
    weightGrams: 958,
    cameraSensor: '4/3 Hasselblad + Dual Tele',
    maxVideoRes: '5.1K/50fps',
    transmissionRangeKm: 15,
    variants: [
      {
        id: 'var-m3p-std',
        sku: 'DJI-M3P-STD',
        comboName: 'Standard',
        priceEur: 1899,
        weightGrams: 958,
        inStock: true,
        stockQuantity: 12,
        includedItems: ['Mavic 3 Pro', 'RC-N1', '1 battery']
      },
      {
        id: 'var-m3p-cine',
        sku: 'DJI-M3P-CINE',
        comboName: 'Cine',
        priceEur: 4199,
        weightGrams: 958,
        inStock: true,
        stockQuantity: 4,
        includedItems: ['Mavic 3 Pro Cine', '1TB SSD', 'ProRes']
      }
    ]
  }),
  sku({
    id: 'prod-avata',
    sku: 'DJI-DRONE-AVATA',
    slug: 'dji-avata',
    modelName: 'DJI Avata',
    series: 'Avata',
    category: 'camera-drones',
    categoryLabel: 'Immersive FPV',
    tagline: 'The Original Immersive FPV Experience.',
    description: 'Protective ducted fans, 4K/60fps Super-Wide, and Motion Controller compatibility for indoor and cinematic FPV.',
    basePriceEur: 429,
    easaClass: 'C1',
    flightTimeMinutes: 18,
    weightGrams: 410,
    cameraSensor: '1/1.7" CMOS',
    maxVideoRes: '4K/60fps',
    transmissionRangeKm: 10
  }),
  sku({
    id: 'prod-goggles-3',
    sku: 'DJI-ACC-GOGGLES3',
    slug: 'dji-goggles-3',
    modelName: 'DJI Goggles 3',
    series: 'Avata',
    category: 'accessories',
    categoryLabel: 'FPV Goggles',
    tagline: 'Micro-OLED. Real-Time Immersion.',
    description: 'High-performance FPV goggles for Avata 2 / Neo with micro-OLED panels and low-latency O4 video.',
    basePriceEur: 549,
    weightGrams: 470
  }),
  sku({
    id: 'prod-goggles-n3',
    sku: 'DJI-ACC-GOGGLESN3',
    slug: 'dji-goggles-n3',
    modelName: 'DJI Goggles N3',
    series: 'Avata',
    category: 'accessories',
    categoryLabel: 'FPV Goggles',
    tagline: 'Lightweight Immersive Entry.',
    description: 'Accessible FPV goggles for first-person Neo and Avata flights.',
    basePriceEur: 199,
    weightGrams: 320
  }),
  sku({
    id: 'prod-rc-motion-3',
    sku: 'DJI-ACC-MOTION3',
    slug: 'dji-rc-motion-3',
    modelName: 'DJI RC Motion 3',
    series: 'Avata',
    category: 'accessories',
    categoryLabel: 'Motion Controller',
    tagline: 'Point. Fly. Film.',
    description: 'Third-generation motion controller for intuitive FPV without a traditional stick radio.',
    basePriceEur: 159,
    weightGrams: 165
  }),
  sku({
    id: 'prod-osmo-mobile-7',
    sku: 'DJI-OSMO-M7',
    slug: 'dji-osmo-mobile-7',
    modelName: 'DJI Osmo Mobile 7',
    series: 'Mobile',
    category: 'handheld',
    categoryLabel: 'Smartphone Gimbal',
    tagline: 'Stabilized Phone Cinema. Magnetic Mount.',
    description: 'Next-gen smartphone gimbal with ActiveTrack, 3-axis stabilization, and EU travel-ready fold.',
    basePriceEur: 159,
    weightGrams: 365,
    isBestSeller: true
  }),
  sku({
    id: 'prod-osmo-360',
    sku: 'DJI-OSMO-360',
    slug: 'dji-osmo-360',
    modelName: 'DJI Osmo 360',
    series: 'Osmo360',
    category: 'handheld',
    categoryLabel: '360 Camera',
    tagline: '8K 360. Invisible Selfie Stick Ready.',
    description: 'Dual-lens 360 camera for European creators — 8K capture, waterproof housing options, and DJI Mic pairing.',
    basePriceEur: 499,
    weightGrams: 183,
    maxVideoRes: '8K 360',
    isNew: true,
    isFeatured: true
  }),
  sku({
    id: 'prod-osmo-action-4',
    sku: 'DJI-OSMO-A4',
    slug: 'dji-osmo-action-4',
    modelName: 'DJI Osmo Action 4',
    series: 'Action',
    category: 'handheld',
    categoryLabel: 'Action Camera',
    tagline: '1/1.3" Sensor. Colour in the Cold.',
    description: 'Flagship predecessor action cam still in EU stock — 4K/120fps, 10-bit D-Log M, rock-climbing and ski ready.',
    basePriceEur: 329,
    weightGrams: 145,
    cameraSensor: '1/1.3" CMOS',
    maxVideoRes: '4K/120fps'
  }),
  sku({
    id: 'prod-mic-mini',
    sku: 'DJI-MIC-MINI',
    slug: 'dji-mic-mini',
    modelName: 'DJI Mic Mini',
    series: 'Mic',
    category: 'handheld',
    categoryLabel: 'Wireless Microphone',
    tagline: 'Tiny Lav. Huge Clarity.',
    description: 'Ultra-compact wireless mic for phones and cameras, EU 2.4 GHz, all-day creator audio.',
    basePriceEur: 89,
    weightGrams: 10,
    isBestSeller: true
  }),
  sku({
    id: 'prod-mic-2',
    sku: 'DJI-MIC-2',
    slug: 'dji-mic-2',
    modelName: 'DJI Mic 2',
    series: 'Mic',
    category: 'handheld',
    categoryLabel: 'Wireless Microphone',
    tagline: '32-bit Float. Dual Channel.',
    description: 'Creator microphone with 32-bit float internal recording and two-person interviews.',
    basePriceEur: 249,
    weightGrams: 28
  }),
  sku({
    id: 'prod-power-1000',
    sku: 'DJI-PWR-1000',
    slug: 'dji-power-1000',
    modelName: 'DJI Power 1000',
    series: 'Power',
    category: 'power',
    categoryLabel: 'Portable Power Station',
    tagline: '1024 Wh. Charge the Whole Crew.',
    description: 'Portable power station for field cinema and outdoor EU events — solar-ready, quiet inverter.',
    basePriceEur: 999,
    weightGrams: 13000
  }),
  sku({
    id: 'prod-matrice-4t',
    sku: 'DJI-ENT-M4T',
    slug: 'dji-matrice-4t',
    modelName: 'DJI Matrice 4T',
    series: 'Inspire',
    category: 'professional',
    categoryLabel: 'Enterprise Thermal',
    tagline: 'Thermal + Zoom. Public Safety EU.',
    description: 'Enterprise quad with thermal and tele cameras for inspection, fire, and search missions. Sold as B2B with EASA specific-category guidance.',
    basePriceEur: 5899,
    easaClass: 'Open Category',
    flightTimeMinutes: 49,
    weightGrams: 1210,
    cameraSensor: 'Wide + Tele + Thermal',
    maxVideoRes: '4K inspection',
    transmissionRangeKm: 25
  }),
  sku({
    id: 'acc-nd-mini',
    sku: 'DJI-ACC-ND-MINI',
    slug: 'dji-nd-filter-set-mini',
    modelName: 'DJI ND Filter Set (Mini Series)',
    series: 'Mini',
    category: 'accessories',
    categoryLabel: 'Filters',
    tagline: 'ND 8/16/32/64 for Mini.',
    description: 'Official ND set for Mini 4 Pro / Mini 4K European daylight control.',
    basePriceEur: 79,
    weightGrams: 40
  }),
  sku({
    id: 'acc-props-neo',
    sku: 'DJI-ACC-PROP-NEO',
    slug: 'dji-neo-propellers',
    modelName: 'DJI Neo Propellers (Pair)',
    series: 'Neo',
    category: 'accessories',
    categoryLabel: 'Replacement Parts',
    tagline: 'Quiet props. Quick swap.',
    description: 'Replacement low-noise propeller pairs for DJI Neo.',
    basePriceEur: 12,
    weightGrams: 8
  }),
  sku({
    id: 'acc-hub-air',
    sku: 'DJI-ACC-HUB-AIR',
    slug: 'dji-air-3-battery-charging-hub',
    modelName: 'DJI Air 3 Battery Charging Hub',
    series: 'Air',
    category: 'accessories',
    categoryLabel: 'Charging',
    tagline: 'Sequential Fast Charge.',
    description: 'Official charging hub for Air 3 / Air 3S intelligent batteries.',
    basePriceEur: 69,
    weightGrams: 210
  }),
  sku({
    id: 'prod-rs4',
    sku: 'DJI-RS4',
    slug: 'dji-rs-4',
    modelName: 'DJI RS 4',
    series: 'Ronin',
    category: 'handheld',
    categoryLabel: 'Camera Gimbal',
    tagline: '2nd-Gen Balancing. Native Vertical.',
    description: 'RS 4 3-axis gimbal for mirrorless cinema — native vertical, Teflon axis arms, EU power standards.',
    basePriceEur: 549,
    weightGrams: 1066
  })
];

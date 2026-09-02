import { Product } from '../types';
import { OFFICIAL_STORE_EXPANSION } from './officialStoreCatalog';
import { WAVE2_OFFICIAL_EXPANSION } from './wave2OfficialCatalog';
import { NAV_CATALOG_EXPANSION } from './catalog/navCatalog';
import { WAVE4_OFFICIAL_EXPANSION } from './wave4OfficialCatalog';
import { WAVE5_OFFICIAL_EXPANSION } from './wave5OfficialCatalog';
import { WAVE6_OFFICIAL_EXPANSION } from './wave6OfficialCatalog';
import officialUsdPriceCache from './officialUsdPriceCache.json';
import officialStoreMediaCache from './officialStoreMediaCache.json';
import productDatabaseMediaCache from './productDatabaseMediaCache.json';
import { applyUsdPricingToProducts } from '../lib/pricing/applyUsdPricing';
import type { OfficialUsdPriceCache } from '../lib/pricing/applyUsdPricing';
import { applyCatalogPresentation } from '../lib/pim/catalogPresentation';
import type { OfficialStoreMediaCache } from '../lib/pim/fetchOfficialStoreMedia';
import type { DatabaseMediaCache } from '../lib/pim/databaseMediaCache';
import { applyWave6EnrichmentToCatalog } from '../lib/pim/wave6CategoryExpansion';

const RAW_DJI_PRODUCTS_SEED: Product[] = [
  {
    id: 'prod-mavic-4-pro',
    sku: 'DJI-DRONE-M4P',
    slug: 'dji-mavic-4-pro',
    modelName: 'DJI Mavic 4 Pro',
    series: 'Mavic',
    category: 'camera-drones',
    categoryLabel: 'Flagship Camera Drone',
    tagline: 'Master Every Angle in 8K HDR',
    description:
      'The definitive flagship aerial imaging tool. Powered by a triple-camera system with a 4/3 CMOS Hasselblad sensor, 46-minute maximum flight time, and omnidirectional obstacle sensing with APAS 5.0. Engineered for European airspace with Class C1 certification.',
    basePriceEur: 2099,
    compareAtPriceEur: 2299,
    badgeLabel: 'New 2026 Flagship',
    easaClass: 'C1',
    flightTimeMinutes: 46,
    weightGrams: 958,
    cameraSensor: '4/3 CMOS Hasselblad + Dual Telephoto',
    maxVideoRes: '8K/60fps HDR, 4K/120fps, Apple ProRes 422 HQ',
    transmissionRangeKm: 20,
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    images: {
      hero: '/products/prod-mavic-4-pro-cutout.png',
      cutout: '/products/prod-mavic-4-pro-cutout.png',
      gallery: ['/products/prod-mavic-4-pro-cutout.png']
    },
    variants: [
      {
        id: 'var-m4p-std',
        sku: 'DJI-M4P-STD',
        comboName: 'Standard Package (DJI RC-N3)',
        tagline: 'Connect your smartphone with 20km transmission',
        priceEur: 2099,
        weightGrams: 958,
        inStock: true,
        stockQuantity: 24,
        includedItems: [
          'DJI Mavic 4 Pro Aircraft',
          'DJI RC-N3 Smartphone Remote Controller',
          '1x Intelligent Flight Battery (5000 mAh)',
          '3x Low-Noise Propeller Pairs (Model 9453F)',
          'Gimbal & Vision Sensor Storage Cover',
          'Type-C to Type-C High-Speed Cable',
          '2-Year Official EU Statutory Warranty Card'
        ]
      },
      {
        id: 'var-m4p-fmc',
        sku: 'DJI-M4P-FMC-RC2',
        comboName: 'Fly More Combo (DJI RC 2)',
        tagline: 'Most Popular: 700-Nit FHD Screen Remote + 3 Batteries',
        priceEur: 2699,
        weightGrams: 958,
        inStock: true,
        stockQuantity: 18,
        includedItems: [
          'DJI Mavic 4 Pro Aircraft',
          'DJI RC 2 Remote (5.5" 1080p 700-Nit High-Bright Screen)',
          '3x Intelligent Flight Batteries (5000 mAh)',
          '100W Parallel GaN Fast Battery Charging Hub',
          'Freewell All-Day ND Filter Set (ND8 / 16 / 32 / 64)',
          'Convertible Waterproof Shoulder Travel Bag',
          '6x Low-Noise Propeller Pairs',
          '65W GaN Travel Fast Charger'
        ]
      },
      {
        id: 'var-m4p-cine',
        sku: 'DJI-M4P-CINE-1TB',
        comboName: 'Cine Premium Combo (1TB SSD + ProRes)',
        tagline: 'Built-in 1TB NVMe SSD & Apple ProRes 422 HQ Studio Encoding',
        priceEur: 3599,
        weightGrams: 958,
        inStock: true,
        stockQuantity: 8,
        includedItems: [
          'DJI Mavic 4 Pro Cine Aircraft (Integrated 1TB NVMe SSD)',
          'DJI RC Pro Display Remote (1000-Nit Ultra-Bright Screen)',
          '3x Intelligent Flight Batteries + 100W GaN Charging Hub',
          '10Gbps Lightspeed PCIe Data Transfer Cable',
          'Freewell Pro Filter Kit (ND + CPL + Mist)',
          'Nanuk 935 IP67 Waterproof Hardcase with Laser Foam',
          'DJI Care Refresh 1-Year Comprehensive Protection Included'
        ]
      }
    ],
    features: [
      {
        title: 'Hasselblad 4/3 CMOS Sensor',
        description: '20MP natural color solution with f/2.8-f/11 adjustable aperture and 12.8 stops of dynamic range.'
      },
      {
        title: '8K/60fps HDR Cinema Video',
        description: 'Record broadcast-ready 10-bit D-Log M and HLG footage with zero rolling shutter artifacting.'
      },
      {
        title: 'DJI O4 Flagship Transmission',
        description: 'Up to 20 km range with crystal clear 1080p/60fps low-latency live feed in European CE environments.'
      },
      {
        title: 'Omnidirectional APAS 5.0',
        description: 'Six wide-angle vision sensors provide continuous active obstacle avoidance during high-speed tracking.'
      }
    ],
    specifications: [
      {
        groupName: 'Aircraft',
        attributes: [
          { name: 'Takeoff Weight', value: '958 g', isHighlight: true },
          { name: 'EU EASA Airspace Class', value: 'Class C1 Certified', isHighlight: true },
          { name: 'Max Flight Time', value: '46 Minutes', isHighlight: true },
          { name: 'Max Wind Resistance', value: '12 m/s (Scale 6 Strong Breeze)' },
          { name: 'Max Flight Speed', value: '21 m/s (75.6 km/h) Sport Mode' },
          { name: 'Internal Storage', value: '64 GB (Cine: 1TB NVMe SSD)' }
        ]
      },
      {
        groupName: 'Camera & Optics',
        attributes: [
          { name: 'Primary Camera', value: '4/3 CMOS Hasselblad L2D-20c, 24mm Eq.', isHighlight: true },
          { name: 'Medium Telephoto', value: '1/1.3-Inch CMOS 70mm Eq. (48 MP)' },
          { name: 'Telephoto Lens', value: '1/2-Inch CMOS 166mm Eq. (12 MP, 28x Hybrid Zoom)' },
          { name: 'Video Formats', value: '8K/60fps HDR, 4K/120fps, Apple ProRes 422 HQ' },
          { name: 'Color Profiles', value: '10-bit D-Log M, 10-bit HLG, 8-bit Normal' }
        ]
      },
      {
        groupName: 'Battery & Power',
        attributes: [
          { name: 'Battery Capacity', value: '5000 mAh (LiPo 4S)' },
          { name: 'Battery Weight', value: '335.5 g' },
          { name: 'Charging Temperature', value: '5° to 40° C' },
          { name: 'Recommended Charger', value: 'DJI 65W / 100W Portable GaN Charger' }
        ]
      }
    ],
    compatibleAccessories: ['acc-bat-m4p', 'acc-nd-m4p', 'acc-fmk-m4p', 'acc-rc2', 'acc-care-m4p']
  },
  {
    id: 'prod-air-3s',
    sku: 'DJI-DRONE-AIR3S',
    slug: 'dji-air-3s',
    modelName: 'DJI Air 3S',
    series: 'Air',
    category: 'camera-drones',
    categoryLabel: 'Dual-Primary Travel Drone',
    tagline: 'Dual 1-Inch Cameras for Panoramic Travel Cinema',
    description:
      'The quintessential dual-primary travel camera drone. Boasting a 1-inch CMOS primary wide sensor and a 70mm medium telephoto camera, nightscape omnidirectional sensing, and 45-minute flight stamina.',
    basePriceEur: 1099,
    compareAtPriceEur: 1199,
    badgeLabel: 'Top Travel Pick',
    easaClass: 'C1',
    flightTimeMinutes: 45,
    weightGrams: 724,
    cameraSensor: 'Dual 1-Inch CMOS (24mm + 70mm)',
    maxVideoRes: '4K/120fps HDR & 10-Bit D-Log M',
    transmissionRangeKm: 20,
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    isBestSeller: true,
    images: {
      hero: '/products/prod-air-3s-cutout.png',
      cutout: '/products/prod-air-3s-cutout.png',
      gallery: ['/products/prod-air-3s-cutout.png']
    },
    variants: [
      {
        id: 'var-air3s-std',
        sku: 'DJI-AIR3S-STD',
        comboName: 'Standard Package (DJI RC-N3)',
        tagline: 'Essential drone package with smartphone controller',
        priceEur: 1099,
        weightGrams: 724,
        inStock: true,
        stockQuantity: 32,
        includedItems: [
          'DJI Air 3S Aircraft',
          'DJI RC-N3 Smartphone Controller',
          '1x Intelligent Flight Battery',
          '3x Low-Noise Propellers',
          'Gimbal Protector',
          'EU Statutory Warranty'
        ]
      },
      {
        id: 'var-air3s-fmc',
        sku: 'DJI-AIR3S-FMC-RC2',
        comboName: 'Fly More Combo (DJI RC 2 Screen Remote)',
        tagline: 'Best Value: 3 Batteries + Screen Remote + ND Filters',
        priceEur: 1599,
        weightGrams: 724,
        inStock: true,
        stockQuantity: 28,
        includedItems: [
          'DJI Air 3S Aircraft',
          'DJI RC 2 Screen Remote (5.5" 1080p)',
          '3x Intelligent Flight Batteries',
          'Battery Charging Hub with Power Accumulation',
          'ND Filter Set (ND8/32/128)',
          'Shoulder Travel Bag',
          '6x Propeller Pairs'
        ]
      }
    ],
    features: [
      {
        title: 'Dual 1-Inch Primary Cameras',
        description: 'Seamlessly switch between 24mm wide epic landscapes and 70mm cinematic compressed portrait frames.'
      },
      {
        title: 'Nightscape Omnidirectional Sensing',
        description: 'Forward-facing LiDAR and vision sensors detect power lines and tree branches even during pitch dark.'
      },
      {
        title: '45-Min Extended Flight',
        description: 'Spend more time composing shots and less time managing battery swaps in the field.'
      }
    ],
    specifications: [
      {
        groupName: 'Aircraft',
        attributes: [
          { name: 'Takeoff Weight', value: '724 g', isHighlight: true },
          { name: 'EU EASA Class', value: 'Class C1 Certified', isHighlight: true },
          { name: 'Max Flight Time', value: '45 Minutes', isHighlight: true },
          { name: 'Max Wind Resistance', value: '12 m/s' }
        ]
      },
      {
        groupName: 'Camera',
        attributes: [
          { name: 'Wide Camera', value: '1-inch CMOS, 50 MP, 24mm Eq., f/1.8', isHighlight: true },
          { name: 'Medium Telephoto', value: '1/1.3-inch CMOS, 48 MP, 70mm Eq., f/2.8' },
          { name: 'Video Modes', value: '4K/120fps, 4K/60fps HDR, 10-bit D-Log M / HLG' }
        ]
      }
    ],
    compatibleAccessories: ['acc-bat-air', 'acc-nd-air', 'acc-hub-air', 'acc-care-air3s']
  },
  {
    id: 'prod-mini-4-pro',
    sku: 'DJI-DRONE-M4MINI',
    slug: 'dji-mini-4-pro',
    modelName: 'DJI Mini 4 Pro',
    series: 'Mini',
    category: 'camera-drones',
    categoryLabel: 'Ultralight Regulation-Free Drone',
    tagline: 'Under 249g Freedom: No Flight License Exam in EU',
    description:
      'The most advanced mini camera drone in the world. Weighing under 249 grams, it is classified under EASA Class C0, permitting legal flight in Open Category A1 without complex certifications across Europe.',
    basePriceEur: 799,
    compareAtPriceEur: 859,
    badgeLabel: '<249g No License',
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 34,
    weightGrams: 249,
    cameraSensor: '1/1.3-inch CMOS with Dual Native ISO',
    maxVideoRes: '4K/60fps HDR True Vertical Shooting',
    transmissionRangeKm: 20,
    rating: 4.9,
    reviewCount: 320,
    isFeatured: true,
    isBestSeller: true,
    images: {
      hero: '/products/prod-mini-4-pro-cutout.png',
      cutout: '/products/prod-mini-4-pro-cutout.png',
      gallery: ['/products/prod-mini-4-pro-cutout.png']
    },
    variants: [
      {
        id: 'var-mini4-std',
        sku: 'DJI-MINI4-STD',
        comboName: 'Standard Edition (DJI RC-N2)',
        tagline: 'Ultralight setup with smartphone controller',
        priceEur: 799,
        weightGrams: 249,
        inStock: true,
        stockQuantity: 45,
        includedItems: [
          'DJI Mini 4 Pro Aircraft',
          'DJI RC-N2 Smartphone Controller',
          '1x Intelligent Flight Battery (34 min)',
          'Spare Propellers',
          'Gimbal Protector',
          'EU Statutory Warranty'
        ]
      },
      {
        id: 'var-mini4-fmc',
        sku: 'DJI-MINI4-FMC-RC2',
        comboName: 'Fly More Combo (DJI RC 2 Screen Remote)',
        tagline: 'Top Pick: Screen remote, 3 batteries & charging hub',
        priceEur: 1129,
        weightGrams: 249,
        inStock: true,
        stockQuantity: 39,
        includedItems: [
          'DJI Mini 4 Pro Aircraft',
          'DJI RC 2 Remote (Built-in 5.5" 700-Nit FHD Screen)',
          '3x Intelligent Flight Batteries',
          'Two-Way Fast Charging Hub',
          'Shoulder Travel Bag',
          '6x Spare Propeller Pairs'
        ]
      }
    ],
    features: [
      {
        title: 'Regulation-Free <249g Weight',
        description: 'Complies with EASA Class C0 rules. Fly over people and urban open zones legally without mandatory flight exams.'
      },
      {
        title: 'True Vertical 4K/60 HDR',
        description: 'The camera physically rotates 90° for lossless social media content without digital cropping.'
      },
      {
        title: 'Omnidirectional Obstacle Sensing',
        description: 'Four wide-angle vision sensors provide 360° active tracking with intelligent flight path planning.'
      }
    ],
    specifications: [
      {
        groupName: 'Aircraft',
        attributes: [
          { name: 'Takeoff Weight', value: '< 249 g (Ready to Fly)', isHighlight: true },
          { name: 'EU EASA Airspace Class', value: 'Class C0 Certified', isHighlight: true },
          { name: 'Max Flight Time', value: '34 Minutes', isHighlight: true },
          { name: 'Max Wind Resistance', value: '10.7 m/s (Scale 5)' }
        ]
      },
      {
        groupName: 'Camera',
        attributes: [
          { name: 'Sensor', value: '1/1.3-inch CMOS, 48 MP, f/1.7', isHighlight: true },
          { name: 'Video Resolution', value: '4K/60fps HDR, 4K/100fps Slow Motion' },
          { name: 'Color Profile', value: '10-bit D-Log M, 10-bit HLG' }
        ]
      }
    ],
    compatibleAccessories: ['acc-bat-mini', 'acc-nd-mini', 'acc-fmk-mini', 'acc-care-mini']
  },
  {
    id: 'prod-avata-2',
    sku: 'DJI-DRONE-AVATA2',
    slug: 'dji-avata-2',
    modelName: 'DJI Avata 2',
    series: 'Avata',
    category: 'camera-drones',
    categoryLabel: 'Immersive FPV Drone',
    tagline: 'All-In FPV Flight Experience with Easy ACRO',
    description:
      'Delivers an adrenaline-pumping, immersive FPV drone experience with upgraded imaging, safety, and battery life. Flip, roll, and drift seamlessly with the DJI RC Motion 3 controller and DJI Goggles 3.',
    basePriceEur: 489,
    compareAtPriceEur: 529,
    badgeLabel: 'FPV Thrill',
    easaClass: 'C1',
    flightTimeMinutes: 23,
    weightGrams: 377,
    cameraSensor: '1/1.3-inch CMOS Super-Wide 155° FOV',
    maxVideoRes: '4K/60fps HDR Super-Wide',
    transmissionRangeKm: 13,
    rating: 4.8,
    reviewCount: 76,
    images: {
      hero: '/products/prod-avata-2-cutout.png',
      cutout: '/products/prod-avata-2-cutout.png',
      gallery: ['/products/prod-avata-2-cutout.png']
    },
    variants: [
      {
        id: 'var-avata2-std',
        sku: 'DJI-AVATA2-STD',
        comboName: 'Drone Only',
        tagline: 'Ideal if you already own Goggles 3 and Motion Controller',
        priceEur: 489,
        weightGrams: 377,
        inStock: true,
        stockQuantity: 15,
        includedItems: ['DJI Avata 2 Aircraft', '1x Flight Battery', '2x Propeller Pairs', 'Gimbal Protector']
      },
      {
        id: 'var-avata2-fmc',
        sku: 'DJI-AVATA2-FMC-3BAT',
        comboName: 'Fly More Combo (3 Batteries + Goggles 3)',
        tagline: 'Complete FPV Setup: Goggles 3, Motion 3 & 3 Batteries',
        priceEur: 999,
        weightGrams: 377,
        inStock: true,
        stockQuantity: 22,
        includedItems: [
          'DJI Avata 2 Aircraft',
          'DJI Goggles 3 with Real View PiP',
          'DJI RC Motion 3 One-Hand Controller',
          '3x Intelligent Flight Batteries',
          'Two-Way Charging Hub',
          'Sling Travel Bag'
        ]
      }
    ],
    features: [
      {
        title: 'Easy ACRO Stunts',
        description: 'Perform dramatic 360° front/back flips and 180° drifts at the single push of a joystick button.'
      },
      {
        title: 'DJI Goggles 3 Real View PiP',
        description: 'Micro-OLED screens with dual cameras allow you to see your physical surroundings without removing goggles.'
      }
    ],
    specifications: [
      {
        groupName: 'Aircraft',
        attributes: [
          { name: 'Weight', value: '377 g', isHighlight: true },
          { name: 'Flight Time', value: '23 Minutes' },
          { name: 'Internal Storage', value: '46 GB' }
        ]
      }
    ],
    compatibleAccessories: ['acc-bat-avata', 'prod-goggles-3', 'prod-rc-motion-3']
  },
  {
    id: 'prod-osmo-pocket-3',
    sku: 'DJI-OSMO-POCKET3',
    slug: 'osmo-pocket-3',
    modelName: 'DJI Osmo Pocket 3',
    series: 'Pocket',
    category: 'handheld',
    categoryLabel: 'Pocket Gimbal Camera',
    tagline: '1-Inch CMOS Sensor in Your Pocket',
    description:
      'Features a powerful 1-inch CMOS sensor that puts detail-rich imaging in the palm of your hand. With a 2-inch rotatable OLED touchscreen and 3-axis mechanical stabilization, capture stunning 4K/120fps video anywhere.',
    basePriceEur: 539,
    compareAtPriceEur: 579,
    badgeLabel: 'Creator Essential',
    weightGrams: 179,
    cameraSensor: '1-Inch CMOS, 4K/120fps, 10-Bit D-Log M',
    maxVideoRes: '4K/120fps UHD',
    rating: 4.9,
    reviewCount: 215,
    isFeatured: true,
    isBestSeller: true,
    images: {
      hero: '/products/prod-osmo-pocket-3-cutout.png',
      cutout: '/products/prod-osmo-pocket-3-cutout.png',
      gallery: ['/products/prod-osmo-pocket-3-cutout.png']
    },
    variants: [
      {
        id: 'var-pocket3-std',
        sku: 'DJI-POCKET3-STD',
        comboName: 'Standard Edition',
        tagline: 'Pocket gimbal camera with protective cover & wrist strap',
        priceEur: 539,
        weightGrams: 179,
        inStock: true,
        stockQuantity: 40,
        includedItems: [
          'Osmo Pocket 3 Gimbal',
          'Type-C to Type-C PD Cable',
          'Protective Cover',
          'Wrist Strap',
          'Handle with 1/4" Thread'
        ]
      },
      {
        id: 'var-pocket3-creator',
        sku: 'DJI-POCKET3-CREATOR',
        comboName: 'Creator Combo (Wireless Mic 2 Included)',
        tagline: 'Includes DJI Mic 2 Transmitter, Battery Handle & Wide-Angle Lens',
        priceEur: 679,
        weightGrams: 179,
        inStock: true,
        stockQuantity: 28,
        includedItems: [
          'Osmo Pocket 3 Gimbal',
          'DJI Mic 2 Transmitter (Shadow Black) + Windscreen',
          'Battery Handle (Extended Runtime)',
          'Wide-Angle Lens Magnet',
          'Mini Tripod',
          'Carrying Bag'
        ]
      }
    ],
    features: [
      {
        title: '1-Inch CMOS Low-Light Mastery',
        description: 'Captures crisp highlight-to-shadow details with natural skin tones and rich optical depth of field.'
      },
      {
        title: '2-Inch Rotatable OLED Display',
        description: 'Effortlessly toggle between 16:9 cinematic horizontal footage and vertical format for TikTok and Reels.'
      }
    ],
    specifications: [
      {
        groupName: 'Camera & Gimbal',
        attributes: [
          { name: 'Dimensions', value: '139.7 × 42.2 × 33.5 mm' },
          { name: 'Weight', value: '179 g', isHighlight: true },
          { name: 'Operating Time', value: '166 Minutes' },
          { name: 'Fast Charging', value: '80% in 16 Minutes' }
        ]
      }
    ],
    compatibleAccessories: ['acc-bat-pocket', 'acc-tripod-pocket', 'prod-mic-2']
  },
  {
    id: 'prod-osmo-action-5-pro',
    sku: 'DJI-OSMO-ACTION5PRO',
    slug: 'osmo-action-5-pro',
    modelName: 'DJI Osmo Action 5 Pro',
    series: 'Action',
    category: 'handheld',
    categoryLabel: 'Rugged Action Camera',
    tagline: 'Revolutionary Imaging & 4-Hour Battery Stamina',
    description:
      'Next-gen 1/1.3-inch sensor with 13.5 stops of dynamic range. Waterproof up to 20 meters without an external housing, dual high-brightness OLED touchscreens, and 4-hour ultra-long battery runtime.',
    basePriceEur: 379,
    compareAtPriceEur: 419,
    badgeLabel: '20m Waterproof',
    weightGrams: 146,
    cameraSensor: '1/1.3-inch CMOS with 4K/120fps',
    maxVideoRes: '4K/120fps 4:3 Dynamic Ultra-Wide',
    rating: 4.8,
    reviewCount: 64,
    images: {
      hero: '/products/prod-osmo-action-5-pro-cutout.png',
      cutout: '/products/prod-osmo-action-5-pro-cutout.png',
      gallery: ['/products/prod-osmo-action-5-pro-cutout.png']
    },
    variants: [
      {
        id: 'var-action5-std',
        sku: 'DJI-ACTION5-STD',
        comboName: 'Standard Combo',
        tagline: 'Camera, 1x Extreme Battery Plus & Horizontal-Vertical Mount',
        priceEur: 379,
        weightGrams: 146,
        inStock: true,
        stockQuantity: 30,
        includedItems: ['Osmo Action 5 Pro', '1x Extreme Battery Plus 1950 mAh', 'Horizontal-Vertical Frame', 'Curved Adhesive Base']
      },
      {
        id: 'var-action5-adv',
        sku: 'DJI-ACTION5-ADV',
        comboName: 'Adventure Combo (3 Batteries + 1.5m Extension Rod)',
        tagline: '3 Batteries, Multifunctional Battery Case & Extension Rod',
        priceEur: 479,
        weightGrams: 146,
        inStock: true,
        stockQuantity: 25,
        includedItems: [
          'Osmo Action 5 Pro',
          '3x Extreme Batteries Plus',
          'Multifunctional Battery Case',
          '1.5m Extension Rod',
          'Horizontal-Vertical Frame',
          'Quick-Release Adapter Mount'
        ]
      }
    ],
    features: [
      {
        title: '20m Waterproof Body',
        description: 'Certified EN13319 scuba diving grade. Dive down to 20 meters without any extra waterproof housing.'
      }
    ],
    specifications: [
      {
        groupName: 'General',
        attributes: [
          { name: 'Waterproof Depth', value: '20 m (without case)', isHighlight: true },
          { name: 'Battery Runtime', value: '240 Minutes (4 Hours)', isHighlight: true }
        ]
      }
    ],
    compatibleAccessories: ['acc-filter-action', 'acc-care-action']
  },
  {
    id: 'prod-inspire-3',
    sku: 'DJI-DRONE-INSPIRE3',
    slug: 'dji-inspire-3',
    modelName: 'DJI Inspire 3 Cinema',
    series: 'Inspire',
    category: 'professional',
    categoryLabel: 'Full-Frame 8K Cinema Drone',
    tagline: 'Master the Unseen: Full-Frame 8K ProRes RAW',
    description:
      'The pinnacle of aerial cinematography. Featuring Zenmuse X9-8K Air full-frame gimbal camera, centimeter-level RTK waypoint repeatability, and 360° pan gimbal tilt boost for Hollywood film productions.',
    basePriceEur: 14999,
    badgeLabel: 'Cinema Grade',
    easaClass: 'Open Category',
    flightTimeMinutes: 28,
    weightGrams: 3995,
    cameraSensor: 'Full-Frame Zenmuse X9-8K Air Cinema Sensor',
    maxVideoRes: '8K/75fps Apple ProRes RAW & 8K/25fps CinemaDNG',
    transmissionRangeKm: 15,
    rating: 5.0,
    reviewCount: 18,
    images: {
      hero: '/products/prod-inspire-3-cutout.png',
      cutout: '/products/prod-inspire-3-cutout.png',
      gallery: ['/products/prod-inspire-3-cutout.png']
    },
    variants: [
      {
        id: 'var-inspire3-cine',
        sku: 'DJI-INSPIRE3-COMBO',
        comboName: 'Master Cinema Combo (Zenmuse X9-8K Air Included)',
        tagline: 'Full production package with RC Plus & 6x TB51 Batteries',
        priceEur: 14999,
        weightGrams: 3995,
        inStock: true,
        stockQuantity: 4,
        includedItems: [
          'Inspire 3 Aircraft',
          'Zenmuse X9-8K Air Gimbal Camera',
          'RC Plus High-Bright Remote (7-inch 1200-Nit)',
          '6x TB51 Intelligent Flight Batteries',
          'TB51 Intelligent Battery Charging Hub',
          'PROSSD 1TB Recording Media',
          'Trolley Hardcase with Retractable Handle'
        ]
      }
    ],
    features: [
      {
        title: 'Full-Frame 8K Sensor',
        description: 'Supports dual native ISO (800 / 4000) and 14+ stops of dynamic range for high-end HDR mastering.'
      }
    ],
    specifications: [
      {
        groupName: 'Cinema Camera',
        attributes: [
          { name: 'Resolution', value: '8K/75fps RAW, 4K/120fps ProRes', isHighlight: true },
          { name: 'Lens Mount', value: 'DJI DL Mount (18mm, 24mm, 35mm, 50mm)' }
        ]
      }
    ],
    compatibleAccessories: ['acc-care-inspire']
  },
  {
    id: 'acc-bat-m4p',
    sku: 'DJI-ACC-BAT-M4P',
    slug: 'intelligent-flight-battery-plus-mavic-4-pro',
    modelName: 'Intelligent Flight Battery Plus (Mavic 4 Pro)',
    series: 'Mavic',
    category: 'accessories',
    categoryLabel: 'OEM Battery & Power',
    tagline: 'Official 5000 mAh LiPo 4S for 46 Minutes Flight',
    description:
      'Genuine DJI Intelligent Flight Battery with built-in battery management system (BMS) that monitors state and charge levels in real time.',
    basePriceEur: 199,
    weightGrams: 335,
    rating: 4.9,
    reviewCount: 110,
    isBestSeller: true,
    images: {
      hero: '/products/acc-bat-m4p-cutout.png',
      cutout: '/products/acc-bat-m4p-cutout.png',
      gallery: ['/products/acc-bat-m4p-cutout.png']
    },
    variants: [
      {
        id: 'var-bat-m4p-single',
        sku: 'DJI-BAT-M4P-1X',
        comboName: 'Single Battery Pack',
        priceEur: 199,
        weightGrams: 335,
        inStock: true,
        stockQuantity: 120,
        includedItems: ['1x Intelligent Flight Battery 5000 mAh']
      }
    ],
    features: [
      {
        title: 'Real-Time Telemetry',
        description: 'Reports precise remaining flight time calculations directly on the DJI Fly app.'
      }
    ],
    specifications: [
      {
        groupName: 'Battery',
        attributes: [
          { name: 'Capacity', value: '5000 mAh', isHighlight: true },
          { name: 'Voltage', value: '15.4 V' }
        ]
      }
    ]
  },
  {
    id: 'acc-rc2',
    sku: 'DJI-ACC-RC2-STANDALONE',
    slug: 'dji-rc-2-remote-controller',
    modelName: 'DJI RC 2 Remote Controller',
    series: 'Mavic',
    category: 'accessories',
    categoryLabel: 'Display Remote Controller',
    tagline: '5.5" 1080p 700-Nit FHD Screen with O4 Transmission',
    description:
      'Features built-in 5.5-inch FHD display, ultra-efficient processor, active antenna array, and full DJI Fly ecosystem compatibility.',
    basePriceEur: 369,
    weightGrams: 420,
    rating: 4.9,
    reviewCount: 95,
    images: {
      hero: '/products/acc-rc2-cutout.png',
      cutout: '/products/acc-rc2-cutout.png',
      gallery: ['/products/acc-rc2-cutout.png']
    },
    variants: [
      {
        id: 'var-rc2-std',
        sku: 'DJI-RC2-ALONE',
        comboName: 'DJI RC 2 Controller',
        priceEur: 369,
        weightGrams: 420,
        inStock: true,
        stockQuantity: 40,
        includedItems: ['DJI RC 2 Remote Controller', 'Spare Control Sticks Pair']
      }
    ],
    features: [
      {
        title: 'Built-in 700-Nit Display',
        description: 'Eliminates phone overheating and glare during bright direct summer sunlight in Europe.'
      }
    ],
    specifications: [
      {
        groupName: 'Display',
        attributes: [{ name: 'Brightness', value: '700 Nits', isHighlight: true }]
      }
    ]
  },
  {
    id: 'acc-care-m4p',
    sku: 'DJI-ACC-CARE-M4P-2Y',
    slug: 'dji-care-refresh-2-year-plan-mavic-4-pro',
    modelName: 'DJI Care Refresh 2-Year Plan (Mavic 4 Pro)',
    series: 'Mavic',
    category: 'power-care',
    categoryLabel: 'Accidental Damage Protection',
    tagline: 'Up to 4 Low-Cost Aircraft Replacements Including Water & Flyaway',
    description:
      'Official European protection plan providing peace of mind with replacement service for accidental water damage, collisions, flyaways, and natural wear.',
    basePriceEur: 299,
    weightGrams: 0,
    rating: 5.0,
    reviewCount: 240,
    isBestSeller: true,
    images: {
      hero: '/products/acc-care-m4p-cutout.png',
      cutout: '/products/acc-care-m4p-cutout.png',
      gallery: ['/products/acc-care-m4p-cutout.png']
    },
    variants: [
      {
        id: 'var-care-m4p-2y',
        sku: 'DJI-CARE-M4P-2Y',
        comboName: '2-Year Official Protection Plan',
        priceEur: 299,
        weightGrams: 0,
        inStock: true,
        stockQuantity: 999,
        includedItems: [
          'Up to 4 Low-Cost Replacements across 24 Months',
          '2x Flyaway Coverage Incidents',
          'Free VIP Express Shipping',
          'Official DJI Factory Repair Technicians'
        ]
      }
    ],
    features: [
      {
        title: 'Water Damage Included',
        description: 'Complete replacement if drone is submerged during maritime or lakeside shooting.'
      }
    ],
    specifications: [
      {
        groupName: 'Warranty',
        attributes: [{ name: 'Coverage Period', value: '24 Months (2 Years)', isHighlight: true }]
      }
    ]
  },
  ...OFFICIAL_STORE_EXPANSION,
  ...WAVE2_OFFICIAL_EXPANSION,
  ...NAV_CATALOG_EXPANSION,
  ...WAVE4_OFFICIAL_EXPANSION,
  ...WAVE5_OFFICIAL_EXPANSION,
  ...WAVE6_OFFICIAL_EXPANSION
];

/** Seed catalog (US reference EUR placeholders) before EU pricing rules. */
export const RAW_DJI_PRODUCTS: Product[] = RAW_DJI_PRODUCTS_SEED;

/** Live catalog with USD→EUR conversion, variant expansion, media galleries, then Wave 6 enrichment. */
export const DJI_PRODUCTS: Product[] = applyWave6EnrichmentToCatalog(
  applyCatalogPresentation(
    applyUsdPricingToProducts(RAW_DJI_PRODUCTS_SEED, officialUsdPriceCache as OfficialUsdPriceCache),
    {
      usdCache: officialUsdPriceCache as OfficialUsdPriceCache,
      mediaCache: officialStoreMediaCache as OfficialStoreMediaCache,
      databaseMediaCache: productDatabaseMediaCache as DatabaseMediaCache
    }
  )
);

import { Product, ProductSpecGroup } from '../types';

/** Partial product patch keyed by official store.dji.com slug. */
export type Wave6EnrichmentPatch = Partial<
  Pick<
    Product,
    | 'modelName'
    | 'tagline'
    | 'description'
    | 'basePriceEur'
    | 'compareAtPriceEur'
    | 'categoryLabel'
    | 'weightGrams'
    | 'isBestSeller'
    | 'isFeatured'
    | 'badgeLabel'
    | 'features'
    | 'specifications'
    | 'variants'
    | 'easaClass'
    | 'flightTimeMinutes'
    | 'compatibleAccessories'
  >
>;

function specs(groups: ProductSpecGroup[]): ProductSpecGroup[] {
  return groups;
}

function feat(title: string, description: string) {
  return { title, description };
}

/**
 * Curated EU list prices (store.dji.com/ie, Mar 2026) + hand-authored merchandising copy.
 * Overrides hash-generated Wave 6 placeholders for high-traffic PDPs.
 */
export const WAVE6_HIGH_TRAFFIC_ENRICHMENT: Record<string, Wave6EnrichmentPatch> = {
  'dji-air-3s-fly-more-combo-rc-2': {
    modelName: 'DJI Air 3S Fly More Combo (RC 2)',
    tagline: 'RC 2 + 3 Batteries + Charging Hub',
    description:
      'Official Air 3S Fly More Combo with DJI RC 2 bright-screen remote, triple Intelligent Flight Battery set, and parallel charging hub — EU Open Category C1 travel cinema kit.',
    basePriceEur: 1399,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    isFeatured: true,
    flightTimeMinutes: 45,
    easaClass: 'C1',
    features: [
      feat('DJI RC 2 Included', '5.5-inch 700-nit display — no phone overheating in summer EU flights.'),
      feat('Triple Battery Set', 'Three Intelligent Flight Batteries for full-day location work.')
    ],
    specifications: specs([
      {
        groupName: 'Combo',
        attributes: [
          { name: 'Aircraft', value: 'DJI Air 3S', isHighlight: true },
          { name: 'Remote', value: 'DJI RC 2', isHighlight: true },
          { name: 'Batteries', value: '3× Intelligent Flight Battery' }
        ]
      }
    ])
  },
  'dji-air-3s-fly-more-combo': {
    modelName: 'DJI Air 3S Fly More Combo',
    tagline: 'Triple batteries + hub (RC-N3).',
    description: 'Fly More Combo for Air 3S with RC-N3 and expanded battery kit from the official DJI Store.',
    basePriceEur: 1099,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    easaClass: 'C1',
    flightTimeMinutes: 45
  },
  'dji-air-3s-fly-more-combo-rc-2-sb': {
    modelName: 'DJI Air 3S Fly More Combo (RC 2 + Goggles)',
    tagline: 'Immersive FPV + RC 2 Fly More.',
    description: 'Sport bundle pairing Air 3S Fly More Combo (RC 2) with DJI Goggles for immersive monitoring.',
    basePriceEur: 1649,
    categoryLabel: 'Sport Bundle',
    isFeatured: true,
    easaClass: 'C1'
  },
  'dji-air-3s-fly-more-combo-lite-rc-2': {
    modelName: 'DJI Air 3S Fly More Combo Lite (RC 2)',
    tagline: 'Streamlined Fly More with RC 2.',
    description: 'Lite Fly More configuration for Air 3S with DJI RC 2 — official store bundle for EU creators.',
    basePriceEur: 1299,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    easaClass: 'C1'
  },
  'dji-flip-fly-more-combo-rc-2': {
    modelName: 'DJI Flip Fly More Combo (RC 2)',
    tagline: 'RC 2 + batteries + shoulder bag.',
    description: 'All-in-one vlog drone Fly More kit under 249 g — RC 2, extra batteries, and charging hub.',
    basePriceEur: 779,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 31
  },
  'dji-neo-fly-more-combo': {
    modelName: 'DJI Neo Fly More Combo',
    tagline: 'Extra batteries + hub for palm takeoff.',
    description: 'Official Neo Fly More Combo with spare Intelligent Flight Batteries and two-way charging hub.',
    basePriceEur: 349,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 18
  },
  'dji-neo-fly-more-combo-sb': {
    modelName: 'DJI Neo Fly More Combo (Sport Bundle)',
    tagline: 'Fly More + Goggles N3.',
    description: 'Neo Fly More with DJI Goggles N3 for immersive beginner FPV in the EU.',
    basePriceEur: 449,
    categoryLabel: 'Sport Bundle',
    easaClass: 'C0 (<249g)'
  },
  'dji-neo-combo': {
    modelName: 'DJI Neo Combo',
    tagline: 'Neo + RC-N3 remote.',
    description: 'Standard Neo combo with RC-N3 — official entry bundle from store.dji.com.',
    basePriceEur: 299,
    categoryLabel: 'Camera Drone Combo',
    easaClass: 'C0 (<249g)'
  },
  'dji-avata-2-fly-smart-combo-three-battery': {
    modelName: 'DJI Avata 2 Fly Smart Combo (3 Batteries)',
    tagline: 'Goggles 3 + Motion 3 + 3 batteries.',
    description: 'Complete immersive FPV kit — Avata 2, Goggles 3, RC Motion 3, and triple battery set.',
    basePriceEur: 1049,
    categoryLabel: 'FPV Smart Combo',
    isBestSeller: true,
    isFeatured: true,
    easaClass: 'C1',
    flightTimeMinutes: 23
  },
  'dji-avata-2-fly-smart-combo-single-battery': {
    modelName: 'DJI Avata 2 Fly Smart Combo',
    tagline: 'Goggles 3 + Motion 3 kit.',
    description: 'Avata 2 immersive combo with single battery — upgrade path to triple-battery kit.',
    basePriceEur: 849,
    categoryLabel: 'FPV Smart Combo',
    easaClass: 'C1'
  },
  'dji-avata-2-sb': {
    modelName: 'DJI Avata 2 (Sport Bundle)',
    tagline: 'Goggles 3 + Motion 3 included.',
    description: 'Official Avata 2 sport bundle for EU FPV pilots.',
    basePriceEur: 949,
    categoryLabel: 'FPV Combo',
    isBestSeller: true,
    easaClass: 'C1'
  },
  'dji-mini-4-pro-fly-more-combo-rc-2': {
    modelName: 'DJI Mini 4 Pro Fly More Combo (RC 2)',
    tagline: 'RC 2 + 3 batteries under 249 g.',
    description: 'EU travel flagship Fly More — Mini 4 Pro with DJI RC 2 and triple battery kit.',
    basePriceEur: 959,
    categoryLabel: 'Fly More Combo',
    isBestSeller: true,
    easaClass: 'C0 (<249g)',
    flightTimeMinutes: 34
  },
  'dji-mini-4-pro-fly-more-combo-plus-rc-2': {
    modelName: 'DJI Mini 4 Pro Fly More Combo Plus (RC 2)',
    tagline: 'Premium Fly More with ND filters.',
    description: 'Expanded Fly More Plus bundle with ND filter set and premium carry case.',
    basePriceEur: 1049,
    categoryLabel: 'Fly More Combo Plus',
    easaClass: 'C0 (<249g)'
  },
  'dji-mini-3-fly-more-combo': {
    modelName: 'DJI Mini 3 Fly More Combo',
    tagline: 'Batteries + hub for Mini 3.',
    description: 'Official Mini 3 Fly More Combo — spare batteries and charging hub for EU hiking trips.',
    basePriceEur: 549,
    categoryLabel: 'Fly More Combo',
    easaClass: 'C0 (<249g)'
  },
  'dji-mini-3-rc': {
    modelName: 'DJI Mini 3 (DJI RC)',
    tagline: 'Built-in screen remote included.',
    description: 'Mini 3 bundle with DJI RC — no phone required for first flights.',
    basePriceEur: 419,
    categoryLabel: 'Camera Drone Combo',
    easaClass: 'C0 (<249g)'
  },
  'dji-mavic-3-pro-fly-more-combo': {
    modelName: 'DJI Mavic 3 Pro Fly More Combo',
    tagline: 'Triple-camera Fly More kit.',
    description: 'Mavic 3 Pro Fly More with Hasselblad triple-camera aircraft and expanded battery set.',
    basePriceEur: 2799,
    categoryLabel: 'Fly More Combo',
    easaClass: 'C2'
  },
  'dji-mavic-4-pro-fly-more-combo-rc-2': {
    modelName: 'DJI Mavic 4 Pro Fly More Combo (RC 2)',
    tagline: '8K flagship + RC 2 Fly More.',
    description: '2026 Mavic 4 Pro Fly More with DJI RC 2 and triple Intelligent Flight Battery Plus set.',
    basePriceEur: 2699,
    categoryLabel: 'Fly More Combo',
    isFeatured: true,
    badgeLabel: 'New 2026',
    easaClass: 'C1'
  },
  'dji-air-3s-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Air 3S)',
    tagline: 'Official Air 3S flight pack.',
    description: 'Genuine Intelligent Flight Battery for DJI Air 3S with BMS telemetry in DJI Fly.',
    basePriceEur: 149,
    categoryLabel: 'OEM Battery',
    weightGrams: 245,
    specifications: specs([
      { groupName: 'Battery', attributes: [{ name: 'Chemistry', value: 'LiPo 3S' }, { name: 'Compatibility', value: 'Air 3S', isHighlight: true }] }
    ])
  },
  'dji-air-3-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Air 3)',
    tagline: 'Official Air 3 OEM pack.',
    description: 'Spare Intelligent Flight Battery for DJI Air 3 dual-camera travel drone.',
    basePriceEur: 149,
    categoryLabel: 'OEM Battery',
    weightGrams: 267
  },
  'dji-flip-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Flip)',
    tagline: 'Official Flip flight battery.',
    description: 'Genuine Flip Intelligent Flight Battery for extended EU vlog sessions.',
    basePriceEur: 59,
    categoryLabel: 'OEM Battery',
    weightGrams: 77
  },
  'dji-neo-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Neo)',
    tagline: 'Official Neo spare pack.',
    description: 'Spare battery for DJI Neo palm-takeoff flights.',
    basePriceEur: 39,
    categoryLabel: 'OEM Battery',
    weightGrams: 45
  },
  'dji-avata-2-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Avata 2)',
    tagline: 'Official Avata 2 OEM pack.',
    description: 'Genuine Avata 2 battery for extended FPV sessions.',
    basePriceEur: 89,
    categoryLabel: 'OEM Battery',
    weightGrams: 165
  },
  'dji-mini-4-pro-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery (Mini 4 Pro)',
    tagline: 'Official Mini 4 Pro pack.',
    description: 'Self-heating Intelligent Flight Battery for alpine EU Mini shoots.',
    basePriceEur: 99,
    categoryLabel: 'OEM Battery',
    weightGrams: 77
  },
  'dji-mavic-4-pro-intelligent-flight-battery': {
    modelName: 'Intelligent Flight Battery Plus (Mavic 4 Pro)',
    tagline: '5000 mAh Plus pack.',
    description: 'High-capacity Intelligent Flight Battery Plus for Mavic 4 Pro flagship flights.',
    basePriceEur: 209,
    categoryLabel: 'OEM Battery',
    weightGrams: 336
  },
  'dji-neo-two-way-charging-hub': {
    modelName: 'DJI Neo Two-Way Charging Hub',
    tagline: 'Charge two Neo batteries sequentially.',
    description: 'Official charging hub for Neo Intelligent Flight Batteries.',
    basePriceEur: 59,
    categoryLabel: 'Charging Hub',
    weightGrams: 95
  },
  'dji-flip-parallel-charging-hub': {
    modelName: 'DJI Flip Parallel Charging Hub',
    tagline: 'Fast multi-battery charging.',
    description: 'Parallel hub for Flip Intelligent Flight Batteries.',
    basePriceEur: 69,
    categoryLabel: 'Charging Hub',
    weightGrams: 120
  },
  'dji-avata-2-two-way-charging-hub': {
    modelName: 'DJI Avata 2 Two-Way Charging Hub',
    tagline: 'Sequential Avata 2 charging.',
    description: 'Official two-way hub for Avata 2 batteries.',
    basePriceEur: 59,
    categoryLabel: 'Charging Hub',
    weightGrams: 110
  },
  'dji-air-3s-nd-filters-set': {
    modelName: 'ND Filter Set (Air 3S)',
    tagline: 'ND 8/16/32/64 for dual 1-inch cameras.',
    description: 'Official ND filter set for Air 3S wide and tele lenses.',
    basePriceEur: 99,
    categoryLabel: 'Filters',
    weightGrams: 42
  },
  'dji-air-3-nd-filters-set-8-64': {
    modelName: 'ND Filter Set (Air 3)',
    tagline: 'ND 8–64 for Air 3 dual cameras.',
    description: 'Official ND set for DJI Air 3 European daylight cinematography.',
    basePriceEur: 99,
    categoryLabel: 'Filters',
    weightGrams: 40
  },
  'dji-flip-nd-filter-set-16-256': {
    modelName: 'ND Filter Set (Flip)',
    tagline: 'ND 16–256 for Flip 4K.',
    description: 'High-range ND set for bright EU summer Flip flights.',
    basePriceEur: 69,
    categoryLabel: 'Filters',
    weightGrams: 28
  },
  'dji-avata-2-nd-filters-set-8-32': {
    modelName: 'ND Filter Set (Avata 2)',
    tagline: 'ND 8/16/32 for Avata 2.',
    description: 'Official ND filters for Avata 2 FPV daylight flights.',
    basePriceEur: 79,
    categoryLabel: 'Filters',
    weightGrams: 32
  },
  'dji-mini-4-pro-wide-angle-lens': {
    modelName: 'Wide-Angle Lens (Mini 4 Pro)',
    tagline: 'Ultra-wide Mini 4 Pro attachment.',
    description: 'Official wide-angle lens module for DJI Mini 4 Pro.',
    basePriceEur: 89,
    categoryLabel: 'Lens Accessory',
    weightGrams: 18
  },
  'dji-air-3s-wide-angle-lens': {
    modelName: 'Wide-Angle Lens (Air 3S)',
    tagline: 'Expanded FOV for Air 3S wide camera.',
    description: 'Official wide-angle lens for Air 3S primary camera.',
    basePriceEur: 69,
    categoryLabel: 'Lens Accessory',
    weightGrams: 35
  },
  'dji-care-refresh-dji-neo': {
    modelName: 'DJI Care Refresh (Neo) — 1 Year',
    tagline: 'Accidental damage cover for Neo.',
    description: 'One-year Care Refresh for DJI Neo — water, collision, and flyaway protection in the EU.',
    basePriceEur: 29,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-2-year-dji-neo': {
    modelName: 'DJI Care Refresh (Neo) — 2 Year',
    tagline: 'Extended Neo protection plan.',
    description: 'Two-year Care Refresh for DJI Neo with replacement service.',
    basePriceEur: 48,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-dji-air-3s': {
    modelName: 'DJI Care Refresh (Air 3S)',
    tagline: '1-year Air 3S protection.',
    description: 'Official Care Refresh for DJI Air 3S travel drone.',
    basePriceEur: 149,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-dji-flip': {
    modelName: 'DJI Care Refresh (Flip)',
    tagline: 'Cover your Flip vlog drone.',
    description: 'Care Refresh accidental damage plan for DJI Flip.',
    basePriceEur: 69,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-dji-mini-4-pro': {
    modelName: 'DJI Care Refresh (Mini 4 Pro)',
    tagline: '2-year Mini 4 Pro cover.',
    description: 'Official Care Refresh for Mini 4 Pro / Mini 5 Pro European coverage.',
    basePriceEur: 99,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-dji-avata-2': {
    modelName: 'DJI Care Refresh (Avata 2)',
    tagline: 'FPV crash protection.',
    description: 'Care Refresh for Avata 2 immersive flight kits.',
    basePriceEur: 89,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-osmo-action-5-pro': {
    modelName: 'DJI Care Refresh (Action 5 Pro)',
    tagline: '2-year Action water & impact cover.',
    description: 'Official Care Refresh for Osmo Action 5 Pro adventure use.',
    basePriceEur: 59,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-osmo-pocket-3': {
    modelName: 'DJI Care Refresh (Pocket 3)',
    tagline: 'Pocket gimbal protection.',
    description: 'Care Refresh for Osmo Pocket 3 creator units.',
    basePriceEur: 75,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-dji-rs-4-mini': {
    modelName: 'DJI Care Refresh (RS 4 Mini)',
    tagline: 'Gimbal accidental damage cover.',
    description: 'Care Refresh for DJI RS 4 Mini travel gimbal kits.',
    basePriceEur: 65,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-care-refresh-2-year-dji-mavic-4-pro': {
    modelName: 'DJI Care Refresh 2-Year (Mavic 4 Pro)',
    tagline: 'Flagship protection plan.',
    description: 'Two-year Care Refresh for DJI Mavic 4 Pro including flyaway coverage.',
    basePriceEur: 299,
    categoryLabel: 'DJI Care',
    weightGrams: 0
  },
  'dji-mic-mini-tx-rx': {
    modelName: 'DJI Mic Mini (TX + RX)',
    tagline: 'Compact wireless mic kit.',
    description: 'Official Mic Mini transmitter and receiver combo for EU creators.',
    basePriceEur: 99,
    categoryLabel: 'Wireless Mic',
    isBestSeller: true,
    weightGrams: 28
  },
  'osmo-360-standard-combo': {
    modelName: 'Osmo 360 Standard Combo',
    tagline: '8K 360° creator kit.',
    description: 'Official Osmo 360 standard combo with essentials for immersive capture.',
    basePriceEur: 449,
    categoryLabel: '360 Camera Combo',
    isFeatured: true,
    weightGrams: 192
  },
  'dji-transmission-standard-combo': {
    modelName: 'DJI Transmission Standard Combo',
    tagline: 'Pro wireless video TX/RX.',
    description: 'Standard combo for DJI Transmission — long-range monitoring for EU film sets.',
    basePriceEur: 1499,
    categoryLabel: 'Wireless Video Combo',
    weightGrams: 700
  },
  'dji-power-1000-car-power-combo': {
    modelName: 'DJI Power 1000 Car Power Combo',
    tagline: 'Station + car charging kit.',
    description: 'DJI Power 1000 with official car recharging accessories for EU road trips.',
    basePriceEur: 1049,
    categoryLabel: 'Power Combo',
    isBestSeller: true,
    weightGrams: 13200
  },
  'dji-power-1000-solar-car-recharging-combo': {
    modelName: 'DJI Power 1000 Solar & Car Combo',
    tagline: 'Solar + car + 1000 Wh station.',
    description: 'All-in-one field power kit with solar panel and car adapter for DJI Power 1000.',
    basePriceEur: 1199,
    categoryLabel: 'Power Combo',
    weightGrams: 18500
  },
  'dji-power-500-car-power-combo': {
    modelName: 'DJI Power 500 Car Power Combo',
    tagline: 'Compact 512 Wh + car kit.',
    description: 'DJI Power 500 with car charging combo for location crews.',
    basePriceEur: 599,
    categoryLabel: 'Power Combo',
    weightGrams: 8200
  },
  'dji-power-expansion-battery-2000': {
    modelName: 'DJI Power Expansion Battery 2000',
    tagline: 'Extend Power 2000 to 4 kWh.',
    description: 'Official expansion battery module for DJI Power 2000 portable stations.',
    basePriceEur: 999,
    categoryLabel: 'Power Expansion',
    weightGrams: 8200
  },
  'dji-power-solar-panel-adapter-module-mppt': {
    modelName: 'DJI Power Solar Panel Adapter (MPPT)',
    tagline: 'MPPT solar input module.',
    description: 'Official MPPT adapter for charging DJI Power stations from compatible solar panels.',
    basePriceEur: 59,
    categoryLabel: 'Solar Charging',
    weightGrams: 680
  },
  'zignes-100w-solar-panel': {
    modelName: 'Zignes 100W Solar Panel',
    tagline: 'Foldable 100 W panel for DJI Power.',
    description: 'Official store-listed 100 W solar panel for DJI Power field charging.',
    basePriceEur: 209,
    categoryLabel: 'Solar Panel',
    weightGrams: 4200
  },
  'dji-rc-n3-remote-controller': {
    modelName: 'DJI RC-N3 Remote Controller',
    tagline: 'Smartphone RC with O4 video.',
    description: 'Official RC-N3 remote for Mini, Air, and Flip series — EU statutory warranty.',
    basePriceEur: 129,
    categoryLabel: 'Remote Controller',
    weightGrams: 320
  },
  'dji-fpv-remote-controller-3': {
    modelName: 'DJI FPV Remote Controller 3',
    tagline: 'Low-latency FPV stick control.',
    description: 'Official FPV Remote Controller 3 for Avata 2 immersive flight.',
    basePriceEur: 199,
    categoryLabel: 'FPV Controller',
    weightGrams: 280
  },
  'dji-focus-pro-creator-combo': {
    modelName: 'DJI Focus Pro Creator Combo',
    tagline: 'LiDAR AF for RS cinema rigs.',
    description: 'Creator combo with LiDAR rangefinder and motor for RS 4 Pro / RS 5 focusing.',
    basePriceEur: 999,
    categoryLabel: 'LiDAR Focus System',
    weightGrams: 420
  },
  'dji-rs-3-mini': {
    modelName: 'DJI RS 3 Mini',
    tagline: 'Compact 3-axis travel gimbal.',
    description: 'Lightweight RS gimbal for mirrorless travel — still available on the official store.',
    basePriceEur: 299,
    categoryLabel: 'Compact Camera Gimbal',
    isBestSeller: true,
    weightGrams: 795
  }
};

export const WAVE6_HIGH_TRAFFIC_ENRICHMENT_COUNT = Object.keys(WAVE6_HIGH_TRAFFIC_ENRICHMENT).length;

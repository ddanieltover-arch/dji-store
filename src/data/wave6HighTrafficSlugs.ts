/** High-traffic store.dji.com SKUs — combos, Care, flagship accessories (Wave 6 enrichment tier). */
export const WAVE6_HIGH_TRAFFIC_SLUGS = [
  // Camera drone Fly More / Smart combos
  'dji-air-3s-fly-more-combo-rc-2',
  'dji-air-3s-fly-more-combo',
  'dji-air-3s-fly-more-combo-rc-2-sb',
  'dji-air-3s-fly-more-combo-lite-rc-2',
  'dji-flip-fly-more-combo-rc-2',
  'dji-neo-fly-more-combo',
  'dji-neo-fly-more-combo-sb',
  'dji-neo-combo',
  'dji-avata-2-fly-smart-combo-three-battery',
  'dji-avata-2-fly-smart-combo-single-battery',
  'dji-avata-2-sb',
  'dji-mini-4-pro-fly-more-combo-rc-2',
  'dji-mini-4-pro-fly-more-combo-plus-rc-2',
  'dji-mini-3-fly-more-combo',
  'dji-mini-3-rc',
  'dji-mavic-3-pro-fly-more-combo',
  'dji-mavic-4-pro-fly-more-combo-rc-2',
  // OEM batteries & hubs
  'dji-air-3s-intelligent-flight-battery',
  'dji-air-3-intelligent-flight-battery',
  'dji-flip-intelligent-flight-battery',
  'dji-neo-intelligent-flight-battery',
  'dji-avata-2-intelligent-flight-battery',
  'dji-mini-4-pro-intelligent-flight-battery',
  'dji-mavic-4-pro-intelligent-flight-battery',
  'dji-neo-two-way-charging-hub',
  'dji-flip-parallel-charging-hub',
  'dji-avata-2-two-way-charging-hub',
  // ND & lenses
  'dji-air-3s-nd-filters-set',
  'dji-air-3-nd-filters-set-8-64',
  'dji-flip-nd-filter-set-16-256',
  'dji-avata-2-nd-filters-set-8-32',
  'dji-mini-4-pro-wide-angle-lens',
  'dji-air-3s-wide-angle-lens',
  // DJI Care Refresh
  'dji-care-refresh-dji-neo',
  'dji-care-refresh-2-year-dji-neo',
  'dji-care-refresh-dji-air-3s',
  'dji-care-refresh-dji-flip',
  'dji-care-refresh-dji-mini-4-pro',
  'dji-care-refresh-dji-avata-2',
  'dji-care-refresh-osmo-action-5-pro',
  'dji-care-refresh-osmo-pocket-3',
  'dji-care-refresh-dji-rs-4-mini',
  'dji-care-refresh-2-year-dji-mavic-4-pro',
  // Handheld combos
  'dji-mic-mini-tx-rx',
  'osmo-360-standard-combo',
  'dji-transmission-standard-combo',
  // Power
  'dji-power-1000-car-power-combo',
  'dji-power-1000-solar-car-recharging-combo',
  'dji-power-500-car-power-combo',
  'dji-power-expansion-battery-2000',
  'dji-power-solar-panel-adapter-module-mppt',
  'zignes-100w-solar-panel',
  // Controllers & FPV
  'dji-rc-n3-remote-controller',
  'dji-fpv-remote-controller-3',
  'dji-focus-pro-creator-combo',
  'dji-rs-3-mini'
] as const;

export type Wave6HighTrafficSlug = (typeof WAVE6_HIGH_TRAFFIC_SLUGS)[number];

/**
 * Product slugs embedded in store.dji.com homepage JSON (US storefront).
 * Used as the canonical completeness checklist for DJI Store EU parity.
 * Last verified: 2026-09-02 against https://store.dji.com/
 */
export const OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS = [
  'dji-air-3s',
  'dji-air-3s-fly-more-combo-lite-rc-2',
  'dji-avata-2-sb',
  'dji-flip',
  'dji-flip-fly-more-combo-rc-2',
  'dji-focus-pro-creator-combo',
  'dji-mavic-3-pro',
  'dji-mic-mini',
  'dji-mic-mini-tx-rx',
  'dji-mini-3',
  'dji-mini-3-rc',
  'dji-mini-4-pro',
  'dji-power-1000',
  'dji-power-1000-solar-car-recharging-combo',
  'dji-power-2000',
  'dji-power-500',
  'dji-power-expansion-battery-2000',
  'dji-power-solar-panel-adapter-module-mppt',
  'dji-ronin-4d',
  'dji-rs-3-mini',
  'dji-rs-4',
  'dji-rs-4-mini',
  'dji-rs-4-pro',
  'dji-rs-5',
  'dji-sdr-transmission',
  'dji-transmission-standard-combo',
  'osmo-360-standard-combo',
  'osmo-action-4',
  'osmo-action-5-pro',
  'osmo-mobile-7p',
  'osmo-pocket-3',
  'zignes-100w-solar-panel'
] as const;

export type OfficialStoreHomepageSlug = (typeof OFFICIAL_STORE_HOMEPAGE_PRODUCT_SLUGS)[number];

/** Official homepage "What's Hot" lineup (store.dji.com US, Sep 2026). */
export const OFFICIAL_STORE_WHATS_HOT_SLUGS: OfficialStoreHomepageSlug[] = [
  'osmo-action-5-pro',
  'dji-rs-4-mini',
  'osmo-action-4',
  'dji-power-500'
];

/** Official homepage "Top Picks" carousel (store.dji.com US, Sep 2026). */
export const OFFICIAL_STORE_TOP_PICKS_SLUGS: OfficialStoreHomepageSlug[] = [
  'osmo-action-5-pro',
  'osmo-action-4',
  'dji-rs-4-mini'
];

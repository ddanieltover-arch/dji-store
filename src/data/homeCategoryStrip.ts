import type { Product } from '../types';

export type HomeCategoryStripItem = {
  id: string;
  label: string;
  imageSrc: string;
  category: Product['category'] | 'all';
  series?: Product['series'];
};

/**
 * Official store.dji.com homepage series strip — order and icons mirror the reference site.
 * Images sourced from se-cdn.djiits.com navIcon assets (downloaded to /home/category-strip/).
 * @see https://store.dji.com/
 */
export const HOME_CATEGORY_STRIP: HomeCategoryStripItem[] = [
  {
    id: 'air',
    label: 'DJI Air',
    imageSrc: '/home/category-strip/dji-air.png',
    category: 'camera-drones',
    series: 'Air'
  },
  {
    id: 'action',
    label: 'Osmo Action',
    imageSrc: '/home/category-strip/osmo-action.png',
    category: 'handheld',
    series: 'Action'
  },
  {
    id: 'ronin',
    label: 'Ronin Stabilizers',
    imageSrc: '/home/category-strip/ronin-stabilizers.png',
    category: 'handheld',
    series: 'Ronin'
  },
  {
    id: 'power',
    label: 'DJI Power',
    imageSrc: '/home/category-strip/dji-power.png',
    category: 'power',
    series: 'Power'
  },
  {
    id: 'mic',
    label: 'DJI Mic',
    imageSrc: '/home/category-strip/dji-mic.png',
    category: 'handheld',
    series: 'Mic'
  },
  {
    id: 'ronin-cinema',
    label: 'Ronin Cinema Cameras',
    imageSrc: '/home/category-strip/ronin-cinema-cameras.png',
    category: 'professional',
    series: 'Ronin'
  },
  {
    id: 'pro-accessories',
    label: 'Pro Accessories',
    imageSrc: '/home/category-strip/pro-accessories.png',
    category: 'accessories'
  },
  {
    id: 'pocket',
    label: 'Osmo Pocket',
    imageSrc: '/home/category-strip/osmo-pocket.png',
    category: 'handheld',
    series: 'Pocket'
  },
  {
    id: 'osmo-360',
    label: 'Osmo 360',
    imageSrc: '/home/category-strip/osmo-360.png',
    category: 'handheld',
    series: 'Osmo360'
  },
  {
    id: 'mobile',
    label: 'Osmo Mobile',
    imageSrc: '/home/category-strip/osmo-mobile.png',
    category: 'handheld',
    series: 'Mobile'
  },
  {
    id: 'mavic',
    label: 'DJI Mavic',
    imageSrc: '/home/category-strip/dji-mavic.png',
    category: 'camera-drones',
    series: 'Mavic'
  },
  {
    id: 'mini',
    label: 'DJI Mini',
    imageSrc: '/home/category-strip/dji-mini.png',
    category: 'camera-drones',
    series: 'Mini'
  },
  {
    id: 'flip',
    label: 'DJI Flip',
    imageSrc: '/home/category-strip/dji-flip.png',
    category: 'camera-drones',
    series: 'Flip'
  },
  {
    id: 'avata',
    label: 'DJI Avata',
    imageSrc: '/home/category-strip/dji-avata.png',
    category: 'camera-drones',
    series: 'Avata'
  },
  {
    id: 'neo',
    label: 'DJI Neo',
    imageSrc: '/home/category-strip/dji-neo.png',
    category: 'camera-drones',
    series: 'Neo'
  },
  {
    id: 'inspire',
    label: 'DJI Inspire',
    imageSrc: '/home/category-strip/dji-inspire.png',
    category: 'professional',
    series: 'Inspire'
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    imageSrc: '/home/category-strip/enterprise.png',
    category: 'professional'
  },
  {
    id: 'education',
    label: 'Education',
    imageSrc: '/home/category-strip/education.png',
    category: 'professional',
    series: 'Education'
  }
];

import { DJI_PRODUCTS } from './products';
import { Product } from '../types';

export type MegaLayout = 'series-grid' | 'product-grid' | 'editorial';

export interface MegaSidebarItem {
  id: string;
  label: string;
  series?: string;
}

export interface MegaGroup {
  id: string;
  title: string;
  series?: string;
  sidebarId?: string;
  viewAllCategory?: string;
  viewAllSeries?: string;
  productIds: string[];
}

export interface MegaEditorial {
  title: string;
  body: string;
  ctaLabel: string;
  ctaCategory?: string;
  ctaView?: string;
}

export interface MegaPanelConfig {
  id: string;
  layout: MegaLayout;
  sidebar: MegaSidebarItem[];
  groups: MegaGroup[];
  editorial?: MegaEditorial;
}

export interface ResolvedMegaGroup extends MegaGroup {
  products: Product[];
}

export const MEGA_MENU_PANELS: MegaPanelConfig[] = [
  {
    id: 'camera-drones',
    layout: 'series-grid',
    sidebar: [
      { id: 'mavic', label: 'DJI Mavic', series: 'Mavic' },
      { id: 'air', label: 'DJI Air', series: 'Air' },
      { id: 'mini', label: 'DJI Mini', series: 'Mini' },
      { id: 'flip', label: 'DJI Flip', series: 'Flip' },
      { id: 'avata', label: 'DJI Avata & FPV', series: 'Avata' },
      { id: 'neo', label: 'DJI Neo', series: 'Neo' },
      { id: 'inspire', label: 'DJI Inspire', series: 'Inspire' }
    ],
    groups: [
      {
        id: 'g-mavic',
        title: 'DJI Mavic',
        series: 'Mavic',
        sidebarId: 'mavic',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Mavic',
        productIds: ['prod-mavic-4-pro', 'prod-mavic-3-pro', 'prod-mavic-3-classic', 'acc-bat-m4p', 'acc-nd-m4p', 'acc-fmk-m4p']
      },
      {
        id: 'g-air',
        title: 'DJI Air',
        series: 'Air',
        sidebarId: 'air',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Air',
        productIds: ['prod-air-3s', 'prod-air-3', 'acc-bat-air', 'acc-nd-air']
      },
      {
        id: 'g-mini',
        title: 'DJI Mini',
        series: 'Mini',
        sidebarId: 'mini',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Mini',
        productIds: ['prod-mini-5-pro', 'prod-mini-4-pro', 'prod-mini-4k', 'prod-mini-3', 'prod-mini-2-se', 'acc-bat-mini', 'acc-fmk-mini']
      },
      {
        id: 'g-flip',
        title: 'DJI Flip',
        series: 'Flip',
        sidebarId: 'flip',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Flip',
        productIds: ['prod-flip', 'acc-nd-flip', 'acc-bat-mini']
      },
      {
        id: 'g-avata',
        title: 'DJI Avata & FPV',
        series: 'Avata',
        sidebarId: 'avata',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Avata',
        productIds: ['prod-avata-2', 'prod-avata', 'prod-goggles-3', 'prod-rc-motion-3']
      },
      {
        id: 'g-neo',
        title: 'DJI Neo',
        series: 'Neo',
        sidebarId: 'neo',
        viewAllCategory: 'camera-drones',
        viewAllSeries: 'Neo',
        productIds: ['prod-neo', 'acc-bat-neo', 'acc-props-neo', 'prod-goggles-n3']
      },
      {
        id: 'g-inspire',
        title: 'DJI Inspire',
        series: 'Inspire',
        sidebarId: 'inspire',
        viewAllCategory: 'professional',
        viewAllSeries: 'Inspire',
        productIds: ['prod-inspire-3', 'acc-care-inspire']
      }
    ]
  },
  {
    id: 'handheld',
    layout: 'series-grid',
    sidebar: [
      { id: 'osmo360', label: 'Osmo 360', series: 'Osmo360' },
      { id: 'pocket', label: 'Osmo Pocket', series: 'Pocket' },
      { id: 'action', label: 'Osmo Action', series: 'Action' },
      { id: 'mobile', label: 'Osmo Mobile', series: 'Mobile' },
      { id: 'ronin', label: 'Ronin / RS', series: 'Ronin' },
      { id: 'mic', label: 'DJI Mic', series: 'Mic' }
    ],
    groups: [
      {
        id: 'g-360',
        title: 'Osmo 360',
        series: 'Osmo360',
        sidebarId: 'osmo360',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Osmo360',
        productIds: ['prod-osmo-360', 'acc-bat-360']
      },
      {
        id: 'g-pocket',
        title: 'Osmo Pocket',
        series: 'Pocket',
        sidebarId: 'pocket',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Pocket',
        productIds: ['prod-osmo-pocket-3', 'acc-bat-pocket', 'acc-tripod-pocket']
      },
      {
        id: 'g-action',
        title: 'Osmo Action',
        series: 'Action',
        sidebarId: 'action',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Action',
        productIds: ['prod-osmo-action-5-pro', 'prod-osmo-action-4', 'prod-osmo-nano', 'acc-filter-action']
      },
      {
        id: 'g-mobile',
        title: 'Osmo Mobile',
        series: 'Mobile',
        sidebarId: 'mobile',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Mobile',
        productIds: ['prod-osmo-mobile-7p', 'prod-osmo-mobile-7']
      },
      {
        id: 'g-ronin',
        title: 'Ronin / RS',
        series: 'Ronin',
        sidebarId: 'ronin',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Ronin',
        productIds: ['prod-rs-5', 'prod-rs4-pro', 'prod-rs4', 'prod-rs-4-mini', 'acc-case-rs']
      },
      {
        id: 'g-mic',
        title: 'DJI Mic',
        series: 'Mic',
        sidebarId: 'mic',
        viewAllCategory: 'handheld',
        viewAllSeries: 'Mic',
        productIds: ['prod-mic-2', 'prod-mic-mini', 'prod-dji-mic']
      }
    ]
  },
  {
    id: 'power',
    layout: 'series-grid',
    sidebar: [
      { id: 'stations', label: 'Power Stations', series: 'Power' },
      { id: 'care', label: 'DJI Care', series: 'Mavic' }
    ],
    groups: [
      {
        id: 'g-stations',
        title: 'DJI Power',
        series: 'Power',
        sidebarId: 'stations',
        viewAllCategory: 'power',
        viewAllSeries: 'Power',
        productIds: ['prod-power-500', 'prod-power-1000', 'prod-power-2000']
      },
      {
        id: 'g-care-power',
        title: 'DJI Care Refresh',
        series: 'Mavic',
        sidebarId: 'care',
        viewAllCategory: 'power-care',
        productIds: ['acc-care-m4p', 'acc-care-air3s', 'acc-care-mini', 'acc-care-action']
      }
    ]
  },
  {
    id: 'services',
    layout: 'product-grid',
    sidebar: [
      { id: 'care', label: 'DJI Care' },
      { id: 'easa', label: 'EASA Guide' }
    ],
    groups: [
      {
        id: 'g-care',
        title: 'DJI Care Refresh',
        sidebarId: 'care',
        viewAllCategory: 'power-care',
        productIds: ['acc-care-m4p', 'acc-care-air3s', 'acc-care-mini', 'acc-care-action', 'acc-care-inspire']
      },
      {
        id: 'g-easa',
        title: 'EASA Open Category',
        sidebarId: 'easa',
        viewAllCategory: 'camera-drones',
        productIds: ['prod-mini-4-pro', 'prod-neo', 'prod-flip']
      }
    ],
    editorial: {
      title: 'Coverage & EU flight rules',
      body: 'Protect your aircraft with Care Refresh and review EASA Open Category rules before you fly.',
      ctaLabel: 'Open EASA Guide',
      ctaView: 'easa-guide'
    }
  },
  {
    id: 'accessories',
    layout: 'series-grid',
    sidebar: [
      { id: 'mavic', label: 'DJI Mavic', series: 'Mavic' },
      { id: 'air', label: 'DJI Air', series: 'Air' },
      { id: 'mini', label: 'DJI Mini', series: 'Mini' },
      { id: 'flip', label: 'DJI Flip', series: 'Flip' },
      { id: 'avata', label: 'DJI Avata & FPV', series: 'Avata' },
      { id: 'neo', label: 'DJI Neo', series: 'Neo' },
      { id: 'inspire', label: 'DJI Inspire', series: 'Inspire' },
      { id: 'pocket', label: 'Osmo Pocket', series: 'Pocket' },
      { id: 'action', label: 'Osmo Action', series: 'Action' },
      { id: 'ronin', label: 'Ronin / RS', series: 'Ronin' }
    ],
    groups: [
      {
        id: 'acc-mavic',
        title: 'Mavic accessories',
        series: 'Mavic',
        sidebarId: 'mavic',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Mavic',
        productIds: ['acc-bat-m4p', 'acc-nd-m4p', 'acc-fmk-m4p', 'acc-rc2']
      },
      {
        id: 'acc-air',
        title: 'Air accessories',
        series: 'Air',
        sidebarId: 'air',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Air',
        productIds: ['acc-bat-air', 'acc-nd-air', 'acc-hub-air']
      },
      {
        id: 'acc-mini',
        title: 'Mini accessories',
        series: 'Mini',
        sidebarId: 'mini',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Mini',
        productIds: ['acc-bat-mini', 'acc-nd-mini', 'acc-fmk-mini']
      },
      {
        id: 'acc-flip',
        title: 'Flip accessories',
        series: 'Flip',
        sidebarId: 'flip',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Flip',
        productIds: ['acc-nd-flip', 'acc-rc-n3']
      },
      {
        id: 'acc-avata',
        title: 'Avata & FPV accessories',
        series: 'Avata',
        sidebarId: 'avata',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Avata',
        productIds: ['acc-bat-avata', 'prod-goggles-3', 'prod-goggles-n3', 'prod-rc-motion-3']
      },
      {
        id: 'acc-neo',
        title: 'Neo accessories',
        series: 'Neo',
        sidebarId: 'neo',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Neo',
        productIds: ['acc-bat-neo', 'acc-props-neo']
      },
      {
        id: 'acc-inspire',
        title: 'Inspire accessories',
        series: 'Inspire',
        sidebarId: 'inspire',
        viewAllCategory: 'power-care',
        viewAllSeries: 'Inspire',
        productIds: ['acc-care-inspire']
      },
      {
        id: 'acc-pocket',
        title: 'Pocket accessories',
        series: 'Pocket',
        sidebarId: 'pocket',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Pocket',
        productIds: ['acc-bat-pocket', 'acc-tripod-pocket']
      },
      {
        id: 'acc-action',
        title: 'Action accessories',
        series: 'Action',
        sidebarId: 'action',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Action',
        productIds: ['acc-filter-action']
      },
      {
        id: 'acc-ronin',
        title: 'RS accessories',
        series: 'Ronin',
        sidebarId: 'ronin',
        viewAllCategory: 'accessories',
        viewAllSeries: 'Ronin',
        productIds: ['acc-case-rs']
      }
    ]
  },
  {
    id: 'education',
    layout: 'series-grid',
    sidebar: [
      { id: 'enterprise', label: 'Enterprise', series: 'Inspire' },
      { id: 'education', label: 'Education', series: 'Education' }
    ],
    groups: [
      {
        id: 'g-enterprise',
        title: 'Cinema & industry',
        series: 'Inspire',
        sidebarId: 'enterprise',
        viewAllCategory: 'professional',
        viewAllSeries: 'Inspire',
        productIds: ['prod-inspire-3', 'prod-matrice-4t', 'prod-matrice-4e']
      },
      {
        id: 'g-education',
        title: 'Education kits',
        series: 'Education',
        sidebarId: 'education',
        viewAllCategory: 'professional',
        viewAllSeries: 'Education',
        productIds: ['prod-robomaster-ep']
      }
    ]
  },
  {
    id: 'refurbished',
    layout: 'product-grid',
    sidebar: [],
    groups: [
      {
        id: 'g-refurb',
        title: 'Official Refurbished',
        viewAllCategory: 'refurbished',
        viewAllSeries: 'Refurbished',
        productIds: ['refurb-mini-4-pro', 'refurb-air-3s', 'refurb-pocket-3']
      }
    ],
    editorial: {
      title: 'Official Refurbished',
      body: 'Factory-certified aircraft and handhelds with inspection reports and EU statutory warranty.',
      ctaLabel: 'Shop refurbished',
      ctaCategory: 'refurbished'
    }
  }
];

export function getMegaPanel(id: string): MegaPanelConfig | undefined {
  return MEGA_MENU_PANELS.find((panel) => panel.id === id);
}

export function resolveMegaGroup(group: MegaGroup): ResolvedMegaGroup {
  const products = group.productIds
    .map((id) => DJI_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  return { ...group, products };
}

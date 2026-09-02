export interface ContentNavItem {
  slug: string;
  label?: string;
}

export interface ContentNavGroup {
  id: string;
  label: string;
  items: ContentNavItem[];
}

export interface ContentNavSection {
  id: string;
  title: string;
  pathPrefix: string;
  groups: ContentNavGroup[];
}

export const HELP_CENTER_NAV: ContentNavSection = {
  id: 'help',
  title: 'Help Center',
  pathPrefix: '/help',
  groups: [
    {
      id: 'payment',
      label: 'About Payment',
      items: [
        { slug: 'payment-methods', label: 'Payment Methods' },
        { slug: 'order-information', label: 'Order Information' }
      ]
    },
    {
      id: 'shipping',
      label: 'Shipping and Delivery',
      items: [
        { slug: 'shipping-time', label: 'Shipping Time' },
        { slug: 'shipping-fees', label: 'Delivery and Shipping Fee' },
        { slug: 'order-tracking', label: 'Order and Logistics Tracking' },
        { slug: 'delivery-inspection', label: 'Inspection and Sign' },
        { slug: 'shipping-faq', label: 'Logistics and Order FAQ' }
      ]
    },
    {
      id: 'aftersales',
      label: 'Aftersales Service',
      items: [
        { slug: 'return-policy', label: 'Return Policy' },
        { slug: 'repair-services', label: 'Repair Services' },
        { slug: 'after-sales-policies', label: 'Service Policies' },
        { slug: 'technical-support', label: 'Technical Support' }
      ]
    }
  ]
};

export const PROGRAMS_NAV: ContentNavSection = {
  id: 'programs',
  title: 'Programs',
  pathPrefix: '/programs',
  groups: [
    {
      id: 'programs-all',
      label: 'Programs',
      items: [
        { slug: 'store-credit', label: 'Store EU Credit' },
        { slug: 'store-app', label: 'Store EU App' }
      ]
    }
  ]
};

export const EXPLORE_NAV: ContentNavSection = {
  id: 'explore',
  title: 'Explore',
  pathPrefix: '/explore',
  groups: [
    {
      id: 'explore-all',
      label: 'Explore',
      items: [
        { slug: 'pilot-gallery', label: 'Pilot Gallery' },
        { slug: 'community', label: 'Community Forum' },
        { slug: 'buying-guides', label: 'Buying Guides' },
        { slug: 'fly-safe', label: 'Fly Safe' },
        { slug: 'flying-tips', label: 'Flying Tips' }
      ]
    }
  ]
};

export const COMPANY_NAV: ContentNavSection = {
  id: 'company',
  title: 'Company',
  pathPrefix: '/company',
  groups: [
    {
      id: 'company-all',
      label: 'Company',
      items: [
        { slug: 'who-we-are', label: 'Who We Are' },
        { slug: 'contact', label: 'Contact Us' },
        { slug: 'careers', label: 'Careers' },
        { slug: 'flagship-stores', label: 'Flagship Stores' }
      ]
    }
  ]
};

export const CONTENT_NAV_SECTIONS: ContentNavSection[] = [
  HELP_CENTER_NAV,
  PROGRAMS_NAV,
  EXPLORE_NAV,
  COMPANY_NAV
];

export function getNavSectionForSlug(slug: string): ContentNavSection | undefined {
  for (const section of CONTENT_NAV_SECTIONS) {
    for (const group of section.groups) {
      if (group.items.some((item) => item.slug === slug)) {
        return section;
      }
    }
  }
  return undefined;
}

export function getNavGroupForSlug(slug: string): ContentNavGroup | undefined {
  for (const section of CONTENT_NAV_SECTIONS) {
    for (const group of section.groups) {
      if (group.items.some((item) => item.slug === slug)) {
        return group;
      }
    }
  }
  return undefined;
}

export function getNavLabel(slug: string, fallbackTitle: string): string {
  for (const section of CONTENT_NAV_SECTIONS) {
    for (const group of section.groups) {
      const item = group.items.find((entry) => entry.slug === slug);
      if (item?.label) return item.label;
    }
  }
  return fallbackTitle;
}

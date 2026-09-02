import { describe, expect, it } from 'vitest';
import { getNavSectionForSlug, HELP_CENTER_NAV } from './storeContentNavigation';

describe('storeContentNavigation', () => {
  it('groups shipping articles under Shipping and Delivery', () => {
    const shippingGroup = HELP_CENTER_NAV.groups.find((g) => g.id === 'shipping');
    expect(shippingGroup?.items.map((i) => i.slug)).toEqual([
      'shipping-time',
      'shipping-fees',
      'order-tracking',
      'delivery-inspection',
      'shipping-faq'
    ]);
  });

  it('resolves nav section for help slugs', () => {
    expect(getNavSectionForSlug('shipping-fees')?.id).toBe('help');
    expect(getNavSectionForSlug('pilot-gallery')?.id).toBe('explore');
  });
});

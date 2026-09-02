import { describe, expect, it } from 'vitest';
import { STORE_CONTENT_PAGES } from './storeContentPages';
import { hrefFromStoreLink, storeFromPath } from '../lib/routing';

describe('storeContentPages', () => {
  it('defines all footer help, program, explore, and company pages', () => {
    expect(STORE_CONTENT_PAGES.length).toBeGreaterThanOrEqual(18);
    const slugs = STORE_CONTENT_PAGES.map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        'payment-methods',
        'shipping-fees',
        'return-policy',
        'store-credit',
        'buying-guides',
        'fly-safe',
        'who-we-are',
        'contact',
        'careers',
        'flagship-stores'
      ])
    );
  });

  it('routes content pages from URL paths', () => {
    const boot = storeFromPath('/help/payment-methods');
    expect(boot.viewMode).toBe('content');
    expect(boot.contentPageSlug).toBe('payment-methods');
  });

  it('redirects legacy shipping-delivery path to shipping-fees', () => {
    const boot = storeFromPath('/help/shipping-delivery');
    expect(boot.viewMode).toBe('content');
    expect(boot.contentPageSlug).toBe('shipping-fees');
  });

  it('builds hrefs for footer and content links', () => {
    expect(hrefFromStoreLink({ kind: 'content', slug: 'payment-methods' })).toBe('/help/payment-methods');
    expect(hrefFromStoreLink({ kind: 'plp', category: 'accessories' })).toBe('/category/accessories');
    expect(hrefFromStoreLink({ kind: 'view', mode: 'account' })).toBe('/account');
  });

  it('defines split shipping help articles', () => {
    const slugs = STORE_CONTENT_PAGES.map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        'shipping-time',
        'shipping-fees',
        'order-tracking',
        'delivery-inspection',
        'shipping-faq'
      ])
    );
  });
});

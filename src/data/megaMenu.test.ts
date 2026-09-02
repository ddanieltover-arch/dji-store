import { describe, expect, it } from 'vitest';
import { MEGA_MENU_PANELS, resolveMegaGroup } from './megaMenu';
import { hasStorefrontListingImage, productListingImage } from '../lib/pim/productListingImage';

describe('megaMenu listing images', () => {
  it('resolves every header category product to an official CDN listing cover when cached', () => {
    const productIds = [...new Set(MEGA_MENU_PANELS.flatMap((panel) => panel.groups.flatMap((g) => g.productIds)))];

    expect(productIds.length).toBeGreaterThan(50);

    const unresolved: string[] = [];

    for (const panel of MEGA_MENU_PANELS) {
      for (const group of panel.groups) {
        const resolved = resolveMegaGroup(group);
        for (const product of resolved.products) {
          const src = productListingImage(product);
          if (!hasStorefrontListingImage(product)) {
            unresolved.push(`${panel.id}/${group.id}: ${product.modelName} (${product.slug}) -> ${src}`);
          }
        }
      }
    }

    expect(unresolved, unresolved.join('\n')).toEqual([]);
  });
});

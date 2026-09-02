import { describe, expect, it } from 'vitest';
import { MEGA_MENU_PANELS, resolveMegaGroup } from './megaMenu';
import { isExternalCdnUrl, productListingImage } from '../lib/pim/productListingImage';

describe('megaMenu listing images', () => {
  it('never hotlinks reference CDN URLs for header category products', () => {
    const productIds = [...new Set(MEGA_MENU_PANELS.flatMap((panel) => panel.groups.flatMap((g) => g.productIds)))];

    expect(productIds.length).toBeGreaterThan(50);

    const cdnLeaks: string[] = [];

    for (const panel of MEGA_MENU_PANELS) {
      for (const group of panel.groups) {
        const resolved = resolveMegaGroup(group);
        for (const product of resolved.products) {
          const src = productListingImage(product);
          if (isExternalCdnUrl(src)) {
            cdnLeaks.push(`${panel.id}/${group.id}: ${product.modelName} (${product.slug}) -> ${src}`);
          }
        }
      }
    }

    expect(cdnLeaks, cdnLeaks.join('\n')).toEqual([]);
  });
});

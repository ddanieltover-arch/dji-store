import { describe, expect, it } from 'vitest';
import { productListingImage, isStorefrontImageUrl, isLocalPlaceholderUrl, isDatabaseAssetUrl } from './productListingImage';
import type { Product } from '../../types';

describe('productListingImage', () => {
  it('never returns reference CDN URLs', () => {
    const product = {
      id: 'prod-test',
      slug: 'test-product',
      images: {
        cutout: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/example@origin.png',
        hero: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/example@origin.png',
        gallery: []
      }
    } as Product;

    expect(productListingImage(product)).toBe('/products/prod-test-cutout.png');
    expect(productListingImage(product)).not.toContain('se-cdn.djiits.com');
  });

  it('prefers database asset URLs', () => {
    const product = {
      id: 'prod-test',
      slug: 'dji-mavic-3-pro',
      images: {
        cutout: '/api/assets/abc',
        hero: '/api/assets/abc',
        gallery: []
      }
    } as Product;

    expect(isDatabaseAssetUrl(product.images.cutout)).toBe(true);
    expect(isStorefrontImageUrl(product.images.cutout)).toBe(true);
  });

  it('uses local placeholder when no database media exists', () => {
    const product = {
      id: 'prod-mini-5-pro',
      slug: 'unknown-slug',
      images: {
        cutout: '/products/prod-mini-5-pro-cutout.png',
        hero: '/products/prod-mini-5-pro-cutout.png',
        gallery: []
      }
    } as Product;

    expect(isLocalPlaceholderUrl(product.images.cutout)).toBe(true);
    expect(productListingImage(product)).toBe('/products/prod-mini-5-pro-cutout.png');
  });
});

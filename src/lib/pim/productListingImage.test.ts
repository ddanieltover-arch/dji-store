import { describe, expect, it } from 'vitest';
import { productListingImage, isStorefrontImageUrl, isLocalPlaceholderUrl } from './productListingImage';
import type { Product } from '../../types';

describe('productListingImage', () => {
  it('prefers remote CDN cutout over local placeholder paths', () => {
    const product = {
      images: {
        cutout: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/example@origin.png',
        hero: '/products/local-cutout.png',
        gallery: []
      }
    } as Product;

    expect(productListingImage(product)).toBe(product.images.cutout);
  });

  it('skips localhost ingested assets', () => {
    const product = {
      slug: 'test-localhost-listing-fallback',
      images: {
        cutout: 'http://localhost:3015/api/assets/abc',
        hero: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/example@origin.png',
        gallery: []
      }
    } as Product;

    expect(productListingImage(product)).toBe(product.images.hero);
    expect(isStorefrontImageUrl(product.images.cutout)).toBe(false);
  });

  it('skips local /products placeholder paths', () => {
    const product = {
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

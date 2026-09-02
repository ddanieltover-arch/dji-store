import { describe, expect, it } from 'vitest';
import { applyCatalogPresentation } from './catalogPresentation';
import { sku } from '../../data/officialStoreCatalog';
import officialUsdPriceCache from '../../data/officialUsdPriceCache.json';
import type { OfficialUsdPriceCache } from '../pricing/applyUsdPricing';

const usdCache = officialUsdPriceCache as OfficialUsdPriceCache;

describe('catalogPresentation', () => {
  it('expands generic single-variant parent PDPs from USD cache combos', () => {
    const flip = sku({
      id: 'w6-dji-flip',
      sku: 'W6-FLIP',
      slug: 'dji-flip',
      modelName: 'DJI Flip',
      series: 'Flip',
      category: 'camera-drones',
      categoryLabel: 'Camera Drone',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 400,
      weightGrams: 249
    });

    const [presented] = applyCatalogPresentation([flip], { usdCache, mediaCache: {} });
    expect(presented.variants.length).toBeGreaterThanOrEqual(2);
    const prices = new Set(presented.variants.map((v) => v.priceEur));
    expect(prices.size).toBe(presented.variants.length);
  });

  it('does not expand dedicated combo PDP slugs', () => {
    const combo = sku({
      id: 'w6-dji-flip-fly-more-combo-rc-2',
      sku: 'W6-FMC',
      slug: 'dji-flip-fly-more-combo-rc-2',
      modelName: 'DJI Flip Fly More Combo (RC 2)',
      series: 'Flip',
      category: 'camera-drones',
      categoryLabel: 'Fly More Combo',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 779,
      weightGrams: 249
    });

    const [presented] = applyCatalogPresentation([combo], { usdCache, mediaCache: {} });
    expect(presented.variants).toHaveLength(1);
  });

  it('resyncs outdated Mavic 3 Pro variants from official USD cache', () => {
    const m3p = sku({
      id: 'prod-mavic-3-pro',
      sku: 'DJI-DRONE-M3P',
      slug: 'dji-mavic-3-pro',
      modelName: 'DJI Mavic 3 Pro',
      series: 'Mavic',
      category: 'camera-drones',
      categoryLabel: 'Triple-Camera Flagship',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 1899,
      weightGrams: 958
    });

    const [presented] = applyCatalogPresentation([m3p], { usdCache, mediaCache: {} });
    expect(presented.variants.length).toBe(4);
    expect(presented.variants.map((v) => v.comboName)).toContain('Mavic 3 Pro (DJI RC)');
    expect(presented.variants.map((v) => v.comboName)).toContain('Mavic 3 Pro Cine Premium Combo (DJI RC Pro)');
  });

  it('ensures at least three gallery image paths', () => {
    const sample = sku({
      id: 'prod-mini-4-pro',
      sku: 'MINI4P',
      slug: 'dji-mini-4-pro',
      modelName: 'DJI Mini 4 Pro',
      series: 'Mini',
      category: 'camera-drones',
      categoryLabel: 'Mini',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 699,
      weightGrams: 249
    });

    const [presented] = applyCatalogPresentation([sample], {
      usdCache,
      mediaCache: {
        'dji-mini-4-pro': {
          slug: 'dji-mini-4-pro',
          status: 200,
          coverOriginal: 'https://se-cdn.djiits.com/example.png',
          fetchedAt: new Date().toISOString()
        }
      }
    });

    expect(new Set(presented.images.gallery).size).toBeGreaterThanOrEqual(3);
    expect(presented.variants.every((v) => v.imageUrl)).toBe(true);
  });

  it('prefers official carousel gallery frames over placeholder cutouts', () => {
    const sample = sku({
      id: 'prod-mavic-3-pro',
      sku: 'DJI-DRONE-M3P',
      slug: 'dji-mavic-3-pro',
      modelName: 'DJI Mavic 3 Pro',
      series: 'Mavic',
      category: 'camera-drones',
      categoryLabel: 'Flagship',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 1899,
      weightGrams: 958
    });

    const carousel = [
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/a@origin.jpg',
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/b@origin.jpg',
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/c@origin.jpg'
    ];

    const [presented] = applyCatalogPresentation([sample], {
      usdCache,
      mediaCache: {
        'dji-mavic-3-pro': {
          slug: 'dji-mavic-3-pro',
          status: 200,
          coverOriginal: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/x@origin.png',
          carouselGallery: carousel,
          fetchedAt: new Date().toISOString()
        }
      }
    });

    expect(presented.images.gallery).toEqual(carousel);
    expect(presented.images.gallery.every((src) => src.startsWith('https://'))).toBe(true);
    expect(presented.images.cutout).toBe('https://se-cdn.djiits.com/tpc/uploads/spu/cover/x@origin.png');
  });

  it('hydrates intro video from media cache', () => {
    const sample = sku({
      id: 'prod-mini-4-pro',
      sku: 'MINI4P',
      slug: 'dji-mini-4-pro',
      modelName: 'DJI Mini 4 Pro',
      series: 'Mini',
      category: 'camera-drones',
      categoryLabel: 'Mini',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 699,
      weightGrams: 249
    });

    const [presented] = applyCatalogPresentation([sample], {
      usdCache,
      mediaCache: {
        'dji-mini-4-pro': {
          slug: 'dji-mini-4-pro',
          status: 200,
          coverOriginal: 'https://se-cdn.djiits.com/example.png',
          intro: {
            videoUrl: 'https://se-cdn.djiits.com/uploads/video/intro.mp4'
          },
          fetchedAt: new Date().toISOString()
        }
      }
    });

    expect(presented.media?.intro?.videoUrl).toContain('.mp4');
    expect(presented.media?.model3d).toBeUndefined();
  });

  it('uses official cover for listing even when database gallery is localhost', () => {
    const sample = sku({
      id: 'prod-mavic-3-pro',
      sku: 'DJI-DRONE-M3P',
      slug: 'dji-mavic-3-pro',
      modelName: 'DJI Mavic 3 Pro',
      series: 'Mavic',
      category: 'camera-drones',
      categoryLabel: 'Flagship',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 1899,
      weightGrams: 958
    });

    const dbGallery = [
      'http://localhost:3015/api/assets/11111111-1111-1111-1111-111111111111',
      'http://localhost:3015/api/assets/22222222-2222-2222-2222-222222222222',
      'http://localhost:3015/api/assets/33333333-3333-3333-3333-333333333333'
    ];

    const [presented] = applyCatalogPresentation([sample], {
      usdCache,
      mediaCache: {
        'dji-mavic-3-pro': {
          slug: 'dji-mavic-3-pro',
          status: 200,
          coverOriginal: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/x@origin.png',
          carouselGallery: ['https://se-cdn.djiits.com/example.jpg'],
          fetchedAt: new Date().toISOString()
        }
      },
      databaseMediaCache: {
        'dji-mavic-3-pro': {
          slug: 'dji-mavic-3-pro',
          hero: dbGallery[0],
          cutout: dbGallery[0],
          gallery: dbGallery,
          ingestedAt: new Date().toISOString()
        }
      }
    });

    expect(presented.images.cutout).toBe('https://se-cdn.djiits.com/tpc/uploads/spu/cover/x@origin.png');
    expect(presented.images.gallery).toEqual(dbGallery);
    expect(presented.images.gallery.every((src) => src.includes('/api/assets/'))).toBe(true);
  });
});

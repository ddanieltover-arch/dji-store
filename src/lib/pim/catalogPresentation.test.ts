import { describe, expect, it } from 'vitest';
import { applyCatalogPresentation } from './catalogPresentation';
import { sku } from '../../data/officialStoreCatalog';
import officialUsdPriceCache from '../../data/officialUsdPriceCache.json';
import type { OfficialUsdPriceCache } from '../pricing/applyUsdPricing';

const usdCache = officialUsdPriceCache as OfficialUsdPriceCache;

describe('applyCatalogPresentation', () => {
  it('expands variants from official USD cache for flagship drones', () => {
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
    expect(presented.variants.length).toBeGreaterThan(1);
    expect(presented.variants.map((v) => v.comboName)).toContain('Mavic 3 Pro (DJI RC)');
  });

  it('does not expand dedicated combo PDPs', () => {
    const combo = sku({
      id: 'prod-flip-fly-more',
      sku: 'FLIP-FMC',
      slug: 'dji-flip-fly-more-combo-rc-2',
      modelName: 'DJI Flip Fly More Combo',
      series: 'Flip',
      category: 'camera-drones',
      categoryLabel: 'Combo',
      tagline: 'Test',
      description: 'Test',
      basePriceEur: 999,
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

  it('uses local placeholders instead of reference CDN when not ingested', () => {
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

    const carousel = [
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/a@origin.jpg',
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/b@origin.jpg',
      'https://se-cdn.djiits.com/tpc/uploads/carousel/image/c@origin.jpg'
    ];

    const [presented] = applyCatalogPresentation([sample], {
      usdCache,
      mediaCache: {
        'dji-mini-4-pro': {
          slug: 'dji-mini-4-pro',
          status: 200,
          coverOriginal: 'https://se-cdn.djiits.com/tpc/uploads/spu/cover/x@origin.png',
          carouselGallery: carousel,
          fetchedAt: new Date().toISOString()
        }
      }
    });

    expect(presented.images.gallery.every((src) => !src.includes('se-cdn.djiits.com'))).toBe(true);
    expect(presented.images.cutout).toBe('/products/prod-mini-4-pro-cutout.png');
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

    expect(presented.media?.intro).toBeUndefined();
    expect(presented.media?.model3d).toBeUndefined();
  });

  it('uses database-ingested gallery URLs when available', () => {
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
      '/api/assets/11111111-1111-1111-1111-111111111111',
      '/api/assets/22222222-2222-2222-2222-222222222222',
      '/api/assets/33333333-3333-3333-3333-333333333333'
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

    expect(presented.images.cutout).toBe(dbGallery[0]);
    expect(presented.images.gallery).toEqual(dbGallery);
    expect(presented.images.gallery.every((src) => src.includes('/api/assets/'))).toBe(true);
  });
});

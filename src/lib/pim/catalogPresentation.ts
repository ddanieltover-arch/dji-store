import { Product, ProductVariant } from '../../types';
import { OfficialUsdPriceCache, applyUsdPricingToProduct, combosForProduct } from '../pricing/applyUsdPricing';
import { OfficialStoreMediaCache } from './fetchOfficialStoreMedia';
import { DatabaseMediaCache, hasDatabaseGallery } from './databaseMediaCache';
import { isLocalPlaceholderUrl, isStorefrontImageUrl } from './productListingImage';
import { usdToCompareAtEur, usdToSaleEur } from '../pricing/usdPricing';

const DEDICATED_COMBO_SLUG =
  /-(fly-more-combo|fly-smart-combo|creator-combo|standard-combo|sport-bundle|solar-car|car-power-combo|transmission-combo|tx-rx|combo-lite|combo-plus)(-|$)/i;

function isDedicatedComboPdp(slug: string): boolean {
  if (DEDICATED_COMBO_SLUG.test(slug)) return true;
  if (/tx-rx/i.test(slug)) return true;
  if (/-combo(?:-|$)/i.test(slug)) return true;
  if (/-bundle(?:-|$)/i.test(slug)) return true;
  if (/-sb$/i.test(slug)) return true;
  return false;
}

function isGenericSingleVariant(product: Product): boolean {
  if (product.variants.length !== 1) return false;
  const v = product.variants[0];
  return v.comboName === 'Standard' || v.id.endsWith('-std');
}

function shouldExpandVariants(product: Product, combos: { title: string; usd: number }[]): boolean {
  if (isDedicatedComboPdp(product.slug)) return false;
  if (!isGenericSingleVariant(product) && product.variants.length > 1) return false;
  if (product.variants.length !== 1) return false;
  if (!isGenericSingleVariant(product)) return false;
  return combosForProduct(product, combos).length >= 2;
}

function shouldResyncVariantsFromCache(product: Product, combos: { title: string; usd: number }[]): boolean {
  if (isDedicatedComboPdp(product.slug)) return false;
  const primary = combosForProduct(product, combos);
  if (primary.length < 2) return false;
  if (shouldExpandVariants(product, combos)) return true;

  const cachePrices = [...new Set(primary.map((c) => usdToSaleEur(c.usd)))].sort((a, b) => a - b);
  const variantPrices = [...new Set(product.variants.map((v) => v.priceEur))].sort((a, b) => a - b);
  const outdatedNames = product.variants.some((v) => /^(standard|cine|basic|essential)$/i.test(v.comboName.trim()));

  if (product.variants.length !== primary.length && outdatedNames) return true;
  if (variantPrices.length !== cachePrices.length) return true;
  if (variantPrices.some((price, index) => Math.abs(price - cachePrices[index]) > 2)) return true;

  return false;
}

function comboVariantName(title: string): string {
  return title.replace(/^DJI\s+/i, '').trim();
}

function expandVariantsFromCache(product: Product, combos: { title: string; usd: number }[]): Product {
  const seenUsd = new Set<number>();
  const seenEur = new Set<number>();
  const primary = combosForProduct(product, combos)
    .sort((a, b) => a.usd - b.usd)
    .filter((combo) => {
      const eur = usdToSaleEur(combo.usd);
      if (seenUsd.has(combo.usd) || seenEur.has(eur)) return false;
      seenUsd.add(combo.usd);
      seenEur.add(eur);
      return true;
    });
  const variants: ProductVariant[] = primary.map((combo, index) => ({
    id: `var-${product.id}-combo-${index}`,
    sku: `${product.sku}-C${index + 1}`,
    comboName: comboVariantName(combo.title),
    priceEur: usdToSaleEur(combo.usd),
    weightGrams: product.weightGrams,
    inStock: true,
    stockQuantity: 24,
    includedItems: [combo.title, '2-Year Official EU Warranty'],
    imageUrl: product.images.cutout
  }));

  const cheapest = variants[0];
  const cheapestUsd = primary[0].usd;

  return {
    ...product,
    basePriceEur: cheapest.priceEur,
    compareAtPriceEur: usdToCompareAtEur(cheapestUsd),
    variants
  };
}

function listingCoverFromSources(
  product: Product,
  officialCover?: string,
  dbCutout?: string,
  dbHero?: string
): { cutout: string; hero: string } {
  const remoteDbCutout = isStorefrontImageUrl(dbCutout) ? dbCutout : undefined;
  const remoteDbHero = isStorefrontImageUrl(dbHero) ? dbHero : undefined;
  const seedCutout =
    isStorefrontImageUrl(product.images.cutout) && !isLocalPlaceholderUrl(product.images.cutout)
      ? product.images.cutout
      : undefined;
  const seedHero =
    isStorefrontImageUrl(product.images.hero) && !isLocalPlaceholderUrl(product.images.hero)
      ? product.images.hero
      : undefined;
  const galleryCdn = product.images.gallery?.find(
    (url) => isStorefrontImageUrl(url) && !isLocalPlaceholderUrl(url)
  );

  const listingCover =
    officialCover || remoteDbCutout || remoteDbHero || seedCutout || seedHero || galleryCdn;

  return {
    cutout: listingCover || product.images.cutout,
    hero: listingCover || product.images.hero
  };
}

function galleryPaths(
  product: Product,
  media?: { coverOriginal?: string; coverLarge?: string; carouselGallery?: string[] }
): Product['images'] {
  const cdnCover = media?.coverOriginal || media?.coverLarge;
  const carousel = media?.carouselGallery?.filter(Boolean) ?? [];
  const listing = listingCoverFromSources(product, cdnCover);

  if (carousel.length >= 3) {
    return {
      cutout: listing.cutout,
      hero: listing.hero || carousel[0],
      gallery: carousel
    };
  }

  const g2 = `/products/${product.id}-gallery-2.png`;
  const g3 = `/products/${product.id}-gallery-3.png`;
  const gallery = [...new Set([cdnCover, listing.cutout, g2, g3].filter(Boolean))] as string[];

  return {
    cutout: listing.cutout,
    hero: listing.hero || cdnCover || listing.cutout,
    gallery: gallery.length >= 3 ? gallery : [...gallery, g2, g3].filter((v, i, a) => a.indexOf(v) === i)
  };
}

function applyMediaGallery(
  product: Product,
  mediaCache: OfficialStoreMediaCache,
  databaseMediaCache?: DatabaseMediaCache
): Product {
  const dbMedia = databaseMediaCache?.[product.slug];
  const media = mediaCache[product.slug];
  const officialCover = media?.coverOriginal || media?.coverLarge;
  const listing = listingCoverFromSources(
    product,
    officialCover,
    dbMedia?.cutout,
    dbMedia?.hero
  );
  const images = hasDatabaseGallery(dbMedia)
    ? {
        cutout: listing.cutout,
        hero: listing.hero,
        gallery: dbMedia!.gallery!
      }
    : galleryPaths(product, media);
  const variants = product.variants.map((v) => ({
    ...v,
    imageUrl: v.imageUrl || images.cutout || images.hero
  }));

  const productMedia: Product['media'] = {};
  if (media?.intro?.videoUrl) {
    productMedia.intro = media.intro;
  }

  return {
    ...product,
    images,
    variants,
    media: Object.keys(productMedia).length ? productMedia : undefined
  };
}

function applyPricingAndVariants(product: Product, usdCache: OfficialUsdPriceCache): Product {
  const entry = usdCache[product.slug];
  if (!entry?.combos?.length) return product;

  if (shouldExpandVariants(product, entry.combos) || shouldResyncVariantsFromCache(product, entry.combos)) {
    return expandVariantsFromCache(product, entry.combos);
  }

  return applyUsdPricingToProduct(product, entry);
}

export interface CatalogPresentationOptions {
  usdCache: OfficialUsdPriceCache;
  mediaCache: OfficialStoreMediaCache;
  databaseMediaCache?: DatabaseMediaCache;
}

export function applyCatalogPresentation(products: Product[], options: CatalogPresentationOptions): Product[] {
  return products.map((product) => {
    const priced = applyPricingAndVariants(product, options.usdCache);
    return applyMediaGallery(priced, options.mediaCache, options.databaseMediaCache);
  });
}

export function catalogPresentationStats(products: Product[]): {
  multiGallery: number;
  multiVariant: number;
  variantImages: number;
} {
  return {
    multiGallery: products.filter((p) => new Set(p.images.gallery).size >= 3).length,
    multiVariant: products.filter((p) => p.variants.length > 1).length,
    variantImages: products.filter((p) => p.variants.some((v) => v.imageUrl)).length
  };
}

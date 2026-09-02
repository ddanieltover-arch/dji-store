import { Product, ProductVariant } from '../../types';
import type { OfficialStoreMediaCache } from './fetchOfficialStoreMedia';
import {
  DatabaseMediaCache,
  hasDatabaseMedia,
  isDatabaseAssetUrl,
  isExternalCdnUrl
} from './databaseMediaCache';
import { resolveVariantImageUrl } from './comboSlugResolver';
import { usdToCompareAtEur, usdToSaleEur } from '../pricing/usdPricing';
import { OfficialUsdPriceCache, applyUsdPricingToProduct, combosForProduct } from '../pricing/applyUsdPricing';

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

function expandVariantsFromCache(
  product: Product,
  combos: { title: string; usd: number }[],
  databaseMediaCache?: DatabaseMediaCache
): Product {
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
    imageUrl:
      resolveVariantImageUrl({
        productSlug: product.slug,
        comboTitle: combo.title,
        databaseMediaCache,
        fallback: product.images.cutout
      }) || product.images.cutout
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

/** Local bundled PNGs — never hotlink the reference CDN. */
function localFallbackImages(product: Product): Product['images'] {
  const cutout = `/products/${product.id}-cutout.png`;
  const g2 = `/products/${product.id}-gallery-2.png`;
  const g3 = `/products/${product.id}-gallery-3.png`;
  return {
    cutout,
    hero: cutout,
    gallery: [cutout, g2, g3]
  };
}

function applyMediaGallery(
  product: Product,
  mediaCache: OfficialStoreMediaCache,
  databaseMediaCache?: DatabaseMediaCache
): Product {
  const dbMedia = databaseMediaCache?.[product.slug];
  const media = mediaCache[product.slug];

  const images = hasDatabaseMedia(dbMedia)
    ? {
        cutout: dbMedia!.cutout || dbMedia!.hero || dbMedia!.gallery![0],
        hero: dbMedia!.hero || dbMedia!.gallery![0],
        gallery: dbMedia!.gallery!
      }
    : localFallbackImages(product);

  const variants = product.variants.map((v) => ({
    ...v,
    imageUrl:
      resolveVariantImageUrl({
        productSlug: product.slug,
        comboTitle: v.comboName,
        databaseMediaCache,
        fallback: images.cutout || images.hero
      }) ||
      (isDatabaseAssetUrl(v.imageUrl) ? v.imageUrl : undefined) ||
      images.cutout ||
      images.hero
  }));

  const productMedia: Product['media'] = {};
  if (media?.intro?.videoUrl && !isExternalCdnUrl(media.intro.videoUrl)) {
    productMedia.intro = media.intro;
  }

  return {
    ...product,
    images,
    variants,
    media: Object.keys(productMedia).length ? productMedia : undefined
  };
}

function applyPricingAndVariants(
  product: Product,
  usdCache: OfficialUsdPriceCache,
  databaseMediaCache?: DatabaseMediaCache
): Product {
  const entry = usdCache[product.slug];
  if (!entry?.combos?.length) return product;

  if (shouldExpandVariants(product, entry.combos) || shouldResyncVariantsFromCache(product, entry.combos)) {
    return expandVariantsFromCache(product, entry.combos, databaseMediaCache);
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
    const priced = applyPricingAndVariants(product, options.usdCache, options.databaseMediaCache);
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

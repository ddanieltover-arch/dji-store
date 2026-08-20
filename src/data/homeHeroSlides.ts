import { DJI_PRODUCTS } from './products';
import { Product } from '../types';

export interface HomeHeroSlide {
  id: string;
  productId: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  ctaSecondary?: string;
  imageOverride?: string;
  objectPosition?: string;
}

export interface ResolvedHomeHeroSlide extends HomeHeroSlide {
  product: Product;
  imageSrc: string;
}

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: 'slide-mavic-4-pro',
    productId: 'prod-mavic-4-pro',
    title: 'DJI Mavic 4 Pro',
    tagline: 'Master Every Angle in 8K HDR',
    ctaLabel: 'Shop Now',
    ctaSecondary: 'Learn More',
    objectPosition: 'center 40%'
  },
  {
    id: 'slide-osmo-action-5-pro',
    productId: 'prod-osmo-action-5-pro',
    title: 'Osmo Action 5 Pro',
    tagline: 'Revolutionary Imaging & 4-Hour Battery Stamina',
    ctaLabel: 'Shop Now',
    ctaSecondary: 'Learn More',
    objectPosition: 'center'
  },
  {
    id: 'slide-osmo-pocket-3',
    productId: 'prod-osmo-pocket-3',
    title: 'Osmo Pocket 3',
    tagline: '1-Inch CMOS Sensor in Your Pocket',
    ctaLabel: 'Shop Now',
    ctaSecondary: 'Learn More',
    objectPosition: 'center'
  },
  {
    id: 'slide-mini-4-pro',
    productId: 'prod-mini-4-pro',
    title: 'DJI Mini 4 Pro',
    tagline: 'Under 249g Freedom Across Europe',
    ctaLabel: 'Shop Now',
    ctaSecondary: 'Learn More',
    objectPosition: 'center 35%'
  },
  {
    id: 'slide-air-3s',
    productId: 'prod-air-3s',
    title: 'DJI Air 3S',
    tagline: 'Dual 1-Inch Cameras for Panoramic Travel Cinema',
    ctaLabel: 'Shop Now',
    ctaSecondary: 'Learn More',
    objectPosition: 'center'
  }
];

export function resolveHomeHeroSlides(): ResolvedHomeHeroSlide[] {
  return HOME_HERO_SLIDES.flatMap((slide) => {
    const product = DJI_PRODUCTS.find((item) => item.id === slide.productId);
    if (!product) return [];

    return [
      {
        ...slide,
        product,
        imageSrc: slide.imageOverride || product.images.hero || product.images.gallery[0]
      }
    ];
  });
}

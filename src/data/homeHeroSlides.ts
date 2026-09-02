import { DJI_PRODUCTS } from './products';
import { Product } from '../types';

export type HomeHeroLink =
  | { type: 'product'; productId: string }
  | { type: 'best-sellers' };

export interface HomeHeroSlide {
  id: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  link: HomeHeroLink;
  imageOverride: string;
  objectPosition?: string;
  theme?: 'light' | 'dark';
}

export interface ResolvedHomeHeroSlide extends HomeHeroSlide {
  product?: Product;
  imageSrc: string;
}

const DJI_CDN = 'https://se-cdn.djiits.com/stormsend/uploads';

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: 'slide-top-picks',
    title: 'Top Picks',
    tagline: 'Explore our top-selling gear and upgrade your setup.',
    ctaLabel: 'Shop Now',
    link: { type: 'best-sellers' },
    imageOverride: `${DJI_CDN}/47d5b1dbb51472f8ff80faf7266c3f25.jpg?h=1280&w=5120`,
    objectPosition: 'center',
    theme: 'dark'
  },
  {
    id: 'slide-osmo-action-5-pro',
    title: 'OSMO ACTION 5 PRO',
    tagline: 'Revolutionary Image Quality Action Camera',
    ctaLabel: 'Shop Now',
    link: { type: 'product', productId: 'prod-osmo-action-5-pro' },
    imageOverride: `${DJI_CDN}/0047c5db08422ab81a4f25edaf856707.jpg?h=1280&w=5120`,
    objectPosition: 'center',
    theme: 'light'
  },
  {
    id: 'slide-osmo-action-4',
    title: 'OSMO ACTION 4',
    tagline: 'Action Camera with Best-in-Class Image Quality',
    ctaLabel: 'Shop Now',
    link: { type: 'product', productId: 'prod-osmo-action-4' },
    imageOverride: `${DJI_CDN}/127ab30d0c710e44a0c8b435859af8c3.jpg?h=1280&w=5120`,
    objectPosition: 'center',
    theme: 'light'
  },
  {
    id: 'slide-rs-4-mini',
    title: 'DJI RS 4 MINI',
    tagline: 'Compact and Lightweight Gimbal for Content Creators',
    ctaLabel: 'Shop Now',
    link: { type: 'product', productId: 'prod-rs-4-mini' },
    imageOverride: `${DJI_CDN}/2c85df44e17f06b55aa33f6ac56fd87f.jpg?h=1280&w=5120`,
    objectPosition: 'center',
    theme: 'light'
  }
];

export function resolveHomeHeroSlides(): ResolvedHomeHeroSlide[] {
  return HOME_HERO_SLIDES.flatMap((slide) => {
    if (slide.link.type === 'product') {
      const product = DJI_PRODUCTS.find((item) => item.id === slide.link.productId);
      if (!product) return [];

      return [
        {
          ...slide,
          product,
          imageSrc: slide.imageOverride || product.images.hero || product.images.gallery[0]
        }
      ];
    }

    return [
      {
        ...slide,
        imageSrc: slide.imageOverride
      }
    ];
  });
}

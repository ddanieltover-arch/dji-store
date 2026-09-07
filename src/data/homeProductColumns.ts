export type HomeProductColumnCard = {
  id: string;
  productId: string;
  displayName: string;
  tagline: string;
  /** Official cover/gallery images (local paths under /home/product-columns/). */
  images: string[];
  /** Show "From" before the price, matching store.dji.com hasFrom. */
  hasFrom: boolean;
};

export type HomeProductColumnSideLink = {
  id: string;
  kind: 'guide' | 'accessories';
  eyebrow?: string;
  title: string;
  imageSrc?: string;
  action: { type: 'content'; slug: string } | { type: 'plp'; category: string };
};

/**
 * Official store.dji.com “Handheld · Pro Shooting” ProductColumns module.
 * @see https://store.dji.com/
 */
export const HOME_HANDHELD_PRO_SHOOTING = {
  title: 'Handheld · Pro Shooting Netherlands',
  primary: {
    productId: 'prod-rs-5',
    displayName: 'DJI RS 5',
    tagline: 'Lightweight Commercial Stabilizer',
    imageSrc: '/home/product-columns/handheld/rs-5-primary.jpg',
    hasFrom: true
  },
  products: [
    {
      id: 'rs-4-mini',
      productId: 'prod-rs-4-mini',
      displayName: 'DJI RS 4 Mini',
      tagline: 'Compact and Lightweight Gimbal for Content Creators',
      images: [
        '/home/product-columns/handheld-white/rs-4-mini-2.png',
        '/home/product-columns/handheld-white/rs-4-mini-1.png',
        '/home/product-columns/handheld-white/rs-4-mini-3.png'
      ],
      hasFrom: true
    },
    {
      id: 'rs-4-pro',
      productId: 'prod-rs4-pro',
      displayName: 'DJI RS 4 Pro',
      tagline: 'Expansive Flagship Stabilizer',
      images: [
        '/home/product-columns/handheld-white/rs-4-pro-2.png',
        '/home/product-columns/handheld-white/rs-4-pro-1.png',
        '/home/product-columns/handheld-white/rs-4-pro-3.png'
      ],
      hasFrom: true
    },
    {
      id: 'ronin-4d',
      productId: 'prod-ronin-4d',
      displayName: 'DJI Ronin 4D-6K',
      tagline: 'Cinema Camera',
      images: [
        '/home/product-columns/handheld-white/ronin-4d-1.png',
        '/home/product-columns/handheld-white/ronin-4d-2.png',
        '/home/product-columns/handheld-white/ronin-4d-3.png'
      ],
      hasFrom: true
    },
    {
      id: 'sdr-transmission',
      productId: 'prod-sdr-transmission',
      displayName: 'DJI SDR Transmission',
      tagline: 'Portable Dual-Mode Video Transmission System',
      images: [
        '/home/product-columns/handheld-white/sdr-1.png',
        '/home/product-columns/handheld-white/sdr-2.png',
        '/home/product-columns/handheld-white/sdr-3.png'
      ],
      hasFrom: false
    }
  ] satisfies HomeProductColumnCard[],
  sideLinks: [
    {
      id: 'buying-guide',
      kind: 'guide',
      eyebrow: 'Buying guides',
      title: 'Which Handheld Is Right for Me?',
      imageSrc: '/home/product-columns/handheld/buying-guide.png',
      action: { type: 'content', slug: 'buying-guides' }
    },
    {
      id: 'all-accessories',
      kind: 'accessories',
      title: 'All Accessories',
      action: { type: 'plp', category: 'accessories' }
    }
  ] satisfies HomeProductColumnSideLink[]
};

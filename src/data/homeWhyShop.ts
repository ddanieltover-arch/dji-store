export type HomeWhyShopAction =
  | { type: 'content'; slug: string }
  | { type: 'plp'; category: string; series?: string };

export type HomeWhyShopCard = {
  id: string;
  title: string;
  imageSrc: string;
  action: HomeWhyShopAction;
  /** Flex grow factor within its column (matches store.dji.com Interests layout). */
  flex: number;
};

export type HomeWhyShopColumn = {
  id: string;
  fullHeight?: boolean;
  cards: HomeWhyShopCard[];
};

/**
 * Official store.dji.com “Why shop with DJI Store” mosaic.
 * Images from se-cdn.djiits.com Interests module; free-shipping copy localized to EUR threshold.
 * @see https://store.dji.com/
 */
export const HOME_WHY_SHOP_COLUMNS: HomeWhyShopColumn[] = [
  {
    id: 'credit',
    fullHeight: true,
    cards: [
      {
        id: 'credit',
        title: '1% DJI Credit Reward',
        imageSrc: '/home/why-shop/credit.jpg',
        action: { type: 'content', slug: 'store-credit' },
        flex: 1
      }
    ]
  },
  {
    id: 'shipping',
    cards: [
      {
        id: 'free-shipping',
        title: 'Over €500 Ships Free',
        imageSrc: '/home/why-shop/free-shipping.jpg',
        action: { type: 'content', slug: 'shipping-fees' },
        flex: 1
      },
      {
        id: 'in-stock',
        title: 'Popular Drones In Stock',
        imageSrc: '/home/why-shop/in-stock.jpg',
        action: { type: 'plp', category: 'camera-drones' },
        flex: 1
      }
    ]
  },
  {
    id: 'delivery',
    cards: [
      {
        id: 'fast-delivery',
        title: 'Free Fast-Delivery Upgrade',
        imageSrc: '/home/why-shop/fast-delivery.jpg',
        action: { type: 'content', slug: 'shipping-time' },
        flex: 1
      },
      {
        id: 'refurbished',
        title: 'Official Refurbished',
        imageSrc: '/home/why-shop/refurbished.png',
        action: { type: 'content', slug: 'after-sales-policies' },
        flex: 1
      }
    ]
  },
  {
    id: 'support',
    cards: [
      {
        id: 'returns',
        title: 'Up to 30-Day Returns',
        imageSrc: '/home/why-shop/returns.jpg',
        action: { type: 'content', slug: 'return-policy' },
        flex: 1
      },
      {
        id: 'expert-help',
        title: 'Get DJI Expert Help',
        imageSrc: '/home/why-shop/expert-help.jpg',
        action: { type: 'content', slug: 'technical-support' },
        flex: 2
      }
    ]
  }
];

import { AccountTab, ViewMode } from '../types';
import { DJI_PRODUCTS } from '../data/products';

const VIEW_PATHS: Partial<Record<ViewMode, string>> = {
  home: '/',
  'best-sellers': '/event/best-sellers',
  checkout: '/checkout',
  'order-success': '/order-success',
  'track-order': '/track-order',
  compare: '/compare',
  wishlist: '/wishlist',
  'easa-guide': '/guides/easa',
  account: '/account',
  admin: '/admin',
  cart: '/cart',
  'ai-operations': '/ops/ai',
  'security-ops': '/ops/security',
  'sre-ops': '/ops/sre',
  'qa-ops': '/ops/qa',
  'launch-ops': '/ops/launch',
  'blueprint-ops': '/ops/blueprint',
  'pim-ops': '/ops/pim',
  'merch-ops': '/ops/merchandising',
  'personalization-ops': '/ops/personalization',
  'lifecycle-ops': '/ops/lifecycle',
  'enterprise-ops': '/ops/enterprise'
};

export function pathFromStore(args: {
  viewMode: ViewMode;
  selectedProductId?: string;
  selectedCategory?: string;
  selectedPlpSeries?: string | null;
  accountActiveTab?: AccountTab;
}): string {
  const { viewMode } = args;

  if (viewMode === 'pdp') {
    const product = DJI_PRODUCTS.find((item) => item.id === args.selectedProductId);
    return product ? `/product/${product.slug}` : '/';
  }

  if (viewMode === 'plp') {
    const category = args.selectedCategory && args.selectedCategory !== 'all' ? args.selectedCategory : 'all';
    const base = `/category/${category}`;
    return args.selectedPlpSeries
      ? `${base}?series=${encodeURIComponent(args.selectedPlpSeries)}`
      : base;
  }

  if (viewMode === 'account' && args.accountActiveTab === 'business') {
    return '/account/business';
  }

  return VIEW_PATHS[viewMode] || '/';
}

export function storeFromPath(
  pathname: string,
  search = ''
): {
  viewMode: ViewMode;
  selectedProductId?: string;
  selectedCategory?: string;
  selectedPlpSeries?: string | null;
  accountActiveTab?: AccountTab;
} {
  const series = new URLSearchParams(search).get('series');
  const path = (pathname.replace(/\/+$/, '') || '/') as string;

  if (path === '/') return { viewMode: 'home' };

  if (path.startsWith('/product/')) {
    const slug = path.slice('/product/'.length);
    const product = DJI_PRODUCTS.find((item) => item.slug === slug);
    return {
      viewMode: 'pdp',
      selectedProductId: product?.id
    };
  }

  if (path.startsWith('/category/')) {
    return {
      viewMode: 'plp',
      selectedCategory: path.slice('/category/'.length) || 'all',
      selectedPlpSeries: series
    };
  }

  if (path === '/event/best-sellers' || path === '/best-sellers') {
    return { viewMode: 'best-sellers' };
  }

  if (path === '/account/business') {
    return { viewMode: 'account', accountActiveTab: 'business' };
  }

  const match = Object.entries(VIEW_PATHS).find(([, mapped]) => mapped === path);
  if (match) {
    return { viewMode: match[0] as ViewMode };
  }

  return { viewMode: 'home' };
}

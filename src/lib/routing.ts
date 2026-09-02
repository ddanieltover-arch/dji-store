import { AccountTab, ViewMode } from '../types';
import { DJI_PRODUCTS } from '../data/products';
import { getContentPageByPath, getContentPageBySlug } from '../data/storeContentPages';

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
  login: '/login',
  signup: '/signup',
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
  'enterprise-ops': '/ops/enterprise',
  'service-ops': '/ops/service',
  'knowledge-ops': '/ops/knowledge',
  'mobile-ops': '/ops/mobile',
  'migration-ops': '/ops/migration'
};

export function pathFromStore(args: {
  viewMode: ViewMode;
  selectedProductId?: string;
  selectedCategory?: string;
  selectedPlpSeries?: string | null;
  accountActiveTab?: AccountTab;
  contentPageSlug?: string | null;
}): string {
  const { viewMode } = args;

  if (viewMode === 'content' && args.contentPageSlug) {
    return getContentPageBySlug(args.contentPageSlug)?.path || '/';
  }

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

  if (viewMode === 'account' && args.accountActiveTab === 'service') {
    return '/account/service';
  }

  if (viewMode === 'account' && args.accountActiveTab === 'notifications') {
    return '/account/notifications';
  }

  return VIEW_PATHS[viewMode] || '/';
}

export type StoreLinkHref =
  | { kind: 'content'; slug: string }
  | { kind: 'plp'; category: string; series?: string }
  | { kind: 'refurbished' }
  | { kind: 'view'; mode: 'account' | 'track-order' | 'easa-guide' | 'compare' | 'best-sellers' };

export function hrefFromStoreLink(link: StoreLinkHref): string {
  switch (link.kind) {
    case 'content':
      return pathFromStore({ viewMode: 'content', contentPageSlug: link.slug });
    case 'plp':
      return pathFromStore({
        viewMode: 'plp',
        selectedCategory: link.category,
        selectedPlpSeries: link.series ?? null
      });
    case 'refurbished':
      return pathFromStore({ viewMode: 'plp', selectedCategory: 'refurbished' });
    case 'view':
      return pathFromStore({
        viewMode: link.mode,
        accountActiveTab: link.mode === 'account' ? 'dashboard' : undefined
      });
    default:
      return '/';
  }
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
  contentPageSlug?: string;
} {
  const series = new URLSearchParams(search).get('series');
  const path = (pathname.replace(/\/+$/, '') || '/') as string;

  const contentPage = getContentPageByPath(path);
  if (contentPage) {
    return { viewMode: 'content', contentPageSlug: contentPage.slug };
  }

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

  if (path === '/account/service') {
    return { viewMode: 'account', accountActiveTab: 'service' };
  }

  if (path === '/account/notifications') {
    return { viewMode: 'account', accountActiveTab: 'notifications' };
  }

  const match = Object.entries(VIEW_PATHS).find(([, mapped]) => mapped === path);
  if (match) {
    return { viewMode: match[0] as ViewMode };
  }

  return { viewMode: 'home' };
}

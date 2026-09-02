import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

/** Scroll to top whenever the active storefront page changes. */
export function useScrollToTopOnNavigation(): void {
  const { viewMode, selectedProductId, selectedCategory, selectedPlpSeries, contentPageSlug, accountActiveTab } =
    useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [viewMode, selectedProductId, selectedCategory, selectedPlpSeries, contentPageSlug, accountActiveTab]);
}

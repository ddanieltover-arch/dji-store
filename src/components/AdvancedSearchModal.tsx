import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  Plane,
  Camera,
  Layers,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { performIntelligentSearch } from '../data/searchSynonyms';
import { formatPrice } from '../data/currency';
import { productListingImage } from '../lib/pim/productListingImage';
import { personalizedSearch } from '../lib/personalization/wave6Personalization';

export const AdvancedSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    navigateToPdp,
    navigateToPlp,
    currency,
    logSearchEvent,
    wishlist,
    compareList,
    locale,
    cart
  } = useStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const baseOutcome = performIntelligentSearch(localQuery, DJI_PRODUCTS);
  const personalized = personalizedSearch(
    DJI_PRODUCTS,
    {
      sessionId: 'search-session',
      locale,
      viewedProducts: compareList,
      searchedTerms: localQuery ? [localQuery] : [],
      cartProductIds: cart.map((c) => c.productId),
      wishlistProductIds: wishlist,
      compareProductIds: compareList,
      ownedProductIds: []
    },
    localQuery
  );
  const orderedResults = personalized.exactMatch
    ? personalized.productIds.map((id) => DJI_PRODUCTS.find((p) => p.id === id)!).filter(Boolean)
    : personalized.productIds
        .map((id) => DJI_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is (typeof DJI_PRODUCTS)[number] => Boolean(p));
  const searchOutcome = {
    ...baseOutcome,
    results: orderedResults.length ? orderedResults : baseOutcome.results
  };

  const handleSelectProduct = (productId: string) => {
    logSearchEvent(localQuery, searchOutcome.results.length, productId);
    setIsSearchOpen(false);
    navigateToPdp(productId);
  };

  const handleQuickTag = (tag: string) => {
    setLocalQuery(tag);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
        {/* Search Omnibar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-6 h-6 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by model, 8K, EASA Class C0, <249g, FPV goggles, or battery..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full text-base sm:text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery('')}
              className="p-1 text-gray-400 hover:text-black rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Typo Correction or Synonym Banner */}
        {searchOutcome.correctedQuery && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900">
            <span>
              Showing results for <strong className="font-bold underline">{searchOutcome.correctedQuery}</strong> (auto-corrected from <em>{localQuery}</em>).
            </span>
            <span className="text-[10px] text-amber-700 font-bold">Fuzzy Typo Tolerance</span>
          </div>
        )}

        {searchOutcome.appliedSynonyms.length > 0 && (
          <div className="bg-blue-50/80 px-6 py-2 border-b border-blue-100 flex items-center gap-2 text-xs text-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              Matched Synonyms & Flight Intent:{' '}
              {searchOutcome.appliedSynonyms.map((s) => (
                <span key={s} className="font-bold uppercase tracking-wider text-[10px] bg-blue-100 px-2 py-0.5 rounded-md ml-1 text-blue-800">
                  {s}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* If No Query: Show Popular Intent Topics & Categories */}
          {!localQuery ? (
            <div className="space-y-6">
              {/* Intent Quick Filters */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                  Popular Flight Categories & Intents
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Sub-249g No License (C0)', query: 'sub-249g' },
                    { label: 'Hasselblad 8K Cinema (C1)', query: '8k cinema' },
                    { label: 'Avata 2 FPV Goggles', query: 'fpv goggles' },
                    { label: 'Osmo Pocket 3 Creator', query: 'pocket 3' },
                    { label: 'Spare Intelligent Batteries', query: 'battery' }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleQuickTag(chip.query)}
                      className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Top Drones */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                  Flagship European Aircraft
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DJI_PRODUCTS.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="p-3.5 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-all"
                    >
                      <img
                        src={productListingImage(p)}
                        alt={p.modelName}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900 text-xs truncate">{p.modelName}</h4>
                          {p.easaClass && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                              {p.easaClass}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{p.tagline}</p>
                        <span className="text-xs font-black text-gray-900 mt-0.5 block">
                          From {formatPrice(p.basePriceEur, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searchOutcome.results.length > 0 ? (
            /* Results List */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-1 border-b border-gray-100">
                <span>
                  Found <strong className="text-gray-900 font-bold">{searchOutcome.results.length}</strong> matching models in {searchOutcome.executionTimeMs}ms
                </span>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateToPlp('all');
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View All in Catalog →
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {searchOutcome.results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="py-3.5 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer flex items-center justify-between gap-4 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={productListingImage(product)}
                        alt={product.modelName}
                        className="w-16 h-16 object-contain shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {product.modelName}
                          </h4>
                          {product.easaClass && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                              EASA {product.easaClass}
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold">
                              NEW 2026
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{product.tagline}</p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          {product.flightTimeMinutes && (
                            <span>⏱ {product.flightTimeMinutes} min flight</span>
                          )}
                          {product.cameraSensor && <span>📷 {product.cameraSensor}</span>}
                          <span>★ {product.rating} ({product.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-gray-900 block">
                        {formatPrice(product.basePriceEur, currency)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        In Stock (Frankfurt)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Zero-Result Fallback */
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-base">
                  No direct results for "{localQuery}"
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try checking for spelling, or explore our top-tier European categories below:
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateToPlp('camera-drones');
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs"
                >
                  Browse Camera Drones (C0/C1)
                </button>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateToPlp('handheld');
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs"
                >
                  Browse Osmo & Handhelds
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

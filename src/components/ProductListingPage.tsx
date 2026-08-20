import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Star,
  Heart,
  Scale,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { Product, EasaClass } from '../types';
import { rankCatalog, buildCommerceSignals } from '../lib/merch/wave5Merchandising';
import { initializeInventoryFromCatalog } from '../lib/pim/wave1Execution';
import { buildPersonalizedPlp, personalizeRanking } from '../lib/personalization/wave6Personalization';
import { PersonalizationContext } from '../types/wave6Personalization';

export const ProductListingPage: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPlpSeries,
    navigateToPdp,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    currency,
    setViewMode,
    wishlist,
    compareList,
    locale,
    cart
  } = useStore();

  // Filters State
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedEasaClasses, setSelectedEasaClasses] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(16000);
  const [minFlightTime, setMinFlightTime] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'flight-time'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setSelectedSeries(selectedPlpSeries ? [selectedPlpSeries] : []);
  }, [selectedCategory, selectedPlpSeries]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'camera-drones', label: 'Camera Drones' },
    { id: 'handheld', label: 'Handheld & Osmo' },
    { id: 'professional', label: 'Pro Cinema & Inspire' },
    { id: 'accessories', label: 'OEM Accessories & Batteries' },
    { id: 'power', label: 'Power Stations' },
    { id: 'power-care', label: 'Care Plans' },
    { id: 'refurbished', label: 'Official Refurbished' }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    const inventory = initializeInventoryFromCatalog(DJI_PRODUCTS);
    const rankings = rankCatalog(buildCommerceSignals(DJI_PRODUCTS, inventory));
    const ctx: PersonalizationContext = {
      sessionId: 'plp-session',
      locale,
      viewedProducts: compareList,
      searchedTerms: [],
      cartProductIds: cart.map((c) => c.productId),
      wishlistProductIds: wishlist,
      compareProductIds: compareList,
      ownedProductIds: []
    };
    const personalized = buildPersonalizedPlp(
      DJI_PRODUCTS,
      ctx,
      personalizeRanking(
        DJI_PRODUCTS,
        ctx,
        new Set(rankings.map((r) => r.productId))
      ),
      selectedCategory === 'all' ? 'all' : (selectedCategory as Product['category'])
    );
    const scoreOf = (id: string) =>
      personalized.decisions.find((r) => r.productId === id)?.score ??
      rankings.find((r) => r.productId === id)?.score ??
      0;

    return DJI_PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedSeries.length > 0 && !selectedSeries.includes(product.series)) {
        return false;
      }
      if (selectedEasaClasses.length > 0) {
        if (!product.easaClass || !selectedEasaClasses.includes(product.easaClass)) {
          return false;
        }
      }
      if (product.basePriceEur > maxPrice) {
        return false;
      }
      if (minFlightTime > 0 && (!product.flightTimeMinutes || product.flightTimeMinutes < minFlightTime)) {
        return false;
      }
      if (inStockOnly && !product.variants.some((v) => v.inStock && v.stockQuantity > 0)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceEur - b.basePriceEur;
      if (sortBy === 'price-desc') return b.basePriceEur - a.basePriceEur;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'flight-time') return (b.flightTimeMinutes || 0) - (a.flightTimeMinutes || 0);
      return scoreOf(b.id) - scoreOf(a.id);
    });
  }, [
    selectedCategory,
    selectedSeries,
    selectedEasaClasses,
    maxPrice,
    minFlightTime,
    inStockOnly,
    sortBy,
    locale,
    wishlist,
    compareList,
    cart
  ]);

  const resetFilters = () => {
    setSelectedSeries([]);
    setSelectedEasaClasses([]);
    setMaxPrice(16000);
    setMinFlightTime(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedSeries.length > 0 ||
    selectedEasaClasses.length > 0 ||
    maxPrice < 16000 ||
    minFlightTime > 0 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-gray-200 pb-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <span>Home</span> &gt; <span>Catalog</span> &gt;{' '}
            <span className="text-[#E30613] font-bold">
              {categories.find((c) => c.id === selectedCategory)?.label || 'All Products'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
            {categories.find((c) => c.id === selectedCategory)?.label || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Official European stock with 2-Year statutory EU warranty and rapid DHL express dispatch.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1D1D1F] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main PLP Workspace: Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-20 lg:self-start lg:z-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-6 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-extrabold text-sm text-[#1D1D1F] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Filters & Facets
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#E30613] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* EASA Drone Flight Class Filter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                EASA European Drone Class
              </span>
              <div className="space-y-1.5 text-xs">
                {(['C0 (<249g)', 'C1', 'Open Category'] as EasaClass[]).map((easa) => (
                  <label key={easa} className="flex items-center space-x-2.5 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedEasaClasses.includes(easa)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEasaClasses([...selectedEasaClasses, easa]);
                        } else {
                          setSelectedEasaClasses(selectedEasaClasses.filter((x) => x !== easa));
                        }
                      }}
                      className="rounded text-[#E30613] focus:ring-[#E30613] w-4 h-4"
                    />
                    <span className="font-medium">
                      {easa === 'C0 (<249g)' ? (
                        <span className="text-emerald-700 font-bold">Class C0 (&lt;249g No Exam)</span>
                      ) : (
                        `Class ${easa}`
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Drone Series */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Product Series
              </span>
              <div className="space-y-1.5 text-xs text-gray-700">
                {[
                  'Mavic',
                  'Air',
                  'Mini',
                  'Flip',
                  'Avata',
                  'Neo',
                  'Pocket',
                  'Action',
                  'Osmo360',
                  'Mobile',
                  'Ronin',
                  'Mic',
                  'Power',
                  'Inspire',
                  'Education',
                  'Refurbished'
                ].map((s) => (
                  <label key={s} className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSeries.includes(s)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSeries([...selectedSeries, s]);
                        } else {
                          setSelectedSeries(selectedSeries.filter((x) => x !== s));
                        }
                      }}
                      className="rounded text-[#E30613] focus:ring-[#E30613] w-4 h-4"
                    />
                    <span>{s} Series</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flight Time Slider */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">Min Flight Time</span>
                <span className="font-bold text-blue-600">{minFlightTime > 0 ? `${minFlightTime} mins` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="46"
                step="5"
                value={minFlightTime}
                onChange={(e) => setMinFlightTime(Number(e.target.value))}
                className="w-full accent-[#E30613]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>0m</span>
                <span>25m</span>
                <span>46m</span>
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">Max Price</span>
                <span className="font-bold text-[#1D1D1F]">{formatPrice(maxPrice, currency)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="16000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#E30613]"
              />
            </div>

            {/* In Stock Only Toggle */}
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="font-bold text-gray-900">In-Stock Only (Frankfurt Depot)</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Count, Sort, View Layout, Mobile Filter Trigger */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-800"
              >
                <Filter className="w-3.5 h-3.5" /> Filters ({hasActiveFilters ? 'Active' : 'All'})
              </button>
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{filteredProducts.length}</strong> products
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sorting Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#E30613]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="flight-time">Max Flight Time</option>
                </select>
              </div>

              {/* View Layout Toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 ${viewLayout === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 ${viewLayout === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No products match your filters</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range or clearing active EASA class restrictions.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#1D1D1F] text-white text-xs font-bold hover:bg-black"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Grid View */}
          {viewLayout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-200/90 hover:border-gray-400 transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Top Badges & Actions */}
                  <div className="p-4 pb-0 flex items-center justify-between z-10">
                    {product.easaClass ? (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          product.easaClass.includes('C0')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {product.easaClass}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {product.categoryLabel}
                      </span>
                    )}

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isInCompare(product.id)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Compare Model"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-rose-500 text-white'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Save Item"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cutout Image */}
                  <div
                    onClick={() => navigateToPdp(product.id)}
                    className="p-6 cursor-pointer flex items-center justify-center relative overflow-hidden group/img"
                  >
                    <img
                      src={product.images.cutout || product.images.hero}
                      alt={product.modelName}
                      className="h-44 object-contain transition-transform duration-500 group-hover/img:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 pt-0 space-y-3">
                    <div onClick={() => navigateToPdp(product.id)} className="cursor-pointer">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                      </div>
                      <h3 className="font-bold text-base text-[#1D1D1F] group-hover:text-[#E30613] transition-colors leading-snug">
                        {product.modelName}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Key Attributes snippet */}
                    <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-xl">
                      {product.flightTimeMinutes && (
                        <span>⏱️ {product.flightTimeMinutes} Min Flight</span>
                      )}
                      <span>⚖️ {product.weightGrams}g Weight</span>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">Starting from</span>
                        <span className="text-base font-extrabold text-[#1D1D1F]">
                          {formatPrice(product.basePriceEur, currency)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product, product.variants[0], 1)}
                        className="p-2.5 rounded-xl bg-[#1D1D1F] hover:bg-[#E30613] text-white transition-colors shadow-sm"
                        title="Add to Shopping Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewLayout === 'list' && (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all"
                >
                  <img
                    src={product.images.cutout || product.images.hero}
                    alt={product.modelName}
                    onClick={() => navigateToPdp(product.id)}
                    className="w-36 h-36 object-contain cursor-pointer shrink-0"
                  />

                  <div className="flex-1 space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      {product.easaClass && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {product.easaClass}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => navigateToPdp(product.id)}
                      className="font-bold text-lg text-gray-900 hover:text-[#E30613] cursor-pointer"
                    >
                      {product.modelName}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
                      {product.flightTimeMinutes && (
                        <span>⏱️ {product.flightTimeMinutes} Mins Flight</span>
                      )}
                      <span>⚖️ {product.weightGrams}g</span>
                      <span>🚚 In Stock (DHL Express)</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-3">
                    <div>
                      <span className="text-xs text-gray-400 block">From</span>
                      <span className="text-xl font-extrabold text-gray-900">
                        {formatPrice(product.basePriceEur, currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateToPdp(product.id)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(product, product.variants[0], 1)}
                        className="px-4 py-2 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-xs font-bold text-white flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="font-extrabold text-base">Filter Catalog</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold block mb-2">EASA Flight Class</span>
                {(['C0 (<249g)', 'C1', 'Open Category'] as EasaClass[]).map((easa) => (
                  <label key={easa} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedEasaClasses.includes(easa)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEasaClasses([...selectedEasaClasses, easa]);
                        } else {
                          setSelectedEasaClasses(selectedEasaClasses.filter((x) => x !== easa));
                        }
                      }}
                      className="rounded text-[#E30613]"
                    />
                    <span>Class {easa}</span>
                  </label>
                ))}
              </div>

              <div>
                <span className="font-bold block mb-2">Max Price ({formatPrice(maxPrice, currency)})</span>
                <input
                  type="range"
                  min="100"
                  max="16000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#E30613]"
                />
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#1D1D1F] text-white font-bold rounded-xl text-xs"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

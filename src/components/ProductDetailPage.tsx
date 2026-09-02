import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Truck,
  Star,
  Heart,
  Scale,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Package,
  Layers,
  Award,
  Zap,
  Info,
  Plus,
  Check,
  Download,
  AlertCircle,
  Building2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { ProductVariant, Product } from '../types';
import { ReviewsSection } from './ReviewsSection';
import { InventoryDepotDrawer } from './InventoryDepotDrawer';
import { Wave3PdpModules } from './pim/Wave3PdpModules';
import { ProductMediaStage } from './pdp/ProductMediaStage';
import { productListingImage } from '../lib/pim/productListingImage';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    currency,
    setViewMode,
    navigateToPdp,
    addToast
  } = useStore();

  const product = DJI_PRODUCTS.find((p) => p.id === selectedProductId) || DJI_PRODUCTS[0];

  // Variant / Combo selection
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id || '');
  const activeVariant: ProductVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);
  const [isDepotDrawerOpen, setIsDepotDrawerOpen] = useState<boolean>(false);

  // Sticky purchase bar visibility
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Frequently bought together bundle checkboxes
  const extraBattery = DJI_PRODUCTS.find((p) => p.id === 'acc-bat-m4p');
  const careRefresh = DJI_PRODUCTS.find((p) => p.id === 'acc-care-m4p');
  const [includeBatteryBundle, setIncludeBatteryBundle] = useState<boolean>(true);
  const [includeCareBundle, setIncludeCareBundle] = useState<boolean>(true);

  // Sync selected variant when product changes
  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setQuantity(1);
    }
  }, [product.id]);

  // Scroll listener for sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = useMemo(() => {
    const official = (product.images.gallery || []).filter((src) => src.startsWith('http'));
    if (official.length >= 3) {
      return [...new Set(official)];
    }

    const variantHero = activeVariant?.imageUrl;
    const hero = variantHero || product.images.hero || product.images.cutout;
    return [hero, product.images.cutout, ...(product.images.gallery || []), product.images.hero].filter(
      (src, index, arr) => src && arr.indexOf(src) === index
    );
  }, [product, activeVariant]);

  // Calculate Bundle Pricing
  const bundleDiscount = 50; // €50 discount
  let bundleTotal = activeVariant.priceEur;
  if (includeBatteryBundle && extraBattery) bundleTotal += extraBattery.basePriceEur;
  if (includeCareBundle && careRefresh) bundleTotal += careRefresh.basePriceEur;
  const bundleFinalPrice = Math.max(0, bundleTotal - (includeBatteryBundle && includeCareBundle ? bundleDiscount : 0));

  const handleAddBundleToCart = () => {
    addToCart(product, activeVariant, 1);
    if (includeBatteryBundle && extraBattery) {
      addToCart(extraBattery, extraBattery.variants[0], 1);
    }
    if (includeCareBundle && careRefresh) {
      addToCart(careRefresh, careRefresh.variants[0], 1);
    }
    addToast({
      type: 'success',
      title: 'Bundle Added to Bag',
      message: 'Combo and companion protection have been added with €50 discount.'
    });
  };

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <button onClick={() => setViewMode('home')} className="hover:text-black">
            Home
          </button>
          <span>/</span>
          <button onClick={() => setViewMode('plp')} className="hover:text-black">
            {product.categoryLabel}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-bold">{product.modelName}</span>
        </div>
      </div>

      {/* Main PDP Above-The-Fold Workstation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: High-Res Interactive Media Stage (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <ProductMediaStage
              product={product}
              galleryImages={galleryImages}
              badges={
                <>
                  {product.easaClass && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                      EASA {product.easaClass}
                    </span>
                  )}
                  {product.badgeLabel && (
                    <span className="px-3 py-1 rounded-full bg-[#E30613] text-white font-extrabold text-xs uppercase tracking-wider">
                      {product.badgeLabel}
                    </span>
                  )}
                </>
              }
            />

            {/* Key Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                  <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed pl-5">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Buy Box Workstation (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#E30613] uppercase tracking-wider">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isInCompare(product.id)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Compare specs"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isInWishlist(product.id)
                          ? 'bg-rose-500 text-white'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Save item"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
                  {product.modelName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewCount} Verified EU Reviews)</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock (Frankfurt Depot)
                  </span>
                </div>
              </div>

              {/* Price Presentation */}
              <div className="pt-2 pb-2 border-y border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-[#1D1D1F]">
                    {formatPrice(activeVariant.priceEur, currency)}
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Free DHL Express
                  </span>
                </div>
                {product.compareAtPriceEur && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compareAtPriceEur, currency)}
                  </span>
                )}
              </div>

              {/* Combo Package Selector */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  Select Package Configuration:
                </span>
                <div className="space-y-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                        selectedVariantId === v.id
                          ? 'border-[#E30613] bg-red-50/40 ring-1 ring-[#E30613]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-[#1D1D1F]">{v.comboName}</div>
                        {v.tagline && <p className="text-xs text-gray-500">{v.tagline}</p>}
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <div className="font-extrabold text-sm text-[#1D1D1F]">
                          {formatPrice(v.priceEur, currency)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {v.stockQuantity} Units
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Itemized BOM (In the Box) */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Package className="w-4 h-4 text-gray-600" /> Included in {activeVariant.comboName.split('(')[0]}:
                </span>
                <ul className="space-y-1 text-xs text-gray-600">
                  {activeVariant.includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity and Primary CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-extrabold text-sm text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, activeVariant, quantity)}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/20 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag — {formatPrice(activeVariant.priceEur * quantity, currency)}
                  </button>
                </div>

                {/* Instant 1-Click Guest Checkout Button */}
                <button
                  onClick={() => {
                    addToCart(product, activeVariant, quantity);
                    setViewMode('checkout');
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Instant Guest Checkout (No Account Needed)
                </button>
              </div>

              {/* Guarantees Matrix & Warehouse Depot Routing */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsDepotDrawerOpen(true)}
                  className="w-full p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900 transition-colors group text-left"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <span className="font-bold block">
                        🟢 European Depots (FRA, AMS, CDG): {activeVariant.stockQuantity} Units In Stock
                      </span>
                      <span className="text-[10px] text-blue-700">
                        Check local warehouse dispatch & replenishment schedule →
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2-Year Statutory EU Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>24h Express Dispatch (DHL)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together Bundle Builder (Phase 7 Conversion Engine) */}
      {extraBattery && careRefresh && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#E30613] uppercase tracking-wider">
                  Complete Flight Kit
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  Frequently Bought Together
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                Bundle & Save €50.00
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Bundle items list */}
              <div className="lg:col-span-8 space-y-4">
                {/* 1. Main Drone */}
                <div className="flex items-center space-x-3 text-xs text-gray-800 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1x {product.modelName} ({activeVariant.comboName})</span>
                  <span className="text-gray-400 font-normal ml-auto">
                    {formatPrice(activeVariant.priceEur, currency)}
                  </span>
                </div>

                {/* 2. Extra Battery Checkbox */}
                <label className="flex items-center space-x-3 text-xs text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBatteryBundle}
                    onChange={(e) => setIncludeBatteryBundle(e.target.checked)}
                    className="rounded text-[#E30613] focus:ring-[#E30613] w-4 h-4"
                  />
                  <span>1x {extraBattery.modelName} (5000 mAh)</span>
                  <span className="text-gray-400 font-normal ml-auto">
                    +{formatPrice(extraBattery.basePriceEur, currency)}
                  </span>
                </label>

                {/* 3. Care Refresh Checkbox */}
                <label className="flex items-center space-x-3 text-xs text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCareBundle}
                    onChange={(e) => setIncludeCareBundle(e.target.checked)}
                    className="rounded text-[#E30613] focus:ring-[#E30613] w-4 h-4"
                  />
                  <span>1x {careRefresh.modelName}</span>
                  <span className="text-gray-400 font-normal ml-auto">
                    +{formatPrice(careRefresh.basePriceEur, currency)}
                  </span>
                </label>
              </div>

              {/* Bundle Total & Add Button */}
              <div className="lg:col-span-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-right space-y-3">
                <div>
                  <span className="text-xs text-gray-400 block">Bundle Total</span>
                  <div className="text-2xl font-black text-gray-900">
                    {formatPrice(bundleFinalPrice, currency)}
                  </div>
                  {includeBatteryBundle && includeCareBundle && (
                    <span className="text-[11px] text-emerald-600 font-bold block">
                      Saved €50.00 Bundle Discount
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="w-full py-3 px-4 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs tracking-wide transition-all shadow"
                >
                  Add Bundle to Bag
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technical Specifications Accordion Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-[#E30613] uppercase tracking-wider">
              Engineering Breakdown
            </span>
            <h3 className="text-2xl font-black text-gray-900">
              Technical Specifications
            </h3>
          </div>

          <div className="space-y-6">
            {product.specifications.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-1 uppercase tracking-wider">
                  {group.groupName}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  {group.attributes.map((attr, aIdx) => (
                    <div
                      key={aIdx}
                      className={`flex items-center justify-between py-2 border-b border-gray-50 ${
                        attr.isHighlight ? 'font-bold text-gray-900 bg-red-50/50 px-2 rounded' : 'text-gray-600'
                      }`}
                    >
                      <span className="text-gray-500">{attr.name}</span>
                      <span className="text-right font-semibold text-gray-900">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews & Flight Reports Section (Phase 7.5 Intelligence Engine) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Wave3PdpModules productId={product.id} />
        <ReviewsSection product={product} />
      </section>

      {/* Inventory Depot Multi-Warehouse Drawer (Phase 7.5 WMS) */}
      <InventoryDepotDrawer
        isOpen={isDepotDrawerOpen}
        onClose={() => setIsDepotDrawerOpen(false)}
        product={product}
        selectedVariant={activeVariant}
      />

      {/* Sticky Bottom Purchase Bar (View-Port Docked) */}
      {showStickyBar && (
        <div className="fixed bottom-[52px] md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 sm:px-8 shadow-2xl animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img
                src={productListingImage(product)}
                alt={product.modelName}
                className="w-10 h-10 object-contain hidden sm:block"
              />
              <div>
                <span className="font-bold text-sm text-gray-900 block truncate max-w-[200px] sm:max-w-md">
                  {product.modelName} — {activeVariant.comboName}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">
                  🟢 In Stock (Frankfurt Hub)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-gray-400 block">Total</span>
                <span className="text-lg font-black text-gray-900">
                  {formatPrice(activeVariant.priceEur * quantity, currency)}
                </span>
              </div>

              <button
                onClick={() => addToCart(product, activeVariant, quantity)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-xs tracking-wide shadow-md active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

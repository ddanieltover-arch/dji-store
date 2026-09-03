import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  Truck,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';
import { productListingImage } from '../lib/pim/productListingImage';
import { DJI_PRODUCTS } from '../data/products';
import { buildOptimizedBundles, inventoryAwareFlags, buildCommerceSignals } from '../lib/merch/wave5Merchandising';
import { initializeInventoryFromCatalog } from '../lib/pim/wave1Execution';
import { buildPersonalizedCart } from '../lib/personalization/wave6Personalization';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalEur,
    freeShippingThresholdEur,
    freeShippingProgress,
    currency,
    setViewMode,
    addToCart,
    locale,
    wishlist,
    navigateToPdp
  } = useStore();

  const isFreeShipping = cartSubtotalEur >= freeShippingThresholdEur;
  const shippingCostEur = isFreeShipping ? 0 : 19;
  const totalDueEur = cartSubtotalEur + shippingCostEur;
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdEur - cartSubtotalEur);

  const inventory = initializeInventoryFromCatalog(DJI_PRODUCTS);
  const flags = inventoryAwareFlags(DJI_PRODUCTS, buildCommerceSignals(DJI_PRODUCTS, inventory));
  const cartProductIds = cart.map((c) => c.productId);
  const personalizedCart = buildPersonalizedCart(
    DJI_PRODUCTS,
    {
      sessionId: 'cart-page',
      locale,
      viewedProducts: [],
      searchedTerms: [],
      cartProductIds,
      wishlistProductIds: wishlist,
      compareProductIds: [],
      ownedProductIds: []
    },
    freeShippingThresholdEur
  );
  const bundleCrossSellIds = buildOptimizedBundles(DJI_PRODUCTS)
    .filter((b) => cartProductIds.includes(b.productId))
    .flatMap((b) => b.accessoryIds);
  const fromPersonalization = [
    ...personalizedCart.missingEssentials,
    ...personalizedCart.carePlans,
    ...personalizedCart.accessories
  ].map((d) => d.productId);
  const accessories = [...new Set([...fromPersonalization, ...bundleCrossSellIds])]
    .map((id) => DJI_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof DJI_PRODUCTS)[number] => Boolean(p) && !cartProductIds.includes(p.id))
    .filter((p) => flags.find((f) => f.productId === p.id)?.promote)
    .slice(0, 3);
  const fallbackAccessories =
    accessories.length > 0
      ? accessories
      : DJI_PRODUCTS.filter((p) => p.category === 'accessories' && flags.find((f) => f.productId === p.id)?.promote).slice(
          0,
          3
        );
  const crossSell = accessories.length ? accessories : fallbackAccessories;
  const shippingNudge = personalizedCart.shippingNudge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          type="button"
          onClick={() => setViewMode('home')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
          <ShoppingBag className="w-4 h-4" />
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Your Shopping Bag</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <p className="text-lg font-bold text-gray-900">Your shopping bag is empty</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Explore our European stock of camera drones, gimbals, and OEM batteries.
          </p>
          <button
            type="button"
            onClick={() => setViewMode('plp')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1D1D1F] text-white text-sm font-bold hover:bg-black transition-all"
          >
            Browse Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
                {isFreeShipping ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You have unlocked FREE European DHL Express Shipping!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-blue-600" /> Free DHL Express Meter
                      </span>
                      <span>Add {formatPrice(remainingForFreeShipping, currency)} more</span>
                    </div>
                    {shippingNudge && <p className="text-[11px] text-blue-700 font-medium">{shippingNudge}</p>}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/80"
                  >
                    <button
                      type="button"
                      onClick={() => navigateToPdp(item.product.id)}
                      className="shrink-0"
                      aria-label={`View ${item.product.modelName}`}
                    >
                      <img
                        src={productListingImage(item.product)}
                        alt={item.product.modelName}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-xl p-1.5 border border-gray-200"
                      />
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h2 className="font-bold text-sm text-gray-900">{item.product.modelName}</h2>
                      <p className="text-xs text-gray-500">{item.variant.comboName}</p>
                      <p className="text-sm font-extrabold text-gray-900">
                        {formatPrice(item.variant.priceEur * item.quantity, currency)}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-bold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {crossSell.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h2 className="text-sm font-extrabold text-gray-900">Recommended add-ons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {crossSell.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 border border-gray-200 gap-3"
                    >
                      <img
                        src={productListingImage(acc)}
                        alt={acc.modelName}
                        className="w-16 h-16 object-contain"
                      />
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2">{acc.modelName}</p>
                      <button
                        type="button"
                        onClick={() => addToCart(acc, acc.variants[0], 1)}
                        className="w-full py-2 rounded-lg bg-gray-100 hover:bg-[#E30613] hover:text-white text-gray-900 font-bold text-xs transition-colors"
                      >
                        Add — {formatPrice(acc.basePriceEur, currency)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
              <h2 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-gray-900">{formatPrice(cartSubtotalEur, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                    {isFreeShipping ? 'FREE' : formatPrice(shippingCostEur, currency)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                  <span>Total Due</span>
                  <span className="text-xl text-[#1D1D1F]">{formatPrice(totalDueEur, currency)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('checkout')}
                className="w-full py-4 px-6 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No password required • SEPA, Revolut & Web3 Crypto</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

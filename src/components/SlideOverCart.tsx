import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';
import { DJI_PRODUCTS } from '../data/products';

export const SlideOverCart: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalEur,
    freeShippingThresholdEur,
    freeShippingProgress,
    currency,
    setViewMode,
    addToCart
  } = useStore();

  if (!isCartOpen) return null;

  const isFreeShipping = cartSubtotalEur >= freeShippingThresholdEur;
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdEur - cartSubtotalEur);

  // Recommended accessories for cross-sell
  const accessories = DJI_PRODUCTS.filter((p) => p.category === 'accessories').slice(0, 2);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setViewMode('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
              <h2 className="font-extrabold text-lg text-gray-900">Your Shopping Bag</h2>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter Banner */}
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 You have unlocked FREE European DHL Express Shipping!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> Free DHL Express Meter
                  </span>
                  <span>Add {formatPrice(remainingForFreeShipping, currency)} more</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-900">Your shopping bag is empty</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our European stock of camera drones, gimbals, and OEM batteries.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewMode('plp');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-xs font-bold hover:bg-black transition-all"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80"
                >
                  <img
                    src={item.product.images.cutout || item.product.images.hero}
                    alt={item.product.modelName}
                    className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-xs text-gray-900 truncate">
                      {item.product.modelName}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {item.variant.comboName}
                    </p>
                    <div className="text-xs font-extrabold text-gray-900">
                      {formatPrice(item.variant.priceEur, currency)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Cross-Sells in Cart */}
            {cart.length > 0 && accessories.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Recommended Add-ons:
                </span>
                <div className="space-y-2">
                  {accessories.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <img
                          src={acc.images.cutout || acc.images.hero}
                          alt={acc.modelName}
                          className="w-8 h-8 object-contain shrink-0"
                        />
                        <span className="font-semibold text-gray-800 truncate">
                          {acc.modelName}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(acc, acc.variants[0], 1)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#E30613] hover:text-white text-gray-900 font-bold text-[11px] shrink-0 transition-colors"
                      >
                        +{formatPrice(acc.basePriceEur, currency)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(cartSubtotalEur, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Included European VAT (19%)</span>
                  <span>{formatPrice(cartSubtotalEur * 0.19, currency)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>DHL Express Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-600 font-bold' : ''}>
                    {isFreeShipping ? 'FREE' : formatPrice(19.0, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Due</span>
                  <span className="text-base text-[#1D1D1F]">
                    {formatPrice(cartSubtotalEur + (isFreeShipping ? 0 : 19.0), currency)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 px-6 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Proceed to Fast Guest Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No password required • Official SEPA Wire & Web3 Crypto</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

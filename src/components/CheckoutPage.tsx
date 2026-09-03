import React, { useMemo, useState } from 'react';
import {
  Building2,
  QrCode,
  Zap,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';
import { productListingImage } from '../lib/pim/productListingImage';
import { calculateCheckoutTotals, isCryptoPaymentMethod } from '../lib/payments/checkoutTotals';
import { CHECKOUT_COUNTRIES, findCheckoutCountry } from '../data/europeanCountries';
import { ShippingMethodSection } from './checkout/ShippingMethodSection';
import type { PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotalEur,
    freeShippingThresholdEur,
    currency,
    setViewMode,
    placeNewOrder,
    addToast
  } = useStore();

  const isFreeShipping = cartSubtotalEur >= freeShippingThresholdEur;
  const shippingCostEur = isFreeShipping ? 0 : 19.0;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sepa_bank_wire');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkoutTotals = useMemo(
    () =>
      calculateCheckoutTotals({
        subtotalEur: cartSubtotalEur,
        shippingEur: shippingCostEur,
        paymentMethod
      }),
    [cartSubtotalEur, shippingCostEur, paymentMethod]
  );

  const {
    discountEur,
    discountLabel,
    totalEur: totalAmountEur
  } = checkoutTotals;

  const isCryptoPayment = isCryptoPaymentMethod(paymentMethod);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('DE');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !street || !postalCode || !city) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please fill out all address and contact details.'
      });
      return;
    }

    if (cart.length === 0) {
      addToast({
        type: 'error',
        title: 'Cart is Empty',
        message: 'Please add products before checking out.'
      });
      return;
    }

    setIsSubmitting(true);

    const countryObj = findCheckoutCountry(countryCode);

    const orderItems = cart.map((item) => ({
      productName: item.product.modelName,
      comboName: item.variant.comboName,
      sku: item.variant.sku,
      priceEur: item.variant.priceEur,
      quantity: item.quantity,
      imageUrl: productListingImage(item.product)
    }));

    placeNewOrder({
      customer: {
        firstName,
        lastName,
        email,
        phone: phone || '+49 170 000 0000'
      },
      shippingAddress: {
        street,
        postalCode,
        city,
        countryCode,
        countryName: countryObj.name
      },
      items: orderItems,
      subtotalEur: cartSubtotalEur,
      discountEur,
      vatEur: 0,
      vatRatePercent: 0,
      shippingEur: shippingCostEur,
      totalEur: totalAmountEur,
      paymentMethod,
      paymentStatus: 'verifying'
    });

    setIsSubmitting(false);
    setViewMode('order-success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={() => setViewMode('home')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Store
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted European Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Guest Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                Contact & Recipient Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Lukas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Weber"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address (for Invoice & Updates) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@creatives.eu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Phone (for DHL Delivery SMS) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 554 9812"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. European Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                European Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Country / Destination *</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613] font-semibold text-gray-800"
                >
                  {CHECKOUT_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Street Name & House Number *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Kaiserstraße 42, Apt 3B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Postal Code (PLZ / Code Postal) *</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="60311"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">City / Region *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Frankfurt am Main"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
                  required
                />
              </div>
            </div>
          </div>

          <ShippingMethodSection
            isFreeShipping={isFreeShipping}
            shippingCostEur={shippingCostEur}
            currency={currency}
          />

          {/* 4. Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center">
                4
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                Official European Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* SEPA Wire Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('sepa_bank_wire')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                  paymentMethod === 'sepa_bank_wire'
                    ? 'border-[#E30613] bg-red-50/40 ring-1 ring-[#E30613]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-700" /> SEPA Bank Wire
                  </span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    SEPA · EUR
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Official European corporate bank account. Payment instructions provided after order placement.
                </p>
              </button>

              {/* Revolut Banking Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('revolut_bank')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                  paymentMethod === 'revolut_bank'
                    ? 'border-[#E30613] bg-red-50/40 ring-1 ring-[#E30613]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <RevolutMark /> Revolut Banking
                  </span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                    Instant · EUR
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Official Revolut business account. Payment instructions provided after order placement.
                </p>
              </button>

              {/* Crypto Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto_usdt')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                  isCryptoPayment
                    ? 'border-[#E30613] bg-red-50/40 ring-1 ring-[#E30613]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600" /> Web3 Cryptocurrency
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      USDT / BTC / ETH
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                      5% OFF
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Zero-fee blockchain settlement with an automatic 5% checkout discount. Wallet details provided
                  after order placement.
                </p>
              </button>
            </div>

            <p className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              Banking and cryptocurrency payment instructions are not shown at checkout. After you place your order,
              contact our admin team to receive official payment details for your selected method.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation Button (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({cart.length} Items)
            </h3>

            {/* Item list preview */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-gray-400">{item.quantity}x</span>
                    <span className="font-semibold text-gray-800 truncate">{item.product.modelName}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatPrice(item.variant.priceEur * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatPrice(cartSubtotalEur, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Shipping</span>
                <span className={isFreeShipping ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                  {isFreeShipping ? 'FREE' : formatPrice(shippingCostEur, currency)}
                </span>
              </div>
              {isCryptoPayment && discountEur > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{discountLabel}</span>
                  <span>−{formatPrice(discountEur, currency)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount Due</span>
                <span className="text-xl text-[#1D1D1F]">{formatPrice(totalAmountEur, currency)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#E30613] hover:bg-[#c20510] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/30 active:scale-98 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> {isSubmitting ? 'Placing Order…' : 'Place Order & Generate Ref'}
            </button>

            {/* Trust Footer */}
            <div className="text-[11px] text-gray-400 text-center space-y-1 pt-2">
              <p>✓ 14-Day EU Statutory Right of Withdrawal</p>
              <p>✓ 2-Year Full Hardware EU Warranty</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

function RevolutMark() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="4" fill="#0666EB" />
      <path
        fill="#fff"
        d="M5.1 3.4h3.35c1.72 0 2.9 1.02 2.9 2.52 0 1.12-.68 1.98-1.78 2.3L11.3 12.6H9.38L7.75 8.55H6.45V12.6H5.1V3.4Zm1.35 3.75h1.85c.82 0 1.38-.48 1.38-1.18 0-.7-.56-1.15-1.38-1.15H6.45v2.33Z"
      />
    </svg>
  );
}

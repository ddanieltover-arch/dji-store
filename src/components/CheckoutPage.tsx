import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  QrCode,
  Copy,
  Check,
  Zap,
  ArrowLeft,
  Lock,
  UploadCloud,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';

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
  const vatRate = 0.19; // 19% standard EU VAT
  const vatAmountEur = (cartSubtotalEur + shippingCostEur) * (vatRate / (1 + vatRate));
  const totalAmountEur = cartSubtotalEur + shippingCostEur;

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('DE');

  const [paymentMethod, setPaymentMethod] = useState<'sepa_bank_wire' | 'crypto_usdt' | 'crypto_btc'>('sepa_bank_wire');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');

  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedCryptoAddress, setCopiedCryptoAddress] = useState(false);

  const europeanCountries = [
    { code: 'DE', name: 'Germany (Deutschland)' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Netherlands (Nederland)' },
    { code: 'AT', name: 'Austria (Österreich)' },
    { code: 'ES', name: 'Spain (España)' },
    { code: 'IT', name: 'Italy (Italia)' },
    { code: 'BE', name: 'Belgium (België)' },
    { code: 'SE', name: 'Sweden (Sverige)' },
    { code: 'DK', name: 'Denmark (Danmark)' },
    { code: 'CH', name: 'Switzerland (Schweiz)' }
  ];

  const handleCopy = (text: string, type: 'iban' | 'crypto') => {
    navigator.clipboard.writeText(text);
    if (type === 'iban') {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2500);
    } else {
      setCopiedCryptoAddress(true);
      setTimeout(() => setCopiedCryptoAddress(false), 2500);
    }
    addToast({ type: 'info', title: 'Copied to Clipboard' });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
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

    const countryObj = europeanCountries.find((c) => c.code === countryCode) || europeanCountries[0];

    const orderItems = cart.map((item) => ({
      productName: item.product.modelName,
      comboName: item.variant.comboName,
      sku: item.variant.sku,
      priceEur: item.variant.priceEur,
      quantity: item.quantity,
      imageUrl: item.product.images.cutout || item.product.images.hero
    }));

    const newOrder = placeNewOrder({
      customer: {
        firstName,
        lastName,
        email,
        phone: phone || '+49 170 000 0000',
        company: company || undefined
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
      discountEur: 0,
      vatEur: vatAmountEur,
      vatRatePercent: 19,
      shippingEur: shippingCostEur,
      totalEur: totalAmountEur,
      paymentMethod,
      paymentStatus: 'verifying',
      paymentDetails: {
        receiptFileName: receiptFileName || undefined,
        cryptoTxHash: cryptoTxHash || undefined,
        cryptoAddress:
          paymentMethod === 'crypto_usdt'
            ? 'TYDjiStoreEuPayoutAddressTRC20Official9921'
            : 'bc1qdjistoreeuofficialgermany789x42'
      }
    });

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

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Company / VAT Number (Optional for B2B Invoicing)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. CineFlight Studios GmbH (DE349882109)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E30613]"
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
                  {europeanCountries.map((c) => (
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

          {/* 3. Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                Official European Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                    German IBAN
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Official Deutsche Bank AG corporate account. Instant European transfer clearance.
                </p>
              </button>

              {/* Crypto Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto_usdt')}
                className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                  paymentMethod === 'crypto_usdt'
                    ? 'border-[#E30613] bg-red-50/40 ring-1 ring-[#E30613]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600" /> Web3 Cryptocurrency
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    USDT / BTC / ETH
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Zero-fee blockchain settlement. Direct wallet-to-wallet transfer with instant verification.
                </p>
              </button>
            </div>

            {/* SEPA Wire Details Panel */}
            {paymentMethod === 'sepa_bank_wire' && (
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="font-bold">Bank Name:</span>
                  <span className="font-semibold text-gray-900">Deutsche Bank AG (Frankfurt)</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="font-bold">Account Beneficiary:</span>
                  <span className="font-semibold text-gray-900">DJI Store EU Distribution GmbH</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">IBAN:</span>
                    <span className="font-mono font-bold text-gray-900">DE89 3704 0044 0532 0130 00</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('DE89370400440532013000', 'iban')}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] flex items-center gap-1"
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIban ? 'Copied' : 'Copy IBAN'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="font-bold">BIC / SWIFT:</span>
                  <span className="font-mono font-semibold text-gray-900">DEUTDEDBFXX</span>
                </div>

                {/* Optional receipt upload */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="font-bold text-gray-700 block mb-1">
                    Upload Bank Transfer Confirmation Receipt (Optional for 1-Hour Dispatch Clearance):
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setReceiptFileName(e.target.files?.[0]?.name || 'transfer_receipt.pdf')}
                    className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  />
                  {receiptFileName && (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 mt-1">
                      <FileCheck className="w-3.5 h-3.5" /> Attached: {receiptFileName}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Crypto Details Panel */}
            {paymentMethod === 'crypto_usdt' && (
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Payable Amount:</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {totalAmountEur.toFixed(2)} USDT (TRC-20)
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Official TRC20 Address:</span>
                    <span className="font-mono font-bold text-gray-900 text-xs truncate">
                      TYDjiStoreEuPayoutAddressTRC20Official9921
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('TYDjiStoreEuPayoutAddressTRC20Official9921', 'crypto')}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    {copiedCryptoAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCryptoAddress ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Transaction Hash / TxID (Optional):</label>
                  <input
                    type="text"
                    value={cryptoTxHash}
                    onChange={(e) => setCryptoTxHash(e.target.value)}
                    placeholder="e.g. 7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            )}
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
                <span>DHL European Express</span>
                <span className={isFreeShipping ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                  {isFreeShipping ? 'FREE' : formatPrice(shippingCostEur, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Included Statutory 19% VAT</span>
                <span>{formatPrice(vatAmountEur, currency)}</span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount Due</span>
                <span className="text-xl text-[#1D1D1F]">{formatPrice(totalAmountEur, currency)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/30 active:scale-98 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Place Order & Generate Ref
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

import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Clock,
  Printer
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';
import {
  PaymentInstructionsModal,
  requiresAdminPaymentInstructions
} from './checkout/PaymentInstructionsModal';

export const OrderSuccessPage: React.FC = () => {
  const { orders, activeOrderNumber, setViewMode, currency } = useStore();
  const currentOrder = orders.find((o) => o.orderNumber === activeOrderNumber) || orders[0];
  const [showPaymentModal, setShowPaymentModal] = useState(
    () => currentOrder != null && requiresAdminPaymentInstructions(currentOrder.paymentMethod)
  );

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">No active order found</h2>
        <button
          onClick={() => setViewMode('home')}
          className="px-6 py-2.5 bg-[#1D1D1F] text-white font-bold rounded-xl text-xs"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {showPaymentModal && (
        <PaymentInstructionsModal
          order={currentOrder}
          currency={currency}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Confirmation Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Thank you, {currentOrder.customer.firstName}!
        </h1>
        <p className="text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded in our European distribution center in Frankfurt. A confirmation invoice has been sent to{' '}
          <strong className="text-white">{currentOrder.customer.email}</strong>.
        </p>

        <div className="inline-block bg-black/40 border border-emerald-500/30 rounded-2xl px-6 py-3 text-center">
          <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
            European Order Reference:
          </span>
          <span className="text-xl sm:text-2xl font-mono font-black text-white">
            {currentOrder.orderNumber}
          </span>
        </div>
      </div>

      {/* Live Order Timeline Progress */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" /> DHL European Express Timeline
          </span>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Tracking: {currentOrder.trackingNumber || 'DHL-PENDING'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Order Received
            </span>
            <p className="text-emerald-700 text-[11px]">Recorded in Frankfurt WMS</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" /> 2. Payment Verification
            </span>
            <p className="text-amber-700 text-[11px]">
              {currentOrder.paymentStatus === 'verified' ? 'Settled & Approved' : 'Matching Transfer Ref'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1 opacity-70">
            <span className="font-bold text-gray-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-gray-400" /> 3. Picking & Boxing
            </span>
            <p className="text-gray-500 text-[11px]">Factory OEM seal check</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1 opacity-70">
            <span className="font-bold text-gray-700 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-gray-400" /> 4. DHL Dispatch
            </span>
            <p className="text-gray-500 text-[11px]">24h-48h Delivery</p>
          </div>
        </div>
      </div>

      {/* Order Details & Shipping Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3 text-xs">
          <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Delivery Address
          </h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">
              {currentOrder.customer.firstName} {currentOrder.customer.lastName}
            </p>
            {currentOrder.customer.company && <p>{currentOrder.customer.company}</p>}
            <p>{currentOrder.shippingAddress.street}</p>
            <p>
              {currentOrder.shippingAddress.postalCode} {currentOrder.shippingAddress.city}
            </p>
            <p className="font-semibold text-gray-900">{currentOrder.shippingAddress.countryName}</p>
            <p className="text-gray-500 pt-1">📞 {currentOrder.customer.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3 text-xs">
          <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Financial Summary
          </h3>
          <div className="space-y-1.5 text-gray-600">
            <div className="flex justify-between">
              <span>Items Total ({currentOrder.items.length} lines):</span>
              <span className="font-bold text-gray-900">{formatPrice(currentOrder.subtotalEur, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>DHL Express Delivery:</span>
              <span className="font-bold text-gray-900">
                {currentOrder.shippingEur === 0 ? 'FREE' : formatPrice(currentOrder.shippingEur, currency)}
              </span>
            </div>
            {currentOrder.discountEur > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Web3 Cryptocurrency (5% off)</span>
                <span>−{formatPrice(currentOrder.discountEur, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Paid / Payable:</span>
              <span className="text-base text-[#1D1D1F]">{formatPrice(currentOrder.totalEur, currency)}</span>
            </div>
            {requiresAdminPaymentInstructions(currentOrder.paymentMethod) && (
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-3 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-[11px] hover:bg-amber-100 transition-colors"
              >
                View Payment Instructions — Contact Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Item Breakdown List */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-3">
          Ordered Aircraft & Accessories
        </h3>

        <div className="space-y-3">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{item.productName}</h4>
                  <p className="text-gray-500 text-[11px]">{item.comboName}</p>
                  <span className="text-gray-400 text-[10px]">SKU: {item.sku}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-gray-900">
                  {formatPrice(item.priceEur * item.quantity, currency)}
                </div>
                <span className="text-gray-500 text-[11px] font-semibold">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4" /> Print Order Invoice
        </button>

        <button
          onClick={() => setViewMode('home')}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
        >
          Return to DJI Store EU <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

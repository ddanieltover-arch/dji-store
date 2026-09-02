import React from 'react';
import { Building2, Mail, QrCode, X } from 'lucide-react';
import { formatPrice } from '../../data/currency';
import type { PlacedOrder } from '../../types';
import { isCryptoPaymentMethod } from '../../lib/payments/checkoutTotals';

export const PAYMENT_ADMIN_EMAIL = 'sales@djii.eu';

interface PaymentInstructionsModalProps {
  order: PlacedOrder;
  currency: string;
  onClose: () => void;
}

export const PaymentInstructionsModal: React.FC<PaymentInstructionsModalProps> = ({
  order,
  currency,
  onClose
}) => {
  const isCrypto = isCryptoPaymentMethod(order.paymentMethod);
  const isSepa = order.paymentMethod === 'sepa_bank_wire';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close payment instructions"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-instructions-title"
        className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-fadeIn"
      >
        <div
          className={`px-6 py-5 text-white ${
            isCrypto
              ? 'bg-gradient-to-r from-emerald-800 to-teal-900'
              : 'bg-gradient-to-r from-slate-800 to-slate-950'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                {isCrypto ? (
                  <QrCode className="w-5 h-5 text-emerald-200" />
                ) : (
                  <Building2 className="w-5 h-5 text-slate-200" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Order {order.orderNumber}
                </p>
                <h2 id="payment-instructions-title" className="text-lg font-extrabold">
                  {isCrypto ? 'Cryptocurrency Payment' : 'SEPA Bank Wire Payment'}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
          <p className="leading-relaxed">
            Your order has been registered successfully. To complete payment, please contact our admin team for
            official {isCrypto ? 'wallet and transfer' : 'banking'} instructions.
          </p>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Amount due</span>
              <span className="font-extrabold text-gray-900">{formatPrice(order.totalEur, currency)}</span>
            </div>
            {order.discountEur > 0 && (
              <div className="flex justify-between gap-4 text-emerald-700">
                <span>Web3 discount applied</span>
                <span className="font-bold">−{formatPrice(order.discountEur, currency)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Order reference</span>
              <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
            Include your order reference <strong>{order.orderNumber}</strong> when contacting us so we can match
            your payment and release dispatch within 1 hour of verification.
          </div>

          <a
            href={`mailto:${PAYMENT_ADMIN_EMAIL}?subject=${encodeURIComponent(`Payment instructions — ${order.orderNumber}`)}&body=${encodeURIComponent(
              `Hello,\n\nI would like to receive payment instructions for order ${order.orderNumber}.\n\nName: ${order.customer.firstName} ${order.customer.lastName}\nEmail: ${order.customer.email}\nPayment method: ${isCrypto ? 'Web3 Cryptocurrency' : 'SEPA Bank Wire'}\nAmount due: ${order.totalEur.toFixed(2)} EUR\n\nThank you.`
            )}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Admin — {PAYMENT_ADMIN_EMAIL}
          </a>

          {isSepa && (
            <p className="text-[11px] text-gray-500 text-center">
              Our team will provide IBAN, beneficiary, and reference details by email.
            </p>
          )}
          {isCrypto && (
            <p className="text-[11px] text-gray-500 text-center">
              Our team will provide the official wallet address and exact crypto amount by email.
            </p>
          )}
        </div>

        <div className="px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors"
          >
            Continue to Order Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export function requiresAdminPaymentInstructions(paymentMethod: string): boolean {
  return paymentMethod === 'sepa_bank_wire' || isCryptoPaymentMethod(paymentMethod);
}

import React, { useMemo } from 'react';
import { formatPrice } from '../../data/currency';
import {
  CHECKOUT_CARRIERS,
  estimateStandardShippingDates,
  STANDARD_SHIPPING_METHOD
} from '../../lib/shipping/standardShipping';
import { CarrierLogo } from './CarrierLogos';

interface ShippingMethodSectionProps {
  isFreeShipping: boolean;
  shippingCostEur: number;
  currency: string;
}

export const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  isFreeShipping,
  shippingCostEur,
  currency
}) => {
  const { shipLabel, arrivalLabel } = useMemo(() => estimateStandardShippingDates(), []);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center">
          3
        </div>
        <h2 className="font-extrabold text-base text-gray-900">Shipping Method</h2>
      </div>

      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border-2 border-blue-500 bg-white"
        aria-current="true"
      >
        <div className="space-y-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">{STANDARD_SHIPPING_METHOD.name}</p>
          <p className="text-sm font-semibold text-gray-900">
            {isFreeShipping ? 'Free' : formatPrice(shippingCostEur, currency)}
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Estimated shipping date: {shipLabel}, estimated arrival date: {arrivalLabel}
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-1.5 shrink-0 sm:max-w-[240px] w-full sm:w-auto"
          aria-label="European shipping partners"
        >
          {CHECKOUT_CARRIERS.map((carrier) => (
            <div
              key={carrier.id}
              className="flex items-center justify-center bg-white border border-gray-200 rounded px-1.5 py-1.5 h-9"
              title={carrier.name}
            >
              <CarrierLogo carrier={carrier.id} className="h-4 w-full max-w-[68px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Estimated dispatch and delivery window for standard European shipping. */
export function estimateStandardShippingDates(fromDate = new Date()): {
  shipDate: Date;
  arrivalDate: Date;
  shipLabel: string;
  arrivalLabel: string;
} {
  const shipDate = addBusinessDays(fromDate, 1);
  const arrivalDate = addBusinessDays(shipDate, 4);

  return {
    shipDate,
    arrivalDate,
    shipLabel: formatShortDate(shipDate),
    arrivalLabel: formatShortDate(arrivalDate)
  };
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return result;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const STANDARD_SHIPPING_METHOD = {
  id: 'standard_eu',
  name: 'Standard Shipping',
  description: 'European parcel network — DHL, FedEx, DPD, GLS & regional partners'
} as const;

export type CarrierId = 'dhl' | 'fedex' | 'dpd' | 'gls' | 'postnl' | 'hermes';

export interface CheckoutCarrier {
  id: CarrierId;
  name: string;
}

/** European carriers shown at checkout (no UPS). */
export const CHECKOUT_CARRIERS: CheckoutCarrier[] = [
  { id: 'dhl', name: 'DHL' },
  { id: 'fedex', name: 'FedEx' },
  { id: 'dpd', name: 'DPD' },
  { id: 'gls', name: 'GLS' },
  { id: 'postnl', name: 'PostNL' },
  { id: 'hermes', name: 'Hermes' }
];

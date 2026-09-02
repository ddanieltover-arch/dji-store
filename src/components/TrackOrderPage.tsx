import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/currency';

export const TrackOrderPage: React.FC = () => {
  const { orders, activeOrderNumber } = useStore();
  const [searchQuery, setSearchQuery] = useState(activeOrderNumber ?? '');
  const [searchedOrder, setSearchedOrder] = useState<(typeof orders)[number] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase())
    );

    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
          European Express Logistics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Track Your DHL Shipment
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Enter your DJI Store EU order reference (e.g. <code>DJI-EU-...</code>) or DHL European Tracking Number.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="pt-2 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. DJI-EU-884291 or DHL-DE-..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md transition-all shrink-0"
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Result Card */}
      {hasSearched && searchedOrder ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Banner */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase block">
                  Order Reference
                </span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {searchedOrder.orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 font-bold block">Status</span>
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                    {searchedOrder.shippingStatus === 'delivered'
                      ? 'Delivered'
                      : searchedOrder.shippingStatus === 'dispatched'
                      ? 'In Transit (DHL Express)'
                      : 'Processing in Frankfurt Hub'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step Meter */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Order Placed
                </span>
                <p className="text-emerald-700 text-[10px]">
                  {new Date(searchedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Payment Verified
                </span>
                <p className="text-emerald-700 text-[10px]">
                  {searchedOrder.paymentMethod === 'sepa_bank_wire' ? 'SEPA Wire' : 'Crypto USDT'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" /> 3. DHL Hub Frankfurt
                </span>
                <p className="text-blue-700 text-[10px]">Sorting Center Frankfurt Süd</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="font-bold text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" /> 4. Final Delivery
                </span>
                <p className="text-gray-500 text-[10px]">
                  Destination: {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.countryCode}
                </p>
              </div>
            </div>

            {/* Destination Info */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="font-bold text-gray-700 block mb-1">Recipient & Destination:</span>
                <p className="text-gray-900 font-semibold">
                  {searchedOrder.customer.firstName} {searchedOrder.customer.lastName}
                </p>
                <p className="text-gray-600">
                  {searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.postalCode}{' '}
                  {searchedOrder.shippingAddress.city} ({searchedOrder.shippingAddress.countryName})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-bold text-gray-700 block mb-1">Carrier Tracking ID:</span>
                <span className="font-mono font-black text-sm text-blue-600">
                  {searchedOrder.trackingNumber || 'DHL-EX-DE-8890214'}
                </span>
                <p className="text-[10px] text-gray-500 mt-1">24h Express Air Freight</p>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-sm font-bold text-gray-800">
            No order found matching "{searchQuery}"
          </p>
          <p className="text-xs text-gray-500">
            Please check the reference number from your confirmation email or bank wire description.
          </p>
        </div>
      ) : null}
    </div>
  );
};

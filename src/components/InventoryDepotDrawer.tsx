import React from 'react';
import {
  Building2,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  ShieldCheck,
  X,
  MapPin
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { EUROPEAN_WAREHOUSES } from '../data/warehouses';
import { useStore } from '../context/StoreContext';

interface InventoryDepotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ProductVariant;
}

export const InventoryDepotDrawer: React.FC<InventoryDepotDrawerProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant
}) => {
  const { depotStocks } = useStore();

  if (!isOpen) return null;

  const variantStocks = depotStocks[selectedVariant.id] || [
    {
      depotId: 'depot-fra-01',
      stockUnits: selectedVariant.stockQuantity,
      reservedUnits: 2,
      incomingUnits: 40,
      incomingEtaDate: '2026-08-22',
      reorderPoint: 5,
      backorderAllowed: true,
      batchDispatchDate: '2026-08-15'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                European WMS Logistics
              </span>
              <span className="text-xs text-gray-500 font-semibold">Real-Time Depot Allocations</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              Warehouse Inventory & Routing
            </h3>
            <p className="text-xs text-gray-500">
              {product.modelName} — <strong>{selectedVariant.comboName}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warehouses List */}
        <div className="space-y-4">
          {EUROPEAN_WAREHOUSES.map((depot) => {
            const stockInfo = variantStocks.find((s) => s.depotId === depot.id);
            const units = stockInfo?.stockUnits ?? 0;
            const isLow = units > 0 && units <= 5;
            const isOut = units === 0;

            return (
              <div
                key={depot.id}
                className={`p-5 rounded-2xl border transition-all ${
                  depot.isPrimaryHub
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{depot.name}</h4>
                      {depot.isPrimaryHub && (
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] uppercase">
                          Primary EU Hub
                        </span>
                      )}
                      <span className="font-mono text-xs text-gray-400">[{depot.code}]</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {depot.city}, {depot.countryCode}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-gray-400" />
                        {depot.carrierService}
                      </span>
                    </div>
                  </div>

                  {/* Stock State */}
                  <div className="text-right">
                    {units > 5 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {units} Units Ready
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Only {units} Units Left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-extrabold text-xs">
                        Replenishing Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Incoming ETA or Dispatch Schedule */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Order before {depot.cutoffTimeUtc} UTC for same-day dispatch</span>
                  </div>

                  {stockInfo?.incomingEtaDate && (
                    <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Next batch (+{stockInfo.incomingUnits} units): ETA {stockInfo.incomingEtaDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3 text-xs text-gray-600">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            Orders are automatically routed to the nearest regional depot with available inventory to guarantee 24h–48h DHL Express delivery across all 27 EU member states.
          </span>
        </div>
      </div>
    </div>
  );
};

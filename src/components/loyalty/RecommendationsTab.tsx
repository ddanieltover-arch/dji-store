import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Battery,
  Camera,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getPersonalizedRecommendations } from '../../data/crmData';
import { DJI_PRODUCTS } from '../../data/products';
import { formatPrice } from '../../data/currency';

export const RecommendationsTab: React.FC = () => {
  const {
    currentCustomer,
    currency,
    addToCart,
    navigateToPdp,
    addToast
  } = useStore();

  const recGroups = getPersonalizedRecommendations(currentCustomer.ownedProducts);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          European Flight Intelligence Engine
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">
          Curated Accessories & Upgrades for Your Fleet
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Based on your registered aircraft ({currentCustomer.ownedProducts.join(', ') || 'DJI Fleet'}), here are official European-stocked batteries, optical filters, and next-gen hardware matched to your flight profile.
        </p>
      </div>

      {/* Recommendations Groups */}
      <div className="space-y-8">
        {recGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                {gIdx === 0 ? (
                  <Battery className="w-5 h-5 text-emerald-400" />
                ) : gIdx === 1 ? (
                  <Camera className="w-5 h-5 text-purple-400" />
                ) : (
                  <Layers className="w-5 h-5 text-blue-400" />
                )}
                {grp.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{grp.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {grp.products.map((prod) => {
                const defaultVariant = prod.variants[0];

                return (
                  <div
                    key={prod.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all group"
                  >
                    <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center justify-center h-44 relative">
                      <img
                        src={prod.images.hero}
                        alt={prod.modelName}
                        referrerPolicy="no-referrer"
                        className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-mono">
                        Official Accessory
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[11px] text-zinc-500 font-semibold uppercase">
                          {prod.series}
                        </div>
                        <h4 className="text-base font-bold text-zinc-100 mt-0.5">
                          {prod.modelName}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {prod.tagline}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-zinc-500">Price (Inc. EU VAT)</div>
                          <div className="text-base font-bold text-zinc-100 font-mono">
                            {formatPrice(defaultVariant.priceEur, currency)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigateToPdp(prod.id)}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => addToCart(prod, defaultVariant, 1)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

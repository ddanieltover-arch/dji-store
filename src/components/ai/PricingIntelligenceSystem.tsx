import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Globe2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_COMPETITOR_PRICES,
  INITIAL_PRICING_RECOMMENDATIONS
} from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';
import { DynamicPricingRecommendation } from '../../types/aiOperations';

export const PricingIntelligenceSystem: React.FC = () => {
  const { currency, addToast } = useStore();

  const [recommendations, setRecommendations] = useState<DynamicPricingRecommendation[]>(
    INITIAL_PRICING_RECOMMENDATIONS
  );
  const [competitorRadar, setCompetitorRadar] = useState(INITIAL_COMPETITOR_PRICES);

  const handleApplyPriceChange = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'applied' as const } : r))
    );
    addToast({
      type: 'success',
      title: 'Dynamic Price Update Deployed',
      message: `Price adjustment for ${recId} is now live across European storefronts.`
    });
  };

  const handleRollbackPrice = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'rolled_back' as const } : r))
    );
    addToast({
      type: 'info',
      title: 'Price Rollback Executed',
      message: `Restored initial catalog price for ${recId}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Hermes Dynamic Pricing Intelligence & Margin Guard
              </span>
              <span className="text-xs text-zinc-400 font-mono">Real-Time Elasticity Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Pan-European Competitor Price Scraping & Elasticity Engine
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Monitors major retail channels across France, Germany, Switzerland, and the Netherlands every 15 minutes, dynamically defending market buy-box position while locking in strict 18%+ gross margins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Margin Guardrail: &ge;18.0% Net Lock
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC PRICING RECOMMENDATIONS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Active Pricing Opportunities & Recommendations
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              AI-generated price optimizations based on competitor stock levels and demand elasticity
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">2 Pending Actions</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{rec.id}</span>
                    <span className="text-xs text-zinc-400">({rec.sku})</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        rec.status === 'applied'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rec.status === 'rolled_back'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{rec.productName}</h4>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs text-zinc-500 font-mono">Current Price</div>
                    <div className="text-base font-bold text-zinc-400 font-mono line-through">
                      {formatPrice(rec.currentPriceEur, currency)}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <div>
                    <div className="text-xs text-emerald-400 font-mono font-bold">Suggested</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {formatPrice(rec.suggestedPriceEur, currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* RATIONALE & ELASTICITY METRICS */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                💡 <strong>AI Analysis:</strong> {rec.rationale}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Price Elasticity</span>
                  <strong className="text-amber-400">{rec.elasticityIndex} Index</strong>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Expected Volume</span>
                  <strong className="text-emerald-400">+{rec.expectedVolumeChangePct}%</strong>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Target Gross Margin</span>
                  <strong className="text-zinc-200">{rec.targetGrossMarginPct}%</strong>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Revenue Uplift</span>
                  <strong className="text-emerald-400">+{formatPrice(rec.expectedRevenueImpactEur, currency)}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono">
                  Floor: {formatPrice(rec.minPriceFloorEur, currency)} • Ceiling: {formatPrice(rec.maxPriceCeilingEur, currency)}
                </span>

                <div className="flex items-center gap-2">
                  {rec.status === 'applied' ? (
                    <button
                      onClick={() => handleRollbackPrice(rec.id)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 border border-zinc-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Rollback Price
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyPriceChange(rec.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Apply Dynamic Price
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPETITOR SCRAPING RADAR TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-400" />
            Live European Competitor Scrape Feeds (Mavic 4 Pro FMC)
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            Next Scrape in 4m 12s
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="pb-3 font-semibold">Competitor / Country</th>
                <th className="pb-3 font-semibold">Scraped Price</th>
                <th className="pb-3 font-semibold">Shipping</th>
                <th className="pb-3 font-semibold">Stock Status</th>
                <th className="pb-3 font-semibold">Delta vs DJI EU</th>
                <th className="pb-3 font-semibold text-right">Last Scraped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {competitorRadar.map((comp, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-bold text-zinc-200">{comp.competitorName}</td>
                  <td className="py-3 font-black text-white">
                    {formatPrice(comp.scrapedPriceEur, currency)}
                  </td>
                  <td className="py-3 text-zinc-400">
                    {comp.shippingCostEur === 0 ? 'Free' : formatPrice(comp.shippingCostEur, currency)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        comp.stockStatus === 'in_stock'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {comp.stockStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    {comp.priceDeltaEur === 0 ? (
                      <span className="text-zinc-500 font-bold">Parity (0.0%)</span>
                    ) : comp.priceDeltaEur > 0 ? (
                      <span className="text-rose-400 font-bold">
                        +{formatPrice(comp.priceDeltaEur, currency)} ({comp.deltaPct}%)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold">
                        {formatPrice(comp.priceDeltaEur, currency)} ({comp.deltaPct}%)
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right text-zinc-500">{comp.scrapedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

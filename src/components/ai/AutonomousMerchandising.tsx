import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowUpDown,
  Zap,
  TrendingUp,
  Percent,
  Plus,
  CheckCircle2,
  Sliders,
  BarChart2,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_MERCHANDISING_SCORES,
  INITIAL_DYNAMIC_BUNDLES,
  INITIAL_EXPERIMENTS
} from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';
import { MerchandisingScore, DynamicAccessoryBundle } from '../../types/aiOperations';

export const AutonomousMerchandising: React.FC = () => {
  const { currency, addToast } = useStore();

  const [scores, setScores] = useState<MerchandisingScore[]>(INITIAL_MERCHANDISING_SCORES);
  const [bundles, setBundles] = useState<DynamicAccessoryBundle[]>(INITIAL_DYNAMIC_BUNDLES);
  const [experiments, setExperiments] = useState(INITIAL_EXPERIMENTS);

  const [velocityWeight, setVelocityWeight] = useState(35);
  const [marginWeight, setMarginWeight] = useState(35);
  const [inventoryWeight, setInventoryWeight] = useState(30);

  const handleRecalculateRanks = () => {
    setScores((prev) =>
      prev
        .map((s) => {
          const composite =
            (s.velocityScore * velocityWeight +
              s.marginContributionScore * marginWeight +
              s.inventoryHealthScore * inventoryWeight) /
            100 *
            s.searchTrendMultiplier;
          return {
            ...s,
            compositeRankScore: parseFloat(composite.toFixed(1))
          };
        })
        .sort((a, b) => b.compositeRankScore - a.compositeRankScore)
    );

    addToast({
      type: 'success',
      title: 'Autonomous Merchandising Ranks Updated',
      message: 'Catalog product placement re-indexed based on custom algorithm weights.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Aegis Autonomous Merchandising Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">Dynamic Ranking & Bundling</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Multi-Factor Algorithmic Catalog Ranking & Bundle Synthesis
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Autonomously elevates high-velocity, high-margin, and well-stocked inventory to prime storefront positions while generating personalized accessory packages.
            </p>
          </div>

          <button
            onClick={handleRecalculateRanks}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Recalculate Ranking Engine
          </button>
        </div>
      </div>

      {/* WEIGHT TUNING BAR */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Algorithm Composite Weighting Model
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            Total Weight: {velocityWeight + marginWeight + inventoryWeight}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-300 font-mono">
              <span>Sales Velocity Weight</span>
              <strong className="text-purple-400">{velocityWeight}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={velocityWeight}
              onChange={(e) => setVelocityWeight(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-300 font-mono">
              <span>Margin Contribution Weight</span>
              <strong className="text-emerald-400">{marginWeight}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={marginWeight}
              onChange={(e) => setMarginWeight(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-300 font-mono">
              <span>Depot Stock Depth Weight</span>
              <strong className="text-blue-400">{inventoryWeight}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={inventoryWeight}
              onChange={(e) => setInventoryWeight(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* MERCHANDISING SCORES TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Dynamic Product Ranking Matrix
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live algorithmic storefront positioning on Homepage and PLP grids
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            Auto-sync Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Product Name</th>
                <th className="pb-3 font-semibold">Velocity (0-100)</th>
                <th className="pb-3 font-semibold">Margin Score</th>
                <th className="pb-3 font-semibold">Depot Depth</th>
                <th className="pb-3 font-semibold">Search Multiplier</th>
                <th className="pb-3 font-semibold">Composite Score</th>
                <th className="pb-3 font-semibold text-right">AI Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {scores.map((item, idx) => (
                <tr key={item.productId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{item.productName}</td>
                  <td className="py-3 text-purple-300 font-semibold">{item.velocityScore}/100</td>
                  <td className="py-3 text-emerald-400 font-semibold">{item.marginContributionScore}/100</td>
                  <td className="py-3 text-blue-400 font-semibold">{item.inventoryHealthScore}/100</td>
                  <td className="py-3 text-amber-400 font-bold">{item.searchTrendMultiplier}x</td>
                  <td className="py-3">
                    <span className="text-sm font-black text-white bg-purple-950/60 px-2 py-1 rounded border border-purple-800/50">
                      {item.compositeRankScore}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {item.recommendedAction.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ROW: DYNAMIC ACCESSORY BUNDLES & A/B EXPERIMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DYNAMIC BUNDLES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              Dynamic AI-Synthesized Accessory Bundles
            </h3>
            <span className="text-xs text-emerald-400 font-mono">+16.4% Avg AOV Lift</span>
          </div>

          <div className="space-y-4">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{bundle.title}</span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    +{bundle.projectedAovUpliftPct}% AOV Lift
                  </span>
                </div>

                <div className="text-xs text-zinc-400">
                  Base Drone: <strong className="text-zinc-200">{bundle.parentProductName}</strong>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-xs space-y-1">
                  {bundle.bundledProducts.map((bp, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-300 font-mono">
                      <span>+ {bp.name}</span>
                      <span className="text-zinc-400">{formatPrice(bp.priceEur, currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
                  <div>
                    <span className="line-through text-zinc-500 mr-2">
                      {formatPrice(bundle.totalRegularPriceEur, currency)}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatPrice(bundle.bundlePriceEur, currency)}
                    </span>
                  </div>
                  <span className="text-zinc-400">Margin: {bundle.marginPreservedPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* A/B EXPERIMENTS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              Storefront Merchandising A/B Experiments
            </h3>
            <span className="text-xs text-purple-400 font-mono">Bayesian Testing</span>
          </div>

          <div className="space-y-4">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{exp.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      exp.status === 'stat_sig_reached'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {exp.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase">Control (A)</div>
                    <div className="text-zinc-300 truncate">{exp.variantA}</div>
                  </div>
                  <div className="p-2 bg-purple-950/40 rounded border border-purple-800/50">
                    <div className="text-[10px] text-purple-400 uppercase">Variant (B)</div>
                    <div className="text-purple-200 truncate">{exp.variantB}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">
                    Lift: +{exp.conversionLiftPct}% CR ({formatPrice(exp.revenueLiftEur, currency)})
                  </span>
                  <span className="text-zinc-500">Confidence: {exp.confidencePct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

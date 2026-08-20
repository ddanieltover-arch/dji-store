import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  Sliders,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PREDICTIVE_REVENUE_MODELS } from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';

export const PredictiveRevenueForecasting: React.FC = () => {
  const { currency } = useStore();

  const [selectedHorizon, setSelectedHorizon] = useState<
    'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  >('monthly');

  const [scenario, setScenario] = useState<'conservative' | 'baseline' | 'aggressive'>('baseline');
  const [marketingMultiplier, setMarketingMultiplier] = useState(1.0);

  const model = PREDICTIVE_REVENUE_MODELS[selectedHorizon];

  // Adjust projection based on scenario & marketing multiplier
  const multiplier = (scenario === 'conservative' ? 0.9 : scenario === 'aggressive' ? 1.15 : 1.0) * marketingMultiplier;
  const adjustedTotal = Math.round(model.projectedTotalEur * multiplier);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini Enterprise Revenue Prediction Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">Model: ARIMA-LSTM v4.2</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Multi-Horizon Revenue Forecasting & Scenario Modeling
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Synthesizing European weather forecasts, EASA registration trends, competitor pricing scraping, and historical flight season velocity.
            </p>
          </div>

          {/* Horizon Selector */}
          <div className="bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 flex items-center shrink-0">
            {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                  selectedHorizon === h
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI & Scenario Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Projected Total Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Projected {selectedHorizon.toUpperCase()} Revenue
            </span>
            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
              Confidence: {Math.round(model.confidenceScore * 100)}%
            </span>
          </div>

          <div className="text-3xl lg:text-4xl font-black text-white font-mono">
            {formatPrice(adjustedTotal, currency)}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+{model.expectedGrowthPct}% vs Prior Period Baseline</span>
          </div>

          {/* Scenario Buttons */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <span className="text-[11px] text-zinc-500 font-semibold uppercase">
              Model Scenario
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conservative', label: 'Conservative (-10%)' },
                { id: 'baseline', label: 'Baseline (0%)' },
                { id: 'aggressive', label: 'Aggressive (+15%)' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold font-mono transition-all text-center ${
                    scenario === s.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Marketing Spend Multiplier Slider */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Marketing Budget Multiplier</span>
              <span className="font-mono text-indigo-300 font-bold">{marketingMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={marketingMultiplier}
              onChange={(e) => setMarketingMultiplier(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-zinc-800"
            />
          </div>
        </div>

        {/* Right: Key Drivers & Risk Factors */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Algorithmic Demand Drivers & External Indicators
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Updated every 15m</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drivers */}
            <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Positive Growth Catalysts
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {model.keyDrivers.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Downside Risk Watchlist
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {model.riskFactors.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              Autonomous Commerce Agents utilize this forecast to automatically reserve DHL air-freight capacity and pre-balance European warehouse stock 72 hours in advance.
            </span>
          </div>
        </div>
      </div>

      {/* Main Forecast Visualizer Matrix */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Confidence Interval Matrix ({selectedHorizon.toUpperCase()})
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" /> Forecast Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> Actual Delivered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xs" /> 95% Confidence Band
            </span>
          </div>
        </div>

        {/* Detailed Points Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="pb-3 font-semibold">Period / Horizon</th>
                <th className="pb-3 font-semibold">Actual Delivered</th>
                <th className="pb-3 font-semibold">AI Baseline</th>
                <th className="pb-3 font-semibold">Lower 95% Band</th>
                <th className="pb-3 font-semibold">Upper 95% Band</th>
                <th className="pb-3 font-semibold">Seasonal Weight</th>
                <th className="pb-3 font-semibold text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {model.points.map((pt, idx) => {
                const variance = pt.actualRevenueEur
                  ? Math.round(
                      ((pt.actualRevenueEur - pt.forecastBaselineEur) /
                        pt.forecastBaselineEur) *
                        100
                    )
                  : null;

                return (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 font-bold text-zinc-200">{pt.date}</td>
                    <td className="py-3 text-emerald-400 font-bold">
                      {pt.actualRevenueEur ? formatPrice(pt.actualRevenueEur, currency) : 'In Progress'}
                    </td>
                    <td className="py-3 text-indigo-300 font-semibold">
                      {formatPrice(Math.round(pt.forecastBaselineEur * multiplier), currency)}
                    </td>
                    <td className="py-3 text-zinc-500">
                      {formatPrice(Math.round(pt.forecastLower95Eur * multiplier), currency)}
                    </td>
                    <td className="py-3 text-zinc-400">
                      {formatPrice(Math.round(pt.forecastUpper95Eur * multiplier), currency)}
                    </td>
                    <td className="py-3 text-amber-400 font-bold">
                      {pt.seasonalFactor.toFixed(2)}x
                    </td>
                    <td className="py-3 text-right">
                      {variance !== null ? (
                        <span
                          className={`font-bold ${
                            variance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {variance >= 0 ? `+${variance}%` : `${variance}%`}
                        </span>
                      ) : (
                        <span className="text-zinc-600">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

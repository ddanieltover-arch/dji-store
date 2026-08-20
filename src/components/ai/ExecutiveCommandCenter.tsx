import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Percent,
  CreditCard,
  Globe2,
  Package,
  Boxes,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Filter,
  Eye,
  Layers,
  Crown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_EXECUTIVE_KPIS,
  INITIAL_LIVE_ACTIVITY_FEED,
  INITIAL_TOP_COUNTRIES,
  INITIAL_PAYMENT_BREAKDOWN,
  PREDICTIVE_REVENUE_MODELS
} from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';

export const ExecutiveCommandCenter: React.FC = () => {
  const { currency, addToast } = useStore();

  const [timeHorizon, setTimeHorizon] = useState<'today' | 'mtd' | 'ytd'>('today');
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState(true);
  const [feedItems, setFeedItems] = useState(INITIAL_LIVE_ACTIVITY_FEED);

  const kpis = INITIAL_EXECUTIVE_KPIS;
  const topCountries = INITIAL_TOP_COUNTRIES;
  const paymentBreakdown = INITIAL_PAYMENT_BREAKDOWN;
  const dailyForecast = PREDICTIVE_REVENUE_MODELS.daily;

  const handleSimulateNewEvent = () => {
    const newEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'ai_decision' as const,
      title: 'Autonomous WMS Allocation Optimized',
      description: 'Shifted order #DJI-EU-948201 fulfillment to Amsterdam (AMS-02) for 18h faster courier transit to Brussels.',
      severity: 'info' as const
    };
    setFeedItems([newEvent, ...feedItems.slice(0, 7)]);
    addToast({
      type: 'info',
      title: 'Live Telemetry Event Received',
      message: 'Autonomous WMS Allocation Optimized for Benelux routing.'
    });
  };

  return (
    <div className="space-y-6">
      {/* CEO COMMAND HEADER & REAL-TIME STATUS PULSE */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/40 border border-zinc-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                DJI Store EU • Executive C-Suite Command Center
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Autonomous Engine Online (91.4% Autonomous)
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Enterprise Commercial Operations & Real-Time Intelligence
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Unified real-time telemetry across Pan-European logistics hubs, predictive revenue curves, autonomous pricing micro-adjustments, and anti-fraud surveillance.
            </p>
          </div>

          {/* Quick Filter & Simulation Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center">
              {(['today', 'mtd', 'ytd'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setTimeHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                    timeHorizon === h
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimulateNewEvent}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pulse Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY HIGH-DENSITY KPI TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* REVENUE TILE */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>{timeHorizon === 'today' ? 'Revenue Today' : timeHorizon === 'mtd' ? 'Revenue MTD' : 'Revenue YTD'}</span>
            <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono">
            {timeHorizon === 'today'
              ? formatPrice(kpis.revenueTodayEur, currency)
              : timeHorizon === 'mtd'
              ? formatPrice(kpis.revenueMtdEur, currency)
              : formatPrice(kpis.revenueYtdEur, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{timeHorizon === 'today' ? kpis.revenueTodayChangePct : kpis.revenueMtdChangePct}% vs 7D Avg</span>
          </div>
        </div>

        {/* ORDERS & CONVERSION */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Orders & Conversion</span>
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl lg:text-3xl font-black text-white font-mono">
              {kpis.ordersTodayCount}
            </div>
            <div className="text-xs font-mono text-zinc-400">
              CR: <span className="text-emerald-400 font-bold">{kpis.conversionRatePct}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{kpis.conversionRateChangePct}% CR Uplift</span>
          </div>
        </div>

        {/* AVERAGE ORDER VALUE & MARGINS */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Average Order Value (AOV)</span>
            <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono">
            {formatPrice(kpis.averageOrderValueEur, currency)}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Gross: <strong className="text-zinc-200">{kpis.grossMarginPct}%</strong></span>
            <span>Net: <strong className="text-emerald-400">{kpis.netMarginPct}%</strong></span>
          </div>
        </div>

        {/* HEALTH & AUTONOMY */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Risk & AI Autonomy</span>
            <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono">
            {kpis.aiAutonomyRatePct}%
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Refunds: <strong className="text-zinc-200">{kpis.refundRatePct}%</strong></span>
            <span className="text-emerald-400 font-semibold">CB: {kpis.chargebackRatePct}%</span>
          </div>
        </div>
      </div>

      {/* MID SECTION: REVENUE INTRADAY VELOCITY & LIVE ACTIVITY PULSE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTRADAY HOURLY RUN-RATE */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Intraday Revenue Curve & AI Forecast Range (EUR)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time sales velocity vs. Gemini AI 95% confidence interval baseline
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Target Run-rate: €154,200/day
            </div>
          </div>

          {/* Forecast Time-series Bar/Line Visualizer */}
          <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 border-b border-zinc-800">
            {dailyForecast.points.map((pt, idx) => {
              const maxScale = 180000;
              const actualHeight = pt.actualRevenueEur
                ? Math.round((pt.actualRevenueEur / maxScale) * 100)
                : 0;
              const forecastHeight = Math.round((pt.forecastBaselineEur / maxScale) * 100);

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-32 relative">
                    {/* Forecast Baseline Ghost Bar */}
                    <div
                      style={{ height: `${forecastHeight}%` }}
                      className="w-1/2 bg-blue-500/20 border-t-2 border-blue-400 rounded-t-sm"
                      title={`AI Forecast: €${pt.forecastBaselineEur.toLocaleString()}`}
                    />
                    {/* Actual Revenue Bar */}
                    {pt.actualRevenueEur && (
                      <div
                        style={{ height: `${actualHeight}%` }}
                        className="w-1/2 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-sm shadow-sm"
                        title={`Actual Revenue: €${pt.actualRevenueEur.toLocaleString()}`}
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">{pt.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-4 pt-1 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded-xs" /> Actual Delivered Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500/20 border border-blue-400 rounded-xs" /> AI Forecast Range
              </span>
            </div>
            <span className="text-zinc-500">Confidence: 94.2%</span>
          </div>
        </div>

        {/* LIVE ACTIVITY FEED */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Live Autonomous Operations Feed
            </h2>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              Real-time
            </span>
          </div>

          <div className="divide-y divide-zinc-800/80 overflow-y-auto max-h-[300px] pr-1 space-y-2">
            {feedItems.map((item) => (
              <div key={item.id} className="pt-2.5 pb-2 text-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    {item.severity === 'critical' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    ) : item.severity === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono text-center">
            Stream connected to Kafka dji_ops_events_stream
          </div>
        </div>
      </div>

      {/* LOWER SECTION: TOP COUNTRIES & PAYMENT RAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP EUROPEAN COUNTRY PERFORMANCE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Pan-European Market Demand Breakdown
            </h2>
            <span className="text-xs text-zinc-400 font-mono">6 Core Hubs</span>
          </div>

          <div className="space-y-3">
            {topCountries.map((c) => (
              <div
                key={c.countryCode}
                className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      {c.countryName}
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        +{c.growthPct}%
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">Top SKU: {c.topProduct}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-100 font-mono">
                    {formatPrice(c.revenueEur, currency)}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    {c.orderCount.toLocaleString()} orders • AOV {formatPrice(c.aovEur, currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT METHOD CHANNELS & SETTLEMENT ECONOMICS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Direct Settlement Economics & Fee Optimization
            </h2>
            <span className="text-xs text-emerald-400 font-mono">
              Saved €839k+ in Gateway Fees
            </span>
          </div>

          <div className="space-y-3">
            {paymentBreakdown.map((pm, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">{pm.method}</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {formatPrice(pm.volumeEur, currency)} ({pm.percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pm.percentage}%` }}
                    className={`h-full ${
                      pm.channel === 'sepa'
                        ? 'bg-blue-500'
                        : pm.channel === 'crypto_usdt'
                        ? 'bg-emerald-500'
                        : pm.channel === 'crypto_btc'
                        ? 'bg-amber-500'
                        : 'bg-purple-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Avg Settlement: <strong>{pm.settlementTimeAvg}</strong></span>
                  <span>Failure Rate: <strong className="text-emerald-400">{pm.failureRatePct}%</strong></span>
                  <span>Fee Saved: <strong className="text-zinc-300">{formatPrice(pm.feeSavedVsCreditCardEur, currency)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Activity,
  Globe2,
  Gauge,
  Database,
  Search,
  Radio,
  ShieldCheck,
  BarChart3,
  Layers,
  Image,
  CreditCard,
  LineChart,
  Rocket,
  Wallet,
  FolderTree,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  CORE_WEB_VITAL_BUDGETS,
  EDGE_POPS,
  CACHE_LAYERS,
  POSTGRES_SCALE_PLAN,
  KAFKA_TOPIC_CONTRACTS,
  SLO_CATALOG,
  LOAD_PROFILES,
  MEDIA_PIPELINE,
  COST_FORECAST,
  NEXT_JS_PERFORMANCE_TREE,
  PHASE_12_VERIFICATION_MATRIX,
  INFRA_SIZING
} from '../../data/performanceReliabilityData';
import { cacheControlHeader } from '../../lib/performance/cacheTopology';
import { checkoutIdempotencyKey, resolveCheckoutAttempt } from '../../lib/performance/checkoutIdempotency';
import { errorBudgetBurnAlert, SYNTHETIC_PROBES } from '../../lib/performance/slo';

type RelTab =
  | 'overview'
  | 'edge'
  | 'storefront'
  | 'postgres'
  | 'search'
  | 'kafka'
  | 'sre'
  | 'load'
  | 'cache_media'
  | 'checkout'
  | 'observe_deploy'
  | 'cost_next'
  | 'verification';

export const ReliabilityEngineeringCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RelTab>('overview');
  const [canaryPct, setCanaryPct] = useState(5);
  const [failoverLog, setFailoverLog] = useState<string[]>([]);
  const [idempotencyDemo, setIdempotencyDemo] = useState<string>('');

  const runFailover = () => {
    setFailoverLog([
      '[T+0s] Probe FRA origin 3 consecutive 5xx — Argo Smart Routing demotes FRA.',
      '[T+8s] Cloudflare steering to Dublin Vercel origin; Redis replica promoted for sessions.',
      '[T+19s] Supabase replica eu-west-1 accepting reads; writes paused 4s then PITR catch-up.',
      '[T+27s] Healthchecks green. Availability SLO burn 0.02% of monthly budget.'
    ]);
  };

  const demoIdempotency = () => {
    const key = checkoutIdempotencyKey('cust_de_89128', 'cart_sha_9f83');
    const first = resolveCheckoutAttempt(null, key, key);
    const replay = resolveCheckoutAttempt('pi_3Nxyz', key, key);
    setIdempotencyDemo(`${key} → first=${first}; replay=${replay}`);
  };

  const tabs: { id: RelTab; label: string; icon: typeof Activity }[] = [
    { id: 'overview', label: 'SRE Overview', icon: Activity },
    { id: 'edge', label: 'Global Edge', icon: Globe2 },
    { id: 'storefront', label: 'CWV Budgets', icon: Gauge },
    { id: 'postgres', label: 'Postgres Scale', icon: Database },
    { id: 'search', label: 'Search P95', icon: Search },
    { id: 'kafka', label: 'Kafka Events', icon: Radio },
    { id: 'sre', label: 'SLI / SLO', icon: ShieldCheck },
    { id: 'load', label: 'Load & Capacity', icon: BarChart3 },
    { id: 'cache_media', label: 'Cache & Media', icon: Layers },
    { id: 'checkout', label: 'Checkout SRE', icon: CreditCard },
    { id: 'observe_deploy', label: 'Observe & Ship', icon: Rocket },
    { id: 'cost_next', label: 'Cost & Next.js', icon: Wallet },
    { id: 'verification', label: 'Phase 12 Matrix', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans pb-24">
      <div className="bg-[#0E1524] border-b border-cyan-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold tracking-wide">DJI EU Reliability & Performance Engineering</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PHASE 12 · 99.994%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Prime-Day scale · Shopify Plus reliability · Cloudflare Enterprise · Google SRE · Stripe idempotency
            </p>
          </div>
          <div className="flex gap-3 flex-wrap text-xs">
            <div className="bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800">
              LCP p75 <strong className="text-cyan-300">1.08s</strong>
            </div>
            <div className="bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800">
              API p95 <strong className="text-cyan-300">94ms</strong>
            </div>
            <div className="bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800">
              Search p95 <strong className="text-cyan-300">41ms</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0E1524]/90 border-b border-slate-800 px-4 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
                  on ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SLO_CATALOG.map((s) => (
              <div key={s.name} className="bg-[#0E1524] p-5 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase text-slate-500 font-bold">{s.name}</div>
                <div className="text-2xl font-black text-white mt-1">{s.current}</div>
                <div className="text-xs text-slate-400 mt-1">SLO {s.slo}</div>
                <div className="mt-3 h-1.5 bg-slate-800 rounded">
                  <div className="h-1.5 bg-cyan-400 rounded" style={{ width: `${s.errorBudgetRemainingPct}%` }} />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Error budget remaining {s.errorBudgetRemainingPct}%</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'edge' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Anycast Cloudflare → origin shield Frankfurt → Vercel FRA. Dublin is warm compute + DB failover. Smart Routing skips congested EU paths.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EDGE_POPS.map((p) => (
                <div key={p.id} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span className="font-bold">{p.city}</span>
                    <span className="text-[10px] text-cyan-300">{p.provider}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{p.role.replaceAll('_', ' ')}</div>
                  <div className="text-xs font-mono mt-2 text-cyan-200">
                    hit {(p.cacheHitRatio * 100).toFixed(0)}% · TTFB p95 {p.ttfbP95Ms}ms
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={runFailover}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate FRA → DUB failover
            </button>
            {failoverLog.length > 0 && (
              <div className="font-mono text-xs bg-black/40 p-4 rounded-xl border border-slate-800 space-y-1">
                {failoverLog.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'storefront' && (
          <div className="overflow-x-auto bg-[#0E1524] rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Surface</th>
                  <th className="p-3">LCP</th>
                  <th className="p-3">INP</th>
                  <th className="p-3">CLS</th>
                  <th className="p-3">TTFB</th>
                  <th className="p-3">Rendering</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {CORE_WEB_VITAL_BUDGETS.map((b) => (
                  <tr key={b.surface}>
                    <td className="p-3 font-bold uppercase text-white">{b.surface}</td>
                    <td className="p-3 text-cyan-300">{b.lcpMs}ms / {b.targetLcpMs}</td>
                    <td className="p-3 text-cyan-300">{b.inpMs}ms / {b.targetInpMs}</td>
                    <td className="p-3">{b.cls.toFixed(2)} / {b.targetCls.toFixed(2)}</td>
                    <td className="p-3">{b.ttfbMs}ms / {b.targetTtfbMs}</td>
                    <td className="p-3 text-slate-400 max-w-sm">{b.renderingStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'postgres' && (
          <div className="space-y-3">
            {POSTGRES_SCALE_PLAN.map((p) => (
              <div key={p.object} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between gap-2">
                  <span className="font-mono font-bold text-cyan-300">{p.object}</span>
                  <span className="text-xs">p95 {p.p95Ms}ms (target {p.targetP95Ms}ms)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{p.strategy}</p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">{p.indexOrPartition}</p>
              </div>
            ))}
            <div className="text-xs text-slate-400">
              Sizing: {INFRA_SIZING.supabase}. Migration: monthly partitions for orders starting 2026-01; concurrent CREATE INDEX.
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-[#0E1524] p-6 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <p>
              Omnibar hits Cloudflare KV (30s TTL) then Redis prefix index, then Postgres GIN. Synonyms from{' '}
              <code className="text-cyan-300">SEARCH_SYNONYMS</code> expanded before ranking. Filters use facet cache keyed by category+locale.
            </p>
            <p>Query plan: tsvector AND trigram fallback for typos (Mini/Mni). P95 41ms vs SLO 100ms.</p>
            <p>Invalidation: Kafka <code className="text-cyan-300">search.reindex</code> compacted topic, last-write-wins per SKU.</p>
          </div>
        )}

        {activeTab === 'kafka' && (
          <div className="overflow-x-auto bg-[#0E1524] rounded-xl border border-slate-800">
            <table className="w-full text-xs">
              <thead className="text-slate-500 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3 text-left">Topic</th>
                  <th className="p-3 text-left">Key</th>
                  <th className="p-3">Parts</th>
                  <th className="p-3 text-left">Retry / DLQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {KAFKA_TOPIC_CONTRACTS.map((t) => (
                  <tr key={t.topic}>
                    <td className="p-3 font-mono text-cyan-300">{t.topic}</td>
                    <td className="p-3 text-slate-400">{t.key}</td>
                    <td className="p-3">{t.partitions}</td>
                    <td className="p-3 text-slate-400">{t.retryPolicy} → {t.dlq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sre' && (
          <div className="space-y-4">
            {SLO_CATALOG.map((s) => (
              <div key={s.name} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="text-cyan-300 uppercase">{errorBudgetBurnAlert(s)}</span>
                </div>
                <p className="text-slate-400 mt-1">SLI: {s.sli}</p>
                <p className="text-slate-500 mt-1">Page if budget &lt;10% or SLO breached · ticket if &lt;25% · else none.</p>
              </div>
            ))}
            <p className="text-xs text-slate-400">
              Incidents: SEV1 pages CISO+SRE (5 min) · SEV2 ticket+Slack · customer comms via status.djii.eu.
            </p>
          </div>
        )}

        {activeTab === 'load' && (
          <div className="space-y-3">
            {LOAD_PROFILES.map((l) => (
              <div key={l.scenario} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-white">{l.scenario}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-slate-300">
                  <span>CU {l.concurrentUsers.toLocaleString()}</span>
                  <span>{l.rps} RPS</span>
                  <span>Checkout {l.checkoutSharePct}%</span>
                  <span>Edge offload {l.edgeOffloadPct}%</span>
                </div>
              </div>
            ))}
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <div>Vercel: {INFRA_SIZING.vercel}</div>
              <div>Redis: {INFRA_SIZING.redis}</div>
              <div>Kafka: {INFRA_SIZING.kafka}</div>
              <div>CF: {INFRA_SIZING.cloudflare}</div>
            </div>
          </div>
        )}

        {activeTab === 'cache_media' && (
          <div className="space-y-4">
            {CACHE_LAYERS.map((c) => (
              <div key={c.layer} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-white">{c.layer}</div>
                <div className="text-cyan-300 font-mono mt-1">{cacheControlHeader(c)}</div>
                <p className="text-slate-400 mt-1">{c.store} · hit {c.hitRatioPct}% · {c.invalidation}</p>
              </div>
            ))}
            <div className="grid md:grid-cols-2 gap-3">
              {MEDIA_PIPELINE.map((m) => (
                <div key={m.assetClass} className="bg-[#0E1524] p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <Image className="w-4 h-4 text-cyan-400" />
                    {m.assetClass}
                  </div>
                  <p className="text-slate-400 mt-1">{m.ingest} → {m.output}</p>
                  <p className="text-slate-500 mt-1">{m.maxBytes} · {m.cdnPath}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'checkout' && (
          <div className="bg-[#0E1524] p-6 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <p>
              Orders insert with unique <code className="text-cyan-300">idempotency_key</code>. Stripe PaymentIntent created once; webhooks are HMAC + timestamp skew ≤300s. Double-submit returns the same order (duplicate_replay).
            </p>
            <p>Target: bag → paid &lt; 2 minutes (current median 1m 12s). Outage rail: Adyen/SEPA Instant (Phase 11 BCP).</p>
            <button
              onClick={demoIdempotency}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
            >
              <Zap className="w-3.5 h-3.5 inline mr-1" />
              Run idempotency demo
            </button>
            {idempotencyDemo && <p className="font-mono text-cyan-200">{idempotencyDemo}</p>}
          </div>
        )}

        {activeTab === 'observe_deploy' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#0E1524] p-5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <LineChart className="w-4 h-4 text-cyan-400" />
                Observability
              </div>
              <p>Traces: OpenTelemetry → Grafana Tempo. Logs: Loki. Metrics: Prometheus/Mimir.</p>
              <p>RUM: web-vitals sampled 20% → Kafka analytics.rum → ClickHouse.</p>
              <p>Synthetics:</p>
              <ul className="list-disc list-inside text-slate-400">
                {SYNTHETIC_PROBES.map((p) => (
                  <li key={p.name}>
                    {p.name} every {p.intervalSec}s
                  </li>
                ))}
              </ul>
              <p>Alerts: LCP p75 &gt; 1.2s for 15m, API p95 &gt; 150ms, error budget burn 2% in 1h → page.</p>
            </div>
            <div className="bg-[#0E1524] p-5 rounded-xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <Rocket className="w-4 h-4 text-cyan-400" />
                Zero-downtime ship
              </div>
              <p>Blue-green Vercel promotion. Canary: {canaryPct}% traffic via Cloudflare split.</p>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={canaryPct}
                onChange={(e) => setCanaryPct(Number(e.target.value))}
                className="w-full"
              />
              <p>CAB: security gates green → 5% 15m → 25% → 100%. Feature flags kill autonomous pricing instantly. Rollback = previous immutable deployment + flag off.</p>
            </div>
          </div>
        )}

        {activeTab === 'cost_next' && (
          <div className="space-y-4">
            <div className="overflow-x-auto bg-[#0E1524] rounded-xl border border-slate-800">
              <table className="w-full text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3">€ / mo</th>
                    <th className="p-3 text-left">Optimization</th>
                    <th className="p-3">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {COST_FORECAST.map((c) => (
                    <tr key={c.category}>
                      <td className="p-3 text-white">{c.category}</td>
                      <td className="p-3 font-mono">{c.monthlyEur.toLocaleString()}</td>
                      <td className="p-3 text-slate-400">{c.optimization}</td>
                      <td className="p-3 text-cyan-300">{c.savingsPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[#0E1524] p-5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 font-bold mb-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                Next.js 15 performance tree (target App Router)
              </div>
              <ul className="text-xs font-mono text-slate-400 space-y-1">
                {NEXT_JS_PERFORMANCE_TREE.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 mt-3">
                Prototype remains Vite SPA; directives (`force-cache`, `revalidateTag`, streaming RSC) are the production Next.js contract.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="overflow-x-auto bg-[#0E1524] rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Subsystem</th>
                  <th className="p-3">Requirement</th>
                  <th className="p-3">Evidence</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PHASE_12_VERIFICATION_MATRIX.map((row) => (
                  <tr key={row.subsystem}>
                    <td className="p-3 font-bold text-white">{row.subsystem}</td>
                    <td className="p-3 text-slate-300">{row.requirement}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{row.evidence}</td>
                    <td className="p-3 text-cyan-300 font-bold">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

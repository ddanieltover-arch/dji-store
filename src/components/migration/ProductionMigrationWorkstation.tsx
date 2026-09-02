import React, { useMemo, useState } from 'react';
import { Rocket, CheckCircle2 } from 'lucide-react';
import { runWave12Migration, WAVE12_NEXTJS_INTEGRATION } from '../../lib/migration/wave12Production';
import { WAVE12_ROLLOUT } from '../../data/wave12ProductionData';

type Tab =
  | 'inventory'
  | 'routes'
  | 'data'
  | 'env'
  | 'supabase'
  | 'cloudflare'
  | 'pwa'
  | 'notifications'
  | 'tests'
  | 'performance'
  | 'security'
  | 'golive';

export const ProductionMigrationWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('inventory');
  const bundle = useMemo(() => runWave12Migration(), []);

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-lime-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-lime-400" />
              <h1 className="text-lg font-bold">Production Migration</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-500/40">
                WAVE 12 · NEXT.JS 15 · {WAVE12_NEXTJS_INTEGRATION.root}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{WAVE12_NEXTJS_INTEGRATION.note}</p>
          </div>
          <div className="text-xs font-mono">
            {bundle.certification.certified ? 'CERTIFIED' : 'PENDING'} · defects{' '}
            {bundle.certification.criticalDefects}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['inventory', 'Migration Inventory'],
            ['routes', 'Route Coverage'],
            ['data', 'Data Connectivity'],
            ['env', 'Environment Status'],
            ['supabase', 'Supabase Status'],
            ['cloudflare', 'Cloudflare Status'],
            ['pwa', 'PWA Status'],
            ['notifications', 'Notifications'],
            ['tests', 'Test Status'],
            ['performance', 'Performance'],
            ['security', 'Security'],
            ['golive', 'Go-Live Readiness']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-lime-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'inventory' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl p-4 border ${
                bundle.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {bundle.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {bundle.certification.certified
                  ? 'DJI STORE EU — WAVE 12 PRODUCTION NEXT.JS MIGRATION & BACKEND ACTIVATION CERTIFICATION'
                  : 'WAVE 12 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 mt-2">{bundle.certification.certificationNote}</p>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              {(Object.entries(bundle.dispositions) as [string, number][]).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-lime-300">{v}</div>
                </div>
              ))}
            </div>
            {bundle.inventory.map((i) => (
              <div key={i.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                <span className="font-bold text-lime-300">{i.disposition}</span> · {i.vitePath} → {i.nextPath}
                <div className="text-slate-500">{i.notes}</div>
              </div>
            ))}
            <div>
              {WAVE12_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'routes' && (
          <div className="space-y-2">
            <p>Coverage {bundle.gates.productionRouteCoveragePct}%</p>
            {bundle.routes.map((r) => (
              <div key={r.path} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                {r.implemented ? '✓' : '✗'} {r.path} · {r.dataSource}
                {r.localeAware ? ' · locale' : ''}
              </div>
            ))}
          </div>
        )}

        {tab === 'data' && (
          <div className="space-y-2">
            {bundle.reconciliation.map((r) => (
              <div key={r.entity} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                {r.entity}: proto {r.prototypeCount} · prod {r.productionContractCount} · matched {r.matched} ·{' '}
                {r.ok ? 'OK' : `gaps ${r.gaps.join(',')}`}
              </div>
            ))}
          </div>
        )}

        {tab === 'env' && (
          <div className="space-y-2">
            {bundle.envVars.map((e) => (
              <div key={e.key} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                <span className="font-mono">{e.key}</span> · browser {String(e.browserExposed)} · prod required{' '}
                {String(e.requiredInProduction)}
                <div className="text-slate-500">{e.description}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'supabase' && (
          <div className="space-y-2">
            {bundle.connectivity.map((c) => (
              <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                {c.system}: <span className="text-lime-300">{c.status}</span> — {c.evidence}
              </div>
            ))}
            <p className="text-slate-500">
              Live connected: {String(bundle.certification.liveSupabaseConnected)} · mock catalog in production:{' '}
              {bundle.certification.mockCatalogInProduction}
            </p>
          </div>
        )}

        {tab === 'cloudflare' && (
          <p className="text-slate-300">
            Cache tags via productCacheTags + Catalog-Control on /api/catalog. Purge on approved product publish
            (catalog_diffs). Immutable media; SWR for PLP/PDP.
          </p>
        )}

        {tab === 'pwa' && (
          <p className="text-slate-300">
            app/manifest.ts + offline page migrated from Wave 11. Offline never exposes live stock/price/payment/order.
          </p>
        )}

        {tab === 'notifications' && (
          <p className="text-slate-300">
            /api/push/subscribe stores endpoint hashes server-side. GDPR prefs from Wave 11 enforced.
          </p>
        )}

        {tab === 'tests' && (
          <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
            Automated tests {bundle.gates.automatedTestsPct}% · vitest wave12Production.test.ts
          </div>
        )}

        {tab === 'performance' && (
          <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
            Phase 12 regression: {bundle.gates.performanceRegression} · LCP&lt;1.2s INP&lt;75ms CLS=0 TTFB&lt;100ms
            API P95&lt;150ms
          </div>
        )}

        {tab === 'security' && (
          <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 space-y-1">
            <div>Security regression: {bundle.gates.securityRegression}</div>
            <div>CSP / HSTS headers in next.config.ts · RLS policies · service role server-only</div>
          </div>
        )}

        {tab === 'golive' && (
          <div className="space-y-2">
            {(
              [
                ['Routes', bundle.gates.productionRouteCoveragePct === 100],
                ['Catalog', bundle.gates.realCatalogIntegrationPct === 100],
                ['Inventory', bundle.gates.realInventoryIntegrationPct === 100],
                ['Commerce', bundle.gates.commerceIntegrationPct === 100],
                ['PIM', bundle.gates.pimIntegrationPct === 100],
                ['Auth', bundle.gates.authenticationIntegrationPct === 100],
                ['Security', bundle.gates.securityRegression === 'Pass'],
                ['Performance', bundle.gates.performanceRegression === 'Pass'],
                ['Tests', bundle.gates.automatedTestsPct === 100],
                ['Critical defects = 0', bundle.certification.criticalDefects === 0],
                ['Rollback (Vite retained)', bundle.certification.rollbackPathVerified]
              ] as const
            ).map(([k, ok]) => (
              <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                {ok ? '✓' : '✗'} {k}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

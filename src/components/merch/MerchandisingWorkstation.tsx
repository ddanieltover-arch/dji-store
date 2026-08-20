import React, { useMemo, useState } from 'react';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE5_NEXTJS_INTEGRATION, runWave5Merchandising } from '../../lib/merch/wave5Merchandising';
import { WAVE5_ROLLOUT } from '../../data/wave5MerchandisingData';

type Tab =
  | 'overview'
  | 'ranking'
  | 'pricing'
  | 'promotions'
  | 'bundles'
  | 'experiments'
  | 'ai'
  | 'performance'
  | 'approvals';

export const MerchandisingWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const merch = useMemo(() => runWave5Merchandising(DJI_PRODUCTS), []);
  const nameOf = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-rose-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-rose-400" />
              <h1 className="text-lg font-bold">Merchandising · Pricing · Conversion</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                WAVE 5 COMMERCIAL LAYER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Optimizes how DJI_PRODUCTS is ranked and promoted — prices still flow through catalog_diffs. Canonical source store.dji.com.
            </p>
          </div>
          <div className="text-xs font-mono flex gap-3">
            <span>Coverage {merch.certification.merchandisingCoveragePct}%</span>
            <span>Conflicts {merch.certification.pricingConflicts}</span>
            <span>{merch.certification.certified ? 'CERTIFIED' : 'PENDING'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Overview'],
            ['ranking', 'Product Ranking'],
            ['pricing', 'Pricing'],
            ['promotions', 'Promotions'],
            ['bundles', 'Bundles'],
            ['experiments', 'Experiments'],
            ['ai', 'AI Recommendations'],
            ['performance', 'Performance'],
            ['approvals', 'Approvals']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-rose-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl p-4 border ${
                merch.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {merch.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {merch.certification.certified
                  ? 'DJI STORE EU — WAVE 5 MERCHANDISING & CONVERSION CERTIFIED'
                  : 'WAVE 5 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 mt-1">{WAVE5_NEXTJS_INTEGRATION.note}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Revenue €', merch.kpis.revenueEur],
                  ['Conversion %', merch.kpis.conversionPct],
                  ['AOV €', merch.kpis.aovEur],
                  ['Gross margin %', merch.kpis.grossMarginPct],
                  ['Bundle attach %', merch.kpis.bundleAttachmentPct],
                  ['Reco CVR %', merch.kpis.recommendationConversionPct],
                  ['Inventory eff %', merch.kpis.inventoryEfficiencyPct],
                  ['Promo lift %', merch.kpis.promotionLiftPct]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-rose-300">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">Homepage slots</div>
              <p>Featured: {merch.homepage.featured.slice(0, 4).map(nameOf).join(' · ')}</p>
              <p>New: {merch.homepage.newReleases.slice(0, 4).map(nameOf).join(' · ')}</p>
              <p>AI ranked: {merch.homepage.aiRanked.slice(0, 4).map(nameOf).join(' · ')}</p>
            </div>
            <div>
              {WAVE5_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'ranking' &&
          merch.rankings.slice(0, 15).map((r, i) => (
            <div key={r.productId} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
              <div className="font-bold">
                #{i + 1} {nameOf(r.productId)} — score {r.score}
              </div>
              <p className="text-slate-400">
                {r.reasons
                  .slice()
                  .sort((a, b) => b.contribution - a.contribution)
                  .slice(0, 4)
                  .map((x) => x.note)
                  .join(' · ')}
              </p>
            </div>
          ))}

        {tab === 'pricing' &&
          merch.priceProposals.map((p) => (
            <div key={p.productId} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between">
              <span>
                {nameOf(p.productId)} €{p.basePriceEur} → €{p.salePriceEur} ({p.deltaPct}%)
              </span>
              <span className={p.decision === 'block' ? 'text-rose-400' : p.decision === 'review-required' ? 'text-amber-300' : 'text-emerald-400'}>
                {p.decision} — {p.reason}
              </span>
            </div>
          ))}

        {tab === 'promotions' && (
          <div className="space-y-2">
            {merch.promotions.map((p) => (
              <div key={p.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between">
                <span>
                  {p.name} · {p.type} · {p.value}
                  {p.couponCode ? ` · ${p.couponCode}` : ''}
                </span>
                <span>{p.active ? 'active' : 'off'}</span>
              </div>
            ))}
            <p className="text-emerald-400">Conflicts: {merch.conflicts.length}</p>
          </div>
        )}

        {tab === 'bundles' &&
          merch.bundles.slice(0, 12).map((b) => (
            <p key={b.id}>
              {b.title} · {b.kind} · −€{b.discountEur} · attach {b.attachmentScore}
            </p>
          ))}

        {tab === 'experiments' &&
          merch.experiments.map((e) => (
            <div key={e.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
              <div className="font-bold">
                {e.id} {e.name} ({e.status})
              </div>
              <p>
                {e.variants.map((v) => `${v.id}:${v.weight}`).join(' / ')} · rollback {e.rollbackVariantId} · metric{' '}
                {e.metric}
              </p>
            </div>
          ))}

        {tab === 'ai' &&
          merch.aiRecommendations.map((r) => (
            <div key={r.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="font-bold">{r.question}</div>
              <p className="text-slate-300">{r.answer}</p>
              <p className="text-slate-500">
                confidence {r.confidence} · {r.proposedAction}
                {r.requiresApproval ? ' · APPROVAL REQUIRED' : ''}
              </p>
            </div>
          ))}

        {tab === 'performance' && (
          <div className="space-y-2">
            {merch.kpis.categoryPerformance.map((c) => (
              <p key={c.category}>
                {c.category}: €{c.revenueEur} · CVR {c.conversionPct}%
              </p>
            ))}
            <p>Velocity index {merch.kpis.productVelocity}</p>
          </div>
        )}

        {tab === 'approvals' && (
          <div className="space-y-2">
            {merch.priceProposals
              .filter((p) => p.decision !== 'auto-approve')
              .map((p) => (
                <p key={p.productId} className="text-amber-200">
                  PRICE {nameOf(p.productId)} → catalog_diffs · {p.decision}
                </p>
              ))}
            {merch.aiRecommendations
              .filter((r) => r.requiresApproval)
              .map((r) => (
                <p key={r.id} className="text-amber-200">
                  AI {r.id} · {r.proposedAction}
                </p>
              ))}
            <p className="text-emerald-400">
              High-risk approval coverage {merch.certification.highRiskApprovalCoveragePct}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

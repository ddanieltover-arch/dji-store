import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2 } from 'lucide-react';
import { runWave8Enterprise, WAVE8_NEXTJS_INTEGRATION, preferDepotForLocation } from '../../lib/enterprise/wave8Enterprise';
import { WAVE8_APPROVAL_THRESHOLDS, WAVE8_PIPELINE_STAGES, WAVE8_ROLLOUT } from '../../data/wave8EnterpriseData';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_CUSTOMERS } from '../../data/crmData';

type Tab =
  | 'accounts'
  | 'opportunities'
  | 'quotes'
  | 'orders'
  | 'pricing'
  | 'contracts'
  | 'contacts'
  | 'tasks'
  | 'activity'
  | 'pipeline';

export const EnterpriseSalesWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('accounts');
  const bundle = useMemo(() => runWave8Enterprise(), []);
  const crmName = (id: string) => {
    const c = INITIAL_CUSTOMERS.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : id;
  };
  const productName = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-sky-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="w-5 h-5 text-sky-400" />
              <h1 className="text-lg font-bold">Enterprise Sales</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                WAVE 8 · EXTENDS PHASE 8 B2B
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Organizations, quotes, fleet builder, VIES — CRM/catalog/inventory unchanged.{' '}
              {WAVE8_NEXTJS_INTEGRATION.note}
            </p>
          </div>
          <div className="text-xs font-mono">
            {bundle.certification.certified ? 'CERTIFIED' : 'PENDING'} · unauthorized{' '}
            {bundle.certification.unauthorizedAccessAttempts}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['accounts', 'Accounts'],
            ['opportunities', 'Opportunities'],
            ['quotes', 'Quotes'],
            ['orders', 'Orders'],
            ['pricing', 'Pricing'],
            ['contracts', 'Contracts'],
            ['contacts', 'Contacts'],
            ['tasks', 'Tasks'],
            ['activity', 'Activity'],
            ['pipeline', 'Pipeline']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-sky-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'accounts' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl p-4 border ${
                bundle.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {bundle.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {bundle.certification.certified
                  ? 'DJI STORE EU — WAVE 8 B2B & ENTERPRISE COMMERCE CERTIFICATION'
                  : 'WAVE 8 NOT CERTIFIED'}
              </div>
              <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 font-mono text-[10px]">
                <span>Isolation {bundle.certification.organizationIsolationPct}%</span>
                <span>Pricing {bundle.certification.pricingAccuracyPct}%</span>
                <span>VAT {bundle.certification.vatValidationIntegrityPct}%</span>
                <span>Quotes {bundle.certification.quoteCalculationAccuracyPct}%</span>
                <span>Inventory {bundle.certification.inventoryValidationPct}%</span>
                <span>Approvals {bundle.certification.approvalCoveragePct}%</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['B2B revenue', `€${bundle.analytics.b2bRevenueEur.toLocaleString()}`],
                  ['Pipeline', `€${Math.round(bundle.analytics.pipelineValueEur).toLocaleString()}`],
                  ['Quote conv.', `${bundle.analytics.quoteConversionPct}%`],
                  ['ACV', `€${bundle.analytics.averageContractValueEur.toLocaleString()}`]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
            {bundle.organizations.map((o) => (
              <div key={o.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4 space-y-1">
                <div className="font-bold text-sm">{o.companyName}</div>
                <div className="text-slate-400">
                  VAT {o.vatId} · {o.pricingTier} · AM {o.accountManager} · CRM {crmName(o.crmCustomerId)}
                </div>
                <div className="text-slate-500">
                  Locations:{' '}
                  {o.shippingLocations
                    .map((l) => `${l.label}→${l.preferredDepotCode || preferDepotForLocation(l.countryCode)}`)
                    .join(' · ')}
                </div>
              </div>
            ))}
            <div>
              <div className="font-bold mb-2">AI enterprise sales assistant</div>
              {bundle.ai.map((a) => (
                <div key={a.id} className="border border-slate-800 rounded-lg p-3 mb-2">
                  <div className="font-semibold">{a.question}</div>
                  <p className="text-slate-400 mt-1">{a.answer}</p>
                  <p className="text-slate-500 mt-1">
                    sources: {a.dataSources.join(', ')} · conf {(a.confidence * 100).toFixed(0)}% · action:{' '}
                    {a.proposedAction}
                    {a.requiresApproval ? ' · approval required' : ''}
                  </p>
                </div>
              ))}
            </div>
            <div>
              {WAVE8_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'opportunities' && (
          <div className="space-y-2">
            {bundle.quotes.map((q) => (
              <div key={q.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">
                  {q.quoteNumber} · €{q.totalEur.toLocaleString()} · {q.workflowStatus}
                </div>
                <div className="text-slate-400">
                  Org {q.organizationId} · approval {q.approvalLevelRequired} · valid {q.validUntil.slice(0, 10)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'quotes' && (
          <div className="space-y-3">
            {bundle.quotes.map((q) => (
              <div key={q.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold text-sm">{q.quoteNumber}</div>
                <div className="text-slate-400 mt-1">
                  Net €{q.subtotalNetEur} · VAT €{q.vatEur} · Ship €{q.shippingEur} · Total €{q.totalEur}
                </div>
                <ul className="mt-2 space-y-1 text-slate-500">
                  {q.items.map((i) => (
                    <li key={`${q.id}-${i.productId}`}>
                      {productName(i.productId)} ×{i.quantity} @ €{i.unitNetEur}{' '}
                      {i.inventoryOk ? '✓ stock' : `⚠ need ${i.quantity}/${i.availableUnits}`}
                    </li>
                  ))}
                </ul>
                {q.approvals.length > 0 && (
                  <div className="mt-2">
                    Approvals:{' '}
                    {q.approvals.map((a) => `${a.role}:${a.status}`).join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-2">
            {bundle.purchaseOrders.map((po) => (
              <div key={po.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{po.customerPoNumber}</div>
                <div className="text-slate-400">
                  {po.status} · quote {po.quoteId} · org {po.organizationId}
                </div>
              </div>
            ))}
            <p className="text-slate-500">Conversion creates OMS drafts — no second order system.</p>
          </div>
        )}

        {tab === 'pricing' && (
          <div className="space-y-3">
            <p>
              Layers: BASE → CUSTOMER TIER → CONTRACT → VOLUME → APPROVED PROMOTION → VAT. Thresholds: manager ≥€
              {WAVE8_APPROVAL_THRESHOLDS.managerEur.toLocaleString()}, finance+exec ≥€
              {WAVE8_APPROVAL_THRESHOLDS.financeExecutiveEur.toLocaleString()}.
            </p>
            <div className="grid sm:grid-cols-4 gap-2">
              {['standard 1–4', 'Tier 1 5–9 (−5%)', 'Tier 2 10–24 (−10%)', 'Enterprise 25+ (−15%)'].map((t) => (
                <div key={t} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                  {t}
                </div>
              ))}
            </div>
            <p className="text-slate-500">High-risk deltas route through existing catalog_diffs / proposePriceChange.</p>
          </div>
        )}

        {tab === 'contracts' && (
          <div className="space-y-2">
            {bundle.organizations.map((o) => (
              <div key={o.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{o.legalEntity}</div>
                <div className="text-slate-400">
                  Tier {o.pricingTier} · contract −{o.contractDiscountPct}% · reg {o.registrationNumber}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="space-y-2">
            {bundle.organizations.map((o) => (
              <div key={o.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{o.companyName}</div>
                <div>Primary {o.primaryContact}</div>
                <div>Finance {o.financeContact}</div>
                <div>Procurement {o.procurementContact}</div>
              </div>
            ))}
            <div>
              Memberships:{' '}
              {bundle.memberships.map((m) => `${m.userId}:${m.role}`).join(' · ')}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>Complete finance review for PO-KELLER-2026-088</li>
            <li>Issue fleet quote after inventory warnings cleared</li>
            <li>Re-validate VIES quarterly for reverse-charge accounts</li>
          </ul>
        )}

        {tab === 'activity' && (
          <div className="space-y-2">
            {bundle.documents.map((d) => (
              <div key={d.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                {d.type} · {d.title} · {d.createdAt.slice(0, 10)}
              </div>
            ))}
            <div className="border border-slate-800 rounded-xl p-3">
              Fleet sample: {bundle.fleetSample.equipmentCount} units · €
              {bundle.fleetSample.quote.totalEur.toLocaleString()}
              {bundle.fleetSample.inventoryWarnings.length
                ? ` · warnings: ${bundle.fleetSample.inventoryWarnings.join('; ')}`
                : ' · inventory OK'}
            </div>
          </div>
        )}

        {tab === 'pipeline' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {WAVE8_PIPELINE_STAGES.map((s) => (
                <span key={s} className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                  {s}
                </span>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['AOV', `€${bundle.analytics.averageOrderValueEur}`],
                  ['Vol disc avg', `${bundle.analytics.volumeDiscountPctAvg}%`],
                  ['Sales cycle', `${bundle.analytics.salesCycleDays}d`],
                  ['Repeat', `${bundle.analytics.repeatEnterprisePct}%`]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

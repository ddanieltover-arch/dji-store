import React, { useMemo, useState } from 'react';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { runWave9Service, WAVE9_NEXTJS_INTEGRATION } from '../../lib/service/wave9Service';
import { WAVE9_ROLLOUT, WAVE9_SLA_HOURS } from '../../data/wave9ServiceData';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_CUSTOMERS } from '../../data/crmData';

type Tab =
  | 'open'
  | 'warranty'
  | 'rma'
  | 'repair'
  | 'inspection'
  | 'replacement'
  | 'parts'
  | 'sla'
  | 'completed';

export const ServiceCenterWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('open');
  const bundle = useMemo(() => runWave9Service(), []);
  const nameOf = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;
  const cust = (id: string) => {
    const c = INITIAL_CUSTOMERS.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : id;
  };

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-amber-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold">Service Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                WAVE 9 · EXTENDS PHASE 8 WARRANTY / RMA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ownership, tickets, RMA, parts on FRA/AMS/CDG — no second CRM/catalog.{' '}
              {WAVE9_NEXTJS_INTEGRATION.note}
            </p>
          </div>
          <div className="text-xs font-mono">
            {bundle.certification.certified ? 'CERTIFIED' : 'PENDING'} · unauthorized{' '}
            {bundle.certification.unauthorizedServiceDataAccess}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['open', 'Open Cases'],
            ['warranty', 'Warranty'],
            ['rma', 'RMA'],
            ['repair', 'Repair Queue'],
            ['inspection', 'Inspection'],
            ['replacement', 'Replacement'],
            ['parts', 'Parts'],
            ['sla', 'SLA'],
            ['completed', 'Completed Cases']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'open' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl p-4 border ${
                bundle.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {bundle.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {bundle.certification.certified
                  ? 'DJI STORE EU — WAVE 9 WARRANTY, RMA, TECHNICAL SUPPORT, REPAIR & PRODUCT OWNERSHIP INTELLIGENCE CERTIFICATION'
                  : 'WAVE 9 NOT CERTIFIED'}
              </div>
              <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 font-mono text-[10px]">
                <span>Ownership {bundle.certification.ownershipAccuracyPct}%</span>
                <span>Warranty {bundle.certification.warrantyCalculationAccuracyPct}%</span>
                <span>RMA {bundle.certification.rmaStateIntegrityPct}%</span>
                <span>Parts {bundle.certification.inventoryPartConsistencyPct}%</span>
                <span>SLA {bundle.certification.supportSlaTrackingAccuracyPct}%</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Open tickets', bundle.analytics.openTickets],
                  ['Repair cases', bundle.repairCases.length],
                  ['Ownership', bundle.ownership.length],
                  ['CSAT', bundle.analytics.customerSatisfaction]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-amber-300">{v}</div>
                </div>
              ))}
            </div>
            {bundle.tickets
              .filter((t) => !['resolved', 'closed'].includes(t.status))
              .map((t) => (
                <div key={t.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="font-bold">
                    {t.ticketNumber} · {t.priority} · {t.status}
                  </div>
                  <div className="text-slate-400">
                    {cust(t.customerId)} · {t.productId ? nameOf(t.productId) : '—'} · {t.serialNumber ?? '—'} · SLA{' '}
                    {t.firstResponseDueAt.slice(0, 16)}
                  </div>
                  <div className="text-slate-500 mt-1">{t.subject}</div>
                </div>
              ))}
            <div>
              <div className="font-bold mb-2">AI support assistant</div>
              {bundle.ai.map((a) => (
                <div key={a.id} className="border border-slate-800 rounded-lg p-3 mb-2">
                  <div className="font-semibold">{a.question}</div>
                  <p className="text-slate-400 mt-1">{a.answer}</p>
                  <p className="text-slate-500 mt-1">
                    sources: {a.sourceDocuments.join(', ')} · conf {(a.confidence * 100).toFixed(0)}% ·{' '}
                    {a.recommendedAction}
                    {a.escalationRequired ? ' · escalate' : ''} · human approval for high-risk
                  </p>
                </div>
              ))}
            </div>
            <div>
              {WAVE9_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'warranty' && (
          <div className="space-y-2">
            {bundle.ownership.map((o) => {
              const care = bundle.careViews.find((c) => c.plan.aircraftSerial === o.serialNumber);
              return (
                <div key={o.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="font-bold">
                    {nameOf(o.productId)} · {o.serialNumber.slice(0, 4)}…{o.serialNumber.slice(-3)}
                  </div>
                  <div className="text-slate-400">
                    Warranty {o.warrantyStart} → {o.warrantyEnd} · status {o.status}
                    {care ? ` · Care ${care.coverageType} (${care.remainingClaims} claims)` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'rma' && (
          <div className="space-y-2">
            {bundle.repairCases.map((c) => (
              <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">
                  {c.caseNumber} · {c.category} · {c.status}
                </div>
                <div className="text-slate-400">
                  {cust(c.customerId)} · {nameOf(c.productId)} · {c.serialNumber} · warranty{' '}
                  {c.warrantyEval.status} · {c.depotCode} · priority {c.priority}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'repair' && (
          <div className="space-y-2">
            {bundle.repairCases
              .filter((c) => ['repair', 'requested', 'eligibility_review', 'approved'].includes(c.status))
              .map((c) => (
                <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {c.caseNumber} · {c.status} · SLA {c.slaDueAt.slice(0, 16)}
                </div>
              ))}
          </div>
        )}

        {tab === 'inspection' && (
          <div className="space-y-2">
            {bundle.repairCases
              .filter((c) => c.status === 'inspection' || c.status === 'received')
              .map((c) => (
                <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {c.caseNumber} · {c.status}
                </div>
              ))}
            {!bundle.repairCases.some((c) => c.status === 'inspection' || c.status === 'received') && (
              <p className="text-slate-500">No cases currently in inspection.</p>
            )}
          </div>
        )}

        {tab === 'replacement' && (
          <div className="space-y-2">
            {bundle.repairCases
              .filter((c) => c.category.includes('replacement') || c.status === 'replacement')
              .map((c) => (
                <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {c.caseNumber} · {c.category} · {c.status}
                </div>
              ))}
          </div>
        )}

        {tab === 'parts' && (
          <div className="space-y-2">
            {bundle.parts.slice(0, 20).map((p) => (
              <div key={p.partSku} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{p.partSku}</div>
                <div className="text-slate-400">
                  {nameOf(p.productId)} · avail {p.quantityAvailable} · reserved {p.reserved} · incoming{' '}
                  {p.incoming} · {p.warehouseCode}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sla' && (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-4 gap-2">
              {(Object.entries(WAVE9_SLA_HOURS) as [string, number][]).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                  {k}: &lt; {v}h
                </div>
              ))}
            </div>
            <p>
              Avg first response {bundle.analytics.firstResponseHoursAvg}h · resolution{' '}
              {bundle.analytics.resolutionHoursAvg}h · RMA rate {bundle.analytics.rmaRatePct}%
            </p>
            <div>
              <div className="font-bold mb-2">Quality signals (PIM feed — no auto spec changes)</div>
              {bundle.qualitySignals.map((s, i) => (
                <p key={`${s.productId}-${s.signal}-${i}`} className="text-slate-400">
                  {nameOf(s.productId)} · {s.signal} · {s.severity} — {s.evidence}
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'completed' && (
          <div className="space-y-2">
            {bundle.repairCases
              .filter((c) => c.status === 'completed' || c.status === 'rejected')
              .map((c) => (
                <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {c.caseNumber} · {c.status}
                </div>
              ))}
            {bundle.tickets
              .filter((t) => t.status === 'resolved' || t.status === 'closed')
              .map((t) => (
                <div key={t.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {t.ticketNumber} · {t.status} · {t.subject}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

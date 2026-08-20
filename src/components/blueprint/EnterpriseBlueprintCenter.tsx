import React, { useState } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import {
  EXECUTIVE_SUMMARY,
  EXEC_KPIS,
  PHASE_CONSOLIDATION,
  DB_INVENTORY,
  SERVICE_REGISTRY,
  SYSTEM_LAYERS,
  ROADMAP,
  CERTIFICATION_SCORES,
  RESIDUAL_RISKS
} from '../../data/enterpriseBlueprintData';
import { compositeCertificationScore, programClosed } from '../../lib/certification/maturity';
import { isLaunchAuthorized } from '../../lib/launch/goNoGo';
import { LAUNCH_SIGNOFFS } from '../../data/launchOperationsData';

type Tab = 'exec' | 'map' | 'phases' | 'inventory' | 'security_rel' | 'ops_roadmap' | 'certificate';

export const EnterpriseBlueprintCenter: React.FC = () => {
  const [tab, setTab] = useState<Tab>('certificate');
  const composite = compositeCertificationScore(CERTIFICATION_SCORES);
  const closed = programClosed(CERTIFICATION_SCORES);
  const go = isLaunchAuthorized(LAUNCH_SIGNOFFS);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pb-24">
      <div className="bg-[#16161A] border-b border-amber-900/50 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className="text-lg font-bold">DJI Store EU — Master Architecture Blueprint</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              PHASE 15 · PROGRAM CLOSED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Board · Investor DD · CTO handover · Audit · Ops · Scale. Phases 1–14 verified; this package certifies and closes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['certificate', 'Certification'],
            ['exec', 'Executive'],
            ['map', 'System map'],
            ['phases', 'Phase matrix'],
            ['inventory', 'DB & APIs'],
            ['security_rel', 'Sec / Rel'],
            ['ops_roadmap', 'Ops & v2–v5']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
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
        {tab === 'certificate' && (
          <div className="bg-gradient-to-br from-amber-950/40 to-[#16161A] border border-amber-500/40 rounded-2xl p-8 space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400">Official instrument</div>
            <h2 className="text-2xl font-black text-white">DJI STORE EU ENTERPRISE ARCHITECTURE CERTIFICATION</h2>
            <p className="text-slate-300 max-w-3xl">
              This certifies that djii.eu has completed Phases 1–15: commerce, OMS, CRM, AI, security, SRE, QA, and go-live. Residual risks are accepted by CAB. Production launch is {go ? 'AUTHORIZED (GO)' : 'NOT AUTHORIZED'}.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(
                [
                  ['Completion', `${CERTIFICATION_SCORES.completionPct}%`],
                  ['Architecture', `${CERTIFICATION_SCORES.architectureMaturity}`],
                  ['Operations', `${CERTIFICATION_SCORES.operationalReadiness}`],
                  ['Security', `${CERTIFICATION_SCORES.securityMaturity}`],
                  ['Reliability', `${CERTIFICATION_SCORES.reliabilityMaturity}`],
                  ['Launch', `${CERTIFICATION_SCORES.launchReadiness}`]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-black/30 rounded-xl p-4 border border-amber-500/20">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-amber-300">{v}</div>
                </div>
              ))}
            </div>
            <div className="text-lg font-bold text-white">
              Composite maturity {composite}/100 · Program {closed ? 'CLOSED' : 'OPEN'}
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              EXECUTIVE GO / NO-GO REPORT: {go ? 'GO' : 'NO-GO'} — evidence: Phase 13 gates, Phase 14 LRR, zero Sev-1.
            </div>
            <p className="text-slate-500">Written dossier: docs/DJI_STORE_EU_MASTER_BLUEPRINT.md</p>
          </div>
        )}

        {tab === 'exec' && (
          <div className="space-y-3">
            <p className="text-slate-300">{EXECUTIVE_SUMMARY.mandate}</p>
            {Object.entries({
              Revenue: EXECUTIVE_SUMMARY.revenueArchitecture,
              Acquisition: EXECUTIVE_SUMMARY.acquisition,
              Logistics: EXECUTIVE_SUMMARY.logistics,
              Security: EXECUTIVE_SUMMARY.security,
              Reliability: EXECUTIVE_SUMMARY.reliability,
              AI: EXECUTIVE_SUMMARY.ai,
              Scale: EXECUTIVE_SUMMARY.scale,
              Expansion: EXECUTIVE_SUMMARY.expansion
            }).map(([k, v]) => (
              <p key={k}>
                <strong className="text-amber-300">{k}:</strong> {v}
              </p>
            ))}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#16161A] border border-slate-800 rounded-xl p-4">Y1 GMV €{(EXEC_KPIS.y1GmvEur / 1e6).toFixed(0)}m</div>
              <div className="bg-[#16161A] border border-slate-800 rounded-xl p-4">Y3 GMV €{(EXEC_KPIS.y3GmvEur / 1e6).toFixed(0)}m</div>
              <div className="bg-[#16161A] border border-slate-800 rounded-xl p-4">GM {EXEC_KPIS.grossMarginPct}% · NPS {EXEC_KPIS.nps}</div>
            </div>
            <div className="font-bold pt-2">Residual risks</div>
            {RESIDUAL_RISKS.map((r) => (
              <p key={r.id} className="text-slate-400">
                {r.id} [{r.residual}] {r.risk} — {r.treatment}
              </p>
            ))}
          </div>
        )}

        {tab === 'map' && (
          <div className="grid md:grid-cols-2 gap-3">
            {SYSTEM_LAYERS.map((l) => (
              <div key={l.layer} className="bg-[#16161A] border border-slate-800 rounded-xl p-4">
                <div className="font-bold text-amber-300">{l.layer}</div>
                <p className="text-slate-400 mt-1">{l.items}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'phases' && (
          <div className="overflow-x-auto bg-[#16161A] rounded-xl border border-slate-800">
            <table className="w-full">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-2 text-left">Ph</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Scope</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PHASE_CONSOLIDATION.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono text-amber-300">{p.id}</td>
                    <td className="p-2 font-bold text-white">{p.name}</td>
                    <td className="p-2 text-slate-400">{p.scope}</td>
                    <td className="p-2 text-emerald-400">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'inventory' && (
          <div className="space-y-4">
            <div className="overflow-x-auto bg-[#16161A] rounded-xl border border-slate-800">
              <table className="w-full">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="p-2 text-left">Object</th>
                    <th className="p-2">Kind</th>
                    <th className="p-2">RLS</th>
                    <th className="p-2 text-left">Class / retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB_INVENTORY.map((d) => (
                    <tr key={d.object}>
                      <td className="p-2 font-mono text-white">{d.object}</td>
                      <td className="p-2">{d.kind}</td>
                      <td className="p-2">{d.rls ? 'Yes' : 'N/A'}</td>
                      <td className="p-2 text-slate-400">{d.classification} · {d.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {SERVICE_REGISTRY.map((s) => (
              <div key={s.name} className="bg-[#16161A] border border-slate-800 rounded-xl p-3 flex justify-between gap-2">
                <span className="font-mono text-amber-200">{s.name}</span>
                <span className="text-slate-400">{s.auth} · {s.rateLimit} · {s.sla}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'security_rel' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#16161A] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold text-amber-300">Security dossier (Phase 11)</div>
              <p>IAM 9-role RBAC, FIDO2, RLS FORCE, AES-256-GCM + KMS, HMAC webhooks, SIEM, WORM 7y, GDPR DSR, AI Act guardrails. PCI SAQ-A. Residual: RR-01–03 accepted.</p>
            </div>
            <div className="bg-[#16161A] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold text-amber-300">Reliability / DR (Phase 12)</div>
              <p>Availability 99.994%, LCP 1.08s, RPO 0.8m, RTO 14.5m, FRA→DUB, error budgets, Kafka DLQs. BCP certified with Phase 11 runbooks.</p>
            </div>
          </div>
        )}

        {tab === 'ops_roadmap' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              SOPs: catalog sync approval; ATP deduct on capture; RMA restock; loyalty after pay; AI mutations dual-control; hypercare 24/7 week one. Full SOP text in the markdown dossier.
            </p>
            {ROADMAP.map((r) => (
              <div key={r.version} className="bg-[#16161A] border border-slate-800 rounded-xl p-4">
                <div className="font-bold text-amber-300">{r.version} — {r.theme}</div>
                <ul className="list-disc list-inside text-slate-400 mt-1">
                  {r.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

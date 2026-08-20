import React, { useState } from 'react';
import { Rocket, Radio, CheckCircle2 } from 'lucide-react';
import {
  ENVIRONMENT_LANES,
  CUTOVER_PLAN,
  LAUNCH_SIGNOFFS,
  MIGRATION_STREAMS,
  DNS_CUTOVER_STEPS,
  PRODUCTION_CHECKLIST,
  HYPERCARE_SHIFTS,
  WAR_ROOM,
  VENDOR_READINESS,
  COMMS_TEMPLATES,
  EXEC_LAUNCH_KPIS,
  PHASE_14_VERIFICATION_MATRIX
} from '../../data/launchOperationsData';
import { isLaunchAuthorized, launchReadinessScore } from '../../lib/launch/goNoGo';

type Tab =
  | 'command'
  | 'envs'
  | 'cutover'
  | 'migrate_dns'
  | 'lrr'
  | 'hypercare'
  | 'rollback_ics'
  | 'verification';

export const LaunchCommandCenter: React.FC = () => {
  const [tab, setTab] = useState<Tab>('command');
  const [ramp, setRamp] = useState(5);
  const score = launchReadinessScore(LAUNCH_SIGNOFFS);
  const authorized = isLaunchAuthorized(LAUNCH_SIGNOFFS);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'command', label: 'War Room' },
    { id: 'envs', label: 'Environments' },
    { id: 'cutover', label: 'Cutover T-clock' },
    { id: 'migrate_dns', label: 'Data & DNS' },
    { id: 'lrr', label: 'LRR Signoff' },
    { id: 'hypercare', label: 'Hypercare' },
    { id: 'rollback_ics', label: 'ICS & Rollback' },
    { id: 'verification', label: 'Phase 14 Matrix' }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 pb-24">
      <div className="bg-[#141A2E] border-b border-rose-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Rocket className="w-5 h-5 text-rose-400" />
              <h1 className="text-lg font-bold">DJI EU Go-Live Command Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                PHASE 14 · {authorized ? 'EXECUTIVE GO' : 'HOLD'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Amazon LRR · Google SRE launch · Stripe prod · Shopify release ops</p>
          </div>
          <div className="text-xs font-mono flex gap-3 flex-wrap">
            <span>Score {score}%</span>
            <span>Orders/h {EXEC_LAUNCH_KPIS.ordersLastHour}</span>
            <span>€ {EXEC_LAUNCH_KPIS.revenueEurLastHour.toLocaleString()}</span>
            <span>{EXEC_LAUNCH_KPIS.uptimePct}% up</span>
            <span>Sev {EXEC_LAUNCH_KPIS.openIncidents}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === t.id ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'command' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WAR_ROOM.map((w) => (
                <div key={w.role} className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
                  <div className="font-bold text-white">{w.role}</div>
                  <p className="text-slate-400 mt-1">{w.authority}</p>
                  <p className="text-rose-300 font-mono mt-1">{w.channel}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-white mb-2">
                <Radio className="w-4 h-4 text-rose-400" />
                Traffic ramp (Cloudflare weight → prod)
              </div>
              <input type="range" min={0} max={100} step={5} value={ramp} onChange={(e) => setRamp(Number(e.target.value))} className="w-full" />
              <p className="text-slate-400 mt-1">{ramp}% production · rollback = set 0% (&lt; 5 min DNS/Argo)</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Kpi label="LCP p75" value={`${EXEC_LAUNCH_KPIS.lcpP75}s`} />
              <Kpi label="CSAT" value={`${EXEC_LAUNCH_KPIS.csat}/5`} />
              <Kpi label="Integrity" value="100%" />
            </div>
          </div>
        )}

        {tab === 'envs' && (
          <div className="space-y-3">
            {ENVIRONMENT_LANES.map((e) => (
              <div key={e.name} className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
                <div className="font-bold uppercase text-rose-300">{e.name}</div>
                <p className="font-mono text-slate-400">{e.url}</p>
                <p className="mt-1">Data: {e.dataClass} · Promote: {e.promoters.join(', ')}</p>
                <p className="text-slate-500">Approvals: {e.requiredApprovals.join(', ')}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'cutover' && (
          <div className="overflow-x-auto bg-[#141A2E] rounded-xl border border-slate-800">
            <table className="w-full">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-3 text-left">When</th>
                  <th className="p-3 text-left">Activity</th>
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Checkpoint</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {CUTOVER_PLAN.map((c) => (
                  <tr key={c.milestone + c.activity}>
                    <td className="p-3 font-mono text-rose-300">{c.milestone}</td>
                    <td className="p-3 text-white">{c.activity}</td>
                    <td className="p-3">{c.owner}</td>
                    <td className="p-3 text-slate-400">{c.checkpoint}</td>
                    <td className="p-3 uppercase">{c.status.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'migrate_dns' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold">Data migration</div>
              {MIGRATION_STREAMS.map((m) => (
                <p key={m.domain}>
                  <strong className="text-white">{m.domain}:</strong> {m.method}. Rollback: {m.rollback}
                </p>
              ))}
            </div>
            <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
              <div className="font-bold mb-2">DNS / CDN / SSL</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                {DNS_CUTOVER_STEPS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-2 bg-[#141A2E] border border-slate-800 rounded-xl p-4">
              <div className="font-bold mb-2">Production validation</div>
              {PRODUCTION_CHECKLIST.map((p) => (
                <p key={p.item}>
                  <strong>{p.area}:</strong> {p.item} — {p.criteria}
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'lrr' && (
          <div className="space-y-3">
            {LAUNCH_SIGNOFFS.map((s) => (
              <div key={s.function} className="bg-[#141A2E] border border-slate-800 rounded-xl p-4 flex justify-between gap-3">
                <div>
                  <div className="font-bold text-white">{s.function} · {s.approver}</div>
                  <p className="text-slate-400">{s.conditions}</p>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-black uppercase">{s.decision}</div>
                  <div className="font-mono">{s.scorePct}%</div>
                </div>
              </div>
            ))}
            <div className="text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Formal authorization: {authorized ? 'GO — Managing Director may cut traffic' : 'NO-GO'}
            </div>
          </div>
        )}

        {tab === 'hypercare' && (
          <div className="space-y-3">
            {HYPERCARE_SHIFTS.map((h) => (
              <div key={h.window} className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
                <div className="font-bold text-rose-300">{h.window}</div>
                <p>{h.staffing}</p>
                <p className="text-slate-400">{h.monitor}</p>
              </div>
            ))}
            <div className="font-bold">Vendors</div>
            {VENDOR_READINESS.map((v) => (
              <div key={v.vendor} className="flex justify-between bg-[#141A2E] border border-slate-800 rounded-xl p-3">
                <span>{v.vendor} · {v.contact}</span>
                <span className="uppercase text-emerald-400">{v.status}</span>
              </div>
            ))}
            <div className="font-bold pt-2">Customer comms</div>
            {COMMS_TEMPLATES.map((c) => (
              <p key={c.name}>
                {c.name} — {c.approval} via {c.channel}
              </p>
            ))}
          </div>
        )}

        {tab === 'rollback_ics' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold">Incident command</div>
              <p><strong>Sev-1</strong> (checkout/pay/PII): page war-room 5 min; Exec comms 15 min; consider rollback.</p>
              <p><strong>Sev-2</strong> (major journey): ticket + Slack 15 min; hotfix or flag off 60 min.</p>
              <p>Bridge: #launch-bridge · status.djii.eu · no customer tweets without Exec.</p>
            </div>
            <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold">Rollback (&lt; 5 min)</div>
              <p>Storefront: Cloudflare weight 0% to prior Vercel deployment.</p>
              <p>Checkout: disable live Stripe; SEPA hold queue.</p>
              <p>Database: PITR to pre-cutover WAL; dual-write still on.</p>
              <p>AI: kill autonomous flags (already off at T-4h).</p>
              <p>Analytics: pause Kafka sinks; no customer impact.</p>
            </div>
          </div>
        )}

        {tab === 'verification' && (
          <div className="overflow-x-auto bg-[#141A2E] rounded-xl border border-slate-800">
            <table className="w-full">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-3 text-left">Subsystem</th>
                  <th className="p-3 text-left">Requirement</th>
                  <th className="p-3 text-left">Evidence</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PHASE_14_VERIFICATION_MATRIX.map((r) => (
                  <tr key={r.subsystem}>
                    <td className="p-3 font-bold text-white">{r.subsystem}</td>
                    <td className="p-3">{r.requirement}</td>
                    <td className="p-3 font-mono text-slate-500">{r.evidence}</td>
                    <td className="p-3 text-rose-300 font-bold">{r.status}</td>
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

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#141A2E] border border-slate-800 rounded-xl p-4">
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}

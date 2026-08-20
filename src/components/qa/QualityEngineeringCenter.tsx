import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, GitBranch, BarChart3 } from 'lucide-react';
import {
  DEFECT_SEVERITY_MATRIX,
  QUALITY_GATES,
  TEST_SUITE_STATS,
  STOREFRONT_TEST_PLAN,
  COMMERCE_VALIDATION_CASES,
  OMS_VALIDATION_CASES,
  CRM_VALIDATION_CASES,
  AI_VALIDATION_CASES,
  PERF_ACCEPTANCE,
  RELEASE_SIGNOFFS,
  QUALITY_KPIS,
  PHASE_13_VERIFICATION_MATRIX
} from '../../data/qualityAssuranceData';

type QaTab = 'overview' | 'governance' | 'automation' | 'domains' | 'release' | 'verification';

export const QualityEngineeringCenter: React.FC = () => {
  const [tab, setTab] = useState<QaTab>('overview');

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 pb-24">
      <div className="bg-[#12151C] border-b border-orange-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-orange-400" />
              <h1 className="text-lg font-bold">DJI EU Quality, Testing & Release Engineering</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40">
                PHASE 13 · ZERO SEV-1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Google Eng Excellence · Stripe release · Shopify QA · Amazon discipline</p>
          </div>
          <div className="flex gap-3 text-xs font-mono">
            <span>Escape {QUALITY_KPIS.defectEscapeRatePct}%</span>
            <span className="text-orange-300">Cover {QUALITY_KPIS.automatedCoveragePct}%</span>
            <span>Deploy {QUALITY_KPIS.deploySuccessPct}%</span>
            <span>Rollback {QUALITY_KPIS.rollbackMinutes}m</span>
            <span>MTTR {QUALITY_KPIS.mttrMinutes}m</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Quality KPIs'],
            ['governance', 'Governance & Gates'],
            ['automation', 'Test Architecture'],
            ['domains', 'Domain Suites'],
            ['release', 'Go / No-Go'],
            ['verification', 'Phase 13 Matrix']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-orange-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4">
        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Critical defect escape', `${QUALITY_KPIS.defectEscapeRatePct}%`, '< 0.1%'],
              ['Automated coverage', `${QUALITY_KPIS.automatedCoveragePct}%`, '≥ 90%'],
              ['Deploy success', `${QUALITY_KPIS.deploySuccessPct}%`, '≥ 99%'],
              ['Rollback', `${QUALITY_KPIS.rollbackMinutes} min`, '< 5 min'],
              ['MTTR', `${QUALITY_KPIS.mttrMinutes} min`, '< 15 min'],
              ['Open Sev-1', String(QUALITY_KPIS.openSev1), 'Zero at launch']
            ].map(([k, v, t]) => (
              <div key={k} className="bg-[#12151C] border border-slate-800 rounded-xl p-4">
                <div className="text-[10px] uppercase text-slate-500">{k}</div>
                <div className="text-2xl font-black text-white mt-1">{v}</div>
                <div className="text-xs text-orange-300">Target {t}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'governance' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Hierarchy: Engineer → QA Lead → SRE → CISO (security/privacy) → Managing Director. Any Sev-1 or failed gate is automatic no-go.
            </p>
            {DEFECT_SEVERITY_MATRIX.map((d) => (
              <div key={d.severity} className="bg-[#12151C] border border-slate-800 rounded-xl p-4 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold uppercase text-orange-300">{d.severity} · {d.name}</span>
                  <span>{d.launchBlocker ? 'LAUNCH BLOCKER' : 'non-blocking'} · SLA {d.slaHours}h</span>
                </div>
                <p className="text-slate-400 mt-1">{d.examples.join(' · ')}</p>
              </div>
            ))}
            <div className="overflow-x-auto bg-[#12151C] rounded-xl border border-slate-800">
              <table className="w-full text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-left">Gate</th>
                    <th className="p-3 text-left">Owner</th>
                    <th className="p-3 text-left">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {QUALITY_GATES.map((g) => (
                    <tr key={g.id}>
                      <td className="p-3">
                        <div className="font-bold text-white">{g.id} {g.name}</div>
                        <div className="text-slate-500">{g.criterion}</div>
                      </td>
                      <td className="p-3">{g.owner}</td>
                      <td className="p-3 text-emerald-400 font-bold uppercase">{g.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'automation' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#12151C] p-4 rounded-xl border border-slate-800">
              <p>
                <strong>Vitest</strong> for unit/integration on <code className="text-orange-300">src/lib/**</code> (commerce VAT, idempotency, RLS SQL, HMAC).{' '}
                <strong>Playwright</strong> Chromium smoke in <code className="text-orange-300">e2e/</code>. CI:{' '}
                <code className="text-orange-300">.github/workflows/qa-release-gates.yml</code>.
              </p>
            </div>
            {TEST_SUITE_STATS.map((s) => (
              <div key={s.layer} className="bg-[#12151C] p-4 rounded-xl border border-slate-800 flex justify-between gap-4">
                <div>
                  <div className="font-bold text-white uppercase">{s.layer}</div>
                  <div className="text-slate-400">{s.tool} · {s.cases} cases / {s.suites} suites</div>
                </div>
                <div className="text-right font-mono">
                  <div className={s.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}>{s.status}</div>
                  {s.coveragePct > 0 && <div>cov {s.coveragePct}%</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'domains' && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#12151C] p-4 rounded-xl border border-slate-800">
              <div className="font-bold mb-2">Storefront</div>
              {STOREFRONT_TEST_PLAN.map((p) => (
                <p key={p.surface} className="text-slate-400 mb-2">
                  <strong className="text-white">{p.surface}:</strong> {p.cases.join('; ')}
                </p>
              ))}
            </div>
            {[
              ['Commerce', COMMERCE_VALIDATION_CASES],
              ['OMS', OMS_VALIDATION_CASES],
              ['CRM / Loyalty', CRM_VALIDATION_CASES],
              ['AI', AI_VALIDATION_CASES]
            ].map(([title, items]) => (
              <div key={String(title)} className="bg-[#12151C] p-4 rounded-xl border border-slate-800">
                <div className="font-bold mb-2">{title}</div>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  {(items as string[]).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-[#12151C] p-4 rounded-xl border border-slate-800 md:col-span-2">
              <div className="font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                Performance + monitoring acceptance
              </div>
              {PERF_ACCEPTANCE.map((p) => (
                <p key={p.test} className="text-slate-400">
                  <strong className="text-white">{p.test}:</strong> {p.pass}
                </p>
              ))}
              <p className="text-slate-500 mt-2">Alerts: LCP, API p95, checkout health, search probe → PagerDuty SEV routing (Phase 12).</p>
            </div>
          </div>
        )}

        {tab === 'release' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#12151C] p-4 rounded-xl border border-slate-800 flex items-start gap-2">
              <GitBranch className="w-4 h-4 text-orange-400 mt-0.5" />
              <p>
                CI unit+coverage → preview URL → Playwright smoke → canary 5/25/100 on Cloudflare split → blue-green Vercel promote.
                Rollback = previous immutable build + feature-flag kill. Test data: synthetic <code>qa.pilot+de@djii.eu</code> only in staging-eu.
              </p>
            </div>
            {RELEASE_SIGNOFFS.map((s) => (
              <div key={s.role} className="bg-[#12151C] p-4 rounded-xl border border-slate-800 flex justify-between">
                <div>
                  <div className="font-bold">{s.role} · {s.person}</div>
                  <div className="text-slate-400">{s.notes}</div>
                </div>
                <span className="text-emerald-400 font-black uppercase">{s.decision}</span>
              </div>
            ))}
            <div className="text-orange-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Launch recommendation: GO — zero Sev-1, all gates pass.
            </div>
          </div>
        )}

        {tab === 'verification' && (
          <div className="overflow-x-auto bg-[#12151C] rounded-xl border border-slate-800">
            <table className="w-full text-xs">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-3 text-left">Subsystem</th>
                  <th className="p-3 text-left">Requirement</th>
                  <th className="p-3 text-left">Evidence</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PHASE_13_VERIFICATION_MATRIX.map((r) => (
                  <tr key={r.subsystem}>
                    <td className="p-3 font-bold text-white">{r.subsystem}</td>
                    <td className="p-3 text-slate-300">{r.requirement}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{r.evidence}</td>
                    <td className="p-3 text-orange-300 font-bold">{r.status}</td>
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

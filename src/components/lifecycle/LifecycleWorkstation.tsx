import React, { useMemo, useState } from 'react';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';
import { runWave7Lifecycle, WAVE7_NEXTJS_INTEGRATION, WAVE7_TRIGGERS } from '../../lib/lifecycle/wave7Lifecycle';
import { WAVE7_ROLLOUT } from '../../data/wave7LifecycleData';
import { INITIAL_CUSTOMERS } from '../../data/crmData';
import { DJI_PRODUCTS } from '../../data/products';

type Tab =
  | 'overview'
  | 'journeys'
  | 'segments'
  | 'triggers'
  | 'templates'
  | 'loyalty'
  | 'referrals'
  | 'retention'
  | 'churn'
  | 'attribution'
  | 'consent';

export const LifecycleWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const bundle = useMemo(() => runWave7Lifecycle(), []);
  const nameOf = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;
  const custName = (id: string) => {
    const c = INITIAL_CUSTOMERS.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : id;
  };

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-teal-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-400" />
              <h1 className="text-lg font-bold">Lifecycle · Retention · Loyalty</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                WAVE 7 · EXTENDS PHASE 9 CRM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Consent-aware engagement on existing customers/loyalty — no second CRM. {WAVE7_NEXTJS_INTEGRATION.note}
            </p>
          </div>
          <div className="text-xs font-mono">
            {bundle.certification.certified ? 'CERTIFIED' : 'PENDING'} · consent viol {bundle.certification.consentViolations}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Overview'],
            ['journeys', 'Journeys'],
            ['segments', 'Segments'],
            ['triggers', 'Triggers'],
            ['templates', 'Templates'],
            ['loyalty', 'Loyalty'],
            ['referrals', 'Referrals'],
            ['retention', 'Retention'],
            ['churn', 'Churn'],
            ['attribution', 'Attribution'],
            ['consent', 'Consent']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
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
                bundle.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {bundle.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {bundle.certification.certified
                  ? 'DJI STORE EU — WAVE 7 CUSTOMER LIFECYCLE & RETENTION CERTIFICATION'
                  : 'WAVE 7 NOT CERTIFIED'}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Transitions', bundle.transitions.length],
                  ['Ownership journeys', bundle.ownership.length],
                  ['Messages', bundle.messages.length],
                  ['HIGH churn', bundle.churn.filter((c) => c.level === 'HIGH').length]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-teal-300">{v}</div>
                </div>
              ))}
            </div>
            <div>
              {WAVE7_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">AI lifecycle assistant</div>
              {bundle.ai.map((a) => (
                <div key={a.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 mb-2">
                  <div className="font-bold">{a.question}</div>
                  <p className="text-slate-400">{a.answer}</p>
                  <p className="text-slate-500">
                    conf {a.confidence} · {a.proposedAction}
                    {a.requiresApproval ? ' · APPROVAL' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'journeys' && (
          <div className="space-y-2">
            <p className="font-bold">First-purchase onboarding</p>
            {bundle.onboarding.map((s) => (
              <p key={s.key}>
                Day {s.day}: {s.title}
              </p>
            ))}
            <p className="font-bold pt-3">Ownership sample</p>
            {bundle.ownership.slice(0, 8).map((o) => (
              <p key={`${o.customerId}-${o.productId}`}>
                {custName(o.customerId)} · {o.modelName} · care {o.carePlanStatus} · fw {o.firmwareStatus}
              </p>
            ))}
          </div>
        )}

        {tab === 'segments' &&
          bundle.transitions.slice(0, 12).map((t) => (
            <p key={t.customerId}>
              {custName(t.customerId)}: {t.previousStage} → {t.currentStage} ({t.trigger})
            </p>
          ))}

        {tab === 'triggers' && WAVE7_TRIGGERS.map((t) => <p key={t}>{t}</p>)}

        {tab === 'templates' &&
          bundle.messages.slice(0, 12).map((m) => (
            <p key={m.id}>
              {m.status} · {m.locale} · {m.subject}
              {m.suppressionReason ? ` — ${m.suppressionReason}` : ''}
            </p>
          ))}

        {tab === 'loyalty' &&
          bundle.loyalty.slice(0, 8).map((l) => (
            <p key={l.customerId}>
              {custName(l.customerId)} · {l.tier} · {l.points} pts · next {l.nextTier ?? '—'} · {l.progressPct}%
            </p>
          ))}

        {tab === 'referrals' &&
          bundle.referrals.map((r) => (
            <p key={r.referralId}>
              {r.referrerCustomerId} → {r.referredEmail} · {r.status} · {r.rewardPoints} pts
            </p>
          ))}

        {tab === 'retention' && (
          <div className="space-y-2">
            {bundle.careEvents.slice(0, 10).map((e) => (
              <p key={e.id}>
                {custName(e.customerId)} · {e.type} · {nameOf(e.productId)} · due {e.dueDate}
              </p>
            ))}
            {bundle.replenishment.slice(0, 8).map((r) => (
              <p key={`${r.customerId}-${r.accessoryId}`}>
                {nameOf(r.accessoryId)} — {r.reason}
                {r.officialIntervalKnown ? ` (${r.intervalDays}d)` : ' (interval unknown)'}
              </p>
            ))}
          </div>
        )}

        {tab === 'churn' &&
          bundle.churn
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((c) => (
              <div key={c.customerId} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                <div className="font-bold">
                  {custName(c.customerId)} — {c.level} ({c.score})
                </div>
                <p className="text-slate-400">{c.signals.map((s) => s.note).join(' · ')}</p>
              </div>
            ))}

        {tab === 'attribution' && (
          <div className="space-y-1">
            <p>Campaign revenue €{bundle.attribution.campaignRevenueEur} (reported)</p>
            <p>Influenced €{bundle.attribution.influencedRevenueEur} — causationClaimed={String(bundle.attribution.causationClaimed)}</p>
            <p>Repeat purchase {bundle.attribution.repeatPurchaseRatePct}%</p>
            <p>Accessory attachment {bundle.attribution.accessoryAttachmentPct}%</p>
            <p>Retention {bundle.attribution.retentionPct}% · churn reduction {bundle.attribution.churnReductionPct}%</p>
            <p>Loyalty €{bundle.attribution.loyaltyRevenueEur} · Referral €{bundle.attribution.referralRevenueEur}</p>
          </div>
        )}

        {tab === 'consent' && (
          <div className="space-y-2">
            <p>Consent violations: {bundle.certification.consentViolations}</p>
            <p>Duplicate queued/sent fingerprints: {bundle.certification.duplicateCampaignSends}</p>
            <p>Suppressed messages: {bundle.messages.filter((m) => m.status === 'suppressed').length}</p>
            <p className="text-slate-500">Phase 11 marketingConsent + fingerprint uniqueness enforce GDPR-safe automation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

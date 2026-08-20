import React, { useMemo, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE6_DEMO_CONTEXTS, WAVE6_ROLLOUT } from '../../data/wave6PersonalizationData';
import { WAVE6_NEXTJS_INTEGRATION, runWave6Personalization } from '../../lib/personalization/wave6Personalization';
import { PersonalizationContext } from '../../types/wave6Personalization';

type Tab = 'overview' | 'homepage' | 'plp' | 'pdp' | 'cart' | 'locale' | 'search' | 'content' | 'cert';

export const PersonalizationWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [persona, setPersona] = useState<keyof typeof WAVE6_DEMO_CONTEXTS>('anonymousMini');
  const ctx: PersonalizationContext = WAVE6_DEMO_CONTEXTS[persona];
  const bundle = useMemo(() => runWave6Personalization(DJI_PRODUCTS, ctx), [persona]);
  const nameOf = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-violet-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h1 className="text-lg font-bold">Personalization · Locale · Experience</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
                WAVE 6 EXPERIENCE LAYER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explainable storefront personalization on DJI_PRODUCTS — Wave 3 + Wave 5 inputs. No second PIM.
            </p>
          </div>
          <div className="flex gap-2 items-center text-xs">
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as keyof typeof WAVE6_DEMO_CONTEXTS)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
            >
              <option value="anonymousMini">Anonymous Mini shopper</option>
              <option value="returningOwner">Returning Mavic owner</option>
              <option value="creatorFr">FR Creator</option>
            </select>
            <span className="font-mono">{bundle.certification.certified ? 'CERTIFIED' : 'PENDING'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Overview'],
            ['homepage', 'Homepage'],
            ['plp', 'PLP'],
            ['pdp', 'PDP'],
            ['cart', 'Cart'],
            ['locale', 'Locale & Depot'],
            ['search', 'Search'],
            ['content', 'Content'],
            ['cert', 'Certification']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-violet-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
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
                  ? 'DJI STORE EU — WAVE 6 PERSONALIZATION CERTIFIED'
                  : 'WAVE 6 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 mt-1">
                Intent: {bundle.intent} · session {bundle.context.sessionId} · {WAVE6_NEXTJS_INTEGRATION.note}
              </p>
            </div>
            <div>
              {WAVE6_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'homepage' &&
          (Object.entries(bundle.homepage.slots) as [string, typeof bundle.homepage.slots.hero][]).map(([slot, items]) => (
            <div key={slot} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
              <div className="font-bold mb-1">{slot}</div>
              {items.slice(0, 4).map((d) => (
                <p key={`${slot}-${d.productId}`} className="text-slate-400">
                  {nameOf(d.productId)} · {d.reason} · conf {d.confidence} · {d.sourceSignal}
                </p>
              ))}
              {!items.length && <p className="text-slate-600">Empty — {items[0]?.fallbackBehavior ?? 'fallback to merch'}</p>}
            </div>
          ))}

        {tab === 'plp' && (
          <div className="space-y-2">
            <p>SEO-safe: {String(bundle.plp.seoSafe)} · manual overrides preserved: {String(bundle.plp.preservedManualOverrides)}</p>
            {bundle.plp.decisions.slice(0, 12).map((d, i) => (
              <p key={d.productId}>
                #{i + 1} {nameOf(d.productId)} — {d.reason} ({d.score})
              </p>
            ))}
          </div>
        )}

        {tab === 'pdp' && (
          <div className="space-y-2">
            <p className="font-bold">Focus: {nameOf(bundle.pdpSample.productId)}</p>
            <p>Accessories: {bundle.pdpSample.accessories.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
            <p>Upgrades: {bundle.pdpSample.upgrades.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
            <p>Alternatives: {bundle.pdpSample.alternatives.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
            <p>Care: {bundle.pdpSample.care.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
          </div>
        )}

        {tab === 'cart' && (
          <div className="space-y-2">
            <p>{bundle.cart.shippingNudge ?? 'Free shipping unlocked or empty cart'}</p>
            <p>Essentials: {bundle.cart.missingEssentials.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
            <p>Care: {bundle.cart.carePlans.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
            <p>Add-ons: {bundle.cart.accessories.map((d) => nameOf(d.productId)).join(', ') || '—'}</p>
          </div>
        )}

        {tab === 'locale' && (
          <div className="space-y-2">
            <p>
              Suggestion: {bundle.localeSuggestion.suggestedLocale.toUpperCase()} / {bundle.localeSuggestion.suggestedCurrency} —{' '}
              {bundle.localeSuggestion.reason}
            </p>
            <p>forceRedirect: {String(bundle.localeSuggestion.forceRedirect)}</p>
            <p>
              Depot: {bundle.depot.preferredDepotCode} — {bundle.depot.reason}
            </p>
          </div>
        )}

        {tab === 'search' && (
          <div className="space-y-2">
            <p>
              Query “{bundle.context.searchedTerms[0]}” → {bundle.searchSample.productIds.slice(0, 5).map(nameOf).join(', ')}
            </p>
            <p>exactMatch on soft query: {String(bundle.searchSample.exactMatch)}</p>
          </div>
        )}

        {tab === 'content' && (
          <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
            <div className="font-bold">{bundle.content.title}</div>
            <p className="text-slate-400 mt-1">{bundle.content.body}</p>
            <p className="mt-2">Related: {bundle.content.relatedProductIds.map(nameOf).join(', ')}</p>
          </div>
        )}

        {tab === 'cert' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                ['Explainability', bundle.certification.explainabilityCoveragePct],
                ['Reco integrity', bundle.certification.recommendationIntegrityPct],
                ['Unavailable filtered', bundle.certification.unavailableFilteredPct]
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="text-slate-500 uppercase">{k}</div>
                <div className="text-2xl font-black text-violet-300">{v}</div>
              </div>
            ))}
            <p>Exact search priority: {String(bundle.certification.exactSearchPriority)}</p>
            <p>Locale non-forced: {String(bundle.certification.localeSuggestionNonForced)}</p>
            <p>Catalog facts only: {String(bundle.certification.catalogFactsOnly)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

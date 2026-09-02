import React, { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { runWave9Service, localizeKnowledge } from '../../lib/service/wave9Service';
import { WAVE9_LOCALES } from '../../data/wave9ServiceData';
import { Locale } from '../../types';

type Tab = 'all' | 'troubleshooting' | 'warranty_policy' | 'care_documentation' | 'firmware_notes' | 'faq' | 'internal_sop';

export const KnowledgeBaseWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('all');
  const [locale, setLocale] = useState<Locale>('en');
  const bundle = useMemo(() => runWave9Service(), []);
  const articles =
    tab === 'all' ? bundle.knowledge : bundle.knowledge.filter((a) => a.type === tab);

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-indigo-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold">Knowledge Base</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                WAVE 9 · APPROVED SOURCES ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Locale fallback: requested → localized → EN. Legal/warranty translations require review.
            </p>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
          >
            {WAVE9_LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['all', 'All'],
            ['troubleshooting', 'Troubleshooting'],
            ['warranty_policy', 'Warranty Policies'],
            ['care_documentation', 'Care'],
            ['firmware_notes', 'Firmware Notes'],
            ['faq', 'FAQ'],
            ['internal_sop', 'Internal SOP']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-indigo-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-3 text-xs">
        {articles.map((a) => {
          const loc = localizeKnowledge(locale, a.id);
          const display = loc.article ?? a;
          return (
            <div key={a.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              <div className="font-bold text-sm">{display.title}</div>
              <div className="text-slate-500 mt-1">
                {a.type} · {display.locale}
                {loc.fallback ? ' (EN fallback)' : ''} · v{display.version} · {display.approvalStatus} ·{' '}
                {display.reviewer} · {display.publishedAt ?? '—'}
              </div>
              <p className="text-slate-400 mt-2">{display.body}</p>
              <p className="text-slate-600 mt-1">Source: {display.source}</p>
            </div>
          );
        })}
        {articles.length === 0 && <p className="text-slate-500">No articles in this category.</p>}

        <div className="border border-slate-800 rounded-xl p-4 mt-4">
          <div className="font-bold mb-2">Guided troubleshooting</div>
          {bundle.troubleshooting.map((f) => (
            <div key={f.id} className="mb-3">
              <div className="font-semibold">{f.symptom}</div>
              <ol className="list-decimal list-inside text-slate-400 mt-1">
                {f.steps.map((s) => (
                  <li key={s.id}>
                    {s.title}: {s.instruction} ({s.knowledgeArticleId})
                  </li>
                ))}
              </ol>
              <p className="text-slate-500 mt-1">
                Resolution: {f.suggestedResolution}
                {f.escalateIfUnresolved ? ' · escalate if unresolved' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

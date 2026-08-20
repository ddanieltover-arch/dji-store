import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Zap,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_SEARCH_INSIGHTS } from '../../data/aiOperationsData';
import { SearchQueryInsight } from '../../types/aiOperations';

export const SearchIntelligenceConsole: React.FC = () => {
  const { addToast } = useStore();

  const [queries, setQueries] = useState<SearchQueryInsight[]>(INITIAL_SEARCH_INSIGHTS);
  const [newSynonymInput, setNewSynonymInput] = useState('');

  const handleDeploySynonym = (queryTerm: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.query === queryTerm ? { ...q, status: 'optimized' as const } : q))
    );
    addToast({
      type: 'success',
      title: 'Autonomous Synonym Rule Deployed',
      message: `Search index updated for "${queryTerm}". Zero-result rate dropped to 0.0%.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Autonomous Omnibar Search Intelligence
              </span>
              <span className="text-xs text-zinc-400 font-mono">Real-time NLP Vector Embeddings</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Search Query Intent, Typo Tolerance & Autonomous Synonyms
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Analyzes European multilingual pilot search queries, identifies zero-result intent gaps, and autonomously synthesizes redirect synonyms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Zero-Result Rate: 0.12%
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH INTELLIGENCE TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              High-Velocity Search Terms & Intent Resolution
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Query volume, CTR, conversion rate, and autonomous synonym recommendations
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">30-Day Aggregation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="pb-3 font-semibold">Search Term</th>
                <th className="pb-3 font-semibold">Monthly Searches</th>
                <th className="pb-3 font-semibold">Zero-Result Rate</th>
                <th className="pb-3 font-semibold">Click-Through (CTR)</th>
                <th className="pb-3 font-semibold">Conversion Rate</th>
                <th className="pb-3 font-semibold">AI Recommendation / Mapping</th>
                <th className="pb-3 font-semibold text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {queries.map((q, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-zinc-500" />
                    "{q.query}"
                  </td>
                  <td className="py-3 text-zinc-300 font-bold">{q.searchVolume30d.toLocaleString()}</td>
                  <td className="py-3">
                    <span
                      className={`font-bold ${
                        q.zeroResultRatePct > 5 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {q.zeroResultRatePct}%
                    </span>
                  </td>
                  <td className="py-3 text-indigo-300 font-semibold">{q.clickThroughRatePct}%</td>
                  <td className="py-3 text-emerald-400 font-semibold">{q.conversionRatePct}%</td>
                  <td className="py-3 text-zinc-400 max-w-xs truncate">
                    {q.suggestedSynonymAction || 'Optimal semantic matching'}
                  </td>
                  <td className="py-3 text-right">
                    {q.status === 'optimized' ? (
                      <span className="text-emerald-400 font-bold flex items-center justify-end gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Optimized
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeploySynonym(q.query)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold transition-colors shadow-sm"
                      >
                        Deploy Rule
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

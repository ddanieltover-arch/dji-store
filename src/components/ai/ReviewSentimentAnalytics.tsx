import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  Send,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_SENTIMENT_CLUSTERS } from '../../data/aiOperationsData';
import { SentimentCluster } from '../../types/aiOperations';

export const ReviewSentimentAnalytics: React.FC = () => {
  const { addToast } = useStore();

  const [clusters, setClusters] = useState<SentimentCluster[]>(INITIAL_SENTIMENT_CLUSTERS);

  const handleEscalateToEngineering = (clusterId: string) => {
    setClusters((prev) =>
      prev.map((c) => (c.id === clusterId ? { ...c, engineeringEscalated: true } : c))
    );
    addToast({
      type: 'warning',
      title: 'Engineering Bug Escalation Dispatched',
      message: `Cluster ${clusterId} ticket created in Jira Firmware Team backlog (Severity P2).`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-sky-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Review & Flight Telemetry NLP Sentiment Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">1,880+ Verified Reviews Analyzed</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Customer Feedback Sentiment NLP & Defect Clustering
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Extracts actionable pilot sentiment, cold-weather flight issues, gimbal calibration feedback, and firmware anomalies with automated engineering escalation.
            </p>
          </div>

          {/* NPS Badge */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-right shrink-0">
            <div className="text-[10px] uppercase font-mono text-zinc-500">European Pilot NPS</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">+78.4 NPS</div>
            <div className="text-[10px] text-zinc-400">Top Quartile in Aerospace</div>
          </div>
        </div>
      </div>

      {/* CLUSTERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-sky-400">
                    {cluster.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{cluster.label}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                      cluster.sentimentScore >= 0.8
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : cluster.sentimentScore >= 0.5
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {(cluster.sentimentScore * 100).toFixed(0)}% Pos
                  </span>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {cluster.reviewCount} Reviews
                  </div>
                </div>
              </div>

              {/* Sentiment breakdown bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${cluster.positivePct}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${cluster.neutralPct}%` }} className="bg-zinc-500" />
                  <div style={{ width: `${cluster.negativePct}%` }} className="bg-rose-500" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="text-emerald-400">{cluster.positivePct}% Positive</span>
                  <span>{cluster.neutralPct}% Neutral</span>
                  <span className="text-rose-400">{cluster.negativePct}% Critical</span>
                </div>
              </div>

              {/* Sample Quotes */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono">
                  Representative Pilot Quotes:
                </div>
                {cluster.sampleQuotes.map((quote, qIdx) => (
                  <blockquote
                    key={qIdx}
                    className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 italic"
                  >
                    "{quote}"
                  </blockquote>
                ))}
              </div>

              {/* Detected Issues */}
              {cluster.detectedIssues.length > 0 && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs space-y-1 text-amber-300">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Identified Firmware / Usability Anomaly:
                  </div>
                  {cluster.detectedIssues.map((iss, iIdx) => (
                    <p key={iIdx} className="text-[11px] text-amber-200">
                      • {iss}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Escalation Action */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">ID: {cluster.id}</span>

              {cluster.detectedIssues.length > 0 && (
                <div>
                  {cluster.engineeringEscalated ? (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Jira Ticket #DJI-FW-489 Dispatched
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEscalateToEngineering(cluster.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Cpu className="w-3.5 h-3.5" /> Escalate to Firmware Team
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  HeartHandshake,
  TrendingDown,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_CUSTOMER_SEGMENTS,
  INITIAL_CHURN_RISK_PROFILES
} from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';
import { ChurnRiskProfile } from '../../types/aiOperations';

export const CustomerIntelligenceEngine: React.FC = () => {
  const { currency, addToast } = useStore();

  const [segments, setSegments] = useState(INITIAL_CUSTOMER_SEGMENTS);
  const [churnProfiles, setChurnProfiles] = useState<ChurnRiskProfile[]>(
    INITIAL_CHURN_RISK_PROFILES
  );

  const handleTriggerRetentionCampaign = (customerId: string) => {
    setChurnProfiles((prev) =>
      prev.map((p) =>
        p.customerId === customerId ? { ...p, automatedCampaignTriggered: true } : p
      )
    );
    addToast({
      type: 'success',
      title: 'Retention Playbook Dispatched',
      message: `Personalized re-engagement voucher and VIP briefing sent to ${customerId}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Customer Intelligence & Predictive Churn Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">45,400+ Active Pilots</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              AI Customer Segmentation & Churn Prevention Playbooks
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Calculates engagement velocity, warranty expiration dates, and flight telemetry to predict churn risk and trigger automated personalized retention campaigns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Predicted Churn Saved: €1.42M MTD
            </span>
          </div>
        </div>
      </div>

      {/* AI SEGMENTATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {segments.map((seg) => (
          <div
            key={seg.segmentKey}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  {seg.segmentName}
                </span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                  {seg.customerCount.toLocaleString()} Pilots
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Avg LTV</div>
                  <div className="text-lg font-black text-white font-mono">
                    {formatPrice(seg.avgLtvEur, currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Total Revenue</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {formatPrice(seg.totalRevenueContributionEur, currency)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-400">
                Top Category: <strong className="text-zinc-200">{seg.topCategory}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Automated Playbook:</div>
              <p className="text-[11px] text-zinc-300 leading-relaxed bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                {seg.recommendedPlaybook}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHURN RISK SURVEILLANCE & RETENTION TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              High-Value Pilot Churn Risk Surveillance
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identified accounts at risk of defection with automated AI re-engagement recommendations
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
            3 High-Priority Accounts
          </span>
        </div>

        <div className="space-y-4">
          {churnProfiles.map((pilot) => (
            <div
              key={pilot.customerId}
              className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{pilot.customerName}</span>
                    {pilot.companyName && (
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                        {pilot.companyName}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 font-mono">({pilot.customerId})</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    LTV: <strong className="text-emerald-400 font-mono">{formatPrice(pilot.lifetimeValueEur, currency)}</strong> • Last Active: {pilot.lastOrderDate} ({pilot.daysInactive} days inactive)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Churn Probability</div>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    {pilot.churnProbabilityPct}% Risk
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs space-y-1.5">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Primary Defection Trigger: {pilot.primaryRiskFactor}
                </div>
                <div className="text-zinc-300">
                  🎯 <strong>Recommended Action:</strong> {pilot.suggestedAction}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono">Email: {pilot.email}</span>

                {pilot.automatedCampaignTriggered ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Retention Campaign Dispatched
                  </span>
                ) : (
                  <button
                    onClick={() => handleTriggerRetentionCampaign(pilot.customerId)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Trigger Retention Playbook
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

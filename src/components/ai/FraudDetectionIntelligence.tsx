import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  Lock,
  Globe2,
  Cpu,
  Coins,
  FileCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_FRAUD_ASSESSMENTS } from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';
import { FraudRiskAssessment } from '../../types/aiOperations';

export const FraudDetectionIntelligence: React.FC = () => {
  const { currency, addToast } = useStore();

  const [assessments, setAssessments] = useState<FraudRiskAssessment[]>(
    INITIAL_FRAUD_ASSESSMENTS
  );

  const handleForceApprove = (id: string) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'force_approved_by_admin' as const } : a
      )
    );
    addToast({
      type: 'success',
      title: 'Order Quarantine Cleared',
      message: `Risk review passed for ${id}. Released to Frankfurt warehouse packing queue.`
    });
  };

  const handleRejectFraud = (id: string) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected_fraud' as const } : a))
    );
    addToast({
      type: 'error',
      title: 'Order Blocked & Flagged as Fraud',
      message: `${id} permanently rejected. Payment origin reported to compliance log.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Sentinel Anti-Fraud & Crypto Taint Radar
              </span>
              <span className="text-xs text-zinc-400 font-mono">Real-Time Risk Scoring</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Wire Transfer Verification & Blockchain Taint Intelligence
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Evaluates corporate SEPA IBANs, VIES EU VAT registrations, TOR exit nodes, and on-chain crypto UTXO histories to prevent high-value hardware theft.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chargeback Rate: 0.01%
            </span>
          </div>
        </div>
      </div>

      {/* FRAUD RISK QUEUE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              High-Risk Orders Surveillance Queue
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated anomaly scoring and human investigator escalation
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
            1 High-Risk Held
          </span>
        </div>

        <div className="space-y-4">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{a.orderNumber}</span>
                    <span className="text-xs text-zinc-400">({a.customerName})</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        a.status === 'cleared_auto' || a.status === 'force_approved_by_admin'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : a.status === 'rejected_fraud'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {a.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    Payment: <strong className="text-zinc-200">{a.paymentMethod}</strong> • Location: {a.ipLocation}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-white font-mono">
                    {formatPrice(a.totalEur, currency)}
                  </div>
                  <div className="text-xs font-mono">
                    Risk Score:{' '}
                    <strong
                      className={
                        a.riskScore > 70
                          ? 'text-rose-400'
                          : a.riskScore > 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {a.riskScore}/100
                    </strong>
                  </div>
                </div>
              </div>

              {/* RISK FACTORS */}
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase font-mono">
                  Evaluated Risk Indicators:
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {a.riskFactors.map((rf, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
                    >
                      • {rf}
                    </span>
                  ))}
                  {a.cryptoTaintScore && (
                    <span className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-300 font-mono">
                      Crypto Taint Score: {a.cryptoTaintScore}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono">Evaluated: {a.evaluatedAt}</span>

                {a.status === 'held_for_investigation' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectFraud(a.id)}
                      className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1 border border-rose-700/50"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Fraud
                    </button>
                    <button
                      onClick={() => handleForceApprove(a.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Clear & Release Order
                    </button>
                  </div>
                ) : (
                  <span className="text-zinc-400 font-mono text-[11px]">
                    Status finalized in security ledger
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

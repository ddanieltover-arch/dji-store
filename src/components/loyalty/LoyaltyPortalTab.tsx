import React, { useState } from 'react';
import {
  Award,
  Gift,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LoyaltyTier, LoyaltyRewardItem } from '../../types';
import { formatPrice } from '../../data/currency';
import { getTierThreshold, getNextTierThreshold } from '../../data/crmData';

export const LoyaltyPortalTab: React.FC = () => {
  const {
    currentCustomer,
    loyaltyRewards,
    loyaltyTransactions,
    redeemLoyaltyReward,
    currency,
    addToast
  } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const account = currentCustomer.loyaltyAccount;
  const currentLtv = currentCustomer.lifetimeValueEur;
  const nextTierInfo = getNextTierThreshold(currentCustomer.loyaltyTier);
  const nextTargetEur = nextTierInfo?.nextTier
    ? getTierThreshold(nextTierInfo.nextTier).min
    : null;

  // Progress to next tier
  const tierProgress = nextTargetEur
    ? Math.min(100, Math.round((currentLtv / nextTargetEur) * 100))
    : 100;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({
      type: 'success',
      title: 'Voucher Copied',
      message: `${code} copied to clipboard! Paste at checkout for discount.`
    });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Tier Status Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5" />
                DJI Pilot Rewards • {currentCustomer.loyaltyTier.toUpperCase()} PILOT
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Member Since {new Date(account.enrolledDate).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, Pilot {currentCustomer.firstName}
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Earn 1 point for every €1 spent on official aircraft and accessories across the European Union.
              Redeem anytime for instant voucher discounts, replacement propellers, and Care Refresh coverage.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-xl text-right shrink-0 min-w-[200px] shadow-inner">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Available Balance
            </div>
            <div className="text-3xl md:text-4xl font-black text-amber-400 mt-1 font-mono tracking-tight">
              {account.pointsBalance.toLocaleString()}
              <span className="text-base text-zinc-400 font-normal ml-1">pts</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-mono">
              Value: ≈ {formatPrice(account.pointsBalance / 100, currency)}
            </div>
          </div>
        </div>

        {/* Next Tier Progress Bar */}
        {nextTargetEur && (
          <div className="relative z-10 mt-6 pt-6 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                Tier Progress: <span className="text-zinc-200 font-bold">{currentCustomer.loyaltyTier.toUpperCase()}</span>
              </span>
              <span className="text-zinc-400">
                Next Tier: <span className="text-amber-300 font-bold">{formatPrice(nextTargetEur, currency)} LTV</span> ({formatPrice(Math.max(0, nextTargetEur - currentLtv), currency)} to advance)
              </span>
            </div>

            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tier Perks Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Your {currentCustomer.loyaltyTier.toUpperCase()} Tier Flight Perks
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Guaranteed Across EU Distribution Hubs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {account.perks.map((perk, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-zinc-300 font-medium leading-relaxed">{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* REWARDS STORE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" />
              Pilot Rewards Store
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Redeem your points balance for instant discount vouchers and official drone gear.
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            Balance: <span className="text-amber-400 font-bold">{account.pointsBalance.toLocaleString()} pts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loyaltyRewards.map((reward) => {
            const canAfford = account.pointsBalance >= reward.pointsCost;

            return (
              <div
                key={reward.id}
                className={`bg-zinc-900 border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  canAfford ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-800/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-pink-950/60 border border-pink-800 text-pink-300 font-mono">
                      {reward.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      {reward.pointsCost.toLocaleString()} Pts
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-100">{reward.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{reward.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 font-mono">
                    Stock: {reward.stockRemaining} units
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => redeemLoyaltyReward(reward.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    {canAfford ? 'Redeem Reward' : 'Insufficient Pts'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW TO EARN MORE POINTS BANNER */}
      <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-900/50 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-bold text-blue-200">How to Earn Additional DJI Pilot Points</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🛒 Flight Purchases</span>
              <span className="text-amber-400 font-mono text-[11px]">+1 Pt / €1</span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-1">Automatic 1:1 accrual on all hardware & accessories.</div>
          </div>

          <div className="bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>📸 Verified Photo Reviews</span>
              <span className="text-emerald-400 font-mono text-[11px]">+500 Pts</span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-1">Submit high-res aerial footage and flight reviews.</div>
          </div>

          <div className="bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🛡️ Warranty Registration</span>
              <span className="text-sky-400 font-mono text-[11px]">+100 Pts</span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-1">Register aircraft serial numbers in your European portal.</div>
          </div>
        </div>
      </div>

      {/* POINTS ACTIVITY HISTORY */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Loyalty Points Ledger
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            {loyaltyTransactions.filter((t) => t.customerId === currentCustomer.id).length} recorded transactions
          </span>
        </div>

        <div className="divide-y divide-zinc-800">
          {loyaltyTransactions
            .filter((t) => t.customerId === currentCustomer.id)
            .map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    {tx.description}
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded uppercase font-mono">
                      {tx.transactionType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">{tx.createdAt}</div>
                </div>

                <div className="text-right font-mono font-bold text-sm">
                  <span
                    className={tx.pointsDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}
                  >
                    {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

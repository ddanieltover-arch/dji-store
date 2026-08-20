import React, { useState } from 'react';
import {
  Award,
  Gift,
  Plus,
  TrendingUp,
  Percent,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  Shield,
  Plane,
  X,
  CreditCard,
  Edit,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LoyaltyRewardItem, LoyaltyTier } from '../../types';
import { formatPrice } from '../../data/currency';

export const LoyaltyRewardsAdmin: React.FC = () => {
  const {
    loyaltyRewards,
    loyaltyTransactions,
    currentCustomer,
    awardLoyaltyPoints,
    currency,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'tiers' | 'rewards' | 'transactions'>('tiers');
  const [isManualAwardOpen, setIsManualAwardOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust-lukas-weber');
  const [pointsInput, setPointsInput] = useState(500);
  const [reasonInput, setReasonInput] = useState('Manual VIP Loyalty Credit Bonus');

  const handleManualAward = (e: React.FormEvent) => {
    e.preventDefault();
    awardLoyaltyPoints(selectedCustomerId, Number(pointsInput), 'manual_adjustment', reasonInput);
    setIsManualAwardOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Total Points Distributed</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">2,849,150 pts</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> €28,491 total loyalty value
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Active Reward Catalog</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{loyaltyRewards.length} Rewards</div>
          <div className="text-xs text-zinc-400 mt-1">Vouchers, Hardware & Care Plans</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Redemption Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">64.2%</div>
          <div className="text-xs text-emerald-400 mt-1">Industry leading loyalty engagement</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Point Accrual Standard</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">1 € = 1 Pt</div>
          <div className="text-xs text-purple-300 mt-1">+ Reviews, Warranties & Referrals</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'tiers'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            Tier Matrix & Rules
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'rewards'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Gift className="w-4 h-4 text-pink-400" />
            Redeemable Rewards Store ({loyaltyRewards.length})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'transactions'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            Live Points Ledger ({loyaltyTransactions.length})
          </button>
        </div>

        <button
          onClick={() => setIsManualAwardOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          Award Manual Loyalty Points
        </button>
      </div>

      {/* TAB 1: TIERS MATRIX */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              tier: 'pilot' as LoyaltyTier,
              name: 'Pilot (Tier 1)',
              threshold: '€0 - €1,999 LTV',
              multiplier: '1.0x Point Accrual',
              color: 'border-zinc-700 bg-zinc-900 text-zinc-300',
              perks: [
                '1 Point per €1 Spent',
                'Official 2-Year European Warranty',
                'Access to DJI Flight Club',
                'Direct DHL Express Delivery'
              ]
            },
            {
              tier: 'advanced' as LoyaltyTier,
              name: 'Advanced Pilot (Tier 2)',
              threshold: '€2,000 - €4,999 LTV',
              multiplier: '1.2x Point Accrual',
              color: 'border-blue-700/60 bg-blue-950/20 text-blue-300',
              perks: [
                '5% Off All Official Accessories',
                'Early Access to European Product Drops',
                '24-Hour Express RMA Priority Queue',
                'Annual €25 Flight Club Voucher'
              ]
            },
            {
              tier: 'professional' as LoyaltyTier,
              name: 'Professional (Tier 3)',
              threshold: '€5,000 - €9,999 LTV',
              multiplier: '1.5x Point Accrual',
              color: 'border-purple-700/60 bg-purple-950/20 text-purple-300',
              perks: [
                '10% Off All Official Accessories',
                'Dedicated European Flight Engineer Support',
                'Priority Depot Loaner Drone during Repair',
                'VIP Flight Club Pro Flight Jacket Badge'
              ]
            },
            {
              tier: 'enterprise' as LoyaltyTier,
              name: 'Enterprise (Tier 4)',
              threshold: '€10,000+ LTV',
              multiplier: '2.0x Point Accrual',
              color: 'border-amber-700/60 bg-amber-950/20 text-amber-300',
              perks: [
                '15% Off Fleet Orders & Accessories',
                'Direct 2-Hour SLA Dedicated Manager',
                'Free Care Refresh On Enterprise Airframes',
                'Bespoke VAT Exemption Clearance Concierge'
              ]
            }
          ].map((t) => (
            <div
              key={t.tier}
              className={`p-5 rounded-xl border flex flex-col justify-between ${t.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold tracking-wider font-mono">
                    {t.tier}
                  </span>
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-zinc-100">{t.name}</h4>
                <div className="text-xs text-zinc-400 mt-1 font-mono font-semibold">
                  {t.threshold}
                </div>
                <div className="text-xs text-amber-400 mt-0.5 font-bold">
                  ⚡ {t.multiplier}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">Tier Benefits:</div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {t.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: REWARDS CATALOG */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loyaltyRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-pink-950/60 border border-pink-800 text-pink-300 font-mono">
                    {reward.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-amber-400 font-bold font-mono">
                    {reward.pointsCost.toLocaleString()} Pts
                  </span>
                </div>

                <h4 className="text-base font-bold text-zinc-100">{reward.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{reward.description}</p>

                {reward.voucherCode && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono flex items-center justify-between mt-3">
                    <span className="text-zinc-500">Voucher Code:</span>
                    <span className="text-amber-400 font-bold">{reward.voucherCode}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">
                  Min Tier: <span className="text-zinc-300 uppercase font-bold">{reward.minTier}</span>
                </span>
                <span className="text-xs bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  In Stock ({reward.stockRemaining} Available)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LIVE POINTS LEDGER */}
      {activeTab === 'transactions' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/70 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Points Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {loyaltyTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">{tx.id}</td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-400">{tx.customerId}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {tx.transactionType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-200">{tx.description}</td>
                    <td className="py-3 px-4 text-xs text-zinc-500 font-mono">{tx.createdAt}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={
                          tx.pointsDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} Pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MANUAL POINTS AWARD MODAL */}
      {isManualAwardOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Award Pilot Loyalty Points
              </h3>
              <button
                onClick={() => setIsManualAwardOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAward} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Recipient Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="cust-lukas-weber">Lukas Weber (lukas.weber@alpinemedia.de)</option>
                  <option value="cust-elena-rossi">Elena Rossi (elena.rossi@cineflight.it)</option>
                  <option value="cust-henrik-nielsen">Henrik Nielsen (henrik@nordicaerial.dk)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Points Delta (+/-)
                </label>
                <input
                  type="number"
                  required
                  value={pointsInput}
                  onChange={(e) => setPointsInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Transaction Reason / Description
                </label>
                <input
                  type="text"
                  required
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualAwardOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Grant Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

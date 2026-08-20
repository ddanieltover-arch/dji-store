import React, { useState } from 'react';
import {
  Users,
  Plane,
  Gift,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  Award,
  ShieldCheck,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ReferralRecord } from '../../types';

export const ReferralsFlightClubTab: React.FC = () => {
  const {
    currentCustomer,
    referrals,
    createReferralInvite,
    addToast
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const referralCode = `DJI-FLY-${currentCustomer.firstName.toUpperCase()}-26`;
  const referralLink = `https://djii.eu/invite/${referralCode}`;

  const customerReferrals = referrals.filter(
    (r) => r.referrerCustomerId === currentCustomer.id
  );

  const totalEarnedPoints = customerReferrals.reduce(
    (acc, r) => acc + r.pointsAwarded,
    0
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Referral Link Copied',
      message: 'Share with pilots to earn 500 points when they place their first flight order.'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName || !friendEmail) return;

    createReferralInvite(friendName, friendEmail);
    setFriendName('');
    setFriendEmail('');
  };

  const club = currentCustomer.flightClubDetails;

  return (
    <div className="space-y-8">
      {/* Flight Club Member Passport Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-sky-950/40 border border-sky-900/40 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Plane className="w-3.5 h-3.5" />
                DJI Flight Club Europe • Verified Pilot Passport
              </span>
              <span className="text-xs text-zinc-400 font-mono">Callsign: {club?.pilotHandle || 'Pilot-01'}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              European Creator & Flight Club
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Connect with certified aerial cinematographers, share flight airspace insights, and invite colleagues to earn complimentary flight batteries and accessories.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl text-center">
              <div className="text-xs text-zinc-500 font-semibold uppercase">Flight Time</div>
              <div className="text-xl font-bold text-sky-400 mt-1 font-mono">
                {club?.totalFlightHours || 142} hrs
              </div>
              <div className="text-[11px] text-zinc-400">Logged Telemetry</div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl text-center">
              <div className="text-xs text-zinc-500 font-semibold uppercase">Fleet Aircraft</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                {club?.fleetAircraftCount || 3} Drones
              </div>
              <div className="text-[11px] text-zinc-400">Registered S/Ns</div>
            </div>
          </div>
        </div>
      </div>

      {/* REFERRAL REWARDS HERO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Pilot-to-Pilot Referral Rewards Program
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Give a friend €25 off their first European flight order. You get 500 Loyalty Points (€50 value) after their order delivers.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-500 font-semibold uppercase">Referral Earnings</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {totalEarnedPoints.toLocaleString()} Pts
            </div>
          </div>
        </div>

        {/* Share Link Box */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Share2 className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 font-semibold">Your Personal Invitation Link</div>
              <div className="text-sm font-mono text-zinc-200 select-all font-semibold">
                {referralLink}
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Invitation Link'}
          </button>
        </div>

        {/* Send Direct Email Invite */}
        <form onSubmit={handleSendInvite} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Directly Invite a Fellow Pilot via Email
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Colleague / Pilot Name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              required
              placeholder="pilot@studio.eu"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              Send €25 Invitation
            </button>
          </div>
        </form>
      </div>

      {/* REFERRAL TRACKING TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Your Invited Pilots Activity
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            {customerReferrals.length} active referral(s)
          </span>
        </div>

        <div className="divide-y divide-zinc-800">
          {customerReferrals.map((ref) => {
            const statusBadges = {
              invited: 'bg-zinc-800 text-zinc-400 border-zinc-700',
              registered: 'bg-blue-950/60 text-blue-300 border-blue-800',
              ordered: 'bg-purple-950/60 text-purple-300 border-purple-800',
              rewarded: 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
            }[ref.status];

            return (
              <div key={ref.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    {ref.refereeName}
                    <span className="text-xs text-zinc-400 font-mono">({ref.refereeEmail})</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    Voucher: {ref.voucherCode} • Invited on {ref.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${statusBadges}`}>
                    {ref.status}
                  </span>
                  <div className="text-sm font-bold font-mono text-amber-400 min-w-[70px] text-right">
                    {ref.pointsAwarded > 0 ? `+${ref.pointsAwarded} pts` : 'Pending'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

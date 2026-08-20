import React, { useState } from 'react';
import {
  Send,
  Mail,
  Smartphone,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  Percent,
  DollarSign,
  AlertCircle,
  Plus,
  X,
  Layers,
  ArrowRight,
  Filter,
  Eye
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MarketingAutomationTrigger, MarketingCampaign, AudienceSegment } from '../../types';
import { formatPrice } from '../../data/currency';

export const MarketingAutomationCenter: React.FC = () => {
  const {
    automationTriggers,
    toggleAutomationTrigger,
    marketingCampaigns,
    launchMarketingCampaign,
    currency,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'triggers' | 'campaigns'>('triggers');
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [testTriggerModal, setTestTriggerModal] = useState<MarketingAutomationTrigger | null>(null);

  // New Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState<AudienceSegment>('high_value');
  const [audienceCount, setAudienceCount] = useState<number>(1482);
  const [channel, setChannel] = useState<'email' | 'sms' | 'multi_channel'>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [incentiveVoucher, setIncentiveVoucher] = useState('');

  // Handle Audience Change
  const handleAudienceSelect = (aud: AudienceSegment) => {
    setTargetAudience(aud);
    const counts: Record<AudienceSegment, number> = {
      high_value: 1482,
      inactive_pilots: 840,
      accessory_buyers: 2190,
      care_plan_eligible: 1120,
      warranty_expiring: 950,
      flight_club_vip: 640,
      all: 84221
    };
    setAudienceCount(counts[aud] || 1000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !subject) {
      addToast({ type: 'warning', title: 'Missing Information', message: 'Please enter a title and subject.' });
      return;
    }

    launchMarketingCampaign({
      title: campaignTitle,
      targetAudience,
      audienceCount,
      channel,
      subject,
      content: content || 'Exclusive European DJI pilot offer.',
      incentiveVoucher: incentiveVoucher || undefined
    });

    setIsNewCampaignOpen(false);
    setCampaignTitle('');
    setSubject('');
    setContent('');
    setIncentiveVoucher('');
  };

  // Aggregate Lifecycle Stats
  const totalSent = automationTriggers.reduce((acc, t) => acc + t.totalSent, 0);
  const totalRevenueEur = automationTriggers.reduce((acc, t) => acc + t.revenueGeneratedEur, 0);
  const avgOpenRate = +(
    automationTriggers.reduce((acc, t) => acc + t.openRate, 0) / automationTriggers.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Lifecycle KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Automated Lifecycle Messages</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{totalSent.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Sent automatically via EU relays
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Lifecycle Revenue</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatPrice(totalRevenueEur, currency)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Directly attributed to recovery triggers</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Average Open Rate</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{avgOpenRate}%</div>
          <div className="text-xs text-emerald-400 mt-1">Benchmark: 24.8% Industry Avg</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400 font-semibold uppercase">Active Triggers</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {automationTriggers.filter((t) => t.isActive).length}/{automationTriggers.length}
          </div>
          <div className="text-xs text-purple-300 mt-1">Real-time event stream active</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('triggers')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'triggers'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Automated Lifecycle Triggers ({automationTriggers.length})
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'campaigns'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Send className="w-4 h-4 text-blue-400" />
            Marketing Campaigns ({marketingCampaigns.length})
          </button>
        </div>

        {activeTab === 'campaigns' && (
          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create & Launch Campaign
          </button>
        )}
      </div>

      {/* TAB 1: AUTOMATED LIFECYCLE TRIGGERS */}
      {activeTab === 'triggers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {automationTriggers.map((trig) => {
              const typeBadges = {
                abandoned_cart: 'bg-amber-950/60 border-amber-800 text-amber-300',
                browse_abandonment: 'bg-blue-950/60 border-blue-800 text-blue-300',
                post_purchase_lifecycle: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
                warranty_renewal: 'bg-purple-950/60 border-purple-800 text-purple-300',
                care_plan_upsell: 'bg-pink-950/60 border-pink-800 text-pink-300',
                flight_club_nurture: 'bg-sky-950/60 border-sky-800 text-sky-300',
                tier_upgrade: 'bg-indigo-950/60 border-indigo-800 text-indigo-300'
              }[trig.type];

              return (
                <div
                  key={trig.id}
                  className={`p-5 bg-zinc-900 border rounded-xl transition-all ${
                    trig.isActive ? 'border-zinc-800' : 'border-zinc-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${typeBadges}`}
                        >
                          {trig.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          ⏱ Delay: {trig.delayHours}h
                        </span>
                        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                          {trig.channel === 'email' ? (
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {trig.channel.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-zinc-100">{trig.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        Trigger Condition: <span className="text-zinc-200 font-semibold">{trig.triggerCondition}</span>
                      </p>
                      <div className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 mt-2">
                        <span className="text-zinc-500 font-semibold">Subject:</span> "{trig.subject}"
                        <div className="text-zinc-400 text-[11px] mt-0.5">
                          Preview: {trig.previewText}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6 self-end lg:self-center shrink-0">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-xs text-zinc-500 font-semibold">Sent</div>
                          <div className="text-sm font-bold text-zinc-200 mt-0.5">
                            {trig.totalSent.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-semibold">Open Rate</div>
                          <div className="text-sm font-bold text-blue-400 mt-0.5">
                            {trig.openRate}%
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-semibold">Click Rate</div>
                          <div className="text-sm font-bold text-purple-400 mt-0.5">
                            {trig.clickRate}%
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-semibold">Attributed €</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">
                            {formatPrice(trig.revenueGeneratedEur, currency)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-4 border-l border-zinc-800">
                        <button
                          onClick={() => setTestTriggerModal(trig)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 text-blue-400" />
                          Test Preview
                        </button>

                        <button
                          onClick={() => toggleAutomationTrigger(trig.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            trig.isActive
                              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {trig.isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKETING CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketingCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/60 border border-blue-800 text-blue-300 font-mono">
                      {camp.targetAudience.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                        camp.status === 'completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : camp.status === 'running'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800 animate-pulse'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-zinc-100">{camp.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">"{camp.subject}"</p>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">
                      {camp.content}
                    </p>
                  </div>

                  {camp.incentiveVoucher && (
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono flex items-center justify-between">
                      <span className="text-zinc-500">Incentive Voucher:</span>
                      <span className="text-amber-400 font-bold">{camp.incentiveVoucher}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                      <div className="text-zinc-500 text-[10px]">Delivered</div>
                      <div className="font-bold text-zinc-200 mt-0.5">
                        {camp.sentCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                      <div className="text-zinc-500 text-[10px]">Open %</div>
                      <div className="font-bold text-blue-400 mt-0.5">{camp.openRate}%</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                      <div className="text-zinc-500 text-[10px]">Revenue</div>
                      <div className="font-bold text-emerald-400 mt-0.5">
                        {formatPrice(camp.revenueGeneratedEur, currency)}
                      </div>
                    </div>
                  </div>

                  {camp.launchedAt && (
                    <div className="text-[11px] text-zinc-500 font-mono text-center">
                      Launched on: {new Date(camp.launchedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {isNewCampaignOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                Launch Automated Pilot Marketing Campaign
              </h3>
              <button
                onClick={() => setIsNewCampaignOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer 2026 Night Flight Masterclass & Battery Promo"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Target Audience Cohort
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => handleAudienceSelect(e.target.value as AudienceSegment)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="high_value">High-Value VIP Pilots (1,482)</option>
                    <option value="inactive_pilots">Dormant Pilots Win-Back (840)</option>
                    <option value="accessory_buyers">Drone Owners / Battery Buyers (2,190)</option>
                    <option value="care_plan_eligible">Care Refresh Eligible (1,120)</option>
                    <option value="flight_club_vip">Flight Club Ambassadors (640)</option>
                    <option value="all">All European Customers (84,221)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Channel Dispatch
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="email">Email (European Relays)</option>
                    <option value="sms">SMS Priority Dispatch</option>
                    <option value="multi_channel">Multi-Channel (Email + SMS + Push)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Exclusive European Pilot Invitation: Season Kickoff Inside"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Content Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Message body with European delivery guarantees and specifications..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Optional Incentive Voucher Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., SUMMER-PILOT-25"
                  value={incentiveVoucher}
                  onChange={(e) => setIncentiveVoucher(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono uppercase"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-xs text-zinc-400 font-mono">
                  Audience Size: <span className="text-zinc-100 font-bold">{audienceCount.toLocaleString()} Pilots</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewCampaignOpen(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Launch Broadcast
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST TRIGGER PREVIEW MODAL */}
      {testTriggerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                Trigger Preview — {testTriggerModal.name}
              </h3>
              <button
                onClick={() => setTestTriggerModal(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">From:</span>
                  <span className="font-mono text-zinc-200">DJI Store EU (operations@djii.eu)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Subject:</span>
                  <span className="font-semibold text-zinc-100">{testTriggerModal.subject}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Preview:</span>
                  <span className="text-zinc-300">{testTriggerModal.previewText}</span>
                </div>
              </div>

              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-sans">
                <div className="font-bold text-zinc-100 mb-2">DJI European Customer Operations</div>
                <p>{testTriggerModal.contentTemplate}</p>
                <div className="mt-4 pt-4 border-t border-zinc-900 text-xs text-zinc-500 flex justify-between">
                  <span>DJI Store EU • Frankfurt Depot</span>
                  <span>2-Year EU Warranty</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Test Email Dispatched',
                      message: 'Test message sent to developer sandbox address.'
                    });
                    setTestTriggerModal(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Test to My Email
                </button>
                <button
                  onClick={() => setTestTriggerModal(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

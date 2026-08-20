import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Activity,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Plane,
  Gift,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  X,
  ExternalLink,
  Tag,
  ArrowUpRight,
  Database,
  Layers,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerProfile, CdpEvent, AudienceSegment } from '../../types';
import { formatPrice } from '../../data/currency';
import { segmentCustomers, getTierPerks, getTierThreshold } from '../../data/crmData';

export const CdpIntelligenceConsole: React.FC = () => {
  const {
    customers,
    currentCustomer,
    setCurrentCustomerId,
    cdpEvents,
    currency,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'explorer' | 'event_stream' | 'segments' | 'health_matrix'>('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerModalTab, setCustomerModalTab] = useState<'overview' | 'cdp_events' | 'fleet_hardware' | 'loyalty_comms'>('overview');

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'all' || c.loyaltyTier === tierFilter;
    const matchesHealth = healthFilter === 'all' || c.healthStatus === healthFilter;

    return matchesSearch && matchesTier && matchesHealth;
  });

  // Calculate CDP Metrics
  const totalCustomers = 84221;
  const flightClubMembers = 29444;
  const activeLoyalty = 16839;
  const avgLtvEur = 2487;
  const repeatRate = 37.2;
  const churnRisk = 4117;

  return (
    <div className="space-y-6">
      {/* Top Intelligence KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Profiles</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalCustomers.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +14.2% MoM
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Flight Club</span>
            <Plane className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{flightClubMembers.toLocaleString()}</div>
          <div className="text-xs text-zinc-400 mt-1 font-medium">35.0% of customer base</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Loyalty</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{activeLoyalty.toLocaleString()}</div>
          <div className="text-xs text-amber-400 mt-1 font-medium">€640k+ in points value</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Average LTV</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{formatPrice(avgLtvEur, currency)}</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">+8.5% YoY</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Repeat Rate</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{repeatRate}%</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">High frequency</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Churn Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{churnRisk.toLocaleString()}</div>
          <div className="text-xs text-rose-400 mt-1 font-medium">Target with winback</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'explorer'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            Unified Profile Explorer
          </button>

          <button
            onClick={() => setActiveTab('event_stream')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'event_stream'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            CDP Live Event Ingestion Stream
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full animate-pulse">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('segments')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'segments'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Dynamic Audience Segments
          </button>
        </div>

        <div className="text-xs text-zinc-500 flex items-center gap-1 font-mono">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          CDP Engine: Sub-150ms Resolution • EU GDPR Compliant
        </div>
      </div>

      {/* TAB 1: UNIFIED PROFILE EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pilot by name, email, company, country, serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tier:</span>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-zinc-900">All Tiers</option>
                  <option value="pilot" className="bg-zinc-900">Pilot (Tier 1)</option>
                  <option value="advanced" className="bg-zinc-900">Advanced Pilot (Tier 2)</option>
                  <option value="professional" className="bg-zinc-900">Professional (Tier 3)</option>
                  <option value="enterprise" className="bg-zinc-900">Enterprise (Tier 4)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
                <span>Health:</span>
                <select
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-zinc-900">All Health</option>
                  <option value="excellent" className="bg-zinc-900">Excellent</option>
                  <option value="good" className="bg-zinc-900">Good</option>
                  <option value="at_risk" className="bg-zinc-900">At Risk</option>
                  <option value="dormant" className="bg-zinc-900">Dormant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/70 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer / Pilot</th>
                    <th className="py-3 px-4">Loyalty Tier</th>
                    <th className="py-3 px-4">Lifetime Value</th>
                    <th className="py-3 px-4">Lead Score</th>
                    <th className="py-3 px-4">Health Status</th>
                    <th className="py-3 px-4">Flight Club</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomer?.id === cust.id;
                    const tierBadgeColors = {
                      pilot: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                      advanced: 'bg-blue-950/60 text-blue-300 border-blue-800',
                      professional: 'bg-purple-950/60 text-purple-300 border-purple-800',
                      enterprise: 'bg-amber-950/60 text-amber-300 border-amber-800'
                    }[cust.loyaltyTier];

                    const healthColors = {
                      excellent: 'bg-emerald-500/20 text-emerald-300 border-emerald-800',
                      good: 'bg-blue-500/20 text-blue-300 border-blue-800',
                      at_risk: 'bg-amber-500/20 text-amber-300 border-amber-800',
                      dormant: 'bg-rose-500/20 text-rose-300 border-rose-800'
                    }[cust.healthStatus];

                    const leadBadge = {
                      vip: 'bg-amber-500/20 text-amber-300',
                      hot: 'bg-rose-500/20 text-rose-300',
                      warm: 'bg-blue-500/20 text-blue-300',
                      cold: 'bg-zinc-800 text-zinc-400'
                    }[cust.leadCategory];

                    return (
                      <tr
                        key={cust.id}
                        className={`hover:bg-zinc-800/40 transition-colors ${
                          isSelected ? 'bg-zinc-800/60' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs uppercase shadow-inner">
                              {cust.firstName[0]}
                              {cust.lastName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                                {cust.firstName} {cust.lastName}
                                <span className="text-xs text-zinc-500">({cust.countryCode})</span>
                              </div>
                              <div className="text-xs text-zinc-400">{cust.email}</div>
                              {cust.company && (
                                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                                  {cust.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${tierBadgeColors}`}
                          >
                            <Award className="w-3 h-3" />
                            {cust.loyaltyTier}
                          </span>
                          <div className="text-xs text-zinc-400 mt-1 font-mono">
                            {cust.loyaltyAccount.pointsBalance.toLocaleString()} pts
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-zinc-100">
                            {formatPrice(cust.lifetimeValueEur, currency)}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {cust.totalOrders} order{cust.totalOrders !== 1 ? 's' : ''} (Avg:{' '}
                            {formatPrice(cust.averageOrderValue, currency)})
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-zinc-200">{cust.leadScore}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${leadBadge}`}>
                              {cust.leadCategory}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium uppercase border ${healthColors}`}
                          >
                            {cust.healthStatus.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {cust.flightClubMember ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
                                <Plane className="w-3.5 h-3.5" />
                                {cust.flightClubDetails?.pilotHandle || 'Pilot Member'}
                              </span>
                              <div className="text-[11px] text-zinc-500">
                                {cust.flightClubDetails?.totalFlightHours} flight hrs
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-600 italic">Not Enrolled</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-zinc-400 font-mono">
                          {cust.lastActivityDate || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setCustomerModalTab('overview');
                            }}
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            360° Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CDP LIVE EVENT STREAM */}
      {activeTab === 'event_stream' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Real-Time Event Ingestion Pipeline
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Streaming customer interactions across Web, Cart, Checkout, Warranty, Review, and Flights.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-full font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Ingesting ({cdpEvents.length} Recent Events)
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {cdpEvents.map((evt) => {
                const eventIcons = {
                  payment_completed: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
                  add_to_cart: <ShoppingBag className="w-4 h-4 text-blue-400" />,
                  checkout_started: <CreditCard className="w-4 h-4 text-amber-400" />,
                  warranty_registered: <ShieldCheck className="w-4 h-4 text-purple-400" />,
                  review_submitted: <Award className="w-4 h-4 text-amber-400" />,
                  flight_club_joined: <Plane className="w-4 h-4 text-sky-400" />,
                  product_compared: <Layers className="w-4 h-4 text-indigo-400" />,
                  reward_redeemed: <Gift className="w-4 h-4 text-pink-400" />,
                  referral_sent: <Users className="w-4 h-4 text-cyan-400" />,
                  page_view: <Eye className="w-4 h-4 text-zinc-400" />,
                  product_view: <Eye className="w-4 h-4 text-zinc-300" />,
                  search: <Search className="w-4 h-4 text-zinc-400" />,
                  filter_applied: <Filter className="w-4 h-4 text-zinc-400" />,
                  email_opened: <Mail className="w-4 h-4 text-blue-400" />,
                  email_clicked: <Mail className="w-4 h-4 text-emerald-400" />,
                  sms_clicked: <Smartphone className="w-4 h-4 text-emerald-400" />
                }[evt.eventType] || <Activity className="w-4 h-4 text-zinc-400" />;

                return (
                  <div
                    key={evt.id}
                    className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        {eventIcons}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                            {evt.eventType.replace(/_/g, ' ')}
                          </span>
                          {evt.customerEmail && (
                            <span className="text-xs text-blue-400 font-medium font-mono">
                              ({evt.customerEmail})
                            </span>
                          )}
                          <span className="text-[11px] text-emerald-400 font-bold font-mono">
                            +{evt.scoreDelta} Score Delta
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          Metadata: {JSON.stringify(evt.metadata)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs text-zinc-500 font-mono flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC AUDIENCE SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 'high_value',
              name: 'High-Value VIP Pilots',
              desc: 'Customers with LTV > €5,000 or Professional/Enterprise tiers.',
              count: segmentCustomers(customers, 'high_value').length,
              totalCohort: '1,482 European Pilots',
              tags: ['LTV > €5k', 'Cine Studios', 'Priority Queue']
            },
            {
              id: 'inactive_pilots',
              name: 'Dormant Pilots (Win-Back)',
              desc: 'No purchase or flight activity in 180+ days. Prime candidate for propeller coupons.',
              count: segmentCustomers(customers, 'inactive_pilots').length,
              totalCohort: '840 Inactive Accounts',
              tags: ['180+ Days Inactive', 'Lead: Cold', 'At Risk']
            },
            {
              id: 'accessory_buyers',
              name: 'Drone Owners (Battery Upsell)',
              desc: 'Owns Mavic, Air, or Mini drone without recent Intelligent Battery purchases.',
              count: segmentCustomers(customers, 'accessory_buyers').length,
              totalCohort: '2,190 Drone Pilots',
              tags: ['Hardware Registered', 'ND Filter Eligible', 'Battery Nurture']
            },
            {
              id: 'care_plan_eligible',
              name: 'Care Refresh Expansion',
              desc: 'Drone registered within 48h with no accidental replacement coverage.',
              count: segmentCustomers(customers, 'care_plan_eligible').length,
              totalCohort: '1,120 Pilots',
              tags: ['Care Eligible', 'Protection Gap', 'Lifecycle']
            },
            {
              id: 'flight_club_vip',
              name: 'Flight Club Ambassadors',
              desc: 'Verified Flight Club instructors with 50+ recorded flight hours.',
              count: segmentCustomers(customers, 'flight_club_vip').length,
              totalCohort: '640 Top Flight Creators',
              tags: ['Flight Club Verified', 'Referral Active', 'Beta Testers']
            }
          ].map((seg) => (
            <div
              key={seg.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-purple-400 tracking-wider font-mono">
                    Cohort Segment
                  </span>
                  <span className="text-xs bg-purple-950/60 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    {seg.totalCohort}
                  </span>
                </div>
                <h4 className="text-base font-bold text-zinc-100">{seg.name}</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{seg.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {seg.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] rounded font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">
                  {seg.count} Seed Profile(s)
                </span>
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Audience Exported',
                      message: `Segment "${seg.name}" synced to Marketing Automation Center.`
                    });
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Target Audience
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOMER 360 DRILL-DOWN MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl uppercase shadow-lg">
                  {selectedCustomer.firstName[0]}
                  {selectedCustomer.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-zinc-100">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 text-xs rounded-full font-bold uppercase">
                      {selectedCustomer.loyaltyTier} Pilot
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-full font-semibold">
                      {selectedCustomer.healthStatus.toUpperCase()} HEALTH
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                    <span>{selectedCustomer.email}</span>
                    <span>•</span>
                    <span>{selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>{selectedCustomer.countryName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-zinc-400 hover:text-zinc-100 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-zinc-800 px-6 bg-zinc-950/50">
              <button
                onClick={() => setCustomerModalTab('overview')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  customerModalTab === 'overview'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                360° Profile Overview
              </button>

              <button
                onClick={() => setCustomerModalTab('cdp_events')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  customerModalTab === 'cdp_events'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CDP Event Stream ({cdpEvents.filter((e) => e.customerId === selectedCustomer.id).length})
              </button>

              <button
                onClick={() => setCustomerModalTab('fleet_hardware')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  customerModalTab === 'fleet_hardware'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Hardware Fleet & Serial Numbers
              </button>

              <button
                onClick={() => setCustomerModalTab('loyalty_comms')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  customerModalTab === 'loyalty_comms'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Loyalty & Flight Club Perks
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {customerModalTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Intelligence Matrix */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-semibold">Lifetime Value</div>
                      <div className="text-xl font-bold text-zinc-100 mt-1">
                        {formatPrice(selectedCustomer.lifetimeValueEur, currency)}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                        {selectedCustomer.totalOrders} total orders
                      </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-semibold">Lead Score</div>
                      <div className="text-xl font-bold text-amber-400 mt-1">
                        {selectedCustomer.leadScore}/1000
                      </div>
                      <div className="text-[11px] text-amber-300 font-bold uppercase">
                        {selectedCustomer.leadCategory} Lead
                      </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-semibold">Pilot Points</div>
                      <div className="text-xl font-bold text-sky-400 mt-1">
                        {selectedCustomer.loyaltyAccount.pointsBalance.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {selectedCustomer.loyaltyAccount.lifetimePoints.toLocaleString()} lifetime
                      </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-semibold">Engagement</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        {selectedCustomer.engagementScore}%
                      </div>
                      <div className="text-[11px] text-zinc-400">Review score: {selectedCustomer.reviewScore}/5</div>
                    </div>
                  </div>

                  {/* Identity Resolution Graph */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
                    <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      CDP Identity Resolution & Touchpoints
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Resolved Customer ID:</span>
                          <span className="font-mono text-zinc-200">{selectedCustomer.id}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Primary Email:</span>
                          <span className="font-mono text-zinc-200">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Verified Phone:</span>
                          <span className="font-mono text-zinc-200">{selectedCustomer.phone}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Marketing Consent (GDPR):</span>
                          <span className="text-emerald-400 font-semibold">
                            {selectedCustomer.marketingConsent ? 'Opted-In (Double Verified)' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Last Purchase:</span>
                          <span className="font-mono text-zinc-200">
                            {selectedCustomer.lastPurchaseDate || 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900">
                          <span className="text-zinc-500">Account Created:</span>
                          <span className="font-mono text-zinc-200">
                            {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Tags & Internal Notes */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
                    <div className="text-xs uppercase font-bold text-zinc-400">Behavioral Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg font-medium flex items-center gap-1.5"
                        >
                          <Tag className="w-3 h-3 text-blue-400" />
                          {t}
                        </span>
                      ))}
                    </div>
                    {selectedCustomer.notes && (
                      <div className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 italic mt-2">
                        "{selectedCustomer.notes}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {customerModalTab === 'cdp_events' && (
                <div className="space-y-3">
                  {cdpEvents
                    .filter((e) => e.customerId === selectedCustomer.id || e.customerEmail === selectedCustomer.email)
                    .map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-zinc-200 uppercase font-mono">
                            {evt.eventType.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {JSON.stringify(evt.metadata)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-emerald-400 font-bold font-mono">
                            +{evt.scoreDelta} Pts
                          </span>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            {new Date(evt.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {customerModalTab === 'fleet_hardware' && (
                <div className="space-y-4">
                  <div className="text-sm font-bold text-zinc-200">Registered Drone Fleet</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCustomer.ownedSerialNumbers.map((sn, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-200">Aircraft S/N #{idx + 1}</span>
                          <span className="text-[10px] bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-mono">
                            Warranty Active
                          </span>
                        </div>
                        <div className="text-sm font-mono text-blue-400 font-bold">{sn}</div>
                        <div className="text-xs text-zinc-400">
                          Hardware: {selectedCustomer.ownedProducts[idx] || 'DJI Drone Unit'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customerModalTab === 'loyalty_comms' && (
                <div className="space-y-4">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Tier Benefits — {selectedCustomer.loyaltyTier.toUpperCase()}
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {selectedCustomer.loyaltyAccount.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <div className="text-xs text-zinc-500 font-mono">
                Active In-Store Context: {currentCustomer.id === selectedCustomer.id ? 'Selected' : 'Standby'}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentCustomerId(selectedCustomer.id);
                    addToast({
                      type: 'success',
                      title: 'Active Pilot Profile Switched',
                      message: `Now operating storefront as ${selectedCustomer.firstName} ${selectedCustomer.lastName}.`
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Simulate Storefront As This Pilot
                </button>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
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

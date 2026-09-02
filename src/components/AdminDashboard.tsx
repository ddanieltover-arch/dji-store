import React, { useState } from 'react';
import {
  ShieldAlert,
  Package,
  Truck,
  CreditCard,
  Building2,
  QrCode,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  UploadCloud,
  Check,
  Star,
  ThumbsUp,
  X,
  RefreshCw,
  Layers,
  Database,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Filter,
  Users,
  Award,
  Send,
  Gift,
  Zap,
  Settings,
  Boxes
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { EUROPEAN_WAREHOUSES } from '../data/warehouses';
import { SEARCH_SYNONYMS, TYPO_DICTIONARY } from '../data/searchSynonyms';
import { DocumentModal } from './DocumentModal';
import { PlacedOrder, ReturnRequest } from '../types';
import { CdpIntelligenceConsole } from './crm/CdpIntelligenceConsole';
import { MarketingAutomationCenter } from './crm/MarketingAutomationCenter';
import { LoyaltyRewardsAdmin } from './crm/LoyaltyRewardsAdmin';
import { AdminOrderEditModal } from './admin/AdminOrderEditModal';

type AdminSection = 'orders' | 'products' | 'settings';

type AdminSubTab =
  | 'orders'
  | 'returns_rma'
  | 'inventory_wms'
  | 'reviews_moderation'
  | 'sync_engine'
  | 'search_intelligence'
  | 'cdp_crm'
  | 'automation_campaigns'
  | 'loyalty_program';

const TAB_SECTION: Record<AdminSubTab, AdminSection> = {
  orders: 'orders',
  returns_rma: 'orders',
  inventory_wms: 'products',
  reviews_moderation: 'products',
  sync_engine: 'products',
  search_intelligence: 'settings',
  cdp_crm: 'settings',
  automation_campaigns: 'settings',
  loyalty_program: 'settings'
};

const DEFAULT_SUB_TAB: Record<AdminSection, AdminSubTab> = {
  orders: 'orders',
  products: 'inventory_wms',
  settings: 'search_intelligence'
};

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    advanceOrderStatus,
    verifyOrderPayment,
    rmas,
    warranties,
    setViewMode,
    currency,
    addToast,
    reviews,
    approveReview,
    rejectReview,
    depotStocks,
    updateDepotStockUnits,
    searchAnalytics,
    syncJob,
    isSyncing,
    runLiveCatalogSync,
    approveCatalogDiff,
    rejectCatalogDiff,
    navigateToPdp
  } = useStore();

  const [activeSection, setActiveSection] = useState<AdminSection>('orders');
  const [activeTab, setActiveTab] = useState<AdminSubTab>('orders');

  const [orderFilter, setOrderFilter] = useState<'all' | 'payment_verifying' | 'confirmed' | 'dispatched'>('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [editingOrder, setEditingOrder] = useState<PlacedOrder | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending_moderation' | 'approved' | 'rejected'>('all');

  // Document Modal state
  const [activeDoc, setActiveDoc] = useState<{
    type: 'vat_invoice' | 'packing_slip' | 'ce_declaration' | 'shipping_label' | 'b2b_quote';
    data: any;
  } | null>(null);

  // Revenue metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalEur, 0);
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'payment_verifying');
  const pendingReviews = reviews.filter((r) => r.status === 'pending_moderation');

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.paymentStatus !== orderFilter) return false;
    if (searchOrder) {
      const q = searchOrder.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.lastName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter !== 'all' && r.status !== reviewFilter) return false;
    return true;
  });

  const selectSection = (section: AdminSection) => {
    setActiveSection(section);
    setActiveTab(DEFAULT_SUB_TAB[section]);
  };

  const selectSubTab = (tab: AdminSubTab) => {
    setActiveTab(tab);
    setActiveSection(TAB_SECTION[tab]);
  };

  const mainNavClass = (section: AdminSection) =>
    `flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl text-sm font-extrabold transition-all ${
      activeSection === section
        ? 'bg-[#E30613] text-white shadow-lg shadow-red-900/25 scale-[1.02]'
        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`;

  const subNavClass = (tab: AdminSubTab) =>
    `px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
      activeTab === tab
        ? 'bg-[#1D1D1F] text-white shadow-xs'
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Navigation Banner */}
      <div className="bg-[#111113] text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white font-black text-xs px-2.5 py-1 rounded">
              ADMIN
            </span>
            <span className="font-extrabold text-lg text-white">DJI Store EU Operations Console</span>
            <span className="text-[11px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">
              v7.5 Enterprise
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Frankfurt Logistics Hub • Multi-Depot WMS • Dynamic Catalog Ingestion Engine • Review Moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('home')}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition-colors"
          >
            ← Exit to Storefront
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total Orders
          </span>
          <div className="text-2xl font-black text-gray-900">{orders.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Live Storefront</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Gross Revenue
          </span>
          <div className="text-2xl font-black text-[#1D1D1F]">
            {formatPrice(totalRevenue, currency)}
          </div>
          <span className="text-[10px] text-gray-500">19% German VAT Included</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Pending Wire Verification
          </span>
          <div className="text-2xl font-black text-amber-600">{pendingOrders.length}</div>
          <span className="text-[10px] text-amber-600 font-semibold">SEPA / Crypto Pending</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Review Queue
          </span>
          <div className="text-2xl font-black text-blue-600">{pendingReviews.length} Pending</div>
          <span className="text-[10px] text-blue-600 font-semibold">European Pilots</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Sync Pipeline Status
          </span>
          <div className="text-lg font-black text-purple-600 truncate">
            {syncJob.currentStage.replace(/_/g, ' ').toUpperCase()}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">
            {syncJob.pendingDiffs.filter((d) => d.status === 'pending').length} Diffs Ready
          </span>
        </div>
      </div>

      {/* Primary navigation — Orders · Products · Settings */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={() => selectSection('orders')} className={mainNavClass('orders')}>
            <Package className="w-5 h-5" />
            Orders
            {pendingOrders.length > 0 && (
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeSection === 'orders' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => selectSection('products')} className={mainNavClass('products')}>
            <Boxes className="w-5 h-5" />
            Products
            {pendingReviews.length > 0 && (
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeSection === 'products' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {pendingReviews.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => selectSection('settings')} className={mainNavClass('settings')}>
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Section sub-navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 pb-2">
            {activeSection === 'orders' && 'Order management'}
            {activeSection === 'products' && 'Catalog & inventory'}
            {activeSection === 'settings' && 'Store configuration'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {activeSection === 'orders' && (
              <>
                <button type="button" onClick={() => selectSubTab('orders')} className={subNavClass('orders')}>
                  Payment verification ({orders.length})
                </button>
                <button type="button" onClick={() => selectSubTab('returns_rma')} className={subNavClass('returns_rma')}>
                  <RotateCcw className="w-3 h-3 text-rose-500" />
                  RMA & returns ({rmas.filter((r) => r.status === 'requested').length})
                </button>
              </>
            )}

            {activeSection === 'products' && (
              <>
                <button type="button" onClick={() => selectSubTab('inventory_wms')} className={subNavClass('inventory_wms')}>
                  WMS logistics ({EUROPEAN_WAREHOUSES.length} depots)
                </button>
                <button type="button" onClick={() => selectSubTab('reviews_moderation')} className={subNavClass('reviews_moderation')}>
                  Reviews ({pendingReviews.length} pending)
                </button>
                <button type="button" onClick={() => selectSubTab('sync_engine')} className={subNavClass('sync_engine')}>
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  Catalog ingestion
                </button>
              </>
            )}

            {activeSection === 'settings' && (
              <>
                <button type="button" onClick={() => selectSubTab('search_intelligence')} className={subNavClass('search_intelligence')}>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Search & synonyms
                </button>
                <button type="button" onClick={() => selectSubTab('cdp_crm')} className={subNavClass('cdp_crm')}>
                  <Users className="w-3 h-3 text-blue-500" />
                  Customer intelligence
                </button>
                <button type="button" onClick={() => selectSubTab('automation_campaigns')} className={subNavClass('automation_campaigns')}>
                  <Send className="w-3 h-3 text-purple-500" />
                  Marketing automation
                </button>
                <button type="button" onClick={() => selectSubTab('loyalty_program')} className={subNavClass('loyalty_program')}>
                  <Award className="w-3 h-3 text-amber-500" />
                  Loyalty program
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: ORDERS & WIRE VERIFICATION */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search order ref, customer or email..."
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs w-64 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-gray-500">Filter:</span>
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg ${
                  orderFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('payment_verifying')}
                className={`px-3 py-1.5 rounded-lg ${
                  orderFilter === 'payment_verifying' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Needs Verification ({pendingOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg ${
                  orderFilter === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Confirmed / Dispatched
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer & Country</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50/80">
                    <td className="p-4">
                      <span className="font-mono font-bold text-gray-900 block">{order.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 block">
                        {order.customer.firstName} {order.customer.lastName}
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {order.shippingAddress.city}, {order.shippingAddress.countryCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-800 font-medium truncate block max-w-xs">
                        {order.items.map((i) => `${i.quantity}x ${i.productName || i.sku}`).join(', ')}
                      </span>
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      {formatPrice(order.totalEur, currency)}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-700 block">
                        {order.paymentMethod === 'bank_transfer_sepa' || order.paymentMethod === 'sepa_bank_wire' ? '🏦 SEPA Bank Wire' : '⚡ Web3 USDT/BTC'}
                      </span>
                      {order.paymentVerification?.senderMatched && (
                        <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Match</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          order.paymentStatus === 'confirmed' || order.paymentStatus === 'dispatched' || order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status ? order.status.replace(/_/g, ' ') : order.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-y-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.paymentStatus === 'payment_verifying' ? (
                          <button
                            onClick={() => {
                              verifyOrderPayment(order.orderNumber, {
                                ibanMatched: true,
                                senderMatched: true,
                                amountMatched: true,
                                referenceMatched: true
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                          >
                            Verify Wire
                          </button>
                        ) : order.status === 'confirmed' || order.paymentStatus === 'confirmed' ? (
                          <button
                            onClick={() => advanceOrderStatus(order.orderNumber, 'shipped')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                          >
                            Ship DHL
                          </button>
                        ) : order.status === 'shipped' ? (
                          <button
                            onClick={() => advanceOrderStatus(order.orderNumber, 'delivered')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">
                            {order.trackingToken}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setEditingOrder(order)}
                          className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-semibold inline-flex items-center gap-1"
                          title="Edit order details"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete order ${order.orderNumber}? This cannot be undone.`
                              )
                            ) {
                              deleteOrder(order.orderNumber);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold inline-flex items-center gap-1"
                          title="Delete order"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1.5: RETURNS & RMA MANAGEMENT */}
      {activeTab === 'returns_rma' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                European Return Merchandise Authorization (RMA) Portal
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Statutory 14-day cooling off returns, defective hardware RMAs, and DJI Care replacement workflows.
              </p>
            </div>
            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
              {rmas.length} Total Requests
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">RMA Number</th>
                  <th className="p-4">Order Ref & Date</th>
                  <th className="p-4">Item & Reason</th>
                  <th className="p-4">Return Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rmas.map((rma) => (
                  <tr key={rma.id} className="hover:bg-gray-50/80">
                    <td className="p-4">
                      <span className="font-mono font-bold text-gray-900 block">{rma.rmaNumber}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{rma.serialNumber}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 block">{rma.orderNumber}</span>
                      <span className="text-[11px] text-gray-500">{rma.createdAt}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 block">{rma.productName}</span>
                      <span className="text-[11px] text-gray-500 capitalize">{rma.reason.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-700 uppercase block text-[11px]">
                        {rma.returnMethod}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {rma.refundMethod.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          rma.status === 'refunded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rma.status === 'item_received'
                            ? 'bg-blue-100 text-blue-800'
                            : rma.status === 'approved'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rma.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveDoc({ type: 'shipping_label', data: rma })}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px]"
                      >
                        Print Return Waybill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-DEPOT WMS INVENTORY */}
      {activeTab === 'inventory_wms' && (
        <div className="space-y-6">
          {/* Warehouses Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EUROPEAN_WAREHOUSES.map((w) => (
              <div key={w.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-900 text-sm">{w.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">{w.code}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {w.city}, {w.countryCode} — {w.isPrimaryHub ? 'Central European Hub' : 'Regional Gateway'}
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Carrier: <strong>{w.carrierService}</strong></span>
                  <span className="text-emerald-700 font-bold">Cutoff {w.cutoffTimeUtc} UTC</span>
                </div>
              </div>
            ))}
          </div>

          {/* Product Variant Depot Matrix */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">European Multi-Depot Stock Matrix</h4>
                <p className="text-xs text-gray-500">Live allocation per variant across Frankfurt, Amsterdam, and Paris</p>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Model & Combo</th>
                  <th className="p-4">SKU Code</th>
                  <th className="p-4">FRA-01 (Frankfurt)</th>
                  <th className="p-4">AMS-02 (Amsterdam)</th>
                  <th className="p-4">CDG-03 (Paris)</th>
                  <th className="p-4">Total EU Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DJI_PRODUCTS.slice(0, 7).flatMap((prod) =>
                  prod.variants.map((v) => {
                    const stocks = depotStocks[v.id] || [];
                    const fra = stocks.find((s) => s.depotId === 'depot-fra-01')?.stockUnits ?? v.stockQuantity;
                    const ams = stocks.find((s) => s.depotId === 'depot-ams-02')?.stockUnits ?? 8;
                    const cdg = stocks.find((s) => s.depotId === 'depot-cdg-03')?.stockUnits ?? 5;
                    const total = fra + ams + cdg;

                    return (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="p-4 font-semibold text-gray-900">
                          <span className="font-bold block">{prod.modelName}</span>
                          <span className="text-[11px] text-gray-500">{v.comboName}</span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-gray-500">{v.sku}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={fra}
                              onChange={(e) => updateDepotStockUnits(v.id, 'depot-fra-01', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-gray-300 font-bold text-xs focus:outline-none focus:border-black"
                            />
                            <span className="text-[10px] text-gray-400">units</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={ams}
                              onChange={(e) => updateDepotStockUnits(v.id, 'depot-ams-02', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-gray-300 font-bold text-xs focus:outline-none focus:border-black"
                            />
                            <span className="text-[10px] text-gray-400">units</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={cdg}
                              onChange={(e) => updateDepotStockUnits(v.id, 'depot-cdg-03', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-gray-300 font-bold text-xs focus:outline-none focus:border-black"
                            />
                            <span className="text-[10px] text-gray-400">units</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-gray-900">{total} Units</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS & PILOT MODERATION */}
      {activeTab === 'reviews_moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-semibold">Moderation Queue Filter:</span>
              {(['all', 'pending_moderation', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setReviewFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                    reviewFilter === st
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <span className="text-gray-400 font-medium">Total Reviews in System: {reviews.length}</span>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{rev.authorName}</span>
                      <span className="text-xs text-gray-500">({rev.authorLocation})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'pending_moderation'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rev.status.replace(/_/g, ' ')}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Serial Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Product ID: <strong className="text-gray-700">{rev.productId}</strong> • License:{' '}
                      <span className="text-blue-600">{rev.pilotCertification || 'Recreational'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{rev.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.content}</p>
                </div>

                {/* Serial Check */}
                {rev.verifiedSerialNumber && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                    <span className="text-gray-500">Hardware Serial Number:</span>
                    <span className="font-mono font-bold text-gray-900">{rev.verifiedSerialNumber}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => approveReview(rev.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Approve & Publish to Store
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => rejectReview(rev.id)}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold text-xs"
                    >
                      Reject Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC REFERENCE SYNCHRONIZATION PIPELINE */}
      {activeTab === 'sync_engine' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                    Continuous Sync Architecture
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">DOM Crawler & Schema Normalizer</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  Reference Website Dynamic Ingestion Engine
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated scraping, payload parsing, EASA Class tag validation, and semantic change diffing.
                </p>
              </div>

              <button
                disabled={isSyncing}
                onClick={runLiveCatalogSync}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Running Ingestion Pipeline...' : 'Trigger Immediate Catalog Sync'}
              </button>
            </div>

            {/* Stage Progress Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">
                  Current Pipeline Stage: <strong className="text-purple-600">{syncJob.currentStage.replace(/_/g, ' ').toUpperCase()}</strong>
                </span>
                <span className="text-gray-500">{syncJob.progressPercent}% Complete</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${syncJob.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Live Pipeline Execution Logs */}
            <div className="bg-[#111113] text-gray-200 rounded-2xl p-5 font-mono text-xs space-y-2 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-gray-800 font-sans font-bold">
                <span>Ingestion Pipeline Terminal Output</span>
                <span>Worker: Frankfurt Node 01</span>
              </div>
              {syncJob.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-bold shrink-0 uppercase text-[10px] px-1.5 py-0.2 rounded ${
                      log.level === 'success'
                        ? 'bg-emerald-950 text-emerald-400'
                        : log.level === 'warn'
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-blue-950 text-blue-400'
                    }`}
                  >
                    {log.stage}
                  </span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>

            {/* Pending Semantic Catalog Diffs */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Detected Reference Catalog Updates ({syncJob.pendingDiffs.length})
              </h4>

              <div className="space-y-3">
                {syncJob.pendingDiffs.map((diff) => (
                  <div
                    key={diff.id}
                    className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">
                          {diff.productModelName}
                        </span>
                        <span className="text-xs text-gray-500">
                          Field: <strong className="font-mono text-purple-700">{diff.fieldModified}</strong>
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          diff.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : diff.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {diff.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                          Previous Catalog Value
                        </span>
                        <span className="text-gray-700 line-through">{diff.oldValue}</span>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold block mb-1">
                          Newly Ingested Reference Value
                        </span>
                        <span className="text-emerald-950 font-bold">{diff.newValue}</span>
                      </div>
                    </div>

                    {diff.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => rejectCatalogDiff(diff.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                        >
                          Discard Diff
                        </button>
                        <button
                          onClick={() => approveCatalogDiff(diff.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Approve & Deploy to Store
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEARCH SYNONYMS & TYPO ENGINE */}
      {activeTab === 'search_intelligence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Synonyms & Intent Dictionary */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Active Synonyms & Flight Intents</h4>
                <p className="text-xs text-gray-500">
                  Maps customer jargon to strict catalog categories and EASA classifications.
                </p>
              </div>

              <div className="space-y-2">
                {SEARCH_SYNONYMS.map((item) => (
                  <div key={item.trigger} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-gray-900">{item.trigger}</span>
                      {item.easaHint && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                          {item.easaHint}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {item.synonyms.map((syn, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typo Correction Engine */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Fuzzy Typo Tolerance Table</h4>
                <p className="text-xs text-gray-500">
                  Instant real-time auto-correction for common customer spelling errors.
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(TYPO_DICTIONARY).map(([typo, corrected]) => (
                  <div key={typo} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-900 line-through">{typo}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded">
                      {corrected}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Analytics Log */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Live Search Analytics Stream</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Search Query</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Results Count</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {searchAnalytics.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">"{evt.query}"</td>
                      <td className="p-3 text-gray-400">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-bold">{evt.resultsCount} models</td>
                      <td className="p-3 font-mono text-gray-500">{evt.executionTimeMs} ms</td>
                      <td className="p-3">
                        {evt.isZeroResult ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                            Zero Results
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CDP & CUSTOMER INTELLIGENCE */}
      {activeTab === 'cdp_crm' && <CdpIntelligenceConsole />}

      {/* TAB: MARKETING AUTOMATION & TRIGGERS */}
      {activeTab === 'automation_campaigns' && <MarketingAutomationCenter />}

      {/* TAB: DJI PILOT LOYALTY & REWARDS ADMIN */}
      {activeTab === 'loyalty_program' && <LoyaltyRewardsAdmin />}

      {/* Official Document Viewer Modal */}
      {activeDoc && (
        <DocumentModal
          documentType={activeDoc.type}
          data={activeDoc.data}
          onClose={() => setActiveDoc(null)}
        />
      )}

      {editingOrder && (
        <AdminOrderEditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={updateOrder}
        />
      )}
    </div>
  );
};

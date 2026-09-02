import React, { useEffect, useState } from 'react';
import {
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  FileText,
  Building2,
  Bell,
  Settings,
  User,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
  AlertCircle,
  Download,
  Printer,
  Search,
  ArrowRight,
  Shield,
  Sparkles,
  QrCode,
  Check,
  X,
  RefreshCw,
  Mail,
  Smartphone,
  Info,
  Award,
  Gift,
  Users,
  Plane,
  BriefcaseBusiness,
  Wrench
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  PlacedOrder,
  OrderStatus,
  AccountTab,
  WarrantyRegistration,
  DjiCarePlan,
  ReturnRequest,
  CustomerNotification,
  B2bQuote
} from '../types';
import { formatPrice } from '../data/currency';
import { DJI_PRODUCTS } from '../data/products';
import { EUROPEAN_WAREHOUSES } from '../data/warehouses';
import { DocumentModal, DocumentType } from './DocumentModal';
import { LoyaltyPortalTab } from './loyalty/LoyaltyPortalTab';
import { ReferralsFlightClubTab } from './loyalty/ReferralsFlightClubTab';
import { RecommendationsTab } from './loyalty/RecommendationsTab';
import { BusinessAccountPortal } from './enterprise/BusinessAccountPortal';
import { ServiceAccountPortal } from './service/ServiceAccountPortal';
import { NotificationPreferencesPortal } from './mobile/NotificationPreferencesPortal';

export const CustomerAccountPortal: React.FC = () => {
  const {
    orders,
    warranties,
    registerWarranty,
    carePlans,
    submitCareClaim,
    rmas,
    createRmaRequest,
    notifications,
    markNotificationAsRead,
    b2bProfile,
    b2bQuotes,
    createB2bQuote,
    currentCustomer,
    currency,
    setViewMode,
    addToast,
    navigateToPdp,
    accountActiveTab,
    setAccountActiveTab
  } = useStore();

  const [activeTab, setActiveTabState] = useState<AccountTab>(accountActiveTab || 'dashboard');

  useEffect(() => {
    if (accountActiveTab && accountActiveTab !== activeTab) {
      setActiveTabState(accountActiveTab);
    }
  }, [accountActiveTab]);

  const setActiveTab = (tab: AccountTab) => {
    setActiveTabState(tab);
    setAccountActiveTab(tab);
  };

  // Document modal states
  const [activeDocModal, setActiveDocModal] = useState<DocumentType | null>(null);
  const [selectedOrderForDoc, setSelectedOrderForDoc] = useState<PlacedOrder | null>(null);
  const [selectedWarrantyForDoc, setSelectedWarrantyForDoc] = useState<WarrantyRegistration | null>(null);
  const [selectedRmaForDoc, setSelectedRmaForDoc] = useState<ReturnRequest | null>(null);
  const [selectedQuoteForDoc, setSelectedQuoteForDoc] = useState<B2bQuote | null>(null);

  // Warranty Registration Form state
  const [newWarrantyModel, setNewWarrantyModel] = useState(DJI_PRODUCTS[0].modelName);
  const [newWarrantySerial, setNewWarrantySerial] = useState('');
  const [newWarrantyRemote, setNewWarrantyRemote] = useState('');
  const [newWarrantyOrder, setNewWarrantyOrder] = useState('DJI-EU-100239');

  // RMA Wizard state
  const [rmaStep, setRmaStep] = useState<1 | 2 | 3 | 4>(1);
  const [rmaOrderNum, setRmaOrderNum] = useState('DJI-EU-100188');
  const [rmaReason, setRmaReason] = useState<ReturnRequest['reason']>('buyer_remorse_14day');
  const [rmaNotes, setRmaNotes] = useState('');
  const [rmaSerial, setRmaSerial] = useState('1581F3X90128471EU');
  const [isSubmittingRma, setIsSubmittingRma] = useState(false);

  // VIES Test state
  const [testVatId, setTestVatId] = useState('DE389201948');
  const [viesCheckResult, setViesCheckResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    company?: string;
    reverseCharge?: boolean;
  }>({ status: 'idle' });

  // B2B Quote builder state
  const [quoteModelId, setQuoteModelId] = useState(DJI_PRODUCTS[0].id);
  const [quoteQuantity, setQuoteQuantity] = useState(3);

  // Tracking search state
  const [trackingQuery, setTrackingQuery] = useState('DJI-EU-100239');

  const openDoc = (
    type: DocumentType,
    order?: PlacedOrder | null,
    warranty?: WarrantyRegistration | null,
    rma?: ReturnRequest | null,
    quote?: B2bQuote | null
  ) => {
    setActiveDocModal(type);
    setSelectedOrderForDoc(order || null);
    setSelectedWarrantyForDoc(warranty || null);
    setSelectedRmaForDoc(rma || null);
    setSelectedQuoteForDoc(quote || null);
  };

  const handleRegisterWarrantySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarrantySerial.trim()) {
      addToast({
        type: 'error',
        title: 'Serial Number Required',
        message: 'Please enter the 14 to 18-digit aircraft serial number found on the battery compartment or box.'
      });
      return;
    }

    const reg: WarrantyRegistration = {
      id: `warr-${Date.now()}`,
      orderNumber: newWarrantyOrder,
      productId: 'prod-registered',
      productModel: newWarrantyModel,
      variantComboName: 'Official European Unit',
      aircraftSerial: newWarrantySerial.toUpperCase(),
      remoteSerial: newWarrantyRemote.toUpperCase() || undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString().split('T')[0], // 24-month statutory EU warranty
      status: 'active',
      invoiceUrl: 'https://djii.eu/invoices/statutory_warranty.pdf',
      countryCode: 'DE'
    };

    registerWarranty(reg);
    setNewWarrantySerial('');
    setNewWarrantyRemote('');
    addToast({
      type: 'success',
      title: 'Warranty Activated (24 Months EU)',
      message: `Hardware Serial ${reg.aircraftSerial} is now officially registered with DJI Store EU.`
    });
  };

  const handleCreateRmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRma(true);

    setTimeout(() => {
      const newRma: ReturnRequest = {
        id: `rma-${Date.now()}`,
        rmaNumber: `RMA-EU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        orderNumber: rmaOrderNum,
        productId: 'prod-mini-4-pro',
        productName: 'DJI Mini 4 Pro Fly More Combo',
        comboName: 'Fly More Combo (DJI RC 2)',
        serialNumber: rmaSerial,
        reason: rmaReason,
        detailedExplanation: rmaNotes || 'EU 14-Day Statutory Return Request under Distance Selling Regulations.',
        photoUrls: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80'],
        status: 'approved',
        returnTrackingNumber: `DHL-RET-DE-${Math.floor(1000000 + Math.random() * 9000000)}`,
        returnLabelUrl: 'https://djii.eu/returns/prepaid_dhl_label.pdf',
        refundAmountEur: 1129,
        refundMethod: 'original_sepa',
        inspectionNotes: 'Prepaid DHL Express Return Waybill issued. Ready for courier pickup.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      createRmaRequest(newRma);
      setIsSubmittingRma(false);
      setRmaStep(4);
      addToast({
        type: 'success',
        title: 'RMA Return Authorized',
        message: `RMA Ref: ${newRma.rmaNumber}. Prepaid DHL return shipping label generated.`
      });
    }, 600);
  };

  const handleViesValidate = () => {
    if (testVatId.toUpperCase().startsWith('DE')) {
      setViesCheckResult({
        status: 'valid',
        company: 'Keller Aerial Cinema GmbH (Munich)',
        reverseCharge: false // Domestic German transaction
      });
    } else if (testVatId.toUpperCase().startsWith('FR') || testVatId.toUpperCase().startsWith('NL')) {
      setViesCheckResult({
        status: 'valid',
        company: 'European Aerial Media SARL',
        reverseCharge: true // Intra-community 0% VAT
      });
    } else {
      setViesCheckResult({
        status: 'valid',
        company: 'Verified European Business Entity',
        reverseCharge: true
      });
    }
  };

  const handleCreateQuote = () => {
    const selectedProd = DJI_PRODUCTS.find((p) => p.id === quoteModelId) || DJI_PRODUCTS[0];
    const variant = selectedProd.variants[0];
    const discount = quoteQuantity >= 5 ? 10 : 8;
    const unitPrice = variant.priceEur;
    const subtotal = unitPrice * quoteQuantity * (1 - discount / 100);
    const vat = subtotal * 0.19;

    const newQuote: B2bQuote = {
      id: `quote-${Date.now()}`,
      quoteNumber: `DJI-B2B-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: b2bProfile.companyName,
      vatId: b2bProfile.vatId,
      countryCode: b2bProfile.countryCode,
      items: [
        {
          product: selectedProd,
          variant,
          quantity: quoteQuantity,
          unitPriceEur: unitPrice,
          discountPercent: discount
        }
      ],
      subtotalEur: subtotal,
      discountEur: unitPrice * quoteQuantity * (discount / 100),
      vatEur: vat,
      totalEur: subtotal + vat,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      status: 'approved'
    };

    createB2bQuote(newQuote);
    addToast({
      type: 'success',
      title: 'B2B Quotation Generated',
      message: `Formal pro-forma quotation ${newQuote.quoteNumber} created with ${discount}% commercial volume discount.`
    });
  };

  // Most recent order for dashboard banner
  const primaryOrder = orders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Customer Header Banner */}
      <div className="bg-[#111113] text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 flex items-center justify-center font-black text-xl text-white shadow-inner shrink-0">
            LK
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {b2bProfile.contactPerson}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase font-mono flex items-center gap-1">
                <Award className="w-3 h-3" />
                {currentCustomer.loyaltyTier} Pilot ({currentCustomer.loyaltyAccount.pointsBalance.toLocaleString()} Pts)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                EASA Certified Pilot
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                B2B Verified ({b2bProfile.companyName})
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {b2bProfile.billingEmail} • Munich, Germany • Customer Ref: <span className="font-mono text-gray-300">CUST-DE-89210</span>
            </p>
          </div>
        </div>

        {/* Quick Nav Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('loyalty_rewards')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            Rewards ({currentCustomer.loyaltyAccount.pointsBalance.toLocaleString()} pts)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('warranty_care')}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Warranty ({warranties.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition-colors relative"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            Inbox
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Overview Dashboard', icon: Sparkles },
          { id: 'loyalty_rewards', label: `DJI Pilot Rewards (${currentCustomer.loyaltyAccount.pointsBalance.toLocaleString()} Pts)`, icon: Award },
          { id: 'referrals_flight_club', label: 'Flight Club & Referrals', icon: Plane },
          { id: 'recommendations', label: 'Recommended Gear', icon: Sparkles },
          { id: 'orders', label: `Orders & Fulfillment (${orders.length})`, icon: Package },
          { id: 'tracking', label: 'Live DHL Express Tracking', icon: Truck },
          { id: 'warranty_care', label: `Warranty & DJI Care (${warranties.length})`, icon: ShieldCheck },
          { id: 'returns_rma', label: `Returns & RMA (${rmas.length})`, icon: RotateCcw },
          { id: 'downloads', label: 'Downloads & Compliance Docs', icon: FileText },
          { id: 'b2b_tax', label: 'B2B & Tax Exemption (VIES)', icon: Building2 },
          { id: 'business', label: 'Business Portal', icon: BriefcaseBusiness },
          { id: 'service', label: 'Service & Warranty', icon: Wrench },
          { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
          { id: 'settings', label: 'Saved Addresses & Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AccountTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW DASHBOARD */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Orders
              </span>
              <div className="text-2xl font-black text-gray-900">
                {orders.filter((o) => o.status !== 'delivered' && o.status !== 'completed').length} in Flight
              </div>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <Truck className="w-3 h-3" /> DHL Express Air Network
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Registered UAS Hardware
              </span>
              <div className="text-2xl font-black text-emerald-700">
                {warranties.length} Aircraft
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 24-Month EU Statutory Guarantee
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                DJI Care Refresh Cover
              </span>
              <div className="text-2xl font-black text-purple-700">
                {carePlans[0]?.remainingAccidentalReplacements ?? 3} Claims Remaining
              </div>
              <span className="text-[11px] text-purple-700 font-semibold">
                Comprehensive Water & Crash Shield
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                B2B EU VAT Status
              </span>
              <div className="text-xl font-black text-gray-900 truncate">
                {b2bProfile.vatId}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                VIES Validated • Intra-EU Reverse Charge
              </span>
            </div>
          </div>

          {/* Active In-Transit Shipment Showcase */}
          {primaryOrder && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                      Active In-Transit Order
                    </span>
                    <span className="text-xs text-gray-500 font-mono font-bold">
                      {primaryOrder.orderNumber}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    {primaryOrder.items[0]?.productName} ({primaryOrder.items[0]?.comboName})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Dispatched from {primaryOrder.allocation?.warehouseName || 'Frankfurt Hub (FRA-01)'} • Estimated Delivery:{' '}
                    <strong className="text-gray-900">
                      {primaryOrder.dhlShipment?.estimatedDeliveryDate || 'Tomorrow by 12:00 CET'}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTrackingQuery(primaryOrder.orderNumber);
                      setActiveTab('tracking');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track Live Milestone
                  </button>
                  <button
                    onClick={() => openDoc('vat_invoice', primaryOrder)}
                    className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> VAT Invoice
                  </button>
                </div>
              </div>

              {/* Progress Milestones Bar */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      1. Payment Verified
                    </span>
                    <p className="text-[11px] text-emerald-700">SEPA Bank Wire Cleared</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      2. WMS Packed (FRA-01)
                    </span>
                    <p className="text-[11px] text-emerald-700">Bin: {primaryOrder.allocation?.binLocation || 'A-04-03'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1 ring-2 ring-blue-500/20">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                      3. DHL Air Transit
                    </span>
                    <p className="text-[11px] text-blue-700">Leipzig Hub (LEJ) → Munich</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1 opacity-70">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      4. Out for Delivery
                    </span>
                    <p className="text-[11px] text-gray-500">Scheduled Tomorrow 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('warranty_care')}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:border-black cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">
                  Register Aircraft Serial
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Activate statutory 2-year European warranty & instant service validation.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                Register Device <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => setActiveTab('returns_rma')}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:border-black cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-amber-700 transition-colors">
                  14-Day EU Returns & RMA
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Prepaid DHL return shipping labels and automated refund processing.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                Start Return Request <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => setActiveTab('b2b_tax')}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:border-black cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">
                  B2B Quotes & VIES VAT
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Instant intra-community reverse charge validation and wholesale dealer tier pricing.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                Request B2B Quote <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: DJI PILOT REWARDS & LOYALTY */}
      {/* ============================================================ */}
      {activeTab === 'loyalty_rewards' && <LoyaltyPortalTab />}

      {/* ============================================================ */}
      {/* TAB: FLIGHT CLUB & REFERRALS */}
      {/* ============================================================ */}
      {activeTab === 'referrals_flight_club' && <ReferralsFlightClubTab />}

      {/* ============================================================ */}
      {/* TAB: PERSONALIZED RECOMMENDATIONS */}
      {/* ============================================================ */}
      {activeTab === 'recommendations' && <RecommendationsTab />}

      {/* ============================================================ */}
      {/* TAB 2: ORDERS & FULFILLMENT OMS */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200">
            <div>
              <h3 className="font-black text-lg text-gray-900">Your Complete Order History</h3>
              <p className="text-xs text-gray-500">
                All hardware shipments are fulfilled from our certified European logistics network with DHL Express.
              </p>
            </div>

            <button
              onClick={() => setViewMode('plp')}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shrink-0"
            >
              + Browse Storefront
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-black text-base text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        order.status === 'shipped' || order.paymentStatus === 'dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'delivered' || order.paymentStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status?.replace(/_/g, ' ') || order.paymentStatus}
                    </span>
                    {order.allocation && (
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-mono px-2 py-0.5 rounded">
                        Hub: {order.allocation.warehouseCode} (Bin {order.allocation.binLocation})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDoc('vat_invoice', order)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> VAT Invoice
                    </button>
                    <button
                      onClick={() => openDoc('packing_slip', order)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" /> Packing Slip
                    </button>
                    <button
                      onClick={() => {
                        setTrackingQuery(order.orderNumber);
                        setActiveTab('tracking');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track DHL
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-200 bg-gray-50"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.productName}</h4>
                          <span className="text-xs text-gray-500">{item.comboName}</span>
                          {item.serialNumber && (
                            <span className="block font-mono text-[11px] text-blue-600 mt-0.5">
                              Registered Serial: {item.serialNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-gray-900 block">
                          {formatPrice(item.priceEur * item.quantity, currency)}
                        </span>
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer summary */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-gray-500">
                    Ship to:{' '}
                    <strong>
                      {order.shippingAddress.street}, {order.shippingAddress.city} ({order.shippingAddress.countryName})
                    </strong>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-black text-base text-gray-900">
                      {formatPrice(order.totalEur, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: LIVE DHL EXPRESS TRACKING */}
      {/* ============================================================ */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {/* Tracking Search Input */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
            <div className="max-w-xl mx-auto text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
                European Courier Telemetry
              </span>
              <h3 className="text-2xl font-black text-gray-900">
                Live DHL Express Shipment Tracker
              </h3>
              <p className="text-xs text-gray-500">
                Real-time milestone scans across European air hubs and final destination depots.
              </p>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  placeholder="e.g. DJI-EU-100239 or DHL-DE-983847273"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-black"
                />
                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Live Carrier Scans Synced',
                      message: 'Latest DHL Express telemetry fetched from Frankfurt Air Hub.'
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Active Tracking Details Card */}
          {primaryOrder?.dhlShipment && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded">
                    DHL Express European Direct Air
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    Waybill #{primaryOrder.dhlShipment.waybillNumber}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Origin: {primaryOrder.dhlShipment.originHub} → Destination: {primaryOrder.dhlShipment.destinationCity},{' '}
                    {primaryOrder.dhlShipment.destinationCountry}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400 font-bold block">Estimated Arrival</span>
                  <span className="text-base font-black text-emerald-700">
                    {primaryOrder.dhlShipment.estimatedDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Waybill Scans Chronology */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Official Carrier Scan Events</h4>

                <div className="relative border-l-2 border-blue-500 pl-6 space-y-6 ml-2">
                  {primaryOrder.dhlShipment.checkpoints.map((event, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-gray-900 text-xs">{event.statusText}</span>
                          <span className="text-xs text-gray-400 font-mono">{event.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600">Location: {event.location}</p>
                        {event.notes && (
                          <p className="text-[11px] text-blue-600 font-mono mt-1">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Air Waybill Label Preview Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  onClick={() => openDoc('dhl_shipping_label', primaryOrder)}
                  className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> View Official DHL Air Waybill Label
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: WARRANTY & DJI CARE REFRESH CENTER */}
      {/* ============================================================ */}
      {activeTab === 'warranty_care' && (
        <div className="space-y-8">
          {/* Active Registrations Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-gray-900">Your Registered Aircraft Hardware</h3>
                <p className="text-xs text-gray-500">
                  Protected under the statutory 24-Month European Union Product Guarantee.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warranties.map((warr) => (
                <div
                  key={warr.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        24-Month EU Guarantee Active
                      </span>
                      <h4 className="font-bold text-gray-900 text-base mt-1">{warr.productModel}</h4>
                      <span className="text-xs text-gray-500">{warr.variantComboName}</span>
                    </div>

                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aircraft Serial:</span>
                      <span className="font-bold text-gray-900">{warr.aircraftSerial}</span>
                    </div>
                    {warr.remoteSerial && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Remote Serial:</span>
                        <span className="text-gray-700">{warr.remoteSerial}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-gray-200 text-[11px]">
                      <span className="text-gray-500">Guarantee Expiry:</span>
                      <span className="font-bold text-emerald-700">{warr.warrantyExpiryDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => openDoc('ce_declaration', null, warr)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> CE Declaration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DJI Care Refresh Protection Section */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-800/60 pb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold uppercase border border-purple-400/30">
                  Accidental & Flyaway Shield
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  DJI Care Refresh Active Coverage
                </h3>
                <p className="text-xs text-purple-200">
                  Priority express replacements for water damage, collision damage, and flyaway incidents.
                </p>
              </div>

              <button
                onClick={() => {
                  submitCareClaim('care-001', 'accidental_damage');
                  addToast({
                    type: 'success',
                    title: 'Care Claim Initialized',
                    message: 'DJI European Service Center Frankfurt has received your priority replacement claim.'
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-colors shadow-xs"
              >
                + Submit Damage Replacement Claim
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-950/60 border border-purple-800/80 p-5 rounded-2xl space-y-2">
                <span className="text-xs text-purple-300 font-bold block">
                  Accidental & Water Damage Replacements
                </span>
                <div className="text-2xl font-black text-white">
                  {carePlans[0]?.remainingAccidentalReplacements ?? 3} / {carePlans[0]?.totalAccidentalReplacements ?? 3} Left
                </div>
                <p className="text-[11px] text-purple-300">
                  Replacement unit fee: €75 (delivered in 24-48h across EU)
                </p>
              </div>

              <div className="bg-purple-950/60 border border-purple-800/80 p-5 rounded-2xl space-y-2">
                <span className="text-xs text-purple-300 font-bold block">
                  Flyaway Incident Coverage
                </span>
                <div className="text-2xl font-black text-white">
                  {carePlans[0]?.remainingFlyawayReplacements ?? 1} / {carePlans[0]?.totalFlyawayReplacements ?? 1} Left
                </div>
                <p className="text-[11px] text-purple-300">
                  Account binding verified on DJI RC 2 controller
                </p>
              </div>
            </div>
          </div>

          {/* New Serial Registration Form */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 text-base">Register Additional Aircraft Serial</h4>
              <p className="text-xs text-gray-500">
                Input your hardware serial number from the battery bay or retail box to bind statutory EU warranty.
              </p>
            </div>

            <form onSubmit={handleRegisterWarrantySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Aircraft Model</label>
                <select
                  value={newWarrantyModel}
                  onChange={(e) => setNewWarrantyModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-black font-semibold"
                >
                  {DJI_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.modelName}>
                      {p.modelName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Aircraft Serial Number (SN)</label>
                <input
                  type="text"
                  placeholder="e.g. 1581F4Q89210087DE"
                  value={newWarrantySerial}
                  onChange={(e) => setNewWarrantySerial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Remote Controller Serial (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 37ABG901239841"
                  value={newWarrantyRemote}
                  onChange={(e) => setNewWarrantyRemote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Validate & Activate 24-Month EU Guarantee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: RETURNS & RMA CENTER */}
      {/* ============================================================ */}
      {activeTab === 'returns_rma' && (
        <div className="space-y-8">
          {/* Active RMAs List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-gray-900">Your Return Requests (RMA)</h3>
                <p className="text-xs text-gray-500">
                  14-Day EU Statutory Distance Selling guarantee with complimentary DHL express returns.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {rmas.map((rma) => (
                <div
                  key={rma.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-gray-900">
                          {rma.rmaNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          {rma.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Order Ref: <strong>{rma.orderNumber}</strong> • Created on{' '}
                        {new Date(rma.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDoc('rma_return_label', null, null, rma)}
                        className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Prepaid DHL Return Label
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block mb-1">Item Returning</span>
                      <p className="font-bold text-gray-900">{rma.productName}</p>
                      <p className="text-gray-500 font-mono text-[11px]">SN: {rma.serialNumber}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 font-bold block mb-1">Return Reason</span>
                      <p className="font-semibold text-gray-800 capitalize">
                        {rma.reason.replace(/_/g, ' ')}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{rma.detailedExplanation}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 font-bold block mb-1">Refund Summary</span>
                      <p className="font-black text-emerald-700 text-sm">
                        {formatPrice(rma.refundAmountEur, currency)}
                      </p>
                      <p className="text-[11px] text-gray-500">Method: Original SEPA Bank Account</p>
                    </div>
                  </div>

                  {rma.inspectionNotes && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                      <strong>Fulfillment Note:</strong> {rma.inspectionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RMA Wizard Modal/Section */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Self-Service RMA Wizard
              </span>
              <h4 className="text-lg font-black text-gray-900 mt-1">
                Start a New Hardware Return or Exchange
              </h4>
              <p className="text-xs text-gray-500">
                Select your order, choose the reason code, and immediately print your prepaid DHL return waybill.
              </p>
            </div>

            {rmaStep === 1 && (
              <div className="space-y-4">
                <label className="font-bold text-gray-800 text-xs block">
                  Step 1: Select Eligible Order
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {orders.map((o) => (
                    <div
                      key={o.orderNumber}
                      onClick={() => setRmaOrderNum(o.orderNumber)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        rmaOrderNum === o.orderNumber
                          ? 'border-black bg-gray-50 ring-2 ring-black/10'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-gray-900">{o.orderNumber}</span>
                        <span className="font-bold text-gray-600">{formatPrice(o.totalEur, currency)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {o.items.map((i) => i.productName).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setRmaStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Reason →
                  </button>
                </div>
              </div>
            )}

            {rmaStep === 2 && (
              <div className="space-y-4">
                <label className="font-bold text-gray-800 text-xs block">
                  Step 2: Choose Return Reason
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'buyer_remorse_14day', title: '14-Day EU Statutory Remorse', desc: 'Unused / changed mind within 14 days of receipt' },
                    { id: 'defective_hardware', title: 'Hardware Defect / Malfunction', desc: 'Motor, ESC, or flight controller issue' },
                    { id: 'gimbal_sensor_error', title: 'Gimbal / Camera Error', desc: 'Sensor calibration or gimbal overload alert' },
                    { id: 'wrong_item_received', title: 'Incorrect Item / Combo Sent', desc: 'Received different SKU or missing accessory' }
                  ].map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRmaReason(r.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        rmaReason === r.id
                          ? 'border-black bg-gray-50 ring-2 ring-black/10'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span className="font-bold text-gray-900 block">{r.title}</span>
                      <span className="text-gray-500 text-[11px]">{r.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setRmaStep(1)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setRmaStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {rmaStep === 3 && (
              <form onSubmit={handleCreateRmaSubmit} className="space-y-4 text-xs">
                <label className="font-bold text-gray-800 block">
                  Step 3: Verification & Description
                </label>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Hardware Serial Number</label>
                  <input
                    type="text"
                    value={rmaSerial}
                    onChange={(e) => setRmaSerial(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Description / Defect Details</label>
                  <textarea
                    rows={3}
                    value={rmaNotes}
                    onChange={(e) => setRmaNotes(e.target.value)}
                    placeholder="Provide any details about the defect, unboxing status, or flight conditions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setRmaStep(2)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRma}
                    className="px-6 py-2.5 rounded-xl bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingRma ? 'Generating RMA...' : 'Submit & Generate Prepaid DHL Label'}
                  </button>
                </div>
              </form>
            )}

            {rmaStep === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-gray-900 text-lg">RMA Return Request Approved</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Your prepaid DHL Express return label is ready. Affix the label to your parcel and drop it at any DHL parcel shop across Europe.
                </p>
                <button
                  onClick={() => setRmaStep(1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: DOWNLOADS & COMPLIANCE CENTER */}
      {/* ============================================================ */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-2">
            <h3 className="font-black text-lg text-gray-900">Official Downloads & Legal Documents</h3>
            <p className="text-xs text-gray-500">
              Access your signed commercial invoices, packing slips, and European Aviation Safety Agency (EASA) declarations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-gray-900">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-bold text-gray-900 block">Commercial VAT Tax Invoice</span>
                        <span className="text-[10px] text-gray-500">PDF • 19% DE / 20% FR VAT Compliant</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openDoc('vat_invoice', order)}
                      className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg font-bold text-xs"
                    >
                      View
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-bold text-gray-900 block">Logistics WMS Packing Manifest</span>
                        <span className="text-[10px] text-gray-500">PDF • Warehouse Pick & Bin Checklist</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openDoc('packing_slip', order)}
                      className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg font-bold text-xs"
                    >
                      View
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-gray-900 block">EASA CE Declaration of Conformity</span>
                        <span className="text-[10px] text-gray-500">Official EU Regulation 2019/945 Certificate</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openDoc('ce_declaration', order)}
                      className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg font-bold text-xs"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: B2B & TAX EXEMPTION (VIES) */}
      {/* ============================================================ */}
      {activeTab === 'b2b_tax' && (
        <div className="space-y-8">
          {/* VIES VAT Validation Terminal */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                EU VIES VAT System
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-1">
                European VAT Validation & Reverse Charge Engine
              </h3>
              <p className="text-xs text-gray-500">
                Verify any EU VAT ID to unlock 0% Intra-Community Reverse Charge invoicing across EU member states.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Company VAT Identification Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testVatId}
                    onChange={(e) => setTestVatId(e.target.value)}
                    placeholder="e.g. DE389201948 or FR892019382"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono uppercase focus:outline-none focus:border-black font-bold"
                  />
                  <button
                    onClick={handleViesValidate}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Validate VIES
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Status</span>
                {viesCheckResult.status === 'valid' ? (
                  <div>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> VIES Validated
                    </span>
                    <span className="text-[11px] text-gray-600 block mt-0.5">
                      {viesCheckResult.company}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Ready to test EU VIES API</span>
                )}
              </div>
            </div>
          </div>

          {/* B2B Quotation Builder */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-base">Enterprise Quotation Generator</h4>
                <p className="text-xs text-gray-500">
                  Bulk order volume pricing (5-10% discount) for cinematography studios and industrial operators.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quoteModelId}
                  onChange={(e) => setQuoteModelId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none"
                >
                  {DJI_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.modelName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quoteQuantity}
                  onChange={(e) => setQuoteQuantity(Number(e.target.value))}
                  className="w-16 px-2 py-2 rounded-xl border border-gray-300 text-xs font-bold text-center"
                />

                <button
                  onClick={handleCreateQuote}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  Generate Pro-Forma Quote
                </button>
              </div>
            </div>

            {/* Existing Quotes */}
            <div className="space-y-3">
              {b2bQuotes.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-sm">{q.quoteNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {q.status}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      {q.items.map((i) => `${i.quantity}x ${i.product.modelName} (-${i.discountPercent}%)`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-black text-sm text-gray-900 block">
                        {formatPrice(q.totalEur, currency)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Saved {formatPrice(q.discountEur, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => openDoc('b2b_proforma_quote', null, null, null, q)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 font-bold text-xs shadow-2xs"
                    >
                      View PDF Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'business' && <BusinessAccountPortal />}

      {activeTab === 'service' && <ServiceAccountPortal />}

      {/* ============================================================ */}
      {/* TAB 8: NOTIFICATIONS & COMMUNICATIONS INBOX */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <NotificationPreferencesPortal />

          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-200">
            <div>
              <h3 className="font-black text-lg text-gray-900">Communication & Notification Log</h3>
              <p className="text-xs text-gray-500">
                Automated SMS & Email triggers for payments, warehouse allocation, and live DHL transit events.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.type === 'sms'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {notif.type === 'sms' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{notif.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-100 text-gray-700 uppercase">
                          {notif.event}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 9: SAVED ADDRESSES & SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-black text-lg text-gray-900">Saved European Shipping & Billing Profile</h3>
            <p className="text-xs text-gray-500">
              Primary delivery address for express DHL air freight shipments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Default Delivery Hub</span>
              <p className="font-bold text-gray-900 text-sm">{b2bProfile.contactPerson}</p>
              <p className="text-gray-600">
                Maximilianstraße 35B<br />
                80539 Munich, Germany
              </p>
              <p className="text-blue-700 font-mono text-[11px]">Assigned Hub: FRA-01 Frankfurt (1 Day Transit)</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Notification Preferences</span>
              <div className="space-y-1.5 text-gray-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                  SMS Flight & Courier Dispatch Alerts
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                  SEPA Payment Cleared Email Receipts
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                  Warranty Expiry Notifications (60 Days Prior)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Document Modal Viewer */}
      <DocumentModal
        isOpen={!!activeDocModal}
        onClose={() => setActiveDocModal(null)}
        docType={activeDocModal || 'vat_invoice'}
        order={selectedOrderForDoc}
        warranty={selectedWarrantyForDoc}
        rma={selectedRmaForDoc}
        quote={selectedQuoteForDoc}
      />
    </div>
  );
};

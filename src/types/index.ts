export type Locale = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CHF';

export type EasaClass = 'C0 (<249g)' | 'C1' | 'C2' | 'Open Category';

export interface ProductVariant {
  id: string;
  sku: string;
  comboName: string;
  tagline?: string;
  priceEur: number;
  weightGrams: number;
  includedItems: string[];
  inStock: boolean;
  stockQuantity: number;
}

export interface ProductSpecGroup {
  groupName: string;
  attributes: {
    name: string;
    value: string;
    isHighlight?: boolean;
  }[];
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  modelName: string;
  series:
    | 'Mavic'
    | 'Air'
    | 'Mini'
    | 'Flip'
    | 'Avata'
    | 'Neo'
    | 'Inspire'
    | 'Osmo'
    | 'Pocket'
    | 'Action'
    | 'Osmo360'
    | 'Mobile'
    | 'Ronin'
    | 'Mic'
    | 'Power'
    | 'Education'
    | 'Refurbished'
    | 'Accessories';
  category:
    | 'camera-drones'
    | 'handheld'
    | 'professional'
    | 'accessories'
    | 'power-care'
    | 'power'
    | 'refurbished';
  categoryLabel: string;
  tagline: string;
  description: string;
  basePriceEur: number;
  compareAtPriceEur?: number;
  badgeLabel?: string;
  easaClass?: EasaClass;
  flightTimeMinutes?: number;
  weightGrams: number;
  cameraSensor?: string;
  maxVideoRes?: string;
  transmissionRangeKm?: number;
  images: {
    hero: string;
    gallery: string[];
    cutout: string;
  };
  variants: ProductVariant[];
  specifications: ProductSpecGroup[];
  features: {
    title: string;
    description: string;
    iconName?: string;
  }[];
  compatibleAccessories?: string[]; // IDs of products
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string; // unique item id
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface PlacedOrder {
  orderNumber: string;
  trackingToken: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
  };
  shippingAddress: {
    street: string;
    postalCode: string;
    city: string;
    countryCode: string;
    countryName: string;
  };
  items: {
    productName: string;
    comboName: string;
    sku: string;
    priceEur: number;
    quantity: number;
    imageUrl: string;
    productId?: string;
    variantId?: string;
    serialNumber?: string;
  }[];
  subtotalEur: number;
  discountEur: number;
  vatEur: number;
  vatRatePercent: number;
  shippingEur: number;
  totalEur: number;
  paymentMethod: 'sepa_bank_wire' | 'crypto_usdt' | 'crypto_btc' | 'crypto_eth';
  paymentStatus: 'verifying' | 'confirmed' | 'processing' | 'dispatched' | 'delivered';
  status?: OrderStatus;
  paymentDetails?: {
    senderIban?: string;
    receiptFileName?: string;
    cryptoTxHash?: string;
    cryptoAddress?: string;
  };
  paymentVerification?: OrderPaymentVerification;
  allocation?: OrderFulfillmentAllocation;
  dhlShipment?: DhlShipmentDetails;
  tracking?: {
    carrier: string;
    trackingNumber: string;
    status: 'payment_verifying' | 'order_packed' | 'in_transit' | 'out_for_delivery' | 'delivered';
    estimatedDelivery: string;
    currentLocation: string;
    events: {
      time: string;
      title: string;
      location: string;
      completed: boolean;
    }[];
  };
}

export type ViewMode =
  | 'home'
  | 'plp'
  | 'pdp'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'track-order'
  | 'compare'
  | 'wishlist'
  | 'easa-guide'
  | 'admin'
  | 'account'
  | 'ai-operations'
  | 'security-ops'
  | 'sre-ops'
  | 'qa-ops'
  | 'launch-ops'
  | 'blueprint-ops'
  | 'pim-ops'
  | 'best-sellers';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

// ----------------------------------------------------
// Phase 7.5: Product Reviews & Moderation System
// ----------------------------------------------------
export interface ReviewMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation: string; // e.g. "Munich, Germany"
  countryCode: string; // e.g. "DE", "FR", "NL"
  rating: number; // 1 to 5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verifiedPurchase: boolean;
  verifiedSerialNumber?: string; // e.g. "1581F4Q...EU"
  pilotCertification?: 'A1/A3 Open' | 'A2 Certificate' | 'STS Commercial' | 'Recreational Enthusiast';
  flightHours?: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  userVotedHelpful?: boolean;
  media: ReviewMedia[];
  status: 'approved' | 'pending_moderation' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  adminResponse?: {
    author: string;
    date: string;
    message: string;
  };
}

export interface ReviewRatingSummary {
  averageRating: number;
  totalReviews: number;
  starCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  attributeScores: {
    cameraQuality: number; // 0-100%
    batteryEndurance: number;
    easaEaseOfFlight: number;
    transmissionStability: number;
    buildQuality: number;
  };
  totalVerifiedPurchases: number;
  totalWithMedia: number;
}

// ----------------------------------------------------
// Phase 7.5: Advanced Search & Intelligence Engine
// ----------------------------------------------------
export interface SynonymMapping {
  trigger: string;
  synonyms: string[];
  targetCategory?: string;
  targetSeries?: string;
  easaHint?: EasaClass;
}

export interface SearchResultItem {
  product: Product;
  matchScore: number;
  matchedFields: ('name' | 'tagline' | 'specs' | 'category' | 'synonym' | 'easa')[];
  highlightSnippet?: string;
}

export interface SearchAnalyticsRecord {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  clickedProductId?: string;
  executionTimeMs: number;
  isZeroResult: boolean;
  synonymApplied?: string;
}

// ----------------------------------------------------
// Phase 7.5: Multi-Warehouse Inventory & Routing Logic
// ----------------------------------------------------
export interface WarehouseDepot {
  id: string;
  code: string; // "FRA-01", "AMS-02", "CDG-03"
  name: string;
  countryCode: string;
  city: string;
  isPrimaryHub: boolean;
  transitDaysToEu: {
    DE: number;
    FR: number;
    NL: number;
    BE: number;
    IT: number;
    ES: number;
    AT: number;
    CH: number;
    DK: number;
    SE: number;
    PL: number;
  };
  carrierService: string;
  cutoffTimeUtc: string; // e.g. "16:00"
}

export interface VariantDepotStock {
  depotId: string;
  stockUnits: number;
  reservedUnits: number;
  incomingUnits: number;
  incomingEtaDate?: string;
  reorderPoint: number;
  backorderAllowed: boolean;
  batchDispatchDate?: string;
}

// ----------------------------------------------------
// Phase 7.5: Dynamic Catalog Extraction & Sync Pipeline
// ----------------------------------------------------
export type SyncStage =
  | 'idle'
  | 'crawling_reference'
  | 'extracting_dom'
  | 'normalizing_schema'
  | 'validating_easa'
  | 'media_cdn_sync'
  | 'diffing_revisions'
  | 'awaiting_approval'
  | 'published';

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  stage: SyncStage;
  level: 'info' | 'warn' | 'success' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

export interface CatalogDiffItem {
  id: string;
  productId: string;
  modelName: string;
  changeCategory: 'price' | 'firmware' | 'easa_status' | 'specs' | 'new_variant' | 'new_product';
  field: string;
  oldValue: any;
  newValue: any;
  status: 'pending' | 'approved' | 'rejected';
  suggestedAction: string;
}

export interface SyncJobState {
  jobId: string;
  targetUrl: string;
  currentStage: SyncStage;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  stats: {
    pagesCrawled: number;
    productsDetected: number;
    specsExtracted: number;
    mediaAssetsSynced: number;
    priceChangesFound: number;
    schemaValidationPassRate: number;
  };
  logs: SyncLogEntry[];
  pendingDiffs: CatalogDiffItem[];
}

// ----------------------------------------------------
// Phase 8: Enterprise OMS, Fulfillment & Customer Ops
// ----------------------------------------------------

export type OrderStatus =
  | 'pending_payment'
  | 'payment_under_review'
  | 'confirmed'
  | 'allocated'
  | 'picking'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'rma_requested';

export type PaymentMethod =
  | 'sepa_bank_wire'
  | 'crypto_usdt'
  | 'crypto_btc'
  | 'crypto_eth';

export interface OrderPaymentVerification {
  ibanMatched?: boolean;
  senderMatched?: boolean;
  amountMatched?: boolean;
  referenceMatched?: boolean;
  cryptoCurrency?: 'BTC' | 'ETH' | 'USDT_TRC20' | 'USDT_ERC20';
  cryptoConfirmations?: number;
  cryptoConfirmationsRequired?: number;
  cryptoTxHash?: string;
  cryptoExplorerUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface OrderFulfillmentAllocation {
  warehouseId: string; // 'depot-fra-01' | 'depot-ams-02' | 'depot-cdg-03'
  warehouseCode: string; // 'FRA-01' | 'AMS-02' | 'CDG-03'
  warehouseName: string;
  binLocation: string; // e.g. 'A-04-03'
  priority: 'STANDARD' | 'EXPRESS' | 'PRIORITY_AIR';
  assignedPicker?: string;
  pickedAt?: string;
  packedAt?: string;
  dispatchedAt?: string;
  airWaybillNumber?: string;
}

export interface DhlShipmentMilestone {
  timestamp: string;
  statusText: string;
  location: string;
  completed: boolean;
  carrierStatusCode?: string;
  notes?: string;
}

export interface DhlShipmentDetails {
  id: string;
  orderNumber: string;
  carrier: 'dhl';
  carrierService: string;
  trackingNumber: string;
  waybillNumber: string;
  shippingLabelUrl: string;
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  originHub: string;
  destinationCity: string;
  destinationCountry: string;
  estimatedDeliveryDate: string;
  signedBy?: string;
  weightKg: number;
  checkpoints: DhlShipmentMilestone[];
}

export interface WarrantyRegistration {
  id: string;
  orderNumber: string;
  productId: string;
  productModel: string;
  variantComboName: string;
  aircraftSerial: string;
  remoteSerial?: string;
  batterySerials?: string[];
  purchaseDate: string;
  warrantyExpiryDate: string; // Statutory EU 24-Month Guarantee
  status: 'active' | 'expiring_soon' | 'expired';
  invoiceUrl: string;
  countryCode: string;
  complianceDocUrl?: string;
}

export interface DjiCarePlan {
  id: string;
  orderNumber: string;
  planName: 'DJI Care Refresh 1-Year' | 'DJI Care Refresh 2-Year' | 'DJI Care Enterprise Shield';
  productModel: string;
  aircraftSerial: string;
  coverageStartDate: string;
  coverageExpiryDate: string;
  totalAccidentalReplacements: number;
  remainingAccidentalReplacements: number;
  totalFlyawayReplacements: number;
  remainingFlyawayReplacements: number;
  status: 'active' | 'claim_in_progress' | 'expired';
  claimHistory: {
    id: string;
    date: string;
    type: 'accidental_damage' | 'water_damage' | 'flyaway';
    incidentReport: string;
    status: 'in_review' | 'replacement_shipped' | 'settled';
    replacementTracking?: string;
  }[];
}

export type RmaReason =
  | 'defective_hardware'
  | 'gimbal_sensor_error'
  | 'wrong_item_received'
  | 'buyer_remorse_14day'
  | 'easa_compliance_inquiry'
  | 'shipping_box_damaged';

export type RmaStatus =
  | 'requested'
  | 'under_review'
  | 'approved'
  | 'in_transit'
  | 'received'
  | 'inspected'
  | 'refund_issued'
  | 'rejected';

export interface ReturnRequest {
  id: string;
  rmaNumber: string; // e.g. 'RMA-EU-2026-0891'
  orderNumber: string;
  productId: string;
  productName: string;
  comboName: string;
  serialNumber: string;
  reason: RmaReason;
  detailedExplanation: string;
  photoUrls: string[];
  status: RmaStatus;
  returnTrackingNumber?: string;
  returnLabelUrl?: string;
  refundAmountEur: number;
  refundMethod: 'original_sepa' | 'crypto_wallet' | 'store_credit';
  inspectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationEvent =
  | 'ORDER_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_CONFIRMED'
  | 'ORDER_ALLOCATED'
  | 'ORDER_SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REVIEW_REQUEST'
  | 'WARRANTY_EXPIRING'
  | 'CARE_PLAN_EXPIRING'
  | 'RMA_APPROVED'
  | 'RMA_REFUND_ISSUED';

export interface CustomerNotification {
  id: string;
  type: 'email' | 'sms';
  event: NotificationEvent;
  title: string;
  message: string;
  recipientEmail?: string;
  recipientPhone?: string;
  timestamp: string;
  read: boolean;
  orderNumber?: string;
  actionUrl?: string;
}

export interface B2bCompanyProfile {
  companyName: string;
  vatId: string;
  viesStatus: 'valid' | 'invalid' | 'unverified';
  countryCode: string;
  isReverseChargeEligible: boolean;
  contactPerson: string;
  billingEmail: string;
  phone: string;
  eoriNumber?: string;
}

export interface B2bQuoteItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPriceEur: number;
  discountPercent: number;
}

export interface B2bQuote {
  id: string;
  quoteNumber: string; // 'DJI-B2B-QUOTE-9021'
  companyName: string;
  vatId: string;
  countryCode: string;
  items: B2bQuoteItem[];
  subtotalEur: number;
  discountEur: number;
  vatEur: number;
  totalEur: number;
  createdAt: string;
  validUntil: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'converted_to_order';
}

export type AccountTab =
  | 'dashboard'
  | 'orders'
  | 'tracking'
  | 'loyalty_rewards'
  | 'referrals_flight_club'
  | 'recommendations'
  | 'warranty_care'
  | 'returns_rma'
  | 'downloads'
  | 'b2b_tax'
  | 'notifications'
  | 'settings';

// ==========================================
// PHASE 9: CRM, LOYALTY & CDP INTELLIGENCE
// ==========================================

export type LoyaltyTier = 'pilot' | 'advanced' | 'professional' | 'enterprise';

export interface LoyaltyAccount {
  id: string;
  customerId: string;
  pointsBalance: number;
  tier: LoyaltyTier;
  lifetimePoints: number;
  tierExpiresAt: string;
  perks: string[];
}

export type LoyaltyTransactionType =
  | 'purchase'
  | 'review'
  | 'photo_review'
  | 'video_review'
  | 'warranty_reg'
  | 'flight_club_referral'
  | 'redemption'
  | 'manual_adjustment'
  | 'bonus';

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  pointsDelta: number;
  transactionType: LoyaltyTransactionType;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface LoyaltyRewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  voucherCode?: string;
  discountEur?: number;
  type: 'voucher' | 'accessory' | 'care_upgrade' | 'swag' | 'service';
  category: string;
  imageUrl?: string;
  badge?: string;
}

export type CdpEventType =
  | 'page_view'
  | 'product_view'
  | 'search'
  | 'filter_applied'
  | 'product_compared'
  | 'add_to_cart'
  | 'checkout_started'
  | 'payment_completed'
  | 'review_submitted'
  | 'warranty_registered'
  | 'flight_club_joined'
  | 'email_opened'
  | 'email_clicked'
  | 'sms_clicked'
  | 'reward_redeemed'
  | 'referral_sent';

export interface CdpEvent {
  id: string;
  customerId?: string;
  customerEmail?: string;
  sessionId: string;
  eventType: CdpEventType;
  timestamp: string;
  metadata: Record<string, any>;
  scoreDelta: number;
}

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  countryCode: string;
  countryName: string;
  loyaltyTier: LoyaltyTier;
  loyaltyAccount: LoyaltyAccount;
  lifetimeValueEur: number;
  totalOrders: number;
  ownedProducts: string[];
  ownedSerialNumbers: string[];
  averageOrderValue: number;
  leadScore: number;
  leadCategory: 'cold' | 'warm' | 'hot' | 'vip';
  healthStatus: 'excellent' | 'good' | 'at_risk' | 'dormant';
  engagementScore: number;
  reviewScore: number;
  lastPurchaseDate?: string;
  lastActivityDate?: string;
  marketingConsent: boolean;
  flightClubMember: boolean;
  flightClubDetails?: {
    pilotHandle: string;
    droneFleetCount: number;
    totalFlightHours: number;
    communityRank: string;
    referralCode: string;
    referralsCount: number;
    earningsPoints: number;
  };
  tags: string[];
  notes?: string;
  createdAt: string;
}

export type AutomationTriggerType =
  | 'abandoned_cart'
  | 'browse_abandonment'
  | 'post_purchase_lifecycle'
  | 'warranty_renewal'
  | 'care_plan_upsell'
  | 'flight_club_nurture'
  | 'tier_upgrade';

export interface MarketingAutomationTrigger {
  id: string;
  name: string;
  type: AutomationTriggerType;
  triggerCondition: string;
  delayHours: number;
  channel: 'email' | 'sms' | 'push';
  subject: string;
  previewText: string;
  contentTemplate: string;
  isActive: boolean;
  totalSent: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenueGeneratedEur: number;
}

export type AudienceSegment =
  | 'all'
  | 'high_value'
  | 'inactive_pilots'
  | 'accessory_buyers'
  | 'care_plan_eligible'
  | 'warranty_expiring'
  | 'flight_club_vip';

export interface MarketingCampaign {
  id: string;
  title: string;
  targetAudience: AudienceSegment;
  audienceCount: number;
  channel: 'email' | 'sms' | 'multi_channel';
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  subject: string;
  content: string;
  incentiveVoucher?: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  revenueGeneratedEur: number;
  launchedAt?: string;
}

export interface ReferralRecord {
  id: string;
  referrerCustomerId: string;
  refereeEmail: string;
  refereeName: string;
  status: 'invited' | 'registered' | 'ordered' | 'rewarded';
  voucherCode: string;
  orderNumber?: string;
  pointsAwarded: number;
  createdAt: string;
  completedAt?: string;
}



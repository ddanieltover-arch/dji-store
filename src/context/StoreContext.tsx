import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  PlacedOrder,
  ViewMode,
  Locale,
  CurrencyCode,
  ToastMessage,
  ProductReview,
  VariantDepotStock,
  SyncJobState,
  CatalogDiffItem,
  SearchAnalyticsRecord,
  OrderStatus,
  OrderPaymentVerification,
  WarrantyRegistration,
  DjiCarePlan,
  ReturnRequest,
  CustomerNotification,
  B2bCompanyProfile,
  B2bQuote,
  AccountTab,
  CustomerProfile,
  LoyaltyRewardItem,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  CdpEvent,
  MarketingAutomationTrigger,
  MarketingCampaign,
  ReferralRecord,
  LoyaltyTier
} from '../types';
import { DJI_PRODUCTS, syncRuntimeCatalog } from '../data/products';
import { pathFromStore, storeFromPath } from '../lib/routing';
import { LOCALES } from '../data/locales';
import { INITIAL_REVIEWS } from '../data/reviews';
import { INITIAL_DEPOT_STOCK } from '../data/warehouses';
import { initializeInventoryFromCatalog } from '../lib/pim/wave1Execution';
import { INITIAL_SYNC_JOB } from '../data/syncPipeline';
import {
  INITIAL_ORDERS,
  INITIAL_WARRANTIES,
  INITIAL_CARE_PLANS,
  INITIAL_RMAS,
  INITIAL_NOTIFICATIONS,
  INITIAL_B2B_PROFILE,
  INITIAL_B2B_QUOTES,
  determineOptimalWarehouse
} from '../data/orderOperations';
import {
  INITIAL_CUSTOMERS,
  INITIAL_LOYALTY_REWARDS,
  INITIAL_AUTOMATION_TRIGGERS,
  INITIAL_CAMPAIGNS,
  INITIAL_CDP_EVENTS,
  INITIAL_REFERRALS,
  determineLoyaltyTier,
  getTierPerks,
  computeLeadCategory
} from '../data/crmData';
import { resolveContentSlug } from '../data/storeContentPages';
import { submitCheckoutOrder } from '../lib/checkout/submitCheckout';
import { fetchRemoteOrders, mergeOrderLists } from '../lib/checkout/fetchRemoteOrders';
import { notifyOrderStatusChange } from '../lib/checkout/notifyOrderStatus';

interface StoreContextType {
  // Navigation & View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  navigateToPdp: (productId: string) => void;
  navigateToPlp: (category?: string, series?: string) => void;
  selectedPlpSeries: string | null;
  contentPageSlug: string | null;
  navigateToContent: (slug: string) => void;

  // Localization & Currency
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  t: typeof LOCALES['en'];

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotalEur: number;
  freeShippingThresholdEur: number;
  freeShippingProgress: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  compareList: string[]; // product IDs (max 4)
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Orders & Tracking
  orders: PlacedOrder[];
  activeOrderNumber: string | null;
  setActiveOrderNumber: (num: string | null) => void;
  placeNewOrder: (orderData: Omit<PlacedOrder, 'orderNumber' | 'trackingToken' | 'createdAt'>) => PlacedOrder;
  updateOrderStatus: (orderNumber: string, status: PlacedOrder['paymentStatus']) => void;
  updateOrder: (orderNumber: string, updates: Partial<PlacedOrder>) => void;
  deleteOrder: (orderNumber: string) => void;
  refreshRemoteOrders: () => Promise<void>;
  advanceOrderStatus: (orderNumber: string, status: OrderStatus) => void;
  verifyOrderPayment: (orderNumber: string, verification: Partial<OrderPaymentVerification>) => void;

  // Catalog (admin editable)
  products: Product[];
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Phase 7.5: Reviews Engine & Moderation
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'status' | 'helpfulVotes' | 'unhelpfulVotes'>) => void;
  voteReviewHelpful: (reviewId: string) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string, reason?: string) => void;

  // Phase 7.5: Multi-Depot Inventory
  depotStocks: Record<string, VariantDepotStock[]>;
  updateDepotStockUnits: (variantId: string, depotId: string, units: number) => void;

  // Phase 7.5: Search Analytics
  searchAnalytics: SearchAnalyticsRecord[];
  logSearchEvent: (query: string, resultsCount: number, clickedProdId?: string) => void;

  // Phase 7.5: Catalog Extraction & Ingestion Pipeline
  syncJob: SyncJobState;
  isSyncing: boolean;
  runLiveCatalogSync: () => Promise<void>;
  approveCatalogDiff: (diffId: string) => void;
  rejectCatalogDiff: (diffId: string) => void;

  // Phase 8: Post-Purchase, Warranty, Returns, B2B & Accounts
  warranties: WarrantyRegistration[];
  registerWarranty: (reg: WarrantyRegistration) => void;
  carePlans: DjiCarePlan[];
  submitCareClaim: (planId: string, claimType: 'accidental_damage' | 'water_damage' | 'flyaway') => void;
  rmas: ReturnRequest[];
  createRmaRequest: (rma: ReturnRequest) => void;
  notifications: CustomerNotification[];
  markNotificationAsRead: (id: string) => void;
  b2bProfile: B2bCompanyProfile;
  updateB2bProfile: (profile: Partial<B2bCompanyProfile>) => void;
  b2bQuotes: B2bQuote[];
  createB2bQuote: (quote: B2bQuote) => void;
  accountActiveTab: AccountTab;
  setAccountActiveTab: (tab: AccountTab) => void;

  // Phase 9: CRM, Loyalty, CDP & Automation
  customers: CustomerProfile[];
  currentCustomer: CustomerProfile;
  setCurrentCustomerId: (id: string) => void;
  loyaltyRewards: LoyaltyRewardItem[];
  loyaltyTransactions: LoyaltyTransaction[];
  awardLoyaltyPoints: (customerId: string, pointsDelta: number, reason: LoyaltyTransactionType, desc: string) => void;
  redeemLoyaltyReward: (rewardId: string) => boolean;
  cdpEvents: CdpEvent[];
  logCdpEvent: (event: Omit<CdpEvent, 'id' | 'timestamp'>) => void;
  automationTriggers: MarketingAutomationTrigger[];
  toggleAutomationTrigger: (id: string) => void;
  marketingCampaigns: MarketingCampaign[];
  launchMarketingCampaign: (campaign: Omit<MarketingCampaign, 'id' | 'status' | 'sentCount' | 'openRate' | 'clickRate' | 'revenueGeneratedEur' | 'launchedAt'>) => void;
  referrals: ReferralRecord[];
  createReferralInvite: (refereeName: string, refereeEmail: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_EUR = 500;

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const boot =
    typeof window !== 'undefined'
      ? storeFromPath(window.location.pathname, window.location.search)
      : { viewMode: 'home' as ViewMode };

  // Navigation
  const [viewMode, setViewModeState] = useState<ViewMode>(boot.viewMode);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    boot.selectedProductId || 'prod-mavic-4-pro'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(boot.selectedCategory || 'all');
  const [selectedPlpSeries, setSelectedPlpSeries] = useState<string | null>(
    boot.selectedPlpSeries ?? null
  );
  const [accountActiveTab, setAccountActiveTab] = useState<AccountTab>(
    boot.accountActiveTab || 'dashboard'
  );
  const [contentPageSlug, setContentPageSlug] = useState<string | null>(
    boot.contentPageSlug ?? null
  );
  const skippingPush = useRef(false);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  useEffect(() => {
    const onPop = () => {
      const next = storeFromPath(window.location.pathname, window.location.search);
      skippingPush.current = true;
      setViewModeState(next.viewMode);
      if (next.selectedProductId) setSelectedProductId(next.selectedProductId);
      if (next.selectedCategory) setSelectedCategory(next.selectedCategory);
      setSelectedPlpSeries(next.selectedPlpSeries ?? null);
      if (next.accountActiveTab) setAccountActiveTab(next.accountActiveTab);
      setContentPageSlug(next.contentPageSlug ?? null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (skippingPush.current) {
      skippingPush.current = false;
      return;
    }
    const next = pathFromStore({
      viewMode,
      selectedProductId,
      selectedCategory,
      selectedPlpSeries,
      accountActiveTab,
      contentPageSlug
    });
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== next) {
      window.history.pushState({ viewMode }, '', next);
    }
  }, [viewMode, selectedProductId, selectedCategory, selectedPlpSeries, accountActiveTab, contentPageSlug]);

  // i18n
  const [locale, setLocale] = useState<Locale>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Phase 7.5 Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('dji_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dji_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Phase 7.5 Multi-Depot Stock
  const [depotStocks, setDepotStocks] = useState<Record<string, VariantDepotStock[]>>(() => {
    try {
      const saved = localStorage.getItem('dji_depot_stocks_v2');
      const seed = saved ? JSON.parse(saved) : INITIAL_DEPOT_STOCK;
      return initializeInventoryFromCatalog(DJI_PRODUCTS, seed);
    } catch {
      return initializeInventoryFromCatalog(DJI_PRODUCTS, INITIAL_DEPOT_STOCK);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dji_depot_stocks_v2', JSON.stringify(depotStocks));
    } catch (e) {
      console.error(e);
    }
  }, [depotStocks]);

  // Phase 7.5 Search Analytics
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalyticsRecord[]>([
    {
      id: 'sea-1',
      query: 'mavic 4 pro 8k',
      timestamp: '2026-08-14T07:15:00Z',
      resultsCount: 1,
      clickedProductId: 'prod-mavic-4-pro',
      executionTimeMs: 4,
      isZeroResult: false
    },
    {
      id: 'sea-2',
      query: 'drone under 250g no license',
      timestamp: '2026-08-14T07:22:00Z',
      resultsCount: 2,
      clickedProductId: 'prod-mini-4-pro',
      executionTimeMs: 6,
      isZeroResult: false,
      synonymApplied: 'sub-249g'
    },
    {
      id: 'sea-3',
      query: 'fpv goggles 3',
      timestamp: '2026-08-14T07:45:00Z',
      resultsCount: 1,
      clickedProductId: 'prod-avata-2',
      executionTimeMs: 5,
      isZeroResult: false,
      synonymApplied: 'goggles'
    }
  ]);

  // Phase 7.5 Sync Pipeline
  const [syncJob, setSyncJob] = useState<SyncJobState>(INITIAL_SYNC_JOB);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);


  // Cart State (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dji_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dji_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare State
  const [compareList, setCompareList] = useState<string[]>([]);

  // Orders State (initial seeded orders with OMS telemetry)
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('dji_orders_v8');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Full catalog is too large for localStorage (media payloads). Clear any legacy blob.
      localStorage.removeItem('dji_catalog_v1');
      const patchRaw = localStorage.getItem('dji_catalog_patches_v1');
      if (patchRaw) {
        const patch = JSON.parse(patchRaw) as {
          deletedIds?: string[];
          updates?: Record<string, Partial<Product>>;
        };
        const deleted = new Set(patch.deletedIds ?? []);
        const updates = patch.updates ?? {};
        return DJI_PRODUCTS.filter((p) => !deleted.has(p.id)).map((p) =>
          updates[p.id] ? { ...p, ...updates[p.id], id: p.id } : p
        );
      }
    } catch {
      /* fall through to seed */
    }
    return [...DJI_PRODUCTS];
  });

  useEffect(() => {
    syncRuntimeCatalog(products);
    try {
      const seedIds = new Set(DJI_PRODUCTS.map((p) => p.id));
      const deletedIds = DJI_PRODUCTS.filter((p) => !products.some((x) => x.id === p.id)).map((p) => p.id);
      const updates: Record<string, Partial<Product>> = {};
      for (const product of products) {
        if (!seedIds.has(product.id)) continue;
        const seed = DJI_PRODUCTS.find((p) => p.id === product.id);
        if (!seed) continue;
        const changed =
          seed.modelName !== product.modelName ||
          seed.sku !== product.sku ||
          seed.slug !== product.slug ||
          seed.basePriceEur !== product.basePriceEur ||
          seed.tagline !== product.tagline ||
          seed.description !== product.description ||
          seed.category !== product.category ||
          JSON.stringify(seed.variants) !== JSON.stringify(product.variants);
        if (changed) {
          updates[product.id] = {
            modelName: product.modelName,
            sku: product.sku,
            slug: product.slug,
            series: product.series,
            category: product.category,
            categoryLabel: product.categoryLabel,
            tagline: product.tagline,
            description: product.description,
            basePriceEur: product.basePriceEur,
            compareAtPriceEur: product.compareAtPriceEur,
            badgeLabel: product.badgeLabel,
            weightGrams: product.weightGrams,
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured,
            isBestSeller: product.isBestSeller,
            isNew: product.isNew,
            images: product.images,
            variants: product.variants
          };
        }
      }
      localStorage.setItem('dji_catalog_patches_v1', JSON.stringify({ deletedIds, updates }));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const [activeOrderNumber, setActiveOrderNumber] = useState<string | null>('DJI-EU-100239');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Phase 8: Warranty, Care, RMA, B2B, Notifications
  const [warranties, setWarranties] = useState<WarrantyRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('dji_warranties');
      return saved ? JSON.parse(saved) : INITIAL_WARRANTIES;
    } catch {
      return INITIAL_WARRANTIES;
    }
  });

  const [carePlans, setCarePlans] = useState<DjiCarePlan[]>(() => {
    try {
      const saved = localStorage.getItem('dji_care_plans');
      return saved ? JSON.parse(saved) : INITIAL_CARE_PLANS;
    } catch {
      return INITIAL_CARE_PLANS;
    }
  });

  const [rmas, setRmas] = useState<ReturnRequest[]>(() => {
    try {
      const saved = localStorage.getItem('dji_rmas');
      return saved ? JSON.parse(saved) : INITIAL_RMAS;
    } catch {
      return INITIAL_RMAS;
    }
  });

  const [notifications, setNotifications] = useState<CustomerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('dji_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [b2bProfile, setB2bProfile] = useState<B2bCompanyProfile>(() => {
    try {
      const saved = localStorage.getItem('dji_b2b_profile');
      return saved ? JSON.parse(saved) : INITIAL_B2B_PROFILE;
    } catch {
      return INITIAL_B2B_PROFILE;
    }
  });

  const [b2bQuotes, setB2bQuotes] = useState<B2bQuote[]>(() => {
    try {
      const saved = localStorage.getItem('dji_b2b_quotes');
      return saved ? JSON.parse(saved) : INITIAL_B2B_QUOTES;
    } catch {
      return INITIAL_B2B_QUOTES;
    }
  });

  // Phase 9: CRM, Loyalty, CDP & Marketing Automation States
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('dji_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [currentCustomerId, setCurrentCustomerId] = useState<string>('cust-lukas-weber');

  const currentCustomer =
    customers.find((c) => c.id === currentCustomerId) || customers[0] || INITIAL_CUSTOMERS[0];

  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyRewardItem[]>(() => {
    try {
      const saved = localStorage.getItem('dji_loyalty_rewards');
      return saved ? JSON.parse(saved) : INITIAL_LOYALTY_REWARDS;
    } catch {
      return INITIAL_LOYALTY_REWARDS;
    }
  });

  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('dji_loyalty_transactions');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'tx-1',
          customerId: 'cust-lukas-weber',
          pointsDelta: 2699,
          transactionType: 'purchase',
          description: 'Earned 1:1 on Mavic 4 Pro Fly More Combo Order #DJI-EU-100239',
          createdAt: '2026-03-28'
        },
        {
          id: 'tx-2',
          customerId: 'cust-lukas-weber',
          pointsDelta: 500,
          transactionType: 'photo_review',
          description: 'Verified 4K HDR European Flight Review Bonus',
          createdAt: '2026-04-02'
        },
        {
          id: 'tx-3',
          customerId: 'cust-lukas-weber',
          pointsDelta: 100,
          transactionType: 'warranty_reg',
          description: 'Official 2-Year European Warranty Registration',
          createdAt: '2026-04-03'
        },
        {
          id: 'tx-4',
          customerId: 'cust-lukas-weber',
          pointsDelta: 1551,
          transactionType: 'bonus',
          description: 'DJI Flight Club Creator Welcome Bonus',
          createdAt: '2026-04-05'
        }
      ];
    } catch {
      return [];
    }
  });

  const [cdpEvents, setCdpEvents] = useState<CdpEvent[]>(() => {
    try {
      const saved = localStorage.getItem('dji_cdp_events');
      return saved ? JSON.parse(saved) : INITIAL_CDP_EVENTS;
    } catch {
      return INITIAL_CDP_EVENTS;
    }
  });

  const [automationTriggers, setAutomationTriggers] = useState<MarketingAutomationTrigger[]>(() => {
    try {
      const saved = localStorage.getItem('dji_automation_triggers');
      return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_TRIGGERS;
    } catch {
      return INITIAL_AUTOMATION_TRIGGERS;
    }
  });

  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(() => {
    try {
      const saved = localStorage.getItem('dji_marketing_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dji_referrals');
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dji_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dji_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('dji_orders_v8', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dji_warranties', JSON.stringify(warranties));
  }, [warranties]);

  useEffect(() => {
    localStorage.setItem('dji_care_plans', JSON.stringify(carePlans));
  }, [carePlans]);

  useEffect(() => {
    localStorage.setItem('dji_rmas', JSON.stringify(rmas));
  }, [rmas]);

  useEffect(() => {
    localStorage.setItem('dji_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('dji_b2b_profile', JSON.stringify(b2bProfile));
  }, [b2bProfile]);

  useEffect(() => {
    localStorage.setItem('dji_b2b_quotes', JSON.stringify(b2bQuotes));
  }, [b2bQuotes]);

  useEffect(() => {
    localStorage.setItem('dji_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('dji_loyalty_rewards', JSON.stringify(loyaltyRewards));
  }, [loyaltyRewards]);

  useEffect(() => {
    localStorage.setItem('dji_loyalty_transactions', JSON.stringify(loyaltyTransactions));
  }, [loyaltyTransactions]);

  useEffect(() => {
    localStorage.setItem('dji_cdp_events', JSON.stringify(cdpEvents));
  }, [cdpEvents]);

  useEffect(() => {
    localStorage.setItem('dji_automation_triggers', JSON.stringify(automationTriggers));
  }, [automationTriggers]);

  useEffect(() => {
    localStorage.setItem('dji_marketing_campaigns', JSON.stringify(marketingCampaigns));
  }, [marketingCampaigns]);

  useEffect(() => {
    localStorage.setItem('dji_referrals', JSON.stringify(referrals));
  }, [referrals]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation helpers
  const navigateToPdp = (productId: string) => {
    setSelectedProductId(productId);
    setViewMode('pdp');
  };

  const navigateToPlp = (category = 'all', series?: string) => {
    setSelectedCategory(category);
    setSelectedPlpSeries(series || null);
    setViewMode('plp');
  };

  const navigateToContent = (slug: string) => {
    const resolved = resolveContentSlug(slug);
    setContentPageSlug(resolved);
    setViewMode('content');
  };

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    const itemId = `${product.id}__${variant.id}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          variantId: variant.id,
          product,
          variant,
          quantity
        }
      ];
    });

    setIsCartOpen(true);
    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.modelName} (${variant.comboName}) added.`
    });

    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: currentCustomer.email,
      sessionId: 'sess-active',
      eventType: 'add_to_cart',
      metadata: {
        productId: product.id,
        modelName: product.modelName,
        variantId: variant.id,
        priceEur: variant.priceEur
      },
      scoreDelta: 25
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item has been removed from your shopping bag.'
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalEur = cart.reduce(
    (acc, item) => acc + item.variant.priceEur * item.quantity,
    0
  );
  const freeShippingProgress = Math.min(100, (cartSubtotalEur / FREE_SHIPPING_THRESHOLD_EUR) * 100);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast({ type: 'info', title: 'Removed from Saved Items' });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({ type: 'success', title: 'Added to Saved Items' });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare operations
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        addToast({
          type: 'warning',
          title: 'Compare Limit Reached',
          message: 'You can compare up to 4 drone models simultaneously.'
        });
        return prev;
      }
      addToast({
        type: 'success',
        title: 'Added to Drone Comparison',
        message: 'View the side-by-side technical specs matrix.'
      });
      return [...prev, productId];
    });
  };

  const isInCompare = (productId: string) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  // Place order with Multi-Depot Allocation & Carrier Integration
  const placeNewOrder = (
    orderData: Omit<PlacedOrder, 'orderNumber' | 'trackingToken' | 'createdAt'>
  ): PlacedOrder => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DJI-EU-${randomSuffix}`;
    const trackingToken = `DHL-DE-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Run Warehouse Allocation Engine
    const countryCode = orderData.shippingAddress?.countryCode || 'DE';
    const primaryVariantId = orderData.items[0]?.variantId;
    const allocationResult = determineOptimalWarehouse(countryCode, primaryVariantId, depotStocks);

    const nowIso = new Date().toISOString();

    const newOrder: PlacedOrder = {
      ...orderData,
      orderNumber,
      trackingToken,
      createdAt: nowIso,
      status: 'pending_payment',
      allocation: {
        warehouseId: allocationResult.depot.id,
        warehouseCode: allocationResult.depot.code,
        warehouseName: allocationResult.depot.name,
        binLocation: allocationResult.binLocation,
        priority: 'EXPRESS',
        airWaybillNumber: `AWB-${trackingToken}`
      },
      dhlShipment: {
        id: `shipment-${orderNumber}`,
        orderNumber,
        carrier: 'dhl',
        carrierService: 'DHL Express European Direct Air',
        trackingNumber: trackingToken,
        waybillNumber: trackingToken.replace('DHL-DE-', ''),
        shippingLabelUrl: `https://djii.eu/labels/${trackingToken}.pdf`,
        status: 'label_created',
        originHub: `${allocationResult.depot.name} (${allocationResult.depot.code})`,
        destinationCity: orderData.shippingAddress?.city || 'Munich',
        destinationCountry: orderData.shippingAddress?.countryName || 'Germany',
        estimatedDeliveryDate: `${allocationResult.transitDays} Business Day(s) via DHL Express Air`,
        weightKg: 2.8,
        checkpoints: [
          {
            timestamp: 'Just Now',
            statusText: 'Electronic Shipping Information Received & Allocated',
            location: `${allocationResult.depot.city}, ${allocationResult.depot.countryCode}`,
            completed: true,
            carrierStatusCode: 'CR',
            notes: `Allocated to Bin ${allocationResult.binLocation}`
          }
        ]
      },
      tracking: {
        carrier: 'DHL Express European Air',
        trackingNumber: trackingToken,
        status: 'payment_verifying',
        estimatedDelivery: `${allocationResult.transitDays} Business Days via DHL Express`,
        currentLocation: `${allocationResult.depot.name}, ${allocationResult.depot.countryCode}`,
        events: [
          {
            time: 'Just Now',
            title: `Order Registered & Allocated to ${allocationResult.depot.code} Warehouse`,
            location: 'DJI Store EU Operations',
            completed: true
          }
        ]
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderNumber(orderNumber);

    // Create Order Placed Notification
    const notif: CustomerNotification = {
      id: `notif-${Date.now()}`,
      type: 'email',
      event: 'ORDER_CREATED',
      title: `Order Confirmation — #${orderNumber}`,
      message: `Your order #${orderNumber} is registered. Hardware reserved at ${allocationResult.depot.code} distribution center.`,
      recipientEmail: orderData.customer.email,
      timestamp: nowIso,
      read: false,
      orderNumber
    };
    setNotifications((prev) => [notif, ...prev]);

    // Award loyalty points 1:1 on total EUR spent
    const pointsEarned = Math.round(orderData.totalEur || 0);
    if (pointsEarned > 0) {
      awardLoyaltyPoints(
        currentCustomer.id,
        pointsEarned,
        'purchase',
        `Earned 1:1 on Order #${orderNumber} (€${pointsEarned.toLocaleString()})`
      );
    }

    // Log CDP Payment Completed Event
    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: orderData.customer.email,
      sessionId: 'sess-active',
      eventType: 'payment_completed',
      metadata: {
        orderNumber,
        totalEur: orderData.totalEur,
        itemsCount: orderData.items.length,
        warehouse: allocationResult.depot.code
      },
      scoreDelta: 100
    });

    clearCart();

    const customerId =
      orderData.customer.email.toLowerCase() === currentCustomer.email.toLowerCase()
        ? currentCustomer.id
        : `guest-${orderData.customer.email.trim().toLowerCase()}`;

    void submitCheckoutOrder({ order: newOrder, customerId, locale }).then((result) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.orderNumber === orderNumber ? { ...ord, serverSynced: result.ok } : ord
        )
      );
      if (result.ok) {
        addToast({
          type: 'success',
          title: 'Confirmation email sent',
          message: `Order #${newOrder.orderNumber} — check ${orderData.customer.email} (and admin inbox).`
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Order saved locally only',
          message:
            result.error === 'network_error' || (result.error ?? '').includes('checkout')
              ? 'Your order was registered in this browser, but the server could not save it or send email. Contact sales@djii.eu with your order number.'
              : `Order registered, but confirmation email failed (${result.error}). Contact sales@djii.eu with #${newOrder.orderNumber}.`
        });
      }
    });

    return newOrder;
  };

  const refreshRemoteOrders = async () => {
    const remote = await fetchRemoteOrders();
    if (!remote.length) return;
    setOrders((prev) => mergeOrderLists(remote, prev));
  };

  const dispatchOrderStatusEmails = (order: PlacedOrder, previous: PlacedOrder) => {
    const statusChanged = (order.status ?? '') !== (previous.status ?? '');
    const paymentChanged = order.paymentStatus !== previous.paymentStatus;
    if (!statusChanged && !paymentChanged) return;

    void notifyOrderStatusChange({ order, previousOrder: previous, locale }).then((result) => {
      if (result.ok) {
        addToast({
          type: 'success',
          title: 'Status emails sent',
          message: `Customer and admin notified for order #${order.orderNumber}.`
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Status emails pending',
          message: 'Order saved but notification emails could not be sent. Ensure you are signed in as admin and the API is running.'
        });
      }
    });
  };

  const updateOrderStatus = (orderNumber: string, status: PlacedOrder['paymentStatus']) => {
    const previous = orders.find((ord) => ord.orderNumber === orderNumber);
    let updated: PlacedOrder | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const updatedTracking = ord.tracking
            ? {
                ...ord.tracking,
                status:
                  status === 'confirmed'
                    ? 'order_packed'
                    : status === 'dispatched'
                    ? 'in_transit'
                    : status === 'delivered'
                    ? 'delivered'
                    : 'payment_verifying'
              }
            : undefined;
          updated = {
            ...ord,
            paymentStatus: status,
            tracking: updatedTracking as PlacedOrder['tracking']
          };
          return updated;
        }
        return ord;
      })
    );

    if (previous && updated) {
      dispatchOrderStatusEmails(updated, previous);
    }

    addToast({
      type: 'success',
      title: 'Order Status Updated',
      message: `Order #${orderNumber} is now marked as "${status.toUpperCase()}".`
    });
  };

  const updateOrder = (orderNumber: string, updates: Partial<PlacedOrder>) => {
    const previous = orders.find((ord) => ord.orderNumber === orderNumber);
    let merged: PlacedOrder | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          merged = { ...ord, ...updates };
          return merged;
        }
        return ord;
      })
    );

    if (previous && merged) {
      dispatchOrderStatusEmails(merged, previous);
    }

    addToast({
      type: 'success',
      title: 'Order Updated',
      message: `Order #${orderNumber} has been saved.`
    });
  };

  const deleteOrder = (orderNumber: string) => {
    setOrders((prev) => prev.filter((ord) => ord.orderNumber !== orderNumber));
    addToast({
      type: 'info',
      title: 'Order Deleted',
      message: `Order #${orderNumber} was removed from the system.`
    });
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates, id: product.id } : product))
    );
    addToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Catalog changes are live on the storefront.'
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    if (selectedProductId === productId) {
      setSelectedProductId('');
      setViewMode('plp');
    }
    setCompareList((prev) => prev.filter((id) => id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast({
      type: 'info',
      title: 'Product Deleted',
      message: 'The product was removed from the catalog.'
    });
  };

  const advanceOrderStatus = (orderNumber: string, nextStatus: OrderStatus) => {
    const previous = orders.find((ord) => ord.orderNumber === orderNumber);
    let updated: PlacedOrder | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const isDelivered = nextStatus === 'delivered';
          const isDispatched = nextStatus === 'shipped';

          const updatedPaymentStatus: PlacedOrder['paymentStatus'] =
            isDelivered ? 'delivered' : isDispatched ? 'dispatched' : ord.paymentStatus;

          updated = {
            ...ord,
            status: nextStatus,
            paymentStatus: updatedPaymentStatus
          };
          return updated;
        }
        return ord;
      })
    );

    if (previous && updated) {
      dispatchOrderStatusEmails(updated, previous);
    }

    const notif: CustomerNotification = {
      id: `notif-${Date.now()}`,
      type: 'email',
      event: nextStatus === 'shipped' ? 'ORDER_SHIPPED' : nextStatus === 'delivered' ? 'DELIVERED' : 'ORDER_ALLOCATED',
      title: `Order Status Update — #${orderNumber} is ${nextStatus.toUpperCase()}`,
      message: `Your order #${orderNumber} status changed to ${nextStatus.replace(/_/g, ' ')}.`,
      timestamp: new Date().toISOString(),
      read: false,
      orderNumber
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Order Lifecycle Advanced',
      message: `Order #${orderNumber} transitioned to "${nextStatus.toUpperCase()}".`
    });
  };

  const verifyOrderPayment = (
    orderNumber: string,
    verification: Partial<OrderPaymentVerification>
  ) => {
    const previous = orders.find((ord) => ord.orderNumber === orderNumber);
    let updated: PlacedOrder | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          updated = {
            ...ord,
            paymentStatus: 'confirmed',
            status: 'confirmed',
            paymentVerification: {
              ...ord.paymentVerification,
              ...verification,
              verifiedAt: new Date().toISOString()
            }
          };
          return updated;
        }
        return ord;
      })
    );

    if (previous && updated) {
      dispatchOrderStatusEmails(updated, previous);
    }

    addToast({
      type: 'success',
      title: 'Payment Cleared',
      message: `Order #${orderNumber} payment verified. Transferred to warehouse picking queue.`
    });
  };

  // Phase 8: Warranty, Care, RMA, B2B Handlers
  const registerWarranty = (reg: WarrantyRegistration) => {
    setWarranties((prev) => [reg, ...prev]);

    awardLoyaltyPoints(
      currentCustomer.id,
      100,
      'warranty_reg',
      `Registered Warranty for S/N: ${reg.aircraftSerial}`
    );

    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: currentCustomer.email,
      sessionId: 'sess-active',
      eventType: 'warranty_registered',
      metadata: {
        serialNumber: reg.aircraftSerial,
        productName: reg.productModel,
        countryCode: reg.countryCode
      },
      scoreDelta: 50
    });
  };

  const submitCareClaim = (
    planId: string,
    claimType: 'accidental_damage' | 'water_damage' | 'flyaway'
  ) => {
    setCarePlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const isFlyaway = claimType === 'flyaway';
          return {
            ...p,
            remainingAccidentalReplacements: isFlyaway
              ? p.remainingAccidentalReplacements
              : Math.max(0, p.remainingAccidentalReplacements - 1),
            remainingFlyawayReplacements: isFlyaway
              ? Math.max(0, p.remainingFlyawayReplacements - 1)
              : p.remainingFlyawayReplacements,
            claimHistory: [
              ...p.claimHistory,
              {
                id: `claim-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                type: claimType,
                incidentReport: 'Claim filed via Customer Account Portal.',
                status: 'in_review'
              }
            ]
          };
        }
        return p;
      })
    );
  };

  const createRmaRequest = (rma: ReturnRequest) => {
    setRmas((prev) => [rma, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateB2bProfile = (profile: Partial<B2bCompanyProfile>) => {
    setB2bProfile((prev) => ({ ...prev, ...profile }));
    addToast({
      type: 'success',
      title: 'B2B Profile Saved',
      message: 'European company details and tax settings updated.'
    });
  };

  const createB2bQuote = (quote: B2bQuote) => {
    setB2bQuotes((prev) => [quote, ...prev]);
  };

  // Phase 7.5 Reviews Handlers
  const addReview = (newRevData: Omit<ProductReview, 'id' | 'createdAt' | 'status' | 'helpfulVotes' | 'unhelpfulVotes'>) => {
    const newRev: ProductReview = {
      ...newRevData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending_moderation', // Sent to moderation queue
      helpfulVotes: 0,
      unhelpfulVotes: 0
    };

    setReviews((prev) => [newRev, ...prev]);

    const hasMedia = newRevData.media && newRevData.media.length > 0;
    const bonusPoints = hasMedia ? 500 : 250;
    awardLoyaltyPoints(
      currentCustomer.id,
      bonusPoints,
      hasMedia ? 'photo_review' : 'review',
      `Submitted Verified Review for ${newRevData.productId} (+${bonusPoints} Points)`
    );

    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: currentCustomer.email,
      sessionId: 'sess-active',
      eventType: 'review_submitted',
      metadata: {
        productId: newRevData.productId,
        rating: newRevData.rating,
        hasMedia
      },
      scoreDelta: 50
    });

    addToast({
      type: 'info',
      title: 'Review Submitted for Moderation',
      message: `Thank you! Your flight review earned +${bonusPoints} DJI Pilot Points upon verification.`
    });
  };

  const voteReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isVoted = r.userVotedHelpful;
          return {
            ...r,
            helpfulVotes: isVoted ? r.helpfulVotes - 1 : r.helpfulVotes + 1,
            userVotedHelpful: !isVoted
          };
        }
        return r;
      })
    );
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
    addToast({
      type: 'success',
      title: 'Review Approved',
      message: 'Review published to European product detail page.'
    });
  };

  const rejectReview = (reviewId: string, reason: string = 'Violates content guidelines') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    );
    addToast({
      type: 'warning',
      title: 'Review Rejected',
      message: 'Review moved to rejected archive.'
    });
  };

  // Phase 7.5 Multi-Depot Inventory Handlers
  const updateDepotStockUnits = (variantId: string, depotId: string, units: number) => {
    setDepotStocks((prev) => {
      const currentList = prev[variantId] || [];
      const exists = currentList.find((d) => d.depotId === depotId);
      let updated;
      if (exists) {
        updated = currentList.map((d) => (d.depotId === depotId ? { ...d, stockUnits: units } : d));
      } else {
        updated = [
          ...currentList,
          {
            depotId,
            stockUnits: units,
            reservedUnits: 0,
            incomingUnits: 0,
            reorderPoint: 5,
            backorderAllowed: true
          }
        ];
      }
      return { ...prev, [variantId]: updated };
    });

    addToast({
      type: 'success',
      title: 'Warehouse Stock Reallocated',
      message: `Depot ${depotId} stock adjusted to ${units} units.`
    });
  };

  // Phase 7.5 Search Analytics
  const logSearchEvent = (query: string, resultsCount: number, clickedProdId?: string) => {
    const newEvent: SearchAnalyticsRecord = {
      id: `sea-${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
      resultsCount,
      clickedProductId: clickedProdId,
      executionTimeMs: Math.floor(3 + Math.random() * 5),
      isZeroResult: resultsCount === 0
    };
    setSearchAnalytics((prev) => [newEvent, ...prev.slice(0, 49)]);
  };

  // Phase 7.5 Catalog Sync Engine
  const runLiveCatalogSync = async () => {
    setIsSyncing(true);
    setSyncJob((prev) => ({
      ...prev,
      currentStage: 'crawling_reference',
      progressPercent: 15,
      startedAt: new Date().toISOString(),
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'crawling_reference',
          level: 'info',
          message: 'Connecting to reference store CDN with Frankfurt residential gateway...'
        }
      ]
    }));

    // Stage 1: Crawling
    await new Promise((r) => setTimeout(r, 900));
    setSyncJob((prev) => ({
      ...prev,
      currentStage: 'extracting_dom',
      progressPercent: 35,
      logs: [
        ...prev.logs,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'extracting_dom',
          level: 'info',
          message: 'Extracted 18 DOM tree snapshots for Camera Drones, Handhelds, and Combos.'
        }
      ]
    }));

    // Stage 2: Normalization
    await new Promise((r) => setTimeout(r, 900));
    setSyncJob((prev) => ({
      ...prev,
      currentStage: 'validating_easa',
      progressPercent: 65,
      logs: [
        ...prev.logs,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'validating_easa',
          level: 'success',
          message: 'Validated EASA Class C0/C1 tags against EASA EU 2019/945 Registry.'
        }
      ]
    }));

    // Stage 3: CDN Media
    await new Promise((r) => setTimeout(r, 900));
    setSyncJob((prev) => ({
      ...prev,
      currentStage: 'diffing_revisions',
      progressPercent: 90,
      logs: [
        ...prev.logs,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'diffing_revisions',
          level: 'info',
          message: 'Generated semantic diff. 2 Catalog update proposals ready for review.'
        }
      ]
    }));

    // Stage 4: Awaiting Approval
    await new Promise((r) => setTimeout(r, 600));
    setSyncJob((prev) => ({
      ...prev,
      currentStage: 'awaiting_approval',
      progressPercent: 100,
      completedAt: new Date().toISOString(),
      logs: [
        ...prev.logs,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'awaiting_approval',
          level: 'warn',
          message: 'Sync completed. Awaiting store operations team review.'
        }
      ]
    }));
    setIsSyncing(false);
    addToast({
      type: 'success',
      title: 'Catalog Sync Engine Finished',
      message: 'Ingestion pipeline extracted latest reference data with 100% schema validation.'
    });
  };

  const approveCatalogDiff = (diffId: string) => {
    setSyncJob((prev) => ({
      ...prev,
      pendingDiffs: prev.pendingDiffs.map((d) => (d.id === diffId ? { ...d, status: 'approved' } : d))
    }));
    addToast({
      type: 'success',
      title: 'Catalog Change Approved',
      message: 'Updated specifications applied live to European store.'
    });
  };

  const rejectCatalogDiff = (diffId: string) => {
    setSyncJob((prev) => ({
      ...prev,
      pendingDiffs: prev.pendingDiffs.map((d) => (d.id === diffId ? { ...d, status: 'rejected' } : d))
    }));
    addToast({
      type: 'info',
      title: 'Diff Rejected',
      message: 'Change discarded from publication queue.'
    });
  };

  // Phase 9: CRM, Loyalty, CDP, Automation & Referral Handlers
  const logCdpEvent = (eventData: Omit<CdpEvent, 'id' | 'timestamp'>) => {
    const newEvent: CdpEvent = {
      ...eventData,
      id: `cdp-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    setCdpEvents((prev) => [newEvent, ...prev.slice(0, 199)]);

    // Update customer lead score & activity
    if (eventData.customerId) {
      setCustomers((prev) =>
        prev.map((cust) => {
          if (cust.id === eventData.customerId) {
            const newLeadScore = Math.min(1000, cust.leadScore + (eventData.scoreDelta || 5));
            return {
              ...cust,
              leadScore: newLeadScore,
              leadCategory: computeLeadCategory(newLeadScore),
              lastActivityDate: new Date().toISOString().split('T')[0]
            };
          }
          return cust;
        })
      );
    }
  };

  const awardLoyaltyPoints = (
    customerId: string,
    pointsDelta: number,
    reason: LoyaltyTransactionType,
    description: string
  ) => {
    const newTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      customerId,
      pointsDelta,
      transactionType: reason,
      description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLoyaltyTransactions((prev) => [newTx, ...prev]);

    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === customerId) {
          const newBalance = Math.max(0, cust.loyaltyAccount.pointsBalance + pointsDelta);
          const newLifetime = Math.max(0, cust.loyaltyAccount.lifetimePoints + (pointsDelta > 0 ? pointsDelta : 0));
          const newTier = determineLoyaltyTier(cust.lifetimeValueEur);
          const tierUpgraded = newTier !== cust.loyaltyTier;

          if (tierUpgraded) {
            addToast({
              type: 'success',
              title: `🎉 Loyalty Tier Upgraded to ${newTier.toUpperCase()}!`,
              message: `Congratulations! You have unlocked VIP European Pilot benefits.`
            });
          }

          return {
            ...cust,
            loyaltyTier: newTier,
            loyaltyAccount: {
              ...cust.loyaltyAccount,
              pointsBalance: newBalance,
              lifetimePoints: newLifetime,
              tier: newTier,
              perks: getTierPerks(newTier)
            }
          };
        }
        return cust;
      })
    );

    addToast({
      type: pointsDelta > 0 ? 'success' : 'info',
      title: pointsDelta > 0 ? `+${pointsDelta.toLocaleString()} DJI Pilot Points Awarded!` : `${pointsDelta.toLocaleString()} Points Redeemed`,
      message: description
    });
  };

  const redeemLoyaltyReward = (rewardId: string): boolean => {
    const reward = loyaltyRewards.find((r) => r.id === rewardId);
    if (!reward) {
      addToast({ type: 'error', title: 'Reward Not Found', message: 'Selected reward is unavailable.' });
      return false;
    }

    if (currentCustomer.loyaltyAccount.pointsBalance < reward.pointsCost) {
      addToast({
        type: 'warning',
        title: 'Insufficient Points Balance',
        message: `You need ${reward.pointsCost.toLocaleString()} points for this reward (Current: ${currentCustomer.loyaltyAccount.pointsBalance.toLocaleString()} pts).`
      });
      return false;
    }

    // Deduct points and log transaction
    awardLoyaltyPoints(
      currentCustomer.id,
      -reward.pointsCost,
      'redemption',
      `Redeemed: ${reward.title}`
    );

    // Send confirmation notification
    const notif: CustomerNotification = {
      id: `notif-${Date.now()}`,
      type: 'email',
      event: 'ORDER_CREATED',
      title: `🎁 Reward Claimed: ${reward.title}`,
      message: reward.voucherCode
        ? `Your voucher code is: ${reward.voucherCode}. Apply during checkout for immediate discount.`
        : `Your ${reward.title} certificate has been added to your European pilot account.`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);

    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: currentCustomer.email,
      sessionId: 'sess-active',
      eventType: 'reward_redeemed',
      metadata: {
        rewardId: reward.id,
        rewardTitle: reward.title,
        pointsCost: reward.pointsCost
      },
      scoreDelta: 30
    });

    addToast({
      type: 'success',
      title: '🎉 Reward Claimed Successfully!',
      message: reward.voucherCode
        ? `Voucher Code: ${reward.voucherCode} (Saved to Notifications)`
        : `${reward.title} assigned to your profile.`
    });

    return true;
  };

  const toggleAutomationTrigger = (id: string) => {
    setAutomationTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    addToast({
      type: 'info',
      title: 'Lifecycle Automation Updated',
      message: 'Marketing trigger status saved to European automation cluster.'
    });
  };

  const launchMarketingCampaign = (
    campaignData: Omit<
      MarketingCampaign,
      'id' | 'status' | 'sentCount' | 'openRate' | 'clickRate' | 'revenueGeneratedEur' | 'launchedAt'
    >
  ) => {
    const newCampaign: MarketingCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      status: 'running',
      sentCount: campaignData.audienceCount,
      openRate: +(48 + Math.random() * 10).toFixed(1),
      clickRate: +(15 + Math.random() * 8).toFixed(1),
      revenueGeneratedEur: Math.round(campaignData.audienceCount * 32.5),
      launchedAt: new Date().toISOString()
    };

    setMarketingCampaigns((prev) => [newCampaign, ...prev]);
    addToast({
      type: 'success',
      title: '🚀 Campaign Broadcast Launched!',
      message: `Delivering to ${campaignData.audienceCount.toLocaleString()} pilots across Europe.`
    });
  };

  const createReferralInvite = (refereeName: string, refereeEmail: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `REF-${currentCustomer.firstName.toUpperCase()}-${randomSuffix}`;

    const newRef: ReferralRecord = {
      id: `ref-${Date.now()}`,
      referrerCustomerId: currentCustomer.id,
      refereeName,
      refereeEmail,
      status: 'invited',
      voucherCode: code,
      pointsAwarded: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReferrals((prev) => [newRef, ...prev]);

    logCdpEvent({
      customerId: currentCustomer.id,
      customerEmail: currentCustomer.email,
      sessionId: 'sess-active',
      eventType: 'referral_sent',
      metadata: { refereeEmail, refereeName, voucherCode: code },
      scoreDelta: 20
    });

    addToast({
      type: 'success',
      title: 'Invitation Sent to ' + refereeName,
      message: `Friend receives €25 voucher (${code}). You earn 500 points on their first flight order!`
    });
  };

  const t = LOCALES[locale] || LOCALES.en;

  return (
    <StoreContext.Provider
      value={{
        viewMode,
        setViewMode,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        selectedPlpSeries,
        navigateToPdp,
        navigateToPlp,
        contentPageSlug,
        navigateToContent,
        locale,
        setLocale,
        currency,
        setCurrency,
        t,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotalEur,
        freeShippingThresholdEur: FREE_SHIPPING_THRESHOLD_EUR,
        freeShippingProgress,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        orders,
        activeOrderNumber,
        setActiveOrderNumber,
        placeNewOrder,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        refreshRemoteOrders,
        products,
        updateProduct,
        deleteProduct,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        reviews,
        addReview,
        voteReviewHelpful,
        approveReview,
        rejectReview,
        depotStocks,
        updateDepotStockUnits,
        searchAnalytics,
        logSearchEvent,
        syncJob,
        isSyncing,
        runLiveCatalogSync,
        approveCatalogDiff,
        rejectCatalogDiff,
        advanceOrderStatus,
        verifyOrderPayment,
        warranties,
        registerWarranty,
        carePlans,
        submitCareClaim,
        rmas,
        createRmaRequest,
        notifications,
        markNotificationAsRead,
        b2bProfile,
        updateB2bProfile,
        b2bQuotes,
        createB2bQuote,
        accountActiveTab,
        setAccountActiveTab,
        customers,
        currentCustomer,
        setCurrentCustomerId,
        loyaltyRewards,
        loyaltyTransactions,
        awardLoyaltyPoints,
        redeemLoyaltyReward,
        cdpEvents,
        logCdpEvent,
        automationTriggers,
        toggleAutomationTrigger,
        marketingCampaigns,
        launchMarketingCampaign,
        referrals,
        createReferralInvite
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

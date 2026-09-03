import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BestSellersPage } from './components/BestSellersPage';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartPage } from './components/CartPage';
import { StoreContentPage } from './components/StoreContentPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { TrackOrderPage } from './components/TrackOrderPage';
import { ComparePage } from './components/ComparePage';
import { EasaGuidePage } from './components/EasaGuidePage';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerAccountPortal } from './components/CustomerAccountPortal';
import { AuthPage } from './components/auth/AuthPage';
import { AuthCustomerSync } from './components/auth/AuthCustomerSync';
import { ProtectedView } from './components/auth/ProtectedView';
import { AiOperationsPortal } from './components/ai/AiOperationsPortal';
import { SecurityOpsCenter } from './components/security/SecurityOpsCenter';
import { ReliabilityEngineeringCenter } from './components/performance/ReliabilityEngineeringCenter';
import { QualityEngineeringCenter } from './components/qa/QualityEngineeringCenter';
import { LaunchCommandCenter } from './components/launch/LaunchCommandCenter';
import { EnterpriseBlueprintCenter } from './components/blueprint/EnterpriseBlueprintCenter';
import { ProductIntelligenceWorkstation } from './components/pim/ProductIntelligenceWorkstation';
import { MerchandisingWorkstation } from './components/merch/MerchandisingWorkstation';
import { PersonalizationWorkstation } from './components/personalization/PersonalizationWorkstation';
import { LifecycleWorkstation } from './components/lifecycle/LifecycleWorkstation';
import { EnterpriseSalesWorkstation } from './components/enterprise/EnterpriseSalesWorkstation';
import { ServiceCenterWorkstation } from './components/service/ServiceCenterWorkstation';
import { KnowledgeBaseWorkstation } from './components/service/KnowledgeBaseWorkstation';
import { MobileNotificationsWorkstation } from './components/mobile/MobileNotificationsWorkstation';
import { ProductionMigrationWorkstation } from './components/migration/ProductionMigrationWorkstation';
import { ConnectivityBanner, MobileBottomNav } from './components/mobile/MobileChrome';
import { GdprConsentModal } from './components/security/GdprConsentModal';
import { TawkToChat } from './components/TawkToChat';
import { SlideOverCart } from './components/SlideOverCart';
import { AdvancedSearchModal } from './components/AdvancedSearchModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useScrollToTopOnNavigation } from './hooks/useScrollToTopOnNavigation';

const GDPR_CONSENT_KEY = 'dji-eu-gdpr-consent-v1';

function isInternalWorkstation(viewMode: string) {
  return viewMode === 'admin' || viewMode === 'ai-operations' || viewMode.endsWith('-ops');
}

const MainLayout: React.FC = () => {
  const { viewMode, toasts, removeToast, setIsSearchOpen } = useStore();
  const [gdprOpen, setGdprOpen] = React.useState(false);

  useScrollToTopOnNavigation();

  React.useEffect(() => {
    try {
      if (!window.localStorage.getItem(GDPR_CONSENT_KEY)) {
        setGdprOpen(true);
      }
    } catch {
      setGdprOpen(true);
    }
  }, []);

  const closeGdpr = () => {
    try {
      window.localStorage.setItem(GDPR_CONSENT_KEY, new Date().toISOString());
    } catch {
      /* ignore quota */
    }
    setGdprOpen(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] antialiased selection:bg-[#E30613] selection:text-white font-sans">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Routed View Container */}
      <div className="flex-1 w-full pb-16 md:pb-0">
        {viewMode === 'home' && <HomeView />}
        {viewMode === 'best-sellers' && <BestSellersPage />}
        {viewMode === 'plp' && <ProductListingPage />}
        {viewMode === 'pdp' && <ProductDetailPage />}
        {viewMode === 'cart' && <CartPage />}
        {viewMode === 'content' && <StoreContentPage />}
        {viewMode === 'checkout' && <CheckoutPage />}
        {viewMode === 'order-success' && <OrderSuccessPage />}
        {viewMode === 'track-order' && <TrackOrderPage />}
        {viewMode === 'compare' && <ComparePage />}
        {viewMode === 'easa-guide' && <EasaGuidePage />}
        {viewMode === 'login' && <AuthPage mode="login" />}
        {viewMode === 'signup' && <AuthPage mode="signup" />}
        {viewMode === 'account' && (
          <ProtectedView viewMode="account">
            <CustomerAccountPortal />
          </ProtectedView>
        )}
        {viewMode === 'admin' && (
          <ProtectedView viewMode="admin">
            <AdminDashboard />
          </ProtectedView>
        )}
        {viewMode === 'ai-operations' && (
          <ProtectedView viewMode="ai-operations">
            <AiOperationsPortal />
          </ProtectedView>
        )}
        {viewMode === 'security-ops' && (
          <ProtectedView viewMode="security-ops">
            <SecurityOpsCenter />
          </ProtectedView>
        )}
        {viewMode === 'sre-ops' && (
          <ProtectedView viewMode="sre-ops">
            <ReliabilityEngineeringCenter />
          </ProtectedView>
        )}
        {viewMode === 'qa-ops' && (
          <ProtectedView viewMode="qa-ops">
            <QualityEngineeringCenter />
          </ProtectedView>
        )}
        {viewMode === 'launch-ops' && (
          <ProtectedView viewMode="launch-ops">
            <LaunchCommandCenter />
          </ProtectedView>
        )}
        {viewMode === 'blueprint-ops' && (
          <ProtectedView viewMode="blueprint-ops">
            <EnterpriseBlueprintCenter />
          </ProtectedView>
        )}
        {viewMode === 'pim-ops' && (
          <ProtectedView viewMode="pim-ops">
            <ProductIntelligenceWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'merch-ops' && (
          <ProtectedView viewMode="merch-ops">
            <MerchandisingWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'personalization-ops' && (
          <ProtectedView viewMode="personalization-ops">
            <PersonalizationWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'lifecycle-ops' && (
          <ProtectedView viewMode="lifecycle-ops">
            <LifecycleWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'enterprise-ops' && (
          <ProtectedView viewMode="enterprise-ops">
            <EnterpriseSalesWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'service-ops' && (
          <ProtectedView viewMode="service-ops">
            <ServiceCenterWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'knowledge-ops' && (
          <ProtectedView viewMode="knowledge-ops">
            <KnowledgeBaseWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'mobile-ops' && (
          <ProtectedView viewMode="mobile-ops">
            <MobileNotificationsWorkstation />
          </ProtectedView>
        )}
        {viewMode === 'migration-ops' && (
          <ProtectedView viewMode="migration-ops">
            <ProductionMigrationWorkstation />
          </ProtectedView>
        )}
      </div>

      <ConnectivityBanner />
      <MobileBottomNav />

      {/* Global Slide-Over Shopping Bag Drawer */}
      <SlideOverCart />

      {/* Global Advanced Intelligent Omnibar Search Modal */}
      <AdvancedSearchModal />

      {/* Global Footer */}
      <Footer />

      <GdprConsentModal isOpen={gdprOpen} onClose={closeGdpr} />
      <TawkToChat enabled={!isInternalWorkstation(viewMode)} />

      {/* Global Toast Notifications Layer */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-2xl shadow-xl border pointer-events-auto flex items-start gap-3 transition-all transform animate-slideIn ${
                toast.type === 'success'
                  ? 'bg-[#111113] text-white border-emerald-500/50'
                  : toast.type === 'error'
                  ? 'bg-rose-950 text-white border-rose-500/50'
                  : toast.type === 'warning'
                  ? 'bg-amber-950 text-white border-amber-500/50'
                  : 'bg-gray-900 text-white border-gray-700'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}

              <div className="flex-1 text-xs">
                <h4 className="font-bold text-white">{toast.title}</h4>
                {toast.message && <p className="text-gray-300 mt-0.5">{toast.message}</p>}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AuthCustomerSync />
        <MainLayout />
      </StoreProvider>
    </AuthProvider>
  );
}

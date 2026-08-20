import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BestSellersPage } from './components/BestSellersPage';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { TrackOrderPage } from './components/TrackOrderPage';
import { ComparePage } from './components/ComparePage';
import { EasaGuidePage } from './components/EasaGuidePage';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerAccountPortal } from './components/CustomerAccountPortal';
import { AiOperationsPortal } from './components/ai/AiOperationsPortal';
import { SecurityOpsCenter } from './components/security/SecurityOpsCenter';
import { ReliabilityEngineeringCenter } from './components/performance/ReliabilityEngineeringCenter';
import { QualityEngineeringCenter } from './components/qa/QualityEngineeringCenter';
import { LaunchCommandCenter } from './components/launch/LaunchCommandCenter';
import { EnterpriseBlueprintCenter } from './components/blueprint/EnterpriseBlueprintCenter';
import { ProductIntelligenceWorkstation } from './components/pim/ProductIntelligenceWorkstation';
import { GdprConsentModal } from './components/security/GdprConsentModal';
import { SlideOverCart } from './components/SlideOverCart';
import { AdvancedSearchModal } from './components/AdvancedSearchModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const GDPR_CONSENT_KEY = 'dji-eu-gdpr-consent-v1';

const MainLayout: React.FC = () => {
  const { viewMode, toasts, removeToast, setIsSearchOpen } = useStore();
  const [gdprOpen, setGdprOpen] = React.useState(false);

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
      <div className="flex-1 w-full">
        {viewMode === 'home' && <HomeView />}
        {viewMode === 'best-sellers' && <BestSellersPage />}
        {viewMode === 'plp' && <ProductListingPage />}
        {viewMode === 'pdp' && <ProductDetailPage />}
        {viewMode === 'checkout' && <CheckoutPage />}
        {viewMode === 'order-success' && <OrderSuccessPage />}
        {viewMode === 'track-order' && <TrackOrderPage />}
        {viewMode === 'compare' && <ComparePage />}
        {viewMode === 'easa-guide' && <EasaGuidePage />}
        {viewMode === 'account' && <CustomerAccountPortal />}
        {viewMode === 'admin' && <AdminDashboard />}
        {viewMode === 'ai-operations' && <AiOperationsPortal />}
        {viewMode === 'security-ops' && <SecurityOpsCenter />}
        {viewMode === 'sre-ops' && <ReliabilityEngineeringCenter />}
        {viewMode === 'qa-ops' && <QualityEngineeringCenter />}
        {viewMode === 'launch-ops' && <LaunchCommandCenter />}
        {viewMode === 'blueprint-ops' && <EnterpriseBlueprintCenter />}
        {viewMode === 'pim-ops' && <ProductIntelligenceWorkstation />}
      </div>

      {/* Global Slide-Over Shopping Bag Drawer */}
      <SlideOverCart />

      {/* Global Advanced Intelligent Omnibar Search Modal */}
      <AdvancedSearchModal />

      {/* Global Footer */}
      <Footer />

      <GdprConsentModal isOpen={gdprOpen} onClose={closeGdpr} />

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
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

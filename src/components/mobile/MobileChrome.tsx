import React, { useEffect, useState } from 'react';
import { Home, Search, ShoppingBag, User, Wrench } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ViewMode } from '../../types';
import { connectivityBanner } from '../../lib/mobile/wave11Mobile';
import { ConnectivityState } from '../../types/wave11Mobile';

/** Lightweight mobile chrome — does not redesign Phase 5–7 visual language. */
export const MobileBottomNav: React.FC = () => {
  const { viewMode, setViewMode, setIsSearchOpen, setIsCartOpen, cart, setAccountActiveTab } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const go = (mode: ViewMode, accountTab?: 'dashboard' | 'service' | 'notifications') => {
    setViewMode(mode);
    if (mode === 'account' && accountTab) setAccountActiveTab(accountTab);
  };

  const items: { id: string; label: string; icon: typeof Home; active: boolean; onClick: () => void }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      active: viewMode === 'home',
      onClick: () => go('home')
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      active: false,
      onClick: () => setIsSearchOpen(true)
    },
    {
      id: 'bag',
      label: 'Bag',
      icon: ShoppingBag,
      active: viewMode === 'cart',
      onClick: () => {
        setIsCartOpen(false);
        setViewMode('cart');
      }
    },
    {
      id: 'service',
      label: 'Service',
      icon: Wrench,
      active: viewMode === 'account',
      onClick: () => go('account', 'service')
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      active: viewMode === 'account',
      onClick: () => go('account', 'dashboard')
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 safe-pb"
      aria-label="Mobile primary"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={item.onClick}
                className={`w-full min-h-[52px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                  item.active ? 'text-[#E30613]' : 'text-gray-500'
                }`}
              >
                <span className="relative">
                  <Icon className="w-5 h-5" />
                  {item.id === 'bag' && cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E30613] text-white text-[9px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export const ConnectivityBanner: React.FC = () => {
  const [state, setState] = useState<ConnectivityState>(() =>
    typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'online'
  );

  useEffect(() => {
    const on = () => setState('reconnecting');
    const off = () => setState('offline');
    const onlineSettled = () => setState('online');
    window.addEventListener('offline', off);
    window.addEventListener('online', () => {
      on();
      window.setTimeout(onlineSettled, 600);
    });
    return () => {
      window.removeEventListener('offline', off);
    };
  }, []);

  const msg = connectivityBanner(state);
  if (!msg) return null;

  return (
    <div
      role="status"
      className="md:hidden sticky top-0 z-40 bg-[#1D1D1F] text-white text-[11px] font-semibold px-4 py-2.5 text-center"
    >
      {msg}
    </div>
  );
};

/** Sticky mobile purchase bar — mounts on PDP surfaces without changing brand language. */
export const StickyMobilePurchaseBar: React.FC<{
  priceLabel: string;
  onAdd: () => void;
  disabled?: boolean;
}> = ({ priceLabel, onAdd, disabled }) => (
  <div className="md:hidden fixed bottom-[52px] inset-x-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3">
    <div className="font-black text-sm text-gray-900">{priceLabel}</div>
    <button
      type="button"
      disabled={disabled}
      onClick={onAdd}
      className="ml-auto min-h-[44px] px-5 rounded-xl bg-[#E30613] text-white text-xs font-bold disabled:opacity-50"
    >
      Add to bag
    </button>
  </div>
);

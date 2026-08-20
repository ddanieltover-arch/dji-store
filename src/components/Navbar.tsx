import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Settings,
  Scale,
  Heart,
  Truck,
  Cpu,
  Gauge,
  FlaskConical,
  ShieldCheck,
  Rocket,
  Award,
  ChevronDown,
  Database
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Locale, CurrencyCode, ViewMode } from '../types';
import { getMegaPanel } from '../data/megaMenu';
import { NavMegaMenu } from './nav/NavMegaMenu';
import { BrandLogo } from './brand/BrandLogo';
import { useMegaMenu } from '../hooks/useMegaMenu';

export const NAV_LINKS: Array<{
  id: string;
  label: string;
  badge?: string;
  onSelect: 'category' | 'view';
  value: string;
  hasMega?: boolean;
}> = [
  { id: 'best-sellers', label: 'Best Sellers', onSelect: 'view', value: 'best-sellers', hasMega: false },
  { id: 'camera-drones', label: 'Camera Drones', onSelect: 'category', value: 'camera-drones' },
  { id: 'handheld', label: 'Handheld', onSelect: 'category', value: 'handheld' },
  { id: 'power', label: 'Power', onSelect: 'category', value: 'power' },
  { id: 'services', label: 'Services', badge: 'DJI Care', onSelect: 'view', value: 'easa-guide' },
  { id: 'accessories', label: 'Accessories', onSelect: 'category', value: 'accessories' },
  { id: 'education', label: 'Education & Industry', onSelect: 'category', value: 'professional' },
  { id: 'refurbished', label: 'Official Refurbished', onSelect: 'category', value: 'refurbished' }
];

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    navigateToPlp,
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    compareList,
    setIsSearchOpen,
    notifications,
    locale,
    setLocale,
    currency,
    setCurrency,
    t
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const unreadNotifsCount = notifications ? notifications.filter((n) => !n.read).length : 0;
  const mega = useMegaMenu();
  const openPanel = mega.openId ? getMegaPanel(mega.openId) : undefined;

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  const handleNav = (link: (typeof NAV_LINKS)[number]) => {
    mega.closeNow();
    if (link.onSelect === 'view') {
      setViewMode(link.value as ViewMode);
    } else {
      navigateToPlp(link.value);
    }
    setIsMobileMenuOpen(false);
  };

  const iconBtn =
    'relative flex h-11 w-11 items-center justify-center rounded-full text-[#1D1D1F] hover:bg-black/5 transition-colors';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F5F7] border-b border-black/8">
      <div className="relative">
        <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8 gap-4 lg:gap-8">
          <button
            type="button"
            onClick={() => {
              mega.closeNow();
              setViewMode('home');
            }}
            className="flex shrink-0 items-center"
            title="DJI Store EU Home"
          >
            <BrandLogo variant="dark" />
          </button>

          <nav
            className="hidden xl:flex flex-1 items-center justify-start gap-5 min-w-0"
            onMouseLeave={mega.intentClose}
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                (link.hasMega !== false && mega.openId === link.id) ||
                (link.value === viewMode && link.onSelect === 'view');
              return (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                type="button"
                onClick={() => handleNav(link)}
                onMouseEnter={() => {
                  if (link.hasMega === false) mega.closeNow();
                  else mega.intentOpen(link.id);
                }}
                onFocus={() => {
                  if (link.hasMega === false) mega.closeNow();
                  else mega.openNow(link.id);
                }}
                aria-expanded={link.hasMega === false ? undefined : mega.openId === link.id}
                aria-controls={link.hasMega === false ? undefined : `mega-${link.id}`}
                className={`shrink-0 inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap pb-0.5 border-b ${
                  isActive
                    ? 'text-black border-[#1D1D1F]'
                    : 'text-[#1D1D1F]/90 border-transparent hover:text-black'
                }`}
              >
                {link.label}
                {link.badge ? (
                  <span className="rounded-full bg-[#0070d5] px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide text-white">
                    {link.badge}
                  </span>
                ) : null}
              </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={iconBtn}
              title="Search Catalog (⌘K)"
              aria-label="Search"
            >
              <Search className="w-[20px] h-[20px] stroke-[1.6]" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={iconBtn}
              title="View Shopping Bag"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-[20px] h-[20px] stroke-[1.6]" />
              {cartTotalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 bg-[#E30613] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className={iconBtn}
                title="Account"
                aria-label="Account menu"
                aria-expanded={isUserMenuOpen}
              >
                <User className="w-[20px] h-[20px] stroke-[1.6]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#E30613] rounded-full ring-2 ring-white" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-black/8 py-2 text-sm text-[#1D1D1F]">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    onClick={() => {
                      setViewMode('account');
                      setIsUserMenuOpen(false);
                    }}
                  >
                    Customer account
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => {
                      setViewMode('wishlist');
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Saved items
                    </span>
                    {wishlist.length > 0 && (
                      <span className="text-xs text-gray-500">{wishlist.length}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => {
                      setViewMode('compare');
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Scale className="w-4 h-4" /> {t.nav.compare}
                    </span>
                    {compareList.length > 0 && (
                      <span className="text-xs text-gray-500">{compareList.length}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 inline-flex items-center gap-2"
                    onClick={() => {
                      setViewMode('track-order');
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <Truck className="w-4 h-4" /> {t.nav.trackOrder}
                  </button>

                  <div className="my-2 border-t border-gray-100" />

                  <div className="px-4 py-2 flex items-center justify-between gap-2 text-xs text-gray-600">
                    <label className="flex items-center gap-1">
                      Lang
                      <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        className="bg-gray-50 rounded px-1 py-0.5 border border-gray-200"
                      >
                        <option value="en">EN</option>
                        <option value="de">DE</option>
                        <option value="fr">FR</option>
                        <option value="es">ES</option>
                        <option value="it">IT</option>
                        <option value="nl">NL</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-1">
                      {currency}
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                        className="bg-gray-50 rounded px-1 py-0.5 border border-gray-200"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="CHF">CHF</option>
                      </select>
                    </label>
                  </div>

                  <div className="my-2 border-t border-gray-100" />
                  <p className="px-4 pb-1 text-[10px] uppercase tracking-wider text-gray-400">Ops</p>
                  {(
                    [
                      { mode: 'admin' as const, label: t.nav.adminPortal, icon: Settings },
                      { mode: 'ai-operations' as const, label: 'AI Ops', icon: Cpu },
                      { mode: 'security-ops' as const, label: 'SecOps', icon: ShieldCheck },
                      { mode: 'sre-ops' as const, label: 'SRE', icon: Gauge },
                      { mode: 'qa-ops' as const, label: 'QA / Release', icon: FlaskConical },
                      { mode: 'launch-ops' as const, label: 'Go-Live', icon: Rocket },
                      { mode: 'blueprint-ops' as const, label: 'Blueprint / Cert', icon: Award },
                      { mode: 'pim-ops' as const, label: 'PIM / Sync', icon: Database }
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      className="w-full px-4 py-1.5 text-left hover:bg-gray-50 inline-flex items-center gap-2 text-xs text-gray-700"
                      onClick={() => {
                        setViewMode(viewMode === item.mode ? 'home' : item.mode);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {viewMode === item.mode ? `Exit ${item.label}` : item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`${iconBtn} xl:hidden`}
              title="Toggle Menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {openPanel && (
          <div
            className="hidden xl:block"
            onMouseEnter={() => mega.openNow(openPanel.id)}
            onMouseLeave={mega.intentClose}
          >
            <NavMegaMenu
              panel={openPanel}
              labelledBy={`nav-${openPanel.id}`}
              onClose={mega.closeNow}
            />
          </div>
        )}
      </div>

      {mega.openId && (
        <button
          type="button"
          className="hidden xl:block fixed inset-0 top-14 z-30 bg-black/25"
          aria-label="Close navigation overlay"
          onClick={mega.closeNow}
        />
      )}

      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-black/5 bg-white px-4 pt-2 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const panel = getMegaPanel(link.id);
            const expanded = mobileOpenId === link.id;
            return (
              <div key={link.id} className="border-b border-gray-100">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleNav(link)}
                    className="flex-1 text-left px-2 py-2.5 text-sm font-medium text-[#1D1D1F] inline-flex items-center gap-2"
                  >
                    {link.label}
                    {link.badge ? (
                      <span className="rounded-full bg-[#0070d5] px-1.5 py-[1px] text-[9px] font-semibold uppercase text-white">
                        {link.badge}
                      </span>
                    ) : null}
                  </button>
                  {panel && (panel.sidebar.length > 0 || panel.groups.length > 0) && (
                    <button
                      type="button"
                      className="p-2 text-gray-500"
                      aria-expanded={expanded}
                      onClick={() => setMobileOpenId(expanded ? null : link.id)}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {expanded && panel && (
                  <div className="px-3 pb-3 space-y-1">
                    {panel.sidebar.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="block w-full text-left text-xs text-gray-600 py-1.5"
                        onClick={() => {
                          navigateToPlp(link.value, item.series);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};

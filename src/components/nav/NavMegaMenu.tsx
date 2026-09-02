import React, { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { MegaPanelConfig, resolveMegaGroup } from '../../data/megaMenu';
import { formatPrice } from '../../data/currency';
import { productListingImage } from '../../lib/pim/productListingImage';
import { useStore } from '../../context/StoreContext';
import { ViewMode } from '../../types';

interface NavMegaMenuProps {
  panel: MegaPanelConfig;
  labelledBy: string;
  onClose: () => void;
}

export const NavMegaMenu: React.FC<NavMegaMenuProps> = ({ panel, labelledBy, onClose }) => {
  const { navigateToPdp, navigateToPlp, setViewMode, currency } = useStore();
  const [activeSidebar, setActiveSidebar] = useState<string | null>(panel.sidebar[0]?.id ?? null);

  const activeSeries = panel.sidebar.find((item) => item.id === activeSidebar)?.series;

  const groups = useMemo(() => {
    const resolved = panel.groups.map(resolveMegaGroup).filter((g) => g.products.length > 0);
    if (!activeSidebar) return resolved;
    const filtered = resolved.filter((g) => {
      if (g.sidebarId) return g.sidebarId === activeSidebar;
      if (activeSeries && g.series) return g.series === activeSeries;
      return true;
    });
    return filtered.length > 0 ? filtered : resolved;
  }, [panel, activeSidebar, activeSeries]);

  const goViewAll = (category?: string, series?: string) => {
    if (category) navigateToPlp(category, series);
    onClose();
  };

  return (
    <section
      id={`mega-${panel.id}`}
      role="region"
      aria-labelledby={labelledBy}
      className="absolute left-0 right-0 top-full z-40 bg-white text-[#1D1D1F] border-t border-black/6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] max-h-[min(80vh,720px)] overflow-y-auto"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="Close menu"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex min-h-[280px]">
        {panel.sidebar.length > 0 && (
          <aside className="w-56 shrink-0 border-r border-gray-100 py-6 px-5">
            <ul className="space-y-1">
              {panel.sidebar.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveSidebar(item.id)}
                    onFocus={() => setActiveSidebar(item.id)}
                    onClick={() => {
                      const group = panel.groups.find((g) => g.sidebarId === item.id || g.series === item.series);
                      if (item.series || group?.viewAllCategory) {
                        navigateToPlp(group?.viewAllCategory || 'all', item.series);
                      }
                      onClose();
                    }}
                    className={`w-full text-left px-2 py-1.5 text-[13px] rounded-md ${
                      activeSidebar === item.id ? 'text-black font-medium bg-gray-50' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="flex-1 py-6 px-8 pr-16 space-y-8">
          {panel.editorial && (
            <div className="max-w-xl space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">{panel.editorial.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{panel.editorial.body}</p>
              <button
                type="button"
                onClick={() => {
                  if (panel.editorial?.ctaView) {
                    setViewMode(panel.editorial.ctaView as ViewMode);
                  } else if (panel.editorial?.ctaCategory) {
                    navigateToPlp(panel.editorial.ctaCategory);
                  }
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0070d5] hover:underline"
              >
                {panel.editorial.ctaLabel} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.id}>
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-sm font-semibold">{group.title}</h3>
                {group.viewAllCategory ? (
                  <button
                    type="button"
                    onClick={() => goViewAll(group.viewAllCategory, group.viewAllSeries)}
                    className="text-xs text-gray-400 hover:text-black inline-flex items-center gap-0.5"
                  >
                    View all <ChevronRight className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {group.products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      navigateToPdp(product.id);
                      onClose();
                    }}
                    className="text-center group"
                  >
                    <div className="bg-[#F5F5F7] rounded-lg aspect-square flex items-center justify-center overflow-hidden mb-2 px-4 py-5">
                      <img
                        src={productListingImage(product)}
                        alt=""
                        className="max-h-full max-w-[85%] object-contain group-hover:scale-[1.03] transition-transform"
                      />
                    </div>
                    <p className="text-[12px] leading-snug text-[#1D1D1F] line-clamp-2 px-1">{product.modelName}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      From {formatPrice(product.basePriceEur, currency)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

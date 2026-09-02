import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  getContentPageBySlug,
  SUPPORT_EMAIL,
  type ContentPageDefinition
} from '../data/storeContentPages';
import { CONTENT_NAV_SECTIONS, type ContentNavSection } from '../data/storeContentNavigation';
import { ContentPageSidebar } from './content/ContentPageSidebar';

function getNavSectionForPage(page: ContentPageDefinition): ContentNavSection | undefined {
  return CONTENT_NAV_SECTIONS.find((entry) => page.path.startsWith(entry.pathPrefix));
}

export const StoreContentPage: React.FC = () => {
  const {
    contentPageSlug,
    setViewMode,
    navigateToContent,
    navigateToPlp,
    setAccountActiveTab
  } = useStore();

  const page = contentPageSlug ? getContentPageBySlug(contentPageSlug) : undefined;
  const navSection = getNavSectionForPage(page);

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Page not found</h1>
        <button
          type="button"
          onClick={() => setViewMode('home')}
          className="px-6 py-2.5 bg-[#1D1D1F] text-white font-bold rounded-xl text-xs"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleCta = () => {
    if (!page.cta) return;
    switch (page.cta.action) {
      case 'plp':
        navigateToPlp(page.cta.target || 'all');
        break;
      case 'account':
        setAccountActiveTab('dashboard');
        setViewMode('account');
        break;
      case 'track':
        setViewMode('track-order');
        break;
      case 'easa':
        setViewMode('easa-guide');
        break;
      case 'refurbished':
        navigateToPlp('refurbished');
        break;
      case 'compare':
        setViewMode('compare');
        break;
      case 'contact':
        window.location.href = `mailto:${SUPPORT_EMAIL}`;
        break;
      case 'home':
      default:
        setViewMode('home');
    }
  };

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {navSection && (
          <div className="lg:hidden mb-6">
            <label htmlFor="content-nav-mobile" className="sr-only">
              Browse {navSection.title}
            </label>
            <select
              id="content-nav-mobile"
              value={page.slug}
              onChange={(e) => navigateToContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-[#F5F5F7]"
            >
              {navSection.groups.flatMap((group) =>
                group.items.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {group.items.length > 1 ? `${group.label} — ${item.label ?? item.slug}` : item.label ?? item.slug}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start gap-0">
          {navSection && (
            <aside className="hidden lg:block w-[240px] shrink-0 sticky top-24">
              <ContentPageSidebar
                section={navSection}
                activeSlug={page.slug}
                onNavigate={navigateToContent}
              />
            </aside>
          )}

          <article className="flex-1 min-w-0 lg:pl-10 lg:border-l lg:border-gray-200">
            <header className="pb-8 mb-2">
              {page.eyebrow && (
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 mb-2">
                  {page.eyebrow}
                </p>
              )}
              <h1 className="text-2xl sm:text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
                {page.title}
              </h1>
              {page.summary && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-2xl">{page.summary}</p>
              )}
            </header>

            <div className="space-y-0">
              {page.sections.map((section, index) => (
                <section
                  key={section.heading}
                  className={`py-8 ${index > 0 ? 'border-t border-gray-200' : 'pt-0'}`}
                >
                  <h2 className="text-base font-semibold text-gray-900 mb-4">{section.heading}</h2>
                  <div className="text-sm text-gray-600 leading-[1.75] space-y-4">
                    <p>{section.body}</p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-2 pl-0 list-none">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-gray-600">
                            <span className="text-gray-400 mt-1.5 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {page.cta && (
              <div className="py-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCta}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#0060FF] hover:text-[#004ecc] transition-colors"
                >
                  {page.cta.label}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

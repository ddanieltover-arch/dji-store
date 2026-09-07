import React, { useId, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { HOME_NETHERLANDS_BUYER_FAQS } from '../../data/netherlandsBuyerFaq';
import { useStore } from '../../context/StoreContext';

/**
 * Homepage buyer-intent FAQ for Netherlands search queries
 * (how to buy / where can I buy / how much for … in Netherlands).
 */
export const HomeBuyerFaq: React.FC = () => {
  const { navigateToContent, navigateToPlp } = useStore();
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(HOME_NETHERLANDS_BUYER_FAQS[0]?.id ?? null);

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOME_NETHERLANDS_BUYER_FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    }),
    []
  );

  return (
    <section className="w-full bg-white" aria-labelledby={`${baseId}-heading`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold text-[#E30613] uppercase tracking-widest block">
            Netherlands Buying Help
          </span>
          <h2
            id={`${baseId}-heading`}
            className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1"
          >
            How to buy DJI in the Netherlands
          </h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Straight answers on where to buy, how much products cost in euros, delivery from Amsterdam, and
            what warranty you get when you shop DJI Store EU.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {HOME_NETHERLANDS_BUYER_FAQS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-[#FAFAFA] overflow-hidden"
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="cursor-pointer flex w-full items-start justify-between gap-3 px-5 py-4 text-left hover:bg-white transition-colors"
                >
                  <span className="text-sm sm:text-[15px] font-semibold text-[#1D1D1F] leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    {item.link && (
                      <button
                        type="button"
                        className="cursor-pointer mt-3 text-sm font-semibold text-[#0060FF] hover:underline"
                        onClick={() => {
                          if (item.link?.type === 'content') navigateToContent(item.link.slug);
                          else if (item.link?.type === 'plp') navigateToPlp(item.link.category);
                        }}
                      >
                        {item.link.type === 'content' ? 'Read more →' : 'Shop this category →'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

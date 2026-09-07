import React from 'react';
import { HOME_CATEGORY_STRIP } from '../../data/homeCategoryStrip';
import { useStore } from '../../context/StoreContext';

/**
 * Matches store.dji.com homepage navIcon strip (CardComponent):
 * 96×96 icons + 14px titles, horizontal scroller under the hero.
 */
export const HomeCategoryStrip: React.FC = () => {
  const { navigateToPlp } = useStore();

  return (
    <nav
      aria-label="Shop by product series"
      className="w-full bg-white"
    >
      <div className="max-w-[1440px] mx-auto">
        <ul className="flex items-start overflow-x-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {HOME_CATEGORY_STRIP.map((item) => (
            <li key={item.id} className="shrink-0 w-[104px] sm:w-[112px] lg:w-[120px] px-1 sm:px-2">
              <button
                type="button"
                onClick={() => navigateToPlp(item.category, item.series)}
                className="group cursor-pointer block w-full text-center tracking-[-0.02em] text-[rgba(0,0,0,0.85)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
              >
                <img
                  src={item.imageSrc}
                  alt=""
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto h-20 w-20 sm:h-[88px] sm:w-[88px] lg:h-24 lg:w-24 object-cover align-middle"
                />
                <span className="mt-1 block text-[12px] leading-4 lg:text-[14px] lg:leading-6">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

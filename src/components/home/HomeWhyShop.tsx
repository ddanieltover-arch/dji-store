import React from 'react';
import { HOME_WHY_SHOP_COLUMNS, type HomeWhyShopCard } from '../../data/homeWhyShop';
import { useStore } from '../../context/StoreContext';

function WhyShopTile({ card }: { card: HomeWhyShopCard }) {
  const { navigateToContent, navigateToPlp } = useStore();

  const onClick = () => {
    if (card.action.type === 'content') {
      navigateToContent(card.action.slug);
      return;
    }
    navigateToPlp(card.action.category, card.action.series);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ flex: `${card.flex} 1 0` }}
      className="group relative flex min-h-0 flex-col overflow-hidden rounded-md bg-white cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
    >
      {/* Title above the visual — matches store.dji.com InterestsCard title placement */}
      <div className="relative z-[2] flex shrink-0 items-start justify-center px-3 pt-3 pb-1 sm:px-6 sm:pt-4 lg:px-8 lg:pt-4">
        <span className="line-clamp-2 text-center text-[14px] sm:text-[16px] lg:text-[20px] leading-5 lg:leading-6 font-semibold tracking-[-0.03em] text-[rgba(0,0,0,0.85)]">
          {card.title}
        </span>
      </div>

      {/* Graphic sits below the title */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={card.imageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
    </button>
  );
}

/**
 * Matches store.dji.com Interests mosaic (“Why shop with DJI Store”).
 */
export const HomeWhyShop: React.FC = () => {
  return (
    <section className="w-full bg-[#f5f5f7]" aria-labelledby="why-shop-heading">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <h2
          id="why-shop-heading"
          className="text-[28px] sm:text-[32px] lg:text-[36px] leading-tight font-semibold tracking-tight text-[rgba(0,0,0,0.85)] mb-6 sm:mb-8"
        >
          Why shop with DJI Store Netherlands
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {HOME_WHY_SHOP_COLUMNS.map((column) => (
            <div
              key={column.id}
              className="flex flex-col gap-3 sm:gap-4 h-[280px] sm:h-[320px] xl:h-[400px]"
            >
              {column.cards.map((card) => (
                <WhyShopTile key={card.id} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

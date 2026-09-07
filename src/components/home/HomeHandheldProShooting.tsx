import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import {
  HOME_HANDHELD_PRO_SHOOTING,
  type HomeProductColumnCard
} from '../../data/homeProductColumns';
import { DJI_PRODUCTS } from '../../data/products';
import { formatPrice } from '../../data/currency';
import { useStore } from '../../context/StoreContext';

function ProductColumnCard({ card }: { card: HomeProductColumnCard }) {
  const { navigateToPdp, currency } = useStore();
  const [imageIndex, setImageIndex] = useState(0);
  const product = DJI_PRODUCTS.find((p) => p.id === card.productId);
  const priceEur = product?.basePriceEur ?? 0;
  const images = card.images.length ? card.images : ['/products/placeholder.png'];
  const active = images[imageIndex] ?? images[0];

  const step = (dir: -1 | 1) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((i) => (i + dir + images.length) % images.length);
  };

  return (
    <article className="group relative flex w-[220px] sm:w-[240px] lg:w-[260px] shrink-0 flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="relative flex h-[200px] sm:h-[220px] lg:h-[240px] w-full items-center justify-center overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => navigateToPdp(card.productId)}
          className="absolute inset-0 z-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
          aria-label={card.displayName}
        >
          <img
            src={active}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={step(-1)}
              className="absolute left-2 top-1/2 z-[1] hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:flex group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={step(1)}
              className="absolute right-2 top-1/2 z-[1] hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:flex group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1 px-4 pb-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setImageIndex(i)}
              className={`h-[2px] w-5 rounded-full transition-colors ${
                i === imageIndex ? 'bg-[rgba(0,0,0,0.65)]' : 'bg-[rgba(0,0,0,0.15)]'
              }`}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigateToPdp(card.productId)}
        className="flex flex-1 flex-col px-4 pb-5 pt-1 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
      >
        <span className="line-clamp-2 min-h-[32px] text-[12px] leading-4 text-[rgba(0,0,0,0.45)]">
          {card.tagline}
        </span>
        <span className="mt-1 text-[16px] leading-5 font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.85)]">
          {card.displayName}
        </span>
        <span className="mt-3 text-[14px] leading-5 text-[rgba(0,0,0,0.65)]">
          {card.hasFrom ? 'From ' : ''}
          {formatPrice(priceEur, currency)}
        </span>
      </button>
    </article>
  );
}

/**
 * Matches store.dji.com ProductColumns “Handheld · Pro Shooting” module.
 */
export const HomeHandheldProShooting: React.FC = () => {
  const { navigateToPdp, navigateToPlp, navigateToContent, currency } = useStore();
  const { title, primary, products, sideLinks } = HOME_HANDHELD_PRO_SHOOTING;
  const primaryProduct = DJI_PRODUCTS.find((p) => p.id === primary.productId);

  return (
    <section className="w-full bg-white" aria-labelledby="handheld-pro-shooting-heading">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h2
          id="handheld-pro-shooting-heading"
          className="text-[24px] sm:text-[28px] lg:text-[32px] font-semibold tracking-tight text-[rgba(0,0,0,0.85)] mb-6 sm:mb-8"
        >
          {title}
        </h2>

        {/* Primary featured product (RS 5) */}
        <button
          type="button"
          onClick={() => navigateToPdp(primary.productId)}
          className="group relative mb-4 sm:mb-5 block w-full overflow-hidden rounded-md text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
        >
          <div className="relative aspect-[16/7] sm:aspect-[21/8] w-full bg-[#eceff1]">
            <img
              src={primary.imageSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14 max-w-xl text-white">
              <h3 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold tracking-tight">
                {primary.displayName}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-white/85 line-clamp-2">{primary.tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm sm:text-base text-white/90">
                  {primary.hasFrom ? 'From ' : ''}
                  {formatPrice(primaryProduct?.basePriceEur ?? 0, currency)}
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[rgba(0,0,0,0.85)]">
                  Buy Now
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Product cards + side links */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((card) => (
            <ProductColumnCard key={card.id} card={card} />
          ))}

          <div className="flex w-[200px] sm:w-[220px] shrink-0 flex-col gap-3 sm:gap-4">
            {sideLinks.map((link) => {
              const onClick = () => {
                if (link.action.type === 'content') navigateToContent(link.action.slug);
                else navigateToPlp(link.action.category);
              };

              if (link.kind === 'guide') {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={onClick}
                    className="relative flex min-h-[180px] flex-[1.6] overflow-hidden rounded-md bg-black text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
                  >
                    {link.imageSrc && (
                      <img
                        src={link.imageSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-bottom"
                        loading="lazy"
                      />
                    )}
                    <div className="relative z-[1] flex h-full w-full flex-col justify-start p-4 text-white">
                      <span className="text-[12px] leading-4 text-white/75">{link.eyebrow}</span>
                      <span className="mt-2 flex items-start justify-between gap-2 text-[16px] sm:text-[18px] leading-6 font-semibold tracking-[-0.02em]">
                        <span className="line-clamp-3 pr-1">{link.title}</span>
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={onClick}
                  className="flex min-h-[88px] flex-1 items-center justify-center gap-2 rounded-md bg-[#f7f8f9] px-4 text-[16px] font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.85)] hover:bg-[#eef0f2] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F]"
                >
                  {link.title}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

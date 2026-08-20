import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveHomeHeroSlides } from '../../data/homeHeroSlides';
import { formatPrice } from '../../data/currency';
import { useStore } from '../../context/StoreContext';
import { useHeroCarousel, usePrefersReducedMotion } from '../../hooks/useHeroCarousel';

export const HomeHeroCarousel: React.FC = () => {
  const { navigateToPdp, currency } = useStore();
  const slides = useMemo(() => resolveHomeHeroSlides(), []);
  const reducedMotion = usePrefersReducedMotion();
  const { index, goTo, goNext, goPrev, pause, resume } = useHeroCarousel(
    slides.length,
    reducedMotion
  );

  const active = slides[index];
  if (!active) return null;

  const duration = reducedMotion ? 0 : 0.6;

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-black text-white"
      aria-roledescription="carousel"
      aria-label="Top Picks"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          resume();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goPrev();
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goNext();
        }
      }}
      tabIndex={0}
    >
        <div className="relative h-[56vh] min-h-[420px] max-h-[780px] sm:h-[70vh] lg:h-[85vh] lg:min-h-[600px]">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <img
              key={slide.id}
              src={slide.imageSrc}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
                reducedMotion ? 'duration-0' : 'duration-700'
              } ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: slide.objectPosition || 'center' }}
              fetchPriority={slideIndex === 0 ? 'high' : 'low'}
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              decoding={slideIndex === 0 ? 'sync' : 'async'}
              aria-hidden={!isActive}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="relative z-10 flex h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col justify-end pb-16 sm:pb-20 lg:justify-center lg:pb-0 lg:max-w-xl">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/70 mb-3">
              Top Picks
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -8 }}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light tracking-tight leading-[1.05] text-white">
                  {active.title}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-white/85 font-light max-w-md">
                  {active.tagline}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  From {formatPrice(active.product.basePriceEur, currency)}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateToPdp(active.product.id)}
                    className="min-h-11 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    {active.ctaLabel}
                  </button>
                  {active.ctaSecondary ? (
                    <button
                      type="button"
                      onClick={() => navigateToPdp(active.product.id)}
                      className="min-h-11 px-6 py-2.5 rounded-full border border-white/70 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      {active.ctaSecondary}
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {active.title}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/55 border border-white/15 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/55 border border-white/15 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(slideIndex)}
              className={`h-2.5 min-w-[10px] rounded-full transition-all ${
                slideIndex === index
                  ? 'w-7 bg-white'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}: ${slide.title}`}
              aria-current={slideIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

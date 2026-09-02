import React, { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResolvedHomeHeroSlide, resolveHomeHeroSlides } from '../../data/homeHeroSlides';
import { useStore } from '../../context/StoreContext';
import { useHeroCarousel, usePrefersReducedMotion } from '../../hooks/useHeroCarousel';

export const HomeHeroCarousel: React.FC = () => {
  const { navigateToPdp, setViewMode } = useStore();
  const slides = useMemo(() => resolveHomeHeroSlides(), []);
  const reducedMotion = usePrefersReducedMotion();
  const { index, goTo, goNext, goPrev, pause, resume } = useHeroCarousel(
    slides.length,
    reducedMotion
  );

  const navigateSlide = useCallback(
    (slide: ResolvedHomeHeroSlide) => {
      if (slide.link.type === 'best-sellers') {
        setViewMode('best-sellers');
        return;
      }

      if (slide.product) {
        navigateToPdp(slide.product.id);
      }
    },
    [navigateToPdp, setViewMode]
  );

  const active = slides[index];
  if (!active) return null;

  const duration = reducedMotion ? 0 : 0.6;
  const isDarkText = active.theme === 'dark';

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-black text-white font-['Open_Sans',system-ui,sans-serif]"
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

        <button
          type="button"
          onClick={() => navigateSlide(active)}
          className="absolute inset-0 z-[5] cursor-pointer border-0 bg-transparent p-0"
          aria-label={`${active.title}: ${active.tagline}. ${active.ctaLabel}`}
        />

        <div
          className={`pointer-events-none absolute inset-0 ${
            isDarkText
              ? 'bg-gradient-to-r from-white/30 via-white/10 to-transparent'
              : 'bg-gradient-to-r from-black/75 via-black/35 to-black/10'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDarkText
              ? 'bg-gradient-to-t from-white/40 via-transparent to-white/10'
              : 'bg-gradient-to-t from-black/70 via-transparent to-black/20'
          }`}
        />

        <div className="pointer-events-none relative z-10 flex h-full max-w-[1664px] mx-auto px-8 lg:px-8">
          <div className="flex w-full flex-col justify-end pb-16 sm:pb-20 lg:justify-center lg:pb-0 lg:max-w-[50%]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -8 }}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className={`text-[2rem] md:text-[2.5rem] md:leading-[3rem] lg:text-[4rem] lg:leading-[4.5rem] font-semibold tracking-normal ${
                    isDarkText ? 'text-[rgba(0,0,0,0.85)]' : 'text-white'
                  }`}
                >
                  {active.title}
                </h1>
                <p
                  className={`text-lg md:text-xl md:leading-6 lg:text-[28px] lg:leading-8 mt-4 lg:mt-6 max-w-md font-normal ${
                    isDarkText ? 'text-[rgba(0,0,0,0.85)]' : 'text-white'
                  }`}
                >
                  {active.tagline}
                </p>
                <div className="mt-4 lg:mt-12">
                  <span
                    className={`inline-flex min-h-8 items-center rounded-full px-3 md:px-8 py-1.5 text-sm font-normal ${
                      isDarkText
                        ? 'bg-[rgba(0,0,0,0.85)] text-white'
                        : 'bg-white/70 text-[rgba(0,0,0,0.85)]'
                    }`}
                  >
                    {active.ctaLabel}
                  </span>
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
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 sm:left-6 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center text-white hover:text-white/80 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-8 w-8 stroke-[1.5]" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          className="absolute right-2 sm:right-6 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center text-white hover:text-white/80 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-8 w-8 stroke-[1.5]" />
        </button>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5 px-4">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(slideIndex);
              }}
              className={`h-0.5 rounded-full transition-all ${
                slideIndex === index
                  ? 'w-10 bg-white'
                  : 'w-6 bg-white/40 hover:bg-white/70'
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

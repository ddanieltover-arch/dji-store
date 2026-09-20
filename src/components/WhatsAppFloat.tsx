import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/** Digits-only E.164 for wa.me links (no + or spaces). */
export const WHATSAPP_NUMBER = '14809605245';

const WA_HREF = `https://wa.me/${WHATSAPP_NUMBER}`;
const SHOW_AFTER_PX = 400;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.11 17.4c-.28-.14-1.64-.81-1.89-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.29s.98 2.66 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z" />
      <path d="M16.02 3C9.39 3 4 8.38 4 15c0 2.11.55 4.17 1.6 5.99L4 29l8.2-1.55A11.96 11.96 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.82c-1.86 0-3.68-.5-5.27-1.44l-.38-.22-4.87.92.93-4.74-.25-.4A9.8 9.8 0 0 1 6.2 15c0-5.41 4.41-9.81 9.82-9.81S25.84 9.59 25.84 15s-4.4 9.82-9.82 9.82z" />
    </svg>
  );
}

/**
 * Floating storefront actions: Back to Top + WhatsApp (+1 480 960 5245).
 */
export const WhatsAppFloat: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => setShowTop(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  if (!enabled) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-[5.5rem] left-5 z-40 flex flex-col items-center gap-3 md:bottom-24">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-[#1D1D1F] shadow-lg shadow-black/10 transition-all hover:scale-105 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F] ${
          showTop ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
        }`}
      >
        <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp +1 480 960 5245"
        title="WhatsApp +1 480 960 5245"
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>
    </div>
  );
};

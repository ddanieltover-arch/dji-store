'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const TAWK_SRC = 'https://embed.tawk.to/6a99a53e1a911a344109d346/1k1k2qvl6';
const TAWK_MOBILE_STYLE_ID = 'tawk-mobile-offset-style';
/** Mobile bottom nav is ~52px + safe area; lift chat above it. */
const MOBILE_Y_OFFSET_PX = 72;

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
      customStyle?: {
        visibility?: {
          desktop?: { position?: string; xOffset?: number | string; yOffset?: number | string };
          mobile?: { position?: string; xOffset?: number | string; yOffset?: number | string };
        };
      };
    };
    Tawk_LoadStart?: Date;
  }
}

function applyTawkVisibility(enabled: boolean) {
  if (enabled) {
    window.Tawk_API?.showWidget?.();
  } else {
    window.Tawk_API?.hideWidget?.();
  }
}

function ensureMobileOffsetStyles() {
  if (document.getElementById(TAWK_MOBILE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = TAWK_MOBILE_STYLE_ID;
  style.textContent = `
    @media (max-width: 767px) {
      body > div:has(> iframe[src*="tawk.to"]),
      body > div:has(iframe[title*="chat"]),
      #tawkchat-container,
      .widget-visible {
        bottom: ${MOBILE_Y_OFFSET_PX}px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export function StorefrontTawkToChat() {
  const pathname = usePathname();
  const enabled = !pathname.startsWith('/admin') && !pathname.startsWith('/ops');
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: { position: 'br', xOffset: 20, yOffset: 20 },
        mobile: { position: 'br', xOffset: 16, yOffset: MOBILE_Y_OFFSET_PX }
      }
    };
    window.Tawk_API.onLoad = () => applyTawkVisibility(enabledRef.current);
    ensureMobileOffsetStyles();

    if (enabled && !document.querySelector(`script[src="${TAWK_SRC}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = TAWK_SRC;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
    }

    applyTawkVisibility(enabled);
  }, [enabled]);

  return null;
}

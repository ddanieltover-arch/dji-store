import { useEffect, useRef } from 'react';

const TAWK_SRC = 'https://embed.tawk.to/6a99a53e1a911a344109d346/1k1k2qvl6';

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
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

/** Loads the Tawk.to messenger once on the customer storefront. */
export function TawkToChat({ enabled = true }: { enabled?: boolean }) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
    window.Tawk_API.onLoad = () => applyTawkVisibility(enabledRef.current);

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

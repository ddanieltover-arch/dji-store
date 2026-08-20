import { useCallback, useEffect, useRef, useState } from 'react';

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

export function useMegaMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const intentOpen = useCallback((id: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openTimer.current = setTimeout(() => setOpenId(id), OPEN_DELAY);
  }, []);

  const intentClose = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  }, []);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpenId(null);
  }, []);

  const openNow = useCallback((id: string) => {
    clearTimers();
    setOpenId(id);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeNow]);

  useEffect(() => () => clearTimers(), []);

  return { openId, intentOpen, intentClose, closeNow, openNow };
}

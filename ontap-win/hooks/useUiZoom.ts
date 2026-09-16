import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ui-zoom-scale';
const MIN = 0.5;
const MAX = 2;
const STEP = 0.1;

const clamp = (v: number): number => {
  if (isNaN(v)) return 1;
  return Math.min(MAX, Math.max(MIN, Math.round(v * 10) / 10));
};

/**
 * Zoom toàn giao diện kiểu trình duyệt (Ctrl + lăn chuột / Ctrl + +/-/0).
 * Độc lập với useFontScale (chỉ zoom chữ trong màn thi).
 * Áp dụng qua CSS `zoom` trên documentElement nên scale toàn bộ layout,
 * khác với font-size override chỉ đổi cỡ chữ.
 */
export const useUiZoom = (): void => {
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return clamp(parseFloat(window.localStorage.getItem(STORAGE_KEY) ?? ''));
  });

  // Áp dụng + persist mỗi khi đổi
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(zoom));
    } catch {
      // Ignore storage errors (private mode...)
    }
    document.documentElement.style.setProperty('zoom', String(zoom));
  }, [zoom]);

  // Phím tắt + con lăn kiểu trình duyệt
  useEffect(() => {
    const onWheel = (e: WheelEvent): void => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => clamp(z + (e.deltaY < 0 ? STEP : -STEP)));
    };
    const onKeyDown = (e: KeyboardEvent): void => {
      if (!e.ctrlKey) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom((z) => clamp(z + STEP));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom((z) => clamp(z - STEP));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };
    // passive: false để preventDefault chặn được zoom native của trình duyệt (tránh double-zoom)
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
};

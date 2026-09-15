import { useState, useEffect } from 'react';

export const useFontScale = () => {
  const [scale, setScale] = useState<number>(() => {
    const saved = typeof window === 'undefined' ? null : localStorage.getItem('quiz-font-scale');
    if (!saved) return 1;
    const parsed = parseFloat(saved);
    return isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 0.5), 2);
  });

  useEffect(() => {
    localStorage.setItem('quiz-font-scale', scale.toString());
  }, [scale]);

  const increase = () => setScale(s => Math.min(Math.round((s + 0.1) * 10) / 10, 2));
  const decrease = () => setScale(s => Math.max(Math.round((s - 0.1) * 10) / 10, 0.5));

  const handleManualInput = (val: number) => {
    if (isNaN(val)) return;
    setScale(Math.min(Math.max(Math.round(val * 10) / 10, 0.5), 2));
  };

  return { scale, setScale: handleManualInput, increase, decrease };
};

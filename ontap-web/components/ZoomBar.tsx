import React from 'react';

interface ZoomBarProps {
  scale: number;
  setScale: (v: number) => void;
  increase: () => void;
  decrease: () => void;
}

export const ZoomBar: React.FC<ZoomBarProps> = ({ scale, setScale, increase, decrease }) => {
  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-slate-900 border-t dark:border-slate-700 text-slate-800 dark:text-slate-200 p-2 flex justify-end items-center gap-2 z-50">
      <button onClick={decrease} className="px-2 text-xl" aria-label="Giảm cỡ chữ">-</button>
      <input
        type="range" min="0.5" max="2" step="0.1"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
        className="w-32"
        aria-label="Mức zoom"
      />
      <button onClick={increase} className="px-2 text-xl" aria-label="Tăng cỡ chữ">+</button>
      <span className="w-12 text-right">{Math.round(scale * 100)}%</span>
    </div>
  );
};

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PaletteIcon } from './icons';
import type { Theme } from '../types';

const themes: { name: Theme; label: string; color: string }[] = [
  { name: 'noel', label: 'Giáng Sinh', color: 'bg-[#8B0000]' },
  { name: 'modern', label: 'Hiện Đại', color: 'bg-indigo-600' },
  { name: 'classic', label: 'Cổ Điển', color: 'bg-[#6F6049]' },
  { name: 'sunrise', label: 'Bình Minh', color: 'bg-orange-500' },
  { name: 'tri-an', label: 'Tri Ân', color: 'bg-red-400' },
];

const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-40 rounded-lg border border-border bg-card p-2 shadow-2xl flex flex-col gap-1 animate-slide-in-right">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => handleThemeChange(t.name)}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-md flex items-center gap-3 transition-colors ${
                theme === t.name
                  ? 'bg-primary/20 text-primary'
                  : 'text-card-foreground hover:bg-secondary'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${t.color} border border-white/20`}></span>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Change theme"
      >
        <PaletteIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
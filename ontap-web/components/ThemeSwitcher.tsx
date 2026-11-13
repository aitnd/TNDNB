import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface ThemeSwitcherProps {
  variant?: 'icon' | 'menu-item';
  className?: string;
}

const SunIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.981A10.503 10.503 0 0112 21a10.5 10.5 0 01-10.5-10.5c0-4.368 2.667-8.162 6.43-9.742a.75.75 0 01.819.162z"
      clipRule="evenodd"
    />
  </svg>
);

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const label = isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối';

  if (variant === 'menu-item') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={label}
        title={label}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`.trim()}
      >
        <span className="flex items-center gap-3 min-w-0">
          {isDark ? (
            <SunIcon className="w-[18px] h-[18px] text-amber-400 shrink-0 transition-transform duration-200" />
          ) : (
            <MoonIcon className="w-[18px] h-[18px] text-primary shrink-0 transition-transform duration-200" />
          )}
          <span className="truncate">Giao diện</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground">
            {isDark ? 'Tối' : 'Sáng'}
          </span>
          <span
            aria-hidden="true"
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${
              isDark
                ? 'bg-sky-500 border-sky-400'
                : 'bg-slate-300 border-slate-400/70'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl border border-border bg-secondary/70 hover:bg-secondary text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm ${className}`.trim()}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-amber-400 transition-transform duration-200" />
      ) : (
        <MoonIcon className="w-5 h-5 text-slate-700 transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeSwitcher;

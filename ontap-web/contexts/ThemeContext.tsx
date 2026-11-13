import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Theme } from '../types';

export const SESSION_THEME_KEY = 'ontap_theme_session';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function normalizeStoredTheme(raw: string | null): Theme {
  if (raw === 'dark') return 'dark';
  return 'light';
}

export function getInitialTheme(storage?: Pick<Storage, 'getItem'> | null): Theme {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
          ? window.sessionStorage
          : null;
    if (!targetStorage) return 'light';
    const saved = targetStorage.getItem(SESSION_THEME_KEY);
    return normalizeStoredTheme(saved);
  } catch {
    return 'light';
  }
}

export function clearLegacyThemeStorage(storage?: Pick<Storage, 'removeItem'> | null): void {
  try {
    const localStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
          ? window.localStorage
          : null;
    if (!localStorage) return;
    localStorage.removeItem('ontap_theme');
    localStorage.removeItem('theme');
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage trong chế độ riêng tư hoặc iframe
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    try {
      if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.setItem(SESSION_THEME_KEY, newTheme);
      }
    } catch {
      // Bỏ qua nếu sessionStorage bị khóa
    }
  }, []);

  useEffect(() => {
    clearLegacyThemeStorage();
    const initial = getInitialTheme();
    applyTheme(initial);
  }, [applyTheme]);

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

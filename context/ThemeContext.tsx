'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'noel'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 🔥 Mặc định state khởi tạo là 'noel'
  const [theme, setThemeState] = useState<ThemeMode>('noel')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    
    if (savedTheme) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // 🔥 Nếu chưa có lịch sử, ÉP MẶC ĐỊNH LÀ NOEL ngay lập tức
      setThemeState('noel')
      document.documentElement.setAttribute('data-theme', 'noel')
      localStorage.setItem('theme', 'noel') // Lưu lại luôn
    }
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme phải được dùng bên trong ThemeProvider')
  }
  return context
}
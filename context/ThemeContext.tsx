'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Định nghĩa 3 loại theme
export type ThemeMode = 'light' | 'dark' | 'modern' | 'classic' | 'sunrise' | 'tri-an' | 'noel'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void // ✅ THÊM DÒNG NÀY ĐỂ HẾT LỖI
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Mặc định state khởi tạo là 'light'
  const [theme, setThemeState] = useState<ThemeMode>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode

    if (savedTheme) {
      if (savedTheme === 'noel') {
        // Force migration to light if noel is found
        setThemeState('light')
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      } else {
        setThemeState(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
    } else {
      // Nếu chưa có lịch sử, ÉP MẶC ĐỊNH LÀ LIGHT
      setThemeState('light')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  // Hàm set theme cụ thể (dùng khi chọn từ dropdown nếu có)
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // ✅ HÀM CHUYỂN ĐỔI VÒNG TRÒN (Sáng -> Tối -> Noel -> Modern -> Classic -> Sunrise -> Tri Ân)
  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'noel', 'modern', 'classic', 'sunrise', 'tri-an']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
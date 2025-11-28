'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Định nghĩa kiểu dữ liệu cho Context
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Mặc định là 'light' (sáng)
  const [theme, setTheme] = useState<Theme>('light')

  // Khi web vừa tải xong, kiểm tra xem trước đó người dùng chọn gì chưa
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  // Hàm đổi giao diện
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme) // Lưu vào bộ nhớ trình duyệt
    document.documentElement.setAttribute('data-theme', newTheme) // Đổi thuộc tính HTML để CSS bắt được
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook để dùng nhanh ở các component khác
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme phải được dùng bên trong ThemeProvider')
  }
  return context
}
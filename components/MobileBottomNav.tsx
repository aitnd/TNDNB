'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaNewspaper, FaGraduationCap, FaUser, FaBars } from 'react-icons/fa'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  // Ensure it only mounts on client to avoid hydration mismatch
  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) return null

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: FaHome },
    { name: 'Tin tức', href: '/danh-muc/tin-tuc-su-kien', icon: FaNewspaper },
    { name: 'Tuyển sinh', href: '/danh-muc/tuyen-sinh', icon: FaUser },
    { name: 'Ôn tập', href: '/ontap', icon: FaGraduationCap },
    { name: 'Quản lý', href: '/quan-ly', icon: FaBars }, // Changed 'Them' to 'Menu' for clarity
  ]

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:hidden animate-fade-in-up">
      {/* Glassmorphism Container */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-2 flex justify-between items-center relative overflow-hidden">
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine pointer-events-none" />

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full py-2 transition-all duration-300 group ${isActive ? '-translate-y-1' : ''}`}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <div className="absolute top-1 w-10 h-10 bg-indigo-500/20 rounded-full blur-md" />
              )}

              <Icon
                className={`text-2xl mb-1 transition-all duration-300 drop-shadow-sm ${isActive
                  ? 'text-indigo-600 dark:text-indigo-400 scale-110 filter drop-shadow-[0_2px_4px_rgba(79,70,229,0.3)]'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
              />

              <span className={`text-[10px] font-bold transition-all duration-300 ${isActive
                ? 'text-indigo-600 dark:text-indigo-400 opacity-100'
                : 'text-gray-400 dark:text-gray-500 opacity-80 group-hover:opacity-100'
                }`}>
                {item.name}
              </span>

              {/* Active Dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

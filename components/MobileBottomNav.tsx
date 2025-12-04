'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: 'fa-home' },
    { name: 'Tin tức', href: '/tin-tuc', icon: 'fa-newspaper' },
    { name: 'Khóa học', href: '/khoa-hoc', icon: 'fa-book-open' },
    { name: 'Hồ sơ', href: '/ho-so', icon: 'fa-user' },
    { name: 'Thêm', href: '/them', icon: 'fa-ellipsis-h' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[99999] md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
            >
              <i className={`fas ${item.icon} text-xl mb-0.5`}></i>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

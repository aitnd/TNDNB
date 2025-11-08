import React from 'react'

// Đảm bảo file này "xuất khẩu" (export) component
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH.
        </p>
        <p className="text-xs mt-2">
          Địa chỉ: Đường Triệu Việt Vương - Phường Bích Đào - TP. Ninh Bình - Tỉnh Ninh Bình | MST: 2700960947
        </p>
      </div>
    </footer>
  )
}
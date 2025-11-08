// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' // (Dùng đường dẫn tương đối ../)
import { auth } from '../utils/firebaseClient' // (Dùng đường dẫn tương đối ../)
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user } = useAuth() // "Hút" dữ liệu từ "Bộ não"
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login') // Đăng xuất xong "đá" về /login
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err)
    }
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-800">
              Trường dạy nghề thủy nội địa Ninh Bình
            </Link>
          </div>

          {/* 2. Menu (trên máy tính) */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900">
              Trang chủ
            </Link>
            {/* (Mình sẽ thêm link 'Học phí', 'Liên hệ' ở đây sau) */}
            
            {/* Link "thông minh" (nút Đăng nhập / Quản lý) */}
            {user ? (
              <>
                <Link href="/quan-ly" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900">
                  Quản lý
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/login" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900">
                Đăng nhập
              </Link>
            )}

            {/* Link "Thi Online" (nếu là Học viên) */}
            {user && user.role === 'hoc_vien' && (
               <Link href="/quan-ly" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Vào Thi
              </Link>
            )}
            
            {/* Link "Admin" (nếu là Sếp) */}
            {user && (user.role === 'admin' || user.role === 'giao_vien' || user.role === 'lanh_dao') && (
               <Link href="/admin" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                Admin
              </Link>
            )}

          </div>
          {/* (Mình sẽ làm menu mobile sau nha) */}
        </div>
      </div>
    </nav>
  )
}
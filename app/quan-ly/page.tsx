// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext' // "Bộ não" Auth
import ProtectedRoute from '@/components/ProtectedRoute' // "Lính gác"
import { auth } from '@/utils/firebaseClient' // "Tổng đài" Firebase
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

// "Triệu hồi" component "con"
import CreateRoomForm from '@/components/CreateRoomForm' 
// 💖 ĐÂY LÀ DÒNG IMPORT CHÍNH XÁC (KHÔNG CÓ {}) 💖
import JoinRoomList from '@/components/JoinRoomList' 

// 1. TẠO "NỘI DUNG" TRANG
function QuanLyDashboard() {
  const { user } = useAuth() 
  const router = useRouter()

  // Hàm "dịch" tên vai trò
  const dichTenVaiTro = (role: string) => {
    switch (role) {
      case 'hoc_vien': return 'Học viên'
      case 'giao_vien': return 'Giáo viên'
      case 'lanh_dao': return 'Lãnh đạo'
      case 'admin': return 'Quản trị viên'
      default: return role
    }
  }

  // Hàm Đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth) 
      console.log('Đã đăng xuất!')
      router.push('/login') 
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err)
    }
  }

  // Giao diện của trang
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto rounded-lg bg-white p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">
            Trang Quản lý
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>

        {/* Thông tin người dùng */}
        {user && (
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200 mb-8">
            <p className="text-lg">
              Chào mừng,{' '}
              <strong className="text-blue-700">{user.email}</strong>!
            </p>
            <p className="text-lg">
              Vai trò của bạn: {' '}
              <strong className="font-semibold text-green-700">
                {dichTenVaiTro(user.role)}
              </strong>
            </p>
          </div>
        )}

        {/* --- CHỨC NĂNG CỦA GIÁO VIÊN / ADMIN / LÃNH ĐẠO --- */}
        {user && user.role !== 'hoc_vien' && (
          <CreateRoomForm />
        )}

        {/* --- CHỨC NĂNG CỦA HỌC VIÊN --- */}
        {user && user.role === 'hoc_vien' && (
          <JoinRoomList />
        )}

      </div>
    </div>
  )
}

// 2. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC"
export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard /> 
    </ProtectedRoute>
  )
}
// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import { useAuth } from '../../context/AuthContext' 
import ProtectedRoute from '../../components/ProtectedRoute' 
import { auth } from '../../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

import CreateRoomForm from '../../components/CreateRoomForm' 
import JoinRoomList from '../../components/JoinRoomList' 
// 💖 1. "TRIỆU HỒI" DASHBOARD MỚI CỦA GIÁO VIÊN 💖
import TeacherRoomList from '../../components/TeacherRoomList'

// (Import CSS Module)
import styles from './page.module.css' 

// 2. TẠO "NỘI DUNG" TRANG
function QuanLyDashboard() {
  const { user } = useAuth() 
  const router = useRouter()

  // (Hàm dịch tên vai trò - Giữ nguyên)
  const dichTenVaiTro = (role: string) => {
    switch (role) {
      case 'hoc_vien': return 'Học viên'
      case 'giao_vien': return 'Giáo viên'
      case 'lanh_dao': return 'Lãnh đạo'
      case 'admin': return 'Quản trị viên'
      default: return role
    }
  }

  // (Hàm Đăng xuất - Giữ nguyên)
  const handleLogout = async () => {
    try {
      await signOut(auth) 
      console.log('Đã đăng xuất!')
      router.push('/login') 
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err)
    }
  }

  // Giao diện (Đã "mặc" CSS Module)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Thanh tiêu đề và nút Đăng xuất */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Trang Quản lý
          </h1>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Đăng xuất
          </button>
        </div>

        {/* Thông tin người dùng (Họ và Tên) */}
        {user && (
          <div className={styles.userInfoBox}>
            <p>
              Chào mừng,{' '}
              <strong>{user.fullName || user.email}</strong>!
            </p>
            <p>
              Vai trò của bạn: {' '}
              <strong>
                {dichTenVaiTro(user.role)}
              </strong>
            </p>
          </div>
        )}

        {/* --- CHỨC NĂNG CỦA GIÁO VIÊN / ADMIN / LÃNH ĐẠO --- */}
        {user && user.role !== 'hoc_vien' && (
          <>
            {/* (Form tạo phòng) */}
            <CreateRoomForm />
            
            {/* 💖 2. "VẼ" DASHBOARD MỚI RA (Req 2+3) 💖 */}
            <TeacherRoomList />
          </>
        )}

        {/* --- CHỨC NĂNG CỦA HỌC VIÊN --- */}
        {user && user.role === 'hoc_vien' && (
          // (Req 1: File này đã được cập nhật ở Bước 2)
          <JoinRoomList />
        )}

      </div>
    </div>
  )
}

// 3. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC"
export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard /> 
    </ProtectedRoute>
  )
}
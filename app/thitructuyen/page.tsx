// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
// 💖 1. SỬA ĐƯỜNG DẪN "ĐI LÙI 2 BƯỚC" (../../) 💖
import { useAuth } from '../../context/AuthContext' 
import ProtectedRoute from '../../components/ProtectedRoute' 
import { auth } from '../../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

// 💖 2. SỬA ĐƯỜNG DẪN "ĐI LÙI 2 BƯỚC" (../../) 💖
import CreateRoomForm from '../../components/CreateRoomForm' 
import JoinRoomList from '../../components/JoinRoomList' 
import TeacherRoomList from '../../components/TeacherRoomList' 

// (Import CSS Module - file này nó đi theo "nhà" nên giữ nguyên)
import styles from './page.module.css' 

// (TẠO "NỘI DUNG" TRANG - Giữ nguyên)
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
      case 'quan_ly': return 'Quản lý' 
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
            Hệ thống Thi Trực Tuyến
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

        {/* --- CHỨC NĂNG CỦA GIÁO VIÊN / ADMIN / LÃNH ĐẠO / QUAN_LY --- */}
        {user && user.role !== 'hoc_vien' && (
          <>
            {/* (Form tạo phòng) */}
            <CreateRoomForm />
            
            <TeacherRoomList />
          </>
        )}

        {/* --- CHỨC NĂNG CỦA HỌC VIÊN --- */}
        {user && user.role === 'hoc_vien' && (
          <JoinRoomList />
        )}

      </div>
    </div>
  )
}

// ("BỌC" NỘI DUNG BẰNG "LÍNH GÁC" - Giữ nguyên)
// (Bất kỳ ai (kể cả học viên) vào /thitructuyen đều phải đăng nhập)
export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard /> 
    </ProtectedRoute>
  )
}
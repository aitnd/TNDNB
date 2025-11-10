// Đánh dấu đây là "Client Component"
'use client'

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext' 
import ProtectedRoute from '../../components/ProtectedRoute' 
import { auth } from '../../utils/firebaseClient' 
import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'

// (Import CSS Module)
import styles from './page.module.css' 

// 1. TẠO "NỘI DUNG" TRANG DASHBOARD
function QuanLyDashboard() {
  const { user } = useAuth() 
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');

  // 4.1: Chức năng Đổi mật khẩu
  const handleChangePassword = async () => {
    if (!user || !user.email) {
      setResetError('Không tìm thấy email của bạn.');
      return;
    }
    setResetMsg('');
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetMsg(`Đã gửi link reset mật khẩu tới: ${user.email}. Vui lòng kiểm tra email!`);
    } catch (err: any) {
      setResetError(err.message || 'Lỗi khi gửi email.');
    }
  }

  // (Hàm dịch tên vai trò - Nâng cấp)
  const dichTenVaiTro = (role: string) => {
    switch (role) {
      case 'hoc_vien': return 'Học viên'
      case 'giao_vien': return 'Giáo viên'
      case 'lanh_dao': return 'Lãnh đạo'
      case 'quan_ly': return 'Quản lý' // (Role mới)
      case 'admin': return 'Quản trị viên (Admin)'
      default: return role
    }
  }

  // (Kiểm tra quyền hạn)
  const coQuyenDangBai = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role);
  const coQuyenThi = user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role);
  const coQuyenQLTaiKhoan = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role); // (Đã sửa)

  // Giao diện (Đã "mặc" CSS Module)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <h1 className={styles.title}>
          Bảng điều khiển
        </h1>

        {/* 4. Thông tin tài khoản (ĐÃ SỬA) */}
        {user && (
          <div className={styles.infoBox}>
            <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
            <p><strong>Họ và tên:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            
            {/* 💖 THÊM SĐT VÀ NGÀY SINH 💖 */}
            <p>
              <strong>Số điện thoại:</strong> 
              {user.phoneNumber ? user.phoneNumber : <span className={styles.subText}>Chưa cập nhật</span>}
            </p>
            <p>
              <strong>Ngày sinh:</strong> 
              {user.birthDate ? user.birthDate : <span className={styles.subText}>Chưa cập nhật</span>}
            </p>
            
            <p><strong>Vai trò:</strong> {dichTenVaiTro(user.role)}</p>

            {/* 💖 CÁC NÚT MỚI NÈ ANH 💖 */}
            <div className={styles.infoBoxActions}>
              <Link href="/quan-ly/ho-so" className={styles.buttonPrimary}>
                Chỉnh sửa thông tin
              </Link>
              <button onClick={handleChangePassword} className={styles.buttonDanger}>
                Gửi email Đổi mật khẩu
              </button>
            </div>
            {resetMsg && <p className={styles.success}>{resetMsg}</p>}
            {resetError && <p className={styles.error}>{resetError}</p>}
          </div>
        )}

        {/* 4.2 & 4.3: Các nút chức năng theo Role */}
        <div className={styles.actionGrid}>
          {/* == HỌC VIÊN == */}
          {user?.role === 'hoc_vien' && (
            <Link href="/quan-ly/thi-truc-tuyen" className={styles.actionCard}>
              <h3>Thi Trực Tuyến</h3>
              <p>Vào phòng thi và làm bài thi.</p>
            </Link>
          )}

          {/* == GIÁO VIÊN == */}
          {user?.role === 'giao_vien' && (
            <Link href="/quan-ly/thi-truc-tuyen" className={styles.actionCard}>
              <h3>Thi Trực Tuyến</h3>
              <p>Tạo phòng thi và quản lý thi.</p>
            </Link>
          )}

          {/* == QUẢN LÝ, LÃNH ĐẠO, ADMIN == */}
          {coQuyenDangBai && (
            <Link href="/quan-ly/dang-bai" className={styles.actionCard}>
              <h3>Quản lý Bài viết</h3>
              <p>Tạo, sửa, xóa bài viết, tin tức.</p>
            </Link>
          )}
          {coQuyenThi && (
             <Link href="/quan-ly/thi-truc-tuyen" className={styles.actionCard}>
              <h3>Thi Trực Tuyến</h3>
              <p>Tạo phòng thi và quản lý thi.</p>
            </Link>
          )}
          {coQuyenQLTaiKhoan && (
             <Link href="/quan-ly/tai-khoan" className={styles.actionCard}>
              <h3>Quản lý Tài khoản</h3>
              <p>Thêm, sửa, xóa người dùng.</p>
            </Link>
          )}
        </div>
        
        {/* 💖 (ĐÃ XÓA BOX "BẢO MẬT" CŨ Ở ĐÂY) 💖 */}

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
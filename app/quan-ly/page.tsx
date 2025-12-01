// Đánh dấu đây là "Client Component"
'use client'

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { auth } from '../../utils/firebaseClient'
import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'
import AnalyticsWidget from '../../components/AnalyticsWidget'
import CourseManager from '../../components/CourseManager'
import StudentManager from '../../components/StudentManager'

// (Import CSS Module)
import styles from './page.module.css'

// (NỘI DUNG TRANG - Giữ nguyên)
function QuanLyDashboard() {
  const { user } = useAuth()
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  // 💖 STATE CHO TAB QUẢN LÝ 💖
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'students'>('dashboard');

  // (Hàm Đổi mật khẩu - Giữ nguyên)
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

  // (Hàm dịch tên vai trò - Giữ nguyên)
  const dichTenVaiTro = (role: string) => {
    switch (role) {
      case 'hoc_vien': return 'Học viên'
      case 'giao_vien': return 'Giáo viên'
      case 'lanh_dao': return 'Lãnh đạo'
      case 'quan_ly': return 'Quản lý'
      case 'admin': return 'Quản trị viên (Admin)'
      default: return role
    }
  }

  // (Kiểm tra quyền hạn - Giữ nguyên)
  const coQuyenDangBai = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role);
  const coQuyenThi = user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role);
  const coQuyenQLTaiKhoan = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role);
  // 💖 QUYỀN QUẢN LÝ KHÓA HỌC & HỌC VIÊN (Giáo viên trở lên) 💖
  const coQuyenDaoTao = user && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(user.role);

  // (Giao diện - ĐÃ THÊM HỘP ANALYTICS)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>

        <h1 className={styles.title}>
          Bảng điều khiển
        </h1>

        {/* 💖 THANH TAB ĐIỀU HƯỚNG (Cho Giáo viên/Admin) 💖 */}
        {coQuyenDaoTao && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'dashboard' ? '#0070f3' : '#eee',
                color: activeTab === 'dashboard' ? 'white' : '#333',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600
              }}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'courses' ? '#0070f3' : '#eee',
                color: activeTab === 'courses' ? 'white' : '#333',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600
              }}
            >
              Quản lý Khóa học
            </button>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'students' ? '#0070f3' : '#eee',
                color: activeTab === 'students' ? 'white' : '#333',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600
              }}
            >
              Quản lý Học viên
            </button>
          </div>
        )}

        {/* 💖 NỘI DUNG TAB: KHÓA HỌC 💖 */}
        {activeTab === 'courses' && coQuyenDaoTao && <CourseManager />}

        {/* 💖 NỘI DUNG TAB: HỌC VIÊN 💖 */}
        {activeTab === 'students' && coQuyenDaoTao && <StudentManager />}

        {/* 💖 NỘI DUNG TAB: TỔNG QUAN (Mặc định) 💖 */}
        {activeTab === 'dashboard' && (
          <>
            {/* (HỘP ANALYTICS - Giữ nguyên) */}
            {user && (user.role === 'admin' || user.role === 'lanh_dao') && (
              <AnalyticsWidget />
            )}

            {/* Thông tin tài khoản */}
            {user && (
              <div className={styles.infoBox}>
                <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
                <p><strong>Họ và tên:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p>
                  <strong>Số điện thoại:</strong>
                  {user.phoneNumber ? user.phoneNumber : <span className={styles.subText}>Chưa cập nhật</span>}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>
                  {user.birthDate ? user.birthDate : <span className={styles.subText}>Chưa cập nhật</span>}
                </p>
                {/* 💖 THÊM LỚP HỌC & KHÓA HỌC 💖 */}
                <p>
                  <strong>Lớp học:</strong>
                  {user.class ? user.class : <span className={styles.subText}>Chưa cập nhật</span>}
                </p>
                <p>
                  <strong>Khóa học:</strong>
                  {user.courseName ? (
                    <span style={{ color: '#0070f3', fontWeight: 600 }}>{user.courseName}</span>
                  ) : (
                    <span className={styles.subText}>Chưa vào khóa</span>
                  )}
                </p>
                <p><strong>Vai trò:</strong> {dichTenVaiTro(user.role)}</p>

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

            <div className={styles.actionGrid}>
              {/* == HỌC VIÊN == */}
              {user?.role === 'hoc_vien' && (
                <Link href="/thitructuyen" className={styles.actionCard}>
                  <h3>Thi Trực Tuyến</h3>
                  <p>Vào phòng thi và làm bài thi.</p>
                </Link>
              )}

              {/* == GIÁO VIÊN == */}
              {user?.role === 'giao_vien' && (
                <Link href="/thitructuyen" className={styles.actionCard}>
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
                <Link href="/thitructuyen" className={styles.actionCard}>
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
          </>
        )}

      </div>
    </div>
  )
}

// (BỌC "LÍNH GÁC" - Giữ nguyên)
export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard />
    </ProtectedRoute>
  )
}
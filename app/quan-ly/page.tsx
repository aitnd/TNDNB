
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
import UserAccountManager from '../../components/UserAccountManager'
import PostManager from '../../components/PostManager'
import ExamManager from '../../components/ExamManager'
import ReviewManager from '../../components/ReviewManager' // 💖 IMPORT REVIEW MANAGER 💖

import { FaHome, FaBook, FaUsers, FaNewspaper, FaLaptop, FaClipboardList } from 'react-icons/fa' // (Icon cho đẹp)

// (Import CSS Module)
import styles from './page.module.css'

// (NỘI DUNG TRANG)
function QuanLyDashboard() {
  const { user } = useAuth()
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');

  // 💖 STATE CHO TAB QUẢN LÝ 💖
  // ('dashboard' | 'courses' | 'accounts' | 'posts' | 'exams' | 'reviews')
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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

  // (Hàm dịch tên vai trò)
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

  // (Kiểm tra quyền hạn)
  const canManagePosts = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role);
  const canManageExams = user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role);
  const canManageReviews = user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role); // 💖 QUYỀN QUẢN LÝ ÔN TẬP 💖
  const canManageAccounts = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role);
  const canManageCourses = user && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(user.role);

  // Học viên cũng được vào tab Thi (để làm bài)
  const canAccessExams = user && (canManageExams || user.role === 'hoc_vien');

  // 💖 GIAO DIỆN TAB ĐẸP MẮT 💖
  const renderTabButton = (id: string, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`${styles.tabButton} ${activeTab === id ? styles.activeTab : ''}`}
    >
      <span className={styles.tabIcon}>{icon}</span>
      {label}
    </button>
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>

        <h1 className={styles.title}>
          Bảng điều khiển
        </h1>

        {/* 💖 THANH TAB ĐIỀU HƯỚNG 💖 */}
        <div className={styles.tabContainer}>
          {renderTabButton('dashboard', 'Tổng quan', <FaHome />)}

          {canManageCourses && renderTabButton('courses', 'Quản lý Khóa học', <FaBook />)}

          {/* Gộp Quản lý Học viên vào Tài khoản */}
          {canManageAccounts && renderTabButton('accounts', 'Quản lý Tài khoản', <FaUsers />)}

          {canManagePosts && renderTabButton('posts', 'Quản lý Bài viết', <FaNewspaper />)}

          {canAccessExams && renderTabButton('exams', 'Thi Trực Tuyến', <FaLaptop />)}

          {canManageReviews && renderTabButton('reviews', 'Quản lý Ôn tập', <FaClipboardList />)}
        </div>

        {/* 💖 NỘI DUNG TAB 💖 */}
        <div className={styles.tabContent}>

          {/* 1. TỔNG QUAN */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              {/* (HỘP ANALYTICS) */}
              {user && (user.role === 'admin' || user.role === 'lanh_dao') && (
                <AnalyticsWidget />
              )}

              {/* Thông tin tài khoản */}
              {user && (
                <div className={styles.infoBox}>
                  <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
                  <div className={styles.infoGrid}>
                    <div>
                      <p><strong>Họ và tên:</strong> {user.fullName}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Vai trò:</strong> <span className={styles.roleTag}>{dichTenVaiTro(user.role)}</span></p>
                    </div>
                    <div>
                      <p>
                        <strong>Số điện thoại:</strong>
                        {user.phoneNumber ? user.phoneNumber : <span className={styles.subText}>Chưa cập nhật</span>}
                      </p>
                      <p>
                        <strong>Ngày sinh:</strong>
                        {user.birthDate ? user.birthDate : <span className={styles.subText}>Chưa cập nhật</span>}
                      </p>
                      <p>
                        <strong>Lớp / Khóa:</strong>
                        {user.class ? user.class : <span className={styles.subText}>--</span>} / {user.courseName || '--'}
                      </p>
                      <p><strong>Địa chỉ:</strong> {user.address || <span className={styles.subText}>Chưa cập nhật</span>}</p>
                    </div>
                    <div>
                      <p><strong>Số CCCD:</strong> {user.cccd || <span className={styles.subText}>Chưa cập nhật</span>}</p>
                      <p><strong>Ngày cấp:</strong> {user.cccdDate || <span className={styles.subText}>--</span>}</p>
                      <p><strong>Nơi cấp:</strong> {user.cccdPlace || <span className={styles.subText}>--</span>}</p>
                    </div>
                  </div>

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
            </div>
          )}

          {/* 2. KHÓA HỌC */}
          {activeTab === 'courses' && canManageCourses && <CourseManager />}

          {/* 3. TÀI KHOẢN (Đã gộp Học viên) */}
          {activeTab === 'accounts' && canManageAccounts && <UserAccountManager />}

          {/* 4. BÀI VIẾT */}
          {activeTab === 'posts' && canManagePosts && <PostManager />}

          {/* 5. THI TRỰC TUYẾN */}
          {activeTab === 'exams' && canAccessExams && <ExamManager />}

          {/* 6. QUẢN LÝ ÔN TẬP */}
          {activeTab === 'reviews' && canManageReviews && <ReviewManager />}

        </div>

      </div>
    </div>
  )
}

// (BỌC "LÍNH GÁC")
export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard />
    </ProtectedRoute>
  )
}
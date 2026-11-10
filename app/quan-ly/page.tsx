'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import AnalyticsWidget from '../../components/AnalyticsWidget'
import CourseManager from '../../components/CourseManager'
import PostManager from '../../components/PostManager'
import ReviewManager from '../../components/ReviewManager'
import StudentCard from '../../components/StudentCard'
import StudentClassView from '../../components/StudentClassView'
import StudentHistory from '../../components/StudentHistory'
import UserName from '../../components/UserName'
import { auth } from '../../utils/firebaseClient'
import { sendPasswordResetEmail } from 'firebase/auth'
import {
  FaHome,
  FaBook,
  FaUsers,
  FaNewspaper,
  FaStar,
  FaIdCard,
  FaEdit,
  FaCheckCircle,
  FaKey,
} from 'react-icons/fa'
import styles from './page.module.css'

const dichTenVaiTro = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên'
    case 'lanh_dao':
      return 'Lãnh đạo đơn vị'
    case 'quan_ly':
      return 'Cán bộ quản lý'
    case 'giao_vien':
      return 'Giáo viên'
    case 'hoc_vien':
      return 'Học viên'
    default:
      return 'Người dùng'
  }
}

const getValidAvatarUrl = (photoURL?: string | null, role?: string): string => {
  const defaultByRole = role === 'hoc_vien' ? '/assets/img/avatar1.webp' : '/assets/img/avatar.webp';
  if (!photoURL || typeof photoURL !== 'string') return defaultByRole;
  const trimmed = photoURL.trim();
  if (trimmed === '' || trimmed.includes('default_avatar.png') || trimmed.includes('default-avatar.png')) {
    return defaultByRole;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/assets/img/')) {
    return trimmed;
  }
  return defaultByRole;
};

function QuanLyDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState(false)

  const canManagePosts = Boolean(user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role))
  const canManageReviews = Boolean(user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role))
  const canManageAccounts = Boolean(user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role))
  const canManageCourses = Boolean(user && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(user.role))
  const canAccessMyClass = Boolean(user && user.role === 'hoc_vien')

  const handleChangePassword = async () => {
    setResetMsg(null)
    setResetError(null)
    if (!user?.email) {
      setResetError('Không tìm thấy địa chỉ email hợp lệ của tài khoản.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, user.email)
      setResetMsg(`Đã gửi email khôi phục/đổi mật khẩu tới ${user.email}. Vui lòng kiểm tra hộp thư.`)
    } catch (err: any) {
      console.error('Lỗi khi gửi email đổi mật khẩu:', err)
      setResetError(err?.message || 'Có lỗi xảy ra khi gửi email đổi mật khẩu.')
    }
  }

  const renderTabButton = (id: string, label: string, icon: React.ReactNode) => (
    <button
      type="button"
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
        <h1 className={styles.title}>Cổng Quản Lý &amp; Bảng Điều Khiển</h1>

        {/* Thanh Tab Điều Hướng */}
        <div className={styles.tabContainer}>
          {renderTabButton('dashboard', 'Tổng quan', <FaHome />)}
          {canAccessMyClass && renderTabButton('my_class', 'Lớp của tôi', <FaUsers />)}
          {canManageCourses && renderTabButton('courses', 'Quản lý Khóa học', <FaBook />)}
          {canManageAccounts && renderTabButton('accounts', 'Quản lý Tài khoản', <FaUsers />)}
          {canManagePosts && renderTabButton('posts', 'Quản lý Bài viết', <FaNewspaper />)}
          {canManageReviews && renderTabButton('reviews', 'Kết quả Ôn tập', <FaStar />)}
        </div>

        {/* 1. TAB TỔNG QUAN */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContent}>
            {user && (user.role === 'admin' || user.role === 'lanh_dao') && (
              <AnalyticsWidget />
            )}

            {user && (
              <div className={styles.infoBox}>
                <div className={styles.infoHeader}>
                  <h2 className={styles.sectionTitle}>
                    <FaIdCard style={{ color: 'var(--color-accent, #003566)' }} />
                    Hồ sơ &amp; Thông tin tài khoản
                  </h2>
                  <Link href="/quan-ly/ho-so" className={styles.buttonPrimary}>
                    <FaEdit /> Chỉnh sửa hồ sơ
                  </Link>
                </div>

                <div className={styles.profileLayout}>
                  {/* Cột ảnh đại diện */}
                  <div className={styles.avatarColumn}>
                    <div className={styles.avatarFrame}>
                      <Image
                        src={avatarError ? (user.role === 'hoc_vien' ? '/assets/img/avatar1.webp' : '/assets/img/avatar.webp') : getValidAvatarUrl(user.photoURL, user.role)}
                        alt={user.fullName || 'Avatar'}
                        width={120}
                        height={120}
                        className={styles.avatarImg}
                        unoptimized
                        onError={() => setAvatarError(true)}
                      />
                    </div>
                    <span className={styles.roleTag}>{dichTenVaiTro(user.role)}</span>
                  </div>

                  {/* Cột chi tiết thông tin */}
                  <div className={styles.detailsColumns}>
                    <div>
                      <div className={styles.dataRow}>
                        <strong>Họ và tên:</strong>
                        <br />
                        <UserName
                          name={user.fullName || ''}
                          role={user.role}
                          courseId={user.courseId}
                          style={{ fontSize: '1.05rem', fontWeight: 600 }}
                        />
                      </div>
                      <div className={styles.dataRow}>
                        <strong>Email:</strong>
                        <br />
                        <span>{user.email}</span>
                      </div>
                      <div className={styles.dataRow}>
                        <strong>Số điện thoại:</strong>
                        <br />
                        <span>{user.phoneNumber || <span className={styles.subText}>Chưa cập nhật</span>}</span>
                      </div>
                      <div className={styles.dataRow}>
                        <strong>Ngày sinh:</strong>
                        <br />
                        <span>{user.birthDate || <span className={styles.subText}>Chưa cập nhật</span>}</span>
                      </div>
                    </div>

                    <div>
                      <div className={styles.dataRow}>
                        <strong>Lớp học:</strong>
                        <br />
                        <span>{user.class ? user.class : <span className={styles.subText}>Chưa phân lớp</span>}</span>
                      </div>
                      <div className={styles.dataRow}>
                        <strong>Khóa đào tạo:</strong>
                        <br />
                        {user.courseName ? (
                          <span style={{ color: 'var(--color-accent, #003566)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {user.courseName} <FaCheckCircle style={{ color: '#16a34a' }} />
                          </span>
                        ) : (
                          <span className={styles.subText}>Chưa đăng ký khóa học</span>
                        )}
                      </div>
                      <div className={styles.dataRow}>
                        <strong>Địa chỉ liên hệ:</strong>
                        <br />
                        <span>{user.address || <span className={styles.subText}>Chưa cập nhật</span>}</span>
                      </div>

                      <div className={styles.cccdBox}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>CCCD:</strong> {user.cccd || <span className={styles.subText}>Chưa cập nhật</span>}
                        </div>
                        <div>
                          <strong>Cấp ngày:</strong> {user.cccdDate || '--'} <strong>tại</strong> {user.cccdPlace || '--'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoBoxActions}>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className={styles.buttonDanger}
                  >
                    <FaKey /> Gửi email Đổi mật khẩu
                  </button>
                </div>

                {resetMsg && <p className={styles.success}>{resetMsg}</p>}
                {resetError && <p className={styles.error}>{resetError}</p>}
              </div>
            )}

            {user && user.role === 'hoc_vien' && <StudentHistory />}
          </div>
        )}

        {/* 2. TAB LỚP CỦA TÔI */}
        {activeTab === 'my_class' && canAccessMyClass && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <StudentCard />
            <StudentClassView />
          </div>
        )}

        {/* 3. TAB KHÓA HỌC */}
        {activeTab === 'courses' && canManageCourses && <CourseManager />}

        {/* 4. TAB TÀI KHOẢN */}
        {activeTab === 'accounts' && canManageAccounts && (
          <div className={styles.accountsCard}>
            <h2 className={styles.sectionTitle}>
              <FaUsers style={{ color: 'var(--color-accent, #003566)' }} />
              Quản lý Tài khoản &amp; Phân quyền
            </h2>
            <p className={styles.accountsDescription}>
              Trang chuyên biệt quản lý danh sách học viên, giáo viên, cán bộ quản lý; cấp phát tài khoản và điều chỉnh phân quyền người dùng trong toàn hệ thống.
            </p>
            <Link href="/quan-ly/tai-khoan" className={styles.buttonPrimary}>
              Mở Trang Quản Lý Tài Khoản &raquo;
            </Link>
          </div>
        )}

        {/* 5. TAB BÀI VIẾT */}
        {activeTab === 'posts' && canManagePosts && <PostManager />}

        {/* 6. TAB KẾT QUẢ ÔN TẬP */}
        {activeTab === 'reviews' && canManageReviews && <ReviewManager />}
      </div>
    </div>
  )
}

export default function QuanLyPage() {
  return (
    <ProtectedRoute>
      <QuanLyDashboard />
    </ProtectedRoute>
  )
}

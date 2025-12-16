// Đánh dấu đây là "Client Component"
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { auth } from '../../utils/firebaseClient'
import { sendPasswordResetEmail } from 'firebase/auth'
import { FaHome, FaBook, FaIdCard, FaEdit, FaCheckCircle, FaUsers, FaNewspaper, FaClipboardList, FaStar } from 'react-icons/fa'
import AnalyticsWidget from '../../components/AnalyticsWidget'
import UserName from '../../components/UserName'
import CourseManager from '../../components/CourseManager'
import UserAccountManager from '../../components/UserAccountManager'
import PostManager from '../../components/PostManager'
import ReviewManager from '../../components/ReviewManager'
import StudentClassView from '../../components/StudentClassView'
import StudentCard from '../../components/StudentCard'
import StudentHistory from '../../components/StudentHistory' // 💖 IMPORT HISTORY 💖
import styles from './page.module.css'

// (NỘI DUNG TRANG)
function QuanLyDashboard() {
  const { user } = useAuth()
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');

  // 💖 STATE CHO TAB QUẢN LÝ 💖
  // ('dashboard' | 'courses' | 'accounts' | 'posts' | 'reviews' | 'my_class')
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
  const canManageReviews = user && ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(user.role); // 💖 QUYỀN QUẢN LÝ ÔN TẬP 💖
  const canManageAccounts = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role);
  const canManageCourses = user && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(user.role);

  // 💖 QUYỀN TRUY CẬP LỚP CỦA TÔI (CHỈ HỌC VIÊN) 💖
  const canAccessMyClass = user && user.role === 'hoc_vien';

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

          {canAccessMyClass && renderTabButton('my_class', 'Lớp của tôi', <FaUsers />)} {/* 💖 TAB LỚP CỦA TÔI 💖 */}
          {canManageCourses && renderTabButton('courses', 'Quản lý Khóa học', <FaBook />)}
          {canManageAccounts && renderTabButton('accounts', 'Quản lý Tài khoản', <FaUsers />)}
          {canManagePosts && renderTabButton('posts', 'Quản lý Bài viết', <FaNewspaper />)}
          {canManageReviews && renderTabButton('reviews', 'Kết quả Ôn tập', <FaStar />)}
        </div>

        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContent}>

            {/* (HỘP ANALYTICS - ADMIN/LÃNH ĐẠO) */}
            {user && (user.role === 'admin' || user.role === 'lanh_dao') && (
              <AnalyticsWidget />
            )}

            {/* 💖 THÔNG TIN TÀI KHOẢN (CHUNG CHO TẤT CẢ) 💖 */}
            {user && (
              <div className={styles.infoBox} style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e8e8e8', paddingBottom: '15px' }}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0, fontSize: '1.5rem', color: '#1890ff' }}>
                    <FaIdCard style={{ marginRight: '10px' }} />
                    Thông tin tài khoản
                  </h2>
                  <Link href="/quan-ly/ho-so" className={styles.buttonPrimary} style={{ padding: '6px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaEdit /> Chỉnh sửa
                  </Link>
                </div>

                <div className={styles.infoGrid} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '30px' }}>
                  {/* AVATAR COLUMN */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
                      <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span className={styles.roleTag} style={{ marginTop: '5px', fontSize: '0.9rem', padding: '4px 12px' }}>{dichTenVaiTro(user.role)}</span>
                  </div>

                  {/* INFO COLUMN */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <p style={{ marginBottom: '10px' }}><strong>Họ và tên:</strong> <br /> <UserName name={user.fullName || ''} role={user.role} courseId={user.courseId} style={{ fontSize: '1.1rem' }} /></p>
                      <p style={{ marginBottom: '10px' }}><strong>Email:</strong> <br /> {user.email}</p>
                      <p style={{ marginBottom: '10px' }}><strong>Số điện thoại:</strong> <br /> {user.phoneNumber || <span className={styles.subText}>Chưa cập nhật</span>}</p>
                      <p><strong>Ngày sinh:</strong> <br /> {user.birthDate || <span className={styles.subText}>Chưa cập nhật</span>}</p>
                    </div>
                    <div>
                      <p style={{ marginBottom: '10px' }}>
                        <strong>Lớp (tự điền):</strong> <br />
                        {user.class ? user.class : <span className={styles.subText}>--</span>}
                      </p>
                      <p style={{ marginBottom: '10px' }}>
                        <strong>Khóa học:</strong> <br />
                        {user.courseName ? (
                          <span style={{ color: '#1890ff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {user.courseName} <FaCheckCircle />
                          </span>
                        ) : (
                          <span className={styles.subText}>Chưa vào khóa</span>
                        )}
                      </p>
                      <p style={{ marginBottom: '10px' }}><strong>Địa chỉ:</strong> <br /> {user.address || <span className={styles.subText}>Chưa cập nhật</span>}</p>

                      {/* CCCD Info (Compact) */}
                      <div style={{ background: '#fafafa', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #eee' }}>
                        <p style={{ margin: '0 0 5px 0' }}><strong>CCCD:</strong> {user.cccd || '--'}</p>
                        <p style={{ margin: 0 }}><strong>Cấp ngày:</strong> {user.cccdDate || '--'} <strong>tại</strong> {user.cccdPlace || '--'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoBoxActions} style={{ marginTop: '20px', borderTop: '1px solid #e8e8e8', paddingTop: '15px', justifyContent: 'flex-end' }}>
                  <button onClick={handleChangePassword} className={styles.buttonDanger} style={{ fontSize: '0.9rem' }}>
                    Gửi email Đổi mật khẩu
                  </button>
                </div>
                {resetMsg && <p className={styles.success} style={{ textAlign: 'right' }}>{resetMsg}</p>}
                {resetError && <p className={styles.error} style={{ textAlign: 'right' }}>{resetError}</p>}
              </div>
            )}

            {/* 💖 HỌC VIÊN: LỊCH SỬ 💖 */}
            {user && user.role === 'hoc_vien' && (
              <StudentHistory />
            )}

          </div>
        )}

        {/* 2. KHÓA HỌC */}
        {activeTab === 'courses' && canManageCourses && <CourseManager />}

        {/* 3. TÀI KHOẢN */}
        {activeTab === 'accounts' && canManageAccounts && <UserAccountManager />}

        {/* 4. BÀI VIẾT */}
        {activeTab === 'posts' && canManagePosts && <PostManager />}

        {/* 6. KẾT QUẢ ÔN TẬP */}
        {activeTab === 'reviews' && canManageReviews && <ReviewManager />}

        {/* 7. LỚP CỦA TÔI */}
        {activeTab === 'my_class' && canAccessMyClass && (
          <>
            {/* 💖 THẺ HỌC VIÊN Ở ĐẦU TAB LỚP 💖 */}
            <div style={{ marginBottom: '20px' }}>
              <StudentCard />
            </div>
            <StudentClassView />
          </>
        )}

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
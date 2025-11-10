// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

// "Triệu hồi" file CSS Module
import styles from './Navbar.module.css' 

export default function Navbar() {
  const { user } = useAuth() 
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login') 
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err)
    }
  }

  return (
    // (Sử dụng 'header' thay vì 'nav' cho toàn bộ)
    <header>
      {/* 💖 (Req 1) THANH TOP (ĐÃ CÓ LOGO + ĐĂNG NHẬP) 💖 */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          
          {/* 💖 LOGO ĐÃ CHUYỂN LÊN ĐÂY 💖 */}
          <Link href="/" className={styles.logo}>
            Tư vấn và giáo dục Ninh Binh
          </Link>

          <ul className={styles.topLinks}>
            
            {/* (Link "thông minh") */}
            {user ? (
              <>
                <li>
                  <Link href="/quan-ly">Quản lý</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </li>
                
                {/* Link "Vào Thi" (Học viên) */}
                {user.role === 'hoc_vien' && (
                   <li>
                     <Link href="/quan-ly" className={styles.ctaButton}>
                       Vào Thi
                     </Link>
                   </li>
                )}
                
                {/* Link "Admin" (Sếp) */}
                {(user.role === 'admin' || user.role === 'giao_vien' || user.role === 'lanh_dao') && (
                   <li>
                     <Link href="/admin" className={`${styles.ctaButton} ${styles.adminButton}`}>
                       Admin
                     </Link>
                   </li>
                )}
              </>
            ) : (
              <li>
                <Link href="/login">Đăng nhập</Link>
              </li>
            )}

          </ul>
        </div>
      </div>
      
      {/* 💖 THANH CHÍNH (CHỈ CÓ MENU) 💖 */}
      <nav className={styles.mainNav}>
        <div className={styles.mainContainer}>
          {/* (Logo đã bị bốc đi) */}

          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/gioi-thieu">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/tu-van-nghe-nghiep">Tư vấn nghề nghiệp</Link>
            </li>
            <li>
              <Link href="/chuong-trinh-dao-tao">Chương trình đào tạo</Link>
            </li>
            <li>
              <Link href="/hoc-phi">Học phí</Link>
            </li>
            <li>
              <Link href="/lien-he">Liên hệ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

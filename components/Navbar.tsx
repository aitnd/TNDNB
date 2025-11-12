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
    <header>
      {/* (THANH TOP - Giữ nguyên) */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            Tư vấn và giáo dục Ninh Binh
          </Link>

          {/* Các link bên phải */}
          <ul className={styles.topLinks}>
            
            {/* (Link "thông minh") */}
            {user ? (
              <>
                {/* (CHÀO MỪNG [TÊN]) */}
                <li>
                  <span className={styles.welcomeText}>
                    Chào mừng, {user.fullName}!
                  </span>
                </li>

                {/* (NÚT QUẢN LÝ) */}
                <li>
                  <Link href="/quan-ly">Quản lý</Link>
                </li>

                {/* (NÚT ĐĂNG XUẤT) */}
                <li>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </li>
              </>
            ) : (
              // (Nếu chưa đăng nhập)
              <li>
                <Link href="/login">Đăng nhập</Link>
              </li>
            )}

          </ul>
        </div>
      </div>
      
      {/* 💖 THANH CHÍNH (ĐÃ THÊM LINK "TÀI LIỆU") 💖 */}
      <nav className={styles.mainNav}>
        <div className={styles.mainContainer}>
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
              <Link href="/thu-vien">Thư viện</Link>
            </li>
            {/* 💖 ANH THÊM DÒNG NÀY VÀO NÈ 💖 */}
            <li>
              <Link href="/tai-lieu">Tài liệu</Link>
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
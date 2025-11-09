// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

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
      {/* (Thanh Top - Giữ nguyên) */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          <ul className={styles.topLinks}>
            {user ? (
              <>
                <li><Link href="/quan-ly">Quản lý</Link></li>
                <li><button onClick={handleLogout}>Đăng xuất</button></li>
                {user.role === 'hoc_vien' && (
                   <li><Link href="/quan-ly" className={styles.ctaButton}>Vào Thi</Link></li>
                )}
                {(user.role === 'admin' || user.role === 'giao_vien' || user.role === 'lanh_dao') && (
                   <li><Link href="/admin" className={`${styles.ctaButton} ${styles.adminButton}`}>Admin</Link></li>
                )}
              </>
            ) : (
              <li><Link href="/login">Đăng nhập</Link></li>
            )}
          </ul>
        </div>
      </div>
      
      {/* (Thanh Chính - Giữ nguyên) */}
      <nav className={styles.mainNav}>
        <div className={styles.mainContainer}>
          <Link href="/" className={styles.logo}>
            Trường dạy nghề thủy nội địa Ninh Bình
          </Link>

          {/* 💖 ĐÃ THÊM LINK "TƯ VẤN NGHỀ NGHIỆP" 💖 */}
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
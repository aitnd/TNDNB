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
    <nav className={styles.navbar}>
      <div className={styles.container}>
          
          {/* 1. Logo */}
          <Link href="/" className={styles.logo}>
            Trường dạy nghề thủy nội địa Ninh Bình
          </Link>

          {/* 2. Menu (ĐÃ THÊM LINK "LIÊN HỆ") */}
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/hoc-phi">Học phí</Link>
            </li>
            <li>
              <Link href="/lien-he">Liên hệ</Link>
            </li>
            {/* (Anh có thể thêm link "Ôn thi" tĩnh ở đây nếu muốn) */}
            {/*
            <li>
              <Link href="https://web-on-tap.vercel.app/" target="_blank">Ôn thi</Link>
            </li>
            */}
            
            {/* Link "thông minh" */}
            {user ? (
              <>
                <li>
                  <Link href="/quan-ly">Quản lý</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">Đăng nhập</Link>
              </li>
            )}

            {/* Link "Vào Thi" (Học viên) */}
            {user && user.role === 'hoc_vien' && (
               <li>
                 <Link href="/quan-ly" className={styles.ctaButton}>
                   Vào Thi
                 </Link>
               </li>
            )}
            
            {/* Link "Admin" (Sếp) */}
            {user && (user.role === 'admin' || user.role === 'giao_vien' || user.role === 'lanh_dao') && (
               <li>
                 <Link href="/admin" className={`${styles.ctaButton} ${styles.adminButton}`}>
                   Admin
                 </Link>
               </li>
            )}

          </ul>
      </div>
    </nav>
  )
}
// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
// 💖 TRIỆU HỒI ĐỦ CÁC ICON XỊN 💖
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation } from 'react-icons/fa' 

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
          <Link href="/" className={styles.logo}>
            Tư vấn và giáo dục Ninh Binh
          </Link>
          <ul className={styles.topLinks}>
            {user ? (
              <>
                <li>
                  <span className={styles.welcomeText}>
                    Chào mừng, {user.fullName}!
                  </span>
                </li>
                <li><Link href="/quan-ly">Quản lý</Link></li>
                <li><button onClick={handleLogout}>Đăng xuất</button></li>
              </>
            ) : (
              <li><Link href="/login">Đăng nhập</Link></li>
            )}
          </ul>
        </div>
      </div>
      
      {/* (THANH CHÍNH - FULL OPTION) */}
      <nav className={styles.mainNav}>
        <div className={styles.mainContainer}>
          <ul className={styles.navLinks}>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link href="/tu-van-nghe-nghiep">Tư vấn</Link></li>
            <li><Link href="/chuong-trinh-dao-tao">Đào tạo</Link></li>
            <li><Link href="/hoc-phi">Học phí</Link></li>
            <li><Link href="/thu-vien">Thư viện</Link></li>
            <li><Link href="/tai-lieu">Tài liệu</Link></li>

            {/* 💖 CỤM GIẢI TRÍ & HỌC TẬP 💖 */}
            <li>
              <Link href="/giai-tri" className={styles.hotLink}>
                <FaGamepad className={styles.hotIcon} /> Giải trí
              </Link>
            </li>

            <li>
              <a 
                href="https://ontap.daotaothuyenvien.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.hotLink} 
                title="Hệ thống Ôn tập trắc nghiệm"
              >
                <FaBookOpen className={styles.hotIcon} /> Ôn tập
              </a>
            </li>

            <li>
              <Link 
                href="/thitructuyen"
                className={styles.hotLink}
                title="Hệ thống Thi trực tuyến"
              >
                <FaLaptop className={styles.hotIcon} /> Thi Online
              </Link>
            </li>
            
            {/* 💖 MỚI: TRA CỨU ĐỊA CHỈ 💖 */}
            <li>
              <Link href="/tra-cuu-dia-chi" className={styles.hotLink}>
                 <FaSearchLocation className={styles.hotIcon} /> Tra cứu ĐC
              </Link>
            </li>

            {/* (Liên hệ ở cuối) */}
            <li><Link href="/lien-he">Liên hệ</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
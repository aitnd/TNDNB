'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { useTheme } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation, FaMoon, FaSun } from 'react-icons/fa' 

import styles from './Navbar.module.css' 

export default function Navbar() {
  const { user } = useAuth() 
  const { theme, toggleTheme } = useTheme()
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
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          <Link href="/" className={styles.logo}>
            Tư vấn và giáo dục Ninh Binh
          </Link>
          <ul className={styles.topLinks}>
            
            {/* 💖 NÚT ĐỔI GIAO DIỆN (PHIÊN BẢN CHỮ TRẮNG TOÀN TẬP) 💖 */}
            <li style={{ marginRight: '15px' }}>
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)', // Nền mờ nhẹ
                  border: '1px solid rgba(255, 255, 255, 0.5)', // Viền trắng mờ
                  color: '#ffffff', // ⚡ LUÔN LÀ CHỮ TRẮNG (để nổi trên nền Xanh/Đen)
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                title="Đổi giao diện Sáng/Tối"
              >
                {theme === 'light' ? <FaMoon color="#FFD700" /> : <FaSun color="#FFA500" />}
                <span>{theme === 'light' ? 'Giao diện Tối' : 'Giao diện Sáng'}</span>
              </button>
            </li>

            {user ? (
              <>
                <li>
                  <span className={styles.welcomeText}>
                    Chào, {user.fullName}!
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
      
      {/* (Phần dưới giữ nguyên) */}
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
              >
                <FaBookOpen className={styles.hotIcon} /> Ôn tập
              </a>
            </li>

            <li>
              <Link href="/thitructuyen" className={styles.hotLink}>
                <FaLaptop className={styles.hotIcon} /> Thi Online
              </Link>
            </li>
            
            <li>
              <Link href="/tra-cuu-dia-chi" className={styles.hotLink}>
                 <FaSearchLocation className={styles.hotIcon} /> Tra cứu ĐC
              </Link>
            </li>

            <li><Link href="/lien-he">Liên hệ</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
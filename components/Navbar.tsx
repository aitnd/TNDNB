'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { useTheme, ThemeMode } from '../context/ThemeContext' // Nhớ import ThemeMode
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation, FaPalette, FaSun, FaMoon, FaSnowflake, FaChevronDown } from 'react-icons/fa' 

import styles from './Navbar.module.css' 

export default function Navbar() {
  const { user } = useAuth() 
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showThemeMenu, setShowThemeMenu] = useState(false) // State cho dropdown

  const handleLogout = async () => {
    try { await signOut(auth); router.push('/login') } catch (err) { console.error(err) }
  }

  // Danh sách theme để render
  const themes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Sáng', icon: <FaSun color="#FFA500"/> },
    { id: 'dark', label: 'Tối', icon: <FaMoon color="#FFD700"/> },
    { id: 'noel', label: 'Noel', icon: <FaSnowflake color="#fff"/> },
  ]

  return (
    <header style={{ position: 'relative' }}>
      
      {/* 🎄 ẢNH TRANG TRÍ: Dây đèn góc phải (Chỉ hiện khi theme Noel) 🎄 */}
      {/* class 'decor-img decor-nav-corner' đã định nghĩa trong globals.css */}
      <img src="/assets/img/nav-light.png" alt="" className="decor-img decor-nav-corner" />

      {/* THANH TOP */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          <Link href="/" className={styles.logo}>
            Tư vấn và giáo dục Ninh Binh
          </Link>
          <ul className={styles.topLinks}>
            
            {/* 🔥 DROPDOWN CHỌN THEME 🔥 */}
            <li style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'var(--text-header)',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.85rem', fontWeight: '600'
                }}
              >
                <FaPalette /> 
                <span>Giao diện</span>
                <FaChevronDown size={10} />
              </button>

              {/* Menu con sổ xuống */}
              {showThemeMenu && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  overflow: 'hidden', zIndex: 100,
                  minWidth: '120px'
                }}>
                  {themes.map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => { setTheme(t.id); setShowThemeMenu(false) }}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        color: theme === t.id ? 'var(--mau-chinh)' : '#333',
                        fontWeight: theme === t.id ? 'bold' : 'normal',
                        backgroundColor: theme === t.id ? '#f0f9ff' : 'transparent',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      {t.icon} {t.label}
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* User Info */}
            {user ? (
              <>
                <li><span className={styles.welcomeText}>Chào, {user.fullName}!</span></li>
                <li><Link href="/quan-ly">Quản lý</Link></li>
                <li><button onClick={handleLogout}>Đăng xuất</button></li>
              </>
            ) : (
              <li><Link href="/login">Đăng nhập</Link></li>
            )}
          </ul>
        </div>
      </div>
      
      {/* THANH MAIN NAV (Giữ nguyên) */}
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

            {/* Các icon hot */}
            <li>
              <Link href="/giai-tri" className={styles.hotLink}>
                <FaGamepad className={styles.hotIcon} /> Giải trí
              </Link>
            </li>
            <li>
               <a href="https://ontap.daotaothuyenvien.com/" target="_blank" rel="noreferrer" className={styles.hotLink}>
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
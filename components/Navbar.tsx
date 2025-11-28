'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { useTheme, ThemeMode } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation, FaPalette, FaSun, FaMoon, FaSnowflake, FaChevronDown, FaStar } from 'react-icons/fa' 

import styles from './Navbar.module.css' 

export default function Navbar() {
  const { user } = useAuth() 
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showThemeMenu, setShowThemeMenu] = useState(false) 

  const handleLogout = async () => {
    try { await signOut(auth); router.push('/login') } catch (err) { console.error(err) }
  }

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Sáng', icon: <FaSun color="#FFA500"/> },
    { id: 'dark', label: 'Tối', icon: <FaMoon color="#FFD700"/> },
    { id: 'noel', label: 'Noel', icon: <FaSnowflake color="#fff"/> },
  ]

  return (
    <header style={{ position: 'relative' }}>
      
      {/* Ảnh trang trí góc (chỉ hiện khi theme Noel) */}
      <img src="/assets/img/nav-light.png" alt="" className="decor-img decor-nav-corner" />

      {/* THANH TOP HEADER */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          
          {/* 👇 KHU VỰC LOGO & TEXT ĐƯỢC CODE LẠI 👇 */}
          <Link href="/" className={styles.brandArea}>
            {/* Logo Bánh lái tàu */}
            <img 
              src="/assets/img/logo.png" 
              alt="Logo TĐNB" 
              className={styles.logoImg}
            />
            
            {/* Nội dung chữ mô phỏng Banner */}
            <div className={styles.brandText}>
              <div className={styles.brandLine1}>CÔNG TY CỔ PHẦN</div>
              <div className={styles.brandLine2}>
                 <span className={styles.brandHighlight}>TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</span>
              </div>
              <div className={styles.brandLine3}>
                <FaStar className={styles.star} /> 
                Đào tạo nâng hạng bằng thuyền, máy trưởng phương tiện thủy nội địa hạng nhất, nhì, ba
              </div>
              <div className={styles.brandLine3}>
                <FaStar className={styles.star} /> 
                Đào tạo và cấp các loại chứng chỉ chuyên môn cho người lái, thuyền viên phương tiện thủy nội địa:
                Thủy thủ, thợ máy, an toàn ven biển ...
              </div>
            </div>
          </Link>
          {/* 👆 KẾT THÚC KHU VỰC LOGO & TEXT 👆 */}


          <ul className={styles.topLinks}>
            
            {/* DROPDOWN CHỌN THEME */}
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
                  fontSize: '0.85rem', fontWeight: '600',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <FaPalette /> 
                <span>Giao diện</span>
                <FaChevronDown size={10} />
              </button>

              {showThemeMenu && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0,
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
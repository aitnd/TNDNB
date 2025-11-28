'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import { useTheme } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient' 
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
// Icon
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation, FaPalette, FaChevronDown, FaSun, FaMoon, FaSnowflake, FaStar, FaUserCog, FaSignOutAlt } from 'react-icons/fa' 

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
      {/* 🎄 ẢNH TRANG TRÍ (Chỉ hiện khi Theme Noel) 🎄 */}
      {theme === 'noel' && (
        <img 
          src="/assets/img/nav-light.png" 
          alt="" 
          style={{ position: 'absolute', top: 0, right: 0, width: '120px', pointerEvents: 'none', zIndex: 60 }} 
        />
      )}

      {/* === THANH TOP HEADER === */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          
          {/* 👇 KHU VỰC LOGO & TEXT ĐƯỢC CODE LẠI THEO YÊU CẦU 👇 */}
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


          {/* 2. KHU VỰC BÊN PHẢI (THEME & USER) */}
          <div className={styles.rightArea}>
            
            {/* Nút Đổi Theme */}
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.themeBtn}
                onClick={toggleTheme}
                title="Đổi giao diện"
              >
                {theme === 'light' && <><FaSun color="orange"/> Sáng</>}
                {theme === 'dark' && <><FaMoon color="yellow"/> Tối</>}
                {theme === 'noel' && <><FaSnowflake color="white"/> Noel</>}
              </button>
            </div>

            {/* User Menu (GOM GỌN) */}
            {user ? (
              <div className={styles.userBox}>
                {/* Dòng 1: Tên User */}
                <div className={styles.welcomeText}>
                  Chào, {user.fullName}
                </div>
                
                {/* Dòng 2: Nút Quản lý | Thoát */}
                <div className={styles.userActions}>
                  <Link href="/quan-ly" className={styles.actionLink}>
                    <FaUserCog /> Quản lý
                  </Link>
                  <span className={styles.separator}>|</span>
                  <button onClick={handleLogout} className={styles.actionLink}>
                    <FaSignOutAlt /> Thoát
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                Đăng nhập
              </Link>
            )}

          </div>
        </div>
      </div>
      
      {/* === THANH MAIN NAV (Giữ nguyên) === */}
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
              <a href="https://ontap.daotaothuyenvien.com/" target="_blank" className={styles.hotLink}>
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
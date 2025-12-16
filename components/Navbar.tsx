'use client'

import React, { useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
// Icon
import { FaBookOpen, FaLaptop, FaGamepad, FaSearchLocation, FaPalette, FaChevronDown, FaSun, FaMoon, FaSnowflake, FaStar, FaUserCog, FaSignOutAlt, FaCloudDownloadAlt } from 'react-icons/fa'

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
          style={{ position: 'absolute', top: '60px', right: 0, width: '120px', pointerEvents: 'none', zIndex: 60 }}
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
                Đào tạo nâng hạng GCNKNCM thuyền, máy trưởng phương tiện thủy nội địa hạng nhất, nhì, ba
              </div>
              <div className={styles.brandLine3}>
                <FaStar className={styles.star} />
                Đào tạo và cấp các loại chứng chỉ chuyên môn cho thuyền viên, người lái phương tiện thủy nội địa:
                Thủy thủ, thợ máy, an toàn ven biển ...
              </div>
            </div>
          </Link>
          {/* 👆 KẾT THÚC KHU VỰC LOGO & TEXT 👆 */}


          {/* 2. KHU VỰC BÊN PHẢI (THEME & USER) */}
          <div className={styles.rightArea}>

            {/* User Menu (GOM GỌN) */}
            {user ? (
              <div className={styles.userBox}>
                {/* Dòng 1: Tên User */}
                <div className={styles.welcomeText}>
                  Chào, {user.fullName}
                </div>

                {/* Dòng 2: Nút Quản lý | Thoát */}
                <div className={styles.userActions}>
                  <Link href="/quan-ly" className={styles.manageBtn}>
                    <FaUserCog /> Quản lý
                  </Link>
                  <span className={styles.separator}>|</span>
                  <button onClick={handleLogout} className={styles.actionLink}>
                    <FaSignOutAlt /> Thoát
                  </button>
                </div>

                {/* Dòng 3: Theme Switcher (Mới chuyển xuống đây) */}
                <div className="mt-2">
                  <ThemeSwitcher />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <Link href="/login" className={styles.loginBtn}>
                  Đăng nhập
                </Link>
                <ThemeSwitcher />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* === THANH MAIN NAV === */}
      <nav className={styles.mainNav}>
        <div className={styles.mainContainer}>
          <div className={styles.navLinks}>

            {/* DÒNG 1: CÁC TRANG CHÍNH (Button Lớn) */}
            <div className={styles.navRow1}>
              <Link href="/">Trang chủ</Link>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/tu-van-nghe-nghiep">Tư vấn</Link>
              <Link href="/chuong-trinh-dao-tao">Đào tạo</Link>
              <Link href="/hoc-phi">Học phí</Link>
              <Link href="/thu-vien">Thư viện</Link>
              <Link href="/tai-lieu">Tài liệu</Link>
              <Link href="/lien-he">Liên hệ</Link>
            </div>

            {/* DÒNG 2: DANH MỤC & TIỆN ÍCH (Button Nhỏ hơn) */}
            <div className={styles.navRow2}>

              {/* Nhóm Danh mục */}
              <div className={styles.categoryGroup}>
                <Link href="/danh-muc/tin-tuc-su-kien">Tin tức - Sự kiện</Link>
                <Link href="/danh-muc/gioi-thieu-viec-lam">Giới thiệu việc làm</Link>
                <Link href="/danh-muc/van-ban-phap-quy">Văn bản pháp quy</Link>
                <Link href="/danh-muc/tuyen-sinh">Thông báo tuyển sinh</Link>
              </div>

              {/* Nhóm Tiện ích */}
              <div className={styles.utilityGroup}>
                <Link href="/giai-tri" className={styles.hotLink}>
                  <FaGamepad className={styles.hotIcon} /> Giải trí
                </Link>
                <Link href="/ontap" className={styles.hotLink}>
                  <FaBookOpen className={styles.hotIcon} /> Ôn tập
                </Link>
                <Link href="/thitructuyen" className={styles.hotLink}>
                  <FaLaptop className={styles.hotIcon} /> Thi trực tuyến
                </Link>
                <Link href="/tai-app" className={styles.hotLink}>
                  <FaCloudDownloadAlt className={styles.hotIcon} /> Tải App
                </Link>
                <Link href="/tra-cuu-dia-chi" className={styles.hotLink}>
                  <FaSearchLocation className={styles.hotIcon} /> Tra cứu ĐC
                </Link>
              </div>

            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}
'use client'

import ThemeSwitcher from './ThemeSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaUserCog, FaSignOutAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useAuth()
  const { theme } = useTheme()
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
    <header className={styles.editorialHeader}>
      {/* 🎄 ẢNH TRANG TRÍ (Chỉ hiện khi Theme Noel) 🎄 */}
      {theme === 'noel' && (
        <Image
          src="/assets/img/nav-light.png"
          alt=""
          width={120}
          height={60}
          style={{ position: 'absolute', top: '60px', right: 0, pointerEvents: 'none', zIndex: 60 }}
        />
      )}

      {/* === TẦNG 1: TOP INSTITUTIONAL META BAR (N6 Masthead) === */}
      <div className={styles.mastheadMetaBar}>
        <div className={styles.metaContainer}>
          <div className={styles.metaLeft}>
            <span className={styles.metaBadge}>CỔNG THÔNG TIN ĐÀO TẠO &amp; SÁT HẠCH THUYỀN VIÊN</span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaContact}>
              <FaPhoneAlt className={styles.metaIcon} /> 022.96.282.969
            </span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaContact}>
              <FaEnvelope className={styles.metaIcon} /> giaoducninhbinh@daotaothuyenvien.com
            </span>
          </div>

          <div className={styles.metaRight}>
            <ThemeSwitcher />
            {user ? (
              <div className={styles.userActions}>
                <span className={styles.welcomeText}>{user.fullName}</span>
                <Link href="/quan-ly" className={styles.manageBtn}>
                  <FaUserCog /> Quản trị
                </Link>
                <button onClick={handleLogout} className={styles.actionLink}>
                  <FaSignOutAlt /> Thoát
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                Đăng nhập cán bộ
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* === TẦNG 2: INSTITUTIONAL MASTHEAD === */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          <Link href="/" className={styles.brandArea}>
            <Image
              src="/assets/img/logo.png"
              alt="Logo Công ty cổ phần Tư vấn và Giáo dục Ninh Bình"
              width={76}
              height={76}
              className={styles.logoImg}
              priority
            />
            <div className={styles.brandText}>
              <h1 className={styles.brandTitle}>
                Cổng thông tin Công ty cổ phần Tư vấn và Giáo dục Ninh Bình
              </h1>
              <p className={styles.brandSubtitle}>
                Đào tạo và cấp các loại chứng chỉ chuyên môn cho người lái, thuyền viên phương tiện thủy nội địa.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* === TẦNG 3: NAVIGATION & CHUYÊN MỤC BÁO CHÍ === */}
      <nav className={styles.mainNav} aria-label="Điều hướng chính">
        <div className={styles.mainContainer}>
          <div className={styles.navLinks}>
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

            <div className={styles.navRow2}>
              <div className={styles.categoryGroup}>
                <span className={styles.categoryLabel}>CHUYÊN MỤC:</span>
                <Link href="/danh-muc/tin-tuc-su-kien">Tin tức - Sự kiện</Link>
                <span className={styles.catDivider}>/</span>
                <Link href="/danh-muc/tuyen-sinh">Thông báo tuyển sinh</Link>
                <span className={styles.catDivider}>/</span>
                <Link href="/danh-muc/van-ban-phap-quy">Văn bản pháp quy</Link>
                <span className={styles.catDivider}>/</span>
                <Link href="/danh-muc/gioi-thieu-viec-lam">Giới thiệu việc làm</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

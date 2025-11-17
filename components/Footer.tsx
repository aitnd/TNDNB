import React from 'react'
import Link from 'next/link'
// 💖 1. "TRIỆU HỒI" ICON FB, YOUTUBE 💖
import { FaFacebookSquare, FaYoutube } from 'react-icons/fa'

// "Triệu hồi" file CSS Module
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* 💖 2. KHUNG LƯỚI 4 CỘT MỚI 💖 */}
        <div className={styles.footerGrid}>

          {/* --- CỘT 1: THÔNG TIN CTY --- */}
          <div className={styles.footerColumn}>
            <Link href="/" className={styles.footerLogo}>
              CÔNG TY CỔ PHẦN
              TƯ VẤN VÀ GIÁO DỤC NINH BÌNH
            </Link>
            <p>
              <strong>Địa chỉ:</strong> Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình
            </p>
            <p><strong>MST:</strong> 2700960947</p>
            <p><strong>SĐT:</strong> 022.96.282.969 </p>
            <p><strong>Email:</strong> ninhbinheduco.jsc@gmail.com</p>
	    <p><strong>      </strong> giaoducninhbinh@daotaothuyenvien.com</p>
          </div>

          {/* --- CỘT 2: LINK NHANH --- */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Về Chúng tôi</h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/gioi-thieu">Giới thiệu chung</Link>
              </li>
              <li>
                <Link href="/lien-he">Liên hệ</Link>
              </li>
              <li>
                <Link href="/hoc-phi">Học phí</Link>
              </li>
            </ul>
          </div>

          {/* --- CỘT 3: ĐÀO TẠO --- */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Đào tạo</h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/tu-van-nghe-nghiep">Tư vấn nghề nghiệp</Link>
              </li>
              <li>
                <Link href="/chuong-trinh-dao-tao">Chương trình đào tạo</Link>
              </li>
              <li>
                <Link href="/thu-vien">Thư viện ảnh</Link>
              </li>
              <li>
                <Link href="/tai-lieu">Tài liệu</Link>
              </li>
            </ul>
          </div>

          {/* --- CỘT 4: KẾT NỐI --- */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Kết nối</h3>
            <p>Theo dõi chúng tôi trên các nền tảng:</p>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.facebook.com/profile.php?id=61583836799509" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
              >
                <FaFacebookSquare />
              </a>
              <a 
                href="https://www.youtube.com/@thuyenvienninhbinh" 
                target="_blank" 
                rel="noopener noreferrer"
                title="YouTube"
                className={styles.youtube}
              >
                <FaYoutube />
              </a>
            </div>
          </div>

        </div> 
        {/* (Hết cái lưới Grid) */}
        
        {/* (Dòng Copyright ở dưới cùng) */}
        <div style={{textAlign: 'center', borderTop: '1px solid #444', paddingTop: '1.5rem', marginTop: '2rem', fontSize: '0.85rem'}}>
          <p>
            &copy; {new Date().getFullYear()} CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* 🎄 ẢNH TRANG TRÍ NOEL (Class đã định nghĩa ở globals.css) 🎄 */}
      <img src="/assets/img/footer1.png" alt="" className="decor-img decor-footer-left" />
      <img src="/assets/img/footer2.png" alt="" className="decor-img decor-footer-right" />

      <div className={styles.container}>
        {/* Cột 1 */}
        <div className={styles.col}>
          <h3>VỀ CHÚNG TÔI</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            Công ty cổ phần Tư vấn và Giáo dục Ninh Bình
          </p>
        </div>

        {/* Cột 2 */}
        <div className={styles.col}>
          <h3>LIÊN KẾT NHANH</h3>
          <ul>
            <li><Link href="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link href="/chuong-trinh-dao-tao">Chương trình đào tạo</Link></li>
            <li><Link href="/tuyen-dung">Tuyển dụng</Link></li>
            <li><Link href="/lien-he">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div className={styles.col}>
          <h3>LIÊN HỆ</h3>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình </li>
            <li><i className="fas fa-phone"></i> 022.96.282.969</li>
            <li><i className="fas fa-envelope"></i> ninhbinheduco.jsc@gmail.com </li>
            <li><i className="fas fa-envelope"></i> giaoducninhbinh@daotaothuyenvien.com </li>
          </ul>
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} Công ty cổ phần Tư vấn và Giáo dục Ninh Bình
      </div>
    </footer>
  )
}
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

        {/* Cột 2: LIÊN KẾT NHANH (Chia 2 cột nhỏ) */}
        <div className={styles.col}>
          <h3>LIÊN KẾT NHANH</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Cột nhỏ 1 */}
            <ul>
              <li><Link href="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link href="/chuong-trinh-dao-tao">Chương trình đào tạo</Link></li>
              <li><Link href="/tuyen-dung">Tuyển dụng</Link></li>
              <li><Link href="/giai-tri">Giải trí</Link></li>
              <li><Link href="/ontap">Ôn tập</Link></li>
              <li><Link href="/ontap/online-exam">Thi trực tuyến</Link></li>
              <li><Link href="/ontap/download">Tải App</Link></li>
              <li><Link href="/danh-muc/tin-tuc-su-kien">Tin tức - Sự kiện</Link></li>
              <li><Link href="/danh-muc/gioi-thieu-viec-lam">Giới thiệu việc làm</Link></li>
            </ul>
            {/* Cột nhỏ 2 */}
            <ul>
              <li><Link href="/danh-muc/van-ban-phap-quy">Văn bản pháp quy</Link></li>
              <li><Link href="/danh-muc/tuyen-sinh">Thông báo tuyển sinh</Link></li>
              <li><Link href="/tra-cuu-dia-chi">Tra cứu địa chỉ</Link></li>
              <li><Link href="/thu-vien">Thư viện</Link></li>
              <li><Link href="/tai-lieu">Tài liệu</Link></li>
              <li><Link href="/hoc-phi">Học phí</Link></li>
              <li><Link href="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
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
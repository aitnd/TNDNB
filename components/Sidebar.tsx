// File: components/Sidebar.tsx
// (Đây là Server Component vì nó Tĩnh)

import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS mới)

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>

      {/* Box Văn bản pháp quy (search) */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Văn bản pháp quy</h3>
        <form className={styles.searchForm}>
          <input type="text" placeholder="Tìm văn bản..." />
          <button type="submit">Xem tiếp</button>
        </form>
      </div>
      
      {/* Box Thi Online (Banner) */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="/login" target="_blank">
          <img src="https://via.placeholder.com/300x150?text=He+Thong+Thi+Online" alt="Hệ Thống Thi Online" className={styles.bannerImage} />
        </Link>
      </div>

      {/* Box Bảng tin */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Bảng tin</h3>
        <ul className={styles.linkList}>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Thông báo tuyển sinh TMT, CCCM
          </Link></li>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Thông báo VEC v/v hồ sơ...
          </Link></li>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Tuyển dụng nhân viên 2025
          </Link></li>
        </ul>
      </div>

      {/* Box Video */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Video</h3>
        <div className={styles.videoContainer}>
          <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/VIDEO_ID_CUA_BAN" 
              frameBorder="0"
              allowFullScreen
          ></iframe>
        </div>
      </div>

    </aside>
  )
}
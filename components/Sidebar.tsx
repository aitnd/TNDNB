// File: components/Sidebar.tsx

import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS)

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>

      {/* 💖 (Req 1) BOX HỆ THỐNG ÔN TẬP (ĐÃ SỬA) 💖 */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        {/* (Cả box là 1 link) */}
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <h3 className={styles.sidebarTitle} style={{marginBottom: '1.5rem', borderBottom: '2px solid #e6f0ff', paddingBottom: '0.75rem'}}>
            Hệ thống ôn tập
          </h3>
          {/* (Anh đã tải 'on-tap.png' vào thư mục 'public/') */}
          <img 
            src="/on-tap.png" 
            alt="Hệ Thống Ôn tập" 
            className={styles.bannerImage} 
            style={{marginTop: 0}} /* (Xóa margin-top của ảnh) */
          />
        </Link>
      </div>
      
      {/* 💖 (Req 2) BOX THI ONLINE (ĐÃ DI DỜI VÀ SỬA) 💖 */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        {/* (Cả box là 1 link) */}
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <h3 className={styles.sidebarTitle} style={{marginBottom: '1.5rem', borderBottom: '2px solid #e6f0ff', paddingBottom: '0.75rem'}}>
            Hệ thống thi trực tuyến
          </h3>
          {/* (Anh tải ảnh 'thi-online.png' vào 'public/') */}
          <img 
            src="/thi-online.png" 
            alt="Hệ Thống Thi Online" 
            className={styles.bannerImage} 
            style={{marginTop: 0}}
          />
        </Link>
      </div>

      {/* Box Văn bản pháp quy (search) */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Văn bản pháp quy</h3>
        <form className={styles.searchForm}>
          <input type="text" placeholder="Tìm văn bản..." />
          <button type="submit">Xem tiếp</button>
        </form>
      </div>

      {/* Box Bảng tin */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Bảng tin</h3>
        <ul className={styles.linkList}>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Thông báo tuyển sinh
          </Link></li>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Thông báo lần 2
          </Link></li>
          <li><Link href="#">
            <i className="fas fa-caret-right"></i> Thông báo là có thông báo
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
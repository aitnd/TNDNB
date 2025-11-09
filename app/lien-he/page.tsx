// 1. 💖 KHÔNG CẦN 'use client' HAY 'useEffect' NỮA 💖
//    (Vì 'layout.tsx' đã "gánh" việc đó rồi)
import React from 'react'
import Link from 'next/link'
import styles from './page.module.css' 
import Sidebar from '../../components/Sidebar' 

export default function LienHePage() {
  
  // 2. 💖 (ĐÃ XÓA 'useEffect' TẢI SDK FACEBOOK CŨ) 💖

  return (
    <>
      {/* 3. 💖 (ĐÃ XÓA '<div id="fb-root">') 💖 */}
    
      <div className={styles.layoutGrid}>
        {/* ===== CỘT TRÁI (NỘI DUNG LIÊN HỆ) ===== */}
        <main className={styles.mainContent}>
          
          {/* Box Thông tin Liên hệ */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Liên hệ</h2>
            <div className={styles.contactInfo}>
              <h3>CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h3>
              <p><strong>Địa chỉ:</strong> Đường Triệu Việt Vương - Phường Bích Đào - TP. Ninh Bình - Tỉnh Ninh Bình</p>
              <p><strong>MST:</strong> 2700960947</p>
              <p><strong>Điện thoại:</strong> (Điền SĐT vào đây)</p>
              <p><strong>Email:</strong> (Điền Email vào đây)</p>
            </div>
          </section>

          {/* 4. 💖 (ĐÃ XÓA BOX BÌNH LUẬN FACEBOOK CŨ Ở ĐÂY) 💖 */}
          {/* (Vì 'layout.tsx' sẽ tự "vẽ" nó ở dưới cùng) */}

        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        <Sidebar />
      </div>
    </>
  )
}
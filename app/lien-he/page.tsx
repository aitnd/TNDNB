// Đánh dấu đây là "Client Component" (BẮT BUỘC cho FB SDK)
'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css' // (CSS Trang Liên hệ)
import Sidebar from '../../components/Sidebar' // (Sidebar Dùng chung)

export default function LienHePage() {
  
  // "Phép thuật" để tải SDK Facebook
  useEffect(() => {
    if (document.getElementById('fb-sdk')) return; 
    
    const script = document.createElement('script');
    script.id = 'fb-sdk';
    script.src = "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0";
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.nonce = 'FB-NONCE'; 
    
    document.getElementById('fb-root')?.appendChild(script);
  }, []); // (Chạy 1 lần)

  return (
    <>
      {/* (Div này BẮT BUỘC phải có cho SDK Facebook) */}
      <div id="fb-root"></div>
    
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

          {/* Box Bình luận Facebook */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Ý kiến bạn đọc (Facebook)</h2>
            <div className={styles.fbCommentsContainer}>
              {/* QUAN TRỌNG: 
                1. Anh PHẢI thay 'tndnb.vercel.app' bằng URL chính xác đã deploy.
                2. Plugin này chỉ hiển thị trên web đã deploy.
              */}
              <div className="fb-comments" 
                   data-href="https://tndnb.vercel.app/lien-he" 
                   data-width="100%" 
                   data-numposts="5">
              </div>
            </div>
          </section>
        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        <Sidebar />
      </div>
    </>
  )
}
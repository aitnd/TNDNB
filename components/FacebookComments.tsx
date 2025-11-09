// Đánh dấu đây là "Client Component"
'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation' // (Hook "thần kỳ" để lấy URL)
import styles from './FacebookComments.module.css' // (Triệu hồi CSS)

// 1. Lấy "Địa chỉ web" từ "Két sắt"
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://tndnb.vercel.app';

export default function FacebookComments() {
  const pathname = usePathname(); // (Lấy đường dẫn, ví dụ: '/bai-viet/abc')
  const fullUrl = BASE_URL + pathname; // (Tạo link đầy đủ)

  // 2. "Phép thuật" Tải SDK Facebook
  useEffect(() => {
    // (Nếu đã tải rồi thì "nghỉ")
    if (document.getElementById('fb-sdk')) return; 
    
    // (Tạo thẻ <script>)
    const script = document.createElement('script');
    script.id = 'fb-sdk';
    script.src = "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0";
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.nonce = 'FB-NONCE'; 
    
    // (Gắn script vào thẻ <div id="fb-root">)
    document.getElementById('fb-root')?.appendChild(script);
  }, []); // (Chạy 1 lần duy nhất)

  return (
    <>
      {/* (Div này BẮT BUỘC phải có, để ở ngoài) */}
      <div id="fb-root"></div>
      
      {/* 3. "Vẽ" Box Bình luận */}
      <div className={styles.wrapper}>
        <section className={styles.container}>
          <h2 className={styles.title}>Ý kiến bạn đọc (Facebook)</h2>
          <div className={styles.pluginBox}>
            
            {/* 4. Tự động "dán" (data-href) link của trang hiện tại */}
            <div className="fb-comments" 
                 data-href={fullUrl} 
                 data-width="100%" 
                 data-numposts="5">
            </div>
            
          </div>
        </section>
      </div>
    </>
  )
}
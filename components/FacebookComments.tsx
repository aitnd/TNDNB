// Đánh dấu đây là "Client Component"
'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation' 
import styles from './FacebookComments.module.css' 

// 1. Lấy "Địa chỉ web" từ "Két sắt"
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://tndnb.vercel.app';

export default function FacebookComments() {
  const pathname = usePathname(); 
  const fullUrl = BASE_URL + pathname; 

  // 2. "Phép thuật" Tải SDK Facebook (ĐÃ SỬA LỖI)
  useEffect(() => {
    // (Kiểm tra xem 'FB' (Facebook SDK) đã "tỉnh" chưa)
    if (window.FB) {
      // (Nếu "tỉnh" rồi, bảo nó "vẽ" lại (parse) box bình luận)
      window.FB.XFBML.parse();
    }
    
    // (Kiểm tra xem SDK đã được "triệu hồi" chưa)
    if (document.getElementById('fb-sdk')) return; 

    // (Nếu chưa, "triệu hồi" nó)
    const script = document.createElement('script');
    script.id = 'fb-sdk';
    script.src = "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0";
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.nonce = 'FB-NONCE'; 
    
    // (Gắn script vào thẻ <div id="fb-root">)
    document.getElementById('fb-root')?.appendChild(script);
    
  // 💖 (BẮT BUỘC) "Lắng nghe" 'pathname' 💖
  // (Mỗi khi anh "chuyển trang" (thay đổi 'pathname'), 
  //  "phép thuật" này phải chạy lại để "vẽ" (parse) 
  //  lại box bình luận cho trang MỚI)
  }, [pathname]); 

  return (
    <>
      <div id="fb-root"></div>
      
      {/* 3. "Vẽ" Box Bình luận */}
      <div className={styles.wrapper}>
        <section className={styles.container}>
          <h2 className={styles.title}>Ý kiến bạn đọc (Facebook)</h2>
          <div className={styles.pluginBox}>
            
            {/* 4. Tự động "dán" (data-href) link của trang hiện tại */}
            {/* (Thêm 'key={fullUrl}' để "ép" React "vẽ" lại khi URL thay đổi) */}
            <div 
                 className="fb-comments" 
                 data-href={fullUrl} 
                 data-width="100%" 
                 data-numposts="5"
                 key={fullUrl} 
            >
            </div>
            
          </div>
        </section>
      </div>
    </>
  )
}
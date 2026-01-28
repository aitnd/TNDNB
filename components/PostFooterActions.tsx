// 💖 1. ĐÁNH DẤU CLIENT COMPONENT (Giữ nguyên) 💖
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' 
import styles from '../app/bai-viet/[postId]/page.module.css' 

// 💖 2. "TRIỆU HỒI" BẢO VỆ MỚI 💖
import { usePathname } from 'next/navigation' // (Để lấy link hiện tại)
import { FaFacebook } from 'react-icons/fa' // (Icon Facebook "xịn")

// (Danh sách "Sếp" - Giữ nguyên)
const allowedRoles = ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'];

// 💖 3. ĐỊNH NGHĨA LINK WEB CỦA ANH 💖
// (Mình dùng link Vercel cho "chắc", nó sẽ tự đổi qua tên miền "xịn")
const PRODUCTION_URL = 'https://tndnb.vercel.app';


export default function PostFooterActions() {
  // 4. "Hỏi" xem ai đang đăng nhập
  const { user } = useAuth();
  
  // 💖 5. "HỎI" XEM MÌNH ĐANG Ở TRANG NÀO 💖
  const pathname = usePathname(); // (Nó sẽ lấy link, vd: /bai-viet/123)

  // (Kiểm tra "Sếp" - Giữ nguyên)
  const canManage = user && allowedRoles.includes(user.role);

  // 💖 6. HÀM "SHARE" MỚI (Copy từ trang 'quan-ly') 💖
  const handleShareToFacebook = () => {
    // (Ghép link "gốc" với link "bài viết" lại)
    const postUrl = `${PRODUCTION_URL}${pathname}`; 
    
    // (Tạo link "mồi" của Facebook)
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    
    // (Mở cửa sổ popup y hệt)
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  }


  return (
    <div className={styles.backButtonContainer}>
      
      {/* (Nút "Quay về" - Ai cũng thấy) */}
      <Link href="/" className={styles.backButton}>
        « Quay về Trang chủ
      </Link>

      {/* 💖 7. NÚT "SHARE" MỚI (Ai cũng thấy) 💖 */}
      <button
        onClick={handleShareToFacebook}
        className={styles.buttonShare} // (Dùng "áo" mới)
        title="Chia sẻ bài viết này lên Facebook"
      >
        <FaFacebook /> {/* (Thêm icon) */}
        Chia sẻ
      </button>
      
      {/* (Nút "Quản lý" - Chỉ sếp thấy) */}
      {canManage && (
        <Link 
          href="/quan-ly/dang-bai" 
          className={styles.buttonSecondary} 
        >
          Đi đến Trang Quản lý
        </Link>
      )}

    </div>
  )
}
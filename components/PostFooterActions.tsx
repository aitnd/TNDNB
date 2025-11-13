// 💖 1. ĐÁNH DẤU CLIENT COMPONENT 💖
// (Vì mình cần "não" (useAuth) để biết "anh là ai")
'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext' // (Triệu hồi "bảo vệ")
// (Mượn CSS "trang điểm" của trang bài viết)
import styles from '../app/bai-viet/[postId]/page.module.css' 

// 💖 2. DANH SÁCH "SẾP" ĐƯỢC PHÉP THẤY NÚT 💖
// (Copy từ file "quan-ly/dang-bai/page.tsx")
const allowedRoles = ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'];

export default function PostFooterActions() {
  // 3. "Hỏi" xem ai đang đăng nhập
  const { user } = useAuth();

  // (Kiểm tra xem "sếp" có đang đăng nhập không)
  const canManage = user && allowedRoles.includes(user.role);

  return (
    <div className={styles.backButtonContainer}>
      
      {/* (Nút "Quay về" - Ai cũng thấy) */}
      <Link href="/" className={styles.backButton}>
        « Quay về Trang chủ
      </Link>
      
      {/* 💖 4. NÚT "QUẢN LÝ" (Chỉ sếp thấy) 💖 */}
      {canManage && (
        <Link 
          href="/quan-ly/dang-bai" 
          // (Dùng "màu áo" phụ)
          className={styles.buttonSecondary} 
        >
          Đi đến Trang Quản lý Bài viết
        </Link>
      )}

    </div>
  )
}
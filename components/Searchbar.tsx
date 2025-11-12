// 💖 1. ĐÁNH DẤU CLIENT COMPONENT 💖
// (Vì mình cần "não" (useState) và "điều hướng" (useRouter))
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// (Mượn CSS của "anh hàng xóm" Sidebar)
import styles from './Sidebar.module.css' 
// (Icon Kính lúp)
import { FaSearch } from 'react-icons/fa'

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState(''); // (Não lưu chữ mình gõ)
  const router = useRouter(); // (Tay lái điều hướng)

  // 💖 2. HÀM XỬ LÝ KHI BẤM TÌM 💖
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // (Ngăn trang web tải lại)
    if (!searchTerm.trim()) {
      return; // (Nếu gõ toàn dấu cách thì không làm gì)
    }
    
    // (Đây là "chiêu" nè anh:
    //  Nó sẽ "lái" mình tới trang /tim-kiem
    //  với cái đuôi ?q=từ_khóa_anh_gõ)
    router.push(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
  }

  // 💖 3. GIAO DIỆN Ô TÌM KIẾM 💖
  return (
    <div className={`${styles.widgetBox} ${styles.searchBox}`}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm bài viết, tài liệu..."
          className={styles.searchInput}
          aria-label="Tìm kiếm"
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Tìm"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  )
}
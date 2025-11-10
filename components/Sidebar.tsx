// 💖 1. "TRIỆU HỒI" SUPABASE 💖
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS)

// 2. Định nghĩa "kiểu" bài viết
type Post = {
  id: string;
  title: string;
}

// 3. 💖 "PHÉP THUẬT" LẤY TIN TUYỂN SINH (Chạy ở Server) 💖
async function getTuyenSinhPosts(): Promise<Post[]> {
  console.log('[Sidebar] Đang lấy tin "Tuyển sinh"...');
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tuyen-sinh') // (Lấy đúng danh mục "tuyen-sinh")
    .order('created_at', { ascending: false })
    .limit(5); // (Lấy 5 tin mới nhất)
  
  if (error) {
    console.error('Lỗi lấy tin tuyển sinh:', error);
    return [];
  }
  return data || [];
}

// 4. 💖 BIẾN THÀNH "ASYNC" COMPONENT 💖
export default async function Sidebar() {
  
  // 5. 💖 "CHỜ" LẤY TIN 💖
  const tuyenSinhPosts = await getTuyenSinhPosts();

  return (
    <aside className={styles.sidebar}>

      {/* Box Hệ thống ôn tập */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <h3 className={styles.sidebarTitle} style={{marginBottom: '1.5rem', borderBottom: '2px solid #e6f0ff', paddingBottom: '0.75rem'}}>
              Hệ thống ôn tập
          </h3>
          <img 
            src="/on-tap.png" 
            alt="Hệ Thống Ôn tập" 
            className={styles.bannerImage} 
            style={{marginTop: 0}}
          />
        </Link>
      </div>
      
      {/* Box Thi Online */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <h3 className={styles.sidebarTitle} style={{marginBottom: '1.5rem', borderBottom: '2px solid #e6f0ff', paddingBottom: '0.75rem'}}>
              Hệ thống thi trực tuyến
          </h3>
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

      {/* 💖 6. BOX "THÔNG BÁO TUYỂN SINH" (ĐÃ SỬA) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Thông báo tuyển sinh</h3>
        <ul className={styles.linkList}>
          
          {/* (Kiểm tra xem có tin nào không) */}
          {tuyenSinhPosts.length > 0 ? (
            // (Nếu có, "vẽ" nó ra)
            tuyenSinhPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/bai-viet/${post.id}`}>
                  <i className="fas fa-caret-right"></i> {post.title}
                </Link>
              </li>
            ))
          ) : (
            // (Nếu không có tin nào)
            <li>
              <p style={{fontSize: '0.9rem', color: '#777', paddingLeft: '0.5rem'}}>
                Chưa có thông báo nào.
              </p>
            </li>
          )}

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
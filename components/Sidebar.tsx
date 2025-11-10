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

// 3. 💖 "PHÉP THUẬT" LẤY TIN TUYỂN SINH 💖
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

// 4. 💖 "PHÉP THUẬT" MỚI: LẤY VĂN BẢN PHÁP QUY 💖
async function getPhapQuyPosts(): Promise<Post[]> {
  console.log('[Sidebar] Đang lấy tin "Văn bản"...');
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'van-ban-phap-quy') // (Lấy đúng danh mục "van-ban-phap-quy")
    .order('created_at', { ascending: false })
    .limit(5); // (Lấy 5 tin mới nhất)
  
  if (error) {
    console.error('Lỗi lấy tin pháp quy:', error);
    return [];
  }
  return data || [];
}

// 5. 💖 BIẾN THÀNH "ASYNC" COMPONENT 💖
export default async function Sidebar() {
  
  // 6. 💖 "CHỜ" LẤY CẢ 2 LOẠI TIN 💖
  // (Promise.all giúp 2 "kho" chạy song song, nhanh hơn)
  const [tuyenSinhPosts, phapQuyPosts] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts()
  ]);

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

      {/* 💖 7. BOX "VĂN BẢN PHÁP QUY" (ĐÃ SỬA THÀNH "ĐỘNG") 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Văn bản pháp quy</h3>
        <ul className={styles.linkList}>
          {phapQuyPosts.length > 0 ? (
            phapQuyPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/bai-viet/${post.id}`}>
                  <i className="fas fa-caret-right"></i> {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li>
              <p style={{fontSize: '0.9rem', color: '#777', paddingLeft: '0.5rem'}}>
                Chưa có văn bản nào.
              </p>
            </li>
          )}
        </ul>
      </div>

      {/* Box "Thông báo tuyển sinh" (Đã "động" từ trước) */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Thông báo tuyển sinh</h3>
        <ul className={styles.linkList}>
          {tuyenSinhPosts.length > 0 ? (
            tuyenSinhPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/bai-viet/${post.id}`}>
                  <i className="fas fa-caret-right"></i> {post.title}
                </Link>
              </li>
            ))
          ) : (
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
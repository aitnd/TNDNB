// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS)

// 2. Định nghĩa "kiểu" bài viết
type Post = {
  id: string;
  title: string;
}

// 3. "PHÉP THUẬT" LẤY TIN TUYỂN SINH
async function getTuyenSinhPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tuyen-sinh') 
    .order('created_at', { ascending: false })
    .limit(5); 
  if (error) {
    console.error('Lỗi lấy tin tuyển sinh:', error);
    return [];
  }
  return data || [];
}

// 4. "PHÉP THUẬT" LẤY VĂN BẢN PHÁP QUY
async function getPhapQuyPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'van-ban-phap-quy') 
    .order('created_at', { ascending: false })
    .limit(5); 
  if (error) {
    console.error('Lỗi lấy tin pháp quy:', error);
    return [];
  }
  return data || [];
}

// 5. 💖 "PHÉP THUẬT" MỚI: LẤY TIN TỨC SỰ KIỆN 💖
async function getTinTucSuKien(): Promise<Post[]> {
  console.log('[Sidebar] Đang lấy tin "Tin tức"...');
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tin-tuc-su-kien') // (Lấy đúng danh mục "tin-tuc-su-kien")
    .order('created_at', { ascending: false })
    .limit(5); // (Lấy 5 tin mới nhất)
  
  if (error) {
    console.error('Lỗi lấy tin tức:', error);
    return [];
  }
  return data || [];
}


// 6. 💖 BIẾN THÀNH "ASYNC" COMPONENT 💖
export default async function Sidebar() {
  
  // 7. 💖 "CHỜ" LẤY CẢ 3 LOẠI TIN 💖
  const [tuyenSinhPosts, phapQuyPosts, tinTucPosts] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts(),
    getTinTucSuKien() // (Thêm tin tức vào)
  ]);

  return (
    <aside className={styles.sidebar}>

      {/* ✨ Box Hệ thống ôn tập (ĐÃ SỬA CẤU TRÚC) ✨ */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <h3 className={styles.sidebarTitle}>
              Hệ thống ôn tập
          </h3>
        </Link>
        {/* Link của ảnh nằm riêng */}
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <img 
            src="/on-tap.png" 
            alt="Hệ Thống Ôn tập" 
            className={styles.bannerImage}
          />
        </Link>
      </div>
      
      {/* ✨ Box Thi Online (ĐÃ SỬA CẤU TRÚC) ✨ */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <h3 className={styles.sidebarTitle}>
              Hệ thống thi trực tuyến
          </h3>
        </Link>
        {/* Link của ảnh nằm riêng */}
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <img 
            src="/thi-online.png" 
            alt="Hệ Thống Thi Online" 
            className={styles.bannerImage}
          />
        </Link>
      </div>

      {/* 💖 8. BOX "TIN TỨC - SỰ KIỆN" (Cấu trúc này đã chuẩn) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/danh-muc/tin-tuc-su-kien">
          <h3 className={styles.sidebarTitle}>Tin tức - Sự kiện</h3>
        </Link>
        <ul className={styles.linkList}>
          {tinTucPosts.length > 0 ? (
            tinTucPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/bai-viet/${post.id}`}>
                  <i className="fas fa-caret-right"></i> {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li>
              <p style={{fontSize: '0.9rem', color: '#777', paddingLeft: '0.5rem'}}>
                Chưa có tin tức nào.
              </p>
            </li>
          )}
        </ul>
      </div>

      {/* Box "Văn bản pháp quy" (Cấu trúc này đã chuẩn) */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/danh-muc/van-ban-phap-quy">
          <h3 className={styles.sidebarTitle}>Văn bản pháp quy</h3>
        </Link>
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

      {/* Box "Thông báo tuyển sinh" (Cấu trúc này đã chuẩn) */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/danh-muc/tuyen-sinh">
          <h3 className={styles.sidebarTitle}>Thông báo tuyển sinh</h3>
        </Link>
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

      {/* Box Video (Cấu trúc này đã chuẩn) */}
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
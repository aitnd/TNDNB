// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS)

// 💖 "THẦN CHÚ" BẮT TẢI LẠI DỮ LIỆU MỚI (Checkpoint 7, Lỗi Cache)
export const revalidate = 0; 

// 2. Định nghĩa "kiểu" bài viết
type Post = {
  id: string;
  title: string;
}

// 💖 ĐỊNH NGHĨA "KIỂU" MEDIA (CHO THƯ VIỆN) 💖
type MediaItem = {
  id: number;
  media_url: string;
};

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

// 5. "PHÉP THUẬT" MỚI: LẤY TIN TỨC SỰ KIỆN 
async function getTinTucSuKien(): Promise<Post[]> {
  console.log('[Sidebar] Đang lấy tin "Tin tức"...');
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tin-tuc-su-kien') 
    .order('created_at', { ascending: false })
    .limit(5); 
  
  if (error) {
    console.error('Lỗi lấy tin tức:', error);
    return [];
  }
  return data || [];
}

// 💖 "PHÉP THUẬT" MỚI: LẤY 3 ẢNH MỚI NHẤT CHO THƯ VIỆN PREVIEW 💖
async function getLatestMediaForSidebar(): Promise<MediaItem[]> {
  console.log('[Sidebar] Đang lấy media mới nhất cho Thư viện...');
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url') // (Chỉ cần ID và link ảnh thôi)
    .eq('media_type', 'image') // (Chỉ lấy ảnh)
    .order('created_at', { ascending: false })
    .limit(3); // (Lấy 3 cái mới nhất)

  if (error) {
    console.error('Lỗi lấy media cho Sidebar:', error);
    return [];
  }
  return data || [];
}


// 6. 💖 BIẾN THÀNH "ASYNC" COMPONENT (ĐÃ THÊM MEDIA) 💖
export default async function Sidebar() {
  
  // 7. 💖 "CHỜ" LẤY CẢ 4 LOẠI TIN VÀ MEDIA 💖
  const [tuyenSinhPosts, phapQuyPosts, tinTucPosts, latestMedia] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts(),
    getTinTucSuKien(),
    getLatestMediaForSidebar() // (Thêm media vào đây)
  ]);

  return (
    <aside className={styles.sidebar}>

      {/* ✨ Box Hệ thống ôn tập ✨ */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <h3 className={styles.sidebarTitle}>
              Hệ thống ôn tập
          </h3>
        </Link>
        <Link href="https://web-on-tap.vercel.app/" target="_blank">
          <img 
            src="/on-tap.png" 
            alt="Hệ Thống Ôn tập" 
            className={styles.bannerImage}
          />
        </Link>
      </div>
      
      {/* ✨ Box Thi Online ✨ */}
      <div className={`${styles.widgetBox} ${styles.bannerBox}`}>
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <h3 className={styles.sidebarTitle}>
              Hệ thống thi trực tuyến
          </h3>
        </Link>
        <Link href="https://tndnb.vercel.app/quan-ly" target="_blank">
          <img 
            src="/thi-online.png" 
            alt="Hệ Thống Thi Online" 
            className={styles.bannerImage}
          />
        </Link>
      </div>

      {/* 💖 Box "TIN TỨC - SỰ KIỆN" 💖 */}
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

      {/* Box "Văn bản pháp quy" */}
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

      {/* Box "Thông báo tuyển sinh" */}
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

      {/* 💖 BOX "THƯ VIỆN" MỚI (THAY THẾ BOX VIDEO) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/thu-vien">
          <h3 className={styles.sidebarTitle}>Thư viện</h3>
        </Link>
        <div className={styles.mediaPreviewGrid}>
          {latestMedia.length > 0 ? (
            latestMedia.map((item) => (
              <Link href="/thu-vien" key={item.id} className={styles.mediaPreviewItem}>
                <img 
                  src={item.media_url} 
                  alt="Thư viện" 
                  loading="lazy"
                />
              </Link>
            ))
          ) : (
            <p className={styles.emptyMessage} style={{textAlign: 'center', margin: '0.5rem', fontSize: '0.85rem'}}>
              Chưa có ảnh/video nào.
            </p>
          )}
        </div>
        <Link href="/thu-vien" className={styles.viewAllButton}>
            Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

    </aside>
  )
}
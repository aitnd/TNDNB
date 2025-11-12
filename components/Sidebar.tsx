// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' // (Triệu hồi CSS)

// (THẦN CHÚ BẮT TẢI LẠI)
export const revalidate = 0; 

// (Kiểu bài viết)
type Post = {
  id: string;
  title: string;
}

// (Kiểu Media)
type MediaItem = {
  id: number;
  media_url: string;
};

// (Hàm lấy tin Tuyển sinh)
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

// (Hàm lấy tin Pháp quy)
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

// (Hàm lấy tin Tức)
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

// (Hàm lấy ảnh Thư viện)
async function getLatestMediaForSidebar(): Promise<MediaItem[]> {
  console.log('[Sidebar] Đang lấy media mới nhất cho Thư viện...');
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url') 
    .eq('media_type', 'image') 
    .order('created_at', { ascending: false })
    .limit(3); // (Lấy 3 cái mới nhất)

  if (error) {
    console.error('Lỗi lấy media cho Sidebar:', error);
    return [];
  }
  return data || [];
}

// 💖 1. HÀM MỚI: LẤY 3 TỆP MỚI NHẤT 💖
// (Copy hàm trên và sửa 'image' -> 'document')
async function getLatestFilesForSidebar(): Promise<MediaItem[]> {
  console.log('[Sidebar] Đang lấy tệp mới nhất cho Tài liệu...');
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url') // (Chỉ cần link thôi)
    .eq('media_type', 'document') // (Chỉ lấy 'document')
    .order('created_at', { ascending: false })
    .limit(3); // (Lấy 3 cái mới nhất)

  if (error) {
    console.error('Lỗi lấy tệp cho Sidebar:', error);
    return [];
  }
  return data || [];
}


// 💖 2. BIẾN THÀNH "ASYNC" COMPONENT (ĐÃ THÊM TỆP) 💖
export default async function Sidebar() {
  
  // 💖 3. "CHỜ" LẤY CẢ 5 LOẠI 💖
  const [tuyenSinhPosts, phapQuyPosts, tinTucPosts, latestMedia, latestFiles] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts(),
    getTinTucSuKien(),
    getLatestMediaForSidebar(),
    getLatestFilesForSidebar() // (Thêm tệp vào đây)
  ]);

  return (
    <aside className={styles.sidebar}>

      {/* (Box Hệ thống ôn tập) */}
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
      
      {/* (Box Thi Online) */}
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

      {/* (Box "TIN TỨC - SỰ KIỆN") */}
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

      {/* (Box "Văn bản pháp quy") */}
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

      {/* (Box "Thông báo tuyển sinh") */}
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

      {/* (BOX "THƯ VIỆN") */}
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
      
      {/* 💖 4. BOX "TÀI LIỆU" MỚI (COPY TỪ BOX TRÊN) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/tai-lieu">
          <h3 className={styles.sidebarTitle}>Tài liệu</h3>
        </Link>
        {/* (Mình không preview file, chỉ để link "Xem tất cả") */}
        {latestFiles.length > 0 ? (
           <p style={{fontSize: '0.9rem', color: '#555', paddingLeft: '0.5rem'}}>
             Đã có {latestFiles.length} tài liệu mới. Bấm xem tất cả.
           </p>
         ) : (
           <p className={styles.emptyMessage} style={{textAlign: 'center', margin: '0.5rem', fontSize: '0.85rem'}}>
             Chưa có tài liệu nào.
           </p>
         )}
        <Link href="/tai-lieu" className={styles.viewAllButton}>
            Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

    </aside>
  )
}
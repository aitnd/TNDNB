// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' 
// (Triệu hồi Bộ não Tìm kiếm)
import Searchbar from './Searchbar'

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

// --- CÁC HÀM LẤY DỮ LIỆU (Giữ nguyên) ---
async function getTuyenSinhPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tuyen-sinh') 
    .order('created_at', { ascending: false })
    .limit(5); 
  if (error) return [];
  return data || [];
}

async function getPhapQuyPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'van-ban-phap-quy') 
    .order('created_at', { ascending: false })
    .limit(5); 
  if (error) return [];
  return data || [];
}

async function getTinTucSuKien(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'tin-tuc-su-kien') 
    .order('created_at', { ascending: false })
    .limit(5); 
  if (error) return [];
  return data || [];
}

async function getLatestMediaForSidebar(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url') 
    .eq('media_type', 'image') 
    .order('created_at', { ascending: false })
    .limit(3); 
  if (error) return [];
  return data || [];
}

async function getLatestFilesForSidebar(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url') 
    .eq('media_type', 'document') 
    .order('created_at', { ascending: false })
    .limit(3); 
  if (error) return [];
  return data || [];
}


// (COMPONENT CHÍNH)
export default async function Sidebar() {
  
  const [tuyenSinhPosts, phapQuyPosts, tinTucPosts, latestMedia, latestFiles] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts(),
    getTinTucSuKien(),
    getLatestMediaForSidebar(),
    getLatestFilesForSidebar() 
  ]);

  return (
    <aside className={styles.sidebar}>

      {/* (Ô Tìm kiếm) */}
      <Searchbar />

      {/* 💖 1. HỘP "TRA CỨU & TIỆN ÍCH" (MỚI - GỌN GÀNG) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Tra cứu & Tiện ích</h3>
        <ul className={styles.linkList}>
          {/* Link 1: Tra cứu văn bằng */}
          <li>
            <Link href="https://nguoidieukhien-v2-viwa.fds.vn/tra_cuu_thuyen_vien_tnd" target="_blank">
              <i className="fas fa-search" style={{color: '#004a99'}}></i> Tra cứu Văn bằng
            </Link>
          </li>
          
          {/* (Sau này anh muốn thêm link khác thì copy dòng <li> ở trên dán xuống đây nha) */}
          {/* Ví dụ:
          <li>
            <Link href="#">
              <i className="fas fa-link" style={{color: '#004a99'}}></i> Link tiện ích khác
            </Link>
          </li> 
          */}
        </ul>
      </div>
      
      {/* (ĐÃ XÓA CÁC BANNER CŨ: ÔN TẬP & THI) */}

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
      
      {/* (BOX "TÀI LIỆU") */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/tai-lieu">
          <h3 className={styles.sidebarTitle}>Tài liệu</h3>
        </Link>
        {latestFiles.length > 0 ? (
           <p style={{fontSize: '0.9rem', color: '#555', paddingLeft: '0.5rem'}}>
             Đã có tài liệu mới. Bấm xem tất cả.
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
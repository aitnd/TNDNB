// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient' 
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css' 
import Searchbar from './Searchbar'

export const revalidate = 0; 

type Post = {
  id: string;
  title: string;
}

type MediaItem = {
  id: number;
  media_url: string;
  file_name?: string; // Thêm trường tên file
};

// --- CÁC HÀM LẤY DỮ LIỆU ---
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
    .limit(6); // Lấy 6 ảnh cho đẹp grid 3x2
  if (error) return [];
  return data || [];
}

// 💖 HÀM LẤY TÀI LIỆU ĐÃ SỬA 💖
async function getLatestFilesForSidebar(): Promise<MediaItem[]> {
  // Lấy các file không phải là ảnh và video
  const { data, error } = await supabase
    .from('media_library')
    .select('id, media_url, file_name') 
    .neq('media_type', 'image')
    .neq('media_type', 'video')
    .order('created_at', { ascending: false })
    .limit(5); 

  if (error) {
    console.error('Lỗi lấy tệp cho Sidebar:', error);
    return [];
  }
  return data || [];
}


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

      <Searchbar />

      {/* HỘP "TRA CỨU & TIỆN ÍCH" */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <h3 className={styles.sidebarTitle}>Tra cứu & Tiện ích</h3>
        <ul className={styles.linkList}>
          <li>
            <Link href="https://nguoidieukhien-v2-viwa.fds.vn/tra_cuu_thuyen_vien_tnd" target="_blank">
              <i className="fas fa-search" style={{color: '#004a99'}}></i> Tra cứu Văn bằng
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Box "TIN TỨC - SỰ KIỆN" */}
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
            <li><p className={styles.emptyMessage}>Chưa có tin tức nào.</p></li>
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
            <li><p className={styles.emptyMessage}>Chưa có văn bản nào.</p></li>
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
            <li><p className={styles.emptyMessage}>Chưa có thông báo nào.</p></li>
          )}
        </ul>
      </div>

      {/* BOX "THƯ VIỆN ẢNH" */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/thu-vien">
          <h3 className={styles.sidebarTitle}>Thư viện ảnh</h3>
        </Link>
        <div className={styles.mediaPreviewGrid}>
          {latestMedia.length > 0 ? (
            latestMedia.map((item) => (
              <Link href="/thu-vien" key={item.id} className={styles.mediaPreviewItem}>
                <img src={item.media_url} alt="Thư viện" loading="lazy"/>
              </Link>
            ))
          ) : (
            <p className={styles.emptyMessage}>Chưa có ảnh nào.</p>
          )}
        </div>
        <Link href="/thu-vien" className={styles.viewAllButton}>
            Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
      
      {/* 💖 BOX "TÀI LIỆU MỚI" (ĐÃ CẬP NHẬT) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/tai-lieu">
          <h3 className={styles.sidebarTitle}>Tài liệu mới</h3>
        </Link>
        <ul className={styles.linkList}>
          {latestFiles.length > 0 ? (
            latestFiles.map((file) => (
              <li key={file.id}>
                <a href={file.media_url} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-file-alt" style={{color: '#555'}}></i> 
                  {file.file_name || 'Tài liệu tải về'}
                </a>
              </li>
            ))
          ) : (
             <li>
               <p className={styles.emptyMessage} style={{textAlign: 'left', paddingLeft: '0.5rem'}}>
                 Chưa có tài liệu nào.
               </p>
             </li>
          )}
        </ul>
        <Link href="/tai-lieu" className={styles.viewAllButton}>
            Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

    </aside>
  )
}
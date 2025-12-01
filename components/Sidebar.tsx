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
  media_type?: string; // Thêm type để phân biệt video
  file_name?: string;
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
    .select('id, media_url, media_type')
    .in('media_type', ['image', 'video'])
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) return [];
  return data || [];
}

// 💖 HÀM LẤY TÀI LIỆU TỪ BÀI VIẾT 💖
async function getLatestFilesForSidebar(): Promise<any[]> {
  // Lấy các bài viết có đính kèm file
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url, attachments, created_at')
    .not('attachments', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10); // Lấy 10 bài mới nhất để lọc ra 5 file

  if (error) {
    console.error('Lỗi lấy tệp cho Sidebar:', error);
    return [];
  }

  // Làm phẳng mảng file từ các bài viết
  const files: any[] = [];
  if (data) {
    for (const post of data) {
      if (Array.isArray(post.attachments)) {
        for (const att of post.attachments) {
          if (files.length >= 6) break; // Chỉ lấy tối đa 6 file
          files.push({
            id: `${post.id}_${att.file_name}`, // Tạo ID giả
            post_id: post.id,
            post_title: post.title,
            post_thumbnail: post.thumbnail_url, // Lấy ảnh thumbnail của bài viết làm preview
            file_name: att.file_name,
            file_url: att.file_url,
            file_type: att.file_type
          });
        }
      }
      if (files.length >= 6) break;
    }
  }

  return files;
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
              <i className="fas fa-search" style={{ color: '#004a99' }}></i> Tra cứu Văn bằng
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

      {/* BOX "THƯ VIỆN" */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/thu-vien">
          <h3 className={styles.sidebarTitle}>Thư viện</h3>
        </Link>
        <div className={styles.mediaPreviewGrid}>
          {latestMedia.length > 0 ? (
            latestMedia.map((item) => (
              <Link href="/thu-vien" key={item.id} className={styles.mediaPreviewItem}>
                {item.media_type === 'video' ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
                    <video
                      src={item.media_url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                      muted
                    />
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      color: 'white', fontSize: '1.2rem'
                    }}>
                      <i className="fas fa-play-circle"></i>
                    </div>
                  </div>
                ) : (
                  <img src={item.media_url} alt="Thư viện" loading="lazy" />
                )}
              </Link>
            ))
          ) : (
            <p className={styles.emptyMessage}>Chưa có ảnh/video nào.</p>
          )}
        </div>
        <Link href="/thu-vien" className={styles.viewAllButton}>
          Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

      {/* 💖 BOX "TÀI LIỆU MỚI" (GRID VIEW) 💖 */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/tai-lieu">
          <h3 className={styles.sidebarTitle}>Tài liệu mới</h3>
        </Link>

        {/* Sử dụng Grid giống Thư viện nhưng custom nội dung */}
        <div className={styles.mediaPreviewGrid}>
          {latestFiles.length > 0 ? (
            latestFiles.map((file) => (
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                key={file.id}
                className={styles.mediaPreviewItem}
                title={file.file_name}
              >
                {/* Ảnh nền là Thumbnail bài viết (hoặc ảnh mặc định nếu ko có) */}
                <img
                  src={file.post_thumbnail || '/assets/img/document-placeholder.jpg'}
                  alt={file.file_name}
                  loading="lazy"
                  style={{ filter: 'brightness(0.6)' }} // Làm tối ảnh nền để hiện chữ
                />

                {/* Overlay Icon & Tên file */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '4px', textAlign: 'center'
                }}>
                  <i className="fas fa-file-alt" style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '4px' }}></i>
                  <span style={{
                    color: '#fff', fontSize: '0.6rem', fontWeight: '600',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {file.file_name}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className={styles.emptyMessage} style={{ gridColumn: '1 / -1' }}>
              Chưa có tài liệu nào.
            </p>
          )}
        </div>

        <Link href="/tai-lieu" className={styles.viewAllButton}>
          Xem tất cả <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

    </aside>
  )
}
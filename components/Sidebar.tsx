// 1. "TRIỆU HỒI" SUPABASE
import { supabase } from '../utils/supabaseClient'
import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css'
import Searchbar from './Searchbar'
import SidebarMediaWidgets from './SidebarMediaWidgets'

export const revalidate = 3600; // Cache 1 giờ

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

async function getViecLamPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', 'gioi-thieu-viec-lam')
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

  const [tuyenSinhPosts, phapQuyPosts, tinTucPosts, viecLamPosts, latestMedia, latestFiles] = await Promise.all([
    getTuyenSinhPosts(),
    getPhapQuyPosts(),
    getTinTucSuKien(),
    getViecLamPosts(),
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
          <li>
            <Link href="/food">
              <i className="fas fa-utensils" style={{ color: '#ff6b6b' }}></i> Ẩm thực Ninh Bình
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

      {/* Box "Giới thiệu việc làm" */}
      <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
        <Link href="/danh-muc/gioi-thieu-viec-lam">
          <h3 className={styles.sidebarTitle}>Giới thiệu việc làm</h3>
        </Link>
        <ul className={styles.linkList}>
          {viecLamPosts.length > 0 ? (
            viecLamPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/bai-viet/${post.id}`}>
                  <i className="fas fa-caret-right"></i> {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li><p className={styles.emptyMessage}>Chưa có bài viết nào.</p></li>
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

      {/* BOX "THƯ VIỆN" VÀ "TÀI LIỆU MỚI" (ĐÃ TÁCH RA COMPONENT RIÊNG ĐỂ CÓ MODAL) */}
      <SidebarMediaWidgets latestMedia={latestMedia} latestFiles={latestFiles} />

    </aside>
  )
}
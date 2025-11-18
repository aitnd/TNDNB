// 💖 1. SERVER COMPONENT (Mặc định)
import React from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../components/Sidebar' // (Cột phải)
import FeaturedSlider from '../components/FeaturedSlider' // (Slider tin nổi bật)
import styles from './page.module.css' 

// (Hàm tạo tóm tắt - Giữ nguyên)
function taoTomTat(htmlContent: string, length: number = 150): string {
  if (!htmlContent) return '';
  let text = htmlContent.replace(/<[^>]+>/g, '');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.trim(); 
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// (Hàm lấy bài viết mới nhất)
async function getLatestPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10); // Lấy 10 bài mới nhất

  if (error) {
    console.error('Lỗi lấy bài viết:', error);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <div className={styles.container}>
      
      {/* (Slider Tin Nổi Bật - Luôn ở trên cùng) */}
      <section className={styles.featuredSection}>
        <FeaturedSlider />
      </section>

      {/* 💖 BỐ CỤC 2 CỘT (Đã gắn class để chỉnh Mobile) 💖 */}
      <div className={styles.layoutGrid}>
        
        {/* === CỘT 1: NỘI DUNG CHÍNH (Ưu tiên số 1 trên Mobile) === */}
        <div className={styles.mainContent}>
          
          <section className={styles.latestNews}>
            <h2 className={styles.sectionTitle}>Tin tức mới nhất</h2>
            
            <div className={styles.newsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.newsItemLarge}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={post.thumbnail_url || '/file.svg'} 
                      alt={post.title} 
                      className={styles.postThumb}
                    />
                  </div>
                  <div className={styles.postContent}>
                    <h3>
                      <Link href={`/bai-viet/${post.id}`} className={styles.postTitle}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className={styles.postDate}>
                      <i className="far fa-calendar-alt"></i>{' '}
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </p>
                    <p className={styles.postExcerpt}>
                      {taoTomTat(post.content)}
                    </p>
                    <Link href={`/bai-viet/${post.id}`} className={styles.readMore}>
                      Xem chi tiết »
                    </Link>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <p>Chưa có bài viết nào.</p>
              )}
            </div>
          </section>

        </div>

        {/* === CỘT 2: SIDEBAR (Ưu tiên số 2 trên Mobile) === */}
        <div className={styles.sidebarWrapper}>
           <Sidebar />
        </div>

      </div>
    </div>
  )
}
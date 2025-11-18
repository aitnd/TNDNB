// 💖 1. SERVER COMPONENT (Mặc định)
import React from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../components/Sidebar' 
import FeaturedSlider from '../components/FeaturedSlider' 
import styles from './page.module.css' 

// (Hàm tạo tóm tắt - Giữ nguyên)
function taoTomTat(htmlContent: string, length: number = 150): string {
  if (!htmlContent) return '';
  
  // 1. Xóa thẻ HTML và khoảng trắng thừa
  let text = htmlContent.replace(/<[^>]+>/g, '');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.trim(); 
  
  // 2. Nếu ngắn hơn giới hạn thì trả về luôn
  if (text.length <= length) return text;
  
  // 3. CẮT THÔNG MINH
  const subText = text.substring(0, length);
  const lastSpaceIndex = subText.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return subText.substring(0, lastSpaceIndex) + '...';
  }
  
  return subText + '...';
}

// (Hàm lấy bài viết mới nhất - Giữ nguyên)
async function getLatestPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10); 

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
      
      <section className={styles.featuredSection}>
        <FeaturedSlider />
      </section>

      <div className={styles.layoutGrid}>
        
        {/* === CỘT 1: NỘI DUNG CHÍNH === */}
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
                    <div className={styles.postDate}>
                      <i className="far fa-calendar-alt"></i>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    {/* 💖 SỬA LỖI HIỂN THỊ MÃ HTML Ở ĐÂY 💖 */}
                    <p 
                      className={styles.postExcerpt}
                      dangerouslySetInnerHTML={{ __html: taoTomTat(post.content) }}
                    />

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

        {/* === CỘT 2: SIDEBAR === */}
        <div className={styles.sidebarWrapper}>
           <Sidebar />
        </div>

      </div>
    </div>
  )
}
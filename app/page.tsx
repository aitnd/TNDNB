import { supabase } from '../utils/supabaseClient' // "Tổng đài" Supabase
import Link from 'next/link'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 
// 2. 💖 "TRIỆU HỒI" SIDEBAR DÙNG CHUNG 💖
import Sidebar from '../components/Sidebar' 

// (Định nghĩa "kiểu" Post - Giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
}

// (Hàm lấy Tin Tiêu Điểm - Giữ nguyên)
async function getFeaturedPosts(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tiêu Điểm...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_featured', true) 
    .order('created_at', { ascending: false })
    .limit(3) 

  if (error) {
    console.error('Lỗi lấy Tin Tiêu Điểm:', error)
    return []
  }
  return data || []
}

// (Hàm lấy Tin Tức Mới - Giữ nguyên)
async function getLatestNews(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tức Mới...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', 'tin-tuc-su-kien') 
    .eq('is_featured', false) 
    .order('created_at', { ascending: false })
    .limit(5) 

  if (error) {
    console.error('Lỗi lấy Tin Tức Mới:', error)
    return []
  }
  return data || []
}

// 3. TRANG CHỦ (SERVER COMPONENT)
export default async function HomePage() {
  
  // 4. "Chờ" máy chủ lấy 2 loại tin
  const featuredPosts = await getFeaturedPosts()
  const latestNews = await getLatestNews()

  // 5. "Vẽ" Giao diện (Đã dùng CSS Module)
  return (
    <div className={styles.container}>
      {/* BỐ CỤC 2 CỘT */}
      <div className={styles.layoutGrid}>

        {/* ===== CỘT TRÁI (NỘI DUNG CHÍNH) ===== */}
        <main className={styles.mainContent}>
          
          {/* Box Tin Tiêu Điểm (ĐỘNG) */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Tin tiêu điểm</h2>
            <div className={styles.newsGrid3}>
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post) => (
                  <div key={post.id} className={styles.newsItemSmall}>
                    <img
                      src={post.image_url || 'https://via.placeholder.com/300x200'}
                      alt={post.title}
                    />
                    <h3>
                      <Link href={`/bai-viet/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                ))
              ) : (
                <p style={{ padding: '0 1.5rem 1.5rem' }}>Chưa có tin tiêu điểm nào.</p>
              )}
            </div>
          </section>

          {/* Box Tin Tức Mới (ĐỘNG) */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Tin tức - Sự kiện</h2>
            <div className={styles.newsList}>
              {latestNews.length > 0 ? (
                latestNews.map((post) => (
                  <div key={post.id} className={styles.newsItemLarge}>
                    <img
                      src={post.image_url || 'https://via.placeholder.com/150x100'}
                      alt={post.title}
                    />
                    <div>
                      <h3>
                        <Link href={`/bai-viet/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p>
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '0 1.5rem 1.5rem' }}>Chưa có tin tức nào.</p>
              )}
            </div>
          </section>
        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        {/* 💖 6. "TRIỆU HỒI" SIDEBAR DÙNG CHUNG 💖 */}
        <Sidebar />

      </div>
    </div>
  )
}
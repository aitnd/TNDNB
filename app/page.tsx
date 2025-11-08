import { supabase } from '../utils/supabaseClient' // "Tổng đài" Supabase
import Link from 'next/link'
import Image from 'next/image'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// 2. Định nghĩa "kiểu" của Bài viết (đọc từ Supabase)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
}

// 3. "Phép thuật": TỰ ĐỘNG LẤY TIN TỨC (Chạy ở Máy chủ)

// Hàm lấy "Tin Tiêu Điểm"
async function getFeaturedPosts(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tiêu Điểm...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_featured', true) // Lấy tin có "dấu" Tiêu điểm
    .order('created_at', { ascending: false })
    .limit(3) // Lấy 3 tin mới nhất

  if (error) {
    console.error('Lỗi lấy Tin Tiêu Điểm:', error)
    return []
  }
  return data || []
}

// Hàm lấy "Tin Tức Mới"
async function getLatestNews(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tức Mới...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', 'tin-tuc-su-kien') // Lấy tin thuộc "Tin tức"
    .eq('is_featured', false) // Bỏ qua tin đã ở "Tiêu điểm"
    .order('created_at', { ascending: false })
    .limit(5) // Lấy 5 tin mới nhất

  if (error) {
    console.error('Lỗi lấy Tin Tức Mới:', error)
    return []
  }
  return data || []
}

// 4. TRANG CHỦ (SERVER COMPONENT)
export default async function HomePage() {
  
  // 5. "Chờ" máy chủ lấy 2 loại tin
  const featuredPosts = await getFeaturedPosts()
  const latestNews = await getLatestNews()

  // 6. "Vẽ" Giao diện (Đã dùng CSS Module)
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
                      {/* (Link bài viết chi tiết) */}
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
        {/* (Sidebar này mình làm TĨNH) */}
        <aside className={styles.sidebar}>

          {/* Box Văn bản pháp quy (search) */}
          {/* (Mình sẽ làm lại Form này bằng CSS Module ở bước sau nếu cần) */}
          <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
            <h3 className={styles.sidebarTitle}>Văn bản pháp quy</h3>
            <form>
              <input type="text" placeholder="Tìm văn bản..." style={{width: '100%', padding: '0.5rem', marginBottom: '0.5rem'}} />
              <button type="submit" style={{width: '100%', padding: '0.5rem'}}>Xem tiếp</button>
            </form>
          </div>
            
          {/* Box Bảng tin */}
          <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
            <h3 className={styles.sidebarTitle}>Bảng tin</h3>
            <ul className={styles.linkList}>
              <li><Link href="#">
                <i className="fas fa-caret-right"></i> Thông báo tuyển sinh TMT, CCCM
              </Link></li>
              <li><Link href="#">
                <i className="fas fa-caret-right"></i> Thông báo VEC v/v hồ sơ...
              </Link></li>
              <li><Link href="#">
                <i className="fas fa-caret-right"></i> Tuyển dụng nhân viên 2025
              </Link></li>
            </ul>
          </div>

          {/* Box Video */}
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
      </div>
    </div>
  )
}
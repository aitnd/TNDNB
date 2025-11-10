import { supabase } from '../utils/supabaseClient' // "Tổng đài" Supabase
import Link from 'next/link'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 
// 2. 💖 "TRIỆU HỒI" SIDEBAR DÙNG CHUNG 💖
import Sidebar from '../components/Sidebar' 
// 3. 💖 "TRIỆU HỒI" SLIDER MỚI 💖
import FeaturedSlider from '../components/FeaturedSlider'

// (Định nghĩa "kiểu" Post - Giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null; // (Cái này là ảnh trong bài viết, không phải thumbnail)
  category_id: string;
  is_featured: boolean;
}

// 💖 (ĐÃ XÓA HÀM getFeaturedPosts() CŨ VÌ SLIDER TỰ LẤY) 💖

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
  
  // 4. "Chờ" máy chủ lấy 1 loại tin thôi
  const latestNews = await getLatestNews()

  // 5. "Vẽ" Giao diện (Đã dùng CSS Module)
  return (
    <div className={styles.container}>
      {/* BỐ CỤC 2 CỘT */}
      <div className={styles.layoutGrid}>

        {/* ===== CỘT TRÁI (NỘI DUNG CHÍNH) ===== */}
        <main className={styles.mainContent}>
          
          {/* 💖 Box Tin Tiêu Điểm (ĐÃ THAY BẰNG SLIDER) 💖 */}
          <section>
            <FeaturedSlider />
          </section>

          {/* Box Tin Tức Mới (ĐỘNG) */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Tin tức - Sự kiện</h2>
            <div className={styles.newsList}>
              {latestNews.length > 0 ? (
                latestNews.map((post) => (
                  <div key={post.id} className={styles.newsItemLarge}>
                    {/* 💖 THÊM ẢNH ĐẠI DIỆN VÀO TIN TỨC MỚI 💖 */}
                    <img
                      // (Ưu tiên thumbnail, nếu không có thì lấy ảnh cũ hoặc ảnh mồi)
                      src={(post as any).thumbnail_url || post.image_url || 'https://via.placeholder.com/150x100'}
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
        <Sidebar />

      </div>
    </div>
  )
}
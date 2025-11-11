import { supabase } from '../utils/supabaseClient' // "Tổng đài" Supabase
import Link from 'next/link'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 
// 2. "TRIỆU HỒI" SIDEBAR DÙNG CHUNG
import Sidebar from '../components/Sidebar' 
// 3. "TRIỆU HỒI" SLIDER MỚI
import FeaturedSlider from '../components/FeaturedSlider'

// 💖 "THẦN CHÚ" BẮT TẢI LẠI DỮ LIỆU MỚI 💖
export const revalidate = 0; // ✨ "Thần chú" mới đây ạ
// (Định nghĩa "kiểu" Post - Giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null; 
  category_id: string;
  is_featured: boolean;
  thumbnail_url: string | null; // (Thêm thumbnail_url)
}

// 💖 HÀM LẤY 6 BÀI MỚI NHẤT (Giữ nguyên) 💖
async function getLatestPosts(): Promise<Post[]> {
  console.log('[Server] Đang lấy 6 bài viết mới nhất (không phân biệt danh mục)...');
  const { data, error } = await supabase
    .from('posts')
    .select('*') // (Lấy tất cả cột, bao gồm content và thumbnail_url)
    .order('created_at', { ascending: false })
    .limit(6); // (Lấy 6 bài)

  if (error) {
    console.error('Lỗi lấy Tin Tức Mới:', error)
    return []
  }
  return data || []
}

// 💖 HÀM "THẦN KỲ" TẠO TÓM TẮT (ĐÃ NÂNG CẤP) 💖
function taoTomTat(htmlContent: string, length: number = 120): string {
  if (!htmlContent) {
    return '';
  }
  // 1. Lột vỏ HTML
  let text = htmlContent.replace(/<[^>]+>/g, '');
  
  // 2. ✨ SỬA LỖI: Thay thế mã &nbsp; bằng dấu cách thường ✨
  text = text.replace(/&nbsp;/g, ' ');

  // 3. ✨ SỬA LỖI: Xóa khoảng trắng thừa ở đầu/cuối sau khi thay thế ✨
  text = text.trim(); 

  // 4. Cắt ngắn
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
}


// 3. TRANG CHỦ (SERVER COMPONENT)
export default async function HomePage() {
  
  // 4. "Chờ" máy chủ lấy 6 bài mới nhất
  const latestPosts = await getLatestPosts()

  // 5. "Vẽ" Giao diện
  return (
    <div className={styles.container}>
      {/* BỐ CỤC 2 CỘT */}
      <div className={styles.layoutGrid}>

        {/* ===== CỘT TRÁI (NỘI DUNG CHÍNH) ===== */}
        <main className={styles.mainContent}>
          
          {/* Box Tin Tiêu Điểm (Slider) */}
          <section>
            <FeaturedSlider />
          </section>

          {/* 💖 Box 6 BÀI MỚI NHẤT (ĐÃ XÓA TIÊU ĐỀ) 💖 */}
          <section className={styles.widgetBox}>
            {/* (ĐÃ XÓA TIÊU ĐỀ "Tin tức - Sự kiện" Ở ĐÂY) */}
            
            <div className={styles.newsList}>
              {latestPosts.length > 0 ? (
                latestPosts.map((post) => (
                  <div key={post.id} className={styles.newsItemLarge}>
                    <img
                      src={post.thumbnail_url || 'https://via.placeholder.com/150x100'}
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
                      {/* ✨ Dòng này sẽ tự động cập nhật theo hàm mới ✨ */}
                      <p className={styles.excerpt}>
                        {taoTomTat(post.content, 120)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '0 1.5rem 1.5rem' }}>Chưa có bài viết nào.</p>
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
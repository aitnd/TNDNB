import { supabase } from '../../../utils/supabaseClient' // (3 dấu ../)
import Link from 'next/link'
import Sidebar from '../../../components/Sidebar' // (3 dấu ../)
import styles from './page.module.css' 

// 1. Định nghĩa "kiểu" Post (Giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  image_url: string | null;
  content: string; // 💖 Thêm cột này
}
// (Kiểu "dữ liệu" trang)
type CategoryPageData = {
  categoryName: string;
  posts: Post[];
}

// 2. "Phép thuật": LẤY DỮ LIỆU DANH MỤC (Giữ nguyên)
async function getCategoryData(categoryId: string): Promise<CategoryPageData> {
  console.log(`[Server] Đang lấy dữ liệu cho danh mục: ${categoryId}`)

  // (Gọi "kho" 1: Lấy tên Danh mục)
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .single();

  // (Gọi "kho" 2: Lấy các bài viết - 💖 THÊM 'content' VÀO ĐÂY)
  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select('id, created_at, title, image_url, content') // 💖 Đã thêm 'content'
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (categoryError || postsError) {
    console.error('Lỗi lấy dữ liệu Danh mục:', categoryError || postsError);
  }

  return {
    categoryName: categoryData?.name || categoryId.replace('-', ' '),
    posts: postsData || []
  }
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

// 3. TRANG DANH MỤC (SERVER COMPONENT)
export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  
  // 4. "Chờ" máy chủ lấy dữ liệu
  const { categoryName, posts } = await getCategoryData(params.categoryId)

  // 5. "Vẽ" Giao diện
  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>

        {/* ===== CỘT TRÁI (NỘI DUNG CHÍNH) ===== */}
        <main className={styles.mainContent}>
          
          {/* Box Tin Tức (ĐỘNG) */}
          <section className={styles.widgetBox}>
            {/* (Tiêu đề "động" theo tên Danh mục) */}
            <h2 className={styles.widgetTitle}>{categoryName}</h2>
            
            <div className={styles.newsList}>
              {posts.length > 0 ? (
                posts.map((post) => (
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
                      {/* ✨ Dòng này sẽ tự động cập nhật theo hàm mới ✨ */}
                      <p className={styles.excerpt}>
                        {taoTomTat(post.content, 120)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '0 1.5rem 1.5rem' }}>
                  Chưa có bài viết nào trong mục này.
                </p>
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
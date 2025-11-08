import { supabase } from '../../../utils/supabaseClient' // (Lưu ý: 3 dấu ../)
import Link from 'next/link'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// 2. Định nghĩa "kiểu" của Bài viết (Logic giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string; // Đây là HTML thô từ Trình soạn thảo
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
}

// 3. "Phép thuật": LẤY CHI TIẾT BÀI VIẾT (Logic giữ nguyên)
async function getPostDetails(postId: string): Promise<Post | null> {
  console.log(`[Server] Đang lấy chi tiết bài viết ID: ${postId}`)
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId) // Lấy bài viết có ID trùng khớp
    .single() // (Chỉ lấy 1 bài duy nhất)

  if (error) {
    console.error('Lỗi lấy chi tiết bài viết:', error)
    return null
  }
  return data
}

// 4. TRANG ĐỌC BÀI VIẾT (Giao diện đã cập nhật CSS Module)
export default async function PostPage({ params }: { params: { postId: string } }) {
  
  // 5. "Chờ" máy chủ lấy bài viết
  const post = await getPostDetails(params.postId)

  // 6. Xử lý nếu không tìm thấy (Giao diện 404 đã cập nhật)
  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Lỗi 404</h1>
        <p className={styles.errorMessage}>Không tìm thấy bài viết này.</p>
        <div className={styles.backButtonContainer} style={{borderTop: 'none', marginTop: '1.5rem'}}>
          <Link href="/" className={styles.backButton}>
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    )
  }

  // 7. "Vẽ" Giao diện (Giao diện bài viết đã cập nhật)
  return (
    <div className={styles.container}>
      
      {/* Tiêu đề */}
      <h1 className={styles.title}>
        {post.title}
      </h1>

      {/* Thông tin phụ (Ngày đăng) */}
      <p className={styles.meta}>
        Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
        {' | '}
        <span>{post.category_id.replace('-', ' ')}</span>
      </p>

      {/* Ảnh bìa (nếu có) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className={styles.image}
        />
      )}

      {/* NỘI DUNG CHÍNH (RẤT QUAN TRỌNG)
        Chúng ta dùng class "post-content" (đã định nghĩa trong 'globals.css')
        để "vẽ" HTML thô từ Trình soạn thảo.
      */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Nút Quay về */}
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          « Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}
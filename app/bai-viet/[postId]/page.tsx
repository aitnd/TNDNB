import { supabase } from '../../../utils/supabaseClient' // (Kho Supabase)
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi CSS)
import { adminDb } from '../../../utils/firebaseAdmin' // 💖 "TRIỆU HỒI" KHO FIRESTORE 💖

// 2. 💖 ĐỊNH NGHĨA "KIỂU" NÂNG CẤP 💖
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string; 
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
  author_id: string; // (ID của tác giả)
}

// (Kiểu dữ liệu mới cho trang)
type PostPageData = {
  post: Post;
  authorName: string | null;
}

// 3. 💖 "PHÉP THUẬT": LẤY DỮ LIỆU TỪ 2 "KHO" 💖
async function getPostDetails(postId: string): Promise<PostPageData | null> {
  
  // 3.1. "Hỏi" Kho Supabase để lấy Bài viết
  console.log(`[Server] Lấy bài viết ID: ${postId} từ Supabase...`);
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('*') // (Lấy hết cột, bao gồm "author_id")
    .eq('id', postId) 
    .single() 

  // (Nếu "Luật" RLS (bước trước) sai, hoặc không có bài, nó sẽ lỗi ở đây)
  if (postError || !postData) {
    console.error('Lỗi Supabase (lấy post):', postError);
    return null
  }

  let authorName: string | null = null;
  
  // 3.2. "Hỏi" Kho Firestore để lấy Tên Tác giả
  if (postData.author_id) {
    try {
      console.log(`[Server] Lấy tác giả ID: ${postData.author_id} từ Firestore...`);
      // (Dùng "chìa khóa" Admin để "mở tủ" users)
      const userDocRef = adminDb.collection('users').doc(postData.author_id);
      const userDoc = await userDocRef.get();
      
      // 💖 SỬA LỖI Ở ĐÂY (bỏ dấu "()" ở .exists) 💖
      if (userDoc.exists) { 
        authorName = userDoc.data()?.fullName || 'Tác giả';
      } else {
        authorName = 'Tác giả không xác định';
      }
    } catch (firestoreError) {
      console.error('Lỗi Firestore (lấy user):', firestoreError);
      authorName = 'Lỗi khi tải tác giả'; // (Để mình biết lỗi)
    }
  }

  // (Gói 2 kết quả lại)
  return {
    post: postData as Post,
    authorName: authorName
  };
}

// 4. TRANG ĐỌC BÀI VIẾT (ĐÃ SỬA)
export default async function PostPage({ params }: { params: { postId: string } }) {
  
  // 5. "Chờ" máy chủ lấy dữ liệu (từ cả 2 kho)
  const data = await getPostDetails(params.postId)

  // 6. Xử lý nếu không tìm thấy
  if (!data) {
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

  // (Lấy data ra)
  const { post, authorName } = data;

  // 7. "Vẽ" Giao diện
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

      {/* NỘI DUNG CHÍNH */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 💖 THÊM TÊN TÁC GIẢ (Lấy từ Firestore) 💖 */}
      {authorName && (
        <p className={styles.authorName}>
          Đăng bởi: {authorName}
        </p>
      )}
      
      {/* Nút Quay về */}
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          « Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}
import { supabase } from '../../../utils/supabaseClient' // (Kho Supabase)
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi CSS)
import { adminDb } from '../../../utils/firebaseAdmin' // 💖 "TRIỆU HỒI" KHO FIRESTORE 💖

// 💖 "THẦN CHÚ" BẮT TẢI LẠI DỮ LIỆU MỚI 💖
export const revalidate = 0; // ✨ "Thần chú" mới đây ạ
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

  if (postError || !postData) {
    console.error('Lỗi Supabase (lấy post):', postError);
    return null
  }

  let authorName: string | null = null;
  
  // 3.2. "Hỏi" Kho Firestore để lấy Tên Tác giả
  if (postData.author_id) {
    try {
      console.log(`[Server] Lấy tác giả ID: ${postData.author_id} từ Firestore...`);
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
  
  const data = await getPostDetails(params.postId)

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

  const { post, authorName } = data;

  return (
    <div className={styles.container}>
      
      <h1 className={styles.title}>
        {post.title}
      </h1>

      <p className={styles.meta}>
        Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
        {' | '}
        <span>{post.category_id.replace('-', ' ')}</span>
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className={styles.image}
        />
      )}

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {authorName && (
        <p className={styles.authorName}>
          Đăng bởi: {authorName}
        </p>
      )}
      
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          « Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}
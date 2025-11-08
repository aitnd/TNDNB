import { supabase } from '../../../utils/supabaseClient' // (Lưu ý: 3 dấu ../)
import Image from 'next/image'
import Link from 'next/link'

// 1. Định nghĩa "kiểu" của Bài viết (giống trang chủ)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string; // Đây là HTML thô từ Trình soạn thảo
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
}

// 2. "Phép thuật": LẤY CHI TIẾT BÀI VIẾT (Chạy ở Máy chủ)
async function getPostDetails(postId: string): Promise<Post | null> {
  console.log(`[Server] Đang lấy chi tiết bài viết ID: ${postId}`)
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId) // Lấy bài viết có ID trùng khớp
    .single() // (Quan trọng: Chỉ lấy 1 bài duy nhất)

  if (error) {
    console.error('Lỗi lấy chi tiết bài viết:', error)
    return null
  }
  return data
}

// 3. TRANG ĐỌC BÀI VIẾT (SERVER COMPONENT)
export default async function PostPage({ params }: { params: { postId: string } }) {
  
  // 4. "Chờ" máy chủ lấy bài viết
  const post = await getPostDetails(params.postId)

  // 5. Xử lý nếu không tìm thấy
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Lỗi 404</h1>
        <p className="text-lg mt-4">Không tìm thấy bài viết này.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
          Quay về Trang chủ
        </Link>
      </div>
    )
  }

  // 6. "Vẽ" Giao diện (khi tìm thấy bài viết)
  return (
    <div className="bg-white max-w-4xl mx-auto my-12 p-6 md:p-10 shadow-lg rounded-lg">
      
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        {post.title}
      </h1>

      {/* Thông tin phụ (Ngày đăng) */}
      <p className="text-sm text-gray-500 mb-6 border-b pb-4">
        Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
        {' | '}
        <span className="font-semibold capitalize">{post.category_id.replace('-', ' ')}</span>
      </p>

      {/* Ảnh bìa (nếu có) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto max-h-96 object-cover rounded-md mb-8"
        />
      )}

      {/* NỘI DUNG CHÍNH (RẤT QUAN TRỌNG)
        Chúng ta dùng 'dangerouslySetInnerHTML' để "vẽ" HTML
        (vì 'post.content' là HTML thô từ Trình soạn thảo).
        Điều này là an toàn VÌ chúng ta tin tưởng 100%
        nội dung này (do chính Admin viết ra).
      */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-12 border-t pt-6 text-center">
        <Link href="/" className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
          « Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}
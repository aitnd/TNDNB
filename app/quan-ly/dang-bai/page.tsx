// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext' 
import ProtectedRoute from '../../../components/ProtectedRoute' 
import { supabase } from '../../../utils/supabaseClient' 
import Link from 'next/link'

// 💖 1. "TRIỆU HỒI" KHO FIRESTORE ĐỂ LẤY TÊN 💖
import { db } from '../../../utils/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

// (Import CSS Module - Mình mượn của trang Tài khoản)
import styles from '../tai-khoan/page.module.css' 

// 💖 2. ĐỊNH NGHĨA "KIỂU" NÂNG CẤP (Thêm authorName) 💖
interface Post {
  id: string; 
  title: string;
  category_id: string;
  created_at: string;
  is_featured: boolean;
  author_id: string; // (ID của tác giả)
  authorName?: string; // (Tên tác giả - Sẽ được điền sau)
}

// (Kiểu của "Bản đồ" tra cứu)
type AuthorMap = {
  [key: string]: string; // Ví dụ: { 'uid-123': 'Code dạo', 'uid-456': 'Anh TND' }
}

// 3. TẠO "NỘI DUNG" TRANG (ĐÃ NÂNG CẤP)
function PostManagementDashboard() {
  const { user } = useAuth() 
  const [posts, setPosts] = useState<Post[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 4. "Phép thuật" Lấy danh sách Bài viết (ĐÃ NÂNG CẤP)
  useEffect(() => {
    
    // 💖 TẠO HÀM PHỤ 1: Lấy "Bản đồ" Tên Tác giả từ Firestore 💖
    async function fetchAuthors(): Promise<AuthorMap> {
      console.log('Đang lấy "Bản đồ" Tác giả từ Firestore...');
      const authorMap: AuthorMap = {};
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach((doc) => {
          authorMap[doc.id] = doc.data().fullName || 'Tác giả ẩn danh';
        });
        console.log('Lấy "Bản đồ" Tác giả thành công!');
        return authorMap;
      } catch (err) {
        console.error('Lỗi khi lấy "Bản đồ" Tác giả:', err);
        return authorMap; // (Trả về rỗng nếu lỗi)
      }
    }

    // 💖 TẠO HÀM PHỤ 2: Lấy bài viết VÀ "Gắn" tên tác giả 💖
    async function fetchPostsAndAuthors() {
      setLoading(true);
      setError(null);
      
      try {
        // (Chạy song song 2 "lời hứa" cho nhanh)
        const [authorMap, { data: postData, error: postError }] = await Promise.all([
          fetchAuthors(), // (Lời hứa 1: Lấy tên)
          supabase // (Lời hứa 2: Lấy bài viết)
            .from('posts')
            .select('id, title, category_id, created_at, is_featured, author_id') // (Lấy thêm author_id)
            .order('created_at', { ascending: false })
        ]);

        if (postError) throw postError;
        
        // (Sau khi có cả 2, mình "gắn" tên vào)
        const postsWithAuthors = (postData || []).map(post => ({
          ...post,
          authorName: authorMap[post.author_id] || 'Không rõ' // (Tra cứu tên)
        }));

        setPosts(postsWithAuthors as Post[]);

      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách bài viết:', err);
        setError(err.message || 'Lỗi không xác định.');
      } finally {
        setLoading(false);
      }
    }

    fetchPostsAndAuthors(); // (Chạy hàm "tổng")
    
  }, []); // (Chạy 1 lần)

  // 5. HÀM "XÓA BÀI VIẾT" (Đã sửa lại để chạy nhanh hơn)
  const handleDeletePost = async (postId: string, postTitle: string) => {
    // (Vì đã qua "Lính gác", nên user chắc chắn có quyền)
    if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN bài viết "${postTitle}" không?`)) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId)
        
        if (error) throw error;
        
        // (Xóa thành công, tải lại danh sách - Tự động chạy lại useEffect ở trên)
        // (Mình sẽ xóa nó khỏi state luôn cho nhanh, không cần gọi API)
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

      } catch (err: any) { 
        setError(err.message || 'Lỗi khi xóa bài viết.');
      }
    }
  }

  // (Hàm "phiên dịch" Danh mục - Giữ nguyên)
  const formatCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'tin-tuc-su-kien':
        return 'Tin tức - Sự kiện';
      case 'tuyen-sinh':
        return 'Tuyển sinh';
      case 'van-ban-phap-quy':
        return 'Văn bản pháp quy';
      default:
        // Nếu lỡ có tên nào lạ, mình tạm viết hoa chữ cái đầu
        return categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // 6. GIAO DIỆN (ĐÃ THÊM CỘT MỚI)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý Bài viết</h1>
          <div>
            {/* (Nút Tạo mới) */}
            <Link href="/quan-ly/dang-bai/tao-moi" className={styles.buttonCreate}>
              + Tạo bài viết mới
            </Link>
            <Link href="/quan-ly" className={styles.backButton} style={{marginLeft: '1rem'}}>
              « Quay về Bảng điều khiển
            </Link>
          </div>
        </div>

        {loading && <p>Đang tải danh sách bài viết và tác giả...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  {/* 💖 7. THÊM CỘT "NGƯỜI ĐĂNG" 💖 */}
                  <th>Người đăng</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td><strong>{post.title}</strong></td>
                    
                    {/* (Phiên dịch Danh mục) */}
                    <td>{formatCategoryName(post.category_id)}</td>
                    
                    {/* 💖 8. HIỂN THỊ TÊN NGƯỜI ĐĂNG 💖 */}
                    <td>{post.authorName}</td> 
                    
                    <td>
                      {post.is_featured ? (
                        <span className={styles.pill} style={{backgroundColor: '#fef3c7', color: '#92400e'}}>
                          Tin tiêu điểm
                        </span>
                      ) : (
                        <span className={styles.pill} style={{backgroundColor: '#e5e7eb', color: '#374151'}}>
                          Tin thường
                        </span>
                      )}
                    </td>
                    <td>{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {/* (Nút Sửa) */}
                        <Link href={`/quan-ly/dang-bai/sua/${post.id}`} className={styles.buttonEdit}>
                          Sửa
                        </Link>
                        <button 
                          className={styles.buttonDelete}
                          onClick={() => handleDeletePost(post.id, post.title)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

// 9. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC" (Giữ nguyên)
export default function QuanLyBaiVietPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <PostManagementDashboard /> 
    </ProtectedRoute>
  )
}
// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext' 
import ProtectedRoute from '../../../components/ProtectedRoute' 
import { supabase } from '../../../utils/supabaseClient' 
import Link from 'next/link'

// (Import CSS Module - Mình mượn của trang Tài khoản)
import styles from '../tai-khoan/page.module.css' 

// 1. Định nghĩa "kiểu" của Bài viết
interface Post {
  id: string; 
  title: string;
  category_id: string;
  created_at: string;
  is_featured: boolean;
}

// 2. TẠO "NỘI DUNG" TRANG
function PostManagementDashboard() {
  const { user } = useAuth() 
  const [posts, setPosts] = useState<Post[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. "Phép thuật" Lấy danh sách Bài viết
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      console.log('Đang lấy danh sách bài viết...');
      const { data, error }_ = await supabase
        .from('posts')
        .select('id, title, category_id, created_at, is_featured') // (Chỉ lấy cột cần)
        .order('created_at', { ascending: false }); // (Mới nhất lên đầu)
      
      if (error) throw error;
      
      setPosts(data || []);
    } catch (err: any) {
      console.error('Lỗi khi lấy danh sách bài viết:', err);
      setError(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  }

  // 4. HÀM "XÓA BÀI VIẾT"
  const handleDeletePost = async (postId: string, postTitle: string) => {
    // (Vì đã qua "Lính gác", nên user chắc chắn có quyền)
    if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN bài viết "${postTitle}" không?`)) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId)
        
        if (error) throw error;
        
        // (Xóa thành công, tải lại danh sách)
        await fetchPosts();

      } catch (err: any)
        setError(err.message || 'Lỗi khi xóa bài viết.');
      }
    }
  }

  // 5. GIAO DIỆN
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý Bài viết</h1>
          <div>
            {/* 💖 NÚT TẠO MỚI (Trỏ sang nhà mới) 💖 */}
            <Link href="/quan-ly/dang-bai/tao-moi" className={styles.buttonCreate}>
              + Tạo bài viết mới
            </Link>
            <Link href="/quan-ly" className={styles.backButton} style={{marginLeft: '1rem'}}>
              « Quay về Bảng điều khiển
            </Link>
          </div>
        </div>

        {loading && <p>Đang tải danh sách bài viết...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td><strong>{post.title}</strong></td>
                    <td>{post.category_id.replace('-', ' ')}</td>
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
                        {/* 💖 NÚT SỬA (Sẽ làm ở bước sau) 💖 */}
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

// 6. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC"
export default function QuanLyBaiVietPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <PostManagementDashboard /> 
    </ProtectedRoute>
  )
}
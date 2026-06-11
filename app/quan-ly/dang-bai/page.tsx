// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext' 
import ProtectedRoute from '../../../components/ProtectedRoute' 
import { supabase } from '../../../utils/supabaseClient' 
import Link from 'next/link'
import { FaFacebook } from 'react-icons/fa' 

// (Triệu hồi kho Firestore)
import { db } from '../../../utils/firebaseClient'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

// (Import CSS Module - Mình mượn của trang Tài khoản)
import styles from '../tai-khoan/page.module.css' 

// (Kiểu 'Post' - Giữ nguyên)
interface Post {
  id: string; 
  title: string;
  category_id: string;
  created_at: string;
  is_featured: boolean;
  author_id: string; 
  authorName?: string; 
}

// (Kiểu 'AuthorMap' - Giữ nguyên)
type AuthorMap = {
  [key: string]: string; 
}

// (NỘI DUNG TRANG - Giữ nguyên)
function PostManagementDashboard() {
  const { user } = useAuth() 
  const [posts, setPosts] = useState<Post[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usageConfig, setUsageConfig] = useState<any>(null)

  // Hàm ánh xạ role của user sang Firestore config key
  const getRoleConfigKey = (role: string) => {
    if (role === 'admin') return 'admin';
    if (role === 'lanh_dao') return 'leader';
    if (role === 'quan_ly') return 'manager';
    if (role === 'giao_vien') return 'teacher';
    if (role === 'hoc_vien') return 'verified_user';
    return 'guest';
  };

  useEffect(() => {
    async function fetchUsageConfig() {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'usage_config'));
        if (docSnap.exists()) {
          setUsageConfig(docSnap.data());
        }
      } catch (err) {
        console.error('Lỗi khi fetch usage_config:', err);
      }
    }
    fetchUsageConfig();
  }, []);

  // (Link web - Giữ nguyên)
  const PRODUCTION_URL = 'https://tndnb.vercel.app';

  // (Hàm "Lấy Bài viết" & "Tác giả" - Giữ nguyên)
  useEffect(() => {
    async function fetchAuthors(): Promise<AuthorMap> {

      const authorMap: AuthorMap = {};
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach((doc) => {
          authorMap[doc.id] = doc.data().fullName || 'Tác giả ẩn danh';
        });

        return authorMap;
      } catch (err) {
        console.error('Lỗi khi lấy "Bản đồ" Tác giả:', err);
        return authorMap; 
      }
    }

    async function fetchPostsAndAuthors() {
      setLoading(true);
      setError(null);
      
      try {
        const [authorMap, { data: postData, error: postError }] = await Promise.all([
          fetchAuthors(), 
          supabase 
            .from('posts')
            .select('id, title, category_id, created_at, is_featured, author_id') 
            .order('created_at', { ascending: false })
        ]);

        if (postError) throw postError;
        
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
    fetchPostsAndAuthors(); 
  }, []); 

  // (Hàm "Xóa Bài viết" - Kiểm tra quyền)
  const handleDeletePost = async (postId: string, postTitle: string, authorId: string) => {
    // Kiểm tra quyền xóa bài viết
    const isOwnPost = user ? authorId === user.uid : false;
    const userRoleKey = user ? getRoleConfigKey(user.role) : 'guest';
    const roleConfig = usageConfig ? usageConfig[userRoleKey] : null;

    const canDelete = isOwnPost
      ? (roleConfig ? roleConfig.newsCreateEdit !== 'none' : true)
      : (roleConfig ? roleConfig.newsDeleteOthers === true : false);

    if (!canDelete) {
      alert('Anh không có quyền xóa bài viết này của người khác!');
      return;
    }

    if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN bài viết "${postTitle}" không?`)) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId)
        
        if (error) throw error;
        
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

      } catch (err: any) { 
        setError(err.message || 'Lỗi khi xóa bài viết.');
      }
    }
  }

  // (Hàm "Share FB" - Giữ nguyên)
  const handleShareToFacebook = (postId: string) => {
    const postUrl = `${PRODUCTION_URL}/bai-viet/${postId}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
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
        return categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // 💖 GIAO DIỆN (ĐÃ NÂNG CẤP LINK TIÊU ĐỀ) 💖
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
                  <th>Người đăng</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    
                    {/* 💖 1. "BỌC" CÁI TIÊU ĐỀ BẰNG LINK 💖 */}
                    <td>
                      <Link 
                        href={`/bai-viet/${post.id}`} 
                        target="_blank" // (Mở tab mới)
                        rel="noopener noreferrer" // (Bảo mật)
                        className={styles.titleLink} // (Dùng "áo" mới)
                        title="Bấm để xem bài viết"
                      >
                        <strong>{post.title}</strong>
                      </Link>
                    </td>
                    
                    {/* (Phiên dịch Danh mục) */}
                    <td>{formatCategoryName(post.category_id)}</td>
                    
                    {/* (Tên Người đăng) */}
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
                        {/* (Nút "Đăng FB") */}
                        <button 
                          className={styles.buttonShare}
                          onClick={() => handleShareToFacebook(post.id)}
                          title="Chia sẻ bài viết này lên Facebook"
                        >
                          <FaFacebook />
                        </button>
                        
                        {/* (Nút Sửa) */}
                        {(() => {
                          const isOwnPost = user ? post.author_id === user.uid : false;
                          const userRoleKey = user ? getRoleConfigKey(user.role) : 'guest';
                          const roleConfig = usageConfig ? usageConfig[userRoleKey] : null;
                          const canEdit = roleConfig
                            ? (roleConfig.newsCreateEdit === 'all' || (roleConfig.newsCreateEdit === 'own' && isOwnPost))
                            : isOwnPost;

                          return canEdit ? (
                            <Link href={`/quan-ly/dang-bai/sua/${post.id}`} className={styles.buttonEdit}>
                              Sửa
                            </Link>
                          ) : null;
                        })()}
                        
                        {/* (Nút Xóa) */}
                        {(() => {
                          const isOwnPost = user ? post.author_id === user.uid : false;
                          const userRoleKey = user ? getRoleConfigKey(user.role) : 'guest';
                          const roleConfig = usageConfig ? usageConfig[userRoleKey] : null;
                          const canDelete = isOwnPost
                            ? (roleConfig ? roleConfig.newsCreateEdit !== 'none' : true)
                            : (roleConfig ? roleConfig.newsDeleteOthers === true : false);

                          return canDelete ? (
                            <button 
                              className={styles.buttonDelete}
                              onClick={() => handleDeletePost(post.id, post.title, post.author_id)}
                            >
                              Xóa
                            </button>
                          ) : null;
                        })()}
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

// (BỌC "LÍNH GÁC" - Giữ nguyên)
export default function QuanLyBaiVietPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <PostManagementDashboard /> 
    </ProtectedRoute>
  )
}
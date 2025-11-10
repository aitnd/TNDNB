// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' // (Thêm "useParams")
import dynamic from 'next/dynamic' 
import { useAuth } from '../../../../../context/AuthContext' // (Sửa đường dẫn 5 chấm)
import ProtectedRoute from '../../../../../components/ProtectedRoute' // (Sửa đường dẫn 5 chấm)
import { supabase } from '../../../../../utils/supabaseClient' // (Sửa đường dẫn 5 chấm)

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; 
import vi from 'suneditor/src/lang/en';

// "Triệu hồi" file CSS Module
import styles from './page.module.css' // (CSS riêng của trang này)

type Category = {
  id: string;
  name: string;
}

function EditPostForm() {
  const router = useRouter()
  const params = useParams() // (Dùng "móc" để lấy ID)
  const postId = params.postId as string // (Lấy ID bài viết từ URL)

  // (Não trạng thái - Giống trang "Tạo mới")
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // (Thêm "não" mới để chờ tải dữ liệu cũ)
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  // 1. "Phép thuật" (Lấy danh mục - Giữ nguyên)
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      if (error) {
        console.error('Lỗi khi lấy danh mục:', error)
      } else {
        setCategories(data as Category[])
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) 
  
  // 2. 💖 "PHÉP THUẬT" MỚI (Lấy dữ liệu bài viết cũ) 💖
  useEffect(() => {
    if (!postId) return; // (Nếu chưa có ID thì nghỉ)

    async function fetchPostData() {
      console.log(`Đang tải dữ liệu bài viết ID: ${postId}`);
      setIsLoadingPost(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId) // (Tìm bài có ID trùng)
        .single(); // (Lấy 1 bài duy nhất)

      if (error) {
        console.error('Lỗi khi tải bài viết:', error);
        setFormError('Không tìm thấy bài viết này hoặc có lỗi xảy ra.');
      } else if (data) {
        // (Đổ dữ liệu cũ vào "não")
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.category_id);
        setIsFeatured(data.is_featured);
      }
      setIsLoadingPost(false);
    }
    fetchPostData();
  }, [postId]); // (Chạy lại khi "postId" thay đổi)

  // 3. 💖 HÀM "CẬP NHẬT BÀI" (Sửa lại từ "Tạo mới") 💖
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    setFormSuccess(null)

    if (!title || !content || !categoryId) {
      setFormError('Tiêu đề, Nội dung, và Danh mục không được để trống!')
      setIsSubmitting(false)
      return
    }
    
    try {
      // (Dùng "update" thay vì "insert")
      const { data, error } = await supabase
        .from('posts') 
        .update({ 
          title: title, 
          content: content, 
          category_id: categoryId, 
          is_featured: isFeatured 
        })
        .eq('id', postId); // (Cập nhật bài có ID này)

      if (error) throw error 
      setFormSuccess('Cập nhật bài viết thành công!');
      
      // (Delay 1 giây rồi "đá" về trang danh sách)
      setTimeout(() => {
        router.push('/quan-ly/dang-bai');
      }, 1000);

    } catch (err: any) {
      console.error('Lỗi khi cập nhật bài:', err)
      setFormError(err.message || 'Lỗi không xác định khi cập nhật.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // (Giao diện)
  if (isLoadingPost) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Đang tải dữ liệu bài viết...</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Chỉnh sửa bài viết
        </h1>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* (Tiêu đề) */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
            </div>
            {/* (Danh mục) */}
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Danh mục
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className={styles.select}
              >
                {loadingCategories ? (
                  <option>Đang tải...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* (Checkbox) */}
            <div className={styles.checkboxGroup}>
              <input
                id="is_featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="is_featured" className={styles.label}>
                Đánh dấu là "Tin tiêu điểm"
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              <SunEditor 
                lang={vi} 
                setContents={content} // (Tự điền nội dung cũ)
                onChange={setContent}
                setOptions={{
                  height: '300px',
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    '/', // (Xuống dòng)
                    ['fontColor', 'hiliteColor'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                  ],
                }}
              />
            </div>

            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}
            
            <div className={styles.buttonContainer} style={{justifyContent: 'space-between', display: 'flex'}}>
              <Link href="/quan-ly/dang-bai" style={{color: '#555', textDecoration: 'underline'}}>
                « Quay về Danh sách
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || loadingCategories}
                className={styles.button}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function EditPostPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <EditPostForm /> 
    </ProtectedRoute>
  )
}
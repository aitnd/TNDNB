// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' 
import { useAuth } from '../../context/AuthContext' 
import ProtectedRoute from '../../components/ProtectedRoute' 
import { supabase } from '../../utils/supabaseClient' 

// 1. 💖 THÊM DÒNG NÀY ĐỂ "BỊT" LỖI TYPE 💖
// @ts-ignore
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// 2. "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// Định nghĩa "kiểu" của Danh mục (từ Supabase)
type Category = {
  id: string;
  name: string;
}

// --- Component "Nội dung" (Bên trong "Lính gác") ---
function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // "Não" trạng thái
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)

  // "Não" của Bài viết
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  // Trạng thái Form
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)


  // 3. "Phép thuật": Tự động lấy "Danh mục" từ Supabase
  useEffect(() => {
    async function fetchCategories() {
      console.log('[Admin] Đang lấy danh mục từ Supabase...')
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Lỗi khi lấy danh mục:', error)
      } else {
        setCategories(data as Category[])
        if (data && data.length > 0) {
          setCategoryId(data[0].id)
        }
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) 
  
  // 4. HÀM "ĐĂNG BÀI"
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

    console.log('Đang cất bài viết vào Supabase...')

    try {
      // 5. "CẤT" VÀO "KHO" SUPABASE
      const { data, error } = await supabase
        .from('posts') // Vào "ngăn" posts
        .insert([
          {
            title: title,
            content: content,
            category_id: categoryId,
            is_featured: isFeatured,
          }
        ])

      if (error) {
        throw error 
      }

      console.log('Đăng bài thành công!', data)
      setFormSuccess('Đăng bài thành công!')
      // "Xóa" form
      setTitle('')
      setContent('')
      setIsFeatured(false)

    } catch (err: any) {
      console.error('Lỗi khi đăng bài:', err)
      setFormError(err.message || 'Lỗi không xác định khi đăng bài.')
    } finally {
      setIsSubmitting(false)
    }
  }


  // 6. GIAO DIỆN FORM (Đã "nối não")
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Trang Quản trị Nội dung (Admin)
        </h1>
        
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>
            Tạo bài viết mới
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Tiêu đề */}
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
                placeholder="Thông báo tuyển sinh..."
              />
            </div>

            {/* Danh mục (Lấy từ Supabase) */}
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
                  <option>Đang tải danh mục...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Checkbox "Tin tiêu điểm" */}
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

            {/* 💖 TRÌNH SOẠN THẢO "XỊN" 💖 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              {/* @ts-ignore (Bỏ qua lỗi "is not a module") */}
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className={styles.quillEditor}
              />
            </div>

            {/* Thông báo Lỗi/Thành công */}
            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}

            {/* Nút bấm */}
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                disabled={isSubmitting || loadingCategories}
                className={styles.button}
              >
                {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function AdminPage() {
  return (
    // "Lính gác" sẽ kiểm tra
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien']}>
      <AdminDashboard /> 
    </ProtectedRoute>
  )
}
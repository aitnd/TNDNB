// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '../../context/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../utils/supabaseClient'

// 1. "TRIỆU HỒI" TRÌNH SOẠN THẢO "SUNEDITOR" (MỚI)
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // (CSS của nó)

// 2. 💖 "TRIỆU HỒI" NGÔN NGỮ TỪ 'suneditor/src/lang' (Sửa lỗi) 💖
import vi from 'suneditor/src/lang/en';

// 3. "Triệu hồi" file CSS Module
import styles from './page.module.css'

// (Định nghĩa "kiểu" Category - Giữ nguyên)
type Category = {
  id: string;
  name: string;
}

// --- Component "Nội dung" (Bên trong "Lính gác") ---
function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // (Não trạng thái - Giữ nguyên)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // 4. "Phép thuật": Lấy "Danh mục" (Giữ nguyên)
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

  // 5. HÀM "ĐĂNG BÀI" (Giữ nguyên)
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
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { title: title, content: content, category_id: categoryId, is_featured: isFeatured }
        ])
      if (error) throw error
      console.log('Đăng bài thành công!', data)
      setFormSuccess('Đăng bài thành công!')
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

  // 6. GIAO DIỆN FORM (Đã thay thế Trình soạn thảo)
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
                placeholder="Thông báo tuyển sinh..."
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
                Đánh dấu là &quot;Tin tiêu điểm&quot;
              </label>
            </div>

            {/* 💖 TRÌNH SOẠN THẢO "SUNEDITOR" (ĐÃ SỬA LỖI "lang") 💖 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              <SunEditor
                lang={vi}
                setContents={content}
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

            {/* (Thông báo Lỗi/Thành công) */}
            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}
            {/* (Nút bấm) */}
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
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien']}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
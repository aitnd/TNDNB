// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' // "Triệu hồi" công cụ Import "động"
import { useAuth } from '../../context/AuthContext' 
import ProtectedRoute from '../../components/ProtectedRoute' 
import { supabase } from '../../utils/supabaseClient'

// 1. 💖 "TRIỆU HỒI" TRÌNH SOẠN THẢO (Bỏ qua lỗi Types) 💖
//    Tụi mình "bịt" lỗi "is not a module" bằng @ts-ignore
//    và "bắt" nó chỉ chạy ở Trình duyệt (ssr: false)
// @ts-ignore 
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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

  // 2. 💖 "NÃO" CỦA BÀI VIẾT 💖
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') // "Não" chứa code HTML
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
        // Tự động chọn danh mục đầu tiên
        if (data && data.length > 0) {
          setCategoryId(data[0].id)
        }
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) // Chạy 1 lần duy nhất

  
  // 4. 💖 "PHÉP THUẬT" NÚT "ĐĂNG BÀI" 💖
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
            // (id, created_at tự tạo)
          }
        ])

      if (error) {
        throw error // Ném lỗi cho 'catch' ở dưới bắt
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Trang Quản trị Nội dung (Admin)
        </h1>
        
        {/* === FORM ĐĂNG BÀI VIẾT MỚI === */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Tạo bài viết mới
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Thông báo tuyển sinh..."
              />
            </div>

            {/* Danh mục (Lấy từ Supabase) */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                  Đánh dấu là "Tin tiêu điểm"
                </label>
              </div>
            </div>

            {/* 💖 TRÌNH SOẠN THẢO "XỊN" 💖 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung bài viết
              </label>
              {/* @ts-ignore (Bỏ qua lỗi "is not a module") */}
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="bg-white"
              />
            </div>

            {/* Thông báo Lỗi/Thành công */}
            {formError && (
              <div className="my-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="my-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
                {formSuccess}
              </div>
            )}

            {/* Nút bấm */}
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting || loadingCategories}
                className="rounded-md bg-blue-600 px-6 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
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
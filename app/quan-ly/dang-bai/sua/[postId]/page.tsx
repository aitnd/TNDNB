// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' 
import dynamic from 'next/dynamic' 
import { useAuth } from '../../../../../context/AuthContext' 
import ProtectedRoute from '../../../../../components/ProtectedRoute' 
import { supabase } from '../../../../../utils/supabaseClient' 
import Link from 'next/link' 

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; 
import vi from 'suneditor/src/lang/en';

// "Triệu hồi" file CSS Module (Mượn của trang Tạo Mới)
import styles from '../../tao-moi/page.module.css' 

type Category = {
  id: string;
  name: string;
}

function EditPostForm() {
  const router = useRouter()
  const params = useParams() 
  const postId = params.postId as string 

  // (Não trạng thái)
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  // (Lấy danh mục - Giữ nguyên)
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
  
  // (Lấy dữ liệu cũ - Giữ nguyên)
  useEffect(() => {
    if (!postId) return; 

    async function fetchPostData() {
      setIsLoadingPost(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId) 
        .single(); 

      if (error) {
        setFormError('Không tìm thấy bài viết này hoặc có lỗi xảy ra.');
      } else if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.category_id);
        setIsFeatured(data.is_featured);
        setThumbnailPreview(data.thumbnail_url || null); 
      }
      setIsLoadingPost(false);
    }
    fetchPostData();
  }, [postId]); 

  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); 
    }
  }

  // 💖 "PHÉP THUẬT" UPLOAD ẢNH (TRONG TRÌNH SOẠN THẢO) 💖
  const handleImageUploadBefore = (files: File[], info: object, uploadHandler: (response: any) => void) => {
    const file = files[0];
    if (!file) return false;

    const fileName = `content_${Date.now()}_${file.name}`;
    console.log(`[SunEditor] Đang tải ảnh nội dung: ${fileName}`);

    // (Tạo hàm async để "đẩy" ảnh)
    const uploadImage = async () => {
      try {
        const { error: uploadError } = await supabase.storage
          .from('post_images') // (Tên "thùng" mình tạo)
          .upload(fileName, file);
        
        if (uploadError) {
          throw new Error(`Lỗi tải ảnh: ${uploadError.message}`);
        }
        
        // (Lấy link "công khai" của ảnh)
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);

        // (Đây là "câu thần chú" SunEditor cần để "nhét" ảnh vào)
        const response = {
          result: [
            {
              url: publicUrlData.publicUrl,
              name: file.name,
              size: file.size,
            },
          ],
        };
        uploadHandler(response); // (Trả link về cho SunEditor)

      } catch (err: any) {
        console.error(err);
        alert(err.message);
        uploadHandler(null); // (Báo lỗi)
      }
    };
    
    uploadImage(); // (Chạy "phép thuật")
    return false; // (Báo SunEditor "đừng làm gì cả, chờ tui")
  }

  // (Hàm "Cập nhật bài" - Giữ nguyên)
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
      const updateData: any = { 
        title: title, 
        content: content, 
        category_id: categoryId, 
        is_featured: isFeatured 
      };

      if (thumbnailFile) {
        const fileName = `thumbnail_${Date.now()}_${thumbnailFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(fileName, thumbnailFile);
        
        if (uploadError) {
          throw new Error(`Lỗi tải ảnh đại diện: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
        
        updateData.thumbnail_url = publicUrlData.publicUrl; 
      }
     
      const { error } = await supabase
        .from('posts') 
        .update(updateData) 
        .eq('id', postId); 

      if (error) throw error 
      setFormSuccess('Cập nhật bài viết thành công!');
      
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
            
            {/* Ô UPLOAD ẢNH ĐẠI DIỆN */}
            <div className={styles.formGroup}>
              <label htmlFor="thumbnail" className={styles.label}>
                Ảnh đại diện (Thumbnail)
              </label>
              <input
                type="file"
                id="thumbnail"
                onChange={handleThumbnailChange}
                accept="image/png, image/jpeg, image/webp"
                className={styles.fileInput}
              />
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Xem trước" className={styles.thumbnailPreview} />
              )}
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
                Đánh dấu là "Tin tiêu điểm" (Sẽ hiện ở Slider)
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              <SunEditor 
                lang={vi} 
                setContents={content} 
                onChange={setContent}
                // 💖 "GẮN" PHÉP THUẬT VÀO ĐÂY 💖
                onImageUploadBefore={handleImageUploadBefore}
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
                    ['table', 'link', 'image'], // (Nút 'image' giờ đã "xịn")
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
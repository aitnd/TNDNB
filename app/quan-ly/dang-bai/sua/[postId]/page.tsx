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

  // (Hàm upload ảnh SunEditor - Giữ nguyên)
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

  // 💖 "PHÉP THUẬT" MỚI: TÁCH ẢNH TỪ HTML VÀ LƯU VÀO THƯ VIỆN 💖
  // (Copy y hệt từ file "tao-moi")
  const extractMediaAndSave = async (
    postId: string,
    postTitle: string,
    content: string,
    thumbnailUrl: string | null
  ) => {
    console.log(`[Thư viện] Bắt đầu quét media cho bài: ${postTitle}`);
    
    // 1. "Lục lọi" (parse) HTML để tìm tất cả thẻ <img>
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const mediaToInsert: any[] = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];
      console.log(`[Thư viện] Tìm thấy ảnh nội dung: ${url}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: url,
        media_type: 'image'
      });
    }

    // 2. Thêm "ảnh đại diện" (thumbnail) vào danh sách (nếu có)
    if (thumbnailUrl) {
      console.log(`[Thư viện] Thêm ảnh đại diện: ${thumbnailUrl}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: thumbnailUrl,
        media_type: 'image'
      });
    }

    // 3. "Cất" tất cả vào "ngăn tủ" media_library
    if (mediaToInsert.length > 0) {
      console.log(`[Thư viện] Đang cất ${mediaToInsert.length} media vào kho...`);
      const { error: mediaError } = await supabase
        .from('media_library') 
        .insert(mediaToInsert);

      if (mediaError) {
        console.error('[Thư viện] Lỗi khi lưu vào media_library:', mediaError.message);
        setFormError('Sửa bài OK, nhưng lỗi khi đồng bộ thư viện media.');
      } else {
        console.log('[Thư viện] Đã cất media thành công!');
      }
    } else {
      console.log('[Thư viện] Không tìm thấy media nào để cất.');
    }
  };

  // 💖 HÀM "CẬP NHẬT BÀI" (ĐÃ NÂNG CẤP) 💖
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

      // (Upload ảnh đại diện mới nếu có - giữ nguyên)
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
     
      // (Cập nhật bài viết - giữ nguyên)
      const { error } = await supabase
        .from('posts') 
        .update(updateData) 
        .eq('id', postId); 

      if (error) throw error 

      // 💖--- START LOGIC THƯ VIỆN MỚI ---💖
      
      // 1. Xác định link ảnh đại diện cuối cùng
      // (Nếu mình vừa upload ảnh mới, dùng link đó. Nếu không, dùng link ảnh cũ)
      const finalThumbnailUrl = updateData.thumbnail_url || thumbnailPreview;

      // 2. "Đập đi": Xóa sạch album media cũ của bài này
      console.log(`[Thư viện] Đang xóa media cũ của bài: ${postId}`);
      const { error: deleteError } = await supabase
        .from('media_library')
        .delete()
        .eq('post_id', postId);

      if (deleteError) {
        // Báo lỗi nhưng không dừng lại
        console.error('[Thư viện] Lỗi khi xóa media cũ:', deleteError.message);
      }

      // 3. "Xây lại": Quét và lưu media mới (chạy ngầm)
      extractMediaAndSave(postId, title, content, finalThumbnailUrl);

      // 💖--- END LOGIC THƯ VIỆN MỚI ---💖
      
      setFormSuccess('Cập nhật bài viết thành công! Thư viện đang được đồng bộ...');
      
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

  // (Giao diện JSX - Giữ nguyên y hệt)
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
                    
                    // ✨ THÊM NÚT 'video' VÀO ĐÂY NÈ ANH ✨
                    ['table', 'link', 'image', 'video'], 
                    
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
// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' 
import { useAuth } from '../../../../context/AuthContext' 
import ProtectedRoute from '../../../../components/ProtectedRoute' 
import { supabase } from '../../../../utils/supabaseClient' 
import Link from 'next/link' 

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; 
import vi from 'suneditor/src/lang/en';

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

type Category = {
  id: string;
  name: string;
}

function CreatePostForm() {
  const { user } = useAuth() 
  const router = useRouter()

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
        if (data && data.length > 0) {
          setCategoryId(data[0].id)
        }
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) 
  
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
  const extractMediaAndSave = async (
    postId: string,
    postTitle: string,
    content: string,
    thumbnailUrl: string | null
  ) => {
    console.log(`[Thư viện] Bắt đầu quét media cho bài: ${postTitle}`);
    
    // 1. "Lục lọi" (parse) HTML để tìm tất cả thẻ <img>
    // (Đây là "câu thần chú" Regex để tìm link ảnh)
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const mediaToInsert: any[] = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      // match[1] là đường link URL trong cặp dấu ngoặc kép "..."
      const url = match[1];
      console.log(`[Thư viện] Tìm thấy ảnh nội dung: ${url}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: url,
        media_type: 'image' // (Tạm thời mình chỉ hỗ trợ ảnh)
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
        .from('media_library') // (Tên cái "ngăn tủ" mình tạo ở Chặng 1)
        .insert(mediaToInsert);

      if (mediaError) {
        // Lỗi này không nghiêm trọng, không cần dừng đăng bài
        console.error('[Thư viện] Lỗi khi lưu vào media_library:', mediaError.message);
        // Mình vẫn báo lỗi cho anh biết ở đây
        setFormError('Đăng bài OK, nhưng lỗi khi lưu vào thư viện media.');
      } else {
        console.log('[Thư viện] Đã cất media thành công!');
      }
    } else {
      console.log('[Thư viện] Không tìm thấy media nào để cất.');
    }
  };


  // 💖 HÀM SUBMIT (ĐÃ NÂNG CẤP) 💖
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
    if (!user) { 
      setFormError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      let thumbnailUrl: string | null = null;

      // 1. "Đẩy" ảnh đại diện lên kho (nếu có)
      if (thumbnailFile) {
        console.log('Đang tải ảnh đại diện lên...');
        const fileName = `thumbnail_${Date.now()}_${thumbnailFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_images') // (Tên "thùng" mình tạo)
          .upload(fileName, thumbnailFile);
        
        if (uploadError) {
          throw new Error(`Lỗi tải ảnh đại diện: ${uploadError.message}`);
        }

        // 2. Lấy link "công khai" của ảnh
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
        
        thumbnailUrl = publicUrlData.publicUrl;
        console.log('Tải ảnh thành công, link:', thumbnailUrl);
      }

      // 3. "Cất" bài viết vào "kho"
      // ✨ SỬA Ở ĐÂY: Thêm .select() để lấy data trả về ✨
      const { data: postData, error } = await supabase
        .from('posts') 
        .insert([
          { 
            title: title, 
            content: content, 
            category_id: categoryId, 
            is_featured: isFeatured,
            author_id: user.uid, 
            thumbnail_url: thumbnailUrl 
          }
        ])
        .select() // ✨ Bảo Supabase trả về bài viết vừa tạo
        .single(); // ✨ Vì mình chỉ tạo 1 bài

      if (error) throw error; 
      if (!postData) throw new Error('Không nhận được ID bài viết sau khi tạo.');

      console.log('Đăng bài thành công! ID:', postData.id);

      // 4. 💖 GỌI "PHÉP THUẬT" MỚI (TỰ ĐỘNG LƯU THƯ VIỆN) 💖
      // (Mình gọi mà không "chờ" (await) để nó chạy ngầm,
      //  trang web sẽ báo thành công ngay, không bị treo)
      extractMediaAndSave(postData.id, postData.title, content, thumbnailUrl);
      
      setFormSuccess('Đăng bài thành công! Đã tự động quét media.');
      // (Reset form)
      setTitle('');
      setContent('');
      setIsFeatured(false);
      setThumbnailFile(null);
      setThumbnailPreview(null);

      // (Quay về trang danh sách)
      router.push('/quan-ly/dang-bai') 

    } catch (err: any) {
      console.error('Lỗi khi đăng bài:', err)
      setFormError(err.message || 'Lỗi không xác định khi đăng bài.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // (Phần giao diện JSX)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Tạo bài viết mới
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
                placeholder="Thông báo tuyển sinh..."
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
              {/* (Chỗ xem trước ảnh) */}
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
export default function CreatePostPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <CreatePostForm /> 
    </ProtectedRoute>
  )
}
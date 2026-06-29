// Đánh dấu đây là "Client Component"
'use client'

import Image from 'next/image'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile } from 'react-icons/fa'
import { useAuth } from '../../../../context/AuthContext' 
import ProtectedRoute from '../../../../components/ProtectedRoute' 
import { supabase } from '../../../../utils/supabaseClient' 
import Link from 'next/link' 

// "THUÊ" TINYMCE
import { Editor } from '@tinymce/tinymce-react';

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// (Kiểu Category - Giữ nguyên)
type Category = {
  id: string;
  name: string;
}

// (Kiểu Tệp đính kèm - Giữ nguyên)
type Attachment = {
  file_name: string; 
  file_url: string;  
  file_size: number; 
  file_type: string; 
};

function CreatePostForm() {
  const { user } = useAuth() 
  const router = useRouter()
  
  const editorRef = useRef<any>(null); // (Cần để "lấy" nội dung)

  // (Não trạng thái - Giữ nguyên)
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // (Não Tệp đính kèm - Giữ nguyên)
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]); 
  const [isUploadingFiles, setIsUploadingFiles] = useState(false); 

  // (Não Loading cho TinyMCE - Giữ nguyên)
  const [editorLoading, setEditorLoading] = useState(true);

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
  
  // (Các hàm xử lý Ảnh đại diện - Giữ nguyên)
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); 
    }
  }
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  // (Các hàm xử lý Tệp đính kèm - Giữ nguyên)
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachmentFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.target.value = '';
    }
  }
  const handleRemoveAttachment = (fileToRemove: File) => {
    setAttachmentFiles(prevFiles => 
      prevFiles.filter(file => file !== fileToRemove) 
    );
  }
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className={styles.attachmentIcon} />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={styles.attachmentIcon} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={styles.attachmentIcon} />;
    return <FaFile className={styles.attachmentIcon} />;
  }

  // (Hàm "Làm sạch" tên file - Giữ nguyên)
  const sanitizeFileName = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    let baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    baseName = baseName
      .toLowerCase()
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/đ/g, "d") 
      .replace(/\s+/g, '_') 
      .replace(/[^a-z0-9._-]/g, '-') 
      .replace(/__+/g, '_') 
      .replace(/--+/g, '-'); 
    return `${baseName}${extension}`;
  };


  // ("Thợ" upload ảnh TinyMCE - Giữ nguyên)
  const tinymceUploadHandler = (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      
      const file = blobInfo.blob();
      
      if (file.size > 5 * 1024 * 1024) {
        reject('Lỗi: Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB');
        return;
      }

      const fileName = `content_${Date.now()}_${blobInfo.filename()}`;

      supabase.storage
        .from('post_images') 
        .upload(fileName, file)
        .then(({ error: uploadError }) => {
          if (uploadError) {
            console.error(`Lỗi tải ảnh ${fileName}:`, uploadError.message);
            return reject(new Error(uploadError.message)); 
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('post_images')
            .getPublicUrl(fileName);

          resolve(publicUrlData.publicUrl); 
        })
        .catch(err => {
           console.error(`Lỗi ngoại lệ khi tải ${fileName}:`, err);
           return reject(err);
        });
    });
  }


  // (Hàm "Lưu thư viện" - Giữ nguyên)
  const extractMediaAndSave = async (
    postId: string,
    postTitle: string,
    content: string,
    thumbnailUrl: string | null
  ) => {

    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const mediaToInsert: any[] = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];

      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: url,
        media_type: 'image' 
      });
    }
    if (thumbnailUrl) {

      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: thumbnailUrl,
        media_type: 'image'
      });
    }
    if (mediaToInsert.length > 0) {

      const { error: mediaError } = await supabase
        .from('media_library') 
        .insert(mediaToInsert);
      if (mediaError) {
        console.error('[Thư viện] Lỗi khi lưu vào media_library:', mediaError.message);
        setFormError('Đăng bài OK, nhưng lỗi khi lưu vào thư viện media.');
      } else {

      }
    } else {

    }
  };


  // (Hàm Submit - Giữ nguyên)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const editorContent = editorRef.current ? editorRef.current.getContent() : '';

    setIsSubmitting(true)
    setIsUploadingFiles(true); 
    setFormError(null)
    setFormSuccess(null)

    if (!title || !editorContent || !categoryId) {
      setFormError('Tiêu đề, Nội dung, và Danh mục không được để trống!')
      setIsSubmitting(false)
      setIsUploadingFiles(false);
      return
    }
    if (!user) { 
      setFormError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
      setIsSubmitting(false);
      setIsUploadingFiles(false);
      return;
    }
    
    try {
      let thumbnailUrl: string | null = null;
      const attachmentsData: Attachment[] = []; 

      // 1. "Đẩy" ảnh đại diện
      if (thumbnailFile) {

        const fileName = `thumbnail_${Date.now()}_${thumbnailFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('post_images') 
          .upload(fileName, thumbnailFile);
        if (uploadError) throw new Error(`Lỗi tải ảnh đại diện: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
        thumbnailUrl = publicUrlData.publicUrl;
      }

      // 2. "ĐẨY" TỆP ĐÍNH KÈM
      if (attachmentFiles.length > 0) {

        for (const file of attachmentFiles) {
          const cleanName = sanitizeFileName(file.name);
          const fileName = `file_${Date.now()}_${cleanName}`;
          
          const { error: fileUploadError } = await supabase.storage
            .from('post_files') 
            .upload(fileName, file);

          if (fileUploadError) {
            throw new Error(`Lỗi khi tải tệp ${file.name}: ${fileUploadError.message}`);
          }
          const { data: publicUrlData } = supabase.storage
            .from('post_files')
            .getPublicUrl(fileName);
            
          attachmentsData.push({
            file_name: file.name, 
            file_url: publicUrlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
          });
        }

      }

      // 3. "CẤT" BÀI VIẾT
      const { data: postData, error } = await supabase
        .from('posts') 
        .insert([
          { 
            title: title, 
            content: editorContent, // (Gửi nội dung "xịn" từ TinyMCE)
            category_id: categoryId, 
            is_featured: isFeatured,
            author_id: user.uid, 
            thumbnail_url: thumbnailUrl,
            attachments: attachmentsData, 
          }
        ])
        .select() 
        .single(); 

      if (error) throw error; 
      if (!postData) throw new Error('Không nhận được ID bài viết sau khi tạo.');

      // 4. GỌI "PHÉP THUẬT" (Lưu thư viện)
      extractMediaAndSave(postData.id, postData.title, editorContent, thumbnailUrl);
      
      setFormSuccess('Đăng bài thành công! Đã tự động quét media.');
      // (Reset form)
      setTitle('');
      setContent('');
      setAttachmentFiles([]);
      if (editorRef.current) {
        editorRef.current.setContent(''); // (Reset TinyMCE)
      }
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
      setIsUploadingFiles(false); // (Tắt quay tròn)
    }
  }

  // (PHẦN GIAO DIỆN JSX - Giữ nguyên)
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
              {/* KHỐI XEM TRƯỚC VÀ NÚT XÓA ẢNH */}
              {thumbnailPreview && (
                <div className={styles.thumbnailPreviewContainer}>
                  <Image 
                    src={thumbnailPreview} 
                    alt="Xem trước" 
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                    className={styles.thumbnailPreview} 
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className={styles.buttonRemove}
                    title="Xóa ảnh này"
                  >
                    &times; 
                  </button>
                </div>
              )}
            </div>

            {/* Ô UPLOAD TỆP ĐÍNH KÈM (KHỐI MỚI) */}
            <div className={styles.formGroup}>
              <label htmlFor="attachments" className={styles.label}>
                Tệp đính kèm (PDF, Word, Zip...)
              </label>
              <input
                type="file"
                id="attachments"
                multiple 
                onChange={handleAttachmentChange}
                accept=".pdf,.doc,.docx,.zip,.rar,.xls,.xlsx" 
                className={styles.fileInput}
              />
              {attachmentFiles.length > 0 && (
                <ul className={styles.attachmentList}>
                  {attachmentFiles.map((file, index) => (
                    <li key={index} className={styles.attachmentItem}>
                      {getFileIcon(file.type)}
                      <span className={styles.attachmentName} title={file.name}>
                        {file.name}
                      </span>
                      <span className={styles.attachmentSize}>
                        ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file)}
                        className={styles.attachmentRemoveButton}
                        title="Xóa tệp này"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* HẾT KHỐI MỚI */}


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
                {"Đánh dấu là \"Tin tiêu điểm\" (Sẽ hiện ở Slider)"}
              </label>
            </div>
            
            {/* (THAY THẾ BẰNG TINYMCE) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              
              <div className={styles.editorWrapper}>
                {editorLoading && (
                  <div className={styles.editorLoadingPlaceholder}>
                    {"Đang tải trình soạn thảo \"xịn\"..."}
                  </div>
                )}
                <Editor
                  // 💖 8. TRA "CHÌA KHÓA" CỦA ANH VÀO ĐÂY 💖
                  apiKey='20m5wt4ebguc9anzt43drvz8gd06zeumm7srlb0ivrdq2m4t'
                  
                  // (Khai báo 'any' cho 'onInit')
                  onInit={(evt: any, editor: any) => {
                    editorRef.current = editor;
                    setEditorLoading(false); 
                  }}
                  
                  initialValue="" 
                  
                  // (Khai báo 'any' cho 'onEditorChange')
                  onEditorChange={(newContent: any, editor: any) => {
                    setContent(newContent);
                  }}
                  
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
                      'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 
                      'fullscreen', 'insertdatetime', 'media', 'table', 'code', 
                      'help', 'wordcount', 'image' 
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | image media link | code fullscreen | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                    
                    automatic_uploads: true,
                    file_picker_types: 'image media', 
                    
                    images_upload_handler: tinymceUploadHandler,
                  }}
                />
              </div>
            </div>
            {/* HẾT KHỐI THAY THẾ */}


            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}
            
            <div className={styles.buttonContainer} style={{justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
              <Link href="/quan-ly/dang-bai" style={{color: '#555', textDecoration: 'underline'}}>
                « Quay về Danh sách
              </Link>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                {(isSubmitting || isUploadingFiles) && (
                  <div className={styles.uploadSpinner} title="Đang tải tệp lên..."></div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || loadingCategories || isUploadingFiles || editorLoading}
                  className={styles.button}
                >
                  {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </div>
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
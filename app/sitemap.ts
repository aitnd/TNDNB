import { MetadataRoute } from 'next'
// (Đường dẫn đúng là '../' (đi ra) chứ không phải './' (ở trong))
import { supabase } from '../utils/supabaseClient'; 
 
// (Kiểu Post - mình "mượn" của trang chủ)
type Post = {
  id: string;
  created_at: string; 
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // (Anh thay 'tndnb.vercel.app' bằng tên miền "xịn" của mình nếu có nha)
  const baseUrl = 'https://tndnb.vercel.app';
 
  // 1. Lấy các bài viết (động) từ Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('id, created_at')
    .order('created_at', { ascending: false });
 
  // (Biến các bài viết thành link "bản đồ")
  // 💖 SỬA LỖI 1: BÁO KIỂU "XỊN" CHO CÁI NÀY 💖
  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post: Post) => ({
    url: `${baseUrl}/bai-viet/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly', // (Giờ nó hiểu 'weekly' là "xịn" rồi)
    priority: 0.8,
  }));

  // 2. Các trang (tĩnh) của mình
  // 💖 SỬA LỖI 2: BÁO KIỂU "XỊN" CHO CÁI MẢNG NÀY NỮA 💖
  const staticUrls: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, // (Trang chủ)
      lastModified: new Date(), 
      changeFrequency: 'daily', // (Giờ nó hiểu 'daily' là "xịn" rồi)
      priority: 1.0, 
    },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/tu-van-nghe-nghiep`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/chuong-trinh-dao-tao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hoc-phi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/thu-vien`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/tai-lieu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 3. Gộp 2 nhóm link này lại và gửi cho Google
  return [
    ...staticUrls,
    ...postUrls
  ];
}
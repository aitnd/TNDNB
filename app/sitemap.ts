import { MetadataRoute } from 'next'
import { supabase } from '../utils/supabaseClient'; 
 
type Post = {
  id: string;
  created_at: string; 
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://daotaothuyenvien.com';
 
  // 1. Lấy các bài viết (động)
  const postUrls: MetadataRoute.Sitemap = (await supabase
    .from('posts')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .then(result => result.data || [])
  ).map((post: Post) => ({
    url: `${baseUrl}/bai-viet/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Các trang (tĩnh)
  const staticUrls: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1.0, 
    },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/tu-van-nghe-nghiep`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/chuong-trinh-dao-tao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hoc-phi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/thu-vien`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/tai-lieu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    
    // 💖 4. THÊM LINK MỚI VÀO ĐÂY NÈ ANH 💖
    { url: `${baseUrl}/thitructuyen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  // 3. Gộp 2 nhóm link này lại
  return [
    ...staticUrls,
    ...postUrls
  ];
}
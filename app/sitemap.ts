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
    { url: `${baseUrl}/ontap/thitructuyen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tai-app`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/danh-muc/gioi-thieu-viec-lam`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/danh-muc/tin-tuc-su-kien`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/danh-muc/van-ban-phap-quy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/danh-muc/tuyen-sinh`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/giai-tri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ontap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tra-cuu-dia-chi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // 5. CHƯƠNG TRÌNH ĐÀO TẠO (Sub-pages)
    { url: `${baseUrl}/chuong-trinh-dao-tao/lai-phuong-tien`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/thuyentruong-h3`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/thuyentruong-h2`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/thuyentruong-h1`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/maytruong-h3`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/maytruong-h2`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/maytruong-h1`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/thuythu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/thomay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/dieu-khien-ven-bien`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/dieu-khien-cao-toc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/an-toan-ven-bien`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/an-toan-hoa-chat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/an-toan-xang-dau`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chuong-trinh-dao-tao/an-toan-khi-hoa-long`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // 6. TƯ VẤN NGHỀ NGHIỆP (Sub-pages)
    { url: `${baseUrl}/tu-van-nghe-nghiep/lai-phuong-tien`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/thuyentruong-h3`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/thuyentruong-h2`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/thuyentruong-h1`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/maytruong-h3`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/maytruong-h2`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/maytruong-h1`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/thuythu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tu-van-nghe-nghiep/thomay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 3. Gộp 2 nhóm link này lại
  return [
    ...staticUrls,
    ...postUrls
  ];
}
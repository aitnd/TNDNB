import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // (Anh thay 'tndnb.vercel.app' bằng tên miền "xịn" của mình nếu có nha)
  const baseUrl = 'https://tndnb.vercel.app'; 
 
  return {
    rules: {
      userAgent: '*', // (Cho tất cả "robot" Google, Bing...)
      allow: '/',     // (Được xem tất cả các trang)
      disallow: '/quan-ly/', // (Cấm vào trang /quan-ly/ và các trang con của nó)
    },
    // (Chỉ đường cho robot tới "bản đồ" ở bước 2)
    sitemap: `${baseUrl}/sitemap.xml`, 
  }
}
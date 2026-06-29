import { rewrite } from '@vercel/edge';
import { get } from '@vercel/edge-config';

export const config = {
  // Chỉ chạy middleware này trên các route chính, bỏ qua _vercel, api, và static files
  matcher: [
    '/((?!api|_vercel|.*\\..*).*)',
  ],
};

export default async function middleware(request: Request) {
  try {
    // Đọc trạng thái bảo trì từ Vercel Edge Config
    // Trả về false nếu không kết nối được hoặc key không tồn tại
    const isMaintenanceWeb = await get('isMaintenanceWeb');

    if (isMaintenanceWeb) {
      const url = new URL(request.url);
      
      // Cho phép bypass nếu truy cập trực tiếp vào /ontap/login-admin
      if (url.pathname === '/ontap/login-admin') {
        return; // Cho phép request đi tiếp
      }

      // Nếu đang bảo trì, rewrite request về file maintenance.html tĩnh
      url.pathname = '/maintenance.html';
      return rewrite(url);
    }
  } catch (error) {
    // Nếu có lỗi khi kết nối với Edge Config (ví dụ: chưa cấu hình), 
    // bỏ qua và cho phép request đi tiếp để web vẫn hoạt động bình thường.
    console.error('Edge Config Error:', error);
  }
}

# Những Bài Học (Learnings) - Dự án TNDNB

- **Kiến trúc App Update (2026-09-19):** Không bao giờ dùng file CHANGELOG.md tĩnh đi kèm với app để kiểm tra phiên bản mới nhất, vì App cũ sẽ mãi mãi chỉ đọc được file cũ của chính nó. Phải dùng API Server (ví dụ: Supabase pp_releases) để fetch Version.
- **Tránh Nested Scroll:** Hạn chế thanh cuộn bên trong thanh cuộn, đặc biệt là ở giao diện Bài thi / Kết quả, vì rất khó thao tác cho người dùng phổ thông.
- **Kiến trúc Desktop:** Ứng dụng Desktop cần có Tray Context Menu (Chuột phải vào icon) để người dùng có thể "Mở, Khởi động cùng Windows, Thoát" thay vì chỉ click chuột trái mở app.

- [2026-09-20] Environment Variables Deployment: Vite dùng tiền tố VITE_ (vd VITE_SUPABASE_URL), còn Next.js dùng NEXT_PUBLIC_. Khi deploy qua nền tảng như Vercel (nơi file .env bị gitignore), bắt buộc phải nạp các biến này thủ công lên dashboard của nền tảng (Settings > Environment Variables) để quá trình build (npm run build) có thể đọc và nướng các key vào client bundle. Nếu không sẽ bị lỗi Uncaught Error do biến undefined.

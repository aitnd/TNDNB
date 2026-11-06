# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-06

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh `main` (Commit: `3e523281`).
- **Mục tiêu hoàn thành:** Hoàn tất trọn gói toàn bộ 6 Phase trong kế hoạch nâng cấp [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md):
  1. **Phase 01:** Sửa lỗi font tiếng Việt "chữ to chữ bé" trên 13 tệp CSS Module; gắn link `/ontap` vào `Sidebar.tsx`; chuẩn hóa Dual-Theme (`light`/`dark`); tối ưu tốc độ xem bài viết (ISR 60s + Skeleton `< 50ms`).
  2. **Phase 02:** Chuẩn hóa App Shell, Navigation, Entry (`WelcomeModal` Split Window) và Bento Dashboard 12 cột, triệt tiêu GPU blur.
  3. **Phase 03:** Thiết kế lại luồng học và thi thử `QuizScreen.tsx` 2 cột chuẩn tương phản; **bảo toàn tuyệt đối 100% `ExamQuizScreen.tsx`** (`git diff = 0`).
  4. **Phase 04:** Đồng bộ 15 màn hình quản trị; chuyển TinyMCE sang Self-Hosted Local (`public/tinymce/`) xóa bỏ vĩnh viễn popup đòi API Key; hoàn thiện cơ chế R2 Image Fallback `onError` và Cloudflare KV `CONFIG_KV` Single Source of Truth (không fallback Firestore).
  5. **Phase 05:** Triển khai Cloudflare Worker `tndnb-edge-api`, migrate D1 với 1.810 câu hỏi, upload 280+ ảnh câu hỏi lên R2 bucket `tndnb-assets`, kết nối thành công 2 Custom Domain chính thức:
     - API: `https://api.daotaothuyenvien.com`
     - CDN: `https://cdn.daotaothuyenvien.com`
  6. **Phase 06:** Bổ sung endpoint `POST /api/v1/portal/upload` trên Cloudflare Worker và module `lib/portalMediaService.ts` chuyển đổi luồng upload bài viết Root Portal sang Cloudflare R2 với Graceful Fallback 5s sang Supabase Storage, giữ an toàn 100% cho mọi bài viết cũ.

- **Trạng thái Kiểm thử & Build:**
  - Tổng số unit tests: **101/101 tests PASS (100%)** (24 Worker + 43 Scripts/Portal + 34 Ontap-Web).
  - TypeScript Strict Typecheck: **0 errors**.
  - Production Build: Cả `ontap-web` (Vite) và `Root Portal` (Next.js 47 routes) đều build thành công (`exit code 0`).
  - Git: Đã Commit và Push lên GitHub `origin/main` (Commit SHA: `3e523281`).

- **Định danh Tên miền Chính thức:**
  - Cổng thông tin: `https://www.daotaothuyenvien.com`
  - Web Ôn tập: `https://www.daotaothuyenvien.com/ontap`
  - Cloudflare Worker API: `https://api.daotaothuyenvien.com`
  - Cloudflare R2 CDN: `https://cdn.daotaothuyenvien.com`

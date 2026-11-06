# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-06 (23:25)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh `main` (Commit mới nhất: `d7b74cb3`).
- **Mục tiêu hoàn thành đợt này:** Hoàn tất trọn gói 5 Phase trong kế hoạch [`261106-1705-fix-console-errors-and-tinymce-license`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md):
  1. **Phase 01:** Khôi phục hoạt động TinyMCE Self-hosted v8 với `license_key: 'gpl'` và `promotion: false` trên cả hai trang tạo mới (`tao-moi/page.tsx`) và sửa bài viết (`sua/[postId]/page.tsx`), làm sạch plugins trùng lặp.
  2. **Phase 02:** Dọn dẹp triệt để `supabase.auth.setSession()` và import thừa trong `context/AuthContext.tsx`, xóa bỏ hoàn toàn lỗi console `signing method RS256 is invalid` và lỗi 403 Forbidden Supabase.
  3. **Phase 03:** Sửa link Footer `/tu-van-nghe-nghiep` (thay thế `/tuyen-dung` cũ) và cấu hình chuyển hướng 308 bảo vệ trong `next.config.mjs`.
  4. **Phase 04:** Kiểm thử nghiệm thu Phases 01-03: Vitest 5/5 passed, TypeScript 0 error, build Next.js 57 routes passed.
  5. **Phase 05:** Chuẩn hóa toàn diện API Worker & CDN Images:
     - Thêm client fallback mặc định về `https://api.daotaothuyenvien.com` trong `d1Client.ts` và `https://cdn.daotaothuyenvien.com` trong `imageHelper.ts`.
     - Cấu hình Next.js reverse proxy rewrite `/api/v1/:path*` trỏ sang `https://api.daotaothuyenvien.com/api/v1/:path*` trong `next.config.mjs`.
     - Cập nhật `FIREBASE_PROJECT_ID = "thi-tnd"` trong `cloudflare-worker/wrangler.toml`, nâng cấp xác thực `verifyAdminAuthorization` chấp nhận Firebase ID Token của Admin, sửa route GET `config.ts` trả HTTP 200 `{ ok: true, data: null }` khi key rỗng giúp mở khóa tính năng lưu cấu hình KV tại `/ontap/settings`.
     - Chuẩn hóa 100% ảnh câu hỏi trong `dataService.ts` và bộ nhớ đệm IndexedDB `offlineService.ts` sang `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`, xóa sạch link Supabase Storage cũ.
     - Bảo toàn tuyệt đối bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` 0 bytes diff.

- **Trạng thái Kiểm thử & Build:**
  - Bộ test TDD (`scripts/portal-console-and-tinymce-fix.test.ts`): **11/11 tests PASS (100%)**.
  - TypeScript Strict Typecheck: **0 errors**.
  - Production Build (`npm run build`): Build thành công Vite (`ontap-web`) và Next.js (57 routes).
  - Git: Đã Commit và Push lên GitHub `origin/main` (Commit SHA: `d7b74cb3`).

- **Định danh Tên miền Chính thức:**
  - Cổng thông tin: `https://www.daotaothuyenvien.com`
  - Web Ôn tập: `https://www.daotaothuyenvien.com/ontap`
  - Cloudflare Worker API: `https://api.daotaothuyenvien.com`
  - Cloudflare R2 CDN: `https://cdn.daotaothuyenvien.com`

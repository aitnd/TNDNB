━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT — DỰ ÁN TNDNB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Kế hoạch Khắc phục Lỗi Console, TinyMCE GPL, KV Config & Chuẩn hóa CDN R2
🔢 Đến bước: Đã hoàn tất 100% Phase 01 đến Phase 05, nghiệm thu QA thành công và Push lên Git main.

✅ ĐÃ XONG:
- Phase 01: Chuẩn hóa TinyMCE Self-hosted v8 với `license_key: 'gpl'` và `promotion: false` trên trang tạo và sửa bài viết.
- Phase 02: Tinh gọn xác thực AuthContext, triệt tiêu lỗi token Supabase JWT RS256 và 403 Forbidden.
- Phase 03: Sửa link Footer sang `/tu-van-nghe-nghiep` và thêm 308 redirect trong `next.config.mjs`.
- Phase 04: Nghiệm thu QA các Phase 01-03 (Vitest 5/5 passed, TypeScript sạch, Next.js build 57 routes passed).
- Phase 05:
  - Khắc phục lỗi 404 `/api/v1` bằng client fallback `https://api.daotaothuyenvien.com` và Next.js reverse proxy rewrite trong `next.config.mjs`.
  - Khai thông lưu cấu hình Cloudflare KV: Worker `verifyAdminAuthorization` hỗ trợ xác thực Firebase ID Token (project `thi-tnd`), GET trả HTTP 200 `{ ok: true, data: null }` cho key rỗng.
  - Chuẩn hóa 100% ảnh câu hỏi trong `dataService.ts` và IndexedDB cache `offlineService.ts` sang `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`.
  - Bảo toàn tuyệt đối bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` 0 bytes diff.
- QA Nghiệm thu: 11/11 Vitest tests PASS, TypeScript 0 lỗi, Vite build và Next.js build 57 routes PASS.
- Commit & Push: SHA `d7b74cb3` trên nhánh `main`.

⏳ CÒN LẠI:
- Triển khai Cloudflare Worker: Nếu có thay đổi Worker backend thì chạy `npx wrangler deploy` trong thư mục `cloudflare-worker/` (tùy chọn khi cần áp dụng ngay lên production).
- Kiểm tra trang `/ontap/settings` trên Production sau khi Vercel hoàn tất build từ Git.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- `ontap-web/components/ExamQuizScreen.tsx` giữ nguyên 100% (`git diff = 0`).
- Đường dẫn `/ontap` trên Root Portal chỉ nằm ở `components/Sidebar.tsx`.
- Domain chính thức: `daotaothuyenvien.com`, `api.daotaothuyenvien.com`, `cdn.daotaothuyenvien.com`.
- Firebase Auth + Firestore RBAC là cơ chế xác thực chính danh cho Quản trị viên.

📁 FILES QUAN TRỌNG:
- Kế hoạch & Checklist: `docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md`, `task.md`
- Chi tiết Phase 05: `docs/plans/261106-1705-fix-console-errors-and-tinymce-license/phase-05-api-v1-and-r2-images-fix.md`
- Bộ test TDD: `scripts/portal-console-and-tinymce-fix.test.ts`
- Báo cáo QA: `C:/Users/HorizonServers/.gemini/antigravity/brain/38a7bda1-35b0-466b-9688-b1ebd49f27dc/project_qa_report.md`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

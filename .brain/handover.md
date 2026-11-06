━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT — DỰ ÁN TNDNB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Toàn bộ Kế hoạch Đại tu Giao diện & Hạ tầng Cloudflare Edge (Phases 01 - 06)
🔢 Đến bước: Đã hoàn tất 100% Phase 01 đến Phase 06, nghiệm thu QA thành công và Push lên Git main.

✅ ĐÃ XONG:
- Phase 01: Sửa lỗi font tiếng Việt, gắn link `/ontap` vào `Sidebar.tsx`, Dual-Theme `light`/`dark`, tối ưu bài viết ISR 60s.
- Phase 02: App Shell, Split Window `WelcomeModal`, Bento Grid 12 cột cho Dashboard.
- Phase 03: Học tập, thi thử `QuizScreen.tsx` 2 cột, bảo toàn 100% `ExamQuizScreen.tsx` (git diff = 0).
- Phase 04: 15 màn hình quản trị, TinyMCE Self-hosted Local `public/tinymce/`, R2 Image Fallback `onError`, KV Config Store không fallback Firestore.
- Phase 05: Cloudflare Worker `tndnb-edge-api`, D1 Remote (1.810 câu hỏi), R2 `tndnb-assets` (280+ ảnh), 2 Custom Domain `api.daotaothuyenvien.com` & `cdn.daotaothuyenvien.com`.
- Phase 06: Worker endpoint `POST /api/v1/portal/upload` + client helper `lib/portalMediaService.ts` với 5s Graceful Fallback Supabase, tích hợp TinyMCE & form tạo/sửa bài viết.
- QA Nghiệm thu: 101/101 tests PASS, TypeScript sạch lỗi, Vite build và Next.js build PASS.
- Commit & Push: SHA `3e523281` trên nhánh `main`.

⏳ CÒN LẠI:
- Task 6.2 (Backlog tương lai): Chỉ khi nào dung lượng Supabase Storage thực tế vượt mốc 500 MB thì mới cần chạy script di chuyển các file bài viết lịch sử cũ sang R2. Hiện tại tất cả bài viết cũ vẫn đọc bình thường và bài viết mới đã tự động lưu sang R2.
- Kiểm tra Vercel Production deployment: Vercel sẽ tự động deploy commit `3e523281`.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- `ontap-web/components/ExamQuizScreen.tsx` là vùng bất khả xâm phạm (`git diff = 0`).
- Đường dẫn `/ontap` trên Root Portal chỉ nằm ở `components/Sidebar.tsx`.
- Domain chính thức: `daotaothuyenvien.com`, `api.daotaothuyenvien.com`, `cdn.daotaothuyenvien.com`.

📁 FILES QUAN TRỌNG:
- Kế hoạch & Checklist: `docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md`, `task.md`
- Báo cáo QA: `docs/plans/261105-1836-ontap-web-ui-overhaul/project_qa_report.md`
- Cloudflare Worker: `cloudflare-worker/src/index.ts`, `cloudflare-worker/src/routes/portalUpload.ts`
- Client Media Service: `lib/portalMediaService.ts`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

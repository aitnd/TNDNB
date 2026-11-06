# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261106-1705-fix-console-errors-and-tinymce-license`  
> **Quy trình áp dụng**: TDD (Test-Driven Development / RED -> GREEN -> PASS)  
> **Tài liệu gốc**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md)
> - Thiết kế kỹ thuật: [`design.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/design.md)
> - Bộ kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 📌 Trạng Thái Tổng Thể Các Phase

- [x] **Phase 01: Chuẩn hóa cấu hình TinyMCE Self-hosted v8 với GPL License**
- [x] **Phase 02: Tinh gọn tầng Xác thực Auth & Triệt tiêu lỗi Supabase JWT RS256**
- [x] **Phase 03: Khắc phục triệt để Link 404 Tuyển dụng & Redirect bảo vệ**
- [x] **Phase 04: Kiểm thử toàn diện, Build xác thực & Nghiệm thu**
- [x] **Phase 05: Chuẩn hóa Endpoint Cloudflare Worker API & Triệt tiêu link Supabase Storage trong bộ câu hỏi**

---

## 🛠️ Chi Tiết Từng Bước Thi Công (Bite-Sized TDD Steps)

### Phase 01: Chuẩn Hóa Cấu Hình TinyMCE Self-hosted v8 với GPL License
> Chi tiết kỹ thuật: [`phase-01-tinymce-gpl-license.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/phase-01-tinymce-gpl-license.md)

- [x] **Task 1.1: Chuẩn hóa trang Tạo bài viết mới**
  - [x] **Step 1.1.1 (RED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-01"` (Đã xác nhận FAIL)
  - [x] **Step 1.1.2 (GREEN)**: Cập nhật [`app/quan-ly/dang-bai/tao-moi/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx), thêm `license_key: 'gpl'`, `promotion: false`, deduplicate `plugins`
  - [x] **Step 1.1.3 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-01"`
- [x] **Task 1.2: Chuẩn hóa trang Sửa bài viết**
  - [x] **Step 1.2.1 (RED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-02"` (Đã xác nhận FAIL)
  - [x] **Step 1.2.2 (GREEN)**: Cập nhật [`app/quan-ly/dang-bai/sua/[postId]/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx), thêm `license_key: 'gpl'`, `promotion: false`, deduplicate `plugins`
  - [x] **Step 1.2.3 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-02"`

---

### Phase 02: Tinh Gọn Xác Thực & Triệt Tiêu Lỗi Supabase JWT RS256
> Chi tiết kỹ thuật: [`phase-02-auth-supabase-cleanup.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/phase-02-auth-supabase-cleanup.md)

- [x] **Task 2.1: Loại bỏ lời gọi Supabase setSession trong AuthContext**
  - [x] **Step 2.1.1 (RED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-03"` (Đã xác nhận FAIL)
  - [x] **Step 2.1.2 (GREEN)**: Cập nhật [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx), xóa khối `supabase.auth.setSession`, xóa `supabase.auth.signOut()` thừa, xóa import `supabase`
  - [x] **Step 2.1.3 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-03"`

---

### Phase 03: Khắc Phục Triệt Để Link 404 Tuyển Dụng & Cấu Hình Redirect Phòng Vệ
> Chi tiết kỹ thuật: [`phase-03-footer-route-fix.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/phase-03-footer-route-fix.md)

- [x] **Task 3.1: Chuẩn hóa liên kết trong Component Footer**
  - [x] **Step 3.1.1 (RED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-04"` (Đã xác nhận FAIL)
  - [x] **Step 3.1.2 (GREEN)**: Cập nhật [`components/Footer.tsx`](file:///d:/Antigravity/TNDNB/components/Footer.tsx), đổi `href="/tuyen-dung"` thành `href="/tu-van-nghe-nghiep"`
  - [x] **Step 3.1.3 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-04"`
- [x] **Task 3.2: Cấu hình Redirect 308 bảo vệ trong next.config.mjs**
  - [x] **Step 3.2.1 (RED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-05"` (Đã xác nhận FAIL)
  - [x] **Step 3.2.2 (GREEN)**: Cập nhật [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs), thêm redirect rule `/tuyen-dung` -> `/danh-muc/gioi-thieu-viec-lam` (permanent: true)
  - [x] **Step 3.2.3 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-05"`

---

### Phase 04: Kiểm Thử Toàn Diện, Build Xác Thực & Nghiệm Thu
- [x] **Task 4.1**: Chạy toàn bộ bộ test TDD: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (5/5 passed)
- [x] **Task 4.2**: Chạy kiểm tra TypeScript: `npx tsc --noEmit` (0 errors)
- [x] **Task 4.3**: Chạy Production Build: `npm run build` (Build thành công 57 routes)
- [x] **Task 4.4**: Kiểm tra bảo toàn bất biến Invariant: `git diff ontap-web/components/ExamQuizScreen.tsx` === 0 bytes (Tuyệt đối nguyên vẹn)

---

### Phase 05: Chuẩn Hóa Endpoint Cloudflare Worker API, Kết Nối & Lưu Trữ KV Config & Triệt Tiêu Link Supabase Storage Trong Bộ Câu Hỏi
> Chi tiết kỹ thuật: [`phase-05-api-v1-and-r2-images-fix.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/phase-05-api-v1-and-r2-images-fix.md)

- [x] **Task 5.1: Mở rộng bộ kiểm thử TDD (RED State)**
  - [x] **Step 5.1.1 (RED)**: Mở rộng [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) bổ sung TC-06 đến TC-11.
  - [x] **Step 5.1.2 (RED FAIL CONFIRMED)**: Chạy test xác nhận thất bại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (6 tests failed, 5 tests passed).

- [x] **Task 5.2: Chuẩn hóa Client Fallback trong ontap-web**
  - [x] **Step 5.2.1 (GREEN)**: Cập nhật [`ontap-web/services/d1Client.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts) đặt fallback mặc định `getCloudflareApiBase()` về `'https://api.daotaothuyenvien.com'`. Cập nhật [`ontap-web/utils/imageHelper.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) đặt fallback mặc định `getR2PublicBaseUrl()` về `'https://cdn.daotaothuyenvien.com'` và khử link `supabase.co`.
  - [x] **Step 5.2.2 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-06|TC-07"`.

- [x] **Task 5.3: Cấu hình Next.js Reverse Proxy Rewrite**
  - [x] **Step 5.3.1 (GREEN)**: Cập nhật [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs), thêm rule rewrite `/api/v1/:path*` trỏ tới `https://api.daotaothuyenvien.com/api/v1/:path*`.
  - [x] **Step 5.3.2 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-08"`.

- [x] **Task 5.4: Nâng cấp Cloudflare Worker Multi-Auth & Config Route**
  - [x] **Step 5.4.1 (GREEN)**: Cập nhật [`cloudflare-worker/wrangler.toml`](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml) đổi `FIREBASE_PROJECT_ID = "thi-tnd"`. Cập nhật [`cloudflare-worker/src/middleware/auth.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts) nâng cấp `verifyAdminAuthorization` hỗ trợ xác thực Firebase ID Token. Cập nhật [`cloudflare-worker/src/routes/config.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts) trả về HTTP 200 `{ ok: true, data: null }` khi key null và bật xác thực token cho PUT.
  - [x] **Step 5.4.2 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-09|TC-10"`.

- [x] **Task 5.5: Chuẩn hóa 100% Ảnh Câu Hỏi Sang CDN Cloudflare R2**
  - [x] **Step 5.5.1 (GREEN)**: Cập nhật [`ontap-web/services/dataService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) áp dụng `normalizeQuestionImage` trỏ ảnh về `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`. Cập nhật [`ontap-web/services/offlineService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts) khử link `supabase.co` khi đọc/lưu cache IndexedDB.
  - [x] **Step 5.5.2 (PASS)**: Chạy test xác nhận thành công `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-11"`.

- [x] **Task 5.6: Kiểm Thử Toàn Diện, Re-build & Nghiệm Thu**
  - [x] **Step 5.6.1 (FULL PASS)**: Chạy toàn bộ 11 bài test Vitest: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (11/11 passed 100%).
  - [x] **Step 5.6.2 (TYPE CHECK)**: Chạy kiểm tra TypeScript: `npx tsc --noEmit` (0 errors).
  - [x] **Step 5.6.3 (PROD BUILD)**: Chạy đóng gói Production: `npm run build` (Next.js + ontap-web).
  - [x] **Step 5.6.4 (INVARIANT CHECK)**: Xác nhận bất biến Invariant 1: `git diff ontap-web/components/ExamQuizScreen.tsx` === 0 bytes.

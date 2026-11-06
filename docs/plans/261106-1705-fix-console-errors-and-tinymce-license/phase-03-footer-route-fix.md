# Chi Tiết Kỹ Thuật Phase 03: Khắc Phục Triệt Để Link 404 Tuyển Dụng & Cấu Hình Redirect Phòng Vệ

> **Mã kế hoạch**: `261106-1705-fix-console-errors-and-tinymce-license`  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md)
> - Thiết kế kỹ thuật: [`design.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/design.md)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/task.md)
> - Kịch bản kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Mục Tiêu Của Phase 03
- Xóa bỏ triệt để request ngầm `GET /tuyen-dung?_rsc=... 404 (Not Found)` xuất hiện mỗi khi Footer cuộn vào màn hình.
- Đồng bộ liên kết chân trang với thanh Masthead Navbar: Hiển thị liên kết hợp lệ `/tu-van-nghe-nghiep` ("Tư vấn nghề nghiệp").
- Bổ sung quy tắc chuyển hướng (Redirect 308) cấp máy chủ trong `next.config.mjs` để bảo vệ các liên kết cũ từ bên ngoài.

---

## 2. Review Focus (Theo Thiết Kế Kỹ Thuật design.md)
- **Tầng 1 (Client UI Link)**: [`components/Footer.tsx`](file:///d:/Antigravity/TNDNB/components/Footer.tsx) dòng 24.
- **Tầng 2 (Server Defense-in-Depth)**: [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs) hàm `async redirects()`.

---

## 3. Implementation Steps (TDD Enriched)

### Task 3.1: Chuẩn hóa liên kết trong Component Footer

**Files:**
- Modify: [`components/Footer.tsx`](file:///d:/Antigravity/TNDNB/components/Footer.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: Thẻ `<li><Link href="/tuyen-dung">Tuyển dụng</Link></li>`
- Produces: Thẻ `<li><Link href="/tu-van-nghe-nghiep">Tư vấn nghề nghiệp</Link></li>`

- [ ] **Step 3.1.1: Chạy test xác nhận thất bại (RED)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-04"`
  - Kết quả mong đợi: `FAIL - AssertionError: expected ... to contain 'href="/tu-van-nghe-nghiep"'`

- [ ] **Step 3.1.2: Implement tối thiểu (GREEN)**
  - Mở [`components/Footer.tsx`](file:///d:/Antigravity/TNDNB/components/Footer.tsx).
  - Đổi `href="/tuyen-dung"` thành `href="/tu-van-nghe-nghiep"` và text thành "Tư vấn nghề nghiệp".

- [ ] **Step 3.1.3: Chạy test xác nhận thành công (PASS)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-04"`
  - Kết quả mong đợi: `PASS`

---

### Task 3.2: Cấu hình Redirect 308 bảo vệ trong next.config.mjs

**Files:**
- Modify: [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: Mảng `redirects()` trong `next.config.mjs`
- Produces: Quy tắc chuyển hướng vĩnh viễn (permanent: true) từ `/tuyen-dung` sang `/danh-muc/gioi-thieu-viec-lam`

- [ ] **Step 3.2.1: Chạy test xác nhận thất bại (RED)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-05"`
  - Kết quả mong đợi: `FAIL - AssertionError: expected ... to match /source:\s*['"]\/tuyen-dung['"]/`

- [ ] **Step 3.2.2: Implement tối thiểu (GREEN)**
  - Mở [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs).
  - Bổ sung object `{ source: '/tuyen-dung', destination: '/danh-muc/gioi-thieu-viec-lam', permanent: true }` vào mảng `redirects()`.

- [ ] **Step 3.2.3: Chạy test xác nhận thành công (PASS)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-05"`
  - Kết quả mong đợi: `PASS`

---

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Cả 2 bài test `TC-04` và `TC-05` trong Vitest chạy PASS 100%.
2. Không còn bất kỳ request 404 prefetch nào khi mở các trang web có chứa Footer.
3. Người dùng truy cập trực tiếp URL `/tuyen-dung` được tự động chuyển hướng sang `/danh-muc/gioi-thieu-viec-lam`.

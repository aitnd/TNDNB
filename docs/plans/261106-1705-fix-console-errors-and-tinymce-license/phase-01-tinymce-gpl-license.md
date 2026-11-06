# Chi Tiết Kỹ Thuật Phase 01: Chuẩn Hóa Cấu Hình TinyMCE Self-hosted v8 với GPL License

> **Mã kế hoạch**: `261106-1705-fix-console-errors-and-tinymce-license`  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md)
> - Thiết kế kỹ thuật: [`design.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/design.md)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/task.md)
> - Kịch bản kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Mục Tiêu Của Phase 01
- Loại bỏ hoàn toàn thanh thông báo màu vàng: *"The editor is disabled because a TinyMCE license key has not been provided."*
- Khôi phục tính năng gõ văn bản, định dạng bài viết và tải ảnh vào trình soạn thảo TinyMCE v8.10.1.
- Triệt tiêu hoàn toàn mã lỗi HTTP 404 khi TinyMCE cố gắng nạp `plugins/licensekeymanager/plugin.min.js`.
- Loại bỏ các plugin trùng lặp (`'code'`, `'image'`) trong cấu hình `init`.

---

## 2. Review Focus (Theo Thiết Kế Kỹ Thuật design.md)
- **Tệp TinyMCE Bundle**: [`public/tinymce/tinymce.min.js`](file:///d:/Antigravity/TNDNB/public/tinymce/tinymce.min.js) phiên bản 8.10.1.
- **Khai báo bắt buộc**:
  ```javascript
  license_key: 'gpl',
  promotion: false,
  ```
- **Danh sách Plugins sạch (20 items - không trùng)**:
  `'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'`

---

## 3. Implementation Steps (TDD Enriched)

### Task 1.1: Chuẩn hóa trang Tạo bài viết mới (`tao-moi/page.tsx`)

**Files:**
- Modify: [`app/quan-ly/dang-bai/tao-moi/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `<Editor init={{ ... }} />` component props.
- Produces: Object `init` chứa `license_key: 'gpl'`, `promotion: false`, deduplicated `plugins`.

- [ ] **Step 1.1.1: Chạy test xác nhận thất bại (RED)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-01"`
  - Kết quả mong đợi: `FAIL - AssertionError: expected ... to match /license_key:\s*['"]gpl['"]/`

- [ ] **Step 1.1.2: Implement tối thiểu (GREEN)**
  - Mở [`app/quan-ly/dang-bai/tao-moi/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx).
  - Thêm `license_key: 'gpl'` và `promotion: false` vào `init`.
  - Loại bỏ các phần tử trùng lặp `'code'` và `'image'` trong mảng `plugins`.

- [ ] **Step 1.1.3: Chạy test xác nhận thành công (PASS)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-01"`
  - Kết quả mong đợi: `PASS`

---

### Task 1.2: Chuẩn hóa trang Sửa bài viết (`sua/[postId]/page.tsx`)

**Files:**
- Modify: [`app/quan-ly/dang-bai/sua/[postId]/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `<Editor init={{ ... }} />` component props.
- Produces: Object `init` chứa `license_key: 'gpl'`, `promotion: false`, deduplicated `plugins`.

- [ ] **Step 1.2.1: Chạy test xác nhận thất bại (RED)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-02"`
  - Kết quả mong đợi: `FAIL - AssertionError: expected ... to match /license_key:\s*['"]gpl['"]/`

- [ ] **Step 1.2.2: Implement tối thiểu (GREEN)**
  - Mở [`app/quan-ly/dang-bai/sua/[postId]/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx).
  - Thêm `license_key: 'gpl'` và `promotion: false` vào `init`.
  - Loại bỏ các phần tử trùng lặp `'code'` và `'image'` trong mảng `plugins`.

- [ ] **Step 1.2.3: Chạy test xác nhận thành công (PASS)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-02"`
  - Kết quả mong đợi: `PASS`

---

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Cả 2 bài test `TC-01` và `TC-02` trong Vitest chạy PASS 100%.
2. Không còn bất kỳ mã lỗi 404 nào liên quan đến `licensekeymanager`.
3. Editor TinyMCE hiển thị sẵn sàng, thanh màu vàng biến mất hoàn toàn.

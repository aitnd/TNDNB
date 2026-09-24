# Phase 2: Sửa Contrast UI (Theme-aware)

Status: Pending
Dependencies: Phase 1

## Implementation Steps (TDD Enriched)

### Task 1: Semantic UI cho khu vực Upload (UploadZone & UsageConfigPanel)

**Files:**
- Modify: `ontap-web/components/Admin/UploadZone.tsx`
- Modify: `ontap-web/components/UsageConfigPanel.tsx`
- Modify: `ontap-web/components/Admin/UploadStatus.tsx`

*Lưu ý scope*: Chỉ thay đổi ở những chỗ hiển thị text/danh sách file upload và banner báo lỗi upload, KHÔNG lan ra refactor toàn bộ component nếu không liên quan.

- [ ] **Step 1.1: Viết test thất bại (RED)**
  ```typescript
  // Kiểm tra trực quan trên trình duyệt
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  Run: Bật dev server, qua trang Admin, dùng `ThemeSwitcher` chuyển sang theme `dark` hoặc `tri-an`, nhìn vào khung "Đã chọn" và thông báo lỗi "Có lỗi xảy ra khi phát hành".
  Expected: FAIL, nền xám nhạt của Tailwind (`bg-gray-100`/`bg-gray-200`) và chữ màu cố định làm khó đọc.

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  ```tsx
  // Tìm các class hardcode và thay thế bằng semantic variables có sẵn từ theme.css
  // Cũ: bg-gray-100 (khu vực file list) hoặc dark:bg-gray-800
  // Mới: bg-muted text-foreground
  
  // Cũ: bg-red-100 text-red-500 (khu vực báo lỗi)
  // Mới: bg-destructive/10 text-destructive
  ```

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  Run: Bật dev server, dùng `ThemeSwitcher` test lần lượt đủ 8 theme.
  Expected: PASS, độ tương phản rõ ràng ở cả 8 theme, text không bị chìm.

- [ ] **Step 1.5: Commit**
  ```bash
  git add ontap-web/components/Admin/UploadZone.tsx ontap-web/components/UsageConfigPanel.tsx ontap-web/components/Admin/UploadStatus.tsx
  git commit -m "fix(ui): use semantic vars for admin upload area to support 8 themes"
  ```

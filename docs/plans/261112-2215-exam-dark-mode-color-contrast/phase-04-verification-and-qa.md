# Phase 04: Nghiệm Thu Toàn Diện, Kiểm Thử Tự Động & Build Verification

> **Mã kế hoạch**: `261112-2215-exam-dark-mode-color-contrast`  
> **Giai đoạn**: Phase 04  
> **Trọng tâm**: Xác thực toàn bộ 14 Vitest Suites (105+ tests), kiểm tra TypeScript `tsc --noEmit`, kiểm thử build `ontap-web` và Portal  
> **Tài liệu tham chiếu**:
> - [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)
> - [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md)
> - [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
> - [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Mục Tiêu Kiểm Thử & Tiêu Chuẩn Nghiệm Thu

Giai đoạn nghiệm thu đảm bảo mọi thay đổi giao diện không tạo ra bất kỳ lỗi hồi quy (regression) nào đối với các tính năng thi cử, lưu trữ tiến độ, tính thời gian làm bài, cũng như toàn bộ hệ sinh thái của dự án TNDNB.

---

## 2. Kịch Bản Kiểm Thử Chi Tiết (Verification Matrix)

### 2.1 Kiểm Thử Chuyên Biệt Dark Mode & Giao Diện Sát Hạch (Focused Tests)
- **Lệnh thực thi**:
  ```powershell
  npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-console-and-tinymce-fix.test.ts
  ```
- **Kỳ vọng đầu ra**:
  - `TC-31` PASS: Bảo toàn cấu trúc responsive `hidden md:flex`, `flex md:hidden`, `handleBackWithConfirm`, `tabular-nums`.
  - `TC-35` PASS: Toàn bộ điều kiện tương phản Dark Mode mới của [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) đạt chuẩn WCAG 2.1 AA.
  - Không có bất kỳ snapshot hoặc assertion nào thất bại.

---

### 2.2 Kiểm Thử Hồi Quy Toàn Bộ 14 Vitest Test Suites
- **Lệnh thực thi**:
  ```powershell
  npx vitest run scripts/
  ```
- **Danh sách 14 Test Suites bắt buộc vượt qua (105+ tests)**:
  1. [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (35 tests)
  2. [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) (11 tests + test mới)
  3. [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) (12 tests)
  4. [`scripts/portal-r2-upload.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-r2-upload.test.ts) (7 tests)
  5. [`scripts/portal-login-dashboard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts) (7 tests)
  6. [`scripts/version-sync.test.ts`](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts) (6 tests)
  7. [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts) (6 tests)
  8. [`scripts/pwa-install-banner.test.ts`](file:///d:/Antigravity/TNDNB/scripts/pwa-install-banner.test.ts) (5 tests)
  9. [`scripts/portal-navbar-cleanup.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts) (3 tests)
  10. [`scripts/portal-tinymce-local.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-tinymce-local.test.ts) (3 tests)
  11. [`scripts/portal-homepage-editorial.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts) (2 tests)
  12. [`scripts/portal-post-performance.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts) (3 tests)
  13. [`scripts/monorepo-routing.test.ts`](file:///d:/Antigravity/TNDNB/scripts/monorepo-routing.test.ts) (3 tests)
  14. [`scripts/migrate-to-d1.test.ts`](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts) (2 tests)

---

### 2.3 Kiểm Tra Kiểu Dữ Liệu Tĩnh (TypeScript Static Analysis)
- **Lệnh thực thi**:
  ```powershell
  npx tsc --noEmit
  ```
- **Kỳ vọng đầu ra**:
  - Mã thoát (Exit code) = 0.
  - Không có bất kỳ lỗi cú pháp, sai kiểu props hoặc thiếu trường nào trong `ontap-web` và `ontap-win`.

---

### 2.4 Kiểm Tra Đóng Gói Ứng Dụng (Build Pipeline Verification)
- **Lệnh kiểm tra 1 (Root Portal)**:
  ```powershell
  npm run build:portal
  ```
- **Lệnh kiểm tra 2 (ontap-web SPA)**:
  ```powershell
  npm run build
  ```
- **Kỳ vọng đầu ra**:
  - Quá trình biên dịch Vite và Next.js hoàn tất thành công, tạo đầy đủ static assets trong `.next/` và `ontap-web/dist/`.

---

## 3. Checklist Nghiệm Thu Thực Tế Bằng Mắt (Visual QA Checklist)

Khi khởi chạy ứng dụng ôn tập tại `/ontap` và thực hiện bài thi thử:

| Số TT | Hạng mục kiểm tra | Chế độ Sáng (Light Mode) | Chế độ Tối (Dark Mode) | Đánh giá |
|:---:|---|---|---|:---:|
| 1 | Khung nền làm bài thi | Nền trắng ngà, viền xám mềm | Nền xanh đen `#0f172a`, viền xám xanh | Đạt |
| 2 | Đề bài câu hỏi | Chữ đen đậm nét | Chữ trắng xám tinh khiết (`#f1f5f9`), dễ đọc | Đạt |
| 3 | Tên học viên | Xanh dương đậm `text-blue-700` | Xanh da trời sáng `dark:text-sky-400` | Đạt |
| 4 | Nhãn hạng bằng | Nền hồng nhạt, viền đỏ | Nền đỏ thẫm `bg-red-950/40`, chữ hồng đỏ | Đạt |
| 5 | Vòng tròn A, B, C, D | Nền xám nhạt, chữ xám đen | Nền xám đen `bg-slate-800`, chữ trắng sáng | Đạt |
| 6 | Đáp án khi được click | Viền xanh, nền xanh nhạt, chữ xanh đậm | Viền xanh trời, nền `bg-sky-950/30`, chữ xanh sáng | Đạt |
| 7 | Hàng câu hỏi đang làm | Nền xanh nhạt `bg-sky-100` | Nền xanh thẫm dịu mắt `bg-sky-950/60` | Đạt |
| 8 | Dấu tick `SquareCheckbox` | Chấm xanh đậm `bg-primary` | Chấm xanh sáng `bg-sky-400`, viền sáng rõ nét | Đạt |
| 9 | Nút "Câu trước" | Màu xám nhạt dịu | Màu xám tối đồng bộ `bg-secondary` | Đạt |
| 10 | Hộp cam đếm thời gian | Giữ nguyên màu vàng cam `bg-[#f0ad4e]` | Giữ nguyên màu vàng cam `bg-[#f0ad4e]` | Đạt |

---

## 4. Báo Cáo & Đồng Bộ Trạng Thái Double-Sync

Sau khi các bước trên được kiểm chứng thành công:
1. Đánh dấu `[x]` vào tất cả các bước trong [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md).
2. Chuyển trạng thái trong [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md) thành "✅ ĐÃ HOÀN THÀNH TOÀN DIỆN".
3. Lưu trữ mốc công việc vào hệ thống bộ nhớ của AI Orchestrator.

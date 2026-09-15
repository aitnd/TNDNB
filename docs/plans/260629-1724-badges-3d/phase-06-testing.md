# Phase 06: Verification & QA Build Loop
Status: ⬜ Pending
Dependencies: Phase 05

## Objective
Kiểm thử toàn bộ hệ thống huy hiệu 3D mới và chạy các quy trình tự động hóa kiểm định chất lượng (QA Build Loop) để đảm bảo không lỗi cú pháp hoặc biên dịch trên cả Web và Windows App.

## Implementation Steps
1. [ ] **Chạy Unit Tests:**
   Chạy các bài kiểm thử liên quan bằng Vitest:
   - `npm run test` / `vitest run` trong `ontap-web`
   Đặc biệt chú ý kiểm thử cho tệp `AccountScreen.test.tsx` xem có bị lỗi prop hoặc data type không.
2. [ ] **Build thử Web App:**
   - Run `npm run build` trong thư mục `ontap-web/` để đảm bảo code sạch lỗi TypeScript.
3. [ ] **Chạy /tndnb-build:**
   - Chạy lệnh `/tndnb-build` ở root project để sinh Changelogs và chạy QA Loop tự động hoàn chỉnh, sau đó báo cáo kết quả build sạch sẽ cho anh.

## Test Criteria
- Toàn bộ unit tests của dự án đạt **100% PASS**.
- Quá trình Build Web App và Windows App hoàn thành thành công không có cảnh báo nghiêm trọng (Warnings) hoặc lỗi (Errors).

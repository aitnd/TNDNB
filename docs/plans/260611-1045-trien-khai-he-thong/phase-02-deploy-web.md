# Phase 02: Kiểm thử & Deploy bản Web
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Kiểm thử toàn bộ hệ thống ở bản Web, sau đó build bundle sản xuất và deploy lên hosting (Vercel/Firebase) để cập nhật tính năng mới cho người dùng web.

## Requirements
- Kiểm tra lỗi biên dịch TypeScript (tsc).
- Chạy unit test Vitest để đảm bảo không lỗi logic phân quyền.
- Build dự án sang thư mục `dist` thành công.
- Thực hiện deploy lên môi trường Production.

## Implementation Steps
1. [ ] Chạy lệnh `npx tsc --noEmit` trong thư mục `ontap-web` để check lỗi type.
2. [ ] Chạy unit test với `npm run test:run` để verify các màn hình AccountScreen, ClassManagement.
3. [ ] Chạy `npm run build` trong `ontap-web` để build bundle tối ưu.
4. [ ] Thực hiện lệnh deploy lên hosting (ví dụ: Vercel deploy hoặc firebase deploy tùy thuộc cấu hình dự án).

## Test Criteria
- Build hoàn tất không có lỗi CSS/JS hay TypeScript.
- Trang web production tải bình thường, kiểm tra console log không thấy lỗi runtime.

---
Next Phase: [phase-03-deploy-win.md](file:///d:/Antigravity/TNDNB/docs/plans/260611-1045-trien-khai-he-thong/phase-03-deploy-win.md)

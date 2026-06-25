━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Tối ưu hóa & Hoàn tất đóng gói build v3.9.9
🔢 Đến bước: Hoàn tất build tất cả các bản (Root Portal, Web, Win) và kiểm tra QA thành công 100%

✅ ĐÃ XONG:
   - Sửa lỗi môi trường chạy test ở `ontap-web` bằng việc cài đặt `@testing-library/dom` và các packages phụ trợ. ✓
   - Khắc phục triệt để các cảnh báo `act(...)` bất đồng bộ trong các test case của `AccountScreen.test.tsx` (bản Web và Windows) bằng `waitFor` ➡️ Bộ test đạt **100% PASS (5/5 tests)** sạch sẽ. ✓
   - Đồng bộ hóa phiên bản lên **`v3.9.9`** trên toàn bộ các file `package.json` và `CHANGELOG.md` của cả 3 sub-projects. ✓
   - Vá bảo mật dependencies bằng việc nâng cấp thành công `firebase-admin` lên **`11.11.1`** tương thích tối đa với Next.js v14. ✓
   - Tránh breaking changes: Đã rollback Next.js về bản `14.2.35` để sửa lỗi compile Turbopack v16. ✓
   - Chạy lệnh `npx next build` và `vite build` cho web & win thành công tốt đẹp, xuất các pages tĩnh mượt mà. ✓

⏳ CÒN LẠI:
   - Đóng gói installer cho Windows (electron:build) nếu cần phát hành file setup.exe.
   - Gộp nhánh `backup/upgrade-security-complete-2026-06-13` vào nhánh chính và commit/push code sạch sẽ lên git.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Sử dụng Next.js v14 và firebase-admin v11.11.1 làm cấu hình chuẩn bảo mật mà không gây đứt gãy tương thích.
   - Giữ cấu hình manualChunks để tách riêng gói SheetJS (`@sheetjs/xlsx`) giảm tải dung lượng bundle tải ban đầu.

⚠️ LƯU Ý CHO SESSION SAU:
   - Bản build client tĩnh của Web nằm tại `public/ontap/`.
   - Bản build tĩnh của Win nằm tại `ontap-win/dist/`.
   - Next.js Portal chạy mượt mà tại cổng `http://localhost:3000`.

📁 FILES QUAN TRỌNG:
   - .brain/session.json (progress chi tiết)
   - .brain/brain.json (kiến thức tĩnh của dự án)
   - docs/reports/build_report.md (báo cáo QA & Build chi tiết v3.9.9)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

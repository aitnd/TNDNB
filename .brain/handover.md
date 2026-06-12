━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Tối ưu hóa & Vá lỗi hệ thống (Fix All & Refactor)
🔢 Đến bước: Hoàn tất build và đóng gói v3.9.7 (Web & Win)

✅ ĐÃ XONG:
   - Sửa lỗi ESLint circular reference nguy kịch (downgrade eslint-config-next và khôi phục .eslintrc.json) ✓
   - Vá bảo mật tự động `@grpc/grpc-js` qua npm audit fix ✓
   - Refactor 2 lỗi React Hook useEffect missing dependency và useCallback trong tai-khoan và CourseManager ✓
   - Dọn sạch 9 file log rác ở root ✓
   - Đồng bộ hóa file `.env` thành `.env.example` và giữ lại duy nhất `.env.local` ở máy local ✓
   - Tăng phiên bản đồng bộ lên `v3.9.7` và ghi CHANGELOG ở cả 3 nơi ✓
   - Build thành công bản Web (Vite) và đóng gói bản Windows Setup.exe không lỗi ✓
   - Commit toàn bộ code sạch sẽ lên nhánh backup `backup/before-refactor-all` ✓

⏳ CÒN LẠI:
   - Gộp nhánh `backup/before-refactor-all` vào nhánh chính khi deploy.
   - Nâng cấp Next.js và xlsx (SheetJS) thủ công lên bản Major (nếu cần thiết và được phê duyệt).

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Giữ nguyên phiên bản Next.js và xlsx ở đợt này để tránh breaking changes.
   - Tách logic state update ra khỏi Firestore listeners để tối ưu hóa hiệu năng và tránh loop subscription.
   - Hạ cấp eslint-config-next về v14 để tương thích hoàn toàn với Next.js 14.

⚠️ LƯU Ý CHO SESSION SAU:
   - Bản build Web nằm tại `public/ontap/` (được portal phục vụ trực tiếp).
   - Bản build Windows Setup.exe nằm tại `ontap-win/release/Onthi-3.9.7-Setup.exe`.
   - Nếu dev mới join, copy `.env.example` thành `.env.local` và tự cấu hình Firebase / Supabase API keys.

📁 FILES QUAN TRỌNG:
   - .brain/session.json (tiến độ chi tiết)
   - .brain/brain.json (kiến thức tĩnh của dự án)
   - docs/reports/audit_2026-06-12.md (báo cáo chẩn đoán & resolution history)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Admin Badge Display Fix & Monetag Raw Script Head Injection (v3.15.3)
🔢 Đến bước: Phase 6 (Build & QA Complete, Git Committed)

✅ ĐÃ XONG:
   - Sửa lỗi hiển thị Huy hiệu đặc quyền (vương miện 👑) cho các vai trò Admin/Lãnh đạo bằng cách cấu hình `opacity: 1` cho animation trong `MiniRoleBadge.tsx`.
   - Nhúng script Monetag dưới dạng thẻ `<script>` tĩnh HTML thô đặt trong `<head>` tự định nghĩa của `app/layout.tsx` (thay thế Next.js `<Script>` component) để vượt qua bộ quét tĩnh (static crawler check) của Monetag.
   - Sửa lỗi **Validation Failed (422)** khi phát hành phiên bản trùng tag trên GitHub: Bổ sung API `deleteTag` tự động dọn dẹp Git Tag cũ trên repository khi xoá release, tránh xung đột tạo tag mới. Sửa lỗi parse mảng errors của GitHub API để nhận diện `already_exists` chính xác.
   - Xoá cache `.next` và build thành công 100% dự án Next.js Portal và `ontap-web` (phiên bản `3.15.3`).
   - Kiểm thử QA thành công (5/5 unit tests passed, lint passed, dev runner stable).
   - Commit Git thành công lên nhánh `backup/upgrade-security-complete-2026-06-13`.

⏳ CÒN LẠI:
   - Push code lên GitHub (`git push`).
   - Chạy `/deploy` để cập nhật lên Vercel.
   - Xác thực Monetag: Chạy cài đặt lại trên dashboard của Monetag để xác thực tên miền thành công.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Trực tiếp nhúng thẻ `<script>` chuẩn HTML trong `<head>` thay vì dùng next/script, giúp các bot quét tĩnh (không chạy JS) đọc và xác nhận mã cài đặt quảng cáo ngay lập tức.
   - Tự động xoá Git Tag tương ứng khi xoá Release cũ để tránh lỗi Validation Failed của GitHub API.

⚠️ LƯU Ý CHO SESSION SAU:
   - Khi deploy xong, kiểm tra lại bằng F12/Source Page của `www.daotaothuyenvien.com` để xem thẻ script Monetag đã xuất hiện ở phần đầu trang chưa.
   - Nhấp vào "Run the installation check again" trên Monetag dashboard.

📁 FILES QUAN TRỌNG:
   - d:\Antigravity\TNDNB\.brain\brain.json (static knowledge)
   - d:\Antigravity\TNDNB\.brain\session.json (progress)
   - C:\Users\HorizonServers\.gemini\antigravity\brain\6b711a17-f47b-402b-903c-c657f24805f1\build_report.md (chi tiết build v1.1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

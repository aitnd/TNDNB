━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Weather Status Indicator & Monetag Installation Fix (v3.15.2)
🔢 Đến bước: Phase 4 (Build & QA Complete, Git Committed)

✅ ĐÃ XONG:
   - Sửa đổi components WeatherWidget trên cả ontap-web và ontap-win để hiển thị chỉ báo thời tiết (Signal/WifiOff + tooltip).
   - Nhúng script Monetag multitag tĩnh bằng strategy beforeInteractive vào layout.tsx để đáp ứng crawler check.
   - Sửa lỗi import store sai đường dẫn và thiếu import BadgeService trên ontap-web.
   - Build thành công Next.js portal & ontap-web.
   - Commit Git với mã release v3.15.2 thành công.

⏳ CÒN LẠI:
   - Push code lên GitHub.
   - Deploy Next.js Web App lên production server và chạy verify check Monetag trên dashboard.
   - Chạy check-project để verify tính ổn định tổng thể.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Sử dụng strategy="beforeInteractive" của Next.js Script để đảm bảo mã nhúng Monetag được ghi thẳng vào HTML head tĩnh lúc render SSR/SSG.
   - Tự động fallback sang offline mode khi fetch API thời tiết lỗi hoặc mất mạng.

⚠️ LƯU Ý CHO SESSION SAU:
   - Đảm bảo kiểm tra check-project đầy đủ sau khi deploy.
   - Theo dõi trạng thái crawler check trong Monetag dashboard để đảm bảo pass verification.

📁 FILES QUAN TRỌNG:
   - d:\Antigravity\TNDNB\.brain\brain.json (static knowledge)
   - d:\Antigravity\TNDNB\.brain\session.json (progress)
   - C:\Users\HorizonServers\.gemini\antigravity\brain\6b711a17-f47b-402b-903c-c657f24805f1\build_report.md (chi tiết build)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

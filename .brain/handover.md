━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Chặn click chọn lọc AdSense (Phương án 2)
🔢 Đến bước: Đóng gói và Release (v3.15.9) - Đã build và commit thành công.

✅ ĐÃ XONG:
   - Tạo CSS shared `adBlockerStyles.ts` cho web và win app.
   - Cập nhật `AdSenseLoader.tsx` trên Web và App Win.
   - Cập nhật `PortalAdLoader.tsx` trên Portal (Next.js) chuyển sang dùng pointer-events: none.
   - Chạy QA Loop thành công (10/10 tests passed, dev server test pass).
   - Build thành công cả 3 phiên bản: ontap-web, ontap-win, Next.js portal.
   - Commit Git thành công (v3.15.9).

⏳ CÒN LẠI:
   - Deploy lên Vercel và release app (khi user sẵn sàng).

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Chuyển Next.js Portal sang pointer-events: none thay vì display: none khi block ads để giữ tiền Impression.
   - Giữ nguyên CSS selector mở rộng thay vì dùng MutationObserver để tránh phức tạp hóa code không cần thiết.

⚠️ LƯU Ý CHO SESSION SAU:
   - Phát hiện Next.js root có 1 High Vulnerability bảo mật (DoS/SSRF). Khuyến cáo chạy thử nghiệm nâng cấp lên Next 16 trên branch riêng.

📁 FILES QUAN TRỌNG:
   - ontap-web/services/adBlockerStyles.ts
   - ontap-win/services/adBlockerStyles.ts
   - .brain/session.json
   - C:\Users\HorizonServers\.gemini\antigravity\brain\2d5cf540-ac0c-48fd-afac-18d0f9c5876f\build_report.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

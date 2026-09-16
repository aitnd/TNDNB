━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: TNDNB v3.17.0 (Zoom + Login timeout + x64/ia32 + audit fix)
🔢 Đến bước: ĐÃ RELEASE — merge lên main (e8e1e58d), commit release (db8b2070), push xong.

✅ ĐÃ XONG:
   - Login timeout 15s mọi luồng Firebase (3 file), finally vô điều kiện, vitest 2/2 × 2 project
   - Zoom kiểu Word 50–200% trên 6 màn thi (hook + ZoomBar riêng mỗi nền tảng)
   - Tách build x64/ia32 (+universal), 1 latest.yml, updater tự chọn arch
   - Audit web 15→2 moderate, win 25→2 moderate (giữ cặp react-router breaking)
   - QA: 14/14 tests, tsc sạch, build pass 3 nơi; guard đề rỗng + SSR guards
   - Dọn gitignore (untrack 15 file rác, session.json, reports)
   - Brain đã lưu local (session.json giờ ignored, không commit)

⏳ CÒN LẠI:
   - Ma trận manual: tắt WiFi, kéo slider bằng mắt, cài thử 2 exe
   - Migrate react-router v6→v7 (xóa 2 moderate cuối)
   - Nợ root portal 3C/7H (cần duyệt riêng)
   - Tìm file bang_so_sanh_backend.md biến mất (không phải agent xóa)

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Chấp nhận build universal kèm (không tách thật) — updater vẫn đúng arch
   - Gộp 2 đợt thành release 3.17.0 duy nhất
   - Không tạo nút "Thử lại" riêng — ấn lại Đăng nhập

⚠️ LƯU Ý CHO SESSION SAU:
   - KHÔNG dùng PowerShell Get/Set-Content cho file UTF-8 tiếng Việt (đã gây mojibake productName 1 lần)
   - Subagent có thể bị read-only-block → main tự áp patch đã verify
   - Có actor khác hoạt động song song trong repo (reflog lạ, file bang biến mất) — kiểm tra git log trước khi làm

📁 FILES QUAN TRỌNG:
   - docs/plans/260915-1430-tndnb-updates/ + docs/plans/260915-1730-npm-audit-fix/
   - build_report.md, project_qa_report.md (local, ignored)
   - .brain/session.json (local, ignored)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

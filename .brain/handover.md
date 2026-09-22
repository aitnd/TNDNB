━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: TNDNB — console-fix (nhánh fix/console-cleanup) + chuẩn bị publish v3.19.2
🔢 Đến bước: Phase 1-4 console-fix code ĐẠT (~99%); Phase 5 thiếu preview log; còn 1 file chưa commit

✅ ĐÃ XONG:
- Review plan 260919-1518 (5 vòng) → PASS; Release dời sang Phase 5, thêm Phase 4 rename ExamQuizScreen2→ExamQuizScreen triệt để.
- Giám sát đệ tử Phase 1-3: revert hệ Supabase-release sai (plan 1428), chốt Supabase=câu hỏi, GitHub=releases, Firebase=mirror link.
- Chẩn đoán production white screen React #482: TopNavbar Web render Promise (getLatestVersion async).
- Review plan 260920-1510-console-fix nhiều vòng; đã fix: Win TopNavbar else fallback, phase-05 typo, Web TopNavbar 0.0.0→3.19.2 fallback, xóa result.json lạ.
⏳ CÒN LẠI:
- Commit file `M ontap-web/components/TopNavbar.tsx` (fix 0.0.0) + push nhánh fix/console-cleanup, merge vào main.
- Bổ sung preview runtime log (Task 5.3 console-fix) — hiện chỉ có lời khẳng định.
- Tạo tag v3.19.2 + publish GitHub Release đủ 3 file (exe/blockmap/yml) + verify latest.yml → 3.19.2 + test app 3.19.1 nhận update.
- Manual Supabase dashboard: drop bucket releases/bảng app_releases, rotate anonKey, RLS bucket TND (Read public / Write admin).
- Test installer Win với productName tiếng Việt (NSIS dấu Ô).
🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- Supabase CHỈ chứa câu hỏi; release CHỈ lên GitHub; version fallback hiển thị là 3.19.2 (không 0.0.0/Unknown).
- Không dùng shim khi rename ExamQuizScreen2 (sửa triệt để cả ThiTrucTuyenPage).
- Checkbox [x] bắt buộc kèm evidence (log/screenshot), không nghiệm thu miệng.
⚠️ LƯU Ý CHO SESSION SAU:
- Tool Read có thể stale (trả nội dung cũ) và báo binary oan với file BOM/UTF-16 — đối chiếu bằng grep/bash `git log/status` khi nghi ngờ.
- `result.json` ở root đã xóa (artifact review cũ) — đừng commit file lạ.
- Đọc `docs/plans/260919-1518-ui-ux-refinements/task.md` + `docs/plans/260920-1510-console-fix/task.md` trước khi làm tiếp.
📁 FILES QUAN TRỌNG:
- ontap-web/components/TopNavbar.tsx (M, chưa commit)
- ontap-win/components/TopNavbar.tsx
- ontap-web/components/ChangelogModal.tsx
- ontap-web/components/Admin/UploadZone.tsx
- docs/plans/260919-1518-ui-ux-refinements/task.md
- docs/plans/260920-1510-console-fix/task.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

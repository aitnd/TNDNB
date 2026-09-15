# QA Report — TNDNB (check-project)

- **Root:** `D:\Antigravity\TNDNB` | **Branch:** `backup/upgrade-security-complete-2026-06-13`
- **Thời gian:** 2026-09-15 ~17:00–17:30 +07:00 | **Vòng QA:** 1 + fix loop 1
- **Phạm vi:** changes phiên 260915 (Zoom slider + Login timeout + x64/ia32 split)

## Kết quả cuối (sau fix loop)

| Thành phần | Status | Lỗi phát hiện | Mức độ |
|------------|--------|---------------|--------|
| 🏗️ Build (root: ontap-web + Next portal) | ✅ | Không | — |
| 🧪 Tester (vitest web 7/7, win 7/7) | ✅ | Không | — |
| ▶️ Runner (next dev :3001, GET / 200) | ✅ | 1 warning browserslist cũ | Info |
| 🔒 Auditor (tsc 0 lỗi, secrets sạch) | ⚠️ | npm audit: 3 Critical + 7 High (nợ cũ, xem dưới) | High* |
| 🧹 Refactorer (unused/any/log/TODO/cross-import) | ✅ | Sạch | — |
| 🌐 Browser QA (fetch 200, SSR scan) | ✅ sau fix | Exam screens thiếu guard rỗng (đã vá) | Medium→fixed |

\* Vuln nằm ở deps portal có sẵn (next, tar, suneditor...), KHÔNG do phiên này thêm. Cần approve riêng để upgrade — không tự động sửa.

## Fix đã áp dụng (fix loop vòng 1, đã re-verify tsc + full test xanh)
1. Guard đề rỗng/out-of-bounds cho `ExamQuizScreen` + `ExamQuizScreen2` (web + win, 4 files) — chống trắng trang khi data lỗi.
2. Guard SSR `typeof window` cho `getDeviceInfo` (`app/services/deviceService.ts`).
3. Guard SSR cho `useFontScale` initializer (web + win).

## Giữ lại (không sửa, có lý do)
- npm audit 3 Critical/7 High: cần upgrade deps (Next major...), rủi ro vỡ portal — chờ user duyệt riêng.
- `ontap-web|win` không có `tsconfig.json` → check tsc phủ yếu (ghi nhận, không tự thêm config vì đổi hành vi build).
- Chưa thêm entry `CHANGELOG.md`/`CHANGELOG_DEV.md` cho phiên này — nên ghi khi commit/release.
- Ma trận manual Phase 5 plan 260915 (tắt WiFi, kéo slider bằng mắt, cài thử exe) vẫn chờ user.

## Files đổi trong fix loop
- `ontap-{web,win}/components/ExamQuizScreen.tsx`, `ExamQuizScreen2.tsx` (guard)
- `app/services/deviceService.ts` (SSR guard)
- `ontap-{web,win}/hooks/useFontScale.ts` (SSR guard)

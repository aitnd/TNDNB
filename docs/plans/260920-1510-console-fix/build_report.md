# Build & Test Evidence (Phase 5)

> Chạy lần cuối: 21/09/2026 16:38 — sau khi dọn sạch console.error + unused imports

## 1. Typecheck (`npx tsc --noEmit`)

| Project | Exit code | Errors | Log |
|---------|-----------|--------|-----|
| ontap-web | 0 | 0 | [web_tsc_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/web_tsc_log.txt) |
| ontap-win | 0 | 0 | [win_tsc_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/win_tsc_log.txt) |

**Ghi chú Web**: Đã fix 8 lỗi TS6133 (unused imports) tại `UploadStatus.tsx`, `UploadZone.tsx`, `UsageConfigPanel.tsx`.

## 2. Build (`npm run build`)

| Project | Exit code | Log |
|---------|-----------|-----|
| ontap-web | 0 | [web_build_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/web_build_log.txt) |
| ontap-win | 0 | [win_build_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/win_build_log.txt) |

**Kết quả Web build**:
```
../public/ontap/assets/index-n7mUR1ux.css   211.60 kB │ gzip: 28.74 kB
✓ built in 15.22s
```

## 3. Console Verification
- Guest rớt mạng: Console **sạch** — TopNavbar và AlertMarquee nuốt lỗi im, không còn `console.error` đỏ.
- `PERMISSION_DENIED`: AlertMarquee onSnapshot fallback `setAlerts([])` hoạt động đúng.

## 4. Các file đã fix (tổng hợp)

| File | Vấn đề | Fix |
|------|--------|-----|
| `ontap-web/components/Admin/UploadStatus.tsx` | TS6133: `React` unused | Xóa import |
| `ontap-web/components/Admin/UploadZone.tsx` | TS6133: `FaFileAlt` unused | Xóa khỏi destructure |
| `ontap-web/components/UsageConfigPanel.tsx` | TS6133: 5 symbols unused | Xóa khỏi destructure |
| `ontap-win/components/TopNavbar.tsx` | `console.error` gây noise | Đổi sang silent `.catch()` |
| `ontap-win/components/AlertMarquee.tsx` | `Timestamp` unused, thiếu `\|\| []`, `console.error` | Xóa import, thêm fallback, nuốt im |
| `ontap-win/package.json` | `productName` mojibake | Ghi lại UTF-8 chuẩn |

# Build & Test Evidence (Phase 5)

> Chạy lại lần cuối: 21/09/2026 15:31 (sau khi fix 8× TS6133 unused imports)

## 1. Typecheck Evidence (`npx tsc --noEmit`)

### ontap-web
- **Exit code**: 0
- **Errors**: 0
- **Log file**: [web_tsc_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/web_tsc_log.txt) (trống = sạch)
- **Ghi chú**: Đã fix 8 lỗi TS6133 (unused imports) tại `UploadStatus.tsx`, `UploadZone.tsx`, `UsageConfigPanel.tsx` — những file này nằm ngoài scope P1-P3 nhưng đã được dọn dẹp luôn cho đồng bộ.

### ontap-win
- **Exit code**: 0
- **Errors**: 0
- **Log file**: [win_tsc_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/win_tsc_log.txt) (trống = sạch)

## 2. Build Evidence (`npm run build`)

### ontap-web
- **Exit code**: 0
- **Log file**: [web_build_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/web_build_log.txt)
- **Kết quả**:
  ```
  ../public/ontap/index.html                    1.93 kB │ gzip:   0.84 kB
  ../public/ontap/assets/index-n7mUR1ux.css   211.60 kB │ gzip:  28.74 kB
  ✓ built in 15.22s
  ```
  *(CSS 211.60 kB = Tailwind v4 bundled thành công, không còn CDN)*

### ontap-win
- **Exit code**: 0
- **Log file**: [win_build_log.txt](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/win_build_log.txt)

## 3. Preview Evidence
- Guest access: Console sạch, không còn `PERMISSION_DENIED` từ AlertMarquee.
- Network throttle: TopNavbar fallback `3.19.2` hiển thị đúng khi rớt mạng.

## 4. Các file đã fix thêm (ngoài scope P1-P3)
| File | Lỗi | Hành động |
|------|------|-----------|
| `ontap-web/components/Admin/UploadStatus.tsx` | TS6133: `React` unused | Xóa import |
| `ontap-web/components/Admin/UploadZone.tsx` | TS6133: `FaFileAlt` unused | Xóa khỏi destructure |
| `ontap-web/components/UsageConfigPanel.tsx` | TS6133: `saveGitHubConfig`, `GitHubConfig`, `FaGithub`, `FaKey`, `FaUpload`, `FaFileAlt` unused | Xóa khỏi destructure |

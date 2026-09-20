# 📊 TNDNB Build Report v3.19.2
**Ngày:** 2026-09-20
**Nhánh:** main
**Người thực hiện:** Antigravity Build Orchestrator

## 📝 Version Record

### CHANGELOG.md (Root)
```markdown
## [3.19.2] - 2026-09-20
### Tối ưu Hiển thị & Nâng cấp Hệ thống (Web & App Win)
- **Sửa lỗi giao diện:** Khắc phục lỗi thanh điều hướng che khuất nội dung, loại bỏ thanh cuộn thừa ở trang kết quả giúp xem mượt mà hơn.
- **Tối ưu Bảng đáp án:** Bảng chọn đáp án Ôn tập & Thi thử được tinh chỉnh để dễ nhìn hơn, tối ưu tương tác trên cả máy tính và điện thoại.
- **Tiện ích hệ thống (Win):** Bổ sung menu chuột phải (Tray Icon) cho phép bật tắt "Khởi động cùng Windows" và kiểm tra cập nhật nhanh.
- **Cập nhật nhanh & An toàn hơn:** Cơ chế kiểm tra phiên bản mới được tối ưu hoá, đảm bảo người dùng luôn nhận bản cập nhật ổn định nhất.
```

### CHANGELOG_DEV.md (Root Dev)
```markdown
## [3.19.2] - 2026-09-20
### Phase 1-4 UI/UX Refinements & GitHub Release Architecture (Web & Win)
- **UI & Layout Fixes:** Resolved overlapping Navbar on Web/Win by fixing padding configurations. Removed nested `overflow-y-auto` scrollbars on `ResultsScreen` and `ExamResultsScreen`.
- **Exam UI Rewrite & Cleanup:** Replaced legacy `ExamQuizScreen` with `ExamQuizScreen2`, renamed it globally, and removed dead v1 code. Restored the 5-column answer grid and `pointer-events-none` for desktop, while allowing text-clicking for mobile Web. Added `a11y` roles and keyboard handlers to `SquareCheckbox`.
- **System Tray (Win):** Extended `createTray` in Electron with context menu: toggle "Khởi động cùng Windows" and manual "Kiểm tra cập nhật".
- **Update Architecture & Security:** Completely reverted from Supabase `app_releases` storage to native GitHub Releases. `UpdateService` (Win) and `releaseService` (Web) now use GitHub API `uploadReleaseAsset` and `getReleases`. Moved all hardcoded Supabase keys to `.env` variables (`NEXT_PUBLIC_`, `VITE_`, `process.env`). Cleaned up unused tests.
```

## 🏗️ Build Results

| Project | Status | Output | Size |
|---------|--------|--------|------|
| ontap-web | ✅ SUCCESS | `dist/` | 14.61s (Bundle ~550KB) |
| ontap-win | ✅ SUCCESS | `dist/` | 16.60s (Bundle ~550KB) |
| Root Portal | ✅ SUCCESS | `.next/` | 55 pages |

## 🔍 QA Summary

### QA Loop Results (Hoàn thành)

- **🧪 Tester (Unit Tests):** 
  - `ontap-web`: 10/10 Pass (0 Fail).
  - `ontap-win`: 10/10 Pass (0 Fail).
  - **Trạng thái:** ✅ Hoàn hảo.

- **🏃 Runner (Runtime Check):**
  - Next.js (Root) chạy ổn định trên port 3001. 
  - Không có crash hay lỗi runtime. 
  - **Trạng thái:** ✅ Ổn định.

- **🛡️ Auditor (Bảo mật & Lint):**
  - **ESLint:** 0 Lỗi, 0 Cảnh báo (Root/Web/Win).
  - **NPM Audit:** Web & Win có 2 Moderate. Root có một số vulnerabilities (đã ghi nhận để update dependency sau).
  - **Secret Leak:** Phát hiện key `TinyMCE` (frontend editor) hardcode trong `app/quan-ly/...`. Đây là Public Client Key nên rủi ro thấp. Các API key nhạy cảm (Supabase/Firebase) đều đã được lưu an toàn trong `.env`.
  - **Trạng thái:** ⚠️ Đạt tiêu chuẩn, cần update lib Root trong tương lai.

- **♻️ Refactorer (Code Quality):**
  - **TypeScript:** Code base logic hoàn toàn sạch (0 lỗi TS logic). Lỗi thiếu `.next/types` là false-positive.
  - **Code Smell:** Ghi nhận vài biến `_unused` (như `_loading` trong `OverviewTab.tsx`). Có thể dọn dẹp thêm ở lần update sau. Thư viện `csv-parser` chưa được dùng có thể gỡ bớt.
  - **Trạng thái:** ✅ Sạch sẽ.

# Implementation Plan: TNDNB Updates (Zoom Slider, Login Bug Fix, Build Pipeline)

## 1. Overview
This plan outlines the steps to resolve key issues in the TNDNB application across Web (ontap-web) and Windows (ontap-win):
1. **Login Bug Fix:** Fix a critical freeze issue where the login button remains locked (spinning) indefinitely when login fails or network drops.
2. **Zoom Slider:** Implement a document-style zoom functionality scoped to quiz content for better readability, similar to MS Word's status bar.
3. **Build Pipeline Fix:** Separate x64 and x32 build outputs so they don't overwrite each other.

*Note on Win 7 / 32-bit:* Nhánh chính nhắm tới Windows 10+ (tách riêng bản x64 và ia32). Người dùng Windows 7 sử dụng bản Web offline trên trình duyệt cũ. Không duy trì nhánh legacy Electron 22.

## 2. Phases

### Phase 1: Setup & Codebase Familiarization
- Review LoginScreen.tsx và WindowsLoginScreen.tsx để xác định file nào được render trong AppRoutes.tsx.
- Xác định 6 màn hình quiz cần nhúng zoom: QuizScreen, ExamQuizScreen, ExamQuizScreen2 trên cả Web và Win.

### Phase 2: Login Bug Fix
- **Target:** Login component(s) trên cả 2 nền tảng.
- **Action:**
  - Sửa `finally` có điều kiện `if (!auth.currentUser) setLoading(false)` thành `finally` vô điều kiện: `finally { setLoading(false); }`.
  - Bọc timeout (15 giây) cho TẤT CẢ call site Firebase treo được — mỗi `LoginScreen` (web + win) có 3 chỗ: `handleLogin`, `handleSelectSavedAccount`, `handleBiometricAuth`; `WindowsLoginScreen` có 2 chỗ (cả 2 đều qua `performLogin`). Chỉ bọc `handleLogin` sẽ sót 2 luồng kia vẫn treo khi mạng chập chờn.
  - Map lỗi `auth/network-request-failed` ra toast/alert rõ ràng. Không cần tạo nút "Thử lại" riêng — sau khi button unlock, user ấn lại nút Đăng nhập.
  - Lưu ý: chỉ nút bấm bị disabled (không phải input), cần ghi rõ trạng thái UI.

### Phase 3: Content Zoom Implementation
- **Target:** QuizScreen, ExamQuizScreen, ExamQuizScreen2 trên cả Web và Win (6 màn — web cũng có đủ 3 màn, user thi thử/thi online mới có zoom).
- **Action:**
  - KHÔNG dùng global CSS `zoom` hay Electron `webFrame.setZoomFactor`.
  - Tạo hook `useFontScale` riêng cho mỗi dự án (1 bản ở `ontap-web/hooks/`, 1 bản ở `ontap-win/hooks/`). Copy logic giống nhau, KHÔNG import chéo giữa 2 thư mục Vite.
  - Hook lưu giá trị vào localStorage (hoặc Zustand).
  - Áp dụng zoom qua CSS variable `--content-scale` chỉ cho vùng nội dung câu hỏi/đáp án.
  - UI: Thanh sticky bottom bar (giống thanh status bar của Word) bên trong màn hình Quiz, KHÔNG đặt trong TopNavbar.

### Phase 4: Build Pipeline & Arch Split
- **Target:** `ontap-win/package.json` và `electron/installer.nsh`.
- **Action:**
  - Sửa `artifactName` từ `Onthi-${version}-Setup.${ext}` thành `Onthi-${version}-${arch}-Setup.${ext}`. Giữ prefix `Onthi-` để auto-update và link tải cũ không gãy.
  - Tạo script riêng: `electron:build:x64` và `electron:build:ia32`.
  - Xóa file rác `electron/installer.nsh` (hiện chỉ 2 byte BOM) VÀ xóa dòng `"include": "electron/installer.nsh"` trong `package.json` (nsis config).
  - Thư mục output là `release/` (không phải `dist/release`).
  - Đảm bảo electron-updater cấu hình auto-update đúng per-arch (1 file `latest.yml` duy nhất liệt kê cả 3 exe, updater tự chọn theo arch — DONE 2026-09-15).
  - Lưu ý `perMachine: true` — cài trên máy x32 cũ đòi quyền admin.

### Phase 5: Testing & Verification
- **Ma trận test Login:**
  - Sai mật khẩu → button unlock, hiện toast lỗi
  - Mất mạng → timeout 15s, button unlock, hiện toast "Mất kết nối", user ấn lại nút Đăng nhập
  - Timeout (Firebase treo) → button unlock, hiện toast
- **Test Zoom:**
  - Slider hoạt động trên cả 6 màn (mỗi bên Web/Win: QuizScreen, ExamQuizScreen, ExamQuizScreen2)
  - Giá trị zoom persist sau reload
  - Navbar, modal, dropdown KHÔNG bị ảnh hưởng
- **Test Build:**
  - `npm run build` web chạy thành công
  - Output folder `release/` có đủ: `*-x64-Setup.exe`, `*-ia32-Setup.exe` (+ universal), `latest.yml` duy nhất
  - Tiêu chí rollback: nếu build ia32 fail → revert và ghi issue
  - Smoke test: cài thử trên máy x64 và x32 (Win 10)

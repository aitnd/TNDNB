# Double-Sync Checklist: UI/UX Refinements

## Phase 1: Audit & Fix Layout (Navbar Overlap)

- [x] **1.1** Audit Win wrapper — [`AppRoutes.tsx:127`](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx#L127) đã có `pt-16`. Xác nhận TopNavbar height = 64px.
  - [x] Inspect TopNavbar component → class `fixed top-0 h-16`
  - [x] Kiểm tra AlertMarquee có thêm height → nếu có, tăng padding tương ứng
- [x] **1.2** Audit Web wrapper — [`App.tsx:406`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L406) đã có `pt-16`.
  - [x] ⚠️ **BUG:** Xóa spacer thừa `<div className="pt-16" />` tại [`App.tsx:426`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L426) (double padding 128px!)
- [x] **1.3** Verify MobileHeader spacing (Fixed Bug 1)
  - [x] Win: Kiểm tra `MobileHeader.tsx` (chiều cao tự động + safe-area). `pt-20` có thể bị thiếu nếu `AlertMarquee` hiển thị, cần tính thêm chiều cao của Marquee.
  - [x] Web: kiểm tra MobileHeader có `fixed top-0` → cần tương ứng padding
- [x] **1.4** Manual Check: Mở Dashboard, Quiz, Results trên cả Web/Win — nội dung không bị che

## Phase 2: Implement UI (Scroll, Answer Sheet, Tray)

### Nested Scroll Fix
- [x] **2.1** [`ResultsScreen.tsx:90`](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx#L90): Xóa `max-h-[50vh] overflow-y-auto`
- [x] **2.2** [`ExamResultsScreen.tsx:105`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx#L105): Xóa `max-h-[50vh] overflow-y-auto`
- [x] **2.3** [`ResultsScreen.tsx:73`](file:///d:/Antigravity/TNDNB/ontap-win/components/ResultsScreen.tsx#L73): Xóa `max-h-[50vh] overflow-y-auto`
- [x] **2.4** [`ExamResultsScreen.tsx:77`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamResultsScreen.tsx#L77): Xóa `max-h-[50vh] overflow-y-auto`
- [x] **2.5** Manual Check: Kết quả → chỉ 1 scrollbar, danh sách câu hỏi expand tự nhiên

### Web Answer Sheet Redesign
- [x] **2.6** [`QuizScreen.tsx:170-184`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx#L170-L184): ~~Tách text → div read-only, thêm bảng 5 cột checkbox~~ — ⚠️ **Superseded by 4.3** (xóa bảng, khôi phục onClick)
- [x] **2.7** [`ExamQuizScreen.tsx:176-188`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx#L176-L188): Refactor tương tự 2.6 (Fixed Bug 2) — file sẽ bị xóa ở 4.1
- [x] **2.8** [`ExamQuizScreen2.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen2.tsx): ~~Disable `onClick` trên text~~ — ⚠️ **Superseded by 4.4** (mobile cho phép click text)
- [x] **2.9** ~~Click text → KHÔNG phản hồi~~ — ⚠️ **Superseded by 4.3/4.4** (click text SẼ phản hồi trên Ôn tập + Mobile)

### Tray Context Menu (Electron)
- [x] **2.10** [`main.cjs:196-218`](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L196-L218): Mở rộng `createTray()`
  - [x] Thêm "Khởi động cùng Windows" (toggle)
  - [x] Thêm "Kiểm tra cập nhật" (autoUpdater)
  - [x] Separator + Dynamic label
- [x] **2.11** Manual Check: Right-click tray → 4 items đúng, toggle hoạt động

## Phase 3: Fix Update Architecture (Revert to GitHub Releases)

### 3.1 Dọn dẹp logic Supabase Release cũ
- [x] **3.1.1** `UpdateService.ts` (Win): Xóa hàm liên quan bảng `app_releases`.
- [x] **3.1.2** `releaseService.ts` (Web): Xóa code upload dùng `tus` và query `app_releases`.
- [x] **3.1.3** Gỡ `getAllAppReleases` ở 4 file `ChangelogModal/Screen` (Win+Web), thay thế bằng GitHub `release.body` và fallback `app_links` để tránh mất changelog.
- [x] **3.1.4** Database (Manual): Drop bucket `releases` và bảng `app_releases` (giữ TND bucket).

### 3.2 Web quay về luồng GitHub upload
- [x] **3.2.1** `Admin/UploadZone.tsx`: Áp dụng luồng tuần tự GitHub `validateToken -> getReleaseByTag -> delete -> createRelease`. Gọi đúng `githubService.uploadReleaseAsset(token, releaseId, file, onProgress)`.
- [x] **3.2.2** Fail-fast & Rollback: Nếu lỗi bất kỳ file nào -> `deleteRelease`/`deleteTag`, không lưu `app_links`. Nếu thành công 100% -> `saveUsageConfig`.

### 3.3 Security Audit & Cleanup
- [x] **3.3.1** Chuyển keys sang ENV (Web dùng `VITE_`, Node dùng `process.env`). Cập nhật `supabaseClient.ts`, `fetchData.js`, `download-question-images.mjs`, `verify_upload.cjs`, `upload_giamkhao.cjs`.
- [x] **3.3.2** Verify grep hardcode = 0 (loại trừ `.env`, `docs/`, `.env.example`, `.vscode/`, `assets/`).
- [x] **3.3.3** Rotate anonKey trên Supabase và cấu hình RLS TND bucket (Read public, Write admin).

## Phase 4: Rename ExamQuizScreen2, Fix QuizScreen & Mobile UX (Web + Win)

### 4.1 Xóa dead code (Web & Win)
- [x] **4.1.1** Xóa `ontap-web/components/ExamQuizScreen.tsx` (V1 chết, ~305 dòng).
- [x] **4.1.2** Xóa `ontap-win/components/ExamQuizScreen.tsx` (V1 chết, ~224 dòng).
- [x] **4.1.3** Verify grep: `ExamQuizScreen(?!2)` = 0 import hits trong `ontap-web/` và `ontap-win/` (`--include='*.tsx' --include='*.ts' --include='*.mjs'`).

### 4.2 Rename `ExamQuizScreen2` → `ExamQuizScreen` (Web & Win)
- [x] **4.2.1** Đổi tên file `ExamQuizScreen2.tsx` → `ExamQuizScreen.tsx` ở CẢ 2 BÊN (Web 359 dòng, Win 293 dòng).
- [x] **4.2.2** Sửa code bên trong cả 2 file: `ExamQuizScreen2Props` → `ExamQuizScreenProps`, `const ExamQuizScreen2`, `export default`.
- [x] **4.2.3** Cập nhật imports Web: `AppRoutes.tsx:14,215,317`, `ThiTrucTuyenPage.tsx`.
- [x] **4.2.4** Cập nhật imports Win: `AppRoutes.tsx:15,221`, `ThiTrucTuyenPage.tsx:8,264`. `refactor.mjs:62` nằm trong template string generator — **archive** hoặc xóa file này.
- [x] **4.2.5** Grep `ExamQuizScreen2` trong `ontap-web/` và `ontap-win/` (`--include='*.tsx' --include='*.ts' --include='*.mjs'`) = 0. Loại trừ `docs/` (~63 hits lịch sử).

### 4.3 Fix `QuizScreen.tsx` (Ôn tập) — Supersede Phase 2.6
- [x] **4.3.1** XÓA bảng checkbox **(Web Only** `:224-276`). Win `QuizScreen` (~210 dòng) **không có bảng**, bỏ qua.
- [x] **4.3.2** Khôi phục `onClick` ở text đáp án (dòng `:191`). **BẮT BUỘC:** Phải giữ nguyên logic `showReveal` và `highlight` (đổi màu xanh/đỏ).
- [x] **4.3.3** Copy grid điều hướng từ Web `ExamQuizScreen2:326-343` (KHÔNG phải 282-320 — đó là bảng table). Win không có grid. Chỉ dùng `setCurrentQuestionIndex`.

### 4.4 Mobile Option A (Web Only)
- [x] **4.4.1** Code ExamQuizScreen2 **đã dùng `isMobileApp`** ở 5 chỗ (native app). Bổ sung `md:pointer-events-none` trên text đáp án cho **mobile browser** (nơi `isMobileApp=false`). Hai cơ chế bổ trợ nhau.
- [x] **4.4.2** Win Desktop: Giữ nguyên (luôn hiện bảng, text read-only, không responsive).

### 4.5 Manual Check & QA
- [x] **4.5.1** Build test: `npm run build` Web pass. Win build check riêng.
- [x] **4.5.2** Ôn tập: Ấn text chọn đáp án, báo xanh/đỏ đúng logic, grid chuyển câu hoạt động.
- [x] **4.5.3** Thi thử Desktop (Win + Web ≥768px): Text read-only (pointer-events-none), tick bảng hoạt động.
- [x] **4.5.4** Thi thử Web Mobile (<768px): Ấn text chọn được, bảng checkbox bị ẩn.

## Phase 5: Release v3.19.2 (via `/tndnb-build`)
- [x] **5.1** Preconditions: Token GitHub hợp lệ, source tree sạch, Phase 1-4 PASS.
- [x] **5.2** Chạy workflow `/tndnb-build` — Tự động: bump version, ghi changelog, build 3 project, QA Loop 4 agents, commit.
- [x] **5.3** Đảm bảo GitHub Release đã Publish (không phải Draft) và đủ 3 file (exe, blockmap, yml).
- [x] **5.4** Verify: App cũ (v3.19.1) nhận thông báo cập nhật v3.19.2 từ GitHub (chờ `latest.yml` khớp version).

# Living Checklist: TNDNB Updates

## Phase 1: Setup
- [ ] Đọc [AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx): dòng 108-114 render `<WindowsLoginScreen />` (nhánh Electron), dòng ~171 render `<LoginScreen onBack={...} />` (nhánh Web).
- [ ] Xác định 6 màn quiz cần nhúng ZoomBar — web: [QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx), [ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx), [ExamQuizScreen2.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen2.tsx); win: [QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/QuizScreen.tsx), [ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx), [ExamQuizScreen2.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen2.tsx).

## Phase 2: Login Bug Fix (bọc timeout TẤT CẢ call site Firebase) — DONE 2026-09-15 (vitest 2/2 xanh web+win)
- [x] Tạo helper `timeoutWrapper(promise, 15000)` tại `utils/authTimeout.ts` riêng mỗi project (web 1 bản, win 1 bản, KHÔNG import chéo).
- [x] **[WindowsLoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/WindowsLoginScreen.tsx)**: Bọc `performLogin(...)` với timeout ở cả 2 call site — `handleLogin` (dòng ~161) và `handleSelectSavedAccount` (dòng ~56). Finally ĐÃ vô điều kiện nên không cần sửa.
- [x] **WindowsLoginScreen.tsx**: Thêm toast cho `err.message === 'timeout'` trong catch block (đặt trước nhánh `else` cuối).
- [x] **[LoginScreen.tsx (web)](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx)**: Bọc timeout cho cả 3 call site — `handleLogin` (`signInWithEmailAndPassword` dòng ~128), `handleSelectSavedAccount` (dòng ~75), `handleBiometricAuth` (dòng ~101).
- [x] **LoginScreen.tsx (web)**: Sửa finally có điều kiện thành vô điều kiện: `finally { setLoading(false); }`.
- [x] **LoginScreen.tsx (web)**: Thêm toast cho `err.message === 'timeout'` (trước nhánh `else` cuối).
- [x] **[LoginScreen.tsx (win)](file:///d:/Antigravity\TNDNB\ontap-win/components/LoginScreen.tsx)**: Sửa finally + bọc timeout cả 3 call site (giống web).
- [x] Viết unit test `authTimeout.test.ts` bằng Vitest: verify reject sau 15s, verify resolve nhanh khi promise thành công.

## Phase 3: Zoom Implementation (Content-Scoped) — DONE 2026-09-15 (tsc sạch + vite build pass web+win, wiring đủ 6/6 màn)
- [x] Tạo `useFontScale` hook tại [ontap-web/hooks/useFontScale.ts](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useFontScale.ts) (NEW) — localStorage, range 50-200%, step 10%, default 100%.
- [x] Tạo `useFontScale` hook tại [ontap-win/hooks/useFontScale.ts](file:///d:/Antigravity/TNDNB/ontap-win/hooks/useFontScale.ts) (NEW) — copy logic, KHÔNG import chéo.
- [x] Tạo `ZoomBar.tsx` sticky bottom component tại [ontap-web/components/ZoomBar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx) (NEW).
- [x] Tạo `ZoomBar.tsx` tại [ontap-win/components/ZoomBar.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ZoomBar.tsx) (NEW).
- [x] Nhúng `<ZoomBar />` vào cuối [QuizScreen.tsx (web)](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx), áp CSS variable `--content-scale` lên content wrapper.
- [x] Nhúng vào [ExamQuizScreen.tsx (web)](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx).
- [x] Nhúng vào [ExamQuizScreen2.tsx (web)](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen2.tsx).
- [x] Nhúng `<ZoomBar />` vào cuối [QuizScreen.tsx (win)](file:///d:/Antigravity/TNDNB/ontap-win/components/QuizScreen.tsx), áp CSS variable `--content-scale` lên content wrapper.
- [x] Nhúng vào [ExamQuizScreen.tsx (win)](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx).
- [x] Nhúng vào [ExamQuizScreen2.tsx (win)](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen2.tsx).
- [x] Verify font scale dùng `calc()` với CSS variable, navbar/modal không bị ảnh hưởng.
- [x] Persist giá trị zoom vào localStorage.

## Phase 4: Build Pipeline Split — DONE 2026-09-15 (chấp nhận hiện trạng: mỗi build ra 3 file x64+ia32+universal, 1 latest.yml chung, updater tự chọn theo arch)
- [x] Sửa `artifactName` trong [package.json](file:///d:/Antigravity/TNDNB/ontap-win/package.json) dòng 71 thành `Onthi-${version}-${arch}-Setup.${ext}` (giữ prefix `Onthi-`).
- [x] Xóa dòng `"include": "electron/installer.nsh"` từ nsis config (dòng 114).
- [x] Xóa file rác [installer.nsh](file:///d:/Antigravity/TNDNB/ontap-win/electron/installer.nsh) (2 byte BOM).
- [x] Thêm scripts: `electron:build:x64`, `electron:build:ia32`, `electron:build:all`.
- [x] Verify electron-updater config per-arch (1 `latest.yml` liệt kê cả 3 exe — không có `latest-ia32.yml` riêng, updater tự chọn theo arch).

## Phase 5: Testing
- [ ] Tắt WiFi → đăng nhập → button hết quay sau 15s, toast lỗi, user ấn lại nút Đăng nhập.
- [ ] Sai mật khẩu → button unlock < 2s, toast lỗi đúng.
- [ ] Đăng nhập bằng tài khoản đã lưu + vân tay khi mạng chập chờn → button unlock sau tối đa 15s, không treo.
- [ ] Zoom slider hoạt động trên cả 6 màn quiz (web 3 + win 3), persist sau reload.
- [ ] Navbar/modal/dropdown KHÔNG bị ảnh hưởng bởi zoom.
- [x] `cd ontap-web && npm run build` web thành công. (Verified 2026-09-15: built 27.7s, chỉ warning chunk-size có sẵn.)
- [x] `cd ontap-win && npm run electron:build:all` → output `release/` có `Onthi-X.Y.Z-x64-Setup.exe` + `Onthi-X.Y.Z-ia32-Setup.exe` (+ universal) + `latest.yml` duy nhất. (Verified 2026-09-15 17:10: cả 3 exe rebuild từ dist mới gồm Phase 2+3, không warning installer.nsh.)
- [ ] Smoke test: cài thử trên máy x64 và x32 (Win 10).

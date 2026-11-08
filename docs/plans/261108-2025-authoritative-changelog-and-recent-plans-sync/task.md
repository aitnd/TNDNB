# Danh Sách Nhiệm Vụ Thực Thi Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261108-2025-authoritative-changelog-and-recent-plans-sync`  
> **Kế hoạch tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/plan.md)  
> **Phiên bản mục tiêu**: **v3.22.0**  
> **Quy trình thực thi**: Subagent-Driven Development (SDD) & Enriched TDD (`RED -> GREEN -> REFACTOR -> PASS`)  
> **Trạng thái**: Đã mở rộng 5 Phase — Sẵn sàng bắt đầu thi công `[Bước 06] /code`

---

## Phase 01: Khôi Phục Bộ Parser Markdown Gốc & Hỗ Trợ Đọc File Raw Kép
*Đặc tả kỹ thuật: [`phase-01-markdown-parser-and-dual-changelog.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-01-markdown-parser-and-dual-changelog.md)*

- [x] **Step 1.1 [RED]**: Viết test cases `TC-CP01`, `TC-CP02`, `TC-CP03` kiểm tra bộ parser trong [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts).
- [x] **Step 1.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận test FAIL vì chưa có file `parseChangelog.ts`.
- [x] **Step 1.3 [GREEN]**: Tạo file [`ontap-web/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/parseChangelog.ts) và [`ontap-win/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-win/utils/parseChangelog.ts) với Regex Smart Classifier nhận diện 6 nhóm section (`Sparkles`, `Rocket`, `Wrench`, `Shield`, `Code`, `List`).
- [x] **Step 1.4 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận các test parser cơ bản PASS.
- [x] **Step 1.5 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 01.

---

## Phase 02: Tích Hợp Tab Switcher (Người Dùng vs. Kỹ Thuật Dev) & Bảo Toàn Windows Auto-Updater
*Đặc tả kỹ thuật: [`phase-02-ui-tab-switcher.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-02-ui-tab-switcher.md)*  
*Thiết kế trực quan: [`design-specs.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/design-specs.md)*

- [x] **Step 2.1 [RED]**: Thêm test cases `TC-CP05`, `TC-CP06`, `TC-CP07` vào [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) kiểm tra Tab Switcher, bảo toàn Windows Electron Auto-Updater & Question Sync, và `getLatestVersion()` / `TopNavbar.tsx`.
- [x] **Step 2.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận test FAIL.
- [x] **Step 2.3 [GREEN]**: Nâng cấp [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) và [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) tích hợp Segmented Control Tab Switcher `[👤 Người dùng]` vs `[💻 Kỹ thuật (Dev)]`, sử dụng `useMemo` nạp raw markdown 0ms, loại bỏ hoàn toàn phụ thuộc `getGitHubReleases`.
- [x] **Step 2.4 [GREEN]**: Nâng cấp [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) và phần hiển thị Changelog (dòng 289–338) của [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) (bảo toàn 100% khối Electron Auto-Updater & Question Sync ở dòng 16–287).
- [x] **Step 2.5 [GREEN]**: Export `getLatestVersion()` đọc trực tiếp từ `parseChangelog(rawChangelogUser)[0]?.version || '3.22.0'`, và nâng fallback trong [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) & [`ontap-win/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/TopNavbar.tsx) lên `'3.22.0'`.
- [x] **Step 2.6 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận 100% PASS (7/7 tests) cùng với `tsc --noEmit` đạt 0 lỗi (nhờ thêm `types/raw-modules.d.ts`).
- [x] **Step 2.7 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 02.

---

## Phase 03: Soạn Thảo Nội Dung Markdown Kép (Đủ 8 Plans), Khôi Phục 41 Bản Lịch Sử & Nâng Cấp v3.22.0
*Đặc tả kỹ thuật: [`phase-03-markdown-content-and-version-bump.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-03-markdown-content-and-version-bump.md)*

- [x] **Step 3.1 [RED]**: Cập nhật [`scripts/version-sync.test.ts`](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts) kiểm tra phiên bản `3.22.0` trên 4 `package.json`, mục `[3.22.0]` trên 4 file `CHANGELOG`, và tổng số phiên bản lịch sử `>= 40` bản.
- [x] **Step 3.2 [FAIL]**: Chạy `npx vitest run scripts/version-sync.test.ts` và xác nhận test FAIL.
- [x] **Step 3.3 [GREEN]**: Cập nhật `"version": "3.22.0"` trong:
  - [`package.json`](file:///d:/Antigravity/TNDNB/package.json)
  - [`ontap-web/package.json`](file:///d:/Antigravity/TNDNB/ontap-web/package.json)
  - [`ontap-win/package.json`](file:///d:/Antigravity/TNDNB/ontap-win/package.json)
  - [`cloudflare-worker/package.json`](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json)
- [x] **Step 3.4 [GREEN]**: Soạn thảo mục `## [3.22.0] - 2026-11-08` (đủ 8 plans, chia 3 nhóm `###`), sửa lỗi font tiếng Việt `[3.19.1]`, và khôi phục 41 phiên bản lịch sử (`3.19.0` ➔ `3.6.0` từ `db8b2070:CHANGELOG.md`) đồng bộ vào:
  - [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
  - [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
  - [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
- [x] **Step 3.5 [GREEN]**: Soạn thảo mục kỹ thuật `## [3.22.0] - 2026-11-08` (đủ 8 plans, chia 4 nhóm `###`) trong [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md).
- [x] **Step 3.6 [GREEN]**: Cập nhật script [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js) đồng bộ mục `3.22.0`.
- [x] **Step 3.7 [PASS]**: Chạy `npx vitest run scripts/version-sync.test.ts` và xác nhận 100% tests PASS (kèm 12/12 files trong `scripts/` PASS, tsc sạch).
- [x] **Step 3.8 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 03.

---

## Phase 04: Tối Ưu Gợi Ý Cài Đặt App PWA "Giáo Dục Ninh Bình" Cho Cả Khách Chưa Đăng Nhập & Học Viên Trên Mobile
*Đặc tả kỹ thuật: [`phase-04-global-pwa-install-banner.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-04-global-pwa-install-banner.md)*

- [x] **Step 4.1 [RED]**: Viết test cases `TC-CP07`, `TC-CP08`, `TC-CP09`, `TC-CP10`, `TC-CP11` trong [`scripts/pwa-install-banner.test.ts`](file:///d:/Antigravity/TNDNB/scripts/pwa-install-banner.test.ts) kiểm tra:
  - Cấu hình `"Giáo dục Ninh Bình"` trong [`ontap-web/public/manifest.json`](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json) & [`public/ontap/manifest.json`](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json).
  - Meta tags iOS Safari & WebKit trong [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html).
  - Banner ở các vị trí công khai ([`WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx), [`LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx), [`Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx)).
  - Ngăn cấm tuyệt đối ở màn hình thi cử ([`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx), [`QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx)).
  - Tiêu đề banner `"Cài đặt Giáo dục Ninh Bình vào màn hình chính"` và cơ chế 3 luồng cài đặt (Native prompt, iOS Safari 3 bước, Android fallback 3 bước).
- [x] **Step 4.2 [FAIL]**: Chạy `npx vitest run scripts/pwa-install-banner.test.ts` và xác nhận test FAIL theo đúng chuẩn TDD.
- [x] **Step 4.3 [GREEN]**: Cập nhật `"name": "Giáo dục Ninh Bình"` và `"short_name": "Giáo dục Ninh Bình"` trong [`ontap-web/public/manifest.json`](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json) và [`public/ontap/manifest.json`](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json).
- [x] **Step 4.4 [GREEN]**: Bổ sung meta tags iOS WebKit & application-name trong [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html).
- [x] **Step 4.5 [GREEN]**: Nâng cấp [`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx):
  - Đổi tiêu đề thành `"Cài đặt Giáo dục Ninh Bình vào màn hình chính"`.
  - Bắt `beforeinstallprompt` ở module top-level gán vào `(window as any).__deferredPwaPrompt`.
  - Hiển thị universal mobile cho cả Android và iOS (không chặn hiển thị khi `deferredPrompt` là null).
  - Tích hợp 2 modal hướng dẫn trực quan: iOS Safari (3 bước) và Android Fallback (3 bước qua Menu `⋮`).
- [x] **Step 4.6 [GREEN]**: Tích hợp `<PwaInstallBanner />` vào [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) và [`ontap-web/components/LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx).
- [x] **Step 4.7 [GREEN]**: Bổ sung ghi chú tính năng PWA Banner cho Khách & Học viên vào `## [3.22.0]` trong [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) và [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md).
- [x] **Step 4.8 [PASS]**: Chạy `npx vitest run scripts/pwa-install-banner.test.ts` và xác nhận PASS 100%.
- [x] **Step 4.9 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 04.

---

## Phase 05: Kiểm Thử TDD Tự Động & Quy Trình Nghiệm Thu Toàn Diện
*Đặc tả kỹ thuật: [`phase-05-verification-and-tests.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-05-verification-and-tests.md)*

- [ ] **Step 5.1**: Chạy toàn bộ test suites tự động bằng lệnh `npx vitest run scripts/` (yêu cầu 100% test files PASS).
- [ ] **Step 5.2**: Chạy kiểm tra kiểu dữ liệu TypeScript bằng `npx tsc --noEmit` và `cd ontap-web && npx tsc --noEmit` (yêu cầu 0 lỗi).
- [ ] **Step 5.3**: Đóng gói Production Vite bằng `cd ontap-web && npm run build` (yêu cầu build thành công thư mục `dist/`).
- [ ] **Step 5.4**: Đóng gói Portal Next.js bằng `npm run build:portal` (yêu cầu 57 static routes PASS).
- [ ] **Step 5.5**: Tạo commit nghiệm thu Phase 05 và lập báo cáo QA hoàn tất.

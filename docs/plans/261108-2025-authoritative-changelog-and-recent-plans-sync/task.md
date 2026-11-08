# Danh Sách Nhiệm Vụ Thực Thi Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261108-2025-authoritative-changelog-and-recent-plans-sync`  
> **Kế hoạch tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/plan.md)  
> **Phiên bản mục tiêu**: **v3.22.0**  
> **Quy trình thực thi**: Subagent-Driven Development (SDD) & Enriched TDD (`RED -> GREEN -> REFACTOR -> PASS`)  
> **Trạng thái**: Đã hoàn tất Independent Plan Review — Sẵn sàng bắt đầu thi công `[Bước 06] /code`

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

- [ ] **Step 2.1 [RED]**: Thêm test cases `TC-CP04`, `TC-CP05`, `TC-CP06` vào [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) kiểm tra Tab Switcher, bảo toàn Windows Electron Auto-Updater & Question Sync, và `getLatestVersion()` / `TopNavbar.tsx`.
- [ ] **Step 2.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận test FAIL.
- [ ] **Step 2.3 [GREEN]**: Nâng cấp [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) và [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) tích hợp Segmented Control Tab Switcher `[👤 Người dùng]` vs `[💻 Kỹ thuật (Dev)]`, sử dụng `useMemo` nạp raw markdown 0ms, loại bỏ hoàn toàn phụ thuộc `getGitHubReleases`.
- [ ] **Step 2.4 [GREEN]**: Nâng cấp [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) và phần hiển thị Changelog (dòng 289–338) của [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) (bảo toàn 100% khối Electron Auto-Updater & Question Sync ở dòng 16–287).
- [ ] **Step 2.5 [GREEN]**: Cập nhật `getLatestVersion()` trong [`ontap-web/services/githubService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/githubService.ts) & [`ontap-win/services/githubService.ts`](file:///d:/Antigravity/TNDNB/ontap-win/services/githubService.ts) đọc từ `parseChangelog(changelogUserRaw)`, và nâng fallback trong [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) & [`ontap-win/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/TopNavbar.tsx) lên `'3.22.0'`.
- [ ] **Step 2.6 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận PASS.
- [ ] **Step 2.7 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 02.

---

## Phase 03: Soạn Thảo Nội Dung Markdown Kép (Đủ 8 Plans), Khôi Phục 41 Bản Lịch Sử & Nâng Cấp v3.22.0
*Đặc tả kỹ thuật: [`phase-03-markdown-content-and-version-bump.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-03-markdown-content-and-version-bump.md)*

- [ ] **Step 3.1 [RED]**: Cập nhật [`scripts/version-sync.test.ts`](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts) kiểm tra phiên bản `3.22.0` trên 4 `package.json`, mục `[3.22.0]` trên 4 file `CHANGELOG`, và tổng số phiên bản lịch sử `>= 40` bản.
- [ ] **Step 3.2 [FAIL]**: Chạy `npx vitest run scripts/version-sync.test.ts` và xác nhận test FAIL.
- [ ] **Step 3.3 [GREEN]**: Cập nhật `"version": "3.22.0"` trong:
  - [`package.json`](file:///d:/Antigravity/TNDNB/package.json)
  - [`ontap-web/package.json`](file:///d:/Antigravity/TNDNB/ontap-web/package.json)
  - [`ontap-win/package.json`](file:///d:/Antigravity/TNDNB/ontap-win/package.json)
  - [`cloudflare-worker/package.json`](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json)
- [ ] **Step 3.4 [GREEN]**: Soạn thảo mục `## [3.22.0] - 2026-11-08` (đủ 8 plans, chia 3 nhóm `###`), sửa lỗi font tiếng Việt `[3.19.1]`, và khôi phục 41 phiên bản lịch sử (`3.19.0` ➔ `3.6.0` từ `db8b2070:CHANGELOG.md`) đồng bộ vào:
  - [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
  - [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
  - [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
- [ ] **Step 3.5 [GREEN]**: Soạn thảo mục kỹ thuật `## [3.22.0] - 2026-11-08` (đủ 8 plans, chia 4 nhóm `###`) trong [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md).
- [ ] **Step 3.6 [GREEN]**: Cập nhật script [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js) đồng bộ mục `3.22.0`.
- [ ] **Step 3.7 [PASS]**: Chạy `npx vitest run scripts/version-sync.test.ts` và xác nhận 100% tests PASS.
- [ ] **Step 3.8 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 03.

---

## Phase 04: Kiểm Thử TDD Tự Động & Quy Trình Nghiệm Thu Toàn Diện
*Đặc tả kỹ thuật: [`phase-04-verification-and-tests.md`](file:///d:/Antigravity/TNDNB/docs/plans/261108-2025-authoritative-changelog-and-recent-plans-sync/phase-04-verification-and-tests.md)*

- [ ] **Step 4.1**: Chạy toàn bộ test suites tự động bằng lệnh `npx vitest run scripts/` (yêu cầu 100% test files PASS).
- [ ] **Step 4.2**: Chạy kiểm tra kiểu dữ liệu TypeScript bằng `npx tsc --noEmit` và `cd ontap-web && npx tsc --noEmit` (yêu cầu 0 lỗi).
- [ ] **Step 4.3**: Đóng gói Production Vite bằng `cd ontap-web && npm run build` (yêu cầu build thành công thư mục `dist/`).
- [ ] **Step 4.4**: Đóng gói Portal Next.js bằng `npm run build:portal` (yêu cầu 57 static routes PASS).
- [ ] **Step 4.5**: Tạo commit nghiệm thu Phase 04 và lập báo cáo QA hoàn tất.

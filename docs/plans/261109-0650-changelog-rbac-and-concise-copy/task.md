# Danh Sách Nhiệm Vụ Thực Thi Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261109-0650-changelog-rbac-and-concise-copy`  
> **Kế hoạch tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/plan.md)  
> **Quy trình thực thi**: Subagent-Driven Development (SDD) & Enriched TDD (`RED -> FAIL -> GREEN -> PASS -> COMMIT`)  
> **Trạng thái**: Đã sẵn sàng bắt đầu thi công `[Bước 06] /code`

---

## Phase 01: Chuẩn Hóa Nội Dung Người Dùng Súc Tích & Render Inline Markdown Đẹp Mắt
*Đặc tả kỹ thuật: [`phase-01-concise-user-changelog-and-inline-markdown.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/phase-01-concise-user-changelog-and-inline-markdown.md)*

- [x] **Step 1.1 [RED]**: Viết test cases `TC-RBAC01`, `TC-RBAC02`, `TC-RBAC04` trong [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) kiểm tra chống từ khóa Dev trong `CHANGELOG.md`, đồng bộ 4 vị trí, và render inline markdown `**text**` thành `<strong>`.
- [x] **Step 1.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận test FAIL theo đúng chuẩn TDD.
- [x] **Step 1.3 [GREEN]**: Viết lại mục `## [3.22.0]` và `## [3.21.0]` theo chuẩn súc tích `[3.19.0]` trong [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md), đồng bộ sang [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md), [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md), [`public/ontap/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/public/ontap/CHANGELOG.md), và cập nhật [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js).
- [x] **Step 1.4 [GREEN]**: Bổ sung hàm tiện ích `renderInlineMarkdown` vào [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) & [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx), thay thế `{item}` bằng `{renderInlineMarkdown(item)}`.
- [x] **Step 1.5 [GREEN]**: Bổ sung hàm tiện ích `renderInlineMarkdown` vào [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) và phần hiển thị dưới dòng 289 của [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) (bảo toàn 100% dòng 16–287).
- [x] **Step 1.6 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận `TC-RBAC01`, `TC-RBAC02`, `TC-RBAC04` PASS 100%.
- [x] **Step 1.7 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 01 (`da9ff6d7`).

---

## Phase 02: Phân Quyền Vai Trò (RBAC) Cho Tab Kỹ Thuật (Dev)
*Đặc tả kỹ thuật: [`phase-02-rbac-dev-tab-visibility.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/phase-02-rbac-dev-tab-visibility.md)*

- [x] **Step 2.1 [RED]**: Viết test cases `TC-RBAC03` và `TC-RBAC05` trong [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) kiểm tra logic RBAC `useAppStore` (`admin`, `quan_ly`, `lanh_dao`) và bảo toàn Electron Updater Windows.
- [x] **Step 2.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận test FAIL theo đúng chuẩn TDD.
- [x] **Step 2.3 [GREEN]**: Nâng cấp [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) và [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx): lấy `userProfile` từ `useAppStore`, kiểm tra `canViewDevChangelog`, bọc Tab Switcher bằng `{canViewDevChangelog && ( ... )}`, và đặt `effectiveTab = canViewDevChangelog ? activeTab : 'user'`.
- [x] **Step 2.4 [GREEN]**: Nâng cấp [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) và phần hiển thị dưới dòng 289 của [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) với kiểm tra `canViewDevChangelog` (bảo toàn 100% dòng 16–287).
- [x] **Step 2.5 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` và xác nhận `TC-RBAC03` và `TC-RBAC05` PASS 100%.
- [x] **Step 2.6 [COMMIT]**: Tạo commit lưu mốc mã nguồn Phase 02 (`b961ae6c`).

---

## Phase 03: Kiểm Thử TDD Tự Động, Đảm Bảo Invariants & Đóng Gói Nghiệm Thu
*Đặc tả kỹ thuật: [`phase-03-tdd-tests-and-build-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/phase-03-tdd-tests-and-build-verification.md)*

- [x] **Step 3.1 [TEST]**: Chạy `npx vitest run scripts/changelog-parser.test.ts scripts/version-sync.test.ts` đảm bảo toàn bộ test suite RBAC PASS 100%.
- [x] **Step 3.2 [ALL-TESTS]**: Chạy `npx vitest run scripts/` đảm bảo toàn bộ 13 test files PASS 100% (zero regression, 95/95 passed).
- [x] **Step 3.3 [INVARIANT-1]**: Kiểm tra `git status --porcelain ontap-web/components/ExamQuizScreen.tsx ontap-web/components/QuizScreen.tsx` đạt `0 bytes diff`.
- [x] **Step 3.4 [INVARIANT-2]**: Chạy `npx vitest run -t "TC-RBAC05" scripts/changelog-parser.test.ts` xác nhận dòng 16–287 trong `ontap-win/components/ChangelogModal.tsx` nguyên vẹn 100%.
- [x] **Step 3.5 [TSC]**: Chạy `npx tsc --noEmit` và `cd ontap-web; npx tsc --noEmit; cd ..` đạt 0 lỗi TypeScript.
- [x] **Step 3.6 [BUILD-WEB]**: Đóng gói `cd ontap-web; npm run build; cd ..` thành công thư mục `dist/` và đồng bộ sang `public/ontap/`.
- [x] **Step 3.7 [BUILD-PORTAL]**: Đóng gói Cổng thông tin `npm run build:portal` thành công 57 static routes.
- [x] **Step 3.8 [COMMIT]**: Tạo commit nghiệm thu mã nguồn hoàn tất kế hoạch.

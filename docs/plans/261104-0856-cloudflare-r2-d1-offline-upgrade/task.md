# Danh Sách Công Việc Chi Tiết (Living To-Do List - TDD Enriched) — Nâng Cấp Cloudflare R2 + D1 + Offline-First & Thiết Kế Lại Portal Editorial

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Nhánh làm việc (Zero-Downtime Preview Branch):** `feat/cloudflare-offline-v3.21`  
> **Quy chuẩn thực thi:** Thực hiện nghiêm ngặt theo chu trình **TDD (RED -> Verify FAIL -> GREEN -> Verify PASS)** từ Phase 00 đến Phase 07. Chỉ sử dụng `write_file` / `edit_file` (không dùng PowerShell `Set-Content`).

---

## Phase 00: Khởi Tạo Nhánh Git Preview & Tách Deployment Monorepo (`ontap-web` Cloudflare Pages + Vercel Root Portal)
> Chi tiết TDD: [phase-00-split-deployment-monorepo.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-00-split-deployment-monorepo.md)

- [x] **Task 0.1:** Khởi tạo nhánh `feat/cloudflare-offline-v3.21` & Xây dựng Module Cấu hình Dual-Target (`ontap-web/utils/deployConfig.ts`, `_redirects`, `_headers`)
  - [x] **Step 0.1.1 (RED):** Chuyển sang nhánh `feat/cloudflare-offline-v3.21` và viết unit test kiểm tra `resolveDeployTargetConfig` + cấu hình `_redirects`/`_headers` tại [ontap-web/utils/__tests__/deployConfig.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/deployConfig.test.ts).
  - [x] **Step 0.1.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run utils/__tests__/deployConfig.test.ts` xác nhận FAIL.
  - [x] **Step 0.1.3 (GREEN):** Tạo [ontap-web/utils/deployConfig.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/deployConfig.ts), [ontap-web/public/_redirects](file:///d:/Antigravity/TNDNB/ontap-web/public/_redirects), [ontap-web/public/_headers](file:///d:/Antigravity/TNDNB/ontap-web/public/_headers), cập nhật [ontap-web/vite.config.ts](file:///d:/Antigravity/TNDNB/ontap-web/vite.config.ts) và [ontap-web/App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).
  - [x] **Step 0.1.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run utils/__tests__/deployConfig.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 0.2:** Cấu hình Tách Build & Routing `/ontap` Linh hoạt Trên Root Portal (`package.json` & `next.config.mjs`)
  - [x] **Step 0.2.1 (RED):** Viết unit test kiểm tra script `build:portal`, `build:ontap:cf` và logic `rewrites()` theo biến `NEXT_PUBLIC_ONTAP_STANDALONE_URL` tại [scripts/monorepo-routing.test.ts](file:///d:/Antigravity/TNDNB/scripts/monorepo-routing.test.ts).
  - [x] **Step 0.2.2 (FAIL):** Chạy `npx vitest run scripts/monorepo-routing.test.ts` xác nhận FAIL.
  - [x] **Step 0.2.3 (GREEN):** Cập nhật [package.json](file:///d:/Antigravity/TNDNB/package.json) và [next.config.mjs](file:///d:/Antigravity/TNDNB/next.config.mjs).
  - [x] **Step 0.2.4 (PASS):** Chạy lại `npx vitest run scripts/monorepo-routing.test.ts` xác nhận PASS (3/3 tests).

---

## Phase 01: Khởi Tạo Hạ Tầng Cloudflare (Worker, D1 Database, R2 Bucket)
> Chi tiết TDD: [phase-01-cloudflare-infra.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-01-cloudflare-infra.md)

- [x] **Task 1.1:** Khởi tạo cấu hình dự án Worker & kiểu dữ liệu (`package.json`, `tsconfig.json`, `wrangler.toml`, `src/types.ts`)
  - [x] **Step 1.1.1 (RED):** Viết unit test kiểm tra `parseAllowedOrigins` tại [cloudflare-worker/test/types.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/types.test.ts).
  - [x] **Step 1.1.2 (FAIL):** Chạy `npx vitest run cloudflare-worker/test/types.test.ts` xác nhận FAIL do chưa có file `src/types.ts`.
  - [x] **Step 1.1.3 (GREEN):** Tạo [cloudflare-worker/package.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json), [cloudflare-worker/tsconfig.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/tsconfig.json), [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml) và [cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts).
  - [x] **Step 1.1.4 (PASS):** Chạy lại `npx vitest run cloudflare-worker/test/types.test.ts` xác nhận PASS (2/2 tests).
- [x] **Task 1.2:** Xây dựng Middleware Xác thực Admin & Entrypoint CORS (`src/middleware/auth.ts` & `src/index.ts`)
  - [x] **Step 1.2.1 (RED):** Viết unit test kiểm tra `verifyAdminAuthorization`, `buildCorsHeaders` và `/api/v1/health` tại [cloudflare-worker/test/infra.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/infra.test.ts).
  - [x] **Step 1.2.2 (FAIL):** Chạy `npx vitest run cloudflare-worker/test/infra.test.ts` xác nhận FAIL.
  - [x] **Step 1.2.3 (GREEN):** Tạo [cloudflare-worker/src/middleware/auth.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts) và [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts).
  - [x] **Step 1.2.4 (PASS):** Chạy lại `npx vitest run cloudflare-worker/test/infra.test.ts` xác nhận PASS (4/4 tests).

---

## Phase 02: Thiết Kế Schema D1 & Di Trú Dữ Liệu (Supabase + Firebase -> D1 & R2)
> Chi tiết TDD: [phase-02-d1-schema-migration.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-02-d1-schema-migration.md)

- [x] **Task 2.1:** Tạo SQL Migration `0001_initial_schema.sql` & Route Câu hỏi (`src/routes/questions.ts`)
  - [x] **Step 2.1.1 (RED):** Viết unit test kiểm tra `assembleLicensesTree` và `GET /api/v1/meta/version` tại [cloudflare-worker/test/questions-route.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/questions-route.test.ts).
  - [x] **Step 2.1.2 (FAIL):** Chạy `npx vitest run cloudflare-worker/test/questions-route.test.ts` xác nhận FAIL.
  - [x] **Step 2.1.3 (GREEN):** Tạo [cloudflare-worker/migrations/0001_initial_schema.sql](file:///d:/Antigravity/TNDNB/cloudflare-worker/migrations/0001_initial_schema.sql) và [cloudflare-worker/src/routes/questions.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/questions.ts).
  - [x] **Step 2.1.4 (PASS):** Chạy lại `npx vitest run cloudflare-worker/test/questions-route.test.ts` xác nhận PASS (2/2 tests).
- [x] **Task 2.2:** Xây dựng Route Cấu hình Hệ thống & Thông báo Chạy chữ (`src/routes/config.ts` & `src/routes/alerts.ts`)
  - [x] **Step 2.2.1 (RED):** Viết unit test cho `handleConfigRoutes` và `handleAlertsRoutes` tại [cloudflare-worker/test/config-alerts.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/config-alerts.test.ts).
  - [x] **Step 2.2.2 (FAIL):** Chạy `npx vitest run cloudflare-worker/test/config-alerts.test.ts` xác nhận FAIL.
  - [x] **Step 2.2.3 (GREEN):** Tạo [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts) và [cloudflare-worker/src/routes/alerts.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/alerts.ts).
  - [x] **Step 2.2.4 (PASS):** Chạy lại `npx vitest run cloudflare-worker/test/config-alerts.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 2.3:** Xây dựng Script Di trú Dữ liệu sang D1 & Chuẩn hóa URL Ảnh R2 (`scripts/migrate-to-d1.mjs` & `scripts/migrate-images-to-r2.mjs`)
  - [x] **Step 2.3.1 (RED):** Viết unit test kiểm tra `normalizeQuestionImageForR2` và `generateSeedSqlFromLicenses` tại [scripts/migrate-to-d1.test.ts](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts).
  - [x] **Step 2.3.2 (FAIL):** Chạy `npx vitest run scripts/migrate-to-d1.test.ts` xác nhận FAIL.
  - [x] **Step 2.3.3 (GREEN):** Tạo [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs) và [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs).
  - [x] **Step 2.3.4 (PASS):** Chạy lại `npx vitest run scripts/migrate-to-d1.test.ts` xác nhận PASS (2/2 tests).

---

## Phase 03: Đồng Bộ Dữ Liệu Offline-First Với Cloudflare D1 (`ontap-web`, `ontap-win` & Root Portal)
> Chi tiết TDD: [phase-03-offline-first-data-sync.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-03-offline-first-data-sync.md)

- [x] **Task 3.1:** Tạo D1 HTTP Client & Offline IndexedDB Service (`d1Client.ts` & `offlineService.ts`)
  - [x] **Step 3.1.1 (RED):** Viết unit test cho `fetchMetaVersion`, `fetchQuestionsSnapshot`, `fetchD1Config` tại [ontap-web/services/__tests__/d1Client.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/d1Client.test.ts).
  - [x] **Step 3.1.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run services/__tests__/d1Client.test.ts` xác nhận FAIL.
  - [x] **Step 3.1.3 (GREEN):** Thêm `"dexie": "^4.2.1"` vào [ontap-web/package.json](file:///d:/Antigravity/TNDNB/ontap-web/package.json); tạo [ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts), [ontap-win/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/d1Client.ts) và [ontap-web/services/offlineService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts).
  - [x] **Step 3.1.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run services/__tests__/d1Client.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 3.2:** Nâng cấp `dataService.ts` & `syncService.ts` trên `ontap-web` và `ontap-win` (Offline-First + D1 Delta Sync)
  - [x] **Step 3.2.1 (RED):** Viết unit test kiểm tra luồng Offline-First `fetchLicenses` và `syncQuestionsInBackground` tại [ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts).
  - [x] **Step 3.2.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run services/__tests__/dataService.test.ts` xác nhận FAIL.
  - [x] **Step 3.2.3 (GREEN):** Cập nhật [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts), [ontap-win/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/dataService.ts) và [ontap-win/services/syncService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/syncService.ts).
  - [x] **Step 3.2.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run services/__tests__/dataService.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 3.3:** Nâng cấp `adminConfigService.ts`, `notificationService.ts`, `AlertMarquee.tsx` & `app/api/thi/[licenseId]/route.ts` sang D1
  - [x] **Step 3.3.1 (RED):** Viết unit test kiểm tra `getUsageConfig` đọc từ D1 và fallback `localStorage` khi Offline tại [ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts).
  - [x] **Step 3.3.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run services/__tests__/adminConfigD1.test.ts` xác nhận FAIL.
  - [x] **Step 3.3.3 (GREEN):** Cập nhật [ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts), [ontap-win/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts), [ontap-web/services/notificationService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/notificationService.ts), [ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx), [ontap-web/hooks/useAppInitialization.ts](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts), [ontap-win/hooks/useAppInitialization.ts](file:///d:/Antigravity/TNDNB/ontap-win/hooks/useAppInitialization.ts) và [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts).
  - [x] **Step 3.3.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run services/__tests__/adminConfigD1.test.ts` xác nhận PASS (2/2 tests).

---

## Phase 04: Tối Ưu Ảnh Câu Hỏi (Cloudflare R2 CDN + PWA Offline Cache)
> Chi tiết TDD: [phase-04-r2-images-pwa-cache.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-04-r2-images-pwa-cache.md)

- [x] **Task 4.1:** Xây dựng `ontap-web/utils/imageHelper.ts` & Cập nhật `ontap-win/utils/imageHelper.ts` + `QuizScreen.tsx`
  - [x] **Step 4.1.1 (RED):** Viết unit test cho `resolveQuestionImageUrl`, `extractAllQuestionImageUrls`, `precacheAllQuestionImages` tại [ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts).
  - [x] **Step 4.1.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run utils/__tests__/imageHelper.test.ts` xác nhận FAIL.
  - [x] **Step 4.1.3 (GREEN):** Tạo [ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts), cập nhật [ontap-win/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-win/utils/imageHelper.ts) và [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx).
  - [x] **Step 4.1.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run utils/__tests__/imageHelper.test.ts` xác nhận PASS (4/4 tests).
- [x] **Task 4.2:** Nâng cấp Service Worker [ontap-web/public/sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js) (Cache-First + Background Batch Pre-cache)
  - [x] **Step 4.2.1 (RED):** Viết specification test cho `sw-pwa.js` tại [ontap-web/utils/__tests__/swPwa.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/swPwa.test.ts).
  - [x] **Step 4.2.2 (FAIL):** Chạy `npx --prefix ontap-web vitest run utils/__tests__/swPwa.test.ts` xác nhận FAIL.
  - [x] **Step 4.2.3 (GREEN):** Cập nhật [ontap-web/public/sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js) (tuyệt đối giữ nguyên [ontap-web/public/sw.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw.js)).
  - [x] **Step 4.2.4 (PASS):** Chạy lại `npx --prefix ontap-web vitest run utils/__tests__/swPwa.test.ts` xác nhận PASS (3/3 tests).

---

## Phase 05: Tăng Tốc Auto-Update `.exe` Qua Cloudflare Worker CDN Proxy
> Chi tiết TDD: [phase-05-win-updater-cdn-proxy.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-05-win-updater-cdn-proxy.md)

- [x] **Task 5.1:** Xây dựng Route `/releases/*` Trên Cloudflare Worker (`src/routes/releasesProxy.ts`)
  - [x] **Step 5.1.1 (RED):** Viết unit test kiểm tra cả 2 chế độ `github_proxy` và `r2_direct` tại [cloudflare-worker/test/releases-proxy.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/releases-proxy.test.ts).
  - [x] **Step 5.1.2 (FAIL):** Chạy `npx vitest run cloudflare-worker/test/releases-proxy.test.ts` xác nhận FAIL.
  - [x] **Step 5.1.3 (GREEN):** Tạo [cloudflare-worker/src/routes/releasesProxy.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts).
  - [x] **Step 5.1.4 (PASS):** Chạy lại `npx vitest run cloudflare-worker/test/releases-proxy.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 5.2:** Cập nhật `UpdateService.ts`, `releaseService.ts` & `electron/main.cjs` Dùng Worker CDN Proxy
  - [x] **Step 5.2.1 (RED):** Viết unit test cho `getGitHubReleases` tại [ontap-win/services/__tests__/UpdateService.test.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/__tests__/UpdateService.test.ts).
  - [x] **Step 5.2.2 (FAIL):** Chạy `npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts` xác nhận FAIL.
  - [x] **Step 5.2.3 (GREEN):** Cập nhật [ontap-win/services/UpdateService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/UpdateService.ts), [ontap-web/services/releaseService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts), [ontap-win/electron/main.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs) và tạo [scripts/upload-release-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/upload-release-to-r2.mjs).
  - [x] **Step 5.2.4 (PASS):** Chạy lại `npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts` xác nhận PASS (1/1 test).

---

## Phase 06: Thiết Kế Lại Giao Diện Cổng Thông Tin Portal Theo Chuẩn Editorial (`/ui-ux-pro-max` + `/hallmark`) & Tách Biệt Khỏi `ontap-web`
> Chi tiết TDD: [phase-06-portal-editorial-redesign.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-06-portal-editorial-redesign.md)

- [x] **Task 6.1:** Khóa Hallmark Design Tokens trong `app/globals.css` & Gỡ bỏ 5 Nút Tiện Ích màu vàng trong `Navbar.tsx` / `Navbar.module.css` / `MobileBottomNav.tsx` / `Footer.tsx`
  - [x] **Step 6.1.1 (RED):** Viết unit test kiểm tra `Navbar.tsx` (không còn `utilityGroup` & 5 nút `Giải trí`, `Ôn tập`, `Thi trực tuyến`, `Tải App`, `Tra cứu ĐC`), `MobileBottomNav.tsx`, `Footer.tsx` và `app/globals.css` tại [scripts/portal-navbar-cleanup.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts).
  - [x] **Step 6.1.2 (FAIL):** Chạy `npx vitest run scripts/portal-navbar-cleanup.test.ts` xác nhận FAIL.
  - [x] **Step 6.1.3 (GREEN):** Cập nhật [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css), [components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx), [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css), [components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/components/MobileBottomNav.tsx) và [components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx) theo chuẩn Hallmark `N6 · Newspaper Masthead`.
  - [x] **Step 6.1.4 (PASS):** Chạy lại `npx vitest run scripts/portal-navbar-cleanup.test.ts` xác nhận PASS (3/3 tests).
- [x] **Task 6.2:** Thiết kế lại Trang Chủ Portal (`app/page.tsx`, `app/page.module.css`, `components/Sidebar.module.css`) Theo Bố Cục `H2 · Split Diptych` & `S1 · Left Margin Numbered`
  - [x] **Step 6.2.1 (RED):** Viết unit test kiểm tra `app/page.tsx` (gỡ bỏ `ctaBanner` `/ontap`, tích hợp `editorialDiptych`, `leadStory`, `briefingColumn`, `sectionIndex`) và `app/page.module.css` tại [scripts/portal-homepage-editorial.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts).
  - [x] **Step 6.2.2 (FAIL):** Chạy `npx vitest run scripts/portal-homepage-editorial.test.ts` xác nhận FAIL.
  - [x] **Step 6.2.3 (GREEN):** Cập nhật [app/page.tsx](file:///d:/Antigravity/TNDNB/app/page.tsx), [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css) và [components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css).
  - [x] **Step 6.2.4 (PASS):** Chạy lại `npx vitest run scripts/portal-homepage-editorial.test.ts` xác nhận PASS (2/2 tests).

---

## Phase 07: Kiểm Thử Trên Link Preview, Nâng Version Đồng Bộ v3.21.0 & Merge Cut-over (`main`)
> Chi tiết TDD: [phase-07-testing-verification.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/phase-07-testing-verification.md)

- [ ] **Task 7.1:** Kiểm thử E2E Offline Mode + Delta Sync + R2 Precache + Portal Redesign & Build Verification
  - [ ] **Step 7.1.1 (RED):** Viết kịch bản E2E test mất mạng hoàn toàn tại [ontap-web/services/__tests__/offlineIntegration.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts).
  - [ ] **Step 7.1.2 (FAIL):** Xác nhận test FAIL nếu thiếu bất kỳ thành phần nào của Phase 03-04.
  - [ ] **Step 7.1.3 (GREEN):** Chạy toàn bộ 18 test files (45 unit/integration tests) trên cả `cloudflare-worker`, `ontap-web`, `ontap-win` và `scripts`.
  - [ ] **Step 7.1.4 (PASS):** Xác nhận 45/45 tests PASS và chạy `npm run build:ontap:cf`, `npm run build:portal`, `npm --prefix ontap-win run build` thành công.
- [x] **Task 7.2:** Nâng Cấp và Đồng Bộ Phiên Bản v3.21.0 Toàn Bộ Ứng Dụng (`Root`, `ontap-web`, `ontap-win`, `cloudflare-worker`) & Cập Nhật Changelogs
  - [x] **Step 7.2.1 (RED):** Viết unit test kiểm tra toàn bộ 4 file package.json đều có version "3.21.0" tại [scripts/version-sync.test.ts](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts).
  - [x] **Step 7.2.2 (FAIL):** Chạy `npx vitest run scripts/version-sync.test.ts` xác nhận FAIL (do hiện tại là 3.20.0).
  - [x] **Step 7.2.3 (GREEN):** Cập nhật `update_versions.js` & `update_changelogs.js`, chạy nâng version lên `3.21.0` cho `package.json`, `ontap-web/package.json`, `ontap-win/package.json`, `cloudflare-worker/package.json` và cập nhật các file `CHANGELOG.md`.
  - [x] **Step 7.2.4 (PASS):** Chạy lại `npx vitest run scripts/version-sync.test.ts` xác nhận PASS (2/2 tests).
- [ ] **Task 7.3:** Push nhánh `feat/cloudflare-offline-v3.21` lên GitHub, kiểm thử thực tế trên **Vercel Preview URL** và **Cloudflare Pages Preview URL (`*.pages.dev`)** trong khi Production (`main`) vẫn chạy bình thường. Sau khi nghiệm thu 100% PASS mới merge vào `main`.

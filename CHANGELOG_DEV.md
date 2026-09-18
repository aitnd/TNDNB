## [3.18.1] - 2026-09-18
### UI/UX & Sync Improvements (Web & Win)
- **Dashboard UI Fix:** Changed padding from `pt-2` to `pt-24` in `Dashboard.tsx` (both Web & Win) to prevent TopNavbar from overlapping AdminStatsBar.
- **Background Data Sync:** Refactored `ChangelogModal.tsx` in Win app. Replaced blocking UI with `toast.promise` (from `sonner`) for background execution and updated state transitions.

## [3.18.0] - 2026-09-16
### Global UI Zoom via useUiZoom (Web & Win)
- **New hook `hooks/useUiZoom.ts` (1 báº£n má»—i project, copy logic):** Ctrl+wheel / Ctrl+=/-/0, range 50â€“200% step 10%, persist localStorage `ui-zoom-scale`, Ã¡p dá»¥ng CSS `zoom` trÃªn documentElement (scale toÃ n layout, Ä‘á»™c láº­p vá»›i `useFontScale` zoom chá»¯). Cháº·n zoom native (`passive: false`) chá»‘ng double-zoom. Gá»i 1 dÃ²ng trong `AppContent` (`App.tsx` 2 bÃªn).

## [3.17.0] - 2026-09-16
### Login Timeout, Scoped Quiz Zoom, x64/ia32 Split, Audit Cleanup (Web & Win)
- **Login Timeout (`authTimeout.ts` má»›i, má»—i project 1 báº£n):** `timeoutWrapper(promise, 15000)` bá»c má»i call site Firebase treo Ä‘Æ°á»£c â€” má»—i `LoginScreen` 3 chá»— (handleLogin/saved/biometric), `WindowsLoginScreen` 2 chá»— qua `performLogin`; `finally` vÃ´ Ä‘iá»u kiá»‡n; unit test Vitest 2/2 xanh.
- **Scoped Zoom (`useFontScale` + `ZoomBar`, má»—i project 1 báº£n):** `--content-scale` + override `fontSize: calc(<base>rem * var(...))` (h2 1.5rem, Ä‘Ã¡p Ã¡n 1.125rem, Exam2 1rem/1.125rem); 6 mÃ n Quiz/Exam/Exam2 Ã— web/win; persist localStorage `quiz-font-scale`.
- **Build Split:** `artifactName` thÃªm `${arch}`; xÃ³a `installer.nsh` rÃ¡c; scripts `electron:build:x64/ia32/all`; output x64+ia32+universal, 1 `latest.yml` updater tá»± chá»n arch.
- **Audit:** web 15â†’2 moderate, win 25â†’2 moderate (patch semver-safe, giá»¯ cáº·p react-router breaking); guard Ä‘á» rá»—ng 4 mÃ n exam + SSR guards.
- **QA:** vitest 14/14, tsc sáº¡ch, vite build pass, Electron build OK.

## [3.16.0] - 2026-07-09
### Decouple `amthuc-web` module & Build Environment Cleanup
- **Project Decoupling:** Successfully extracted and removed the `amthuc-web` module from the TNDNB monorepo to its own independent domain (`thodia.hlstudio.top`).
- **Navigation Update:** Updated `Sidebar` and `TopNavbar` components across both Web and Win applications to point to the new external domain.
- **Build Optimization:** Cleaned up sitemap generation logic (`generate-sitemap.js`) and removed legacy build assets associated with the food/restaurant module to streamline the build process.

## [3.15.10] - 2026-07-06
### AdSense IVT Shield & Web Responsive Fix (Web & App Win)
- **AdSense IVT Shield:** Kháº¯c phá»¥c lá»—i báº£o vá»‡ click chÃ©o (cross-origin iframe) trÃªn Google AdSense báº±ng cÃ¡ch chuyá»ƒn tá»« sá»± kiá»‡n mousemove sang kiá»ƒm tra lur + document.activeElement. PhÃ¢n tÃ¡ch cÆ¡ cháº¿ pointer-events: none cho IVT Shield vÃ  display: none cho Admin Toggle Ä‘á»ƒ tá»‘i Æ°u sá»‘ láº§n hiá»ƒn thá»‹ (Impressions) mÃ  váº«n chá»‘ng click táº·c.
- **Tailwind Responsive ExamQuizScreen2:** Loáº¡i bá» hoÃ n toÃ n sá»± phá»¥ thuá»™c vÃ o logic state isMobileApp Ä‘á»ƒ kiá»ƒm soÃ¡t bá»‘ cá»¥c. Ãp dá»¥ng cÃ¡c lá»›p tiá»‡n Ã­ch CSS thuáº§n tÃºy cá»§a Tailwind (hidden md:flex, lex md:hidden) giÃºp tá»± Ä‘á»™ng hiá»ƒn thá»‹ lÆ°á»›i nÃºt Ä‘Ã¡p Ã¡n trÃªn mobile web browser, ngÄƒn ngá»«a tÃ¬nh tráº¡ng biáº¿n dáº¡ng báº£ng giao diá»‡n PC trÃªn mÃ n hÃ¬nh nhá».

## [3.15.9] - 2026-07-02
### Selective AdBlocker (AdSense pointer-events: none / auto)
- **Shared Style:** Added `adBlockerStyles.ts` to export common styling definitions: `ADSENSE_SELECTIVE_BLOCK_CSS` and `ADSENSE_HIDE_ALL_CSS`.
- **AdSenseLoader:** Sourced `ADSENSE_SELECTIVE_BLOCK_CSS` in `AdSenseLoader.tsx` to apply selective pointer-events blocking.
- **PortalAdLoader:** Integrated `ADSENSE_SELECTIVE_BLOCK_CSS` in `PortalAdLoader.tsx`, removing legacy `display: none` layout concealment for AdSense, thereby enabling active viewability while retaining interaction safety.

## [3.15.8] - 2026-07-02
### Fix FileReader parameter shadowing bug in Excel Import (Web)
- **ImportStudentModal Bugfix:** Fixed a `TypeError` on `FileReader.readAsArrayBuffer` inside `handleFileUpload` where the file parameter was renamed to `_file` in `ontap-web` (to prevent a compiler warning) but the call remained referencing `file` (the outer state variable, which is still `null` due to React's asynchronous setState). Restored the parameter name to `file` to shadow the state correctly.

## [3.15.7] - 2026-06-30
### Mobile UI Enhancement & Navigation Architecture Refactoring (Web & Win)
- **New Mobile Header Component:** Integrated `MobileHeader` to render brand logo and user avatar dynamically based on `UserProfile` props on mobile layout.
- **Mobile Navigation Refactoring:** Overhauled `MobileBottomNav` component. Replaced legacy primary items (News, Practice, Account) with more functional routing keys: `dashboard` (Trang chá»§), `history` (Lá»‹ch sá»­), and dynamic `class` (Lá»›p há»c) which toggles `FaSchool` or `FaUserGraduate` based on teacher/student role checking.
- **Expanded Secondary Drawer Menu:** Moved `Account` navigation to the sliding drawer. Integrated `Mailbox` (Há»™p thÆ°), `Download App` (Táº£i App), and `Config` (Cáº¥u hÃ¬nh, restricted to `role === 'admin'`) in the bottom navigation menu items.
- **Safe Area Insets Adjustment:** Applied CSS padding-bottom using standard `env(safe-area-inset-bottom)` to avoid layout overlapping on modern borderless mobile devices.
- **Unified Layout Entry Integration:** Bound `MobileHeader` and `MobileBottomNav` layout renderers inside `AppContent` component for `ontap-web` (`App.tsx`) and `AppRoutes` wrapper for `ontap-win` (`AppRoutes.tsx`).

## [3.15.6] - 2026-06-30
### TÃ¡i cáº¥u trÃºc mÃ£ nguá»“n há»‡ thá»‘ng
- **Refactor (App.tsx):** Split God Component App.tsx vÃ o routes/AppRoutes.tsx vÃ  hooks/useAppInitialization.ts cho cáº£ ontap-web vÃ  ontap-win.
- **Cleanup:** Dá»n dáº¹p unused variables vÃ  fix lá»—i TypeScript warning (TS6133) á»Ÿ nhiá»u files.

## [3.15.5] - 2026-06-30
### Fix Timezone Offsets, Refactor App.tsx, & Clean TS Warnings (Web & Win)
- **UTC-to-VN Time Conversion**: Fixed time drift by computing local hours with explicit `(new Date().getUTCHours() + 7) % 24` offset calculations inside `app/api/weather/route.ts` instead of relying on default server clock context.
- **Tooltip Overflow & Indicator Size**: Removed parent level `overflow-hidden` class in `WeatherWidget.tsx` (web & win) which caused status indicators tooltips to crop when rendered absolutely. Retained `overflow-hidden` transition inside the animated `motion.div` component. Increased network status indicator size to `w-4 h-4` for better accessibility.
- **App.tsx Refactoring (God Component Split)**: Extracted and isolated the client-side routing tree into `routes/AppRoutes.tsx`. Moved app initialization states, auth verification, database sync listeners, biometrics checks, and hardware back button listeners into a custom hook `hooks/useAppInitialization.ts`. Reduced `App.tsx` code size by 70%, keeping it purely as a coordinator.
- **TypeScript strict compliance**: Cleaned up 59 compiler warnings (`noUnusedLocals` and `noUnusedParameters` rules) across the `ontap-web` codebase. Removed unused local variables/imports in `App.tsx`, `StudentsTab.tsx`, `Dashboard.tsx`, `vite.config.ts`, etc. Fixed syntax errors and leftover logging.

## [3.15.4] - 2026-06-30
### Sá»­a lá»—i Git Tag Duplication & NÃ¢ng cáº¥p Cáº¥u hÃ¬nh Quáº£ng cÃ¡o (Web & Win)
- **Git Tag Autodelete**: Bá»• sung hÃ m `deleteTag` gá»i GitHub REST API endpoint `DELETE /repos/{owner}/{repo}/git/refs/tags/{tag}`. TÃ­ch há»£p lá»‡nh gá»i xoÃ¡ tag tá»± Ä‘á»™ng trÆ°á»›c khi táº¡o má»›i release trong `UsageConfigPanel.tsx` cá»§a cáº£ báº£n Web vÃ  Win, trÃ¡nh lá»—i 422 `Validation Failed`.
- **Fix DirectLink Bug**: Cáº­p nháº­t component `MonetagDirectLink` nháº­n thÃªm prop `maxPerSession` vÃ  kiá»ƒm tra giá»›i háº¡n lÆ°á»£t hiá»ƒn thá»‹ so vá»›i `sessionStorage` key `monetag_dl_count`. Náº¿u `maxPerSession <= 0` thÃ¬ táº¯t hoÃ n toÃ n.
- **Single Source of Truth**: ThÃªm háº±ng sá»‘ `AD_DISABLED = 0` vÃ  helper `isAdTypeDisabled` vÃ o `services/monetagConfig.ts`.
- **UI Admin Panel Upgrade**: Cáº­p nháº­t CSS tráº¡ng thÃ¡i trong `UsageConfigPanel.tsx`, tá»± Ä‘á»™ng Ä‘á»•i border thÃ nh `border-red-300` vÃ  gáº¯n badge `ðŸš« ÄÃ£ táº¯t` khi cÃ¡c Ã´ input cÃ³ giÃ¡ trá»‹ `<= 0`.

## [3.15.3] - 2026-06-30
### Sá»­a lá»—i hiá»ƒn thá»‹ Huy hiá»‡u Admin (MiniRoleBadge Opacity Bug)
- **Framer Motion Fix:** Bá»• sung `opacity: 1` vÃ o animate object cá»§a premium roles (`admin`, `super_admin`, `lanh_dao`) trong file `MiniRoleBadge.tsx` cá»§a cáº£ `ontap-web` vÃ  `ontap-win`. Kháº¯c phá»¥c triá»‡t Ä‘á»ƒ lá»—i áº©n huy hiá»‡u (do ban Ä‘áº§u set `initial={{ opacity: 0 }}`).

### Tá»‘i Æ°u hÃ³a xÃ¡c thá»±c Monetag qua Head Script tÄ©nh
- **Portal Layout Update:** Thay tháº¿ Next.js `<Script>` component (vá»‘n tá»± Ä‘á»™ng biÃªn dá»‹ch sang queue JS Ä‘á»™ng) thÃ nh tháº» `<script>` HTML chuáº©n thÃ´ náº±m trong `<head>` tá»± Ä‘á»‹nh nghÄ©a cá»§a `app/layout.tsx`. Giáº£i quyáº¿t lá»—i **"Installation error"** trÃªn dashboard Monetag do bot quÃ©t tÄ©nh cá»§a há» khÃ´ng Ä‘á»c Ä‘Æ°á»£c JS dynamic inject.

## [3.15.2] - 2026-06-30
### Weather Status Indicator (Web & App Win)
- **Weather Indicator UI:** ThÃªm indicator icon (`Signal`, `SignalLow`, `WifiOff`) vÃ  tooltip chi tiáº¿t thÃ´ng qua state `dataSource` ('live' | 'server-mock' | 'offline') trÃªn components `WeatherWidget.tsx` cá»§a cáº£ `ontap-web` vÃ  `ontap-win`.

### Fix Monetag Ads Installation (Portal Head Script Injection)
- **Monetag Integration:** ÄÆ°a tháº» `<Script>` Monetag tÄ©nh vÃ o file `app/layout.tsx` cá»§a Next.js vá»›i option `strategy="beforeInteractive"` Ä‘á»ƒ render tháº³ng trong HTML source cá»§a Head, vÆ°á»£t qua cÆ¡ cháº¿ quÃ©t mÃ£ cÃ i Ä‘áº·t (Crawler check) cá»§a Monetag.

## [3.15.1] - 2026-06-30
### Cáº­p nháº­t há»‡ thá»‘ng quáº£ng cÃ¡o Monetag (Web & App Win)
- **Multitag:** Cáº­p nháº­t domain sang `quge5.com` vÃ  zone ID `254797`. Äá»•i attribute tá»« `data-z` sang `data-zone` vÃ  thÃªm `data-cfasync="false"` Ä‘á»ƒ tÆ°Æ¡ng thÃ­ch vá»›i Cloudflare.
- **Service Worker:** Cáº­p nháº­t domain sang `5gvci.com` vÃ  zone ID `11218490` trong cÃ¡c file `sw.js` (root, ontap-web, ontap-win).

### Cáº¥u trÃºc thiáº¿t káº¿ & Má»Ÿ rá»™ng thá»i tiáº¿t (Weather Redesign)
- **DESIGN.md Integration:** Táº¡o file `DESIGN.md` á»Ÿ root quy Ä‘á»‹nh mÃ u sáº¯c Zinc trung tÃ­nh, typography Satoshi, layout logic vÃ  spring motion. VÆ°á»£t qua kiá»ƒm tra contrast WCAG AA.
- **Weather API Backend:** Sá»­a Ä‘á»•i API Next.js `/api/weather/route.ts` Ä‘á»ƒ slice dá»¯ liá»‡u forecast thá»±c táº¿ vá» 8 tiáº¿ng vÃ  refactor hÃ m giáº£ láº­p `getDynamicMockWeather` sinh Ä‘á»§ 8 má»‘c Ä‘á»™ng.
- **WeatherWidget Web/Win:** TÃ­ch há»£p `Sparkles` icon, dynamic Advice styles (`getAdviceStyle`, `getAdviceIcon`), lá»c emoji báº±ng regex vÃ  spring-physics hover card (`whileHover` trong Framer Motion).

## [3.15.0] - 2026-06-29
### Feature: Modernized Class Management UI (Web & Win)
- **ClassList Rewrite:** Rewrote `ClassList.tsx` to support both Grid and List view modes using Tailwind CSS.
- **Smart Cards:** Replaced traditional list items with dynamic cards containing gradient headers, status indicators (Active/Finished), and quick action overlay buttons (Edit/Delete).
- **Avatar Support:** Added `avatarUrl` rendering for head teachers fetching from `creatorProfiles` state map. Added avatarUrl input inside `AddEditCourseModal`.
- **Insights Bar:** Implemented `getDocs(query(collection(db, 'thithu_results'), where('courseId', '==', id)))` in `ClassManagementScreen.tsx` to display real-time member count and mock test attempt totals.
- **Environment Parity:** Synchronized changes from `ontap-web` to `ontap-win` to maintain codebase parity.

## [3.14.0] - 2026-06-29
### Gamification v2.0 - Complete Integration
- **BadgeAdminModal:** Implemented 3D icon rendering and manual grant/revoke functions using BadgeService for Admins and Leaders.
- **App.tsx Triggers:** Integrated `increasePracticeProgress` and `increaseMockTestProgress` into `saveExamResult` flows on both Web and Win platforms.
- **Fragment Fix:** Fixed React Fragment errors in UserManagerScreen.tsx on both platforms.
- **Constants Sync:** Synced `badges.ts` definitions for unified mock test and practice progress.

### QA Fixes
- **TypeScript Strict Compliance:** Fixed unused variables (`StudentAnswers`, `CONG_THUC_TRON_DE`, `loading`, `filterRole`, `sortKey`, `sortOrder`, `headTeacher`, `router`) across various components and API routes (`nop-bai`, `thi`, `dang-bai/sua`, `dang-bai/tao-moi`, `ho-so`, `ClassDetail`, `PostManager`, `StudentClassView`, `TeacherRoomList`) to successfully pass the Next.js `next build` process.
- **Rules of Hooks:** Refactored early returns in `AdminStatsBar.tsx` and `QuizScreen.tsx` to strictly occur after hook declarations, preventing React state mismatch errors across `ontap-web` and `ontap-win`.
- **Markdown Formatting & Font Issue:** Diagnosed recurring "lá»—i font" in changelog rendering. Root cause: Missing newline (\n\n) before markdown headings (## [Version]) caused parsers to merge headings with previous list items, breaking UI typography and font scaling. Preventive measure: Always ensure strict double-newline separation between changelog blocks.

## [3.13.0] - 2026-06-29
### Gamification Engine & Smart Account Recycle (Web & App Win)
- **Badge Engine Core:** Implemented `BadgeService` and `BadgeListener` side-effect wrapper to trigger and unlock achievements (`achievement_1`, `achievement_perfect`) dynamically on quiz and online exam submission.
- **MiniRoleBadge Component:** Developed and integrated visual `<MiniRoleBadge />` displaying user privilege roles (`admin`, `giao_vien`, `hoc_vien`) in `TopNavbar` and `StudentCard`.
- **Database Recycling Services:** Added `BadgeService.resetUserBadges(uid)` and `clearUserHistory(uid)` in `historyService.ts` to purge and clean sub-collections and exam logs when recycling student IDs.
- **Conflict Resolution UI:** Upgraded `ImportStudentModal.tsx` and `CreateStudentModal.tsx` (Web & Win) with a pre-check verification step displaying conflict comparison tables and enforcing a double-confirmation prompt for active (unlocked) accounts before overwrite.
- **Codebase Cleanups & Modularity:** Cleaned up unused imports/variables in `Navbar`, `StudentsTab`, `PortalMaintenanceWrapper`, `admin/page.tsx`, and `quan-ly/[roomId]/page.tsx`. Added `.env*` to `ontap-win/.gitignore`.

## [3.12.2] - 2026-06-29
### Refactor UI Header Layout & TopNavbar Consolidation (Web & App Win)
- **Dashboard Row 1 Consolidation:** Integrated `<WeatherWidget />` and `<AdminStatsBar />` into a single responsive flex container (`flex flex-col lg:flex-row items-center justify-between gap-3 mb-4`) in both `Dashboard.tsx` (Web & Win).
- **Slim Weather & Stats Layout:** Reduced `WeatherWidget` padding to `py-2 px-3`, weather icon to `w-8 h-8`, and removed redundant `mb-6` margin from `AdminStatsBar.tsx`.
- **TopNavbar Restructuring:** Consolidated individual management links (`Quáº£n lÃ½ lá»›p`, `Thi trá»±c tuyáº¿n`, `GiÃ¡m kháº£o`, `Quáº£n lÃ½ TB`, `Cáº¥u hÃ¬nh`) into a unified `<ShieldCheck />` System dropdown menu (`setShowSystemDropdown`) for privileged roles (`['admin', 'lanh_dao', 'quan_ly', 'giao_vien']`).
- **App.tsx Cleanup:** Removed redundant outer `<WeatherWidget />` renders from both `ontap-web/App.tsx` and `ontap-win/App.tsx`.

## [3.12.1] - 2026-06-29
### Changelog Refactoring & Popup Limits (Web & App Win)
- **Popup Version Limit**: Refactored `ChangelogModal.tsx` in both Web and Win to slice the changelog data array (`.slice(0, 1)`) showing only the latest release in the popup view.
- **Legacy Header Alignment**: Aligned and replaced legacy date headers in `CHANGELOG.md`, `CHANGELOG_DEV.md`, `ontap-web/CHANGELOG.md`, and `ontap-win/CHANGELOG.md` with semantic versions (`[3.9.2]`, `[3.8.0]`, `[3.7.0]`, `[3.6.0]`).
- **Workflow Updates**: Updated `/check-project` and `/tndnb-build` global workflows with double changelog verification rules and SemVer standards.

## [3.12.0] - 2026-06-29
### Cáº­p nháº­t há»‡ thá»‘ng báº£o trÃ¬ & IVT Shield
- **TÃ­nh nÄƒng:** TÃ¡ch Ä‘á»™c láº­p 3 cÃ´ng táº¯c báº£o trÃ¬ cho trang chÃ­nh (Portal), Web vÃ  Win.
- **TÃ­nh nÄƒng:** ThÃªm nÃºt báº­t/táº¯t quáº£ng cÃ¡o (AdSense, Adsterra, Monetag) cho trang chÃ­nh Portal.
- **Báº£o máº­t:** Ãp dá»¥ng giá»›i háº¡n click AdSense (IVT Shield) Ä‘á»ƒ chá»‘ng Invalid Traffic cho Portal.
- **TÃ­nh nÄƒng:** Äá»•i Ä‘Æ¡n vá»‹ thá»i gian cooldown quáº£ng cÃ¡o tá»« 'giá»' sang 'phÃºt' trÃªn toÃ n há»‡ thá»‘ng.
- **UI:** Cáº­p nháº­t mÃ n hÃ¬nh admin config Ä‘á»“ng bá»™ cho Web vÃ  Win.

# Changelog
## [3.11.0] - 2026-06-29
### TÃ­ch há»£p & Tá»‘i Æ°u hÃ³a Kiáº¿m tiá»n Monetag (Web & App Win)
- **Chiáº¿n lÆ°á»£c Quáº£ng cÃ¡o Äa dáº¡ng:** TÃ­ch há»£p Smart Tag (Vignette/Interstitial), Auto Popunder (giá»›i háº¡n 1 láº§n/phiÃªn), vÃ  Direct Link Ä‘á»ƒ tá»‘i Æ°u hÃ³a doanh thu tá»« CPM/eCPM cho thá»‹ trÆ°á»ng Viá»‡t Nam.
- **Dynamic Config qua Firebase:** Cho phÃ©p Admin thay Ä‘á»•i URL Direct Link Ä‘á»™ng trá»±c tiáº¿p tá»« mÃ n hÃ¬nh "Há»‡ thá»‘ng" thay vÃ¬ hardcode.
- **PhÃ¢n bá»• theo Vai trÃ² (RoleConfig):** Cho phÃ©p báº­t/táº¯t riÃªng biá»‡t cÃ¡c Ä‘á»‹nh dáº¡ng Popunder, Direct Link, Countdown Ad theo tá»«ng háº¡ng tÃ i khoáº£n (Free, Verified, VIP).
- **Tráº£i nghiá»‡m chá» thÃ´ng minh:** Bá»• sung mÃ n hÃ¬nh chá» Ä‘áº¿m ngÆ°á»£c `CountdownAdScreen` (5 giÃ¢y) trÆ°á»›c khi xem káº¿t quáº£ thi Ä‘á»ƒ hiá»ƒn thá»‹ quáº£ng cÃ¡o Interstitial hiá»‡u quáº£. (Tá»± Ä‘á»™ng vÃ´ hiá»‡u hÃ³a trÃªn mÃ´i trÆ°á»ng Electron/Windows).
- **Service Worker Anti-Adblock:** TÃ­ch há»£p `sw.js` nháº±m giáº£m tá»· lá»‡ quáº£ng cÃ¡o bá»‹ cháº·n bá»Ÿi cÃ¡c trÃ¬nh duyá»‡t vÃ  extension.
- **Cáº¥u hÃ¬nh Quáº£ng cÃ¡o TÃ¡ch biá»‡t:** TÃ¡ch riÃªng cáº¥u hÃ¬nh báº­t táº¯t quáº£ng cÃ¡o cho AdSense, Adsterra vÃ  Monetag trÃªn trang chá»§ tin tá»©c.
- **Dá»± kiáº¿n hiá»ƒn thá»‹ (Text fallback):** Bá»• sung text fallback trong mÃ n hÃ¬nh báº£o trÃ¬ khi Admin khÃ´ng cÃ i giá» báº£o trÃ¬ cá»¥ thá»ƒ.


## [3.10.9] - 2026-06-29
### Cháº·n Route NghiÃªm Ngáº·t & Bá»™ Äáº¿m NgÆ°á»£c Báº£o TrÃ¬ (Web & App Win)
- **Cháº·n route 2 lá»›p báº£o máº­t:** ThÃªm component `ProtectedRoute` bá»c cÃ¡c route nháº¡y cáº£m. VÃ¡ hoÃ n toÃ n 4 lá»— há»•ng báº£o máº­t route admin (class-manager, usermanager, settings, exam-manager) hiá»‡n táº¡i chá»‰ check Ä‘Äƒng nháº­p mÃ  khÃ´ng check vai trÃ².
- **Security Rules Firestore:** Thiáº¿t káº¿ vÃ  lÆ°u trá»¯ file `firestore.rules` táº¡i thÆ° má»¥c root Ä‘á»ƒ quáº£n trá»‹, kiá»ƒm soÃ¡t quyá»n truy cáº­p collections á»Ÿ táº§ng Server-side.
- **Bá»™ Ä‘áº¿m ngÆ°á»£c thá»i gian thá»±c (Real-time Maintenance Countdown):** TÃ­ch há»£p custom hook `useCountdown` Ä‘á»ƒ tá»± Ä‘á»™ng tÃ­nh thá»i gian chÃªnh lá»‡ch tá»«ng giÃ¢y trÃªn mÃ n hÃ¬nh báº£o trÃ¬ `MaintenanceScreen` (Web & Win).
- **Giao diá»‡n countdown Glassmorphism:** Hiá»ƒn thá»‹ thá»i gian báº£o trÃ¬ cÃ²n láº¡i trá»±c quan dÆ°á»›i dáº¡ng 4 Ã´ glassmorphic tinh táº¿ (NgÃ y/Giá»/PhÃºt/GiÃ¢y) vá»›i hiá»‡u á»©ng sá»‘ cháº¡y mÆ°á»£t mÃ , tá»± Ä‘á»™ng chuyá»ƒn Ä‘á»•i sang nÃºt "Táº£i láº¡i trang" vÃ  tá»± Ä‘á»™ng reload trang sau 10 giÃ¢y khi hoÃ n táº¥t báº£o trÃ¬.
- **Cáº¥u hÃ¬nh admin tiá»‡n Ã­ch:** Bá»• sung input datetime picker `maintenanceEndTime` (ISO 8601) vÃ o trang cÃ i Ä‘áº·t há»‡ thá»‘ng `UsageConfigPanel` cá»§a admin Ä‘á»ƒ cáº¥u hÃ¬nh Ä‘áº¿m ngÆ°á»£c chÃ­nh xÃ¡c, giá»¯ nguyÃªn cÆ¡ cháº¿ text fallback náº¿u admin khÃ´ng cÃ i Ä‘áº·t giá» cá»¥ thá»ƒ.

## [3.10.8] - 2026-06-27
### Cáº£i tiáº¿n Giao diá»‡n Báº£o trÃ¬, PhÃ¢n quyá»n Dashboard Há»c ViÃªn & Tá»‘i Æ¯u WeatherWidget (Web & App Win)
- **Hoáº¡t há»a Gears lÆ°á»›t sÃ³ng cá»±c Ä‘áº¹p:** Kháº¯c phá»¥c triá»‡t Ä‘á»ƒ lá»—i ghi Ä‘Ã¨ transform cá»§a Framer Motion báº±ng cÃ¡ch bá»c tháº» bÃ¡nh rÄƒng vÃ o tháº» div tÄ©nh, Ä‘á»“ng thá»i thÃªm hiá»‡u á»©ng cá» lÃª lÆ¡ lá»­ng vÃ  tá»± láº¯c lÆ° (Wobble) cá»±c sinh Ä‘á»™ng.
- **Cáº¥u hÃ¬nh Ä‘á»™ng 3 cá»™t tá»« Settings:** ThÃªm cÃ¡c Ã´ nháº­p liá»‡u Thá»i gian dá»± kiáº¿n, ThÃ´ng tin dá»¯ liá»‡u vÃ  LiÃªn há»‡ há»— trá»£ táº¡i trang `/ontap/settings`.
- **NÃ¢ng cáº¥p trang báº£o trÃ¬ tÄ©nh:** Trang báº£o trÃ¬ tÄ©nh `maintenance.html` Ä‘Æ°á»£c nÃ¢ng cáº¥p vá»›i giao diá»‡n gears má»›i vÃ  script kÃ©o cáº¥u hÃ¬nh Ä‘á»™ng trá»±c tiáº¿p tá»« Firestore REST API cá»§a dá»± Ã¡n `thi-tnd`.
- **PhÃ¢n quyá»n Dashboard Há»c viÃªn:** áº¨n cÃ¡c Ã´ thao tÃ¡c nhanh **ThÃ´ng bÃ¡o** vÃ  **Thá»‘ng kÃª** trÃªn Dashboard cá»§a há»c viÃªn, Ä‘á»“ng thá»i cháº·n quyá»n truy cáº­p trá»±c tiáº¿p báº±ng URL Ä‘á»‘i vá»›i hai trang nÃ y (tá»± Ä‘á»™ng chuyá»ƒn hÆ°á»›ng vá» Dashboard náº¿u há»c viÃªn cá»‘ tÃ¬nh nháº­p URL).
- **Tá»‘i Æ°u hÃ³a WeatherWidget hoáº¡t Ä‘á»™ng má»i nÆ¡i:** Tá»± Ä‘á»™ng sá»­ dá»¥ng API production cá»§a domain `https://daotaothuyenvien.com` khi cháº¡y local/dev/offline vÃ  bá»• sung cÆ¡ cháº¿ náº¡p dá»¯ liá»‡u thá»i tiáº¿t giáº£ láº­p (mock fallback) náº¿u API lá»—i Ä‘á»ƒ widget luÃ´n hiá»ƒn thá»‹ á»•n Ä‘á»‹nh.

## [3.10.7] - 2026-06-27
### Tá»‘i Æ°u Vitest, vÃ¡ báº£o máº­t overrides & Äá»“ng bá»™ Ä‘iá»u hÆ°á»›ng Dashboard (Web & App Win)
- **Tá»‘i Æ°u hÃ³a cháº¡y Vitest:** ThÃªm tÃ¹y chá»n `fileParallelism: false` vÃ o cáº¥u hÃ¬nh kiá»ƒm thá»­ cá»§a cáº£ báº£n Web vÃ  Windows Ä‘á»ƒ trÃ¡nh lá»—i treo/timeout worker pool trÃªn Windows, giÃºp giáº£m thá»i gian cháº¡y test tá»« ~70s xuá»‘ng cÃ²n 4.5s.
- **VÃ¡ báº£o máº­t (Dependency Overrides):** Ãp dá»¥ng cÆ¡ cháº¿ overrides á»Ÿ root Ä‘á»ƒ vÃ¡ hoÃ n toÃ n cÃ¡c lá»— há»•ng báº£o máº­t Critical & High (protobufjs, protobufjs-cli, tar, uuid, fast-xml-parser, postcss, glob, @grpc/grpc-js).
- **Äá»“ng bá»™ Ä‘iá»u hÆ°á»›ng Dashboard:**
  - NÃºt **ThÃ´ng bÃ¡o**: Chuyá»ƒn hÆ°á»›ng tá»« `/ontap/mailbox` sang trang quáº£n lÃ½ thÃ´ng bÃ¡o `/ontap/notifications` (Web & Win).
  - NÃºt **Cáº¥u hÃ¬nh**: Chuyá»ƒn hÆ°á»›ng tá»« `/ontap/profile` sang trang cÃ i Ä‘áº·t `/ontap/settings` (Win).
- **Gá»™p cáº¥u hÃ¬nh Monetag:** Gá»™p cáº¥u hÃ¬nh hiá»ƒn thá»‹ quáº£ng cÃ¡o Monetag vÃ o tab "Báº£o vá»‡ Quáº£ng cÃ¡o (IVT Shield)", chuyá»ƒn tá»« báº­t/táº¯t theo role sang cáº¥u hÃ¬nh táº§n suáº¥t chung (sá»‘ láº§n/phiÃªn) trÃªn toÃ n há»‡ thá»‘ng.

## [3.10.6] - 2026-06-26
### TÃ­ch há»£p Widget Thá»i tiáº¿t & Tá»‘i Æ°u hÃ³a hÃ¬nh áº£nh (Web & App Win)
- **TÃ­nh nÄƒng má»›i - Widget Thá»i tiáº¿t ThÃ´ng minh:**
  - Tá»± Ä‘á»™ng Ä‘á»‹nh vá»‹ ngÆ°á»i dÃ¹ng (Browser Geolocation) hoáº·c tá»± Ä‘á»™ng fallback vá» Triá»‡u Viá»‡t VÆ°Æ¡ng, phÆ°á»ng Hoa LÆ°, Ninh BÃ¬nh náº¿u bá»‹ tá»« chá»‘i quyá»n Ä‘á»‹nh vá»‹.
  - TÃ­ch há»£p API Next.js `/api/weather` (WeatherAPI vá»›i cÆ¡ cháº¿ Mock fallback) Ä‘á»ƒ láº¥y dá»¯ liá»‡u thá»i tiáº¿t thá»±c táº¿.
  - Hiá»ƒn thá»‹ nhiá»‡t Ä‘á»™, tráº¡ng thÃ¡i thá»i tiáº¿t hiá»‡n táº¡i kÃ¨m theo lá»i khuyÃªn há»c táº­p, thi cá»­ sinh Ä‘á»™ng báº±ng tiáº¿ng Viá»‡t.
  - Bá»• sung nÃºt má»Ÿ rá»™ng Ä‘á»ƒ xem dá»± bÃ¡o thá»i tiáº¿t chi tiáº¿t trong ngÃ y, ngÃ y mai vÃ  dá»± bÃ¡o 7 ngÃ y.
  - Äá»“ng bá»™ giao diá»‡n widget thÃ­ch á»©ng Mobile vÃ  há»— trá»£ Ä‘áº§y Ä‘á»§ Light/Dark Mode trÃªn cáº£ Web vÃ  App Windows.
- **Tá»‘i Æ°u hÃ¬nh áº£nh Portal:** Thay tháº¿ tháº» `<img>` báº±ng component `<Image>` cá»§a Next.js Ä‘á»ƒ tÄƒng tá»‘c Ä‘á»™ táº£i trang vÃ  giáº£i quyáº¿t triá»‡t Ä‘á»ƒ 22 cáº£nh bÃ¡o linting.
- **Tá»‘i Æ°u hÃ¬nh áº£nh App Web & Win:** Bá»• sung thuá»™c tÃ­nh `loading="lazy"` and `alt` cho toÃ n bá»™ tháº» `<img>` trÃªn á»©ng dá»¥ng Vite cá»§a cáº£ Web vÃ  Windows.
- **Sá»­a lá»—i cÃº phÃ¡p:** Sá»­a lá»—i trÃ¹ng láº·p thuá»™c tÃ­nh `style` trong component `StudentClassView.tsx` phÃ¡t sinh tá»« quÃ¡ trÃ¬nh refactor trÆ°á»›c Ä‘Ã³.

## [3.10.5] - 2026-06-25
### Tá»‘i Æ°u Google AdSense & Báº£o vá»‡ IVT (Web & App Win)
- **Tá»‘i Æ°u AdSense Shield:** Thay Ä‘á»•i cÆ¡ cháº¿ cháº·n click táº·c. Thay vÃ¬ áº©n toÃ n bá»™ quáº£ng cÃ¡o (display: none), chuyá»ƒn sang sá»­ dá»¥ng pointer-events: none Ä‘á»ƒ cháº·n click chuá»™t nhÆ°ng váº«n giá»¯ 100% hiá»ƒn thá»‹ (Active View) nháº±m duy trÃ¬ doanh thu Impression.
- **NÃ¢ng cáº¥p giá»›i háº¡n AdSense:** Quáº£n trá»‹ viÃªn cÃ³ thá»ƒ tÃ¹y chá»‰nh giá»›i háº¡n sá»‘ click vÃ  thá»i gian phá»¥c há»“i (Cooldown) trá»±c tiáº¿p tá»« mÃ n hÃ¬nh "Há»‡ thá»‘ng" thay vÃ¬ hardcode.

## [3.10.4] - 2026-06-25
### Há»‡ Thá»‘ng Báº£o TrÃ¬ 2 Táº§ng (Web & App Win)
- **TÃ­nh nÄƒng 1:** TÃ­ch há»£p cháº¿ Ä‘á»™ báº£o trÃ¬ Má»m (Táº§ng 1) vÃ o App Windows, Ä‘á»“ng bá»™ tráº¡ng thÃ¡i khÃ³a mÃ n hÃ¬nh vá»›i Web.
- **TÃ­nh nÄƒng 2:** ThÃªm trang báº£o trÃ¬ Cá»©ng (Táº§ng 2) dÃ¹ng Vercel Edge Config cho Web.
- **Sá»­a lá»—i 1:** Sá»­a cÃ¡c cáº£nh bÃ¡o báº£o máº­t High severity (npm audit fix) cho Web.
- **Báº£o máº­t:** Cho phÃ©p role admin bypass mÃ n hÃ¬nh báº£o trÃ¬ qua route /ontap/login-admin.

## [3.10.1] - 2026-06-25
### TÃ¡ch biá»‡t Module Quáº£n lÃ½ ThÃ nh viÃªn & Refactor Account Screen (Web & App Win)
- **Trang Quáº£n lÃ½ thÃ nh viÃªn riÃªng biá»‡t (`/ontap/usermanager`):**
  - TÃ¡ch toÃ n bá»™ báº£ng danh sÃ¡ch, bá»™ lá»c, tÃ¬m kiáº¿m vÃ  phÃ¢n trang ngÆ°á»i dÃ¹ng ra khá»i trang cÃ¡ nhÃ¢n thÃ nh má»™t trang quáº£n trá»‹ chuyÃªn biá»‡t má»›i.
  - TÃ­ch há»£p Slide-over Panel xem chi tiáº¿t vÃ  danh sÃ¡ch thiáº¿t bá»‹/phiÃªn Ä‘Äƒng nháº­p Ä‘á»ƒ force logout tá»« xa.
  - Thiáº¿t káº¿ 3 tháº» KPI Stats tá»•ng quan tÃ i khoáº£n (Há»c viÃªn, nhÃ¢n sá»±, bá»‹ khÃ³a) hiá»ƒn thá»‹ tÄ©nh á»Ÿ Ä‘áº§u trang, tá»‘i Æ°u hÃ³a Firestore Read Call.
- **Refactor `AccountScreen` cÃ¡ nhÃ¢n:**
  - Dá»n dáº¹p hoÃ n toÃ n logic vÃ  giao diá»‡n quáº£n trá»‹ thÃ nh viÃªn cÅ© trong `AccountScreen.tsx` á»Ÿ cáº£ Web vÃ  Windows App (code giáº£m tá»« ~809 dÃ²ng xuá»‘ng cÃ²n ~250 dÃ²ng).
  - TÃ­ch há»£p danh sÃ¡ch phiÃªn Ä‘Äƒng nháº­p hoáº¡t Ä‘á»™ng cá»§a chÃ­nh cÃ¡ nhÃ¢n (`AdminSessionList`) hiá»ƒn thá»‹ trá»±c tiáº¿p á»Ÿ cuá»‘i trang há»“ sÆ¡ Ä‘á»ƒ nÃ¢ng cao tráº£i nghiá»‡m báº£o máº­t tá»± phá»¥c vá»¥.
- **TÃ­ch há»£p Dashboard & Quick Actions:**
  - Cáº­p nháº­t `QuickActionsGrid.tsx` vÃ  `Dashboard.tsx` thÃªm nÃºt **"Quáº£n lÃ½ ThÃ nh viÃªn"** vÃ o Dashboard admin (Web & Windows).
  - ÄÄƒng kÃ½ Route `/ontap/usermanager` vÃ  map Ä‘iá»u hÆ°á»›ng trong `App.tsx` á»Ÿ cáº£ 2 phÃ¢n há»‡.
- **Kiá»ƒm thá»­ & Build pass 100%:** XÃ¡c thá»±c biÃªn dá»‹ch TypeScript (`tsc --noEmit`) vÃ  Ä‘Ã³ng gÃ³i `npm run build` thÃ nh cÃ´ng trÃªn cáº£ phÃ¢n há»‡ Web vÃ  Windows.

## [3.10.0] - 2026-06-25
### TÃ­nh nÄƒng Má»›i & Redesign Dashboard (Web & App Win)
- **Thiáº¿t káº¿ láº¡i Admin Dashboard (PhÆ°Æ¡ng Ã¡n C "Hybrid Smart"):**
  - **AdminStatsBar:** TÃ­ch há»£p thanh hiá»ƒn thá»‹ thÃ´ng sá»‘ online slim realtime trá»±c quan á»Ÿ trÃªn cÃ¹ng, thay tháº¿ cho OnlineStatsWidget náº·ng ná».
  - **Giao diá»‡n 2 cá»™t thÃ´ng minh:** 
    - Cá»™t trÃ¡i: Giá»¯ nguyÃªn tháº» há»c viÃªn/giÃ¡o viÃªn (`StudentCard`) vÃ  bá»• sung cÃ¡c nÃºt phá»¥ Ä‘iá»u hÆ°á»›ng nhanh.
    - Cá»™t pháº£i: Lá»i chÃ o thÃ´ng minh theo giá» (`WelcomeHeader`), cÃ¡c nÃºt thao tÃ¡c nhanh dáº¡ng grid tiles (`QuickActionsGrid`).
  - **Tá»‘i Æ°u hiá»‡u nÄƒng (Lazy Loading):** TÃ¡ch widget analytics (`CustomAnalyticsWidget`) thÃ nh chunk táº£i cháº­m (lazy-loaded chunk) chá»‰ táº£i khi admin click má»Ÿ rá»™ng Ä‘á»ƒ tiáº¿t kiá»‡m bÄƒng thÃ´ng táº£i trang ban Ä‘áº§u.
  - **Haptic Feedback:** TÃ­ch há»£p rung pháº£n há»“i (haptics) cho cÃ¡c thao tÃ¡c trÃªn thiáº¿t bá»‹ di Ä‘á»™ng (báº£n Web).
- **Äá»“ng bá»™ hÃ³a Windows App (ontap-win):** Ãp dá»¥ng toÃ n bá»™ cáº¥u trÃºc thiáº¿t káº¿ Dashboard PhÆ°Æ¡ng Ã¡n C sang á»©ng dá»¥ng Windows/Electron Ä‘á»ƒ Ä‘áº£m báº£o tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng nháº¥t quÃ¡n.
- **Sá»­a lá»—i TypeScript:** Sá»­a lá»—i spread types TS2698 liÃªn quan tá»›i thuá»™c tÃ­nh `showPortalAds` trong `UsageConfigPanel.tsx` cá»§a báº£n Windows.

## [3.9.9] - 2026-06-15
- **QA Loop & KhÃ´i phá»¥c há»‡ thá»‘ng:** Cháº¡y láº¡i quy trÃ¬nh build tÃ­ch há»£p vÃ  kiá»ƒm tra cháº¥t lÆ°á»£ng tá»± Ä‘á»™ng Ä‘á»ƒ chuáº©n bá»‹ phÃ¡t hÃ nh.
- **Sáº¯p xáº¿p cáº¥u trÃºc code:** Äá»“ng bá»™ hÃ³a phiÃªn báº£n build cá»§a portal root, ontap-web, vÃ  ontap-win thÃ nh v3.9.9.

## [3.9.8] - 2026-06-13
### Security Upgrades & Performance Tuning (Web & App Win)
- **NÃ¢ng cáº¥p SheetJS an toÃ n:** Chuyá»ƒn Ä‘á»•i thÃ nh cÃ´ng thÆ° viá»‡n Ä‘á»c/ghi Excel tá»« `xlsx` (vÅ© cÅ© lá»—i thá»i) sang thÆ° viá»‡n chÃ­nh thá»©c báº£o máº­t `@sheetjs/xlsx` (v0.20.2) trÃªn toÃ n há»‡ thá»‘ng (bao gá»“m cáº£ root portal, ontap-web vÃ  ontap-win).
- **Next.js Security Patch:** NÃ¢ng cáº¥p Next.js lÃªn báº£n `14.2.43` táº¡i root vÃ  dá»n dáº¹p cÃ i Ä‘áº·t sáº¡ch (`clean install`), giáº£i quyáº¿t triá»‡t Ä‘á»ƒ cÃ¡c lá»— há»•ng báº£o máº­t dependencies vÃ  lá»—i mÃ´i trÆ°á»ng SWC.
- **Tá»‘i Æ°u hÃ³a dung lÆ°á»£ng Bundle (TÃ¡ch Chunk):** Cáº¥u hÃ¬nh manualChunks tÃ¡ch biá»‡t thÆ° viá»‡n `@sheetjs/xlsx` thÃ nh file chunk riÃªng `vendor-xlsx-*.js` (488 kB) trong cáº£ hai cáº¥u hÃ¬nh Vite `ontap-web/vite.config.ts` vÃ  `ontap-win/vite.config.ts`. File bundle chÃ­nh `vendor-*.js` giáº£m tá»« **1.4 MB** xuá»‘ng cÃ²n **907 kB** (tiáº¿t kiá»‡m 35% thá»i gian táº£i trang ban Ä‘áº§u).
- **Tá»‘i Æ°u hÃ³a Next.js Image:** Thay tháº¿ cÃ¡c tháº» `<img>` cÅ© báº±ng `<Image />` tá»‘i Æ°u cá»§a Next.js táº¡i 16 vá»‹ trÃ­ khÃ¡c nhau trong Next.js Portal (trang bÃ i viáº¿t chi tiáº¿t, danh má»¥c, giáº£i trÃ­...) Ä‘á»ƒ nÃ¢ng cao chá»‰ sá»‘ LCP.
- **Sá»­a lá»—i TypeScript & Unit Test:** 
  - Sá»­a lá»—i spread types TS2698 táº¡i `UsageConfigPanel.tsx`.
  - Kháº¯c phá»¥c lá»—i thiáº¿u thÆ° viá»‡n `@capacitor/local-notifications` báº±ng cÃ¡ch cáº­p nháº­t dependency v8.0.1 táº¡i `ontap-web/package.json`.
  - Sá»­a lá»—i cáº£nh bÃ¡o `act(...)` báº¥t Ä‘á»“ng bá»™ báº±ng `waitFor` trong `AccountScreen.test.tsx`, Ä‘Æ°a tá»· lá»‡ test pass Ä‘áº¡t **100% (5/5 PASS)** sáº¡ch cáº£nh bÃ¡o.

## [3.9.7] - 2026-06-12
### Portal Ad Management & System Refactor (Web & App Win)
- **Báº­t/táº¯t quáº£ng cÃ¡o trang chá»§:** TÃ­ch há»£p tÃ­nh nÄƒng dynamic ad toggle cho Next.js Portal homepage tá»« Firestore (settings/usage_config) thÃ´ng qua component client `PortalAdLoader`. Loáº¡i bá» script Adsterra cá»©ng trong `app/layout.tsx`.
- **Äá»“ng bá»™ hÃ³a UI quáº£n trá»‹:** ThÃªm toggle "Quáº£ng cÃ¡o Trang chá»§ & Tin tá»©c" vÃ o tab "Há»‡ thá»‘ng" cá»§a UsageConfigPanel cho vai trÃ² Admin vÃ  LÃ£nh Ä‘áº¡o.
- **Sá»­a lá»—i ESLint Circular Reference:** Kháº¯c phá»¥c lá»—i crash lint báº±ng cÃ¡ch háº¡ cáº¥p package `eslint-config-next` vá» `14.2.35` tÆ°Æ¡ng thÃ­ch, dá»n dáº¹p cÃ¡c files cáº¥u hÃ¬nh thá»«a.
- **Refactor React Hooks:** Sá»­a triá»‡t Ä‘á»ƒ 2 lá»—i useEffect missing dependency vÃ  useCallback trong `tai-khoan/page.tsx` vÃ  `CourseManager.tsx`.
- **Dá»n dáº¹p log rÃ¡c:** XÃ³a bá» log build cÅ© vÃ  táº¡o template `.env.example` cáº¥u hÃ¬nh mÃ´i trÆ°á»ng an toÃ n.
- **VÃ¡ báº£o máº­t:** VÃ¡ lá»— há»•ng `@grpc/grpc-js` báº±ng npm audit fix.

## [3.9.6] - 2026-06-11
### PhÃ¢n TÃ¡ch Cáº¥u HÃ¬nh Ban LÃ£nh Äáº¡o (Web & App Win)
- **PhÃ¢n tÃ¡ch cáº¥u hÃ¬nh vai trÃ²:** PhÃ¢n tÃ¡ch cáº¥u hÃ¬nh giá»›i háº¡n & quyá»n lá»£i giá»¯a **Ban LÃ£nh Äáº¡o** (`leader`) vÃ  **CÃ¡n Bá»™ Quáº£n LÃ½** (`manager`) thÃ nh hai cáº¥u hÃ¬nh Ä‘á»™c láº­p trong database Firestore.
- **Äá»“ng bá»™ hÃ³a giao diá»‡n cáº¥u hÃ¬nh:** TÃ¡ch nÃºt cáº¥u hÃ¬nh há»‡ thá»‘ng thÃ nh hai tab riÃªng biá»‡t: "Ban LÃ£nh Äáº¡o" (key: `leader`) vÃ  "Quáº£n LÃ½" (key: `manager`).
- **Äá»“ng bá»™ Ã¡nh xáº¡ vai trÃ²:** Cáº­p nháº­t hÃ m `getRoleConfigKey` trÃªn toÃ n bá»™ há»‡ thá»‘ng (bao gá»“m AccountScreen, ClassManagementScreen vÃ  Next.js Portal Ä‘Äƒng bÃ i) Ä‘á»ƒ nháº­n diá»‡n Ä‘Ãºng key `leader` khi vai trÃ² lÃ  `lanh_dao`.
- **Sá»­a lá»—i Unit Test:** Kháº¯c phá»¥c lá»—i kiá»ƒu dá»¯ liá»‡u TS2322 cho thuá»™c tÃ­nh `role` trong `AccountScreen.test.tsx`.

## [3.9.5] - 2026-06-11
### Tráº¡ng thÃ¡i TÃ i khoáº£n & Káº¿t thÃºc Lá»›p há»c (Web & App Win)
- **Quáº£n lÃ½ tráº¡ng thÃ¡i tÃ i khoáº£n:** Triá»ƒn khai tráº¡ng thÃ¡i tÃ i khoáº£n (`status: 'active' | 'disabled'`). Cháº·n Ä‘Äƒng nháº­p vÃ  force logout thá»i gian thá»±c khi tÃ i khoáº£n bá»‹ vÃ´ hiá»‡u hÃ³a.
- **Tráº¡ng thÃ¡i lá»›p há»c:** ThÃªm tráº¡ng thÃ¡i lá»›p há»c (`status: 'active' | 'finished'`). Khi káº¿t thÃºc lá»›p há»c, tá»± Ä‘á»™ng vÃ´ hiá»‡u hÃ³a toÃ n bá»™ há»c viÃªn trong lá»›p há»c Ä‘Ã³.
- **Quáº£n lÃ½ há»c viÃªn nÃ¢ng cao:** ThÃªm chá»©c nÄƒng chá»n nhiá»u há»c viÃªn trong lá»›p Ä‘á»ƒ vÃ´ hiá»‡u hÃ³a hÃ ng loáº¡t. ThÃªm badge hiá»ƒn thá»‹ tráº¡ng thÃ¡i tÃ i khoáº£n vÃ  lá»›p há»c.
- **PhÃ¢n quyá»n Ä‘á»™ng má»›i:** ThÃªm phÃ¢n quyá»n `courseDisableAccounts` (VÃ´ hiá»‡u hÃ³a tÃ i khoáº£n há»c viÃªn) vÃ  `courseFinish` (Káº¿t thÃºc / Má»Ÿ láº¡i lá»›p há»c) cho tá»«ng vai trÃ².

## [3.9.4] - 2026-06-11
### Dynamic Permissions & Role Hierarchy (Web & App Win)
- **Há»‡ thá»‘ng phÃ¢n quyá»n Ä‘á»™ng chi tiáº¿t (10 tÃ­nh nÄƒng cá»‘t lÃµi):** TÃ­ch há»£p kiá»ƒm tra quyá»n tá»« cáº¥u hÃ¬nh Firestore (`settings/usage_config`) cho cÃ¡c thao tÃ¡c quáº£n trá»‹ lá»›p há»c, ngÆ°á»i dÃ¹ng, tin tá»©c vÃ  thiáº¿t bá»‹.
- **Trá»ng sá»‘ vai trÃ² (Role Hierarchy):** Ãp dá»¥ng logic so sÃ¡nh trá»ng sá»‘ Ä‘á»ƒ Ä‘áº£m báº£o ngÆ°á»i dÃ¹ng chá»‰ cÃ³ thá»ƒ thao tÃ¡c (Xem, Sá»­a, XÃ³a, Äá»•i vai trÃ², Force logout) trÃªn cÃ¡c tÃ i khoáº£n cÃ³ cáº¥p báº­c vai trÃ² tháº¥p hÆ¡n vai trÃ² hiá»‡n táº¡i cá»§a chÃ­nh mÃ¬nh (`admin` (100) > `lanh_dao` (80) > `quan_ly` (60) > `giao_vien` (40) > `hoc_vien` (20) > `guest` (0)).
- **áº¨n/Hiá»‡n UI theo phÃ¢n quyá»n:**
  - GiÃ¡o viÃªn: Tá»± Ä‘á»™ng áº©n cÃ¡c nÃºt ThÃªm/XÃ³a há»c viÃªn & giÃ¡o viÃªn giáº£ng dáº¡y trong giao diá»‡n Lá»›p há»c (`StudentsTab`, `TeachersTab`) náº¿u cá» `courseAssignMembers` bá»‹ táº¯t.
  - Quáº£n trá»‹ viÃªn & LÃ£nh Ä‘áº¡o: áº¨n nÃºt Sá»­a (`FaEdit`), XÃ³a (`FaTrash`), Reset máº­t kháº©u (`FaKey`) Ä‘á»‘i vá»›i tÃ i khoáº£n ngang hÃ ng hoáº·c cao hÆ¡n. Trong giao diá»‡n chá»‰nh sá»­a, danh sÃ¡ch lá»±a chá»n vai trÃ² má»›i chá»‰ hiá»ƒn thá»‹ cÃ¡c vai trÃ² tháº¥p hÆ¡n ngÆ°á»i Ä‘ang thao tÃ¡c.
  - Quáº£n lÃ½ thiáº¿t bá»‹: áº¨n danh sÃ¡ch phiÃªn vÃ  nÃºt ÄÄƒng xuáº¥t tá»« xa (`AdminSessionList`) Ä‘á»‘i vá»›i tÃ i khoáº£n khÃ´ng thuá»™c cáº¥p dÆ°á»›i hoáº·c náº¿u thiáº¿u quyá»n `userForceLogoutOthers`.
- **CÆ¡ cháº¿ XÃ³a má»m (Soft Delete) tÃ i khoáº£n:** Thay Ä‘á»•i hÃ nh Ä‘á»™ng xÃ³a tÃ i khoáº£n trong Firestore thÃ nh XÃ³a má»m báº±ng cÃ¡ch cáº­p nháº­t `status: 'deleted'`. Client khi hoáº¡t Ä‘á»™ng sáº½ tá»± Ä‘á»™ng phÃ¡t hiá»‡n tráº¡ng thÃ¡i nÃ y vÃ  thá»±c hiá»‡n Ä‘Äƒng xuáº¥t.

## [3.9.3] - 2026-06-11
### Security & Role Authorization (Web & App Win)
- **Báº£o máº­t Ä‘á» thi Ä‘á»™ng (Cháº·n Copy, BÃ´i Ä‘en, Chuá»™t pháº£i & PhÃ­m táº¯t):** Tá»± Ä‘á»™ng Ã¡p dá»¥ng cáº¥m chuá»™t pháº£i, bÃ´i Ä‘en, copy vÃ  phÃ­m táº¯t (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong cÃ¡c mÃ n hÃ¬nh thi/lÃ m bÃ i (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dá»±a trÃªn cáº¥u hÃ¬nh `preventCopy` Ä‘á»™ng cá»§a tá»«ng vai trÃ² Ä‘Æ°á»£c táº£i theo thá»i gian thá»±c tá»« Firestore.
- **PhÃ¢n quyá»n cáº¥u hÃ¬nh Ä‘á»™ng:** 
  - Admin cÃ³ toÃ n quyá»n Ä‘iá»u chá»‰nh giá»›i háº¡n vÃ  chÃ­nh sÃ¡ch báº£o máº­t cá»§a toÃ n bá»™ vai trÃ².
  - LÃ£nh Ä‘áº¡o (`lanh_dao`) Ä‘Æ°á»£c quyá»n chá»‰nh sá»­a cáº¥u hÃ¬nh cÃ¡c vai trÃ² cáº¥p dÆ°á»›i, riÃªng tab cáº¥u hÃ¬nh cá»§a Admin sáº½ á»Ÿ tráº¡ng thÃ¡i Chá»‰ xem (Read-only) vÃ  khÃ´ng cho LÃ£nh Ä‘áº¡o chá»‰nh sá»­a.
- **Äá»“ng bá»™ hÃ³a Route:** Truyá»n `userProfile` prop vÃ o `UsageConfigPanel` táº¡i Route `/ontap/cauhinh` Ä‘á»ƒ xÃ¡c thá»±c phÃ¢n quyá»n chÃ­nh xÃ¡c.

## [3.9.2] - 2026-06-11
### Security & Role Authorization (Legacy)
- **KhÃ³a chuá»™t pháº£i báº£o máº­t (App Win & Web)**:
  - TrÃªn App Win (Electron): KhÃ³a chuá»™t pháº£i toÃ n cá»¥c Ä‘á»‘i vá»›i há»c viÃªn vÃ  tÃ i khoáº£n thÆ°á»ng Ä‘á»ƒ trÃ¡nh rÃ² rá»‰ mÃ£ nguá»“n vÃ  dá»¯ liá»‡u. Cho phÃ©p tÃ i khoáº£n `admin` sá»­ dá»¥ng Ä‘á»ƒ debug.
  - TrÃªn Web: KhÃ³a chuá»™t pháº£i táº¡i 4 mÃ n hÃ¬nh thi/lÃ m bÃ i vÃ  giÃ¡m kháº£o (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) Ä‘á»ƒ chá»‘ng gian láº­n thi cá»­. Bá» qua cháº·n Ä‘á»‘i vá»›i tÃ i khoáº£n `admin`.
- **Äá»“ng bá»™ tiáº¿n Ä‘á»™**: LÆ°u trá»¯ tiáº¿n Ä‘á»™ thÃ´ng qua `/save_brain`, cáº­p nháº­t handover vÃ  dá»¯ liá»‡u bá»™ nhá»› tÄ©nh/Ä‘á»™ng (`brain.json`, `session.json`).

## [3.8.0] - 2026-03-29
### Fixed
- **Há»‡ thá»‘ng Ã”n táº­p Windows (Electron)**: Kháº¯c phá»¥c lá»—i **MÃ n hÃ¬nh tráº¯ng (ReferenceError: Award is not defined)** báº±ng cÃ¡ch bá»• sung import icon `Award` cÃ²n thiáº¿u trong `TopNavbar.tsx`.
- **á»”n Ä‘á»‹nh hÃ³a há»‡ thá»‘ng**: ÄÃ£ thá»±c hiá»‡n build vÃ  kiá»ƒm thá»­ (`npm run build`) trong thÆ° má»¥c `ontap-win` Ä‘áº£m báº£o á»©ng dá»¥ng khÃ´ng cÃ²n bá»‹ crash khi render.

### Changed
- **Báº£o máº­t & Tráº£i nghiá»‡m**: VÃ´ hiá»‡u hÃ³a tÃ­nh nÄƒng tá»± Ä‘á»™ng má»Ÿ DevTools khi khá»Ÿi Ä‘á»™ng app vÃ  áº©n nÃºt chuyá»ƒn Ä‘á»•i DevTools trong giao diá»‡n chÃ­nh (nháº±m háº¡n cháº¿ can thiá»‡p ká»¹ thuáº­t F12 theo yÃªu cáº§u).
- **PhÃ¢n tÃ­ch dá»¯ liá»‡u**: XÃ¡c Ä‘á»‹nh chÃ­nh xÃ¡c nguá»“n dá»¯ liá»‡u cÃ¢u há»i offline náº±m táº¡i `ontap-win/data/questions_db.json`.

## [3.7.0] - 2026-03-29 (Android)
### Android Optimization Phases
- **Phase 04 (Visual)**: Äá»“ng bá»™ mÃ u sáº¯c há»‡ thá»‘ng Android (Indigo #4f46e5) vÃ  tá»‘i Æ°u hÃ³a SplashScreen. ÄÃ£ Ä‘á»“ng bá»™ `colors.xml` trá»±c tiáº¿p vÃ o dá»± Ã¡n Android Studio.
- **Phase 05 (Security & Core)**: 
    - TÃ­ch há»£p **KhÃ³a Sinh tráº¯c há»c (Fingerprint/FaceID)** báº£o vá»‡ á»©ng dá»¥ng ngay tá»« khi khá»Ÿi Ä‘á»™ng.
    - Há»‡ thá»‘ng **ThÃ´ng bÃ¡o Nháº¯c há»c (Daily Reminders)** giÃºp há»c viÃªn khÃ´ng bá» lá»¡ bÃ i vá»Ÿ.
    - `NativeSettingsModal`: Trung tÃ¢m quáº£n lÃ½ cÃ¡c tÃ­nh nÄƒng pháº§n cá»©ng thiáº¿t bá»‹.
- **Phase 06 (Assets)**: Tá»‘i Æ°u hÃ³a toÃ n bá»™ tÃ i nguyÃªn hÃ¬nh áº£nh. Giáº£m kÃ­ch thÆ°á»›c Icon (5.4MB -> ~100KB) vÃ  Splash Screen (8.3MB -> 2.7MB) giÃºp APK nháº¹ hÆ¡n vÃ  khá»Ÿi Ä‘á»™ng nhanh hÆ¡n. TÃ¡i táº¡o bá»™ resource icon/splash Ä‘Ãºng chuáº©n Android.

## [3.6.0] - 2026-03-15
### Added
- TÃ­ch há»£p `@capacitor/haptics` vÃ  `@capacitor/app` cho pháº£n há»“i xÃºc giÃ¡c (Haptics) vÃ  cáº¥u hÃ¬nh Ä‘iá»u hÆ°á»›ng NÃºt Back váº­t lÃ½ cho Android.
- Khá»Ÿi táº¡o `utils/nativeUX.ts` quáº£n lÃ½ logic tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng trÃªn thiáº¿t bá»‹ di Ä‘á»™ng (Native-like).
- `verify_encryption.js` ká»‹ch báº£n kiá»ƒm thá»­ Ä‘á»™c láº­p cho há»‡ thá»‘ng giáº£i mÃ£.

### Changed
- Refactor phÆ°Æ¡ng phÃ¡p lÆ°u máº­t kháº©u á»Ÿ client: Chuyá»ƒn Ä‘á»•i tá»« XOR plaintext sang **Web Crypto API (AES-GCM 256-bit)** vá»›i PBKDF2 Master Key, cÆ°á»ng hÃ³a Ä‘Ã¡ng ká»ƒ Ä‘á»™ báº£o máº­t dá»¯ liá»‡u lÆ°u á»Ÿ trÃ¬nh duyá»‡t.
- TÃ¡i cáº¥u trÃºc logic gá»i Gemini API: Dá»‹ch chuyá»ƒn tá»« gá»i trá»±c tiáº¿p á»Ÿ frontend sang gá»i qua **Proxy backend (`/api/ai/gemini`)** cháº·n hoÃ n toÃ n nguy cÆ¡ rÃ² rá»‰ API Keys ra public.

### Security
- Kháº¯c phá»¥c nguy cÆ¡ lá»™ Gemini API Key nghiÃªm trá»ng. ToÃ n bá»™ logic kiá»ƒm tra vÃ  generateContent hiá»‡n táº¡i Ä‘Ã£ thá»±c thi ngáº§m á»Ÿ Node server thay vÃ¬ client.
- XÃ³a bá» Ä‘iá»ƒm yáº¿u mÃ£ hÃ³a XOR cÃ³ thá»ƒ dá»… dÃ ng bá»‹ báº» khÃ³a trong Local Storage Ä‘á»‘i vá»›i "Ghi nhá»› tÃ i khoáº£n".


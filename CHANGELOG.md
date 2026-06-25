# Changelog

## [3.10.5] - 2026-06-25
### Tối ưu Google AdSense & Bảo vệ IVT (Web & App Win)
- **Tối ưu AdSense Shield:** Thay đổi cơ chế chặn click tặc. Thay vì ẩn toàn bộ quảng cáo (display: none), chuyển sang sử dụng pointer-events: none để chặn click chuột nhưng vẫn giữ 100% hiển thị (Active View) nhằm duy trì doanh thu Impression.
- **Nâng cấp giới hạn AdSense:** Quản trị viên có thể tùy chỉnh giới hạn số click và thời gian phục hồi (Cooldown) trực tiếp từ màn hình "Hệ thống" thay vì hardcode.
## [3.11.0] - 2026-06-25
### TÃ­ch há»£p & Tá»‘i Æ°u hÃ³a Kiáº¿m tiá»n Monetag (Web & App Win)
- **Chiáº¿n lÆ°á»£c Quáº£ng cÃ¡o Äa dáº¡ng:** TÃ­ch há»£p Smart Tag (Vignette/Interstitial), Auto Popunder (giá»›i háº¡n 1 láº§n/phiÃªn), vÃ  Direct Link Ä‘á»ƒ tá»‘i Æ°u hÃ³a doanh thu tá»« CPM/eCPM cho thá»‹ trÆ°á»ng Viá»‡t Nam.
- **Dynamic Config qua Firebase:** Cho phÃ©p Admin thay Ä‘á»•i URL Direct Link Ä‘á»™ng trá»±c tiáº¿p tá»« mÃ n hÃ¬nh "Há»‡ thá»‘ng" thay vÃ¬ hardcode.
- **PhÃ¢n bá»• theo Vai trÃ² (RoleConfig):** Cho phÃ©p báº­t/táº¯t riÃªng biá»‡t cÃ¡c Ä‘á»‹nh dáº¡ng Popunder, Direct Link, Countdown Ad theo tá»«ng háº¡ng tÃ i khoáº£n (Free, Verified, VIP).
- **Tráº£i nghiá»‡m chá» thÃ´ng minh:** Bá»• sung mÃ n hÃ¬nh chá» Ä‘áº¿m ngÆ°á»£c `CountdownAdScreen` (5 giÃ¢y) trÆ°á»›c khi xem káº¿t quáº£ thi Ä‘á»ƒ hiá»ƒn thá»‹ quáº£ng cÃ¡o Interstitial hiá»‡u quáº£. (Tá»± Ä‘á»™ng vÃ´ hiá»‡u hÃ³a trÃªn mÃ´i trÆ°á»ng Electron/Windows).
- **Service Worker Anti-Adblock:** TÃ­ch há»£p `sw.js` nháº±m giáº£m tá»· lá»‡ quáº£ng cÃ¡o bá»‹ cháº·n bá»Ÿi cÃ¡c trÃ¬nh duyá»‡t vÃ  extension.

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

## [2026-06-11] (Legacy)
### Security & Role Authorization
- **KhÃ³a chuá»™t pháº£i báº£o máº­t (App Win & Web)**:
  - TrÃªn App Win (Electron): KhÃ³a chuá»™t pháº£i toÃ n cá»¥c Ä‘á»‘i vá»›i há»c viÃªn vÃ  tÃ i khoáº£n thÆ°á»ng Ä‘á»ƒ trÃ¡nh rÃ² rá»‰ mÃ£ nguá»“n vÃ  dá»¯ liá»‡u. Cho phÃ©p tÃ i khoáº£n `admin` sá»­ dá»¥ng Ä‘á»ƒ debug.
  - TrÃªn Web: KhÃ³a chuá»™t pháº£i táº¡i 4 mÃ n hÃ¬nh thi/lÃ m bÃ i vÃ  giÃ¡m kháº£o (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) Ä‘á»ƒ chá»‘ng gian láº­n thi cá»­. Bá» qua cháº·n Ä‘á»‘i vá»›i tÃ i khoáº£n `admin`.
- **Äá»“ng bá»™ tiáº¿n Ä‘á»™**: LÆ°u trá»¯ tiáº¿n Ä‘á»™ thÃ´ng qua `/save_brain`, cáº­p nháº­t handover vÃ  dá»¯ liá»‡u bá»™ nhá»› tÄ©nh/Ä‘á»™ng (`brain.json`, `session.json`).

## [2026-03-29]
### Fixed
- **Há»‡ thá»‘ng Ã”n táº­p Windows (Electron)**: Kháº¯c phá»¥c lá»—i **MÃ n hÃ¬nh tráº¯ng (ReferenceError: Award is not defined)** báº±ng cÃ¡ch bá»• sung import icon `Award` cÃ²n thiáº¿u trong `TopNavbar.tsx`.
- **á»”n Ä‘á»‹nh hÃ³a há»‡ thá»‘ng**: ÄÃ£ thá»±c hiá»‡n build vÃ  kiá»ƒm thá»­ (`npm run build`) trong thÆ° má»¥c `ontap-win` Ä‘áº£m báº£o á»©ng dá»¥ng khÃ´ng cÃ²n bá»‹ crash khi render.

### Changed
- **Báº£o máº­t & Tráº£i nghiá»‡m**: VÃ´ hiá»‡u hÃ³a tÃ­nh nÄƒng tá»± Ä‘á»™ng má»Ÿ DevTools khi khá»Ÿi Ä‘á»™ng app vÃ  áº©n nÃºt chuyá»ƒn Ä‘á»•i DevTools trong giao diá»‡n chÃ­nh (nháº±m háº¡n cháº¿ can thiá»‡p ká»¹ thuáº­t F12 theo yÃªu cáº§u).
- **PhÃ¢n tÃ­ch dá»¯ liá»‡u**: XÃ¡c Ä‘á»‹nh chÃ­nh xÃ¡c nguá»“n dá»¯ liá»‡u cÃ¢u há»i offline náº±m táº¡i `ontap-win/data/questions_db.json`.

## [2026-03-29] - Android Optimization Phases
- **Phase 04 (Visual)**: Äá»“ng bá»™ mÃ u sáº¯c há»‡ thá»‘ng Android (Indigo #4f46e5) vÃ  tá»‘i Æ°u hÃ³a SplashScreen. ÄÃ£ Ä‘á»“ng bá»™ `colors.xml` trá»±c tiáº¿p vÃ o dá»± Ã¡n Android Studio.
- **Phase 05 (Security & Core)**: 
    - TÃ­ch há»£p **KhÃ³a Sinh tráº¯c há»c (Fingerprint/FaceID)** báº£o vá»‡ á»©ng dá»¥ng ngay tá»« khi khá»Ÿi Ä‘á»™ng.
    - Há»‡ thá»‘ng **ThÃ´ng bÃ¡o Nháº¯c há»c (Daily Reminders)** giÃºp há»c viÃªn khÃ´ng bá» lá»¡ bÃ i vá»Ÿ.
    - `NativeSettingsModal`: Trung tÃ¢m quáº£n lÃ½ cÃ¡c tÃ­nh nÄƒng pháº§n cá»©ng thiáº¿t bá»‹.
- **Phase 06 (Assets)**: Tá»‘i Æ°u hÃ³a toÃ n bá»™ tÃ i nguyÃªn hÃ¬nh áº£nh. Giáº£m kÃ­ch thÆ°á»›c Icon (5.4MB -> ~100KB) vÃ  Splash Screen (8.3MB -> 2.7MB) giÃºp APK nháº¹ hÆ¡n vÃ  khá»Ÿi Ä‘á»™ng nhanh hÆ¡n. TÃ¡i táº¡o bá»™ resource icon/splash Ä‘Ãºng chuáº©n Android.

## [2026-03-15]
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
## [3.10.4] - 2026-06-25
### Há»‡ Thá»‘ng Báº£o TrÃ¬ 2 Táº§ng (Web & App Win)
- **TÃ­nh nÄƒng 1:** TÃ­ch há»£p cháº¿ Ä‘á»™ báº£o trÃ¬ Má»m (Táº§ng 1) vÃ o App Windows, Ä‘á»“ng bá»™ tráº¡ng thÃ¡i khÃ³a mÃ n hÃ¬nh vá»›i Web.
- **TÃ­nh nÄƒng 2:** ThÃªm trang báº£o trÃ¬ Cá»©ng (Táº§ng 2) dÃ¹ng Vercel Edge Config cho Web.
- **Sá»­a lá»—i 1:** Sá»­a cÃ¡c cáº£nh bÃ¡o báº£o máº­t High severity (npm audit fix) cho Web.
- **Báº£o máº­t:** Cho phÃ©p role admin bypass mÃ n hÃ¬nh báº£o trÃ¬ qua route /ontap/login-admin.



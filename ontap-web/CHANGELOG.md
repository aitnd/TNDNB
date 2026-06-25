# CHANGELOG â€” [ontap-web]

## [3.11.0] - 2026-06-25 - TÃ­ch há»£p vÃ  Tá»‘i Æ°u hÃ³a Kiáº¿m tiá»n Monetag
- **Chiáº¿n lÆ°á»£c Quáº£ng cÃ¡o Äa dáº¡ng:** TÃ­ch há»£p Smart Tag (Vignette/Interstitial), Auto Popunder (giá»›i háº¡n 1 láº§n/phiÃªn), vÃ  Direct Link Ä‘á»ƒ tá»‘i Æ°u hÃ³a doanh thu tá»« CPM/eCPM.
- **Dynamic Config qua Firebase:** Cho phÃ©p Admin thay Ä‘á»•i URL Direct Link Ä‘á»™ng trá»±c tiáº¿p tá»« mÃ n hÃ¬nh "Há»‡ thá»‘ng" thay vÃ¬ hardcode, phÃ¢n bá»• linh hoáº¡t theo tá»«ng háº¡ng tÃ i khoáº£n (RoleConfig).
- **Tráº£i nghiá»‡m chá» thÃ´ng minh:** Bá»• sung mÃ n hÃ¬nh chá» `CountdownAdScreen` (5 giÃ¢y) trÆ°á»›c khi xem káº¿t quáº£ thi Ä‘á»ƒ táº­n dá»¥ng hiá»ƒn thá»‹ quáº£ng cÃ¡o toÃ n mÃ n hÃ¬nh.
- **Service Worker Anti-Adblock:** TÃ­ch há»£p `sw.js` vÃ o thÆ° má»¥c public nháº±m giáº£m tá»· lá»‡ quáº£ng cÃ¡o bá»‹ cháº·n bá»Ÿi cÃ¡c trÃ¬nh duyá»‡t vÃ  extension adblocker.

## [3.10.0] - 2026-06-25 - Thiáº¿t káº¿ láº¡i Admin Dashboard
- **AdminStatsBar:** Thanh hiá»ƒn thá»‹ thÃ´ng sá»‘ online slim realtime trá»±c quan á»Ÿ trÃªn cÃ¹ng.
- **Giao diá»‡n 2 cá»™t thÃ´ng minh:**
  - Cá»™t trÃ¡i: Tháº» há»c viÃªn/giÃ¡o viÃªn (`StudentCard`) Ä‘Æ°á»£c giá»¯ nguyÃªn, káº¿t há»£p thÃªm cÃ¡c nÃºt phá»¥ Ä‘iá»u hÆ°á»›ng nhanh.
  - Cá»™t pháº£i: Lá»i chÃ o thÃ´ng minh theo giá» (`WelcomeHeader`), cÃ¡c nÃºt thao tÃ¡c nhanh dáº¡ng grid tiles (`QuickActionsGrid`).
- **Haptic Feedback:** TÃ­ch há»£p rung pháº£n há»“i (haptics) cho cÃ¡c thao tÃ¡c trÃªn thiáº¿t bá»‹ di Ä‘á»™ng.
- **Tá»‘i Æ°u hiá»‡u nÄƒng (Lazy Loading):** TÃ¡ch widget analytics (`CustomAnalyticsWidget`) thÃ nh chunk táº£i cháº­m (lazy-loaded chunk) chá»‰ táº£i khi admin click má»Ÿ rá»™ng Ä‘á»ƒ tiáº¿t kiá»‡m bÄƒng thÃ´ng táº£i trang ban Ä‘áº§u.

## [3.9.9] - 2026-06-15 - Sá»­a lá»—i & ÄÃ³ng gÃ³i Phá»¥c há»“i
- **Äá»“ng bá»™ hÃ³a phiÃªn báº£n:** Cáº­p nháº­t phiÃªn báº£n lÃªn v3.9.9 Ä‘á»ƒ Ä‘á»“ng bá»™ vá»›i root portal vÃ  ontap-win.
- **QA & Testing:** Khá»Ÿi cháº¡y vÃ  xÃ¡c minh cháº¥t lÆ°á»£ng sáº£n pháº©m chuáº©n bá»‹ deploy.

## [3.9.8] - 2026-06-13 - NÃ¢ng cáº¥p báº£o máº­t & TÃ¡ch Chunk Tá»‘i Æ°u
- **NÃ¢ng cáº¥p SheetJS an toÃ n:** Chuyá»ƒn Ä‘á»•i thÃ nh cÃ´ng thÆ° viá»‡n Ä‘á»c/ghi Excel tá»« `xlsx` (báº£n cÅ© lá»—i thá»i) sang thÆ° viá»‡n chÃ­nh thá»©c báº£o máº­t `@sheetjs/xlsx` (v0.20.2) trÃªn toÃ n há»‡ thá»‘ng.
- **Tá»‘i Æ°u hÃ³a dung lÆ°á»£ng Bundle (TÃ¡ch Chunk Vite):** Cáº¥u hÃ¬nh manualChunks tÃ¡ch biá»‡t thÆ° viá»‡n `@sheetjs/xlsx` thÃ nh file chunk riÃªng `vendor-xlsx-*.js` (488 kB) trong cáº£ hai cáº¥u hÃ¬nh Vite `ontap-web/vite.config.ts` vÃ  `ontap-win/vite.config.ts`. File bundle chÃ­nh `vendor-*.js` giáº£m tá»« **1.4 MB** xuá»‘ng cÃ²n **907 kB** (tiáº¿t kiá»‡m 35% dung lÆ°á»£ng táº£i ban Ä‘áº§u).
- **Kháº¯c phá»¥c lá»—i biÃªn dá»‹ch TypeScript:**
  - Äá»‹nh nghÄ©a tÆ°á»ng minh kiá»ƒu `RoleKey` loáº¡i bá» boolean `showPortalAds` Ä‘á»ƒ sá»­a lá»—i spread types TS2698 táº¡i `UsageConfigPanel.tsx`.
  - Kháº¯c phá»¥c lá»—i thiáº¿u thÆ° viá»‡n `@capacitor/local-notifications` báº±ng cÃ¡ch cáº­p nháº­t dependency v8.0.1 táº¡i `ontap-web/package.json`.
- **Sá»­a lá»—i Unit Test:** Bá»c `await waitFor` trong file test `AccountScreen.test.tsx` Ä‘á»ƒ xá»­ lÃ½ cáº£nh bÃ¡o `act(...)` báº¥t Ä‘á»“ng bá»™ cá»§a React, Ä‘Æ°a tá»· lá»‡ test pass Ä‘áº¡t **100% (5/5 PASS)** sáº¡ch cáº£nh bÃ¡o.

## [3.9.7] - 2026-06-12 - Triá»ƒn Khai Quáº£ng CÃ¡o Portal & Refactor
- **Triá»ƒn khai cáº¥u hÃ¬nh quáº£ng cÃ¡o Portal:** Bá»• sung cáº¥u hÃ¬nh `showPortalAds` trong Admin Panel cho phÃ©p báº­t/táº¯t quáº£ng cÃ¡o trÃªn Next.js Portal trang chá»§ & tin tá»©c tá»« Firestore.
- **Äá»“ng bá»™ hÃ³a UI quáº£n trá»‹:** ThÃªm toggle "Quáº£ng cÃ¡o Trang chá»§ & Tin tá»©c" vÃ o tab "Há»‡ thá»‘ng" cá»§a UsageConfigPanel cho vai trÃ² Admin vÃ  LÃ£nh Ä‘áº¡o.
- **Tá»‘i Æ°u hÃ³a Code (Refactor React Hooks):** 
  - Sá»­a lá»—i thiáº¿u dependency useEffect trong `CourseManager.tsx` báº±ng cÃ¡ch tÃ¡ch biá»‡t logic cáº­p nháº­t `viewingCourse` vÃ  Firestore listener.
  - Sá»­a lá»—i useEffect trong `tai-khoan/page.tsx` báº±ng `useCallback` cho `fetchSessions`.
- **VÃ¡ báº£o máº­t tá»± Ä‘á»™ng:** VÃ¡ lá»— há»•ng cá»§a thÆ° viá»‡n `@grpc/grpc-js` báº±ng `npm audit fix`.

## [3.9.6] - 2026-06-11 - PhÃ¢n TÃ¡ch Cáº¥u HÃ¬nh Ban LÃ£nh Äáº¡o
- **PhÃ¢n tÃ¡ch cáº¥u hÃ¬nh vai trÃ²:** PhÃ¢n tÃ¡ch cáº¥u hÃ¬nh giá»›i háº¡n & quyá»n lá»£i giá»¯a **Ban LÃ£nh Äáº¡o** (`leader`) vÃ  **CÃ¡n Bá»™ Quáº£n LÃ½** (`manager`) thÃ nh hai cáº¥u hÃ¬nh Ä‘á»™c láº­p trong database Firestore.
- **Äá»“ng bá»™ hÃ³a giao diá»‡n cáº¥u hÃ¬nh:** TÃ¡ch nÃºt cáº¥u hÃ¬nh há»‡ thá»‘ng thÃ nh hai tab riÃªng biá»‡t: "Ban LÃ£nh Äáº¡o" (key: `leader`) vÃ  "Quáº£n LÃ½" (key: `manager`).
- **Äá»“ng bá»™ Ã¡nh xáº¡ vai trÃ²:** Cáº­p nháº­t hÃ m `getRoleConfigKey` trÃªn toÃ n bá»™ há»‡ thá»‘ng (bao gá»“m AccountScreen, ClassManagementScreen vÃ  Next.js Portal Ä‘Äƒng bÃ i) Ä‘á»ƒ nháº­n diá»‡n Ä‘Ãºng key `leader` khi vai trÃ² lÃ  `lanh_dao`.
- **Sá»­a lá»—i Unit Test:** Kháº¯c phá»¥c lá»—i kiá»ƒu dá»¯ liá»‡u TS2322 cho thuá»™c tÃ­nh `role` trong `AccountScreen.test.tsx`.

## [3.9.5] - 2026-06-11 - Tráº¡ng thÃ¡i TÃ i khoáº£n & Káº¿t thÃºc Lá»›p há»c
- **Quáº£n lÃ½ tráº¡ng thÃ¡i tÃ i khoáº£n:** Triá»ƒn khai tráº¡ng thÃ¡i tÃ i khoáº£n (`status: 'active' | 'disabled'`). Cháº·n Ä‘Äƒng nháº­p vÃ  force logout thá»i gian thá»±c khi tÃ i khoáº£n bá»‹ vÃ´ hiá»‡u hÃ³a. NgÄƒn tá»± táº¡o profile Firestore khi Ä‘Äƒng nháº­p khÃ´ng profile.
- **Tráº¡ng thÃ¡i lá»›p há»c:** ThÃªm tráº¡ng thÃ¡i lá»›p há»c (`status: 'active' | 'finished'`). Khi káº¿t thÃºc lá»›p há»c, tá»± Ä‘á»™ng vÃ´ hiá»‡u hÃ³a toÃ n bá»™ há»c viÃªn trong lá»›p há»c Ä‘Ã³. Há»— trá»£ má»Ÿ láº¡i lá»›p há»c.
- **Quáº£n lÃ½ há»c viÃªn nÃ¢ng cao:** ThÃªm chá»©c nÄƒng chá»n nhiá»u há»c viÃªn trong lá»›p Ä‘á»ƒ vÃ´ hiá»‡u hÃ³a hÃ ng loáº¡t. ThÃªm badge hiá»ƒn thá»‹ tráº¡ng thÃ¡i tÃ i khoáº£n vÃ  lá»›p há»c, lÃ m má» tÃ i khoáº£n bá»‹ vÃ´ hiá»‡u hÃ³a.
- **PhÃ¢n quyá»n Ä‘á»™ng má»›i:** ThÃªm phÃ¢n quyá»n `courseDisableAccounts` (VÃ´ hiá»‡u hÃ³a tÃ i khoáº£n há»c viÃªn) vÃ  `courseFinish` (Káº¿t thÃºc / Má»Ÿ láº¡i lá»›p há»c) cho tá»«ng vai trÃ².
- **Äá»“ng bá»™ AccountScreen:** Chuyá»ƒn Ä‘á»•i tráº¡ng thÃ¡i xÃ³a má»m thÃ nh `'disabled'` Ä‘á»“ng bá»™, há»— trá»£ badge hiá»ƒn thá»‹ vÃ  nÃºt kÃ­ch hoáº¡t láº¡i tÃ i khoáº£n.

## [3.9.3] - 2026-06-11 - Security Protection & Dynamic Roles Config
- **Báº£o máº­t Ä‘á» thi Ä‘á»™ng:** Triá»ƒn khai tÃ­nh nÄƒng cáº¥m chuá»™t pháº£i, bÃ´i Ä‘en, copy vÃ  phÃ­m táº¯t (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong cÃ¡c mÃ n hÃ¬nh thi/lÃ m bÃ i (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dá»±a trÃªn thuá»™c tÃ­nh cáº¥u hÃ¬nh `preventCopy` Ä‘á»™ng cá»§a tá»«ng vai trÃ² tá»« database.
- **Realtime Security Policies:** Láº¯ng nghe cáº¥u hÃ¬nh báº£o máº­t `settings/usage_config` theo thá»i gian thá»±c báº±ng `onSnapshot` Ä‘á»ƒ thay Ä‘á»•i chÃ­nh sÃ¡ch báº£o máº­t ngay láº­p tá»©c khi Admin Ä‘iá»u chá»‰nh cáº¥u hÃ¬nh mÃ  khÃ´ng cáº§n reload á»©ng dá»¥ng.
- **PhÃ¢n quyá»n cáº¥u hÃ¬nh Ä‘á»™ng:** 
  - Admin cÃ³ toÃ n quyá»n chá»‰nh sá»­a giá»›i háº¡n vÃ  chÃ­nh sÃ¡ch báº£o máº­t cho táº¥t cáº£ cÃ¡c vai trÃ².
  - LÃ£nh Ä‘áº¡o (`lanh_dao`) cÃ³ quyá»n sá»­a cho cÃ¡c vai trÃ² cáº¥p dÆ°á»›i, riÃªng tab cáº¥u hÃ¬nh cá»§a Admin sáº½ hiá»ƒn thá»‹ á»Ÿ dáº¡ng Chá»‰ Ä‘á»c (Read-only), ngÄƒn cáº£n LÃ£nh Ä‘áº¡o can thiá»‡p vÃ o vai trÃ² Quáº£n trá»‹ viÃªn tá»‘i cao.
- **Äá»“ng bá»™ hÃ³a Route:** Truyá»n `userProfile` prop vÃ o `UsageConfigPanel` táº¡i Route `/ontap/cauhinh` Ä‘á»ƒ xÃ¡c thá»±c phÃ¢n quyá»n chÃ­nh xÃ¡c.

## [3.9.2] - 2026-03-29 - Premium Native Experience
- **UI/UX Native Overhaul**: Thiáº¿t káº¿ láº¡i toÃ n bá»™ giao diá»‡n theo phong cÃ¡ch Native Mobile cao cáº¥p (Premium Cards, 3D icons, Apple-style spacing).
- **Haptic Feedback**: TÃ­ch há»£p rung pháº£n há»“i (Vibration) cho má»i tÆ°Æ¡ng tÃ¡c (Báº¥m nÃºt, ná»™p bÃ i, káº¿t quáº£ thi).
- **Mobile Navigation**: Thanh Ä‘iá»u hÆ°á»›ng dÆ°á»›i chÃ¢n mÃ n hÃ¬nh (Bottom Bar) chuáº©n Mobile UI.
- **Enhanced Quiz Engine**: TÃ¡ch biá»‡t rÃµ rÃ ng cháº¿ Ä‘á»™ "Ã”n táº­p" vÃ  "Thi thá»­ mÃ´ phá»ng" vá»›i bá»™ phÃ­m Ä‘iá»u hÆ°á»›ng tá»‘i Æ°u cho ngÃ³n cÃ¡i.
- **Premium Animations**: Há»‡ thá»‘ng chuyá»ƒn cáº£nh mÆ°á»£t mÃ  (Slide-up, Scale-up, Float) tá»‘i Æ°u cho cáº£m giÃ¡c Native App.
- **Bug Fixes**: Sá»­a lá»—i so sÃ¡nh phiÃªn báº£n vÃ  Ä‘á»“ng bá»™ Electron-updater.

## [3.9.1] - 2026-03-22 - Äá»“ng bá»™ hÃ³a Props vÃ  Type Error Fix
- **ClassDetailClient.tsx**: Sá»­a lá»—i Type Error vÃ  Ä‘á»“ng bá»™ hÃ³a há»‡ thá»‘ng Props (thay `classData` báº±ng `course`).

## [3.9.0] - 2026-03-18 - Lá»›p Há»c & Analytics
- **Analytics**: TÃ­ch há»£p Vercel Analytics Ä‘á»ƒ theo dÃµi Performance.
- **Search**: Cáº­p nháº­t thanh tÃ¬m kiáº¿m Lá»›p há»c (Search bar) UI/UX Pro Max.

## [3.8.12] - 2026-01-18 - NÃ¢ng cáº¥p giao diá»‡n Tháº»
- **UI**: Thiáº¿t káº¿ láº¡i Tháº» Há»c viÃªn/GiÃ¡o viÃªn phong cÃ¡ch Premium Hologram v2.2.
- **Fix**: Sá»­a lá»—i chÃ­nh táº£ "THÃˆ" thÃ nh "THáºº" trÃªn toÃ n há»‡ thá»‘ng.

## [3.8.11] - 2026-01-18 - GÃ³c giáº£i trÃ­ VIP
- **Feature**: ThÃªm "GÃ³c Giáº£i TrÃ­" vá»›i kho trÃ² chÆ¡i HTML5 (Contra, ÄÃ o VÃ ng...).
## [3.10.4] - 2026-06-25
### Há»‡ Thá»‘ng Báº£o TrÃ¬
- **TÃ­nh nÄƒng 1:** TÃ­ch há»£p cháº¿ Ä‘á»™ báº£o trÃ¬ Má»m (Táº§ng 1) vÃ o App Windows, Ä‘á»“ng bá»™ tráº¡ng thÃ¡i khÃ³a mÃ n hÃ¬nh vá»›i Web.
- **TÃ­nh nÄƒng 2:** ThÃªm trang báº£o trÃ¬ Cá»©ng (Táº§ng 2) dÃ¹ng Vercel Edge Config cho Web.
- **Sá»­a lá»—i 1:** Sá»­a cÃ¡c cáº£nh bÃ¡o báº£o máº­t High severity (npm audit fix) cho Web.
- **Báº£o máº­t:** Cho phÃ©p role admin bypass mÃ n hÃ¬nh báº£o trÃ¬ qua route /ontap/login-admin.



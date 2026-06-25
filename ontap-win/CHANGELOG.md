# CHANGELOG â€” [ontap-win]

## [3.11.0] - 2026-06-25 - TÃ­ch há»£p vÃ  Tá»‘i Æ°u hÃ³a Kiáº¿m tiá»n Monetag
- **Äá»“ng bá»™ hÃ³a Logic Quáº£ng CÃ¡o:** Triá»ƒn khai Smart Tag (Vignette/Interstitial), Auto Popunder (giá»›i háº¡n 1 láº§n/phiÃªn), vÃ  Direct Link tá»« web sang Windows.
- **Dynamic Config qua Firebase:** Cho phÃ©p thay Ä‘á»•i URL Direct Link Ä‘á»™ng trá»±c tiáº¿p tá»« mÃ n hÃ¬nh "Há»‡ thá»‘ng" thay vÃ¬ hardcode, phÃ¢n bá»• linh hoáº¡t theo tá»«ng háº¡ng tÃ i khoáº£n.
- **Tráº£i nghiá»‡m chá» thÃ´ng minh:** Bá»• sung mÃ n hÃ¬nh chá» `CountdownAdScreen` (5 giÃ¢y) trÆ°á»›c khi xem káº¿t quáº£ thi Ä‘á»ƒ táº­n dá»¥ng hiá»ƒn thá»‹ quáº£ng cÃ¡o toÃ n mÃ n hÃ¬nh. (LÆ°u Ã½: Countdown bá»‹ táº¯t trong mÃ´i trÆ°á»ng Electron Ä‘á»ƒ Ä‘áº£m báº£o tráº£i nghiá»‡m app).

## [3.10.0] - 2026-06-25 - Thiáº¿t káº¿ láº¡i Admin Dashboard
- **Äá»“ng bá»™ hÃ³a Giao diá»‡n (PhÆ°Æ¡ng Ã¡n C "Hybrid Smart"):** 
  - Ãp dá»¥ng cáº¥u trÃºc Dashboard má»›i sang á»©ng dá»¥ng Windows/Electron: Thanh online slim realtime (`AdminStatsBar`) á»Ÿ trÃªn cÃ¹ng.
  - Cá»™t trÃ¡i: Tháº» há»c viÃªn/giÃ¡o viÃªn (`StudentCard`) Ä‘Æ°á»£c giá»¯ nguyÃªn, káº¿t há»£p thÃªm cÃ¡c nÃºt phá»¥ Ä‘iá»u hÆ°á»›ng nhanh.
  - Cá»™t pháº£i: Lá»i chÃ o thÃ´ng minh theo giá» (`WelcomeHeader`), cÃ¡c nÃºt thao tÃ¡c nhanh dáº¡ng grid tiles (`QuickActionsGrid`).
- **Sá»­a lá»—i TypeScript:** Sá»­a lá»—i spread types TS2698 liÃªn quan tá»›i thuá»™c tÃ­nh `showPortalAds` trong `UsageConfigPanel.tsx` cá»§a báº£n Windows.

## [3.9.9] - 2026-06-15 - Sá»­a lá»—i & ÄÃ³ng gÃ³i Phá»¥c há»“i
- **Äá»“ng bá»™ hÃ³a phiÃªn báº£n:** Cáº­p nháº­t phiÃªn báº£n lÃªn v3.9.9 Ä‘á»ƒ Ä‘á»“ng bá»™ vá»›i root portal vÃ  ontap-web.
- **QA & Testing:** Cháº¡y kiá»ƒm thá»­ tá»± Ä‘á»™ng, linting vÃ  build chuáº©n bá»‹ release.

## [3.9.7] - 2026-06-12 - Triá»ƒn Khai Quáº£ng CÃ¡o Portal & Refactor
- **Äá»“ng bá»™ hÃ³a UI quáº£n trá»‹:** Bá»• sung toggle "Quáº£ng cÃ¡o Trang chá»§ & Tin tá»©c" vÃ o tab "Há»‡ thá»‘ng" cá»§a UsageConfigPanel cho vai trÃ² Admin vÃ  LÃ£nh Ä‘áº¡o (Äá»“ng bá»™ vá»›i báº£n Web).
- **VÃ¡ báº£o máº­t tá»± Ä‘á»™ng:** VÃ¡ lá»— há»•ng báº£o máº­t cá»§a `@grpc/grpc-js` thÃ´ng qua npm audit fix.

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
- **Báº£o máº­t Ä‘á» thi Ä‘á»™ng (App Win):** Äá»“ng bá»™ tÃ­nh nÄƒng báº£o vá»‡ Ä‘á» thi khi lÃ m bÃ i/thi thá»­ dá»±a trÃªn thuá»™c tÃ­nh cáº¥u hÃ¬nh `preventCopy` Ä‘á»™ng cá»§a tá»«ng vai trÃ² tá»« Firestore. Khi Ä‘Æ°á»£c kÃ­ch hoáº¡t, á»©ng dá»¥ng sáº½ cháº·n chuá»™t pháº£i, bÃ´i Ä‘en, copy vÃ  phÃ­m táº¯t `Ctrl+C` / `Cmd+C` / `Ctrl+U`.
- **Realtime Security Policies:** Tá»± Ä‘á»™ng láº¯ng nghe cáº¥u hÃ¬nh `settings/usage_config` tá»« Firestore theo thá»i gian thá»±c Ä‘á»ƒ Ã¡p dá»¥ng ngay láº­p tá»©c cÃ¡c chÃ­nh sÃ¡ch báº£o máº­t thay Ä‘á»•i bá»Ÿi Admin.
- **PhÃ¢n quyá»n cáº¥u hÃ¬nh Ä‘á»™ng:** 
  - Admin cÃ³ toÃ n quyá»n chá»‰nh sá»­a giá»›i háº¡n vÃ  chÃ­nh sÃ¡ch báº£o máº­t cho táº¥t cáº£ cÃ¡c vai trÃ².
  - LÃ£nh Ä‘áº¡o (`lanh_dao`) chá»‰ Ä‘Æ°á»£c chá»‰nh sá»­a cáº¥u hÃ¬nh cÃ¡c vai trÃ² cáº¥p dÆ°á»›i, vÃ´ hiá»‡u hÃ³a (Read-only) toÃ n bá»™ giao diá»‡n cáº¥u hÃ¬nh cá»§a Admin.
- **Äá»“ng bá»™ hÃ³a Route:** Truyá»n `userProfile` prop vÃ o `UsageConfigPanel` táº¡i Route `/ontap/cauhinh` Ä‘á»ƒ xÃ¡c thá»±c phÃ¢n quyá»n chÃ­nh xÃ¡c.

## [3.9.2] - 2026-03-29 - Hotfix & Auto-update Sync
- **Version Update**: NÃ¢ng cáº¥p lÃªn 3.9.2 Ä‘á»ƒ Ä‘á»“ng bá»™ vá»›i GitHub Release.
- **Auto-update**: Fix lá»—i nháº­n diá»‡n phiÃªn báº£n trÃªn Windows khi sá»­ dá»¥ng tag cÃ³ háº­u tá»‘ chá»¯.
- **UI**: Cáº­p nháº­t Modal Changelog tá»± Ä‘á»™ng láº¥y dá»¯ liá»‡u tá»« file nÃ y.

## [3.9.1] - 2026-03-22 - Desktop Performance Fix
- Tá»‘i Æ°u hÃ³a hiá»‡u nÄƒng render danh sÃ¡ch lá»›p há»c trÃªn á»©ng dá»¥ng mÃ¡y tÃ­nh.
- Sá»­a lá»—i font chá»¯ hiá»ƒn thá»‹ khÃ´ng Ä‘á»u trÃªn má»™t sá»‘ mÃ¡y cháº¡y Windows 10 cÅ©.

## [3.9.0] - 2026-03-18 - Native Integration
- Há»— trá»£ phÃ­m táº¯t vÃ  thÃ´ng bÃ¡o há»‡ thá»‘ng trÃªn Windows.
- Tá»± Ä‘á»™ng kiá»ƒm tra báº£n cáº­p nháº­t má»—i khi khá»Ÿi Ä‘á»™ng app.
## [3.10.4] - 2026-06-25
### Há»‡ Thá»‘ng Báº£o TrÃ¬
- **TÃ­nh nÄƒng 1:** TÃ­ch há»£p cháº¿ Ä‘á»™ báº£o trÃ¬ Má»m (Táº§ng 1) vÃ o App Windows, Ä‘á»“ng bá»™ tráº¡ng thÃ¡i khÃ³a mÃ n hÃ¬nh vá»›i Web.
- **Báº£o máº­t:** Cho phÃ©p role admin bypass mÃ n hÃ¬nh báº£o trÃ¬ qua route /ontap/login-admin.



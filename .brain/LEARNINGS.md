# Những Bài Học (Learnings) - Dự án TNDNB

- **Kiến trúc App Update (2026-09-19, đính chính 2026-09-20):** Không dùng file CHANGELOG.md tĩnh đi kèm app để check version (app cũ mãi đọc file cũ). Version truth nằm ở **GitHub Releases API** (`aitnd/TNDNB`, electron-updater đọc `.yml/.exe/.blockmap`); Firebase `settings/usage_config app_links` chỉ mirror link hiển thị. **Supabase chỉ chứa câu hỏi** (`licenses/subjects/questions/answers` + bucket ảnh `TND`) — tuyệt đối không host file release trên Supabase (plan 260919-1428 đi sai hướng này đã bị revert).
- **Tránh Nested Scroll:** Hạn chế thanh cuộn bên trong thanh cuộn, đặc biệt là ở giao diện Bài thi / Kết quả, vì rất khó thao tác cho người dùng phổ thông.
- **Kiến trúc Desktop:** Ứng dụng Desktop cần có Tray Context Menu (Chuột phải vào icon) để người dùng có thể "Mở, Khởi động cùng Windows, Thoát" thay vì chỉ click chuột trái mở app.

- [2026-09-20] Environment Variables Deployment: Vite dùng tiền tố VITE_ (vd VITE_SUPABASE_URL), còn Next.js dùng NEXT_PUBLIC_. Khi deploy qua nền tảng như Vercel (nơi file .env bị gitignore), bắt buộc phải nạp các biến này thủ công lên dashboard của nền tảng (Settings > Environment Variables) để quá trình build (npm run build) có thể đọc và nướng các key vào client bundle. Nếu không sẽ bị lỗi Uncaught Error do biến undefined.
- [2026-09-22] React 19 white screen #482: Không bao giờ render trực tiếp `async` function trong JSX (`v{getLatestVersion()}` với hàm async → Promise bị treo suspense, không ErrorBoundary là trắng cả app + Minified React error #482). Luôn fetch qua `useState + useEffect` rồi render string; bọc widget phụ (Navbar/Marquee) trong ErrorBoundary để lỗi nhỏ không sập toàn app.
- [2026-09-22] Firestore guest permission: giữ `allow read: if request.auth != null` (least privilege), nhưng mọi `onSnapshot` bắt buộc có error callback + `try/catch` với fallback `setAlerts([])` (graceful hide) — nếu không guest sẽ bắn `PERMISSION_DENIED` đỏ console.
- [2026-09-22] Checkbox `[x]` không evidence thì chưa xong: mọi tick hoàn thành phải kèm log/screenshot/test (tsc log, build log, preview). Task Phase 5 tick đủ nhưng thiếu tag `v3.19.2`, `latest.yml` vẫn `3.19.1` — suýt nghiệm thu khống.
- [2026-09-22] Double-sync plan docs: `task.md` và `phase-*.md` phải khớp nhau (checkbox, số dòng file, phạm vi Web/Win); line number trong docs trôi theo code nên ghi `±`. Plan ghi sai stack (`NEXT_PUBLIC_` trong project Vite) gây hiểu nhầm ENV.
## 2026-09-24: Tailwind v4 Dark Mode & Vite Asset Paths
- **Tailwind v4 Multi-Dark Themes:** Khi update từ v3 lên v4, biến dark: mặc định chạy theo OS media query. Nếu app có nhiều dark themes (vd: dark, noel, tri-an), PHẢI cấu hình @custom-variant dark mở rộng trong 	heme.css để liệt kê toàn bộ các attribute tương ứng. Nếu không, các class dark: sẽ không kích hoạt khi user chọn các theme tối khác.
- **Vite Asset Base URL:** Khi set ase trong ite.config.ts, tuyệt đối KHÔNG dùng đường dẫn tuyệt đối tĩnh (src="/assets/img/...") vì sẽ bị 404. Luôn phải dùng ` src={${import.meta.env.BASE_URL}assets/img/...} `.

## 2026-09-26: Loi UTF-8 BOM, TypeScript Supabase & Security Keys
- **Loi UTF-8 BOM do PowerShell:** Khong dung Set-Content -Encoding UTF8 de ghi file code.
- **Loi TypeScript TS2339 (Supabase):** Du lieu tra ve doi khi bi suy dien thanh never. Cach xu ly: ep kieu (data as any).
- **Bao mat API Key:** Cac fallback API key cung rat nguy hiem. Luon thay the bang bien moi truong.


## [2026-11-05] Single Canonical Hallmark Editorial Theme & Portal Auth/Admin Restoration
- **Quyết định Kiến trúc UI (`[type=architecture]`):** Loại bỏ hoàn toàn cơ chế đa giao diện (`ThemeContext`, `data-theme`, hiệu ứng tuyết rơi Noel) trên Root Portal để triệt tiêu hiện tượng FOUC, giảm kích thước bundle và giữ vững tính chính thống của Cổng thông tin Đào tạo & Sát hạch Thủy nội địa (Hallmark Editorial — N6 Masthead + H2 Split Diptych).
- **Bài học Kỹ thuật (`[type=lesson]`):**
  1. Khi tách monorepo (`ontap-web` / `ontap-win` ra khỏi Root Portal), cần có bộ kiểm thử tự động (`scripts/portal-login-dashboard.test.ts`) canh gác sự tồn tại của các route trọng yếu (`app/login/page.tsx`, `app/quan-ly/page.tsx`) để tránh xóa nhầm khi dọn dẹp.
  2. Trên Next.js 14 App Router, mọi trang sử dụng `useSearchParams()` (như `/login?redirect=...`) bắt buộc phải bọc component con trong `<Suspense>` để `npm run build:portal` tĩnh hóa (Static Prerender) thành công mà không bị lỗi CSR Bailout.


## [2026-11-06] Định Danh Tên Miền Chính Thức Của Dự Án (Canonical Domains & URLs)
- **Tên miền Cổng thông tin chính thức (`[type=architecture]`):** `https://www.daotaothuyenvien.com` (và `https://daotaothuyenvien.com`). Dự án KHÔNG dùng domain `tndnb.vn`.
- **Đường dẫn Web App Ôn tập chính thức (`[type=architecture]`):** `https://www.daotaothuyenvien.com/ontap` (chạy qua Next.js Reverse Proxy/Rewrite trên Vercel).
- **Quy chuẩn CORS & Backend Cloudflare Worker:** Toàn bộ API Worker và Cloudflare D1/R2 phải cho phép origin `https://www.daotaothuyenvien.com` và `https://daotaothuyenvien.com` trong `ALLOWED_ORIGINS`.
- **Chiến lược Tên miền App Ôn tập (`[type=decision]`):** Giữ nguyên `https://www.daotaothuyenvien.com/ontap` làm địa chỉ chính thức duy nhất cho học viên truy cập để tập trung 100% sức mạnh SEO (Domain Authority) và kiếm tiền ổn định qua Google AdSense / Monetag mà không cần duyệt lại subdomain.


## [2026-11-06] Cloudflare Custom Domain, Vercel Config, TinyMCE Local & R2 Graceful Fallback
- **Cloudflare Custom Domain cho Worker & R2 (`[type=architecture]`):**
  1. Khi gắn Custom Domain cho Cloudflare R2 bucket (`cdn.daotaothuyenvien.com`) hoặc Cloudflare Worker (`api.daotaothuyenvien.com`), Root Domain (`daotaothuyenvien.com`) bắt buộc phải được add vào danh sách Zone trên Cloudflare trước, nếu không Dashboard sẽ báo lỗi "That domain was not found on your account".
  2. Cloudflare D1 và KV là tài nguyên hoàn toàn nội bộ (`env.DB`, `env.CONFIG_KV`), Worker truy cập trực tiếp qua C++ runtime binding, tuyệt đối KHÔNG cần mở domain hay chỉnh cài đặt DNS nào trên Cloudflare Dashboard.
- **Biến Môi Trường Vercel (`[type=lesson]`):**
  - Các biến môi trường bắt đầu bằng tiền tố `NEXT_PUBLIC_` (như `NEXT_PUBLIC_CLOUDFLARE_API_URL` hay `NEXT_PUBLIC_R2_PUBLIC_URL`) phải tạo dưới dạng **Config** (Plain Text), không được tạo dưới dạng **Secret** trên Vercel Dashboard, nếu không Vercel sẽ chặn với cảnh báo public framework variables cannot be secrets.
- **TinyMCE Local Self-Hosted (`[type=pattern]`):**
  - Để triệt tiêu hoàn toàn popup phiền phức đòi API Key của TinyMCE Cloud trên Root Portal, chỉ cần copy thư viện tĩnh vào `public/tinymce/` và trỏ `tinymceScriptSrc="/tinymce/tinymce.min.js"`, `skin_url: '/tinymce/skins/ui/oxide'`, `content_css: '/tinymce/skins/content/default/content.min.css'`.
- **R2 Gradual Migration & 5s Graceful Fallback (`[type=architecture]`):**
  - Khi chuyển đổi dần (`Gradual Migration`) ảnh và tài liệu bài viết sang Cloudflare R2 (`POST /api/v1/portal/upload`), luôn cài đặt `AbortController` với thời gian chờ tối đa 5000ms trong `lib/portalMediaService.ts`. Nếu Worker timeout hoặc gặp lỗi mạng, tự động lùi về Supabase Storage để người dùng đăng bài không bao giờ bị nghẽn gián đoạn, đồng thời bảo toàn 100% URL của các bài viết và tệp đính kèm lịch sử.


## [2026-11-06] Xử Lý Triệt Để Lỗi Console, TinyMCE GPL, Supabase JWT RS256, Cloudflare Worker KV Multi-Auth & R2 CDN Images
- **Bản quyền TinyMCE Self-hosted v8 (`[type=lesson]`):**
  - Từ TinyMCE 7 trở lên, khi tự host trong thư mục `public/tinymce/` dưới giấy phép GNU GPL v2+, component `<Editor />` bắt buộc phải có thuộc tính cấu hình `license_key: 'gpl'` và `promotion: false`. Nếu thiếu, trình soạn thảo sẽ bị khóa cứng (disabled), xuất hiện banner cảnh báo màu vàng và console sẽ bắn lỗi 404 tìm kiếm plugin `licensekeymanager`.
- **Khử Lỗi Chữ Ký Supabase JWT RS256 (`[type=pattern]`):**
  - Khi hệ thống xác thực người dùng bằng Firebase Auth và phân quyền bằng Firestore RBAC, tuyệt đối không được truyền Firebase ID Token vào `supabase.auth.setSession()`. Supabase mặc định chỉ hỗ trợ thuật toán đối xứng HS256 với secret của Supabase, trong khi Firebase ID Token được ký bằng khóa bất đối xứng RS256 của Google. Việc gọi `setSession()` sẽ văng ngoại lệ `signing method RS256 is invalid` và bắn 403 Forbidden tới `/auth/v1/user`. Cần loại bỏ hoàn toàn lời gọi này vì Supabase chỉ được dùng để đọc câu hỏi công khai qua anon key.
- **Next.js Reverse Proxy cho Worker API (`[type=architecture]`):**
  - Khi ứng dụng Frontend nhúng gọi các relative path như `/api/v1/...`, Next.js sẽ nhận request trực tiếp thay vì Cloudflare Worker. Để không phụ thuộc vào việc có build-time env URL hay không, cấu hình rewrite trong `next.config.mjs` chuyển tiếp `/api/v1/:path*` sang `https://api.daotaothuyenvien.com/api/v1/:path*`, kết hợp với fallback mặc định trong client code (`d1Client.ts`), tạo cơ chế phòng vệ 2 tầng vững chắc.
- **Cloudflare Worker Multi-Auth & Trả Về 200 Cho Key Null (`[type=architecture]`):**
  - Các route lưu cấu hình (`PUT /api/v1/config/:key`) trên Edge Worker cần hỗ trợ cả `ADMIN_API_SECRET` lẫn Firebase ID Token hợp lệ của Admin (project `thi-tnd`).
  - Trong route `GET /api/v1/config/:key`, khi `CONFIG_KV.get(key)` trả về `null`, Worker nên trả về HTTP 200 `{ ok: true, data: null }` thay vì HTTP 404 để không làm đỏ console của trình duyệt.
- **Chuẩn Hóa 100% Ảnh Câu Hỏi Sang Cloudflare R2 CDN (`[type=pattern]`):**
  - Khi toàn bộ ảnh câu hỏi đã được tải lên Cloudflare R2, cần chuẩn hóa URL trong `dataService.ts` và bộ nhớ đệm IndexedDB (`offlineService.ts`) trỏ về `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`. Điều này khử triệt để các đường dẫn Supabase Storage cũ mà không cần can thiệp vào component giao diện thi trắc nghiệm (`ExamQuizScreen.tsx`).


## [2026-11-07] Phân Tích Lỗi Console, Khắc Phục React Hydration, Tối Giản Mobile Dashboard, PWA Banner & Gom Hamburger TopNavbar
- **Phân Biệt Lỗi Extension Trình Duyệt vs Lỗi Code Web (`[type=lesson]`):**
  - Tiện ích mở rộng của trình duyệt như Bitwarden Password Manager có thể ném ngoại lệ `Attempting to use a disconnected port object at CM.sendMessageTo (chrome-extension://nngceckbapebfimnlniiahkandclblb/...)` khi DOM form thay đổi hoặc port giao tiếp ngầm của extension bị đóng. Đây là lỗi cô lập 100% từ phía extension của máy khách, không ảnh hưởng đến logic của ứng dụng.
- **Khắc Phục Triệt Để React Hydration Mismatch với Swiper / Slider SSR (`[type=pattern]`):**
  - Các thư viện slider như Swiper tự động tính toán kích thước viewport, touch gestures và can thiệp DOM client. Khi render trên Next.js Server Components, DOM từ SSR khác biệt với DOM client tạo ra lỗi `Minified React error #418, #425, #423`.
  - Giải pháp chuẩn: Dùng `next/dynamic` với `{ ssr: false }` kèm skeleton placeholder để trì hoãn render component slider sang phía client hoàn toàn.
- **Mặc Định Form Đăng Nhập Tiện Lợi Cho Học Viên (`[type=decision]`):**
  - Mặc định tích sẵn cả 2 ô `rememberMe: true` (Ghi nhớ đăng nhập) và `saveThisAccount: true` (Lưu tài khoản này) trong `LoginScreen.tsx` giúp học viên không phải thao tác thủ công mỗi lần đăng nhập.
- **Trải Nghiệm Mobile: Tối Giản Dashboard & Tải Dữ Liệu Theo Nhu Cầu (`[type=pattern]`):**
  - Loại bỏ các popup cảnh báo thiết bị phiền toái (`showSingleDeviceWarning`) giúp phiên làm việc xoay tua êm ái (silent session rotation).
  - Không tự động yêu cầu quyền vị trí `navigator.geolocation` trong `WeatherWidget.tsx` khi mount trang. Chỉ hỏi quyền khi người dùng chủ động tương tác với tính năng thời tiết.
  - Trên màn hình mobile, chỉ hiển thị Thẻ học viên (`StudentCard`) và nút to nổi bật "Vào Ôn Tập / Thi Thử" (`PrimaryButton`) ngay bên dưới. Các widget phụ (thời tiết, biểu đồ tiến độ) ẩn trên mobile (`hidden lg:block`).
- **Phân Biệt Cài Đặt PWA vs Tải File APK (`[type=architecture]`):**
  - Khi người dùng yêu cầu "tải app đưa ra màn hình chính", giải pháp chuẩn hóa cho Web App là Progressive Web App (PWA) cài đặt qua trình duyệt: bắt sự kiện `beforeinstallprompt` trên Chromium/Android và modal 3 bước hướng dẫn "Thêm vào MH chính" trên iOS Safari, tuyệt đối không tạo nút tải APK ngoài.
  - Component PWA Banner cần tự động ẩn khi app đã chạy ở chế độ standalone (`display-mode: standalone` hoặc `window.navigator.standalone === true`) và lưu trạng thái tắt trong 7 ngày qua `localStorage`.
- **Tối Ưu TopNavbar: Gom Hamburger Menu & Khóa 4 Nút Cho Role Học Viên Mobile (`[type=pattern]`):**
  - Nút Tài khoản và nút Đăng xuất được gom gọn gàng vào nút Menu 3 gạch (`Menu` icon) ở góc phải cùng, mở sheet dropdown chứa đầy đủ thông tin, điều hướng và nút Đăng xuất màu đỏ.
  - Với role học viên (`hoc_vien`) trên điện thoại: ẩn toàn bộ nút phụ (`hidden md:flex`), chỉ hiển thị đúng 4 nút duy nhất: `[Ôn tập]`, `[Lớp của tôi]`, `[Chuông thông báo]` và `[Menu 3 gạch]`.
- **Quy Trình Xóa Nhánh Git Cũ & Dọn Dẹp Remote Cache An Toàn (`[type=pattern]`):**
  - Khi người dùng yêu cầu xóa các nhánh cũ: xóa local (`git branch -D <name>`), xóa remote (`git push origin --delete <name>`), và bắt buộc chạy `git fetch --prune` để dọn sạch toàn bộ tham chiếu `remotes/origin/...` đã bị xóa trên GitHub.

- **Guest Auth Guard: Triệt Tiêu Cảnh Báo Firestore Console Cho Khách Vãng Lai (`[type=pattern]`):**
  - Khi collection Firestore bị khóa bởi quy tắc phân quyền bảo mật (`allow read: if request.auth != null;`), các service client nạp cấu hình hệ thống (như `getUsageConfig()` hoặc `getGitHubConfig()`) phải có guard clause kiểm tra `auth?.currentUser` trước khi thực hiện `getDoc(doc(db, 'settings', ...))`.
  - Nếu người dùng chưa đăng nhập (khách vãng lai), hàm lập tức chuyển thẳng sang cache `localStorage` hoặc giá trị mặc định tĩnh. Điều này ngăn chặn 100% request không hợp lệ gửi lên Firestore, triệt tiêu lỗi `Missing or insufficient permissions` trong tab Console (Zero-Noise Console) và giảm bớt quota truy vấn Firestore.


## [2026-11-07] Tái Thiết Kế WelcomeModal Đơn Thẻ Tối Giản, Khử Sạch AI-Slop & Bảo Toàn Invariant 1
- **Khử Trùng Dứt Khoát Nội Dung Giả Định (Anti-AI-Slop Clean) (`[type=lesson]`):**
  - Màn hình chào đón của ứng dụng học tập/sát hạch thuyền viên (`WelcomeModal.tsx`) tuyệt đối không được tự ý sinh ra các thông số marketing phóng đại (như "100%", "30 câu / đề", "24/7") hay các gạch đầu dòng tính năng chung chung do AI bịa đặt.
  - Khi người dùng yêu cầu lược bỏ, cần mạnh dạn tháo dỡ toàn bộ cấu trúc lưới 2 cột phức tạp (`md:col-span-7` & `md:col-span-5`), đưa về Hero Layout Archetype `centred` (`max-w-lg text-center`) tối giản, tinh tế theo chuẩn Taste-Skill v2.5.0 và 62-rule Impeccable Craft Floor v4.8.0.
  - Lấy biểu tượng bản sắc ngành Bánh lái 3D (`HelmIcon3D`) làm tâm điểm thị giác (Visual Anchor), giữ lời chào ấm cúng, cụm 2 nút hành động chính (`[Bắt đầu ôn tập]`, `[Đăng nhập học viên]`), liên kết đăng ký tài khoản và thông tin đơn vị đào tạo kèm hotline `0229 628 2969` (định dạng `tabular-nums` thẳng hàng).
- **Kỷ Luật Bảo Toàn Bất Biến Invariant 1 (`[type=pattern]`):**
  - Trong mọi tác vụ nâng cấp hoặc tái cấu trúc giao diện xung quanh (TopNavbar, Dashboard, WelcomeModal), tệp thi trắc nghiệm cốt lõi [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) luôn được bảo vệ nghiêm ngặt với quy tắc `git diff === 0 bytes`.
  - Mọi bộ test tự động (`scripts/ontap-dual-theme-and-sidebar.test.ts`) bắt buộc phải có assertion `execSync('git diff ontap-web/components/ExamQuizScreen.tsx') === ''` để ngăn chặn bất kỳ sự can thiệp ngoài ý muốn nào.
- **Quy Trình Hoàn Tất Nhánh Phát Triển & Merge Sang Main (`[type=decision]`):**
  - Sau khi vượt qua toàn bộ 52/52 bài kiểm thử Vitest và 0 lỗi TypeScript ở cả root và sub-project, nhánh tính năng `feat/mobile-dashboard-and-top-navbar-simplification` được merge trực tiếp vào `main` thông qua chiến lược `merge --no-ff`, kiểm thử lại toàn bộ trên `main` và đẩy lên `origin/main` an toàn.


## [2026-11-08] Tối Ưu First-Fold Màn Hình Thi Mobile & Khử Triệt Để FAB Che Màn Hình
- **Tối Ưu First-Fold Màn Hình Thi Sát Hạch Mobile (`[type=pattern]`):**
  - Trên thiết bị di động có chiều cao giới hạn (~600px - 840px), việc hiển thị ảnh thẻ học viên 100x130, thông tin cá nhân (SBD, ngày sinh, địa chỉ, lớp, bằng) và hộp cam `w-48` chiếm tới hơn 220px chiều dọc, đè chữ và đẩy nội dung câu hỏi cùng 4 lựa chọn đáp án A, B, C, D ra ngoài viewport.
  - Kỹ thuật chuẩn: Tách 2 tầng Presentation bằng responsive breakpoint `md:` (`768px`) trong [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx):
    - Desktop Header (`hidden md:flex`): Bảo toàn 100% thẻ thông tin học viên trang trọng cho máy tính bàn phòng máy thi.
    - Mobile Exam Header (`flex md:hidden`): Rút gọn thành thanh điều khiển siêu mỏng (~38px) gồm nút `[← Thoát]` có popup confirm, huy hiệu tên bằng, số thứ tự `Câu X/Y` và đồng hồ đếm ngược `⏱️ MM:SS` định dạng `font-mono tabular-nums`.
    - Toàn bộ nội dung câu hỏi và 4 đáp án A, B, C, D hiển thị ngay tại First Fold, học viên thao tác 1 chạm mà không cần vuốt cuộn màn hình.
- **Thay Thế Nút Nổi FAB Bằng Alert Banner Nội Dòng (`[type=lesson]`):**
  - Nút nổi `fixed bottom-4 left-1/2` kèm hiệu ứng giật nảy `animate-bounce` là một antipattern (AI-Slop) nguy hiểm trên thiết bị di động vì nó bay lơ lửng đè trực tiếp lên các nút bấm và thẻ chọn bài thi ở đáy màn hình.
  - Khi người dùng muốn thoát ra chọn bài khác, việc thiếu nút đóng (`✕`) khiến họ bị kẹt, không thể thao tác.
  - Giải pháp chuẩn UX: Thay thế bằng Alert Banner thanh mảnh đặt dưới thanh Header trong luồng trang (`animate-fade-in`), có nút `[Làm tiếp ngay]` nhỏ gọn và nút **`[✕ Bỏ qua]`** gọi `setResumeSessionAvailable(false)` giúp học viên chủ động ẩn thông báo khi muốn chọn bài khác mà không xóa mất dữ liệu `localStorage`.
- **Đồng Bộ Bộ Kiểm Thử TDD Canh Gác Responsive & Dismiss (`[type=pattern]`):**
  - Thêm `TC-30` (kiểm tra không còn `fixed bottom-4`, không còn `animate-bounce`, có `setResumeSessionAvailable(false)`) và `TC-31` (kiểm tra `hidden md:flex`, `flex md:hidden`, `handleBackWithConfirm`, `tabular-nums`) vào [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) đảm bảo mọi đợt refactor sau không tái phát sinh lỗi.

## [2026-11-09] Khôi Phục Changelog Gốc Tốc Độ Cao, Nâng Cấp v3.22.0 & Hoàn Thiện PWA "Giáo dục Ninh Bình"
- **Khắc Phục Race Condition của Sự Kiện PWA `beforeinstallprompt` (`[type=pattern]`):**
  - Trình duyệt Chromium/Android bắn sự kiện `beforeinstallprompt` trong 1-2 giây đầu tiên ngay khi tải trang. Nếu component banner cài đặt (`PwaInstallBanner.tsx`) chỉ được mount có điều kiện sau khi người dùng đăng nhập (`Dashboard.tsx`), sự kiện đã bị bỏ lỡ vĩnh viễn, dẫn đến việc nút "Cài đặt ngay" không bao giờ kích hoạt được prompt gốc.
  - Giải pháp triệt để: Đăng ký `window.addEventListener('beforeinstallprompt', ...)` ngay ở module top-level bên ngoài vòng đời React và lưu trữ đối tượng sự kiện vào `window.__deferredPwaPrompt`. Bất kỳ component nào mount sau đều có thể truy cập ngay lập tức.
- **Đồng Bộ Trạng Thái Đóng PWA Banner Toàn Hệ Thống Bằng `CustomEvent` (`[type=pattern]`):**
  - Khi người dùng đóng banner PWA trên một component (ví dụ `WelcomeModal.tsx`), nếu họ chuyển màn hình sang `LicenseSelectionScreen.tsx` hoặc `Dashboard.tsx` trong cùng phiên làm việc, banner không được phép hiện lại gây phiền toái.
  - Giải pháp: Kết hợp lưu thời hạn 7 ngày vào `localStorage` (`ontap_pwa_banner_dismissed_until`) đồng thời phát sự kiện `window.dispatchEvent(new CustomEvent('ontap-pwa-banner-dismissed'))`. Mọi component banner đang hiển thị trên các tầng giao diện khác sẽ lập tức ẩn đi đồng bộ.
- **Nhúng Markdown Qua Vite `?raw` & Khai Báo Ambient Types Trong Monorepo (`[type=lesson]`):**
  - Khi nhúng trực tiếp file `CHANGELOG.md?raw` để hiển thị tức thì (0ms) mà không phụ thuộc vào GitHub API từ xa, TypeScript trong cấu hình monorepo Next.js + Vite sẽ báo lỗi `TS2307: Cannot find module '../CHANGELOG.md?raw'`.
  - Khắc phục chuẩn xác: Tạo file ambient declaration `types/raw-modules.d.ts` với `declare module '*.md?raw' { const content: string; export default content; }` và `declare module '*?raw' { const content: string; export default content; }`, giúp TypeScript biên dịch an toàn 0 lỗi.
- **Kỷ Luật Bảo Toàn Tuyệt Đối Logic Windows Electron Updater & Đồng Bộ Đề Thi (`[type=architecture]`):**
  - Trong tệp `ontap-win/components/ChangelogModal.tsx`, các dòng 16–287 chứa toàn bộ logic kiểm tra cập nhật qua GitHub Releases của Electron (`window.electron.onUpdateAvailable`, `onDownloadProgress`, `onUpdateDownloaded`) cùng cơ chế Đồng bộ Gói Đề Thi Supabase ngoại tuyến.
  - Khi đồng bộ giao diện hiển thị Dual-Tab Markdown với bản Web, chỉ được phép sửa đổi phẫu thuật (surgical edit) khu vực render giao diện ở nửa cuối tệp (dòng 289–338), tuyệt đối không đụng chạm hay xóa bỏ nửa trên logic cập nhật desktop.
- **Phân Quyền RBAC Cho Tab Kỹ Thuật & Quy Chuẩn Ngôn Ngữ Bản Tin Người Dùng (`[type=decision]`):**
  - Thanh chuyển đổi Tab `[👤 Người dùng]` / `[💻 Kỹ thuật (Dev)]` chỉ được phép hiển thị khi `userProfile?.role` thuộc nhóm quản trị/lãnh đạo (`['admin', 'quan_ly', 'lanh_dao']`). Đối với khách vãng lai (`null`), học viên (`hoc_vien`) và giáo viên (`giao_vien`), thanh chuyển đổi phải ẩn hoàn toàn và ép cứng `effectiveTab = 'user'`.
  - Nội dung `CHANGELOG.md` dành cho người dùng bắt buộc viết ngắn gọn 1 câu/ý theo chuẩn bản `3.19.0`, tuyệt đối không để lộ tên file, tên component hay hạ tầng kỹ thuật nội bộ (`WelcomeModal`, `LicenseSelectionScreen`, `Cloudflare`, `Firestore`, `Dexie`, `TinyMCE`...).
  - Khi render từng dòng từ Markdown thô, cần bọc qua hàm `renderInlineMarkdown` chuyển đổi `**Tiêu đề:**` thành thẻ `<strong>` của React (không dùng `dangerouslySetInnerHTML`) để tránh hiện nguyên văn dấu sao `**` thô trên màn hình.

## [2026-11-09] Tối Giản Navbar Desktop & Triệt Tiêu AdSense Auto-Ads Race Condition (Kế hoạch 261109-0950)
- **Hợp Nhất Trải Nghiệm Đăng Xuất Desktop & Mobile (`[type=decision]`):**
  - Việc đặt đồng thời nút "Thoát" độc lập trên thanh TopNavbar Desktop và nút "Đăng xuất" trong Hamburger Menu 3 gạch `[≡]` gây trùng lặp hành vi và tiềm ẩn rủi ro học viên/giáo viên vô tình bấm nhầm khi đang thao tác cạnh khu vực Avatar.
  - Chuẩn hóa: Gỡ bỏ hoàn toàn nút Thoát Desktop và vách ngăn dọc trên [`TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx). Gom trọn vẹn nút Đăng xuất vào mục cuối cùng của Hamburger Menu trên cả Mobile lẫn Desktop, mang lại sự tinh gọn và bảo vệ phiên làm việc an toàn.
- **Khắc Phục 4 Lỗ Hổng Kỹ Thuật Gây Lỗi Hiển Thị AdSense Cho Admin (`[type=lesson]`):**
  - *1. Auth Initialization Race Condition:* Khi mở trang hoặc F5, Firebase Auth mất 300ms–1000ms để xác thực và tải `userProfile`. Nếu component quảng cáo chỉ dựa vào `userProfile === null`, nó sẽ nhận nhầm Admin là khách vãng lai và tiêm script `adsbygoogle.js`. Giải pháp: Thêm cờ `isAuthReady: boolean` vào [`useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts), chỉ bật `true` khi Firebase đã hoàn tất tải hồ sơ hoặc xác nhận rõ ràng `currentUser === null`.
  - *2. Async Closure Race Condition:* Hàm bất đồng bộ `checkConfig()` trong `AdSenseLoader` nếu không có cờ hủy sẽ tiếp tục chạy sau khi user đăng nhập, nạp `IntersectionObserver` ma đè lên phiên Admin. Giải pháp: Thêm biến hủy `let isCancelled = false;` trong cleanup của `useEffect`.
  - *3. Google Auto-Ads Inline `!important` Override:* Google Auto-Ads tự động tiêm phần tử nổi kèm inline `style="display: block !important"`, vô hiệu hóa class CSS `display: none !important`. Giải pháp: Nâng cấp [`adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts) với đa tầng phòng thủ: `opacity: 0 !important; pointer-events: none !important; max-height: 0 !important; transform: scale(0) !important; z-index: -9999 !important;` kết hợp hàm `purgeAllAdSenseDomAndScripts()` chủ động dọn sạch DOM (`ins.adsbygoogle`, `iframe[id*="google_ads"]`, `#aswift_*`).
  - *4. Role Mapping Inaccuracy:* Trong [`usageService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts), vai trò `lanh_dao` phải đọc qua `config.leader || config.manager`, và `verified_user` phải kiểm tra có `Boolean(userProfile.courseId)`.
- **Canh Gác TDD Cho AdSense Gating & TopNavbar (`[type=pattern]`):**
  - Bổ sung 4 bài test `TC-32`, `TC-33a`, `TC-33b`, `TC-34` vào [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) xác thực kiểm soát `isAuthReady`, hủy async `isCancelled`, đa thuộc tính CSS đè `!important` và loại bỏ nút Thoát độc lập, giữ trọn vẹn 99/99 Vitest tests PASS.
- **Phân Biệt Lỗi Hệ Thống vs Nhiễu Console (Console Noise) Trong SPA & Recharts (`[type=lesson]`):**
  - *SPA Preserved Log:* Trình duyệt lưu giữ toàn bộ log trong phiên nếu không F5. Lỗi đỏ `FirebaseError: (auth/invalid-credential)` xuất hiện do 1 lần gõ sai mật khẩu trước đó ở `/login`, khi đăng nhập thành công vào `/dashboard` thì log cũ vẫn còn trong F12, không ảnh hưởng đến phiên đăng nhập hiện tại.
  - *Recharts Initial Frame Measurement:* Cảnh báo vàng `The width(-1) and height(-1) of chart should be greater than 0` phát sinh khi `<ResponsiveContainer>` đo khung cha ở mili-giây đầu lúc đang ẩn (`hidden lg:block`) hoặc đang bung chuyển động (`motion.div height: 0` lên `auto`). Cảnh báo này tự khỏi sau 100ms khi khung co giãn xong, hoàn toàn không gây mất dữ liệu hay lỗi render.
  - *Chrome Permissions Policy Deprecation:* Cảnh báo `[Violation] unload is not allowed in this document (lidar.js)` là do Chrome loại bỏ sự kiện `unload` trên script đo lường bên thứ ba của Google, hoàn toàn ngoài mã nguồn app và vô hại.


## [2026-11-10] Đồng Bộ Chặn Quảng Cáo Cổng Quản Lý, Dọn DOM AdSense & Triệt Tiêu Hydration Mismatch (Kế hoạch 261110-1015)
- **Đồng Bộ AdSense Gating Sang Cổng Quản Trị Portal (`[type=architecture]`):**
  - Kế hoạch trước (`261109-0950`) mới chỉ áp dụng Role Gate trên Web App Ôn Tập ([`ontap-web/components/AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx)), trong khi Cổng thông tin Root Portal ([`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx)) chỉ kiểm tra cấu hình Firestore chung mà không kiểm tra thông tin người dùng đang đăng nhập (`useAuth()`) hay đường dẫn trang (`pathname`). Hậu quả là Quản trị viên đăng nhập tại `daotaothuyenvien.com/quan-ly` vẫn thấy banner quảng cáo tự động của Google Auto-Ads.
  - Chuẩn hóa kiến trúc Triple-Lock Gating:
    1. *Route Gate:* Dùng `usePathname()` từ `next/navigation`, chặn 100% quảng cáo và kích hoạt dọn dẹp khi `pathname.startsWith('/quan-ly')` hoặc `pathname.startsWith('/login')`.
    2. *Role Gate:* Dùng `useAuth()`, miễn trừ quảng cáo toàn diện cho cán bộ có vai trò thuộc `['admin', 'quan_ly', 'lanh_dao']`.
    3. *Auth Ready Guard:* Không nạp script khi `loading === true`, đồng thời tiêm stylesheet `ADSENSE_HIDE_ALL_CSS` để triệt tiêu hiện tượng chớp quảng cáo (FOUA) trong thời gian chờ xác thực.
- **Động Cơ Dọn Sạch DOM Khi Điều Hướng SPA (`[type=pattern]`):**
  - Google AdSense Auto-Ads chèn trực tiếp các phần tử DOM (`ins.adsbygoogle`, `iframe[id*="aswift"]`, `iframe[id*="google_ads"]`, `.google-auto-placed`, `#google-vignette`) vào `<body>`. Khi người dùng điều hướng client-side bằng Next.js Link từ trang chủ sang `/quan-ly`, các phần tử quảng cáo đã nạp từ trước vẫn nằm lại trong DOM.
  - Giải pháp: Xây dựng hàm `purgeAllAdSenseDomAndScripts()` tự động xóa toàn bộ thẻ `<script>` quảng cáo, dọn dẹp các container `ins` và iframe của AdSense, gỡ bỏ các thuộc tính chèn tự động trên `<body>`, đồng thời áp dụng stylesheet phòng thủ đa tầng (`display: none !important; opacity: 0 !important; pointer-events: none !important; max-height: 0 !important; transform: scale(0) !important; z-index: -9999 !important;`).
- **Khắc Phục Lỗi 404 Avatar Fallback & Safe Avatar Helper (`[type=lesson]`):**
  - Khi người dùng mới chưa cấu hình ảnh đại diện hoặc `photoURL` trỏ tới file tĩnh không tồn tại (`/default_avatar.png`), Next.js `<Image>` sẽ bắn lỗi 404 đỏ console F12.
  - Giải pháp triệt để:
    1. Khởi tạo 3 file ảnh vật lý thực tế trong thư mục `public/`: [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png), [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png), [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png) sao chép từ avatar chuẩn của hệ thống (7,612 bytes).
    2. Xây dựng helper `getValidAvatarUrl(photoURL, role)` kiểm tra tính hợp lệ của đường dẫn, chuyển đổi URL lỗi thời sang ảnh chuẩn của hệ thống theo vai trò.
    3. Bổ sung sự kiện `onError={() => setAvatarError(true)}` trên thẻ `<Image>` tại [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx) để tự động fallback về `/assets/img/avatar.webp` nếu ảnh từ mạng gặp sự cố.
- **Triệt Tiêu React Hydration Mismatch (#418, #423) Bằng Mounted Guard (`[type=pattern]`):**
  - Trong Next.js 14 App Router, component layout như [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) được render trước trên server (SSR) với trạng thái chưa đăng nhập (`user === null`), tạo ra HTML chứa nút `<Link href="/login">`. Khi client hydrate, nếu Firebase Auth đã lưu phiên đăng nhập trước đó và trả về `user` ngay lập tức, React phát hiện DOM client không khớp với HTML server và quăng lỗi Hydration Mismatch `#418` & `#423`.
  - Giải pháp: Sử dụng cờ `const [isMounted, setIsMounted] = useState(false)` và `useEffect(() => setIsMounted(true), [])`. Trong lần render đầu tiên (khi `!isMounted`), render một placeholder nhẹ `.authPlaceholder` có kích thước tối thiểu tương đương (`min-height: 24px; min-width: 68px`) trên cả SSR và CSR. Sau khi mount xong, render giao diện auth thực tế. Cách này loại bỏ hoàn toàn lỗi hydration mismatch mà không làm giật khung giao diện (Zero Layout Shift).
- **Phân Quyền Tool Của Subagent Trong Antigravity (`[type=lesson]`):**
  - Khi ủy thác công việc cho Subagent bằng `define_subagent` và `invoke_subagent`, nếu Subagent cần sửa code hoặc chạy lệnh bash/powershell, bắt buộc phải cấp quyền `EnableWriteTools: true`. Các Subagent định nghĩa sẵn của hệ thống (`frontend-developer`, `research`) thường ở chế độ chỉ đọc; khi bị xung đột tên đã tồn tại, cần đặt tên mới mang tính chuyên biệt (ví dụ `senior-frontend-coder`) và mô tả rõ vai trò để Subagent có đầy đủ công cụ chỉnh sửa tệp tin.


## [2026-11-13] Nâng Cấp Tương Phản Dark Mode, Giao Diện Sáng Mặc Định Theo Phiên & Tích Hợp Nút Đổi Giao Diện Vào Menu 3 Gạch (Kế hoạch 261112-2215)
- **Chuẩn Hóa Độ Tương Phản WCAG 2.1 AA Trong Giao Diện Tối (Dark Mode) (`[type=architecture]`):**
  - Màn hình phòng thi [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx) trước đây dùng các màu nền/chữ chưa tối ưu trong dark mode (`text-slate-700`, `bg-slate-100`, `text-slate-400`), dẫn đến tỉ lệ tương phản < 4.5:1 khiến học viên khó đọc khi làm bài sát hạch.
  - Giải pháp triệt để:
    1. Thiết lập bảng màu Dark Mode chuẩn mực: Nền thẻ câu hỏi `dark:bg-slate-850`, văn bản nội dung `dark:text-slate-100` (đạt tỉ lệ > 11:1), nhãn phương án A/B/C/D `dark:text-slate-200`, đường viền `dark:border-slate-700/80`.
    2. Cập nhật bảng cấu hình Tailwind Windows App ([`ontap-win/tailwind.config.js`](file:///d:/Antigravity/TNDNB/ontap-win/tailwind.config.js)) bổ sung `slate-850: '#172033'` đồng bộ với Web.
    3. Trạng thái phương án khi chọn/đúng/sai: Đã chọn (`dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-200`), đúng (`dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-200`), sai (`dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-200`).
    4. Thành phần phiếu trả lời câu hỏi (Answer Sheet Grid): Đánh số câu `dark:bg-slate-800 dark:text-slate-200`, câu đã làm `dark:bg-blue-900/60 dark:text-blue-100`, câu liệt cảnh báo `dark:bg-amber-950/40 dark:border-amber-500/80 dark:text-amber-200`.
- **Cơ Chế Giao Diện Sáng Mặc Định Theo Phiên (Session-Scoped Default Light) (`[type=pattern]`):**
  - Trước đây hệ thống tự động đọc `localStorage.getItem('theme')` và fallback sang `prefers-color-scheme: dark` của hệ điều hành, dẫn đến người dùng mới mở trình duyệt vào phòng thi thường bị chuyển sang nền tối bất ngờ ngoài mong muốn.
  - Chuẩn hóa kiến trúc tại [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx):
    1. Lưu trạng thái giao diện trong `sessionStorage` với khóa `'ontap_theme_session'` thay vì `localStorage`. Mọi tab/phiên duyệt web mới luôn khởi tạo mặc định là `light`.
    2. Loại bỏ hoàn toàn fallback tự động sang `window.matchMedia('(prefers-color-scheme: dark)')`.
    3. Thêm hàm dọn dẹp `clearLegacyThemeStorage()` xóa bỏ các khóa cũ `'theme'`, `'ontap_theme'` trong `localStorage` nhằm tránh can thiệp phiên mới.
    4. Bọc toàn bộ các thao tác `sessionStorage`/`localStorage` trong `try/catch` để ứng dụng không bị crash khi chạy trong môi trường bảo mật nghiêm ngặt (incognito, iframe, `SecurityError`).
- **Gọn Hóa Nút Đổi Theme Vào Hamburger Menu 3 Gạch Desktop & Mobile (`[type=pattern]`):**
  - Gỡ bỏ hoàn toàn nút chuyển giao diện dạng nổi cố định (`fixed bottom-4 right-4 z-40`) trên [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) vốn gây cản trở và che khuất nội dung trang web trên màn hình nhỏ.
  - Tái cấu trúc component [`ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) hỗ trợ prop `variant="menu-item"`:
    1. Trên Desktop: Tích hợp vào menu thả xuống 3 gạch `[≡]` tại [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx), hiển thị cho cả khách vãng lai và học viên đã đăng nhập.
    2. Trên Mobile: Tích hợp vào drawer menu "Khác / Thêm" của [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx) dưới dạng hàng chuyển đổi giao diện tinh tế, có icon Mặt trời/Mặt trăng và nhãn trạng thái trực quan.
- **Bảo Vệ Runtime Electron Trong Môi Trường Web & Trình Duyệt Nhân Electron (`[type=lesson]`):**
  - Trang thi thử `/ontap/thithu` từng xuất hiện lỗi `Uncaught ReferenceError: require is not defined` khi người dùng mở bằng các trình duyệt hoặc Webview sử dụng nhân Chromium/Electron có cắm sẵn thuộc tính trong `navigator.userAgent`.
  - Khắc phục triệt để:
    1. Thay thế câu lệnh CommonJS `require('./components/WindowsLoginScreen')` bằng ESM static import trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).
    2. Tạo hàm nhận diện chuẩn `isElectronRuntime()` trong [`ontap-web/utils/deployConfig.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/deployConfig.ts): Chỉ xác nhận là Electron khi có `window.electron?.isElectron` hoặc `protocol === 'file:'`, tuyệt đối không phán đoán qua chuỗi `navigator.userAgent`.
    3. Đồng bộ kiểm tra an toàn tại [`ontap-win/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/App.tsx) và [`ontap-win/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx), bổ sung bộ unit test tự động [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts) (5/5 tests PASS).
- **Chuẩn Hóa Khả Năng Tiếp Cận (Accessibility & Touch Targets) Cho Phòng Thi (`[type=lesson]`):**
  - Nút checkbox trắc nghiệm `SquareCheckbox` được bổ sung thuộc tính `ariaLabel` (ví dụ: `Câu 1 đáp án A: ...`) và vòng lấy nét `focus-visible:ring-2 focus-visible:ring-blue-500` cho người dùng điều hướng bàn phím / screen reader.
  - Thanh phóng to cỡ chữ [`ZoomBar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx) được nâng cấp vùng chạm tối thiểu `44x44px` (`min-h-[44px] min-w-[44px]`), font số cố định `tabular-nums` chống giật layout khi co giãn tỷ lệ từ 90% đến 125%.
  - Khung thông báo cài đặt ứng dụng [`PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx) chuyển nền gradient sang `from-blue-700 via-blue-800 to-indigo-900` với chữ `text-white`, đạt chuẩn tương phản > 5.5:1.

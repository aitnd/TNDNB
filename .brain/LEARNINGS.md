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

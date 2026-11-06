# Đặc Tả Giao Diện Trực Quan & Wireframe Chi Tiết (`[Bước 04] /visualize` — `design-specs.md`)
## Dự Án: Chuẩn Hóa Typography Tiếng Việt Toàn Root Portal, Gắn Liên Kết `/ontap` Vào Sidebar & Đại Tu Giao Diện `ontap-web` Chuẩn Dual-Theme (`light` / `dark`)

- **Mã kế hoạch:** `261105-1836-ontap-web-ui-overhaul`
- **Ngày lập:** 05/11/2026
- **Tiêu chuẩn áp dụng:** `AWF v4.0` + `Impeccable v4.8.0 (62-Rule Craft Floor)` + `Taste-Skill v2.5.0`
- **Kết quả bốc thăm `deal.mjs` (Taste-Skill v2.5.0):**
  - **Hero Layout Archetype:** `centred / split window` (`WelcomeModal.tsx` Split Card `7fr/5fr`, `Dashboard.tsx` Bento Asymmetric 12-Col `4-col / 8-col`)
  - **Typography Pairing:** `Be Vietnam Pro` (`--font-sans`) + `Merriweather` (`--font-display`, Gate 38a `font-style: normal`) + `JetBrains Mono` (`--font-mono`, chỉ dùng cho số thuần túy)
  - **Theme Architecture:**
    - **Root Portal (`d:\Antigravity\TNDNB`):** Single Canonical Theme (**Hallmark Editorial**) + Fix triệt để lỗi "chữ to chữ bé" trên 13 file.
    - **App Ôn Tập (`d:\Antigravity\TNDNB\ontap-web`):** **Maritime EdTech High-Craft Dual-Theme (`light` / `dark`)** trên 30+ màn hình, xóa sạch 6 theme thừa (`modern`, `classic`, `sunrise`, `tri-an`, `noel`, `premium`) và xóa `SnowEffect.tsx`.
  - **Ràng buộc bất di bất dịch:** Giữ nguyên 100% (`git diff = 0`) đối với màn hình sát hạch [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx).

---

## 1. Hệ Thống Bảng Màu (`Light` / `Dark` Dual-Theme của `ontap-web` & Hallmark Editorial của Root Portal) + Typography Tiếng Việt Chuẩn Xác

### 1.1. Bảng Quy Đổi Mã Màu Hex / HSL Chuẩn Dual-Theme (`ontap-web/theme.css`)

Toàn bộ 30+ màn hình của `ontap-web` (trừ `ExamQuizScreen.tsx`) vận hành trên hệ thống biến ngữ nghĩa CSS HSL trong [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css), kích hoạt chế độ tối thông qua `[data-theme='dark']` và `@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));`:

| Token Ngữ Nghĩa (`theme.css`) | Tailwind Utility Class | Chế Độ Sáng (`:root, [data-theme='light']`) | Chế Độ Tối (`[data-theme='dark']`) | Độ Tương Phản & Ứng Dụng Thực Tế |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `210 40% 98%` (`#F8FAFC` — Warm Alabaster) | `222 47% 8%` (`#0B1120` — Deep Nautical Carbon-Slate) | Nền tổng thể toàn ứng dụng, chống mỏi mắt khi ôn luyện nhiều giờ. |
| `--foreground` | `text-foreground` | `222 47% 11%` (`#0F172A` — Deep Slate Ink) | `210 40% 96%` (`#F1F5F9` — Crisp Alabaster White) | Chữ nội dung câu hỏi, tiêu đề chính (`16.8:1` Light / `15.9:1` Dark — chuẩn AAA). |
| `--card` / `--popover` | `bg-card` / `bg-popover` | `0 0% 100%` (`#FFFFFF` — Pure Card) | `222 47% 11%` (`#111827` — Elevated Slate Surface) | Bề mặt thẻ Bento, khung câu hỏi `QuizScreen`, hộp thoại `WelcomeModal`, bảng dữ liệu. |
| `--card-foreground` | `text-card-foreground` | `222 47% 11%` (`#0F172A`) | `210 40% 96%` (`#F1F5F9`) | Chữ hiển thị trên bề mặt thẻ và modal. |
| `--primary` | `bg-primary` / `text-primary` | `211 100% 30%` (`#004A99` — Maritime Blue) | `199 89% 60%` (`#38BDF8` — Ocean Cyan) | Nút hành động chính (`Primary CTA`), thanh tiến độ, trạng thái tab/câu hỏi đang chọn. |
| `--primary-foreground` | `text-primary-foreground` | `0 0% 100%` (`#FFFFFF`) | `222 47% 8%` (`#0B1120`) | Chữ trên nền `--primary` (`8.9:1` Light / `10.4:1` Dark — chuẩn AAA). |
| `--secondary` / `--muted` | `bg-secondary` / `bg-muted` | `210 40% 94%` (`#F1F5F9` — Slate 100) | `217 33% 17%` (`#1E293B` — Slate 800) | Nền phụ cho ô số câu hỏi chưa làm, đầu bảng (`thead`), nút phụ, thanh tìm kiếm. |
| `--secondary-foreground` | `text-secondary-foreground` | `222 47% 11%` (`#0F172A`) | `210 40% 96%` (`#F1F5F9`) | Chữ trên nền nút phụ và huy hiệu. |
| `--muted-foreground` | `text-muted-foreground` | `215 16% 42%` (`#475569` — Slate 600) | `215 20% 68%` (`#94A3B8` — Slate 400) | Chữ chú thích, thời gian làm bài, nhãn phụ (`7.2:1` Light / `7.5:1` Dark — chuẩn AA+). |
| `--accent` | `bg-accent` / `text-accent` | `199 95% 39%` (`#0284C7` — Nautical Teal) | `199 89% 48%` (`#0EA5E9` — Sky Teal) | Điểm nhấn phụ cho thẻ Thi thử, thông báo học vụ, huy hiệu vai trò. |
| `--accent-foreground` | `text-accent-foreground` | `0 0% 100%` (`#FFFFFF`) | `0 0% 100%` (`#FFFFFF`) | Chữ trên nền `--accent`. |
| `--destructive` | `bg-destructive` / `text-destructive` | `0 84% 60%` (`#EF4444` — Signal Red) | `0 72% 58%` (`#F87171` — Coral Red) | Cảnh báo câu trả lời sai, nút xóa, thẻ "Câu hỏi hay sai". |
| `--success` | `text-emerald-600 dark:text-emerald-400` | `142 76% 36%` (`#16A34A` — Emerald 600) | `142 70% 45%` (`#22C55E` — Emerald 500) | Xác nhận đáp án đúng, huy hiệu ĐẠT sát hạch. |
| `--border` / `--input` | `border-border` / `border-input` | `214 32% 91%` (`#E2E8F0` — Slate 200) | `217 33% 20%` (`#1E293B` — Slate 800) | Đường kẻ `1px solid` sắc nét phân tách thẻ, ô đáp án và bảng dữ liệu. |
| `--ring` | `ring-ring` | `211 100% 30%` (`#004A99`) | `199 89% 60%` (`#38BDF8`) | Viền focus bàn phím `focus-visible:ring-2`. |

---

### 1.2. Kiến Trúc Typography Tiếng Việt Chuẩn Xác (Xử Lý Triệt Để Lỗi "Chữ To Chữ Bé")

#### A. Cấu Hình `next/font/google` Tại [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx) & [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css)
- **Xóa bỏ hoàn toàn `Rubik`** (thiếu subset `'vietnamese'`) trong `app/layout.tsx`.
- **Nạp bộ 3 phông chữ chuẩn Tiếng Việt (`subsets: ['latin', 'vietnamese']`, `display: 'swap'`):**
  1. `Be_Vietnam_Pro` (`weight: ['300', '400', '500', '600', '700']`, `variable: '--font-sans'`) — Phông chữ giao diện, menu, nhãn, ngày tháng, bảng dữ liệu và nội dung bài đọc.
  2. `Merriweather` (`weight: ['400', '700', '900']`, `variable: '--font-display'`) — Phông chữ tiêu đề báo chí (`h1..h6`), bắt buộc `font-style: normal !important` (Impeccable Gate 38a).
  3. `JetBrains_Mono` (`weight: ['400', '600', '700']`, `variable: '--font-mono'`) — **Chỉ dùng cho con số thuần túy** (`01..04`, cột số tiền VNĐ), tuyệt đối không dùng cho từ Tiếng Việt có dấu.
- **Sửa lỗi `@theme` tự tham chiếu trong [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css#L10-L12):**
  - Đổi `--font-sans: var(--font-sans), sans-serif;` thành `--font-sans: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;`.

#### B. Bảng Quy Chuẩn Cỡ Chữ & Chuyển Đổi 11 File `.module.css` Trên Root Portal

| File CSS Module | Selector Cần Chuẩn Hóa | Thuộc Tính Typography Bắt Buộc |
| :--- | :--- | :--- |
| [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css) | `.metaBadge`, `.categoryLabel`, `.navRow1 a`, `.categoryGroup a` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif);` (Đảm bảo chữ `ĐÀO TẠO`, `SÁT HẠCH`, `CHUYÊN MỤC:`, `GIỚI THIỆU` đồng nhất 100% `x-height`). |
| [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css) | `.kickerTag`, `.metaDate`, `.briefingCode`, `.briefingDate`, `.postDate` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` *(Giữ `--font-mono` cho `.briefingIndex` `01..04` & `.sectionIndex` `01`)*. |
| [app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css) | `.meta` / `.postMeta` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` |
| [app/danh-muc/[categoryId]/page.module.css](file:///d:/Antigravity/TNDNB/app/danh-muc/%5BcategoryId%5D/page.module.css) | `.postDate` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` |
| [app/hoc-phi/page.module.css](file:///d:/Antigravity/TNDNB/app/hoc-phi/page.module.css) | `.table th` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif);` *(Giữ `--font-mono` + `tabular-nums` cho `.table td:last-child`)*. |
| [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) | `.roleTag` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-weight: 700;` |
| [app/quan-ly/dang-bai/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/page.module.css) | `.userTable th`, `.dateCell` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` |
| [app/quan-ly/tai-khoan/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.module.css) | `.userTable th`, `.rolePill` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` |
| [app/quan-ly/[roomId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/%5BroomId%5D/page.module.css) | `.statusBadge`, `.table th`, `.statusTag` | `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif); font-variant-numeric: tabular-nums;` |
| [app/tra-cuu-dia-chi/page.module.css](file:///d:/Antigravity/TNDNB/app/tra-cuu-dia-chi/page.module.css) | `.container` (dòng 7) | Thay `'Segoe UI', Tahoma...` bằng `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif);` |
| [components/StudentCard.module.css](file:///d:/Antigravity/TNDNB/components/StudentCard.module.css) | `.card` (dòng 14) | Thay `'Arial', sans-serif` bằng `font-family: var(--font-sans, 'Be Vietnam Pro', sans-serif);` |

---

## 2. Wireframe ASCII Trực Quan & Exact Tailwind/CSS Classes Cho Từng Cụm Màn Hình

### Màn Hình 0 (Root Portal): Thanh `Navbar.tsx` Đồng Nhất Chiều Cao Chữ & Khung Widget `"Tra cứu & Tiện ích"` Trong `Sidebar.tsx`

#### 0A. Wireframe ASCII — `Navbar.tsx` & `Sidebar.tsx` ([components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx#L137-L151))
```text
+----------------------------------------------------------------------------------------------------+
| TẦNG 1 META BAR (font-family: var(--font-sans) — 100% chữ Tiếng Việt có dấu đều tăm tắp)           |
| CỔNG THÔNG TIN ĐÀO TẠO & SÁT HẠCH THUYỀN VIÊN | 022.96.282.969 | email@...          [ Đăng nhập ]  |
+----------------------------------------------------------------------------------------------------+
| TẦNG 3 MAIN NAV (font-family: var(--font-sans) — Xóa bỏ hoàn toàn hiện tượng "chữ to chữ bé")      |
| TRANG CHỦ    GIỚI THIỆU    TƯ VẤN    ĐÀO TẠO    HỌC PHÍ    THƯ VIỆN    TÀI LIỆU    LIÊN HỆ         |
| -------------------------------------------------------------------------------------------------- |
| CHUYÊN MỤC:  Tin tức - Sự kiện  /  Thông báo tuyển sinh  /  Văn bản pháp quy  /  Giới thiệu việc làm|
+----------------------------------------------------------------------------------------------------+

+------------------------------------------------------------------+
| SIDEBAR WIDGET: TRA CỨU & TIỆN ÍCH (.widgetBox .sidebarWidget)   |
| Nền #FFFFFF | Viền 1px solid #CBD5E1 | Bo góc 4px | Padding 20px |
| ================================================================ |
| 🎓 Ôn tập & Thi thử Trực tuyến  (--> href="/ontap", #003566)     |
| ---------------------------------------------------------------- |
| 🔍 Tra cứu Văn bằng             (--> viwa.fds.vn, target=_blank) |
| ---------------------------------------------------------------- |
| 🍴 Thổ Địa Ninh Bình            (--> thodia.hlstudio.top)        |
+------------------------------------------------------------------+
```

#### 0B. Đặc Tả Code & CSS Chính Xác
- **Trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx#L137-L151):**
  - Mục đầu tiên trong `<ul className={styles.linkList}>` của hộp **"Tra cứu & Tiện ích"**:
    ```tsx
    <li>
      <Link href="/ontap">
        <i className="fas fa-graduation-cap" style={{ color: 'var(--color-accent, #003566)' }}></i> Ôn tập &amp; Thi thử Trực tuyến
      </Link>
    </li>
    ```
  - Không thêm `/ontap` vào `Navbar.tsx`, `Footer.tsx`, `MobileBottomNav.tsx` hay `app/page.tsx` để bảo toàn 100% bài test `scripts/portal-navbar-cleanup.test.ts`.

---

### Màn Hình 1 (App Shell & `ThemeSwitcher.tsx`): `TopNavbar.tsx`, `MobileHeader.tsx`, `MobileBottomNav.tsx` & 1-Click `ThemeSwitcher.tsx`

#### 1A. Wireframe ASCII — App Shell Desktop (`1440px` / `1024px`) & Mobile (`768px` / `390px`)
```text
[DESKTOP: TopNavbar.tsx — sticky top-0 z-40 h-16 bg-card/95 backdrop-blur-md border-b border-border]
+----------------------------------------------------------------------------------------------------+
| [Logo 40x40] ÔN TẬP ĐTNĐ NINH BÌNH     [Bảng điều khiển] [Lớp học] [Lịch sử] [Tải App]             |
|                                                       [🔔 2]  [ ☀️/🌙 ]  [Avatar: Nguyễn Văn A ▾] |
+----------------------------------------------------------------------------------------------------+
| [AlertMarquee.tsx — bg-primary/10 border-b border-primary/20 text-primary text-xs py-1.5]          |
| 📢 Thông báo lịch thi sát hạch thuyền viên tháng 11/2026...                                        |
+----------------------------------------------------------------------------------------------------+

[MOBILE (< 768px): MobileHeader.tsx (Top) + MobileBottomNav.tsx (Fixed Bottom)]
+---------------------------------------------------+
| [←] [Logo 32x32] ÔN TẬP ĐTNĐ       [🔔] [ ☀️/🌙 ] |  <-- MobileHeader (h-14 bg-card/95 border-b border-border)
+---------------------------------------------------+
|                (Nội dung màn hình)                |
+---------------------------------------------------+
|  [🏠 Trang chủ] [📖 Ôn tập] [🎓 Lớp học] [👤 Hồ sơ]|  <-- MobileBottomNav (h-16 bg-card/95 border-t border-border)
+---------------------------------------------------+
```

#### 1B. Exact Tailwind Classes Cho Từng Component Thuộc Màn Hình 1
- **[ontap-web/components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) (1-Click Sun/Moon Toggle — Xóa sạch menu 8 theme):**
  - Container Button: `inline-flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl border border-border bg-secondary/70 hover:bg-secondary text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
  - Khi `theme === 'dark'`: Hiển thị `<SunIcon className="w-5 h-5 text-amber-400 transition-transform duration-200" />` với `title="Chuyển sang giao diện Sáng"`.
  - Khi `theme === 'light'`: Hiển thị `<MoonIcon className="w-5 h-5 text-slate-700 transition-transform duration-200" />` với `title="Chuyển sang giao diện Tối"`.
- **[ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx):**
  - Header Shell: `sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-border transition-colors`
  - Nav Item Default: `px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors`
  - Nav Item Active: `px-3.5 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/10`
- **[ontap-web/components/MobileHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileHeader.tsx) & [ontap-web/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx):**
  - `MobileHeader`: `sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card/95 backdrop-blur-md border-b border-border md:hidden`
  - `MobileBottomNav`: `fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-16 bg-card/95 backdrop-blur-md border-t border-border md:hidden pb-safe`
  - Tab Button: `flex flex-col items-center justify-center flex-1 min-h-[44px] gap-1 text-xs font-medium text-muted-foreground data-[active=true]:text-primary data-[active=true]:font-semibold`

---

### Màn Hình 2 (`WelcomeModal.tsx`, Bento Asymmetric 12-Col `Dashboard.tsx` & Auth Screens)

#### 2A. Wireframe ASCII — `WelcomeModal.tsx` (Archetype: Split Window `7fr / 5fr`, Zero Neon Blur)
```text
+----------------------------------------------------------------------------------------------------+
| OVERLAY: fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4  |
| +------------------------------------------------------------------------------------------------+ |
| | MODAL SHELL: max-w-4xl w-full bg-card text-card-foreground border border-border rounded-2xl    | |
| | +----------------------------------------------------+---------------------------------------+ | |
| | | CỘT TRÁI (7/12 — bg-card p-6 sm:p-8)               | CỘT PHẢI (5/12 — bg-secondary/40 p-8) | | |
| | | [HỆ THỐNG ÔN TẬP & SÁT HẠCH ĐTNĐ] (Badge Primary)  | BẮT ĐẦU NGAY                          | | |
| | | Chào mừng đến với Cổng Ôn Tập                      | Chọn phương thức truy cập phù hợp:    | | |
| | | Thuyền Viên & Người Lái Phương Tiện                |                                       | | |
| | | -------------------------------------------------- | [ 🚀 Vào Ôn Tập Ngay (Khách)        ] | | |
| | | ✓ Ngân hàng đề chuẩn Cục ĐTNĐ Việt Nam             |   (bg-primary text-primary-foreground)| | |
| | | ✓ Giao diện Thi thử sát hạch thực tế 100%          |                                       | | |
| | | ✓ Hỗ trợ học Offline 100% & Đồng bộ tiến độ        | [ 🔐 Đăng Nhập Học Viên / Giáo Viên ] | | |
| | |                                                    |   (bg-card border-border text-fg)     | | |
| | +----------------------------------------------------+---------------------------------------+ | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 2B. Wireframe ASCII — `Dashboard.tsx` (Hợp Nhất Nhánh `premium` & Nhánh Thường Thành Bento Asymmetric 12-Col)
```text
+----------------------------------------------------------------------------------------------------+
| CONTAINER: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6                                   |
| +------------------------------------------------------------------------------------------------+ |
| | HÀNG TRÊN (TOP UTILITY ROW — grid grid-cols-1 lg:grid-cols-12 gap-6)                           | |
| | +-----------------------------------------------+ +------------------------------------------+ | |
| | | WeatherWidget (lg:col-span-5)                 | | AdminStatsBar (lg:col-span-7, nếu Quản lý)| | |
| | | Nền bg-card border-border rounded-xl p-4      | | Tổng HV | Lớp đang mở | Lượt thi hôm nay | | |
| | | Thời tiết Ninh Bình & Điều kiện đường thủy    | | (Số liệu font-variant-numeric: tabular)  | | |
| | +-----------------------------------------------+ +------------------------------------------+ | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | KHỐI BENTO CHÍNH (MAIN ASYMMETRIC BENTO GRID — grid grid-cols-1 lg:grid-cols-12 gap-6)         | |
| | +-------------------------------------+ +----------------------------------------------------+ | |
| | | CỘT TRÁI (4 CỘT — lg:col-span-4)    | | CỘT PHẢI (8 CỘT — lg:col-span-8 space-y-6)         | | |
| | | 1. StudentCard (Thẻ Học Viên/CB)    | | 1. WelcomeHeader + PrimaryButton                   | | |
| | |    bg-card border-border rounded-xl | |    bg-card border-border rounded-xl p-6            | | |
| | |    Ảnh thẻ, Họ tên, Lớp, Hạng bằng  | |    "Xin chào, Nguyễn Văn A!"                       | | |
| | | ----------------------------------- | |    [ ▶ BẮT ĐẦU ÔN TẬP & THI THỬ NGAY (min-h-12) ]  | | |
| | | 2. Nhóm SecondaryButton (2 nút phụ) | | -------------------------------------------------- | | |
| | |    [ Đổi Hạng Bằng ] [ Hồ Sơ Cá Nhân]| | 2. Lưới 2x2 ActionTile (QuickActionsGrid)          | | |
| | | ----------------------------------- | |    +----------------------+----------------------+ | | |
| | | 3. ProgressDashboard                | |    | 📖 Ôn Tập Theo Môn   | ⏱️ Thi Thử Sát Hạch  | | | |
| | |    bg-card border-border rounded-xl | |    | (bg-card border)     | (bg-card border)     | | | |
| | |    Tiến độ hoàn thành (%) tabular   | |    +----------------------+----------------------+ | | |
| | |                                     | |    | 🏫 Lớp Học Của Tôi   | 📊 Lịch Sử Làm Bài   | | | |
| | |                                     | |    | (bg-card border)     | (bg-card border)     | | | |
| | |                                     | |    +----------------------+----------------------+ | | |
| | +-------------------------------------+ +----------------------------------------------------+ | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 2C. Exact Tailwind Classes Cho `Dashboard.tsx`, `WelcomeModal.tsx` & Auth Screens (`LoginScreen`, `RegisterScreen`, `WindowsLoginScreen`)
- **Xóa bỏ hoàn toàn nhánh `if (theme === 'premium')` trong [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx):**
  - Mọi sub-component (`PrimaryButton`, `SecondaryButton`, `ActionTile`, `WelcomeHeader`, `StudentCard`, `ProgressDashboard`, `WeatherWidget`, `AdminStatsBar`) dùng chung 1 bộ class chuẩn Dual-Theme:
    - `PrimaryButton`: `w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all flex items-center justify-center gap-2.5`
    - `SecondaryButton`: `min-h-[44px] px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border font-medium text-sm transition-colors flex items-center justify-center gap-2`
    - `ActionTile` (2x2 Grid): `group relative flex flex-col justify-between p-5 rounded-xl bg-card hover:bg-secondary/40 text-card-foreground border border-border hover:border-primary/50 shadow-sm transition-all min-h-[120px] text-left`
- **`LoginScreen.tsx`, `RegisterScreen.tsx`, `WindowsLoginScreen.tsx`:**
  - Auth Card: `w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-2xl shadow-md p-6 sm:p-8`
  - Input Field: `w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-background text-foreground border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm`

---

### Màn Hình 3 (Luồng Học Tập & Ôn Tập Từng Môn): `LicenseSelectionScreen`, `ModeSelectionScreen`, `SubjectSelectionScreen`, `QuizScreen`, `ResultsScreen`, `ThiTrucTuyenPage`

#### 3A. Wireframe ASCII — `LicenseSelectionScreen.tsx` & `SubjectSelectionScreen.tsx`
```text
[LicenseSelectionScreen.tsx — Lưới Bento 3 cột Desktop (lg:grid-cols-3) / 2 cột Tablet (sm:grid-cols-2) / 1 cột Mobile]
+-----------------------------------+ +-----------------------------------+ +-----------------------------------+
| [HẠNG NHẤT]        [8 môn • 450 câu] | [HẠNG NHÌ]        [6 môn • 320 câu] | [HẠNG BA]        [5 môn • 250 câu] |
| Bằng Thuyền Trưởng Hạng Nhất      | | Bằng Thuyền Trưởng Hạng Nhì       | | Bằng Thuyền Trưởng Hạng Ba        |
| Ôn luyện đầy đủ lý thuyết & nghiệp| | Chương trình chuẩn sát hạch ĐTNĐ  | | Dành cho phương tiện thủy nội địa |
| [ Chọn hạng bằng này → ]          | | [ Chọn hạng bằng này → ]          | | [ Chọn hạng bằng này → ]          |
+-----------------------------------+ +-----------------------------------+ +-----------------------------------+
*(Badge "X môn • Y câu" dùng font-variant-numeric: tabular-nums; xóa sạch icon Noel / hoa hồng Tri ân)*

[SubjectSelectionScreen.tsx — Thanh tìm kiếm + Nút Luyện câu sai + Danh sách môn học kèm thanh tiến độ]
+----------------------------------------------------------------------------------------------------+
| [ 🔍 Tìm kiếm nhanh nội dung câu hỏi trong hạng bằng... (bg-card border-border min-h-[44px])     ] |
| +------------------------------------------------------------------------------------------------+ |
| | ⚠️ ÔN TẬP CÂU HỎI HAY SAI (bg-destructive/10 border border-destructive/30 rounded-xl p-4)      | |
| | Tổng hợp 14 câu bạn trả lời sai gần đây                           [ Luyện tập ngay (14 câu) → ]| |
| +------------------------------------------------------------------------------------------------+ |
| DANH SÁCH MÔN HỌC (grid grid-cols-1 md:grid-cols-2 gap-4)                                          |
| +------------------------------------------------+ +---------------------------------------------+ |
| | 01. Pháp luật giao thông đường thủy nội địa    | | 02. Nghiệp vụ vận tải & Điều động tàu       | |
| | Tiến độ: [████████████░░░░] 75% (45/60 câu)    | | Tiến độ: [██████░░░░░░░░░░] 40% (24/60 câu) | |
| +------------------------------------------------+ +---------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 3B. Wireframe ASCII — `QuizScreen.tsx` (`/ontap/lambai` — Bố Cục 2 Cột Chuẩn Light/Dark)
```text
+----------------------------------------------------------------------------------------------------+
| CONTAINER: max-w-6xl mx-auto px-4 py-6                                                             |
| LAYOUT 2 CỘT: flex flex-col lg:flex-row gap-6 items-start                                          |
| +----------------------------------------------------------------------+ +-----------------------+ |
| | CỘT TRÁI: KHUNG CÂU HỎI & ĐAP ÁN (flex-1 w-full bg-card border       | | CỘT PHẢI: BẢNG SỐ THỨ | |
| |           border-border rounded-2xl p-5 sm:p-6 shadow-sm)            | | TỰ CÂU HỎI (w-full    | |
| |                                                                      | | lg:w-[240px] shrink-0)| |
| | [Câu 12 / 60] (tabular-nums)                     [Báo lỗi câu hỏi]   | | bg-muted/50 border    | |
| | -------------------------------------------------------------------- | | border-border         | |
| | Nội dung câu hỏi hiển thị rõ nét bằng font Be Vietnam Pro            | | text-foreground       | |
| | (text-base sm:text-lg font-semibold text-foreground leading-relaxed) | | rounded-2xl p-4       | |
| |                                                                      | |                       | |
| | [ Khung ảnh minh họa R2 (nếu có): bg-secondary/40 border-border ]    | | DANH SÁCH CÂU HỎI     | |
| |                                                                      | | [01][02][03][04][05]  | |
| | +------------------------------------------------------------------+ | | [06][07][08][09][10]  | |
| | | (A) Phương án trả lời 1 (Mặc định: bg-card border-border)        | | | [11][12][13][14][15]  | |
| | +------------------------------------------------------------------+ | | ... (tabular-nums)    | |
| | | (B) Phương án trả lời 2 (Đúng: bg-emerald-500/10 border-emerald) | | |                       | |
| | +------------------------------------------------------------------+ | | Đúng: 08 | Sai: 02    | |
| | | (C) Phương án trả lời 3 (Sai: bg-rose-500/10 border-rose)        | | |                       | |
| | +------------------------------------------------------------------+ | | [ Nộp bài / Kết thúc ]| |
| |                                                                      | | [ Thoát ra ngoài     ]| |
| | [ ← Câu trước (min-h-11) ]                  [ Câu tiếp theo → ]      | |                       | |
| +----------------------------------------------------------------------+ +-----------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 3C. Exact Tailwind Classes Cho `QuizScreen.tsx` (Khắc Phục Triệt Để Lỗi Chói Mắt Ở Dark Mode)
- **Khung điều hướng câu hỏi bên phải (`220px–240px`):**
  - Thay thế hoàn toàn `bg-gray-50 border-gray-200` cũ bằng: `w-full lg:w-[240px] shrink-0 bg-muted/50 border border-border text-foreground rounded-2xl p-4 flex flex-col justify-between`
- **Ô số thứ tự câu hỏi trong lưới (`grid grid-cols-5 gap-2`):**
  - Chưa trả lời: `h-9 rounded-lg text-xs font-semibold tabular-nums border border-border bg-card text-foreground hover:border-primary/60`
  - Đang chọn (`current`): `ring-2 ring-primary ring-offset-1 ring-offset-background font-bold`
  - Đã trả lời Đúng: `bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300`
  - Đã trả lời Sai: `bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300`
- **Phương án trả lời (`option button`):**
  - Base: `w-full min-h-[48px] p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-start gap-3 text-sm sm:text-base`
  - Mặc định: `bg-card border-border text-card-foreground hover:bg-secondary/50 hover:border-primary/50`
  - Đáp án Đúng: `bg-emerald-500/10 border-emerald-500/60 text-emerald-800 dark:text-emerald-200 font-medium`
  - Đáp án Sai: `bg-rose-500/10 border-rose-500/60 text-rose-800 dark:text-rose-200 font-medium`

---

### Màn Hình 4 (Ràng Buộc Bất Di Bất Dịch — `ExamQuizScreen.tsx`)

```text
+====================================================================================================+
| 🔒 LOCKED COMPONENT: ontap-web/components/ExamQuizScreen.tsx (GIT DIFF = 0)                        |
| -------------------------------------------------------------------------------------------------- |
| • Mục đích: Mô phỏng 100% giao diện phần mềm thi sát hạch chuẩn của Cục Đường thủy nội địa VN.    |
| • Tuyệt đối KHÔNG chỉnh sửa bất kỳ dòng code, class Tailwind hay inline style nào trong file này.  |
| • Khi học viên bấm "Bắt đầu làm bài thi" từ ModeSelectionScreen, GiamKhaoSelectionScreen hoặc      |
|   Sảnh chờ ThiTrucTuyenPage, ứng dụng render nguyên bản <ExamQuizScreen />.                        |
+====================================================================================================+
```

---

### Màn Hình 5 (15 Màn Hình Quản Lý Lớp Học, Tài Khoản, Lịch Sử & Tiện Ích)

Bảng đặc tả class Tailwind chuẩn `light`/`dark` cho toàn bộ 15 màn hình quản trị và tiện ích trong `ontap-web/components/`:

| STT | Tên Component (`ontap-web/components/`) | Khung Bề Mặt Chính (Card / Container) | Bảng / Danh Sách & Số Liệu (`tabular-nums`) | Trạng Thái Đặc Thù (Badge / Input / Modal) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | [HistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/HistoryScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm` | Bảng lịch sử làm bài `overflow-x-auto`, cột Điểm & Thời gian bật `tabular-nums`. | Badge Đạt: `bg-emerald-500/15 text-emerald-700 dark:text-emerald-300`; Trượt: `bg-rose-500/15 text-rose-700 dark:text-rose-300`. |
| **2** | [MyClassScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MyClassScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Danh sách học viên cùng lớp & tiến độ `tabular-nums`. | Thẻ thông tin giáo viên chủ nhiệm `bg-secondary/50 border border-border rounded-xl p-4`. |
| **3** | [ClassManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ClassManagementScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Bảng danh sách lớp đào tạo, sĩ số `tabular-nums`, đầu bảng `bg-muted/60 text-muted-foreground`. | Modal tạo/sửa lớp: `bg-card border border-border rounded-2xl shadow-xl`, input `bg-background border-input min-h-[44px]`. |
| **4** | [AccountScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AccountScreen.tsx) | `max-w-3xl mx-auto bg-card text-card-foreground border border-border rounded-2xl p-6 sm:p-8` | Số CCCD, SĐT, Ngày sinh hiển thị `tabular-nums`. | Form cập nhật hồ sơ: input `bg-background border-input text-foreground min-h-[44px]`. |
| **5** | [UserManagerScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UserManagerScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Bảng tài khoản `overflow-x-auto`, phân trang & bộ lọc `bg-secondary/60`. | Role Badge dùng semantic token (`bg-primary/15 text-primary`, `bg-accent/15 text-accent`), xóa sạch inline màu chói. |
| **6** | [OnlineExamManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/OnlineExamManagementScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Bảng giám sát phòng thi trực tuyến, điểm số & bộ đếm `tabular-nums`. | Trạng thái phòng thi (`Đang mở` / `Đã đóng`) dùng badge semantic tương phản cao trên cả Light/Dark. |
| **7** | [NotificationMgmtScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NotificationMgmtScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Danh sách thông báo kèm ngày tạo `tabular-nums text-muted-foreground`. | Form tạo thông báo dùng `bg-background border-input rounded-xl`. |
| **8** | [UsageConfigPanel.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UsageConfigPanel.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Các ô nhập giới hạn lượt làm bài/ngày bật `tabular-nums`. | Toggle switch & nút Lưu cấu hình `bg-primary text-primary-foreground min-h-[44px]`. |
| **9** | [AnalyticsPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AnalyticsPage.tsx) | Lưới KPI Cards `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`, mỗi thẻ `bg-card border-border rounded-xl p-5`. | Toàn bộ con số KPI, tỷ lệ đỗ (%) bật `font-variant-numeric: tabular-nums`. | Biểu đồ và danh sách thống kê dùng màu `--primary`, `--accent`, `--muted` đồng bộ Light/Dark. |
| **10** | [MailboxScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MailboxScreen.tsx) | Bố cục danh sách thư & nội dung thư `bg-card border border-border rounded-2xl overflow-hidden`. | Thời gian nhận thư `tabular-nums text-xs text-muted-foreground`. | Thư chưa đọc: `bg-primary/5 font-semibold text-foreground`; Thư đã đọc: `bg-card text-muted-foreground`. |
| **11** | [DownloadAppPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/DownloadAppPage.tsx) | Hero tải ứng dụng Windows & PWA `bg-card border border-border rounded-2xl p-6 sm:p-10`. | Phiên bản (`v1.x.x`) và dung lượng file (MB) bật `tabular-nums`. | Nút tải `.exe` chính: `bg-primary text-primary-foreground min-h-[48px] px-6 rounded-xl font-semibold`. |
| **12** | [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) | Modal `max-w-2xl bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xl`. | Số hiệu phiên bản và ngày phát hành `tabular-nums`. | Danh sách điểm mới dùng `text-foreground`, nút Đóng `min-h-[44px]`. |
| **13** | [ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) | Timeline cập nhật `max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6`. | Mốc thời gian `tabular-nums` dọc theo đường kẻ `border-l-2 border-primary/40`. | Badge phiên bản `bg-primary/10 text-primary font-semibold rounded-lg px-2.5 py-1`. |
| **14** | [LoginHistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginHistoryScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Bảng phiên đăng nhập (IP, Thời gian đăng nhập, Hoạt động cuối) bật `tabular-nums`. | Nút "Đăng xuất thiết bị" dùng `bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg px-3 py-1.5`. |
| **15** | [EntertainmentScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/EntertainmentScreen.tsx) | `bg-card text-card-foreground border border-border rounded-2xl p-6` | Điểm số mini-game / giải trí bật `tabular-nums`. | Đồng bộ nền `bg-background` và thẻ `bg-card`, không dùng màu hardcode gây lóa ở Dark mode. |

---

## 3. Ma Trận Responsive 5 Mốc Khung Nhìn (`1440px`, `1024px`, `820px`, `768px`, `390px`) & 4 Trạng Thái Giao Diện

### 3.1. Ma Trận Responsive 5 Viewports

| Cụm Màn Hình | `1440px` (Desktop Rộng) | `1024px` (Laptop / Landscape Tablet) | `820px` (iPad Air / Portrait Tablet) | `768px` (Tablet Nhỏ) | `390px` (Mobile Chuẩn iPhone) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Màn hình 0: Root Portal `Navbar` & `Sidebar`** | Container `1400px`, Grid `1fr 340px`, `Sidebar` bên phải | Grid `1fr 300px`, chữ Tiếng Việt đều 100% | Chuyển về 1 cột (`1fr`), `Sidebar` xuống dưới nội dung chính | `.navRow1` & `.navRow2` cuộn ngang mượt (`overflow-x: auto`) | Padding `12px`, mục `/ontap` trong `Sidebar` cao `>= 44px` |
| **Màn hình 1: `ontap-web` App Shell** | Hiện `TopNavbar` đầy đủ + `ThemeSwitcher` `40x40px` | Hiện `TopNavbar` thu gọn khoảng cách nút | Hiện `TopNavbar` gọn | Chuyển sang `MobileHeader` (đỉnh) + `MobileBottomNav` (đáy) | `MobileHeader` + `MobileBottomNav` 4 tab chạm `>= 44x44px` |
| **Màn hình 2: `WelcomeModal` & `Dashboard`** | `WelcomeModal` 2 cột `7fr/5fr`; `Dashboard` Bento 12 cột (`4-col` / `8-col`) | `Dashboard` giữ Bento 12 cột (`4-col` / `8-col`), `gap-5` | `Dashboard` xếp dọc 1 cột (`grid-cols-1`), `QuickActionsGrid` giữ 2x2 | `WelcomeModal` xếp dọc 1 cột; `QuickActionsGrid` 2x2 | Toàn bộ thẻ xếp dọc 1 cột (`grid-cols-1`), nút CTA rộng `100%` |
| **Màn hình 3: `LicenseSelection` & `QuizScreen`** | `License` 3 cột (`lg:grid-cols-3`); `QuizScreen` 2 cột (`flex-1` + `240px`) | `License` 3 cột; `QuizScreen` 2 cột (`flex-1` + `220px`) | `License` 2 cột (`sm:grid-cols-2`); `QuizScreen` xếp dọc (Câu hỏi trên, Lưới số dưới) | `License` 2 cột; `QuizScreen` 1 cột dọc | `License` 1 cột; `QuizScreen` 1 cột, nút đáp án `min-h-[48px]` |
| **Màn hình 5: 15 Màn Hình Quản Lý & Bảng** | Bảng hiển thị đầy đủ các cột, KPI 4 cột | Bảng đầy đủ, KPI 4 cột | Bảng bọc `overflow-x-auto`, KPI 2 cột (`sm:grid-cols-2`) | Bảng cuộn ngang mượt, bộ lọc bọc dòng `flex-wrap` | KPI 1 cột, Modal rộng `calc(100vw - 2rem)`, nút cao `44px` |

### 3.2. Đặc Tả 4 Trạng Thái Giao Diện (`Loading`, `Empty`, `Error`, `Success`)
1. **`Loading` State:**
   - Khung xương (`Skeleton`) dùng `animate-pulse bg-muted rounded-xl` đúng kích thước thật của thẻ Bento / dòng bảng để giữ `CLS = 0`.
2. **`Empty` State:**
   - Khung thông báo trống `bg-card border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground` kèm nút hành động gợi ý rõ ràng (ví dụ: *"Bạn chưa có lịch sử làm bài — Bắt đầu ôn tập ngay"*).
3. **`Error` State:**
   - Hộp cảnh báo `bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-sm font-medium` kèm nút `"Thử lại"`.
4. **`Success` State:**
   - Hộp xác nhận `bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl p-4 text-sm font-medium`.

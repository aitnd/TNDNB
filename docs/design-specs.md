# Đặc Tả Giao Diện Chi Tiết (Design Specifications) — Root Portal TNDNB

- **Dự án:** Cổng thông tin Công ty cổ phần Tư vấn và Giáo dục Ninh Bình (`d:\Antigravity\TNDNB`)
- **Phong cách chủ đạo (Canonical Aesthetic):** **Hallmark Editorial — Institutional Maritime Education & News Portal**
- **Kiến trúc nhận diện:** Single Canonical Theme (Giao diện chuẩn mực duy nhất — **Loại bỏ hoàn toàn** `ThemeContext`, `ThemeSwitcher`, `ThemeEffects`, `MusicPlayer` và toàn bộ các nhánh theme cũ `dark`, `noel`, `classic`, `modern`, `sunrise`, `tri-an`)
- **Archetypes áp dụng (Taste-Skill v2.5.0 + Impeccable v4.8.0):**
  - **Macrostructure:** `20 · Ecosystem Index + Editorial Newsprint Grid`
  - **Navbar Archetype:** `N6 · Newspaper Masthead` (3 tầng chuẩn cơ quan đào tạo hàng hải - đường thủy nội địa)
  - **Hero Archetype:** `H2 · Split Diptych` (`7fr` Tiêu điểm đào tạo / `5fr` Bản tin học vụ đánh số `01..04` kèm đường kẻ mảnh `1px solid #CBD5E1`)
  - **Section Header Archetype:** `S1 · Left-Margin Numbered` (`01 — TIN TỨC & SỰ KIỆN ĐÀO TẠO`)
  - **Auth & Workspace Archetype:** `Institutional Auth Card` (`/login`) & `Institutional Operations Workspace` (`/quan-ly`)

---

## 1. Hệ Thống Token & Bảng Màu Duy Nhất (Single Canonical Palette)

Toàn bộ ứng dụng chỉ sử dụng **một bảng màu sáng duy nhất** mang âm hưởng giấy in báo chí kết hợp xanh hải quân đậm (`Deep Maritime Navy`), xanh biển chính thống (`Institutional Navy`) và điểm nhấn đồng thau (`Brass Gold`) / đỏ son học vụ (`Editorial Crimson`). Mọi selector `:global([data-theme='...'])` trong các file `.module.css` và `app/globals.css` phải được xóa bỏ triệt để.

### 1.1. Bảng Token Màu Sắc Chuẩn (`:root` trong `app/globals.css`)

| Tên Biến CSS (Token) | Mã Màu (Hex/RGBA) | Vai Trò & Ứng Dụng Thực Tế | Độ Tương Phản (WCAG 2.1 AA) |
| :--- | :--- | :--- | :--- |
| `--color-paper` / `--bg-body` | `#FAF9F6` | Nền giấy báo chí ấm cho toàn bộ `<body>`, vùng nền `/login`, `/quan-ly` | Nền chuẩn chống mỏi mắt |
| `--color-surface` / `--bg-header` | `#FFFFFF` | Nền thẻ bài viết, hộp chức năng (`widgetBox`), thẻ đăng nhập (`formBox`), hộp thông tin (`infoBox`), Masthead Tầng 2 | Tương phản `18.4:1` với `--color-ink` |
| `--color-surface-subtle` / `--mau-nen-phu` | `#F1F5F9` | Nền phụ cho tiêu đề bảng (`th`), khung ảnh chờ tải, trạng thái hover nhẹ của nút phụ/tab | Tương phản `14.2:1` với `--color-ink` |
| `--color-ink` / `--text-header` | `#0B132B` | Chữ tiêu đề chính (`h1..h6`), nền Tầng 1 Meta Bar, nền `Footer`, đường kẻ nhấn `2px` | Đạt chuẩn AAA (`18.4:1` trên `#FFFFFF`) |
| `--text-main` | `#334155` | Chữ văn bản thân bài (`.post-content`), nhãn biểu mẫu (`label`), nội dung bảng | Đạt chuẩn AAA (`10.1:1` trên `#FFFFFF`) |
| `--color-ink-muted` | `#475569` | Chữ phụ đề, trích dẫn ngắn (`excerpt`), ngày đăng bài, chú thích ảnh | Đạt chuẩn AA (`7.2:1` trên `#FFFFFF`) |
| `--color-accent` / `--mau-chinh` | `#003566` | Nền Tầng 3 `mainNav`, nút hành động chính (`buttonPrimary`), tab đang chọn (`activeTab`), liên kết điều hướng | Đạt chuẩn AAA (`11.6:1` với chữ `#FFFFFF`) |
| `--color-accent-hover` | `#00284D` | Trạng thái `:hover` và `:active` cho nút chính và liên kết đậm | Đạt chuẩn AAA (`13.8:1` với chữ `#FFFFFF`) |
| `--color-gold` / `--mau-phu` | `#D4AF37` | Nút `"Đăng nhập"` và `"Quản trị"` trên Meta Bar Tầng 1, gạch chân active trên Navbar, viền đỉnh `Footer` (`4px solid #D4AF37`) | Tương phản `9.8:1` với chữ `#0A1628` |
| `--color-signal` | `#B91C1C` | Nhãn Kicker (`TIÊU ĐIỂM ĐÀO TẠO`), số thứ tự `01..04` (`briefingIndex`), mã chỉ mục `01 —` (`sectionIndex`), mức học phí nổi bật | Đạt chuẩn AA (`6.4:1` trên `#FFFFFF`) |
| `--color-rule` / `--border-color` | `#CBD5E1` | Đường kẻ chia cột, viền thẻ bài viết, viền hộp Sidebar, viền ô nhập liệu (`input`), viền bảng học phí | Hairline sắc nét chuẩn Editorial |
| `--color-success-bg` / `--color-success-text` | `#ECFDF5` / `#065F46` | Nền và chữ thông báo thành công (viền `#A7F3D0`, thanh nhấn trái `3px solid #059669`) | Đạt chuẩn AAA (`7.8:1`) |
| `--color-error-bg` / `--color-error-text` | `#FEF2F2` / `#991B1B` | Nền và chữ hộp cảnh báo lỗi (viền `#FECACA`, thanh nhấn trái `3px solid #DC2626`) | Đạt chuẩn AAA (`8.1:1`) |
| `--color-warning-bg` / `--color-warning-text` | `#FFFBEB` / `#92400E` | Nền và chữ hộp ghi chú học phí / thông báo lưu ý (viền `#FDE68A`, thanh nhấn trái `3px solid #D97706`) | Đạt chuẩn AAA (`7.4:1`) |

---

## 2. Hệ Thống Typography, Spacing, Border, Shadow & Motion

### 2.1. Hệ Thống Phông Chữ (Typography Scale — 100% Tiếng Việt)
- **Display / Editorial Serif (`--font-display`):** `'Merriweather', Georgia, serif`
  - **Quy tắc bắt buộc (Impeccable Gate 38a):** Luôn đặt `font-style: normal` cho mọi tiêu đề `h1..h6`. Tuyệt đối không dùng chữ nghiêng (`italic`) ở các tiêu đề.
- **UI & Body Sans-Serif (`--font-sans`):** `'Be Vietnam Pro', system-ui, -apple-system, sans-serif`
  - Dùng cho toàn bộ văn bản thân bài, menu điều hướng, biểu mẫu, nút bấm, bảng dữ liệu. Độ rộng dòng đọc bài chuẩn `65ch–72ch`.
- **Technical & Index Monospace (`--font-mono`):** `'JetBrains Mono', Consolas, monospace`
  - Dùng cho Kicker (`CỔNG THÔNG TIN ĐÀO TẠO & SÁT HẠCH`), số thứ tự bản tin (`01`, `02`, `03`, `04`), ngày tháng (`DD/MM/YYYY`), huy hiệu vai trò (`roleTag`), số tiền học phí (`font-variant-numeric: tabular-nums`).

| Cấp Độ Chữ | Phông Chữ | Kích Thước (Fluid / Fixed) | Độ Đậm (`font-weight`) | Chiều Cao Dòng (`line-height`) | Áp Dụng Tại |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Masthead Title (`h1`)** | `Merriweather` | `clamp(1.1rem, 1.8vw, 1.55rem)` | `700` | `1.30` | Tên công ty trên Tầng 2 `Navbar` (`uppercase`) |
| **Lead Headline (`h1`)** | `Merriweather` | `clamp(1.25rem, 2vw, 1.7rem)` | `700` | `1.30` | Tiêu đề bài Tiêu điểm đào tạo (Cột `7fr` Trang chủ) |
| **Page Title (`h1`)** | `Merriweather` | `clamp(1.5rem, 2.2vw, 2.15rem)` | `700` | `1.30` | Tiêu đề trang `/login`, `/quan-ly`, `/bai-viet/[postId]`, `/hoc-phi` |
| **Section Header (`h2`)** | `Merriweather` | `clamp(1.15rem, 1.5vw, 1.35rem)` | `700` | `1.35` | Tiêu đề mục `01 — TIN TỨC...`, tiêu đề khối `infoBox` |
| **Card / Widget Title (`h3`)** | `Merriweather` | `1.05rem` (`16.8px`) | `700` | `1.40` | Tiêu đề thẻ tin tức (`newsCard`), tiêu đề hộp `Sidebar` |
| **Body Reading** | `Be Vietnam Pro` | `1.0rem` (`16px`) | `400` | `1.70` | Nội dung bài viết, mô tả giới thiệu, tư vấn |
| **UI Control / Label** | `Be Vietnam Pro` | `0.88rem – 0.94rem` (`14px – 15px`) | `500 – 600` | `1.45` | Menu, nhãn input, nút bấm, danh sách liên kết Sidebar |
| **Kicker / Badge / Meta** | `JetBrains Mono` | `0.72rem – 0.78rem` (`11.5px – 12.5px`) | `600 – 700` | `1.25` | Kicker đầu trang, ngày đăng, badge vai trò, dòng meta |

### 2.2. Hệ Thống Khoảng Cách (Spacing Scale — Base 4px/8px)
- `--space-1`: `4px` (`0.25rem`) — Khoảng cách giữa icon và nhãn nhỏ.
- `--space-2`: `8px` (`0.5rem`) — Khoảng cách giữa các nút trên thanh meta, khoảng cách nhãn input.
- `--space-3`: `12px` (`0.75rem`) — Padding dọc của ô nhập liệu (`input`), nút bấm chuẩn.
- `--space-4`: `16px` (`1.0rem`) — Padding chuẩn trên mobile, khoảng cách giữa các mục danh sách.
- `--space-5`: `20px` (`1.25rem`) — Padding bên trong `widgetBox` và `newsCard`.
- `--space-6`: `24px` (`1.5rem`) — Padding container ngang trên Desktop, khoảng cách lưới thẻ.
- `--space-8`: `32px` (`2.0rem`) — Padding bên trong `formBox` (`/login`) và `infoBox` (`/quan-ly`).
- `--space-10`: `40px` (`2.5rem`) — Khoảng cách giữa cột nội dung chính và `Sidebar` (`layoutGrid`).

### 2.3. Quy Tắc Bo Góc, Đường Viền, Đổ Bóng & Chuyển Động (Craft Floor)
- **Bo góc chuẩn mực (`--radius-editorial: 4px`):**
  - Áp dụng đồng nhất `border-radius: 4px` cho toàn bộ thẻ bài viết, hộp Sidebar, khung ảnh, ô nhập liệu, nút bấm, huy hiệu (`roleTag`), và thanh tab (`/quan-ly`).
  - **Cấm tuyệt đối:** Không dùng pill tròn (`9999px` hoặc `99px`) hay bo góc lớn (`16px` / `1rem`) gây lệch tông trang tin tức cơ quan đào tạo.
- **Đường viền (Hairline Rules):**
  - Viền thẻ/khung mặc định: `1px solid #CBD5E1`.
  - Viền nhấn phân mục (Section / Sidebar Header): `border-bottom: 2px solid #0B132B`.
  - Viền nhấn đỉnh thẻ quan trọng (`formBox` tại `/login`, `infoBox` chính tại `/quan-ly`): `border-top: 3px solid #003566`.
- **Đổ bóng (Subtle Editorial Elevation):**
  - Mặc định (`--shadow-soft`): `0 1px 3px rgba(11, 19, 43, 0.05)`
  - Khi di chuột vào thẻ bài viết (`--shadow-hover`): `0 6px 16px rgba(11, 19, 43, 0.08)`
- **Chuyển động (Motion):**
  - Thời lượng chuyển đổi màu sắc, viền, bóng: `180ms cubic-bezier(0.22, 1, 0.36, 1)`.
  - Hiệu ứng hover thẻ tin tức: `transform: translateY(-2px)` nhẹ nhàng, lịch sự.
  - Tôn trọng `prefers-reduced-motion: reduce` (tắt toàn bộ transform/animation khi người dùng bật chế độ giảm chuyển động).

---

## 3. Bản Vẽ Wireframe ASCII & Đặc Tả CSS Chi Tiết Cho 5 Nhóm Màn Hình

### Nhóm 1: Global Shell (`Navbar` + `Footer` + `Sidebar`)

#### 1A. Wireframe ASCII — `Navbar` (Archetype N6 · Newspaper Masthead 3 Tầng)
```text
+--------------------------------------------------------------------------------------------------+
| TẦNG 1: META BAR (Nền #0B132B, Chữ #CBD5E1, Cao ~36px)                                           |
| [CỔNG THÔNG TIN ĐÀO TẠO & SÁT HẠCH THUYỀN VIÊN] | 022.96.282.969 | email@...    [ Đăng nhập ]    |
| (Hoặc khi đã đăng nhập:                                    Nguyễn Văn A  [Quản trị]  [Thoát])    |
+--------------------------------------------------------------------------------------------------+
| TẦNG 2: INSTITUTIONAL MASTHEAD (Nền #FFFFFF, Viền dưới 1px solid #CBD5E1, Padding 16px 0)        |
|  +--------+   CỔNG THÔNG TIN CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH (Merriweather Bold)    |
|  | LOGO   |   Đào tạo và cấp các loại chứng chỉ chuyên môn cho người lái, thuyền viên            |
|  | 76x76  |   phương tiện thủy nội địa. (Be Vietnam Pro Medium #475569)                          |
|  +--------+                                                                                      |
+--------------------------------------------------------------------------------------------------+
| TẦNG 3: NAVIGATION BAR (Nền #003566 Navy, Chữ #FFFFFF)                                           |
| Dòng 1:  TRANG CHỦ   GIỚI THIỆU   TƯ VẤN   ĐÀO TẠO   HỌC PHÍ   THƯ VIỆN   TÀI LIỆU   LIÊN HỆ     |
| ------------------------------------------------------------------------------------------------ |
| Dòng 2 (Nền rgba(0,0,0,0.14)): CHUYÊN MỤC: Tin tức - Sự kiện / Thông báo tuyển sinh /            |
|                                            Văn bản pháp quy / Giới thiệu việc làm                |
+--------------------------------------------------------------------------------------------------+
```

#### 1B. Đặc Tả Kỹ Thuật & CSS Cho `Navbar` ([components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) & [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css))
- **Xóa bỏ hoàn toàn:**
  - Xóa `import ThemeSwitcher from './ThemeSwitcher'` và `<ThemeSwitcher />`.
  - Xóa `import { useTheme } from '../context/ThemeContext'` và khối ảnh Noel `nav-light.png`.
  - Xóa toàn bộ các khối `:global([data-theme='...'])` trong `components/Navbar.module.css`.
- **Đổi nhãn nút đăng nhập (Tầng 1 `.metaRight`):**
  - Khi chưa đăng nhập (`!user`): Hiển thị `<Link href="/login" className={styles.loginBtn}>Đăng nhập</Link>` (thay cho `"Đăng nhập cán bộ"`).
  - Style `.loginBtn`: `background: #D4AF37`, `color: #0A1628 !important`, `padding: 4px 14px`, `border-radius: 4px`, `font-weight: 700`, `font-size: 0.78rem`, `:hover { background: #E5C158; transform: translateY(-1px); }`.
  - Khi đã đăng nhập (`user`): Hiển thị `.welcomeText` (`user.fullName`, màu `#D4AF37`), nút `.manageBtn` (`Quản trị` -> `/quan-ly`, nền `#D4AF37`, chữ `#0A1628`, bo góc `4px`) và nút `.actionLink` (`Thoát`).

#### 1C. Wireframe ASCII & Đặc Tả CSS — `Footer` ([components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx) & [components/Footer.module.css](file:///d:/Antigravity/TNDNB/components/Footer.module.css))
```text
+==================================================================================================+
| VIỀN ĐỈNH: border-top: 4px solid #D4AF37 (Brass Gold)                                            |
| NỀN FOOTER: #0B132B (Deep Maritime Ink) | Chữ: #CBD5E1 | Padding: 56px 0 28px                    |
| +----------------------------+  +-----------------------------------+  +-----------------------+ |
| | VỀ CHÚNG TÔI               |  | LIÊN KẾT NHANH                    |  | LIÊN HỆ               | |
| | -------------------------- |  | --------------------------------- |  | --------------------- | |
| | Công ty cổ phần Tư vấn và  |  | • Giới thiệu    • Thông báo TS    |  | Đ/c: Đường Triệu Việt | |
| | Giáo dục Ninh Bình         |  | • CT Đào tạo    • Văn bản PQ      |  | Vương, P. Hoa Lư, NB  | |
| | Đơn vị đào tạo, bồi dưỡng  |  | • Tuyển dụng    • Thư viện        |  | ĐT: 022.96.282.969    | |
| | & sát hạch thuyền viên TND |  | • Tin tức - SK  • Tài liệu        |  | Email: giaoducninh... | |
| |                            |  | • Việc làm      • Học phí / LH    |  |                       | |
| +----------------------------+  +-----------------------------------+  +-----------------------+ |
| ------------------------------------------------------------------------------------------------ |
|              © 2026 Công ty cổ phần Tư vấn và Giáo dục Ninh Bình. Bảo lưu mọi quyền.             |
+==================================================================================================+
```
- **Xóa bỏ hoàn toàn:** Hai thẻ `<Image src="/assets/img/footer1.png" ... />` và `<Image src="/assets/img/footer2.png" ... />` trong `components/Footer.tsx`.
- **Chuẩn hóa CSS `components/Footer.module.css`:**
  - `.footer`: `background-color: #0B132B; color: #CBD5E1; padding: 3.5rem 0 2rem; margin-top: 4rem; border-top: 4px solid #D4AF37; font-family: var(--font-sans);`
  - `.container`: `max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: 1.1fr 1.5fr 1.2fr; gap: 2.5rem;`
  - `.col h3`: `font-family: var(--font-display); color: #FFFFFF; font-size: 1.05rem; font-weight: 700; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid #D4AF37; display: inline-block;`
  - `.col ul li a`: `color: #CBD5E1; font-size: 0.9rem; text-decoration: none; transition: color 0.18s ease, padding-left 0.18s ease;`
  - `.col ul li a:hover`: `color: #D4AF37; padding-left: 4px; text-decoration: none;`

#### 1D. Đặc Tả CSS — `Sidebar` ([components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx) & [components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css))
- Xóa toàn bộ `:global([data-theme='dark'])` trong `components/Sidebar.module.css`.
- `.widgetBox`: `background-color: #FFFFFF; padding: 1.25rem; border-radius: 4px; border: 1px solid #CBD5E1; box-shadow: 0 1px 3px rgba(11, 19, 43, 0.04);`
- `.sidebarTitle`: `font-family: var(--font-display); font-size: 1.02rem; font-weight: 700; color: #0B132B; padding-bottom: 0.65rem; margin-bottom: 0.85rem; border-bottom: 2px solid #0B132B; text-transform: uppercase;`
- Trong `components/Sidebar.tsx`, đồng bộ màu icon inline (`#003566` cho tra cứu văn bằng, `#B91C1C` cho tiện ích địa phương) thay cho màu cũ lòe loẹt.

---

### Nhóm 2: Trang Chủ (`/` — [app/page.tsx](file:///d:/Antigravity/TNDNB/app/page.tsx) & [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css))

#### 2A. Wireframe ASCII — Trang Chủ (H2 Split Diptych + S1 Numbered Section + Sidebar Grid)
```text
+--------------------------------------------------------------------------------------------------+
| CONTAINER (max-width: 1400px, padding: 2rem 1.5rem 4rem)                                         |
| +----------------------------------------------------------------------------------------------+ |
| | FEATURED SLIDER (Banner tiêu điểm ngành đường thủy - border-radius: 4px, viền 1px #CBD5E1)   | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | KHỐI HALLMARK H2: SPLIT DIPTYCH (Nền #FFFFFF, Viền 1px solid #CBD5E1, Padding 1.75rem)       | |
| | +---------------------------------------------------+ | +----------------------------------+ | |
| | | CỘT TRÁI (7fr) - LEAD STORY                       | | | CỘT PHẢI (5fr) - BẢN TIN HỌC VỤ  | | |
| | | [ Khung ảnh 16:10 - border-radius: 4px ]          | | | BẢN TIN HỌC VỤ (#B91C1C Mono)    | | |
| | | [TIÊU ĐIỂM ĐÀO TẠO]  05/11/2026                   | | | Thông báo & Tuyển sinh mới       | | |
| | | Tiêu Đề Bài Viết Tâm Điểm Đào Tạo & Sát Hạch      | | | ================================ | | |
| | | Tóm tắt 220 ký tự chuẩn báo chí...                | | | 01  Thông báo chiêu sinh lớp...  | | |
| | | Đọc toàn văn bản tin →                            | | |     04/11/2026                   | | |
| | +---------------------------------------------------+ | | -------------------------------- | | |
| |                                                       | | 02  Lịch thi sát hạch thuyền...  | | |
| |                                                       | | 03  Quy định mới về chứng chỉ... | | |
| |                                                       | | 04  Tuyển dụng thuyền trưởng...  | | |
| |                                                       | +----------------------------------+ | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +---------------------------------------------------------------+  +---------------------------+ |
| | CỘT NỘI DUNG CHÍNH (1fr)                                      |  | SIDEBAR (340px cố định)   | |
| | 01 — TIN TỨC & SỰ KIỆN ĐÀO TẠO           Xem tất cả chuyên mục|  | [ Ô tìm kiếm bài viết ]   | |
| | ============================================================= |  | +-----------------------+ | |
| | +---------------------------+   +---------------------------+ |  | | TRA CỨU & TIỆN ÍCH    | | |
| | | [Ảnh 16:10]               |   | [Ảnh 16:10]               | |  | +-----------------------+ | |
| | | 03/11/2026                |   | 02/11/2026                | |  | | TIN TỨC - SỰ KIỆN     | | |
| | | Tiêu đề bài viết tin tức  |   | Tiêu đề bài viết tin tức  | |  | +-----------------------+ | |
| | | Tóm tắt 3 dòng...         |   | Tóm tắt 3 dòng...         | |  | | VĂN BẢN PHÁP QUY      | | |
| | | Xem chi tiết →            |   | Xem chi tiết →            | |  | +-----------------------+ | |
| | +---------------------------+   +---------------------------+ |  | | THÔNG BÁO TUYỂN SINH  | | |
| +---------------------------------------------------------------+  +---------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

#### 2B. Đặc Tả Kỹ Thuật & CSS Cho Trang Chủ
- Xóa toàn bộ các dòng `:global([data-theme='dark'])` và `:global([data-theme='classic'])` trong `app/page.module.css`.
- Đảm bảo `.editorialDiptych`, `.newsCard` dùng viền `1px solid var(--border-color, #CBD5E1)` và `border-radius: 4px`.
- Chỉ mục `.briefingIndex` (`01..04`) và `.sectionIndex` (`01`) dùng font `JetBrains Mono`, `font-weight: 800`, màu `#B91C1C`.

---

### Nhóm 3: Trang Đăng Nhập (`/login` — [app/login/page.tsx](file:///d:/Antigravity/TNDNB/app/login/page.tsx) & [app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css))

#### 3A. Wireframe ASCII — Trang Đăng Nhập (Institutional Auth Card)
```text
+--------------------------------------------------------------------------------------------------+
| NỀN TRANG: #FAF9F6 (Paper) | min-height: 76vh | Căn giữa dọc & ngang (padding: 2.5rem 1rem)     |
|                                                                                                  |
|                    +--------------------------------------------------------+                    |
|                    | THANH NHẤN ĐỈNH: border-top: 3px solid #003566         |                    |
|                    | KHUNG AUTH CARD (.formBox): max-width: 460px           |                    |
|                    | Nền #FFFFFF | Viền 1px solid #CBD5E1 | Bo góc 4px      |                    |
|                    |                                                        |                    |
|                    |      CỔNG THÔNG TIN ĐÀO TẠO & SÁT HẠCH (Mono #B91C1C)  |                    |
|                    |              Đăng Nhập Hệ Thống (Merriweather #0B132B) |                    |
|                    |       Dành cho Học viên, Giáo viên và Cán bộ quản lý   |                    |
|                    | ------------------------------------------------------ |                    |
|                    | [!] (Nếu có lỗi: Hộp cảnh báo nền #FEF2F2 viền trái đỏ)|                    |
|                    | [✓] (Nếu thành công: Hộp báo nền #ECFDF5 viền trái lục)|                    |
|                    |                                                        |                    |
|                    | Email hoặc Tên đăng nhập                               |                    |
|                    | [ Nhập email hoặc tên tài khoản...                   ] |                    |
|                    |                                                        |                    |
|                    | Mật khẩu                                               |                    |
|                    | [ ••••••••••••••••                                   ] |                    |
|                    |                                                        |                    |
|                    | [             ĐĂNG NHẬP (#003566, chữ trắng)         ] |                    |
|                    | [         Đăng ký tài khoản mới (Ghost #FFFFFF)      ] |                    |
|                    |                                                        |                    |
|                    | ------------------- HOẶC (Mono) ---------------------- |                    |
|                    |                                                        |                    |
|                    | [ (G)  Đăng nhập với Google (Nền #FFF, viền #CBD5E1) ] |                    |
|                    |                                                        |                    |
|                    |                   Quên mật khẩu?                       |                    |
|                    +--------------------------------------------------------+                    |
+--------------------------------------------------------------------------------------------------+
```

#### 3B. Đặc Tả Kỹ Thuật & CSS Cho `/login` ([app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css))
- **`.container`**:
  - `display: flex; min-height: 76vh; align-items: center; justify-content: center; padding: 2.5rem 1rem; background-color: var(--color-paper, #FAF9F6);`
- **`.formBox`**:
  - `width: 100%; max-width: 460px; background-color: #FFFFFF; padding: 2.25rem 2rem; border-radius: 4px; border: 1px solid #CBD5E1; border-top: 3px solid #003566; box-shadow: 0 2px 8px rgba(11, 19, 43, 0.06);`
- **Header trong `.formBox`**:
  - `.kicker` (mới hoặc gộp trên `.title`): `font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #B91C1C; letter-spacing: 0.08em; text-transform: uppercase; text-align: center; display: block; margin-bottom: 0.35rem;`
  - `.title`: `font-family: var(--font-display); font-size: 1.65rem; font-weight: 700; font-style: normal; color: #0B132B; text-align: center; margin: 0 0 0.35rem 0;`
  - `.subtitle` (tùy chọn): `font-size: 0.88rem; color: #475569; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #CBD5E1;`
- **Ô nhập liệu (`.label`, `.input`)**:
  - `.label`: `display: block; margin-bottom: 0.4rem; font-size: 0.88rem; font-weight: 600; color: #0B132B;`
  - `.input`: `width: 100%; height: 44px; padding: 0.65rem 0.85rem; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 0.95rem; font-family: var(--font-sans); color: #0B132B; background-color: #FFFFFF; box-sizing: border-box; transition: border-color 0.18s ease, box-shadow 0.18s ease;`
  - `.input:focus`: `outline: none; border-color: #003566; box-shadow: 0 0 0 3px rgba(0, 53, 102, 0.12);`
- **Hệ thống nút bấm (`.button`, `.buttonPrimary`, `.buttonSecondary`, `.buttonGoogle`)**:
  - `.button`: `width: 100%; min-height: 44px; padding: 0.65rem 1rem; font-size: 0.95rem; font-weight: 600; font-family: var(--font-sans); border-radius: 4px; cursor: pointer; transition: all 0.18s ease;`
  - `.buttonPrimary` (`Đăng nhập`): `background-color: #003566; color: #FFFFFF; border: 1px solid #003566;` -> `:hover { background-color: #00284D; }`
  - `.buttonSecondary` (`Đăng ký tài khoản mới`): `background-color: #FFFFFF; color: #0B132B; border: 1px solid #CBD5E1;` -> `:hover { background-color: #F1F5F9; border-color: #94A3B8; }`
  - `.divider`: `margin: 1.5rem 0; text-align: center; border-top: 1px solid #CBD5E1; line-height: 0.1em;`
  - `.divider span`: `background: #FFFFFF; padding: 0 12px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;`
  - `.buttonGoogle` (`Đăng nhập với Google`): `background-color: #FFFFFF; color: #0B132B; border: 1px solid #CBD5E1; display: inline-flex; align-items: center; justify-content: center; gap: 0.65rem;` -> `:hover { background-color: #F8FAFC; border-color: #003566; }`
- **Thông báo trạng thái (`.error`, `.success`)**:
  - `.error`: `margin-bottom: 1.25rem; padding: 0.75rem 1rem; background-color: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; border-left: 3px solid #DC2626; border-radius: 4px; font-size: 0.88rem; text-align: left; line-height: 1.5;`
  - `.success`: `margin-bottom: 1.25rem; padding: 0.75rem 1rem; background-color: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; border-left: 3px solid #059669; border-radius: 4px; font-size: 0.88rem; text-align: left; line-height: 1.5;`

---

### Nhóm 4: Trang Quản Trị & Khu Vực Học Viên/Cán Bộ (`/quan-ly` + `/quan-ly/ho-so`, `/quan-ly/tai-khoan`, `/quan-ly/dang-bai`)

#### 4A. Wireframe ASCII — Trang Quản Trị Trung Tâm (`/quan-ly`)
```text
+--------------------------------------------------------------------------------------------------+
| NỀN WORKSPACE: #FAF9F6 (Paper) | .wrapper (max-width: 1280px, margin: 0 auto, padding: 2rem)     |
|                                                                                                  |
| HỆ THỐNG QUẢN TRỊ & HỌC VỤ (JetBrains Mono #B91C1C)                                              |
| Bảng Điều Khiển Cá Nhân (Merriweather Bold #0B132B, 2.0rem)                                      |
| ================================================================================================ |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | THANH TAB ĐIỀU HƯỚNG (.tabContainer - Nền #FFFFFF, Viền 1px solid #CBD5E1, Bo góc 4px)       | |
| | [ ■ Tổng quan (#003566) ] [ Lớp của tôi ] [ QL Khóa học ] [ QL Tài khoản ] [ QL Bài viết ]...| |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | KHỐI THÔNG TIN CÁ NHÂN (.infoBox - Nền #FFFFFF, Viền 1px solid #CBD5E1, Bo góc 4px)          | |
| | Hồ Sơ Viên Chức / Học Viên (Merriweather #0B132B, gạch chân 2px solid #0B132B)               | |
| | +--------------------------------------------+  +------------------------------------------+ | |
| | | CỘT 1: ĐỊNH DANH                           |  | CỘT 2: THÔNG TIN LIÊN HỆ & ĐỊA PHƯƠNG    | | |
| | | Họ và tên:   Nguyễn Văn A                  |  | Số điện thoại: 0912.345.678              | | |
| | | Email:       nguyenvana@gmail.com          |  | Ngày sinh:     15/08/1995                | | |
| | | Vai trò:     [ QUẢN TRỊ VIÊN ] (Mono 4px)  |  | Địa chỉ:       P. Hoa Lư, Tỉnh Ninh Bình | | |
| | +--------------------------------------------+  +------------------------------------------+ | |
| | -------------------------------------------------------------------------------------------- | |
| | [ Chỉnh sửa Hồ sơ (#003566) ]  [ Gửi email đổi mật khẩu (Ghost) ]  [ Quản lý Tài khoản ]     | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | KHỐI THỐNG KÊ / LỊCH SỬ HỌC TẬP / QUẢN LÝ CHUYÊN MÔN (AnalyticsWidget / StudentHistory...)   | |
| | (Đồng bộ khung nền #FFFFFF, viền 1px solid #CBD5E1, bo góc 4px)                              | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

#### 4B. Đặc Tả Kỹ Thuật & CSS Cho `/quan-ly` ([app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx) & [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css))
- **`.container`**:
  - `min-height: 80vh; padding: 2.25rem 1.5rem 4rem; background-color: var(--color-paper, #FAF9F6); font-family: var(--font-sans);`
- **`.wrapper`**:
  - `max-width: 1280px; margin: 0 auto;`
- **Header Khu Vực Quản Trị**:
  - `.title`: `font-family: var(--font-display); font-size: clamp(1.5rem, 2.2vw, 2.0rem); font-weight: 700; font-style: normal; color: #0B132B; margin: 0 0 1.5rem 0; padding-bottom: 0.75rem; border-bottom: 2px solid #0B132B; text-align: left;`
- **Thanh Tab Điều Hướng (`.tabContainer`, `.tabButton`, `.activeTab`)**:
  - `.tabContainer`: `display: flex; justify-content: flex-start; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; background: #FFFFFF; padding: 0.5rem; border-radius: 4px; border: 1px solid #CBD5E1; box-shadow: 0 1px 3px rgba(11, 19, 43, 0.04);`
  - `.tabButton`: `display: inline-flex; align-items: center; gap: 0.5rem; min-height: 40px; padding: 0.55rem 1.15rem; border: 1px solid transparent; background: transparent; color: #475569; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans); cursor: pointer; border-radius: 4px; transition: all 0.18s ease;`
  - `.tabButton:hover`: `background-color: #F1F5F9; color: #0B132B;`
  - `.activeTab`: `background-color: #003566; color: #FFFFFF !important; border-color: #003566; box-shadow: none;` (Loại bỏ hoàn toàn màu `#0070f3` và bóng đổ lòe loẹt).
- **Hộp Thông Tin Cá Nhân (`.infoBox`, `.sectionTitle`, `.infoGrid`, `.roleTag`)**:
  - `.infoBox`: `background: #FFFFFF; padding: 1.75rem 2rem; border-radius: 4px; border: 1px solid #CBD5E1; border-top: 3px solid #003566; box-shadow: 0 1px 3px rgba(11, 19, 43, 0.04);`
  - `.sectionTitle`: `font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; font-style: normal; color: #0B132B; margin: 0 0 1.25rem 0; padding-bottom: 0.65rem; border-bottom: 2px solid #0B132B;`
  - `.roleTag`: `font-family: var(--font-mono); background-color: #F1F5F9; color: #003566; border: 1px solid #CBD5E1; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;` (Không dùng `border-radius: 99px`).
- **Nút Hành Động Trong `.infoBoxActions`**:
  - `.buttonPrimary`: `background-color: #003566; color: #FFFFFF; padding: 0.65rem 1.25rem; border-radius: 4px; font-weight: 600; font-size: 0.9rem; border: 1px solid #003566; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;` -> `:hover { background-color: #00284D; }`
  - `.buttonDanger` (hoặc nút phụ gửi email đặt lại mật khẩu): `background-color: #FFFFFF; color: #B91C1C; padding: 0.65rem 1.25rem; border-radius: 4px; border: 1px solid #FECACA; font-weight: 600; font-size: 0.9rem; cursor: pointer;` -> `:hover { background-color: #FEF2F2; border-color: #B91C1C; }`
- **Đồng bộ các trang con `/quan-ly/ho-so`, `/quan-ly/tai-khoan`, `/quan-ly/dang-bai`**:
  - Mọi khung trắng đều dùng `border: 1px solid #CBD5E1`, `border-radius: 4px`, tiêu đề `Merriweather` `#0B132B`, nút chính `#003566`.

---

### Nhóm 5: Các Trang Nội Dung, Đào Tạo & Học Phí (`/bai-viet/[postId]`, `/danh-muc/[categoryId]`, `/hoc-phi`, `/gioi-thieu`, `/chuong-trinh-dao-tao/*`, `/tu-van-nghe-nghiep/*`, `/tai-lieu`, `/thu-vien`, `/lien-he`)

#### 5A. Wireframe ASCII — Trang Chi Tiết Bài Viết (`/bai-viet/[postId]`) & Trang Bảng Học Phí (`/hoc-phi`)
```text
+--------------------------------------------------------------------------------------------------+
| TRANG CHI TIẾT BÀI VIẾT (/bai-viet/[postId]) - Khung đọc báo chí max-width: 840px               |
| +----------------------------------------------------------------------------------------------+ |
| | Nền #FFFFFF | Viền 1px solid #CBD5E1 | border-top: 3px solid #003566 | Bo góc 4px            | |
| | [CHUYÊN MỤC] • Đăng ngày 05/11/2026 (JetBrains Mono #475569)                                 | |
| | Tiêu Đề Bài Viết Chuẩn Báo Chí (Merriweather Bold #0B132B, line-height 1.3)                  | |
| | -------------------------------------------------------------------------------------------- | |
| | [ Ảnh đại diện bài viết - viền 1px solid #CBD5E1, bo góc 4px ]                               | |
| | Nội dung bài viết (.post-content) font Be Vietnam Pro 16px, line-height 1.75, màu #334155... | |
| |                                                                  Tác giả: Ban Đào Tạo (Nghiêng)|
| | ============================================================================================ | |
| | TÀI LIỆU ĐÍNH KÈM (.attachmentSection)                                                       | |
| | [ (PDF) Thông-bao-chieu-sinh.pdf (1.2 MB)                              Tải xuống ↓ ]         | |
| | ============================================================================================ | |
| | BÀI VIẾT CÙNG CHUYÊN MỤC (.relatedGrid - 3 cột, thẻ bo góc 4px, viền 1px solid #CBD5E1)      | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------------------------+
| TRANG BẢNG HỌC PHÍ (/hoc-phi) - Khung dữ liệu max-width: 960px                                   |
| +----------------------------------------------------------------------------------------------+ |
| | Nền #FFFFFF | Viền 1px solid #CBD5E1 | border-top: 3px solid #003566 | Bo góc 4px            | |
| | Bảng Học Phí Đào Tạo & Sát Hạch (Merriweather Bold #0B132B)                                  | |
| | +--------------------------------------------------------------------+---------------------+ | |
| | | HẠNG CHỨNG CHỈ / CHƯƠNG TRÌNH ĐÀO TẠO (Nền #0B132B, Chữ #FFFFFF)  | MỨC THU (VNĐ)       | | |
| | +--------------------------------------------------------------------+---------------------+ | |
| | | I. CHỨNG CHỈ CHUYÊN MÔN (Nền #F1F5F9, Chữ #003566 Bold)            |                     | | |
| | | 1. Chứng chỉ an toàn cơ bản                                        |       1.200.000 đ   | | |
| | |    (Font số tiền: JetBrains Mono, tabular-nums, căn phải, #B91C1C) |                     | | |
| | +--------------------------------------------------------------------+---------------------+ | |
| | [!] GHI CHÚ HỌC VỤ: Nền #FFFBEB, viền 1px solid #FDE68A, viền trái 3px solid #D97706         | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

#### 5B. Đặc Tả Kỹ Thuật & CSS Cho Nhóm Trang Nội Dung & Học Phí
- **Trang Chi Tiết Bài Viết ([app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css)):**
  - `.container`: `max-width: 840px; margin: 2.25rem auto 4rem; padding: 2.5rem; background-color: #FFFFFF; border-radius: 4px; border: 1px solid #CBD5E1; border-top: 3px solid #003566; box-shadow: 0 1px 3px rgba(11, 19, 43, 0.04);`
  - `.title`: `font-family: var(--font-display); font-size: clamp(1.5rem, 2.2vw, 2.15rem); font-weight: 700; font-style: normal; color: #0B132B; line-height: 1.3; margin-bottom: 0.75rem;`
  - `.meta`: `font-family: var(--font-mono); font-size: 0.82rem; color: #475569; margin-bottom: 1.5rem; border-bottom: 1px solid #CBD5E1; padding-bottom: 1rem;`
  - `.downloadLink`: `background-color: #FAF9F6; border: 1px solid #CBD5E1; border-radius: 4px; padding: 0.85rem 1.25rem;` -> `:hover { background-color: #F1F5F9; border-color: #003566; }`
  - `.relatedCard`: `background-color: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 4px; box-shadow: none;` -> `:hover { transform: translateY(-2px); border-color: #003566; box-shadow: 0 6px 16px rgba(11, 19, 43, 0.08); }`
- **Trang Học Phí ([app/hoc-phi/page.module.css](file:///d:/Antigravity/TNDNB/app/hoc-phi/page.module.css)):**
  - `.container`: `max-width: 960px; margin: 2.25rem auto 4rem; padding: 2.5rem; background-color: #FFFFFF; border-radius: 4px; border: 1px solid #CBD5E1; border-top: 3px solid #003566; box-shadow: 0 1px 3px rgba(11, 19, 43, 0.04);`
  - `.title`: `font-family: var(--font-display); font-size: clamp(1.5rem, 2vw, 1.95rem); font-weight: 700; font-style: normal; color: #0B132B;`
  - `.table th, .table td`: `border: 1px solid #CBD5E1; padding: 0.85rem 1rem;`
  - `.table th`: `background-color: #0B132B; color: #FFFFFF; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.03em;`
  - `.sectionHeader td`: `background-color: #F1F5F9; font-weight: 700; color: #003566;`
  - `.table td:last-child`: `text-align: right; font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-weight: 700; color: #B91C1C;`
  - `.notes`: `margin-top: 2rem; background-color: #FFFBEB; border: 1px solid #FDE68A; border-left: 3px solid #D97706; padding: 1.25rem 1.5rem; border-radius: 4px;`

---

## 4. Đặc Tả 4 Trạng Thái Giao Diện (`Loading`, `Empty`, `Error`, `Success`)

Mọi màn hình trong 5 nhóm trên bắt buộc phải tuân thủ 4 trạng thái phản hồi chuẩn mực:

| Nhóm Màn Hình | 1. Trạng Thái Đang Tải (`Loading`) | 2. Trạng Thái Trống (`Empty`) | 3. Trạng Thái Lỗi (`Error`) | 4. Trạng Thái Thành Công (`Success`) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Global Shell (`Navbar` / `Sidebar`)** | Khung danh sách `Sidebar` hiển thị chữ nghiêng nhẹ `#475569` hoặc khung giữ chỗ `height: 18px` nền `#F1F5F9`, không giật cục (`CLS = 0`). | Hiển thị `.emptyMessage` (`"Chưa có thông báo nào."`, màu `#475569`, cỡ chữ `0.85rem`, căn giữa trong `.widgetBox`). | Nếu lỗi kết nối Supabase trên Sidebar: trả về mảng rỗng `[]` an toàn, không làm sập toàn trang. | Khi đăng nhập thành công: Meta Bar Tầng 1 lập tức cập nhật tên người dùng (`user.fullName`) và nút `Quản trị`. |
| **2. Trang Chủ (`/`)** | Khung ảnh `.leadImageFrame` và `.imageWrapper` giữ sẵn tỷ lệ `aspect-ratio: 16 / 10` với nền `#F1F5F9`. | Khi `posts.length === 0`: Hiển thị hộp thông báo nền `#FFFFFF`, viền `1px solid #CBD5E1`, nội dung `"Chưa có bài viết nào được xuất bản."`. | Khi mất kết nối DB: Ghi log server và hiển thị trạng thái trống lịch sự kèm thông tin liên hệ Hotline. | Hiển thị đầy đủ Diptych `7fr/5fr`, đánh số `01..04` và lưới bài viết 2 cột. |
| **3. Trang Đăng Nhập (`/login`)** | Khi `loading === true`: Nút bấm chuyển sang `disabled` (`opacity: 0.65`, `cursor: not-allowed`), khi đang kiểm tra phiên `authLoading` hiển thị hộp `"Đang tải..."` giữa khung `#FAF9F6`. | Form khởi tạo trống với placeholder hướng dẫn rõ (`"Nhập email hoặc tên đăng nhập"`). | Hộp `.error` nền `#FEF2F2`, viền `#FECACA`, thanh nhấn trái `3px solid #DC2626`, dịch đầy đủ mã lỗi Firebase sang tiếng Việt (bao gồm `auth/unauthorized-domain`). | Hộp `.success` nền `#ECFDF5`, viền `#A7F3D0`, thanh nhấn trái `3px solid #059669` khi gửi email đặt lại mật khẩu hoặc tự động chuyển hướng sang `/quan-ly` (hoặc `?redirect=...`). |
| **4. Trang Quản Trị (`/quan-ly`)** | Trong khi `ProtectedRoute` xác thực: hiển thị khung chờ đồng bộ nền `#FAF9F6`, chữ `Merriweather` `"Đang kiểm tra quyền truy cập..."`. | Khi học viên chưa có lớp hoặc lịch sử ôn tập: hiển thị hộp trắng viền `#CBD5E1` báo `"Bạn chưa được phân vào lớp học nào."`. | Hiển thị thông báo `.error` màu `#991B1B` nền `#FEF2F2` ngay dưới nhóm nút hành động khi gửi email lỗi. | Hiển thị thông báo `.success` màu `#065F46` nền `#ECFDF5` (`"Đã gửi email đổi mật khẩu! Vui lòng kiểm tra hộp thư."`). |
| **5. Trang Nội Dung & Học Phí** | Modal xem tài liệu đính kèm có `.loadingSpinner` (`40x40px`) xoay mượt trên nền tối `rgba(11, 19, 43, 0.85)`. | Khi bài viết không có tệp đính kèm hoặc bài liên quan: tự động ẩn phần `.attachmentSection` / `.relatedSection`. | Trang `/bai-viet/[postId]` không tìm thấy bài: hiển thị `.errorContainer` với tiêu đề `"Không tìm thấy bài viết"` và nút `"← Quay về Trang chủ"`. | Tải tệp PDF/Word hoặc chia sẻ Facebook hoạt động tức thì với phản hồi hover rõ ràng. |

---

## 5. Quy Tắc Responsive Trên 5 Mốc Khung Nhìn Chuẩn Taste-Skill & Tiêu Chuẩn WCAG 2.1 AA

### 5.1. Ma Trận Responsive 5 Mốc Khung Nhìn (`1440px`, `1024px`, `820px`, `768px`, `390px`)

| Thành Phần Giao Diện | `1440px` (Desktop Rộng) | `1024px` (Laptop / Landscape Tablet) | `820px` (iPad Air / Portrait Tablet) | `768px` (Tablet Nhỏ / Phablet) | `390px` (Mobile Chuẩn iPhone) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Container Chính** | `max-width: 1400px`, `padding: 0 24px` | `max-width: 100%`, `padding: 0 24px` | `padding: 0 20px` | `padding: 0 16px` | `padding: 0 12px` (`overflow-x: hidden`) |
| **Navbar Tầng 1 (Meta Bar)** | Hiện đủ Badge + SĐT + Email + Nút `Đăng nhập` | Hiện đủ Badge + SĐT + Nút `Đăng nhập` | Ẩn SĐT/Email (`.metaContact { display: none }`), giữ Badge + `Đăng nhập` | Badge thu gọn `0.68rem` + Nút `Đăng nhập` | Badge rút gọn 1 dòng + Nút `Đăng nhập` (`min-height: 36px`) |
| **Navbar Tầng 2 & 3** | Logo `76x76`, Menu 8 mục căn giữa | Logo `68x68`, Menu 8 mục căn giữa | Logo `60x60`, Menu tự co khoảng cách | Logo `48x48`, `.navRow1` & `.navRow2` cuộn ngang mượt (`overflow-x: auto`) | Logo `42x42`, tiêu đề `0.88rem`, thanh menu vuốt ngang không hiện thanh cuộn |
| **Trang Chủ: H2 Split Diptych** | Grid 2 cột `7fr 5fr`, vạch ngăn trái `1px solid #CBD5E1` | Grid 2 cột `7fr 5fr`, `gap: 1.75rem` | Chuyển thành **1 cột dọc (`1fr`)**, vạch ngăn chuyển lên `border-top: 1px solid #CBD5E1` | 1 cột dọc, `padding: 1rem` | 1 cột dọc, `padding: 0.85rem`, tiêu đề `1.15rem` |
| **Trang Chủ: Layout Grid & News Grid** | `1fr 340px` (Content + Sidebar), `.newsGrid` 2 cột | `1fr 300px`, `.newsGrid` 2 cột | Chuyển thành **1 cột (`1fr`)**, Sidebar xuống dưới, `.newsGrid` giữ 2 cột | 1 cột, `.newsGrid` chuyển về **1 cột (`1fr`)** | 1 cột hoàn toàn, khoảng cách thẻ `1.25rem` |
| **Trang Đăng Nhập (`/login`)** | `.formBox` rộng `460px`, `padding: 2.25rem 2rem` | `.formBox` rộng `460px` | `.formBox` rộng `440px` | `.formBox` rộng `100%` (`max-width: 420px`), `padding: 1.75rem 1.5rem` | `.formBox` rộng `100%`, `padding: 1.5rem 1.15rem`, nút bấm cao `44px` |
| **Trang Quản Trị (`/quan-ly`)** | `.wrapper` `1280px`, `.infoGrid` 2 cột (`1fr 1fr`) | `.infoGrid` 2 cột, `.tabContainer` bọc dòng tự nhiên | `.infoGrid` 2 cột, `.tabButton` thu gọn padding | `.infoGrid` chuyển về **1 cột (`1fr`)**, `.infoBoxActions` xếp dọc/bọc dòng | `.tabContainer` cuộn ngang hoặc chia 2 cột đều, nút bấm rộng `100%` |
| **Trang Học Phí & Bài Viết** | Bảng đầy đủ, `.relatedGrid` 3 cột | Bảng đầy đủ, `.relatedGrid` 3 cột | `.container` `padding: 1.75rem`, `.relatedGrid` 2 cột | Bảng bọc trong `overflow-x: auto`, `.relatedGrid` 2 cột | Padding `1.25rem 1rem`, `.relatedGrid` 1 cột |

### 5.2. Danh Mục Kiểm Tra Khả Năng Truy Cập (Accessibility — WCAG 2.1 AA)
1. **Độ tương phản màu sắc (Contrast Ratio):**
   - Chữ chính `#0B132B` trên nền `#FFFFFF` đạt `18.4:1` (vượt chuẩn AAA).
   - Chữ thân bài `#334155` trên nền `#FAF9F6` đạt `9.6:1` (vượt chuẩn AAA).
   - Chữ trắng `#FFFFFF` trên nền Navy `#003566` đạt `11.6:1` (vượt chuẩn AAA).
   - Chữ `#0A1628` trên nút vàng đồng `#D4AF37` đạt `9.8:1` (vượt chuẩn AAA).
2. **Kích thước vùng chạm (Touch Targets):**
   - Toàn bộ ô nhập liệu (`input`) và nút bấm trên `/login`, `/quan-ly` đạt chiều cao tối thiểu `44px` trên thiết bị cảm ứng.
3. **Điều hướng bàn phím (Keyboard Focus Visible):**
   - Mọi liên kết, nút bấm và ô nhập liệu khi `:focus-visible` đều hiển thị viền rõ nét `outline: 2px solid #003566; outline-offset: 2px;`.
4. **Ngữ nghĩa HTML (Semantic Landmarks):**
   - Sử dụng đầy đủ `<header>`, `<nav aria-label="Điều hướng chính">`, `<main>`, `<article>`, `<aside>`, `<footer>`, và thứ tự thẻ tiêu đề `h1 -> h2 -> h3` hợp lệ.

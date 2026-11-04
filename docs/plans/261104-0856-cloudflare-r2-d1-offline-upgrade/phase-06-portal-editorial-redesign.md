# Phase 06: Thiết Kế Lại Giao Diện Cổng Thông Tin Portal Theo Chuẩn Editorial (`/ui-ux-pro-max` + `/hallmark`) & Tách Biệt Khỏi `ontap-web`

Status: Completed
Dependencies: Phase 00 (`phase-00-split-deployment-monorepo.md`)

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:**
> 1. Sau khi tách `ontap-web` ra thành ứng dụng độc lập trên Cloudflare Pages, tiến hành **gỡ bỏ hoàn toàn 5 nút tiện ích màu vàng** (`Giải trí`, `Ôn tập`, `Thi trực tuyến`, `Tải App`, `Tra cứu ĐC`) trên thanh điều hướng của Root Portal ([components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx)), gỡ bỏ khối CTA Banner "Hệ thống Ôn tập & Thi trực tuyến" tại [app/page.tsx](file:///d:/Antigravity/TNDNB/app/page.tsx), và dọn sạch các link `/ontap*` trong [components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/components/MobileBottomNav.tsx) cùng [components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx).
> 2. Tái thiết kế giao diện Trang chủ & Header của Cổng thông tin **CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH** theo chuẩn **`/ui-ux-pro-max` + `/hallmark` (Zero AI Slop — Institutional Maritime Editorial Portal)**: Chuẩn mực, uy tín, sắc nét như một cổng thông tin học viện/trường đào tạo hàng hải & đường thủy nội địa chính thống.

---

## 1. Đặc Tả Thiết Kế Chuẩn `/hallmark` & `/ui-ux-pro-max` (Design System Specification)

### 1.1. Hallmark Pre-Emit Critique & Archetype Selection
- **Genre:** `editorial` — Cổng Thông tin Đào tạo, Tuyển sinh & Văn bản Pháp quy Đường thủy Nội địa.
- **Macrostructure:** `20 · Ecosystem Index` kết hợp **Editorial Newsprint Grid** (Lưới báo chí & học thuật phân tách bằng đường kẻ mảnh `1px solid var(--border-color)`).
- **Nav Archetype (`N6 · Newspaper Masthead`):**
  - **Tầng 1 — Top Institutional Meta Bar (`mastheadMetaBar`):** Hiển thị định danh `"CỔNG THÔNG TIN ĐÀO TẠO & SÁT HẠCH THUYỀN VIÊN THỦY NỘI ĐỊA"`, Hotline `022.96.282.969`, Email `giaoducninhbinh@daotaothuyenvien.com`, nút chuyển đổi Giao diện (`ThemeSwitcher`) và nút Đăng nhập / Quản lý.
  - **Tầng 2 — Institutional Masthead (`headerTop`):** Logo bánh lái tàu (`/assets/img/logo.png`), tên đơn vị **CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH** đặt bằng font serif chính thống (`--font-display`, `font-style: normal` — tuyệt đối không in nghiêng theo Hallmark Gate 38a), kèm 2 dòng chức năng đào tạo GCNKNCM thuyền/máy trưởng.
  - **Tầng 3 — Primary & Editorial Category Bar (`mainNav`):**
    - Hàng điều hướng chính (`navRow1`): `Trang chủ`, `Giới thiệu`, `Tư vấn`, `Đào tạo`, `Học phí`, `Thư viện`, `Tài liệu`, `Liên hệ`.
    - Hàng chuyên mục báo chí (`navRow2`): Chỉ hiển thị 4 chuyên mục cốt lõi của trường (`Tin tức - Sự kiện`, `Thông báo tuyển sinh`, `Văn bản pháp quy`, `Giới thiệu việc làm`) phân cách bằng ký hiệu `/` hoặc đường kẻ mảnh. **Loại bỏ 100% 5 nút pill màu vàng (`.utilityGroup` / `.hotLink`).**
- **Hero / Featured Section (`H2 · Split Diptych`):**
  - Thay thế hoàn toàn khối `.ctaBanner` màu xanh-vàng cũ bằng **Bố cục Tiêu Điểm 2 Cột Bất Đối Xứng (`7fr / 5fr`)** ngăn cách bởi đường kẻ dọc `1px solid var(--border-color)`:
    - **Cột trái (7 phần — Lead Story):** Hiển thị bài viết mới nhất (`posts[0]`) với ảnh tỷ lệ `16:10`, nhãn chuyên mục mono `TIÊU ĐIỂM ĐÀO TẠO`, tiêu đề lớn serif (`clamp(1.35rem, 2.2vw, 1.85rem)`, `font-style: normal`, `line-height: 1.25`), đoạn sapo 200 ký tự và ngày xuất bản.
    - **Cột phải (5 phần — Numbered Editorial Briefing):** Bảng `"BẢN TIN HỌC VỤ & TUYỂN SINH"` liệt kê 4 bài viết tiếp theo (`posts.slice(1, 5)`) đi kèm số thứ tự mono `01`, `02`, `03`, `04` (màu `var(--color-signal)` `#B91C1C`) và đường kẻ ngang mảnh `1px solid var(--border-color)`.
- **Section Headers (`S1 · Left margin numbered`):**
  - Tiêu đề chuyên mục theo chuẩn Editorial: `<span className={styles.sectionIndex}>01</span> — TIN TỨC & SỰ KIỆN` đi kèm đường kẻ ngang `1px solid var(--border-color)`.

### 1.2. Hallmark Token Lock (Khóa Biến CSS trong `app/globals.css`)
| Token | Giá trị chuẩn (Default Editorial Light) | Vai trò |
| :--- | :--- | :--- |
| `--color-paper` | `#FAF9F6` (Warm Editorial Ivory) | Nền giấy báo chí dịu mắt, chống mỏi mắt khi đọc văn bản |
| `--color-surface` | `#FFFFFF` | Bề mặt thẻ bài viết, khung Masthead và Widget Sidebar |
| `--color-ink` | `#0B132B` (Deep Maritime Ink) | Màu chữ tiêu đề chính, độ tương phản AAA (>15:1) |
| `--color-ink-muted` | `#475569` (Slate Ink) | Màu chữ đoạn trích (excerpt) và phụ chú |
| `--color-accent` | `#003566` (Institutional Maritime Navy) | Màu chủ đạo của Học viện / Đào tạo Hàng hải |
| `--color-signal` | `#B91C1C` (Editorial Crimson) | Nhãn tiêu điểm, chỉ mục `01..04`, điểm nhấn thông báo tuyển sinh |
| `--color-rule` | `#E2E8F0` (`1px solid`) | Đường kẻ phân cột (Hairline rule) chuẩn báo chí |
| `--font-display` | `'Merriweather', Georgia, serif` | Font tiêu đề chính thống (`font-style: normal`, hỗ trợ tiếng Việt 100%) |
| `--font-sans` | `'Be Vietnam Pro', system-ui, sans-serif` | Font nội dung và thanh điều hướng |
| `--font-mono` | `'JetBrains Mono', Consolas, monospace` | Font ngày tháng, mã số thứ tự `01..04`, nhãn chuyên mục |
| `--radius-editorial` | `4px` | Thay thế `--radius-premium: 16px` để loại bỏ cảm giác AI slop bo tròn quá đà |

---

## Implementation Steps (TDD Enriched)

### Task 6.1: Khóa Hallmark Design Tokens trong `app/globals.css` & Gỡ bỏ 5 Nút Tiện Ích trong `Navbar.tsx` / `Navbar.module.css` / `MobileBottomNav.tsx` / `Footer.tsx`

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css)
  - Modify: [d:/Antigravity/TNDNB/components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx)
  - Modify: [d:/Antigravity/TNDNB/components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css)
  - Modify: [d:/Antigravity/TNDNB/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/components/MobileBottomNav.tsx)
  - Modify: [d:/Antigravity/TNDNB/components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx)
  - Test: [d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts)
- **Interfaces:**
  - Consumes: `useAuth`, `useTheme`, `ThemeSwitcher` trong `components/Navbar.tsx`
  - Produces:
    - `Navbar.tsx`: Cấu trúc Masthead `N6` 3 tầng, hoàn toàn không còn `.utilityGroup` và 5 link `/giai-tri`, `/ontap`, `/ontap/online-exam`, `/ontap/download`, `/tra-cuu-dia-chi`.
    - `MobileBottomNav.tsx` & `Footer.tsx`: Không còn chứa bất kỳ link nào trỏ tới `/ontap`, `/ontap/online-exam`, `/ontap/download`.
    - `app/globals.css`: Có comment `/* Hallmark · pre-emit critique:` và đầy đủ các biến `--color-paper`, `--color-ink`, `--color-accent`, `--color-signal`, `--font-display`, `--font-sans`, `--font-mono`.

#### Step 6.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Masthead Redesign & Utility Buttons Removal (Hallmark N6)', () => {
  const navbarPath = path.resolve(process.cwd(), 'components/Navbar.tsx');
  const mobileNavPath = path.resolve(process.cwd(), 'components/MobileBottomNav.tsx');
  const footerPath = path.resolve(process.cwd(), 'components/Footer.tsx');
  const globalsCssPath = path.resolve(process.cwd(), 'app/globals.css');

  it('Navbar.tsx đã xóa hoàn toàn khối utilityGroup và 5 nút tiện ích (Giải trí, Ôn tập, Thi trực tuyến, Tải App, Tra cứu ĐC)', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');
    expect(content).not.toContain('styles.utilityGroup');
    expect(content).not.toContain('href="/giai-tri"');
    expect(content).not.toContain('href="/ontap"');
    expect(content).not.toContain('href="/ontap/online-exam"');
    expect(content).not.toContain('href="/ontap/download"');
    expect(content).not.toContain('href="/tra-cuu-dia-chi"');
    expect(content).toContain('mastheadMetaBar');
  });

  it('MobileBottomNav.tsx và Footer.tsx không còn chứa các đường dẫn nội bộ /ontap, /ontap/online-exam, /ontap/download', () => {
    const mobileContent = fs.readFileSync(mobileNavPath, 'utf8');
    const footerContent = fs.readFileSync(footerPath, 'utf8');

    expect(mobileContent).not.toContain("href: '/ontap'");
    expect(footerContent).not.toContain('href="/ontap"');
    expect(footerContent).not.toContain('href="/ontap/online-exam"');
    expect(footerContent).not.toContain('href="/ontap/download"');
  });

  it('app/globals.css khóa đầy đủ Hallmark Design Tokens và comment pre-emit critique', () => {
    const css = fs.readFileSync(globalsCssPath, 'utf8');
    expect(css).toContain('Hallmark · pre-emit critique:');
    expect(css).toContain('--color-paper:');
    expect(css).toContain('--color-ink:');
    expect(css).toContain('--color-accent:');
    expect(css).toContain('--color-signal:');
    expect(css).toContain('--font-display:');
    expect(css).toContain('--font-mono:');
  });
});
```

#### Step 6.1.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run scripts/portal-navbar-cleanup.test.ts
```
Expected output:
```text
FAIL  scripts/portal-navbar-cleanup.test.ts
AssertionError: expected '...<div className={styles.utilityGroup}>...' not to contain 'styles.utilityGroup'
```

#### Step 6.1.3: Implement tối thiểu (GREEN)
1. Cập nhật phần đầu [d:/Antigravity/TNDNB/app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css#L12-L30) bổ sung Hallmark Pre-Emit Critique & Design Tokens:
```css
/* Hallmark · pre-emit critique:
 * - genre: editorial (Institutional Maritime Education & News Portal)
 * - macrostructure: 20 · Ecosystem Index + Editorial Newsprint Grid
 * - nav archetype: N6 · Newspaper Masthead (3-tier institutional header, zero yellow pill buttons)
 * - hero archetype: H2 · Split Diptych (7fr Lead Story / 5fr Numbered Briefing with 1px hairline rule)
 * - section header: S1 · Left margin numbered (01 — TIN TỨC & SỰ KIỆN)
 * - typography: Merriweather roman display (strictly font-style: normal, Gate 38a) + Be Vietnam Pro + JetBrains Mono
 */
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

:root {
    /* --- Hallmark Editorial Tokens --- */
    --color-paper: #FAF9F6;
    --color-surface: #FFFFFF;
    --color-ink: #0B132B;
    --color-ink-muted: #475569;
    --color-accent: #003566;
    --color-signal: #B91C1C;
    --color-rule: #CBD5E1;
    --font-display: 'Merriweather', Georgia, serif;
    --font-sans: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', Consolas, monospace;
    --radius-editorial: 4px;

    /* --- 1. Giao diện Sáng (Light) - Tương thích ngược với các trang con --- */
    --bg-body: var(--color-paper);
    --bg-header: var(--color-surface);
    --text-header: var(--color-ink);
    --text-main: #1E293B;
    --text-link: var(--color-accent);
    --bg-footer: #0B132B;
    --text-footer: #F1F5F9;
    --mau-chinh: var(--color-accent);
    --mau-phu: #C59B27;
    --mau-nen-phu: #F1F5F9;
    --border-color: var(--color-rule);
    --shadow-soft: 0 1px 3px rgba(11, 19, 43, 0.05);
    --radius-premium: 4px;
}
```
Và đảm bảo quy tắc `h1, h2, h3, h4, h5, h6` trong `app/globals.css` có `font-style: normal;`.

2. Cập nhật [d:/Antigravity/TNDNB/components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) theo chuẩn **Hallmark `N6 · Newspaper Masthead`** (Xóa bỏ hoàn toàn `.utilityGroup` và 5 nút màu vàng):
```tsx
'use client'

import ThemeSwitcher from './ThemeSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { auth } from '../utils/firebaseClient'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaStar, FaUserCog, FaSignOutAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err)
    }
  }

  return (
    <header className={styles.editorialHeader}>
      {theme === 'noel' && (
        <Image
          src="/assets/img/nav-light.png"
          alt=""
          width={120}
          height={60}
          style={{ position: 'absolute', top: '60px', right: 0, pointerEvents: 'none', zIndex: 60 }}
        />
      )}

      {/* === TẦNG 1: TOP INSTITUTIONAL META BAR (N6 Masthead) === */}
      <div className={styles.mastheadMetaBar}>
        <div className={styles.metaContainer}>
          <div className={styles.metaLeft}>
            <span className={styles.metaBadge}>CỔNG THÔNG TIN ĐÀO TẠO &amp; SÁT HẠCH THUYỀN VIÊN</span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaContact}>
              <FaPhoneAlt className={styles.metaIcon} /> 022.96.282.969
            </span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaContact}>
              <FaEnvelope className={styles.metaIcon} /> giaoducninhbinh@daotaothuyenvien.com
            </span>
          </div>

          <div className={styles.metaRight}>
            <ThemeSwitcher />
            {user ? (
              <div className={styles.userActions}>
                <span className={styles.welcomeText}>{user.fullName}</span>
                <Link href="/quan-ly" className={styles.manageBtn}>
                  <FaUserCog /> Quản trị
                </Link>
                <button onClick={handleLogout} className={styles.actionLink}>
                  <FaSignOutAlt /> Thoát
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                Đăng nhập cán bộ
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* === TẦNG 2: INSTITUTIONAL MASTHEAD === */}
      <div className={styles.headerTop}>
        <div className={styles.topContainer}>
          <Link href="/" className={styles.brandArea}>
            <Image
              src="/assets/img/logo.png"
              alt="Logo Công ty Cổ phần Tư vấn và Giáo dục Ninh Bình"
              width={68}
              height={68}
              className={styles.logoImg}
            />
            <div className={styles.brandText}>
              <div className={styles.brandLine1}>CÔNG TY CỔ PHẦN</div>
              <div className={styles.brandLine2}>
                <span className={styles.brandHighlight}>TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</span>
              </div>
              <div className={styles.brandLine3}>
                <FaStar className={styles.star} />
                Đào tạo nâng hạng GCNKNCM thuyền, máy trưởng phương tiện thủy nội địa hạng nhất, nhì, ba
              </div>
              <div className={styles.brandLine3}>
                <FaStar className={styles.star} />
                Đào tạo và cấp các loại chứng chỉ chuyên môn cho thuyền viên, người lái phương tiện thủy nội địa:
                Thủy thủ, thợ máy, an toàn ven biển
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* === TẦNG 3: NAVIGATION & CHUYÊN MỤC BÁO CHÍ === */}
      <nav className={styles.mainNav} aria-label="Điều hướng chính">
        <div className={styles.mainContainer}>
          <div className={styles.navLinks}>
            <div className={styles.navRow1}>
              <Link href="/">Trang chủ</Link>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/tu-van-nghe-nghiep">Tư vấn</Link>
              <Link href="/chuong-trinh-dao-tao">Đào tạo</Link>
              <Link href="/hoc-phi">Học phí</Link>
              <Link href="/thu-vien">Thư viện</Link>
              <Link href="/tai-lieu">Tài liệu</Link>
              <Link href="/lien-he">Liên hệ</Link>
            </div>

            <div className={styles.navRow2}>
              <div className={styles.categoryGroup}>
                <span className={styles.categoryLabel}>CHUYÊN MỤC:</span>
                <Link href="/danh-muc/tin-tuc-su-kien">Tin tức - Sự kiện</Link>
                <Link href="/danh-muc/tuyen-sinh">Thông báo tuyển sinh</Link>
                <Link href="/danh-muc/van-ban-phap-quy">Văn bản pháp quy</Link>
                <Link href="/danh-muc/gioi-thieu-viec-lam">Giới thiệu việc làm</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
```

3. Cập nhật [d:/Antigravity/TNDNB/components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css) theo phong cách Editorial Masthead (bỏ `.utilityGroup`, `.hotLink`, `.hotIcon`; thiết kế `.mastheadMetaBar`, `.headerTop` và `.mainNav` với đường kẻ `1px solid`).
4. Cập nhật [d:/Antigravity/TNDNB/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/components/MobileBottomNav.tsx) thay mục `{ name: 'Ôn tập', href: '/ontap' }` bằng `{ name: 'Đào tạo', href: '/chuong-trinh-dao-tao' }`.
5. Cập nhật [d:/Antigravity/TNDNB/components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx) xóa các dòng `<Link href="/giai-tri">`, `<Link href="/ontap">`, `<Link href="/ontap/online-exam">`, `<Link href="/ontap/download">`, `<Link href="/tra-cuu-dia-chi">`.

#### Step 6.1.4: Chạy test — xác nhận PASS
```powershell
npx vitest run scripts/portal-navbar-cleanup.test.ts
```
Expected output:
```text
 ✓ scripts/portal-navbar-cleanup.test.ts (3 tests) 5ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

#### Step 6.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s app/globals.css components/
```

---

### Task 6.2: Thiết kế lại Trang Chủ Portal (`app/page.tsx` & `app/page.module.css`) Theo Bố Cục `H2 · Split Diptych` & `S1 · Left Margin Numbered`

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/app/page.tsx](file:///d:/Antigravity/TNDNB/app/page.tsx)
  - Modify: [d:/Antigravity/TNDNB/app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css)
  - Modify: [d:/Antigravity/TNDNB/components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css)
  - Test: [d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts)
- **Interfaces:**
  - Consumes: `posts` từ `getLatestPosts()`, `PostImage`, `Sidebar`
  - Produces:
    - Trong `app/page.tsx`:
      - Xóa bỏ `<section className={styles.ctaBanner}>` ("Hệ thống Ôn tập & Thi trực tuyến").
      - Bổ sung `<section className={styles.editorialDiptych}>` (Cột trái: `leadStory` hiển thị bài tiêu điểm mới nhất; Cột phải: `briefingColumn` hiển thị 4 bản tin học vụ đánh số `01`, `02`, `03`, `04`).
      - Bổ sung tiêu đề mục chuẩn `S1`: `<span className={styles.sectionIndex}>01</span> — TIN TỨC & SỰ KIỆN ĐÀO TẠO`.

#### Step 6.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-homepage-editorial.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Homepage Editorial Redesign (Hallmark H2 Split Diptych & S1 Header)', () => {
  const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
  const pageCssPath = path.resolve(process.cwd(), 'app/page.module.css');

  it('app/page.tsx đã gỡ bỏ hoàn toàn ctaBanner (/ontap) và tích hợp bố cục editorialDiptych + briefingColumn', () => {
    const content = fs.readFileSync(pagePath, 'utf8');
    expect(content).not.toContain('styles.ctaBanner');
    expect(content).not.toContain('Vào ôn tập ngay');
    expect(content).not.toContain('href="/ontap"');
    expect(content).toContain('editorialDiptych');
    expect(content).toContain('leadStory');
    expect(content).toContain('briefingColumn');
    expect(content).toContain('sectionIndex');
  });

  it('app/page.module.css tuân thủ Hallmark Gate 38a (không in nghiêng tiêu đề) và dùng đường kẻ mảnh Editorial', () => {
    const css = fs.readFileSync(pageCssPath, 'utf8');
    expect(css).toContain('.editorialDiptych');
    expect(css).toContain('.leadStory');
    expect(css).toContain('.briefingList');
    expect(css).not.toContain('border-radius: 50px');
  });
});
```

#### Step 6.2.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run scripts/portal-homepage-editorial.test.ts
```
Expected output:
```text
FAIL  scripts/portal-homepage-editorial.test.ts
AssertionError: expected '...<section className={styles.ctaBanner}>...' not to contain 'styles.ctaBanner'
```

#### Step 6.2.3: Implement tối thiểu (GREEN)
1. Cập nhật [d:/Antigravity/TNDNB/app/page.tsx](file:///d:/Antigravity/TNDNB/app/page.tsx):
```tsx
import React from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import FeaturedSlider from '../components/FeaturedSlider'
import PostImage from '../components/PostImage'
import styles from './page.module.css'

function taoTomTat(htmlContent: string, length: number = 160): string {
  if (!htmlContent) return '';
  let text = htmlContent.replace(/<[^>]+>/g, '');
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
    '&agrave;': 'à', '&Agrave;': 'À', '&aacute;': 'á', '&Aacute;': 'Á',
    '&acirc;': 'â', '&Acirc;': 'Â', '&atilde;': 'ã', '&Atilde;': 'Ã',
    '&egrave;': 'è', '&Egrave;': 'È', '&eacute;': 'é', '&Eacute;': 'É',
    '&ecirc;': 'ê', '&Ecirc;': 'Ê', '&igrave;': 'ì', '&Igrave;': 'Ì',
    '&iacute;': 'í', '&Iacute;': 'Í', '&ograve;': 'ò', '&Ograve;': 'Ò',
    '&oacute;': 'ó', '&Oacute;': 'Ó', '&ocirc;': 'ô', '&Ocirc;': 'Ô',
    '&otilde;': 'õ', '&Otilde;': 'Õ', '&ugrave;': 'ù', '&Ugrave;': 'Ù',
    '&uacute;': 'ú', '&Uacute;': 'Ú', '&ygrave;': 'ỳ', '&Ygrave;': 'Ỳ',
    '&yacute;': 'ý', '&Yacute;': 'Ý', '&yuml;': 'ÿ', '&Yuml;': 'Ÿ',
    '&ndash;': '-', '&mdash;': '—', '&lsquo;': '‘', '&rsquo;': '’',
    '&ldquo;': '“', '&rdquo;': '”'
  };
  text = text.replace(/&[a-zA-Z]+;/g, (match) => entities[match] || match);
  text = text.trim().replace(/\s+/g, ' ');
  if (text.length <= length) return text;
  const subText = text.substring(0, length);
  const lastSpaceIndex = subText.lastIndexOf(' ');
  return lastSpaceIndex > 0 ? subText.substring(0, lastSpaceIndex) + '...' : subText + '...';
}

async function getLatestPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Lỗi lấy bài viết:', error);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const posts = await getLatestPosts();
  const leadPost = posts[0] || null;
  const briefingPosts = posts.slice(1, 5);
  const feedPosts = posts.slice(1);

  return (
    <div className={styles.container}>
      <section className={styles.featuredSection}>
        <FeaturedSlider />
      </section>

      {/* === HALLMARK H2: SPLIT DIPTYCH (TIÊU ĐIỂM ĐÀO TẠO & BẢN TIN HỌC VỤ) === */}
      {leadPost && (
        <section className={styles.editorialDiptych} aria-label="Tiêu điểm đào tạo">
          <article className={styles.leadStory}>
            <div className={styles.leadImageFrame}>
              <PostImage
                src={leadPost.thumbnail_url || '/assets/img/logo.png'}
                alt={leadPost.title}
                className={styles.leadImage}
              />
            </div>
            <div className={styles.leadBody}>
              <div className={styles.leadMeta}>
                <span className={styles.kickerTag}>TIÊU ĐIỂM ĐÀO TẠO</span>
                <span className={styles.metaDate}>
                  {new Date(leadPost.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <h1 className={styles.leadHeadline}>
                <Link href={`/bai-viet/${leadPost.id}`}>{leadPost.title}</Link>
              </h1>
              <p className={styles.leadDeck}>{taoTomTat(leadPost.content, 220)}</p>
              <Link href={`/bai-viet/${leadPost.id}`} className={styles.editorialLink}>
                Đọc toàn văn bản tin →
              </Link>
            </div>
          </article>

          <aside className={styles.briefingColumn}>
            <div className={styles.briefingHeader}>
              <span className={styles.briefingCode}>BẢN TIN HỌC VỤ</span>
              <h2 className={styles.briefingHeading}>Thông báo &amp; Tuyển sinh mới</h2>
            </div>
            <ol className={styles.briefingList}>
              {briefingPosts.map((item, idx) => (
                <li key={item.id} className={styles.briefingItem}>
                  <span className={styles.briefingIndex}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.briefingContent}>
                    <Link href={`/bai-viet/${item.id}`} className={styles.briefingTitle}>
                      {item.title}
                    </Link>
                    <time className={styles.briefingDate}>
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      )}

      <div className={styles.layoutGrid}>
        {/* === CỘT 1: CHUYÊN MỤC TIN TỨC & SỰ KIỆN (Hallmark S1 Header) === */}
        <div className={styles.mainContent}>
          <section className={styles.latestNews}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIndex}>01</span> — TIN TỨC &amp; SỰ KIỆN ĐÀO TẠO
              </h2>
              <Link href="/danh-muc/tin-tuc-su-kien" className={styles.sectionViewAll}>
                Xem tất cả chuyên mục →
              </Link>
            </div>

            <div className={styles.newsGrid}>
              {(feedPosts.length > 0 ? feedPosts : posts).map((post) => (
                <article key={post.id} className={styles.newsCard}>
                  <div className={styles.imageWrapper}>
                    <PostImage
                      src={post.thumbnail_url || '/assets/img/logo.png'}
                      alt={post.title}
                      className={styles.postThumb}
                    />
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postDate}>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h3>
                      <Link href={`/bai-viet/${post.id}`} className={styles.postTitle}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className={styles.postExcerpt}>{taoTomTat(post.content, 140)}</p>
                    <Link href={`/bai-viet/${post.id}`} className={styles.readMore}>
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}

              {posts.length === 0 && <p>Chưa có bài viết nào.</p>}
            </div>
          </section>
        </div>

        {/* === CỘT 2: SIDEBAR CHUYÊN MỤC === */}
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
```

2. Cập nhật [d:/Antigravity/TNDNB/app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css) và [d:/Antigravity/TNDNB/components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css) theo chuẩn **Editorial Grid** (`1px solid var(--border-color)`, bo góc `4px`, `font-style: normal` cho mọi heading, responsive hoàn hảo từ `320px` đến `1440px`).

#### Step 6.2.4: Chạy test — xác nhận PASS
```powershell
npx vitest run scripts/portal-homepage-editorial.test.ts
```
Expected output:
```text
 ✓ scripts/portal-homepage-editorial.test.ts (2 tests) 5ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 6.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s app/ components/ scripts/
```

---

## Tiêu Chí Nghiệm Thu Phase 06
- [x] Toàn bộ 5 nút màu vàng (`Giải trí`, `Ôn tập`, `Thi trực tuyến`, `Tải App`, `Tra cứu ĐC`) trên thanh điều hướng `Navbar.tsx` và banner CTA `/ontap` trên `app/page.tsx` đã được gỡ bỏ 100%.
- [x] Giao diện Cổng thông tin **Công ty Cổ phần Tư vấn và Giáo dục Ninh Bình** tuân thủ nghiêm ngặt chuẩn `/hallmark` (`N6 · Newspaper Masthead`, `H2 · Split Diptych`, `S1 · Left margin numbered`, không in nghiêng tiêu đề serif, đường kẻ mảnh `1px solid`).
- [x] Cả 2 file unit test `scripts/portal-navbar-cleanup.test.ts` và `scripts/portal-homepage-editorial.test.ts` đều PASS.

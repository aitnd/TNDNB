# Phase 01: Xóa Bỏ Hệ Thống Đa Theme Cũ & Chuẩn Hóa Global Shell (`app/globals.css`, `app/layout.tsx`, `Navbar`, `Footer`, `Sidebar`, `app/page.module.css`)

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md)

---

## Global Constraints

1. **Khóa chặt 1 giao diện duy nhất (Single Canonical Hallmark Editorial Theme):**
   - Toàn bộ Root Portal sử dụng cố định bảng màu và token chuẩn tại `:root` trong [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css):
     - `--color-paper: #FAF9F6` (Warm Alabaster Paper)
     - `--color-surface: #FFFFFF` (Pure White Surface)
     - `--color-surface-subtle: #F1F5F9` (Slate 100 Subtle Surface)
     - `--color-ink: #0B132B` (Deep Maritime Ink)
     - `--color-ink-muted: #475569` (Slate 600 Muted Text)
     - `--color-accent: #003566` (Institutional Navy)
     - `--color-accent-hover: #002244` (Deep Navy Hover)
     - `--color-gold: #D4AF37` (Brass Gold Accent)
     - `--color-signal: #B91C1C` (Editorial Crimson Signal)
     - `--color-rule: #CBD5E1` (`1px solid` Hairline Rule)
     - `--radius-editorial: 4px` (Locked `4px` Border Radius)
     - `--font-display: 'Merriweather', Georgia, serif`
     - `--font-sans: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif`
     - `--font-mono: 'JetBrains Mono', Consolas, monospace`
2. **Cấm tuyệt đối hệ thống Đa Theme (`ThemeContext` / `[data-theme]`):**
   - Xóa hoàn toàn 5 file: [context/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/context/ThemeContext.tsx), [components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.tsx), [components/ThemeSwitcher.module.css](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.module.css), [components/ThemeEffects.tsx](file:///d:/Antigravity/TNDNB/components/ThemeEffects.tsx), [components/MusicPlayer.tsx](file:///d:/Antigravity/TNDNB/components/MusicPlayer.tsx).
   - Cấm mọi selector `[data-theme=...]` hoặc `:global([data-theme=...])` và mọi hiệu ứng tuyết rơi `.snowflakes` / ảnh Noel `.decor-img`.
3. **Tuân thủ Impeccable v4.8.0 Gate 38a (Zero Italic Headings):**
   - Mọi thẻ tiêu đề `h1..h6`, `.brandTitle`, `.sectionTitle`, `.sidebarTitle` bắt buộc đặt `font-style: normal`. Tuyệt đối không dùng chữ nghiêng cho tiêu đề.

---

## Review Focus (5 Tình Huống Biên Trọng Tâm)

1. **Xử lý `username` không có `@` tại `/login`:** Hàm `resolveEmailFromUsername(input)` phải tự động nối hậu tố `@gmail.com` cho cả hai luồng **Đăng nhập** (`handleLogin`) và **Quên mật khẩu** (`handlePasswordReset`).
2. **Xử lý lỗi `auth/unauthorized-domain` khi Đăng nhập Google:** Trên các tên miền preview `.vercel.app` chưa khai báo trong Firebase Console, hàm `getFriendlyErrorMessage(err)` phải bắt chính xác mã `auth/unauthorized-domain` và hiển thị thông báo tiếng Việt hướng dẫn người dùng đăng nhập bằng Email/Mật khẩu hoặc truy cập tên miền chính thức.
3. **Loại bỏ triệt để tham chiếu `useTheme`, `ThemeProvider`, `ThemeSwitcher`, `ThemeEffects`, `MusicPlayer`:** Đảm bảo không còn bất kỳ câu lệnh `import` nào trỏ tới 5 file đã xóa trong toàn bộ dự án để quá trình biên dịch TypeScript (`npx tsc --noEmit`) và Next.js (`npm run build:portal`) đạt 0 lỗi.
4. **Liên kết và phân quyền Tab `accounts` trên `/quan-ly`:** Tab `accounts` chỉ hiển thị cho các vai trò `['admin', 'lanh_dao', 'quan_ly']` và điều hướng chuẩn xác tới `/quan-ly/tai-khoan` ([app/quan-ly/tai-khoan/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.tsx)).
5. **Chuẩn hóa bảng dữ liệu (`/hoc-phi`, `/quan-ly/*`) trên màn hình hẹp `390px`:** Mọi ô số liệu và mức học phí phải bật `font-variant-numeric: tabular-nums` và bọc trong khung cuộn ngang an toàn (`overflow-x: auto`) để không gây vỡ khung nhìn di động `390px`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### Task 1.1: Xóa Bỏ Hệ Thống Đa Theme Cũ & Chuẩn Hóa Global Shell (`globals.css`, `layout.tsx`, `Navbar`, `Footer`, `Sidebar`, `page.module.css`)

#### Step 1.1: Viết test thất bại (RED) trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts)
Tạo file kiểm thử [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts) với các assertion kiểm tra việc xóa 5 file Theme cũ, làm sạch Global Shell và đổi nhãn nút `"Đăng nhập"` trên [components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx):

```ts
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Phase 01: Single Canonical Hallmark Editorial Shell & Legacy Theme Removal', () => {
  const rootDir = process.cwd()

  it('Đã xóa hoàn toàn 5 file của hệ thống đa theme và nhạc/hiệu ứng Noel cũ', () => {
    const removedFiles = [
      'context/ThemeContext.tsx',
      'components/ThemeSwitcher.tsx',
      'components/ThemeSwitcher.module.css',
      'components/ThemeEffects.tsx',
      'components/MusicPlayer.tsx',
    ]
    for (const relPath of removedFiles) {
      expect(fs.existsSync(path.resolve(rootDir, relPath))).toBe(false)
    }
  })

  it('Global Shell (globals.css, layout.tsx, Navbar, Footer, Sidebar, page.module.css) khóa chặt 1 giao diện Hallmark Editorial duy nhất', () => {
    const globalsCss = fs.readFileSync(path.resolve(rootDir, 'app/globals.css'), 'utf8')
    const layoutTsx = fs.readFileSync(path.resolve(rootDir, 'app/layout.tsx'), 'utf8')
    const navbarCss = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.module.css'), 'utf8')
    const footerTsx = fs.readFileSync(path.resolve(rootDir, 'components/Footer.tsx'), 'utf8')
    const sidebarCss = fs.readFileSync(path.resolve(rootDir, 'components/Sidebar.module.css'), 'utf8')
    const homeCss = fs.readFileSync(path.resolve(rootDir, 'app/page.module.css'), 'utf8')

    expect(globalsCss).toContain('--color-paper: #FAF9F6')
    expect(globalsCss).toContain('--color-ink: #0B132B')
    expect(globalsCss).toContain('--color-accent: #003566')
    expect(globalsCss).toContain('--color-gold: #D4AF37')
    expect(globalsCss).toContain('--radius-editorial: 4px')
    expect(globalsCss).not.toContain('[data-theme=')
    expect(globalsCss).not.toContain('.snowflakes')
    expect(globalsCss).not.toContain('.decor-img')

    expect(layoutTsx).not.toContain('ThemeProvider')
    expect(layoutTsx).not.toContain('ThemeEffects')
    expect(layoutTsx).not.toContain('MusicPlayer')

    expect(footerTsx).not.toContain('decor-img')
    expect(navbarCss).not.toContain('data-theme')
    expect(sidebarCss).not.toContain('data-theme')
    expect(homeCss).not.toContain('data-theme')
  })

  it('Navbar.tsx hiển thị nút "Đăng nhập" thay vì "Đăng nhập cán bộ" và không còn ThemeSwitcher', () => {
    const navbarContent = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.tsx'), 'utf8')
    expect(navbarContent).toContain('href="/login"')
    expect(navbarContent).not.toContain('Đăng nhập cán bộ')
    expect(navbarContent).not.toContain('ThemeSwitcher')
    expect(navbarContent).not.toContain('useTheme')
    expect(navbarContent).toMatch(/>\s*Đăng nhập\s*</)
  })
})
```

#### Step 1.2: Chạy test — xác nhận FAIL (`RED`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì 5 file `ThemeContext.tsx`, `ThemeSwitcher.tsx`, v.v. vẫn đang tồn tại, `globals.css` vẫn chứa `[data-theme=...]` và `Navbar.tsx` vẫn hiển thị `"Đăng nhập cán bộ"`.

#### Step 1.3: Implement (`GREEN`)
1. **Xóa 5 file hệ thống đa theme & hiệu ứng Noel cũ:**
   - [context/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/context/ThemeContext.tsx)
   - [components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.tsx)
   - [components/ThemeSwitcher.module.css](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.module.css)
   - [components/ThemeEffects.tsx](file:///d:/Antigravity/TNDNB/components/ThemeEffects.tsx)
   - [components/MusicPlayer.tsx](file:///d:/Antigravity/TNDNB/components/MusicPlayer.tsx)
2. **Cập nhật [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css):**
   - Khóa chặt `:root` với đầy đủ bộ biến Hallmark Editorial (`--color-paper: #FAF9F6`, `--color-surface: #FFFFFF`, `--color-surface-subtle: #F1F5F9`, `--color-ink: #0B132B`, `--color-ink-muted: #475569`, `--color-accent: #003566`, `--color-accent-hover: #002244`, `--color-gold: #D4AF37`, `--color-signal: #B91C1C`, `--color-rule: #CBD5E1`, `--radius-editorial: 4px`, `--shadow-soft: 0 1px 3px rgba(11, 19, 43, 0.05)`).
   - Xóa toàn bộ các block `[data-theme='dark' | 'noel' | 'classic' | 'modern' | 'sunrise' | 'tri-an']`, `.decor-img`, `.snowflakes`, `.snowflake` và `@keyframes snowflakes-*`.
3. **Cập nhật [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx):**
   - Xóa import `ThemeProvider`, `MusicPlayer`, `ThemeEffects` và các thẻ tương ứng trong JSX của `RootLayout`.
4. **Cập nhật [components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) & [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css):**
   - Trong [components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx): Xóa import `ThemeSwitcher`, `useTheme`, xóa khối `{theme === 'noel' && (...)}`, xóa `<ThemeSwitcher />`, và đổi nhãn `"Đăng nhập cán bộ"` (dòng 71) thành `"Đăng nhập"`.
   - Trong [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css): Xóa toàn bộ các selector `:global([data-theme=...])`.
5. **Cập nhật [components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx), [components/Footer.module.css](file:///d:/Antigravity/TNDNB/components/Footer.module.css), [components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css) & [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css):**
   - Trong [components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx): Xóa 2 thẻ `<Image className="decor-img ..." />` (`footer1.png`, `footer2.png`).
   - Trong [components/Footer.module.css](file:///d:/Antigravity/TNDNB/components/Footer.module.css): Chuẩn hóa nền `var(--color-ink, #0B132B)`, viền trên `4px solid var(--color-gold, #D4AF37)`, tiêu đề `.col h3` màu `#FFFFFF` dùng `var(--font-display)` (`font-style: normal`) và gạch chân `2px solid var(--color-gold, #D4AF37)`.
   - Trong [components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css) và [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css): Xóa toàn bộ các block `:global([data-theme=...])`.

#### Step 1.4: Chạy test — xác nhận PASS (`GREEN`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts scripts/portal-navbar-cleanup.test.ts scripts/portal-homepage-editorial.test.ts
```
- **Kết quả kỳ vọng:** Toàn bộ các bài kiểm thử Phase 01 vượt qua (`PASS`).

#### Step 1.5: Kiểm định UI (`Impeccable v4.8.0` & `Taste-Skill v2.5.0`)
- Đối chiếu trực tiếp với [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) và [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md):
  - Xác nhận Gate 38a (`font-style: normal` trên toàn bộ `h1..h6`, `.brandTitle`, `.sectionTitle`, `.sidebarTitle`).
  - Xác nhận Zero FOUC & Zero Multi-Theme: Không còn bất kỳ truy vấn `localStorage.getItem('theme')` hay `document.documentElement.setAttribute('data-theme', ...)` nào.
  - Chạy `npx tsc --noEmit` để đảm bảo việc gỡ bỏ `ThemeContext` không làm gãy bất kỳ module nào.

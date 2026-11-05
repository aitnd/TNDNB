# Phase 04: Chuẩn Hóa Toàn Bộ Các Trang Nội Dung Portal Về Hallmark Editorial & Kiểm Thử Nghiệm Thu (`scripts/portal-login-dashboard.test.ts` + `npm run build:portal`)

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md)

---

## Global Constraints

1. **Khóa chặt 1 giao diện duy nhất (Single Canonical Hallmark Editorial Theme):**
   - Toàn bộ 10 nhóm trang nội dung thuộc `Read` Mode và `Persuade` Mode (`bai-viet/[postId]`, `danh-muc/[categoryId]`, `gioi-thieu`, `hoc-phi`, `lien-he`, `tai-lieu`, `thu-vien`, `chuong-trinh-dao-tao/*`, `tu-van-nghe-nghiep/*`, `tim-kiem`) bắt buộc sử dụng hệ thống CSS Tokens tại `:root` trong [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css):
     - `--color-paper: #FAF9F6`, `--color-surface: #FFFFFF`, `--color-surface-subtle: #F1F5F9`
     - `--color-ink: #0B132B`, `--color-ink-muted: #475569`
     - `--color-accent: #003566`, `--color-accent-hover: #002244`
     - `--color-gold: #D4AF37`, `--color-signal: #B91C1C`, `--color-rule: #CBD5E1`
     - `--radius-editorial: 4px`, `--shadow-soft: 0 1px 3px rgba(11, 19, 43, 0.05)`
2. **Cấm tuyệt đối `ThemeContext` / `[data-theme]` và cấm tiêu đề in nghiêng (Gate 38a):**
   - Mọi tiêu đề bài viết, tiêu đề chuyên mục, tiêu đề bảng học phí dùng `var(--font-display)` với `font-style: normal`.
   - Trong [app/tim-kiem/page.module.css](file:///d:/Antigravity/TNDNB/app/tim-kiem/page.module.css), từ khóa tìm kiếm `.widgetTitle span` trong tiêu đề cũng phải bỏ `font-style: italic` để tuân thủ nghiêm ngặt Gate 38a.
3. **Độ rộng dòng đọc & Bảng số liệu chuẩn biên tập:**
   - Nội dung bài đọc dài (`bai-viet/[postId]`, `gioi-thieu`, `tu-van-nghe-nghiep`) giữ độ rộng dòng đọc chuẩn `60ch–75ch` (`line-height: 1.75`).
   - Bảng biểu học phí (`/hoc-phi`) và bảng chương trình đào tạo (`/chuong-trinh-dao-tao/*`) bắt buộc bật `font-variant-numeric: tabular-nums`.

---

## Review Focus (5 Tình Huống Biên Trọng Tâm)

1. **Nhập `username` không có `@` tại `/login`:** Tự động nối `@gmail.com` cho cả Đăng nhập, Đăng ký và Quên mật khẩu.
2. **Đăng nhập Google gặp lỗi `auth/unauthorized-domain` trên domain `.vercel.app`:** Hiển thị thông báo tiếng Việt hướng dẫn rõ ràng.
3. **Không còn bất kỳ tham chiếu `useTheme`, `ThemeProvider`, `ThemeSwitcher`, `ThemeEffects`, `MusicPlayer` nào:** Toàn bộ dự án vượt qua `npx tsc --noEmit` và `npm run build:portal` với 0 lỗi.
4. **Tab `accounts` trên `/quan-ly`:** Liên kết chuẩn xác tới `/quan-ly/tai-khoan` và hiển thị đúng cho `admin`, `lanh_dao`, `quan_ly`.
5. **Bảng dữ liệu (`/hoc-phi`, `/chuong-trinh-dao-tao/*`, `/quan-ly/*`):** Bật `font-variant-numeric: tabular-nums` và không tràn ngang trên khung nhìn `390px`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### Task 4.1: Đồng Bộ 11 File CSS Module Của 10 Nhóm Trang Nội Dung Portal Về Hallmark Editorial Tokens

#### Step 4.1: Viết test thất bại (RED) trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts)
Bổ sung test case kiểm tra toàn bộ 11 file CSS Module của 10 nhóm trang nội dung đã được chuẩn hóa sang biến Hallmark Editorial (`var(--color-surface)`, `var(--color-ink)`, `var(--color-accent)`, `var(--radius-editorial)`) và bảng học phí có `tabular-nums`:

```ts
  it('Phase 04: Toàn bộ 11 file CSS Module của 10 nhóm trang nội dung Portal đồng bộ Hallmark Editorial Tokens', () => {
    const contentCssFiles = [
      'app/bai-viet/[postId]/page.module.css',
      'app/danh-muc/[categoryId]/page.module.css',
      'app/gioi-thieu/page.module.css',
      'app/hoc-phi/page.module.css',
      'app/lien-he/page.module.css',
      'app/tai-lieu/page.module.css',
      'app/thu-vien/page.module.css',
      'app/chuong-trinh-dao-tao/page.module.css',
      'app/chuong-trinh-dao-tao/chuong-trinh.module.css',
      'app/tu-van-nghe-nghiep/tu-van.module.css',
      'app/tim-kiem/page.module.css',
    ]

    for (const relCss of contentCssFiles) {
      const css = fs.readFileSync(path.resolve(rootDir, relCss), 'utf8')
      expect(css).toContain('var(--color-')
      expect(css).toContain('var(--radius-editorial')
      expect(css).not.toContain('data-theme')
    }

    const hocPhiCss = fs.readFileSync(path.resolve(rootDir, 'app/hoc-phi/page.module.css'), 'utf8')
    expect(hocPhiCss).toContain('tabular-nums')
  })
```

#### Step 4.2: Chạy test — xác nhận FAIL (`RED`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì 11 file CSS Module của các trang nội dung vẫn đang dùng mã màu cứng `#004a99`, `border-radius: 8px` và chưa có `var(--radius-editorial)` hay `tabular-nums`.

#### Step 4.3: Implement (`GREEN`)
Cập nhật đồng bộ cả 11 file CSS Module theo đúng đặc tả tại [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md):
1. **[app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css):**
   - Khung bài viết `.container` dùng `var(--color-surface, #FFFFFF)`, viền `1px solid var(--color-rule, #CBD5E1)`, bo góc `var(--radius-editorial, 4px)`, bóng `var(--shadow-soft)`.
   - Tiêu đề `.title` dùng `var(--font-display)`, `font-style: normal`, màu `var(--color-ink, #0B132B)`.
   - Dòng `.meta` dùng `var(--font-mono)`, màu `var(--color-ink-muted, #475569)`.
   - Tệp đính kèm `.downloadLink` và thẻ bài viết liên quan `.relatedCard` dùng bo góc `var(--radius-editorial, 4px)` và màu nhấn `var(--color-accent, #003566)`.
2. **[app/danh-muc/[categoryId]/page.module.css](file:///d:/Antigravity/TNDNB/app/danh-muc/%5BcategoryId%5D/page.module.css):**
   - `.widgetBox` dùng nền `var(--color-surface, #FFFFFF)`, viền `1px solid var(--color-rule, #CBD5E1)`, bo góc `var(--radius-editorial, 4px)`.
   - `.widgetTitle` dùng `var(--font-display)`, `font-style: normal`, màu `var(--color-ink, #0B132B)`, gạch chân `2px solid var(--color-ink, #0B132B)`.
3. **[app/gioi-thieu/page.module.css](file:///d:/Antigravity/TNDNB/app/gioi-thieu/page.module.css):**
   - `.container` dùng `var(--color-surface)`, viền `1px solid var(--color-rule)`, bo góc `var(--radius-editorial, 4px)`.
   - `.title` dùng `var(--font-display)`, `font-style: normal`, màu `var(--color-ink)`, gạch chân `2px solid var(--color-ink)`.
4. **[app/hoc-phi/page.module.css](file:///d:/Antigravity/TNDNB/app/hoc-phi/page.module.css):**
   - `.container` dùng `var(--color-surface)`, viền `1px solid var(--color-rule)`, bo góc `var(--radius-editorial, 4px)`.
   - `.table` bật `font-variant-numeric: tabular-nums`, `.table th` dùng nền `var(--color-accent, #003566)` chữ `#FFFFFF`, `.sectionHeader td` dùng nền `var(--color-surface-subtle, #F1F5F9)` chữ `var(--color-ink, #0B132B)`, cột mức học phí cuối cùng dùng `var(--font-mono)` màu `var(--color-signal, #B91C1C)`.
   - Khối `.notes` dùng nền `#FFFBEB`, viền `1px solid #FDE68A`, thanh nhấn trái `3px solid #D97706`, bo góc `var(--radius-editorial, 4px)`.
5. **[app/lien-he/page.module.css](file:///d:/Antigravity/TNDNB/app/lien-he/page.module.css):**
   - `.widgetBox`, `.input`, `.textarea`, `.button` đồng bộ `var(--color-surface)`, `var(--color-rule)`, `var(--color-accent)`, `var(--radius-editorial, 4px)`.
6. **[app/tai-lieu/page.module.css](file:///d:/Antigravity/TNDNB/app/tai-lieu/page.module.css) & [app/thu-vien/page.module.css](file:///d:/Antigravity/TNDNB/app/thu-vien/page.module.css):**
   - `.container`, `.title`, `.fileItem`, `.mediaItemContainer`, `.albumDeleteButton` đồng bộ `var(--color-surface)`, `var(--color-ink)`, `var(--color-accent)`, `var(--color-signal)`, `var(--radius-editorial, 4px)`.
7. **[app/chuong-trinh-dao-tao/page.module.css](file:///d:/Antigravity/TNDNB/app/chuong-trinh-dao-tao/page.module.css) & [app/chuong-trinh-dao-tao/chuong-trinh.module.css](file:///d:/Antigravity/TNDNB/app/chuong-trinh-dao-tao/chuong-trinh.module.css):**
   - `.container`, `.title`, `.linkItem`, `.table`, `.backButton` đồng bộ `var(--color-surface)`, `var(--color-ink)`, `var(--color-accent)`, `var(--radius-editorial, 4px)`, và bật `font-variant-numeric: tabular-nums` cho `.table`.
8. **[app/tu-van-nghe-nghiep/tu-van.module.css](file:///d:/Antigravity/TNDNB/app/tu-van-nghe-nghiep/tu-van.module.css) & [app/tim-kiem/page.module.css](file:///d:/Antigravity/TNDNB/app/tim-kiem/page.module.css):**
   - Đồng bộ `var(--color-surface)`, `var(--color-ink)`, `var(--color-accent)`, `var(--radius-editorial, 4px)`; trong `app/tim-kiem/page.module.css` đặt `.widgetTitle span { color: var(--color-signal, #B91C1C); font-style: normal; }`.

#### Step 4.4: Chạy test — xác nhận PASS (`GREEN`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts scripts/portal-navbar-cleanup.test.ts scripts/portal-homepage-editorial.test.ts
```

#### Step 4.5: Kiểm định UI (`Impeccable v4.8.0` & `Taste-Skill v2.5.0`) & Build Nghiệm Thu Toàn Portal
Chạy bộ lệnh kiểm định cuối cùng:
```powershell
npx tsc --noEmit
npm run build:portal
```
- **Tiêu chí hoàn thành:**
  - `npx vitest run` báo `PASS` 100% các bài kiểm thử.
  - `npx tsc --noEmit` kết thúc với `exit code 0`.
  - `npm run build:portal` biên dịch thành công toàn bộ các route trên Root Portal (`/`, `/login`, `/quan-ly`, `/quan-ly/ho-so`, `/quan-ly/tai-khoan`, `/quan-ly/dang-bai`, `/quan-ly/[roomId]`, `/bai-viet/[postId]`, `/danh-muc/[categoryId]`, `/gioi-thieu`, `/hoc-phi`, `/lien-he`, `/tai-lieu`, `/thu-vien`, `/chuong-trinh-dao-tao/*`, `/tu-van-nghe-nghiep/*`, `/tim-kiem`).

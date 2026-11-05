# Phase 02 & Phase 03: Khôi Phục & Thiết Kế Mới `/login`, `/quan-ly` Cùng Các Trang Con Quản Trị Theo Chuẩn Hallmark Editorial

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md)

---

## Global Constraints

1. **Khóa chặt 1 giao diện duy nhất (Single Canonical Hallmark Editorial Theme):**
   - Mọi màn hình thuộc nhóm `Operate` Mode (`/login`, `/quan-ly`, `/quan-ly/ho-so`, `/quan-ly/tai-khoan`, `/quan-ly/dang-bai`, `/quan-ly/[roomId]`) sử dụng thống nhất bộ token tại `:root` trong [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css):
     - Nền trang: `--color-paper: #FAF9F6`
     - Bề mặt thẻ / bảng / biểu mẫu: `--color-surface: #FFFFFF`
     - Nền phụ bảng / tab: `--color-surface-subtle: #F1F5F9`
     - Mực tiêu đề: `--color-ink: #0B132B`
     - Mực phụ: `--color-ink-muted: #475569`
     - Màu nhấn Hải quân chủ đạo: `--color-accent: #003566` (hover `--color-accent-hover: #002244`)
     - Điểm nhấn Vàng đồng: `--color-gold: #D4AF37`
     - Tín hiệu Đỏ báo chí / nguy hiểm: `--color-signal: #B91C1C`
     - Đường kẻ mảnh: `--color-rule: #CBD5E1` (`1px solid`)
     - Bo góc khóa cứng: `--radius-editorial: 4px` (cấm dùng pill `99px`/`999px` hay bo góc lớn `12px`/`16px`)
2. **Cấm tuyệt đối `ThemeContext` / `[data-theme]` và Inline Style lệch chuẩn:**
   - Không sử dụng inline gradient hoặc bóng đổ tự phát trong `app/quan-ly/page.tsx`; mọi định kiểu phải đi qua CSS Module chuẩn Hallmark Editorial.
3. **Tuân thủ Impeccable v4.8.0 Gate 38a & Craft Floor:**
   - Mọi tiêu đề `h1..h6`, `.title`, `.sectionTitle`, `.modalTitle` bắt buộc đặt `font-style: normal`.
   - Mọi ô nhập liệu (`input`, `select`, `textarea`) và nút bấm đạt chiều cao vùng chạm tối thiểu `44px`.

---

## Review Focus (5 Tình Huống Biên Trọng Tâm)

1. **Nhập `username` không có `@` tại `/login`:** Hàm `resolveEmailFromUsername(input)` phải tự động nối `@gmail.com` cho cả luồng Đăng nhập (`handleLogin`), Đăng ký (`handleRegister`) và Quên mật khẩu (`handlePasswordReset`).
2. **Đăng nhập Google gặp lỗi `auth/unauthorized-domain` trên domain `.vercel.app`:** Bắt chính xác mã lỗi `auth/unauthorized-domain` trong `getFriendlyErrorMessage(err)` và hiển thị thông báo tiếng Việt hướng dẫn rõ ràng.
3. **Không còn bất kỳ tham chiếu `useTheme`, `ThemeProvider`, `ThemeSwitcher`, `ThemeEffects`, `MusicPlayer` nào:** Đảm bảo `/login` và `/quan-ly/*` biên dịch sạch sẽ với `npx tsc --noEmit`.
4. **Tab `accounts` trên `/quan-ly`:** Chỉ hiển thị khi `user.role` thuộc `['admin', 'lanh_dao', 'quan_ly']` và cung cấp liên kết trực tiếp tới `/quan-ly/tai-khoan` ([app/quan-ly/tai-khoan/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.tsx)).
5. **Bảng dữ liệu (`/hoc-phi`, `/quan-ly/*`):** Áp dụng `font-variant-numeric: tabular-nums` và bọc trong `.tableContainer { overflow-x: auto; }` để không tràn ngang trên màn hình di động `390px`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### Task 2.1 (Phase 02): Khôi Phục & Thiết Kế Mới Trang `/login` ([app/login/page.tsx](file:///d:/Antigravity/TNDNB/app/login/page.tsx) & [app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css))

#### Step 2.1: Viết test thất bại (RED) trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts)
Bổ sung test case kiểm tra sự tồn tại, logic xác thực và chuẩn CSS Hallmark Editorial của `/login`:

```ts
  it('Phase 02: app/login/page.tsx và app/login/page.module.css tồn tại, xử lý đủ luồng Auth và chuẩn Hallmark Editorial', () => {
    const loginPagePath = path.resolve(rootDir, 'app/login/page.tsx')
    const loginCssPath = path.resolve(rootDir, 'app/login/page.module.css')
    expect(fs.existsSync(loginPagePath)).toBe(true)
    expect(fs.existsSync(loginCssPath)).toBe(true)

    const loginCode = fs.readFileSync(loginPagePath, 'utf8')
    const loginCss = fs.readFileSync(loginCssPath, 'utf8')

    expect(loginCode).toContain('signInWithEmailAndPassword')
    expect(loginCode).toContain('createUserWithEmailAndPassword')
    expect(loginCode).toContain('signInWithPopup')
    expect(loginCode).toContain('sendPasswordResetEmail')
    expect(loginCode).toContain('recordLoginSession')
    expect(loginCode).toContain('auth/unauthorized-domain')
    expect(loginCode).toContain('@gmail.com')
    expect(loginCode).toContain('/quan-ly')

    expect(loginCss).toContain('var(--color-paper')
    expect(loginCss).toContain('var(--color-surface')
    expect(loginCss).toContain('var(--color-accent')
    expect(loginCss).toContain('var(--radius-editorial')
  })
```

#### Step 2.2: Chạy test — xác nhận FAIL (`RED`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì `app/login/page.tsx` chưa tồn tại và `app/login/page.module.css` chưa dùng biến Hallmark Editorial.

#### Step 2.3: Implement (`GREEN`)
1. **Tạo mới [app/login/page.tsx](file:///d:/Antigravity/TNDNB/app/login/page.tsx):**
   - Cài đặt các hàm:
     - `getRedirectTarget(): string` — Đọc `?redirect=...` (chỉ nhận đường dẫn nội bộ bắt đầu bằng `/`) hoặc trả về mặc định `'/quan-ly'`.
     - `resolveEmailFromUsername(input: string): Promise<string>` — Tự động nối `@gmail.com` nếu `input.trim()` không chứa `@`.
     - `getFriendlyErrorMessage(err: any): string` — Dịch toàn bộ mã lỗi Firebase Auth sang tiếng Việt, bao gồm `auth/unauthorized-domain`, `auth/invalid-credential`, `auth/wrong-password`, `auth/user-not-found`, `auth/email-already-in-use`, `auth/weak-password`, `auth/too-many-requests`, `auth/popup-closed-by-user`.
     - `handleLogin(e: React.FormEvent)` — Gọi `signInWithEmailAndPassword(auth, loginEmail, password)`, ghi phiên `await recordLoginSession(userCredential.user.uid)`, và điều hướng `router.push(getRedirectTarget())`.
     - `handleRegister(e: React.FormEvent)` — Gọi `createUserWithEmailAndPassword`, tạo tài liệu `users/{uid}` trên Firestore với `role: 'hoc_vien'`, `username`, `fullName`, `class`, `phoneNumber`, `birthDate`, `createdAt: serverTimestamp()`, gọi `await recordLoginSession(registeredUser.uid)` và điều hướng.
     - `handleGoogleSignIn()` — Gọi `signInWithPopup(auth, new GoogleAuthProvider())`, kiểm tra/khởi tạo `users/{uid}` nếu chưa tồn tại, gọi `await recordLoginSession(googleUser.uid)` và điều hướng.
     - `handlePasswordReset()` — Giải mã `targetEmail = await resolveEmailFromUsername(email)` và gọi `sendPasswordResetEmail(auth, targetEmail)`.
2. **Thiết kế mới [app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css):**
   - Áp dụng chuẩn `Institutional Auth Card`: nền `.container` dùng `var(--color-paper, #FAF9F6)`, `.formBox` dùng `var(--color-surface, #FFFFFF)`, viền `1px solid var(--color-rule, #CBD5E1)`, thanh nhấn đỉnh `border-top: 3px solid var(--color-accent, #003566)`, bo góc `var(--radius-editorial, 4px)`, tiêu đề `.title` dùng `var(--font-display)` với `font-style: normal`, nút bấm và ô nhập liệu cao tối thiểu `44px`.

#### Step 2.4: Chạy test — xác nhận PASS (`GREEN`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```

#### Step 2.5: Kiểm định UI (`Impeccable v4.8.0` & `Taste-Skill v2.5.0`)
- Kiểm tra tỷ lệ tương phản chữ/nền trên `/login` đạt chuẩn AAA (`#0B132B` trên `#FFFFFF`), vùng chạm nút bấm `>= 44px`, bo góc khóa chặt `4px`.

---

### Task 3.1 (Phase 03): Khôi Phục & Thiết Kế Mới `/quan-ly` Cùng Các Trang Con Quản Trị (`ho-so`, `tai-khoan`, `dang-bai`, `[roomId]`)

#### Step 3.1: Viết test thất bại (RED) trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts)
Bổ sung test case kiểm tra [app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx), [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) và 4 nhóm trang con quản trị:

```ts
  it('Phase 03: app/quan-ly/page.tsx và các trang con quản trị tồn tại, bọc trong ProtectedRoute và đồng bộ Hallmark Editorial', () => {
    const quanLyPagePath = path.resolve(rootDir, 'app/quan-ly/page.tsx')
    const quanLyCssPath = path.resolve(rootDir, 'app/quan-ly/page.module.css')
    expect(fs.existsSync(quanLyPagePath)).toBe(true)
    expect(fs.existsSync(quanLyCssPath)).toBe(true)

    const quanLyCode = fs.readFileSync(quanLyPagePath, 'utf8')
    const quanLyCss = fs.readFileSync(quanLyCssPath, 'utf8')

    expect(quanLyCode).toContain('ProtectedRoute')
    expect(quanLyCode).toContain('AnalyticsWidget')
    expect(quanLyCode).toContain('CourseManager')
    expect(quanLyCode).toContain('PostManager')
    expect(quanLyCode).toContain('ReviewManager')
    expect(quanLyCode).toContain('StudentCard')
    expect(quanLyCode).toContain('StudentClassView')
    expect(quanLyCode).toContain('StudentHistory')
    expect(quanLyCode).toContain('/quan-ly/ho-so')
    expect(quanLyCode).toContain('/quan-ly/tai-khoan')

    expect(quanLyCss).toContain('var(--color-paper')
    expect(quanLyCss).toContain('var(--color-accent')
    expect(quanLyCss).toContain('var(--radius-editorial')

    const subAdminCssFiles = [
      'app/quan-ly/ho-so/page.module.css',
      'app/quan-ly/tai-khoan/page.module.css',
      'app/quan-ly/dang-bai/page.module.css',
      'app/quan-ly/[roomId]/page.module.css',
    ]
    for (const relCss of subAdminCssFiles) {
      const cssContent = fs.readFileSync(path.resolve(rootDir, relCss), 'utf8')
      expect(cssContent).toContain('var(--color-')
    }
  })
```

#### Step 3.2: Chạy test — xác nhận FAIL (`RED`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì `app/quan-ly/page.tsx` chưa được khôi phục và các file `.module.css` trong `app/quan-ly/*` chưa chuyển sang dùng biến Hallmark Editorial.

#### Step 3.3: Implement (`GREEN`)
1. **Khôi phục & chuẩn hóa [app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx):**
   - Bọc `QuanLyDashboard` trong [`ProtectedRoute`](file:///d:/Antigravity/TNDNB/components/ProtectedRoute.tsx).
   - Loại bỏ các inline style gradient/shadow cũ; sử dụng hoàn toàn các class chuẩn từ [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) (`.infoHeader`, `.profileLayout`, `.avatarColumn`, `.avatarFrame`, `.avatarImg`, `.detailsColumns`, `.cccdBox`).
   - Kết nối đầy đủ 6 tab:
     - `dashboard`: `AnalyticsWidget` (`admin`/`lanh_dao`), thẻ Thông tin tài khoản (nút Chỉnh sửa dẫn tới `/quan-ly/ho-so`, nút Gửi email Đổi mật khẩu), `StudentHistory` (`hoc_vien`).
     - `my_class`: `StudentCard` + `StudentClassView` (`hoc_vien`).
     - `courses`: `CourseManager` (`admin`, `lanh_dao`, `quan_ly`, `giao_vien`).
     - `accounts`: Khối điều hướng tới `/quan-ly/tai-khoan` (`admin`, `lanh_dao`, `quan_ly`).
     - `posts`: `PostManager` (`admin`, `quan_ly`, `lanh_dao`).
     - `reviews`: `ReviewManager` (`admin`, `quan_ly`, `lanh_dao`, `giao_vien`).
2. **Thiết kế mới [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css):**
   - Nền `.container` dùng `var(--color-paper, #FAF9F6)`, `.tabContainer` dùng `var(--color-surface, #FFFFFF)` với viền `1px solid var(--color-rule, #CBD5E1)` và bo góc `var(--radius-editorial, 4px)`.
   - `.activeTab` dùng nền `var(--color-accent, #003566)`, chữ `#FFFFFF`, viền dưới `2px solid var(--color-gold, #D4AF37)`.
   - `.infoBox` dùng `border-top: 3px solid var(--color-accent, #003566)`, `.roleTag` dùng `var(--font-mono)` và bo góc `4px` (loại bỏ `border-radius: 99px`).
3. **Đồng bộ CSS các trang con quản trị về Hallmark Editorial Tokens:**
   - [app/quan-ly/ho-so/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/ho-so/page.module.css)
   - [app/quan-ly/tai-khoan/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.module.css) (bật `font-variant-numeric: tabular-nums` cho `.userTable`, đổi `.rolePill` sang `border-radius: var(--radius-editorial, 4px)`)
   - [app/quan-ly/dang-bai/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/page.module.css), [app/quan-ly/dang-bai/tao-moi/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.module.css), [app/quan-ly/dang-bai/sua/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.module.css)
   - [app/quan-ly/[roomId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/%5BroomId%5D/page.module.css) (bật `font-variant-numeric: tabular-nums` cho `.table` và `.scoreCell`)

#### Step 3.4: Chạy test — xác nhận PASS (`GREEN`)
```powershell
npx vitest run scripts/portal-login-dashboard.test.ts
```

#### Step 3.5: Kiểm định UI (`Impeccable v4.8.0` & `Taste-Skill v2.5.0`)
- Đối chiếu với [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md):
  - Kiểm tra không còn pill tròn `99px` trên `.roleTag` / `.rolePill` / `.statusBadge` (tất cả khóa về `4px`).
  - Kiểm tra bảng dữ liệu trong `/quan-ly/tai-khoan`, `/quan-ly/dang-bai`, `/quan-ly/[roomId]` có `overflow-x: auto` và `tabular-nums`.

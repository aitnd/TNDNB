# Phase 02: Dọn Sạch Console F12: Khắc Phục 404 Avatar Fallback & React Hydration Mismatch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dọn sạch 100% lỗi console F12 trên Cổng Quản Lý (`/quan-ly`), bao gồm lỗi HTTP 404 `default_avatar.png:1` và lỗi React Hydration Mismatch (`#418`, `#423`), đạt chuẩn thẩm mỹ khắt khe Hallmark Editorial và Impeccable Craft Floor.

**Architecture:** 
1. Thiết lập cơ chế phòng thủ 3 tầng cho ảnh đại diện (Triple-Layer Avatar Defense): Hàm chuẩn hóa `getValidAvatarUrl(user.photoURL, user.role)`, sự kiện `onError` dự phòng trên component `<Image>`, và cung cấp 3 tệp ảnh vật lý dự phòng trong `public/`.
2. Khắc phục React Hydration Mismatch: Thiết lập cờ `isMounted` guard và thẻ node giữ chỗ `authPlaceholder` trong [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx), bảo đảm cây DOM của SSR Server và Client CSR trong lần render đầu tiên hoàn toàn đồng nhất.

**Tech Stack:** Next.js 14 App Router, React 18, CSS Modules, Impeccable v4.8.0, Taste-Skill v2.5.0, Vitest.

**Spec:** [`docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md)

---

## Global Constraints

- **Bảo toàn phòng thi (Exam Screen Isolation):** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`ontap-web/components/QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx). Git diff của hai file này phải đạt `0 bytes diff`.
- **Zero-Ad Tolerance on Administrative Routes:** Mọi đường dẫn bắt đầu bằng `/quan-ly`, `/quan-ly/*`, hoặc `/login` phải đạt 0% quảng cáo trong DOM và Render Tree.
- **Strict RBAC Advertising Exemption:** Mọi tài khoản có `user.role` thuộc `['admin', 'quan_ly', 'lanh_dao']` được miễn trừ 100% quảng cáo trên toàn bộ cổng thông tin Portal.
- **TypeScript Strict Mode:** Không dùng `any`, tuân thủ nghiêm ngặt `AuthUser` từ [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx).
- **Hallmark Editorial Tokens:** Áp dụng nghiêm ngặt các biến CSS Design Tokens tại `:root` của [`app/globals.css`](file:///d:/Antigravity/TNDNB/app/globals.css) (`--color-paper: #FAF9F6`, `--color-ink: #0B132B`, `--color-accent: #003566`, `--color-gold: #D4AF37`, `--font-sans: 'Be Vietnam Pro'`).

---

## Review Focus

1. **Bản ghi Firestore cũ lưu `photoURL: "/default_avatar.png"`:** Hàm `getValidAvatarUrl` phải nhận diện chuỗi có chứa `default_avatar.png` và tự động chuyển về `/assets/img/avatar.webp` (cán bộ) hoặc `/assets/img/avatar1.webp` (học viên).
2. **Yêu cầu trực tiếp tệp tĩnh từ cache trình duyệt (Direct Static Asset Fetch):** Trình duyệt yêu cầu tải trực tiếp `https://daotaothuyenvien.com/default_avatar.png` -> Tệp vật lý [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png) phản hồi HTTP 200 OK ngay lập tức, triệt tiêu mã lỗi 404.
3. **Ảnh đại diện ngoài bị hỏng hoặc lỗi mạng:** Người dùng có avatar liên kết bên ngoài (Google / Facebook) bị gỡ hoặc hỏng -> Thẻ `<Image>` kích hoạt sự kiện `onError` và chuyển sang `avatarError: true` hiển thị ảnh mặc định hệ thống mượt mà, không vỡ layout.
4. **F5 tải lại trang có sẵn phiên đăng nhập (SSR Hydration Stability):** Khi F5 tại `/quan-ly`, nhờ node `authPlaceholder` trong lúc `!isMounted`, cây DOM của SSR và lần render đầu tiên của Client khớp 100%, không sinh ra React Hydration Mismatch (`#418`, `#423`).
5. **Phân biệt ảnh đại diện mặc định theo vai trò (Role-based Avatar Differentiation):** Học viên (`hoc_vien`) chưa có ảnh hiển thị `avatar1.webp`, cán bộ quản trị/giáo viên (`admin`, `quan_ly`, `lanh_dao`, `giao_vien`) hiển thị `avatar.webp`.

---

## Implementation Steps (TDD Enriched)

### Task 2.1: Tạo Tệp Ảnh Vật Lý Dự Phòng & Nâng Cấp Avatar Resolver Trên `/quan-ly`

**Files:**
- Create: [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png)
- Create: [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png)
- Create: [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png)
- Modify: [`app/quan-ly/page.tsx:120-140`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx)
- Test: [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts)

**Interfaces:**
- Consumes:
  + `user.photoURL?: string`
  + `user.role: 'hoc_vien' | 'giao_vien' | 'lanh_dao' | 'admin' | 'quan_ly'`
- Produces:
  + `getValidAvatarUrl(photoURL?: string | null, role?: string): string`
  + `avatarError: boolean` state trong `QuanLyDashboard`

---

### Task 2.2: Khắc Phục React Hydration Mismatch (`#418`, `#423`) Trên `Navbar.tsx` & `Navbar.module.css`

**Files:**
- Modify: [`components/Navbar.tsx:1-60`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx)
- Modify: [`components/Navbar.module.css:65-75`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css)
- Test: [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts)

**Interfaces:**
- Consumes:
  + `useAuth(): { user: AuthUser | null, loading: boolean }`
- Produces:
  + `isMounted: boolean` state trong component `Navbar`
  + `.authPlaceholder` CSS class đảm bảo zero layout shift (`CLS = 0.00`)

---

- [ ] **Step 2.1 [RED]: Viết test thất bại `TC-GATE05` và `TC-GATE06` trong `scripts/portal-ad-gate.test.ts`**

Bổ sung khối `describe('Phase 02: Console & UI Hygiene', ...)` vào [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts):

```typescript
  describe('Phase 02: Console & UI Hygiene', () => {
    const navbarPath = path.resolve(rootDir, 'components/Navbar.tsx');
    const quanLyPagePath = path.resolve(rootDir, 'app/quan-ly/page.tsx');

    it('TC-GATE05: Physical fallback avatar files must exist in public/ and app/quan-ly/page.tsx must use getValidAvatarUrl with onError', () => {
      const defaultAvatarRoot = path.resolve(rootDir, 'public/default_avatar.png');
      const defaultAvatarAssetsHyphen = path.resolve(rootDir, 'public/assets/img/default-avatar.png');
      const defaultAvatarAssetsUnderscore = path.resolve(rootDir, 'public/assets/img/default_avatar.png');

      expect(fs.existsSync(defaultAvatarRoot)).toBe(true);
      expect(fs.statSync(defaultAvatarRoot).size).toBeGreaterThan(0);

      expect(fs.existsSync(defaultAvatarAssetsHyphen)).toBe(true);
      expect(fs.statSync(defaultAvatarAssetsHyphen).size).toBeGreaterThan(0);

      expect(fs.existsSync(defaultAvatarAssetsUnderscore)).toBe(true);
      expect(fs.statSync(defaultAvatarAssetsUnderscore).size).toBeGreaterThan(0);

      const pageContent = fs.readFileSync(quanLyPagePath, 'utf8');
      expect(pageContent).toContain('getValidAvatarUrl');
      expect(pageContent).not.toContain("'/assets/img/default-avatar.png'");
      expect(pageContent).toContain('onError');
    });

    it('TC-GATE06: components/Navbar.tsx must implement isMounted guard to prevent SSR vs Client Hydration Mismatch (#418, #423)', () => {
      const content = fs.readFileSync(navbarPath, 'utf8');
      expect(content).toMatch(/const\s*\[isMounted,\s*setIsMounted\]\s*=\s*useState\(false\)/);
      expect(content).toMatch(/useEffect\(\(\)\s*=>\s*\{\s*setIsMounted\(true\);?\s*\},?\s*\[\]\)/);
      expect(content).toContain('!isMounted');
      expect(content).toContain('authPlaceholder');
    });
  });
```

- [ ] **Step 2.2 [FAIL]: Chạy test xác nhận FAIL**

Run: `npx vitest run scripts/portal-ad-gate.test.ts`  
Expected: FAIL với các lỗi `expected false to be true` (thiếu file vật lý trong `public/`) và `expected content to contain getValidAvatarUrl`.

- [ ] **Step 2.3 [GREEN]: Tạo 3 tệp ảnh vật lý dự phòng trong `public/`**

Sao chép từ ảnh đại diện có sẵn [`public/assets/img/avatar.webp`](file:///d:/Antigravity/TNDNB/public/assets/img/avatar.webp) sang 3 tệp đích:
- [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png)
- [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png)
- [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png)

- [ ] **Step 2.4 [GREEN]: Nâng cấp `app/quan-ly/page.tsx` với `getValidAvatarUrl` và sự kiện `onError`**

Trong [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx):
1. Định nghĩa helper:
   ```typescript
   export const getValidAvatarUrl = (photoURL?: string | null, role?: string): string => {
     const defaultByRole = role === 'hoc_vien' ? '/assets/img/avatar1.webp' : '/assets/img/avatar.webp';
     if (!photoURL || typeof photoURL !== 'string') return defaultByRole;
     const trimmed = photoURL.trim();
     if (trimmed === '' || trimmed.includes('default_avatar.png') || trimmed.includes('default-avatar.png')) {
       return defaultByRole;
     }
     if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/assets/img/')) {
       return trimmed;
     }
     return defaultByRole;
   };
   ```
2. Thêm state lỗi avatar: `const [avatarError, setAvatarError] = useState(false);`
3. Cập nhật thẻ `<Image>` tại dòng 127:
   ```tsx
   <Image
     src={avatarError ? (user.role === 'hoc_vien' ? '/assets/img/avatar1.webp' : '/assets/img/avatar.webp') : getValidAvatarUrl(user.photoURL, user.role)}
     alt={user.fullName || 'Avatar'}
     width={120}
     height={120}
     className={styles.avatarImg}
     unoptimized
     onError={() => setAvatarError(true)}
   />
   ```

- [ ] **Step 2.5 [GREEN]: Nâng cấp `components/Navbar.tsx` & `components/Navbar.module.css` Khử Hydration Mismatch**

1. Trong [`components/Navbar.module.css`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css):
   ```css
   .authPlaceholder {
     min-height: 24px;
     min-width: 68px;
     display: inline-block;
   }
   ```
2. Trong [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx):
   - Bổ sung `useState`, `useEffect` từ `'react'` và khởi tạo state `isMounted`:
   ```tsx
   const { user, loading: authLoading } = useAuth();
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
     setIsMounted(true);
   }, []);
   ```
   - Thay thế khối `<div className={styles.metaRight}>`:
   ```tsx
   <div className={styles.metaRight}>
     {!isMounted || authLoading ? (
       <span className={styles.authPlaceholder} aria-hidden="true" />
     ) : user ? (
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
         Đăng nhập
       </Link>
     )}
   </div>
   ```

- [ ] **Step 2.6 [PASS]: Chạy test xác nhận PASS toàn bộ 6 test cases**

Run: `npx vitest run scripts/portal-ad-gate.test.ts`  
Expected: PASS 6/6 tests (`TC-GATE01` đến `TC-GATE06`).

- [ ] **Step 2.7 [AESTHETIC]: Kiểm tra Tiêu Chuẩn Thẩm Mỹ `impeccable` v4.8.0 & `taste-skill` v2.5.0**

1. **Impeccable Craft Floor Check (62 Rules):**
   - Chế độ `Operate` Mode trên `/quan-ly`: Mật độ hiển thị đạt chuẩn, không có banner quảng cáo đè lên widget thống kê, không có giật layout (`CLS = 0.00`).
   - Tỷ lệ tương phản màu sắc chữ `--color-ink: #0B132B` trên nền giấy `--color-paper: #FAF9F6` đạt chuẩn AAA (`> 15:1`).
   - Phông chữ giao diện đồng nhất `'Be Vietnam Pro'` với `font-variant-numeric: tabular-nums`.
2. **Taste-Skill Consistency Check:**
   - Kiểm tra tính nhất quán giữa Navbar và Cổng Quản Lý: Huy hiệu vai trò `[QUẢN TRỊ]` sử dụng sắc vàng vinh danh `--color-gold: #D4AF37`, nút *"Quản trị"* sử dụng màu xanh Hải quân `--color-accent: #003566`.
   - Khối `authPlaceholder` có kích thước tương đương với nút *"Đăng nhập"*, loại bỏ hoàn toàn hiện tượng layout shift khi mount xong.

- [ ] **Step 2.8 [COMMIT]: Tạo commit lưu mốc mã nguồn Phase 02**

```bash
git add public/default_avatar.png public/assets/img/default-avatar.png public/assets/img/default_avatar.png app/quan-ly/page.tsx components/Navbar.tsx components/Navbar.module.css scripts/portal-ad-gate.test.ts
git commit -m "fix(portal): resolve avatar 404 fallback and eliminate react hydration mismatch with mounted guard"
```

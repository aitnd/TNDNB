# Phase 03: Bộ Kiểm Thử TDD Tự Động, Đảm Bảo Invariants & Đóng Gói Nghiệm Thu

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thực thi toàn bộ bộ kiểm thử tự động `scripts/portal-ad-gate.test.ts` (6/6 test cases), kiểm tra hồi quy toàn bộ 14 test suites của dự án (`scripts/`), xác nhận bảo toàn 100% Invariants (`ExamQuizScreen.tsx` & `QuizScreen.tsx` đạt `0 bytes diff`), kiểm tra kiểu tĩnh TypeScript (`tsc --noEmit`), và đóng gói sản xuất `npm run build:portal` thành công 57 routes.

**Architecture:** Tích hợp bộ test kiểm tra mã nguồn và cấu trúc tĩnh (`scripts/portal-ad-gate.test.ts`) vào hệ thống Vitest của monorepo TNDNB, kết hợp quy trình kiểm định chất lượng 4 tầng: Unit Tests $\rightarrow$ Regression Suite $\rightarrow$ Static Typecheck & Invariants $\rightarrow$ Next.js Production Static/SSR Build.

**Tech Stack:** Vitest, TypeScript 5, Next.js 14 Build Pipeline, Git Invariant Verification.

**Spec:** [`docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md)

---

## Global Constraints

- **Bảo toàn phòng thi (Exam Screen Isolation):** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`ontap-web/components/QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx). Git diff của hai file này phải đạt `0 bytes diff`.
- **Zero-Ad Tolerance on Administrative Routes:** Mọi đường dẫn bắt đầu bằng `/quan-ly`, `/quan-ly/*`, hoặc `/login` phải đạt 0% quảng cáo trong DOM và Render Tree.
- **Strict RBAC Advertising Exemption:** Mọi tài khoản có `user.role` thuộc `['admin', 'quan_ly', 'lanh_dao']` được miễn trừ 100% quảng cáo trên toàn bộ cổng thông tin Portal.
- **TypeScript Strict Mode:** 0 lỗi biên dịch khi chạy `npx tsc --noEmit`.
- **Zero Regression Across Monorepo:** Toàn bộ 14 bộ test suites trong `scripts/` phải PASS 100%.

---

## Review Focus

1. **Tương thích đường dẫn Import giữa `app/components/PortalAdLoader.tsx` và `context/AuthContext.tsx`:** Trong `app/components/PortalAdLoader.tsx`, đường dẫn tương đối tới `context/AuthContext.tsx` ở thư mục gốc dự án là `'../../context/AuthContext'`. Cần đảm bảo trình biên dịch Next.js và TypeScript phân giải chính xác đường dẫn này mà không phát sinh lỗi `Module not found`.
2. **Không hồi quy các bộ test hiện hữu (`portal-console-and-tinymce-fix.test.ts`, `portal-login-dashboard.test.ts`, `portal-navbar-cleanup.test.ts`):** Thay đổi trong `components/Navbar.tsx` và `app/quan-ly/page.tsx` phải giữ nguyên các selector và cấu trúc mà các bài test cũ đang kiểm tra.
3. **Đóng gói tĩnh Next.js (`npm run build:portal`):** Việc sử dụng `usePathname()` trong `PortalAdLoader.tsx` (vốn đã được nạp qua `dynamic(..., { ssr: false })` trong `app/layout.tsx`) không được gây ra lỗi CSR Bailout khi Next.js prerender 57 routes tĩnh.
4. **Dung lượng và tính hợp lệ của 3 tệp ảnh vật lý dự phòng:** Các tệp `public/default_avatar.png`, `public/assets/img/default-avatar.png`, và `public/assets/img/default_avatar.png` phải có kích thước `> 0 bytes` và tồn tại trên ổ đĩa trước khi chạy build.
5. **Trạng thái Git sạch sẽ (Clean Working Tree):** Sau khi hoàn tất Phase 03, toàn bộ thay đổi hợp lệ phải được commit gọn gàng, không để sót file tạm.

---

## Implementation Steps (TDD Enriched)

### Task 3.1: Hoàn Thiện & Thực Thi Bộ Kiểm Thử Tổng Hợp `scripts/portal-ad-gate.test.ts`

**Files:**
- Test: [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts)
- Verify: [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx)
- Verify: [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx)
- Verify: [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx)

**Interfaces:**
- Consumes:
  + Toàn bộ cấu trúc mã nguồn từ Phase 01 và Phase 02.
- Produces:
  + Chứng nhận PASS 100% trên 6 kịch bản `TC-GATE01` $\rightarrow$ `TC-GATE06` và toàn bộ 14 test suites của dự án.

---

- [ ] **Step 3.1 [TEST]: Chạy bộ kiểm thử `scripts/portal-ad-gate.test.ts` xác nhận 6/6 test cases PASS**

Đảm bảo tệp [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts) chứa đầy đủ 6 bài kiểm thử từ Phase 01 và Phase 02:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Ad Gating & Console Hygiene Suite (TDD)', () => {
  const rootDir = process.cwd();
  const adLoaderPath = path.resolve(rootDir, 'app/components/PortalAdLoader.tsx');
  const navbarPath = path.resolve(rootDir, 'components/Navbar.tsx');
  const quanLyPagePath = path.resolve(rootDir, 'app/quan-ly/page.tsx');

  describe('Phase 01: Core Ad Role & Route Gating (PortalAdLoader)', () => {
    it('TC-GATE01: PortalAdLoader must import usePathname, define isAdminRoute, and evaluate shouldAllowAds', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/import\s*\{[^}]*usePathname[^}]*\}\s*from\s*['"]next\/navigation['"]/);
      expect(content).toMatch(/isAdminRoute\s*=\s*Boolean\(\s*pathname\?\.startsWith\(['"]\/quan-ly['"]\)\s*\|\|\s*pathname\?\.startsWith\(['"]\/login['"]\)\s*\)/);
      expect(content).toMatch(/shouldAllowAds\s*=\s*isAuthReady\s*&&\s*!isAdminRoute\s*&&\s*!isPrivilegedUser/);
    });

    it('TC-GATE02: PortalAdLoader must import useAuth, define isPrivilegedUser for admin/quan_ly/lanh_dao, and gate ads', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/import\s*\{[^}]*useAuth[^}]*\}\s*from\s*['"](\.\.\/context\/AuthContext|\.\.\/\.\.\/context\/AuthContext)['"]/);
      expect(content).toMatch(/isPrivilegedUser\s*=\s*Boolean\(\s*user\s*&&\s*\[['"]admin['"],\s*['"]quan_ly['"],\s*['"]lanh_dao['"]\]\.includes\(user\.role\)\s*\)/);
    });

    it('TC-GATE03: PortalAdLoader must implement Auth Ready Guard to prevent FOUA when auth is loading', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/isAuthReady\s*=\s*!authLoading/);
      expect(content).toMatch(/if\s*\(!isAuthReady\)\s*\{\s*injectHideAdSenseCompletely\(\);\s*return;\s*\}/);
    });

    it('TC-GATE04: PortalAdLoader must declare purgeAllAdSenseDomAndScripts and purge all AdSense, Adsterra, and Monetag DOM/scripts', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toContain('purgeAllAdSenseDomAndScripts');
      expect(content).toContain('.adsbygoogle');
      expect(content).toContain('ins.adsbygoogle');
      expect(content).toContain('.google-auto-placed');
      expect(content).toContain('iframe[id^="aswift"]');
      expect(content).toContain('iframe[id^="google_ads"]');
      expect(content).toContain('#google-vignette');
      expect(content).toContain('portal-adsense-script');
      expect(content).toContain('portal-adsterra-script');
      expect(content).toContain('portal-monetag-script');
      expect(content).toContain('ADSENSE_HIDE_ALL_CSS');
    });
  });

  describe('Phase 02: Console & UI Hygiene', () => {
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
});
```

Run: `npx vitest run scripts/portal-ad-gate.test.ts`  
Expected: `1 passed (1) | 6 passed (6)`.

- [ ] **Step 3.2 [ALL-TESTS]: Chạy toàn bộ Regression Test Suites trong `scripts/`**

Run: `npx vitest run scripts/`  
Expected: Toàn bộ 14 test suites PASS 100% (105+ tests PASS), 0 failed.

- [ ] **Step 3.3 [INVARIANT]: Kiểm tra bảo toàn nguyên vẹn `ExamQuizScreen.tsx` và `QuizScreen.tsx`**

Run: `git status --porcelain ontap-web/components/ExamQuizScreen.tsx ontap-web/components/QuizScreen.tsx`  
Expected: Đầu ra trống (`0 bytes diff`).

- [ ] **Step 3.4 [TSC]: Kiểm tra kiểu tĩnh TypeScript trên toàn bộ Root Portal**

Run: `npx tsc --noEmit`  
Expected: Mã thoát `0`, 0 lỗi TypeScript.

- [ ] **Step 3.5 [BUILD-PORTAL]: Chạy đóng gói Production Build cho Root Portal Next.js**

Run: `npm run build:portal`  
Expected: Biên dịch và xuất bản thành công toàn bộ 57 routes, không phát sinh lỗi Hydration hay thiếu tài nguyên tĩnh.

- [ ] **Step 3.6 [COMMIT]: Lưu mốc hoàn tất nghiệm thu Kế hoạch `261110-1015`**

```bash
git add docs/plans/261110-1015-portal-ad-role-gating-and-management/ docs/DESIGN.md
git commit -m "chore(release): complete verification and documentation for portal ad gating plan 261110-1015"
```

---

## Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria)

- [ ] **AC-08 (100% Test Suite Pass)**: Tất cả 6 bài test `TC-GATE01` $\rightarrow$ `TC-GATE06` trong `scripts/portal-ad-gate.test.ts` đều đạt kết quả PASS.
- [ ] **AC-09 (Zero Regression)**: Toàn bộ 14 test files trong `scripts/` đều PASS 100%.
- [ ] **AC-10 (Production Build Pass)**: Lệnh `npm run build:portal` hoàn thành với mã thoát `0`, `npx tsc --noEmit` đạt `0 errors`, và `ExamQuizScreen.tsx` đạt `0 bytes diff`.

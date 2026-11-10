# Phase 01: Thiết Lập Role Gate, Route Gate & Động Cơ Dọn Sạch DOM/CSS (PortalAdLoader)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chặn và dọn sạch 100% quảng cáo (Google AdSense, Adsterra, Monetag) khi truy cập các route quản lý (`/quan-ly`, `/login`) và chặn quảng cáo trên toàn site cho tài khoản có vai trò Quản lý/Lãnh đạo (`admin`, `quan_ly`, `lanh_dao`), loại bỏ triệt để hiện tượng chớp quảng cáo FOUA bằng Auth Ready Guard.

**Architecture:** Mở rộng [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx) với cấu trúc kiểm tra 3 khóa bảo vệ (Triple-Lock Gating) kết hợp hook `usePathname()` từ `next/navigation` và hook `useAuth()` từ [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx). Khi điều kiện `shouldAllowAds = isAuthReady && !isAdminRoute && !isPrivilegedUser` trả về `false`, kích hoạt hàm `purgeAllAdSenseDomAndScripts()` và chèn ngay stylesheet `ADSENSE_HIDE_ALL_CSS`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Firebase Auth & Firestore Client SDK, Vitest.

**Spec:** [`docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/DESIGN.md)

---

## Global Constraints

- **Bảo toàn phòng thi (Exam Screen Isolation):** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`ontap-web/components/QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx). Git diff của hai file này phải đạt `0 bytes diff`.
- **Zero-Ad Tolerance on Administrative Routes:** Mọi đường dẫn bắt đầu bằng `/quan-ly`, `/quan-ly/*`, hoặc `/login` phải đạt 0% quảng cáo trong DOM và Render Tree.
- **Strict RBAC Advertising Exemption:** Mọi tài khoản có `user.role` thuộc `['admin', 'quan_ly', 'lanh_dao']` được miễn trừ 100% quảng cáo trên toàn bộ cổng thông tin Portal.
- **TypeScript Strict Mode:** Mã nguồn viết mới không được dùng kiểu `any` tùy tiện, phải kiểm tra kiểu tĩnh thành công qua `npx tsc --noEmit`.
- **Hallmark Editorial Tokens:** Tái sử dụng stylesheet chuẩn `ADSENSE_HIDE_ALL_CSS` từ [`ontap-web/services/adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts) mà không tự định nghĩa CSS tùy tiện.

---

## Review Focus

1. **Điều hướng sâu vào route con quản lý (`/quan-ly/dang-bai/tao-moi`, `/quan-ly/tai-khoan`):** `pathname?.startsWith('/quan-ly')` phải nhận diện chính xác mọi cấp thư mục con và kích hoạt khóa `isAdminRoute = true`.
2. **Chuyển hướng SPA từ Trang chủ sang Quản lý:** Người dùng từ `/` (đã có Google Auto Ads nạp vào DOM) click điều hướng sang `/quan-ly` -> `useEffect` phải kích hoạt `purgeAllAdSenseDomAndScripts()` xóa sạch các phần tử `ins.adsbygoogle` và iframe `aswift` còn sót lại.
3. **Độ trễ mạng khi khởi tạo Auth (Slow Network Auth Latency):** Khi mạng chậm, Firebase Auth cần 1-2 giây để xác thực (`authLoading === true`) -> **Auth Ready Guard** (`isAuthReady = !authLoading`) phải giữ nguyên stylesheet `ADSENSE_HIDE_ALL_CSS` và không nạp script trước thời điểm xác thực xong, ngăn chặn hoàn toàn hiện tượng FOUA.
4. **Cán bộ quản trị duyệt bài viết tin tức (`/bai-viet/[postId]`):** Quản trị viên duyệt bài viết để kiểm tra nội dung -> `isAdminRoute` là `false` nhưng `isPrivilegedUser` là `true` -> Hệ thống vẫn phải chặn và dọn sạch quảng cáo.
5. **Cập nhật cờ Firestore theo thời gian thực:** Khi quản trị viên thay đổi cờ `showPortalAdSense` trên Cloud Firestore, hàm lắng nghe `onSnapshot` nhận dữ liệu mới nhưng biến `shouldAllowAds` vẫn phải kiểm soát chặt chẽ, không bao giờ được phép bật quảng cáo nếu `isAdminRoute` hoặc `isPrivilegedUser` đang là `true`.

---

## Implementation Steps (TDD Enriched)

### Task 1: Thiết Lập Triple-Lock Gating & Động Cơ Purge DOM Trong `PortalAdLoader.tsx`

**Files:**
- Modify: [`app/components/PortalAdLoader.tsx:1-282`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx)
- Test: [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts)

**Interfaces:**
- Consumes:
  + `usePathname(): string | null` từ package `next/navigation`
  + `useAuth(): { user: AuthUser | null, loading: boolean }` từ [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx)
  + `ADSENSE_HIDE_ALL_CSS: string` từ [`ontap-web/services/adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts)
  + `ADSENSE_SELECTIVE_BLOCK_CSS: string` từ [`ontap-web/services/adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts)
- Produces:
  + `isAdminRoute: boolean` — Xác định tuyến đường quản trị cấm quảng cáo
  + `isPrivilegedUser: boolean` — Xác định tài khoản thuộc nhóm miễn trừ quảng cáo RBAC
  + `isAuthReady: boolean` — Xác định trạng thái sẵn sàng của Firebase Auth
  + `shouldAllowAds: boolean` — Quyết định tổng hợp cho phép hiển thị quảng cáo
  + `purgeAllAdSenseDomAndScripts(): void` — Động cơ dọn sạch toàn bộ script và DOM quảng cáo

---

- [ ] **Step 1.1 [RED]: Viết test thất bại `TC-GATE01` đến `TC-GATE04` trong `scripts/portal-ad-gate.test.ts`**

Tạo tệp [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts) với nội dung kiểm thử đầy đủ:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Ad Gating & Console Hygiene Suite (TDD)', () => {
  const rootDir = process.cwd();
  const adLoaderPath = path.resolve(rootDir, 'app/components/PortalAdLoader.tsx');

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
});
```

- [ ] **Step 1.2 [FAIL]: Chạy test xác nhận FAIL**

Run: `npx vitest run scripts/portal-ad-gate.test.ts`  
Expected: FAIL với các lỗi `expected content to match usePathname`, `expected content to contain purgeAllAdSenseDomAndScripts`.

- [ ] **Step 1.3 [GREEN]: Nâng cấp `app/components/PortalAdLoader.tsx` với Triple-Lock Gating & Hook Integration**

Chỉnh sửa [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx):
1. Thêm import:
   ```typescript
   import { usePathname } from 'next/navigation';
   import { useAuth } from '../context/AuthContext';
   ```
2. Trong component `PortalAdLoader`:
   ```typescript
   const pathname = usePathname();
   const { user, loading: authLoading } = useAuth();

   const isAdminRoute = Boolean(
       pathname?.startsWith('/quan-ly') || pathname?.startsWith('/login')
   );
   const isPrivilegedUser = Boolean(
       user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role)
   );
   const isAuthReady = !authLoading;
   const shouldAllowAds = isAuthReady && !isAdminRoute && !isPrivilegedUser;
   ```

- [ ] **Step 1.4 [GREEN]: Tích hợp `purgeAllAdSenseDomAndScripts` và xử lý dọn dẹp khi chuyển trang**

Bổ sung hàm dọn dẹp toàn diện trong [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx):
```typescript
const purgeAllAdSenseDomAndScripts = () => {
    ['portal-adsense-script', 'portal-adsterra-script', 'portal-monetag-script', 'adsense-script', 'adsterra-script', 'monetag-script'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    document.querySelectorAll(
        'script[src*="adsbygoogle"], script[src*="googlesyndication"], script[src*="doubleclick"], ' +
        'script[src*="effectivegatecpm.com"], script[src*="quge5.com"], script[src*="monetag"]'
    ).forEach((node) => node.remove());

    document.querySelectorAll(
        '.adsbygoogle, ins.adsbygoogle, .adsbygoogle-noablate, .google-auto-placed, ' +
        '[data-ad-client], [data-ad-status], div[id^="google-anno"], div[id^="google_ads"], ' +
        'iframe[id^="google_ads"], iframe[id^="aswift"], iframe[src*="googlesyndication"], ' +
        'iframe[src*="doubleclick"], #google-vignette'
    ).forEach((node) => node.remove());

    document.querySelectorAll(
        '[id^="adsterra"], [class*="adsterra"], #pl28592472, ' +
        'iframe[src*="quge5"], iframe[src*="monetag"], [id*="monetag"], [class*="monetag"]'
    ).forEach((node) => node.remove());
};
```
Cập nhật `useEffect` điều khiển AdSense:
```typescript
useEffect(() => {
    if (!isAuthReady) {
        injectHideAdSenseCompletely();
        return;
    }

    if (!shouldAllowAds) {
        purgeAllAdSenseDomAndScripts();
        injectHideAdSenseCompletely();
        removeAdsterraScript();
        removeMonetagScript();
        return;
    }

    if (adSenseEnabled) {
        if (isAdSenseBlocked) {
            injectSelectiveBlockStyle();
        } else {
            removeAllAdSenseStyles();
            loadAdSenseScript();
        }
    } else {
        purgeAllAdSenseDomAndScripts();
        injectHideAdSenseCompletely();
    }
}, [isAuthReady, shouldAllowAds, adSenseEnabled, isAdSenseBlocked]);
```
Đồng thời cập nhật các effect của Adsterra và Monetag: chỉ gọi nạp script khi `shouldAllowAds && adsterraEnabled`, ngược lại gọi hàm remove.

- [ ] **Step 1.5 [PASS]: Chạy test xác nhận PASS**

Run: `npx vitest run scripts/portal-ad-gate.test.ts`  
Expected: PASS 4/4 tests `TC-GATE01`, `TC-GATE02`, `TC-GATE03`, `TC-GATE04`.

- [ ] **Step 1.6 [COMMIT]: Tạo commit lưu mốc mã nguồn Phase 01**

```bash
git add app/components/PortalAdLoader.tsx scripts/portal-ad-gate.test.ts
git commit -m "feat(portal): implement role-based and route-based ad gating with dom purge engine"
```

# Danh Sách Nhiệm Vụ Thực Thi Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261110-1015-portal-ad-role-gating-and-management`  
> **Kế hoạch tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/plan.md)  
> **Quy trình thực thi**: Subagent-Driven Development (SDD) & Enriched TDD (`RED -> FAIL -> GREEN -> PASS -> COMMIT`)  
> **Trạng thái**: ✅ Đã hoàn thành toàn bộ 3 Phases  

---

## Phase 01: Thiết Lập Role Gate, Route Gate & Động Cơ Dọn Sạch DOM/CSS (PortalAdLoader)
*Đặc tả kỹ thuật: [`phase-01-core-ad-role-and-route-gating.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/phase-01-core-ad-role-and-route-gating.md)*

- [x] **Step 1.1 [RED]**: Viết test cases `TC-GATE01`, `TC-GATE02`, `TC-GATE03`, `TC-GATE04` trong [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts) kiểm tra Route Gate (`/quan-ly`, `/login`), Role Gate (`admin`, `quan_ly`, `lanh_dao`), Auth Ready Guard (`loading: true`), và động cơ `purgeAllAdSenseDomAndScripts()`.
- [x] **Step 1.2 [FAIL]**: Chạy `npx vitest run scripts/portal-ad-gate.test.ts` và xác nhận các test cases Phase 01 FAIL đúng chuẩn TDD do component hiện tại chưa có các cơ chế này.
- [x] **Step 1.3 [GREEN]**: Cập nhật [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx):
  - Import `usePathname` từ `'next/navigation'` và `useAuth` từ `'../../context/AuthContext'`.
  - Thiết lập hằng số `isAdminRoute`: kiểm tra `pathname?.startsWith('/quan-ly') || pathname?.startsWith('/login')`.
  - Thiết lập hằng số `isPrivilegedUser`: kiểm tra `Boolean(user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role))`.
  - Thiết lập cờ `isAuthReady = !authLoading`.
  - Xác lập điều kiện tổng: `shouldAllowAds = isAuthReady && !isAdminRoute && !isPrivilegedUser`.
- [x] **Step 1.4 [GREEN]**: Tích hợp động cơ dọn sạch DOM `purgeAllAdSenseDomAndScripts()` và phong tỏa `ADSENSE_HIDE_ALL_CSS`:
  - Trong [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx), bổ sung hàm `purgeAllAdSenseDomAndScripts()` xóa sạch tất cả thẻ `<script>` quảng cáo, các thẻ `ins.adsbygoogle`, lớp `.google-auto-placed`, các iframe `aswift` / `google_ads`, và phần tử của Adsterra/Monetag.
  - Khi `!shouldAllowAds`, lập tức gọi `purgeAllAdSenseDomAndScripts()` và `injectHideAdSenseCompletely()`.
  - Đăng ký `pathname`, `user`, `authLoading` vào dependency array của `useEffect` để kích hoạt dọn sạch tức thì mỗi khi người dùng chuyển trang bằng client-side routing.
- [x] **Step 1.5 [PASS]**: Chạy `npx vitest run scripts/portal-ad-gate.test.ts` và xác nhận 4 test cases `TC-GATE01`, `TC-GATE02`, `TC-GATE03`, `TC-GATE04` chuyển sang trạng thái PASS xanh lá.
- [x] **Step 1.6 [COMMIT]**: Tạo commit lưu mốc mã nguồn hoàn tất Phase 01 (`79e1d190`).

---

## Phase 02: Dọn Sạch Console F12: Khắc Phục 404 Avatar Fallback & React Hydration Mismatch
*Đặc tả kỹ thuật: [`phase-02-console-and-ui-hygiene.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/phase-02-console-and-ui-hygiene.md)*

- [x] **Step 2.1 [RED]**: Viết test cases `TC-GATE05` và `TC-GATE06` trong [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts) kiểm tra sự tồn tại của các tệp ảnh fallback vật lý, cơ chế resolver `getValidAvatarUrl` an toàn và `isMounted` guard chống lỗi React Hydration Mismatch trên Navbar.
- [x] **Step 2.2 [FAIL]**: Chạy `npx vitest run scripts/portal-ad-gate.test.ts` và xác nhận 2 test cases này FAIL theo đúng chu trình TDD.
- [x] **Step 2.3 [GREEN]**: Tạo các tệp ảnh tĩnh dự phòng vật lý để giải quyết triệt để lỗi 404:
  - Tạo tệp [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png) sao chép từ ảnh đại diện hợp lệ.
  - Tạo tệp [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png).
  - Tạo tệp [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png).
- [x] **Step 2.4 [GREEN]**: Nâng cấp [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx):
  - Xây dựng helper `getValidAvatarUrl(photoURL?: string | null, role?: string): string`.
  - Thay thế thuộc tính `src` của thẻ `<Image>` tại dòng 127 bằng `getValidAvatarUrl(user.photoURL, user.role)`.
  - Bổ sung sự kiện `onError` cho thẻ `<Image>` tự động fallback về `/assets/img/avatar.webp` nếu có lỗi tải ảnh từ xa.
- [x] **Step 2.5 [GREEN]**: Khắc phục lỗi React Hydration Mismatch (#418, #423):
  - Trong [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx), bổ sung state `const [isMounted, setIsMounted] = useState(false);` và kích hoạt qua `useEffect`.
  - Bổ sung class `.authPlaceholder` trong [`components/Navbar.module.css`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css) và bọc phần render `styles.metaRight` để đảm bảo SSR render đồng nhất với Client trong lần render đầu tiên, loại bỏ sai lệch DOM khi người dùng đã đăng nhập sẵn.
- [x] **Step 2.6 [PASS]**: Chạy `npx vitest run scripts/portal-ad-gate.test.ts` và xác nhận toàn bộ test cases `TC-GATE01` đến `TC-GATE06` PASS 100%.
- [x] **Step 2.7 [AESTHETIC]**: Kiểm tra chất lượng thẩm mỹ `impeccable` v4.8.0 (62-Rule Craft Floor, `Operate` Mode) & `taste-skill` v2.5.0 (`CLS = 0.00`, Hallmark Editorial tokens).
- [x] **Step 2.8 [COMMIT]**: Tạo commit lưu mốc mã nguồn hoàn tất Phase 02 (`f67b43ad`).

---

## Phase 03: Bộ Kiểm Thử TDD Tự Động, Đảm Bảo Invariants & Đóng Gói Nghiệm Thu
*Đặc tả kỹ thuật: [`phase-03-tdd-tests-and-build-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/phase-03-tdd-tests-and-build-verification.md)*

- [x] **Step 3.1 [TEST]**: Chạy `npx vitest run scripts/portal-ad-gate.test.ts` kiểm tra bộ test suite gating hoàn chỉnh (6/6 tests passed).
- [x] **Step 3.2 [ALL-TESTS]**: Chạy `npx vitest run scripts/` đảm bảo toàn bộ 14 test suites của dự án đều PASS 100% (zero regression, 105 tests passed).
- [x] **Step 3.3 [INVARIANT-1]**: Kiểm tra `git status --porcelain ontap-web/components/ExamQuizScreen.tsx ontap-web/components/QuizScreen.tsx` đạt `0 bytes diff` (bảo toàn nguyên vẹn phòng thi).
- [x] **Step 3.4 [TSC]**: Chạy kiểm tra kiểu tĩnh `npx tsc --noEmit` đạt 0 lỗi TypeScript.
- [x] **Step 3.5 [BUILD-PORTAL]**: Chạy `npm run build:portal` kiểm tra đóng gói thành công 57 routes không có lỗi hydration hay thiếu file tĩnh.
- [x] **Step 3.6 [COMMIT]**: Tạo commit nghiệm thu mã nguồn hoàn tất kế hoạch.

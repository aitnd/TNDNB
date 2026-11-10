# 📋 TÀI LIỆU BÀN GIAO TIẾN ĐỘ DỰ ÁN (HANDOVER DOCUMENT)

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Thời điểm cập nhật**: 2026-11-10 14:15:00 (GMT+7)  
> **Nhánh hiện tại**: `main` (Up to date với `origin/main`)  
> **Commit mới nhất**: `81827f8e` (chore(release): complete verification and documentation for portal ad gating plan 261110-1015)  

---

## 1. Tình Trạng Hiện Tại & Công Việc Vừa Hoàn Thành

Phiên làm việc đã hoàn thành 100% 3 Phase của kế hoạch **`261110-1015-portal-ad-role-gating-and-management`**, giải quyết triệt để 2 vấn đề trọng yếu:

1. **Đồng bộ tính năng Quản lý Cài đặt Quảng cáo sang Root Portal (`app/components/PortalAdLoader.tsx`)**:
   - Khắc phục hiện tượng tài khoản Quản trị viên (`admin`, `quan_ly`, `lanh_dao`) đăng nhập tại `daotaothuyenvien.com/quan-ly` nhưng vẫn thấy banner Google Auto-Ads.
   - **Route Gate:** Sử dụng `usePathname()`, tự động khóa và dọn sạch 100% quảng cáo khi truy cập vào `/quan-ly`, `/quan-ly/*` và `/login`.
   - **Role Gate:** Sử dụng `useAuth()`, miễn trừ quảng cáo toàn diện cho cán bộ quản lý/lãnh đạo trên toàn bộ website.
   - **Auth Ready Guard:** Không nạp script quảng cáo khi Auth đang tải (`loading: true`), chống hiện tượng chớp quảng cáo FOUA trong 300ms–800ms đầu.
   - **Động cơ Purge DOM:** Bổ sung `purgeAllAdSenseDomAndScripts()` và stylesheet phong tỏa `ADSENSE_HIDE_ALL_CSS` quét sạch mọi iframe, ins, và lớp tự sinh của Google.

2. **Dọn sạch Console F12 Trên Cổng Quản Lý**:
   - **Lỗi 404 Avatar Fallback:** Khởi tạo 3 tệp ảnh vật lý dự phòng trong `public/` (`default_avatar.png`, `assets/img/default-avatar.png`, `assets/img/default_avatar.png`), đồng thời xây dựng helper `getValidAvatarUrl(user.photoURL, user.role)` và sự kiện `onError` fallback về `/assets/img/avatar.webp` trên thẻ `<Image>` tại [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx).
   - **Lỗi React Hydration Mismatch (`#418`, `#423`):** Bổ sung `isMounted` guard và `.authPlaceholder` vào [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) và [`components/Navbar.module.css`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css), đảm bảo SSR và CSR render đồng nhất lần đầu.

3. **Kiểm thử & Nghiệm thu Tổng Lực**:
   - Toàn bộ **14/14 test suites (105/105 tests PASSED 100%)** trong `scripts/` (bao gồm 6 bài test mới trong `scripts/portal-ad-gate.test.ts`).
   - Typecheck Strict: **0 lỗi** trên toàn bộ hệ thống (`npx tsc --noEmit`).
   - Build Verify: `npm run build:portal` thành công 57/57 static routes và `npm --prefix ontap-web run build` thành công trong 14.97s ra `public/ontap/`.
   - Bảo toàn tuyệt đối Invariant `ExamQuizScreen.tsx` và `QuizScreen.tsx` (**0 bytes diff**).
   - Git: Đã push toàn bộ 4 commits lên GitHub remote (`origin/main`).

---

## 2. Các Tệp Tin Trọng Tâm Vừa Chỉnh Sửa
- [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx): Route Gate, Role Gate, Auth Ready Guard, DOM Purge Engine.
- [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx): Helper `getValidAvatarUrl` an toàn và `onError` fallback cho Avatar.
- [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx): `isMounted` guard khử lỗi Hydration Mismatch.
- [`components/Navbar.module.css`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css): Class `.authPlaceholder`.
- [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png), [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png), [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png): Tệp ảnh vật lý dự phòng.
- [`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts): Bộ test suite TDD 6 test cases.
- [`docs/plans/261110-1015-portal-ad-role-gating-and-management/`](file:///d:/Antigravity/TNDNB/docs/plans/261110-1015-portal-ad-role-gating-and-management/): Toàn bộ hồ sơ kế hoạch kép, thiết kế và các phases đã tick `[x]` 100%.

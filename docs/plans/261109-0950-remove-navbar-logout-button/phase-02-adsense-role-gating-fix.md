# Phase 02: Khắc phục triệt để lỗi hiển thị AdSense sai đối tượng (Auth Ready Guard, Async Cancellation, DOM Purge & Role Mapping)

> **Thuộc kế hoạch:** [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/plan.md)  
> **Tài liệu thiết kế:** [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/DESIGN.md)  
> **Status:** ⬜ Pending  
> **Dependencies:** Phase 01

**Goal:** Chặn đứng hoàn toàn lỗi hiển thị AdSense Auto-Ads (`✕ Ứng dụng ôn tập`) cho tài khoản Admin, Lãnh đạo, Quản lý, Giáo viên và Học viên đã vào lớp bằng cách: (1) Chốt chặn `isAuthReady` trước khi `AdSenseLoader` chạy, (2) Thêm cờ hủy `isCancelled` chống Async Race Condition / Undead `IntersectionObserver`, (3) Dọn sạch DOM Auto-Ads và nâng cấp CSS ẩn quảng cáo đa thuộc tính, (4) Chuẩn hóa phân loại Role trong `usageService.ts`.

**Architecture:** Mở rộng Zustand `AppStore` với cờ `isAuthReady`. Trong `useAppInitialization.ts`, chỉ bật `setIsAuthReady(true)` sau khi Firebase Auth đã xác định xong người dùng là khách (`firebaseUser === null`) hoặc đã tải xong hồ sơ Firestore. Trong `AdSenseLoader.tsx`, ẩn hoàn toàn quảng cáo khi `!isAuthReady`, hủy các tác vụ bất đồng bộ cũ khi profile thay đổi, và quét dọn toàn bộ DOM Auto-Ads khi vai trò hiện tại có `showAdSense === false`.

**Tech Stack:** React 19, Zustand 5, Firebase Auth & Firestore, Vitest.

---

## Global Constraints
- Bảo toàn tuyệt đối 100% tệp [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`0 bytes diff`).
- Không làm ảnh hưởng đến việc hiển thị AdSense hợp lệ cho Khách vãng lai (`guest`) và Học viên tự do (`free_user`) sau khi `isAuthReady === true` và `showAdSense === true`.
- Không làm gián đoạn luồng kiểm thử hoặc gây lỗi `undefined` khi `usageConfig` hoặc `userProfile` đang tải.

## Review Focus
1. Khi người dùng tải lại trang (F5) khi đang đăng nhập Admin: Trong 1 giây đầu tiên tuyệt đối không có quảng cáo hoặc nút nổi `✕ Ứng dụng ôn tập` nào được chèn vào DOM.
2. Khi người dùng đăng xuất: `isAuthReady` chuyển về `true` với `userProfile === null`, lúc này cấu hình `guest` mới được nạp hợp lệ.
3. Học viên có `courseId` hợp lệ nhưng cờ `isVerified` chưa được set: Phải được nhận diện là `verified_user` (không hiện quảng cáo).
4. Google Auto-Ads gán inline `style="display: block !important"`: Bị đè bẹp bởi `opacity: 0 !important; pointer-events: none !important; max-height: 0 !important; transform: scale(0) !important;` và bị hàm `purgeAllAdSenseDomAndScripts()` xóa sạch khỏi cây DOM.
5. Biến `observer` trong `AdSenseLoader.tsx` không được tồn tại vĩnh viễn khi component unmount hoặc `userProfile` thay đổi.

---

## Implementation Steps (TDD Enriched)

### Task 1: Bổ sung cờ `isAuthReady` vào Store & Hook khởi tạo

**Files:**
- Modify: [`ontap-web/stores/useAppStore.ts:60-120`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts)
- Modify: [`ontap-web/hooks/useAppInitialization.ts:270-380`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: Zustand `create<AppStore>()`
- Produces: `isAuthReady: boolean`, `setIsAuthReady: (ready: boolean) => void`

- [ ] **Step 2.1: Viết test thất bại (RED) cho Store & Hook**
  Bổ sung vào `scripts/portal-console-and-tinymce-fix.test.ts`:
  ```typescript
  it('TC-33a: useAppStore and useAppInitialization must provide and update isAuthReady flag', () => {
    const storePath = path.resolve(rootDir, 'ontap-web/stores/useAppStore.ts');
    const storeContent = fs.readFileSync(storePath, 'utf8');
    expect(storeContent).toMatch(/isAuthReady:\s*boolean/);
    expect(storeContent).toMatch(/setIsAuthReady:\s*\(ready:\s*boolean\)\s*=>\s*void/);

    const initPath = path.resolve(rootDir, 'ontap-web/hooks/useAppInitialization.ts');
    const initContent = fs.readFileSync(initPath, 'utf8');
    expect(initContent).toMatch(/setIsAuthReady\(true\)/);
  });
  ```

- [ ] **Step 2.2: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33a"
  ```
  Expected: FAIL vì `useAppStore.ts` chưa có `isAuthReady`.

- [ ] **Step 2.3: Implement tối thiểu (GREEN)**
  1. Trong [`ontap-web/stores/useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts):
     - Thêm `isAuthReady: boolean;` và `setIsAuthReady: (ready: boolean) => void;` vào `interface AppStore`.
     - Khởi tạo `isAuthReady: false,` và setter `setIsAuthReady: (isAuthReady) => set({ isAuthReady }),`.
  2. Trong [`ontap-web/hooks/useAppInitialization.ts`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts):
     - Lấy `const setIsAuthReady = useAppStore(state => state.setIsAuthReady);`.
     - Trong `onAuthStateChanged(auth, async (firebaseUser) => { ... })`:
       - Sau `setUserProfile(profile)` khi nạp xong profile hợp lệ (cả `onSnapshot` lẫn sau `getUserProfile`): gọi `setIsAuthReady(true)`.
       - Ở nhánh `else` (`!firebaseUser`): sau `setUserProfile(null); setUserName('');`, gọi `setIsAuthReady(true)`.

- [ ] **Step 2.4: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33a"
  ```
  Expected: PASS 1/1 test.

---

### Task 2: Chuẩn hóa `getUserRoleConfig` & Nâng cấp CSS phòng thủ Auto-Ads

**Files:**
- Modify: [`ontap-web/services/usageService.ts:19-55`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts)
- Modify: [`ontap-web/services/adBlockerStyles.ts:50-85`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `UsageConfig`, `userProfile`
- Produces: `{ param: RoleConfig, type: 'guest' | 'free' | 'verified' | 'vip' | 'teacher' | 'manager' | 'leader' | 'admin' }`, `ADSENSE_HIDE_ALL_CSS`

- [ ] **Step 2.5: Viết test thất bại (RED) cho Role Mapping & CSS Blocker**
  Bổ sung vào `scripts/portal-console-and-tinymce-fix.test.ts`:
  ```typescript
  it('TC-34: adBlockerStyles.ts and usageService.ts must enforce strict Auto-Ads hiding and accurate role mapping', () => {
    const cssPath = path.resolve(rootDir, 'ontap-web/services/adBlockerStyles.ts');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toMatch(/\.adsbygoogle-noablate/);
    expect(cssContent).toMatch(/div\[id\^="google-anno"\]/);
    expect(cssContent).toMatch(/opacity:\s*0\s*!important/);
    expect(cssContent).toMatch(/pointer-events:\s*none\s*!important/);

    const usagePath = path.resolve(rootDir, 'ontap-web/services/usageService.ts');
    const usageContent = fs.readFileSync(usagePath, 'utf8');
    expect(usageContent).toMatch(/role\s*===\s*['"]lanh_dao['"][\s\S]*?config\.leader/);
    expect(usageContent).toMatch(/userProfile\.courseId/);
  });
  ```

- [ ] **Step 2.6: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-34"
  ```
  Expected: FAIL vì `adBlockerStyles.ts` chưa có selector Auto-Ads và `usageService.ts` chưa map `lanh_dao` sang `leader`.

- [ ] **Step 2.7: Implement tối thiểu (GREEN)**
  1. Trong [`ontap-web/services/usageService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts):
     ```typescript
     // Leader (Lanh Dao)
     if (role === 'lanh_dao') {
         return { param: config.leader || config.manager, type: 'leader' };
     }

     // Manager (Quan Ly)
     if (role === 'quan_ly') {
         return { param: config.manager, type: 'manager' };
     }
     ...
     // Verified (Class member / Course member / Verified flag)
     if ((userProfile.class && userProfile.class.length > 0) || userProfile.isVerified || Boolean(userProfile.courseId)) {
         return { param: config.verified_user, type: 'verified' };
     }
     ```
  2. Trong [`ontap-web/services/adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts):
     ```typescript
     export const ADSENSE_HIDE_ALL_CSS = `
         .adsbygoogle,
         ins.adsbygoogle,
         .adsbygoogle-noablate,
         .google-auto-placed,
         [data-ad-client],
         [data-ad-status],
         div[id^="google-anno"],
         div[id^="google_ads"],
         iframe[id^="google_ads"],
         iframe[id^="aswift"],
         #google-vignette {
             display: none !important;
             visibility: hidden !important;
             opacity: 0 !important;
             pointer-events: none !important;
             height: 0 !important;
             max-height: 0 !important;
             width: 0 !important;
             max-width: 0 !important;
             overflow: hidden !important;
             z-index: -9999 !important;
             transform: scale(0) !important;
         }
     `;
     ```

- [ ] **Step 2.8: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-34"
  ```
  Expected: PASS 1/1 test.

---

### Task 3: Chốt chặn `isAuthReady`, Cờ hủy `isCancelled` & Hàm `purgeAllAdSenseDomAndScripts` trong `AdSenseLoader.tsx`

**Files:**
- Modify: [`ontap-web/routes/AppRoutes.tsx:110-115`](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx)
- Modify: [`ontap-web/components/AdSenseLoader.tsx:1-215`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `<AdSenseLoader userProfile={userProfile} isAuthReady={isAuthReady} />`
- Produces: Ngăn chặn triệt để nạp AdSense khi chưa ready; dọn sạch toàn bộ script & DOM ads khi `showAdSense === false`.

- [ ] **Step 2.9: Viết test thất bại (RED) cho AdSenseLoader Guard & Purge**
  Bổ sung vào `scripts/portal-console-and-tinymce-fix.test.ts`:
  ```typescript
  it('TC-33b: ontap-web/components/AdSenseLoader.tsx must guard with isAuthReady, use isCancelled flag, and provide purgeAllAdSenseDomAndScripts', () => {
    const loaderPath = path.resolve(rootDir, 'ontap-web/components/AdSenseLoader.tsx');
    const loaderContent = fs.readFileSync(loaderPath, 'utf8');

    expect(loaderContent).toMatch(/isAuthReady\?:?\s*boolean/);
    expect(loaderContent).toMatch(/if\s*\(!isAuthReady\)/);
    expect(loaderContent).toMatch(/isCancelled/);
    expect(loaderContent).toMatch(/purgeAllAdSenseDomAndScripts/);
    expect(loaderContent).toMatch(/google-auto-placed/);
  });
  ```

- [ ] **Step 2.10: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33b"
  ```
  Expected: FAIL vì `AdSenseLoader.tsx` chưa nhận prop `isAuthReady` và chưa có `purgeAllAdSenseDomAndScripts`.

- [ ] **Step 2.11: Implement tối thiểu (GREEN)**
  1. Trong [`ontap-web/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx):
     - Lấy `const isAuthReady = useAppStore(state => state.isAuthReady);`.
     - Truyền `<AdSenseLoader userProfile={userProfile} isAuthReady={isAuthReady} />`.
  2. Trong [`ontap-web/components/AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx):
     - Mở rộng interface props: `interface AdSenseLoaderProps { userProfile: any | null; isAuthReady?: boolean; }`.
     - Đầu `useEffect(() => { ... }, [userProfile, isAuthReady])`:
       ```typescript
       if (!isAuthReady) {
           injectHideAdsCompletely();
           return;
       }
       let isCancelled = false;
       ```
     - Sau `await getUsageConfig()`: kiểm tra `if (isCancelled) return;`.
     - Nếu `!showAdSense`: gọi `purgeAllAdSenseDomAndScripts()` và `injectHideAdsCompletely()`.
     - Viết hàm `purgeAllAdSenseDomAndScripts()`:
       ```typescript
       const purgeAllAdSenseDomAndScripts = () => {
           ['adsense-script', 'adsterra-script', 'monetag-script'].forEach(id => {
               const el = document.getElementById(id);
               if (el) el.remove();
           });
           document.querySelectorAll(
               'script[src*="adsbygoogle"], .adsbygoogle, ins.adsbygoogle, .adsbygoogle-noablate, .google-auto-placed, [data-ad-client], [data-ad-status], div[id^="google-anno"], div[id^="google_ads"], iframe[id^="google_ads"], iframe[id^="aswift"], iframe[src*="googlesyndication"], #google-vignette'
           ).forEach(el => el.remove());
       };
       ```
     - Trong cleanup của `useEffect`:
       ```typescript
       return () => {
           isCancelled = true;
           observer?.disconnect();
           if (popunderHandler) {
               document.body.removeEventListener('click', popunderHandler);
           }
       };
       ```

- [ ] **Step 2.12: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33b"
  ```
  Expected: PASS 1/1 test.

- [ ] **Step 2.13: Kiểm tra Invariants & Commit Phase 02**
  ```powershell
  git diff ontap-web/components/ExamQuizScreen.tsx
  git add ontap-web/stores/useAppStore.ts ontap-web/hooks/useAppInitialization.ts ontap-web/services/usageService.ts ontap-web/services/adBlockerStyles.ts ontap-web/routes/AppRoutes.tsx ontap-web/components/AdSenseLoader.tsx scripts/portal-console-and-tinymce-fix.test.ts
  git commit -m "fix(adsense): add isAuthReady guard, async cancellation, dom purge and accurate role mapping"
  ```
  Expected: Diff của `ExamQuizScreen.tsx` bằng 0 bytes; commit thành công trên nhánh hiện tại.

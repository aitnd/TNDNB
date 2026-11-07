# Chi Tiết Kỹ Thuật Phase 01: Báo Cáo Kiểm Toán Lỗi 5 Ảnh, Triệt Tiêu Hydration Error & Tích Mặc Định Đăng Nhập

> **Mã kế hoạch**: `261107-0620-mobile-dashboard-simplification-and-error-audit`  
> **Quy trình áp dụng**: TDD Enriched (RED -> FAIL -> GREEN -> PASS -> COMMIT)  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md)
> - Thiết kế kỹ thuật: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/DESIGN.md)
> - Danh sách nhiệm vụ: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/task.md)
> - Tệp mã nguồn mục tiêu:
>   - [`ontap-web/components/LoginScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx)
>   - [`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx)
>   - [`components/FeaturedSlider.tsx`](file:///d:/Antigravity/TNDNB/components/FeaturedSlider.tsx)
> - Bộ kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Báo Cáo Kiểm Toán Kỹ Thuật Chi Tiết 5 Ảnh Chụp Màn Hình

| Ảnh | Trang | Triệu chứng lỗi ghi nhận | Phân loại | Bản chất nguyên nhân & Hướng giải quyết |
|---|---|---|---|---|
| **Ảnh 1 & 2** | `/ontap/login` | `Attempting to use a disconnected port object at CM.sendMessageTo (chrome-extension://nngceckbapebfimnlniiahkandclblb/background.js...)` | Client Extension | ID `nngceckbapebfimnlniiahkandclblb` là extension **Bitwarden Password Manager**. Port kết nối giữa script inject và background worker của Bitwarden bị ngắt. **Hoàn toàn không phải lỗi website**. |
| **Ảnh 3 (a)** | `daotaothuyenvien.com` | `ad.doubleclick.net net::ERR_BLOCKED_BY_CLIENT` | AdBlocker | Tiện ích chặn quảng cáo trên trình duyệt của người dùng phát hiện script quảng cáo/tracking và chủ động chặn. Không ảnh hưởng đến web. |
| **Ảnh 3 (b)** | `daotaothuyenvien.com` | `content.js:2 TypeError: Cannot read properties of null (reading 'data')` | Browser Extension | Một extension thứ ba cài trên máy người dùng tiêm script vào trang nhưng không tìm thấy data DOM mong muốn. Không thuộc codebase portal. |
| **Ảnh 3 (c)** | `daotaothuyenvien.com` | `React Minified error #425, #418, #423` (Hydration Failed) | **Lỗi Codebase Next.js** | **React Hydration Mismatch**: Thư viện Swiper trong `FeaturedSlider` render DOM trên client khác với HTML SSR của server. Khắc phục bằng `dynamic(() => import('../components/FeaturedSlider'), { ssr: false })`. |
| **Ảnh 4** | `/ontap/dashboard` | Popup modal cảnh báo *"⚠️ Cảnh báo đăng nhập: Tài khoản của bạn vừa được đăng nhập trên thiết bị này..."* | UX Khó chịu | Hàm `enforceAndRecordSession` trong `authSessionService.ts` tự động gọi `showSingleDeviceWarning()` mỗi khi có session cũ. Cần tắt modal này. |
| **Ảnh 5** | `/ontap/dashboard` | Popup xin quyền vị trí + Thời tiết, Tiến độ chiếm trọn màn hình, nút "Vào Ôn Tập" bị trôi xuống đáy | Layout Mobile kém | `WeatherWidget` tự gọi `getCurrentPosition` khi mount; `Dashboard.tsx` trên mobile xếp nút thi ở cuối thay vì ở đầu. Cần tối giản layout mobile. |

---

## 2. Implementation Steps (TDD Enriched)

### Task 1: Triệt Tiêu React Hydration Mismatch trong `app/page.tsx`

**Files:**
- Modify: [`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `FeaturedSlider` từ [`components/FeaturedSlider.tsx`](file:///d:/Antigravity/TNDNB/components/FeaturedSlider.tsx)
- Produces: Dynamic component với `{ ssr: false }` ngăn Swiper SSR DOM mismatch.

- [ ] **Step 1.1: Viết test thất bại (RED - TC-17)**
  ```typescript
  // scripts/portal-console-and-tinymce-fix.test.ts
  it('TC-17: app/page.tsx must dynamically import FeaturedSlider with ssr: false to prevent hydration mismatch', () => {
    const filePath = path.resolve(rootDir, 'app/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toMatch(/dynamic\(\s*\(\)\s*=>\s*import\(['"]\.\.\/components\/FeaturedSlider['"]\),\s*\{\s*ssr:\s*false/);
    expect(content).not.toMatch(/^import\s+FeaturedSlider\s+from\s+['"]\.\.\/components\/FeaturedSlider['"]/m);
  });
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  ```bash
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-17"
  ```
  Expected: FAIL (do `app/page.tsx` hiện tại đang import trực tiếp `import FeaturedSlider from '../components/FeaturedSlider'`).

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  Trong [`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx):
  ```tsx
  import dynamic from 'next/dynamic';

  // Triệt tiêu React Hydration Mismatch #418, #425, #423 do Swiper Slider render client-side
  const FeaturedSlider = dynamic(() => import('../components/FeaturedSlider'), {
    ssr: false,
    loading: () => (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>Đang tải Slider...</p>
      </div>
    )
  });
  ```

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  ```bash
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-17"
  ```
  Expected: PASS

- [ ] **Step 1.5: Commit checkpoint**
  ```bash
  git add app/page.tsx scripts/portal-console-and-tinymce-fix.test.ts
  git commit -m "fix(portal): resolve React hydration mismatch using dynamic import for FeaturedSlider"
  ```

---

### Task 2: Tích Mặc Định 2 Ô Đăng Nhập trong `LoginScreen.tsx`

**Files:**
- Modify: [`ontap-web/components/LoginScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: React `useState(true)`
- Produces: `rememberMe` khởi tạo bằng `true`, `saveThisAccount` khởi tạo bằng `true`.

- [ ] **Step 2.1: Viết test thất bại (RED - TC-18)**
  ```typescript
  // scripts/portal-console-and-tinymce-fix.test.ts
  it('TC-18: ontap-web/components/LoginScreen.tsx must initialize rememberMe and saveThisAccount to true by default', () => {
    const filePath = path.resolve(rootDir, 'ontap-web/components/LoginScreen.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toMatch(/const\s*\[rememberMe,\s*setRememberMe\]\s*=\s*useState\s*\(\s*true\s*\)/);
    expect(content).toMatch(/const\s*\[saveThisAccount,\s*setSaveThisAccount\]\s*=\s*useState\s*\(\s*true\s*\)/);
  });
  ```

- [ ] **Step 2.2: Chạy test — xác nhận FAIL**
  ```bash
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-18"
  ```
  Expected: FAIL (do `rememberMe` đang khởi tạo bằng `false`).

- [ ] **Step 2.3: Implement tối thiểu (GREEN)**
  Trong [`ontap-web/components/LoginScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx) (dòng 30):
  ```typescript
  // Mặc định tích cả 2 ô để người dùng tiện lợi không phải thao tác thủ công
  const [rememberMe, setRememberMe] = useState(true);
  const [saveThisAccount, setSaveThisAccount] = useState(true);
  ```

- [ ] **Step 2.4: Chạy test — xác nhận PASS**
  ```bash
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-18"
  ```
  Expected: PASS

- [ ] **Step 2.5: Commit checkpoint**
  ```bash
  git add ontap-web/components/LoginScreen.tsx scripts/portal-console-and-tinymce-fix.test.ts
  git commit -m "feat(auth): default rememberMe and saveThisAccount checkboxes to checked"
  ```

---

## 3. Tổng Kết Nghiệm Thu Phase 01

| Tiêu chí | Lệnh kiểm tra | Kết quả kỳ vọng |
|---|---|---|
| Vitest TC-17 & TC-18 | `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-17|TC-18"` | PASS 100% |
| Type Check | `npx tsc --noEmit` | 0 error |
| Portal Build | `npm run build` | Thành công |

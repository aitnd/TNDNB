# Phase 01: Cài Đặt Guest Auth Guard Trong adminConfigService (TDD Enriched)

> **Mã kế hoạch**: `261107-0940-clean-console-and-guest-firestore-guard`  
> **Tài liệu**: Kế hoạch kỹ thuật chi tiết Phase 01  
> **Mục tiêu**: Loại bỏ triệt để cảnh báo vàng `FirebaseError: Missing or insufficient permissions` trên trình duyệt khi khách vãng lai thi thử bằng cơ chế Guest Auth Guard tại client theo kỷ luật TDD (RED -> GREEN -> REFACTOR).

---

## 1. Mục Tiêu Kỹ Thuật (Objectives)

1. **Ngăn chặn triệt để request Firestore không hợp lệ**: Không bao giờ gửi request đọc Firestore `settings/usage_config` và `settings/github_config` khi người dùng chưa đăng nhập (`auth?.currentUser == null`).
2. **Loại bỏ hoàn toàn cảnh báo vàng (Zero-Noise Console)**: Triệt tiêu các dòng log `[Config] Firestore getGitHubConfig failed: Missing or insufficient permissions` trên console của trình duyệt.
3. **Tiết kiệm tài nguyên & tối ưu độ trễ**:
   - Tiết kiệm 100% quota Firestore read bị lãng phí do các request chắc chắn bị từ chối.
   - Giảm độ trễ nạp cấu hình từ 300-500ms xuống còn 0ms (chuyển thẳng sang `localStorage` hoặc cấu hình mặc định).
4. **Bảo toàn cơ chế Dual-Storage Resilience**:
   - Đối với người dùng đã đăng nhập (Học viên, Giáo viên, Quản trị viên), Firestore fallback vẫn hoạt động 100% như cũ khi Cloudflare KV gặp sự cố.
5. **Đảm bảo tính tương thích & bất biến**:
   - File [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) giữ nguyên vẹn 100% (`git diff = 0`).

---

## 2. Kịch Bản TDD Chi Tiết Từng Bước (Bite-Sized TDD Steps)

### Task 1: Bổ sung Guest Auth Guard cho `getUsageConfig()`

**Files:**
- Modify: [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

- [ ] **Step 1.1: Viết test thất bại (RED - TC-28)**
  Thêm test case `TC-28` vào [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts):
  ```typescript
  it('TC-28: ontap-web/services/adminConfigService.ts must guard getUsageConfig Firestore fallback with auth?.currentUser', () => {
    const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    const usageConfigBlock = content.match(/export const getUsageConfig = async[\s\S]*?return transformConfig/);
    expect(usageConfigBlock).toBeTruthy();

    if (usageConfigBlock) {
      const code = usageConfigBlock[0];
      // Phải có điều kiện auth?.currentUser trước khi gọi getDoc cho USAGE_CONFIG_DOC_ID
      expect(code).toMatch(/if\s*\(!data\s*&&\s*db\s*&&\s*auth\?\.currentUser\)/);
    }
  });
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  Chạy lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  Kỳ vọng: Test `TC-28` FAIL do `adminConfigService.ts` dòng 298 hiện tại chỉ có `if (!data && db)`.

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  Chỉnh sửa dòng 298 trong [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts):
  ```typescript
  // Trước:
  if (!data && db) {
  // Sau:
  if (!data && db && auth?.currentUser) {
  ```

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  Chạy lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  Kỳ vọng: `TC-28` PASS xanh 100%.

---

### Task 2: Bổ sung Guest Auth Guard cho `getGitHubConfig()`

**Files:**
- Modify: [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

- [ ] **Step 2.1: Viết test thất bại (RED - TC-29)**
  Thêm test case `TC-29` vào [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts):
  ```typescript
  it('TC-29: ontap-web/services/adminConfigService.ts must guard getGitHubConfig Firestore fallback with auth?.currentUser', () => {
    const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    const gitHubConfigBlock = content.match(/export const getGitHubConfig = async[\s\S]*?return\s*\{[\s\S]*?owner:\s*['"]aitnd['"]/);
    expect(gitHubConfigBlock).toBeTruthy();

    if (gitHubConfigBlock) {
      const code = gitHubConfigBlock[0];
      // Phải có điều kiện auth?.currentUser trước khi gọi getDoc cho github_config
      expect(code).toMatch(/if\s*\(!data\s*&&\s*db\s*&&\s*auth\?\.currentUser\)/);
    }
  });
  ```

- [ ] **Step 2.2: Chạy test — xác nhận FAIL**
  Chạy lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  Kỳ vọng: Test `TC-29` FAIL do dòng 413 hiện tại chỉ có `if (!data && db)`.

- [ ] **Step 2.3: Implement tối thiểu (GREEN)**
  Chỉnh sửa dòng 413 trong [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts):
  ```typescript
  // Trước:
  if (!data && db) {
  // Sau:
  if (!data && db && auth?.currentUser) {
  ```

- [ ] **Step 2.4: Chạy test — xác nhận PASS**
  Chạy lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  Kỳ vọng: Cả 29/29 tests PASS xanh 100%.

---

### Task 3: Rà soát & Xác nhận An Toàn Bản Desktop (`ontap-win`)

**Files:**
- Review: [`ontap-win/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts)

- [ ] **Step 3.1: Kiểm tra implementation của ontap-win**
  Xác nhận bản desktop chỉ đọc D1 API và fallback sang localStorage/default, hoàn toàn không gọi Firestore trực tiếp.

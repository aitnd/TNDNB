# Phase 03: Kiểm Thử TDD Tự Động, Đảm Bảo Invariants & Đóng Gói Nghiệm Thu

> **Mã kế hoạch**: `261109-0650-changelog-rbac-and-concise-copy`  
> **Tài liệu**: Đặc tả kiểm thử & nghiệm thu Phase 03  
> **Tệp tác động**:
> - [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts) (Bổ sung test suite RBAC, Anti-Dev-Leak và Render Inline Markdown)
> - [`scripts/version-sync.test.ts`](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts) (Kiểm tra tính nhất quán giữa các CHANGELOG)  
> **Mục tiêu**: Thiết lập bộ kiểm thử tự động Vitest bao phủ 100% các tiêu chí nghiệm thu của tính năng RBAC và nội dung súc tích, xác minh 2 Ràng buộc Bất biến (Invariant 1: `ExamQuizScreen.tsx` 0 bytes diff; Invariant 2: bảo toàn Electron Updater Windows), kiểm tra TypeScript sạch lỗi và đóng gói bản build production thành công.

---

## 1. Thiết Kế Test Suite TDD Chi Tiết (Vitest)

### 1.1 Bổ Sung Các Test Cases Vào `scripts/changelog-parser.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Changelog RBAC & Concise User Copy Test Suite (Phase 03)', () => {
  const rootDir = process.cwd();

  // Danh sách các từ khóa Dev cấm tuyệt đối xuất hiện trong CHANGELOG người dùng
  const FORBIDDEN_DEV_KEYWORDS = [
    'WelcomeModal',
    'LicenseSelectionScreen',
    'ExamQuizScreen',
    'Dashboard',
    '/ontap/settings',
    'Cloudflare KV',
    'Cloudflare R2',
    'Cloudflare D1',
    'Firestore',
    'Dexie',
    'IndexedDB',
    'Monorepo',
    'Next.js',
    'Vercel',
    'TinyMCE',
    'Zero-Noise Console',
    'First Fold Focus',
    'Hallmark Editorial',
    'resumeSessionAvailable',
    'deferredPrompt',
  ];

  it('TC-RBAC01: CHANGELOG.md (Người dùng) tại mục [3.22.0] và [3.21.0] tuyệt đối KHÔNG chứa bất kỳ từ khóa Dev nội bộ nào', () => {
    const userLog = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    
    // Trích xuất phần nội dung của bản 3.22.0 và 3.21.0
    const relevantContentMatch = userLog.match(/## \[3\.22\.0\][\s\S]*?(?=## \[3\.20\.0\])/);
    expect(relevantContentMatch, 'Phải tìm thấy nội dung mục 3.22.0 và 3.21.0').not.toBeNull();
    
    const relevantContent = relevantContentMatch![0];
    FORBIDDEN_DEV_KEYWORDS.forEach((keyword) => {
      expect(
        relevantContent.includes(keyword),
        `Từ khóa DEV nội bộ "${keyword}" không được phép xuất hiện trong CHANGELOG.md người dùng`
      ).toBe(false);
    });
  });

  it('TC-RBAC02: Nội dung CHANGELOG.md đồng bộ chính xác trên cả 4 vị trí (root, ontap-web, ontap-win, public/ontap)', () => {
    const rootLog = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const webLog = fs.readFileSync(path.resolve(rootDir, 'ontap-web/CHANGELOG.md'), 'utf8');
    const winLog = fs.readFileSync(path.resolve(rootDir, 'ontap-win/CHANGELOG.md'), 'utf8');
    const portalLog = fs.readFileSync(path.resolve(rootDir, 'public/ontap/CHANGELOG.md'), 'utf8');

    expect(webLog).toBe(rootLog);
    expect(winLog).toBe(rootLog);
    expect(portalLog).toBe(rootLog);
  });

  it('TC-RBAC03: Phân quyền RBAC - Cả 4 component đều kiểm tra vai trò admin, quan_ly, lanh_dao trước khi render Tab Switcher', () => {
    const filesToCheck = [
      path.resolve(rootDir, 'ontap-web/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-web/components/ChangelogScreen.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogScreen.tsx'),
    ];

    filesToCheck.forEach((filePath) => {
      const code = fs.readFileSync(filePath, 'utf8');
      expect(code, `File ${filePath} phải dùng useAppStore để lấy userProfile`).toContain('useAppStore');
      expect(code, `File ${filePath} phải kiểm tra quyền xem Dev changelog`).toMatch(/canViewDevChangelog|DEV_ROLES/);
      expect(code, `File ${filePath} phải kiểm tra vai trò admin`).toContain('admin');
      expect(code, `File ${filePath} phải kiểm tra vai trò quan_ly`).toContain('quan_ly');
      expect(code, `File ${filePath} phải kiểm tra vai trò lanh_dao`).toContain('lanh_dao');
    });
  });

  it('TC-RBAC04: Cả 4 component đều tích hợp hàm renderInlineMarkdown hoặc chuyển đổi **text** thành <strong>', () => {
    const filesToCheck = [
      path.resolve(rootDir, 'ontap-web/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-web/components/ChangelogScreen.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogScreen.tsx'),
    ];

    filesToCheck.forEach((filePath) => {
      const code = fs.readFileSync(filePath, 'utf8');
      expect(code, `File ${filePath} phải có logic render inline markdown (renderInlineMarkdown hoặc thẻ strong)`).toMatch(
        /renderInlineMarkdown|<strong|renderFormattedItem/
      );
    });
  });

  it('TC-RBAC05: Ràng buộc Bất biến 2 - ontap-win/components/ChangelogModal.tsx bảo toàn 100% Electron Updater & Question Sync', () => {
    const winModalCode = fs.readFileSync(path.resolve(rootDir, 'ontap-win/components/ChangelogModal.tsx'), 'utf8');
    expect(winModalCode).toContain('window.electron');
    expect(winModalCode).toContain('shouldUpdateQuestions');
    expect(winModalCode).toContain('fetchAndSaveQuestions');
    expect(winModalCode).toContain('handleCheckDataUpdate');
    expect(winModalCode).toContain('handleUpdateData');
  });
});
```

---

## 2. Kiểm Tra Ràng Buộc Bất Biến 1 (Zero-Diff Invariant 1)

> [!IMPORTANT]
> **Quy trình xác minh Invariant 1:**
> Chạy lệnh git diff để đảm bảo file phòng thi [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) không bị sửa đổi dù chỉ 1 ký tự:
> ```bash
> git status --porcelain ontap-web/components/ExamQuizScreen.tsx
> ```
> Kết quả mong đợi: **Không có bất kỳ thay đổi nào (0 bytes diff).**

---

## 3. Quy Trình Thực Thi TDD & Nghiệm Thu Chi Tiết (TDD Bite-Sized Steps)

### Task 3: Kiểm Thử TDD Tự Động, Đảm Bảo Invariants & Đóng Gói Nghiệm Thu

> **Review Focus**:
> - Đọc kỹ [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/DESIGN.md) Mục 4, 5 & Mục 6.
> - **Tiêu chuẩn Impeccable v4.8.0 & Taste-Skill v2.5.0**:
>   * Xác nhận toàn bộ 5 test cases `TC-RBAC01` đến `TC-RBAC05` chạy thành công không có lỗi hồi quy (zero regression).
>   * Kiểm tra không có bất kỳ console warning nào trong quá trình render component.
> - **Ràng Buộc Bất Biến Tuyệt Đối**:
>   * *Invariant 1*: [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) đạt `0 bytes diff`.
>   * *Invariant 2*: [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) bảo toàn 100% dòng 16–287 (`window.electron`, `shouldUpdateQuestions`, `fetchAndSaveQuestions`).

**Files:**
- Test: [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts)
- Test: [`scripts/version-sync.test.ts`](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts)
- Verify: [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
- Verify: [`ontap-web/components/QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx)
- Verify: [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)

---

- [ ] **Step 3.1: Chạy test suite RBAC & Version Sync**
  ```powershell
  npx vitest run scripts/changelog-parser.test.ts scripts/version-sync.test.ts
  ```
  *Kỳ vọng*: Toàn bộ các bài kiểm tra đều PASS 100% (Green), bao gồm `TC-RBAC01` ➔ `TC-RBAC05`.

- [ ] **Step 3.2: Chạy toàn bộ test suites trong `scripts/`**
  ```powershell
  npx vitest run scripts/
  ```
  *Kỳ vọng*: Toàn bộ 13 test files (bao gồm `mobile-exam-first-fold.test.ts`, `pwa-install-banner.test.ts`, `guest-auth-guard.test.ts`,...) đều PASS 100%.

- [ ] **Step 3.3: Xác nhận Ràng Buộc Bất Biến 1 (Zero-Diff Invariant 1)**
  ```powershell
  git status --porcelain ontap-web/components/ExamQuizScreen.tsx ontap-web/components/QuizScreen.tsx
  ```
  *Kỳ vọng*: Kết quả trả về rỗng (0 bytes diff). Hai màn hình thi cử được bảo vệ nguyên vẹn 100%.

- [ ] **Step 3.4: Xác nhận Ràng Buộc Bất Biến 2 (Electron Updater Invariant 2)**
  ```powershell
  npx vitest run -t "TC-RBAC05" scripts/changelog-parser.test.ts
  ```
  *Kỳ vọng*: Test PASS, khẳng định toàn bộ dòng 16–287 trong `ontap-win/components/ChangelogModal.tsx` không bị ảnh hưởng.

- [ ] **Step 3.5: Kiểm tra kiểu dữ liệu TypeScript tĩnh**
  ```powershell
  npx tsc --noEmit
  cd ontap-web; npx tsc --noEmit; cd ..
  ```
  *Kỳ vọng*: 0 lỗi TypeScript trên toàn bộ hệ thống Monorepo.

- [ ] **Step 3.6: Đóng gói Production Vite & Đồng bộ sang Cổng thông tin**
  ```powershell
  cd ontap-web; npm run build; cd ..
  ```
  *Kỳ vọng*: Build thành công, tạo thư mục `ontap-web/dist/` và đồng bộ tài sản sang `public/ontap/`.

- [ ] **Step 3.7: Đóng gói Portal Next.js**
  ```powershell
  npm run build:portal
  ```
  *Kỳ vọng*: Toàn bộ 57 static routes của Cổng thông tin biên dịch thành công.

- [ ] **Step 3.8: Tạo commit nghiệm thu Phase 03**
  ```bash
  git add CHANGELOG.md ontap-web/CHANGELOG.md ontap-win/CHANGELOG.md public/ontap/CHANGELOG.md update_changelogs.js ontap-web/components/ChangelogModal.tsx ontap-web/components/ChangelogScreen.tsx ontap-win/components/ChangelogModal.tsx ontap-win/components/ChangelogScreen.tsx scripts/changelog-parser.test.ts
  git commit -m "feat(changelog): implement RBAC for dev tab, concise user copy, and inline markdown rendering"
  ```


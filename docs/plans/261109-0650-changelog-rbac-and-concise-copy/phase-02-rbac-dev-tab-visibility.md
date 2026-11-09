# Phase 02: Phân Quyền Vai Trò (RBAC) Cho Tab Kỹ Thuật (Dev) Trong Lịch Sử Cập Nhật

> **Mã kế hoạch**: `261109-0650-changelog-rbac-and-concise-copy`  
> **Tài liệu**: Đặc tả kỹ thuật Phase 02  
> **Tệp tác động**:
> - [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) (Tích hợp RBAC guard cho Tab Switcher)
> - [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) (Tích hợp RBAC guard cho Tab Switcher)
> - [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) (Tích hợp RBAC guard ở dòng 303–328; bảo toàn 100% dòng 16–287)
> - [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) (Tích hợp RBAC guard cho Tab Switcher)  
> **Mục tiêu**: Ngăn chặn rò rỉ kiến trúc hạ tầng và thông tin nội bộ của hệ thống ra công chúng bằng cách chỉ cho phép các tài khoản Quản trị & Điều hành (`admin`, `quan_ly`, `lanh_dao`) nhìn thấy và truy cập tab `[💻 Kỹ thuật (Dev)]`.

---

## 1. Phân Tích Hiện Trạng & Rủi Ro Bảo Mật Thông Tin

### 1.1 Điểm Yếu Bảo Mật Thông Tin Hiện Tại (Information Leakage)
- Hiện nay, thanh chuyển đổi Segmented Control `[👤 Người dùng]` và `[💻 Kỹ thuật (Dev)]` đang hiển thị công khai cho mọi đối tượng truy cập ứng dụng.
- Khách vãng lai chưa đăng nhập (`null`), học viên phổ thông (`hoc_vien`) và giáo viên (`giao_vien`) đều có thể chuyển sang tab Dev để xem chi tiết:
  - Cấu trúc mã nguồn, tên các component nội bộ (`WelcomeModal`, `ExamQuizScreen`, `LicenseSelectionScreen`,...).
  - Hạ tầng lưu trữ và dịch vụ đám mây (`Cloudflare KV`, `Cloudflare R2`, `Cloudflare D1`, `Firebase Firestore`, `Dexie IndexedDB`,...).
  - Thiết kế kiến trúc Monorepo và cơ chế xác thực.
- Việc này tạo ra **bề mặt tấn công thông tin (Information Surface Attack)** không cần thiết và làm mất đi trải nghiệm thân thiện, tập trung của người học.

### 1.2 Ma Trận Phân Quyền Vai Trò (RBAC Matrix)

| Vai trò người dùng (`userProfile.role`) | Hiển thị Tab Switcher? | Quyền xem Tab `[💻 Kỹ thuật (Dev)]` | Giao diện hiển thị |
|---|:---:|:---:|---|
| **Chưa đăng nhập (Khách / `null`)** | ❌ **Ẩn hoàn toàn** | ❌ Không | Cố định hiển thị Bản tin Người dùng |
| **Học viên (`hoc_vien`)** | ❌ **Ẩn hoàn toàn** | ❌ Không | Cố định hiển thị Bản tin Người dùng |
| **Giáo viên (`giao_vien`)** | ❌ **Ẩn hoàn toàn** | ❌ Không | Cố định hiển thị Bản tin Người dùng |
| **Quản trị viên (`admin`)** | ✅ **Hiển thị** | ✅ Có | Cho phép chuyển đổi giữa Người dùng và Dev |
| **Quản lý đào tạo (`quan_ly`)** | ✅ **Hiển thị** | ✅ Có | Cho phép chuyển đổi giữa Người dùng và Dev |
| **Lãnh đạo nhà trường (`lanh_dao`)** | ✅ **Hiển thị** | ✅ Có | Cho phép chuyển đổi giữa Người dùng và Dev |

---

## 2. Thiết Kế Logic Kỹ Thuật (Implementation Logic)

### 2.1 Truy Xuất Thông Tin Người Dùng từ Global Store
Cả ứng dụng Web (`ontap-web`) và Windows (`ontap-win`) đều quản lý phiên đăng nhập thông qua Zustand store `useAppStore`:

```tsx
import { useAppStore } from '../stores/useAppStore';

// Trong thân Component:
const userProfile = useAppStore(state => state.userProfile);

// Danh sách các vai trò có quyền xem thông tin kỹ thuật Dev
const DEV_ROLES = ['admin', 'quan_ly', 'lanh_dao'];

// Biến boolean kiểm tra quyền
const canViewDevChangelog = Boolean(userProfile?.role && DEV_ROLES.includes(userProfile.role));
```

### 2.2 Xử Lý State An Toàn (Defensive State Handling)
Để đảm bảo người dùng không có quyền không bao giờ ở trạng thái `activeTab === 'dev'`:

```tsx
const [activeTab, setActiveTab] = useState<'user' | 'dev'>('user');

// Fallback cưỡng chế: nếu không có quyền mà activeTab bằng 'dev', lập tức coi như 'user'
const effectiveTab = canViewDevChangelog ? activeTab : 'user';
const currentList = effectiveTab === 'user' ? userChangelog : devChangelog;
```

### 2.3 Điều Kiện Hiển Thị Giao Diện Tab Switcher
```tsx
{/* Chỉ render Segmented Control Tab Switcher khi người dùng có quyền Dev */}
{canViewDevChangelog && (
  <div className="flex justify-center mb-6">
    <div className="inline-flex p-1 bg-muted rounded-xl border border-border shadow-xs">
      <button
        onClick={() => setActiveTab('user')}
        className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[40px] flex items-center gap-1.5 ${
          effectiveTab === 'user'
            ? 'bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span>👤</span>
        <span>Người dùng</span>
      </button>
      <button
        onClick={() => setActiveTab('dev')}
        className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[40px] flex items-center gap-1.5 ${
          effectiveTab === 'dev'
            ? 'bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span>💻</span>
        <span>Kỹ thuật (Dev)</span>
      </button>
    </div>
  </div>
)}
```

---

## 3. Ràng Buộc Bất Biến & Các Điểm Cần Chú Ý

> [!CAUTION]
> **Ràng Buộc Bất Biến 2 (Electron Auto-Updater & Question Sync Guard):**  
> Trong file [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx), toàn bộ khối logic từ dòng 16 đến dòng 287 bao gồm:
> - Tự động kiểm tra bản cập nhật Electron (`getGitHubReleases`, `window.electron.downloadUpdate`, `installUpdate`).
> - Nút kiểm tra và đồng bộ gói đề thi mới chạy ngầm (`shouldUpdateQuestions`, `fetchAndSaveQuestions`).
> **TUYỆT ĐỐI KHÔNG ĐƯỢC THAY ĐỔI HOẶC XÓA BỎ.** Chỉ thao tác thêm `useAppStore`, `canViewDevChangelog` và bọc khối Tab Switcher ở các dòng 303–328.

---

## 4. Quy Trình Thực Thi TDD Chi Tiết (TDD Bite-Sized Steps)

### Task 2: Phân Quyền Vai Trò (RBAC) Cho Tab Kỹ Thuật (Dev)

> **Review Focus**:
> - Đọc kỹ [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/DESIGN.md) Mục 2.1, 2.2 & Mục 3.
> - **Tiêu chuẩn Impeccable v4.8.0 & Taste-Skill v2.5.0**:
>   * *Clean Visual Floor*: Khi `canViewDevChangelog === false`, thanh Tab Switcher phải **HOÀN TOÀN BIẾN MẤT** khỏi DOM tree, không render bất kỳ tab mờ, disabled button hay dấu vết nào về chế độ Dev.
>   * *Defensive State Resolution*: Luôn sử dụng `effectiveTab = canViewDevChangelog ? activeTab : 'user'` để người dùng không có quyền không bao giờ có thể ép component render `CHANGELOG_DEV.md`.
>   * *Touch Targets & Haptics*: Khi hiển thị cho Admin/Lãnh đạo, mỗi tab có chiều cao $\ge 40\text{px}$, kích hoạt `triggerHaptic('light')` khi bấm.
> - **Ràng Buộc Bất Biến**:
>   * *Invariant 1*: Tuyệt đối không chỉnh sửa [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) (`0 bytes diff`).
>   * *Invariant 2*: Trong [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx), bảo toàn nguyên vẹn 100% logic tự động cập nhật Electron và tải đề thi ngầm từ dòng 16 đến dòng 287 (`window.electron`, `shouldUpdateQuestions`, `fetchAndSaveQuestions`, `handleCheckDataUpdate`, `handleUpdateData`).

**Files:**
- Test: [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts)
- Modify: [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx)
- Modify: [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)
- Modify: [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)
- Modify: [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx)

---

- [ ] **Step 2.1: Viết test thất bại (RED)**
  Bổ sung test case `TC-RBAC03` và `TC-RBAC05` vào [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts):
  ```typescript
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

  it('TC-RBAC05: Ràng buộc Bất biến 2 - ontap-win/components/ChangelogModal.tsx bảo toàn 100% Electron Updater & Question Sync', () => {
    const winModalCode = fs.readFileSync(path.resolve(rootDir, 'ontap-win/components/ChangelogModal.tsx'), 'utf8');
    expect(winModalCode).toContain('window.electron');
    expect(winModalCode).toContain('shouldUpdateQuestions');
    expect(winModalCode).toContain('fetchAndSaveQuestions');
    expect(winModalCode).toContain('handleCheckDataUpdate');
    expect(winModalCode).toContain('handleUpdateData');
  });
  ```

- [ ] **Step 2.2: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/changelog-parser.test.ts
  ```
  *Kỳ vọng*: Test `TC-RBAC03` FAIL vì cả 4 file chưa import `useAppStore` và chưa có logic kiểm tra `canViewDevChangelog`.

- [ ] **Step 2.3: Implement — Tích hợp RBAC vào `ontap-web` (GREEN)**
  - Trong [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) và [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx):
    ```tsx
    import { useAppStore } from '../stores/useAppStore';

    // Trong component:
    const userProfile = useAppStore(state => state.userProfile);
    const DEV_ROLES = ['admin', 'quan_ly', 'lanh_dao'];
    const canViewDevChangelog = Boolean(userProfile?.role && DEV_ROLES.includes(userProfile.role));
    const [activeTab, setActiveTab] = useState<'user' | 'dev'>('user');
    const effectiveTab = canViewDevChangelog ? activeTab : 'user';
    const activeData = effectiveTab === 'user' ? userChangelog : devChangelog;
    ```
  - Bọc phần Tab Switcher trong điều kiện `{canViewDevChangelog && ( ... )}`:
    ```tsx
    {canViewDevChangelog && (
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('user'); }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] ${
              effectiveTab === 'user'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            👤 Người dùng
          </button>
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('dev'); }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] ${
              effectiveTab === 'dev'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            💻 Kỹ thuật (Dev)
          </button>
        </div>
      </div>
    )}
    ```

- [ ] **Step 2.4: Implement — Tích hợp RBAC vào `ontap-win` (GREEN)**
  - Trong [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx):
    Import `useAppStore`, kiểm tra `canViewDevChangelog = Boolean(userProfile?.role && DEV_ROLES.includes(userProfile.role))`, bọc Tab Switcher bằng `{canViewDevChangelog && ( ... )}`.
  - Trong [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx):
    - **Giữ nguyên vẹn 100% dòng 16–287** liên quan đến kiểm tra bản cập nhật Electron và tải câu hỏi ngầm.
    - Tại phần hiển thị Changelog phía dưới dòng 289, import `useAppStore`, khởi tạo `canViewDevChangelog`, và bọc Tab Switcher bằng `{canViewDevChangelog && ( ... )}`.

- [ ] **Step 2.5: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/changelog-parser.test.ts
  ```
  *Kỳ vọng*: `TC-RBAC03` và `TC-RBAC05` đều PASS 100%.

- [ ] **Step 2.6: Commit**
  ```bash
  git add ontap-web/components/ChangelogModal.tsx ontap-web/components/ChangelogScreen.tsx ontap-win/components/ChangelogModal.tsx ontap-win/components/ChangelogScreen.tsx scripts/changelog-parser.test.ts
  git commit -m "feat(rbac): hide dev changelog tab for students and guests, restrict to admin, quan_ly, lanh_dao"
  ```


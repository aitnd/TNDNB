# Phase 3: Sửa lỗi Truy xuất (Data)

## Implementation Steps (TDD Enriched)

### Task 1: Cập nhật hàm getLicensesOffline() và lọc hiển thị

**Files:**
- Modify: `ontap-win/services/offlineService.ts`
- Modify: `ontap-win/routes/AppRoutes.tsx`

- [ ] **Step 1.1: Bổ sung logic sort từ IndexedDB (GREEN)**
  - Mở `ontap-win/services/offlineService.ts`.
  - Sửa hàm `getLicensesOffline()`: gọi `await db_offline.licenses.toArray()` sau đó `.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))`.

- [ ] **Step 1.2: Lọc các hạng bằng ảo trong AppRoutes (GREEN)**
  - Mở `ontap-win/routes/AppRoutes.tsx`.
  - Sửa dòng render `<LicenseSelectionScreen>`: lọc `licenses.filter(l => !['ly-thuyet', 'giam-khao-h2'].includes(l.id))` để ẩn hạng bằng ảo (dùng ID thay vì Name).

- [ ] **Step 1.3: Chạy kiểm tra TypeScript (PASS)**
  - Run: `cd ontap-win && npx tsc --noEmit`
  - Expected: PASS

- [ ] **Step 1.4: Build kiểm tra (PASS)**
  - Run: `cd ontap-win && npm run build`
  - Expected: Build thành công không có lỗi.

- [ ] **Step 1.5: Commit**
  - Run: `git add ontap-win/services/offlineService.ts ontap-win/routes/AppRoutes.tsx`
  - Run: `git commit -m "fix(offline): sort licenses by displayOrder and hide pseudo-licenses by id"`

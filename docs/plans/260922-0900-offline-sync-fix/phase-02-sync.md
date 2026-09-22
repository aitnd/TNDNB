# Phase 2: Sửa lỗi Đồng bộ (Sync)

## Implementation Steps (TDD Enriched)

### Task 1: Sửa logic tải dữ liệu (fetchAndSaveQuestions & syncData)

**Files:**
- Modify: `ontap-win/services/syncService.ts`
- Modify: `ontap-win/hooks/useAppInitialization.ts` (Thêm migration)

- [ ] **Step 1.1: Bổ sung logic lấy đúng dữ liệu (GREEN)**
  - Thêm `.order('display_order', { foreignTable: 'subjects', ascending: true })` vào query Supabase.
  - Import hàm `naturalSortQuestions` từ `./dataService`.
  - Áp dụng `.sort(naturalSortQuestions)` cho mảng `questions` khi map.
  - Gắn `displayOrder: license.display_order` và `displayOrder: s.display_order` vào các object.

- [ ] **Step 1.2: Sửa luồng sync thứ 2 (GREEN)**
  - Tìm hàm `syncData(userId)`.
  - Thay thế lệnh gọi `fetchLicenses()` bằng `await fetchAndSaveQuestions();` (để tải từ Supabase và ghi đè DB nội bộ). Xóa dòng code thừa.

- [ ] **Step 1.3: Thêm Migration ép Sync (GREEN)**
  - Mở `ontap-win/hooks/useAppInitialization.ts`.
  - Thêm logic: nếu `localStorage.getItem('migrated_display_order_v1')` chưa có, hãy xóa `questions_last_sync` và set lại cờ này. Để khi mở app, nó sẽ báo có bản cập nhật mới và ép người dùng tải lại DB mới (hoặc tự động tải tuỳ logic app).

- [ ] **Step 1.4: Chạy kiểm tra TypeScript (PASS)**
  - Run: `cd ontap-win && npx tsc --noEmit`
  - Expected: PASS

- [ ] **Step 1.5: Commit**
  - Run: `git add ontap-win/services/syncService.ts ontap-win/hooks/useAppInitialization.ts`
  - Run: `git commit -m "fix(sync): apply ordering, fix syncData flow, and add migration to force resync"`

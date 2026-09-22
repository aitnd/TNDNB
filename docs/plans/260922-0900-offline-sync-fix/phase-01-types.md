# Phase 1: Cập nhật Interface (Types)

## Implementation Steps (TDD Enriched)

### Task 1: Cập nhật Interface và Export Helper

**Files:**
- Modify: `ontap-win/types.ts`
- Modify: `ontap-win/services/dataService.ts`

- [ ] **Step 1.1: Bổ sung thuộc tính displayOrder (GREEN)**
  - Cập nhật file `ontap-win/types.ts`.
  - Thêm `displayOrder?: number` vào interface `License` và `Subject`. (Không thêm vào Question vì DB Supabase không có trường này).

- [ ] **Step 1.2: Export hàm naturalSortQuestions (GREEN)**
  - Mở `ontap-win/services/dataService.ts`.
  - Sửa `const naturalSortQuestions =` thành `export const naturalSortQuestions =`.

- [ ] **Step 1.3: Chạy kiểm tra TypeScript (PASS)**
  - Run: `cd ontap-win && npx tsc --noEmit`
  - Expected: PASS

- [ ] **Step 1.4: Commit**
  - Run: `git add ontap-win/types.ts ontap-win/services/dataService.ts`
  - Run: `git commit -m "types: add displayOrder to License, Subject and export naturalSortQuestions"`

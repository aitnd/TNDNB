# Phase 5: Đồng bộ tính năng Giám khảo cho bản Windows

## Implementation Steps (TDD Enriched)

### Task 1: Bổ sung màn hình và logic Giám khảo

**Files:**
- Create: `ontap-win/components/GiamKhaoSelectionScreen.tsx` (Copy từ `ontap-web`)
- Modify: `ontap-win/App.tsx`
- Modify: `ontap-win/routes/AppRoutes.tsx`

- [ ] **Step 1.1: Copy GiamKhaoSelectionScreen (GREEN)**
  - Copy file `ontap-web/components/GiamKhaoSelectionScreen.tsx` sang `ontap-win/components/`.

- [ ] **Step 1.2: Cập nhật App.tsx (GREEN)**
  - Mở `ontap-win/App.tsx`.
  - Thêm hàm `startGiamkhaoOnlineExam` và `handleGiamkhaoModeSelect` giống như bản Web.
  - Sửa `handleQuizFinish` để hỗ trợ cờ `isGK` dựa trên `location.pathname`, từ đó điều hướng đúng.
  - Sửa `handleTopNavNavigate`: thêm `case 'giam_khao': navigate('/ontap/giamkhao'); break;`.
  - Truyền `handleGiamkhaoModeSelect={handleGiamkhaoModeSelect}` vào `<AppRoutes>`.

- [ ] **Step 1.3: Cập nhật AppRoutes.tsx (GREEN)**
  - Mở `ontap-win/routes/AppRoutes.tsx`.
  - Import `GiamKhaoSelectionScreen`.
  - Bổ sung type cho props `handleGiamkhaoModeSelect`.
  - Bổ sung block `<Route path="/ontap/giamkhao"...>` tương tự như bản Web.

- [ ] **Step 1.4: Chạy kiểm tra TypeScript (PASS)**
  - Run: `cd ontap-win && npx tsc --noEmit`
  - Expected: PASS

- [ ] **Step 1.5: Build kiểm tra (PASS)**
  - Run: `cd ontap-win && npm run build`
  - Expected: Build thành công không có lỗi.

- [ ] **Step 1.6: Commit**
  - Run: `git add ontap-win/components/GiamKhaoSelectionScreen.tsx ontap-win/App.tsx ontap-win/routes/AppRoutes.tsx`
  - Run: `git commit -m "feat(win): sync giam-khao module from web version"`

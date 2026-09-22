# Danh sách công việc chi tiết (Tasks Checklist)

- [x] **1. Cập nhật types.ts & dataService.ts** (Phase 1)
  - [x] Thêm `displayOrder` vào `License` và `Subject`.
  - [x] Export `naturalSortQuestions` từ `dataService.ts`.
  - Link: [ontap-win/types.ts](file:///d:/Antigravity/TNDNB/ontap-win/types.ts)
  - Link: [ontap-win/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/dataService.ts)

- [x] **2. Cập nhật syncService.ts và Migration** (Phase 2)
  - [x] Thêm `.order` cho subjects vào query Supabase.
  - [x] Dùng `naturalSortQuestions` để sort questions.
  - [x] Sửa `syncData`: gọi `fetchAndSaveQuestions` thay vì `fetchLicenses`.
  - [x] Thêm migration xóa `questions_last_sync` vào `useAppInitialization.ts` để ép user cập nhật DB offline.
  - Link: [ontap-win/services/syncService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/syncService.ts)
  - Link: [ontap-win/hooks/useAppInitialization.ts](file:///d:/Antigravity/TNDNB/ontap-win/hooks/useAppInitialization.ts)

- [x] **3. Cập nhật offlineService.ts và UI** (Phase 3)
  - [x] Sửa `getLicensesOffline` trong `offlineService.ts`: sort theo `displayOrder`.
  - [x] Sửa `AppRoutes.tsx`: filter ẩn bằng ảo theo id `ly-thuyet` và `giam-khao-h2`.
  - Link: [ontap-win/services/offlineService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/offlineService.ts)
  - Link: [ontap-win/routes/AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx)

- [x] **4. Nâng version và Build** (Phase 4)
  - [x] Sửa version trong `package.json`.
  - [x] Gọi `/tndnb-build`.

- [x] **5. Đồng bộ Giám khảo cho Win** (Phase 5)
  - [x] Copy `GiamKhaoSelectionScreen.tsx` từ Web sang Win.
  - [x] Thêm logic định tuyến (`handleGiamkhaoModeSelect`, `startGiamkhaoOnlineExam`, navigation case `giam_khao`) vào `App.tsx`.
  - [x] Cập nhật routes `/ontap/giamkhao` vào `AppRoutes.tsx`.
  - [x] Chạy `npx tsc --noEmit` và `npm run build` kiểm tra.
  - Link: [ontap-win/App.tsx](file:///d:/Antigravity/TNDNB/ontap-win/App.tsx)
  - Link: [ontap-win/routes/AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx)

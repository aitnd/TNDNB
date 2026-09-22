# Phase 4: Khắc phục lỗi bản Electron (Win)

## Mục tiêu
- Kế thừa component ErrorBoundary từ web sang Win để bọc lỗi UI.
- Đồng bộ AlertMarquee Win khớp Web: nuốt lỗi im (không `console.error`), thêm `|| []`.
- Xóa import `Timestamp` thừa.
- Dọn dẹp `console.log` trong Electron Main & Preload process bằng `electron-log`.
- Khắc phục lỗi hiển thị phiên bản `0.0.0` trong bản Win.
- Sửa `productName` mojibake trong `package.json`.

## Các bước thực hiện (TDD Steps)

### T4.1: Copy ErrorBoundary từ web sang win
- Tạo [ErrorBoundary.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ErrorBoundary.tsx) (copy từ web).
- Bọc `TopNavbar` và `AlertMarquee` trong [AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx).

### T4.2: Đồng bộ AlertMarquee Win = Web
- File: [ontap-win/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/AlertMarquee.tsx)
- Xóa `Timestamp` khỏi import dòng 4 (dead import).
- Dòng 19: `setAlerts(data)` → `setAlerts(data || [])`.
- Dòng 21: xóa `console.error(...)`, thay bằng comment im lặng.
- Dòng 44-46, 58-60: xóa tham số `(error)` và `console.error(...)`, thay bằng `() => { setAlerts([]) }`.

### T4.3: Đồng bộ TopNavbar Win = Web
- File: [ontap-win/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/TopNavbar.tsx)
- Dòng 26-28: xóa `console.error(...)`, đổi thành `.catch(() => setLatestVersion('3.19.2'))`.

### T4.4: Dọn dẹp log Electron
- File: [ontap-win/electron/main.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs)
- Thay `console.log` → `log.info` (dùng `electron-log`).
- File: [ontap-win/electron/preload.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/preload.cjs)
- Thay `console.log` → `log.info`.
- Sửa logic fallback version `0.0.0`.

### T4.5: Sửa productName mojibake
- File: [ontap-win/package.json](file:///d:/Antigravity/TNDNB/ontap-win/package.json)
- Ghi lại bằng Python (`json.dump` với `ensure_ascii=False`) để đảm bảo UTF-8 chuẩn.
- Giá trị đúng: `Ôn thi Đường thủy`.

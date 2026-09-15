# Phase 05: Admin Dashboards Integration
Status: ⬜ Pending
Dependencies: Phase 04

## Objective
Tích hợp bảng điều khiển Huy hiệu (`AdminBadgeManager`) vào hai khu vực quản lý của Admin/Giáo viên: Màn hình quản lý tài khoản (`UserManagerScreen` tại `/ontap/usermanager`) và tab Quản lý học viên trong chi tiết lớp học (`StudentsTab`).

## Implementation Steps
1. [ ] **Tích hợp vào `UserManagerScreen.tsx` (Web và Win):**
   - Import `AdminBadgeManager` từ `./Badges/AdminBadgeManager`.
   - Khai báo state quản lý đóng mở modal: `const [showBadgeManager, setShowBadgeManager] = useState(false);` và `const [selectedUserForBadge, setSelectedUserForBadge] = useState<any>(null);`.
   - Tại cột Hành động (Actions) của bảng danh sách tài khoản: Bổ sung một nút biểu tượng Huy hiệu 🏅 (`FaAward` từ `react-icons/fa` hoặc tương đương). Click nút này sẽ gán học viên được chọn và mở modal `AdminBadgeManager`.
   - Render component `<AdminBadgeManager>` ở cuối modal list.
2. [ ] **Tích hợp vào `StudentsTab.tsx` (Web và Win):**
   - Đảm bảo Windows App (`ontap-win/components/ClassDetail/StudentsTab.tsx`) đã import và hiển thị nút huy hiệu đồng nhất với Web App.
   - Thêm nút 🏅 `FaAward` vào cả giao diện Grid và dạng Bảng (Table list view) kế bên các nút sửa thông tin học sinh.

## Files to Create/Modify
- `d:/Antigravity/TNDNB/ontap-web/components/UserManagerScreen.tsx` - [MODIFY] Thêm nút 🏅 mở AdminBadgeManager
- `d:/Antigravity/TNDNB/ontap-web/components/ClassDetail/StudentsTab.tsx` - [MODIFY] Thêm nút 🏅 mở AdminBadgeManager
- `d:/Antigravity/TNDNB/ontap-win/components/ClassDetail/StudentsTab.tsx` - [MODIFY] Đồng bộ nút mở AdminBadgeManager

## Test Criteria
- Đăng nhập tài khoản Admin, truy cập `/ontap/usermanager`. Bấm nút 🏅 ở một học viên bất kỳ ➔ Kiểm tra Modal quản lý huy hiệu mở lên hiển thị đúng danh sách 22 huy hiệu.
- Click "Cấp huy hiệu" hoặc "Thu hồi huy hiệu", sau đó đăng nhập tài khoản học viên đó kiểm tra xem bộ sưu tập huy hiệu có thay đổi tương ứng thời gian thực không.

# Phase 1: Cải thiện UX/UI (Improvements)

Tài liệu này mô tả chi tiết các bước kỹ thuật cần thực hiện cho Phase 1, tuân theo định dạng Bite-Sized Task.

## Task 1: Sửa lỗi UI Dashboard (Padding)

**Vấn đề:** Thanh trạng thái `AdminStatsBar.tsx` bị đè bởi `TopNavbar.tsx`.
**Nguyên nhân:** Component `TopNavbar.tsx` có chiều cao `h-16`, nhưng `Dashboard.tsx` chỉ sử dụng `pt-2` (rất mỏng) cho nội dung chính.

### Step 1.1: Cập nhật padding trong file Dashboard.tsx
- **File:** `ontap-win/components/Dashboard.tsx`
- **Hành động:** Thay đổi class `pt-2` thành `pt-20` hoặc `pt-24` để đẩy nội dung xuống dưới thanh navbar.
- **Code snippet:**
```tsx
// Trước khi sửa (Dòng ~67)
<div className="min-h-screen flex flex-col items-center px-4 pt-2 pb-6 animate-slide-in-right">

// Sau khi sửa
<div className="min-h-screen flex flex-col items-center px-4 pt-24 pb-6 animate-slide-in-right">
```

## Task 2: Cập nhật chức năng tải ngầm ở ChangelogModal

**Vấn đề:** Quá trình tải bản cập nhật dữ liệu (App/Sync Data) chặn luồng tương tác vì người dùng không rõ có thể tắt được không và nếu tắt thì tiến trình tải có dừng lại hay không.
**Giải pháp:** Đưa tiến trình tải xuống chạy ngầm (không phụ thuộc vào lifecycle của Component) và kết hợp với hệ thống Toast Notification để thông báo trạng thái tới người dùng.

### Step 2.1: Chuyển đổi logic tải dữ liệu sang tiến trình ngầm (Background Task)
- **File:** `ontap-win/components/ChangelogModal.tsx` và `ontap-win/services/syncService.ts`
- **Hành động:** Sửa đổi `handleUpdateData` để gọi hàm bất đồng bộ mà không cần chặn giao diện hiện hành, kết hợp thư viện thông báo (ví dụ `react-hot-toast` hoặc hệ thống alert hiện tại).
- **Mô tả logic:**
  - Bắt đầu tiến trình tải, gọi hiển thị thông báo "Đang tải dữ liệu...".
  - Ngay lập tức người dùng có thể đóng Modal.
  - Sau khi Promise hoàn tất, cập nhật `localStorage` và hiển thị thông báo "Tải hoàn tất" hoặc "Lỗi".
- **Code snippet minh họa (ChangelogModal.tsx):**
```tsx
import toast from 'react-hot-toast'; // Giả định hệ thống có thư viện này

const handleUpdateData = () => {
  // Thay đổi trạng thái UI của Modal thành đang tải (nếu người dùng chưa đóng)
  setDataSyncStatus('updating');
  
  // Chạy ngầm tiến trình (không await hàm này ở cấp component)
  toast.promise(fetchAndSaveQuestions(), {
    loading: 'Đang tải dữ liệu câu hỏi mới (chạy ngầm)...',
    success: (success) => {
      if (success) {
        localStorage.setItem('questions_has_update', '0');
        setDataSyncStatus('latest'); // Update state nếu component chưa unmount
        return 'Tải dữ liệu câu hỏi hoàn tất!';
      } else {
        setDataSyncStatus('error');
        throw new Error('Cập nhật thất bại');
      }
    },
    error: 'Tải dữ liệu thất bại. Vui lòng kiểm tra mạng và thử lại.',
  });
  
  // Tuỳ chọn: Có thể tự động đóng modal sau khi bắt đầu tải (onClose())
};
```

### Step 2.2: Tối ưu UI trạng thái nút
- **File:** `ontap-win/components/ChangelogModal.tsx`
- **Hành động:** Đảm bảo khi đang tải (`dataSyncStatus === 'updating'`), nút tải sẽ disable hiển thị "Đang tải ngầm..." và hướng dẫn người dùng rằng họ có thể đóng cửa sổ này.
- **Code snippet:**
```tsx
<button 
  onClick={dataSyncStatus === 'has_update' ? handleUpdateData : handleCheckDataUpdate}
  disabled={dataSyncStatus === 'checking' || dataSyncStatus === 'updating' || dataSyncStatus === 'latest'}
  className="..."
>
  {dataSyncStatus === 'checking' ? 'Đang kiểm tra...' : 
   dataSyncStatus === 'has_update' ? 'Tải ngay' : 
   dataSyncStatus === 'updating' ? 'Đang tải ngầm...' : 'Kiểm tra'}
</button>
{dataSyncStatus === 'updating' && (
  <span className="text-xs text-gray-500 mt-2 block">
    Bạn có thể đóng cửa sổ này. Quá trình tải sẽ tiếp tục chạy ngầm.
  </span>
)}
```

# Kế hoạch: Cải thiện trải nghiệm tải cập nhật ngầm & Sửa lỗi giao diện

## Tổng quan dự án (Project Overview)
Dự án này nhằm giải quyết hai vấn đề chính để cải thiện trải nghiệm người dùng (UX) và giao diện người dùng (UI):
1. **Tải bản cập nhật ngầm:** Hiện tại, modal cập nhật (ChangelogModal) chặn toàn bộ màn hình khi đang tải (cập nhật App / Sync Data), buộc người dùng phải chờ đợi và không thể tương tác với ứng dụng. Mục tiêu là chuyển quá trình này xuống chạy ngầm. Người dùng có thể đóng modal và tiếp tục sử dụng ứng dụng bình thường. Khi quá trình tải hoàn tất, hệ thống sẽ hiển thị một thông báo (Toast/Notification).
2. **Sửa lỗi giao diện (UI) thanh trạng thái bị đè:** Nguyên nhân của lỗi này là do component `TopNavbar.tsx` đang được thiết lập vị trí cố định (`fixed top-0`) với chiều cao `h-16`. Tuy nhiên, trang `Dashboard.tsx` lại chỉ có padding-top là `pt-2`. Điều này dẫn đến việc component `AdminStatsBar.tsx` (thanh thống kê online) nằm ở đầu trang Dashboard bị TopNavbar đè lên, che khuất thông tin. Giải pháp là tăng padding-top của trang Dashboard để tạo đủ không gian.

## Danh sách Giai đoạn (Phases)
- **Phase 1: Cải thiện UX/UI (Phase-01 Improvements)**
  - Tập trung vào việc khắc phục vấn đề giao diện trên Dashboard và triển khai tính năng cập nhật ngầm cho ChangelogModal. Chi tiết các công việc kỹ thuật được mô tả trong tài liệu phase riêng biệt.

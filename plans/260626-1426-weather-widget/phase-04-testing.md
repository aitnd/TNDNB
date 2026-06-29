# Phase 04: Tích hợp & Kiểm thử (Testing)
Status: ⬜ Pending
Dependencies: [Phase 03](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-03-frontend.md)

## Mục tiêu
Kiểm tra hoạt động thực tế của Weather Widget trên môi trường Web và Desktop App, xác thực các kịch bản định vị lỗi và kiểm thử giao diện.

## Yêu cầu kiểm thử
### Thủ công (Manual testing)
- **Kịch bản 1: Cho phép định vị**
  - Người dùng bấm "Allow" khi trình duyệt hỏi quyền vị trí.
  - Kỳ vọng: Widget load dữ liệu thời tiết hiện tại của người dùng.
- **Kịch bản 2: Chặn định vị**
  - Người dùng bấm "Block" hoặc tắt định vị trên thiết bị.
  - Kỳ vọng: Widget load thời tiết mặc định Ninh Bình (`Triệu Việt Vương, Hoa Lư, Ninh Bình`) và hiển thị thông tin chính xác.
- **Kịch bản 3: Không có internet / Lỗi API**
  - Ngắt kết nối mạng hoặc chặn request tới API thời tiết.
  - Kỳ vọng: Widget hiển thị Mock Data thời tiết và hoạt động bình thường, không làm đơ trang Dashboard.
- **Kịch bản 4: Chế độ tối/sáng**
  - Bật tắt Dark Mode.
  - Kỳ vọng: Giao diện chữ và icon tự động đổi màu tương ứng để hiển thị rõ ràng trên nền tối/sáng.

## Các bước thực hiện
1. [ ] Chạy `npm run dev` ở root và kiểm tra trên trình duyệt.
2. [ ] Thử nghiệm tắt/bật quyền vị trí trên Chrome/Edge.
3. [ ] Chạy thử phiên bản Windows App (Electron) qua `npm run electron:dev` (hoặc build thử) để xác nhận widget hoạt động tốt trên bản cài đặt máy tính (sử dụng fallback Ninh Bình).
4. [ ] Khắc phục các lỗi về giao diện, lỗi tràn chữ nếu có trên màn hình nhỏ di động.

## Các file tạo mới/chỉnh sửa
- Không có (Chỉ sửa lỗi phát sinh).

## Tiêu chí nghiệm thu (Test Criteria)
- [ ] Widget hiển thị mượt mà, đầy đủ các thông tin nhiệt độ, icon, địa điểm, lời khuyên.
- [ ] Mọi kịch bản lỗi định vị đều kích hoạt fallback Ninh Bình một cách êm ái, không có lỗi đỏ (error logs) trong Console.
- [ ] Cả bản Web và Bản Win đều tích hợp thành công.

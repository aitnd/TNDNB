# Phase 03: Phát triển UI `WeatherWidget` (Frontend)
Status: ⬜ Pending
Dependencies: [Phase 02](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-02-backend.md)

## Mục tiêu
Tạo component giao diện `WeatherWidget.tsx` hiển thị thời tiết trên đầu Dashboard. Component này sẽ tự động lấy Geolocation của người học và gọi API `/api/weather` để hiển thị thời tiết kèm lời khuyên.

## Yêu cầu
### Trải nghiệm & Giao diện (Aesthetics)
- Thiết kế bo góc mềm mại, đổ bóng nhẹ, hài hòa với giao diện tổng thể của Dashboard.
- Sử dụng hiệu ứng mượt mà khi load (Framer Motion).
- Hiển thị:
  - Icon thời tiết (Nắng, Mưa, Mây...).
  - Nhiệt độ hiện tại + Vị trí (Tên thành phố/phường).
  - Khung văn bản hiển thị **Lời khuyên thông minh** dạng chatbot/alert thân thiện.
  - Phù hợp với chế độ Light Mode & Dark Mode.

### Logic định vị trên Trình duyệt
- Khi component mount:
  - Sử dụng `navigator.geolocation.getCurrentPosition(...)` để lấy tọa độ hiện tại.
  - Nếu thành công → Gửi toạ độ lên API `/api/weather`.
  - Nếu bị chặn (permission denied) hoặc lỗi định vị → Gọi API `/api/weather` không truyền toạ độ (để server tự động sử dụng toạ độ mặc định Hoa Lư, Ninh Bình).

## Các bước thực hiện
1. [ ] Tạo component mới `ontap-web/components/WeatherWidget.tsx`.
2. [ ] Viết logic lấy toạ độ Geolocation và fetch API.
3. [ ] Tích hợp component `WeatherWidget` vào file hiển thị chính của Dashboard (như `DashboardScreen.tsx` hoặc tương đương).
4. [ ] Đồng bộ code component này sang thư mục `ontap-win/components/` để phiên bản Windows App cũng có widget này (fallback trên Windows App sẽ tự động chạy Ninh Bình do Electron thường không cấp quyền Geolocation trình duyệt mặc định).

## Các file tạo mới/chỉnh sửa
- [NEW] `ontap-web/components/WeatherWidget.tsx` - Component thời tiết web.
- [NEW] `ontap-win/components/WeatherWidget.tsx` - Component thời tiết win app.
- [MODIFY] `ontap-web/App.tsx` hoặc Dashboard main component - Import và hiển thị widget.
- [MODIFY] `ontap-win/App.tsx` hoặc Dashboard main component - Import và hiển thị widget.

## Tiêu chí nghiệm thu (Test Criteria)
- [ ] Giao diện widget hiển thị đẹp đẽ, responsive tốt trên cả Mobile và Desktop.
- [ ] Khi cho phép định vị trình duyệt: hiển thị đúng thời tiết nơi đang đứng.
- [ ] Khi bấm "Chặn/Block" định vị trình duyệt: tự động hiển thị thời tiết ở Triệu Việt Vương, Hoa Lư, Ninh Bình kèm lời khuyên chính xác.

---
Next Phase: [Phase 04](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-04-testing.md)

# Phase 01: Cấu hình & Khởi tạo API Router
Status: ✅ Completed
Dependencies: None

## Mục tiêu
Thiết lập các biến môi trường cho Weather API và khởi tạo file skeleton cho endpoint `/api/weather` trong Next.js.

## Yêu cầu
### Kỹ thuật / Cấu hình
- Thêm biến môi trường mẫu trong `.env.example` và `.env.local` nếu cần:
  - `WEATHER_API_KEY` (Key của WeatherAPI.com)
- Tạo file router skeleton tại `app/api/weather/route.ts` xử lý method `POST` hoặc `GET`.

## Các bước thực hiện
1. [x] Cập nhật `.env.example` với biến cấu hình:
   ```env
   WEATHER_API_KEY=your_weather_api_key_here
   ```
2. [x] Tạo file cấu trúc API `app/api/weather/route.ts` trả về một JSON mẫu rỗng để kiểm tra định dạng phản hồi.

## Các file tạo mới/chỉnh sửa
- [NEW] `app/api/weather/route.ts` - Endpoint xử lý thông tin thời tiết.
- [MODIFY] `.env.example` - Khai báo biến môi trường mẫu.

## Tiêu chí nghiệm thu (Test Criteria)
- [x] Chạy lệnh `npm run dev` không báo lỗi.
- [x] Gọi thử `POST http://localhost:3001/api/weather` trả về status `200` và dữ liệu mẫu rỗng thành công.

---
Next Phase: [Phase 02](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-02-backend.md)

# Phase 02: Xây dựng API `/api/weather` (Backend)
Status: ✅ Completed
Dependencies: [Phase 01](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-01-setup.md)

## Mục tiêu
Xây dựng logic đầy đủ cho API `/api/weather` để:
- Nhận toạ độ (`latitude`, `longitude`) từ client.
- Nếu không nhận được toạ độ (Geolocation bị từ chối) → Sử dụng toạ độ mặc định của địa chỉ **Triệu Việt Vương, phường Hoa Lư, Ninh Bình** (`20.2539, 105.9079`).
- Gọi Weather API để lấy thông tin thời tiết thời gian thực.
- Tích hợp **Mock Data fallback** phòng trường hợp máy local không cấu hình `WEATHER_API_KEY` hoặc API gọi bị lỗi để giao diện dev vẫn hiển thị bình thường.
- Phân tích thời tiết và trả về kèm **Lời khuyên (Advice)** tiếng Việt phù hợp.

## Yêu cầu
### Chức năng
- Nhận body JSON chứa: `{ lat: number, lon: number }` (hoặc rỗng).
- Tự động dùng fallback coordinates `20.2539, 105.9079` nếu thiếu hoặc bằng null.
- Thực hiện fetch dữ liệu từ `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&lang=vi`.
- Trả về JSON có cấu trúc sạch sẽ cho client:
  ```json
  {
    "temp": 28.5,
    "condition": "Nhiều mây",
    "icon": "http://...",
    "humidity": 78,
    "advice": "Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸",
    "locationName": "Ninh Bình",
    "isMock": false
  }
  ```

### Bộ logic tạo lời khuyên:
- **Mưa/Bão:** Nếu tình trạng thời tiết (condition text hoặc code) chứa "mưa", "dông", "bão" hoặc "drizzle", "rain", "storm":
  - *"Trời đang có mưa/sắp mưa rồi, bạn ra ngoài nhớ mang theo ô hoặc áo mưa nhé! 🌧️"*
- **Nắng nóng:** Nếu nhiệt độ > 32°C:
  - *"Trời hôm nay khá nắng nóng đó, bạn nhớ uống nhiều nước để tỉnh táo ôn thi nhé! ☀️"*
- **Thời tiết lạnh:** Nếu nhiệt độ < 18°C:
  - *"Thời tiết hôm nay khá lạnh, bạn nhớ giữ ấm cổ để học tập thật tốt nhé! ❄️"*
- **Thời tiết đẹp/mát mẻ (Mặc định):**
  - *"Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸"*

## Các bước thực hiện
1. [x] Cấu trúc code gọi WeatherAPI với fetch/axios trong file `app/api/weather/route.ts`.
2. [x] Viết hàm tính toán lời khuyên (`getWeatherAdvice(temp, conditionText)`).
3. [x] Viết logic Mock Data khi `!process.env.WEATHER_API_KEY`.
4. [x] Xử lý try/catch lỗi mạng và trả về Mock Data dự phòng để bảo vệ runtime.

## Các file tạo mới/chỉnh sửa
- [MODIFY] `app/api/weather/route.ts` - Hoàn thiện API thời tiết.

## Tiêu chí nghiệm thu (Test Criteria)
- [x] Chạy Postman hoặc curl tới `/api/weather` không truyền body:
  - Trả về thời tiết mặc định của Ninh Bình (`locationName` chứa "Ninh Binh" hoặc giả lập tương ứng).
- [x] Gọi API với vị trí cụ thể (ví dụ toạ độ Hà Nội `21.0285, 105.8542`):
  - Trả về thời tiết Hà Nội thành công.
- [x] Khi xoá API Key khỏi env:
  - Trả về mock data kèm `isMock: true` và mã HTTP `200` (không bị crash).

---
Next Phase: [Phase 03](file:///D:/Antigravity/TNDNB/plans/260626-1426-weather-widget/phase-03-frontend.md)

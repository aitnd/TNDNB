# 💡 BRIEF: Weather Widget & Smart Advice

**Ngày tạo:** 2026-06-26
**Tính năng:** Widget Thời tiết động & Gợi ý học tập/đời sống

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- Tăng tính cá nhân hóa và độ sinh động cho trang Dashboard.
- Tạo cảm giác thân thiện, tương tác tốt hơn với người học thông qua các lời khuyên thực tế hàng ngày dựa theo thời tiết thực tế tại địa phương của họ.

## 2. GIẢI PHÁP ĐỀ XUẤT
- Tạo một component `WeatherWidget.tsx` đặt ở vị trí trên cùng của Dashboard (dưới Header, trên các widget thống kê).
- Tự động lấy vị trí hiện tại của người dùng qua trình duyệt (Browser Geolocation).
- Gọi API thời tiết thông qua Next.js Server (để ẩn API key) và trả về thông tin thời tiết (nhiệt độ, tình trạng mưa/nắng/mây).
- Áp dụng bộ lọc logic để đưa ra các câu khuyên bằng tiếng Việt dí dỏm, thân thiện.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Tất cả thành viên** (Khách, Học viên, Giáo viên, Admin) khi truy cập vào Dashboard `/ontap/dashboard`.

## 4. LUỒNG ĐI (USER FLOW) & API THỜI TIẾT
- **API sử dụng:** [WeatherAPI](https://www.weatherapi.com/) hoặc [OpenWeatherMap](https://openweathermap.org/) (được gọi từ `/api/weather`).
- **Luồng hoạt động:**
  1. Trang Dashboard load → Gọi `navigator.geolocation.getCurrentPosition`.
  2. Nếu người dùng cho phép → Gửi `lat, lon` lên `/api/weather`.
  3. Nếu người dùng từ chối/không lấy được vị trí → `/api/weather` tự động nhận diện IP hoặc fallback về thành phố mặc định (Hà Nội).
  4. Server-side `/api/weather` gọi API thật với API Key bảo mật. Nếu không có API Key, tự động chuyển về chế độ Mock Data thời tiết thực tế để dev không bị lỗi.
  5. Trả dữ liệu thời tiết về client → Component hiển thị icon thời tiết sinh động (Nắng, Mưa, Mây, Tuyết) + Nhiệt độ + Lời khuyên thích hợp.

## 5. MẪU LỜI KHUYÊN DỰA TRÊN THỜI TIẾT

| Tình trạng thời tiết | Điều kiện | Lời khuyên |
|-----------------------|-----------|------------|
| **Nắng nóng** | Nhiệt độ > 32°C | "Trời hôm nay khá nắng nóng đó, bạn nhớ uống nhiều nước để tỉnh táo ôn thi nhé! ☀️" |
| **Mát mẻ / Đẹp trời** | Nhiệt độ 20°C - 30°C, không mưa | "Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸" |
| **Trời lạnh** | Nhiệt độ < 18°C | "Thời tiết hôm nay khá lạnh, bạn nhớ giữ ấm cổ để học tập thật tốt nhé! ❄️" |
| **Mưa / Bão** | Có mưa (Rain/Drizzle/Thunderstorm) | "Trời đang có mưa/sắp mưa rồi, bạn ra ngoài nhớ mang theo ô hoặc áo mưa nhé! 🌧️" |

## 6. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình (Cần viết thêm route `/api/weather` ở Next.js và component hiển thị kèm định vị).
- **Rủi ro:** 
  - Trình duyệt chặn quyền định vị (đã có phương án fallback dựa trên IP hoặc default thành phố).
  - Hết hạn/chưa cấu hình API Key thời tiết (đã có phương án tự động giả lập Mock Weather giống như API Analytics).

## 7. BƯỚC TIẾP THEO
→ Chạy `/plan` để lên thiết kế chi tiết (cấu trúc DB nếu cần lưu cấu hình, file details, API endpoints).

# LEARNINGS — [ontap-web]

## 💡 Bài học từ Session hiện tại
1. **Schema RTDB**: Dữ liệu trong Firebase Realtime Database có thể bị thiếu trường (ví dụ `deviceName`), dẫn đến reference error khi render. Luôn sử dụng Optional Chaining.
2. **Proxy Management**: Việc sử dụng Vite Proxy giúp đồng bộ hóa các endpoint API giữa môi trường Dev và Production mà không cần thay đổi code thủ công.
3. **Analytics Integration**: Tích hợp Vercel Analytics vào dự án Vite chỉ cần cài đặt package và bọc `inject()` ở cấp root (`main.tsx`).

## 🛠️ Giải pháp cho lỗi phổ biến
- **Search Crash**: Luôn kiểm tra `null` hoặc `undefined` trước khi gọi `.filter()` hoặc truy cập thuộc tính của object từ API.
- **API 404**: Kiểm tra config proxy trong `vite.config.ts`, đảm bảo target đúng port của Backend Server.

## 🚀 Cải tiến cho n8n (nếu có)
- (Chưa có automation workflow cụ thể trong session này).

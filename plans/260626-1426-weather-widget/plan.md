# Plan: Weather Widget & Smart Advice
Created: 2026-06-26
Status: 🟡 In Progress

## Overview
Tích hợp widget thời tiết kéo dài ở phía trên cùng của Dashboard để hiển thị tình trạng thời tiết tại địa phương của người dùng và đưa ra lời khuyên thiết thực, thân thiện dựa trên thời tiết.

## Yêu cầu đặc biệt (Fallback):
- Tự động lấy toạ độ người dùng qua trình duyệt.
- Nếu người dùng từ chối định vị (Geolocation Denied), hệ thống sẽ sử dụng vị trí mặc định là: **Triệu Việt Vương, phường Hoa Lư, Ninh Bình** (hoặc toạ độ tương ứng `20.2539, 105.9079`).

## Tech Stack
- Backend API: Next.js API Route (`/api/weather`)
- API thời tiết: [WeatherAPI](https://www.weatherapi.com/) hoặc Mock Data trong môi trường Dev/khi thiếu credentials.
- Frontend: React Component (`WeatherWidget.tsx`) với TailwindCSS + Lucide Icons + Framer Motion.

## Các giai đoạn (Phases)

| Phase | Tên giai đoạn | Trạng thái | Tiến độ |
|-------|---------------|------------|---------|
| 01 | Cấu hình & Khởi tạo API Router | ✅ Completed | 100% |
| 02 | Xây dựng API `/api/weather` (Backend) | ✅ Completed | 100% |
| 03 | Phát triển UI `WeatherWidget` (Frontend) | ⬜ Pending | 0% |
| 04 | Tích hợp & Kiểm thử (Testing) | ⬜ Pending | 0% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`

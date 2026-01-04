# Kế hoạch Phát triển Dự án: N8N AI Super Assistant

## Khởi tạo & Lập kế hoạch
- [x] Khám phá cấu trúc và mã nguồn hiện tại <!-- id: 0 -->
- [x] Lập tài liệu mô tả tính năng và luồng người dùng (User Flow) <!-- id: 1 -->
- [x] Lập kế hoạch triển khai chi tiết (Implementation Plan) <!-- id: 2 -->
- [x] Tối ưu hóa tài liệu dự án (Gộp file, dọn dẹp) <!-- id: 3 -->

## Giai đoạn 1: MVP - Khởi tạo Hệ thống (Tuần 1-2)
- [/] Kiểm tra môi trường và cài đặt n8n (Docker/npm) <!-- id: 10 -->
- [x] Tạo Telegram Bot và lấy API Token (Xem SETUP_GUIDE.md) <!-- id: 11 -->
- [x] Cấu hình Google Gemini API (Xem SETUP_GUIDE.md) <!-- id: 12 -->
- [x] Thiết lập Google Sheets (Database) (Xem SETUP_GUIDE.md) <!-- id: 13 -->
- [/] Import và cấu hình Workflow cơ bản (Chatbot Tele) <!-- id: 14 -->
- [ ] Kiểm thử luồng chat cơ bản (Telegram <-> n8n <-> Gemini) <!-- id: 15 -->
- [x] Thiết lập bảo mật API Key (Environment Variables) <!-- id: 16 -->

## Giai đoạn 2: Tự động hóa Sản xuất (Tuần 3-4)
- [ ] Tích hợp TTS (Text-to-Speech) tiếng Việt (Valtec/VieNeu) <!-- id: 20 -->
- [ ] Cài đặt và cấu hình FFmpeg <!-- id: 21 -->
- [ ] Xây dựng Workflow "Planning": Ý tưởng -> Kịch bản <!-- id: 22 -->
- [ ] Xây dựng Workflow "Rendering": Kịch bản -> Video/Ảnh <!-- id: 23 -->
- [ ] Cấu hình Google Drive để lưu trữ thành phẩm <!-- id: 24 -->
- [ ] Kiểm thử quy trình tự động từ Ý tưởng đến File Video <!-- id: 25 -->

## Giai đoạn 3: Tính năng Nâng cao (Tuần 5-6)
- [ ] Tích hợp Google Veo 3 (qua NanoAI API) <!-- id: 30 -->
- [ ] Xây dựng Workflow "Video Remake" (yt-dlp + Whisper + Gemini) <!-- id: 31 -->
- [ ] Xây dựng Workflow "Hot Post Analyzer" (Firecrawl + Gemini) <!-- id: 32 -->
- [ ] Kiểm thử các tính năng nâng cao <!-- id: 33 -->

## Giai đoạn 4: Virtual KOL & Mở rộng (Tuần 7-8)
- [ ] Triển khai quy trình Face Swap (Fal.AI/HeyGen) <!-- id: 40 -->
- [ ] Xây dựng thư viện video mẫu cho KOL <!-- id: 41 -->
- [ ] Tự động đăng bài lên các nền tảng (nếu có API) <!-- id: 42 -->
- [ ] Hoàn thiện và bàn giao hệ thống <!-- id: 43 -->

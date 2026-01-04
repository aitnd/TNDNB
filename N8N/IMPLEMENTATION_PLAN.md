# Kế hoạch Phát triển Dự án: N8N AI Super Assistant

## Mục tiêu Dự án
Xây dựng **"Quản lý Kênh AI"** - một trợ lý ảo thông minh vận hành trên nền tảng n8n, giao tiếp qua Telegram, giúp tự động hóa quy trình sáng tạo và sản xuất nội dung đa phương tiện (video, hình ảnh, bài viết) từ ý tưởng đến đăng tải.

## Mô tả Tính năng & Tương tác Người dùng

### 1. Giao diện Tương tác (Telegram Bot)
Người dùng tương tác với hệ thống hoàn toàn qua Telegram Bot bằng ngôn ngữ tự nhiên.
- **Ra lệnh:** "Làm video về chủ đề AI", "Tạo 5 ý tưởng cho kênh TikTok", "Báo cáo tiến độ tuần này".
- **Phản hồi:** Bot xác nhận yêu cầu, hỏi thêm thông tin nếu thiếu, và báo cáo kết quả kèm link sản phẩm.
- **Duyệt nội dung:** Bot gửi bản nháp (kịch bản, video demo), người dùng bấm nút "Duyệt", "Sửa", hoặc "Hủy".

### 2. Các Tính năng Cốt lõi (Core Features)
| Tính năng | Mô tả chi tiết |
|-----------|----------------|
| **Hội thoại thông minh** | Bot nhớ ngữ cảnh, hiểu các đại từ ("nó", "cái đó"), và tự động đề xuất kênh đăng phù hợp. |
| **Quản lý Ý tưởng** | Người dùng ném ý tưởng thô -> Bot lưu vào hàng đợi (Queue) -> Tự động lên lịch sản xuất. |
| **Tự động Lên kế hoạch** | Từ ý tưởng, AI (Gemini) tự viết kịch bản chi tiết, tiêu đề, caption, hashtags và prompt tạo ảnh/video. |
| **Sản xuất Đa phương tiện** | - **Video Slide:** Tự động ghép ảnh + giọng đọc AI (TTS) + nhạc nền.<br>- **AI Video:** Sử dụng Google Veo 3 để tạo video từ văn bản.<br>- **Hình ảnh:** Tạo ảnh minh họa bài viết bằng AI. |
| **Quản lý Tiến độ** | Theo dõi trạng thái: `NEW` (Mới) -> `PLANNED` (Đã lên lịch) -> `READY` (Đã xong, chờ duyệt) -> `DONE` (Đã đăng). |

### 3. Các Tính năng Nâng cao (Advanced Features)
- **Video Remake:** Gửi link YouTube -> AI tải về, xem, viết lại nội dung mới -> Tạo video mới.
- **Hot Post Analyzer:** Gửi link bài viral -> AI phân tích lý do viral -> Viết bài tương tự hoặc hay hơn.
- **Virtual KOL:** Tạo nhân vật ảo (AI Influencer) với khuôn mặt cố định, tự động đóng video và đăng bài.
- **Face Swap:** Ghép mặt nhân vật ảo vào các video mẫu có sẵn.

---

## Lộ trình Triển khai (Implementation Roadmap)

### Giai đoạn 1: MVP - Khởi tạo Hệ thống (Tuần 1-2)
**Mục tiêu:** Bot hoạt động cơ bản, nhận tin nhắn và lưu ý tưởng.
- [ ] Cài đặt n8n (Self-hosted Docker).
- [ ] Tạo Telegram Bot và kết nối với n8n.
- [ ] Cấu hình Google Gemini API (Bộ não xử lý chính).
- [ ] Thiết lập Google Sheets làm cơ sở dữ liệu (Lưu Users, Ý tưởng, Kênh).
- [ ] Xây dựng Workflow cơ bản: Nhận tin nhắn -> Gemini phân tích -> Phản hồi.

### Giai đoạn 2: Tự động hóa Sản xuất (Tuần 3-4)
**Mục tiêu:** Tự động chuyển đổi từ Ý tưởng sang Video/Bài viết hoàn chỉnh.
- [ ] Tích hợp TTS (Text-to-Speech) tiếng Việt (Valtec/VieNeu).
- [ ] Cài đặt FFmpeg để xử lý video (ghép ảnh, lồng tiếng).
- [ ] Xây dựng Workflow "Planning": `NEW` -> `PLANNED` (Viết kịch bản).
- [ ] Xây dựng Workflow "Rendering": `PLANNED` -> `READY` (Tạo video/ảnh).
- [ ] Tự động upload thành phẩm lên Google Drive.

### Giai đoạn 3: Tính năng Nâng cao (Tuần 5-6)
**Mục tiêu:** Tích hợp các công cụ AI mạnh mẽ hơn.
- [ ] Tích hợp Google Veo 3 (qua NanoAI) để tạo video chất lượng cao.
- [ ] Xây dựng Workflow "Video Remake" (Sử dụng yt-dlp, Whisper).
- [ ] Xây dựng Workflow "Hot Post Analyzer" (Sử dụng Firecrawl).

### Giai đoạn 4: Virtual KOL & Mở rộng (Tuần 7-8)
**Mục tiêu:** Xây dựng nhân vật ảo và tự động đăng bài.
- [ ] Triển khai quy trình Face Swap (Fal.AI/HeyGen).
- [ ] Xây dựng thư viện video mẫu cho KOL.
- [ ] Tự động đăng bài lên YouTube/TikTok/Facebook (nếu API cho phép).

---

## Kế hoạch Kiểm thử (Verification Plan)

### Kiểm thử Tự động (Automated Testing)
- Sử dụng các node "Test" trong n8n để giả lập tin nhắn từ Telegram.
- Kiểm tra đầu ra JSON của các node AI (Gemini) để đảm bảo đúng định dạng.

### Kiểm thử Thủ công (Manual Verification)
1. **Chat với Bot:**
   - Gửi: "Làm video về chủ đề Mèo" -> Kiểm tra xem có dòng mới trong Google Sheet không.
   - Gửi: "Xem tiến độ" -> Kiểm tra phản hồi của Bot.
2. **Kiểm tra Sản phẩm:**
   - Mở Google Drive kiểm tra video được tạo ra có đúng kịch bản và có âm thanh không.
3. **Kiểm tra Quy trình Nâng cao:**
   - Gửi link YouTube và yêu cầu Remake -> Chờ và kiểm tra video kết quả.

## Yêu cầu Người dùng Phê duyệt
- [ ] Xác nhận lộ trình 4 giai đoạn trên.
- [ ] Cung cấp các API Key cần thiết (Telegram, Gemini, NanoAI, Fal.AI...) khi đến giai đoạn tương ứng.

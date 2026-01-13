# 📋 N8N AI Super Assistant - Checklist Tổng Hợp

> **Mục đích:** Theo dõi tiến độ triển khai hệ thống AI Super Assistant trên n8n
> **Cập nhật:** 2026-01-13
> 
> **Tầm nhìn:** Xây dựng "Quản lý Kênh AI" - trợ lý thông minh qua Telegram:
> - 🧠 Hiểu ngôn ngữ tự nhiên, ghi nhớ ngữ cảnh
> - 📝 Tự động lên kế hoạch nội dung
> - 🎬 Tự động sản xuất video/ảnh
> - 📊 Theo dõi và báo cáo tiến độ
> - 🤖 Tạo & vận hành Virtual KOL

---

## ⚠️ HƯỚNG DẪN QUAN TRỌNG - CLOUDFLARE TUNNEL

> **Mỗi lần bật máy hoặc đổi máy, cần thực hiện các bước sau:**

### Bước 1: Khởi động Cloudflare Tunnel
```powershell
cloudflared tunnel --url http://localhost:5888
```
→ Ghi lại URL mới (ví dụ: `https://xxx-xxx.trycloudflare.com`)

### Bước 2: Restart n8n với URL mới
```powershell
docker stop n8n-atom
docker rm n8n-atom
docker run -d --name n8n-atom -p 5888:5888 `
  -e WEBHOOK_URL=https://xxx-xxx.trycloudflare.com `
  -v C:/n8n_data:/home/node/.n8n `
  atom8n/n8n:fork
```

### Bước 3: Cập nhật Google Cloud Console (nếu dùng OAuth)
1. Mở: https://console.cloud.google.com/apis/credentials
2. Sửa **Authorized redirect URIs** thành:
   ```
   https://xxx-xxx.trycloudflare.com/rest/oauth2-credential/callback
   ```

### Bước 4: Cập nhật Facebook Webhook (nếu cần)
1. Mở: https://developers.facebook.com/apps → App → Webhooks
2. Sửa Callback URL thành URL mới

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
┌────────────────────────────────────────────────────────────────────────┐
│                    📝 GOOGLE SHEETS - CONTENT QUEUE                     │
│                    (Kho chứa nội dung chờ đăng)                         │
└────────────────────────────────────────────────────────────────────────┘
        ▲                    ▲                    ▲              │
        │                    │                    │              │
   [GHI VÀO]            [GHI VÀO]            [GHI VÀO]      [ĐỌC RA]
        │                    │                    │              │
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  WF 2: Trend  │  │ WF 4: Content │  │ WF 5: Affiliate│  │ WF 1: Social  │
│    Hunter     │  │   Generator   │  │     Bot       │  │   Publisher   │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
   Schedule 6h       Telegram Bot        Schedule          Schedule tối ưu
                                                          (8h, 12h, 18h, 21h)
```

**Thời gian đăng tối ưu (SEO Facebook VN):** 08:00, 12:00, 18:00, 21:00

---

## 📊 TIẾN ĐỘ TỔNG QUAN

| Giai đoạn | Tên | Trạng thái | % |
|-----------|-----|------------|---|
| 1 | Foundation & Setup | ✅ Xong | 100% |
| 2 | Content Queue (Sheets) | 🔄 Đang làm | 50% |
| 3 | Social Publisher | 🔄 Đang làm | 20% |
| 4 | Trend Hunter | ✅ Gần xong | 90% |
| 5 | Auto Responder + Content | ✅ Xong | 100% |
| 6 | Affiliate Bot | ⏳ Chờ | 0% |
| 7 | Content Engine (Video) | ⏳ Chờ | 0% |
| 8 | Virtual KOL | ⏳ Chờ | 0% |

**Tổng tiến độ: ~50%**

---

## ✅ PHASE 1: Foundation (XONG)

- [x] Cài đặt n8n Docker (n8n-atom fork, port 5888)
- [x] Tạo n8n API key + MCP config
- [x] Cài n8n Atom 3.0 extension
- [x] Tạo Telegram Bot + lấy API Token
- [x] Cấu hình Google Gemini API
- [x] Thiết lập Google Sheets (Database)
- [x] Tài liệu: `API_SETUP_GUIDE.md`, `N8N_CONTROL_METHODS.md`

---

## 🔄 PHASE 2: Content Queue (ĐANG LÀM)

### 2.1 Google Sheets "Content Queue"
- [x] Tạo sheet với cấu trúc chuẩn
- [x] URL: `https://docs.google.com/spreadsheets/d/1xesgKfwuPPhPIN6L9GA1qIitcyEPQPEGjziGX0Y47sE/edit`
- [ ] Kết nối n8n với Sheets (OAuth credential)

### Cấu trúc cột:
| Cột | Mô tả |
|-----|-------|
| ID | POST_YYYYMMDD_XXX |
| Timestamp | Thời gian tạo |
| Source | Trend_Hunter, Content_Gen, Manual |
| Content_Type | text, image, video |
| Text_Content | Nội dung bài viết |
| Media_URL | Link Google Drive |
| Hashtags | Hashtag |
| Scheduled_Time | Giờ đăng dự kiến |
| Platform | Facebook, Telegram, All |
| Status | pending, ready, published, failed |
| Published_At | Thời gian đăng thực tế |
| Post_ID | ID bài đăng |

---

## 🔄 PHASE 3: Social Publisher (ĐANG LÀM)

### Workflow `1.Social Publisher - Facebook` (v2)
- [ ] Thêm Schedule Trigger (4 lần/ngày)
- [ ] Thêm Google Sheets Read
- [ ] Thêm Filter (status=ready)
- [ ] Thêm Switch (text/image/video)
- [ ] Thêm Facebook Post API
- [ ] Thêm Error Handler
- [ ] Test và Activate

### Credentials
- [x] Facebook Page Token (permanent)
- [ ] Google Sheets OAuth

---

## ✅ PHASE 4: Trend Hunter (90%)

### Workflow `2.Trend Hunter - YouTube`
- [x] Import workflow + Sub-workflow
- [x] Cấu hình YouTube OAuth2 + Gemini API
- [x] Test AI Agent gọi tool youtube_search
- [ ] Thêm node ghi vào Content Queue
- [ ] Cấu hình Schedule trigger (6h/lần)

---

## ✅ PHASE 5: Auto Responder & Content (XONG)

### Workflow `3.Auto Responder - Facebook`
- [x] Đổi OpenAI → Gemini
- [x] Cấu hình webhook (Cloudflare Tunnel)
- [x] Workflow active

### Workflow `4.Content Generator - Telegram`
- [x] Tích hợp Google Trends + Gemini AI
- [x] Lưu log vào Sheets
- [x] Workflow active
- [ ] Sửa ghi vào Content Queue

---

## ⏳ PHASE 6: Affiliate Bot (CHỜ)

- [ ] Đăng ký Shopee Affiliate
- [ ] Tạo workflow auto gắn link affiliate
- [ ] Ghi vào Content Queue

---

## ⏳ PHASE 7: Content Engine (CHỜ)

- [ ] Tích hợp TTS tiếng Việt (Valtec/VieNeu)
- [ ] Cài đặt FFmpeg
- [ ] Workflow "Planning": Ý tưởng → Kịch bản
- [ ] Workflow "Rendering": Kịch bản → Video
- [ ] Kết nối Google Veo 3 (NanoAI API)
- [ ] Workflow "Video Remake" (yt-dlp + Whisper + Gemini)
- [ ] Workflow "Hot Post Analyzer" (Firecrawl + Gemini)

---

## ⏳ PHASE 8: Virtual KOL (CHỜ)

- [ ] Triển khai Face Swap (Fal.AI/HeyGen)
- [ ] Xây dựng thư viện video mẫu
- [ ] Tự động đăng bài lên các nền tảng
- [ ] Hoàn thiện và bàn giao

---

## 🔧 BƯỚC TIẾP THEO

1. [ ] Hoàn thành Google Sheets OAuth credential
2. [ ] Thiết kế lại WF 1 (Social Publisher)
3. [ ] Cập nhật các WF khác ghi vào Content Queue
4. [ ] Test toàn bộ luồng end-to-end

---

## 📚 CÔNG CỤ & DỊCH VỤ

| Loại | Công cụ | Ghi chú |
|------|---------|---------|
| AI | Gemini 2.0 Flash | Miễn phí |
| TTS | Valtec/VieNeu | Tiếng Việt |
| Video | Veo 3 + FFmpeg | NanoAI API |
| Database | Google Sheets | Content Queue |
| Storage | Google Drive | Media files |
| Social | Facebook, Telegram | API integration |

---

*Ghi chú: [x] hoàn thành, [/] đang làm, [ ] chưa làm*
*Cập nhật: 2026-01-13 08:20*

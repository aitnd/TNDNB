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

## 🏗️ KIẾN TRÚC HỆ THỐNG (MULTI-CHANNEL + MULTI-ACCOUNT)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    📱 TELEGRAM BOT (Trung tâm điều khiển)            │
│              Input: Text / Ảnh / Video / Link YouTube-TikTok         │
└─────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────┐
│                         🧠 N8N BRAIN (AI Gemini)                     │
│           Channel Manager + Content Generator + Affiliate            │
└─────────────────────────────────────────────────────────────────────┘
           ↓                        ↓                        ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 📊 CHANNEL       │  │ 📝 CONTENT       │  │ 👤 ACCOUNT       │
│    CONFIG        │  │    QUEUE         │  │    MANAGER       │
│ (Cấu hình kênh)  │  │ (Hàng đợi)       │  │ (Đa tài khoản)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    📢 MULTI-PLATFORM PUBLISHER                       │
│  FB_PAGE_01 | FB_PAGE_02 | YT_CHANNEL_01 | IG_01 | TIKTOK_01 ...    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📺 NHÓM KÊNH (CHANNEL GROUPS)

| Nhóm | Nền tảng | Niche | Content Type | Quota/Tuần |
|------|----------|-------|--------------|------------|
| **GROUP_01** | FB, YT, IG, TikTok | Thời trang, Mỹ phẩm | Video ngắn, Ảnh, Review | 2 video, 3 bài |
| **GROUP_02** | YouTube | Podcast, Sách nói | Audio, Truyện đọc | 3 video/tuần |
| *(thêm sau)* | ... | ... | ... | ... |

---

## 📱 GIAO DIỆN TELEGRAM (TRUNG TÂM ĐIỀU KHIỂN)

> **Giao tiếp qua: Text / Ảnh / Video / Link**

### Các loại input hỗ trợ:
| Loại | Ví dụ |
|------|-------|
| **Text** | "Review son mới cho kênh thời trang" |
| **Ảnh** | Gửi ảnh sản phẩm + caption |
| **Video** | Gửi video + yêu cầu edit |
| **Link** | Link TikTok/YouTube để remake |

### Telegram Commands:
| Lệnh | Mô tả |
|------|-------|
| `/new [text]` | Tạo content mới |
| `/topic [link]` | Lấy ý tưởng từ link |
| `/status` | Xem quota & tiến độ |
| `/groups` | Danh sách nhóm kênh |
| `/pause [group]` | Tạm dừng nhóm |
| `/report` | Báo cáo tuần |

---

## 🔄 CHẾ ĐỘ HOẠT ĐỘNG

### 1. Auto Mode (Tự động)
- Kiểm tra quota tuần của từng nhóm
- Tìm trend theo niche
- AI tạo content + gắn affiliate
- Đăng bài vào giờ vàng

### 2. Manual Mode (Thủ công)
- User gửi yêu cầu qua Telegram
- AI xử lý và tạo content
- User duyệt (optional)
- Đăng bài theo lịch

---

## 💰 AFFILIATE INTEGRATION

| Nền tảng | Cách gắn link |
|----------|---------------|
| **Facebook** | Link trong bài + comment đầu |
| **Instagram** | Link in bio + caption |
| **YouTube** | Description + pinned comment |
| **TikTok** | Sản phẩm giỏ hàng TikTok Shop |

## 📊 TIẾN ĐỘ TỔNG QUAN

### 6 Workflow chính:
| WF | Tên | Mô tả | Trạng thái |
|----|-----|-------|------------|
| **WF1** | Social Publisher | Đăng bài đa nền tảng (Schedule) | 🔄 20% |
| **WF2** | Trend Hunter | Tìm xu hướng + auto tạo content | ✅ 90% |
| **WF3** | Content Manager | Telegram + Channel + Multi-Input | 🔄 60% |
| **WF4** | Auto Responder | Trả lời comment/message tự động | ✅ 100% |
| **WF5** | Affiliate Bot | Quản lý link Shopee/Lazada/TikTok | ⏳ 0% |
| **WF6** | Content Engine | Tạo video/audio từ AI (Veo3, TTS) | ⏳ 0% |

**Tổng tiến độ: ~45%**

---

## ✅ PHASE 1: Foundation (XONG)

- [x] Cài đặt n8n Docker (n8n-atom fork, port 5888)
- [x] Tạo n8n API key + MCP config
- [x] Cài n8n Atom 3.0 extension
- [x] Tạo Telegram Bot + lấy API Token
- [x] Cấu hình Google Gemini API
- [x] Thiết lập Google Sheets (Database)
- [x] Tài liệu: `API_SETUP_GUIDE.md`, `N8N_CONTROL_METHODS.md`

### 🐧 Ubuntu Machine (01/2026)
- [x] Cài đặt Docker Engine + autostart
- [x] Cài đặt n8n v2.3.5 container (port 5678) + autostart
- [x] Cài đặt Cloudflared v2025.11.1 + systemd autostart
- [x] Tạo user admin (admin@tndnb.com)
- [x] Tạo API key cho MCP
- [x] Import 6 workflows từ file JSON


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

## 🔧 BƯỚC TIẾP THEO (THEO THỨ TỰ)

### Bước 1: Hoàn thành Google Sheets OAuth
- [x] Tạo OAuth credential thủ công trong n8n
- [ ] Test đọc/ghi Sheets từ n8n

### Bước 2: Hoàn thiện WF1 - Social Publisher
- [ ] Thêm Schedule Trigger (8h, 12h, 18h, 21h)
- [ ] Thêm Google Sheets Read (filter status=ready)
- [ ] Thêm Switch node (phân loại platform)
- [ ] Thêm HTTP Request gọi WF5 lấy Affiliate Link
- [ ] Thêm Facebook Post API
- [ ] Thêm Update Sheets (status=published)
- [ ] Thêm Telegram Notify
- [ ] Test và Activate
- [ ] **Export JSON**: `N8N/1.Social Publisher.json`

### Bước 3: Hoàn thiện WF2 - Trend Hunter
- [ ] Thêm kiểm tra quota từ Channel Config
- [ ] Thêm ghi vào Content Queue
- [ ] Test và Activate
- [ ] **Export JSON**: `N8N/2.Trend Hunter.json`

### Bước 4: Mở rộng WF3 - Content Manager
- [ ] Thêm xử lý commands: /groups, /status, /pause, /config
- [ ] Thêm Gemini Vision (xử lý ảnh)
- [ ] Thêm YouTube/TikTok scraper (xử lý link)
- [ ] Thêm ghi vào Content Queue
- [ ] Test và Activate
- [ ] **Export JSON**: `N8N/3.Content Manager.json`

### Bước 5: Giữ nguyên WF4 - Auto Responder
- [x] Workflow đã hoạt động
- [ ] Thêm tích hợp WF5 (Affiliate)
- [ ] **Export JSON**: `N8N/4.Auto Responder.json`

### Bước 6: Xây dựng WF5 - Affiliate Bot (MỚI)
- [ ] Tạo sheet Affiliate Database
- [ ] Workflow crawl Shopee/Lazada bestseller
- [ ] Workflow match + generate link
- [ ] API endpoint cho các WF khác gọi
- [ ] Test và Activate
- [ ] **Export JSON**: `N8N/5.Affiliate Bot.json`

### Bước 7: Xây dựng WF6 - Content Engine (MỚI)
- [ ] Tích hợp TTS tiếng Việt (Valtec)
- [ ] Tích hợp Veo 3 (NanoAI API)
- [ ] Cài đặt FFmpeg
- [ ] Workflow tạo video ngắn
- [ ] Workflow tạo podcast/audiobook
- [ ] Workflow Video Remake
- [ ] Test và Activate
- [ ] **Export JSON**: `N8N/6.Content Engine.json`

---

## ⚠️ QUY TẮC QUAN TRỌNG

### Sau khi hoàn thành mỗi Workflow:
1. ✅ Test đầy đủ
2. ✅ Activate workflow
3. ✅ **Export JSON** vào thư mục `N8N/`
4. ✅ Cập nhật checklist trong file này
5. ✅ Tạo lại infographic nếu có thay đổi lớn

### Vị trí file JSON:
```
E:\TNDNB\N8N\
├── 1.Social Publisher.json    ← WF1
├── 2.Trend Hunter.json        ← WF2
├── 3.Content Manager.json     ← WF3
├── 4.Auto Responder.json      ← WF4
├── 5.Affiliate Bot.json       ← WF5
└── 6.Content Engine.json      ← WF6
```

---

## 📚 CÔNG CỤ & DỊCH VỤ

| Loại | Công cụ | Ghi chú |
|------|---------|---------|
| AI | Gemini 2.0 Flash | Miễn phí |
| TTS | Valtec/VieNeu | Tiếng Việt |
| Video | Veo 3 + FFmpeg | NanoAI API |
| Database | Google Sheets | Content Queue + Channel Config + Account Manager |
| Storage | Google Drive | Media files |
| Affiliate | Shopee/Lazada/TikTok Shop | Auto link |
| Social | Facebook, YouTube, Instagram, TikTok | Multi-platform |

---

## 🎬 HYBRID VIDEO PROCESSING (WF6)

### Phương án: Client-Side + Serverless APIs

```
User Upload → ffmpeg.wasm → Extract Audio → Whisper API → Translation → Generate SRT → Burn Subtitles → Download
```

| Component | Service | Cost |
|-----------|---------|------|
| Audio Extraction | ffmpeg.wasm (client-side) | FREE |
| Speech-to-Text | Replicate/Groq Whisper | ~$0.003/phút |
| Translation | deep-translator (browser) | FREE |
| Video Render | ffmpeg.wasm (client-side) | FREE |
| Storage | Browser Memory | FREE |

### Ưu điểm:
- ✅ Phần lớn xử lý trên browser → ít chi phí
- ✅ Không cần backend phức tạp
- ✅ Privacy-friendly (video không upload lên server)
- ✅ Dễ deploy Vercel (chỉ cần static site + 1 API route)

### Nhược điểm:
- ⚠️ Phụ thuộc vào máy client (RAM, CPU)
- ⚠️ Chậm hơn trên thiết bị yếu
- ⚠️ Cần API key cho Whisper (dùng Groq free hoặc Replicate)

### Tích hợp n8n:
- WF6 gọi API endpoint `/api/process-video`
- Frontend xử lý video với ffmpeg.wasm
- Kết quả upload lên Google Drive → lưu URL vào Content Queue

---

## 🔮 CÔNG CỤ TRIỂN KHAI TRONG TƯƠNG LAI

| Công cụ | Mô tả | Link |
|---------|-------|------|
| **ClawdBot** | AI Assistant cá nhân đa kênh (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams). Chạy local, có Voice Wake, Live Canvas. | [GitHub](https://github.com/clawdbot/clawdbot) |
| **ffmpeg.wasm** | FFmpeg chạy trong browser để xử lý video client-side | [GitHub](https://github.com/ffmpegwasm/ffmpeg.wasm) |
| **Groq Whisper** | Speech-to-Text API nhanh, miễn phí tier | [Groq](https://console.groq.com) |

---

*Ghi chú: `[x]` hoàn thành, `[/]` đang làm, `[ ]` chưa làm*
*Cập nhật: 2026-01-14 22:55*

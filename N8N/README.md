# 🤖 N8N AI SUPER ASSISTANT - TÀI LIỆU TỔNG HỢP

> Tài liệu này tổng hợp toàn bộ thông tin về hệ thống, chức năng, công cụ và hướng dẫn sử dụng.

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Chức năng & Cách hoạt động](#2-chức-năng--cách-hoạt-động)
3. [Công cụ & Dịch vụ](#3-công-cụ--dịch-vụ)
4. [Chức năng nâng cao](#4-chức-năng-nâng-cao)
5. [Kiến trúc tổng thể](#5-kiến-trúc-tổng-thể)
6. [🆕 n8n-MCP Antigravity Integration](#6-n8n-mcp-antigravity-integration)
7. [🖥️ Kế hoạch phần cứng](HARDWARE_PLAN.md)

---

## 1. TỔNG QUAN HỆ THỐNG

### Tầm nhìn
Xây dựng **"Quản lý Kênh AI"** - một trợ lý thông minh qua Telegram:
- 🧠 Hiểu ngôn ngữ tự nhiên, ghi nhớ ngữ cảnh
- 📝 Tự động lên kế hoạch nội dung
- 🎬 Tự động sản xuất video/ảnh
- 📊 Theo dõi và báo cáo tiến độ
- 🤖 Tạo & vận hành Virtual KOL
- 🔧 **Quản lý workflows qua AI Agent (Antigravity)**

### Nền tảng chính
- **n8n** (self-hosted Docker) - Điều phối workflow
- **Telegram Bot** - Giao tiếp với người dùng
- **Google Gemini** - Bộ não AI (miễn phí)
- **n8n-MCP** - Tích hợp AI Agent để quản lý n8n

---

## 2. CHỨC NĂNG & CÁCH HOẠT ĐỘNG

### Các chức năng chính

| # | Chức năng | Mô tả |
|---|-----------|-------|
| 1 | **Hội thoại thông minh** | Hiểu ngôn ngữ tự nhiên, nhớ ngữ cảnh, hỏi lại khi cần |
| 2 | **Tạo ý tưởng nội dung** | "làm 5 video về AI" → thêm vào queue |
| 3 | **Suy luận kênh đăng** | Tự đề xuất kênh phù hợp với nội dung |
| 4 | **Xem tiến độ** | Status: NEW → PLANNED → READY → DONE |
| 5 | **Tìm & quản lý** | Tìm, sửa, xóa, đổi lịch nội dung |
| 6 | **Auto lên kế hoạch** | AI viết kịch bản, title, caption, hashtags |
| 7 | **Auto sản xuất** | TTS + Render ảnh/video |
| 8 | **Phê duyệt** | Duyệt trước khi đăng (tùy chọn) |
| 9 | **Báo cáo** | Thống kê tuần/tháng |
| 10 | **Cấu hình kênh** | Thêm/sửa thông tin kênh |

### Ví dụ tương tác Telegram

```
👤 Bạn: làm video về n8n đi

🤖 Bot: Em hiểu rồi! Bạn muốn tạo video về n8n. 
Em đề xuất đăng lên kênh "N8N Vietnam". Bạn đồng ý không?

👤 Bạn: ok

🤖 Bot: ✅ Đã thêm vào hàng đợi!
• Chủ đề: Hướng dẫn n8n
• Kênh: N8N Vietnam
• Trạng thái: NEW
Em sẽ lên kế hoạch trong 1 giờ.
```

---

## 3. CÔNG CỤ & DỊCH VỤ

### 3.1 AI / LLM
- **Google Gemini 2.0 Flash**: Bộ não chính (Miễn phí)
- **Gemini Vision**: Phân tích hình ảnh

### 3.2 TTS - Text to Speech (Tiếng Việt)
- **Valtec-TTS**: Local, miễn phí, 2 giọng nam/nữ
- **VieNeu-TTS**: Voice cloning

### 3.3 Video Generation
- **Google Veo 3**: Tạo video từ text (qua NanoAI API)
- **FFmpeg**: Cắt ghép, xử lý video local

### 3.4 Database & Storage
- **Google Sheets**: Database đơn giản (Accounts, Memory, Content)
- **Google Drive**: Lưu trữ file media

---

## 4. CHỨC NĂNG NÂNG CAO

### 4.1 Video Remake
Lấy video từ link YouTube -> Transcribe -> Viết lại nội dung -> Tạo video mới.

### 4.2 Hot Post Analyzer
Phân tích bài viết viral -> Tìm ra công thức thành công -> Viết bài tương tự hoặc chuyên sâu hơn.

### 4.3 Virtual KOL
Tạo nhân vật ảo (AI Influencer) với khuôn mặt cố định, tự động đóng video và đăng bài.
- **Face Swap**: Sử dụng Fal.AI (WAN, Kling) để ghép mặt AI vào video mẫu.

### 4.4 AI Video Gen (Veo 3)
Tạo video chất lượng cao từ text prompt, tự động bypass reCaptcha.

---

## 5. KIẾN TRÚC TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NGƯỜI DÙNG                                      │
│                            (Telegram Bot)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                               N8N BRAIN                                      │
│            (Workflow điều phối trung tâm - Docker localhost:5678)            │
└─────────────────────────────────────────────────────────────────────────────┘
         │              │              │              │              │
         ↓              ↓              ↓              ↓              ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   GEMINI    │ │   LOCAL     │ │  DATABASE   │ │   STORAGE   │ │   SOCIAL    │
│    (AI)     │ │   TOOLS     │ │             │ │             │ │             │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ • Gemini    │ │ • FFmpeg    │ │ • Sheets    │ │ • Drive     │ │ • YouTube   │
│ • Veo 3    │ │ • TTS       │ │ • Firebase  │ │ • R2        │ │ • TikTok    │
│ • Vision   │ │ • Whisper   │ │ • Supabase  │ │             │ │ • Facebook  │
│             │ │ • OCR       │ │             │ │             │ │ • Instagram │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

> **Lưu ý:** Để xem chi tiết hướng dẫn cài đặt, vui lòng xem file `SETUP_GUIDE.md` (nếu có) hoặc tham khảo Implementation Plan.

---

## 6. 🆕 N8N-MCP ANTIGRAVITY INTEGRATION

> **Cập nhật 05/01/2026**: Đã tích hợp n8n-MCP để AI Agent (Antigravity) có thể quản lý n8n workflows.

### Tính năng mới
- ✅ Tạo/Sửa/Xóa workflows từ AI Agent
- ✅ Deploy templates từ 2700+ templates trên n8n.io
- ✅ Validate & Auto-fix workflows
- ✅ Test/Trigger workflows
- ✅ Quản lý executions và debug lỗi

### Các file liên quan
| File | Mô tả |
|------|-------|
| `mcp_config_template.json` | Template cấu hình MCP server cho Antigravity |
| `/AGENTS.md` | System instructions cho AI agent |
| `IMPLEMENTATION_PLAN.md` | Chi tiết kế hoạch và hướng dẫn setup trên máy mới |
| `task.md` | Checklist tiến độ dự án |

### Quick Setup trên máy mới
```bash
# 1. Cài n8n-mcp
npm install -g n8n-mcp

# 2. Copy config
# Copy mcp_config_template.json → C:\Users\<USER>\.gemini\antigravity\mcp_config.json

# 3. Cài n8n (Docker)
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# 4. Tạo API Key: localhost:5678 → Settings → n8n API → Create

# 5. Cập nhật N8N_API_KEY trong mcp_config.json

# 6. Refresh MCP Servers trong Antigravity
```

### Tham khảo
- [n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)
- [Antigravity Setup Guide](https://github.com/czlonkowski/n8n-mcp/blob/main/docs/ANTIGRAVITY_SETUP.md)


# 🚀 HỆ THỐNG N8N MMO AUTOMATION

## Mục Tiêu

Xây dựng hệ thống **tự động hoàn toàn** để kiếm tiền từ các kênh MMO:
- Auto chăm sóc & phát triển Social Media (Facebook, TikTok, YouTube)
- Auto tạo nội dung từ chủ đề hot
- Auto trả lời comment + gắn link affiliate Shopee
- Auto xào nấu nội dung từ đối thủ

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TELEGRAM BOT (Điều khiển)                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                            N8N BRAIN                                 │
│                      (localhost:5678)                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Content   │ │   Social    │ │    Auto     │ │  Affiliate  │   │
│  │   Engine    │ │  Publisher  │ │  Responder  │ │     Bot     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐                                    │
│  │    Trend    │ │   Content   │                                    │
│  │   Hunter    │ │   Spinner   │                                    │
│  └─────────────┘ └─────────────┘                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 6 Module Chính

| Module | Chức năng | Trạng thái |
|--------|-----------|------------|
| **Content Engine** | Tạo nội dung (bài, ảnh, video) | 🔲 Chưa làm |
| **Social Publisher** | Đăng bài lên FB/TikTok/YouTube | 🔲 Đang làm |
| **Auto Responder** | Trả lời comment tự động | 🔲 Chưa làm |
| **Affiliate Bot** | Gắn link Shopee vào comment | 🔲 Chưa làm |
| **Trend Hunter** | Lấy chủ đề hot | 🔲 Chưa làm |
| **Content Spinner** | Xào nấu nội dung đối thủ | 🔲 Chưa làm |

---

## 🗓️ Lộ Trình

| Giai đoạn | Thời gian | Nội dung | Trạng thái |
|-----------|-----------|----------|------------|
| 1. Foundation | Tuần 1-2 | n8n + Telegram Bot + DB | ✅ Xong |
| 2. Social Publisher | Tuần 3-4 | Đăng bài FB/TikTok/YT | 🔄 Đang làm |
| 3. Content Engine | Tuần 5-6 | Trend + Spinner + AI Video | 🔲 |
| 4. Monetization | Tuần 7-8 | Auto Reply + Affiliate | 🔲 |

---

## 📁 Workflow Files

| File | Module | Mô tả |
|------|--------|-------|
| `Automation Facebook.json` | Social Publisher | Đăng bài FB (Image/Carousel/Reel) |
| `chatbot facebook.json` | Auto Responder | Chatbot trả lời inbox FB |
| `chatbot tele.json` | Control | Telegram Bot điều khiển |
| `xu hướng YouTube.json` | Trend Hunter | Lấy video trending YT |

---

## 🔧 API Keys Cần Có

- [ ] Facebook Page Access Token
- [ ] Telegram Bot Token
- [ ] Google Gemini API Key
- [ ] Shopee Affiliate ID (tùy chọn)

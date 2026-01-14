# Hướng Dẫn Chạy n8n Local với Cloudflare Tunnel

> Tài liệu này hướng dẫn cách chạy n8n trên máy local và expose ra internet để nhận webhook từ Facebook, Telegram, etc.

## Tổng Quan Kiến Trúc

```
Facebook/Telegram --> Cloudflare Tunnel (Public URL) --> localhost:5888 --> n8n Docker
```

---

## 1. Cài Đặt n8n (Docker)

### Lệnh chạy n8n-atom (khuyến nghị)
```powershell
docker run -d --name n8n-atom -p 5888:5678 -v C:/n8n_data:/home/node/.n8n atom8n/n8n:fork
```

### Kiểm tra n8n đang chạy
```powershell
docker ps | findstr n8n
```

### Truy cập n8n
- URL: `http://localhost:5888`
- Dữ liệu lưu tại: `C:/n8n_data`

---

## 2. Cài Đặt Cloudflare Tunnel (cloudflared)

### Cài qua winget
```powershell
winget install Cloudflare.cloudflared --accept-package-agreements
```

### Kiểm tra phiên bản
```powershell
cloudflared --version
# Hiện tại: cloudflared version 2025.8.1
```

> ✅ **Ưu điểm so với Ngrok:**
> - Miễn phí 100%
> - Không có trang cảnh báo (interstitial page)
> - Facebook/Telegram verify webhook được ngay

---

## 3. Chạy Cloudflare Tunnel

### Lệnh cơ bản
```powershell
cloudflared tunnel --url http://localhost:5888
```

### Output mẫu
```
Your quick Tunnel has been created! Visit it at:
https://rainbow-tournament-famous-trip.trycloudflare.com
```

> ⚠️ **Lưu ý**:
> - URL thay đổi mỗi lần restart
> - Để có URL cố định, cần tạo Named Tunnel với Cloudflare account

---

## 4. Cấu Hình Facebook Webhook

### Thông tin cấu hình hiện tại:

| Mục | Giá trị |
|-----|---------|
| **Webhook Path** | `fb-autoresponder` |
| **Production URL (local)** | `http://localhost:5888/webhook/fb-autoresponder` |
| **Callback URL (Facebook)** | `https://rainbow-tournament-famous-trip.trycloudflare.com/webhook/fb-autoresponder` |
| **Verify Token** | `tokenminh` |

### Bước cấu hình trên Facebook Developer:
1. Vào https://developers.facebook.com
2. Chọn App → **Messenger** → **Settings**
3. Phần **Webhooks**:
   - **URL gọi lại**: `https://rainbow-tournament-famous-trip.trycloudflare.com/webhook/fb-autoresponder`
   - **Xác minh mã**: `tokenminh`
4. Click **Xác minh và lưu**

### Subscribe Fields
Tick chọn:
- ✅ `messages`
- ✅ `messaging_postbacks`
- ✅ `messaging_optins` (nếu cần)

---

## 5. Quy Trình Khởi Động Hàng Ngày

```powershell
# 1. Chạy Cloudflare Tunnel (lấy URL trước)
cloudflared tunnel --url http://localhost:5888
# → Copy URL mới (ví dụ: https://xxx.trycloudflare.com)

# 2. Restart n8n với WEBHOOK_URL mới (nếu cần dùng Telegram Trigger)
docker stop n8n-atom
docker rm n8n-atom
docker run -d --name n8n-atom -p 5888:5888 `
  -e WEBHOOK_URL=https://xxx.trycloudflare.com `
  -v C:/n8n_data:/home/node/.n8n `
  atom8n/n8n:fork

# 3. Mở n8n và active workflow
# http://localhost:5888
```

> [!IMPORTANT]
> **Telegram webhook yêu cầu HTTPS.** Nếu không cấu hình `WEBHOOK_URL`, Telegram Trigger sẽ không thể active được.
> 
> Nếu chỉ dùng workflow không có Telegram Trigger (như Facebook webhook), có thể bỏ qua bước 2.

> [!WARNING]
> **Google OAuth redirect URI cũng cần cập nhật!**
> 1. Mở: https://console.cloud.google.com/apis/credentials
> 2. Click vào OAuth client ID
> 3. Sửa **Authorized redirect URIs** thành:
>    ```
>    https://xxx.trycloudflare.com/rest/oauth2-credential/callback
>    ```
> 4. Click **SAVE**

---

## 6. Xử Lý Lỗi Thường Gặp

### Lỗi "Cannot determine default origin certificate path"
→ Bỏ qua, tunnel vẫn hoạt động bình thường.

### Lỗi "port already in use"
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5888

# Kill process
taskkill /PID <PID> /F
```

### n8n không nhận webhook
1. Kiểm tra workflow đã **Active/Publish** chưa
2. Kiểm tra cloudflared đang chạy
3. Test URL bằng browser: `https://<tunnel-url>/webhook/fb-autoresponder`

---

## 7. Chuẩn Bị Migrate Sang VPS

Khi chuyển sang VPS/Cloud:

1. **Không cần cloudflared** vì server có IP public
2. **Cập nhật Webhook URL** thành IP/domain của server
3. **Copy dữ liệu** từ `C:/n8n_data` sang server
4. **Cấu hình SSL** (Let's Encrypt) cho HTTPS

### Lệnh chạy n8n trên VPS
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v /data/n8n:/home/node/.n8n \
  -e WEBHOOK_URL=https://your-domain.com \
  n8nio/n8n
```

---

## Thông Tin Quan Trọng

| Mục | Giá trị |
|-----|---------|
| n8n Port | 5888 (local) |
| n8n Data | `C:/n8n_data` |
| Tunnel Tool | Cloudflare Tunnel (cloudflared) |
| Facebook Verify Token | `tokenminh` |
| Webhook Path | `fb-autoresponder` |

---

## 8. Import Workflow từ File JSON

### 📁 Danh sách 6 file workflow:
| File | Mô tả |
|------|-------|
| `N8N/1.Social Publisher.json` | Đăng bài đa nền tảng |
| `N8N/2.Trend Hunter.json` | Tìm xu hướng + auto tạo content |
| `N8N/3.Content Manager.json` | Telegram + Channel + Multi-Input |
| `N8N/4.Auto Responder.json` | Trả lời comment FB |
| `N8N/5.Affiliate Bot.json` | Quản lý link affiliate |
| `N8N/6.Content Engine.json` | Tạo video/audio từ AI |

### 📋 Cách import:
1. Mở n8n → **Workflows**
2. Click **"+ New Workflow"**
3. Click **⋮** → **"Import from File..."**
4. Chọn lần lượt 6 file JSON trong thư mục `N8N/`
5. Sửa các credential ID trong node **Config**

### 🔧 Sau khi import cần cấu hình:
Mỗi file có node **Config** với các biến cần thay thế:

| Biến trong file | Thay bằng |
|-----------------|-----------|
| `YOUR_CREDENTIAL_ID` | ID credential Google Sheets OAuth2 |
| `YOUR_TG_CREDENTIAL_ID` | ID credential Telegram Bot |
| `YOUR_GEMINI_CREDENTIAL_ID` | ID credential Google Gemini |
| `YOUR_FB_AUTH_ID` | ID credential Facebook Header Auth |
| `YOUR_PAGE_TOKEN` | Facebook Page Token |
| `YOUR_CHAT_ID` | Telegram Admin Chat ID |

> 💡 **Tip**: Để lấy credential ID, vào **Settings** → **Credentials** → Click vào credential → Copy ID từ URL.


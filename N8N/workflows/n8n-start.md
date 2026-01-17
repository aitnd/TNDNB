---
description: Khởi động hệ thống n8n với Cloudflare Tunnel
---

# Quy trình khởi động n8n hàng ngày

## Bước 1: Khởi động Cloudflare Tunnel
// turbo
```powershell
cloudflared tunnel --url http://localhost:5888
```
→ Đợi xuất hiện URL dạng `https://xxx.trycloudflare.com`
→ Copy URL này để dùng ở bước tiếp theo

## Bước 2: Restart n8n Docker với URL mới
Thay `xxx.trycloudflare.com` bằng URL vừa lấy được:
```powershell
docker stop n8n-atom
docker rm n8n-atom
docker run -d --name n8n-atom -p 5888:5888 -e WEBHOOK_URL=https://xxx.trycloudflare.com -v C:/n8n_data:/home/node/.n8n atom8n/n8n:fork
```

## Bước 3: Kiểm tra n8n hoạt động
// turbo
```powershell
docker ps | findstr n8n
```

## Bước 4: Mở n8n trong browser
Mở browser và truy cập: http://localhost:5888

## Bước 5 (Tùy chọn): Cập nhật Google OAuth redirect URI
Nếu cần dùng Google Sheets OAuth:
1. Mở: https://console.cloud.google.com/apis/credentials
2. Sửa redirect URI thành: `https://xxx.trycloudflare.com/rest/oauth2-credential/callback`

## Bước 6 (Tùy chọn): Cập nhật Facebook Webhook
Nếu cần dùng Facebook webhook:
1. Mở: https://developers.facebook.com/apps
2. Sửa Callback URL thành URL Cloudflare mới

---
**Hoàn thành! n8n đã sẵn sàng hoạt động 🚀**

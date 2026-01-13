---
description: Cài đặt và khởi tạo n8n trên máy mới với Docker và MCP integration
---

# Cài Đặt n8n với Docker & MCP

## Bước 1: Kiểm tra Docker đã cài chưa
```powershell
docker --version
```
Nếu chưa có, tải Docker Desktop từ: https://www.docker.com/products/docker-desktop

---

## Bước 2: Chạy n8n container
// turbo
```powershell
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

---

## Bước 3: Kiểm tra n8n đã chạy
```powershell
docker ps | findstr n8n
```
Mở browser: http://localhost:5678

---

## Bước 4: Tạo API Key trong n8n
1. Vào http://localhost:5678
2. Settings → n8n API → Create API Key
3. Copy API Key

---

## Bước 5: Cài n8n-mcp (nếu chưa có)
```powershell
npm install -g n8n-mcp
```

---

## Bước 6: Cập nhật mcp_config.json
File: `C:\Users\Admin\.gemini\antigravity\mcp_config.json`

Thêm hoặc cập nhật section n8n-mcp:
```json
{
    "n8n-mcp": {
        "command": "node",
        "args": [
            "C:\\Users\\Admin\\AppData\\Roaming\\npm\\node_modules\\n8n-mcp\\dist\\mcp\\index.js"
        ],
        "env": {
            "MCP_MODE": "stdio",
            "LOG_LEVEL": "error",
            "DISABLE_CONSOLE_OUTPUT": "true",
            "N8N_API_URL": "http://localhost:5678",
            "N8N_BASE_URL": "http://localhost:5678",
            "N8N_API_KEY": "<PASTE_API_KEY_HERE>"
        }
    }
}
```

---

## Bước 7: Refresh MCP Servers
Trong Antigravity: Ctrl+Shift+P → "MCP: Refresh Servers"

---

## Bước 8: Kiểm tra kết nối
Sử dụng tool: `n8n_health_check`

Kết quả mong đợi:
```json
{
  "status": "connected",
  "version": "1.x.x"
}
```

---

## Khắc phục lỗi thường gặp

| Lỗi | Giải pháp |
|-----|-----------|
| Docker not running | Khởi động Docker Desktop |
| Port 5678 đã dùng | Đổi port: `-p 5679:5678` |
| API Key invalid | Tạo lại key trong n8n Settings |
| MCP không kết nối | Kiểm tra đường dẫn node_modules |

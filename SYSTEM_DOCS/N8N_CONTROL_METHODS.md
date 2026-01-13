# Cách Điều Khiển N8N Trong Hệ Thống

> **Mục đích:** Giải thích các phương pháp điều khiển n8n và khi nào nên dùng phương pháp nào.

---

## 📋 Tổng Quan Các Phương Pháp

| Phương Pháp | Mô Tả | Ưu Điểm | Nhược Điểm |
|-------------|-------|---------|------------|
| **n8n MCP** | API điều khiển qua Model Context Protocol | Tự động, script-able | Cần cấu hình MCP |
| **Browser Agent** | AI điều khiển qua giao diện web | Trực quan, dễ debug | Chậm, tốn resource |
| **n8n REST API** | Gọi API trực tiếp | Nhanh, linh hoạt | Cần code |
| **Manual** | Thao tác thủ công | Toàn quyền kiểm soát | Mất thời gian |

---

## 1. N8N MCP (Model Context Protocol)

### Mô Tả
- Extension cho AI Agent (Antigravity) giao tiếp trực tiếp với n8n
- Không cần mở browser
- Thực hiện programmatic commands

### Cấu Hình
File: `C:\Users\Admin\AppData\Roaming\Code\User\globalStorage\anthropic.claude-dev\settings\mcp_config.json`

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "@anthropics/n8n-mcp"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "{YOUR_N8N_API_KEY}"
      }
    }
  }
}
```

### Lấy N8N API Key
1. Mở n8n → **Settings** → **API**
2. Click **"Create an API key"**
3. Copy API key

### Tools Có Sẵn
- `list_workflows` - Liệt kê workflows
- `get_workflow` - Lấy workflow theo ID
- `create_workflow` - Tạo workflow mới
- `update_workflow` - Cập nhật workflow
- `delete_workflow` - Xóa workflow
- `execute_workflow` - Chạy workflow

### Khi Nào Dùng
✅ Tạo/sửa workflows hàng loạt
✅ Script automation
✅ Không cần giao diện
❌ Debug phức tạp
❌ Cấu hình OAuth credentials

---

## 2. Browser Agent (Antigravity)

### Mô Tả
- AI điều khiển trình duyệt web
- Click, type, navigate như người dùng
- Có thể chụp screenshot

### Khi Nào Dùng
✅ Cấu hình OAuth credentials
✅ Tương tác giao diện phức tạp
✅ Debug visual
✅ Demo cho người dùng
❌ Tạo workflows lớn
❌ Automation hàng loạt

---

## 3. N8N REST API

### Endpoints Chính

```bash
# Liệt kê workflows
GET http://localhost:5678/api/v1/workflows
Headers: X-N8N-API-KEY: {API_KEY}

# Tạo workflow mới
POST http://localhost:5678/api/v1/workflows
Body: {workflow JSON}

# Cập nhật workflow
PATCH http://localhost:5678/api/v1/workflows/{id}
Body: {workflow JSON}

# Chạy workflow
POST http://localhost:5678/api/v1/workflows/{id}/execute
```

### Khi Nào Dùng
✅ Integration với hệ thống khác
✅ Cần performance cao
✅ Batch operations
❌ Cấu hình credentials
❌ OAuth flows

---

## 4. Thao Tác Thủ Công

### Khi Nào Dùng
✅ Cấu hình lần đầu
✅ Debug phức tạp
✅ Authorize OAuth
✅ Test trực tiếp
❌ Automation
❌ Reproducible tasks

---

## 🎯 Khuyến Nghị

### Workflow Phát Triển Mới
1. **Manual**: Thiết kế và test nodes
2. **Browser Agent**: Cấu hình credentials
3. **N8N MCP**: Clone/modify workflows

### Maintenance
1. **N8N MCP**: Backup/restore workflows
2. **REST API**: Monitoring và alerts

### Demo & Training
1. **Browser Agent**: Record thao tác
2. **Manual**: Giải thích chi tiết

---

## 📌 Trạng Thái Hiện Tại

| Phương Pháp | Trạng Thái | Ghi Chú |
|-------------|------------|---------|
| N8N MCP | ⚠️ Đã cấu hình, chưa test | Cần verify API key |
| Browser Agent | ✅ Đang sử dụng | Phương pháp chính hiện tại |
| REST API | ⏳ Chưa sử dụng | Cần integration |
| Manual | ✅ Sẵn sàng | Backup option |

---

*Cập nhật lần cuối: 2026-01-11*

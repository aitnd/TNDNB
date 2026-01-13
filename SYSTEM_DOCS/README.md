# 🤖 N8N AI SUPER ASSISTANT

> Hệ thống automation với n8n + AI Agent (Antigravity)

## 📁 Cấu Trúc Thư Mục

```
N8N/
├── workflows/           # Slash commands cho Antigravity
│   ├── n8n-setup.md     # /n8n-setup - Cài đặt n8n
│   ├── n8n-workflow-management.md  # /n8n-workflow-management
│   ├── n8n-deploy-template.md      # /n8n-deploy-template
│   └── n8n-debug.md     # /n8n-debug
├── *.json               # Workflow files để import vào n8n
├── README.md            # File này
├── N8N_ATOM_GUIDE.md    # Hướng dẫn extension n8n Atom
└── IMPLEMENTATION_PLAN.md
```

## 🚀 Quick Start

### 1. Khởi động n8n
```powershell
docker start n8n
# Mở http://localhost:5678
```

### 2. Slash Commands
Gõ trong Antigravity chat:
- `/n8n-setup` - Cài đặt từ đầu
- `/n8n-workflow-management` - Tạo/sửa/xóa workflows
- `/n8n-deploy-template` - Deploy templates từ n8n.io
- `/n8n-debug` - Debug lỗi

### 3. MCP Tools (sau khi cấu hình)
- `n8n_health_check` - Kiểm tra kết nối
- `n8n_list_workflows` - Xem danh sách workflows
- `n8n_deploy_template` - Deploy template

## 📝 Tài Liệu Chi Tiết

| File | Mô tả |
|------|-------|
| [N8N_ATOM_GUIDE.md](N8N_ATOM_GUIDE.md) | Hướng dẫn extension |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Kế hoạch triển khai |
| [HARDWARE_PLAN.md](HARDWARE_PLAN.md) | Kế hoạch phần cứng |

## 🔧 Workflows Có Sẵn

| File | Chức năng |
|------|-----------|
| `chatbot tele.json` | Telegram chatbot |
| `chatbot facebook.json` | Facebook chatbot |
| `ai-voice-agent-basic.json` | Voice agent |
| `xu hướng YouTube.json` | Phân tích xu hướng |

---

> 📌 **Folder `.n8n`** ở root là config của n8n, không sửa/xóa.

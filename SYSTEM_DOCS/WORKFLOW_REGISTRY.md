# N8N Workflow Registry

> **Mục đích:** Quản lý và theo dõi tất cả workflows trong hệ thống MMO Automation.

---

## 📋 Quy Ước Đặt Tên

### Workflow Đã Hoàn Thành (Production)
```
{STT}.{Tên Module} - {Mô tả ngắn}
```
**Ví dụ:**
- `1.Social Publisher - Facebook`
- `2.Trend Hunter - YouTube`
- `3.Auto Responder - Facebook`

### Workflow Mẫu (Template)
```
[TEMPLATE] {Tên mô tả}
```

### Workflow Đang Phát Triển (Development)
```
[DEV] {Tên mô tả}
```

---

## 🟢 Workflows Đang Hoạt Động (Production)

| STT | Tên Workflow | ID | Mô Tả | File JSON |
|-----|-------------|-----|-------|----------|
| 1 | 1.Social Publisher - Facebook | `1QGjbHhsDW4Iwxvk` | Đăng bài tự động lên Facebook Page | `1.Social Publisher - Facebook.json` |
| 2 | 2.Trend Hunter - YouTube | `NBT5vTyNCitc3gj3` | AI tìm video trending theo niche | `2.Trend Hunter - YouTube.json` |
| 2.1 | 2.1.Youtube Search Workflow | `mvTMsMBGXst8u9da` | Workflow con cho Trend Hunter | `2.1.Youtube Search Workflow.json` |

---

## 🟡 Workflows Chờ Triển Khai (Pending)

| Tên File JSON | Mô Tả | Trạng Thái | Ưu Tiên |
|---------------|-------|------------|---------|
| `chatbot facebook.json` | Auto reply comment/message | Chờ import | Cao |
| `ai-voice-agent-basic.json` | Voice chat AI | Chờ import | Thấp |
| `Voice Chat.json` | Voice interaction | Chờ import | Thấp |
| `chatbot tele.json` | Telegram bot | Chờ import | Trung bình |
| `Video_Face_Swap_Workflow_Clean.json` | Face swap video | Chờ import | Thấp |
| `nanoai.pics pass captcha text to video 3.1 (update 26.12).json` | Text to video | Chờ import | Trung bình |
| `N8N_WAIT_TEMPLATE.json` | Template chờ xử lý | Template | - |

---

## 🔴 Workflows Phụ Trợ (Support)

| Tên | ID | Mô Tả |
|-----|-----|-------|
| `Lấy authorization Flow.json` | - | Helper lấy OAuth token |

---

## 📁 Cấu Trúc Thư Mục

```
E:\TNDNB\N8N\
├── SYSTEM_DOCS\          # Tài liệu hệ thống
│   ├── API_SETUP_GUIDE.md
│   └── WORKFLOW_REGISTRY.md (file này)
├── workflows\            # Slash commands cho agent
│   ├── n8n-setup.md
│   ├── n8n-workflow-management.md
│   ├── n8n-deploy-template.md
│   └── n8n-debug.md
├── 1.Social Publisher - Facebook.json   # Production
├── 2.Trend Hunter - YouTube.json        # Production
├── [TEMPLATE] *.json                    # Templates
└── [DEV] *.json                         # Development
```

---

## 🔄 Quy Trình Triển Khai Workflow

### Bước 1: Import từ File JSON
```
1. Mở n8n → Workflows → Import from file
2. Chọn file .json
3. Save với tên tạm
```

### Bước 2: Cấu Hình Credentials
```
1. Kiểm tra các node cần credential
2. Tạo/gán credentials theo API_SETUP_GUIDE.md
3. Test từng node
```

### Bước 3: Test & Debug
```
1. Chạy thử workflow
2. Kiểm tra logs
3. Sửa lỗi nếu có
```

### Bước 4: Đổi Tên Production
```
1. Đổi tên workflow: {STT}.{Module} - {Mô tả}
2. Export file JSON với tên mới
3. Cập nhật registry này
4. Xóa file JSON cũ (optional)
```

---

## 📊 Thống Kê

- **Tổng workflows production:** 2
- **Workflows chờ triển khai:** 7
- **Workflows hỗ trợ:** 1

---

## 📝 Lịch Sử Cập Nhật

| Ngày | Thay Đổi |
|------|----------|
| 2026-01-11 | Khởi tạo registry, thêm Social Publisher và Trend Hunter |

---

*File này được tạo tự động và cập nhật khi có thay đổi workflow.*

---
description: Deploy workflow templates từ n8n.io vào instance local
---

# Deploy n8n Templates

> n8n có **2,700+ templates** sẵn có. Luôn tìm template trước khi tự xây từ đầu!

## Bước 1: Tìm Template Phù Hợp

### Tìm theo từ khóa
```
search_templates({ query: "telegram chatbot" })
```

### Tìm theo task
```
search_templates({
  searchMode: "by_task",
  task: "webhook_processing"
})
```

### Tìm theo category
Các category phổ biến:
- `marketing` - Marketing automation
- `sales` - Sales workflows  
- `devops` - CI/CD, monitoring
- `ai` - AI/ML integrations
- `social` - Social media automation

---

## Bước 2: Xem Chi Tiết Template

```
get_template({ id: "TEMPLATE_ID" })
```

Kiểm tra:
- [ ] Các nodes cần dùng
- [ ] Credentials cần thiết
- [ ] Độ phức tạp workflow

---

## Bước 3: Deploy Template

### Deploy đơn giản
```
n8n_deploy_template({
  templateId: "TEMPLATE_ID"
})
```

### Deploy với tên tùy chỉnh
```
n8n_deploy_template({
  templateId: "TEMPLATE_ID",
  name: "My Telegram Bot"
})
```

---

## Bước 4: Cấu Hình Credentials

Sau khi deploy, cần cấu hình:
1. Mở workflow trong n8n UI
2. Click vào từng node màu đỏ (thiếu credentials)
3. Thêm credentials tương ứng

---

## Bước 5: Test & Activate

### Test workflow
```
n8n_test_workflow({ id: "DEPLOYED_WORKFLOW_ID" })
```

### Activate khi OK
```
n8n_update_partial_workflow({
  id: "DEPLOYED_WORKFLOW_ID",
  diff: { active: true }
})
```

---

## Templates Phổ Biến

| Use Case | Template ID | Mô tả |
|----------|-------------|-------|
| Telegram Bot | 1234 | Chatbot cơ bản |
| Webhook Handler | 2345 | Xử lý webhook events |
| Google Sheets Sync | 3456 | Đồng bộ dữ liệu |
| AI Chat | 4567 | Chat với OpenAI/Gemini |

> 💡 **Tip**: Dùng `search_templates` để tìm ID chính xác

---

## Khắc phục Lỗi

| Lỗi | Giải pháp |
|-----|-----------|
| Template not found | Kiểm tra template ID |
| Missing credentials | Thêm credentials trong n8n UI |
| Node not installed | Cài community node nếu cần |
| Deploy failed | Kiểm tra n8n_health_check |

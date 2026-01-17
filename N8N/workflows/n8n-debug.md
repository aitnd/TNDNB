---
description: Debug và khắc phục lỗi workflow n8n
---

# Debug n8n Workflows

## Kiểm Tra Kết Nối

### Health check
```
n8n_health_check
```

Kết quả OK:
```json
{ "status": "connected", "version": "1.x.x" }
```

---

## Xem Execution Logs

### Liệt kê các lần chạy gần đây
```
n8n_executions({ workflowId: "ID", limit: 10 })
```

### Lọc theo trạng thái
```
n8n_executions({
  workflowId: "ID",
  status: "error"
})
```

Các trạng thái:
- `success` - Thành công
- `error` - Lỗi
- `running` - Đang chạy
- `waiting` - Đang chờ

---

## Validate Workflow

### Validate toàn bộ workflow
```
validate_workflow(workflowJson)
```

### Validate từng node
```
validate_node({
  nodeType: "n8n-nodes-base.webhook",
  config: { /* node config */ },
  mode: "full"
})
```

Các mode:
- `minimal` - Kiểm tra nhanh
- `full` - Kiểm tra đầy đủ

---

## Auto-fix Lỗi

### Tự động sửa lỗi phổ biến
```
n8n_autofix_workflow({ id: "WORKFLOW_ID" })
```

Autofix có thể sửa:
- ✅ Missing connections
- ✅ Invalid node positions
- ✅ Deprecated node types
- ✅ Missing required fields

---

## Lỗi Thường Gặp & Cách Khắc Phục

### 1. Webhook không nhận được request
**Nguyên nhân:**
- Webhook URL sai
- n8n không expose ra ngoài
- Workflow chưa active

**Giải pháp:**
```powershell
# Kiểm tra workflow đã active chưa
n8n_get_workflow({ id: "ID" })
# Xem trường "active": true/false

# Kiểm tra webhook URL
# URL format: http://localhost:5678/webhook/xxx
```

---

### 2. Credentials không hoạt động
**Nguyên nhân:**
- Token hết hạn
- Permissions thiếu
- Sai API endpoint

**Giải pháp:**
1. Vào n8n UI → Credentials
2. Test credential
3. Refresh token nếu cần

---

### 3. Node báo lỗi "Unknown error"
**Nguyên nhân:**
- API rate limit
- Network timeout
- Invalid input data

**Giải pháp:**
```
# Xem execution chi tiết
n8n_executions({ workflowId: "ID", limit: 1 })

# Kiểm tra input/output của từng node trong execution
```

---

### 4. Workflow không trigger
**Checklist:**
- [ ] Workflow đã active?
- [ ] Trigger node đúng loại?
- [ ] Schedule đúng timezone?
- [ ] Webhook URL đúng?

---

## Debug Tips

1. **Bật error logging**:
   ```
   LOG_LEVEL=debug trong docker env
   ```

2. **Test từng node**:
   - Dùng "Execute Node" trong n8n UI
   - Xem output từng bước

3. **Mock data**:
   ```
   n8n_test_workflow({
     id: "ID",
     testData: { "key": "test_value" }
   })
   ```

4. **Export workflow lỗi**:
   - Lưu JSON
   - Validate offline
   - So sánh với template gốc

---

## Liên Hệ Hỗ Trợ

- n8n Community: https://community.n8n.io
- n8n Docs: https://docs.n8n.io
- n8n-mcp Issues: https://github.com/czlonkowski/n8n-mcp/issues

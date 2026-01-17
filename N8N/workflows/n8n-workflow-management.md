---
description: Quản lý workflows n8n - Tạo, sửa, xóa, kích hoạt
---

# Quản Lý n8n Workflows

## Liệt kê Workflows

### Xem tất cả workflows
Sử dụng tool: `n8n_list_workflows`

### Lọc theo tên
```
n8n_list_workflows({ filter: "telegram" })
```

---

## Tạo Workflow Mới

### Cách 1: Tạo từ template (khuyến nghị)
1. Tìm template phù hợp:
   ```
   search_templates({ query: "telegram bot webhook" })
   ```

2. Preview template:
   ```
   get_template({ id: "TEMPLATE_ID" })
   ```

3. Deploy:
   ```
   n8n_deploy_template({ templateId: "TEMPLATE_ID", name: "My Workflow" })
   ```

### Cách 2: Tạo từ JSON
```
n8n_create_workflow({
  name: "My Custom Workflow",
  nodes: [...],
  connections: {...}
})
```

---

## Sửa Workflow

### Lấy workflow hiện tại
```
n8n_get_workflow({ id: "WORKFLOW_ID" })
```

### Cập nhật một phần (partial update)
```
n8n_update_partial_workflow({
  id: "WORKFLOW_ID",
  diff: {
    nodes: [{ /* updated node */ }]
  }
})
```

### Tự động sửa lỗi
```
n8n_autofix_workflow({ id: "WORKFLOW_ID" })
```

---

## Kích hoạt / Tắt Workflow

### Activate
```
n8n_update_partial_workflow({
  id: "WORKFLOW_ID",
  diff: { active: true }
})
```

### Deactivate
```
n8n_update_partial_workflow({
  id: "WORKFLOW_ID",
  diff: { active: false }
})
```

---

## Xóa Workflow

⚠️ **Cẩn thận**: Hành động này không thể hoàn tác!

```
n8n_delete_workflow({ id: "WORKFLOW_ID" })
```

---

## Test Workflow

### Chạy thử toàn workflow
```
n8n_test_workflow({ id: "WORKFLOW_ID" })
```

### Chạy với dữ liệu test
```
n8n_test_workflow({
  id: "WORKFLOW_ID",
  testData: { "key": "value" }
})
```

---

## Validate Workflow

### Kiểm tra cấu trúc
```
validate_workflow(workflowJson)
```

### Kiểm tra từng node
```
validate_node({
  nodeType: "n8n-nodes-base.webhook",
  config: {...},
  mode: "full"
})
```

---

## Tips

1. **Luôn backup trước khi sửa lớn**: Export workflow JSON
2. **Dùng template**: Tiết kiệm 80% thời gian
3. **Test trước khi activate**: Tránh lỗi production
4. **Đặt tên rõ ràng**: Dễ quản lý sau này

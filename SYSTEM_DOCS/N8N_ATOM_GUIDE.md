# 🔌 Hướng Dẫn Sử Dụng n8n Atom Extension

> Extension n8n Atom 3.0 giúp quản lý workflow collections trực tiếp trong VS Code/Antigravity.

## Cài Đặt Extension

1. Mở Extensions panel (Ctrl+Shift+X)
2. Tìm "n8n Atom"
3. Install và reload

---

## Kết Nối n8n Instance

### Bước 1: Đảm bảo n8n đang chạy
```powershell
docker ps | findstr n8n
# Hoặc mở http://localhost:5678
```

### Bước 2: Cấu hình trong Extension
1. Click icon n8n Atom trên sidebar
2. Settings → n8n URL: `http://localhost:5678`
3. Nhập API Key (lấy từ n8n Settings → API)

---

## Tính Năng Chính

### 1. Workflow Notes
- Xem danh sách workflows
- Quick preview JSON
- Sync với n8n instance

### 2. History
- Lịch sử các thao tác
- Restore workflow versions
- Compare changes

### 3. Workspaces
- Tổ chức workflows theo project
- Export/Import collections
- Share với team

---

## Kết Hợp với Antigravity

### Slash Commands Có Sẵn

| Command | Mô tả |
|---------|-------|
| `/n8n-setup` | Cài đặt n8n từ đầu |
| `/n8n-workflow-management` | CRUD workflows |
| `/n8n-deploy-template` | Deploy templates |
| `/n8n-debug` | Debug lỗi |

### MCP Tools

Extension n8n Atom hoạt động song song với n8n-mcp:
- **n8n Atom**: Quản lý visual, collections, notes
- **n8n-mcp**: API automation, AI-powered workflows

---

## Workflow Thường Dùng

### 1. Tạo Workflow Mới
```
1. /n8n-deploy-template → Tìm template
2. Deploy vào n8n instance
3. n8n Atom → Thêm notes
4. Export vào collection
```

### 2. Debug Workflow
```
1. Mở workflow trong n8n Atom
2. Xem execution history
3. /n8n-debug → Xem logs chi tiết
4. Autofix nếu cần
```

### 3. Backup Workflows
```
1. n8n Atom → Select All Workflows
2. Export to Workspace
3. Sync với Git repository
```

---

## Tips & Tricks

1. **Pin workflows quan trọng**: Click ⭐ để dễ tìm
2. **Dùng tags**: Phân loại theo dự án
3. **Sync thường xuyên**: Tránh mất dữ liệu
4. **Backup trước khi sửa**: Export JSON

---

## Khắc Phục Lỗi

| Vấn đề | Giải pháp |
|--------|-----------|
| Extension không thấy workflows | Kiểm tra URL và API Key |
| Sync failed | Kiểm tra n8n đang chạy |
| History trống | Bắt đầu thao tác mới |

---

## Tài Liệu Tham Khảo

- [n8n Atom Website](https://www.atom8n.com)
- [n8n Atom Walkthrough Video](n8n%20atom%20+%20Antigravity)
- [n8n Documentation](https://docs.n8n.io)
- [n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)

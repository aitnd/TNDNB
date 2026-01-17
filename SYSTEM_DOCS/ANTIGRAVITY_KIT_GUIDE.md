# 🚀 Antigravity Kit - Hướng Dẫn Cài Đặt & Sử Dụng

> **Mục đích:** Mở rộng khả năng AI Agent với Skills, Rules, Workflows chuyên môn

---

## 📦 Cài Đặt

### Cách 1: CLI (Khuyến nghị)

```powershell
# Di chuyển đến thư mục dự án
cd E:\TNDNB

# Cài đặt Antigravity Kit
npx -y @vudovn/antigravity-kit init

# Nếu đã có sẵn, chọn "y" để ghi đè và cập nhật
```

### Cách 2: Clone từ GitHub

```powershell
git clone https://github.com/vudovn/antigravity-kit.git
# Copy thư mục .agent vào dự án của bạn
```

---

## 📁 Cấu Trúc Sau Khi Cài

```
E:\TNDNB\
└── .agent/
    ├── .shared/          # Tài nguyên dùng chung
    ├── rules/            # 10 files quy tắc hành vi
    │   ├── 01-identity.md
    │   ├── 02-task-classification.md
    │   ├── 03-mode-consulting.md
    │   ├── 04-mode-build.md
    │   ├── 05-mode-debug.md
    │   ├── 06-mode-optimize.md
    │   ├── 07-technical-standards.md
    │   ├── 08-communication.md
    │   ├── 09-checklist.md
    │   └── 10-special-situations.md
    ├── skills/           # 35 skills chuyên môn
    │   ├── react-expert/
    │   ├── nextjs-expert/
    │   ├── nodejs-expert/
    │   ├── docker-expert/
    │   ├── ui-ux-pro-max/
    │   └── ... (và nhiều skills khác)
    └── workflows/        # 7 workflows
        ├── n8n-setup.md
        ├── n8n-start.md
        ├── n8n-debug.md
        ├── n8n-deploy-template.md
        ├── n8n-workflow-management.md
        ├── request.md
        └── ui-ux-pro-max.md
```

---

## 🧠 Cách Hoạt Động

### 1️⃣ Skills (Tự động kích hoạt)

| Thành phần | Cách kích hoạt | Ví dụ |
|------------|----------------|-------|
| Skills | Agent tự đọc khi context phù hợp | Hỏi về React → `react-expert` tự kích hoạt |

**35 Skills có sẵn:**
- **Frontend:** react-expert, nextjs-expert, css-expert, vite-expert
- **Backend:** nodejs-expert, nestjs-expert, rest-api-expert
- **Database:** postgres-expert, mongodb-expert, prisma-expert
- **Testing:** jest-expert, vitest-expert, playwright-expert
- **DevOps:** docker-expert, devops-expert, github-actions-expert
- **UI/UX:** ui-ux-pro-max (50 styles, 21 palettes, 50 font pairings)

### 2️⃣ Rules (Luôn áp dụng)

Rules được đọc tự động với `activation: always_on`:
- Agent Identity & Core Principles
- Task Classification (CONSULT/BUILD/DEBUG/OPTIMIZE)
- Technical Standards (naming, patterns, error handling)

### 3️⃣ Workflows (Gọi bằng slash command)

```
/request          → Quy trình xử lý request chuẩn
/ui-ux-pro-max    → Thiết kế UI/UX chuyên nghiệp
/n8n-setup        → Cài đặt n8n
/n8n-start        → Khởi động n8n
/n8n-debug        → Debug workflow n8n
```

---

## 🔄 Mang Sang Máy Khác

### Bước 1: Copy thư mục cần thiết

```powershell
# Các thư mục cần copy:
E:\TNDNB\.agent\          # Antigravity Kit
E:\TNDNB\SYSTEM_DOCS\     # Tài liệu hệ thống
```

### Bước 2: Cài lại trên máy mới

```powershell
# Hoặc cài mới bằng CLI
npx -y @vudovn/antigravity-kit init
```

### Bước 3: Copy Global Rules (nếu cần)

```powershell
# File Global Rules tại:
C:\Users\<Username>\.gemini\GEMINI.md
```

---

## ⚙️ Cập Nhật

```powershell
# Cập nhật lên phiên bản mới nhất
npx -y @vudovn/antigravity-kit update

# Kiểm tra trạng thái
npx -y @vudovn/antigravity-kit status
```

---

## 💡 Tips Sử Dụng

1. **Chỉ cần chat bình thường** - Agent tự dùng skill phù hợp
2. **Dùng slash command** cho workflows cụ thể: `/request`, `/ui-ux-pro-max`
3. **Rules tự động áp dụng** - Không cần config thêm
4. **Kết hợp với Global Rules** trong `GEMINI.md` để tùy chỉnh thêm

---

*Cập nhật: 2026-01-15*

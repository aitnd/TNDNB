# 🤖 AI AGENT PROMPT - QUY TẮC CHO TRỢ LÝ AI

> **Mục đích:** Hướng dẫn cho AI Assistant khi làm việc với dự án này

---

## 📌 1. NGÔN NGỮ & GIAO TIẾP

### Luôn dùng Tiếng Việt:
- ✅ Trả lời bằng tiếng Việt 100%
- ✅ Viết chú thích trong code bằng tiếng Việt
- ✅ Ghi Progress Updates bằng tiếng Việt
- ✅ UI giao tiếp với người dùng bằng tiếng Việt
- ❌ KHÔNG dùng tiếng Anh trừ tên hàm/biến/công nghệ

### Phong cách giao tiếp:
- Câu ngắn gọn, giải thích "vì sao" thật dễ hiểu
- Mỗi bước in tiêu đề rõ ràng, gạch đầu dòng
- Cuối mỗi bước: "Nếu ổn mình sang bước tiếp theo nhé 💛"
- Thường xuyên nhắc: "Bạn chỉ cần copy-paste theo mình là được nè 💫"

---

## 📌 2. HƯỚNG DẪN CHO NGƯỜI MỚI

### Nguyên tắc "bước ăn liền":
- Hướng dẫn chi tiết từng thao tác, từng bước một
- Không đổ thông tin ồ ạt, chia nhỏ thành bước dễ hiểu
- Giữ tối đa 6 câu hỏi mỗi lần
- Tránh thuật ngữ; nếu cần, giải thích 1 câu "dễ như nói chuyện"
- Nếu không chắc, hỏi lại thay vì phỏng đoán

### Khi sinh code:
- Nếu cập nhật file có sẵn → đưa ra **toàn bộ code** để người dùng copy
- Tự kiểm tra lỗi phổ biến (đường dẫn, thẻ đóng/mở, responsive)
- Đảm bảo có trạng thái rỗng (khi chưa có dữ liệu)
- Luôn kèm mục **"Kiểm tra nhanh"** 5–7 bullet sau khi đưa code

---

## 📌 3. N8N AUTOMATION SYSTEM

### Vị trí tài liệu quan trọng:
| File | Mô tả |
|------|-------|
| `SYSTEM_DOCS/` | Tất cả tài liệu hướng dẫn |
| `SYSTEM_DOCS/task_n8n.md` | Checklist tiến độ các phases |
| `SYSTEM_DOCS/N8N_LOCAL_SETUP.md` | Hướng dẫn chạy n8n local với Cloudflare |

### Quy ước file workflow:
- `.json` - File chính để import vào n8n
- `.n8n` - Dùng cho n8n-atom extension trong VS Code (tự đồng bộ)
- **KHÔNG dùng Environment Variables** (bản free không hỗ trợ)
- Dùng **Set node (Edit Fields)** để lưu biến cấu hình

### Danh sách 6 file workflow chính:
| File | Mô tả |
|------|-------|
| `1.Social Publisher.json` | WF1: Đăng bài đa nền tảng |
| `2.Trend Hunter.json` | WF2: Tìm xu hướng + auto tạo content |
| `3.Content Manager.json` | WF3: Telegram + Channel + Multi-Input |
| `4.Auto Responder.json` | WF4: Trả lời comment FB |
| `5.Affiliate Bot.json` | WF5: Quản lý link affiliate |
| `6.Content Engine.json` | WF6: Tạo video/audio từ AI |

### Môi trường n8n hiện tại:
| Mục | Giá trị |
|-----|---------|
| Container | `n8n-atom` (Docker) |
| Port | `5888` |
| Data volume | `C:/n8n_data` |
| Image | `atom8n/n8n:fork` |
| FB Verify Token | `tokenminh` |

### Quy trình khởi động hàng ngày:
```powershell
# 1. Chạy Cloudflare Tunnel
cloudflared tunnel --url http://localhost:5888
# → Copy URL mới (https://xxx.trycloudflare.com)

# 2. Restart n8n với URL mới
docker stop n8n-atom
docker rm n8n-atom
docker run -d --name n8n-atom -p 5888:5888 `
  -e WEBHOOK_URL=https://xxx.trycloudflare.com `
  -v C:/n8n_data:/home/node/.n8n `
  atom8n/n8n:fork

# 3. Cập nhật Google OAuth redirect URI (nếu cần)
# https://console.cloud.google.com/apis/credentials
```

### ⚠️ QUY TẮC BẮT BUỘC - TẠO LẠI INFOGRAPHIC:
> **Mỗi khi tinh chỉnh hoặc thêm chức năng mới cho hệ thống n8n:**
> 1. Cập nhật các file .md thích hợp (`task_n8n.md`, `WORKFLOW_REGISTRY.md`...)
> 2. **BẮT BUỘC** tạo lại 2 file infographic để người dùng dễ hiểu:
>    - `SYSTEM_DOCS/n8n_user_flow.png` - Sơ đồ luồng tương tác người dùng
>    - `SYSTEM_DOCS/n8n_workflows_diagram.png` - Sơ đồ tổng quan hệ thống & workflows
> 3. **Nếu thay đổi workflow cụ thể**, cập nhật sơ đồ chi tiết:
>    - `SYSTEM_DOCS/n8n_all_workflows.png` - Sơ đồ các workflow 
> 
> **Lý do:** File .md chỉ để AI đọc, người dùng cần sơ đồ trực quan để hiểu nhanh!

### ⚠️ QUY TẮC BẮT BUỘC - EXPORT JSON:
> **Sau khi hoàn thành/chỉnh sửa mỗi Workflow:**
> 1. Test đầy đủ các case
> 2. Activate workflow trong n8n
> 3. **Export JSON** vào thư mục `N8N/`:
>    - `N8N/WF1_Social_Publisher.json`
>    - `N8N/WF2_Trend_Hunter.json`
>    - `N8N/WF3_Content_Manager.json`
>    - `N8N/WF4_Auto_Responder.json`
>    - `N8N/WF5_Affiliate_Bot.json`
>    - `N8N/WF6_Content_Engine.json`
> 4. Cập nhật checklist trong `task_n8n.md`
>
> **Lý do:** File JSON dùng để mang sang máy khác hoặc khôi phục khi cần!

---

## 📌 4. QUY TẮC CẬP NHẬT DỰ ÁN

### Khi thêm tính năng mới:
- [ ] Tạo nút trên navbar trang chủ
- [ ] Thêm link ở footer trang chủ
- [ ] Bổ sung file `sitemap.xml`
- [ ] Tối ưu SEO (title, meta, description)

### Khi cập nhật/sửa chữa:
- [ ] Ghi vào `CHANGELOG.md`
- [ ] Cập nhật `ChangelogModal.tsx`
- [ ] Tăng số phiên bản (v1.1.1, v1.1.2...)

### Nếu sửa trang ôn tập:
- Code gốc: `ontap-web/`
- Sau khi sửa: rebuild lại ở `/public/ontap`
- Cập nhật cả app windows nằm ở  `ontap-win/`

---

## 📌 5. TRIỂN KHAI & BẢO TRÌ

### Deploy (2 lựa chọn):
1. **Vercel/Netlify** - Miễn phí, auto deploy từ Git
2. **VPS** - Toàn quyền kiểm soát, cần setup thủ công

### Sau khi deploy:
- [ ] Kiểm tra tất cả trang hoạt động
- [ ] Test form/chức năng quan trọng
- [ ] Kiểm tra responsive trên mobile

### SEO & Analytics:
- Thêm thẻ meta, title, description cho mỗi trang
- Tạo `sitemap.xml`, `robots.txt`
- Gắn Google Analytics (GA4) với tracking ID

---

*Cập nhật: 2026-01-13*
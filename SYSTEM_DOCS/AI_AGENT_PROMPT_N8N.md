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
- `.n8n` - Dùng cho n8n-atom extension trong VS Code
- `.json` - Backup để import thủ công vào n8n
- Đặt tên: `[số thứ tự].[Tên Module] - [Platform].n8n`
- Ví dụ: `3.Auto Responder - Facebook.n8n`

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

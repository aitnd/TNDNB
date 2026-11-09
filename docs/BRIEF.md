# 📋 BRIEF: Phân Quyền Lịch Sử Cập Nhật (RBAC) & Tối Giản Nội Dung Cho Người Dùng

**Ngày tạo:** 2026-11-09  
**Phân loại (Superpowers v7.0.2):** `Bounded Change` (Thay đổi cục bộ có phạm vi rõ ràng, không cần tách nhiều nhánh kiến trúc)  
**Trạng thái:** Chờ phê duyệt

---

## 1. Đánh giá Chiến lược & Phản biện Sản phẩm (Product Validator Critique)

Dưới góc nhìn quản trị sản phẩm và bảo mật thông tin:

1. **Lỗi rò rỉ kiến trúc nội bộ (Information Disclosure Flaw):**
   - Việc hiển thị tab **💻 Kỹ thuật (Dev)** công khai cho cả khách vãng lai (`null`), học viên (`hoc_vien`) và giáo viên (`giao_vien`) là một sai lầm về mặt sản phẩm. Người dùng phổ thông không cần (và không nên) biết hệ thống đang dùng `Cloudflare KV`, `Firestore`, `Dexie IndexedDB`, `TinyMCE` hay cấu trúc `Monorepo`. Việc phơi bày tên file, đường dẫn API và hạ tầng đám mây ra công cộng vừa làm rối mắt học viên, vừa tạo bề mặt thông tin không cần thiết.
2. **Lỗi "Ngôn ngữ Lập trình viên" trong Bản tin Người dùng (Jargon Overload):**
   - Bản cập nhật `[3.22.0]` và `[3.21.0]` trong `CHANGELOG.md` hiện đang viết như một báo cáo nghiệm thu kỹ thuật (nhắc đến `WelcomeModal`, `LicenseSelectionScreen`, `First Fold Focus`, `Zero-Noise Console`, `Hallmark Editorial`...). Học viên mở lịch sử cập nhật chỉ muốn biết trong 5 giây: *"Có gì mới giúp tôi học và thi dễ hơn?"* giống như chuẩn mực cực kỳ súc tích của bản `[3.19.0]`.
3. **Lỗi hiển thị cú pháp Markdown thô (`**bold**`):**
   - Giao diện hiện chỉ dùng thẻ `<span>{item}</span>` thuần túy khiến các dấu sao `**Tiêu đề:**` bị in nguyên văn ra màn hình, làm giảm tính chuyên nghiệp của ứng dụng.

---

## 2. Giải pháp Đề xuất (3 Hạng mục Thi công)

### Hạng mục 1: Phân quyền RBAC cho Tab "💻 Kỹ thuật (Dev)"
- **Quy tắc hiển thị:** Chỉ hiển thị thanh chuyển đổi `[👤 Người dùng]` / `[💻 Kỹ thuật (Dev)]` khi tài khoản đăng nhập có vai trò (`userProfile?.role`) thuộc nhóm Quản trị & Điều hành:
  - `'admin'` (Quản trị viên)
  - `'quan_ly'` (Quản lý)
  - `'lanh_dao'` (Lãnh đạo)
- **Trạng thái mặc định cho Người dùng phổ thông:** Với khách chưa đăng nhập (`null`), Học viên (`'hoc_vien'`), và Giáo viên (`'giao_vien'`), **ẩn hoàn toàn** thanh chọn Tab và cố định hiển thị nội dung `Người dùng` (`CHANGELOG.md`).
- **Phạm vi file áp dụng:**
  - [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) & [ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) (`ontap-web`)
  - [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) & [ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) (`ontap-win`)

### Hạng mục 2: Biên tập lại Nội dung `[3.22.0]` và `[3.21.0]` theo chuẩn `[3.19.0]`
Loại bỏ 100% thuật ngữ kỹ thuật/tên biến của Dev, rút gọn mỗi ý thành 1 câu ngắn gọn, dễ hiểu:

```markdown
## [3.22.0] - 2026-11-08
### Nâng cấp Trải nghiệm Thi thử Di động & Tối ưu Hệ thống (Web & App Win)
- **Tối ưu phòng thi trên điện thoại:** Thu gọn phần thông tin cá nhân khi đang làm bài, giúp câu hỏi và 4 đáp án hiển thị trọn vẹn ngay trên màn hình mà không cần cuộn trang.
- **Nhắc làm bài dở gọn gàng:** Thay nút nổi che màn hình bằng thanh nhắc nhỏ ở đầu trang, có nút bỏ qua để học viên thoải mái chọn đề thi khác.
- **Cài đặt ứng dụng nhanh:** Hỗ trợ cài đặt ứng dụng **"Giáo dục Ninh Bình"** ra màn hình chính điện thoại kèm hướng dẫn chi tiết cho cả iPhone và Android.
- **Giao diện bảng điều khiển mới:** Đưa Thẻ học viên và nút **"Vào Ôn Tập / Thi Thử"** lên đầu trang, gom các mục phụ vào menu góc phải gọn gàng.
- **Đăng nhập & Vận hành mượt mà:** Tự động ghi nhớ tài khoản đăng nhập, tăng tốc độ mở trang tin tức và đồng bộ phông chữ tiếng Việt rõ nét trên mọi thiết bị.

## [3.21.0] - 2026-11-04
### Tăng tốc Tải ảnh Đề thi & Học Ngoại tuyến (Web & App Win)
- **Tải ảnh đề thi siêu tốc:** Nâng cấp đường truyền giúp toàn bộ hình ảnh câu hỏi sát hạch hiển thị tức thì và sắc nét.
- **Ôn tập không cần mạng:** Tự động lưu dữ liệu câu hỏi vào thiết bị sau lần mở đầu tiên, giúp học viên ôn luyện và thi thử mượt mà ngay cả khi mất kết nối mạng.
- **Cập nhật phần mềm nhanh hơn (Windows):** Tối ưu tốc độ tải bản cập nhật mới trên máy tính, khắc phục tình trạng tải chậm vào giờ cao điểm.
- **Giao diện Cổng thông tin mới:** Thiết kế lại trang tin tức nhà trường theo phong cách trang trọng, rõ ràng và dễ theo dõi lịch học, lịch thi.
```

### Hạng mục 3: Hỗ trợ hiển thị chữ **In đậm** (`**text**`) sạch đẹp
- Bổ sung hàm xử lý nhẹ (helper function) trong 4 component Changelog để tự động chuyển đổi cú pháp `**Tiêu đề:**` thành thẻ `<strong>Tiêu đề:</strong>`, chấm dứt tình trạng lộ dấu `**` thô trên màn hình.

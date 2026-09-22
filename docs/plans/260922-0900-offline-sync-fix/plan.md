# Kế hoạch sửa lỗi: Mất thứ tự & sai tên môn học gói đề offline

## Tổng quan (Overview)
Kế hoạch chi tiết nhằm xử lý triệt để các vấn đề liên quan đến việc hiển thị sai tên môn học và mất thứ tự của hạng bằng/câu hỏi trong chế độ offline của ứng dụng Windows (TNDNB). Dữ liệu điều tra cho thấy nguyên nhân cốt lõi nằm ở quá trình đồng bộ (sync) và truy xuất dữ liệu từ IndexedDB.

## Tech Stack
- Frontend/Desktop: TNDNB Windows App
- Data Storage: Supabase & IndexedDB
- Ngôn ngữ: TypeScript

### Các Giai Đoạn (Phases)
- [x] **Phase 1: Cập nhật Interface (Types)** - Mở rộng kiểu dữ liệu để hỗ trợ sắp xếp.
- [x] **Phase 2: Sửa lỗi Đồng bộ (Sync)** - Cập nhật truy vấn Supabase và logic sắp xếp câu hỏi.
- [x] **Phase 3: Sửa lỗi Truy xuất (Data)** - Đảm bảo dữ liệu lấy từ IndexedDB giữ đúng thứ tự.
- [x] **Phase 4: Build & Release (/tndnb-build)** - Nâng version cho tất cả các app và chạy pipeline đóng gói.
- [x] **Phase 5: Tính năng Giám khảo** - Bổ sung màn hình và route Giám khảo cho bản Windows (đồng bộ từ bản Web).

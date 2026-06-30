# Phase 02: Xác thực live & Vercel
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xác thực thẻ nhúng Monetag hiển thị đúng dạng tĩnh và được bot Monetag xác nhận thành công.

## Implementation Steps
1. [ ] Deploy bản build mới nhất lên server/Vercel (anh thực hiện).
2. [ ] Truy cập trang web `www.daotaothuyenvien.com` bằng chế độ ẩn danh (hoặc view-source).
3. [ ] Đảm bảo thẻ `<script src="https://quge5.com/88/tag.min.js" data-zone="254797" async data-cfasync="false"></script>` xuất hiện đúng dạng thô và ở trong `<head>` của mã HTML trả về.
4. [ ] Vào dashboard Monetag, bấm **Run the installation check again** để kiểm tra tick xanh.

## Test Criteria
- Monetag dashboard verify thành công (trả về trạng thái hoạt động bình thường, không còn lỗi cài đặt).

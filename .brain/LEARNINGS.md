# 🎓 LEARNINGS & CORRECTIONS

## 2026-06-26
### Corrections
- **Changelog Double-Encoding**: Các file CHANGELOG.md bị lỗi font chữ tiếng Việt do double-encoding. Khắc phục bằng cách viết script NodeJS đọc file ở hệ encoding `latin1` (ISO-8859-1) và chuyển đổi ghi lại với định dạng UTF-8 chuẩn.
- **Git index.lock Conflict**: GitHub Desktop chạy nền chiếm dụng tệp `.git/index.lock` gây lỗi commit. Cần tắt tiến trình GitHub Desktop hoặc xoá thủ công tệp `.git/index.lock` trước khi chạy lệnh git commit tiếp theo.
- **Firebase Private Key Leak**: File `ontap-win/server/serviceAccountKey.json` vô tình bị Git theo dõi (tracked) dù đã có trong `.gitignore`. Khắc phục bằng cách chạy `git rm --cached ontap-win/server/serviceAccountKey.json` và commit lại trạng thái đã untrack.

## 2026-06-29
### Corrections
- **Sub-agent API Quota Limit (429)**: Chạy song song quá nhiều sub-agent hoặc gọi các agent có prompt phức tạp liên tục dễ dẫn đến lỗi vượt hạn mức (Resource Exhausted 429). Khắc phục bằng cách thực hiện đồng bộ file thủ công (hoặc script PowerShell trực tiếp) và chia nhỏ tác vụ để tránh quá tải hạn mức.

## 2026-06-30
### Corrections
- **Monetag Static Verification**: Thẻ `<Script>` động của Next.js không được bot quét tĩnh của Monetag nhận diện. Phải sử dụng thẻ `<script>` HTML tĩnh thô trực tiếp trong `<head>` của `layout.tsx` để hoàn tất cài đặt thành công.
- **Framer Motion Opacity Bug**: Cấu hình `initial={{ opacity: 0 }}` mà không chỉ định `opacity: 1` trong animate object của motion components làm ẩn vĩnh viễn Huy hiệu Admin.

## 2026-07-02
### Corrections
- **React Async State Parameter Shadowing**: Trong `ImportStudentModal.tsx`, tham số hàm `handleFileUpload` bị đổi tên thành `_file` để tránh warning, nhưng bên trong vẫn dùng biến state `file` (bị `null` do bất đồng bộ). Khắc phục bằng cách đổi lại tên tham số là `file` để shadowing chính xác, đồng thời loại bỏ React state `file` thừa.
- **Google Auto Ads close button freeze**: Sử dụng pointer-events: none toàn diện cho `.adsbygoogle` gây liệt nút đóng/ẩn quảng cáo của các loại quảng cáo Overlay (Anchor, Vignette). Khắc phục bằng cách áp dụng CSS 2 tầng (chặn in-page ads, mở khóa cho fixed-overlay ads).
- **Vite Cross-Directory Build Warning**: Import file Styles trực tiếp từ `ontap-web` sang dự án Vite `ontap-win` dễ gây cảnh báo/lỗi bundler do nằm ngoài root workspace. Khắc phục bằng cách duy trì file styles cục bộ trong từng dự án Vite độc lập.


# 🎓 LEARNINGS & CORRECTIONS

## 2026-06-26
### Corrections
- **Changelog Double-Encoding**: Các file CHANGELOG.md bị lỗi font chữ tiếng Việt do double-encoding. Khắc phục bằng cách viết script NodeJS đọc file ở hệ encoding `latin1` (ISO-8859-1) và chuyển đổi ghi lại với định dạng UTF-8 chuẩn.
- **Git index.lock Conflict**: GitHub Desktop chạy nền chiếm dụng tệp `.git/index.lock` gây lỗi commit. Cần tắt tiến trình GitHub Desktop hoặc xoá thủ công tệp `.git/index.lock` trước khi chạy lệnh git commit tiếp theo.
- **Firebase Private Key Leak**: File `ontap-win/server/serviceAccountKey.json` vô tình bị Git theo dõi (tracked) dù đã có trong `.gitignore`. Khắc phục bằng cách chạy `git rm --cached ontap-win/server/serviceAccountKey.json` và commit lại trạng thái đã untrack.

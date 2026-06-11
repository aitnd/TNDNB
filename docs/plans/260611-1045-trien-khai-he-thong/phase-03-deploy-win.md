# Phase 03: Đóng gói & Phát hành bản Win (EXE)
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng và đóng gói ứng dụng Electron dành cho hệ điều hành Windows thành file cài đặt `.exe` và đẩy bản phát hành mới (v3.9.6) lên máy chủ cập nhật (hoặc GitHub Releases).

## Requirements
- Đảm bảo các tiến trình Electron dev cũ đã được tắt để tránh lỗi khóa file `EPERM`.
- Build và đóng gói ứng dụng Electron thành công.
- Lưu file setup EXE vào vị trí backup chính thức hoặc upload lên server phát hành.

## Implementation Steps
1. [ ] Tắt tất cả tiến trình Electron dev đang chạy ngầm trên máy Windows.
2. [ ] Xóa thư mục build cũ `release/` và `win-unpacked/` nếu có.
3. [ ] Chạy lệnh `npm run build:win` hoặc `electron-builder` để đóng gói bản cài đặt.
4. [ ] Sao chép file cài đặt `Onthi-3.9.6-Setup.exe` vào thư mục backup hoặc tiến hành phát hành.

## Test Criteria
- File setup `.exe` được tạo ra trong thư mục `release/` với dung lượng chuẩn.
- Cài đặt thử nghiệm bản `.exe` mới trên máy local chạy bình thường.

---
Next Phase: [phase-04-verify.md](file:///d:/Antigravity/TNDNB/docs/plans/260611-1045-trien-khai-he-thong/phase-04-verify.md)

# Kế Hoạch Triển Khai Tính Năng Mới (Đợt 1 & Đợt 2)

**Version:** v12 (2026-09-17) — đã qua 12 vòng review (8 vòng chính + 4 vòng subagent độc lập).

**Mục tiêu:** Sửa lỗi tồn đọng và bổ sung toàn bộ các tính năng cốt lõi cùng với các tính năng nền tảng (Web & Win) của ứng dụng ôn thi TNDNB (Ngoại trừ tính năng 20 - Quản lý phòng máy, để lại nghiên cứu sau).
**Tiêu chuẩn:** Áp dụng chuẩn Double-Sync.

## Cấu Trúc Phase

*   **[Phase 01: Setup](./phase-01-setup.md)**
    *   Tạo branch mới cho Đợt 1+2.
    *   Review cấu trúc project và chuẩn bị môi trường.
*   **[Phase 02: Bug Fixes](./phase-02-fix-bugs.md)**
    *   Sửa lỗi hiển thị sai trạng thái "KHÔNG ĐẠT" khi đạt điểm tối đa (Bug 1).
    *   Sửa lỗi không hiển thị tên học viên ở màn hình kết quả (Bug 2).
*   **[Phase 03: Core Features](./phase-03-core-features.md)**
    *   Tính năng 1: Luyện lại câu sai.
    *   Tính năng 4: Báo cáo tiến bộ theo chủ đề.
    *   Tính năng 7: Tìm kiếm câu hỏi.
    *   Tính năng 8: Nhắc học mỗi ngày + Streak.
    *   Tính năng 11: Phím tắt khi làm bài.
*   **[Phase 04: Platform Integrations](./phase-04-desktop-integrations.md)**
    *   Tính năng 12: Cài như app + thông báo đẩy (PWA Web).
    *   Tính năng 15: Nằm khay hệ thống (System Tray - Win).
    *   Tính năng 16: Phím tắt toàn cục (Global Shortcut - Win).
    *   Tính năng 17: Gói đề offline tự cập nhật ngầm (Win).
    *   Tính năng 19: Chuyển đổi Fullscreen / Window (Win).
*   **[Phase 05: Testing](./phase-05-testing.md)**
    *   Kiểm thử tính năng trên Web.
    *   Kiểm thử trên Windows (Electron).
    *   Đóng gói (Build) và Release.

*(Ghi chú: Tính năng 20 - Quản lý phòng máy PoC tạm thời không đưa vào kế hoạch triển khai lần này, sẽ nghiên cứu thêm)*

---
**Quy trình Double-Sync:**
- **Code -> Plan:** Khi code có thay đổi cấu trúc hoặc phát sinh vấn đề mới, cập nhật lại checklist trong phase tương ứng.
- **Plan -> Code:** Luôn bám sát checklist để implement, hoàn thành bước nào đánh dấu bước đó trong `task.md`.

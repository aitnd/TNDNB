# 💡 BRIEF: Kế hoạch tính năng mới — App ôn tập TNDNB (Web + Win)

**Ngày:** 2026-09-17 | **Nguồn:** research app ôn thi 2026 + yêu cầu từ người dùng.

> Quy ước độ khó: 🟢 dễ (tận dụng đồ có sẵn) · 🟡 trung bình · 🔴 tốn công/rủi ro.

---

## A. Lỗi tồn đọng cần xử lý gấp (Bugs)
- **Bug 1:** Màn hình lịch sử làm bài báo "KHÔNG ĐẠT" dù học viên đạt điểm tối đa (ví dụ 30/30). (Nguyên nhân có thể do logic đối chiếu điểm chuẩn theo hạng bằng đang sai).
- **Bug 2:** Màn hình kết quả điểm sau mỗi bài thi thử hoặc ôn tập không hiện tên học viên.

---

## B. Tính năng CHUNG (làm 1 lần, chạy cả 2 app)

### B1. Chuyên môn (giúp thi đỗ)

| # | Tính năng | Vì sao đáng làm | Độ khó | Logic xử lý | Trạng thái |
|---|-----------|-----------------|--------|-------------|------------|
| 1 | **Luyện lại câu sai** | Dữ liệu lịch sử đã lưu sẵn | 🟢 | Dùng hook gom ID các câu sai từ lịch sử thi, tạo thành mảng đề mới. Nếu làm đúng thì xoá ID khỏi danh sách. | ▶️ **Đang làm (Plan hiện tại)** |
| 4 | **Báo cáo tiến bộ theo chủ đề** | Thư viện vẽ biểu đồ đã có sẵn | 🟢 | Truy xuất dữ liệu điểm Supabase/Local, tính % theo chương, render biểu đồ bằng thư viện Chart hiện tại. | ▶️ **Đang làm (Plan hiện tại)** |
| 7 | **Tìm kiếm câu hỏi** | JSON ngân hàng câu hỏi có sẵn local | 🟢 | Dùng hàm `filter()` text search trực tiếp trên file JSON offline, hiển thị dạng list. | ▶️ **Đang làm (Plan hiện tại)** |

### B2. Trải nghiệm (giữ chân học viên)

| # | Tính năng | Vì sao đáng làm | Độ khó | Logic xử lý | Trạng thái |
|---|-----------|-----------------|--------|-------------|------------|
| 8 | **Nhắc học mỗi ngày + streak** | Tăng tỷ lệ mở app | 🟢 | Lưu cài đặt giờ của user. Dùng trigger gửi Push Notification (Web) hoặc OS Notification (Win). | ▶️ **Đang làm (Plan hiện tại)** |
| 11 | **Phím tắt khi làm bài** | Bỏ chuột = làm nhanh gấp đôi | 🟡 | Mặc định: Trái/Phải qua câu, A/B/C/D hoặc Numpad 1/2/3/4 chọn đáp án. Thêm UI cài đặt để user tuỳ chỉnh (lưu config ở local). | ▶️ **Đang làm (Plan hiện tại)** |

---

## C. Tính năng RIÊNG bản WEB (trình duyệt)

| # | Tính năng | Ghi chú | Logic xử lý | Trạng thái |
|---|---|---|---|---|
| 12 | **Cài như app + thông báo đẩy (PWA)** | 🟢 Chuẩn web hiện đại | Cấu hình file `manifest.json` và Service Worker để máy cho phép cài icon ra màn hình chính. | ▶️ **Đang làm (Plan hiện tại)** |

---

## D. Tính năng RIÊNG bản WIN (Electron, máy tính)

| # | Tính năng | Ghi chú | Logic xử lý | Trạng thái |
|---|---|---|---|---|
| 15 | **Nằm khay hệ thống (System Tray)** | 🟢 Kéo user dùng mỗi ngày | Gọi API `Tray` của Electron, thu nhỏ UI ẩn đi thay vì thoát app hoàn toàn. | ▶️ **Đang làm (Plan hiện tại)** |
| 16 | **Phím tắt toàn cục** | 🟢 Gọi app cực nhanh | Đăng ký `globalShortcut` trong Electron main process để bung cửa sổ app lên ngay lập tức. | ▶️ **Đang làm (Plan hiện tại)** |
| 17 | **Gói đề offline tự cập nhật ngầm** | 🟡 Cập nhật ngầm khi Supabase có sửa đổi bộ đề | Theo dõi version/timestamp đề trên Supabase. Nếu có thay đổi, background worker sẽ tự tải và đè file JSON local. | ▶️ **Đang làm (Plan hiện tại)** |
| 19 | **Chuyển đổi Fullscreen / Window** | 🟢 Tăng tập trung | Bắt sự kiện F11/nút bấm, gọi `win.setFullScreen()` qua IPC nối tới UI. | ▶️ **Đang làm (Plan hiện tại)** |
| 20 | **Tính năng quản lý cục bộ (Phòng máy)** | 🔴 Quản lý được máy con | Cần dựng Master Socket/LAN Server, các máy con kết nối vào báo cáo trạng thái đang thi, điểm số... | ⏳ Cần nghiên cứu thêm |

---

## E. Tạm chưa nên làm
- **AI tự sinh đề mới** — tốn phí API + phải kiểm duyệt từng câu.
- **Thi đấu trực tuyến nhiều người** — vui nhưng tốn hạ tầng realtime.
- **Video bài giảng trong app** — chi phí nội dung lớn, nên link ra ngoài.

---

## F. Đề xuất thứ tự & Chi tiết kiến trúc (Smart Proposal Đã Cập Nhật)

**Gộp Tất Cả: Fix Bug, Nhu cầu cốt lõi & Nâng cấp toàn diện [▶️ ĐANG THI CÔNG]**
*(Chi tiết các task & phase đang được triển khai tại: [Plan Hiện Tại](file:///d:/Antigravity/TNDNB/docs/plans/260917-0906-dot-1-2-tinh-nang-moi/plan.md))*
*   **0. Sửa lỗi tồn đọng:** Fix lỗi báo "KHÔNG ĐẠT" và hiển thị tên học viên ở màn hình kết quả.
*   **1. Luyện lại câu sai (Core Value):** App tự gom các câu trả lời sai từ bài thi trước thành một đề riêng.
*   **4. Báo cáo tiến bộ (Motivation):** Dashboard nhỏ hiện biểu đồ điểm số, tỷ lệ % yếu/kém theo từng chương, và số ngày học liên tiếp (Streak).
*   **7. Tìm kiếm câu hỏi:** Ô tìm kiếm (Search bar) trực tiếp vào JSON ngân hàng câu hỏi.
*   **8+15. Nhắc học mỗi ngày & Khay hệ thống Win:** User tự đặt giờ nhắc, nhận thông báo qua Push Notification (Web) hoặc System Tray (Win).
*   **11. Phím tắt làm bài:** Dùng mũi tên và A/B/C/D để thao tác siêu tốc trên Desktop.
*   **12. Cài như app (PWA - Web):** Tích hợp Manifest + Service Worker để cài ra màn hình chính, nhận push.
*   **16. Phím tắt toàn cục (Win):** Đăng ký phím tắt hệ thống gọi app lên nhanh.
*   **17. Gói đề offline tự cập nhật ngầm:** Win app theo dõi version đề trên Supabase và tải file JSON ngầm khi có bản mới.
*   **19. Nút Fullscreen / Window (Win):** Hỗ trợ chuyển đổi toàn màn hình cho app Electron.

*Kiến trúc kỹ thuật:*
- Tách riêng tính năng System Tray, Fullscreen, Background Sync, Global Shortcut cho Electron.
- Viết chung các logic gom câu sai, filter tìm kiếm thành core hooks cho cả Web lẫn Win.
- Cấu hình PWA độc lập cho bản Web.

**Các tính năng R&D (Nghiên cứu thêm)**
- Khảo sát và xây dựng PoC cho cơ chế "Quản lý cục bộ như phòng máy" (tính năng 20) bằng Socket LAN Server.

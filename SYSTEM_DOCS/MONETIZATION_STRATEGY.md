# 💰 Hướng Dẫn Chiến Lược Monetization (Proxy SDK)

Tài liệu này hướng dẫn việc kiếm tiền từ hạ tầng ứng dụng thông qua việc chia sẻ băng thông (Proxy SDK).

---

## 1. Bảng So Sánh Chiến Lược Cho Cấp Quản Lý

| Tiêu chí | **Bright Data (Bright SDK)** | **Honeygain (Swarmbytes)** | **Peer2Profit (P2P)** |
|:---:|:---:|:---:|:---:|
| **Phân khúc** | **Enterprise** (Chuyên nghiệp) | **Consumer** (Phổ thông) | **High-Risk** (Rủi ro cao) |
| **Cơ chế trả tiền** | Trả theo User hoạt động (DAU) | Trả theo dung lượng ($0.1-$0.2/GB) | Trả theo dung lượng (~$0.8/GB) |
| **Độ an toàn App** | **Rất cao** (Sạch nhất thị trường) | **Trung bình** (Dễ bị Google quét) | **Rất thấp** (Coi như Malware) |
| **Yêu cầu xét duyệt** | Khắt khe (App >10k Install) | Dễ (Tích hợp ngay) | Không xét duyệt |
| **Chiến lược đề xuất** | **Dùng cho App chính trên Store** | Dùng cho App phụ / Tiện ích | Chỉ dùng cho máy farm riêng |

---

## 2. Kế Hoạch Triển Khai (Step-by-Step)

### Bước 1: Phân Loại Tài Nguyên (Segmentation)
Trợ lý cần phân loại danh sách App hiện có thành 2 nhóm để áp dụng SDK phù hợp:
*   **Nhóm A (App Clean)**: Đang có trên Google Play / App Store.
    *   👉 **Hành động**: Chỉ liên hệ tích hợp **Bright Data**.
*   **Nhóm B (App Rác / App Mod / APK)**: Phân phối qua web, không quan trọng thương hiệu.
    *   👉 **Hành động**: Tích hợp **Honeygain** hoặc **Peer2Profit** để "vắt" tối đa lợi nhuận.

### Bước 2: Thiết Kế Luồng "Sự Đồng Ý" (Consent Flow) - ⚠️ BẮT BUỘC
Để tránh bị xóa App, trợ lý cần yêu cầu Dev thiết kế màn hình thông báo khi mở App:
*   **Lựa chọn 1**: Dùng App có quảng cáo (AdMob).
*   **Lựa chọn 2**: Dùng App không quảng cáo nhưng chia sẻ một phần băng thông (Proxy SDK).
*   ❌ **Lưu ý**: Tuyệt đối **không tích hợp chạy ngầm** mà không thông báo, App sẽ bị khóa tài khoản trong vòng 48h.

### Bước 3: Tích Hợp Kỹ Thuật (Technical Integration)
*   **Với Bright Data**: Yêu cầu trợ lý đăng ký tài khoản doanh nghiệp và thực hiện KYC (xác minh danh tính). SDK này yêu cầu cấu hình kỹ hơn để đảm bảo không vi phạm chính sách Google.
*   **Với Honeygain**: Lấy API Token và nhúng vào `build.gradle` (Android) hoặc thư viện tương ứng.

### Bước 4: Theo Dõi & Tối Ưu (Monitoring)
*   Thiết lập Dashboard theo dõi **Tỷ lệ gỡ App (Uninstall Rate)**.
*   Nếu sau khi tích hợp SDK mà tỷ lệ gỡ app tăng **>20%**, phải giảm mức độ sử dụng băng thông hoặc gỡ bỏ SDK ngay lập tức.

---

## 3. Chỉ Thị Cho Trợ Lý (Task List)

- [ ] **Nghiên cứu kỹ Bright Data**: Liên hệ Support của họ để hỏi về gói "SDK monetization" cho khu vực Việt Nam. Đây là ưu tiên số 1 cho sự bền vững.
- [ ] **Test thử Peer2Profit trên thiết bị cô lập**: Tuyệt đối **không cài P2P trên máy tính cá nhân của công ty**. Dùng một dàn điện thoại cũ (Android 10 trở xuống) để test mức độ ngốn pin và độ nóng máy.
- [ ] **Báo cáo doanh thu hàng tuần**: So sánh giữa `$ Doanh thu / 1000 User` để xem bên nào đang trả "thơm" nhất tại thị trường mục tiêu.

---

## 4. Cảnh Báo Quan Trọng (Chủ Sở Hữu Cần Biết) ⚠️

> [!WARNING]
> **Peer2Profit** hiện đang bị nhiều trình duyệt chặn do nguồn gốc traffic không minh bạch. Nếu dùng bên này, hãy chuẩn bị sẵn tinh thần là App/Domain của anh sẽ bị gắn cờ "Lừa đảo/Malware".

> [!TIP]
> **Bright Data** là bên duy nhất có thể giúp anh "đi đường dài" và có thể lên sàn chứng khoán hoặc bán lại App sau này vì tính hợp pháp cao.

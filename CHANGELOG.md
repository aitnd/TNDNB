## [3.21.0] - 2026-11-04
### Tính năng mới & Nâng cấp Hạ tầng Cloudflare Offline-First (Web, App Win & Portal)
- **Hạ tầng Ảnh Cloudflare R2 CDN:** Toàn bộ 280+ ảnh câu hỏi sát hạch được phân phối qua mạng biên Cloudflare R2 CDN tốc độ cao, hỗ trợ PWA offline pre-caching tải siêu tốc ngay cả khi mất mạng.
- **Dữ liệu Offline-First (Cloudflare D1 & Dexie):** Đồng bộ cơ sở dữ liệu câu hỏi và phân hạng giấy phép thông qua Cloudflare D1, lưu trữ cục bộ với IndexedDB (Dexie) giúp ôn tập và thi thử ngoại tuyến 100% mượt mà.
- **Tăng tốc Cập nhật App Windows:** Tích hợp Worker CDN Proxy giúp tải bản cài đặt `.exe` mới nhất cực nhanh, khắc phục triệt để tình trạng nghẽn mạng tải từ GitHub Releases.
- **Thiết kế Cổng thông tin Editorial Báo chí:** Tái thiết kế toàn diện Cổng thông tin đào tạo theo chuẩn Editorial báo chí (N6 Masthead 3 tầng, H2 Split Diptych tiêu điểm và bản tin học vụ đánh số 01..04, loại bỏ hoàn toàn các nút tiện ích và phong cách AI-slop).
- **Tách luồng triển khai Monorepo:** Ứng dụng `ontap-web` triển khai độc lập trên Cloudflare Pages (băng thông unmetered), Cổng thông tin Next.js Root Portal vận hành tối ưu trên Vercel.

## [3.19.3] - 2026-09-22
### Tính năng mới & Khắc phục lỗi (Web & App Win)
- **Tính năng Giám khảo (Win):** Đưa tính năng phòng thi Giám Khảo có mặt trên ứng dụng Windows, đồng bộ đầy đủ trải nghiệm thi với bản Web.
- **Sửa lỗi Đồng bộ:** Khắc phục lỗi sai thứ tự câu hỏi và danh mục khi tải dữ liệu ôn tập (Offline Sync). Dữ liệu sẽ tự động được làm mới chính xác.

## [3.19.2] - 2026-09-20
### Tối ưu Hiển thị & Nâng cấp Hệ thống (Web & App Win)
- **Sửa lỗi giao diện:** Khắc phục lỗi thanh điều hướng che khuất nội dung, loại bỏ thanh cuộn thừa ở trang kết quả giúp xem mượt mà hơn.
- **Tối ưu Bảng đáp án:** Bảng chọn đáp án Ôn tập & Thi thử được tinh chỉnh để dễ nhìn hơn, tối ưu tương tác trên cả máy tính và điện thoại.
- **Tiện ích hệ thống (Win):** Bổ sung menu chuột phải (Tray Icon) cho phép bật tắt "Khởi động cùng Windows" và kiểm tra cập nhật nhanh.
- **Cập nhật nhanh & An toàn hơn:** Cơ chế kiểm tra phiên bản mới được tối ưu hoá, đảm bảo người dùng luôn nhận bản cập nhật ổn định nhất.

## [3.19.1] - 2026-09-19
### Kh?c ph?c C?p nh?t (Web & App Win)
- **Check Update T?c Th�:** Kh?c ph?c l?i hi?n th? sai phi�n b?n m?i nh?t. ?ng d?ng nay l?y d? li?u c?p nh?t tr?c ti?p t? M�y ch? ��m m�y (Supabase) thay v� d?c file tinh c?c b?.
- **Admin K�o Th?:** Ra m?t c�ng c? K�o-Th? qu?n l� ?ng d?ng cho Admin, gi�p d�ng g�i v� ph�t h�nh d? d�ng hon bao gi? h?t.



## [3.15.6] - 2026-06-30
### T?i uu ho� ?ng d?ng
- **C?i thi?n d? ?n d?nh:** T?i uu ho� c?u tr�c h? th?ng gi�p ?ng d?ng ch?y nh? nh�ng v� ?n d?nh hon.
## [3.15.5] - 2026-06-30
### Khắc phục lỗi hiển thị thời tiết & Tối ưu hóa hệ thống (Web & App Win)
- **Thời tiết local**: Đồng bộ hóa múi giờ thực tế của học viên (+7) thay vì sử dụng múi giờ UTC của máy chủ, đảm bảo hiển thị đúng giờ Việt Nam tại mọi thời điểm trong ngày.
- **Giao diện thời tiết**: Khắc phục lỗi ẩn tooltip trạng thái kết nối bằng cách loại bỏ giới hạn tràn (overflow) trên phần tử bao ngoài, đồng thời tăng kích thước biểu tượng trạng thái để tăng tính trực quan.
- **Tối ưu hiệu năng**: Tái cấu trúc luồng tải và điều hướng ứng dụng giúp khởi động nhanh hơn, tiết kiệm bộ nhớ và hoạt động ổn định trên mọi thiết bị.
- **Độ ổn định hệ thống**: Khắc phục triệt để các xung đột ngầm và dọn dẹp mã nguồn dư thừa.

## [3.15.4] - 2026-06-30
### Cập nhật hệ thống Quản trị & Khắc phục lỗi Phát hành (Web & App Win)
- **Tự động hóa phát hành**: Sửa lỗi gián đoạn khi phát hành ứng dụng trùng tên hoặc trùng thẻ phiên bản (hệ thống tự động đồng bộ hóa và dọn dẹp các thẻ Git Tag cũ trên GitHub).
- **Trực quan hóa cài đặt**: Nâng cấp Giao diện Quản lý Hệ thống dành cho Admin, tích hợp chỉ báo màu sắc nổi bật và thẻ cảnh báo khi tắt các dịch vụ phụ trợ nhằm nâng cao trải nghiệm vận hành.

## [3.15.3] - 2026-06-30
### Sửa lỗi hiển thị Huy hiệu Admin & Tối ưu hóa xác thực Quảng cáo (Web & App Win)
- **Huy hiệu Admin:** Khắc phục lỗi ẩn Huy hiệu đặc quyền (vương miện lấp lánh 👑) của Admin/Lãnh đạo trên Thẻ giáo viên, thanh TopNavbar góc phải và trang Hồ sơ cá nhân.
- **Xác thực hệ thống:** Cải tiến kỹ thuật nhúng liên kết đối tác trên Portal Next.js dưới dạng thẻ script HTML tĩnh thô trực tiếp trong head, giúp hệ thống bên ngoài dễ dàng quét và xác minh.

## [3.15.2] - 2026-06-30
### Cập nhật hệ thống chỉ báo thời tiết & Tối ưu hóa hạ tầng (Web & App Win)
- **Chỉ báo thời tiết:** Thêm icon chỉ báo động (Tín hiệu kết nối) và Tooltip chi tiết tại góc giao diện thời tiết để hiển thị rõ nguồn dữ liệu (Đang tải trực tiếp, Ước tính từ hệ thống, hoặc Mất kết nối tạm thời).
- **Hạ tầng:** Tối ưu hóa luồng tải mã nguồn và cải thiện tốc độ kết nối hệ thống.

## [3.15.1] - 2026-06-30
### Cập nhật hệ thống (Web & App Win)
- **Thời tiết mở rộng:** Nâng cấp widget thời tiết hiển thị chi tiết 8 mốc thời gian (thay vì 5) dựa trên API thực tế hoặc giờ động của máy học viên.
- **Giao diện thời tiết:** Tinh chỉnh bảng màu Zinc/Slate trung tính theo thiết kế mới, thay đổi thiết kế phần Lời khuyên (Advice) loại bỏ biểu tượng emoji thô sơ, thay bằng Banner Alert phối màu tinh tế tự động thích ứng với thời tiết.
- **Hiệu ứng mượt mà:** Bổ sung hiệu ứng Spring Hover nhẹ cho các thẻ giờ và ẩn scrollbar ngang tối giản.
- **Hạ tầng:** Tối ưu hóa và cập nhật hạ tầng để tăng tốc độ tải trang và độ ổn định của ứng dụng.

## [3.15.0] - 2026-06-29
### Nâng cấp Giao diện Quản lý Lớp học thông minh (Web & App Win)
- **Giao diện thẻ thông minh (Smart Cards):** Thay đổi giao diện danh sách lớp học sang dạng thẻ hiện đại, hỗ trợ hiển thị ảnh đại diện (avatar) của giáo viên chủ nhiệm.
- **Thanh thống kê (Insights Bar):** Bổ sung thanh thống kê trực quan hiển thị tổng quan số lượng học viên, số lượt thi thử và các chỉ số quan trọng khác trực tiếp trên màn hình quản lý.
- **Bộ lọc nâng cao:** Thêm chức năng lọc nhanh lớp học theo trạng thái (Đang hoạt động / Đã kết thúc) và hỗ trợ chuyển đổi linh hoạt giữa chế độ xem Lưới và Danh sách.
- **Đồng bộ hóa 100%:** Đảm bảo toàn bộ trải nghiệm giao diện quản lý lớp học mới hoạt động mượt mà trên cả nền tảng Web và ứng dụng Windows.

## [3.14.0] - 2026-06-29
### Hoàn thiện Hệ thống Huy hiệu & Tự động hóa
- **Giao diện Quản lý Huy hiệu:** Tích hợp giao diện quản lý huy hiệu 3D chuyên nghiệp vào phần Quản lý Học viên và Quản lý Lớp (Web & App Win), cho phép Giáo viên và Lãnh đạo cấp/thu hồi huy hiệu dễ dàng.
- **Tự động nhận huy hiệu:** Học viên tự động được theo dõi tiến độ và nhận huy hiệu ngay sau khi nộp bài Ôn tập và Thi thử thành công.
- **Đồng bộ hóa 100%:** Đảm bảo hệ thống hoạt động thống nhất và ổn định trên cả phiên bản Web và ứng dụng Windows.

## [3.13.0] - 2026-06-29
### Tích hợp Hệ thống Huy hiệu & Tối ưu hóa Tạo/Import Học viên (Web & App Win)
- **Hệ thống Huy hiệu (Badge System):** Ra mắt tính năng tích lũy huy hiệu danh dự khi hoàn thành xuất sắc các bài thi và ôn luyện trực tuyến. Bổ sung huy hiệu chức danh (Admin, Giáo viên, Học viên) hiển thị trên thanh điều hướng và Thẻ học viên.
- **Tái sử dụng tài khoản an toàn:** Hỗ trợ quy trình dọn dẹp sạch sẽ toàn bộ kết quả thi và huy hiệu cũ khi tái sử dụng SBD cũ cho học viên khóa mới, giúp tối ưu cơ sở dữ liệu.
- **Import Excel thông minh:** Bổ sung giao diện kiểm tra trùng lặp trước khi import. Hiển thị bảng đối chiếu học viên cũ vs học viên mới kèm cảnh báo bảo mật 2 lớp khi ghi đè tài khoản đang hoạt động.
- **Dọn dẹp code:** Sửa lỗi thiếu tệp bỏ qua bảo mật và xóa bỏ toàn bộ mã nguồn dư thừa nhằm tăng tốc độ tải trang.

## [3.12.2] - 2026-06-29
### Tối ưu hóa Giao diện Nửa Trên Dashboard & Thanh Điều Hướng TopNavbar (Web & App Win)
- **Tối ưu không gian hiển thị:** Đưa thanh thông tin thời tiết và trạng thái hệ thống vào chung một hàng ngang (Slim Banner Header), thu gọn khoảng trắng đứng giúp các nút bấm chức năng chính hiển thị trọn vẹn ngay trong khung nhìn đầu tiên.
- **Tinh gọn thanh điều hướng:** Gom các nút chức năng quản lý trùng lặp trên TopNavbar vào menu thả xuống "Hệ thống" gọn gàng, mang lại trải nghiệm làm việc thông thoáng và chuyên nghiệp.

## [3.12.1] - 2026-06-29
### Tối ưu hóa Lịch sử cập nhật (Web & App Win)
- **Tập trung nội dung**: Cập nhật popup thông tin phiên bản chỉ hiển thị duy nhất nội dung của bản cập nhật mới nhất, giúp giao diện gọn gàng và dễ theo dõi hơn.
- **Đồng bộ hóa các bản cũ**: Bổ sung số phiên bản chuẩn vào tất cả các đề mục cập nhật cũ trong quá khứ.

## [3.12.0] - 2026-06-29
### Cập nhật hệ thống bảo trì & Nâng cao trải nghiệm học tập
- **Tính năng:** Nâng cấp hệ thống bảo trì thông minh độc lập cho từng nền tảng (Portal, Web, Windows App) giúp giảm thiểu tối đa thời gian gián đoạn học tập của học viên.
- **Trải nghiệm:** Tách biệt và tối ưu hóa giao diện màn hình thông báo bảo trì, bổ sung bộ đếm ngược thời gian thực và tự động tải lại trang khi hoàn tất.
- **Bảo mật:** Nâng cấp hệ thống tường lửa bảo mật, phòng chống các hành vi truy cập bất thường làm nghẽn băng thông hệ thống.
- **Hiệu năng:** Tối ưu hóa tốc độ tải trang chủ và cải tiến bảng điều khiển cấu hình hệ thống đồng bộ.

# Changelog
## [3.11.0] - 2026-06-29
### Tối ưu hóa trải nghiệm tương tác & Nâng cấp hệ thống ôn luyện
- **Trải nghiệm chờ thông minh:** Bổ sung màn hình chờ đếm ngược trước khi xem kết quả thi để đảm bảo các tiến trình lưu điểm thi diễn ra an toàn, tránh mất mát dữ liệu do ngắt kết nối đột ngột.
- **Cải tiến giao diện:** Tối ưu hóa luồng tải tài liệu và cải thiện tốc độ chuyển trang trên trang chủ tin tức.
- **Bảo trì:** Bổ sung hiển thị thông tin dự kiến bảo trì khi hệ thống cập nhật lớn.

## [3.10.9] - 2026-06-29
### Chặn Route Nghiêm Ngặt & Bộ Đếm Ngược Bảo Trì (Web & App Win)
- **Chặn route 2 lớp bảo mật:** Thêm component `ProtectedRoute` bọc các route nhạy cảm. Vá hoàn toàn 4 lỗ hổng bảo mật route admin (class-manager, usermanager, settings, exam-manager) hiện tại chỉ check đăng nhập mà không check vai trò.
- **Security Rules Firestore:** Thiết kế và lưu trữ file `firestore.rules` tại thư mục root để quản trị, kiểm soát quyền truy cập collections ở tầng Server-side.
- **Bộ đếm ngược thời gian thực (Real-time Maintenance Countdown):** Tích hợp custom hook `useCountdown` để tự động tính thời gian chênh lệch từng giây trên màn hình bảo trì `MaintenanceScreen` (Web & Win).
- **Giao diện countdown Glassmorphism:** Hiển thị thời gian bảo trì còn lại trực quan dưới dạng 4 ô glassmorphic tinh tế (Ngày/Giờ/Phút/Giây) với hiệu ứng số chạy mượt mà, tự động chuyển đổi sang nút "Tải lại trang" và tự động reload trang sau 10 giây khi hoàn tất bảo trì.
- **Cấu hình admin tiện ích:** Bổ sung input datetime picker `maintenanceEndTime` (ISO 8601) vào trang cài đặt hệ thống `UsageConfigPanel` của admin để cấu hình đếm ngược chính xác, giữ nguyên cơ chế text fallback nếu admin không cài đặt giờ cụ thể.

## [3.10.8] - 2026-06-27
### Cải tiến Giao diện Bảo trì, Phân quyền Dashboard Học Viên & Tối Ưu WeatherWidget (Web & App Win)
- **Hoạt họa Gears lướt sóng cực đẹp:** Khắc phục triệt để lỗi ghi đè transform của Framer Motion bằng cách bọc thẻ bánh răng vào thẻ div tĩnh, đồng thời thêm hiệu ứng cờ lê lơ lửng và tự lắc lư (Wobble) cực sinh động.
- **Cấu hình động 3 cột từ Settings:** Thêm các ô nhập liệu Thời gian dự kiến, Thông tin dữ liệu và Liên hệ hỗ trợ tại trang `/ontap/settings`.
- **Nâng cấp trang bảo trì tĩnh:** Trang bảo trì tĩnh `maintenance.html` được nâng cấp với giao diện gears mới và script kéo cấu hình động trực tiếp từ Firestore REST API của dự án `thi-tnd`.
- **Phân quyền Dashboard Học viên:** Ẩn các ô thao tác nhanh **Thông báo** và **Thống kê** trên Dashboard của học viên, đồng thời chặn quyền truy cập trực tiếp bằng URL đối với hai trang này (tự động chuyển hướng về Dashboard nếu học viên cố tình nhập URL).
- **Tối ưu hóa WeatherWidget hoạt động mọi nơi:** Tự động sử dụng API production của domain `https://daotaothuyenvien.com` khi chạy local/dev/offline và bổ sung cơ chế nạp dữ liệu thời tiết giả lập (mock fallback) nếu API lỗi để widget luôn hiển thị ổn định.

## [3.10.7] - 2026-06-27
### Tối ưu Vitest, vá bảo mật overrides & Đồng bộ điều hướng Dashboard (Web & App Win)
- **Tối ưu hóa chạy Vitest:** Thêm tùy chọn `fileParallelism: false` vào cấu hình kiểm thử của cả bản Web và Windows để tránh lỗi treo/timeout worker pool trên Windows, giúp giảm thời gian chạy test từ ~70s xuống còn 4.5s.
- **Vá bảo mật (Dependency Overrides):** Áp dụng cơ chế overrides ở root để vá hoàn toàn các lỗ hổng bảo mật Critical & High (protobufjs, protobufjs-cli, tar, uuid, fast-xml-parser, postcss, glob, @grpc/grpc-js).
- **Đồng bộ điều hướng Dashboard:**
  - Nút **Thông báo**: Chuyển hướng từ `/ontap/mailbox` sang trang quản lý thông báo `/ontap/notifications` (Web & Win).
  - Nút **Cấu hình**: Chuyển hướng từ `/ontap/profile` sang trang cài đặt `/ontap/settings` (Win).
- **Gộp cấu hình an toàn:** Gộp cấu hình bảo mật vào tab "Bảo vệ hệ thống", cấu hình tần suất và chu kỳ kiểm tra thông tin chung trên toàn hệ thống.

## [3.10.6] - 2026-06-26
### Tích hợp Widget Thời tiết & Tối ưu hóa hình ảnh (Web & App Win)
- **Tính năng mới - Widget Thời tiết Thông minh:**
  - Tự động định vị người dùng (Browser Geolocation) hoặc tự động fallback về Triệu Việt Vương, phường Hoa Lư, Ninh Bình nếu bị từ chối quyền định vị.
  - Tích hợp API Next.js `/api/weather` (WeatherAPI với cơ chế Mock fallback) để lấy dữ liệu thời tiết thực tế.
  - Hiển thị nhiệt độ, trạng thái thời tiết hiện tại kèm theo lời khuyên học tập, thi cử sinh động bằng tiếng Việt.
  - Bổ sung nút mở rộng để xem dự báo thời tiết chi tiết trong ngày, ngày mai và dự báo 7 ngày.
  - Đồng bộ giao diện widget thích ứng Mobile và hỗ trợ đầy đủ Light/Dark Mode trên cả Web và App Windows.
- **Tối ưu hình ảnh Portal:** Thay thế thẻ `<img>` bằng component `<Image>` của Next.js để tăng tốc độ tải trang và giải quyết triệt để 22 cảnh báo linting.
- **Tối ưu hình ảnh App Web & Win:** Bổ sung thuộc tính `loading="lazy"` and `alt` cho toàn bộ thẻ `<img>` trên ứng dụng Vite của cả Web và Windows.
- **Sửa lỗi cú pháp:** Sửa lỗi trùng lặp thuộc tính `style` trong component `StudentClassView.tsx` phát sinh từ quá trình refactor trước đó.

## [3.10.5] - 2026-06-25
### Tối ưu hóa tải trang & Bảo vệ hệ thống (Web & App Win)
- **Tối ưu tải tài nguyên:** Cải tiến cơ chế tải các luồng tài nguyên phụ trợ để tối ưu hóa hiển thị dữ liệu và tốc độ phản hồi trên thiết bị.
- **Nâng cấp bảng điều khiển:** Quản trị viên có thể tùy chỉnh giới hạn chu kỳ kiểm tra và thời gian làm mới trực tiếp từ màn hình "Hệ thống" thay vì cấu hình tĩnh.

## [3.10.4] - 2026-06-25
### Hệ Thống Bảo Trì 2 Tầng (Web & App Win)
- **Tính năng 1:** Tích hợp chế độ bảo trì Mềm (Tầng 1) vào App Windows, đồng bộ trạng thái khóa màn hình với Web.
- **Tính năng 2:** Thêm trang bảo trì Cứng (Tầng 2) dùng Vercel Edge Config cho Web.
- **Sửa lỗi 1:** Sửa các cảnh báo bảo mật High severity (npm audit fix) cho Web.
- **Bảo mật:** Cho phép role admin bypass màn hình bảo trì qua route /ontap/login-admin.

## [3.10.1] - 2026-06-25
### Tách biệt Module Quản lý Thành viên & Refactor Account Screen (Web & App Win)
- **Trang Quản lý thành viên riêng biệt (`/ontap/usermanager`):**
  - Tách toàn bộ bảng danh sách, bộ lọc, tìm kiếm và phân trang người dùng ra khỏi trang cá nhân thành một trang quản trị chuyên biệt mới.
  - Tích hợp Slide-over Panel xem chi tiết và danh sách thiết bị/phiên đăng nhập để force logout từ xa.
  - Thiết kế 3 thẻ KPI Stats tổng quan tài khoản (Học viên, nhân sự, bị khóa) hiển thị tĩnh ở đầu trang, tối ưu hóa Firestore Read Call.
- **Refactor `AccountScreen` cá nhân:**
  - Dọn dẹp hoàn toàn logic và giao diện quản trị thành viên cũ trong `AccountScreen.tsx` ở cả Web và Windows App (code giảm từ ~809 dòng xuống còn ~250 dòng).
  - Tích hợp danh sách phiên đăng nhập hoạt động của chính cá nhân (`AdminSessionList`) hiển thị trực tiếp ở cuối trang hồ sơ để nâng cao trải nghiệm bảo mật tự phục vụ.
- **Tích hợp Dashboard & Quick Actions:**
  - Cập nhật `QuickActionsGrid.tsx` và `Dashboard.tsx` thêm nút **"Quản lý Thành viên"** vào Dashboard admin (Web & Windows).
  - Đăng ký Route `/ontap/usermanager` và map điều hướng trong `App.tsx` ở cả 2 phân hệ.
- **Kiểm thử & Build pass 100%:** Xác thực biên dịch TypeScript (`tsc --noEmit`) và đóng gói `npm run build` thành công trên cả phân hệ Web và Windows.

## [3.10.0] - 2026-06-25
### Tính năng Mới & Redesign Dashboard (Web & App Win)
- **Thiết kế lại Admin Dashboard (Phương án C "Hybrid Smart"):**
  - **AdminStatsBar:** Tích hợp thanh hiển thị thông số online slim realtime trực quan ở trên cùng, thay thế cho OnlineStatsWidget nặng nề.
  - **Giao diện 2 cột thông minh:** 
    - Cột trái: Giữ nguyên thẻ học viên/giáo viên (`StudentCard`) và bổ sung các nút phụ điều hướng nhanh.
    - Cột phải: Lời chào thông minh theo giờ (`WelcomeHeader`), các nút thao tác nhanh dạng grid tiles (`QuickActionsGrid`).
  - **Tối ưu hiệu năng (Lazy Loading):** Tách widget analytics (`CustomAnalyticsWidget`) thành chunk tải chậm (lazy-loaded chunk) chỉ tải khi admin click mở rộng để tiết kiệm băng thông tải trang ban đầu.
  - **Haptic Feedback:** Tích hợp rung phản hồi (haptics) cho các thao tác trên thiết bị di động (bản Web).
- **Đồng bộ hóa Windows App (ontap-win):** Áp dụng toàn bộ cấu trúc thiết kế Dashboard Phương án C sang ứng dụng Windows/Electron để đảm bảo trải nghiệm người dùng nhất quán.
- **Sửa lỗi TypeScript:** Sửa lỗi spread types TS2698 liên quan tới thuộc tính `showPortalAds` trong `UsageConfigPanel.tsx` của bản Windows.

## [3.9.9] - 2026-06-15
- **QA Loop & Khôi phục hệ thống:** Chạy lại quy trình build tích hợp và kiểm tra chất lượng tự động để chuẩn bị phát hành.
- **Sắp xếp cấu trúc code:** Đồng bộ hóa phiên bản build của portal root, ontap-web, và ontap-win thành v3.9.9.

## [3.9.8] - 2026-06-13
### Security Upgrades & Performance Tuning (Web & App Win)
- **Nâng cấp SheetJS an toàn:** Chuyển đổi thành công thư viện đọc/ghi Excel từ `xlsx` (vũ cũ lỗi thời) sang thư viện chính thức bảo mật `@sheetjs/xlsx` (v0.20.2) trên toàn hệ thống (bao gồm cả root portal, ontap-web và ontap-win).
- **Next.js Security Patch:** Nâng cấp Next.js lên bản `14.2.43` tại root và dọn dẹp cài đặt sạch (`clean install`), giải quyết triệt để các lỗ hổng bảo mật dependencies và lỗi môi trường SWC.
- **Tối ưu hóa dung lượng Bundle (Tách Chunk):** Cấu hình manualChunks tách biệt thư viện `@sheetjs/xlsx` thành file chunk riêng `vendor-xlsx-*.js` (488 kB) trong cả hai cấu hình Vite `ontap-web/vite.config.ts` và `ontap-win/vite.config.ts`. File bundle chính `vendor-*.js` giảm từ **1.4 MB** xuống còn **907 kB** (tiết kiệm 35% thời gian tải trang ban đầu).
- **Tối ưu hóa Next.js Image:** Thay thế các thẻ `<img>` cũ bằng `<Image />` tối ưu của Next.js tại 16 vị trí khác nhau trong Next.js Portal (trang bài viết chi tiết, danh mục, giải trí...) để nâng cao chỉ số LCP.
- **Sửa lỗi TypeScript & Unit Test:** 
  - Sửa lỗi spread types TS2698 tại `UsageConfigPanel.tsx`.
  - Khắc phục lỗi thiếu thư viện `@capacitor/local-notifications` bằng cách cập nhật dependency v8.0.1 tại `ontap-web/package.json`.
  - Sửa lỗi cảnh báo `act(...)` bất đồng bộ bằng `waitFor` trong `AccountScreen.test.tsx`, đưa tỷ lệ test pass đạt **100% (5/5 PASS)** sạch cảnh báo.

## [3.9.7] - 2026-06-12
### Portal Management & System Refactor (Web & App Win)
- **Quản lý trang chủ:** Tích hợp tính năng chuyển đổi cấu hình động cho Next.js Portal homepage từ Firestore (settings/usage_config) thông qua component client `PortalAdLoader`.
- **Đồng bộ hóa UI quản trị:** Thêm cấu hình bảng điều khiển cho vai trò Admin và Lãnh đạo.
- **Sửa lỗi ESLint Circular Reference:** Khắc phục lỗi crash lint bằng cách hạ cấp package `eslint-config-next` về `14.2.35` tương thích, dọn dẹp các files cấu hình thừa.
- **Refactor React Hooks:** Sửa triệt để 2 lỗi useEffect missing dependency và useCallback trong `tai-khoan/page.tsx` và `CourseManager.tsx`.
- **Dọn dẹp log rác:** Xóa bỏ log build cũ và tạo template `.env.example` cấu hình môi trường an toàn.
- **Vá bảo mật:** Vá lỗ hổng `@grpc/grpc-js` bằng npm audit fix.

## [3.9.6] - 2026-06-11
### Phân Tách Cấu Hình Ban Lãnh Đạo (Web & App Win)
- **Phân tách cấu hình vai trò:** Phân tách cấu hình giới hạn & quyền lợi giữa **Ban Lãnh Đạo** (`leader`) và **Cán Bộ Quản Lý** (`manager`) thành hai cấu hình độc lập trong database Firestore.
- **Đồng bộ hóa giao diện cấu hình:** Tách nút cấu hình hệ thống thành hai tab riêng biệt: "Ban Lãnh Đạo" (key: `leader`) và "Quản Lý" (key: `manager`).
- **Đồng bộ ánh xạ vai trò:** Cập nhật hàm `getRoleConfigKey` trên toàn bộ hệ thống (bao gồm AccountScreen, ClassManagementScreen và Next.js Portal đăng bài) để nhận diện đúng key `leader` khi vai trò là `lanh_dao`.
- **Sửa lỗi Unit Test:** Khắc phục lỗi kiểu dữ liệu TS2322 cho thuộc tính `role` trong `AccountScreen.test.tsx`.

## [3.9.5] - 2026-06-11
### Trạng thái Tài khoản & Kết thúc Lớp học (Web & App Win)
- **Quản lý trạng thái tài khoản:** Triển khai trạng thái tài khoản (`status: 'active' | 'disabled'`). Chặn đăng nhập và force logout thời gian thực khi tài khoản bị vô hiệu hóa.
- **Trạng thái lớp học:** Thêm trạng thái lớp học (`status: 'active' | 'finished'`). Khi kết thúc lớp học, tự động vô hiệu hóa toàn bộ học viên trong lớp học đó.
- **Quản lý học viên nâng cao:** Thêm chức năng chọn nhiều học viên trong lớp để vô hiệu hóa hàng loạt. Thêm badge hiển thị trạng thái tài khoản và lớp học.
- **Phân quyền động mới:** Thêm phân quyền `courseDisableAccounts` (Vô hiệu hóa tài khoản học viên) và `courseFinish` (Kết thúc / Mở lại lớp học) cho từng vai trò.

## [3.9.4] - 2026-06-11
### Dynamic Permissions & Role Hierarchy (Web & App Win)
- **Hệ thống phân quyền động chi tiết (10 tính năng cốt lõi):** Tích hợp kiểm tra quyền từ cấu hình Firestore (`settings/usage_config`) cho các thao tác quản trị lớp học, người dùng, tin tức và thiết bị.
- **Trọng số vai trò (Role Hierarchy):** Áp dụng logic so sánh trọng số để đảm bảo người dùng chỉ có thể thao tác (Xem, Sửa, Xóa, Đổi vai trò, Force logout) trên các tài khoản có cấp bậc vai trò thấp hơn vai trò hiện tại của chính mình (`admin` (100) > `lanh_dao` (80) > `quan_ly` (60) > `giao_vien` (40) > `hoc_vien` (20) > `guest` (0)).
- **Ẩn/Hiện UI theo phân quyền:**
  - Giáo viên: Tự động ẩn các nút Thêm/Xóa học viên & giáo viên giảng dạy trong giao diện Lớp học (`StudentsTab`, `TeachersTab`) nếu cờ `courseAssignMembers` bị tắt.
  - Quản trị viên & Lãnh đạo: Ẩn nút Sửa (`FaEdit`), Xóa (`FaTrash`), Reset mật khẩu (`FaKey`) đối với tài khoản ngang hàng hoặc cao hơn. Trong giao diện chỉnh sửa, danh sách lựa chọn vai trò mới chỉ hiển thị các vai trò thấp hơn người đang thao tác.
  - Quản lý thiết bị: Ẩn danh sách phiên và nút Đăng xuất từ xa (`AdminSessionList`) đối với tài khoản không thuộc cấp dưới hoặc nếu thiếu quyền `userForceLogoutOthers`.
- **Cơ chế Xóa mềm (Soft Delete) tài khoản:** Thay đổi hành động xóa tài khoản trong Firestore thành Xóa mềm bằng cách cập nhật `status: 'deleted'`. Client khi hoạt động sẽ tự động phát hiện trạng thái này và thực hiện đăng xuất.

## [3.9.3] - 2026-06-11
### Security & Role Authorization (Web & App Win)
- **Bảo mật đề thi động (Chặn Copy, Bôi đen, Chuột phải & Phím tắt):** Tự động áp dụng cấm chuột phải, bôi đen, copy và phím tắt (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong các màn hình thi/làm bài (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dựa trên cấu hình `preventCopy` động của từng vai trò được tải theo thời gian thực từ Firestore.
- **Phân quyền cấu hình động:** 
  - Admin có toàn quyền điều chỉnh giới hạn và chính sách bảo mật của toàn bộ vai trò.
  - Lãnh đạo (`lanh_dao`) được quyền chỉnh sửa cấu hình các vai trò cấp dưới, riêng tab cấu hình của Admin sẽ ở trạng thái Chỉ xem (Read-only) và không cho Lãnh đạo chỉnh sửa.
- **Đồng bộ hóa Route:** Truyền `userProfile` prop vào `UsageConfigPanel` tại Route `/ontap/cauhinh` để xác thực phân quyền chính xác.

## [3.9.2] - 2026-06-11
### Security & Role Authorization (Legacy)
- **Khóa chuột phải bảo mật (App Win & Web)**:
  - Trên App Win (Electron): Khóa chuột phải toàn cục đối với học viên và tài khoản thường để tránh rò rỉ mã nguồn và dữ liệu. Cho phép tài khoản `admin` sử dụng để debug.
  - Trên Web: Khóa chuột phải tại 4 màn hình thi/làm bài và giám khảo (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) để chống gian lận thi cử. Bỏ qua chặn đối với tài khoản `admin`.
- **Đồng bộ tiến độ**: Lưu trữ tiến độ thông qua `/save_brain`, cập nhật handover và dữ liệu bộ nhớ tĩnh/động (`brain.json`, `session.json`).

## [3.8.0] - 2026-03-29
### Fixed
- **Hệ thống Ôn tập Windows (Electron)**: Khắc phục lỗi **Màn hình trắng (ReferenceError: Award is not defined)** bằng cách bổ sung import icon `Award` còn thiếu trong `TopNavbar.tsx`.
- **Ổn định hóa hệ thống**: Đã thực hiện build và kiểm thử (`npm run build`) trong thư mục `ontap-win` đảm bảo ứng dụng không còn bị crash khi render.

### Changed
- **Bảo mật & Trải nghiệm**: Vô hiệu hóa tính năng tự động mở DevTools khi khởi động app và ẩn nút chuyển đổi DevTools trong giao diện chính (nhằm hạn chế can thiệp kỹ thuật F12 theo yêu cầu).
- **Phân tích dữ liệu**: Xác định chính xác nguồn dữ liệu câu hỏi offline nằm tại `ontap-win/data/questions_db.json`.

## [3.7.0] - 2026-03-29 (Android)
### Android Optimization Phases
- **Phase 04 (Visual)**: Đồng bộ màu sắc hệ thống Android (Indigo #4f46e5) và tối ưu hóa SplashScreen. Đã đồng bộ `colors.xml` trực tiếp vào dự án Android Studio.
- **Phase 05 (Security & Core)**: 
    - Tích hợp **Khóa Sinh trắc học (Fingerprint/FaceID)** bảo vệ ứng dụng ngay từ khi khởi động.
    - Hệ thống **Thông báo Nhắc học (Daily Reminders)** giúp học viên không bỏ lỡ bài vở.
    - `NativeSettingsModal`: Trung tâm quản lý các tính năng phần cứng thiết bị.
- **Phase 06 (Assets)**: Tối ưu hóa toàn bộ tài nguyên hình ảnh. Giảm kích thước Icon (5.4MB -> ~100KB) và Splash Screen (8.3MB -> 2.7MB) giúp APK nhẹ hơn và khởi động nhanh hơn. Tái tạo bộ resource icon/splash đúng chuẩn Android.

## [3.6.0] - 2026-03-15
### Added
- Tích hợp `@capacitor/haptics` và `@capacitor/app` cho phản hồi xúc giác (Haptics) và cấu hình điều hướng Nút Back vật lý cho Android.
- Khởi tạo `utils/nativeUX.ts` quản lý logic trải nghiệm người dùng trên thiết bị di động (Native-like).
- `verify_encryption.js` kịch bản kiểm thử độc lập cho hệ thống giải mã.

### Changed
- Refactor phương pháp lưu mật khẩu ở client: Chuyển đổi từ XOR plaintext sang **Web Crypto API (AES-GCM 256-bit)** với PBKDF2 Master Key, cường hóa đáng kể độ bảo mật dữ liệu lưu ở trình duyệt.
- Tái cấu trúc logic gọi Gemini API: Dịch chuyển từ gọi trực tiếp ở frontend sang gọi qua **Proxy backend (`/api/ai/gemini`)** chặn hoàn toàn nguy cơ rò rỉ API Keys ra public.

### Security
- Khắc phục nguy cơ lộ Gemini API Key nghiêm trọng. Toàn bộ logic kiểm tra và generateContent hiện tại đã thực thi ngầm ở Node server thay vì client.
- Xóa bỏ điểm yếu mã hóa XOR có thể dễ dàng bị bẻ khóa trong Local Storage đối với "Ghi nhớ tài khoản".


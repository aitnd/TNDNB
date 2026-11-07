# Kế Hoạch Tối Giản Hóa Dashboard Mobile, Kiểm Toán Lỗi 5 Ảnh Thực Tế, Tích Mặc Định Đăng Nhập & Banner Cài App/PWA

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Mã kế hoạch**: `261107-0620-mobile-dashboard-simplification-and-error-audit`  
> **Người lập**: Product Manager & Lead Architect  
> **Ngày lập**: 07/11/2026  
> **Trạng thái**: Hoàn tất 100% (Completed - All 3 Phases Done & Verified)  
> **Nhánh Git**: `feat/mobile-dashboard-and-top-navbar-simplification`  
> **Kiểm thử tự động**: 27/27 Vitest tests PASSED (100%)  
> **Biên dịch Production**: Thành công (0 error)  

---

## 📊 Bảng Tiến Độ Thực Thi Kế Hoạch

| Phase | Tên Giai Đoạn | Trạng Thái | Commit | Ghi Chú |
|---|---|---|---|---|
| **Phase 01** | Báo cáo lỗi 5 ảnh, Sửa Hydration Next.js & Tích mặc định 2 ô đăng nhập | ✅ Complete (100%) | `ab5070f5` | `TC-17`, `TC-18` PASSED |
| **Phase 02** | Tối giản UI Dashboard mobile, Menu 3 gạch & Triệt tiêu hỏi quyền/cảnh báo | ✅ Complete (100%) | `81e44c88` | `TC-19`, `TC-20`, `TC-21`, `TC-22`, `TC-25`, `TC-26` PASSED |
| **Phase 03** | Banner Cài Đặt Ứng Dụng PWA / Đưa Ra Màn Hình Chính | ✅ Complete (100%) | `075d6164` | `TC-23`, `TC-24`, `TC-27` PASSED, Build thành công |  

---

## 1. Bối Cảnh & Kiểm Toán Kỹ Thuật 5 Bức Ảnh Chụp Màn Hình Thực Tế

Người dùng gửi 5 bức ảnh chụp màn hình ghi nhận trải nghiệm thực tế trên các trang của hệ thống và yêu cầu tối ưu hóa toàn diện:

```mermaid
flowchart TD
    UserFeedback["5 Ảnh phản hồi từ Người dùng"]
    
    UserFeedback --> Img12["Ảnh 1 & 2: Trang Đăng Nhập /ontap/login<br/>Lỗi Autofill Bitwarden Extension"]
    UserFeedback --> Img3["Ảnh 3: Trang Chủ daotaothuyenvien.com<br/>Lỗi AdBlocker, React Hydration Mismatch"]
    UserFeedback --> Img4["Ảnh 4: Modal cảnh báo đăng nhập đơn thiết bị<br/>Gây phiền hà cho học viên"]
    UserFeedback --> Img5["Ảnh 5: Dashboard trên Mobile quá rườm rà<br/>Thời tiết, Tiến độ, Nút thi bị đẩy xuống đáy"]

    Img12 & Img3 --> P1["Phase 01: Báo cáo kiểm toán lỗi console & Tích mặc định 2 ô đăng nhập"]
    Img4 & Img5 --> P2["Phase 02: Tối giản UI Dashboard mobile (1 chạm vào thi, tắt hỏi quyền & cảnh báo)"]
    Img5 --> P3["Phase 03: Smart App Banner & Gợi ý Thêm vào Màn hình chính (PWA/APK)"]
```

### 1.1. Kiểm toán Ảnh 1 & Ảnh 2: Trang Đăng Nhập (`/ontap/login`)
- **Triệu chứng Console**:
  - `triggerAutofillScriptInjection`
  - `Attempting to use a disconnected port object at CM.sendMessageTo (chrome-extension://nngceckbapebfimnlniiahkandclblb/background.js...)`
- **Kết luận Kỹ thuật (Audited)**:
  - Chuỗi ID `nngceckbapebfimnlniiahkandclblb` là ID chính thức của tiện ích mở rộng **Bitwarden Password Manager** trên trình duyệt Chrome/Edge Web Store.
  - Khi người dùng tải trang đăng nhập, extension Bitwarden tự động tiêm script autofill vào form. Tuy nhiên, background service worker của Bitwarden bị ngắt kết nối tạm thời từ phía Chrome API, dẫn đến việc extension tự ném lỗi "disconnected port".
  - **100% là lỗi nội bộ của Extension Bitwarden**, hoàn toàn không liên quan đến mã nguồn hay độ ổn định của website. Khi duyệt web ẩn danh (Incognito) hoặc tắt Bitwarden, lỗi này hoàn toàn biến mất.

### 1.2. Kiểm toán Ảnh 3: Trang Chủ Cổng Thông Tin (`https://daotaothuyenvien.com`)
- **Triệu chứng Console**:
  - `ad.doubleclick.net net::ERR_BLOCKED_BY_CLIENT`: Do tiện ích chặn quảng cáo (AdBlock / Brave Shields) trên máy người dùng chủ động chặn script tracking Google. Đây là hành vi bình thường của AdBlock.
  - `content.js:2 TypeError: Cannot read properties of null`: Do một extension thứ ba (dịch thuật, kiểm tra ngữ pháp) tự động tiêm mã vào trang.
  - `React Minified error #425, #418, #423`: **Đây là lỗi React Hydration Mismatch trong Next.js App Router**:
    - Xảy ra khi mã HTML do server render trước (SSR) không khớp từng ký tự với cây DOM do client hydrate.
    - Cụ thể: Component [`components/FeaturedSlider.tsx`](file:///d:/Antigravity/TNDNB/components/FeaturedSlider.tsx) sử dụng thư viện Swiper tự động khởi tạo trên client, trong khi SSR chỉ render thẻ `div` tạm; việc import trực tiếp không qua dynamic SSR false khiến Next.js báo lỗi không khớp Hydration.
    - **Giải pháp**: Áp dụng dynamic import `dynamic(() => import('../components/FeaturedSlider'), { ssr: false })` trong [`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx).

### 1.3. Kiểm toán Ảnh 4: Modal Cảnh Báo Đăng Nhập Đơn Thiết Bị
- **Triệu chứng Giao diện**:
  - Khi học viên đăng nhập trên điện thoại, hệ thống tự động bật một Popup cảnh báo to tướng màu vàng: *"⚠️ Cảnh báo đăng nhập: Tài khoản của bạn vừa được đăng nhập trên thiết bị này. Thiết bị cũ đã bị đăng xuất tự động... Bấm Tôi đã hiểu"*.
- **Nguyên nhân**:
  - Hàm `enforceAndRecordSession()` trong [`ontap-web/services/authSessionService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/authSessionService.ts) tự động gọi `showSingleDeviceWarning()` mỗi khi phát hiện có session cũ bị đăng xuất.
  - Điều này làm trải nghiệm trên di động bị đứt gãy, gây hoang mang không cần thiết cho học viên chỉ muốn vào ôn thi.
- **Giải pháp**: Tắt hoàn toàn việc hiển thị modal `showSingleDeviceWarning()`. Việc quản lý session vẫn diễn ra ngầm an toàn mà không làm phiền người dùng.

### 1.4. Kiểm toán Ảnh 5: Dashboard Mobile Quá Rườm Rà & Xin Quyền Vị Trí
- **Triệu chứng Giao diện & Trải nghiệm**:
  - Khi vừa vào Dashboard trên điện thoại:
    1. Trình duyệt lập tức bật popup xin quyền: *"daotaothuyenvien.com muốn biết vị trí của bạn [Cho phép / Chặn]"*.
    2. Chiếm trọn nửa trên màn hình là widget Thời tiết to đùng, tiếp theo là Thẻ Học Viên, tiếp theo là các nút phụ (Lịch sử, Lớp), tiếp theo là khung Biểu đồ tiến bộ học tập.
    3. Nút quan trọng nhất là **"VÀO ÔN TẬP / THI THỬ" bị đẩy tuốt xuống đáy**, học viên phải cuộn qua 2-3 trang màn hình mới tìm thấy nút để bấm thi!
- **Nguyên nhân**:
  - [`ontap-web/components/WeatherWidget.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx) tự động gọi `navigator.geolocation.getCurrentPosition()` ngay trong hook `useEffect` khi component mount.
  - [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) sắp xếp thứ tự một cột (single column) cho mobile từ trên xuống dưới theo thứ tự: Thời tiết -> Cột trái (Thẻ + Nút phụ + Tiến bộ) -> Cột phải (Lời chào + Nút chính + Tiles).
- **Giải pháp**:
  - Tắt tự động xin quyền vị trí trong `WeatherWidget.tsx`. Mặc định tải thời tiết theo tọa độ mặc định/IP.
  - Trên mobile: Ẩn Widget thời tiết, ẩn Biểu đồ tiến độ. Đưa Thẻ Học Viên lên đầu và **ngay bên dưới là Nút Lớn "VÀO ÔN TẬP / THI THỬ"** (Thiết kế 1 chạm).
  - Thêm Smart App Banner gợi ý Tải App (.APK/Store) hoặc Thêm vào Màn hình chính (PWA Add to Home Screen).

---

## 2. Lộ Trình Triển Khai 3 Phase (AWF Standards)

```mermaid
graph TD
    subgraph Phase01 ["Phase 01: Audit Lỗi & Tích Mặc Định Đăng Nhập"]
        A1["Giải thích rõ lỗi Bitwarden & AdBlocker"]
        A2["app/page.tsx: Dynamic import FeaturedSlider (SSR false) triệt tiêu Hydration Error"]
        A3["LoginScreen.tsx: rememberMe = true & saveThisAccount = true mặc định"]
    end

    subgraph Phase02 ["Phase 02: Tối Giản Dashboard Mobile (1 Chạm Vào Thi)"]
        B1["authSessionService.ts: Vô hiệu hóa showSingleDeviceWarning modal"]
        B2["WeatherWidget.tsx: Tắt tự động gọi getCurrentPosition"]
        B3["Dashboard.tsx Mobile: Ẩn thời tiết, ẩn tiến độ, Thẻ học viên + Nút thi nổi bật"]
    end

    subgraph Phase03 ["Phase 03: Smart App Banner & PWA Add to Home Screen"]
        C1["Tạo SmartAppBanner.tsx thông minh trên mobile"]
        C2["Nút 1: Tải App Android/Windows từ config.app_links"]
        C3["Nút 2: Hướng dẫn Thêm vào Màn hình chính PWA 1 chạm"]
    end

    Phase01 --> Phase02 --> Phase03
```

---

## 3. Nội Dung Chi Tiết Từng Phase

### Phase 01: Kiểm Toán Lỗi Console, Triệt Tiêu Hydration Error & Tích Mặc Định Đăng Nhập
1. **Trang Đăng Nhập ([`ontap-web/components/LoginScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx))**:
   - Chỉnh sửa state khởi tạo:
     ```typescript
     const [rememberMe, setRememberMe] = useState(true); // Đổi từ false thành true
     const [saveThisAccount, setSaveThisAccount] = useState(true); // Duy trì true
     ```
   - Lợi ích: Học viên mở form đăng nhập là cả 2 ô "Ghi nhớ đăng nhập" và "Lưu tài khoản này" đã được tích sẵn. Đăng nhập 1 lần là lưu vĩnh viễn trên máy, lần sau vào thẳng không cần nhập lại.
2. **Khắc Phục React Hydration Error trên Root Portal ([`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx))**:
   - Sử dụng `dynamic(() => import('../components/FeaturedSlider'), { ssr: false })` để tách biệt Swiper client-side khỏi HTML khởi tạo của Next.js SSR, dập tắt hoàn toàn các mã lỗi #418, #425, #423.

### Phase 02: Tối Giản Hóa Dashboard Mobile & Top Navbar (Trải Nghiệm 1 Chạm & Menu 3 Gạch)
1. **Tắt Cảnh Báo Phiền Toái ([`ontap-web/services/authSessionService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/authSessionService.ts))**:
   - Trong `enforceAndRecordSession()`: Xóa bỏ dòng gọi `showSingleDeviceWarning()` khi có session cũ bị kick. Hệ thống đăng xuất thiết bị cũ ngầm trong im lặng, không hiện popup modal cản trở học viên.
2. **Tắt Tự Động Hỏi Quyền Vị Trí ([`ontap-web/components/WeatherWidget.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx))**:
   - Không tự ý kích hoạt `navigator.geolocation.getCurrentPosition()` khi mở trang.
   - Khi load component, gọi thẳng `fetchWeather()` không tham số để lấy thời tiết mặc định/theo IP tỉnh Ninh Bình. Chỉ khi người dùng bấm vào biểu tượng định vị mới kích hoạt hỏi quyền.
3. **Tối Giản Layout Mobile trong [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx)**:
   - Trên mobile (màn hình dưới `lg:`):
     - Ẩn `WeatherWidget` (`hidden lg:block`).
     - Ẩn khung `ProgressDashboard` (`hidden lg:block`).
     - Xếp `StudentCard` lên đầu tiên.
     - **Ngay dưới `StudentCard` là Nút To "VÀO ÔN TẬP / THI THỬ"** (`PrimaryButton`).
     - Giữ nguyên giao diện đầy đủ, sang trọng cho Desktop (màn hình `lg:` trở lên).
4. **Tối Giản Top Navbar Mobile & Gom Nút Thoát/Tài Khoản Vào Menu 3 Gạch Ngang ([`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx))**:
   - Gom nút Quản lý Tài khoản (UserCog) và nút Đăng xuất (Logout đỏ) vào trong 1 nút 3 gạch ngang (Hamburger Menu icon `Menu` từ `lucide-react`) ở góc phải ngoài cùng.
   - Bấm vào mở dropdown chứa: Thông tin học viên, Role Badge, Quản lý tài khoản, Hộp thư, Lịch sử, Khám phá, Phiên bản và Nút Đăng xuất đỏ ở cuối.
   - Với giao diện mobile cho role học viên, thanh Navbar chỉ giữ lại 4 nút tinh gọn:
     1. `[Ôn tập]` (về Dashboard)
     2. `[Lớp của tôi]` (My Class)
     3. `[Chuông thông báo]` (NotificationBell kèm badge đỏ)
     4. `[Nút 3 gạch ngang]` (Menu chứa toàn bộ các mục còn lại)
   - Ẩn hết các nút Thi trực tuyến, Khám phá, Mail, History riêng lẻ trên mobile.

### Phase 03: Banner Cài Đặt Ứng Dụng PWA / Đưa Ra Màn Hình Chính (PWA Add to Home Screen)
1. **Tạo Component Banner Cài Đặt PWA ([`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx))**:
   - Tập trung 100% vào giải pháp **PWA thuần túy (Add to Home Screen)**, không dùng tệp APK.
   - **Tự động ẩn 100%** khi ứng dụng đang chạy ở chế độ Standalone PWA (`display-mode: standalone` hoặc `navigator.standalone === true`).
   - Trên Android / Chrome / Edge: Bắt sự kiện `beforeinstallprompt`. Khi học viên bấm nút "Cài đặt / Thêm ra MH chính", gọi `deferredPrompt.prompt()` mở dialog cài đặt bản địa của trình duyệt. Lắng nghe `appinstalled` để ẩn banner ngay khi hoàn tất.
   - Trên iOS Safari: Hiển thị tooltip hướng dẫn trực quan 1 bước: *"Bấm nút Chia sẻ ⎋ (ở thanh dưới cùng trình duyệt) ➔ Chọn 'Thêm vào MH chính' ➕"*.
   - Nút đóng "✕" lưu cờ vào `localStorage` (`ontap_pwa_prompt_dismissed_until`) để ẩn trong 7 ngày, không làm phiền học viên liên tục.
2. **Tích hợp vào đầu trang Mobile Dashboard** phía trên `StudentCard`.

---

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

| Hạng mục kiểm tra | Hiện trạng | Trạng thái sau tối ưu |
|---|---|---|
| **Mặc định ô đăng nhập** | `rememberMe` là `false` | Cả 2 ô "Lưu tài khoản này" & "Ghi nhớ đăng nhập" **đều được tích sẵn** |
| **Cảnh báo thiết bị khi đăng nhập** | Hiện modal vàng to tướng | **0 modal phiền toái**, đăng nhập vào thẳng bài học |
| **Xin quyền vị trí khi vào trang** | Trình duyệt hiện popup hỏi vị trí | **0 popup hỏi quyền**, nạp thời tiết mặc định tức thì |
| **Giao diện Dashboard trên Mobile** | Cuộn mỏi tay, nút thi ở đáy | Mở ra thấy ngay **Thẻ Học Viên + Nút Lớn Vào Ôn Tập** ở đầu |
| **Cài đặt App PWA trên Mobile** | Không có gợi ý cài PWA | **PwaInstallBanner** 1 chạm đưa ra màn hình chính, tự ẩn khi đã là PWA |
| **Top Navbar Menu 3 gạch** | Nút tài khoản & thoát lộ liễu | Gom vào **Menu 3 gạch ngang tinh tế** ở góc phải, mở dropdown đầy đủ tính năng |
| **Top Navbar Mobile (Học viên)** | Quá nhiều nút chen chúc | **Chỉ còn đúng 4 nút**: [Ôn tập], [Lớp của tôi], [Chuông TB], [Menu 3 gạch] |
| **React Hydration Error trên Portal** | Console báo đỏ #418, #425, #423 | **Console sạch bóng**, SSR và Client khớp 100% |
| **Bảo toàn Invariant 1** | File thi bắt buộc nguyên vẹn | [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) có **`git diff = 0`** |

---

## 5. Danh Sách Tài Liệu Kế Hoạch Chi Tiết

- 📘 **Kế hoạch tổng thể chính thức**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md)
- 📋 **Living Task Checklist (TDD)**: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/task.md)
- 🛠️ **Tài liệu Phase 01**: [`phase-01-audit-console-errors-and-login-screen.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-01-audit-console-errors-and-login-screen.md)
- 📱 **Tài liệu Phase 02**: [`phase-02-mobile-dashboard-simplification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-02-mobile-dashboard-simplification.md)
- 🚀 **Tài liệu Phase 03**: [`phase-03-smart-app-banner-and-pwa-prompt.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-03-smart-app-banner-and-pwa-prompt.md)

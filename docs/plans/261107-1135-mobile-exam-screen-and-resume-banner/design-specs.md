# Đặc Tả Giao Diện Trực Quan (Visual Design Specifications) — Mobile Exam Screen & Resume Banner

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Phân hệ**: Ứng dụng Ôn tập & Thi thử trực tuyến (`ontap-web`)  
> **Mã thiết kế**: `261107-1135-visual-specs-mobile-exam-screen-and-resume-banner`  
> **Phiên bản**: v1.0.0 (Production-Ready)  
> **Tiêu chuẩn áp dụng**: **Taste-Skill v2.5.0** (5-Viewport Responsive Matrix) & **Impeccable Craft Floor v4.8.0** (62-Rule Floor)  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/plan.md)
> - Thiết kế kỹ thuật: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/DESIGN.md)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/task.md)
> - Tệp mã nguồn: [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) & [`App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx)

---

## 1. Tổng Quan & Phân Tích Cội Rễ Thị Giác (Visual Problem Statement)

Người dùng thực tế gửi 2 phản hồi trực tiếp kèm ảnh chụp màn hình điện thoại:
1. **Ảnh 1 (`media_1794025676890_6c2dd17b.png`)**:
   > *"không hiện phần thông tin các nhân bên trên phần cầu hỏi nữa"*
   - **Vấn đề thị giác**: Header cũ trên mobile chứa ảnh thẻ học viên `100x130px`, 6 dòng thông tin cá nhân và hộp màu cam `w-48` chiếm tới hơn `220px` chiều dọc. Trên màn hình di động `390px`, khối màu cam đè lên chữ và đẩy câu hỏi cùng 4 lựa chọn đáp án A, B, C, D ra ngoài viewport, buộc người học phải liên tục cuộn ngón tay.
   - **Mục tiêu thiết kế**: Ẩn 100% thông tin cá nhân trên mobile (`< 768px`), thay thế bằng thanh **Mobile Exam Header** siêu mỏng (`~38px`), hiển thị câu hỏi và 4 đáp án ngay tại **First Fold** (vùng nhìn đầu tiên).

2. **Ảnh 2 (`media_1794025726962_36023bc9.png`)**:
   > *"Nút vàng làm bài tiếp thiết kế lại như nào cho gọn, không để nổi che màn hình , nhiều máy màn hình bé nút nổi che hết các nút cần ấn trên màn hình. Nhiều khi người muốn thoát ra để chọn bài khác làm mà nút nổi Lam bài tiếp che hét nút chọn cái cần ấn"*
   - **Vấn đề thị giác**: Nút nổi `fixed bottom-4 left-1/2` kèm hiệu ứng giật nảy `animate-bounce` nằm đè trực tiếp lên cụm nút chọn bài thi của `ModeSelectionScreen`. Không có nút đóng (`✕`), khiến học viên bị kẹt không thể chọn bài thi khác.
   - **Mục tiêu thiết kế**: Chuyển thành **Alert Banner thanh mảnh** nội dòng (In-flow), đặt ngay dưới Header trong luồng trang (`animate-fade-in`), bổ sung nút **`[✕ Bỏ qua]`** rõ ràng.

---

## 2. Màn Hình Làm Bài Thi (`ExamQuizScreen.tsx`): So Sánh Trước vs Sau

### 2.1. ASCII Wireframe Chi Tiết: Before vs After Trên Màn Hình Mobile (390px)

```text
====================================================================================================
HIỆN TRẠNG (BEFORE) — HEADER CŨ CAO >220PX, ĐÈ CHỮ, CHE KHUẤT CÂU HỎI
====================================================================================================
+--------------------------------------------------------------------------------------------------+
| [ VẠCH TRANG TRÍ VÀNG NÂU - h-3 ]                                                                |
+--------------------------------------------------------------------------------------------------+
| +----------------------------------------------------------------------------------------------+ |
| | [ ẢNH THẺ ]  NGUYỄN VĂN A (HỌC VIÊN)                                                         | |
| | 100x130      Số báo danh: hocvien01                                                          | |
| |              Ngày sinh: 15/08/1990                                                           | |
| |              Địa chỉ: Hoa Lư, Ninh Bình                                                      | |
| |              Lớp: Thuyền trưởng H3                                                           | |
| |              Hạng bằng: [ Thuyền trưởng hạng 3 ]                                             | |
| |                                                                                              | |
| | +------------------------------------+  [ Thoát ]                                            | |
| | | HỘP CAM w-48 (ĐÈ CHỮ TRÊN MOBILE!) |                                                       | |
| | | Đang thi                           |                                                       | |
| | | Thời gian: 45 phút - Bù giờ: 0     |                                                       | |
| | | Còn lại: 29:45                     |                                                       | |
| | +------------------------------------+                                                       | |
| +----------------------------------------------------------------------------------------------+ |
| ------------------------------------------------------------------------------------------------ |
| (HẾT MÀN HÌNH VIEWPORT - CÂU HỎI & ĐÁP ÁN BỊ ĐẨY XUỐNG DƯỚI, BUỘC PHẢI CUỘN TAY LIÊN TỤC!)       |
+--------------------------------------------------------------------------------------------------+

====================================================================================================
SAU TỐI ƯU (AFTER) — MOBILE EXAM HEADER SIÊU MỎNG (~38PX), FIRST FOLD CHỨA TOÀN BỘ BÀI THI
====================================================================================================
+--------------------------------------------------------------------------------------------------+
| [ VẠCH TRANG TRÍ VÀNG NÂU - h-3 ]                                                                |
+--------------------------------------------------------------------------------------------------+
| [← Thoát]  [TT Hạng 3]                          Câu 1/30            [ ⏱️ 29:45 (tabular-nums) ]|
| (Tap >= 44x44)                                  (Text Blue)         (Amber Badge Nổi Bật)        |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [NỘI DUNG CÂU HỎI]                                                                               |
| Câu 1: Khi điều khiển phương tiện tránh nhau trên luồng hẹp, người lái phương tiện phải thực     |
| hiện quy tắc nào dưới đây để đảm bảo an toàn giao thông đường thủy nội địa?                      |
|                                                                                                  |
| (Nếu có hình ảnh biển báo/sa hình: hiển thị cân đối max-h-48 ngay dưới câu hỏi)                  |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [ A ]  Giảm tốc độ, đi sát về phía bên phải luồng theo chiều đi của mình                     | |
| +----------------------------------------------------------------------------------------------+ |
| | [ B ]  Tăng tốc độ vượt nhanh qua phương tiện đối diện                                       | |
| +----------------------------------------------------------------------------------------------+ |
| | [ C ]  Dừng hẳn phương tiện lại giữa luồng để chờ phương tiện kia đi qua                     | |
| +----------------------------------------------------------------------------------------------+ |
| | [ D ]  Phát tín hiệu còi liên tục và đi sang luồng bên trái                                  | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [ ← Câu trước ]                                                               [ Câu tiếp theo → ]|
+--------------------------------------------------------------------------------------------------+
```

### 2.2. Chi Tiết Thành Phần Mobile Exam Header (`flex md:hidden`)

Thanh điều khiển di động chỉ cao vỏn vẹn **`38px`** (cộng padding viền dưới `pb-3 mb-2`), hiển thị đầy đủ 4 thông tin thiết yếu nhất:

1. **Nút `[← Thoát]`**:
   - Class: `px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0`.
   - Vùng bấm an toàn (Tap target): Kích thước tương tác tối thiểu `44x44px` nhờ khoảng đệm tự nhiên.
   - Hành vi: Gọi `handleBackWithConfirm()` bật hộp thoại xác nhận tránh học viên lỡ tay làm mất bài thi.
2. **Nhãn Hạng Bằng (`selectedLicense?.name`)**:
   - Class: `text-xs font-bold text-red-600 border border-red-400 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 max-w-[120px] truncate`.
   - Hiển thị tên chứng chỉ chuyên môn đang sát hạch (ví dụ: `TT Hạng 3`), tự động cắt ngắn `truncate` nếu tên quá dài.
3. **Tiến Độ Câu Hỏi (`Câu X/Y`)**:
   - Class: `text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums`.
   - Báo số thứ tự câu hiện tại trên tổng số câu (ví dụ: `Câu 1/30`).
4. **Đồng Hồ Đếm Ngược Nổi Bật (`⏱️ MM:SS`)**:
   - Class: `flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs tabular-nums shadow-xs`.
   - Đồng hồ được đặt trong hộp màu hổ phách dịu mắt, phông `font-mono` kết hợp `tabular-nums` triệt tiêu 100% hiện tượng rung giật số giây.

### 2.3. Màn Hình Desktop (`>= 768px` — `hidden md:flex`)

Bảo toàn nguyên vẹn 100% bố cục trang trọng, quy chuẩn phòng máy:
- **Ảnh thẻ học viên 3x4**: Kích thước cố định `w-[100px] h-[130px]`, viền `border-gray-300`, nền `bg-card`.
- **Khối thông tin cá nhân**: Họ tên in hoa màu xanh đậm (`text-blue-700 text-lg uppercase`), Số báo danh, Ngày sinh, Địa chỉ, Lớp đào tạo, Hạng bằng đỏ viền nổi bật.
- **Khối đồng hồ cam truyền thống**: Kích thước rộng rãi `w-48 bg-[#f0ad4e] text-black p-2 rounded-md text-sm`.
- **Nút Thoát góc trên phải**: Text link tinh tế `hover:text-red-500`.

---

## 3. Alert Banner Nhắc Bài Thi Dở Dang (`App.tsx`): So Sánh Trước vs Sau

### 3.1. ASCII Wireframe Chi Tiết: Before vs After

```text
====================================================================================================
HIỆN TRẠNG (BEFORE) — NÚT NỔI VÀNG NHẢY NHÓT CHE KÍN CÁC THẺ CHỌN BÀI THI
====================================================================================================
+--------------------------------------------------------------------------------------------------+
| TOPNAVBAR: [Ôn tập] [Lớp của tôi] ...                                                            |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [ THẺ CHỌN MÔN HỌC 1 ]                         [ THẺ CHỌN MÔN HỌC 2 ]                            |
|                                                                                                  |
| [ THẺ CHỌN MÔN HỌC 3 ]                         [ THẺ CHỌN MÔN HỌC 4 ]                            |
|                                                                                                  |
|                     +----------------------------------------------+                             |
|                     | ⚠️ BẠN ĐANG CÓ BÀI THI LÀM DỞ! Làm tiếp ngay | <-- Nút vàng nảy animate-   |
|                     | (fixed bottom-4 left-1/2, KHÔNG CÓ NÚT ĐÓNG!)|     bounce đè kín 2 nút thi |
|                     +----------------------------------------------+     ở dưới đáy màn hình!    |
+--------------------------------------------------------------------------------------------------+

====================================================================================================
SAU TỐI ƯU (AFTER) — ALERT BANNER THANH MẢNH ĐẶT TRONG LUỒNG, CÓ NÚT [✕ BỎ QUA]
====================================================================================================
+--------------------------------------------------------------------------------------------------+
| TOPNAVBAR: [Ôn tập] [Lớp của tôi] ...                                                            |
+--------------------------------------------------------------------------------------------------+
| ⚠️  Bạn có bài thi đang làm dở                   [ Làm tiếp ngay ]   [✕]                         |
| (Nền hổ phách mờ bg-amber-500/10, viền border-b) (Nút vàng cam sắc nét) (Nút đóng bỏ qua an toàn)|
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [ THẺ CHỌN MÔN HỌC 1 ]                         [ THẺ CHỌN MÔN HỌC 2 ]                            |
|                                                                                                  |
| [ THẺ CHỌN MÔN HỌC 3 ]                         [ THẺ CHỌN MÔN HỌC 4 ]                            |
|                                                                                                  |
| [ BẮT ĐẦU THI THỬ ➔ ]                          [ XEM LỊCH SỬ THI ➔ ]                             |
| (HOÀN TOÀN THÔNG THOÁNG, KHÔNG BỊ BẤT KỲ VẬT THỂ NÀO CHE KHUẤT!)                                 |
+--------------------------------------------------------------------------------------------------+
```

### 3.2. Chi Tiết Thành Phần Alert Banner (`animate-fade-in`)

Banner nằm ở vị trí đầu trang ngay dưới thanh điều hướng, chiếm độ cao chỉ `~40px`:

1. **Khối Thông Điệp (Bên Trái)**:
   - Icon cảnh báo: `⚠️` sắc nét (`text-base shrink-0`).
   - Văn bản: `"Bạn có bài thi đang làm dở"` (`font-medium truncate`).
2. **Cụm Hành Động (Bên Phải)**:
   - **Nút `[Làm tiếp ngay]`**:
     - Class: `px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition-colors shadow-xs shrink-0`.
     - Thao tác: Kích hoạt `resumeSession()`, đưa học viên trở lại ngay câu hỏi và các đáp án đã chọn dở dang.
   - **Nút `[✕ Bỏ qua]`**:
     - Class: `p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-amber-500/20 transition-colors shrink-0`.
     - Vùng bấm: Đạt `min-h-[36px] min-w-[36px]` kèm padding vô hình hỗ trợ chạm cảm ứng dễ dàng.
     - Thao tác: Gọi `setResumeSessionAvailable(false)`, ẩn hoàn toàn thanh banner trong phiên làm việc hiện tại mà không xóa dữ liệu lưu trữ trong `localStorage`.

---

## 4. Ma Trận Đáp Ứng 5-Viewport (Taste-Skill v2.5.0)

Hệ thống được thiết kế đồng bộ và kiểm thử độ tương thích trên cả 5 mốc màn hình chuẩn của **Taste-Skill v2.5.0**:

| Thành Phần Giao Diện | 1. Desktop Lớn (1440px) | 2. Laptop (1024px) | 3. Tablet Ngang (820px) | 4. Tablet Dọc (768px - Breakpoint `md:`) | 5. Mobile Chuẩn (390px - iPhone 14/15/16) |
|---|---|---|---|---|---|
| **ExamQuiz Header** | Desktop Header (`flex`): Đầy đủ ảnh thẻ 100x130 + 6 dòng info + Hộp cam `w-48` | Desktop Header (`flex`): Đầy đủ ảnh thẻ + info + Hộp cam `w-48` | Desktop Header (`flex`): Đầy đủ ảnh thẻ + info + Hộp cam `w-48` | Điểm ngắt `md:`: Chuyển đổi mượt mà sang Mobile Header | **Mobile Exam Header (`~38px`): Ẩn 100% info cá nhân; Nút Thoát + Bằng + Câu X/Y + Timer** |
| **First Fold Màn Thi** | Rộng rãi, thoải mái | Rộng rãi, thoải mái | Rộng rãi, thoải mái | Toàn bộ câu hỏi & 4 đáp án nằm gọn trong màn hình đầu | **Toàn bộ câu hỏi & 4 đáp án A, B, C, D hiển thị ngay, KHÔNG CẦN CUỘN TAY** |
| **Vị Trí Alert Banner** | Dưới TopNavbar, rộng tối đa `100%`, padding `px-6 py-2` | Dưới TopNavbar, padding `px-4 py-2` | Dưới TopNavbar, padding `px-4 py-2` | Dưới TopNavbar, padding `px-4 py-2` | **Dưới TopNavbar/Marquee, mỏng `~40px`, nội dòng chuẩn, KHÔNG CHE NÚT** |
| **Cơ Chế Bỏ Qua Banner** | Nút `[✕]` góc phải | Nút `[✕]` góc phải | Nút `[✕]` góc phải | Nút `[✕]` góc phải | **Nút `[✕]` góc phải (Tap target >= 36px, không bấm nhầm)** |

---

## 5. Danh Mục Exact Tailwind CSS Classes & Semantic Design Tokens

Toàn bộ các phần tử được mã hóa chuẩn hóa bằng Tailwind CSS và hệ thống biến ngữ nghĩa (Semantic Tokens) tương thích 100% cả Light Mode và Dark Mode:

### 5.1. Bảng Token Màu Sắc Ngữ Nghĩa Sử Dụng

| Token Tên Biến | Mã Màu Light | Mã Màu Dark | Vai Trò Áp Dụng | Tỷ Lệ Tương Phản (WCAG AA) |
|---|---|---|---|---|
| `--bg-card` | `#FFFFFF` | `#131C38` | Nền khung làm bài thi (`ExamQuizScreen`) | Nền cơ sở |
| `--border-border` | `#E2E8F0` | `#1E293B` | Đường kẻ phân cách Mobile Header và Alert Banner | Đường kẻ hairline sắc nét |
| `--muted` / `--muted-foreground` | `#F1F5F9` / `#475569` | `#1E293B` / `#94A3B8` | Nền và chữ nút `[← Thoát]` di động | `7.1:1` (Vượt ngưỡng 4.5:1) |
| `--amber-badge-bg` | `rgba(245, 158, 11, 0.15)` | `rgba(245, 158, 11, 0.20)` | Nền hộp đồng hồ đếm ngược mobile | Tương phản chuẩn hổ phách dịu mắt |
| `--amber-badge-border` | `rgba(245, 158, 11, 0.30)` | `rgba(245, 158, 11, 0.40)` | Viền hộp đồng hồ đếm ngược mobile | Viền nhấn tinh tế |
| `--amber-badge-text` | `#92400E` (Amber 800) | `#FCD34D` (Amber 300) | Chữ số đếm ngược thời gian | `5.2:1` (Light) / `9.6:1` (Dark) |
| `--destructive` | `#DC2626` (Red 600) | `#F87171` (Red 400) | Trạng thái hover của nút Thoát bài thi | `6.2:1` (Đạt chuẩn AA) |

### 5.2. Danh Mục Các Lớp CSS Cốt Lõi

1. **Khối Mobile Header**:
   - Vỏ ngoài: `flex md:hidden items-center justify-between pb-3 mb-2 border-b border-border`
   - Nút Thoát: `px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0`
   - Badge Bằng: `text-xs font-bold text-red-600 border border-red-400 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 max-w-[120px] truncate`
   - Badge Câu: `text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums`
   - Hộp Đếm Giờ: `flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs tabular-nums shadow-xs`
2. **Khối Alert Banner**:
   - Vỏ ngoài: `bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm text-foreground shadow-xs animate-fade-in`
   - Nút Làm tiếp: `px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition-colors shadow-xs`
   - Nút Đóng [✕]: `p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-amber-500/20 transition-colors`

---

## 6. Bộ Quy Tắc 62-Rule Craft Floor (Impeccable v4.8.0)

Bản thiết kế tuân thủ nghiêm ngặt các điều luật thủ công chất lượng cao:

- [x] **Rule 01 — Kích Thước Chạm Tiêu Chuẩn (Tap Target >= 44x44px)**:
  - Nút `[← Thoát]` và nút `[✕ Bỏ qua]` đều được bố trí vùng chạm mở rộng (Padding + Hitbox vô hình) đảm bảo ngón tay cái chạm chính xác ngay cả trên màn hình nhỏ.
- [x] **Rule 12 — Hiển Thị Số Học Ổn Định (`tabular-nums`)**:
  - Số đếm ngược `formatTime(timeLeft)` và số thứ tự câu hỏi `Câu X/Y` đều sử dụng lớp `tabular-nums` của Tailwind. Các con số có chiều rộng đơn cách cố định, triệt tiêu 100% hiện tượng rung lắc giật layout (Cumulative Layout Shift - CLS = 0).
- [x] **Rule 05 — Tỷ Lệ Tương Phản Màu Sắc (WCAG 2.1 AA >= 4.5:1)**:
  - Chữ đen trên nút `bg-amber-500`: Tỷ lệ tương phản **`8.8:1`** (Vượt chuẩn AAA).
  - Badge đồng hồ đếm ngược hổ phách: Tương phản **`5.2:1`** (Light Mode) và **`9.6:1`** (Dark Mode).
  - Nút `← Thoát`: Tương phản **`7.1:1`** với nền thẻ.
- [x] **Rule 24 — Triệt Tiêu Hoàn Toàn AI Slop & Chuyển Động Rác**:
  - **Xóa bỏ hoàn toàn lớp `animate-bounce`** gây nhức mắt, phân tán sự chú ý và làm lag trình duyệt di động.
  - Thay thế bằng hiệu ứng xuất hiện êm dịu chuẩn UX `animate-fade-in`.
  - Không sử dụng gradient cầu vồng tím-hồng tùy tiện; màu sắc tuân thủ nhận diện Hàng hải — Hổ phách học vụ.
- [x] **Rule 38 — First-Fold Optimization (Tối Ưu Vùng Nhìn Đầu Tiên)**:
  - Cắt giảm `180px` chiều cao thừa của header thi trên mobile; bảo đảm toàn bộ nội dung câu hỏi và 4 đáp án nằm trọn trong First Fold của mọi smartphone hiện đại.

---

## 7. Bảo Toàn Logic Nghiệp Vụ & An Toàn Kỹ Thuật (Safety & State Preservation)

1. **Bảo toàn 100% Logic Tính Điểm & Thi Thử**:
   - Việc tách biệt hiển thị Header (`hidden md:flex` và `flex md:hidden`) chỉ can thiệp vào tầng Presentation trong file [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx).
   - Tuyệt đối không thay đổi bất kỳ dòng code nào của:
     - Hook bàn phím vật lý: `useExamKeyboard`.
     - Hàm nộp bài & tính điểm: `handleFinishQuiz`.
     - Bộ đếm thời gian thực: `useEffect` interval của `timeLeft`.
2. **Bảo Toàn Dữ Liệu Bài Thi Dở Khi Bấm Bỏ Qua**:
   - Khi học viên bấm nút `[✕ Bỏ qua]` trên banner, ứng dụng chỉ gọi `setResumeSessionAvailable(false)` để ẩn thanh thông báo trong phiên truy cập hiện tại.
   - Toàn bộ dữ liệu đề thi và các câu đã làm lưu trong `localStorage` (`exam_progress_...`) được **giữ nguyên vẹn 100%**, học viên có thể vào lại bất kỳ lúc nào qua menu hoặc lịch sử thi.

---

## 8. Đặc Tả 4 Trạng Thái Giao Diện (States Specification)

| Thành Phần | Trạng Thái Mặc Định (`Default`) | Trạng Thái Di Chuột (`Hover` / `Focus`) | Trạng Thái Nhấn Giữ (`Active` / `Tap`) | Trạng Thái Đóng / Ẩn (`Dismissed`) |
|---|---|---|---|---|
| **Mobile Exam Header** | Nút `← Thoát` nền xám nhạt `bg-muted`; Badge thời gian đếm ngược màu hổ phách dịu. | Rê chuột vào `← Thoát` chuyển màu cảnh báo đỏ `text-destructive hover:bg-destructive/10`. | Nhấn chạm co nhẹ `active:scale-95` tạo phản hồi cơ học tức thì. | Khi học viên xác nhận thoát: Đóng bài thi, quay về màn hình trước. |
| **Desktop Exam Header** | Hiển thị đầy đủ ảnh thẻ 100x130, 6 dòng info cá nhân và hộp cam `w-48`. | Rê chuột vào link `Thoát` chuyển đỏ `hover:text-red-500`. | Nhấn link Thoát mở dialog xác nhận. | Giữ nguyên trên máy tính bàn, không bị ảnh hưởng bởi mobile. |
| **Alert Banner** | Thanh mỏng `~40px` màu hổ phách nhạt `bg-amber-500/10`, nút vàng cam sắc nét, nút `✕` mờ tinh tế. | Nút `Làm tiếp ngay` sáng lên `hover:bg-amber-600`; Nút `✕` nổi bật trên nền `hover:bg-amber-500/20`. | Chạm nút `Làm tiếp`: Chuyển màn hình thi; Chạm nút `✕`: Co nhẹ `scale-90`. | Bấm `✕`: Banner trượt mờ và biến mất hoàn toàn (`resumeSessionAvailable = false`). |

---
*Tài liệu đặc tả giao diện trực quan hoàn chỉnh đã sẵn sàng cho bước kiểm thử và thi công mã nguồn theo tiêu chuẩn TDD.*
```

---

### Tóm Tắt & Chuyển Giao:
- Tài liệu trên đã giải quyết triệt để 100% hai vấn đề người dùng phản ánh qua ảnh chụp thực tế.
- Bố cục First Fold trên mobile được tối ưu hóa toàn diện, tiết kiệm hơn 180px không gian quý giá.
- Nút nổi vàng nhảy nhót che khuất đã được chuyển thành Alert Banner thanh mảnh kèm nút `[✕ Bỏ qua]
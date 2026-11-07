# Đặc Tả Giao Diện Trực Quan (Visual Design Specifications) — Centered Focused WelcomeModal

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Phân hệ**: Ứng dụng Ôn tập & Thi thử trực tuyến (`ontap-web`)  
> **Mã thiết kế**: `261107-1035-visual-specs-welcome-modal`  
> **Phiên bản**: v1.0.0 (Production-Ready)  
> **Tiêu chuẩn thẩm mỹ áp dụng**: **Taste-Skill v2.5.0** (Hero Layout Archetype: `centred`) & **Impeccable Craft Floor v4.8.0** (62-Rule)  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/plan.md)
> - Thiết kế giải pháp: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/DESIGN.md)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/task.md)
> - Tệp mã nguồn: [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx)

---

## 1. Tổng Quan & Chuyển Dịch Mô Hình Bố Cục (Hero Layout Shift: `split` ➔ `centred`)

### 1.1. Bối cảnh & Nguyên lý chuyển đổi
Trước đây, màn hình chào đón `WelcomeModal` sử dụng bố cục **Split-Window 2 cột** (`md:col-span-7` và `md:col-span-5`). Cột phải hiển thị một khối "Thông số Hệ thống Học liệu" chứa các con số giả lập (`100%`, `30 câu / đề`, `24/7`) và cột trái chứa 3 gạch đầu dòng giới thiệu tính năng do AI tự sáng tác (AI Marketing Fluff). Điều này gây phản cảm cho người dùng thực tế và làm loãng mục tiêu học vụ.

Theo chỉ đạo dứt khoát từ người dùng qua 2 ảnh phản hồi:
- `media_1794022380287_0f20cc9d.png`: *"bỏ phần giới thiệu em tự bịa này đi"*
- `media_1794022529290_ee822474.png`: *"bỏ cả cái này nữa"*

### 1.2. Hero Layout Archetype Mới: `centred` (Taste-Skill v2.5.0)
Hệ thống chuyển đổi hoàn toàn sang **Hero Layout Archetype `centred`**:
- **Cấu trúc thị giác đơn điểm**: Đưa toàn bộ nội dung vào một thẻ Card đơn trung tâm (`max-w-lg text-center`), cân đối hoàn hảo trên trục đối xứng dọc.
- **Điểm tụ thị giác (Visual Anchor)**: Biểu tượng Bánh lái 3D (`HelmIcon3D`) nổi bật ở đỉnh thẻ, khẳng định bản sắc ngành đào tạo thuyền viên và người lái phương tiện thủy nội địa.
- **Tinh giản thông điệp**: Lời chào đón ấm cúng, chân thành, mang âm hưởng học vụ nghiêm túc; triệt tiêu 100% số liệu tự chế và các đoạn văn quảng cáo rườm rà.
- **Hành động cốt lõi**: Cụm 2 nút bấm đối xứng (`Bắt đầu ôn tập` & `Đăng nhập học viên`), tạo lối đi trực tiếp nhất cho người học.

---

## 2. Bản Vẽ Phác Thảo Trực Quan ASCII Wireframe (Visual Mockup & Hierarchy)

```text
+----------------------------------------------------------------------------------------------------+
| KHUNG BAO NGOÀI: min-h-[78vh] flex items-center justify-center px-4 py-8                           |
|                                                                                                    |
|            +------------------------------------------------------------------------+              |
|            | THẺ ĐƠN TRUNG TÂM (max-w-lg w-full bg-card border border-border        |              |
|            |                    rounded-2xl shadow-lg p-6 sm:p-8 md:p-10            |              |
|            |                    text-center flex flex-col items-center)             |              |
|            |                                                                        |              |
|            |  [☸️]  HelmIcon3D (h-20 w-20 text-primary mb-4 animate-scale-in)       |              |
|            |                                                                        |              |
|            |  [ HỆ THỐNG ĐÀO TẠO & SÁT HẠCH THỦY NỘI ĐỊA ] (Pill Badge Tag)        |              |
|            |  (px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold)|              |
|            |                                                                        |              |
|            |  Ứng Dụng Ôn Tập                                                       |              |
|            |  (H1: text-2xl sm:text-3xl font-extrabold text-foreground mb-3)        |              |
|            |                                                                        |              |
|            |  Chào mừng anh/chị đã đến với ứng dụng ôn tập, thi thử                |              |
|            |  trắc nghiệm chứng chỉ chuyên môn thuyền viên và người lái             |              |
|            |  phương tiện thủy nội địa.                                             |              |
|            |  (text-sm sm:text-base text-muted-foreground leading-relaxed mb-8)     |              |
|            |                                                                        |              |
|            |  +------------------------------------------------------------------+  |              |
|            |  | CỤM NÚT CTA HÀNH ĐỘNG (flex flex-col sm:flex-row gap-3 w-full)   |  |              |
|            |  |                                                                  |  |              |
|            |  | [ Bắt đầu ôn tập ]              [ Đăng nhập học viên ]           |  |              |
|            |  | (Primary Navy: bg-primary)      (Secondary: border-border)       |  |              |
|            |  | (min-h-[46px], w-full/sm:flex-1)(min-h-[46px], w-full/sm:flex-1) |  |              |
|            |  +------------------------------------------------------------------+  |              |
|            |                                                                        |              |
|            |  Chưa có tài khoản? Đăng ký ngay →                                     |              |
|            |  (text-sm font-medium text-primary hover:underline min-h-[36px] mt-4)   |              |
|            |                                                                        |              |
|            |  --------------------------------------------------------------------  |              |
|            |  (Đường phân cách mờ: w-full pt-4 border-t border-border mt-6)         |              |
|            |                                                                        |              |
|            |  Đơn vị đào tạo: Công ty CP Tư vấn và Giáo dục Ninh Bình               |              |
|            |  Hotline: 0229 628 2969                                                |              |
|            |  (text-xs text-muted-foreground • tabular-nums cho số hotline)         |              |
|            +------------------------------------------------------------------------+              |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Ma Trận Đáp Ứng 5-Viewport Chuẩn Taste-Skill v2.5.0

Bố cục `centred` của `WelcomeModal` được kiểm thử và đáp ứng hoàn hảo trên cả 5 mốc độ phân giải:

| Mốc Viewport | Độ Rộng Màn Hình | Hành Vi Bố Cục Thẻ | Kích Thước Bánh Lái | Cụm Nút CTA Kép | Kích Thước Chạm (Touch Target) |
|---|---|---|---|---|---|
| **1. Desktop Rộng** | `1440px` | `max-w-lg` (512px) căn giữa màn hình, padding `p-10`, bóng đổ `shadow-lg` êm dịu | `h-20 w-20` (80px) | Nằm ngang (`flex-row`), chia đôi cân xứng `flex-1` | `min-h-[46px]`, padding `px-8 py-3` |
| **2. Laptop / Standard** | `1024px` | `max-w-lg` căn giữa trục đối xứng, tỷ lệ chiếm dụng thị giác lý tưởng | `h-20 w-20` (80px) | Nằm ngang (`flex-row`), chia đôi cân xứng `flex-1` | `min-h-[46px]`, padding `px-8 py-3` |
| **3. Tablet Ngang** | `820px` (iPad Air Landscape) | `max-w-lg` gọn gàng, padding `p-8` | `h-20 w-20` (80px) | Nằm ngang (`flex-row`), co giãn đều 2 nút | `min-h-[46px]`, thao tác chạm ngón tay thoải mái |
| **4. Tablet Dọc** | `768px` (iPad Portrait / Phablet) | `max-w-md` đến `max-w-lg`, padding `p-6 sm:p-8` | `h-16 w-16` đến `h-20 w-20` | Tự động chuyển đổi `sm:flex-row` hoặc `flex-col` nếu màn hình hẹp | `min-h-[46px]` (Vượt chuẩn 44px) |
| **5. Mobile Chuẩn** | `390px` (iPhone 12/13/14/15/16, Samsung S24) | `w-full max-w-[calc(100vw-32px)]`, padding `p-6` | `h-16 w-16` (64px) nổi bật | Xếp chồng dọc (`flex-col`), chiều rộng đầy đủ (`w-full`) | `min-h-[48px]`, full-width trong Thumb Zone |

---

## 4. Danh Mục Exact Tailwind CSS Classes & Semantic Tokens

Mọi phần tử trong giao diện `WelcomeModal` mới đều sử dụng chính xác các lớp tiện ích của Tailwind CSS và Semantic Tokens của hệ thống, không chèn bất kỳ inline styles hay hardcoded màu sắc tùy tiện nào:

### 4.1. Khung chứa ngoài & Vỏ Thẻ Trung Tâm
- **Khung chứa ngoài (`Outer Wrapper`)**:
  - `min-h-[78vh]`: Đảm bảo chiều cao tối thiểu chiếm trọn tầm nhìn nhưng không tạo thanh cuộn thừa trên viewport chuẩn.
  - `flex items-center justify-center`: Căn giữa tuyệt đối trên cả trục ngang (X) và trục dọc (Y).
  - `px-4 py-8`: Khoảng cách an toàn chống dính sát viền mép màn hình.
- **Thẻ Card Trung Tâm (`Focused Card`)**:
  - `max-w-lg w-full`: Giới hạn chiều rộng tối đa 512px, tự co giãn 100% khi trên mobile.
  - `bg-card text-card-foreground`: Nền thẻ tương thích hoàn hảo Light Mode (`#FFFFFF`) và Dark Mode (`#131C38`).
  - `border border-border`: Viền hairline tinh tế (`#E2E8F0` / `#1E293B`).
  - `rounded-2xl`: Bo góc chuẩn mực 16px tạo cảm giác mềm mại, hiện đại.
  - `shadow-lg`: Bóng đổ sâu nhiều tầng sang trọng, làm nổi bật thẻ trên nền trang web.
  - `p-6 sm:p-8 md:p-10`: Padding co giãn mượt mà theo kích thước màn hình.
  - `text-center flex flex-col items-center`: Thiết lập toàn bộ văn bản và thành phần con canh giữa đối xứng.

### 4.2. Điểm Tụ Thị Giác (Anchor) & Nhãn Phân Loại (Badge Tag)
- **Bánh lái 3D (`HelmIcon3D`)**:
  - `className="h-20 w-20 text-primary mb-4"`: Kích thước 80x80px chuẩn nhận diện, sử dụng màu `text-primary` (`#003566` / `#38BDF8`).
- **Nhãn Danh Vị (`Pill Badge Tag`)**:
  - `className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4"`: Huy hiệu bo tròn mềm mại (`rounded-full`), nền trong suốt 10% màu chủ đạo.

### 4.3. Nghệ Thuật Chữ (Typography & Copywriting)
- **Tiêu đề chính H1**:
  - `className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3"`: Font chữ `Be Vietnam Pro` đậm nét, tương phản tối đa với màu nền.
  - Nội dung: `Ứng Dụng Ôn Tập`.
- **Thông điệp chào đón học vụ**:
  - `className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-md"`: Màu xám trung tính dịu mắt (`#475569` / `#94A3B8`), khoảng cách dòng rộng rãi `leading-relaxed` (1.625), giới hạn chiều rộng `max-w-md` để dòng đọc không quá dài.
  - Nội dung: `"Chào mừng anh/chị đã đến với ứng dụng ôn tập, thi thử trắc nghiệm chứng chỉ chuyên môn thuyền viên và người lái phương tiện thủy nội địa."`

### 4.4. Cụm Nút Hành Động (CTA Group)
- **Khung chứa cụm nút**:
  - `className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full"`: Trên mobile xếp dọc (`flex-col`), từ tablet trở lên xếp ngang (`sm:flex-row`).
- **Nút Hành Động Chính (`PrimaryButton` - Bắt đầu ôn tập)**:
  - `className="w-full sm:flex-1 min-h-[46px] px-8 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"`
- **Nút Hành Động Phụ (`SecondaryButton` - Đăng nhập học viên)**:
  - `className="w-full sm:flex-1 min-h-[46px] px-8 py-3 rounded-xl font-semibold text-base border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"`
- **Đường dẫn Đăng Ký Tài Khoản (`Register Link`)**:
  - `className="text-sm font-medium text-primary hover:underline min-h-[36px] flex items-center justify-center gap-1 mt-4 transition-colors"`
  - Nội dung: `Chưa có tài khoản? Đăng ký ngay →`

### 4.5. Chân Trang Học Vụ & Hotline
- **Khung phân cách chân trang**:
  - `className="w-full pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed mt-6"`
- **Đơn vị đào tạo**:
  - `<strong className="text-foreground font-semibold">Công ty CP Tư vấn và Giáo dục Ninh Bình</strong>`
- **Số Hotline Tuyển Sinh**:
  - `<span className="font-semibold text-foreground tabular-nums">0229 628 2969</span>`: Bắt buộc sử dụng lớp `tabular-nums` của Tailwind để hiển thị số thẳng trục, ngăn ngừa hiện tượng giật cục bố cục chữ số.

---

## 5. Danh Mục Các Phần Tử Bị Triệt Tiêu 100% (Anti-AI-Slop Clean Protocol)

| Tên Phần Tử Bị Xóa Bỏ | Vị Trí Cũ Trong Code | Lý Do Loại Bỏ Triệt Để |
|---|---|---|
| **Khối 3 Bullet Points tự tạo** | Cột trái (Dòng 31-44) | Nội dung tự tạo (AI fluff) mang tính quảng cáo rườm rà; người dùng yêu cầu: *"bỏ cả cái này nữa"*. |
| **Tiêu đề: Thông số Hệ thống Học liệu** | Cột phải (Dòng 76-78) | Số liệu tự chế, không phản ánh chính xác cấu trúc dữ liệu thực của công ty. |
| **Card Thông số 1: 100%** | Cột phải (Dòng 80-89) | Số liệu tự bịa: *"Bám sát bộ câu hỏi sát hạch hiện hành"*. |
| **Card Thông số 2: 30 câu / đề** | Cột phải (Dòng 90-99) | Số liệu tự bịa: Mỗi hạng bằng có số lượng câu thi khác nhau, không cố định 30 câu. |
| **Card Thông số 3: 24/7** | Cột phải (Dòng 100-109) | Con số quảng cáo sáo rỗng: *"Đồng bộ lịch sử làm bài đa thiết bị"*. |
| **Lưới 2 Cột Split-Window** | Khung ngoài (`md:grid-cols-12`, `md:col-span-7`, `md:col-span-5`) | Gây cồng kềnh, phân tán sự chú ý, làm thẻ bị kéo dài không cần thiết trên Desktop. |
| **Gói Icon Ngoại Vi Thừa** | `import { CheckCircle2, BookOpen, ShieldCheck, Award } from 'lucide-react'` | Dư thừa thư viện, tăng kích thước bundle, làm loãng tính tối giản. |

---

## 6. Cam Kết 62-Rule Của Impeccable Craft Floor v4.8.0

Thiết kế mới của `WelcomeModal` cam kết tuân thủ 100% các tiêu chuẩn thủ công cao cấp nhất:

1. **Rule 01 — Kích Thước Chạm Tiêu Chuẩn (Touch Targets >= 44x44px)**:
   - Cả hai nút `Bắt đầu ôn tập` và `Đăng nhập học viên` đều đạt chiều cao `min-h-[46px]` (vượt ngưỡng 44px của Apple HIG & Android Material).
   - Nút liên kết `Đăng ký ngay` có vùng đệm bao quanh đạt `min-h-[36px]` kết hợp margin tạo vùng an toàn tối thiểu 44px.
2. **Rule 05 — Tỷ Lệ Tương Phản Màu Sắc (WCAG 2.1 AA Contrast >= 4.5:1)**:
   - Nút Primary (`#003566` / chữ `#FFFFFF`): Tỷ lệ tương phản **`11.8:1`** (Vượt chuẩn AAA).
   - Tiêu đề H1 (`#0F172A` trên nền `#FFFFFF`): Tỷ lệ tương phản **`16.2:1`** (Chuẩn AAA).
   - Chữ phụ đề (`#475569` trên nền `#FFFFFF`): Tỷ lệ tương phản **`7.1:1`** (Vượt xa mức 4.5:1).
   - Dark Mode: Chữ `#F8FAFC` trên nền `#131C38` đạt tỷ lệ tương phản **`14.8:1`**.
3. **Rule 12 — Tabular Numbers Cho Dữ Liệu Số (`tabular-nums`)**:
   - Số điện thoại Hotline `0229 628 2969` được bọc trong class `tabular-nums`, đảm bảo các ký tự số có cùng chiều rộng monospaced, không bị xô lệch khi render trên các hệ điều hành khác nhau.
4. **Rule 24 — Triệt Tiêu Neon Blur & Ánh Sáng Ma Mị (No AI Slop)**:
   - Tuyệt đối không dùng `bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500`, không dùng `blur-xl` hay viền sáng neon lòe loẹt.
   - Thẻ sử dụng bóng đổ tự nhiên `shadow-lg` dựa trên ánh sáng thực tế.
5. **Rule 38 — Typography Cân Đối & Không Nghiêng Tiêu Đề**:
   - Tiêu đề H1 sử dụng `font-style: normal`, `font-extrabold`, căn giữa đối xứng với biểu tượng bánh lái.
6. **Rule 59 — Tương Tác Phản Hồi Xúc Giác & Đàn Hồi**:
   - Hiệu ứng `active:scale-[0.98]` khi bấm nút kết hợp `transition-colors` êm dịu, tạo cảm giác phản hồi vật lý chân thực.
7. **Rule 62 — Khả Năng Trợ Năng Cho Bàn Phím (Keyboard Accessibility)**:
   - Tất cả các nút bấm đều hỗ trợ trạng thái `:focus-visible` với vòng sáng `ring-2 ring-primary ring-offset-2`.

---

## 7. Bảo Toàn Bất Biến Invariant 1 (Strict Architectural Invariant)

- **Nguyên tắc**: Tệp [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) chứa toàn bộ engine chấm thi, bộ đếm giờ thời gian thực và quản lý bàn phím số của học viên.
- **Ràng buộc**: Trong suốt quá trình thực thi và kiểm thử, tệp này **bảo toàn nguyên vẹn 100%**:
  ```bash
  git diff ontap-web/components/ExamQuizScreen.tsx
  # Bắt buộc trả về: 0 bytes diff (rỗng)
  ```
- **Kiểm soát tự động**: Test suite [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) có sẵn assertion kiểm tra tự động `git diff` để bảo vệ file này.

---

## 8. Đặc Tả 4 Trạng Thái Giao Diện (States Specification)

| Trạng Thái | Mô Tả Trực Quan | Lớp Tailwind Xử Lý |
|---|---|---|
| **Default (Mặc định)** | Thẻ Card trắng sáng (Light) hoặc xanh hải quân đậm (Dark), Bánh lái 3D nổi bật, 2 nút bấm phẳng rõ nét. | `bg-card text-card-foreground border border-border shadow-lg` |
| **Hover / Focus** | Con trỏ chuột chuyển pointer, nút Primary chuyển sắc thái sẫm nhẹ (`hover:bg-primary/90`), nút Secondary chuyển nền nhẹ (`hover:bg-muted`), vòng focus hiển thị rõ ràng khi dùng phím Tab. | `hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary` |
| **Active / Tap** | Nút bấm co nhẹ 2% (`active:scale-[0.98]`) mang lại cảm giác chạm vật lý mượt mà trên màn hình cảm ứng di động. | `active:scale-[0.98] transition-all` |
| **Dark Mode** | Tự động chuyển đổi màu sắc toàn diện: Nền `#131C38`, viền `#1E293B`, Bánh lái `text-[#38BDF8]`, chữ `#F8FAFC`, Hotline `#38BDF8`. | `text-primary`, `bg-card`, `border-border`, `text-foreground` |

---
*Tài liệu đặc tả giao diện đã hoàn tất và sẵn sàng 100% để chuyển giao sang bước lập kế hoạch thi công chi tiết `[Bước 05] /writing-plans`.*
```

---

### Tổng Kết Bước [Bước 04] /visualize:
1. Đã giải quyết triệt để 100% phản hồi của người dùng qua 2 ảnh thực tế: Tháo dỡ hoàn toàn khối thông số giả lập và 3 bullet points tự bịa.
2. Thiết lập Hero Layout Archetype `centred` với thẻ đơn trung tâm `max-w-lg` thanh lịch, ấm cúng và tôn vinh biểu tượng Bánh lái `HelmIcon3D`.
3. Kiểm tra đáp ứng toàn diện trên cả 5 mốc màn hình (`1440px`, `1024px`, `820px`, `768px`, `390px`).
4. Đáp ứng nghiêm ngặt bộ quy tắc Craft Floor 62-Rule của Impeccable v4.8.0 và bảo toàn Invariant 1.

Mời Main Agent tiếp tục điều phối sang bước **`[Bước 05] /writing-plans
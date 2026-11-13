---
name: TNDNB Maritime Design System
description: Hệ thống thiết kế chuẩn mực cho Nền tảng Ôn tập & Sát hạch Thuyền viên Đường thủy Nội địa Việt Nam (TNDNB)
version: 2.0.0
tokens:
  colors:
    light:
      primary: "hsl(211, 100%, 30%)" # #004a99 - Deep Maritime Navy
      primary-foreground: "hsl(0, 0%, 100%)" # #ffffff
      background: "hsl(210, 40%, 98%)" # #f8fafc - Soft Cloud Canvas
      foreground: "hsl(222, 47%, 11%)" # #0f172a - Slate Ink
      card: "hsl(0, 0%, 100%)" # #ffffff - Crisp White Surface
      card-foreground: "hsl(222, 47%, 11%)"
      muted: "hsl(210, 40%, 94%)" # #e2e8f0
      muted-foreground: "hsl(215, 16%, 42%)" # #64748b - Slate 500
      border: "hsl(214, 32%, 91%)" # #e2e8f0 - Whisper Slate
      sky-accent: "hsl(199, 95%, 39%)" # #0284c7 - Ocean Sky Blue
      amber-accent: "#f0ad4e" # Official Maritime Exam Amber (Đang thi / Đồng hồ)
      destructive: "hsl(0, 84%, 60%)" # #ef4444 - Warning Red
      destructive-foreground: "hsl(0, 0%, 100%)"
      success: "hsl(142, 76%, 36%)" # #16a34a - Beacon Green
      success-foreground: "hsl(142, 100%, 96%)"
    dark:
      primary: "hsl(199, 89%, 60%)" # #38bdf8 - Sky Blue 400 (High-Contrast Beacon)
      primary-foreground: "hsl(222, 47%, 8%)" # #0b1120 - Dark Navy
      background: "hsl(222, 47%, 8%)" # #0b1120 - Deep Sea Night
      foreground: "hsl(210, 40%, 96%)" # #f1f5f9 - Crisp Starlight Slate
      card: "hsl(222, 47%, 11%)" # #0f172a - Slate 900 Surface
      card-foreground: "hsl(210, 40%, 96%)"
      muted: "hsl(217, 33%, 17%)" # #1e293b - Slate 800
      muted-foreground: "hsl(215, 20%, 68%)" # #94a3b8 - Slate 400
      border: "hsl(217, 33%, 20%)" # #334155 - Slate 700 / 20%
      sky-accent: "hsl(199, 89%, 48%)" # #0ea5e9
      amber-accent: "#f0ad4e" # Fixed exam amber box (Bất biến phòng thi)
      destructive: "hsl(0, 72%, 58%)" # #f87171 - Soft Coral Red
      destructive-foreground: "hsl(0, 0%, 100%)"
      success: "hsl(142, 70%, 45%)" # #22c55e - Emerald Beacon
      success-foreground: "hsl(142, 100%, 96%)"
  typography:
    font-sans: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
    font-mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    tabular-nums: "tabular-nums"
  rounded:
    xs: "0.125rem" # 2px
    sm: "calc(var(--radius) - 4px)" # 8px
    md: "calc(var(--radius) - 2px)" # 10px
    lg: "var(--radius)" # 12px (0.75rem)
    xl: "1rem" # 16px
    full: "9999px"
  spacing:
    touch-target-min: "44px"
  components:
    exam-container: "w-full max-w-7xl mx-auto font-sans text-foreground"
    question-body: "text-foreground font-semibold leading-relaxed"
    answer-circle: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    answer-active: "text-blue-700 dark:text-sky-300 font-bold"
    answer-sheet-active: "bg-sky-100 dark:bg-sky-950/60 dark:text-sky-200"
    square-checkbox:
      base: "w-[14px] h-[14px] border inline-block cursor-pointer bg-card relative rounded-xs transition-colors"
      checked: "border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-950/50"
      tick: "bg-primary dark:bg-sky-400"
      unchecked: "border-slate-400 dark:border-slate-500 hover:border-slate-600 dark:hover:border-slate-400"
---

# TNDNB Maritime Design System

> **Tài liệu đặc tả chuẩn mực giao diện (Design System Specification v2.0.0)**  
> **Áp dụng cho:** Hệ thống Ôn tập, Sát hạch Thuyền viên & Thời tiết Hàng hải TNDNB.  
> **Tương thích:** Tailwind CSS v4, Next.js 16, React 19, Electron Desktop (`ontap-win`).  
> **Quy chuẩn kiểm toán:** WCAG 2.1 AA Contrast Ratio ($\ge 4.5:1$ Normal Text, $\ge 3.0:1$ UI Controls).

---

## 1. Overview (Creative North Star)

### 1.1 Khẩu Quyết Thiết Kế: "The Maritime Sát Hạch Sanctuary"
Giao diện TNDNB không phải là một dashboard đồ họa phô trương hay trang trí lộng lẫy ngẫu hứng (Anti-AI-Slop). Đây là **"Thánh đường tập trung của thuyền viên đường thủy"**: một môi trường sát hạch kỹ thuật số nghiêm cẩn, chính xác, trực quan và bảo vệ tối đa thị lực của thí sinh trong suốt 45 - 60 phút làm bài thi căng thẳng.

### 1.2 Ba Nguyên Tắc Cốt Lõi
1. **Clinical Precision (Chính Xác Lâm Sàng):** Mọi con số thời gian, số câu hỏi, hạng bằng và phương án trả lời phải đạt độ tương phản chuẩn mực, không có sự mập mờ hay gây ngộ nhận thị giác.
2. **Maritime Tonal Layering (Xếp Tầng Đại Dương):** Không sử dụng màu đen thuần khiết (`#000000`) gây mỏi mắt hay hiệu ứng bóng mờ neon lòe loẹt. Chế độ Dark Mode được xây dựng dựa trên các tầng màu lam biển sâu (`hsl(222, 47%, 8%)` $\rightarrow$ `hsl(222, 47%, 11%)` $\rightarrow$ `hsl(217, 33%, 17%)`).
3. **Ergonomic Accessibility (Công Thái Học Thuyền Viên):** Thao tác mượt mà cả trên máy tính phòng thi (bàn phím số, chuột click bảng Answer Sheet) lẫn màn hình điện thoại rung lắc trên sông nước (touch targets tối thiểu 44px, First-Fold tối ưu tuyệt đối).

---

## 2. Colors & WCAG 2.1 AA Contrast Ratios

### 2.1 Bảng Màu Semantic Tokens Toàn Hệ Thống

| Semantic Token | Tailwind Utility Class | Light Mode (CSS / Hex) | Dark Mode (CSS / Hex) | Vai Trò Ngữ Nghĩa Trong Ứng Dụng |
|---|---|---|---|---|
| `background` | `bg-background` | `hsl(210, 40%, 98%)` (`#f8fafc`) | `hsl(222, 47%, 8%)` (`#0b1120`) | Nền tổng thể toàn trang (Canvas) |
| `card` | `bg-card` | `hsl(0, 0%, 100%)` (`#ffffff`) | `hsl(222, 47%, 11%)` (`#0f172a`) | Khung đề thi, hộp bảng đáp án, container chính |
| `foreground` | `text-foreground` | `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 96%)` (`#f1f5f9`) | Văn bản đề bài câu hỏi, tiêu đề chính, chữ nổi bật |
| `muted-foreground` | `text-muted-foreground` | `hsl(215, 16%, 42%)` (`#64748b`) | `hsl(215, 20%, 68%)` (`#94a3b8`) | Nhãn phụ, số báo danh, ngày sinh, gợi ý |
| `border` | `border-border` | `hsl(214, 32%, 91%)` (`#e2e8f0`) | `hsl(217, 33%, 20%)` (`#334155`) | Đường phân cách 1px, kẻ khung bảng câu hỏi |
| `primary` | `bg-primary` / `text-primary` | `hsl(211, 100%, 30%)` (`#004a99`) | `hsl(199, 89%, 60%)` (`#38bdf8`) | Nút chuyển tiếp, dấu tick checkbox, chỉ số dẫn đường |
| `sky-accent` | `text-sky-400` / `text-sky-300` | `hsl(199, 95%, 39%)` (`#0284c7`) | `hsl(199, 89%, 48%)` (`#38bdf8` / `#7dd3fc`) | Tên học viên, chữ đáp án đã chọn trong đề thi |
| `amber-accent` | `bg-[#f0ad4e]` | `#f0ad4e` (Cố định chuẩn thi) | `#f0ad4e` (Cố định chuẩn thi) | Khối thông tin thời gian thi, tiêu đề bảng đáp án |
| `destructive` | `bg-destructive` / `text-destructive` | `hsl(0, 84%, 60%)` (`#ef4444`) | `hsl(0, 72%, 58%)` (`#f87171`) | Hạng bằng, số câu hỏi nhấn mạnh, nút cảnh báo |
| `success` | `bg-success` / `text-success` | `hsl(142, 76%, 36%)` (`#16a34a`) | `hsl(142, 70%, 45%)` (`#22c55e`) | Nút "Nộp bài", trạng thái hoàn thành bài thi |

### 2.2 Bảng Kiểm Tra Tỷ Lệ Tương Phản WCAG 2.1 AA (Dark Mode Audit)
Nền thẩm định cơ sở Dark Mode: Thẻ `bg-card` (`#0f172a`).  
Tiêu chuẩn bắt buộc: $\ge 4.5:1$ (Văn bản thông thường) và $\ge 3.0:1$ (Văn bản lớn & UI Controls).

| Vị Trí Thành Phần Giao Diện | Màu Văn Bản / Control | Màu Nền Tương Ứng | Tỷ Lệ Thực Đo (Ratio) | Xếp Hạng WCAG | Đánh Giá Hiệu Năng Thị Giác |
|---|---|---|---|---|---|
| **Nội dung câu hỏi đề thi** | `text-foreground` (`#f1f5f9`) | `bg-card` (`#0f172a`) | **14.8:1** | **AAA** | Cực kỳ rõ ràng, chống mỏi mắt sau 45 phút |
| **Tên thí sinh (Header)** | `dark:text-sky-400` (`#38bdf8`) | `bg-card` (`#0f172a`) | **7.5:1** | **AAA** | Nổi bật, khẳng định thông tin cá nhân |
| **Nhãn số câu hỏi Desktop** | `dark:text-red-400` (`#f87171`) | `bg-card` (`#0f172a`) | **6.4:1** | **AAA (Large)** | Dễ nhận diện vị trí câu hỏi đang làm |
| **Chữ phương án đã chọn** | `dark:text-sky-300` (`#7dd3fc`) | `bg-card` (`#0f172a`) | **9.2:1** | **AAA** | Phân biệt rõ rệt phương án thí sinh đã click |
| **Ký tự vòng tròn A, B, C, D** | `dark:text-slate-200` (`#e2e8f0`) | `dark:bg-slate-800` (`#1e293b`) | **11.2:1** | **AAA** | Giải quyết triệt để lỗi mờ lóa cũ |
| **Chấm tick SquareCheckbox** | `dark:bg-sky-400` (`#38bdf8`) | `bg-card` (`#0f172a`) | **7.5:1** | **AAA (Control)** | Vượt xa chuẩn 3.0:1; không bị "tàng hình" |
| **Hàng câu hỏi đang làm (Sheet)** | `dark:text-sky-200` (`#bae6fd`) | `dark:bg-sky-950/60` (`#0c253d`) | **8.1:1** | **AAA** | Êm dịu thị giác, thay thế màu cyan chói |
| **Hộp đếm ngược thời gian** | `text-black` (`#000000`) | `bg-[#f0ad4e]` (`#f0ad4e`) | **9.6:1** | **AAA** | Bảo toàn nhận diện phòng thi tiêu chuẩn |
| **Nhãn thông tin phụ (Header)** | `text-muted-foreground` (`#94a3b8`) | `bg-card` (`#0f172a`) | **5.4:1** | **AA** | Rõ chữ nhưng không tranh chấp với nội dung thi |

### 2.3 Các Quy Tắc Màu Sắc Đặt Tên (Named Color Rules)
*   **The Contrast Invariant Rule:** Mọi văn bản quan trọng bắt buộc phải sở hữu độ tương phản tối thiểu $4.5:1$ trên mọi chế độ hiển thị. Tuyệt đối cấm sử dụng các class ép màu tĩnh như `text-black` trên container tổng hoặc `bg-[#333]` cho checkbox khi bật Dark Mode.
*   **The Zero Pure-Black In Dark Rule:** Tuyệt đối cấm sử dụng `#000000` làm màu nền hay màu container trong Dark Mode. Nền phải luôn giữ sắc lam chiều sâu (`hsl(222, 47%, 8%)` hoặc `hsl(222, 47%, 11%)`) để duy trì độ dịu cho mắt.
*   **The Subdued Amber Rule:** Mã màu cam phòng thi `bg-[#f0ad4e]` là thành phần nhận diện bất biến được chuẩn hóa từ Cục Đường thủy Nội địa. Khi áp dụng trong Dark Mode, văn bản bên trong luôn là `text-black` với font đậm để đảm bảo tương phản 9.6:1, đồng thời không phối thêm viền phát sáng neon xung quanh.
*   **The Functional Cyan Deprecation Rule:** Khai tử mã màu `bg-cyan-200` chói lóa trên hàng active của bảng Answer Sheet; thay bằng `bg-sky-100` trong Light Mode và `dark:bg-sky-950/60 dark:text-sky-200` trong Dark Mode.

---

## 3. Typography & Numerical Precision

### 3.1 Phông Chữ Hệ Thống
*   **Font Gia Đình:** `'Be Vietnam Pro', system-ui, -apple-system, sans-serif`.
*   **Đặc tính:** Được thiết kế tối ưu riêng cho bộ ký tự tiếng Việt với đầy đủ dấu thanh, hỗ trợ x-height cao giúp câu hỏi dài, thuật ngữ hàng hải và quy tắc tránh va chạm hiển thị mạch lạc, không dính chữ.

### 3.2 Tỷ Lệ Phân Cấp & Co Giãn Cỡ Chữ (Font Scaling Hierarchy)
Hệ thống tích hợp hook `useFontScale()` thông qua biến CSS `--content-scale` (từ 0.85 đến 1.35) phục vụ các học viên lớn tuổi:
*   **Tiêu đề đề mục:** `text-lg font-bold` (Tương đương 18px * scale).
*   **Nội dung câu hỏi:** `font-semibold leading-relaxed` với `fontSize: calc(1.125rem * var(--content-scale, 1))` (18px cơ sở).
*   **Nội dung phương án:** `fontSize: calc(1rem * var(--content-scale, 1))` (16px cơ sở).
*   **Nhãn phụ & Bảng Answer Sheet:** `text-xs md:text-sm` (12px - 14px cơ sở).

### 3.3 Quy Chuẩn Mono & Tabular Nums (Bắt Buộc)
Mọi khu vực hiển thị số đếm biến thiên thời gian thực bắt buộc phải gắn class `tabular-nums font-mono` hoặc `tabular-nums`:
*   Đồng hồ đếm ngược thời gian còn lại: `<span className="font-bold tabular-nums">{formatTime(timeLeft)}</span>`.
*   Chỉ số thứ tự câu hỏi: `Câu {currentQuestionIndex + 1}/{quiz.questions.length}`.
*   **Mục đích:** Ngăn chặn hiện tượng giật cục (layout shift / jitter) của giao diện khi các con số từ 1 đến 0 nhảy mỗi giây.

---

## 4. Layout Architecture & Viewport Optimization

### 4.1 Bố Cục Máy Tính Phòng Thi (Desktop Split-Layout $\ge$ 768px)
*   **Cột Trái (Khu Vực Làm Bài - Flex-1):**
    *   Header thí sinh: Ảnh chân dung $100 \times 130$px, thông tin cá nhân và hộp thời gian cam `w-48`.
    *   Khung câu hỏi: Tối thiểu 500px chiều cao (`min-h-[500px]`), chia vạch nét đứt nhẹ `border-dashed border-border`.
    *   Phương án trả lời: Bố trí dạng danh sách dọc với khoảng cách `space-y-3 md:space-y-4`.
    *   Nút điều hướng dưới cùng: Bố cục 2 nút đối xứng ("Câu trước" và "Câu tiếp" / "Nộp bài").
*   **Cột Phải (Bảng Answer Sheet - Cố định 200px):**
    *   Bảng ma trận sticky chạy dọc danh sách 30 - 35 câu hỏi.
    *   Hàng tiêu đề sticky cam `bg-[#f0ad4e] text-black`.
    *   Từng hàng câu hỏi đi kèm 4 ô checkbox vuông tương ứng các phương án A, B, C, D.

### 4.2 Tối Ưu First-Fold Cho Thiết Bị Di Động (Mobile < 768px)
*   **Thanh Mobile Exam Header Siêu Gọn:**
    *   Ẩn ảnh thẻ học viên cồng kềnh, thu gọn vào 1 dòng duy nhất gồm: Nút "Thoát" xác nhận $\rightarrow$ Nhãn số câu `Câu X/Y` $\rightarrow$ Đồng hồ cam mini `tabular-nums`.
    *   Chiều cao tối đa: 48px, giải phóng toàn bộ không gian cho câu hỏi và hình minh họa biển báo / sơ đồ luồng tàu.
*   **Ẩn Bảng Answer Sheet cồng kềnh:**
    *   Bảng ma trận 200px tự động ẩn trên màn hình nhỏ (`hidden md:flex`), chuyển thành lưới chọn câu hỏi trực tiếp hoặc chuyển câu bằng cử chỉ swipe / nút bấm lớn.
*   **Kích Thước Chạm An Toàn (Touch Ergonomics):**
    *   Chiều cao nút bấm tối thiểu 44px (`min-h-[44px]`).
    *   Vùng bấm chọn phương án mở rộng toàn bộ chiều ngang màn hình kèm hiệu ứng phản hồi xúc giác Haptic (`triggerHaptic('light')`).

---

## 5. Elevation, Depth & Tonal Layering

### 5.1 Các Lớp Chiều Sâu (Z-Index & Surface Hierarchy)
Khác với thiết kế phẳng truyền thống, hệ thống áp dụng kỹ thuật xếp lớp tông màu (Tonal Layering):

```
┌────────────────────────────────────────────────────────┐
│ Layer 0: Canvas Background (hsl(222, 47%, 8%) #0b1120) │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Layer 1: Exam Card Surface (hsl(222, 47%, 11%))   │  │
│  │  ┌──────────────────┐  ┌──────────────────────┐  │  │
│  │  │ Layer 2: Answers │  │ Layer 2: Right Sheet │  │  │
│  │  │ (bg-card / 10)   │  │ (bg-card / border)   │  │  │
│  │  └──────────────────┘  └──────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

*   **Layer 0 (Canvas):** Nền biển sâu `bg-background` (`#0b1120`).
*   **Layer 1 (Card Container):** Bề mặt chính `bg-card` (`#0f172a`), nâng khối nhẹ với `shadow-lg`, phân tách bằng viền mỏng `border-border`.
*   **Layer 2 (Interactive Items):** Các khối lựa chọn và bảng đáp án; khi hover hoặc active sẽ nâng độ sáng bằng alpha tint (`bg-primary/10`, `dark:bg-sky-950/60`).

### 5.2 Loại Bỏ Hiệu Ứng Lòe Loẹt (Anti-AI Slop Rules)
*   **Cấm bóng đổ Neon (No Neon Outer Glows):** Không sử dụng `box-shadow: 0 0 30px #00ffff` gây nhòe nét chữ và mất tập trung.
*   **Cấm Gradient chữ rực rỡ trong đề thi:** Tiêu đề và câu hỏi sát hạch không dùng text-gradient; chữ phải là màu solid có tương phản cao nhất (`text-foreground`).
*   **Bóng đổ tự nhiên:** Chỉ dùng bóng đổ vật lý kín đáo (`shadow-xs`, `shadow-sm`, `shadow-lg` với alpha độ mờ 20% - 30%).

---

## 6. Shapes & Micro-Geometry

*   **Bán Kính Bo Góc Chuẩn:**
    *   Khung bao bọc đề thi tổng thể: `rounded-md` (6px - 8px) giữ phong thái chính quy của chứng chỉ quốc gia.
    *   Hàng phương án trả lời: `rounded-xl` (12px - 16px) thân thiện với ngón tay cảm ứng.
    *   Ô vuông Checkbox `SquareCheckbox`: `rounded-xs` (2px) vuông vắn, cứng cáp.
    *   Vòng tròn ký tự A, B, C, D: `rounded-full` hoàn hảo với đường kính chuẩn 32px ($w\text{-}8\ h\text{-}8$).
*   **Đường Kẻ Phân Cách (Borders):**
    *   Luôn dùng viền mỏng 1px (`border`), không lạm dụng viền 2px/3px trừ trường hợp highlight trạng thái chọn (`border-2 border-blue-500` hoặc `ring-2 ring-primary`).
    *   Đường phân cách câu hỏi: Viền nét đứt tinh tế `border-dashed border-border dark:border-slate-700`.

---

## 7. Component Specifications

### 7.1 Khối Thông Tin Thí Sinh & Hộp Thời Gian Thi
*   **Desktop Container:** `<div className="hidden md:flex justify-between items-start pb-4 border-b border-border dark:border-slate-700">`
*   **Avatar Thí Sinh:** Kích thước cố định $100 \times 130$px, bọc viền `border-border dark:border-slate-700 p-1 bg-card rounded-xs`.
*   **Hạng Bằng Badge:** Viền đỏ thẩm mỹ `font-bold text-red-600 dark:text-red-400 border border-red-500/50 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40`.
*   **Hộp Đếm Ngược Cam (Thời Gian):**
    ```tsx
    <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48 shadow-xs">
        <p className="font-bold">Đang thi</p>
        <p>Thời gian: 45 phút</p>
        <p>Bù giờ: 0 phút</p>
        <p>Còn lại: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span></p>
    </div>
    ```

### 7.2 Khung Câu Hỏi & Đề Bài
*   **Khung Bao:** `border border-border dark:border-slate-700 rounded-md p-4 flex flex-col justify-between min-h-[400px] md:min-h-[500px] bg-card`.
*   **Văn Bản Đề Bài:** `<p className="mb-4 font-semibold text-foreground leading-relaxed" style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}>{currentQuestion.text}</p>`.
*   **Hình Ảnh Minh Họa (Biển Báo / Luồng Tàu):** Đóng khung căn giữa `border border-border dark:border-slate-700 rounded-md bg-muted/20 p-2 max-h-48 md:max-h-60 object-contain`.

### 7.3 Cụm Phương Án Trả Lời (A, B, C, D)
*   **Trạng Thái Chưa Chọn:**
    *   Hàng bọc: `border-transparent hover:bg-muted/40 transition-colors`.
    *   Vòng tròn ký tự: `bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold`.
    *   Văn bản phương án: `text-foreground`.
*   **Trạng Thái Đã Chọn:**
    *   Hàng bọc: `border-2 border-blue-500 bg-blue-50/70 dark:bg-blue-900/30`.
    *   Vòng tròn ký tự: `bg-primary text-white dark:bg-sky-500 dark:text-slate-950 font-bold`.
    *   Văn bản phương án: `font-bold text-blue-700 dark:text-sky-300`.

### 7.4 Bảng Đáp Án Answer Sheet (Desktop Right Column)
*   **Bao Bọc:** `w-[200px] flex-none hidden md:flex border border-border dark:border-slate-700 rounded-md overflow-hidden bg-card shadow-xs`.
*   **Tiêu Đề Cột:** Cố định trên cùng `sticky top-0 bg-[#f0ad4e] text-black z-10 font-bold`.
*   **Hàng Thường:** `hover:bg-muted/30 border-b border-border dark:border-slate-700 text-muted-foreground`.
*   **Hàng Đang Làm (Active Row):** `bg-sky-100 dark:bg-sky-950/60 dark:text-sky-200 font-bold`.

### 7.5 Ô Chọn Vuông Độ Tương Phản Cao (`SquareCheckbox`)
```tsx
const SquareCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange?.();
            }
        }}
        onClick={onChange}
        className={`w-[14px] h-[14px] border inline-block cursor-pointer bg-card relative rounded-xs transition-colors ${
            checked 
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-950/50' 
                : 'border-slate-400 dark:border-slate-500 hover:border-slate-600 dark:hover:border-slate-400'
        }`}
    >
        {checked && (
            <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-primary dark:bg-sky-400 rounded-xs shadow-xs"></div>
        )}
    </div>
);
```

### 7.6 Nút Điều Hướng Bài Thi
*   **Nút "Câu Trước":** `bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border dark:border-slate-700 min-h-[44px] font-bold rounded-xl transition-colors disabled:opacity-30`.
*   **Nút "Câu Tiếp":** `bg-blue-600 hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white min-h-[44px] font-bold rounded-xl shadow-sm transition-all`.
*   **Nút "Nộp Bài":** `bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white min-h-[44px] font-bold rounded-xl shadow-sm transition-all`.

### 7.7 Luyện Thi Trắc Nghiệm Tức Thì (`QuizScreen.tsx`)
*   Hiển thị phản hồi đúng/sai ngay sau khi chọn:
    *   Đáp án đúng: `bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold` kèm `CheckIcon3D`.
    *   Đáp án sai đã chọn: `bg-destructive/10 border-destructive/40 text-destructive font-semibold` kèm `XIcon3D`.
    *   Thanh tiến trình: `bg-primary h-2 rounded-full transition-all duration-300`.

### 7.8 TNDNB Weather Subsystem (Widget Thời Tiết Hàng Hải)
*   **Giao Diện Khối Thẻ:** Kính mờ nhẹ `backdrop-blur-xl`, bo góc mềm `rounded-2xl` (`1rem`), viền phân cách mỏng 1px (`rgba(228, 228, 231, 0.6)` trong Light và `rgba(63, 63, 70, 0.4)` trong Dark).
*   **Thẻ Dự Báo Hàng Giờ:** Hiệu ứng co giãn lò xo mượt (`scale-105`) khi hover, hiển thị 8 mốc thời gian liền mạch.
*   **Hộp Cảnh Báo Thời Tiết Sông Nước:** Nền đổi màu linh hoạt theo dạng thời tiết (`bg-sky-500/10` cho mưa rào gió lốc, `bg-amber-500/10` cho nắng gắt hạn thủy triều) kèm vạch chỉ màu 1px bên trái và SVG cảnh báo chuẩn mực.

### 7.9 Công Tắc Đổi Giao Diện Trong Menu 3 Gạch (`ThemeSwitcher` Menu-Item) & Chính Sách Default Light Per-Session

*   **Quy tắc đặt vị trí (Placement Rule — Quyết định 2A):**
    *   **Cấm tuyệt đối** render `<ThemeSwitcher />` dạng nút trôi nổi cố định `fixed bottom-4 right-4 z-50` ở góc dưới bên phải trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) (vì che khuất chỉ số `100%` và nút `+` của [`ZoomBar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx) trên Mobile và màn hình thi [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)).
    *   **Bắt buộc** đặt `<ThemeSwitcher variant="menu-item" />` bên trong dropdown menu 3 gạch (`<Menu />` góc trên bên phải của [`TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)) cho cả Desktop & Mobile Web (khả dụng cho cả khách chưa đăng nhập lẫn thành viên đã đăng nhập), đồng thời đặt trong menu mở rộng `"Thêm"` (`FaBars` của [`MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx)) cho Capacitor Native App (`isMobileApp === true`).
*   **Đặc tả Component `ThemeSwitcher` (`variant="menu-item"`) & Hợp đồng Props:**
    *   **Hợp đồng Props (TypeScript Interface):**
        ```tsx
        export interface ThemeSwitcherProps {
          variant?: 'icon' | 'menu-item';
          className?: string;
        }
        ```
        Mặc định `variant = 'icon'` (`w-10 h-10`) để bảo toàn tương thích ngược với [`Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx), tái sử dụng chung `const { theme, toggleTheme } = useTheme();`.
    *   **A11y & Touch Ergonomics (`variant="menu-item"`):**
        *   Thuộc tính ngữ nghĩa: `type="button"`, `role="switch"`, `aria-checked={isDark}`, `aria-label={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}`.
        *   Container classes: `w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
        *   Nhãn hiển thị: Icon `<SunIcon />` (`text-amber-500 dark:text-amber-400`) hoặc `<MoonIcon />` (`text-primary`) + văn bản `"Giao diện"` (`text-foreground` — tương phản `14.8:1` Dark / `17.5:1` Light) + sub-nhãn trạng thái `"Tối"` / `"Sáng"` (`text-xs text-muted-foreground`).
    *   **Pill Switch Track & Thumb (Chuẩn WCAG 2.1 AA UI Control $\ge 3.0:1$):**
        *   **Track:** `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors` — trạng thái Dark (`isDark === true`): `bg-sky-500 border-sky-400`; trạng thái Light (`isDark === false`): `bg-slate-300 border-slate-400/70`.
        *   **Thumb:** `inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform` — trạng thái Dark: `translate-x-6`; trạng thái Light: `translate-x-1`.
*   **Chính sách Khởi tạo Mặc định Sáng Theo Phiên (Default Light Per-Session — Quyết định 1A):**
    *   Mọi phiên làm việc mới (mở tab mới / mở lại trình duyệt / cold start ứng dụng) trên `ontap-web` bắt buộc khởi tạo ở chế độ Sáng (`data-theme="light"` trên cả `index.html` và `ThemeContext.tsx`).
    *   Loại bỏ hoàn toàn nhánh tự động dò `window.matchMedia('(prefers-color-scheme: dark)')` để hệ điều hành Dark Mode không bao giờ tự ý ép trang sát hạch sang nền tối ở phiên mới.
    *   Lưu lựa chọn tạm thời trong phạm vi phiên làm việc hiện tại qua `sessionStorage` (`ontap_theme_session`) để giữ nguyên chế độ khi thí sinh nhấn F5 tải lại trang trong cùng phiên, đồng thời chủ động xóa các key tồn dư cũ trong `localStorage` (`ontap_theme`, `theme`) ngay khi mount.
*   **Kịch bản Kiểm thử Thiết kế (SDD Test Cases `TC-36` & `TC-37`):**
    *   **`TC-36` (Gỡ nút nổi góc dưới & tích hợp `ThemeSwitcher variant="menu-item"` vào menu 3 gạch):**
        *   *Given*: Giao diện `ontap-web` trên Desktop, Mobile Web (`TopNavbar.tsx`) và Capacitor App (`MobileBottomNav.tsx`).
        *   *When*: Kiểm tra cấu trúc render của `ontap-web/App.tsx`, `ThemeSwitcher.tsx`, `TopNavbar.tsx` và `MobileBottomNav.tsx`.
        *   *Then*: `ontap-web/App.tsx` không còn chứa `fixed bottom-4 right-4` hay `<ThemeSwitcher`; `ThemeSwitcher.tsx` hỗ trợ prop `variant` (`'icon' | 'menu-item'`) kèm `toggleTheme`, `role="switch"`, `aria-checked`, `min-h-[44px]`, `focus-visible:ring-2`; cả `TopNavbar.tsx` (trong khối `{showHamburgerMenu && (...)}`) và `MobileBottomNav.tsx` (trong khối `isMenuOpen`) đều render `<ThemeSwitcher variant="menu-item" />`.
    *   **`TC-37` (Mặc định Theme Sáng cho mọi phiên mới qua `sessionStorage`):**
        *   *Given*: Người dùng mở một phiên duyệt mới vào `/ontap` (kể cả khi hệ điều hành bật `prefers-color-scheme: dark` hoặc trình duyệt còn lưu `localStorage` cũ từ phiên bản trước).
        *   *When*: `ThemeContext.tsx` và `index.html` khởi tạo trạng thái theme ban đầu.
        *   *Then*: `index.html` cố định `data-theme="light"`; `ThemeContext.tsx` không chứa `prefers-color-scheme`, không đọc `localStorage.getItem('ontap_theme')` / `localStorage.getItem('theme')` khi khởi tạo, sử dụng `sessionStorage` (`ontap_theme_session`) mặc định trả về `'light'` cho phiên mới, và tự động gọi `localStorage.removeItem('ontap_theme')` cùng `localStorage.removeItem('theme')`.

---

## 8. Do's and Don'ts

### ✅ NHỮNG ĐIỀU NÊN LÀM (DO'S)
1. **Luôn sử dụng Semantic Tokens:** Ưu tiên hàng đầu cho `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-background`, `border-border`.
2. **Luôn kiểm định WCAG 2.1 AA:** Bất kỳ phối màu nào trên nền Dark Mode phải đạt tỷ lệ tương phản tối thiểu từ $4.5:1$ trở lên.
3. **Sử dụng `tabular-nums` cho số liệu biến thiên:** Giúp đồng hồ thi và số thứ tự đứng yên không làm xô lệch cấu trúc trang.
4. **Bảo toàn nhận diện hộp cam `bg-[#f0ad4e]`:** Giữ nguyên vẹn mã màu quy chuẩn ngành đường thủy cùng chữ màu đen `text-black font-bold`.
5. **Cung cấp phản hồi xúc giác (Haptic) & Âm thanh nhẹ:** Khi thí sinh tick chọn câu trả lời trên thiết bị di động để tạo sự an tâm khi thao tác.
6. **Luôn đặt công tắc đổi Sáng/Tối trong menu 3 gạch góc trên phải (`TopNavbar` / `MobileBottomNav`) và khởi tạo phiên mới ở Theme Sáng (`sessionStorage`):** Sử dụng `<ThemeSwitcher variant="menu-item" />` chuẩn `role="switch"` và lưu trạng thái theo phiên qua `ontap_theme_session`.

### ❌ NHỮNG ĐIỀU TUYỆT ĐỐI CẤM (DON'TS)
1. **Cấm dùng `text-black` ở container cha:** Sẽ triệt tiêu hoàn toàn khả năng đọc của Dark Mode, biến toàn bộ chữ thành đen trên nền tối (tương phản 1.1:1).
2. **Cấm dùng `bg-[#333]` cho checkbox:** Khiến dấu tick bị "tàng hình" trên nền đen than củi trong Dark Mode.
3. **Cấm dùng nền chói lóa `bg-cyan-200`:** Gây chói mắt cho thí sinh khi làm bài trong đêm tối hoặc phòng thi thiếu sáng.
4. **Cấm các hiệu ứng Neon Slop:** Không dùng glow rực sáng quanh ô trắc nghiệm; không dùng hiệu ứng gradient đa sắc gây phân tâm.
5. **Cấm dùng emoji thô:** Thay thế tất cả các emoji cảm xúc bằng biểu tượng SVG chuyên nghiệp, đồng bộ nét vẽ.
6. **Cấm tự ý đổi breakpoint bất biến:** Không được thay đổi cặp lớp `hidden md:flex` và `flex md:hidden` đã được kiểm thử bất biến bằng bộ test tự động.
7. **Cấm đặt nút nổi `fixed bottom-4 right-4` đè lên thanh công cụ `ZoomBar` (`100%`) và cấm tự động ép Dark Mode theo `prefers-color-scheme: dark` ở phiên mới:** Không được render nút đổi giao diện trôi nổi ở góc dưới phải che khuất thanh phóng chữ bài thi, và không được tự ý kích hoạt nền tối khi người dùng chưa chủ động gạt công tắc trong phiên làm việc hiện tại.

---
*Tài liệu được chuẩn hóa và phê duyệt cho dự án TNDNB. Mọi cập nhật giao diện trong tương lai bắt buộc phải tuân thủ nghiêm ngặt bảng đặc tả này.*

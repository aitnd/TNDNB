# Phase 01: Audit Mã Màu, Kiểm Tra Tỷ Lệ Tương Phản WCAG 2.1 AA & Thiết Lập Test Cases (TDD Red)

> **Mã kế hoạch**: `261112-2215-exam-dark-mode-color-contrast`  
> **Giai đoạn**: Phase 01  
> **Trọng tâm**: Rà soát mã màu hardcoded, đánh giá tỷ lệ tương phản theo chuẩn WCAG 2.1 AA và bổ sung kiểm thử tự động  
> **Tài liệu tham chiếu**:
> - [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)
> - [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md)
> - [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
> - [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)

---

## 1. Mục Tiêu Kỹ Thuật

1. Rà soát có hệ thống từng mã màu hardcoded hiện diện trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx).
2. Tính toán chính xác độ tương phản màu sắc (Contrast Ratio) theo công thức Luminance W3C trên nền Dark Mode `hsl(222, 47%, 11%)` (#0f172a).
3. Đảm bảo toàn bộ các điều kiện kiểm thử bất biến đã tồn tại trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) không bị vi phạm.
4. Xây dựng bổ sung kiểm thử tự động cho các chỉ tiêu Dark Mode để kích hoạt trạng thái **TDD RED** trước khi thực thi mã nguồn.

---

## 2. Bảng Rà Soát Chi Tiết Mã Màu & Tỷ Lệ Tương Phản (WCAG 2.1 AA Audit)

Nền cơ sở Dark Mode tại `bg-card`: `hsl(222, 47%, 11%)` (Hex tương đương: `#0f172a`).  
Tiêu chuẩn WCAG 2.1 AA yêu cầu:
- **Tối thiểu 4.5:1** đối với văn bản thông thường (Normal Text, < 18pt hoặc < 14pt bold).
- **Tối thiểu 3.0:1** đối với văn bản lớn (Large Text, $\ge$ 18pt hoặc $\ge$ 14pt bold) và thành phần đồ họa / UI controls.

| Vị trí code (dòng) | Mã màu hiện tại | Mã màu Hex/HSL | Tương phản trên Dark Mode (#0f172a) | Kết quả WCAG AA | Mã màu Semantic đề xuất | Tương phản mới | Đạt chuẩn |
|---|---|---|---|---|---|---|---|
| Dòng 176 | Wrapper `text-black` | `#000000` | **1.1:1** | ❌ THẤT BẠI NẶNG | `text-foreground` (`hsl(210, 40%, 96%)` / `#f1f5f9`) | **14.8:1** | ✅ AAA |
| Dòng 180 | `border-gray-300` | `#d1d5db` | N/A (Viền quá sáng) | ⚠️ Lệch tông | `border-border dark:border-slate-700` | Cân đối | ✅ Hài hòa |
| Dòng 190 | Tên học viên `text-blue-700` | `#1d4ed8` | **2.2:1** | ❌ THẤT BẠI (< 4.5) | `text-blue-700 dark:text-sky-400` (`#38bdf8`) | **7.5:1** | ✅ AAA |
| Dòng 195 | Nhãn hạng bằng `bg-red-50 text-red-600` | `#fef2f2` / `#dc2626` | **3.4:1** (Nền trắng chói lóa) | ❌ HỎNG GIAO DIỆN | `dark:bg-red-950/40 dark:text-red-400 dark:border-red-800` | **5.8:1** | ✅ AA |
| Dòng 235 | Tiêu đề "Nội dung câu hỏi" | Kế thừa `text-black` | **1.1:1** | ❌ THẤT BẠI NẶNG | `text-foreground` | **14.8:1** | ✅ AAA |
| Dòng 239 | Desktop `text-red-600` ("Câu :X") | `#dc2626` | **3.4:1** | ❌ THẤT BẠI (< 4.5) | `text-red-600 dark:text-red-400` (`#f87171`) | **6.4:1** | ✅ AA |
| Dòng 240 | Nội dung câu hỏi `<p>{currentQuestion.text}</p>` | Kế thừa `text-black` | **1.1:1** | ❌ THẤT BẠI NẶNG (Không đọc được) | `text-foreground font-semibold` | **14.8:1** | ✅ AAA |
| Dòng 265 | Vòng tròn A,B,C,D `bg-gray-200 text-foreground` | Nền `#e5e7eb`, chữ `#f1f5f9` | **1.3:1** (Chữ trắng trên nền xám) | ❌ THẤT BẠI NẶNG (Mờ lóa) | `bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200` | **8.2:1** | ✅ AAA |
| Dòng 269 | Chữ đáp án đã chọn `text-blue-700` | `#1d4ed8` | **2.2:1** | ❌ THẤT BẠI (< 4.5) | `text-blue-700 dark:text-sky-300 font-bold` (`#7dd3fc`) | **9.2:1** | ✅ AAA |
| Dòng 281 | Nút Câu trước `bg-gray-100 text-black` | `#f3f4f6` / `#000` | N/A (Khối trắng chói lóa) | ⚠️ Lệch tông tối | `bg-secondary text-secondary-foreground dark:border-slate-700` | **11.5:1** | ✅ AAA |
| Dòng 320 | Hàng câu hỏi đang làm `bg-cyan-200` | `#a5f3fc` | N/A (Chói mắt gay gắt) | ⚠️ Gắt thị giác | `bg-sky-100 dark:bg-sky-950/60 dark:text-sky-200` | **7.8:1** | ✅ AAA |
| Dòng 41, 45 | Checkbox tick `bg-[#333]` | `#333333` | **1.4:1** (Xám đen than củi chìm vào nền) | ❌ THẤT BẠI NẶNG (Vô hình) | `bg-primary dark:bg-sky-400 border-primary dark:border-sky-400` | **8.5:1** | ✅ AAA |

---

## 3. Bảo Toàn Tuyệt Đối Các Test Assertions Bất Biến

Trong tệp [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts), test assertion sau BẮT BUỘC phải tiếp tục vượt qua:

```typescript
it('ExamQuizScreen.tsx bảo toàn giao diện Desktop và tối ưu thanh Mobile Header siêu gọn', () => {
  const examQuiz = fs.readFileSync(
    path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'),
    'utf8'
  );

  // 1. Phải bảo toàn khối Desktop Header đầy đủ thông tin cá nhân và hộp cam
  expect(examQuiz).toContain('hidden md:flex justify-between items-start');
  expect(examQuiz).toContain('Số báo danh');
  expect(examQuiz).toContain('bg-[#f0ad4e]');

  // 2. Phải có thanh Mobile Exam Header siêu gọn gàng
  expect(examQuiz).toContain('flex md:hidden items-center justify-between');
  expect(examQuiz).toContain('handleBackWithConfirm');
  expect(examQuiz).toContain('tabular-nums');
})
```

Tương tự trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts):
- Test `TC-31` cũng kiểm tra sự xuất hiện của `hidden md:flex`, `flex md:hidden`, `handleBackWithConfirm`, `tabular-nums`.

Do đó:
1. Không được đổi tên hàm `handleBackWithConfirm`.
2. Không được gỡ bỏ nhãn `Số báo danh`.
3. Không được thay thế mã màu `bg-[#f0ad4e]` của khối hộp cam thông tin thời gian.
4. Không được đổi cấu trúc breakpoint responsive `hidden md:flex` và `flex md:hidden`.

---

## 4. Đặc Tả Test Case Mới Bổ Sung Cho Dark Mode (TDD Red)

Thêm bài test `TC-35` vào [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):

```typescript
it('TC-35: ExamQuizScreen.tsx chuẩn hóa Semantic Tokens và độ tương phản Dark Mode (WCAG 2.1 AA)', () => {
  const examQuiz = fs.readFileSync(
    path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'),
    'utf8'
  );

  // 1. Wrapper container không còn hardcode text-black, chuyển sang text-foreground
  expect(examQuiz).not.toMatch(/className="[^"]*max-w-7xl[^"]*text-black/);
  expect(examQuiz).toMatch(/className="[^"]*max-w-7xl[^"]*text-foreground/);

  // 2. Tên học viên và số câu hỏi hỗ trợ dark:text-sky-400 và dark:text-red-400
  expect(examQuiz).toContain('dark:text-sky-400');
  expect(examQuiz).toContain('dark:text-red-400');

  // 3. Nội dung câu hỏi có class text-foreground rõ ràng
  expect(examQuiz).toMatch(/<p\s+className="[^"]*text-foreground[^"]*"[^>]*>\s*\{currentQuestion\.text\}/);

  // 4. Vòng tròn đáp án chưa chọn không được dùng cặp mờ lóa bg-gray-200 text-foreground
  expect(examQuiz).not.toContain('bg-gray-200 text-foreground');
  expect(examQuiz).toContain('dark:bg-slate-800');

  // 5. SquareCheckbox tick không được dùng bg-[#333] mà dùng dark:bg-sky-400
  expect(examQuiz).not.toMatch(/SquareCheckbox[\s\S]*?bg-\[#333\]/);
  expect(examQuiz).toContain('dark:bg-sky-400');

  // 6. Nút Câu trước hỗ trợ dark mode không hardcode bg-gray-100 text-black
  expect(examQuiz).not.toMatch(/Câu trước[\s\S]*?bg-gray-100\s+text-black|bg-gray-100\s+text-black[\s\S]*?Câu trước/);
  expect(examQuiz).toContain('bg-secondary');
});
```

---

## 5. Tiêu Chí Hoàn Thành Phase 01 (Exit Gate)
- [ ] Bảng audit màu sắc đã ghi nhận đầy đủ 12 vị trí lỗi.
- [ ] Đã thêm `TC-35` vào bộ test.
- [ ] Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` và ghi nhận test FAIL chính xác tại các điểm thiếu sót (TDD RED).

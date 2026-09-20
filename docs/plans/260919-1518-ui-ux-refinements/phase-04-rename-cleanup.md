# Phase 4: Rename ExamQuizScreen2, Fix QuizScreen & Mobile UX
Status: ⬜ Pending
Dependencies: Phase 1, Phase 2, Phase 3

## Objective
1. **Dọn dẹp triệt để:** Xóa 2 file dead code V1 (`ExamQuizScreen.tsx` cũ) trên CẢ 2 BÊN Web và Win.
2. **Rename đồng bộ:** Đổi tên `ExamQuizScreen2` → `ExamQuizScreen` trên CẢ 2 BÊN Web và Win, cập nhật tất cả imports liên quan.
3. **Fix `QuizScreen.tsx` (Supersede Phase 2.6):** Màn hình Ôn tập phải cho phép click thẳng vào text đáp án. Xóa bảng checkbox thừa, khôi phục sự kiện click nhưng BẮT BUỘC phải giữ lại logic `showReveal` / `highlight` (đổi màu xanh/đỏ). Thêm grid nút 1,2,3... chỉ để chuyển câu.
4. **Mobile Option A (Chỉ áp dụng Web):** Trên mobile của phần Thi thử (ExamQuizScreen), cho phép ấn thẳng text đáp án (ẩn bảng). Cô lập logic bằng CSS hoặc `isMobileApp` để không làm ảnh hưởng đến bản Desktop (Win) vốn dĩ không có responsive.

## Implementation Steps

### Task 4.1: Xóa dead code (Web & Win)
- [ ] **Step 4.1.1:** Xóa `ontap-web/components/ExamQuizScreen.tsx` (~305 dòng).
- [ ] **Step 4.1.2:** Xóa `ontap-win/components/ExamQuizScreen.tsx` (~224 dòng).
- [ ] **Step 4.1.3:** Verify grep: `ExamQuizScreen(?!2)` = 0 import hits trong `ontap-web/` và `ontap-win/` (dùng `--include='*.tsx' --include='*.ts' --include='*.mjs'`, loại trừ `docs/`).

### Task 4.2: Rename `ExamQuizScreen2` → `ExamQuizScreen` (Web & Win)
- [ ] **Step 4.2.1:** Đổi tên file `ExamQuizScreen2.tsx` → `ExamQuizScreen.tsx` trong `ontap-web/components/` (359 dòng) VÀ `ontap-win/components/` (293 dòng).
- [ ] **Step 4.2.2:** Sửa code bên trong cả 2 file: 
  - `ExamQuizScreen2Props` → `ExamQuizScreenProps`
  - Component name + `export default`
- [ ] **Step 4.2.3:** Cập nhật imports bên Web:
  - `AppRoutes.tsx:14,215,317`
  - `ThiTrucTuyenPage.tsx`
- [ ] **Step 4.2.4:** Cập nhật imports Win:
  - `AppRoutes.tsx:15,221`
  - `ThiTrucTuyenPage.tsx:8,264`
  - `ontap-win/refactor.mjs:62` — ⚠️ Nằm trong template string generator, sửa literal không đủ. Nên **archive** file này (đã hết nhiệm vụ) hoặc xóa nếu không còn dùng.
- [ ] **Step 4.2.5:** Grep `ExamQuizScreen2` trong `ontap-web/` và `ontap-win/` (`--include='*.tsx' --include='*.ts' --include='*.mjs'`) = 0 kết quả. Loại trừ `docs/` (có ~63 hits lịch sử là bình thường).

### Task 4.3: Fix `QuizScreen.tsx` (Ôn tập) — Supersede Phase 2.6
- [ ] **Step 4.3.1:** **Xóa bảng checkbox (Web Only).** Ở Web `QuizScreen.tsx:224-276`. Win `QuizScreen` (~210 dòng) **không có bảng checkbox**, không cần sửa.
- [ ] **Step 4.3.2:** **Khôi phục `onClick` an toàn.** Tại text đáp án (dòng `:191`), thêm lại hàm `handleAnswerSelect`. Tuyệt đối không xóa các class Tailwind đang phụ trách việc highlight (màu xanh cho câu đúng, màu đỏ cho câu sai khi `showReveal` = true).
- [ ] **Step 4.3.3:** **Thêm grid điều hướng.** Copy grid nút câu hỏi từ Web `ExamQuizScreen2:326-343` (KHÔNG phải 282-320 — đó là bảng table). Win không có grid này. Ràng buộc nút chỉ gọi `setCurrentQuestionIndex`, không làm thay đổi đáp án.

### Task 4.4: Mobile Option A (Web Only)
- [ ] **Step 4.4.1:** Trong `ExamQuizScreen` Web, code hiện tại **đã dùng `isMobileApp`** ở 5 chỗ (dòng 72, 208, 214, 216, 282, 326) cho Capacitor native app. Bổ sung thêm CSS `md:pointer-events-none` trên text đáp án để **mobile browser** (nơi `isMobileApp=false`) cũng click được. Hai cơ chế bổ trợ nhau: native app dùng `isMobileApp`, mobile browser dùng `md:` breakpoint.
- [ ] **Step 4.4.2:** Desktop Win: Giữ nguyên (luôn hiện bảng, text read-only, không có responsive).

## Manual QA Checklist
1. **Grep & Build:** 
   - `ExamQuizScreen2` = 0 hits **trong code** (loại trừ `docs/`, lịch sử có ~71 hits là bình thường).
   - `npm run build` pass trên Web. Win build check riêng.
2. **Ôn tập (QuizScreen - Web):**
   - Click đáp án nhận kết quả.
   - Trả lời sai hiện màu đỏ, đúng hiện màu xanh (highlight hoạt động).
   - Click số câu ở grid dưới cùng nhảy đúng câu.
3. **Thi thử (ExamQuizScreen):**
   - **Win:** Desktop UI không đổi. Bảng 5 cột hiển thị, click text không tác dụng.
   - **Web (Desktop ≥768px):** Giống Win — text pointer-events-none.
   - **Web (Mobile <768px):** Bảng tự ẩn, click thẳng vào text nhận đáp án.

# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist) — TDD Workflow

> **Mã kế hoạch**: `261107-1135-mobile-exam-screen-and-resume-banner`  
> **Quy trình chuẩn**: **TDD Red-Green-Refactor** (`Superpowers v7.0.2` & `writing-plans`)  
> **Trạng thái**: ✅ **ĐÃ HOÀN THÀNH TOÀN DIỆN (All Tests Green, Type Check Passed, Build Verified)**  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/plan.md)
> - Thiết kế giải pháp kỹ thuật: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/DESIGN.md)
> - Đặc tả giao diện trực quan: [`design-specs.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/design-specs.md)
> - Chi tiết Phase 01: [`phase-01-hide-mobile-exam-personal-info.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-01-hide-mobile-exam-personal-info.md)
> - Chi tiết Phase 02: [`phase-02-redesign-resume-exam-banner.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-02-redesign-resume-exam-banner.md)
> - Chi tiết Phase 03: [`phase-03-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-03-test-and-verification.md)
> - Tệp mã nguồn:
>   - [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
>   - [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx)
> - Tệp kiểm thử:
>   - [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
>   - [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 📌 Trạng Thái Các Phase (Living Progress)

- [x] **Phase 01: [TDD RED] Cập nhật bộ kiểm thử mô tả yêu cầu mới & xác nhận FAIL**
- [x] **Phase 02: [TDD GREEN - Part A] Tối ưu hóa ExamQuizScreen.tsx trên Mobile & xác nhận PASS TC-31**
- [x] **Phase 03: [TDD GREEN - Part B] Tái thiết kế Resume Session Banner trong App.tsx & xác nhận PASS TC-30**
- [x] **Phase 04: [TDD REFACTOR & VERIFY] Kiểm thử hồi quy, Type Check toàn diện & Build verification**

---

## 🛠️ Chi Tiết Từng Bước Thi Công Cụ Thể (Bite-Sized Actionable Checklist)

### Phase 01: [TDD RED] Cập Nhật Test Cases & Kiểm Chứng Thất Bại
*Tài liệu chi tiết: [`phase-03-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-03-test-and-verification.md)*

- [x] **Step 1.1**: Mở tệp [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts).
- [x] **Step 1.2**: Bổ sung `TC-30` kiểm tra `ontap-web/App.tsx`:
  - `expect(appContent).not.toContain('fixed bottom-4 left-1/2')`
  - `expect(appContent).not.toContain('animate-bounce')`
  - `expect(appContent).toContain('setResumeSessionAvailable(false)')`
  - `expect(appContent).toContain('resumeSession')`
- [x] **Step 1.3**: Bổ sung `TC-31` kiểm tra `ontap-web/components/ExamQuizScreen.tsx`:
  - `expect(examContent).toContain('hidden md:flex')`
  - `expect(examContent).toContain('flex md:hidden')`
  - `expect(examContent).toContain('handleBackWithConfirm')`
  - `expect(examContent).toContain('tabular-nums')`
- [x] **Step 1.4**: Cập nhật tệp [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) tại dòng 112 và dòng 202 để kiểm tra cấu trúc Desktop/Mobile Header và `tabular-nums` thay vì `git diff === ''`.
- [x] **Step 1.5 (Verify RED)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts` và xác nhận test FAIL (RED) do code chưa được triển khai.

---

### Phase 02: [TDD GREEN - Part A] Tối Ưu Hóa ExamQuizScreen.tsx Trên Mobile
*Tài liệu chi tiết: [`phase-01-hide-mobile-exam-personal-info.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-01-hide-mobile-exam-personal-info.md)*

- [x] **Step 2.1**: Mở tệp [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) tại dòng 179.
- [x] **Step 2.2**: Đổi khối header máy tính thành `hidden md:flex justify-between items-start pb-4 border-b border-gray-300`, bảo toàn 100% ảnh thẻ `100x130`, thông tin cá nhân và hộp cam `w-48`.
- [x] **Step 2.3**: Bổ sung khối Mobile Exam Header `flex md:hidden items-center justify-between pb-3 mb-2 border-b border-border`:
  - Nút `[← Thoát]` gọi `handleBackWithConfirm()`.
  - Nhãn hạng bằng `selectedLicense?.name` (`truncate`).
  - Tiến độ `Câu {currentQuestionIndex + 1}/{quiz.questions.length}` (`tabular-nums`).
  - Đồng hồ đếm ngược `⏱️ {formatTime(timeLeft)}` định dạng `font-mono tabular-nums` trong badge hổ phách `bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300`.
- [x] **Step 2.4 (Verify Part A)**: Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-31"` và xác nhận `TC-31` chuyển sang PASS (GREEN).

---

### Phase 03: [TDD GREEN - Part B] Tái Thiết Kế Resume Session Banner Trong App.tsx
*Tài liệu chi tiết: [`phase-02-redesign-resume-exam-banner.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-02-redesign-resume-exam-banner.md)*

- [x] **Step 3.1**: Mở tệp [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) tại dòng 65.
- [x] **Step 3.2**: Lấy selector `setResumeSessionAvailable` từ Zustand store `useAppStore((s) => s.setResumeSessionAvailable)`.
- [x] **Step 3.3**: Thay thế khối `fixed bottom-4 left-1/2` tại dòng 411 - 417 bằng Alert Banner thanh mảnh đặt ngay dưới Navbar/Header:
  ```tsx
  {resumeSessionAvailable && (
    <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm text-foreground shadow-xs animate-fade-in">
      <div className="flex items-center gap-2 truncate">
        <span className="text-base shrink-0">⚠️</span>
        <span className="font-medium truncate">Bạn có bài thi đang làm dở</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={resumeSession}
          className="px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition-colors shadow-xs"
        >
          Làm tiếp ngay
        </button>
        <button
          onClick={() => setResumeSessionAvailable(false)}
          className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-amber-500/20 transition-colors"
          title="Bỏ qua"
        >
          ✕
        </button>
      </div>
    </div>
  )}
  ```
- [x] **Step 3.4 (Verify Part B)**: Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts` và xác nhận cả `TC-30`, `TC-31` cùng toàn bộ 42/42 tests đều PASS (GREEN).

---

### Phase 04: [TDD REFACTOR & VERIFY] Kiểm Thử Toàn Diện & Nghiệm Thu
*Tài liệu chi tiết: [`phase-03-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1135-mobile-exam-screen-and-resume-banner/phase-03-test-and-verification.md)*

- [x] **Step 4.1 (Full Test Suite)**: Chạy `npx vitest run scripts/portal-navbar-cleanup.test.ts scripts/portal-login-dashboard.test.ts scripts/portal-homepage-editorial.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-console-and-tinymce-fix.test.ts` và xác nhận 54/54 tests PASS 100%.
- [x] **Step 4.2 (Type Check)**: Chạy `npx tsc --noEmit` ở cả root và `ontap-web` (kỳ vọng 0 lỗi).
- [x] **Step 4.3 (Build Verify)**: Chạy `npm --prefix ontap-web run build` để kiểm tra đóng gói bundle Vite của `ontap-web` thành công.
- [x] **Step 4.4 (Git Commit)**: Lưu mốc code lên Git an toàn với thông điệp chuẩn mực.

# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist) — Double-Sync

> **Mã kế hoạch**: `261112-2215-exam-dark-mode-color-contrast`  
> **Tài liệu tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)  
> **Quy trình chuẩn**: **TDD Red-Green-Refactor** (`Superpowers v7.0.2` & Double-Sync Protocol)  
> **Trạng thái**: 📋 **SẴN SÀNG THI CÔNG PHASE 05 (Phases 01–04 ✅ Hoàn thành | Phase 05 ✅ Đã chốt Frontier 1A & 2A — Đã làm giàu TDD `RED -> GREEN -> PASS`)**  
> **Tài liệu tham chiếu các Phase**:
> - Phase 01: [`phase-01-audit-and-tokens.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-01-audit-and-tokens.md)
> - Phase 02: [`phase-02-exam-quiz-screen-refactor.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-02-exam-quiz-screen-refactor.md)
> - Phase 03: [`phase-03-answer-sheet-and-checkboxes.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-03-answer-sheet-and-checkboxes.md)
> - Phase 04: [`phase-04-verification-and-qa.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-04-verification-and-qa.md)
> - Phase 05: [`phase-05-theme-switcher-menu-and-default-light.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-05-theme-switcher-menu-and-default-light.md)
> - Tệp mã nguồn:
>   - [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
>   - [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx)
>   - [`ontap-web/theme.css`](file:///d:/Antigravity/TNDNB/ontap-web/theme.css)
>   - [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx)
>   - [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx)
>   - [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
>   - [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx)
>   - [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx)
>   - [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html)
>   - [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md)
> - Tệp kiểm thử:
>   - [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
>   - [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)
>   - [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts)

---

## 📌 Bảng Tiến Độ Tổng Thể Các Phase (Living Progress)

- [x] **Phase 01: Audit mã màu, kiểm tra tỷ lệ tương phản WCAG 2.1 AA & Thiết lập kiểm thử TDD Red**
- [x] **Phase 02: Tái cấu trúc ExamQuizScreen.tsx - Bóc tách mã màu vùng câu hỏi, header và nút điều hướng**
- [x] **Phase 03: Chuẩn hóa Answer Sheet & Tái thiết kế SquareCheckbox tương phản cao trên Web & Desktop**
- [x] **Phase 04: Chạy nghiệm thu toàn diện 14 Vitest Suites, TypeScript Check & Build Verification**
- [ ] **Phase 05: Di chuyển nút đổi Sáng/Tối vào menu 3 gạch góc trên phải & Mặc định tất cả phiên mới là Theme Sáng**

---

## 🛠️ Chi Tiết Từng Bước Thi Công Cụ Thể (Atomic Actionable Checklist)

### Phase 01: Audit Mã Màu, Kiểm Tra Tương Phản WCAG 2.1 AA & Cập Nhật Test Cases
*Chi tiết kỹ thuật: [`phase-01-audit-and-tokens.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-01-audit-and-tokens.md)*

- [x] **Step 1.1**: Rà soát toàn bộ các vị trí hardcoded color trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx):
  - Dòng 176: `text-black` bao bọc toàn bộ component.
  - Dòng 180: `border-gray-300`.
  - Dòng 190: `text-blue-700` tên học viên.
  - Dòng 195: `bg-red-50 text-red-600 border-red-500` hạng bằng.
  - Dòng 233, 235: `border-gray-400`, `border-dashed border-gray-400`.
  - Dòng 239: `text-red-600` số câu hỏi.
  - Dòng 240: `<p className="mb-4 font-semibold"...>{currentQuestion.text}</p>` không có class màu.
  - Dòng 265: `bg-gray-200 text-foreground` vòng tròn đáp án.
  - Dòng 269: `text-blue-700` chữ đáp án được chọn.
  - Dòng 281: `bg-gray-100 text-black border-gray-300` nút Câu trước.
  - Dòng 320: `bg-cyan-200` hàng câu hỏi đang chọn trong Answer Sheet.
  - Dòng 41, 44: `bg-[#333]` dấu tick ô checkbox.
- [x] **Step 1.2**: Kiểm tra các assertions bất biến trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) (dòng 111-126) và [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (`TC-31`):
  - Phải duy trì: `hidden md:flex justify-between items-start`, `Số báo danh`, `bg-[#f0ad4e]`, `flex md:hidden items-center justify-between`, `handleBackWithConfirm`, `tabular-nums`.
- [x] **Step 1.3**: Bổ sung test case kiểm tra độ tương phản Dark Mode trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):
  - Thêm kiểm tra: Khung wrapper không còn `text-black` cố định mà dùng `text-foreground`.
  - Thêm kiểm tra: Nội dung câu hỏi `<p` có `text-foreground`.
  - Thêm kiểm tra: `SquareCheckbox` không còn dùng `bg-[#333]` chìm nghỉm mà dùng `dark:bg-sky-400`.
  - Thêm kiểm tra: Tên học viên có `dark:text-sky-400` hoặc tương đương.
- [x] **Step 1.4**: Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` để xác nhận kiểm thử chuyển sang trạng thái FAIL (TDD RED) trước khi sửa code.

---

### Phase 02: Refactor ExamQuizScreen.tsx - Vùng Câu Hỏi, Header & Nút Điều Hướng
*Chi tiết kỹ thuật: [`phase-02-exam-quiz-screen-refactor.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-02-exam-quiz-screen-refactor.md)*

- [x] **Step 2.1**: Mở [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) tại dòng 176.
  - Đổi thẻ bao ngoài từ `className="w-full max-w-7xl mx-auto font-sans text-black ..."` thành `className="w-full max-w-7xl mx-auto font-sans text-foreground ..."`.
- [x] **Step 2.2**: Chuẩn hóa khối Desktop Header (dòng 180-207):
  - Đổi `border-b border-gray-300` thành `border-b border-border dark:border-slate-700`.
  - Đổi viền avatar từ `border-gray-300` thành `border-border dark:border-slate-700`.
  - Đổi tên học viên từ `font-bold text-blue-700 text-lg uppercase` thành `font-bold text-blue-700 dark:text-sky-400 text-lg uppercase`.
  - Chuẩn hóa nhãn thông tin (`Số báo danh:`, `Ngày sinh:`, v.v.) với `text-muted-foreground`, giữ nguyên các giá trị `<span className="font-semibold text-foreground">`.
  - Đổi badge hạng bằng từ `font-bold text-red-600 border border-red-500 px-1 rounded bg-red-50` thành `font-bold text-red-600 dark:text-red-400 border border-red-500/50 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40`.
  - Giữ nguyên khối cam đếm ngược `bg-[#f0ad4e] text-black` để đảm bảo tương thích 100% với test assertion.
- [x] **Step 2.3**: Chuẩn hóa khối Mobile Header (dòng 209-230):
  - Đổi nhãn hạng bằng mobile sang `text-red-600 dark:text-red-400 border border-red-400/60 dark:border-red-800 bg-red-50 dark:bg-red-950/40`.
  - Giữ nguyên `tabular-nums` và nút `handleBackWithConfirm`.
- [x] **Step 2.4**: Chuẩn hóa khung nội dung câu hỏi (Left Column - dòng 233-250):
  - Đổi khung ngoài từ `border border-gray-400 rounded-md p-4 ...` thành `border border-border dark:border-slate-700 rounded-md p-4 ...`.
  - Đổi thanh tiêu đề "Nội dung câu hỏi" từ `border-dashed border-gray-400` thành `border-dashed border-border dark:border-slate-700 text-foreground`.
  - Cập nhật số thứ tự câu hỏi: Desktop `text-red-600 dark:text-red-400`; Mobile `text-blue-600 dark:text-sky-400`.
  - Cập nhật văn bản đề bài: Thêm `text-foreground` vào `<p className="mb-4 font-semibold text-foreground leading-relaxed" ...>{currentQuestion.text}</p>`.
  - Viền ảnh câu hỏi: `border border-border dark:border-slate-700`.
- [x] **Step 2.5**: Chuẩn hóa danh sách phương án đáp án (A, B, C, D) (dòng 252-273):
  - Thẻ bao phương án khi được chọn: `border-blue-500 bg-blue-50 dark:border-sky-500 dark:bg-sky-950/30`.
  - Thẻ bao khi chưa chọn: `border-transparent hover:bg-muted/40 dark:hover:bg-slate-800/40`.
  - Vòng tròn đáp án (A, B, C, D):
    - Khi được chọn: `bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 font-bold`.
    - Khi chưa chọn: Đổi `bg-gray-200 text-foreground` thành `bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold` (loại bỏ hoàn toàn lỗi chữ trắng trên nền xám nhạt!).
  - Văn bản nội dung phương án:
    - Khi được chọn: `font-bold text-blue-700 dark:text-sky-300`.
    - Khi chưa chọn: `text-foreground`.
- [x] **Step 2.6**: Chuẩn hóa các nút điều hướng (dòng 277-302):
  - Nút "Câu trước": Đổi `bg-gray-100 text-black px-4 py-3 rounded-xl border border-gray-300` thành `bg-secondary text-secondary-foreground px-4 py-3 rounded-xl border border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800`.
  - Nút "Câu tiếp": Đổi sang `bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-sky-600 dark:hover:bg-sky-500`.
  - Nút "Nộp bài": Giữ `bg-green-600 text-white hover:bg-green-700` (đạt tỷ lệ tương phản cao 5.5:1).

---

### Phase 03: Chuẩn Hóa Answer Sheet, Checkbox Tick & Đồng Bộ ontap-win
*Chi tiết kỹ thuật: [`phase-03-answer-sheet-and-checkboxes.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-03-answer-sheet-and-checkboxes.md)*

- [x] **Step 3.1**: Tái cấu trúc component `SquareCheckbox` trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (dòng 29-47):
  - Đổi viền ô vuông ngoài thành `border border-slate-400 dark:border-slate-500 rounded-xs bg-card`.
  - Khi được chọn (`checked`):
    - Đổi viền sang `border-primary dark:border-sky-400`.
    - Đổi màu chấm vuông trong tâm từ `bg-[#333]` (đen xám chìm) sang `bg-primary dark:bg-sky-400 rounded-xs shadow-xs`.
- [x] **Step 3.2**: Chuẩn hóa bảng Answer Sheet trên Desktop (dòng 306-348):
  - Khung bao bảng: `border border-border dark:border-slate-700 rounded-md overflow-hidden bg-card`.
  - Header bảng: Giữ `thead className="sticky top-0 bg-[#f0ad4e] text-black z-10"` (đảm bảo độ tương phản cao và giữ nét nhận diện).
  - Đường kẻ ô bảng: Đổi các ô `border-gray-400` thành `border-border dark:border-slate-700`.
  - Hàng câu hỏi đang làm (`isCurrent`): Đổi từ `bg-cyan-200` sang `bg-sky-100 dark:bg-sky-950/60`.
  - Hiệu ứng di chuột hàng câu hỏi: `hover:bg-muted/50 dark:hover:bg-slate-800/40`.
  - Nhãn `Câu X` trong hàng active: `text-blue-700 dark:text-sky-300 font-bold`.
  - Nút "Nộp bài" dưới bảng Answer Sheet: `bg-primary dark:bg-sky-600 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-sky-500`.
- [x] **Step 3.3**: Chuẩn hóa lưới câu hỏi trên Mobile (dòng 350-367):
  - Khung bao: `bg-muted/30 dark:bg-slate-900/40 rounded-xl border border-border dark:border-slate-800`.
  - Nút câu chưa làm: `bg-card text-muted-foreground border border-border dark:border-slate-700 hover:bg-muted/50`.
  - Nút câu đã làm: `bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700`.
  - Nút câu đang làm: `bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 ring-2 ring-primary/40`.
- [x] **Step 3.4**: Đồng bộ toàn bộ các cải tiến tương phản trên sang [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx):
  - Thay thế `SquareCheckbox` cũ (`bg-white` & `bg-[#333]`) bằng phiên bản chuẩn hóa tokens.
  - Cập nhật wrapper `text-foreground`, nội dung câu hỏi `text-foreground`, Answer Sheet và màu nút điều hướng đồng bộ.

---

### Phase 04: Chạy Nghiệm Thu Toàn Diện, Kiểm Thử Tự Động & Build Verification
*Chi tiết kỹ thuật: [`phase-04-verification-and-qa.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-04-verification-and-qa.md)*

- [x] **Step 4.1**: Chạy bộ kiểm thử chuyên biệt:
  - `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts`
  - Đảm bảo 100% test cases bao gồm các assertions mới đều PASS (TDD GREEN).
- [x] **Step 4.2**: Chạy kiểm thử hồi quy toàn bộ 14 test suites của dự án:
  - `npx vitest run scripts/`
  - Nghiệm thu: 14 test files passed (105+ tests), không có bất kỳ regression nào.
- [x] **Step 4.3**: Chạy kiểm tra kiểu dữ liệu TypeScript tĩnh:
  - `npx tsc --noEmit`
  - Xác nhận mã thoát = 0, không có lỗi type nào trong `ontap-web` hoặc `ontap-win`.
- [x] **Step 4.4**: Kiểm tra đóng gói build:
  - `npm run build:portal`
  - Xác nhận Next.js portal build thành công không có lỗi CSS hay compile.
- [x] **Step 4.5**: Cập nhật trạng thái `[x]` đồng bộ trên cả `task.md`, `plan.md` và artifact phiên thi công theo Double-Sync Protocol.

---

### Phase 05: Di Chuyển Công Tắc Sáng/Tối Vào Menu 3 Gạch & Mặc Định Theme Sáng Cho Mọi Phiên Mới (TDD Enriched — Phương án 1A & 2A)
*Chi tiết kỹ thuật: [`phase-05-theme-switcher-menu-and-default-light.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-05-theme-switcher-menu-and-default-light.md)*

#### Task 1: Chính Sách Mặc Định Theme Sáng Theo Phiên (`ThemeContext.tsx`) & Kiểm Thử `TC-37`
- [x] **Step 1.1 (TDD RED — Write Test `TC-37`)**: Bổ sung `TC-37` vào [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):
  - Kiểm tra [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html) giữ nguyên `data-theme="light"`.
  - Kiểm tra [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) xóa bỏ hoàn toàn `prefers-color-scheme: dark` và không đọc `localStorage.getItem('ontap_theme')` / `localStorage.getItem('theme')`, sử dụng `sessionStorage` (`ontap_theme_session`) và dọn key cũ (`localStorage.removeItem('ontap_theme')`, `localStorage.removeItem('theme')`).
  - Kiểm thử hành vi runtime của `getInitialTheme()` và `clearLegacyThemeStorage()` cho Edge Case #1 (`sessionStorage` ném `SecurityError` trả về `'light'`) và Edge Case #2 (xóa sạch key `localStorage` cũ).
- [x] **Step 1.2 (TDD RED — Verify Fail)**: Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` để xác nhận `TC-37` FAIL.
- [x] **Step 1.3 (TDD GREEN — Implement `ThemeContext.tsx`)**: Cập nhật [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx):
  - Export `SESSION_THEME_KEY = 'ontap_theme_session'`, `getInitialTheme(storage?)`, `clearLegacyThemeStorage(storage?)`, giữ nguyên `ThemeContextType` và `toggleTheme`.
  - Bọc `try/catch` quanh mọi truy cập `window.sessionStorage` và `window.localStorage` để chống lỗi `SecurityError` trong iframe/private mode.
- [x] **Step 1.4 (TDD GREEN — Verify Pass)**: Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` xác nhận `TC-37` PASS.

#### Task 2: Mở Rộng `ThemeSwitcher.tsx` Hỗ Trợ `variant?: 'icon' | 'menu-item'` Chuẩn WCAG 2.1 AA
- [x] **Step 2.1 (TDD RED — Write Test `TC-36`)**: Bổ sung `TC-36` vào [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):
  - Kiểm tra [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) xóa sạch `ThemeSwitcher` (cả import và JSX `fixed bottom-4 right-4`).
  - Kiểm tra [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) hỗ trợ `variant?: 'icon' | 'menu-item'` (mặc định `'icon'` tương thích [`ontap-web/components/Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx)), có `role="switch"`, `aria-checked={isDark}`, `min-h-[44px]`, `focus-visible:ring-2`, giữ `toggleTheme`.
  - Kiểm tra [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) và [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx) render `<ThemeSwitcher variant="menu-item" />` cho cả khách (`!userProfile`) và thành viên (`userProfile`).
- [x] **Step 2.2 (TDD RED — Verify Fail)**: Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` xác nhận `TC-36` FAIL.
- [x] **Step 2.3 (TDD GREEN — Implement `ThemeSwitcher.tsx`)**: Cập nhật [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx):
  - Export `ThemeSwitcherProps { variant?: 'icon' | 'menu-item'; className?: string; }`.
  - Triển khai biến thể `'menu-item'` đạt chuẩn [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md) §7.9 (Icon Sun/Moon + nhãn `"Giao diện"` + trạng thái `"Sáng"`/`"Tối"` + Pill Switch `h-6 w-11` đạt tương phản WCAG 2.1 AA).

#### Task 3: Tích Hợp Công Tắc Vào Menu 3 Gạch (`TopNavbar.tsx` & `MobileBottomNav.tsx`), Gỡ Nút Nổi Ở `App.tsx` & Nghiệm Thu Toàn Diện
- [x] **Step 3.1 (Implement `TopNavbar.tsx`)**: Cập nhật [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx):
  - Import `ThemeSwitcher` từ `./ThemeSwitcher`.
  - Bổ sung `aria-expanded={showHamburgerMenu}` trên nút `<Menu />`, thêm `max-h-[calc(100vh-5rem)] overflow-y-auto` trên dropdown panel, và chèn `<ThemeSwitcher variant="menu-item" />` phía trên mục `Phiên bản hệ thống` (hiển thị cho cả khách lẫn thành viên, bảo toàn `TC-25`, `TC-26`, `TC-32`).
- [x] **Step 3.2 (Implement `MobileBottomNav.tsx`)**: Cập nhật [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx):
  - Import `ThemeSwitcher` từ `./ThemeSwitcher`.
  - Đặt `<ThemeSwitcher variant="menu-item" />` trong khối `OVERLAY EXTENDED MENU` (`isMenuOpen`) nằm ngoài nhánh điều kiện `userProfile` để cả khách (`!userProfile`) và thành viên trên Capacitor App (`isMobileApp === true`) đều sử dụng được.
- [x] **Step 3.3 (Implement `App.tsx`)**: Cập nhật [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx):
  - Xóa dòng 5 (`import ThemeSwitcher from './components/ThemeSwitcher';`) để tuân thủ `"noUnusedLocals": true` trong [`ontap-web/tsconfig.json`](file:///d:/Antigravity/TNDNB/ontap-web/tsconfig.json).
  - Xóa khối `<div className="fixed bottom-4 right-4 z-50"><ThemeSwitcher /></div>` (dòng 485–487) đang đè lên thanh [`ontap-web/components/ZoomBar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx) (`100%`).
- [x] **Step 3.4 (TDD GREEN — Verify `TC-36` & `TC-37`)**: Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-console-and-tinymce-fix.test.ts` xác nhận toàn bộ test (`TC-25`, `TC-26`, `TC-30`, `TC-31`, `TC-32`, `TC-35`, `TC-36`, `TC-37`) đều PASS.
- [x] **Step 3.5 (PASS — TypeScript, Build & 15 Test Suites)**:
  - Chạy `npx tsc --noEmit` và `npx tsc -p ontap-web/tsconfig.json --noEmit` (Exit Code = 0).
  - Chạy `cd ontap-web; npm run build; cd ..` và `npm run build:portal`.
  - Chạy toàn bộ 15 test suites `npx vitest run scripts/` (bao gồm [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts)).
- [x] **Step 3.6 (PASS — Impeccable + Taste-Skill & Chrome QA + Double-Sync)**:
  - Kiểm định quy tắc `impeccable` (`craft`, `polish`) & `taste-skill` (`consistency.mjs`, `perf.mjs`) theo [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md) §7.9 và chạy `/chrome-test` trên Desktop (`1280×800`) & Mobile (`390×844`).
  - Đánh dấu `[x]` đồng bộ trong [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md), [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md) và [`phase-05-theme-switcher-menu-and-default-light.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/phase-05-theme-switcher-menu-and-default-light.md).

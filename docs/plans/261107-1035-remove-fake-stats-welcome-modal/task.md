# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist) — TDD Workflow

> **Mã kế hoạch**: `261107-1035-remove-fake-stats-welcome-modal`  
> **Quy trình chuẩn**: **TDD Red-Green-Refactor** (`Superpowers v7.0.2` & `writing-plans`)  
> **Trạng thái**: ✅ **ĐÃ HOÀN THÀNH TOÀN DIỆN (All Tests Green, Type Check Passed, Invariant 1 Protected)**  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/plan.md)
> - Thiết kế giải pháp kỹ thuật: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/DESIGN.md)
> - Đặc tả giao diện trực quan: [`design-specs.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/design-specs.md)
> - Chi tiết Phase 01: [`phase-01-redesign-welcome-modal.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/phase-01-redesign-welcome-modal.md)
> - Chi tiết Phase 02: [`phase-02-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/phase-02-test-and-verification.md)
> - Tệp mã nguồn: [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx)
> - Tệp kiểm thử: [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)

---

## 📌 Trạng Thái Các Phase (Living Progress)

- [x] **Phase 01: [TDD RED] Cập nhật bộ kiểm thử mô tả yêu cầu mới & xác nhận FAIL**
- [x] **Phase 02: [TDD GREEN] Tái cấu trúc WelcomeModal.tsx thành thẻ đơn trung tâm `max-w-lg` & xác nhận PASS**
- [x] **Phase 03: [TDD REFACTOR & VERIFY] Kiểm thử hồi quy, Type Check toàn diện & Bảo vệ Invariant 1**

---

## 🛠️ Chi Tiết Từng Bước Thi Công Cụ Thể (Bite-Sized Actionable Checklist)

### Phase 01: [TDD RED] Cập Nhật Test Case TDD & Kiểm Chứng Thất Bại
*Tài liệu chi tiết: [`phase-02-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/phase-02-test-and-verification.md)*

- [x] **Step 1.1**: Mở tệp [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) tại dòng 119 - 130 (`Task 2.2`).
- [x] **Step 1.2**: Thay thế assertion cũ (vốn kiểm tra `md:col-span-7` & `md:col-span-5`) bằng assertion mới theo chuẩn `DESIGN.md`:
  - `expect(welcomeModal).not.toContain('via-blue-500 to-violet-500')`
  - `expect(welcomeModal).not.toContain('blur-xl')`
  - `expect(welcomeModal).not.toContain('Thông số Hệ thống Học liệu')`
  - `expect(welcomeModal).not.toContain('md:col-span-7')`
  - `expect(welcomeModal).not.toContain('md:col-span-5')`
  - `expect(welcomeModal).not.toContain('Ôn luyện theo từng môn')`
  - `expect(welcomeModal).not.toContain('Tự động lưu câu hay sai')`
  - `expect(welcomeModal).not.toContain('Hỗ trợ làm bài ngoại tuyến')`
  - `expect(welcomeModal).toContain('max-w-lg')`
  - `expect(welcomeModal).toContain('bg-card')`
  - `expect(welcomeModal).toContain('border-border')`
  - `expect(welcomeModal).toContain('rounded-2xl')`
  - `expect(welcomeModal).toContain('HelmIcon3D')`
  - `expect(welcomeModal).toContain('tabular-nums')`
- [x] **Step 1.3 (Verify RED)**: Chạy lệnh `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` và xác nhận test FAIL (RED) do `WelcomeModal.tsx` hiện tại vẫn còn `md:col-span-7`, `md:col-span-5`, các bullet points và chưa có `max-w-lg`.

---

### Phase 02: [TDD GREEN] Tái Cấu Trúc WelcomeModal.tsx Thẻ Đơn Tối Giản
*Tài liệu chi tiết: [`phase-01-redesign-welcome-modal.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/phase-01-redesign-welcome-modal.md)*

- [x] **Step 2.1**: Mở tệp [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx).
- [x] **Step 2.2**: Xóa bỏ hoàn toàn các import icon từ thư viện `lucide-react` (`Award`, `Clock`, `Sparkles`, `CheckCircle2`, `ArrowRight`, `BookOpen`), chỉ giữ lại `React` và `{ HelmIcon3D } from './icons'`.
- [x] **Step 2.3**: Xóa bỏ toàn bộ cấu trúc lưới 2 cột `grid grid-cols-1 md:grid-cols-12` cùng toàn bộ khối `md:col-span-5` (chứa tiêu đề "Thông số Hệ thống Học liệu" và 3 hộp thông số `100%`, `30 câu / đề`, `24/7`).
- [x] **Step 2.4**: Xóa bỏ toàn bộ khối 3 gạch đầu dòng giới thiệu tính năng (`<ul className="space-y-2.5 mb-8 text-sm text-foreground">...</ul>`).
- [x] **Step 2.5**: Tái cấu trúc thành thẻ đơn căn giữa `max-w-lg w-full bg-card text-card-foreground border border-border rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center flex flex-col items-center`:
  - Visual Anchor: `HelmIcon3D` (`h-20 w-20 text-primary mb-4`).
  - Badge tag: `Hệ thống Đào tạo & Sát hạch Thủy nội địa`.
  - Header: `Ứng Dụng Ôn Tập` (`text-2xl sm:text-3xl font-extrabold tracking-tight`).
  - Greeting text: Lời chào ấm cúng, trang trọng, học vụ.
  - Action buttons: `[Bắt đầu ôn tập]` (`bg-primary text-primary-foreground`) & `[Đăng nhập học viên]` (`bg-secondary text-secondary-foreground border border-border`).
  - Register link: `Chưa có tài khoản? Đăng ký ngay →`.
  - Training footer: Thông tin đơn vị đào tạo (Công ty CP Tư vấn và Giáo dục Ninh Bình) • Hotline: `0229 628 2969` (`tabular-nums`).
- [x] **Step 2.6 (Verify GREEN)**: Chạy lại `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` và xác nhận test chuyển sang PASS (GREEN) 11/11 tests.

---

### Phase 03: [TDD REFACTOR & VERIFY] Kiểm Thử Hồi Quy & Bảo Vệ Tuyệt Đối Invariant 1
*Tài liệu chi tiết: [`phase-02-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/phase-02-test-and-verification.md)*

- [x] **Step 3.1 (Regression Test)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` và xác nhận toàn bộ 29/29 tests PASS 100%.
- [x] **Step 3.2 (Type Check)**: Chạy `npx tsc --noEmit` và xác nhận dự án không có bất kỳ lỗi TypeScript nào (`exit code 0`).
- [x] **Step 3.3 (Invariant 1 Verification)**: Chạy `git diff --stat ontap-web/components/ExamQuizScreen.tsx` để xác nhận tệp thi trắc nghiệm không bị sửa đổi bất kỳ byte nào (`0 bytes diff`).
- [x] **Step 3.4 (Build Smoke Check)**: Chạy thử bản build của `ontap-web` (hoặc build portal) để đảm bảo không có warning hoặc compile error nào phát sinh.

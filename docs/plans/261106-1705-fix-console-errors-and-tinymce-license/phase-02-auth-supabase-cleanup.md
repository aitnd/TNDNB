# Chi Tiết Kỹ Thuật Phase 02: Tinh Gọn Xác Thực & Dọn Dẹp Lỗi Supabase JWT RS256

> **Mã kế hoạch**: `261106-1705-fix-console-errors-and-tinymce-license`  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md)
> - Thiết kế kỹ thuật: [`design.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/design.md)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/task.md)
> - Kịch bản kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Mục Tiêu Của Phase 02
- Loại bỏ hoàn toàn ngoại lệ Console:
  `LỖI KHI SETSESSION SUPABASE: invalid JWT: unable to parse or verify signature, token signature is invalid: signing method RS256 is invalid`.
- Triệt tiêu lỗi HTTP `GET https://hykvpgxaegmufdothwbv.supabase.co/auth/v1/user 403 (Forbidden)`.
- Phân định rạch ròi kiến trúc: Firebase Auth quản lý danh tính phiên (`auth.currentUser`), Firestore quản lý phân quyền (RBAC), Supabase client sử dụng public anon key cho truy xuất cơ sở dữ liệu.

---

## 2. Review Focus (Theo Thiết Kế Kỹ Thuật design.md)
- **Tách biệt tầng xác thực (Separation of Concerns)**: Không để token RS256 của Firebase bị nạp sai lệch vào Supabase GoTrue Auth (vốn dùng secret HS256).
- **File cần chỉnh sửa**: [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx).
- **Hành động**:
  - Xóa bỏ khối `try...catch` gọi `supabase.auth.setSession` (dòng 64-80).
  - Xóa bỏ lời gọi thừa `supabase.auth.signOut()` trong nhánh đăng xuất (dòng 89).
  - Loại bỏ import không dùng: `import { supabase } from '../utils/supabaseClient'`.

---

## 3. Implementation Steps (TDD Enriched)

### Task 2.1: Loại bỏ lời gọi Supabase setSession trong AuthContext

**Files:**
- Modify: [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `onAuthStateChanged(auth, async (firebaseUser) => ...)`
- Produces: `AuthContext` tinh giản, chỉ truy vấn Firestore `doc(db, 'users', firebaseUser.uid)` để lấy vai trò, không can thiệp vào session của Supabase.

- [ ] **Step 2.1.1: Chạy test xác nhận thất bại (RED)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-03"`
  - Kết quả mong đợi: `FAIL - AssertionError: expected ... not to contain 'supabase.auth.setSession'`

- [ ] **Step 2.1.2: Implement tối thiểu (GREEN)**
  - Mở [`context/AuthContext.tsx`](file:///d:/Antigravity/TNDNB/context/AuthContext.tsx).
  - Xóa bỏ khối lệnh `supabase.auth.setSession(...)`.
  - Xóa bỏ `import { supabase } from '../utils/supabaseClient'`.
  - Giữ nguyên toàn bộ logic Firestore và Firebase Auth.

- [ ] **Step 2.1.3: Chạy test xác nhận thành công (PASS)**
  - Lệnh: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-03"`
  - Kết quả mong đợi: `PASS`

---

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Bài test `TC-03` trong Vitest chạy PASS 100%.
2. Không còn bất kỳ log lỗi `RS256 is invalid` nào trong Console khi mở trang quản trị.
3. Không phát sinh request `GET /auth/v1/user 403 (Forbidden)`.
4. Phiên làm việc của Admin và Học viên trên Firebase Auth + Firestore hoạt động trơn tru.

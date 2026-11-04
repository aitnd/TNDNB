# Phase 1: Fix White Screen & Crashes

## Implementation Steps (TDD Enriched)

### Task 0 (P0): Bổ sung biến môi trường
**Files:** ontap-win/.env
- Thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào ontap-win/.env.
- **Nghiệm thu:** Chạy 
pm run build và grep lại file bundle xem còn ném lỗi cứng không. (Smoke unpacked làm gate).

### Task 1 (P1): Fix supabaseClient.ts
**Files:** ontap-win/services/supabaseClient.ts
- Đổi supabaseClient sang dạng lazy-init (cấm throw lỗi lúc import) để không crash ở module evaluation.

### Task 2: Fix main.cjs
**Files:** ontap-win/electron/main.cjs
- **CHÚ Ý:** File này đang có local changes (dòng console-message gỡ HTML). Cần báo executor dọn dẹp hoặc git restore trước khi làm tiếp để tránh conflict.
- **Step 2.1:** Thêm const fs = require('fs'); ở đầu file.
- **Step 2.2:** Thêm process.exit(0) sau pp.quit().
- **Step 2.3:** Bọc 	ry/catch quanh createTray và kiểm tra s.existsSync(iconPath).
- **Step 2.4:** Thêm .catch vào mainWindow.loadFile và gọi dialog.showErrorBox.

### Task 3: Phòng thủ lớp 2 bằng ErrorBoundary
**Files:** ontap-win/index.tsx
- Bọc toàn bộ root component. ErrorBoundary này đóng vai trò chặn lỗi ném ra từ pha render (sau khi init thành công).
- **QUAN TRỌNG:** Phải truyền allback là một Full-screen Component (logo + 'Không khởi động được' + nút copy log + nút thử lại). Không được dùng fallback mặc định của ErrorBoundary (hộp amber nhỏ).

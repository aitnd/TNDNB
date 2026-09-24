# Task List: Vercel Tailwind Fix

- [x] **1. Cập nhật package.json**
  - [x] Di chuyển `@tailwindcss/vite` và `tailwindcss` sang `dependencies` (Link: [ontap-web/package.json](file:///ontap-web/package.json)).
- [x] **2. Cập nhật Lockfile & Verify**
  - [x] Chạy `cd ontap-web && npm install` để update `package-lock.json`.
  - [x] Chạy `npm run build` để xác nhận thành công.
  - [x] Kiểm tra nhanh giao diện (Visual CSS check) ở local xem Tailwind có render đúng không.
- [x] **3. Git Commit & Push (Production)**
  - [x] Đảm bảo đang ở đúng branch Vercel deploy (VD: `main`).
  - [x] Commit thông điệp `fix: move tailwind dependencies to fix vercel build`.
  - [x] Push: `git push origin HEAD`.
- [ ] **4. Vercel Redeploy & Rollback Plan**
  - [ ] Lên Vercel Dashboard, chọn **Redeploy with cleared cache**.
  - [ ] Nếu vẫn lỗi: rollback bằng lệnh `git revert HEAD` và push lại.

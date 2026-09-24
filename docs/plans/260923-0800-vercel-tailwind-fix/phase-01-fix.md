# Phase 1: Implementation Fix
Status: ⬜ Pending

## Objective
Chuyển `@tailwindcss/vite` và `tailwindcss` sang `dependencies` trong `ontap-web/package.json` để vượt qua quá trình cài đặt prune-dev của Vercel. Kèm theo bước clear cache trên Vercel.

## Task 1: Sửa package.json & Update Lockfile

**Files:**
- Modify: `ontap-web/package.json`
- Update: `ontap-web/package-lock.json`

- [ ] **Step 1: Cập nhật package.json**
Mở `ontap-web/package.json`, tìm và cắt 2 thư viện `@tailwindcss/vite` và `tailwindcss` từ block "devDependencies", sau đó dán xuống block "dependencies".

- [ ] **Step 2: Cài đặt lại node_modules để update lockfile**
```bash
cd ontap-web
npm install
```

- [ ] **Step 3: Chạy thử Build local & Visual Check (Verify GREEN)**
```bash
cd ontap-web
npm run build
```
Expected: Lệnh chạy thành công. Mở thử local server kiểm tra CSS (Tailwind) có load đúng không.

- [ ] **Step 4: Commit và Push (Đúng nhánh Deploy)**
```bash
git add ontap-web/package.json ontap-web/package-lock.json
git commit -m "fix: move tailwind dependencies to fix vercel build"
git push origin HEAD
```
Lưu ý: Phải chắc chắn đang ở branch mà Vercel đang theo dõi (ví dụ: `main`).

- [ ] **Step 5: Xóa Cache Vercel & Rollback (Nếu cần)**
1. Mở Vercel Dashboard.
2. Bấm vào nút Options ở bản build lỗi -> Chọn **Redeploy with cleared cache**.
3. (Dự phòng) Nếu deploy vẫn fail, thực hiện Rollback:
```bash
git revert HEAD
git push origin HEAD
```

# Phase 3: Dọn Dẹp Cảnh Báo PWA Manifest, Tailwind CDN & Service Worker

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](../../../docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [task.md](../../../docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🟡 **Medium** / 🟡 **Low**

---

## 1. Mục Tiêu & Giá Trị Mang Lại
1. Chuẩn hóa PWA Manifest: Khớp kích thước ảnh với khai báo.
2. Tối ưu hóa tải trang & Build Pipeline: Gỡ Tailwind CDN, cấu hình Tailwind v4 tĩnh (build-time).
3. Dọn dẹp Service Worker: Xóa fetch event listener rỗng.

---

## 2. Các Bước Thực Hiện (TDD Bite-Sized Tasks)

### Task 3.1: Tạo icon chuẩn cho PWA (192x192 & 512x512)
**1. Verify (Trạng thái hiện tại):**
- Console báo lỗi lệch kích thước: `Manifest: property 'src' does not match size '192x192' (actual size 64x64)`.
- Việc hạ `sizes` về 64x64 sẽ làm giảm điểm installability của PWA.

**2. Implement (GREEN):**
Sử dụng script ImageMagick hoặc các công cụ resize để tạo ảnh chuẩn:
- Tạo `ontap-web/public/icon-192.png` (thực sự là 192x192)
- Tạo `ontap-web/public/icon-512.png` (thực sự là 512x512)
- Không cần sửa `public/ontap/` vì đó là thư mục build output.

**3. Verify PASS:**
- Load lại trang, check tab Application -> Manifest trong DevTools. Không còn cảnh báo. Điểm Lighthouse PWA Installable đạt tối đa.

### Task 3.2: Cấu hình Tailwind v4 vào build pipeline
**1. Verify:**
- `theme.css` thiếu `@import "tailwindcss"`. `index.tsx` chưa import file css nào.
- Ứng dụng đang phụ thuộc 100% vào CDN runtime.

**2. Implement (GREEN):**
- Cài đặt plugin: `cd ontap-web && npm install -D @tailwindcss/vite tailwindcss`
- Bổ sung cấu hình plugin trong `ontap-web/vite.config.ts`:
  ```ts
  import tailwindcss from '@tailwindcss/vite'
  export default defineConfig({
    plugins: [react(), tailwindcss()],
  })
  ```
Sửa file `ontap-web/theme.css`, chèn ở đầu:
```css
@import "tailwindcss";

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans), sans-serif;
  --animate-fade-in-up: fadeInUp 0.5s ease-out forwards;
  --animate-shine: shine 3s linear infinite;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes shine {
  0% { transform: translateX(-100%) skewX(12deg); }
  20% { transform: translateX(100%) skewX(12deg); }
  100% { transform: translateX(100%) skewX(12deg); }
}
```

Sửa file `ontap-web/index.tsx`, thêm import:
```tsx
import './theme.css';
```

**3. Verify PASS:**
- Chạy `npm run build`, bundle CSS chứa các class tailwind (file size tăng).

### Task 3.3: Gỡ bỏ Tailwind CDN script và inline config trong index.html
**1. Verify:**
- Build thành công `theme.css`.
- Chụp ảnh màn hình (baseline) của trang để kiểm tra thiết kế trước khi gỡ CDN.

**2. Implement (GREEN):**
Sửa file `ontap-web/index.html`:
- Xóa dòng 11: `<script src="https://cdn.tailwindcss.com"></script>`
- Xóa block từ dòng `<script>` chứa `tailwind.config = { ... }` đến `</script>`.

**3. Verify PASS:**
- Chạy `npm run preview`. Giao diện giữ nguyên, không vỡ.
- Cảnh báo "cdn.tailwindcss.com should not be used in production" biến mất.

### Task 3.4: Xóa fetch event listener rỗng trong Service Worker
**1. Verify:** Có fetch listener rỗng `self.addEventListener('fetch', (e) => { ... });` trong 2 file `sw-pwa.js`.

**2. Implement (GREEN):**
Xóa dòng `self.addEventListener('fetch', ...)` trong:
- `ontap-web/public/sw-pwa.js`
- `public/ontap/sw-pwa.js`

**3. Verify PASS:**
- Mở DevTools -> Application -> Service Workers. Không còn cảnh báo fetch listener rỗng.

### Task 3.5: Commit chung Phase 3
```bash
git add ontap-web/public/manifest.json public/ontap/manifest.json ontap-web/theme.css ontap-web/index.tsx ontap-web/index.html ontap-web/public/sw-pwa.js public/ontap/sw-pwa.js
git commit -m "fix: cleanup manifest icons, migrate Tailwind to build-time, remove no-op SW fetch"
```

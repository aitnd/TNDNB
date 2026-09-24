# Phase 3: Cập nhật Web App Icon (PWA / Mobile Browser) & Favicon

Status: Pending
Dependencies: None

## Implementation Steps (TDD Enriched)

### Task 1: Generate PWA Icons từ file nguồn

**Files:**
- Modify: `ontap-web/public/icon-192.png`
- Modify: `ontap-web/public/icon-512.png`
- Modify: `ontap-web/index.html` (để dùng favicon nội bộ thay vì CDN postimg)

*Lưu ý*: Generate vào thư mục source `ontap-web/public/`. Thư mục `public/ontap/` là thư mục build output đang bị gitignore, hệ thống sẽ tự copy sang khi build. KHÔNG commit `public/ontap`.

- [ ] **Step 1.1: Viết test thất bại (RED)**
  ```bash
  # Check nội dung icon hiện tại
  ls -l ontap-web/public/icon-192.png
  # Expected: Hiện đang là icon Ông già Noel cũ (nếu xem ảnh trực quan)
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  Run: Xem mã nguồn `ontap-web/index.html` dòng 6.
  Expected: FAIL, thấy link CDN postimg `https://i.postimg.cc/8PDn1wfM/favicon.png`. "Add to home screen" ra icon Noel.

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  ```bash
  # Dùng script python (PIL) hoặc công cụ resize thủ công/Node.js để crop/resize 
  # D:\Antigravity\TNDNB\assets\icon.png thành:
  # - ontap-web/public/icon-192.png
  # - ontap-web/public/icon-512.png
  # - ontap-web/public/favicon.png (hoặc icon-192.png)
  ```
  ```html
  <!-- ontap-web/index.html -->
  <!-- Sửa dòng 6 thành local path -->
  <link rel="icon" type="image/png" href="/ontap/icon-192.png" />
  ```

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  Run: Check lại các file trong `ontap-web/public/` đã được ghi đè, và `index.html` trỏ về path local.
  Expected: PASS. Build lại web thử, xác nhận icon PWA là logo TNDNB mỏ neo.

- [ ] **Step 1.5: Commit**
  ```bash
  git add ontap-web/public/icon*.png ontap-web/index.html
  git commit -m "chore: replace PWA Noel icon with official TNDNB anchor icon and use local favicon"
  ```

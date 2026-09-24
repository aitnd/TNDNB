# Phase 1: Mở rộng logic Upload files

Status: Pending
Dependencies: None

## Implementation Steps (TDD Enriched)

### Task 1: Nới lỏng kiểm tra độ dài file upload và ưu tiên exeUrl

**Files:**
- Modify: `ontap-web/components/Admin/UploadZone.tsx`

**Interfaces:**
- Consumes: User selected files (File[]) -> biến `selectedFiles`
- Produces: Validation success, và khi tạo GitHub release, chọn đúng link `exeUrl` ưu tiên bản x64 hoặc Setup chung (không chọn ia32).

- [ ] **Step 1.1: Viết test thất bại (RED)**
  ```typescript
  // Không áp dụng Unit Test cho React Component phức tạp ở đây.
  // Xác nhận lỗi "Bắt buộc phải chọn đúng 3 file: .exe, .yml, .blockmap." vẫn hiện khi upload 7 files.
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  Run: Kéo thả 7 files (x64, ia32, setup chung, blockmaps, yml) vào UploadZone.
  Expected: FAIL, hiện thông báo lỗi bằng tiếng Việt gốc.

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  ```tsx
  // ontap-web/components/Admin/UploadZone.tsx
  // Tìm: if (selectedFiles.length !== 3)
  // Xóa đi hoặc thay bằng check file yml, exe, blockmap.
  const hasYml = selectedFiles.some(f => f.name.endsWith('.yml'));
  const hasExe = selectedFiles.some(f => f.name.endsWith('.exe'));
  const hasBlockmap = selectedFiles.some(f => f.name.endsWith('.blockmap'));
  
  if (!hasYml || !hasExe || !hasBlockmap) {
      Swal.fire('Lỗi', 'Bắt buộc phải chọn file .yml và các file .exe, .blockmap tương ứng.', 'error');
      return false;
  }
  
  // Xóa đoạn if (!hasExe || !hasYml || !hasBlockmap) bị lặp ngay bên dưới.
  
  // Xử lý nhiều .exe: Tìm exeUrl ưu tiên bản x64
  // Thay vì: exeUrl = asset.browser_download_url; ở mỗi file .exe
  if (file.name.endsWith('.exe')) {
      const currentUrl = asset.browser_download_url || `https://github.com/aitnd/TNDNB/releases/download/${tag}/${file.name}`;
      if (!exeUrl) {
          exeUrl = currentUrl;
      } else if (file.name.includes('x64') || (!file.name.includes('ia32') && file.name.includes('Setup.exe'))) {
          // Ưu tiên x64 hoặc bản Setup chung hơn là ia32
          exeUrl = currentUrl;
      }
  }
  ```
  *(Lưu ý: Fail-fast throw error khi một file lỗi upload vẫn được giữ nguyên để thống nhất bản release).*

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  Run: Kéo thả 7 files lần nữa.
  Expected: PASS, không báo lỗi, tiến hành upload. exeUrl lưu vào db sẽ là bản x64.

- [ ] **Step 1.5: Commit**
  ```bash
  git add ontap-web/components/Admin/UploadZone.tsx
  git commit -m "fix: relax file count validation and prioritize x64 exeUrl"
  ```

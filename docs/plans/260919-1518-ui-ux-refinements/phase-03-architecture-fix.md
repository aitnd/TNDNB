# Phase 3: Fix Update Architecture (Revert to GitHub Releases)
Status: ✅ Complete
Dependencies: Phase 1, Phase 2

## Objective
Tháo gỡ hoàn toàn hệ thống Supabase Storage & app_releases do phá hỏng cơ chế auto-updater native của Windows. Chuyển UI Drag & Drop Admin sang gọi trực tiếp API uploadReleaseAsset của GitHub. Đồng thời dọn dẹp các API keys cứng trong source code (Security Hardening).

## Implementation Steps (TDD Enriched)

### Task 3.1: Dọn dẹp logic Supabase Release cũ
- [x] **Step 3.1.1:** `ontap-win/services/UpdateService.ts`: Xóa các hàm liên quan đến bảng `app_releases`.
- [x] **Step 3.1.2:** `ontap-web/services/releaseService.ts`: Xóa code upload dùng `tus` (Supabase Storage) và query bảng `app_releases`.
- [x] **Step 3.1.3:** Transition hiển thị Changelog (Web + Win):
  - File: `ontap-win/components/ChangelogModal.tsx`, `ontap-win/components/ChangelogScreen.tsx`, `ontap-web/components/ChangelogModal.tsx`, `ontap-web/components/ChangelogScreen.tsx`.
  - Thay vì gọi `getAllAppReleases`, hãy gọi GitHub API `getReleases` để lấy `release.body` làm nội dung hiển thị changelog. Nếu lỗi, fallback lấy version từ `app_links`. KHÔNG để trống nội dung changelog.
  - Gộp chung hàm `normalizeVersion` và `isVersionLower` vào chung một file utils dùng chung. Fix version cứng trong `ontap-win/electron/preload.cjs`.
- [x] **Step 3.1.4:** Database (Manual): Drop bucket `releases` và bảng `app_releases` trên Supabase, CHỈ giữ lại bucket `TND` và bảng câu hỏi. (⚠️ LƯU Ý: Chỉ Drop DB sau khi code gỡ bỏ hoàn tất và đã verify thành công).

### Task 3.2: Re-implement luồng GitHub Upload trên Web (Admin)
- [x] **Step 3.2.1:** `ontap-web/components/Admin/UploadZone.tsx`: 
  - Khởi tạo flow upload tuần tự qua GitHub API.
  - Sử dụng Token lưu tại Firestore (`adminConfigService.getGitHubConfig()` tương tự như bên Win, KHÔNG dùng `localStorage`).
  - Trình tự gọi: `validateToken` -> `getReleaseByTag` -> `deleteRelease`/`deleteTag` (nếu trùng version) -> `createRelease`.
  - Gọi đúng signature: `await githubService.uploadReleaseAsset(token, releaseId, file, onProgress)` cho từng file (exe -> yml -> blockmap).
- [x] **Step 3.2.2:** Fail-fast & Rollback (UploadZone.tsx):
  - Lỗi bất kỳ file nào: Gọi ngay `deleteRelease`/`deleteTag` của release vừa tạo. KHÔNG cập nhật `app_links`. Giữ lại UI file đã chọn để user upload lại.
  - Thành công 100% (cả 3 file): Gọi Firestore API `adminConfigService.saveUsageConfig` để cập nhật `app_links` (`{ version, windows: browser_download_url }`).

### Task 3.3: Security Audit & Cleanup (Xóa hardcoded keys)
- [x] **Step 3.3.1:** Chuyển các hardcoded Supabase keys sang Environment Variables đúng scope:
  - Frontend Web/Win: Sử dụng `NEXT_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL` tùy nền tảng.
  - Scripts Node.js (`.cjs`, `.mjs`, `.js`): Sử dụng thuần `process.env.SUPABASE_URL`, có require dotenv.
  - File áp dụng ĐẦY ĐỦ: 
    - `ontap-win/services/supabaseClient.ts` (File client CHÍNH QUAN TRỌNG NHẤT)
    - `ontap-win/fetchData.js`
    - `ontap-win/scripts/download-question-images.mjs`
    - `ontap-web/scripts/verify_upload.cjs`
    - `ontap-web/scripts/upload_giamkhao.cjs`
  - Thêm logic throw error nếu thiếu env key.
- [x] **Step 3.3.2:** Verify sạch sẽ mã nguồn bằng grep: Đảm bảo `grep -rn "eyJ" .` (hoặc chuỗi URL cứng) trả về 0 kết quả ngoài file `.env` (Whitelist an toàn: `eyJ` trong `.vscode/mcp.json` là MCP token, URL Supabase trong `theme.css:380` là public image bucket).
- [x] **Step 3.3.3:** Database Security (Manual): 
  - Đổi (Rotate) JWT anonKey trên Supabase do đã từng bị commit cứng lên Repo.
  - Bật RLS cho bucket `TND`: Thêm policy `Read` cho public (không cần auth), `Write/Delete/Update` chỉ cho Role authenticated (Admin).

# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261107-0025-fix-settings-save-and-private-repo-errors`  
> **Quy trình áp dụng**: TDD (Test-Driven Development / RED -> GREEN -> PASS)  
> **Tài liệu gốc**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/plan.md)
> - Chi tiết Phase 01: [`phase-01-dual-storage-fallback.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-01-dual-storage-fallback.md)
> - Chi tiết Phase 02: [`phase-02-private-repo-resilience.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-02-private-repo-resilience.md)
> - Chi tiết Phase 03: [`phase-03-worker-deploy-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-03-worker-deploy-and-verification.md)
> - Bộ kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 📌 Trạng Thái Tổng Thể Các Phase

- [x] **Phase 01: Cơ chế Lưu kép Dual-Storage (KV + Firestore) trong `adminConfigService.ts`**
- [x] **Phase 02: Xử lý Graceful Silent Fallback cho GitHub Releases khi Repo Private**
- [x] **Phase 03: Hướng dẫn Deploy Cloudflare Worker Edge & Nghiệm thu toàn diện**

---

## 🛠️ Chi Tiết Từng Bước Thi Công (Bite-Sized TDD Steps)

### Phase 01: Cơ Chế Lưu Kép Dual-Storage (KV + Firestore) trong `adminConfigService.ts`
> Chi tiết kỹ thuật: [`phase-01-dual-storage-fallback.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-01-dual-storage-fallback.md)

- [x] **Task 1.1 (TDD RED)**: Mở rộng [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) thêm `TC-12` và `TC-13`:
  - `TC-12`: Kiểm tra `saveUsageConfig` thực hiện lưu kép và không ném ngoại lệ khi Firestore ghi thành công dù KV trả về lỗi.
  - `TC-13`: Kiểm tra `getUsageConfig` tự động fallback đọc Firestore khi KV trả về rỗng.
- [x] **Task 1.2 (TDD GREEN - Đọc cấu hình Resilience)**:
  - Cập nhật hàm `getUsageConfig` trong [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts): Thêm fallback đọc Firestore qua `getDoc(doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID))` trước khi fallback localStorage.
  - Cập nhật hàm `getGitHubConfig`: Thêm fallback đọc Firestore doc `settings/github_config`.
- [x] **Task 1.3 (TDD GREEN - Ghi cấu hình Dual-Storage)**:
  - Cập nhật hàm `saveUsageConfig` trong [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts): Thêm cơ chế lưu song song vào Firebase Firestore `setDoc(doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID), config, { merge: true })`.
  - Đảm bảo nếu Firestore ghi thành công (hoặc KV ghi thành công) thì cập nhật localStorage và trả về `void` (không throw), giúp giao diện SweetAlert2 luôn hiện **Popup XANH**.
  - Cập nhật hàm `saveGitHubConfig`: Thêm lưu kép Firestore cho `settings/github_config`.
- [x] **Task 1.4 (TDD PASS)**:
  - Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-12|TC-13"` xác nhận PASS 100%.

---

### Phase 02: Xử Lý Graceful Silent Fallback Cho GitHub Releases Khi Repo Private
> Chi tiết kỹ thuật: [`phase-02-private-repo-resilience.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-02-private-repo-resilience.md)

- [x] **Task 2.1 (TDD RED)**: Mở rộng [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) thêm `TC-14` và `TC-15`:
  - `TC-14`: Kiểm tra Worker proxy `/releases/list` trả về HTTP 200 kèm body `[]` khi GitHub upstream trả về 403 Forbidden.
  - `TC-15`: Kiểm tra `releaseService.ts` không gọi trực tiếp nặc danh `api.github.com` và fallback êm ái sang `config.app_links`.
- [x] **Task 2.2 (TDD GREEN - Worker Proxy Graceful Fallback)**:
  - Cập nhật [`cloudflare-worker/src/routes/releasesProxy.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts):
    - Khi `upstreamRes.status` rơi vào `401`, `403`, hoặc `404`, trả về ngay `Response(JSON.stringify([]), { status: 200, ... })`.
    - Hỗ trợ header `Authorization: Bearer <token>` nếu client có gửi PAT Token.
- [x] **Task 2.3 (TDD GREEN - Client Service Clean Fallback)**:
  - Cập nhật [`ontap-web/services/releaseService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts):
    - Đọc token từ `getGitHubConfig()`.
    - Loại bỏ hoàn toàn endpoint `https://api.github.com/repos/aitnd/TNDNB/releases` nặc danh.
    - Fallback êm dịu sang `config.app_links` mà không sinh ra bất kỳ lỗi đỏ nào trên Console.
- [x] **Task 2.4 (TDD PASS)**:
  - Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-14|TC-15"` xác nhận PASS 100%.

---

### Phase 03: Hướng Dẫn Deploy Cloudflare Worker & Nghiệm Thu Toàn Diện
> Chi tiết kỹ thuật: [`phase-03-worker-deploy-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/phase-03-worker-deploy-and-verification.md)

- [x] **Task 3.1**: Kiểm tra file [`cloudflare-worker/wrangler.toml`](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml) bảo đảm `FIREBASE_PROJECT_ID = "thi-tnd"`.
- [x] **Task 3.2**: Chạy lệnh build & deploy Cloudflare Worker Edge:
  ```powershell
  cd d:\Antigravity\TNDNB\cloudflare-worker
  npx wrangler deploy
  ```
- [x] **Task 3.3 (Full Suite & Build)**:
  - Chạy toàn bộ bộ test suite: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (TC-01 -> TC-16 PASS 100%).
  - Chạy kiểm tra TypeScript: `npx tsc --noEmit` (0 lỗi).
  - Chạy Production Build: `npm run build`.
- [x] **Task 3.4 (Invariant Guard Verification)**:
  - Kiểm tra độ nguyên vẹn của component thi:
    `git diff ontap-web/components/ExamQuizScreen.tsx` === 0 bytes.

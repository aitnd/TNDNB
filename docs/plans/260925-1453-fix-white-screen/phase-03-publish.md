# Phase 3: Publish & Acceptance Criteria

## Implementation Steps

### Task 1: Bumping & Smoke Test
- **Bump version** lên 3.19.4 trong ontap-win/package.json (không publish lại số 3.19.3 đã hỏng).
- Chạy 
pm run electron:build (lúc này electron-builder sẽ tự sinh ra file latest.yml).
- **Nghiệm thu:** Verify smoke test trên bản win-unpacked trước khi đóng gói NSIS.

### Task 2: Publish & Sync
- Đẩy source code và tạo GitHub Release tag 3.19.4.
- Upload các artifacts đã build (.exe, latest.yml, .blockmap) lên Release.
- **Verify:** Chắc chắn đính kèm đủ 3 file trên. Giữ lại bản cài 3.18.1 cũ để dự phòng rollback.

### Task 3: Firestore Sync
- Lên Firestore (dminConfigService.ts), cập nhật trường pp_links.version thành 3.19.4 để đảm bảo các client đọc được phiên bản mới nhất từ database fallback.

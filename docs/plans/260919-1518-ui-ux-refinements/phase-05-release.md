# Phase 5: Release v3.19.2 (via /tndnb-build)
Status: ✅ Complete
Dependencies: Phase 1, Phase 2, Phase 3, Phase 4

## Objective
Chạy workflow release tự động, đảm bảo toàn bộ tree sạch, build thành công và publish lên GitHub Release. Khớp với `latest.yml` để auto-update hoạt động.

## Implementation Steps
- [x] **5.1** Preconditions: Token GitHub hợp lệ, source tree sạch, Phase 1-4 PASS.
- [x] **5.2** Chạy workflow `/tndnb-build` ➔ Tự động: bump version, ghi changelog, build 3 project, QA Loop 4 agents, commit.
- [x] **5.3** Đảm bảo GitHub Release đã Publish (không phải Draft) và đủ 3 file (exe, blockmap, yml).
- [x] **5.4** Verify: App cũ (v3.19.1) nhận thông báo cập nhật v3.19.2 từ GitHub (chờ `latest.yml` khớp version).

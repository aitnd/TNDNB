# Phase 4: Build & Release (/tndnb-build)

## Implementation Steps (TDD Enriched)

### Task 1: Nâng version và Build

- [ ] **Step 1.1: Cập nhật version**
  - Cập nhật trường `version` trong `package.json` của root, `ontap-web`, và `ontap-win` thành version mới (patch).

- [ ] **Step 1.2: Chạy workflow Build**
  - Chạy workflow `/tndnb-build` để tự động tạo changelog, chạy QA Loop và đóng gói phiên bản mới.

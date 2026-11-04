# Phase 2: Fix Version Check

## Implementation Steps (TDD Enriched)

### Task 1: Fix UpdateService.ts
**Files:** ontap-win/services/UpdateService.ts
- Import isVersionLower từ ../utils/versionUtils.
- Trong hàm getGitHubReleases:
  - Lọc: !r.draft && !r.prerelease.
  - Sort chuẩn 3 nhánh: 
    `	ypescript
    .sort((a, b) => {
      if (a.version === b.version) return 0;
      return isVersionLower(a.version, b.version) ? 1 : -1;
    })
    `
- **Test file:** Viết test tại ontap-win/services/UpdateService.test.ts (colocated).

### Task 2: Fix ChangelogModal.tsx
**Files:** ontap-win/components/ChangelogModal.tsx
- Xóa window.require('electron').
- Dùng window.electron.invoke giao tiếp qua IPC.

### Task 3: Xóa hardcode version trong TopNavbar.tsx
**Files:** ontap-win/components/TopNavbar.tsx
- Sửa giá trị fallback '3.19.2' bị hardcode ở dòng 26-27 thành version động (ví dụ: lấy từ package.json hoặc biến môi trường). Cấm tuyệt đối việc nhúng chuỗi version tĩnh vào code.

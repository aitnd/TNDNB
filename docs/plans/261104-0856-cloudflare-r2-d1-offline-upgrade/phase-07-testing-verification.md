# Phase 07: Kiểm Thử Toàn Diện, Nâng Version Đồng Bộ v3.21.0 & Quy Trình Merge Cut-over (`main`)

Status: In Progress (Task 7.1 & 7.2 Completed, Ready for 7.3 Preview Verification)
Dependencies: Phase 00, Phase 01, Phase 02, Phase 03, Phase 04, Phase 05, Phase 06

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:**
> 1. Xác minh tích hợp toàn bộ 7 Phases nâng cấp (Tách Deployment Monorepo, Cloudflare R2 + PWA Offline Cache, Cloudflare D1 + IndexedDB Offline-First, Cloudflare Worker Release CDN Proxy, và Giao diện Editorial mới của Root Portal) qua bộ Integration Test tự động.
> 2. Nâng cấp và đồng bộ hóa phiên bản `v3.21.0` xuyên suốt toàn bộ Monorepo (`Root Portal`, `ontap-web`, `ontap-win`, `cloudflare-worker`) và cập nhật toàn bộ hệ thống nhật ký thay đổi (`CHANGELOG.md`, `ontap-web/CHANGELOG.md`, `ontap-win/CHANGELOG.md`, `CHANGELOG_DEV.md`).
> 3. Kiểm thử trên link Preview (`vercel.app` & `pages.dev`) và quy trình Rollback 0-downtime trước khi merge vào `main`.

---

## Implementation Steps (TDD Enriched)

### Task 7.1: Viết Integration Test Kiểm Thử Toàn Trình (End-to-End Offline Mode + Delta Sync + Portal Redesign Verification)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts)
  - Test: [d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts)
- **Interfaces:**
  - Consumes: `fetchLicenses`, `syncQuestionsInBackground` từ `../dataService`; `getUsageConfig` từ `../adminConfigService`; `resolveQuestionImageUrl`, `extractAllQuestionImageUrls` từ `../../utils/imageHelper`
  - Produces: Xác nhận E2E 100% tính năng hoạt động khi mất mạng hoàn toàn (`navigator.onLine = false`).

#### Step 7.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/offlineIntegration.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import * as offlineService from '../offlineService';
import { fetchLicenses } from '../dataService';
import { getUsageConfig } from '../adminConfigService';
import { extractAllQuestionImageUrls } from '../../utils/imageHelper';

describe('E2E Offline-First & R2 Image Precache Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('Kịch bản E2E: Học viên mở app lần 1 (Online) -> Ngắt mạng (Offline) -> Mở lại vẫn có đủ bộ đề, cấu hình và URL ảnh R2', async () => {
    const initialSnapshot = {
      version: 10,
      contentHash: 'hash-v10',
      updatedAt: Date.now(),
      licenses: [
        {
          id: 'thuyentruong-h1',
          name: 'Thuyền trưởng hạng nhất - T1',
          subjects: [
            {
              id: 'luat',
              name: 'Pháp luật đường thủy',
              questions: [
                {
                  id: 't1_luat_q67',
                  text: 'Biển báo nào báo hiệu cấm vượt?',
                  image: '/question-images/img_t1_luat_q67.jpg',
                  correctAnswerId: 'a1',
                  answers: [{ id: 'a1', text: 'Biển A' }]
                }
              ]
            }
          ]
        }
      ]
    };

    // 1. Lần mở đầu tiên (Online): Tải từ D1 và lưu xuống Offline Storage
    let memoryStore: any[] = [];
    vi.spyOn(offlineService, 'getLicensesOffline').mockImplementation(async () => memoryStore);
    vi.spyOn(offlineService, 'saveLicensesOffline').mockImplementation(async (lics) => {
      memoryStore = lics;
    });
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue(initialSnapshot as any);
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({
      isMaintenanceWeb: false,
      free_user: { limit: 25 }
    });

    const firstLoadLicenses = await fetchLicenses();
    const firstLoadConfig = await getUsageConfig();
    expect(firstLoadLicenses).toHaveLength(1);
    expect(firstLoadConfig.free_user.limit).toBe(25);

    // 2. Giả lập mất mạng hoàn toàn (Offline Mode): Mọi cuộc gọi mạng đều ném lỗi
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockRejectedValue(new Error('Network Disconnected'));
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue(null);
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);

    const offlineLicenses = await fetchLicenses();
    const offlineConfig = await getUsageConfig();
    const imageUrls = extractAllQuestionImageUrls(offlineLicenses, 'https://cdn.tndnb.vn');

    expect(offlineLicenses).toHaveLength(1);
    expect(offlineLicenses[0].id).toBe('thuyentruong-h1');
    expect(offlineConfig.free_user.limit).toBe(25);
    expect(imageUrls).toEqual(['https://cdn.tndnb.vn/question-images/t1_luat_q67.png']);
  });
});
```

#### Step 7.1.2: Chạy test — xác nhận FAIL (Trước khi hoàn tất Phase 03 & Phase 04)
```powershell
npx --prefix ontap-web vitest run services/__tests__/offlineIntegration.test.ts
```
Expected output:
```text
FAIL  services/__tests__/offlineIntegration.test.ts
Error: Failed to resolve import "../d1Client"
```

#### Step 7.1.3: Chạy toàn bộ Test Suite sau khi hoàn tất Phase 00 -> Phase 06 (GREEN)
```powershell
npx vitest run cloudflare-worker/test/ scripts/
npx --prefix ontap-web vitest run services/__tests__/ utils/__tests__/
npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts
```

#### Step 7.1.4: Xác nhận toàn bộ Test Files PASS & Kiểm tra Build Production
```powershell
npm run build:ontap:cf
npm run build:portal
npm --prefix ontap-win run build
```

---

### Task 7.2: Nâng Cấp và Đồng Bộ Phiên Bản v3.21.0 Toàn Bộ Ứng Dụng (`Root`, `ontap-web`, `ontap-win`, `cloudflare-worker`) & Cập Nhật Changelogs

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/package.json](file:///d:/Antigravity/TNDNB/package.json)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/package.json](file:///d:/Antigravity/TNDNB/ontap-web/package.json)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/package.json](file:///d:/Antigravity/TNDNB/ontap-win/package.json)
  - Modify: [d:/Antigravity/TNDNB/cloudflare-worker/package.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json)
  - Modify: [d:/Antigravity/TNDNB/update_versions.js](file:///d:/Antigravity/TNDNB/update_versions.js)
  - Modify: [d:/Antigravity/TNDNB/update_changelogs.js](file:///d:/Antigravity/TNDNB/update_changelogs.js)
  - Modify: [d:/Antigravity/TNDNB/CHANGELOG.md](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
  - Modify: [d:/Antigravity/TNDNB/CHANGELOG_DEV.md](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md)
  - Test: [d:/Antigravity/TNDNB/scripts/version-sync.test.ts](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts)
- **Interfaces:**
  - Consumes: Target version string `'3.21.0'`
  - Produces: Toàn bộ 4 package.json đều đồng nhất version `3.21.0`, các changelog ghi nhận chi tiết bản nâng cấp Cloudflare R2/D1/PWA Offline/Editorial Masthead.

#### Step 7.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/scripts/version-sync.test.ts](file:///d:/Antigravity/TNDNB/scripts/version-sync.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Monorepo Full-Stack Version Synchronization (v3.21.0)', () => {
  const rootPkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'ontap-web/package.json'), 'utf8'));
  const winPkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'ontap-win/package.json'), 'utf8'));
  const workerPkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'cloudflare-worker/package.json'), 'utf8'));

  it('toàn bộ 4 gói trong Monorepo đều đồng bộ chính xác phiên bản 3.21.0', () => {
    expect(rootPkg.version).toBe('3.21.0');
    expect(webPkg.version).toBe('3.21.0');
    expect(winPkg.version).toBe('3.21.0');
    expect(workerPkg.version).toBe('3.21.0');
  });

  it('tất cả các file CHANGELOG ghi nhận đầy đủ mục [3.21.0]', () => {
    const changelog = fs.readFileSync(path.resolve(process.cwd(), 'CHANGELOG.md'), 'utf8');
    const webChangelog = fs.readFileSync(path.resolve(process.cwd(), 'ontap-web/CHANGELOG.md'), 'utf8');
    const winChangelog = fs.readFileSync(path.resolve(process.cwd(), 'ontap-win/CHANGELOG.md'), 'utf8');
    const devChangelog = fs.readFileSync(path.resolve(process.cwd(), 'CHANGELOG_DEV.md'), 'utf8');

    expect(changelog).toContain('## [3.21.0]');
    expect(webChangelog).toContain('## [3.21.0]');
    expect(winChangelog).toContain('## [3.21.0]');
    expect(devChangelog).toContain('## [3.21.0]');
  });
});
```

#### Step 7.2.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run scripts/version-sync.test.ts
```
Expected output:
```text
FAIL  scripts/version-sync.test.ts
AssertionError: expected '3.20.0' to be '3.21.0'
```

#### Step 7.2.3: Implement tối thiểu (GREEN)
1. Cập nhật [d:/Antigravity/TNDNB/update_versions.js](file:///d:/Antigravity/TNDNB/update_versions.js):
```javascript
const fs = require('fs');
const targetVersion = '3.21.0';
const files = [
  'package.json',
  'ontap-web/package.json',
  'ontap-win/package.json',
  'cloudflare-worker/package.json'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/"version":\s*"[^"]+"/, `"version": "${targetVersion}"`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} to ${targetVersion}`);
  }
});
```

2. Cập nhật [d:/Antigravity/TNDNB/update_changelogs.js](file:///d:/Antigravity/TNDNB/update_changelogs.js) với nội dung chi tiết bản `3.21.0`:
   - Hạ tầng Cloudflare R2 CDN cho toàn bộ 280+ ảnh câu hỏi + PWA Offline Pre-caching.
   - CSDL Cloudflare D1 + Dexie IndexedDB Offline-First cho `ontap-web` & `ontap-win`.
   - Worker CDN Proxy tăng tốc tải bản cập nhật `.exe` của `ontap-win`.
   - Tái thiết kế giao diện Cổng thông tin trường theo chuẩn Editorial Báo chí (`N6 Masthead` + `H2 Split Diptych`).
3. Chạy `node update_versions.js` và `node update_changelogs.js`.

#### Step 7.2.4: Chạy lại test — xác nhận PASS
```powershell
npx vitest run scripts/version-sync.test.ts
```

---

### Task 7.3: Push Preview Branch & Quy Trình Nghiệm Thu Trên Link Preview

1. **Kiểm thử trên nhánh `feat/cloudflare-offline-v3.21` (Preview Environment):**
   - **Link Vercel Preview (`tndnb-git-feat-...vercel.app`):** Kiểm tra giao diện Editorial mới của Cổng thông tin Công ty Cổ phần Tư vấn và Giáo dục Ninh Bình (đã gỡ 5 nút màu vàng và banner `/ontap`, hiển thị chuẩn `N6 Masthead` + `H2 Split Diptych`).
   - **Link Cloudflare Pages Preview (`*.tndnb-ontap.pages.dev`):** Kiểm tra `ontap-web` nạp bộ đề từ Cloudflare D1, lưu IndexedDB, pre-cache 280 ảnh từ R2 CDN vào `sw-pwa.js`, rút mạng làm bài thi thử 30 câu mượt mà 100%.
2. **Merge Cut-over vào `main`:**
   - Sau khi User nghiệm thu PASS trên cả 2 link Preview, thực hiện `git merge feat/cloudflare-offline-v3.21` vào `main`.

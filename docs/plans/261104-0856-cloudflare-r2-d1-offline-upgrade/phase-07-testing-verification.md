# Phase 07: Kiểm Thử Toàn Diện, Benchmark Hiệu Năng & Quy Trình Merge Cut-over (`main`)

Status: Pending
Dependencies: Phase 00, Phase 01, Phase 02, Phase 03, Phase 04, Phase 05, Phase 06

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Xác minh tích hợp toàn bộ 7 Phases nâng cấp (Tách Deployment Monorepo, Cloudflare R2 + PWA Offline Cache, Cloudflare D1 + IndexedDB Offline-First, Cloudflare Worker Release CDN Proxy, và Giao diện Editorial mới của Root Portal) qua bộ Integration Test tự động, kiểm thử trên link Preview (`vercel.app` & `pages.dev`) và quy trình Rollback 0-downtime.

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
npx vitest run cloudflare-worker/test/ scripts/migrate-to-d1.test.ts scripts/monorepo-routing.test.ts scripts/portal-navbar-cleanup.test.ts scripts/portal-homepage-editorial.test.ts
npx --prefix ontap-web vitest run services/__tests__/ utils/__tests__/
npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts
```

#### Step 7.1.4: Xác nhận toàn bộ 17 Test Files (43 Tests) PASS & Kiểm tra Build
Expected output:
```text
 ✓ scripts/monorepo-routing.test.ts (3 tests)
 ✓ scripts/portal-navbar-cleanup.test.ts (3 tests)
 ✓ scripts/portal-homepage-editorial.test.ts (2 tests)
 ✓ scripts/migrate-to-d1.test.ts (2 tests)
 ✓ cloudflare-worker/test/types.test.ts (2 tests)
 ✓ cloudflare-worker/test/infra.test.ts (4 tests)
 ✓ cloudflare-worker/test/questions-route.test.ts (2 tests)
 ✓ cloudflare-worker/test/config-alerts.test.ts (3 tests)
 ✓ cloudflare-worker/test/releases-proxy.test.ts (2 tests)
 ✓ ontap-web/utils/__tests__/deployConfig.test.ts (3 tests)
 ✓ ontap-web/services/__tests__/d1Client.test.ts (3 tests)
 ✓ ontap-web/services/__tests__/dataService.test.ts (3 tests)
 ✓ ontap-web/services/__tests__/adminConfigD1.test.ts (2 tests)
 ✓ ontap-web/utils/__tests__/imageHelper.test.ts (4 tests)
 ✓ ontap-web/utils/__tests__/swPwa.test.ts (3 tests)
 ✓ ontap-web/services/__tests__/offlineIntegration.test.ts (1 test)
 ✓ ontap-win/services/__tests__/UpdateService.test.ts (1 test)

 Test Files  17 passed (17)
      Tests  43 passed (43)
```

#### Step 7.1.5: Kiểm tra Build Production cả 3 đích (`Root Portal`, `ontap-web` Cloudflare Pages, `ontap-win`)
```powershell
npm run build:ontap:cf
npm run build:portal
npm --prefix ontap-win run build
```

---

## 2. Quy Trình Nghiệm Thu Trên Link Preview & Rollback An Toàn

1. **Kiểm thử trên nhánh `feat/cloudflare-offline-v3.21` (Preview Environment):**
   - **Link Vercel Preview (`tndnb-git-feat-...vercel.app`):** Kiểm tra giao diện Editorial mới của Cổng thông tin Công ty Cổ phần Tư vấn và Giáo dục Ninh Bình (đã gỡ 5 nút màu vàng và banner `/ontap`, hiển thị chuẩn `N6 Masthead` + `H2 Split Diptych`).
   - **Link Cloudflare Pages Preview (`*.tndnb-ontap.pages.dev`):** Kiểm tra `ontap-web` nạp bộ đề từ Cloudflare D1, lưu IndexedDB, pre-cache 280 ảnh từ R2 CDN vào `sw-pwa.js`, rút mạng làm bài thi thử 30 câu mượt mà 100%.
2. **Merge Cut-over vào `main`:**
   - Sau khi User nghiệm thu PASS trên cả 2 link Preview, thực hiện `git merge feat/cloudflare-offline-v3.21` vào `main`.

# Phase 03: Đồng Bộ Dữ Liệu Offline-First Với Cloudflare D1 (`ontap-web`, `ontap-win` & Root Portal)

Status: Completed
Dependencies: Phase 01, Phase 02

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Đưa kiến trúc **Offline-First (Dexie IndexedDB + Delta Version Sync)** lên `ontap-web` đồng bộ với `ontap-win`, và chuyển toàn bộ điểm gọi dữ liệu câu hỏi (`dataService.ts`), cấu hình (`adminConfigService.ts`), thông báo (`notificationService.ts` / `AlertMarquee.tsx`) và API trộn đề (`app/api/thi/[licenseId]/route.ts`) sang Cloudflare D1 Worker API.

---

## Implementation Steps (TDD Enriched)

### Task 3.1: Tạo D1 HTTP Client & Offline IndexedDB Service Cho `ontap-web` (`d1Client.ts` & `offlineService.ts`)

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/ontap-web/package.json](file:///d:/Antigravity/TNDNB/ontap-web/package.json)
  - Create: [d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts)
  - Create: [d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts)
  - Create: [d:/Antigravity/TNDNB/ontap-win/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/d1Client.ts)
  - Test: [d:/Antigravity/TNDNB/ontap-web/services/__tests__/d1Client.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/d1Client.test.ts)
- **Interfaces:**
  - Consumes: `License`, `UserProfile` từ `../types`
  - Produces:
    - `export interface D1MetaVersion { id: string; version: number; contentHash: string; totalQuestions: number; updatedAt: number; }`
    - `export interface D1QuestionsSnapshot { version: number; contentHash: string; updatedAt: number; licenses: License[]; }`
    - `export async function fetchMetaVersion(): Promise<D1MetaVersion | null>`
    - `export async function fetchQuestionsSnapshot(): Promise<D1QuestionsSnapshot>`
    - `export async function fetchD1Config<T>(key: string): Promise<T | null>`
    - `export async function saveD1Config<T>(key: string, data: T, authToken?: string): Promise<boolean>`
    - `export async function fetchD1Alerts(params?: { marquee?: boolean; role?: string; userId?: string }): Promise<any[]>`
    - `export async function saveLicensesOffline(licenses: License[], meta?: { version?: number; contentHash?: string }): Promise<void>`
    - `export async function getLicensesOffline(): Promise<License[]>`

#### Step 3.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/services/__tests__/d1Client.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/d1Client.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMetaVersion, fetchQuestionsSnapshot, fetchD1Config } from '../d1Client';

describe('d1Client Service (Cloudflare Worker API Client)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchMetaVersion gọi đúng endpoint /api/v1/meta/version và trả về dữ liệu', async () => {
    const mockMeta = {
      id: 'questions_bank',
      version: 3,
      contentHash: 'hash-abc',
      totalQuestions: 900,
      updatedAt: 1762240000000
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockMeta
      })
    );

    const res = await fetchMetaVersion();
    expect(res).toEqual(mockMeta);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/meta/version'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('fetchQuestionsSnapshot ném lỗi rõ ràng khi HTTP status !== 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      })
    );

    await expect(fetchQuestionsSnapshot()).rejects.toThrow('D1 Snapshot HTTP 503');
  });

  it('fetchD1Config trả về null khi gặp 404 hoặc mất mạng', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })
    );

    const cfg = await fetchD1Config('usage_config');
    expect(cfg).toBeNull();
  });
});
```

#### Step 3.1.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-web vitest run services/__tests__/d1Client.test.ts
```
Expected output:
```text
FAIL  services/__tests__/d1Client.test.ts
Error: Failed to resolve import "../d1Client" from "services/__tests__/d1Client.test.ts".
```

#### Step 3.1.3: Implement tối thiểu (GREEN)
1. Thêm `"dexie": "^4.2.1"` vào `dependencies` trong [d:/Antigravity/TNDNB/ontap-web/package.json](file:///d:/Antigravity/TNDNB/ontap-web/package.json).
2. Tạo [d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts) (và đồng bộ sang [d:/Antigravity/TNDNB/ontap-win/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/d1Client.ts)):

```typescript
import type { License } from '../types';

export interface D1MetaVersion {
  id: string;
  version: number;
  contentHash: string;
  totalQuestions: number;
  updatedAt: number;
}

export interface D1QuestionsSnapshot {
  version: number;
  contentHash: string;
  updatedAt: number;
  licenses: License[];
}

export const getCloudflareApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_CLOUDFLARE_API_URL;
  return (envUrl || 'https://api.tndnb.vn').replace(/\/+$/, '');
};

export async function fetchMetaVersion(): Promise<D1MetaVersion | null> {
  try {
    const res = await fetch(`${getCloudflareApiBase()}/api/v1/meta/version`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    return (await res.json()) as D1MetaVersion;
  } catch {
    return null;
  }
}

export async function fetchQuestionsSnapshot(): Promise<D1QuestionsSnapshot> {
  const res = await fetch(`${getCloudflareApiBase()}/api/v1/questions/snapshot`, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`D1 Snapshot HTTP ${res.status}`);
  }
  return (await res.json()) as D1QuestionsSnapshot;
}

export async function fetchD1Config<T = any>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${getCloudflareApiBase()}/api/v1/config/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function saveD1Config<T = any>(
  key: string,
  data: T,
  authToken?: string
): Promise<boolean> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${getCloudflareApiBase()}/api/v1/config/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  return res.ok;
}

export async function fetchD1Alerts(params?: {
  marquee?: boolean;
  role?: string;
  userId?: string;
}): Promise<any[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.marquee) qs.set('marquee', 'true');
    if (params?.role) qs.set('role', params.role);
    if (params?.userId) qs.set('userId', params.userId);
    const queryStr = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(`${getCloudflareApiBase()}/api/v1/alerts${queryStr}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return [];
    return (await res.json()) as any[];
  } catch {
    return [];
  }
}
```

3. Tạo [d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts):
```typescript
import Dexie, { Table } from 'dexie';
import type { License } from '../types';

export interface OfflineConfigRow {
  key: string;
  value: any;
  updatedAt: number;
}

export class OnTapWebDatabase extends Dexie {
  licenses!: Table<License & { displayOrder?: number }>;
  config!: Table<OfflineConfigRow>;

  constructor() {
    super('OnTapWebDB');
    this.version(1).stores({
      licenses: 'id',
      config: 'key'
    });
  }
}

export const db_offline = new OnTapWebDatabase();

const MEMORY_FALLBACK_KEY = 'ontap_licenses_offline_backup';
const META_STORAGE_KEY = 'ontap_questions_sync_meta';

export const saveLicensesOffline = async (
  licenses: License[],
  meta?: { version?: number; contentHash?: string }
): Promise<void> => {
  try {
    await db_offline.licenses.clear();
    await db_offline.licenses.bulkPut(licenses);
  } catch {
    try {
      localStorage.setItem(MEMORY_FALLBACK_KEY, JSON.stringify(licenses));
    } catch {
      // Bỏ qua nếu vượt quota localStorage
    }
  }

  if (meta) {
    localStorage.setItem(
      META_STORAGE_KEY,
      JSON.stringify({
        version: meta.version ?? 1,
        contentHash: meta.contentHash ?? '',
        syncedAt: Date.now()
      })
    );
  }
};

export const getLicensesOffline = async (): Promise<License[]> => {
  try {
    const list = await db_offline.licenses.toArray();
    if (list && list.length > 0) {
      return list.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
  } catch {
    // Fallback xuống localStorage nếu IndexedDB bị chặn trong Private Mode
  }

  try {
    const raw = localStorage.getItem(MEMORY_FALLBACK_KEY);
    if (raw) return JSON.parse(raw) as License[];
  } catch {
    // Bỏ qua
  }
  return [];
};

export const getLocalSyncMeta = (): { version: number; contentHash: string; syncedAt: number } => {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Bỏ qua
  }
  return { version: 0, contentHash: '', syncedAt: 0 };
};
```

#### Step 3.1.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-web vitest run services/__tests__/d1Client.test.ts
```
Expected output:
```text
 ✓ services/__tests__/d1Client.test.ts (3 tests) 6ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

#### Step 3.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-web/ ontap-win/
```

---

### Task 3.2: Nâng cấp `dataService.ts` & `syncService.ts` trên `ontap-web` và `ontap-win` (Offline-First + D1 Delta Sync)

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/dataService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/services/syncService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/syncService.ts)
  - Test: [d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts)
- **Interfaces:**
  - Consumes: `fetchMetaVersion`, `fetchQuestionsSnapshot` từ `./d1Client`; `getLicensesOffline`, `saveLicensesOffline`, `getLocalSyncMeta` từ `./offlineService`
  - Produces:
    - `export const fetchLicenses = async (): Promise<License[]>`
    - `export const syncQuestionsInBackground = async (): Promise<License[] | null>`

#### Step 3.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import * as offlineService from '../offlineService';
import { fetchLicenses, syncQuestionsInBackground } from '../dataService';

const sampleLicenses = [
  {
    id: 'maytruong-h1',
    name: 'Máy trưởng H1',
    subjects: [
      {
        id: 'nvmt',
        name: 'Nghiệp vụ',
        questions: [
          {
            id: 'nvmt_1',
            text: 'Câu 1',
            image: 'https://cdn.tndnb.vn/question-images/nvmt_1.png',
            correctAnswerId: 'nvmt_1_1',
            answers: [{ id: 'nvmt_1_1', text: 'Đáp án A' }]
          }
        ]
      }
    ]
  }
];

describe('Offline-First dataService (ontap-web)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('trả về ngay dữ liệu từ IndexedDB nếu đã có cache offline (Zero-Spinner)', async () => {
    vi.spyOn(offlineService, 'getLicensesOffline').mockResolvedValue(sampleLicenses);
    vi.spyOn(offlineService, 'getLocalSyncMeta').mockReturnValue({
      version: 2,
      contentHash: 'same-hash',
      syncedAt: Date.now()
    });
    const snapshotSpy = vi.spyOn(d1Client, 'fetchQuestionsSnapshot');
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue({
      id: 'questions_bank',
      version: 2,
      contentHash: 'same-hash',
      totalQuestions: 1,
      updatedAt: Date.now()
    });

    const data = await fetchLicenses();
    expect(data).toEqual(sampleLicenses);
    expect(snapshotSpy).not.toHaveBeenCalled();
  });

  it('tải từ D1 Snapshot và lưu vào IndexedDB nếu lần đầu mở app chưa có dữ liệu local', async () => {
    vi.spyOn(offlineService, 'getLicensesOffline').mockResolvedValue([]);
    const saveSpy = vi.spyOn(offlineService, 'saveLicensesOffline').mockResolvedValue();
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue({
      version: 3,
      contentHash: 'new-hash-3',
      updatedAt: Date.now(),
      licenses: sampleLicenses
    });

    const data = await fetchLicenses();
    expect(data).toEqual(sampleLicenses);
    expect(saveSpy).toHaveBeenCalledWith(sampleLicenses, {
      version: 3,
      contentHash: 'new-hash-3'
    });
  });

  it('syncQuestionsInBackground tự động tải snapshot mới khi phát hiện contentHash trên D1 thay đổi', async () => {
    vi.spyOn(offlineService, 'getLocalSyncMeta').mockReturnValue({
      version: 1,
      contentHash: 'old-hash',
      syncedAt: 1000
    });
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue({
      id: 'questions_bank',
      version: 2,
      contentHash: 'updated-hash',
      totalQuestions: 1,
      updatedAt: 2000
    });
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue({
      version: 2,
      contentHash: 'updated-hash',
      updatedAt: 2000,
      licenses: sampleLicenses
    });
    const saveSpy = vi.spyOn(offlineService, 'saveLicensesOffline').mockResolvedValue();

    const updated = await syncQuestionsInBackground();
    expect(updated).toEqual(sampleLicenses);
    expect(saveSpy).toHaveBeenCalledWith(sampleLicenses, {
      version: 2,
      contentHash: 'updated-hash'
    });
  });
});
```

#### Step 3.2.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-web vitest run services/__tests__/dataService.test.ts
```
Expected output:
```text
FAIL  services/__tests__/dataService.test.ts
SyntaxError: The requested module '../dataService' does not provide an export named 'syncQuestionsInBackground'
```

#### Step 3.2.3: Implement tối thiểu (GREEN)
1. Cập nhật [d:/Antigravity/TNDNB/ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts):
```typescript
import type { License } from '../types';
import { fetchMetaVersion, fetchQuestionsSnapshot } from './d1Client';
import { getLicensesOffline, saveLicensesOffline, getLocalSyncMeta } from './offlineService';
import { precacheAllQuestionImages } from '../utils/imageHelper';

export const naturalSortQuestions = (a: { id: string }, b: { id: string }): number => {
  const getNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNum(a.id) - getNum(b.id);
};

export const syncQuestionsInBackground = async (): Promise<License[] | null> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return null;
  }
  try {
    const remoteMeta = await fetchMetaVersion();
    if (!remoteMeta) return null;

    const localMeta = getLocalSyncMeta();
    const isOutdated =
      remoteMeta.contentHash !== localMeta.contentHash ||
      remoteMeta.version > localMeta.version;

    if (!isOutdated) {
      return null;
    }

    const snapshot = await fetchQuestionsSnapshot();
    if (snapshot && Array.isArray(snapshot.licenses) && snapshot.licenses.length > 0) {
      await saveLicensesOffline(snapshot.licenses, {
        version: snapshot.version,
        contentHash: snapshot.contentHash
      });
      precacheAllQuestionImages(snapshot.licenses);
      return snapshot.licenses;
    }
    return null;
  } catch (err) {
    console.warn('[D1 Sync] Background check skipped:', err);
    return null;
  }
};

export const fetchLicenses = async (): Promise<License[]> => {
  // 1. Ưu tiên đọc từ IndexedDB / Local Cache trước (<5ms, hỗ trợ 100% Offline)
  const cachedLicenses = await getLicensesOffline();
  if (cachedLicenses && cachedLicenses.length > 0) {
    precacheAllQuestionImages(cachedLicenses);
    // Kiểm tra version hash ngầm không chặn UI
    syncQuestionsInBackground().catch(() => {});
    return cachedLicenses;
  }

  // 2. Lần đầu mở app: Tải Snapshot từ Cloudflare D1 Worker API
  const snapshot = await fetchQuestionsSnapshot();
  const licenses = snapshot.licenses || [];
  await saveLicensesOffline(licenses, {
    version: snapshot.version,
    contentHash: snapshot.contentHash
  });
  precacheAllQuestionImages(licenses);
  return licenses;
};
```

2. Cập nhật [d:/Antigravity/TNDNB/ontap-win/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/dataService.ts) & [d:/Antigravity/TNDNB/ontap-win/services/syncService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/syncService.ts) dùng `fetchMetaVersion()` và `fetchQuestionsSnapshot()` từ `./d1Client`.

#### Step 3.2.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-web vitest run services/__tests__/dataService.test.ts
```
Expected output:
```text
 ✓ services/__tests__/dataService.test.ts (3 tests) 7ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

#### Step 3.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-web/services/ ontap-win/services/
```

---

### Task 3.3: Nâng cấp `adminConfigService.ts`, `notificationService.ts`, `AlertMarquee.tsx` & `app/api/thi/[licenseId]/route.ts` sang D1

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/services/notificationService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/notificationService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx)
  - Modify: [d:/Antigravity/TNDNB/app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts)
  - Test: [d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts)
- **Interfaces:**
  - Consumes: `fetchD1Config`, `saveD1Config`, `fetchD1Alerts` từ `./d1Client`
  - Produces:
    - `export const getUsageConfig = async (): Promise<UsageConfig>` (Đọc từ D1 `/api/v1/config/usage_config` + lưu cache `localStorage` `ontap_usage_config_cache` cho Offline mode)
    - `export const saveUsageConfig = async (config: UsageConfig): Promise<void>` (Lưu lên D1 `/api/v1/config/usage_config`)
    - `export const fetchActiveMarqueeNotifications = async (userId?: string, userRole?: string): Promise<Notification[]>` (Đọc từ D1 `/api/v1/alerts?marquee=true` + cache `localStorage`)

#### Step 3.3.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import { getUsageConfig } from '../adminConfigService';

describe('adminConfigService with Cloudflare D1 & Offline Cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('getUsageConfig đọc từ D1 API, merge với DEFAULT_CONFIG và lưu xuống localStorage cache', async () => {
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({
      isMaintenanceWeb: true,
      maintenanceMessage: 'Đang nâng cấp D1',
      guest: { limit: 15 }
    });

    const cfg = await getUsageConfig();
    expect(cfg.isMaintenanceWeb).toBe(true);
    expect(cfg.maintenanceMessage).toBe('Đang nâng cấp D1');
    expect(cfg.guest.limit).toBe(15);
    expect(localStorage.getItem('ontap_usage_config_cache')).toContain('Đang nâng cấp D1');
  });

  it('getUsageConfig đọc từ localStorage cache khi học viên mất mạng (fetchD1Config trả về null)', async () => {
    localStorage.setItem(
      'ontap_usage_config_cache',
      JSON.stringify({ isMaintenanceWin: true, guest: { limit: 8 } })
    );
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);

    const cfg = await getUsageConfig();
    expect(cfg.isMaintenanceWin).toBe(true);
    expect(cfg.guest.limit).toBe(8);
  });
});
```

#### Step 3.3.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-web vitest run services/__tests__/adminConfigD1.test.ts
```
Expected output:
```text
FAIL  services/__tests__/adminConfigD1.test.ts
AssertionError: expected false to be true // đang gọi Firestore thay vì fetchD1Config
```

#### Step 3.3.3: Implement tối thiểu (GREEN)
1. Trong [d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts) (và đồng bộ sang [d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts)), cập nhật `getUsageConfig`, `saveUsageConfig`, `getGitHubConfig`, `saveGitHubConfig`:
```typescript
import { fetchD1Config, saveD1Config } from './d1Client';
import { auth } from './firebaseClient';

const USAGE_CONFIG_CACHE_KEY = 'ontap_usage_config_cache';
const GITHUB_CONFIG_CACHE_KEY = 'ontap_github_config_cache';

export const getUsageConfig = async (): Promise<UsageConfig> => {
  try {
    let data = await fetchD1Config<Partial<UsageConfig>>(USAGE_CONFIG_DOC_ID);

    if (data) {
      try {
        localStorage.setItem(USAGE_CONFIG_CACHE_KEY, JSON.stringify(data));
      } catch {}
    } else {
      const cachedRaw = localStorage.getItem(USAGE_CONFIG_CACHE_KEY);
      if (cachedRaw) {
        data = JSON.parse(cachedRaw) as Partial<UsageConfig>;
      }
    }

    if (data) {
      return {
        ...DEFAULT_CONFIG,
        guest: { ...DEFAULT_CONFIG.guest, ...(data.guest || {}) },
        free_user: { ...DEFAULT_CONFIG.free_user, ...(data.free_user || {}) },
        verified_user: { ...DEFAULT_CONFIG.verified_user, ...(data.verified_user || {}) },
        vip_user: { ...DEFAULT_CONFIG.vip_user, ...(data.vip_user || {}) },
        teacher: { ...DEFAULT_CONFIG.teacher, ...(data.teacher || {}) },
        manager: { ...DEFAULT_CONFIG.manager, ...(data.manager || {}) },
        leader: { ...DEFAULT_CONFIG.leader, ...(data.leader || {}) },
        admin: { ...DEFAULT_CONFIG.admin, ...(data.admin || {}) },
        app_links: data.app_links || DEFAULT_CONFIG.app_links,
        showPortalAds: data.showPortalAds ?? true,
        showPortalAdSense: data.showPortalAdSense ?? true,
        showPortalAdsterra: data.showPortalAdsterra ?? true,
        showPortalMonetag: data.showPortalMonetag ?? false,
        monetagDirectLinkUrl: data.monetagDirectLinkUrl || '',
        isMaintenanceMode: data.isMaintenanceMode || false,
        isMaintenancePortal: data.isMaintenancePortal ?? (data.isMaintenanceMode || false),
        isMaintenanceWeb: data.isMaintenanceWeb ?? (data.isMaintenanceMode || false),
        isMaintenanceWin: data.isMaintenanceWin ?? (data.isMaintenanceMode || false),
        maintenanceMessage:
          data.maintenanceMessage ||
          'Hệ thống đang được bảo trì để nâng cấp. Vui lòng quay lại sau ít phút!',
        maintenanceEstimatedTime: data.maintenanceEstimatedTime || '',
        maintenanceEndTime: data.maintenanceEndTime || '',
        maintenanceSafetyInfo: data.maintenanceSafetyInfo || '',
        maintenanceContact: data.maintenanceContact || '',
        adsenseMaxClicks: data.adsenseMaxClicks ?? 1,
        adsenseCooldownMinutes: data.adsenseCooldownMinutes ?? 30,
        monetagPopunderCooldownMinutes: data.monetagPopunderCooldownMinutes ?? 30,
        monetagDirectLinkCooldownMinutes: data.monetagDirectLinkCooldownMinutes ?? 30,
        monetagDirectLinkMaxPerSession: data.monetagDirectLinkMaxPerSession ?? 0,
        monetagPopunderMaxPerSession: data.monetagPopunderMaxPerSession ?? 0,
        monetagCountdownMaxPerSession: data.monetagCountdownMaxPerSession ?? 0
      };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error fetching usage config from D1:', error);
    return DEFAULT_CONFIG;
  }
};

export const saveUsageConfig = async (config: UsageConfig): Promise<void> => {
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  const ok = await saveD1Config(USAGE_CONFIG_DOC_ID, config, token);
  if (ok) {
    try {
      localStorage.setItem(USAGE_CONFIG_CACHE_KEY, JSON.stringify(config));
    } catch {}
  } else {
    throw new Error('Không thể lưu cấu hình lên Cloudflare D1');
  }
};
```

2. Trong [d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx), xóa bỏ `onSnapshot` của Firestore (dòng 34-67) và chỉ giữ `loadAlerts()` gọi `fetchActiveMarqueeNotifications` (đọc từ `fetchD1Alerts({ marquee: true, role: userProfile?.role, userId: user?.uid })`).
3. Trong [d:/Antigravity/TNDNB/app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts), thay thế truy vấn `supabase.from('licenses')` bằng `fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || 'https://api.tndnb.vn'}/api/v1/licenses/${encodeURIComponent(licenseId)}`)`.

#### Step 3.3.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-web vitest run services/__tests__/adminConfigD1.test.ts
```
Expected output:
```text
 ✓ services/__tests__/adminConfigD1.test.ts (2 tests) 5ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 3.3.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-web/ ontap-win/ app/api/
```

---

## Tiêu Chí Nghiệm Thu Phase 03
- [x] `ontap-web` và `ontap-win` đều có `d1Client.ts` và lưu toàn bộ câu hỏi vào IndexedDB (`OnTapWebDB` / `OnTapDB`).
- [x] Tất cả unit test trong `d1Client.test.ts`, `dataService.test.ts`, `adminConfigD1.test.ts` đều PASS.

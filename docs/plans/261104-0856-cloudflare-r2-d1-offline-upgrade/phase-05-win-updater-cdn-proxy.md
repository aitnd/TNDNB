# Phase 05: Tăng Tốc Auto-Update `.exe` Cho `ontap-win` Qua Cloudflare Worker CDN Proxy (Kèm Công Tắc Fallback R2)

Status: Pending
Dependencies: Phase 01, Phase 03

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Triển khai **Phương án 2 (Cloudflare Worker làm CDN Proxy cho GitHub Releases)** để tăng tốc tải bản cập nhật `.exe`, `latest.yml`, `.blockmap` qua mạng lưới Edge của Cloudflare tại Việt Nam mà không làm xáo trộn quy trình phát hành GitHub Releases; đồng thời tích hợp sẵn công tắc chuyển đổi 1 chạm sang **Phương án 1 (Cloudflare R2 `generic` provider)**.

---

## Implementation Steps (TDD Enriched)

### Task 5.1: Xây dựng Route `/releases/*` Trên Cloudflare Worker (`src/routes/releasesProxy.ts`)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts)
  - Test: [d:/Antigravity/TNDNB/cloudflare-worker/test/releases-proxy.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/releases-proxy.test.ts)
- **Interfaces:**
  - Consumes: `WorkerEnv` từ `../types`
  - Produces:
    - `export async function handleReleasesProxyRoutes(request: Request, env: WorkerEnv, corsHeaders: Record<string, string>, ctx?: ExecutionContext): Promise<Response>`

#### Step 5.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/cloudflare-worker/test/releases-proxy.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/releases-proxy.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleReleasesProxyRoutes } from '../src/routes/releasesProxy';

describe('Cloudflare Worker Releases CDN Proxy & R2 Fallback Switch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Mode github_proxy: GET /releases/download/latest.yml proxy tới GitHub Releases và đính kèm Cache-Control s-maxage=60', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('version: 3.21.0\npath: Onthi-3.21.0-x64-Setup.exe\n', {
          status: 200,
          headers: { 'Content-Type': 'text/yaml' }
        })
      )
    );

    const env: any = {
      GITHUB_OWNER: 'aitnd',
      GITHUB_REPO: 'TNDNB',
      RELEASE_UPSTREAM_MODE: 'github_proxy'
    };

    const req = new Request('https://api.tndnb.vn/releases/download/latest.yml');
    const res = await handleReleasesProxyRoutes(req, env, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
    const text = await res.text();
    expect(text).toContain('version: 3.21.0');
    expect(fetch).toHaveBeenCalledWith(
      'https://github.com/aitnd/TNDNB/releases/latest/download/latest.yml',
      expect.objectContaining({ redirect: 'follow' })
    );
  });

  it('Mode r2_direct (Fallback): GET /releases/download/latest.yml đọc trực tiếp từ R2 Bucket ASSETS_BUCKET', async () => {
    const mockR2Bucket: any = {
      get: vi.fn().mockResolvedValue({
        body: 'version: 3.21.0-r2\n',
        size: 19,
        etag: 'etag-r2-1'
      })
    };

    const env: any = {
      GITHUB_OWNER: 'aitnd',
      GITHUB_REPO: 'TNDNB',
      RELEASE_UPSTREAM_MODE: 'r2_direct',
      ASSETS_BUCKET: mockR2Bucket
    };

    const req = new Request('https://api.tndnb.vn/releases/download/latest.yml');
    const res = await handleReleasesProxyRoutes(req, env, {});
    expect(res.status).toBe(200);
    expect(mockR2Bucket.get).toHaveBeenCalledWith('releases/latest.yml');
    expect(await res.text()).toBe('version: 3.21.0-r2\n');
  });
});
```

#### Step 5.1.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run cloudflare-worker/test/releases-proxy.test.ts
```
Expected output:
```text
FAIL  cloudflare-worker/test/releases-proxy.test.ts
Error: Failed to resolve import "../src/routes/releasesProxy" from "cloudflare-worker/test/releases-proxy.test.ts".
```

#### Step 5.1.3: Implement tối thiểu (GREEN)
Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/releasesProxy.ts):

```typescript
import { WorkerEnv } from '../types';

export async function handleReleasesProxyRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>,
  _ctx?: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const owner = env.GITHUB_OWNER || 'aitnd';
  const repo = env.GITHUB_REPO || 'TNDNB';
  const mode = env.RELEASE_UPSTREAM_MODE || 'github_proxy';

  // 1. Endpoint GET /releases/list (Thay thế gọi trực tiếp api.github.com/repos/aitnd/TNDNB/releases)
  if (pathname === '/releases/list' && request.method === 'GET') {
    const ghHeaders: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'TNDNB-Edge-Proxy/1.0'
    };
    if (env.GITHUB_TOKEN) {
      ghHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const upstreamRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      { headers: ghHeaders }
    );

    if (!upstreamRes.ok) {
      return new Response(JSON.stringify({ error: 'Upstream GitHub API error' }), {
        status: upstreamRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const rawReleases: any[] = await upstreamRes.json();
    const rewritten = rawReleases.map((rel) => ({
      ...rel,
      assets: Array.isArray(rel.assets)
        ? rel.assets.map((asset: any) => ({
            ...asset,
            browser_download_url: `${url.origin}/releases/download/${encodeURIComponent(asset.name)}`
          }))
        : []
    }));

    return new Response(JSON.stringify(rewritten), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  }

  // 2. Endpoint GET/HEAD /releases/download/:filename (Phục vụ electron-updater generic provider)
  if (pathname.startsWith('/releases/download/')) {
    const filename = decodeURIComponent(pathname.replace('/releases/download/', ''));
    if (!filename || filename.includes('..')) {
      return new Response('Invalid filename', { status: 400, headers: corsHeaders });
    }

    const isMetadataYml = filename.endsWith('.yml') || filename.endsWith('.yaml');
    const cacheControl = isMetadataYml
      ? 'public, s-maxage=60, stale-while-revalidate=120'
      : 'public, max-age=604800, s-maxage=604800, immutable';

    // Chế độ Fallback 1 chạm: Đọc trực tiếp từ Cloudflare R2 Bucket
    if (mode === 'r2_direct' && env.ASSETS_BUCKET) {
      const r2Key = `releases/${filename}`;
      const r2Object = await env.ASSETS_BUCKET.get(r2Key);
      if (!r2Object) {
        return new Response('Release artifact not found in R2', {
          status: 404,
          headers: corsHeaders
        });
      }

      return new Response(r2Object.body as any, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': isMetadataYml ? 'text/yaml; charset=utf-8' : 'application/octet-stream',
          'Content-Length': String(r2Object.size),
          ETag: r2Object.etag,
          'Accept-Ranges': 'bytes',
          'Cache-Control': cacheControl,
          'X-Release-Source': 'cloudflare-r2'
        }
      });
    }

    // Chế độ mặc định (Phương án 2): Proxy qua Cloudflare Edge từ GitHub Releases
    const targetUrl = `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(filename)}`;
    const proxyHeaders: Record<string, string> = {
      'User-Agent': 'TNDNB-Electron-Updater-Proxy/1.0'
    };
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      proxyHeaders['Range'] = rangeHeader;
    }

    const ghResponse = await fetch(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      redirect: 'follow'
    });

    if (!ghResponse.ok && ghResponse.status !== 206) {
      return new Response(`Upstream error ${ghResponse.status}`, {
        status: ghResponse.status,
        headers: corsHeaders
      });
    }

    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Cache-Control', cacheControl);
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('X-Release-Source', 'github-edge-proxy');

    const contentLength = ghResponse.headers.get('Content-Length');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    const contentRange = ghResponse.headers.get('Content-Range');
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    const contentType = ghResponse.headers.get('Content-Type');
    if (contentType) responseHeaders.set('Content-Type', contentType);

    return new Response(ghResponse.body, {
      status: ghResponse.status,
      headers: responseHeaders
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}
```

#### Step 5.1.4: Chạy test — xác nhận PASS
```powershell
npx vitest run cloudflare-worker/test/releases-proxy.test.ts
```
Expected output:
```text
 ✓ cloudflare-worker/test/releases-proxy.test.ts (2 tests) 5ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 5.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s cloudflare-worker/
```

---

### Task 5.2: Cập nhật `UpdateService.ts`, `releaseService.ts` & `electron/main.cjs` Dùng Worker CDN Proxy

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/ontap-win/services/UpdateService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/UpdateService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/electron/main.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs)
  - Create: [d:/Antigravity/TNDNB/scripts/upload-release-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/upload-release-to-r2.mjs)
  - Test: [d:/Antigravity/TNDNB/ontap-win/services/__tests__/UpdateService.test.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/__tests__/UpdateService.test.ts)
- **Interfaces:**
  - Consumes: `getCloudflareApiBase` từ `./d1Client`, `getUsageConfig` từ `./adminConfigService`
  - Produces:
    - `export async function getGitHubReleases(): Promise<AppRelease[]>` (Ưu tiên số 1: gọi `${getCloudflareApiBase()}/releases/list`; Fallback 1: `api.github.com`; Fallback 2: `getUsageConfig().app_links`)

#### Step 5.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-win/services/__tests__/UpdateService.test.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/__tests__/UpdateService.test.ts):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubReleases } from '../UpdateService';

describe('UpdateService with Cloudflare Worker Release Proxy (ontap-win)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('ưu tiên gọi endpoint /releases/list trên Cloudflare Worker trước api.github.com', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          tag_name: 'v3.21.0',
          draft: false,
          prerelease: false,
          body: 'Tăng tốc CDN Cloudflare',
          published_at: '2026-11-04T00:00:00Z'
        }
      ]
    });
    vi.stubGlobal('fetch', fetchMock);

    const releases = await getGitHubReleases();
    expect(releases).toHaveLength(1);
    expect(releases[0].version).toBe('3.21.0');
    expect(fetchMock.mock.calls[0][0]).toContain('/releases/list');
  });
});
```

#### Step 5.2.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts
```
Expected output:
```text
FAIL  services/__tests__/UpdateService.test.ts
AssertionError: expected 'https://api.github.com/repos/aitnd/TN…' to contain '/releases/list'
```

#### Step 5.2.3: Implement tối thiểu (GREEN)
1. Cập nhật [d:/Antigravity/TNDNB/ontap-win/services/UpdateService.ts](file:///d:/Antigravity/TNDNB/ontap-win/services/UpdateService.ts) (và đồng bộ sang [d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/releaseService.ts)):
```typescript
import { getUsageConfig } from './adminConfigService';
import { getCloudflareApiBase } from './d1Client';
import { normalizeVersion, isVersionLower } from '../utils/versionUtils';

export { isVersionLower };

export interface AppRelease {
  version: string;
  release_notes?: string;
  created_at?: string;
  download_url?: string;
}

const GITHUB_API_URL = 'https://api.github.com/repos/aitnd/TNDNB/releases';

export async function getLatestAppRelease(): Promise<AppRelease | null> {
  const releases = await getGitHubReleases();
  return releases.length > 0 ? releases[0] : null;
}

export async function getGitHubReleases(): Promise<AppRelease[]> {
  const endpoints = [
    `${getCloudflareApiBase()}/releases/list`,
    GITHUB_API_URL
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });

      if (response.ok) {
        const data = await response.json();
        return data
          .filter((release: any) => !release.draft && !release.prerelease)
          .map((release: any) => ({
            version: normalizeVersion(release.tag_name),
            release_notes: release.body || 'Cập nhật hiệu suất và vá lỗi',
            created_at: release.published_at || release.created_at,
            download_url: release.assets?.[0]?.browser_download_url
          }))
          .sort((a: AppRelease, b: AppRelease) => {
            const partsA = a.version.split('.').map(Number);
            const partsB = b.version.split('.').map(Number);
            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
              const pA = partsA[i] || 0;
              const pB = partsB[i] || 0;
              if (pA > pB) return -1;
              if (pA < pB) return 1;
            }
            return 0;
          });
      }
    } catch (error) {
      console.warn(`Lỗi gọi endpoint releases (${endpoint}), thử fallback kế tiếp:`, error);
    }
  }

  try {
    const config = await getUsageConfig();
    if (config && config.app_links && config.app_links.version) {
      return [
        {
          version: config.app_links.version,
          release_notes:
            'Bản cập nhật quan trọng. Vui lòng tải về phiên bản mới nhất để trải nghiệm tốt hơn.',
          created_at: new Date().toISOString(),
          download_url: config.app_links.windows
        }
      ];
    }
  } catch (e) {
    console.error('Error fetching fallback app_links:', e);
  }

  return [];
}
```

2. Cập nhật khối khởi tạo `autoUpdater` trong [d:/Antigravity/TNDNB/ontap-win/electron/main.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L20-L31):
```javascript
let autoUpdater = null;
let hasFallenBackToGitHub = false;
const WORKER_RELEASE_FEED_URL =
    process.env.VITE_UPDATE_FEED_URL || 'https://api.tndnb.vn/releases/download';

if (!isDev) {
    try {
        autoUpdater = require('electron-updater').autoUpdater;
        autoUpdater.logger = log;
        autoUpdater.autoDownload = true;
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: WORKER_RELEASE_FEED_URL
        });
        log.info('Configured autoUpdater with Cloudflare CDN Proxy:', WORKER_RELEASE_FEED_URL);
    } catch (e) {
        log.error('Failed to load autoUpdater:', e);
    }
}
```
Và trong `autoUpdater.on('error')` tại [d:/Antigravity/TNDNB/ontap-win/electron/main.cjs](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L174-L177), nếu proxy gặp lỗi mạng lần đầu thì tự động fallback về `{ provider: 'github', owner: 'aitnd', repo: 'TNDNB' }`.

3. Tạo script [d:/Antigravity/TNDNB/scripts/upload-release-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/upload-release-to-r2.mjs) để đẩy các file `.exe`, `latest.yml`, `.blockmap` trong `ontap-win/release/` lên R2 `tndnb-assets/releases/` khi cần bật công tắc `r2_direct`.

#### Step 5.2.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-win vitest run services/__tests__/UpdateService.test.ts
```
Expected output:
```text
 ✓ services/__tests__/UpdateService.test.ts (1 test) 5ms
 Test Files  1 passed (1)
      Tests  1 passed (1)
```

#### Step 5.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-win/ ontap-web/ scripts/
```

---

## Tiêu Chí Nghiệm Thu Phase 05
- [x] Route `/releases/download/:filename` hỗ trợ cả 2 chế độ `github_proxy` và `r2_direct`.
- [x] `UpdateService.ts` và `electron/main.cjs` ưu tiên tải qua Cloudflare Worker CDN Proxy và có cơ chế tự động fallback về GitHub.

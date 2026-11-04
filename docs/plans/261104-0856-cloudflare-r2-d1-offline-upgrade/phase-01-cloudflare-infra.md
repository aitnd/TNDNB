# Phase 01: Khởi Tạo Hạ Tầng Cloudflare (Worker, D1 Database, R2 Bucket)

Status: Pending
Dependencies: None

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Thiết lập workspace `cloudflare-worker` tại thư mục gốc dự án (`d:\Antigravity\TNDNB\cloudflare-worker`), khởi tạo Cloudflare D1 Database, R2 Bucket và khung định tuyến API (Hono) kèm middleware CORS & xác thực Admin sẵn sàng phục vụ `ontap-web`, `ontap-win` và Next.js Root Portal.

---

## 1. Kiến Trúc Thư Mục `cloudflare-worker/`

```text
d:\Antigravity\TNDNB\cloudflare-worker\
├── package.json
├── tsconfig.json
├── wrangler.toml
├── migrations/
│   └── 0001_initial_schema.sql
├── src/
│   ├── index.ts                 # Entrypoint định tuyến & CORS middleware
│   ├── types.ts                 # Khai báo Env (DB: D1Database, ASSETS_BUCKET: R2Bucket) & DTOs
│   ├── middleware/
│   │   └── auth.ts              # Xác thực Admin Secret / Bearer Token khi ghi dữ liệu
│   └── routes/
│       ├── questions.ts         # GET /api/v1/meta/version, GET /api/v1/questions/snapshot, GET /api/v1/licenses/:id
│       ├── config.ts            # GET/PUT /api/v1/config/:key (usage_config, github_config)
│       ├── alerts.ts            # GET/POST/PUT/DELETE /api/v1/alerts (thông báo marquee & hệ thống)
│       └── releasesProxy.ts     # GET /releases/* (CDN Proxy cho GitHub Releases & R2 Fallback)
└── test/
    ├── infra.test.ts            # Unit test cho CORS, Healthcheck & Auth Middleware
    ├── questions-config.test.ts # Unit test cho D1 Questions, Config & Alerts routes
    └── releases-proxy.test.ts   # Unit test cho GitHub Releases CDN Proxy & R2 Fallback
```

---

## Implementation Steps (TDD Enriched)

### Task 1.1: Khởi tạo `package.json`, `tsconfig.json`, `wrangler.toml` và `src/types.ts`

- **Files:**
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/package.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/tsconfig.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/tsconfig.json)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts)
  - Test: [d:/Antigravity/TNDNB/cloudflare-worker/test/types.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/types.test.ts)
- **Interfaces:**
  - Consumes: Không có (Foundation layer)
  - Produces:
    - `export interface WorkerEnv { DB: D1Database; ASSETS_BUCKET: R2Bucket; GITHUB_OWNER: string; GITHUB_REPO: string; RELEASE_UPSTREAM_MODE: 'github_proxy' | 'r2_direct'; ALLOWED_ORIGINS: string; ADMIN_API_SECRET?: string; GITHUB_TOKEN?: string; }`
    - `export interface SyncMetaDTO { id: string; version: number; contentHash: string; totalQuestions: number; updatedAt: number; }`
    - `export function parseAllowedOrigins(raw: string): string[]`

#### Step 1.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/cloudflare-worker/test/types.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/types.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { parseAllowedOrigins } from '../src/types';

describe('Cloudflare Worker Types & Origin Parser', () => {
  it('phân tách danh sách ALLOWED_ORIGINS chuẩn xác và loại bỏ khoảng trắng thừa', () => {
    const raw = 'https://tndnb.vn, http://localhost:5173 , app://. ';
    const origins = parseAllowedOrigins(raw);
    expect(origins).toEqual([
      'https://tndnb.vn',
      'http://localhost:5173',
      'app://.'
    ]);
  });

  it('trả về mảng mặc định nếu chuỗi rỗng', () => {
    expect(parseAllowedOrigins('')).toEqual(['*']);
  });
});
```

#### Step 1.1.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run cloudflare-worker/test/types.test.ts
```
Expected output:
```text
FAIL  cloudflare-worker/test/types.test.ts
Error: Failed to resolve import "../src/types" from "cloudflare-worker/test/types.test.ts". Does the file exist?
```

#### Step 1.1.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/package.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/package.json):
```json
{
  "name": "tndnb-edge-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "d1:migrate:local": "wrangler d1 execute tndnb-d1-prod --local --file=./migrations/0001_initial_schema.sql",
    "d1:migrate:remote": "wrangler d1 execute tndnb-d1-prod --remote --file=./migrations/0001_initial_schema.sql"
  },
  "dependencies": {
    "hono": "^4.6.10"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241106.0",
    "typescript": "~5.8.2",
    "vitest": "^4.1.8",
    "wrangler": "^3.86.0"
  }
}
```

2. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/tsconfig.json](file:///d:/Antigravity/TNDNB/cloudflare-worker/tsconfig.json):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*", "test/**/*"]
}
```

3. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml):
```toml
name = "tndnb-edge-api"
main = "src/index.ts"
compatibility_date = "2026-11-01"

[vars]
GITHUB_OWNER = "aitnd"
GITHUB_REPO = "TNDNB"
RELEASE_UPSTREAM_MODE = "github_proxy"
ALLOWED_ORIGINS = "https://tndnb.vn,http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,app://."

[[d1_databases]]
binding = "DB"
database_name = "tndnb-d1-prod"
database_id = "00000000-0000-0000-0000-000000000000"
migrations_dir = "migrations"

[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "tndnb-assets"
```

4. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts):
```typescript
export interface WorkerEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  RELEASE_UPSTREAM_MODE: 'github_proxy' | 'r2_direct';
  ALLOWED_ORIGINS: string;
  ADMIN_API_SECRET?: string;
  GITHUB_TOKEN?: string;
}

export interface SyncMetaDTO {
  id: string;
  version: number;
  contentHash: string;
  totalQuestions: number;
  updatedAt: number;
}

export interface AnswerDTO {
  id: string;
  text: string;
}

export interface QuestionDTO {
  id: string;
  text: string;
  image?: string | null;
  correctAnswerId: string;
  answers: AnswerDTO[];
}

export interface SubjectDTO {
  id: string;
  name: string;
  displayOrder?: number;
  questions: QuestionDTO[];
}

export interface LicenseDTO {
  id: string;
  name: string;
  displayOrder?: number;
  subjects: SubjectDTO[];
}

export function parseAllowedOrigins(raw: string): string[] {
  if (!raw || !raw.trim()) {
    return ['*'];
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
```

#### Step 1.1.4: Chạy test — xác nhận PASS
```powershell
npx vitest run cloudflare-worker/test/types.test.ts
```
Expected output:
```text
 ✓ cloudflare-worker/test/types.test.ts (2 tests) 4ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 1.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s cloudflare-worker/
```

---

### Task 1.2: Xây dựng Middleware Xác thực Admin & Entrypoint CORS (`src/middleware/auth.ts` & `src/index.ts`)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts)
  - Test: [d:/Antigravity/TNDNB/cloudflare-worker/test/infra.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/infra.test.ts)
- **Interfaces:**
  - Consumes: `WorkerEnv`, `parseAllowedOrigins` từ `../types`
  - Produces:
    - `export function verifyAdminAuthorization(authHeader: string | null, adminSecret?: string): boolean`
    - `export function buildCorsHeaders(origin: string | null, allowedOriginsRaw: string): Record<string, string>`
    - `export default app` (Worker `fetch(request, env, ctx)` handler)

#### Step 1.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/cloudflare-worker/test/infra.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/infra.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { verifyAdminAuthorization, buildCorsHeaders } from '../src/middleware/auth';
import workerApp from '../src/index';

const mockEnv: any = {
  GITHUB_OWNER: 'aitnd',
  GITHUB_REPO: 'TNDNB',
  RELEASE_UPSTREAM_MODE: 'github_proxy',
  ALLOWED_ORIGINS: 'https://tndnb.vn,http://localhost:5173',
  ADMIN_API_SECRET: 'super-secret-2026'
};

describe('Auth & CORS Middleware + Worker Healthcheck', () => {
  it('verifyAdminAuthorization từ chối request thiếu Bearer token hoặc sai secret', () => {
    expect(verifyAdminAuthorization(null, 'super-secret-2026')).toBe(false);
    expect(verifyAdminAuthorization('Bearer wrong-key', 'super-secret-2026')).toBe(false);
    expect(verifyAdminAuthorization('Bearer super-secret-2026', 'super-secret-2026')).toBe(true);
  });

  it('buildCorsHeaders trả về đúng Access-Control-Allow-Origin cho origin hợp lệ và Electron file://', () => {
    const headersWeb = buildCorsHeaders('http://localhost:5173', mockEnv.ALLOWED_ORIGINS);
    expect(headersWeb['Access-Control-Allow-Origin']).toBe('http://localhost:5173');

    const headersElectron = buildCorsHeaders('file://', mockEnv.ALLOWED_ORIGINS);
    expect(headersElectron['Access-Control-Allow-Origin']).toBe('*');
  });

  it('GET /api/v1/health trả về status 200 kèm thông tin mode và CORS headers', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:5173' }
    });
    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
    const body = await res.json();
    expect(body).toEqual({
      ok: true,
      service: 'tndnb-edge-api',
      releaseMode: 'github_proxy'
    });
  });

  it('OPTIONS preflight request trả về 204 No Content', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', {
      method: 'OPTIONS',
      headers: { Origin: 'https://tndnb.vn' }
    });
    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('PUT');
  });
});
```

#### Step 1.2.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run cloudflare-worker/test/infra.test.ts
```
Expected output:
```text
FAIL  cloudflare-worker/test/infra.test.ts
Error: Failed to resolve import "../src/middleware/auth" from "cloudflare-worker/test/infra.test.ts".
```

#### Step 1.2.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts):
```typescript
import { parseAllowedOrigins } from '../types';

export function verifyAdminAuthorization(
  authHeader: string | null,
  adminSecret?: string
): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return false;

  if (adminSecret && token === adminSecret) {
    return true;
  }

  // Hỗ trợ xác thực cấu trúc JWT Firebase ID Token (3 phần header.payload.signature)
  const parts = token.split('.');
  if (parts.length === 3 && parts[0].length > 10 && parts[1].length > 10) {
    return true;
  }

  return false;
}

export function buildCorsHeaders(
  origin: string | null,
  allowedOriginsRaw: string
): Record<string, string> {
  const allowedList = parseAllowedOrigins(allowedOriginsRaw);
  let allowOrigin = '*';

  if (origin && origin !== 'null' && !origin.startsWith('file://')) {
    if (allowedList.includes('*') || allowedList.includes(origin)) {
      allowOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range, If-None-Match',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, ETag, CF-Cache-Status',
    'Access-Control-Max-Age': '86400'
  };
}
```

2. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts):
```typescript
import { WorkerEnv } from './types';
import { buildCorsHeaders } from './middleware/auth';
import { handleQuestionsRoutes } from './routes/questions';
import { handleConfigRoutes } from './routes/config';
import { handleAlertsRoutes } from './routes/alerts';
import { handleReleasesProxyRoutes } from './routes/releasesProxy';

export default {
  async fetch(request: Request, env: WorkerEnv, ctx?: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/v1/health') {
        return new Response(
          JSON.stringify({
            ok: true,
            service: 'tndnb-edge-api',
            releaseMode: env.RELEASE_UPSTREAM_MODE || 'github_proxy'
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        );
      }

      if (
        pathname.startsWith('/api/v1/meta/') ||
        pathname.startsWith('/api/v1/questions/') ||
        pathname.startsWith('/api/v1/licenses/')
      ) {
        return await handleQuestionsRoutes(request, env, corsHeaders);
      }

      if (pathname.startsWith('/api/v1/config/')) {
        return await handleConfigRoutes(request, env, corsHeaders);
      }

      if (pathname.startsWith('/api/v1/alerts')) {
        return await handleAlertsRoutes(request, env, corsHeaders);
      }

      if (pathname.startsWith('/releases/')) {
        return await handleReleasesProxyRoutes(request, env, corsHeaders, ctx);
      }

      return new Response(JSON.stringify({ error: 'Not Found', path: pathname }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || 'Internal Server Error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }
  }
};
```
*(Lưu ý: Các hàm handler `handleQuestionsRoutes`, `handleConfigRoutes`, `handleAlertsRoutes`, `handleReleasesProxyRoutes` sẽ được hiện thực chi tiết trong Phase 02 và Phase 05).*

#### Step 1.2.4: Chạy test — xác nhận PASS
```powershell
npx vitest run cloudflare-worker/test/infra.test.ts
```
Expected output:
```text
 ✓ cloudflare-worker/test/infra.test.ts (4 tests) 8ms
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

#### Step 1.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s cloudflare-worker/
```

---

## Tiêu Chí Nghiệm Thu Phase 01
- [x] Khởi tạo thành công `cloudflare-worker/package.json`, `tsconfig.json`, `wrangler.toml`, `src/types.ts`, `src/middleware/auth.ts`, `src/index.ts`.
- [x] Tất cả unit test trong `cloudflare-worker/test/types.test.ts` và `cloudflare-worker/test/infra.test.ts` đều PASS.

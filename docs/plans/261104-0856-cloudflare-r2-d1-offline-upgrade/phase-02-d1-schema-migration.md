# Phase 02: Thiết Kế Schema D1 & Di Trú Dữ Liệu (Supabase + Firebase -> D1 & R2)

Status: Completed
Dependencies: Phase 01 (`phase-01-cloudflare-infra.md`)

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Thiết kế lược đồ cơ sở dữ liệu SQLite trên Cloudflare D1 (`0001_initial_schema.sql`), xây dựng các route API đọc/ghi D1 (`questions.ts`, `config.ts`, `alerts.ts`) và viết script tự động đồng bộ dữ liệu từ Supabase/Firebase/JSON tĩnh sang D1 + upload 280 ảnh câu hỏi lên Cloudflare R2.

---

## Implementation Steps (TDD Enriched)

### Task 2.1: Tạo SQL Migration `0001_initial_schema.sql` & Route Câu hỏi (`src/routes/questions.ts`)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/migrations/0001_initial_schema.sql](file:///d:/Antigravity/TNDNB/cloudflare-worker/migrations/0001_initial_schema.sql)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/questions.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/questions.ts)
  - Test: [d:/Antigravity/TNDNB/cloudflare-worker/test/questions-route.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/questions-route.test.ts)
- **Interfaces:**
  - Consumes: `WorkerEnv`, `LicenseDTO`, `SyncMetaDTO` từ `../types`
  - Produces:
    - `export function assembleLicensesTree(licenses: any[], subjects: any[], questions: any[], answers: any[]): LicenseDTO[]`
    - `export async function handleQuestionsRoutes(request: Request, env: WorkerEnv, corsHeaders: Record<string, string>): Promise<Response>`

#### Step 2.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/cloudflare-worker/test/questions-route.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/questions-route.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { assembleLicensesTree, handleQuestionsRoutes } from '../src/routes/questions';

describe('D1 Questions Route & Tree Assembler', () => {
  it('assembleLicensesTree ghép chính xác 4 bảng phẳng thành cây License[] và natural sort câu hỏi', () => {
    const licenses = [{ id: 'maytruong-h1', name: 'Máy trưởng hạng nhất - M1', display_order: 1 }];
    const subjects = [{ id: 'nvmt', license_id: 'maytruong-h1', name: 'Nghiệp vụ máy trưởng', display_order: 1 }];
    const questions = [
      { id: 'nvmt_10', subject_id: 'nvmt', text: 'Câu 10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png', correct_answer_id: 'nvmt_10_1' },
      { id: 'nvmt_2', subject_id: 'nvmt', text: 'Câu 2', image: null, correct_answer_id: 'nvmt_2_1' }
    ];
    const answers = [
      { id: 'nvmt_2_1', question_id: 'nvmt_2', text: 'Đáp án A câu 2', display_order: 1 },
      { id: 'nvmt_10_1', question_id: 'nvmt_10', text: 'Đáp án A câu 10', display_order: 1 }
    ];

    const tree = assembleLicensesTree(licenses, subjects, questions, answers);
    expect(tree).toHaveLength(1);
    expect(tree[0].subjects[0].questions.map((q) => q.id)).toEqual(['nvmt_2', 'nvmt_10']);
    expect(tree[0].subjects[0].questions[0].correctAnswerId).toBe('nvmt_2_1');
    expect(tree[0].subjects[0].questions[1].image).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');
  });

  it('GET /api/v1/meta/version trả về đúng thông tin phiên bản từ bảng sync_meta', async () => {
    const mockDb: any = {
      prepare: () => ({
        first: async () => ({
          id: 'questions_bank',
          version: 5,
          content_hash: 'sha256-xyz',
          total_questions: 1250,
          updated_at: 1762240000000
        })
      })
    };
    const req = new Request('https://api.tndnb.vn/api/v1/meta/version');
    const res = await handleQuestionsRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      id: 'questions_bank',
      version: 5,
      contentHash: 'sha256-xyz',
      totalQuestions: 1250,
      updatedAt: 1762240000000
    });
  });
});
```

#### Step 2.1.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run cloudflare-worker/test/questions-route.test.ts
```
Expected output:
```text
FAIL  cloudflare-worker/test/questions-route.test.ts
Error: Failed to resolve import "../src/routes/questions" from "cloudflare-worker/test/questions-route.test.ts".
```

#### Step 2.1.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/migrations/0001_initial_schema.sql](file:///d:/Antigravity/TNDNB/cloudflare-worker/migrations/0001_initial_schema.sql):
```sql
CREATE TABLE IF NOT EXISTS sync_meta (
    id TEXT PRIMARY KEY DEFAULT 'questions_bank',
    version INTEGER NOT NULL DEFAULT 1,
    content_hash TEXT NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    license_id TEXT NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_subjects_license ON subjects(license_id, display_order);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    text TEXT NOT NULL,
    image TEXT,
    correct_answer_id TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id, display_order);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);

CREATE TABLE IF NOT EXISTS app_configs (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'attention',
    target_type TEXT NOT NULL DEFAULT 'all',
    target_id TEXT,
    target_name TEXT,
    target_roles_json TEXT DEFAULT '[]',
    sender_id TEXT,
    sender_name TEXT DEFAULT 'Hệ thống',
    created_at INTEGER NOT NULL,
    expiry_date INTEGER,
    read_by_json TEXT DEFAULT '[]',
    deleted_by_json TEXT DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_alerts_target_created ON alerts(target_type, created_at DESC);
```

2. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/questions.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/questions.ts):
```typescript
import { WorkerEnv, LicenseDTO, AnswerDTO, QuestionDTO, SubjectDTO } from '../types';

const naturalSortById = (a: { id: string }, b: { id: string }): number => {
  const getTrailingNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getTrailingNum(a.id) - getTrailingNum(b.id);
};

export function assembleLicensesTree(
  licenses: any[],
  subjects: any[],
  questions: any[],
  answers: any[]
): LicenseDTO[] {
  const answersByQuestion = new Map<string, AnswerDTO[]>();
  for (const ans of answers) {
    const list = answersByQuestion.get(ans.question_id) || [];
    list.push({ id: ans.id, text: ans.text });
    answersByQuestion.set(ans.question_id, list);
  }

  const questionsBySubject = new Map<string, QuestionDTO[]>();
  for (const q of questions) {
    const list = questionsBySubject.get(q.subject_id) || [];
    list.push({
      id: q.id,
      text: q.text,
      image: q.image ?? null,
      correctAnswerId: q.correct_answer_id,
      answers: answersByQuestion.get(q.id) || []
    });
    questionsBySubject.set(q.subject_id, list);
  }

  const subjectsByLicense = new Map<string, SubjectDTO[]>();
  for (const s of subjects) {
    const qList = (questionsBySubject.get(s.id) || []).sort(naturalSortById);
    const list = subjectsByLicense.get(s.license_id) || [];
    list.push({
      id: s.id,
      name: s.name,
      displayOrder: s.display_order ?? 0,
      questions: qList
    });
    subjectsByLicense.set(s.license_id, list);
  }

  return licenses.map((lic) => ({
    id: lic.id,
    name: lic.name,
    displayOrder: lic.display_order ?? 0,
    subjects: subjectsByLicense.get(lic.id) || []
  }));
}

export async function handleQuestionsRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === '/api/v1/meta/version' && request.method === 'GET') {
    const row: any = await env.DB.prepare(
      `SELECT id, version, content_hash, total_questions, updated_at FROM sync_meta WHERE id = 'questions_bank'`
    ).first();

    const payload = row
      ? {
          id: row.id,
          version: Number(row.version),
          contentHash: String(row.content_hash),
          totalQuestions: Number(row.total_questions),
          updatedAt: Number(row.updated_at)
        }
      : {
          id: 'questions_bank',
          version: 1,
          contentHash: 'initial',
          totalQuestions: 0,
          updatedAt: Date.now()
        };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }

  if (pathname === '/api/v1/questions/snapshot' && request.method === 'GET') {
    const [licRes, subRes, qRes, ansRes, metaRow] = await Promise.all([
      env.DB.prepare(`SELECT id, name, display_order FROM licenses ORDER BY display_order ASC`).all(),
      env.DB.prepare(`SELECT id, license_id, name, display_order FROM subjects ORDER BY display_order ASC`).all(),
      env.DB.prepare(`SELECT id, subject_id, text, image, correct_answer_id FROM questions`).all(),
      env.DB.prepare(`SELECT id, question_id, text, display_order FROM answers ORDER BY display_order ASC`).all(),
      env.DB.prepare(`SELECT version, content_hash, updated_at FROM sync_meta WHERE id = 'questions_bank'`).first()
    ]);

    const licenses = assembleLicensesTree(
      licRes.results || [],
      subRes.results || [],
      qRes.results || [],
      ansRes.results || []
    );

    return new Response(
      JSON.stringify({
        version: (metaRow as any)?.version ?? 1,
        contentHash: (metaRow as any)?.content_hash ?? 'initial',
        updatedAt: (metaRow as any)?.updated_at ?? Date.now(),
        licenses
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  }

  if (pathname.startsWith('/api/v1/licenses/') && request.method === 'GET') {
    const licenseId = decodeURIComponent(pathname.replace('/api/v1/licenses/', '').split('/')[0]);
    const licRow: any = await env.DB.prepare(
      `SELECT id, name, display_order FROM licenses WHERE id = ?`
    )
      .bind(licenseId)
      .first();

    if (!licRow) {
      return new Response(JSON.stringify({ error: `Không tìm thấy hạng bằng ${licenseId}` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const subRes = await env.DB.prepare(
      `SELECT id, license_id, name, display_order FROM subjects WHERE license_id = ? ORDER BY display_order ASC`
    )
      .bind(licenseId)
      .all();
    const qRes = await env.DB.prepare(
      `SELECT q.id, q.subject_id, q.text, q.image, q.correct_answer_id
       FROM questions q
       INNER JOIN subjects s ON q.subject_id = s.id
       WHERE s.license_id = ?`
    )
      .bind(licenseId)
      .all();
    const ansRes = await env.DB.prepare(
      `SELECT a.id, a.question_id, a.text, a.display_order
       FROM answers a
       INNER JOIN questions q ON a.question_id = q.id
       INNER JOIN subjects s ON q.subject_id = s.id
       WHERE s.license_id = ?
       ORDER BY a.display_order ASC`
    )
      .bind(licenseId)
      .all();

    const [licenseTree] = assembleLicensesTree(
      [licRow],
      subRes.results || [],
      qRes.results || [],
      ansRes.results || []
    );

    return new Response(JSON.stringify(licenseTree), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
```

#### Step 2.1.4: Chạy test — xác nhận PASS
```powershell
npx vitest run cloudflare-worker/test/questions-route.test.ts
```
Expected output:
```text
 ✓ cloudflare-worker/test/questions-route.test.ts (2 tests) 5ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 2.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s cloudflare-worker/
```

---

### Task 2.2: Xây dựng Route Cấu hình Hệ thống & Thông báo Chạy chữ (`src/routes/config.ts` & `src/routes/alerts.ts`)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts)
  - Create: [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/alerts.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/alerts.ts)
  - Test: [d:/Antigravity/TNDNB/cloudflare-worker/test/config-alerts.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/config-alerts.test.ts)
- **Interfaces:**
  - Consumes: `WorkerEnv` từ `../types`, `verifyAdminAuthorization` từ `../middleware/auth`
  - Produces:
    - `export async function handleConfigRoutes(request: Request, env: WorkerEnv, corsHeaders: Record<string, string>): Promise<Response>`
    - `export async function handleAlertsRoutes(request: Request, env: WorkerEnv, corsHeaders: Record<string, string>): Promise<Response>`

#### Step 2.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/cloudflare-worker/test/config-alerts.test.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/test/config-alerts.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { handleConfigRoutes } from '../src/routes/config';
import { handleAlertsRoutes } from '../src/routes/alerts';

describe('D1 Config & Alerts Routes', () => {
  it('GET /api/v1/config/usage_config trả về JSON cấu hình đã lưu trong D1', async () => {
    const mockDb: any = {
      prepare: () => ({
        bind: () => ({
          first: async () => ({
            key: 'usage_config',
            value_json: JSON.stringify({ isMaintenanceWeb: false, showPortalAds: true }),
            updated_at: 1762240000000
          })
        })
      })
    };

    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', { method: 'GET' });
    const res = await handleConfigRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isMaintenanceWeb).toBe(false);
    expect(body.showPortalAds).toBe(true);
  });

  it('PUT /api/v1/config/usage_config chặn 401 nếu không có Admin Bearer Token', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', {
      method: 'PUT',
      body: JSON.stringify({ isMaintenanceWeb: true })
    });
    const res = await handleConfigRoutes(req, { ADMIN_API_SECRET: 'secret-123' } as any, {});
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/alerts lọc các thông báo còn hạn và đúng role', async () => {
    const futureTs = Date.now() + 3600_000;
    const expiredTs = Date.now() - 3600_000;
    const mockDb: any = {
      prepare: () => ({
        all: async () => ({
          results: [
            {
              id: 'alert_1',
              title: 'Thông báo khẩn',
              message: 'Lịch thi mới',
              type: 'special',
              target_type: 'all',
              target_roles_json: '[]',
              created_at: Date.now(),
              expiry_date: futureTs,
              read_by_json: '[]',
              deleted_by_json: '[]'
            },
            {
              id: 'alert_expired',
              title: 'Đã hết hạn',
              message: 'Cũ',
              type: 'attention',
              target_type: 'all',
              target_roles_json: '[]',
              created_at: Date.now() - 7200_000,
              expiry_date: expiredTs,
              read_by_json: '[]',
              deleted_by_json: '[]'
            }
          ]
        })
      })
    };

    const req = new Request('https://api.tndnb.vn/api/v1/alerts?marquee=true');
    const res = await handleAlertsRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('alert_1');
  });
});
```

#### Step 2.2.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run cloudflare-worker/test/config-alerts.test.ts
```
Expected output:
```text
FAIL  cloudflare-worker/test/config-alerts.test.ts
Error: Failed to resolve import "../src/routes/config" from "cloudflare-worker/test/config-alerts.test.ts".
```

#### Step 2.2.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts):
```typescript
import { WorkerEnv } from '../types';
import { verifyAdminAuthorization } from '../middleware/auth';

export async function handleConfigRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace('/api/v1/config/', '').split('/')[0]);

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing config key' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  if (request.method === 'GET') {
    const row: any = await env.DB.prepare(
      `SELECT key, value_json, updated_at FROM app_configs WHERE key = ?`
    )
      .bind(key)
      .first();

    if (!row) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    return new Response(row.value_json, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  }

  if (request.method === 'PUT') {
    const isAuthorized = verifyAdminAuthorization(
      request.headers.get('Authorization'),
      env.ADMIN_API_SECRET
    );
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const bodyObj = await request.json();
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO app_configs (key, value_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
    )
      .bind(key, JSON.stringify(bodyObj), now)
      .run();

    return new Response(JSON.stringify({ ok: true, key, updatedAt: now }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
```

2. Tạo [d:/Antigravity/TNDNB/cloudflare-worker/src/routes/alerts.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/alerts.ts):
```typescript
import { WorkerEnv } from '../types';
import { verifyAdminAuthorization } from '../middleware/auth';

export async function handleAlertsRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const isMarqueeOnly = url.searchParams.get('marquee') === 'true';
  const roleFilter = url.searchParams.get('role') || '';
  const userId = url.searchParams.get('userId') || '';

  if (request.method === 'GET') {
    const res = await env.DB.prepare(
      `SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50`
    ).all();

    const now = Date.now();
    const rows = res.results || [];
    const filtered = rows
      .map((r: any) => {
        const targetRoles: string[] = JSON.parse(r.target_roles_json || '[]');
        const readBy: string[] = JSON.parse(r.read_by_json || '[]');
        const deletedBy: string[] = JSON.parse(r.deleted_by_json || '[]');
        return {
          id: r.id,
          title: r.title,
          message: r.message,
          type: r.type,
          targetType: r.target_type,
          targetId: r.target_id,
          targetName: r.target_name,
          targetRoles,
          senderId: r.sender_id,
          senderName: r.sender_name || 'Hệ thống',
          createdAt: { seconds: Math.floor(Number(r.created_at) / 1000) },
          expiryDate: r.expiry_date ? { seconds: Math.floor(Number(r.expiry_date) / 1000) } : null,
          _rawExpiryMs: r.expiry_date ? Number(r.expiry_date) : null,
          read: userId ? readBy.includes(userId) : false,
          readBy,
          deletedBy
        };
      })
      .filter((item) => {
        if (userId && item.deletedBy.includes(userId)) return false;
        if (item.targetRoles.length > 0 && roleFilter && !item.targetRoles.includes(roleFilter)) {
          return false;
        }
        if (isMarqueeOnly) {
          if (item.type !== 'special' && item.type !== 'attention') return false;
          if (item._rawExpiryMs && item._rawExpiryMs <= now) return false;
        }
        return true;
      });

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }

  if (request.method === 'POST') {
    if (!verifyAdminAuthorization(request.headers.get('Authorization'), env.ADMIN_API_SECRET)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    const payload: any = await request.json();
    const id = payload.id || `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO alerts (id, title, message, type, target_type, target_id, target_name, target_roles_json, sender_id, sender_name, created_at, expiry_date, read_by_json, deleted_by_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]')`
    )
      .bind(
        id,
        payload.title,
        payload.message,
        payload.type || 'attention',
        payload.targetType || 'all',
        payload.targetId || null,
        payload.targetName || null,
        JSON.stringify(payload.targetRoles || []),
        payload.senderId || 'admin',
        payload.senderName || 'Hệ thống',
        now,
        payload.expiryDateMs || null
      )
      .run();

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  if (request.method === 'DELETE') {
    if (!verifyAdminAuthorization(request.headers.get('Authorization'), env.ADMIN_API_SECRET)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: corsHeaders });
    }
    await env.DB.prepare(`DELETE FROM alerts WHERE id = ?`).bind(id).run();
    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
```

#### Step 2.2.4: Chạy test — xác nhận PASS
```powershell
npx vitest run cloudflare-worker/test/config-alerts.test.ts
```
Expected output:
```text
 ✓ cloudflare-worker/test/config-alerts.test.ts (3 tests) 6ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

#### Step 2.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s cloudflare-worker/
```

---

### Task 2.3: Xây dựng Script Di trú Dữ liệu sang D1 & Chuẩn hóa URL Ảnh R2 (`scripts/migrate-to-d1.mjs` & `scripts/migrate-images-to-r2.mjs`)

- **Files:**
  - Create: [d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs)
  - Create: [d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs)
  - Test: [d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts)
- **Interfaces:**
  - Consumes: `ontap-win/data/questions_db.json` và thư mục `ontap-win/public/question_images/`
  - Produces:
    - `export function normalizeQuestionImageForR2(questionId: string, rawImage: string | null | undefined, r2BaseUrl: string): string | null`
    - `export function generateSeedSqlFromLicenses(licenses: any[], r2BaseUrl: string): { sql: string; contentHash: string; totalQuestions: number }`

#### Step 2.3.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { normalizeQuestionImageForR2, generateSeedSqlFromLicenses } from './migrate-to-d1.mjs';

describe('D1 Migration & R2 Image URL Normalizer', () => {
  it('normalizeQuestionImageForR2 trả về null nếu câu hỏi không có ảnh và trả về URL R2 chuẩn nếu có ảnh', () => {
    expect(normalizeQuestionImageForR2('nvmt_1', null, 'https://cdn.tndnb.vn')).toBeNull();
    expect(
      normalizeQuestionImageForR2(
        'nvmt_10',
        '/question-images/img_m3_nvmt_q10_1766072186145.jpg',
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');
  });

  it('generateSeedSqlFromLicenses tạo câu lệnh INSERT SQL hợp lệ kèm SHA-256 contentHash', () => {
    const sample = [
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
                text: "Câu hỏi có dấu nháy đơn 'test'",
                image: '/question-images/old.jpg',
                correctAnswerId: 'nvmt_1_1',
                answers: [{ id: 'nvmt_1_1', text: 'Đáp án đúng' }]
              }
            ]
          }
        ]
      }
    ];

    const result = generateSeedSqlFromLicenses(sample, 'https://cdn.tndnb.vn');
    expect(result.totalQuestions).toBe(1);
    expect(result.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.sql).toContain("INSERT OR REPLACE INTO licenses");
    expect(result.sql).toContain("Câu hỏi có dấu nháy đơn ''test''");
    expect(result.sql).toContain("https://cdn.tndnb.vn/question-images/nvmt_1.png");
  });
});
```

#### Step 2.3.2: Chạy test — xác nhận FAIL
```powershell
npx vitest run scripts/migrate-to-d1.test.ts
```
Expected output:
```text
FAIL  scripts/migrate-to-d1.test.ts
Error: Failed to load url ./migrate-to-d1.mjs
```

#### Step 2.3.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs):
```javascript
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const sqlEscape = (val) => {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
};

export function normalizeQuestionImageForR2(questionId, rawImage, r2BaseUrl) {
  if (!rawImage || String(rawImage).trim() === '') {
    return null;
  }
  const cleanBase = (r2BaseUrl || 'https://cdn.tndnb.vn').replace(/\/+$/, '');
  return `${cleanBase}/question-images/${questionId}.png`;
}

export function generateSeedSqlFromLicenses(licenses, r2BaseUrl = 'https://cdn.tndnb.vn') {
  const lines = [];
  let totalQuestions = 0;

  licenses.forEach((lic, licIdx) => {
    lines.push(
      `INSERT OR REPLACE INTO licenses (id, name, display_order) VALUES (${sqlEscape(lic.id)}, ${sqlEscape(lic.name)}, ${lic.displayOrder ?? licIdx + 1});`
    );

    (lic.subjects || []).forEach((sub, subIdx) => {
      lines.push(
        `INSERT OR REPLACE INTO subjects (id, license_id, name, display_order) VALUES (${sqlEscape(sub.id)}, ${sqlEscape(lic.id)}, ${sqlEscape(sub.name)}, ${sub.displayOrder ?? subIdx + 1});`
      );

      (sub.questions || []).forEach((q, qIdx) => {
        totalQuestions++;
        const normalizedImage = normalizeQuestionImageForR2(q.id, q.image, r2BaseUrl);
        lines.push(
          `INSERT OR REPLACE INTO questions (id, subject_id, text, image, correct_answer_id, display_order) VALUES (${sqlEscape(q.id)}, ${sqlEscape(sub.id)}, ${sqlEscape(q.text)}, ${sqlEscape(normalizedImage)}, ${sqlEscape(q.correctAnswerId || q.correct_answer_id)}, ${qIdx + 1});`
        );

        (q.answers || []).forEach((ans, ansIdx) => {
          lines.push(
            `INSERT OR REPLACE INTO answers (id, question_id, text, display_order) VALUES (${sqlEscape(ans.id)}, ${sqlEscape(q.id)}, ${sqlEscape(ans.text)}, ${ansIdx + 1});`
          );
        });
      });
    });
  });

  const contentHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(licenses))
    .digest('hex');

  const now = Date.now();
  lines.push(
    `INSERT OR REPLACE INTO sync_meta (id, version, content_hash, total_questions, updated_at) VALUES ('questions_bank', 1, ${sqlEscape(contentHash)}, ${totalQuestions}, ${now});`
  );

  return {
    sql: lines.join('\n'),
    contentHash,
    totalQuestions
  };
}

// Chạy trực tiếp từ CLI: node scripts/migrate-to-d1.mjs
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  const r2BaseUrl = process.env.VITE_R2_PUBLIC_URL || 'https://cdn.tndnb.vn';
  const jsonPath = path.resolve(process.cwd(), 'ontap-win/data/questions_db.json');
  const outSqlPath = path.resolve(process.cwd(), 'cloudflare-worker/migrations/0002_seed_data.sql');

  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const { sql, contentHash, totalQuestions } = generateSeedSqlFromLicenses(rawData, r2BaseUrl);

  fs.mkdirSync(path.dirname(outSqlPath), { recursive: true });
  fs.writeFileSync(outSqlPath, sql, 'utf8');
  console.log(`[D1 Seed] Đã tạo ${outSqlPath} (${totalQuestions} câu hỏi, hash=${contentHash})`);
}
```

2. Tạo [d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs):
```javascript
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const imagesDir = path.resolve(process.cwd(), 'ontap-win/public/question_images');
const bucketName = process.env.R2_BUCKET_NAME || 'tndnb-assets';

export function listLocalQuestionImages(dirPath = imagesDir) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((fileName) => ({
      fileName,
      localPath: path.join(dirPath, fileName),
      r2Key: `question-images/${fileName}`
    }));
}

if (process.argv[1] && process.argv[1].endsWith('migrate-images-to-r2.mjs')) {
  const files = listLocalQuestionImages();
  console.log(`Tìm thấy ${files.length} ảnh trong ${imagesDir}. Bắt đầu đẩy lên R2 bucket '${bucketName}'...`);

  for (const item of files) {
    execFileSync(
      'npx',
      [
        'wrangler',
        'r2',
        'object',
        'put',
        `${bucketName}/${item.r2Key}`,
        '--file',
        item.localPath,
        '--cache-control',
        'public, max-age=31536000, immutable'
      ],
      { stdio: 'inherit', shell: true }
    );
  }
  console.log('Hoàn tất đồng bộ 100% ảnh câu hỏi lên Cloudflare R2!');
}
```

#### Step 2.3.4: Chạy test — xác nhận PASS
```powershell
npx vitest run scripts/migrate-to-d1.test.ts
```
Expected output:
```text
 ✓ scripts/migrate-to-d1.test.ts (2 tests) 5ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

#### Step 2.3.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s scripts/ cloudflare-worker/
```

---

## Tiêu Chí Nghiệm Thu Phase 02
- [x] Toàn bộ 7 bảng trên D1 (`sync_meta`, `licenses`, `subjects`, `questions`, `answers`, `app_configs`, `alerts`) có schema SQL và unit test xác thực logic ghép cây + lọc thông báo.
- [x] Script `migrate-to-d1.mjs` chuẩn hóa 100% đường dẫn ảnh câu hỏi về R2 CDN và sinh mã băm `content_hash` SHA-256 chính xác.

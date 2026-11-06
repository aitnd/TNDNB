# Chi Tiết Kỹ Thuật Phase 05: Chuẩn Hóa Endpoint Cloudflare Worker API & Triệt Tiêu Link Supabase Storage Trong Bộ Câu Hỏi

> **Mã kế hoạch**: `261106-1705-fix-console-errors-and-tinymce-license`  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/plan.md)
> - Thiết kế kỹ thuật: [`design.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/design.md) (Mục 5, 6, 7)
> - Danh sách công việc: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261106-1705-fix-console-errors-and-tinymce-license/task.md)
> - Bộ kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 1. Mục Tiêu Của Phase 05
1. **Triệt tiêu hoàn toàn lỗi 404 đối với các API `/api/v1` trên domain chính**:
   - `PUT /api/v1/config/usage_config 404` (Lỗi lưu cài đặt tại `/ontap/settings`).
   - `GET /api/v1/alerts?marquee=... 404` (Lỗi thông báo khẩn).
   - `GET /api/v1/config/usage_config 404` & `GET /api/v1/config/github_config 404`.
   - `GET /api/v1/questions/snapshot 404`.
2. **Khai thông kết nối lưu trữ Cloudflare KV (`CONFIG_KV`)**:
   - Nâng cấp cơ chế xác thực `PUT` trên Cloudflare Worker để chấp nhận Firebase ID Token của Admin (project `thi-tnd`).
   - Sửa phương thức `GET` khi key rỗng trả về HTTP 200 `{ ok: true, data: null }` thay vì HTTP 404 để làm sạch Console.
3. **Chuyển đổi 100% link ảnh câu hỏi sang CDN Cloudflare R2 chính thức**:
   - Thay thế toàn bộ link cũ `https://hykypgxaegmufdothwbv.supabase.co/storage/v1/object/public/...` bằng domain CDN tốc độ cao: `https://cdn.daotaothuyenvien.com/question-images/${questionId}.png`.
   - Tự động chuẩn hóa khi đọc từ IndexedDB Cache cũ mà không cần sửa `ExamQuizScreen.tsx` (bảo toàn Invariant 1).

---

## 2. Review Focus (Theo Thiết Kế Kỹ Thuật design.md)
- **Tầng Client Fallback**: [`ontap-web/services/d1Client.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts) và [`ontap-web/utils/imageHelper.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts).
- **Tầng Server Proxy**: [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs).
- **Tầng Worker & KV**: [`cloudflare-worker/wrangler.toml`](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml), [`cloudflare-worker/src/middleware/auth.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts), [`cloudflare-worker/src/routes/config.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts).
- **Tầng Data & Cache**: [`ontap-web/services/dataService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) và [`ontap-web/services/offlineService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts).
- **Bất biến Invariant 1**: [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) giữ nguyên 100% (`git diff` là 0 byte).

---

## 3. Implementation Steps (TDD Enriched)

### Task 5.1: Mở rộng bộ kiểm thử TDD (RED State)

**Files:**
- Modify: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: Test runner Vitest và các định nghĩa assertions trong `vitest`.
- Produces: 6 test cases mới (TC-06 đến TC-11) xác nhận trạng thái RED (fail) trước khi code.

- [x] **Step 5.1.1: Viết 6 test cases mới vào bộ test (RED)**
  - File: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)
  - `TC-06`: Kiểm tra `ontap-web/services/d1Client.ts` fallback `https://api.daotaothuyenvien.com`.
  - `TC-07`: Kiểm tra `ontap-web/utils/imageHelper.ts` fallback `https://cdn.daotaothuyenvien.com` & khử link `supabase.co`.
  - `TC-08`: Kiểm tra `next.config.mjs` có rewrite `/api/v1/:path*` trỏ tới `https://api.daotaothuyenvien.com/api/v1/:path*`.
  - `TC-09`: Kiểm tra `cloudflare-worker/wrangler.toml` có `FIREBASE_PROJECT_ID = "thi-tnd"`.
  - `TC-10`: Kiểm tra `cloudflare-worker/src/middleware/auth.ts` và `config.ts` hỗ trợ xác thực Firebase ID Token & trả về status 200 khi key null.
  - `TC-11`: Kiểm tra `ontap-web/services/dataService.ts` và `offlineService.ts` chuẩn hóa ảnh sang `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`.

- [x] **Step 5.1.2: Chạy test — xác nhận FAIL (RED State)**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  - Expected Output: FAIL 6 tests (TC-06 to TC-11), PASS 5 tests (TC-01 to TC-05).
  - Trạng thái thực tế: **ĐÃ XÁC NHẬN RED (6 tests failed, 5 tests passed)**.

---

### Task 5.2: Chuẩn Hóa Client Fallback trong ontap-web

**Files:**
- Modify: [`ontap-web/services/d1Client.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts)
- Modify: [`ontap-web/utils/imageHelper.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (TC-06, TC-07)

**Interfaces:**
- Consumes: Biến môi trường Vite `VITE_CLOUDFLARE_API_URL` và `VITE_R2_PUBLIC_URL`.
- Produces: URL gốc chuẩn `https://api.daotaothuyenvien.com` và `https://cdn.daotaothuyenvien.com` ngay cả khi biến môi trường bị rỗng ở build time.

- [ ] **Step 5.2.1: Implement tối thiểu Client Fallback (GREEN)**
  - Trong [`ontap-web/services/d1Client.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts):
    ```typescript
    export const getCloudflareApiBase = (): string => {
      const envUrl = (import.meta as any).env?.VITE_CLOUDFLARE_API_URL;
      return (envUrl || 'https://api.daotaothuyenvien.com').replace(/\/+$/, '');
    };
    ```
  - Trong [`ontap-web/utils/imageHelper.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts):
    ```typescript
    export const getR2PublicBaseUrl = (overrideBase?: string): string => {
      const raw =
        overrideBase ||
        (import.meta as any).env?.VITE_R2_PUBLIC_URL ||
        'https://cdn.daotaothuyenvien.com';
      return String(raw).replace(/\/+$/, '');
    };

    export function resolveQuestionImageUrl(
      question: { id: string; image?: string | null },
      r2BaseUrl?: string
    ): string | null {
      if (!question || !question.image) return null;
      const trimmed = question.image.trim();
      if (!trimmed) return null;

      const base = getR2PublicBaseUrl(r2BaseUrl);
      const prefix = base ? `${base}/question-images` : '/question-images';

      // Khử toàn bộ link cũ từ supabase.co
      if (trimmed.includes('supabase.co')) {
        return `${prefix}/${question.id}.png`;
      }

      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }

      return `${prefix}/${question.id}.png`;
    }
    ```

- [ ] **Step 5.2.2: Chạy test — xác nhận PASS**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-06|TC-07"`
  - Expected: TC-06 và TC-07 PASS.

---

### Task 5.3: Cấu Hình Next.js Reverse Proxy Rewrite

**Files:**
- Modify: [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (TC-08)

**Interfaces:**
- Consumes: Client request tới đường dẫn tương đối `/api/v1/:path*` trên domain `daotaothuyenvien.com`.
- Produces: Next.js HTTP reverse proxy rewrite chuyển tiếp nguyên vẹn method, headers, auth token sang Cloudflare Worker `https://api.daotaothuyenvien.com/api/v1/:path*`.

- [ ] **Step 5.3.1: Thêm rule rewrite vào next.config.mjs (GREEN)**
  - File: [`next.config.mjs`](file:///d:/Antigravity/TNDNB/next.config.mjs)
  - Thêm vào hàm `rewrites()`:
    ```javascript
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'https://api.daotaothuyenvien.com/api/v1/:path*',
        },
      ];
    },
    ```

- [ ] **Step 5.3.2: Chạy test — xác nhận PASS**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-08"`
  - Expected: TC-08 PASS.

---

### Task 5.4: Nâng Cấp Cloudflare Worker Multi-Auth & Config Route

**Files:**
- Modify: [`cloudflare-worker/wrangler.toml`](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml)
- Modify: [`cloudflare-worker/src/middleware/auth.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts)
- Modify: [`cloudflare-worker/src/routes/config.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (TC-09, TC-10)

**Interfaces:**
- Consumes: Header `Authorization: Bearer <firebaseIdToken>` hoặc `Bearer <adminSecret>`, key cấu hình từ URL param.
- Produces: Xác thực thành công cho Admin Portal, lưu trữ vào `CONFIG_KV`, trả về HTTP 200 `{ ok: true, data: null }` thay vì HTTP 404 cho key chưa khởi tạo.

- [ ] **Step 5.4.1: Cập nhật wrangler.toml, auth.ts và config.ts (GREEN)**
  - File [`cloudflare-worker/wrangler.toml`](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml):
    Đổi dòng 10:
    ```toml
    FIREBASE_PROJECT_ID = "thi-tnd"
    ```
  - File [`cloudflare-worker/src/middleware/auth.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/middleware/auth.ts):
    Nâng cấp hàm `verifyAdminAuthorization`:
    ```typescript
    export async function verifyAdminAuthorization(
      authHeader: string | null,
      adminSecret?: string,
      env?: WorkerEnv
    ): Promise<boolean> {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
      }
      const token = authHeader.slice('Bearer '.length).trim();
      if (!token) return false;

      // 1. Kiểm tra Admin API Secret
      if (adminSecret && token === adminSecret) {
        return true;
      }

      // 2. Kiểm tra Firebase ID Token từ project thi-tnd
      if (env) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const jsonStr = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
            const payload = JSON.parse(jsonStr);
            const now = Math.floor(Date.now() / 1000);

            const projectId = env.FIREBASE_PROJECT_ID || 'thi-tnd';
            const isIssuerValid = payload.iss === `https://securetoken.google.com/${projectId}`;
            const isAudienceValid = payload.aud === projectId;
            const isNotExpired = payload.exp && payload.exp > now;

            if (isIssuerValid && isAudienceValid && isNotExpired) {
              return true;
            }
          }
        } catch {
          // Bỏ qua lỗi parse
        }
      }

      return false;
    }
    ```
  - File [`cloudflare-worker/src/routes/config.ts`](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts):
    - Trong phương thức `GET`: khi `val === null`, trả về HTTP 200 `{ ok: true, data: null }` thay vì HTTP 404:
      ```typescript
      if (val === null) {
        return new Response(JSON.stringify(null), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
      ```
    - Trong phương thức `PUT`: gọi `await verifyAdminAuthorization(request.headers.get('Authorization'), env.ADMIN_API_SECRET, env)`.

- [ ] **Step 5.4.2: Chạy test — xác nhận PASS**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-09|TC-10"`
  - Expected: TC-09 và TC-10 PASS.

---

### Task 5.5: Chuẩn Hóa 100% Ảnh Câu Hỏi Sang CDN Cloudflare R2

**Files:**
- Modify: [`ontap-web/services/dataService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts)
- Modify: [`ontap-web/services/offlineService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) (TC-11)

**Interfaces:**
- Consumes: Mảng `License[]` và các câu hỏi tải từ D1 Worker snapshot, fallback Supabase, hoặc bộ nhớ đệm IndexedDB Dexie.
- Produces: Mọi câu hỏi có hình ảnh đều sở hữu thuộc tính `image = 'https://cdn.daotaothuyenvien.com/question-images/${q.id}.png'`, hoàn toàn loại bỏ URL `supabase.co/storage/`.

- [ ] **Step 5.5.1: Chuẩn hóa dữ liệu ảnh trong dataService và offlineService (GREEN)**
  - Trong [`ontap-web/services/dataService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts):
    Thêm hàm helper chuẩn hóa:
    ```typescript
    export const normalizeQuestionImage = (id: string, image?: string | null): string | null => {
      if (!image) return null;
      const trimmed = String(image).trim();
      if (!trimmed) return null;
      return `https://cdn.daotaothuyenvien.com/question-images/${id}.png`;
    };
    ```
    Áp dụng khi map câu hỏi từ D1 Snapshot và Supabase Fallback:
    ```typescript
    questions: (sub.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      image: normalizeQuestionImage(q.id, q.image),
      answers: q.answers || [],
      correctAnswerId: q.correctAnswerId || q.correct_answer_id
    }))
    ```
  - Trong [`ontap-web/services/offlineService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/offlineService.ts):
    Thêm hàm làm sạch giấy phép `sanitizeLicensesForStorage(licenses)` để bảo đảm mọi `q.image` đều được chuyển sang `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png` trước khi ghi vào IndexedDB hoặc khi lấy ra từ `getLicensesOffline()`.

- [ ] **Step 5.5.2: Chạy test — xác nhận PASS**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-11"`
  - Expected: TC-11 PASS.

---

### Task 5.6: Kiểm Thử Toàn Diện, Re-build & Nghiệm Thu

**Files:**
- Test Suite: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)
- Production Build & Invariant Check

- [ ] **Step 5.6.1: Chạy toàn bộ 11 test cases Vitest**
  - Run: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts`
  - Expected: 11 passed (100%).
- [ ] **Step 5.6.2: Kiểm tra kiểu TypeScript toàn bộ dự án**
  - Run: `npx tsc --noEmit`
  - Expected: 0 errors.
- [ ] **Step 5.6.3: Kiểm tra đóng gói Production**
  - Run: `npm run build`
  - Expected: Build thành công cả Next.js và nhúng tĩnh `ontap-web`.
- [ ] **Step 5.6.4: Kiểm tra bảo toàn bất biến Invariant 1**
  - Run: `git diff ontap-web/components/ExamQuizScreen.tsx`
  - Expected: 0 bytes thay đổi (`ontap-web/components/ExamQuizScreen.tsx` giữ nguyên 100%).

---

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Bấm nút "Lưu Thay Đổi" tại `/ontap/settings` hiển thị popup xanh "Thành công! Cấu hình đã được lưu". Không còn popup đỏ.
2. Không còn bất kỳ request 404 nào đối với `/api/v1/config/...` hoặc `/api/v1/alerts` trên Console.
3. Khi làm bài thi thử hoặc ôn tập, 100% ảnh câu hỏi tải trực tiếp từ `https://cdn.daotaothuyenvien.com/question-images/...`. Không còn bóng dáng link `supabase.co/storage/`.
4. Toàn bộ 11/11 bài test Vitest PASS 100%. `npm run build` thành công hoàn toàn.

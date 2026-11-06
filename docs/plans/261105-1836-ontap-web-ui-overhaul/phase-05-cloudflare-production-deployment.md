# Phase 05: Triển Khai Hạ Tầng Cloudflare Production (`D1 Database` + `R2 Object Storage` + `KV Config Store` + `Edge Worker API`) & Kiểm Thử Liên Thông E2E

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)  
**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)  
**Cổng thông tin chính thức:** https://www.daotaothuyenvien.com  
**App Ôn tập & Thi thử Trực tuyến:** https://www.daotaothuyenvien.com/ontap

---

## Global Constraints

1. **Tuân Thủ Nghiêm Ngặt 4 Quyết Định Kiến Trúc Đã Chốt (`User Rulings 2.1 – 2.4`):**
   - **Mục 2.1 — Ngân hàng 1.000+ câu hỏi & bài thi (`Cloudflare D1 + Fallback Supabase`):**
     - Đọc chính từ **Cloudflare D1 (`tndnb-d1-prod`)** qua Worker `tndnb-edge-api` (`/api/v1/questions/snapshot` & `/api/v1/licenses/:id`), kết hợp lưu Offline IndexedDB (`Dexie`).
     - **Giữ dự phòng Supabase:** Khi mất kết nối tới D1/Worker, tự động gọi dự phòng về `supabase.from('licenses')` trong [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) và [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts).
   - **Mục 2.2 — Kho 280+ ảnh biển báo / sa hình (`Cloudflare R2 + Fallback Ảnh Gốc Supabase/Firebase/Local`):**
     - Phân phối chính từ **Cloudflare R2 (`tndnb-assets`)** qua route `/question-images/*` của Worker với `Cache-Control: public, max-age=31536000, immutable` và **Zero Egress Fee ($0)**.
     - **Giữ dự phòng ảnh:** Nếu file ảnh trên R2 gặp sự cố, sự kiện `onError` tự động chuyển sang URL gốc trên Supabase/Firebase hoặc đường dẫn cục bộ `/ontap/question_images/*.png` (**tuyệt đối không chạm vào `ExamQuizScreen.tsx`**).
   - **Mục 2.3 — Cấu hình hệ thống động & Cờ bảo trì (`100% CLOUDFLARE KV — KHÔNG FALLBACK FIRESTORE`):**
     - Toàn bộ cấu hình động (`usage_config`, `github_config`, cờ bảo trì tại `https://www.daotaothuyenvien.com/ontap/settings`) đọc và ghi **100% trực tiếp trên Cloudflare KV (`TNDNB_CONFIG_KV`, binding `CONFIG_KV`)** qua endpoint `GET/PUT /api/v1/config/:key` (`< 5ms` tại Edge).
     - **Không dùng fallback về Firestore/Supabase cũ** để ngăn chặn tuyệt đối rủi ro đọc nhầm cấu hình cũ (split-brain).
   - **Mục 2.4 — Đăng nhập, Hồ sơ Học viên, Điểm danh, Quản lý Lớp học & Phòng thi Online (`Giữ nguyên 100% Firebase`):**
     - Giữ nguyên 100% trên **Firebase Authentication + Cloud Firestore + Realtime Database** để bảo toàn tài khoản học viên cũ, đồng bộ thời gian thực và tương thích App Android/Windows.
2. **Bắt buộc truyền cờ `--remote` cho mọi thao tác dữ liệu Production trên Wrangler v3:**
   - Mặc định `wrangler d1 execute`, `wrangler r2 object put` và `wrangler kv key put` trong `wrangler@^3.86.0` chỉ ghi vào thư mục giả lập `.wrangler/state` trên máy cục bộ nếu thiếu cờ `--remote`. Mọi lệnh seed D1, khởi tạo KV và upload ảnh R2 ở Phase 05 bắt buộc có `--remote`.
3. **Sử dụng đúng Domain Chính Thức `www.daotaothuyenvien.com` & URL Worker Thật:**
   - Cấu hình CORS `ALLOWED_ORIGINS` cho `https://daotaothuyenvien.com` và `https://www.daotaothuyenvien.com`.
   - Trước khi gắn Custom Domain tùy chọn (`api.daotaothuyenvien.com` / `cdn.daotaothuyenvien.com` ở Task 5.7), các biến môi trường `VITE_CLOUDFLARE_API_URL`, `NEXT_PUBLIC_CLOUDFLARE_API_URL` và `VITE_R2_PUBLIC_URL` trỏ trực tiếp vào URL thật đang hoạt động `https://tndnb-edge-api.<subdomain>.workers.dev`.
4. **Ràng buộc bất di bất dịch:**
   - Bảo toàn 100% [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`git diff = 0`).

---

## Files & Interfaces

### Danh sách Files tác động trong Phase 05
- Modify: [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml) *(điền `database_id` thật của `tndnb-d1-prod`, khai báo `[[kv_namespaces]]` với `binding = "CONFIG_KV"` cho `TNDNB_CONFIG_KV`, cập nhật `ALLOWED_ORIGINS` với `https://daotaothuyenvien.com,https://www.daotaothuyenvien.com,http://localhost:3001` và `FIREBASE_PROJECT_ID`)*
- Modify: [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts) *(bổ sung nhánh phục vụ trực tiếp `GET /question-images/*` từ binding `env.ASSETS_BUCKET` kèm ETag & `Cache-Control` 1 năm)*
- Modify: [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts) & [cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts) *(đảm bảo `GET/PUT /api/v1/config/:key` đọc/ghi trực tiếp `env.CONFIG_KV` đã chuẩn bị ở `Task 4.6`)*
- Modify: [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs) *(bổ sung cờ `--remote` và tải song song theo batch để đẩy 280+ ảnh lên Cloudflare R2 nhanh gấp 8 lần)*
- Generate / Update: `cloudflare-worker/migrations/0002_seed_data.sql` *(sinh tự động từ [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs))*
- Modify / Configure Env:
  - `.env.local` (Root Portal Next.js): `NEXT_PUBLIC_CLOUDFLARE_API_URL`
  - `ontap-web/.env.production` & `ontap-web/.env.local` (Vite App): `VITE_CLOUDFLARE_API_URL`, `VITE_R2_PUBLIC_URL`
- Create (Test): [scripts/cloudflare-prod-readiness.test.ts](file:///d:/Antigravity/TNDNB/scripts/cloudflare-prod-readiness.test.ts)

### Interfaces & Endpoint Contracts (`tndnb-edge-api`)
```ts
// 1. Health & Sync Version Check (D1)
// GET https://tndnb-edge-api.<subdomain>.workers.dev/api/v1/health
interface WorkerHealthResponse {
  ok: true;
  service: 'tndnb-edge-api';
  releaseMode: string;
}

// GET https://tndnb-edge-api.<subdomain>.workers.dev/api/v1/meta/version
interface D1MetaVersionResponse {
  id: 'questions_bank';
  version: number;
  contentHash: string;
  totalQuestions: number; // >= 1000
  updatedAt: number;
}

// 2. Full Offline-First Snapshot & Per-License Exam Bank (Mục 2.1 — Cloudflare D1)
// GET /api/v1/questions/snapshot
// GET /api/v1/licenses/:licenseId

// 3. R2 Question Image Delivery (Mục 2.2 — Cloudflare R2)
// GET /question-images/:fileName (served from env.ASSETS_BUCKET)

// 4. Dynamic System Config Single Source of Truth (Mục 2.3 — Cloudflare KV CONFIG_KV)
// GET /api/v1/config/usage_config
// PUT /api/v1/config/usage_config (Authorization: Bearer <Admin_Token_or_Secret>)
// GET /api/v1/config/github_config
// PUT /api/v1/config/github_config
```

---

## Review Focus (5 Tình Huống Biên & Rủi Ro Triển Khai Hạ Tầng)

1. **Quên cờ `--remote` khi chạy `migrate-images-to-r2.mjs` hoặc `wrangler d1 execute`:**
   - *Nguyên nhân:* Trong [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs#L25-L38), lệnh `npx wrangler r2 object put` chưa truyền `--remote`, dẫn tới ảnh chỉ lưu vào ổ cứng local `.wrangler` mà bucket `tndnb-assets` trên mây vẫn trống rỗng.
   - *Kiểm chứng:* Bài test [scripts/cloudflare-prod-readiness.test.ts](file:///d:/Antigravity/TNDNB/scripts/cloudflare-prod-readiness.test.ts) kiểm tra mã nguồn `scripts/migrate-images-to-r2.mjs` bắt buộc có `'--remote'`.
2. **Thiếu binding `CONFIG_KV` hoặc UUID placeholder trong `cloudflare-worker/wrangler.toml`:**
   - *Nguyên nhân:* Nếu thiếu khối `[[kv_namespaces]]` (`binding = "CONFIG_KV"`) hoặc `database_id` vẫn giữ `00000000-0000-0000-0000-000000000000`, Worker sẽ báo lỗi khi deploy hoặc khi gọi `/api/v1/config/usage_config`.
   - *Kiểm chứng:* Bài test kiểm tra `wrangler.toml` có đủ `database_name = "tndnb-d1-prod"`, `bucket_name = "tndnb-assets"`, và `binding = "CONFIG_KV"`.
3. **Seed URL ảnh vào D1 phải khớp 100% với địa chỉ Worker / R2 thật:**
   - *Giải pháp:* Khi chạy Task 5.3, truyền `VITE_R2_PUBLIC_URL` bằng chính URL Worker (`https://tndnb-edge-api.<subdomain>.workers.dev`) hoặc URL `https://pub-<hash>.r2.dev` để 100% ảnh câu hỏi tải lên tức thì ngay sau khi deploy (kèm lưới dự phòng `onError` theo Mục 2.2).
4. **Lỗi chặn CORS khi chạy trên domain chính thức `https://www.daotaothuyenvien.com` hoặc cổng `http://localhost:3001`:**
   - *Nguyên nhân:* `ALLOWED_ORIGINS` trong [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml#L9) hiện mới liệt kê `localhost:5173` và `localhost:3000`.
   - *Giải pháp:* Cập nhật `ALLOWED_ORIGINS` bao gồm đầy đủ `https://daotaothuyenvien.com,https://www.daotaothuyenvien.com,http://localhost:3001,http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,app://.`.
5. **Xác thực quyền Admin khi lưu `https://www.daotaothuyenvien.com/ontap/settings` lên `PUT /api/v1/config/usage_config` (KV):**
   - *Kiểm chứng:* Khai báo `FIREBASE_PROJECT_ID` trong `[vars]` của `cloudflare-worker/wrangler.toml` (và/hoặc secret `ADMIN_API_SECRET`) để middleware xác thực quyền Admin hợp lệ trước khi ghi vào `env.CONFIG_KV`.

---

## Implementation Steps (TDD & Cloud Provisioning Runbook)

### Task 5.1: Kích Hoạt Cloudflare R2 Trên Dashboard & Khởi Tạo Bucket `tndnb-assets`

#### Step 5.1.1: Thao tác kích hoạt một lần trên Cloudflare Dashboard (Yêu cầu xác nhận tài khoản của User)
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/) -> chọn mục **R2 Object Storage** ở thanh menu bên trái -> bấm **Activate R2 Plan** (Gói miễn phí 10 GB lưu trữ + 10 triệu lượt đọc Class B mỗi tháng, $0 phí băng thông).
2. Sau khi kích hoạt R2, xác thực phiên CLI trên máy tính và tạo bucket `tndnb-assets`:
```powershell
npx --prefix cloudflare-worker wrangler whoami
npx --prefix cloudflare-worker wrangler r2 bucket create tndnb-assets
npx --prefix cloudflare-worker wrangler r2 bucket list
```
3. *(Khuyến nghị tùy chọn trên Dashboard)*: Vào **R2 -> `tndnb-assets` -> Settings -> Public Access (`R2.dev subdomain`) -> Allow Access** để nhận thêm link `https://pub-<hash>.r2.dev` (ngoài đường dẫn `/question-images/*` tích hợp sẵn trên Worker).

---

### Task 5.2: Khởi Tạo Cloudflare KV (`TNDNB_CONFIG_KV`) & Cloudflare D1 (`tndnb-d1-prod`), Chuẩn Hóa `wrangler.toml` + Route Ảnh R2

#### Step 5.2.1: Viết bài kiểm thử chuẩn bị hạ tầng (`RED`) tại [scripts/cloudflare-prod-readiness.test.ts](file:///d:/Antigravity/TNDNB/scripts/cloudflare-prod-readiness.test.ts)
Tạo mới [scripts/cloudflare-prod-readiness.test.ts](file:///d:/Antigravity/TNDNB/scripts/cloudflare-prod-readiness.test.ts) kiểm tra cấu hình sẵn sàng Production của Worker (`D1` + `R2` + `CONFIG_KV` + `www.daotaothuyenvien.com`) và script upload R2:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(__dirname, '..');

describe('Phase 05: Cloudflare D1, R2, KV & Edge Worker Production Readiness', () => {
  it('wrangler.toml đã khai báo ALLOWED_ORIGINS cho localhost:3001 & www.daotaothuyenvien.com, cùng đủ 3 bindings D1 + R2 + CONFIG_KV', () => {
    const wranglerContent = fs.readFileSync(
      path.resolve(rootDir, 'cloudflare-worker/wrangler.toml'),
      'utf8'
    );
    expect(wranglerContent).toContain('database_name = "tndnb-d1-prod"');
    expect(wranglerContent).toContain('bucket_name = "tndnb-assets"');
    expect(wranglerContent).toContain('binding = "CONFIG_KV"');
    expect(wranglerContent).toContain('http://localhost:3001');
    expect(wranglerContent).toContain('https://www.daotaothuyenvien.com');
  });

  it('cloudflare-worker/src/routes/config.ts đọc/ghi trực tiếp trên env.CONFIG_KV (Mục 2.3)', () => {
    const configRoute = fs.readFileSync(
      path.resolve(rootDir, 'cloudflare-worker/src/routes/config.ts'),
      'utf8'
    );
    expect(configRoute).toContain('env.CONFIG_KV');
  });

  it('cloudflare-worker/src/index.ts hỗ trợ phục vụ trực tiếp ảnh câu hỏi /question-images/* từ R2 ASSETS_BUCKET với Cache-Control immutable', () => {
    const workerIndex = fs.readFileSync(
      path.resolve(rootDir, 'cloudflare-worker/src/index.ts'),
      'utf8'
    );
    expect(workerIndex).toContain("pathname.startsWith('/question-images/')");
    expect(workerIndex).toContain('env.ASSETS_BUCKET');
    expect(workerIndex).toContain('max-age=31536000, immutable');
  });

  it('scripts/migrate-images-to-r2.mjs truyền cờ --remote để đẩy ảnh thật lên Cloudflare R2 thay vì local state', () => {
    const r2Script = fs.readFileSync(
      path.resolve(rootDir, 'scripts/migrate-images-to-r2.mjs'),
      'utf8'
    );
    expect(r2Script).toContain("'--remote'");
  });
});
```

#### Step 5.2.2: Chạy test — xác nhận FAIL (`Verify RED`)
```powershell
npx vitest run scripts/cloudflare-prod-readiness.test.ts
```

#### Step 5.2.3: Khởi tạo KV Namespace `TNDNB_CONFIG_KV`, D1 Database `tndnb-d1-prod` & Cập nhật cấu hình (`GREEN`)
1. **Tạo KV Namespace `TNDNB_CONFIG_KV` trên Cloudflare Remote (Mục 2.3):**
```powershell
npx --prefix cloudflare-worker wrangler kv namespace create TNDNB_CONFIG_KV
```
   - Sao chép chuỗi `id = "<ID-KV-THẬT>"` từ kết quả trả về của terminal.
2. **Tạo D1 Database `tndnb-d1-prod` trên Cloudflare Remote (Mục 2.1):**
```powershell
npx --prefix cloudflare-worker wrangler d1 create tndnb-d1-prod
```
   - Sao chép chuỗi `database_id = "<UUID-D1-THẬT>"` từ kết quả trả về của terminal.
3. **Cập nhật [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml):**
   - Điền `<UUID-D1-THẬT>` và `<ID-KV-THẬT>`.
   - Cập nhật `ALLOWED_ORIGINS` bổ sung `https://daotaothuyenvien.com,https://www.daotaothuyenvien.com` và `http://localhost:3001`, đồng thời thêm `FIREBASE_PROJECT_ID`:
```toml
name = "tndnb-edge-api"
main = "src/index.ts"
compatibility_date = "2026-11-01"

[vars]
GITHUB_OWNER = "aitnd"
GITHUB_REPO = "TNDNB"
RELEASE_UPSTREAM_MODE = "github_proxy"
ALLOWED_ORIGINS = "https://daotaothuyenvien.com,https://www.daotaothuyenvien.com,http://localhost:3001,http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,app://."
FIREBASE_PROJECT_ID = "dao-tao-thuyen-vien"

[[d1_databases]]
binding = "DB"
database_name = "tndnb-d1-prod"
database_id = "<DÁN-UUID-THẬT-CỦA-D1-TẠI-ĐÂY>"
migrations_dir = "migrations"

[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "tndnb-assets"

[[kv_namespaces]]
binding = "CONFIG_KV"
id = "<DÁN-ID-THẬT-CỦA-TNDNB_CONFIG_KV-TẠI-ĐÂY>"
```
4. **Bổ sung nhánh phục vụ ảnh R2 trực tiếp tại [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts):**
   - Ngay trước khối `if (pathname.startsWith('/releases/'))`, thêm đoạn xử lý đọc trực tiếp từ `env.ASSETS_BUCKET`:
```ts
      if (pathname.startsWith('/question-images/') && request.method === 'GET') {
        const objectKey = pathname.replace(/^\/+/, '');
        const obj = await env.ASSETS_BUCKET.get(objectKey);
        if (!obj) {
          return new Response(JSON.stringify({ error: 'Image Not Found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
        const headers = new Headers(corsHeaders);
        obj.writeHttpMetadata(headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (obj.httpEtag) headers.set('ETag', obj.httpEtag);
        if (!headers.has('Content-Type')) headers.set('Content-Type', 'image/png');
        return new Response(obj.body, { status: 200, headers });
      }
```
5. **Bổ sung cờ `'--remote'` vào [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs):**
   - Thêm `'--remote'` vào mảng tham số của `execFileSync('npx', ['wrangler', 'r2', 'object', 'put', ..., '--remote'])`.

#### Step 5.2.4: Chạy test — xác nhận PASS (`Verify GREEN`)
```powershell
npx vitest run scripts/cloudflare-prod-readiness.test.ts
npm --prefix cloudflare-worker run test
```

---

### Task 5.3 & Task 5.4: Deploy Cloudflare Worker `tndnb-edge-api`, Thực Thi Migration Schema & Seed 1.000+ Câu Hỏi Lên D1 Remote + Seed Config Ban Đầu Lên KV

> [!TIP]
> Deploy Worker trước ở bước 5.3.1 để nhận ngay URL chính thức `https://tndnb-edge-api.<subdomain>.workers.dev`, sau đó dùng chính URL này làm `VITE_R2_PUBLIC_URL` khi sinh file `0002_seed_data.sql` ở bước 5.3.2 để toàn bộ link ảnh trong D1 khớp 100% với địa chỉ thật ngay lập tức!

#### Step 5.3.1 (Deploy Worker & Lấy URL Chính Thức — Task 5.4):
```powershell
npm --prefix cloudflare-worker run deploy
```
- Ghi nhận URL trả về từ Wrangler CLI: `https://tndnb-edge-api.<subdomain>.workers.dev`.
- Kiểm tra phản hồi Edge tức thì:
```powershell
Invoke-RestMethod -Uri "https://tndnb-edge-api.<subdomain>.workers.dev/api/v1/health"
```

#### Step 5.3.2 (Áp dụng Schema & Seed 1.000+ Câu Hỏi/Đáp Án Lên D1 Remote — Task 5.3):
1. **Chạy file khởi tạo bảng `0001_initial_schema.sql` lên D1 Remote:**
```powershell
npx --prefix cloudflare-worker wrangler d1 execute tndnb-d1-prod --remote --file=./cloudflare-worker/migrations/0001_initial_schema.sql
```
2. **Sinh file dữ liệu `0002_seed_data.sql` từ nguồn dữ liệu chuẩn bằng [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs) với `VITE_R2_PUBLIC_URL` trỏ về Worker thật (hoặc `pub-xxx.r2.dev`):**
```powershell
$env:VITE_R2_PUBLIC_URL="https://tndnb-edge-api.<subdomain>.workers.dev"; node scripts/migrate-to-d1.mjs
```
3. **Đẩy toàn bộ 1.000+ câu hỏi, môn học, hạng bằng và `sync_meta` lên Cloudflare D1 Remote:**
```powershell
npx --prefix cloudflare-worker wrangler d1 execute tndnb-d1-prod --remote --file=./cloudflare-worker/migrations/0002_seed_data.sql
```
4. **Xác nhận số lượng câu hỏi trên D1 Remote:**
```powershell
Invoke-RestMethod -Uri "https://tndnb-edge-api.<subdomain>.workers.dev/api/v1/meta/version"
```
- **Kết quả kỳ vọng:** Trả về JSON `{ id: "questions_bank", version: 1, totalQuestions: <1000+>, contentHash: "..." }`.

---

### Task 5.5: Đồng Bộ Toàn Bộ 280+ Ảnh Câu Hỏi Lên Cloudflare R2 (`tndnb-assets`)

#### Step 5.5.1: Chạy script upload ảnh lên R2 Remote
```powershell
node scripts/migrate-images-to-r2.mjs
```
#### Step 5.5.2: Kiểm tra truy xuất ảnh trực tiếp từ Edge CDN
```powershell
Invoke-WebRequest -Method Head -Uri "https://tndnb-edge-api.<subdomain>.workers.dev/question-images/nvmt_1.png"
```
- **Kết quả kỳ vọng:** `HTTP 200 OK`, header `Cache-Control: public, max-age=31536000, immutable`.

---

### Task 5.6: Cập Nhật Biến Môi Trường (`VITE_CLOUDFLARE_API_URL` & `NEXT_PUBLIC_CLOUDFLARE_API_URL`) & Kiểm Thử Liên Thông E2E Theo 4 Quyết Định Kiến Trúc

#### Step 5.6.1: Cấu hình biến môi trường Local & Production (`https://www.daotaothuyenvien.com`)
1. **Tại `.env.local` ở thư mục gốc (Root Portal Next.js) và trên Vercel/Server Environment Variables của `www.daotaothuyenvien.com`:**
```env
NEXT_PUBLIC_CLOUDFLARE_API_URL=https://tndnb-edge-api.<subdomain>.workers.dev
```
2. **Tại `ontap-web/.env.production` và `ontap-web/.env.local`:**
```env
VITE_CLOUDFLARE_API_URL=https://tndnb-edge-api.<subdomain>.workers.dev
VITE_R2_PUBLIC_URL=https://tndnb-edge-api.<subdomain>.workers.dev
```

#### Step 5.6.2: Build & Kiểm thử Liên thông E2E Đúng 4 Quy Tắc Kiến Trúc (2.1 – 2.4)
```powershell
npx vitest run scripts/cloudflare-prod-readiness.test.ts scripts/portal-tinymce-local.test.ts scripts/portal-post-performance.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts
npm --prefix ontap-web run test:run
npm --prefix cloudflare-worker run test
git diff ontap-web/components/ExamQuizScreen.tsx
npm run build
```
- **Checklist nghiệm thu E2E 4 Tầng Dữ Liệu:**
  - **Mục 2.1 (`D1 + Fallback Supabase`):** Mở `https://www.daotaothuyenvien.com/ontap` lần đầu (Xóa IndexedDB): App tải trọn bộ 1.000+ câu hỏi từ `/api/v1/questions/snapshot` trong `< 150ms` và lưu xuống IndexedDB (`< 5ms` cho lần mở thứ 2). Thử ngắt URL Worker tạm thời -> App và `/api/thi/[licenseId]` tự động fallback sang Supabase mượt mà, không lộ `correct_answer_id`.
  - **Mục 2.2 (`R2 + Fallback Ảnh`):** Vào câu hỏi có sa hình / biển báo: Ảnh tải từ `/question-images/*.png` đạt `HTTP 200` sắc nét; thử mô phỏng lỗi 1 ảnh R2 -> thẻ `<img>` tự động chuyển sang ảnh gốc/local qua `onError`. `ExamQuizScreen.tsx` bảo toàn nguyên vẹn (`git diff = 0`).
  - **Mục 2.3 (`Cloudflare KV Single Source — Không Fallback Firestore`):** Vào `https://www.daotaothuyenvien.com/ontap/settings` bằng tài khoản Admin -> bấm **Lưu cấu hình**: Dữ liệu ghi trực tiếp vào `CONFIG_KV` qua `PUT /api/v1/config/usage_config` (`< 5ms` đọc toàn cầu), hoàn toàn không gọi Firestore `settings/usage_config`, triệt tiêu 100% lỗi lệch cấu hình cũ.
  - **Mục 2.4 (`Firebase 100% Auth & Classes`):** Đăng nhập tài khoản học viên/giáo viên cũ, xem hồ sơ, điểm danh, quản lý lớp học & phòng thi trực tuyến hoạt động đồng bộ thời gian thực 100% với App Android/Windows.

---

### Task 5.7 (Tùy Chọn Mở Rộng): Chuẩn Hóa Thương Hiệu Với Custom Domain Miễn Phí (`api.daotaothuyenvien.com` / `cdn.daotaothuyenvien.com`)

> [!NOTE]
> Bước này hoàn toàn **tùy chọn** và **miễn phí 100%** nếu tên miền `daotaothuyenvien.com` đang quản lý DNS (Nameservers) trên Cloudflare. Hệ thống vẫn chạy Production hoàn hảo 100% trên `*.workers.dev` phục vụ cho `https://www.daotaothuyenvien.com` và `https://www.daotaothuyenvien.com/ontap` ngay từ Task 5.6 mà không bắt buộc phải làm Task 5.7.

1. **Gắn `api.daotaothuyenvien.com` vào Worker `tndnb-edge-api`:**
   - Vào **Cloudflare Dashboard -> Workers & Pages -> `tndnb-edge-api` -> Settings -> Domains & Routes -> Add -> Custom Domain** -> nhập `api.daotaothuyenvien.com` (Cloudflare tự động tạo bản ghi DNS và cấp chứng chỉ SSL Edge).
2. **Gắn `cdn.daotaothuyenvien.com` vào R2 Bucket `tndnb-assets` (nếu muốn tách domain ảnh riêng):**
   - Vào **R2 -> `tndnb-assets` -> Settings -> Custom Domains -> Connect Domain** -> nhập `cdn.daotaothuyenvien.com`.
3. **Đổi biến môi trường sang tên miền thương hiệu:**
   - Cập nhật `VITE_CLOUDFLARE_API_URL=https://api.daotaothuyenvien.com`, `NEXT_PUBLIC_CLOUDFLARE_API_URL=https://api.daotaothuyenvien.com`, `VITE_R2_PUBLIC_URL=https://cdn.daotaothuyenvien.com` và chạy lại `npm run build`.

# Phase 04: Đồng Bộ 15 Màn Hình Quản Lý / Tiện Ích, Self-Hosted TinyMCE, Chuẩn Hóa Kiến Trúc Hybrid (`D1+Supabase Fallback`, `R2+Image Fallback`, `Cloudflare KV Zero-Fallback`) & Nghiệm Thu Toàn Dự Án

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)  
**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)  
**Cổng thông tin chính thức:** https://www.daotaothuyenvien.com  
**App Ôn tập & Thi thử Trực tuyến:** https://www.daotaothuyenvien.com/ontap  
**Trạng thái Phase 04:** Tasks 4.1–4.5 `[x]` Completed | Task 4.6 `[ ]` Ready for Execution

---

## Global Constraints

1. **Đồng bộ 100% Semantic Tokens (`bg-card`, `text-foreground`, `border-border`) trên 15 Màn Hình Quản Lý & Tiện Ích (`[x]` Đã hoàn thành):**
   - Thay thế các class nền/chữ cứng (`bg-white`, `bg-gray-50`, `text-gray-800`, `border-gray-200`, `bg-teal-900` thiếu biến thể Sáng/Tối) bằng hệ thống token ngữ nghĩa của [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css).
2. **Chuẩn hóa Bảng Dữ Liệu & Thống Kê (`tabular-nums` + `overflow-x-auto`) (`[x]` Đã hoàn thành):**
   - Toàn bộ bảng lịch sử làm bài (`HistoryScreen.tsx`), danh sách lớp (`ClassManagementScreen.tsx`), tài khoản (`UserManagerScreen.tsx`), kỳ thi (`OnlineExamManagementScreen.tsx`), phiên đăng nhập (`LoginHistoryScreen.tsx`) và thống kê (`AnalyticsPage.tsx`) bật `tabular-nums` và bọc trong `overflow-x-auto`.
3. **Tuân Thủ Tuyệt Đối 4 Quyết Định Kiến Trúc Đã Chốt (User Rulings 2.1 – 2.4):**
   - **Mục 2.1 — Ngân hàng 1.000+ câu hỏi & bài thi (`Cloudflare D1 + Fallback Supabase`):** Đọc chính từ Cloudflare D1 (`tndnb-d1-prod`) + lưu Offline IndexedDB (`Dexie`). Khi mất kết nối D1 / Worker, tự động fallback về `supabase.from('licenses')` trong [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) và [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts).
   - **Mục 2.2 — Kho 280+ ảnh biển báo / sa hình (`Cloudflare R2 + Fallback Ảnh Gốc Supabase/Firebase/Local`):** Tải chính từ Cloudflare R2 (`tndnb-assets`) qua `/question-images/*`; bổ sung `resolveQuestionImageFallbackUrl(question)` trong [ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) và sự kiện `onError` tự động chuyển sang ảnh dự phòng trên thẻ `<img>` tại `QuizScreen.tsx`, `ResultsScreen.tsx`, `ExamResultsScreen.tsx`. Xóa bỏ hoàn toàn mọi chuỗi URL giả định cũ trong `imageHelper.ts` và `scripts/migrate-to-d1.mjs`.
   - **Mục 2.3 — Cấu hình hệ thống động & Cờ bảo trì (`CHUYỂN HẲN SANG CLOUDFLARE KV — KHÔNG FALLBACK FIRESTORE`):** Chuyển 100% cấu hình động (`usage_config`, `github_config`, cờ bảo trì tại `/ontap/settings`) sang **Cloudflare KV (`TNDNB_CONFIG_KV`, binding `CONFIG_KV`)**. **Tuyệt đối không dùng fallback đọc/ghi về Firestore/Supabase cũ** để ngăn chặn triệt để rủi ro split-brain đọc nhầm cấu hình cũ; chỉ giữ `DEFAULT_CONFIG` an toàn trong RAM khi chưa có mạng, và thông báo lỗi rõ ràng nếu bấm Lưu khi chưa kết nối được Cloudflare KV API.
   - **Mục 2.4 — Đăng nhập, Hồ sơ, Điểm danh, Lớp học & Phòng thi Online (`Giữ nguyên 100% Firebase`):** Giữ nguyên 100% trên Firebase Auth + Cloud Firestore + Realtime Database (kèm cơ chế bảo vệ `BadgeListener.tsx` chống lặp `permission-denied`).
4. **Bảo toàn 100% [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx):**
   - Tuyệt đối không thực hiện bất kỳ chỉnh sửa nào trên `ExamQuizScreen.tsx` (`git diff = 0`).

---

## Files & Interfaces

### Danh sách Files tác động trong Phase 04
- **`[x]` Tasks 4.1 – 4.3 (15 Màn hình Quản lý, Học viên & Tiện ích):**
  - Modify (Test): [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
  - Modify (Student Screens): [ontap-web/components/HistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/HistoryScreen.tsx), [ontap-web/components/MyClassScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MyClassScreen.tsx), [ontap-web/components/AccountScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AccountScreen.tsx), [ontap-web/components/LoginHistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginHistoryScreen.tsx)
  - Modify (Admin/Teacher Screens): [ontap-web/components/ClassManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ClassManagementScreen.tsx), [ontap-web/components/UserManagerScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UserManagerScreen.tsx), [ontap-web/components/OnlineExamManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/OnlineExamManagementScreen.tsx), [ontap-web/components/NotificationMgmtScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NotificationMgmtScreen.tsx), [ontap-web/components/UsageConfigPanel.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UsageConfigPanel.tsx), [ontap-web/components/AnalyticsPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AnalyticsPage.tsx)
  - Modify (Utility Screens): [ontap-web/components/MailboxScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MailboxScreen.tsx), [ontap-web/components/DownloadAppPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/DownloadAppPage.tsx), [ontap-web/components/ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx), [ontap-web/components/ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx), [ontap-web/components/EntertainmentScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/EntertainmentScreen.tsx)
- **`[x]` Task 4.4 (Fallback Supabase cho Ngân hàng Câu hỏi Mục 2.1 & Chống Spam Quyền `BadgeListener` Mục 2.4):**
  - Modify: [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) & [ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts)
  - Modify: [ontap-web/services/badgeService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/badgeService.ts) & [ontap-web/components/Badges/BadgeListener.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeListener.tsx)
- **`[x]` Task 4.5 (TinyMCE Self-hosted Local trên Root Portal):**
  - Create / Copy Assets: [public/tinymce/tinymce.min.js](file:///d:/Antigravity/TNDNB/public/tinymce/tinymce.min.js)
  - Modify: [app/quan-ly/dang-bai/tao-moi/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx) & [app/quan-ly/dang-bai/sua/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx)
  - Create (Test): [scripts/portal-tinymce-local.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-tinymce-local.test.ts)
- **`[ ]` Task 4.6 (Chuẩn Hóa Kiến Trúc Hybrid Mới: Mục 2.2 R2 Image Fallback + Mục 2.3 Cloudflare KV Config Không Fallback Firestore):**
  - Modify: [cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts)
  - Modify: [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts)
  - Modify: [ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts)
  - Modify: [ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts)
  - Modify (Test): [ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts)
  - Modify: [ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) & [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs)
  - Create (Test): [ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts)
  - Modify: [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx), [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx), [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx) *(KHÔNG chạm vào `ExamQuizScreen.tsx`)*

### Interfaces & Contracts (`Task 4.4` & `Task 4.6`)
```ts
// cloudflare-worker/src/types.ts
export interface WorkerEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  CONFIG_KV: KVNamespace;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  RELEASE_UPSTREAM_MODE: 'github_proxy' | 'r2_direct';
  ALLOWED_ORIGINS: string;
  FIREBASE_PROJECT_ID?: string;
  ADMIN_API_SECRET?: string;
  GITHUB_TOKEN?: string;
}

// ontap-web/utils/imageHelper.ts
export const getR2PublicBaseUrl = (overrideBase?: string): string;
export function resolveQuestionImageUrl(
  question: { id: string; image?: string | null },
  r2BaseUrl?: string
): string | null;
export function resolveQuestionImageFallbackUrl(
  question: { id: string; image?: string | null }
): string | null;

// ontap-web/services/d1Client.ts
export const isCloudflareApiConfigured = (): boolean;
export async function fetchQuestionsSnapshot(): Promise<D1QuestionsSnapshot>;
export async function fetchD1Config<T = unknown>(key: string): Promise<T | null>;
export async function saveD1Config<T = unknown>(key: string, data: T, authToken?: string): Promise<boolean>;

// ontap-web/services/adminConfigService.ts (Cloudflare KV Single Source of Truth — Zero Firestore Fallback)
export const getUsageConfig = async (): Promise<UsageConfig>;
export const saveUsageConfig = async (config: UsageConfig): Promise<void>;
export const getGitHubConfig = async (): Promise<GitHubConfig>;
export const saveGitHubConfig = async (config: GitHubConfig): Promise<void>;
```

---

## Review Focus (5 Tình Huống Biên & Failure Modes Trọng Tâm)

1. **Nguy cơ Split-Brain Cấu Hình nếu dùng song song Firestore và Cloudflare (`Mục 2.3`):**
   - *Nguyên nhân:* Nếu `adminConfigService.ts` fallback về đọc `settings/usage_config` trên Firestore khi mạng chập chờn, ứng dụng sẽ nạp nhầm cờ bảo trì / hạn mức lượt thi cũ đã lỗi thời trên Firestore, gây xung đột trạng thái giữa quản trị viên và học viên.
   - *Giải pháp đã chốt:* Chuyển 100% cấu hình động sang **Cloudflare KV (`CONFIG_KV`)** tại `/api/v1/config/:key` (`< 5ms` tại Edge). Gỡ bỏ hoàn toàn `getDoc`/`setDoc` Firestore khỏi `getUsageConfig`, `saveUsageConfig`, `getGitHubConfig`, `saveGitHubConfig`; khi chưa có mạng thì dùng `DEFAULT_CONFIG` an toàn trong RAM, và khi bấm Lưu mà KV API không phản hồi thì báo lỗi rõ ràng để Admin biết ngay.
2. **Dự phòng Ảnh Biển Báo / Sa Hình khi R2 chưa đồng bộ đủ hoặc đứt kết nối CDN (`Mục 2.2`):**
   - *Nguyên nhân:* Nếu R2 thiếu 1 file ảnh hoặc URL R2 tạm thời lỗi mạng mà thẻ `<img>` không có `onError`, câu hỏi sa hình sẽ bị gãy ảnh (broken image icon).
   - *Giải pháp đã chốt:* Bổ sung `resolveQuestionImageFallbackUrl(question)` trả về URL gốc trên Supabase/Firebase (nếu `question.image` là `https://...` khác R2) hoặc đường dẫn tĩnh `/ontap/question_images/${question.id}.png`, gắn `onError` có cờ `data-fallback-applied` chống lặp vô hạn tại `QuizScreen.tsx`, `ResultsScreen.tsx`, `ExamResultsScreen.tsx` (**không đụng vào `ExamQuizScreen.tsx`**).
3. **Người dùng mở `/ontap` lần đầu (IndexedDB trống) khi D1 Worker chưa bật (`Mục 2.1`):**
   - *Kiểm chứng:* `fetchLicenses()` trong `dataService.ts` tự động gọi `fetchLicensesFromSupabaseFallback()` truy vấn `supabase.from('licenses')` bằng dynamic import, sắp xếp câu hỏi `naturalSortQuestions` và lưu vào IndexedDB (`saveLicensesOffline`).
4. **Lỗi `FirebaseError: Missing or insufficient permissions` lặp lại mỗi 30 giây từ `BadgeListener.tsx` (`Mục 2.4`):**
   - *Kiểm chứng:* Kiểm tra `auth?.currentUser` hợp lệ và dừng `clearInterval` ngay khi gặp `permission-denied`.
5. **Xóa sạch 100% tên miền giả định trong mã nguồn helper & script migration:**
   - *Kiểm chứng:* Không còn bất kỳ chuỗi URL mặc định giả định nào trong `ontap-web/utils/imageHelper.ts`, `ontap-web/services/d1Client.ts` và `scripts/migrate-to-d1.mjs`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### `[x]` Tasks 4.1, 4.2 & 4.3: Đồng Bộ 15 Màn Hình Quản Lý, Học Viên & Tiện Ích Chuẩn Dual-Theme *(Đã hoàn thành)*

- Đã viết unit test trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) và đồng bộ đầy đủ 15 màn hình học viên, quản trị và tiện ích sang semantic tokens (`bg-card`, `text-card-foreground`, `border-border`) kèm `tabular-nums` + `overflow-x-auto`.

---

### `[x]` Task 4.4: Bổ Sung Fallback Supabase Cho `dataService.ts` (`Mục 2.1`) & Khắc Phục Lỗi Quyền `BadgeListener` (`Mục 2.4`) *(Đã hoàn thành — Phần cấu hình `adminConfigService` được nâng cấp lên KV-only tại `Task 4.6`)*

- Đã triển khai `fetchLicensesFromSupabaseFallback()` trong [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) kèm unit test trong [ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts).
- Đã khóa kiểm tra phiên `auth?.currentUser` và ngắt polling 30s khi gặp `permission-denied` tại [ontap-web/services/badgeService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/badgeService.ts) & [ontap-web/components/Badges/BadgeListener.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeListener.tsx).

---

### `[x]` Task 4.5: Chuyển TinyMCE Sang Self-Hosted Local (`public/tinymce/`) Trên Root Portal *(Đã hoàn thành)*

- Đã sao chép trọn bộ asset TinyMCE vào [public/tinymce/](file:///d:/Antigravity/TNDNB/public/tinymce/), cập nhật `tinymceScriptSrc="/tinymce/tinymce.min.js"` tại [app/quan-ly/dang-bai/tao-moi/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx) và [app/quan-ly/dang-bai/sua/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx), xác nhận `PASS` qua [scripts/portal-tinymce-local.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-tinymce-local.test.ts).

---

### `[ ]` Task 4.6: Chuẩn Hóa Kiến Trúc Hybrid Theo Chốt Mới (`2.2 R2 Image Fallback` + `2.3 Cloudflare KV Config Không Fallback Firestore`)

#### Step 4.6.1: Viết test thất bại (`RED`) cho KV-Only Config & R2 Image Fallback
1. **Cập nhật [ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts):**
   Kiểm chứng nguyên tắc **Cloudflare KV Single Source of Truth — Zero Firestore Fallback**:
   - Khi `fetchD1Config('usage_config')` trả về dữ liệu từ KV API, `getUsageConfig()` trả về đúng cấu hình từ KV và **không bao giờ gọi `firestore.getDoc`**.
   - Khi `fetchD1Config('usage_config')` trả về `null` (chưa kết nối mạng / Worker chưa bật), `getUsageConfig()` trả về `DEFAULT_CONFIG` an toàn trong RAM và **tuyệt đối không fallback sang `firestore.getDoc`**.
   - Khi bấm Lưu cấu hình (`saveUsageConfig`) mà `saveD1Config` trả về `false` (chưa kết nối được KV API), hàm phải **ném `Error` thông báo rõ ràng** và **tuyệt đối không ghi fallback vào `firestore.setDoc`**.
   ```ts
   // @vitest-environment jsdom
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import * as firestore from 'firebase/firestore';
   import * as d1Client from '../d1Client';
   import { getUsageConfig, saveUsageConfig } from '../adminConfigService';

   vi.mock('firebase/firestore', async () => {
     const actual = await vi.importActual<typeof import('firebase/firestore')>('firebase/firestore');
     return {
       ...actual,
       doc: vi.fn(),
       getDoc: vi.fn(),
       setDoc: vi.fn()
     };
   });

   describe('adminConfigService Cloudflare KV Single Source of Truth (Zero Firestore Fallback)', () => {
     beforeEach(() => {
       vi.restoreAllMocks();
       localStorage.clear();
     });

     it('getUsageConfig chỉ đọc từ Cloudflare KV API và KHÔNG fallback về Firestore getDoc khi mất kết nối', async () => {
       vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);
       const getDocSpy = vi.mocked(firestore.getDoc);

       const cfg = await getUsageConfig();
       expect(cfg.guest.limit).toBeGreaterThan(0);
       expect(getDocSpy).not.toHaveBeenCalled();
     });

     it('saveUsageConfig ném lỗi rõ ràng khi không kết nối được Cloudflare KV API và KHÔNG ghi vào Firestore setDoc', async () => {
       vi.spyOn(d1Client, 'saveD1Config').mockResolvedValue(false);
       const setDocSpy = vi.mocked(firestore.setDoc);

       const currentCfg = await getUsageConfig();
       await expect(
         saveUsageConfig({ ...currentCfg, maintenanceMessage: 'Bảo trì từ Cloudflare KV' })
       ).rejects.toThrow(/Cloudflare KV/i);
       expect(setDocSpy).not.toHaveBeenCalled();
     });
   });
   ```

2. **Tạo mới [ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts):**
   Kiểm tra:
   - `imageHelper.ts` hoàn toàn sạch bóng tên miền giả định cũ.
   - `resolveQuestionImageUrl` ưu tiên URL Cloudflare R2 (`/question-images/${question.id}.png`) khi có `r2BaseUrl` / `VITE_R2_PUBLIC_URL`, hoặc dùng URL gốc nếu chưa cấu hình R2.
   - `resolveQuestionImageFallbackUrl(question)` trả về đúng URL gốc `https://...` trên Supabase/Firebase (nếu `question.image` chứa link gốc) hoặc đường dẫn tĩnh `/ontap/question_images/${question.id}.png`.

3. **Cập nhật unit test Worker cho `CONFIG_KV`:**
   Bổ sung kiểm tra `handleConfigRoutes` trong `cloudflare-worker` đọc/ghi trực tiếp qua `env.CONFIG_KV.get(key)` và `env.CONFIG_KV.put(key, JSON.stringify(bodyObj))`.

#### Step 4.6.2: Chạy test — xác nhận FAIL (`Verify RED`)
```powershell
npm --prefix ontap-web run test:run -- services/__tests__/adminConfigD1.test.ts utils/__tests__/imageHelper.test.ts
npm --prefix cloudflare-worker run test
```

#### Step 4.6.3: Implement tối thiểu (`GREEN`)
1. **Chuyển Route Config trên Cloudflare Worker sang `CONFIG_KV` ([cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts) & [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts)):**
   - Khai báo `CONFIG_KV: KVNamespace;` trong `WorkerEnv` tại [cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts).
   - Cập nhật [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts) để:
     - `GET /api/v1/config/:key`: đọc trực tiếp `const raw = await env.CONFIG_KV.get(key);` (trả `404` nếu `raw === null`, trả `200` JSON kèm `Cache-Control: no-cache` hoặc `max-age=5` để cấu hình động phản hồi tức thì `< 5ms` không bị giữ cache cũ).
     - `PUT /api/v1/config/:key`: xác thực quyền Admin (`verifyAdminAuthorization`), sau đó ghi trực tiếp `await env.CONFIG_KV.put(key, JSON.stringify(bodyObj));` và trả về `{ ok: true, key, storage: 'kv', updatedAt: Date.now() }`.
2. **Chuẩn hóa [ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts) & [ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts) (KV-Only, Zero Firestore Fallback):**
   - Trong [ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts): xóa bỏ hoàn toàn giá trị mặc định giả định cũ trong `getCloudflareApiBase()`; chỉ nhận `VITE_CLOUDFLARE_API_URL` hợp lệ. Nếu `isCloudflareApiConfigured() === false`, `fetchD1Config` trả về `null` và `saveD1Config` trả về `false` ngay lập tức.
   - Trong [ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts):
     - Gỡ bỏ hoàn toàn các lệnh đọc/ghi Firestore (`getDoc`, `setDoc` vào `settings/usage_config` và `settings/github_config`) và gỡ bỏ đọc fallback `localStorage` cũ gây lệch cấu hình.
     - `getUsageConfig()` & `getGitHubConfig()`: gọi trực tiếp `fetchD1Config(...)` tới Cloudflare KV API (`/api/v1/config/*`); nếu API trả dữ liệu thì merge với `DEFAULT_CONFIG`, nếu chưa kết nối mạng thì trả về bản sao `DEFAULT_CONFIG` an toàn trong RAM.
     - `saveUsageConfig(config)` & `saveGitHubConfig(config)`: lấy Firebase ID Token (`auth?.currentUser?.getIdToken()`) và gọi `saveD1Config(...)` lên Cloudflare KV API; nếu trả về `false` thì throw `new Error('Không thể lưu cấu hình lên Cloudflare KV API. Vui lòng kiểm tra kết nối hoặc cấu hình VITE_CLOUDFLARE_API_URL.')`.
3. **Bổ sung Dự phòng Ảnh R2 (`resolveQuestionImageFallbackUrl` + `onError`) & Xóa sạch domain giả ([ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) & [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs)):**
   - Trong [ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) và [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs): xóa bỏ hoàn toàn chuỗi mặc định giả định cũ; đọc từ `VITE_R2_PUBLIC_URL` hoặc `VITE_CLOUDFLARE_API_URL` (vì Worker phục vụ trực tiếp `/question-images/*`).
   - Bổ sung hàm `resolveQuestionImageFallbackUrl(question)`:
     - Nếu `question.image` là URL `https://...` gốc trên Supabase/Firebase Storage (khác domain R2/Worker) -> trả về chính URL gốc đó.
     - Ngược lại -> trả về đường dẫn tĩnh cục bộ `/ontap/question_images/${question.id}.png`.
   - Gắn xử lý `onError` tự động chuyển sang ảnh dự phòng trên thẻ `<img>` câu hỏi tại 3 màn hình:
     - [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx)
     - [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx)
     - [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx)
     *(TUYỆT ĐỐI KHÔNG CHẠM VÀO [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) — `git diff = 0`)*.

#### Step 4.6.4: Chạy test — xác nhận PASS (`Verify GREEN`), Kiểm định UI Craft & Build Toàn Dự Án
```powershell
npm --prefix ontap-web run test:run -- services/__tests__/adminConfigD1.test.ts services/__tests__/dataService.test.ts utils/__tests__/imageHelper.test.ts
npm --prefix cloudflare-worker run test
npx vitest run scripts/portal-tinymce-local.test.ts scripts/portal-post-performance.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-navbar-cleanup.test.ts
git diff ontap-web/components/ExamQuizScreen.tsx
npx tsc --noEmit
npm run build
```
- **Tiêu chí nghiệm thu cuối cùng của Phase 04:**
  - 100% unit test ở Root Portal, `ontap-web` và `cloudflare-worker` đạt `PASS`.
  - `adminConfigService.ts` tuân thủ tuyệt đối Mục 2.3 (100% Cloudflare KV `CONFIG_KV`, không fallback Firestore).
  - `dataService.ts` tuân thủ Mục 2.1 (Cloudflare D1 + Fallback Supabase) và `imageHelper.ts` tuân thủ Mục 2.2 (Cloudflare R2 + Fallback ảnh gốc/local).
  - `git diff ontap-web/components/ExamQuizScreen.tsx` bằng `0` (trống hoàn toàn).
  - `npx tsc --noEmit` và `npm run build` hoàn tất với `exit code 0`.

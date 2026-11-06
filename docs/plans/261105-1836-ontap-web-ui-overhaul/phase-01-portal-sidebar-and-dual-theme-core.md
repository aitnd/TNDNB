# Phase 01: Xử Lý Triệt Để Lỗi Font Tiếng Việt "Chữ To Chữ Bé" Trên Toàn Root Portal, Gắn Liên Kết `/ontap` Vào Sidebar, Thiết Lập Dual-Theme Core (`light` / `dark`) & Tối Ưu Tốc Độ Mở Bài Viết (`< 50ms` ISR + Fallback API Trộn Đề)

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)
**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)

---

## Global Constraints

1. **Khóa chặt Typography Tiếng Việt 100% đồng nhất chiều cao `x-height` (Zero Vietnamese Font Fallback):**
   - Trong [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx), xóa bỏ hoàn toàn `Rubik` (vốn thiếu bộ ký tự `'vietnamese'`). Bắt buộc sử dụng `next/font/google` để self-host 3 phông chữ chuẩn Tiếng Việt (`subsets: ['latin', 'vietnamese']`, `display: 'swap'`):
     - `Be_Vietnam_Pro` (`weight: ['300', '400', '500', '600', '700']`, `variable: '--font-sans'`)
     - `Merriweather` (`weight: ['400', '700', '900']`, `variable: '--font-display'`)
     - `JetBrains_Mono` (`weight: ['400', '600', '700']`, `variable: '--font-mono'`)
   - Cấm tuyệt đối việc dùng `var(--font-mono)` cho các từ/nhãn Tiếng Việt có dấu (`CHUYÊN MỤC:`, `ĐÀO TẠO`, `SÁT HẠCH`, `Quản trị viên`, tiêu đề cột bảng `th`). Chỉ dùng `var(--font-mono)` cho con số thuần túy (`01..04`, cột số tiền VNĐ).
   - Mọi tiêu đề `h1..h6` bắt buộc đặt `font-style: normal` (Impeccable v4.8.0 Gate 38a).
2. **Bảo toàn 100% tính độc lập của Header/Footer Root Portal:**
   - Liên kết `/ontap` chỉ được gắn vào khung widget **"Tra cứu & Tiện ích"** trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx#L137-L151). Tuyệt đối không thêm `/ontap` vào `Navbar.tsx`, `MobileBottomNav.tsx` hay `Footer.tsx` để bảo toàn 100% bài kiểm thử [scripts/portal-navbar-cleanup.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-navbar-cleanup.test.ts).
3. **Khóa chặt hệ thống Dual-Theme (`light` / `dark`) cho `ontap-web`:**
   - Trong [ontap-web/types.ts](file:///d:/Antigravity/TNDNB/ontap-web/types.ts), kiểu `Theme` chỉ nhận `'light' | 'dark'`.
   - Xóa hoàn toàn 6 theme thừa (`modern`, `classic`, `sunrise`, `tri-an`, `noel`, `premium`) và xóa [ontap-web/components/SnowEffect.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/SnowEffect.tsx).
4. **Hiệu năng điều hướng bài viết tức thì & Chống sập API Trộn đề (`Task 1.5`):**
   - Chuyển trang chi tiết bài viết [app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx) sang ISR (`export const revalidate = 60`), gom song song truy vấn bằng `Promise.all`, giới hạn timeout `1500ms` kèm cache bộ nhớ cho truy vấn tác giả từ Firestore Admin gRPC, và cung cấp [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx).
   - Trong [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts), tự động fallback sang `supabase.from('licenses')` nếu Cloudflare Worker (`tndnb-edge-api`) chưa cấu hình hoặc lỗi DNS/mạng.
5. **Ràng buộc bất di bất dịch:**
   - Tuyệt đối không chỉnh sửa [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`git diff` phải bằng `0`).

---

## Files & Interfaces

### Danh sách Files tác động trong Phase 01
- **Đã hoàn thành (`[x]` Tasks 1.0 – 1.4):**
  - Modify: [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx), [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css) và 11 file `.module.css` trên Root Portal
  - Modify: [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx)
  - Modify: [ontap-web/types.ts](file:///d:/Antigravity/TNDNB/ontap-web/types.ts), [ontap-web/contexts/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx), [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css), [ontap-web/index.html](file:///d:/Antigravity/TNDNB/ontap-web/index.html), [ontap-web/App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx), [ontap-web/components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx), [ontap-web/components/icons.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/icons.tsx), [ontap-web/components/Footer.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx)
  - Delete: `ontap-web/components/SnowEffect.tsx`
  - Create: [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
- **Cần triển khai (`[ ]` Task 1.5):**
  - Create: [scripts/portal-post-performance.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts)
  - Modify: [app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx)
  - Modify: [app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css) (bổ sung class `.skeletonPulse`, `.skeletonTitle`, `.skeletonMeta`, `.skeletonHero`, `.skeletonLine`)
  - Create: [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx)
  - Modify: [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts)

### Interfaces & Contracts (`Task 1.5`)
```ts
// app/bai-viet/[postId]/page.tsx
export const revalidate = 60;

interface CachedAuthorEntry {
  name: string;
  expiresAt: number;
}

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  thumbnail_url: string | null;
  category_id: string;
  is_featured: boolean;
  author_id: string;
  attachments: Attachment[] | null;
}

export interface PostBundle {
  post: Post;
  authorName: string | null;
  relatedPosts: Post[];
}

// app/api/thi/[licenseId]/route.ts
export interface ExamLicensePayload {
  id?: string;
  name?: string;
  subjects?: Array<{
    id: string;
    name: string;
    questions?: Array<{
      id: string;
      text: string;
      image?: string | null;
      correctAnswerId?: string;
      correct_answer_id?: string;
      answers: Array<{ id: string; text: string }>;
    }>;
  }>;
}
```

---

## Review Focus (5 Tình Huống Biên & Failure Modes Trọng Tâm)

1. **Lỗi chờ 8–10 giây khi người dùng bấm xem bài viết trên Trang chủ Portal:**
   - *Nguyên nhân:* `export const revalidate = 0` tắt sạch cache CDN/ISR, kết hợp chuỗi waterfall 3 tầng (`supabase posts` -> `adminDb.collection('users')` gRPC cold-start 5–6s -> `supabase relatedPosts`) và thiếu `loading.tsx`.
   - *Kiểm chứng:* Bài test [scripts/portal-post-performance.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts) xác nhận `revalidate = 60`, `Promise.all`, `authorCache` + timeout `1500ms`, và sự tồn tại của `app/bai-viet/[postId]/loading.tsx`.
2. **Lỗi gRPC `adminDb` bị treo vô hạn hoặc thiếu biến môi trường `FIREBASE_SERVICE_ACCOUNT_KEY`:**
   - *Nguyên nhân:* Trong `utils/firebaseAdmin.ts`, `adminDb` có thể là `undefined` ở môi trường local/preview hoặc gRPC handshake bị treo quá 5 giây.
   - *Kiểm chứng:* Bọc `adminDb?.collection('users').doc(authorId).get()` trong `Promise.race` với timeout `1500ms`, trả về `'Ban Biên Tập'` an toàn mà không ném lỗi SSR.
3. **Lỗi sập HTTP 500 tại `/api/thi/[licenseId]` khi Cloudflare Worker chưa cấu hình URL:**
   - *Nguyên nhân:* [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts) gọi thẳng `fetch` tới URL giả định chưa tồn tại và ném lỗi vào `catch` trả về status `500`.
   - *Kiểm chứng:* Nếu `NEXT_PUBLIC_CLOUDFLARE_API_URL` chưa khai báo hoặc `fetch` ném lỗi mạng / trả về `!res.ok`, route tự động truy vấn trực tiếp từ `supabase.from('licenses')` và vẫn lọc sạch `correct_answer_id` / `correctAnswerId` (Zero Answer Leaks).
4. **Lỗi fallback chữ có dấu Tiếng Việt & vòng lặp `--font-sans`:**
   - *Kiểm chứng:* Đã được khóa chặt bởi [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
5. **Nguy cơ vi phạm `scripts/portal-navbar-cleanup.test.ts` khi gắn link `/ontap`:**
   - *Kiểm chứng:* Chỉ gắn `href="/ontap"` trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx).

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### `[x]` Task 1.0: Xử Lý Triệt Để Lỗi Font Tiếng Việt "Chữ To Chữ Bé" Trên Toàn Bộ 13 File Của Root Portal *(Đã hoàn thành)*
- `[x]` **Step 1.0.1 (RED):** Viết unit test kiểm tra `app/layout.tsx`, `app/globals.css` và 11 file CSS Module trên Portal trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
- `[x]` **Step 1.0.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận `FAIL`.
- `[x]` **Step 1.0.3 (GREEN):** Xóa `Rubik`, nạp `Be_Vietnam_Pro`, `Merriweather`, `JetBrains_Mono` với `subsets: ['latin', 'vietnamese']` trong [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx), dọn `@import` trong [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css) và chuẩn hóa 11 file `.module.css`.
- `[x]` **Step 1.0.4 (Verify GREEN):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận `PASS`.

---

### `[x]` Task 1.1: Gắn Liên Kết `/ontap` Vào Khung "Tra Cứu & Tiện Ích" Trên [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx) *(Đã hoàn thành)*
- `[x]` **Step 1.1.1 (RED) -> Step 1.1.4 (Verify GREEN):** Bổ sung mục `<Link href="/ontap">` đầu danh sách `Tra cứu & Tiện ích` trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx#L137-L151), vượt qua 100% `ontap-dual-theme-and-sidebar.test.ts` và `portal-navbar-cleanup.test.ts`.

---

### `[x]` Task 1.2, 1.3 & 1.4: Thiết Lập Dual-Theme Core (`light` / `dark`) Cho `ontap-web`, Xóa `SnowEffect.tsx` & Sửa Vòng Lặp `--font-sans` *(Đã hoàn thành)*
- `[x]` **Step 1.2.1 (RED) -> Step 1.2.4 (Verify GREEN):** Thu hẹp `export type Theme = 'light' | 'dark';` trong [ontap-web/types.ts](file:///d:/Antigravity/TNDNB/ontap-web/types.ts), cập nhật [ontap-web/contexts/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx), xóa `SnowEffect.tsx`, sửa vòng lặp `--font-sans` trong [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css) và thiết kế nút toggle 1 chạm trong [ontap-web/components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx).

---

### `[ ]` Task 1.5: Khắc Phục Triệt Để Lỗi Click Bài Viết Chờ 10 Giây Trên Root Portal & Bổ Sung Fallback Supabase Cho API Trộn Đề (`/api/thi/[licenseId]`)

#### Step 1.5.1: Viết test thất bại (`RED`) trong [scripts/portal-post-performance.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts)
Tạo mới file [scripts/portal-post-performance.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts) kiểm tra:
1. Cấu hình ISR `export const revalidate = 60;`, `authorCache`, `Promise.race` (`1500` ms) và `Promise.all` trong [app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx).
2. Sự tồn tại và cấu trúc Editorial Skeleton UI của [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx).
3. Cơ chế fallback sang `supabase.from('licenses')` và lọc đáp án đúng (`Zero Answer Leaks`) trong [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts) khi Cloudflare Worker gặp lỗi DNS/mạng.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

const rootDir = path.resolve(__dirname, '..');

describe('Task 1.5: Root Portal Post Navigation Performance (<50ms ISR + Skeleton) & Exam API Supabase Fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('app/bai-viet/[postId]/page.tsx bật ISR revalidate = 60, có authorCache + timeout 1500ms và gom Promise.all xóa waterfall', () => {
    const postPagePath = path.resolve(rootDir, 'app/bai-viet/[postId]/page.tsx');
    const content = fs.readFileSync(postPagePath, 'utf8');

    expect(content).not.toContain('export const revalidate = 0');
    expect(content).toContain('export const revalidate = 60');
    expect(content).toContain('authorCache');
    expect(content).toContain('Promise.race');
    expect(content).toContain('1500');
    expect(content).toContain('Promise.all');
  });

  it('app/bai-viet/[postId]/loading.tsx tồn tại và hiển thị khung xương Editorial Skeleton đồng bộ với page.module.css', () => {
    const loadingPath = path.resolve(rootDir, 'app/bai-viet/[postId]/loading.tsx');
    expect(fs.existsSync(loadingPath)).toBe(true);

    const loadingContent = fs.readFileSync(loadingPath, 'utf8');
    expect(loadingContent).toContain("import styles from './page.module.css'");
    expect(loadingContent).toContain('styles.container');
    expect(loadingContent).toContain('aria-busy="true"');
  });

  it('app/api/thi/[licenseId]/route.ts tự động fallback sang Supabase khi Cloudflare Worker lỗi DNS/mạng và bảo mật đáp án đúng', async () => {
    const routePath = path.resolve(rootDir, 'app/api/thi/[licenseId]/route.ts');
    const routeSource = fs.readFileSync(routePath, 'utf8');
    expect(routeSource).toContain(".from('licenses')");

    // Giả lập fetch Cloudflare Worker ném lỗi DNS ERR_NAME_NOT_RESOLVED
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    vi.resetModules();
    vi.doMock('../utils/supabaseClient', () => ({
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'hang-ba',
                  name: 'Thuyền trưởng hạng ba',
                  subjects: [
                    {
                      id: 'luat-gt',
                      name: 'Pháp luật GTĐTNĐ',
                      questions: [
                        {
                          id: 'q1',
                          text: 'Câu hỏi mẫu số 1?',
                          correct_answer_id: 'a1',
                          answers: [
                            { id: 'a1', text: 'Đáp án A' },
                            { id: 'a2', text: 'Đáp án B' }
                          ]
                        }
                      ]
                    }
                  ]
                },
                error: null
              })
            }))
          }))
        }))
      }
    }));

    try {
      const { GET } = await import('../app/api/thi/[licenseId]/route');
      const req = new NextRequest('http://localhost:3001/api/thi/hang-ba?limit=10');
      const res = await GET(req, { params: { licenseId: 'hang-ba' } });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.licenseName).toBe('Thuyền trưởng hạng ba');
      expect(body.questions).toHaveLength(1);
      expect(body.questions[0].correct_answer_id).toBeUndefined();
      expect(body.questions[0].correctAnswerId).toBeUndefined();
    } finally {
      globalThis.fetch = originalFetch;
      vi.doUnmock('../utils/supabaseClient');
    }
  });
});
```

#### Step 1.5.2: Chạy test — xác nhận FAIL (`Verify RED`)
```powershell
npx vitest run scripts/portal-post-performance.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì `app/bai-viet/[postId]/page.tsx` đang để `export const revalidate = 0;`, chưa có `app/bai-viet/[postId]/loading.tsx`, và `app/api/thi/[licenseId]/route.ts` trả về HTTP `500` khi `fetch` gặp lỗi mạng.

#### Step 1.5.3: Implement tối thiểu (`GREEN`)

1. **Tối ưu [app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx):**
   - Đổi `export const revalidate = 0;` thành `export const revalidate = 60;`.
   - Khai báo cache bộ nhớ trong tiến trình Node/Edge kèm TTL 10 phút (`AUTHOR_CACHE_TTL_MS = 10 * 60 * 1000`) và timeout cứng `1500ms` khi đọc `adminDb?.collection('users').doc(authorId).get()`:
   ```tsx
   export const revalidate = 60;

   const AUTHOR_CACHE_TTL_MS = 10 * 60 * 1000;
   const authorCache = new Map<string, { name: string; expiresAt: number }>();

   async function resolveAuthorName(authorId: string | null | undefined): Promise<string | null> {
     if (!authorId) return null;

     const now = Date.now();
     const cached = authorCache.get(authorId);
     if (cached && cached.expiresAt > now) {
       return cached.name;
     }

     if (!adminDb) {
       return 'Ban Biên Tập';
     }

     let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
     try {
       const lookupPromise = adminDb
         .collection('users')
         .doc(authorId)
         .get()
         .then((userDoc) => (userDoc.exists ? userDoc.data()?.fullName || 'Ban Biên Tập' : 'Ban Biên Tập'));

       const timeoutPromise = new Promise<string>((resolve) => {
         timeoutHandle = setTimeout(() => resolve('Ban Biên Tập'), 1500);
       });

       const resolvedName = await Promise.race([lookupPromise, timeoutPromise]);
       authorCache.set(authorId, { name: resolvedName, expiresAt: now + AUTHOR_CACHE_TTL_MS });
       return resolvedName;
     } catch (firestoreError) {
       console.warn('Timeout/lỗi nhẹ khi tải tên tác giả từ Firestore:', firestoreError);
       return 'Ban Biên Tập';
     } finally {
       if (timeoutHandle) clearTimeout(timeoutHandle);
     }
   }
   ```
   - Trong `PostPage` / `getPostBundle(postId)`: Ngay sau khi lấy `postData` từ `supabase.from('posts').select('*').eq('id', postId).single()`, chạy song song:
   ```tsx
   const [authorName, relatedPosts] = await Promise.all([
     resolveAuthorName(postData.author_id),
     getRelatedPosts(postData.category_id, postData.id),
   ]);
   ```

2. **Bổ sung class Skeleton vào cuối [app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css) và tạo mới [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx):**
   - Bổ sung vào cuối `app/bai-viet/[postId]/page.module.css`:
   ```css
   @keyframes editorialPulse {
       0%, 100% { opacity: 1; }
       50% { opacity: 0.45; }
   }

   .skeletonBlock {
       background-color: var(--color-surface-subtle, #E2E8F0);
       border-radius: var(--radius-editorial, 4px);
       animation: editorialPulse 1.4s ease-in-out infinite;
   }

   .skeletonTitle {
       height: 2.25rem;
       width: 88%;
       margin-bottom: 0.75rem;
   }

   .skeletonTitleShort {
       height: 2.25rem;
       width: 58%;
       margin-bottom: 1.25rem;
   }

   .skeletonMeta {
       height: 1rem;
       width: 36%;
       margin-bottom: 1.5rem;
   }

   .skeletonHero {
       width: 100%;
       height: 340px;
       margin-bottom: 2rem;
       border: 1px solid var(--color-rule, #CBD5E1);
   }

   .skeletonParagraph {
       display: flex;
       flex-direction: column;
       gap: 0.85rem;
   }

   .skeletonLine {
       height: 1rem;
       width: 100%;
   }

   .skeletonLineShort {
       height: 1rem;
       width: 72%;
   }
   ```
   - Tạo mới [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx):
   ```tsx
   import styles from './page.module.css';

   export default function PostLoading() {
     return (
       <div className={styles.container} aria-busy="true" aria-label="Đang tải nội dung bài viết">
         <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
         <div className={`${styles.skeletonBlock} ${styles.skeletonTitleShort}`} />
         <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
         <div className={`${styles.skeletonBlock} ${styles.skeletonHero}`} />
         <div className={styles.skeletonParagraph}>
           <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
           <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
           <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
           <div className={`${styles.skeletonBlock} ${styles.skeletonLineShort}`} />
         </div>
       </div>
     );
   }
   ```

3. **Cập nhật [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts) với cơ chế Fallback Supabase tự động:**
   - Viết hàm `fetchLicensePayload(licenseId: string): Promise<ExamLicensePayload>`:
     - Chỉ gọi Cloudflare Worker khi `process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL` được cấu hình tường minh (với `AbortSignal.timeout(2500)`).
     - Nếu chưa cấu hình `NEXT_PUBLIC_CLOUDFLARE_API_URL`, hoặc gọi Worker bị lỗi mạng/DNS (`TypeError: Failed to fetch`) hay `!res.ok`, tự động truy vấn trực tiếp từ `supabase` (`import { supabase } from '../../../../utils/supabaseClient'` hoặc đường dẫn tương đối `../../../utils/supabaseClient` — lưu ý `app/api/thi/[licenseId]/route.ts` cách thư mục gốc 4 cấp `../../../../utils/supabaseClient`):
   ```ts
   import { supabase } from '../../../../utils/supabaseClient';

   async function fetchLicenseFromSupabase(licenseId: string): Promise<ExamLicensePayload | null> {
     const { data, error } = await supabase
       .from('licenses')
       .select(`
         id,
         name,
         subjects (
           id,
           name,
           questions (
             id,
             text,
             image,
             correct_answer_id,
             answers (
               id,
               text
             )
           )
         )
       `)
       .eq('id', licenseId)
       .single();

     if (error || !data) {
       return null;
     }
     return data as unknown as ExamLicensePayload;
   }

   async function fetchLicensePayload(licenseId: string): Promise<ExamLicensePayload> {
     const configuredWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL?.trim();
     if (configuredWorkerUrl) {
       try {
         const cleanBase = configuredWorkerUrl.replace(/\/+$/, '');
         const res = await fetch(`${cleanBase}/api/v1/licenses/${encodeURIComponent(licenseId)}`, {
           method: 'GET',
           headers: { Accept: 'application/json' },
           signal: AbortSignal.timeout(2500),
           next: { revalidate: 3600 },
         });
         if (res.ok) {
           return (await res.json()) as ExamLicensePayload;
         }
       } catch (workerErr) {
         console.warn(`[API Trộn Đề] Cloudflare Worker không phản hồi cho ${licenseId}, chuyển sang Supabase fallback:`, workerErr);
       }
     }

     const fallbackData = await fetchLicenseFromSupabase(licenseId);
     if (!fallbackData) {
       throw new Error(`Không tìm thấy dữ liệu hạng bằng ${licenseId}.`);
     }
     return fallbackData;
   }
   ```
   *(Lưu ý trong test mock: đồng bộ đường dẫn mock `../../../../utils/supabaseClient` khớp với import thực tế trong `app/api/thi/[licenseId]/route.ts` — tức là từ `scripts/portal-post-performance.test.ts` thì đường dẫn tới `utils/supabaseClient` là `'../utils/supabaseClient'` vì Vitest phân giải module theo đường dẫn tuyệt đối!).*

#### Step 1.5.4: Chạy test — xác nhận PASS (`Verify GREEN`)
```powershell
npx vitest run scripts/portal-post-performance.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-navbar-cleanup.test.ts
```
- **Kết quả kỳ vọng:** Cả 3 bộ kiểm thử đều `PASS` 100%; click bài viết trên Portal chuyển sang Skeleton ngay tức thì (`0ms`), ISR cache `< 50ms`, và API `/api/thi/[licenseId]` hoạt động ổn định ngay cả khi Cloudflare Worker chưa cấu hình.

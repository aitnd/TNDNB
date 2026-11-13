# Phase 05: Di Chuyển Công Tắc Sáng/Tối Vào Menu 3 Gạch Góc Trên Phải & Mặc Định Theme Sáng Cho Mọi Phiên Mới ( Implementation Plan )

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gỡ bỏ nút đổi giao diện trôi nổi ở góc dưới bên phải (`fixed bottom-4 right-4` đang đè lên chỉ số `100%` của `ZoomBar`), tích hợp công tắc Sáng/Tối (`variant="menu-item"`) vào menu 3 gạch góc trên phải (`TopNavbar.tsx` cho Desktop/Mobile Web và `MobileBottomNav.tsx` cho Capacitor App), đồng thời bảo đảm mọi phiên mới luôn khởi chạy bằng Theme Sáng (`light`) qua `sessionStorage`.

**Architecture:** Chuyển cơ chế lưu trữ trạng thái theme trong [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) từ `localStorage` + `prefers-color-scheme: dark` sang `sessionStorage` (`ontap_theme_session`) kèm bước dọn sạch key `localStorage` cũ (`ontap_theme`, `theme`) khi mount. Mở rộng [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) với prop tùy chọn `variant?: 'icon' | 'menu-item'` (mặc định `'icon'` để bảo toàn tương thích ngược với [`ontap-web/components/Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx)) và nhúng biến thể `'menu-item'` vào dropdown menu 3 gạch trong [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) cũng như menu mở rộng trong [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx), sau đó xóa hoàn toàn nút nổi ở [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).

**Tech Stack:** React 19, TypeScript 5.8 (`noUnusedLocals: true`), Tailwind CSS v4 (Semantic Tokens `theme.css`), Lucide React, React Icons (`fa`), Vitest.

**Spec:**
- [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md) (§7.9 *Theme Switcher Placement & Default Light Policy* & §8 *Do's and Don'ts*)
- [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)
- [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md)

---

## Global Constraints

- **Bảo toàn 100% Invariants kiểm thử hiện có:**
  - `TC-25`, `TC-26`, `TC-32` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts#L251-L371): [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) bắt buộc import `Menu` từ `lucide-react`, giữ nguyên `onNavigate('account')`, `onLogout`, class `hidden md:flex` ẩn `Thi trực tuyến` và `Khám phá` trên mobile, không tạo nút `Thoát` độc lập bên ngoài menu 3 gạch.
  - `TC-30`, `TC-31` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts#L331-L355): [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) không có `fixed bottom-4 left-1/2` hay `animate-bounce`, giữ nguyên `setResumeSessionAvailable(false)`.
  - `TC-35` trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts#L246-L311): giữ nguyên toàn bộ chuẩn hóa tương phản Dark Mode WCAG 2.1 AA của `ExamQuizScreen.tsx` từ Phases 01–04.
  - [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts): giữ nguyên `isElectronRuntime()` và static import `WindowsLoginScreen` trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).
- **Bảo toàn Export & Tương thích ngược:**
  - [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) và [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) bắt buộc giữ nguyên định danh `toggleTheme` (được kiểm tra tại dòng 88 và 108 của [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts#L88-L109)).
  - [`ontap-web/components/Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx#L19) gọi `<ThemeSwitcher />` không truyền prop vẫn phải biên dịch sạch và render nút `'icon'` mặc định.
- **Ràng buộc Trình biên dịch TypeScript (`noUnusedLocals: true`):**
  - [`ontap-web/tsconfig.json`](file:///d:/Antigravity/TNDNB/ontap-web/tsconfig.json#L12) bật `"noUnusedLocals": true` và `"noUnusedParameters": true`. Khi gỡ `<ThemeSwitcher />` khỏi [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx), bắt buộc xóa luôn dòng `import ThemeSwitcher from './components/ThemeSwitcher';`.
- **Không rò rỉ sang Root Portal hoặc `ontap-win`:**
  - Root Portal ([`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx)) tuyệt đối không có Dark Mode / `ThemeSwitcher`.
  - Giữ nguyên `ontap-win` (App Desktop Electron 8 themes) theo đúng Quyết định Frontier **2A**.

---

## Review Focus

Năm kịch bản biên (edge cases / failure modes) thực tế dễ gây lỗi nhất được khóa chặt bằng kiểm thử và logic phòng vệ trong kế hoạch này:

1. **`sessionStorage` bị chặn hoặc ném `SecurityError` (iframe sandbox, chế độ riêng tư nghiêm ngặt, WebView khóa DOM Storage):** Mọi lệnh đọc/ghi `window.sessionStorage` và `window.localStorage` trong [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) bắt buộc bọc trong `try/catch` riêng biệt và luôn trả về `'light'` an toàn mà không làm crash ứng dụng.
2. **Trình duyệt của người dùng còn lưu `localStorage.ontap_theme = "dark"` hoặc `localStorage.theme = "dark"` từ phiên bản trước:** Khi mở phiên mới (`sessionStorage` trống), `getInitialTheme()` tuyệt đối không đọc `localStorage`, đồng thời hàm `clearLegacyThemeStorage()` chủ động xóa sạch cả 2 key `ontap_theme` và `theme` khỏi `localStorage` để khởi tạo `'light'` 100%.
3. **Cờ `noUnusedLocals: true` trong [`ontap-web/tsconfig.json`](file:///d:/Antigravity/TNDNB/ontap-web/tsconfig.json#L12) làm gãy `tsc` nếu quên xóa import:** Khi xóa `<div className="fixed bottom-4 right-4 z-50"><ThemeSwitcher /></div>` trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx), dòng `import ThemeSwitcher from './components/ThemeSwitcher';` phải được gỡ bỏ đồng thời và được kiểm chứng bằng cả `TC-36` lẫn `npx tsc -p ontap-web/tsconfig.json --noEmit`.
4. **Khách chưa đăng nhập (`!userProfile`) trên cả Web (`TopNavbar.tsx`) và Capacitor App (`MobileBottomNav.tsx`):** Công tắc `<ThemeSwitcher variant="menu-item" />` bắt buộc nằm ngoài nhánh điều kiện `if (userProfile)` để học viên thi thử tự do (chưa đăng nhập) vẫn nhìn thấy và gạt đổi Sáng/Tối bình thường trong menu 3 gạch.
5. **Tương thích ngược với [`ontap-web/components/Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx#L19):** `Footer.tsx` gọi `<ThemeSwitcher />` không truyền prop `variant`; do đó `variant` trong `ThemeSwitcherProps` phải là optional (`variant?: 'icon' | 'menu-item'`) với giá trị mặc định `variant = 'icon'`.

> **Yêu cầu thẩm mỹ & chất lượng bắt buộc cho Agent thi công:**
> - Đọc kỹ [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md) trước khi sửa code.
> - Tuân thủ quy tắc **Impeccable v4.8.0** (`craft`, `polish`): vùng chạm tối thiểu `min-h-[44px]`, trạng thái focus rõ ràng `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`, độ tương phản WCAG 2.1 AA ($\ge 4.5:1$ cho chữ, $\ge 3.0:1$ cho track/thumb của switch), không dùng hiệu ứng nảy/glow lòe loẹt.
> - Tuân thủ **Taste-Skill v2.5.0** (`consistency.mjs`, `perf.mjs`): chỉ dùng Semantic Tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `hover:bg-secondary`) kết hợp màu nhấn chuẩn `sky-500`/`amber-400`, chỉ animate `transform` và `colors` (`transition-colors`, `transition-transform`).

---

## 1. Bối Cảnh & Kết Quả Đối Chiếu Codebase (Cross-Examination & Conflict Surfacing)

### 1.1 Hai Yêu Cầu Từ Người Dùng
1. **"Giấu nút đổi sáng tối cho cả mobile và desktops vào 3 gạch ở góc trên bên phải"**
2. **"mặc định tất cả phiên mới là theme sáng nhé"**

### 1.2 Hiện Trạng Đã Kiểm Chứng Trong Repo
1. **Nút nổi `fixed bottom-4 right-4` đè lên thanh `ZoomBar` `100%`:**
   - [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L485-L487) đang render `<div className="fixed bottom-4 right-4 z-50"><ThemeSwitcher /></div>` cố định ở góc dưới bên phải cho cả Desktop và Mobile.
   - Trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx#L406), [`ontap-web/components/ZoomBar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx#L12-L22) đặt thanh chỉnh cỡ chữ (`100%`) tại `sticky bottom-0 flex justify-end z-50`. Trên Mobile (và màn hình hẹp), nút nổi `ThemeSwitcher` đè trực tiếp lên chỉ số `100%` và nút `+`.
2. **Menu 3 gạch góc trên phải đã sẵn sàng cho cả Desktop & Mobile Web:**
   - [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx#L225-L373) đang render nút Hamburger 3 gạch (`<Menu size={22} />`) ở góc trên bên phải cho **cả Desktop và Mobile Web** (`!isMobileApp`), hiển thị ổn định cho cả người dùng đã đăng nhập lẫn khách (`!userProfile`).
3. **Ứng dụng Native Mobile (`isMobileApp === true`):**
   - Trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L415-L475), khi `isMobileApp === true` (Capacitor Android/iOS hoặc `?mode=app`), `TopNavbar` bị ẩn và thay bằng [`MobileHeader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileHeader.tsx) + [`MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx).
   - Menu mở rộng sau nút 3 gạch `"Thêm"` (`FaBars`) trong [`MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx#L113-L172) cần có `<ThemeSwitcher variant="menu-item" />` hiển thị cho cả khách lẫn thành viên.
4. **Nguyên nhân lỗi Dark Mode tự bật ở phiên mới:**
   - [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx#L17-L41) đọc `localStorage.getItem('ontap_theme') || localStorage.getItem('theme')`, sau đó fallback `window.matchMedia('(prefers-color-scheme: dark)').matches` $\rightarrow$ tự chuyển sang `'dark'` nếu HĐH bật Dark Mode và ghi cứng vào `localStorage`.

---

## 2. Hai Quyết Định Kiến Trúc Frontier (✅ ĐÃ CHỐT: 1A + 2A)

### Quyết định 1: Cơ chế bảo đảm `"mặc định tất cả phiên mới là theme sáng"` — ✅ ĐÃ CHỐT PHƯƠNG ÁN 1A
| Phương án | Cơ chế kỹ thuật | Ưu điểm | Nhược điểm | Trạng thái |
|---|---|---|---|---|
| **Phương án 1A** | Dùng **`sessionStorage`** (`ontap_theme_session`) + xóa nhánh `prefers-color-scheme: dark` + dọn key cũ `localStorage` (`ontap_theme`, `theme`) khi mount | Khớp chính xác 100% yêu cầu *"tất cả phiên mới là theme sáng"* (mở tab mới / mở lại trình duyệt / cold start app luôn là `light`, bất chấp OS Dark Mode); F5 trong cùng phiên vẫn giữ theme vừa chọn | Người dùng muốn dùng Dark Mode ở phiên duyệt mới ngày hôm sau cần bật lại trong menu 3 gạch | **✅ ĐÃ CHỐT (1A)** |
| **Phương án 1B** | Vẫn giữ `localStorage`, chỉ bỏ `prefers-color-scheme: dark` | Người dùng bật Dark Mode một lần sẽ giữ xuyên suốt các phiên sau | Vi phạm yêu cầu *"tất cả phiên mới là theme sáng"* — ai lỡ bật Dark Mode hoặc còn key cũ trong `localStorage` sẽ tiếp tục mở ra màn hình tối | Loại bỏ |

### Quyết định 2: Phạm vi áp dụng (`ontap-web` vs `ontap-win` App Desktop Electron) — ✅ ĐÃ CHỐT PHƯƠNG ÁN 2A
| Phương án | Phạm vi chỉnh sửa | Ưu điểm | Nhược điểm | Trạng thái |
|---|---|---|---|---|
| **Phương án 2A** | Tập trung **`ontap-web`** (Web Desktop + Web Mobile qua `TopNavbar.tsx`, và Capacitor Mobile App qua `MobileBottomNav.tsx`), giữ nguyên `ontap-win` (8 themes Electron) | `ontap-web` đã có sẵn nút 3 gạch `<Menu />` ở góc trên phải trên cả Mobile & Desktop; xử lý dứt điểm lỗi đè nút `100%` và đúng ngữ cảnh Web `/ontap` đang phản hồi | Phần mềm Electron `ontap-win` vẫn giữ nút bảng màu góc dưới phải và 8 themes trong `localStorage` | **✅ ĐÃ CHỐT (2A)** |
| **Phương án 2B** | Đồng bộ thêm **`ontap-win`** (xây menu 3 gạch mới trong `ontap-win/components/TopNavbar.tsx`, dời `ThemeSwitcher` vào đó, đổi mặc định phiên mới sang `light`) | Giao diện Web và App Windows giống nhau hoàn toàn | Đụng vào thiết kế `TopNavbar` riêng của `ontap-win` và thay đổi cơ chế 8 themes đang dùng trên Desktop | Loại bỏ |

---

## 3. Implementation Steps (TDD Enriched — Bite-Sized Tasks)

### Task 1: Chính Sách Mặc Định Theme Sáng Theo Phiên (`ThemeContext.tsx`) & Kiểm Thử `TC-37`

**Files:**
- Modify: [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) (dòng 1–71)
- Test: [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) (thêm `TC-37` vào cuối file)
- Verify Invariant: [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html) (dòng 2: `<html lang="vi" data-theme="light">`)

**Interfaces:**
- **Consumes:**
  - `import type { Theme } from '../types';` (`'light' | 'dark'`)
- **Produces:**
  - `export const SESSION_THEME_KEY = 'ontap_theme_session';`
  - `export interface ThemeContextType { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void; }`
  - `export function getInitialTheme(storage?: Pick<Storage, 'getItem'> | null): Theme`
  - `export function clearLegacyThemeStorage(storage?: Pick<Storage, 'removeItem'> | null): void`
  - `export const ThemeProvider: React.FC<{ children: ReactNode }>`
  - `export const useTheme: () => ThemeContextType`

- [x] **Step 1.1: Viết kiểm thử thất bại (TDD RED) `TC-37` trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)**

Thêm khối `describe('Phase 05: ThemeSwitcher in Hamburger Menu & Default Light Per-Session (Plan 261112-2215)')` với `TC-37` vào cuối tệp [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):

```ts
describe('Phase 05: ThemeSwitcher in Hamburger Menu & Default Light Per-Session (Plan 261112-2215)', () => {
  it('TC-37: Mặc định tất cả phiên mới là Theme Sáng (sessionStorage + bỏ prefers-color-scheme + dọn localStorage cũ + chịu lỗi SecurityError)', async () => {
    const themeCtxPath = path.resolve(rootDir, 'ontap-web/contexts/ThemeContext.tsx')
    const themeCtxContent = fs.readFileSync(themeCtxPath, 'utf8')
    const indexHtmlContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/index.html'), 'utf8')

    // 1. HTML gốc luôn đặt data-theme="light"
    expect(indexHtmlContent).toContain('data-theme="light"')

    // 2. ThemeContext không còn đọc prefers-color-scheme: dark và dùng sessionStorage key ontap_theme_session
    expect(themeCtxContent).not.toContain('prefers-color-scheme')
    expect(themeCtxContent).not.toMatch(/localStorage\.getItem\(['"]ontap_theme['"]\)/)
    expect(themeCtxContent).not.toMatch(/localStorage\.getItem\(['"]theme['"]\)/)
    expect(themeCtxContent).toContain('ontap_theme_session')
    expect(themeCtxContent).toContain('sessionStorage')
    expect(themeCtxContent).toMatch(/localStorage\.removeItem\(['"]ontap_theme['"]\)/)
    expect(themeCtxContent).toMatch(/localStorage\.removeItem\(['"]theme['"]\)/)
    expect(themeCtxContent).toContain('toggleTheme')

    // 3. Kiểm thử hành vi runtime cho Review Focus #1 (SecurityError) & #2 (localStorage cũ còn lưu dark)
    const mod = await import('../ontap-web/contexts/ThemeContext')
    expect(typeof mod.getInitialTheme).toBe('function')
    expect(typeof mod.clearLegacyThemeStorage).toBe('function')

    // Phiên mới (sessionStorage trống) -> luôn là 'light'
    const emptySession = { getItem: () => null }
    expect(mod.getInitialTheme(emptySession)).toBe('light')

    // Cùng phiên đã chọn 'dark' -> giữ 'dark' khi F5
    const darkSession = { getItem: (k: string) => (k === 'ontap_theme_session' ? 'dark' : null) }
    expect(mod.getInitialTheme(darkSession)).toBe('dark')

    // Giá trị lạ hoặc hỏng -> fallback 'light'
    const invalidSession = { getItem: () => 'noel' }
    expect(mod.getInitialTheme(invalidSession)).toBe('light')

    // Review Focus #1: sessionStorage ném SecurityError trong iframe/private mode -> không crash, trả về 'light'
    const throwingSession = {
      getItem: () => {
        throw new Error('SecurityError: Failed to read sessionStorage')
      },
    }
    expect(mod.getInitialTheme(throwingSession)).toBe('light')

    // Review Focus #2: clearLegacyThemeStorage xóa sạch cả ontap_theme và theme, chịu được SecurityError
    const removedKeys: string[] = []
    mod.clearLegacyThemeStorage({
      removeItem: (k: string) => {
        removedKeys.push(k)
      },
    })
    expect(removedKeys).toEqual(['ontap_theme', 'theme'])

    expect(() =>
      mod.clearLegacyThemeStorage({
        removeItem: () => {
          throw new Error('SecurityError')
        },
      })
    ).not.toThrow()
  })
})
```

- [x] **Step 1.2: Chạy Vitest để xác nhận `TC-37` FAIL (TDD RED)**

Run:
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
```
Expected: FAIL tại `TC-37` vì `ontap-web/contexts/ThemeContext.tsx` vẫn chứa `prefers-color-scheme` và `localStorage.getItem('ontap_theme')`.

- [x] **Step 1.3: Triển khai [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) theo Phương án 1A**

Thay thế toàn bộ nội dung [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) bằng mã nguồn chính xác sau:

```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Theme } from '../types';

export const SESSION_THEME_KEY = 'ontap_theme_session';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function normalizeStoredTheme(raw: string | null): Theme {
  if (raw === 'dark') return 'dark';
  return 'light';
}

export function getInitialTheme(storage?: Pick<Storage, 'getItem'> | null): Theme {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
          ? window.sessionStorage
          : null;
    if (!targetStorage) return 'light';
    const saved = targetStorage.getItem(SESSION_THEME_KEY);
    return normalizeStoredTheme(saved);
  } catch {
    return 'light';
  }
}

export function clearLegacyThemeStorage(storage?: Pick<Storage, 'removeItem'> | null): void {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
          ? window.localStorage
          : null;
    if (!targetStorage) return;
    targetStorage.removeItem('ontap_theme');
    targetStorage.removeItem('theme');
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage trong chế độ riêng tư hoặc iframe
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    try {
      if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.setItem(SESSION_THEME_KEY, newTheme);
      }
    } catch {
      // Bỏ qua nếu sessionStorage bị khóa
    }
  }, []);

  useEffect(() => {
    clearLegacyThemeStorage();
    const initial = getInitialTheme();
    applyTheme(initial);
  }, [applyTheme]);

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

- [x] **Step 1.4: Chạy Vitest để xác nhận `TC-37` PASS (TDD GREEN)**

Run:
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
```
Expected: `TC-37` và toàn bộ các test hiện có trong `scripts/ontap-dual-theme-and-sidebar.test.ts` đều **PASS**.

---

### Task 2: Mở Rộng `ThemeSwitcher.tsx` Hỗ Trợ `variant?: 'icon' | 'menu-item'` Chuẩn WCAG 2.1 AA

**Files:**
- Modify: [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) (dòng 1–56)
- Test: [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) (bổ sung `TC-36` kiểm tra `ThemeSwitcher.tsx`, `TopNavbar.tsx`, `MobileBottomNav.tsx`, `App.tsx`)
- Verify Compatibility: [`ontap-web/components/Footer.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx) (dòng 19: `<ThemeSwitcher />`)

**Interfaces:**
- **Consumes:**
  - `useTheme(): ThemeContextType` từ [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx)
- **Produces:**
  - `export interface ThemeSwitcherProps { variant?: 'icon' | 'menu-item'; className?: string; }`
  - `const ThemeSwitcher: React.FC<ThemeSwitcherProps>` (`export default ThemeSwitcher`)

- [x] **Step 2.1: Viết kiểm thử thất bại (TDD RED) `TC-36` trong [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)**

Thêm kiểm thử `TC-36` vào bên trong khối `describe('Phase 05: ThemeSwitcher in Hamburger Menu & Default Light Per-Session (Plan 261112-2215)')` tại [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):

```ts
  it('TC-36: Di chuyển ThemeSwitcher vào menu 3 gạch góc trên phải (TopNavbar & MobileBottomNav) và gỡ bỏ hoàn toàn nút nổi góc dưới phải ở App.tsx', () => {
    const appContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/App.tsx'), 'utf8')
    const themeSwitcherContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/ThemeSwitcher.tsx'), 'utf8')
    const topNavbarContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/TopNavbar.tsx'), 'utf8')
    const mobileBottomNavContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/MobileBottomNav.tsx'), 'utf8')
    const footerContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/Footer.tsx'), 'utf8')

    // 1. App.tsx: xóa sạch import ThemeSwitcher (Review Focus #3: noUnusedLocals) và gỡ khối fixed bottom-4 right-4
    expect(appContent).not.toContain('ThemeSwitcher')
    expect(appContent).not.toContain('fixed bottom-4 right-4')

    // 2. ThemeSwitcher.tsx: hỗ trợ variant?: 'icon' | 'menu-item' (mặc định 'icon' cho Footer.tsx), có role="switch", aria-checked, min-h-[44px], focus-visible:ring-2
    expect(themeSwitcherContent).toContain("variant?: 'icon' | 'menu-item'")
    expect(themeSwitcherContent).toContain("variant = 'icon'")
    expect(themeSwitcherContent).toContain('role="switch"')
    expect(themeSwitcherContent).toContain('aria-checked={isDark}')
    expect(themeSwitcherContent).toContain('min-h-[44px]')
    expect(themeSwitcherContent).toContain('focus-visible:ring-2')
    expect(themeSwitcherContent).toContain('toggleTheme')
    expect(footerContent).toContain('<ThemeSwitcher />')

    // 3. TopNavbar.tsx: nhúng <ThemeSwitcher variant="menu-item" /> bên trong dropdown showHamburgerMenu cho cả khách và thành viên (Review Focus #4)
    expect(topNavbarContent).toMatch(/import\s+ThemeSwitcher\s+from\s+['"]\.\/ThemeSwitcher['"]/)
    const hamburgerBlockMatch = topNavbarContent.match(/\{showHamburgerMenu\s*&&\s*\([\s\S]*?<ThemeSwitcher\s+variant=['"]menu-item['"]\s*\/>[\s\S]*?\)\}/)
    expect(hamburgerBlockMatch).toBeTruthy()
    expect(topNavbarContent).toContain('aria-expanded={showHamburgerMenu}')

    // 4. MobileBottomNav.tsx: nhúng <ThemeSwitcher variant="menu-item" /> bên trong menu mở rộng cho cả khách và thành viên (Review Focus #4)
    expect(mobileBottomNavContent).toMatch(/import\s+ThemeSwitcher\s+from\s+['"]\.\/ThemeSwitcher['"]/)
    expect(mobileBottomNavContent).toMatch(/<ThemeSwitcher\s+variant=['"]menu-item['"]\s*\/>/)
    // Đảm bảo ThemeSwitcher nằm ngoài nhánh chỉ dành cho userProfile để khách (!userProfile) vẫn bấm được
    const beforeGuestLoginBtn = mobileBottomNavContent.split('Đăng nhập ngay')[0]
    expect(beforeGuestLoginBtn).toContain('variant="menu-item"')
  })
```

- [x] **Step 2.2: Chạy Vitest để xác nhận `TC-36` FAIL (TDD RED)**

Run:
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
```
Expected: FAIL tại `TC-36` vì `App.tsx` vẫn còn `ThemeSwitcher` và `ThemeSwitcher.tsx` chưa hỗ trợ `variant?: 'icon' | 'menu-item'`.

- [x] **Step 2.3: Triển khai [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) với `variant?: 'icon' | 'menu-item'` chuẩn WCAG 2.1 AA**

Thay thế toàn bộ nội dung [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) bằng mã nguồn chính xác sau:

```tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface ThemeSwitcherProps {
  variant?: 'icon' | 'menu-item';
  className?: string;
}

const SunIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.981A10.503 10.503 0 0112 21a10.5 10.5 0 01-10.5-10.5c0-4.368 2.667-8.162 6.43-9.742a.75.75 0 01.819.162z"
      clipRule="evenodd"
    />
  </svg>
);

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const label = isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối';

  if (variant === 'menu-item') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={label}
        title={label}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`.trim()}
      >
        <span className="flex items-center gap-3 min-w-0">
          {isDark ? (
            <SunIcon className="w-[18px] h-[18px] text-amber-400 shrink-0 transition-transform duration-200" />
          ) : (
            <MoonIcon className="w-[18px] h-[18px] text-primary shrink-0 transition-transform duration-200" />
          )}
          <span className="truncate">Giao diện</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground">
            {isDark ? 'Tối' : 'Sáng'}
          </span>
          <span
            aria-hidden="true"
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${
              isDark
                ? 'bg-sky-500 border-sky-400'
                : 'bg-slate-300 border-slate-400/70'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl border border-border bg-secondary/70 hover:bg-secondary text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm ${className}`.trim()}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-amber-400 transition-transform duration-200" />
      ) : (
        <MoonIcon className="w-5 h-5 text-slate-700 transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
```

---

### Task 3: Tích Hợp Công Tắc Vào Menu 3 Gạch (`TopNavbar.tsx` & `MobileBottomNav.tsx`), Gỡ Nút Nổi Ở `App.tsx` & Nghiệm Thu

**Files:**
- Modify: [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) (dòng 1–8, 225–374)
- Modify: [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx) (dòng 1–7, 113–173)
- Modify: [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) (dòng 1–8, 480–493)
- Test: [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts), [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts), [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts)

**Interfaces:**
- **Consumes:**
  - `import ThemeSwitcher from './ThemeSwitcher';` (`variant="menu-item"`)
- **Produces:**
  - `TopNavbar.tsx`: công tắc `<ThemeSwitcher variant="menu-item" />` trong dropdown `showHamburgerMenu` (hiển thị cho cả khách và thành viên trên Desktop & Mobile Web)
  - `MobileBottomNav.tsx`: công tắc `<ThemeSwitcher variant="menu-item" />` trong menu mở rộng `isMenuOpen` (hiển thị cho cả khách và thành viên trên Capacitor App `isMobileApp === true`)
  - `App.tsx`: loại bỏ hoàn toàn import và JSX của `ThemeSwitcher` ở góc dưới bên phải

- [x] **Step 3.1: Cập nhật [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) — thêm `ThemeSwitcher` vào dropdown menu 3 gạch góc trên phải**

1. Tại phần import đầu tệp [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx#L1-L7), thêm `import ThemeSwitcher from './ThemeSwitcher';`:

```tsx
import * as React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Newspaper, History, UserCog, LogOut, GraduationCap, School, AlertTriangle, Settings, CheckCircle, Mail, Download, ChevronDown, Utensils, Gamepad2, Award, Compass, ShieldCheck, FileEdit, Menu, X } from 'lucide-react'; 
import ChangelogModal, { getLatestVersion } from './ChangelogModal';
import NotificationBell from './NotificationBell';
import { MiniRoleBadge } from './Badges/MiniRoleBadge';
import ThemeSwitcher from './ThemeSwitcher';
```

2. Tại khối nút 3 gạch và dropdown `showHamburgerMenu` ([`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx#L225-L373)), bổ sung `aria-expanded={showHamburgerMenu}`, thêm `max-h-[calc(100vh-5rem)] overflow-y-auto` cho dropdown panel, và chèn `<ThemeSwitcher variant="menu-item" />` ngay phía trên mục `Phiên bản hệ thống`:

```tsx
                    {/* Hamburger Menu 3 gạch (Mobile & Quick Access) */}
                    <div className="relative" ref={hamburgerRef}>
                        <button
                            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                            className="p-2 rounded-xl text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-border/60"
                            aria-label="Menu"
                            aria-expanded={showHamburgerMenu}
                            title="Menu tác vụ"
                        >
                            {showHamburgerMenu ? <X size={22} className="text-primary" /> : <Menu size={22} className="text-primary" />}
                        </button>

                        {/* Dropdown Panel */}
                        {showHamburgerMenu && (
                            <div className="fixed right-3 top-16 w-72 max-w-[calc(100vw-24px)] max-h-[calc(100vh-5rem)] overflow-y-auto bg-card/98 backdrop-blur-xl border border-border rounded-2xl shadow-2xl py-3 z-[150] text-card-foreground animate-in fade-in zoom-in-95 duration-150">
                                {/* Header thông tin người dùng */}
                                {userProfile && (
                                    <div className="px-4 py-3 border-b border-border mb-2 bg-muted/40 rounded-t-xl">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-base text-foreground truncate">
                                                {userProfile.full_name || userProfile.fullName || 'Học viên'}
                                            </span>
                                            {userProfile?.role === 'hoc_vien' && (userProfile.isVerified || userProfile.courseId) && (
                                                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {userProfile?.role && <MiniRoleBadge role={userProfile.role} />}
                                            <span className="text-xs text-muted-foreground truncate">
                                                {userProfile.email || (userProfile as any).username || ''}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Menu Items */}
                                <div className="space-y-0.5 px-2">
                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('account'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <UserCog size={18} className="text-primary" />
                                        <span>Quản lý tài khoản</span>
                                    </button>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('mailbox'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Mail size={18} className="text-primary" />
                                        <span>Hộp thư cá nhân</span>
                                    </button>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('history'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <History size={18} className="text-primary" />
                                        <span>Lịch sử thi thử</span>
                                    </button>

                                    {userProfile?.role === 'hoc_vien' && (
                                        <button
                                            onClick={() => { setShowHamburgerMenu(false); onNavigate('thi_truc_tuyen'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                        >
                                            <FileEdit size={18} className="text-rose-600 dark:text-rose-400" />
                                            <span>Kỳ thi trực tuyến</span>
                                        </button>
                                    )}

                                    {/* Nhóm Khám Phá & Tiện Ích */}
                                    <div className="border-t border-border my-2" />
                                    <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        Khám phá & Tiện ích
                                    </div>

                                    <a
                                        href="/"
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Newspaper size={18} className="text-primary" />
                                        <span>Cổng Tin tức & Thông báo</span>
                                    </a>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('download_app'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
                                        <span>Tải App học offline</span>
                                    </button>

                                    {userProfile && (
                                        <button
                                            onClick={() => { setShowHamburgerMenu(false); onNavigate('giaitri'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                        >
                                            <Gamepad2 size={18} className="text-indigo-500" />
                                            <span>Khu giải trí & Trò chơi</span>
                                        </button>
                                    )}

                                    <a
                                        href="https://thodia.hlstudio.top"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Utensils size={18} className="text-orange-500" />
                                        <span>Thổ Địa Ninh Bình</span>
                                    </a>

                                    {/* Giao diện Sáng / Tối */}
                                    <div className="border-t border-border my-2" />
                                    <ThemeSwitcher variant="menu-item" />

                                    {/* Phiên bản hệ thống */}
                                    <div className="border-t border-border my-2" />
                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); setShowChangelog(true); }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    >
                                        <span>Phiên bản hệ thống</span>
                                        <span className="tabular-nums font-mono text-primary">v{latestVersion}</span>
                                    </button>

                                    {/* Nút Đăng xuất */}
                                    {userProfile ? (
                                        <>
                                            <div className="border-t border-border my-2" />
                                            <button
                                                onClick={() => { setShowHamburgerMenu(false); onLogout(); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left font-bold text-sm min-h-[44px]"
                                            >
                                                <LogOut size={18} />
                                                <span>Đăng xuất</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="border-t border-border my-2" />
                                            <button
                                                onClick={() => { setShowHamburgerMenu(false); onNavigate('login'); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm min-h-[44px] justify-center shadow-sm"
                                            >
                                                <span>Đăng nhập</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
```

- [x] **Step 3.2: Cập nhật [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx) — chèn `<ThemeSwitcher variant="menu-item" />` vào menu mở rộng cho cả thành viên và khách (`!userProfile`)**

1. Tại phần import đầu tệp [`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx#L1-L6), thêm `import ThemeSwitcher from './ThemeSwitcher';`:

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaUserCog, FaBars, FaHistory, FaSchool, FaUserGraduate, FaExclamationTriangle, FaSignOutAlt, FaTimes, FaEnvelope } from 'react-icons/fa';

import { UserProfile } from '../types';
import { triggerHaptic } from '../utils/nativeUX';
import ThemeSwitcher from './ThemeSwitcher';
```

2. Tại khối `OVERLAY EXTENDED MENU` ([`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx#L113-L172)), đặt `<ThemeSwitcher variant="menu-item" />` hiển thị chung cho cả `userProfile` và `!userProfile`:

```tsx
            {/* OVERLAY EXTENDED MENU */}
            <div
                ref={menuRef}
                className={`fixed bottom-20 right-4 z-[10000] transition-all duration-300 origin-bottom-right ${
                    isMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-2xl p-4 w-56 flex flex-col gap-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                        Menu mở rộng
                    </div>

                    {userProfile && (
                        <>
                            {menuItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            item.action();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-secondary transition-colors group min-h-[44px]"
                                    >
                                        <div className={`p-2 rounded-lg bg-secondary group-hover:bg-card shadow-xs ${item.color}`}>
                                            <Icon />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                                    </button>
                                );
                            })}

                            <div className="h-px bg-border my-1" />
                        </>
                    )}

                    <ThemeSwitcher variant="menu-item" />

                    <div className="h-px bg-border my-1" />

                    {userProfile ? (
                        <button
                            onClick={() => {
                                triggerHaptic('light');
                                onLogout();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors min-h-[44px]"
                        >
                            <div className="p-2 rounded-lg bg-destructive/15">
                                <FaSignOutAlt />
                            </div>
                            <span className="text-sm font-semibold">Đăng xuất</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                handleNavigate('login');
                                setIsMenuOpen(false);
                            }}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition shadow-sm min-h-[44px]"
                        >
                            Đăng nhập ngay
                        </button>
                    )}
                </div>
            </div>
```

- [x] **Step 3.3: Cập nhật [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) — xóa `import ThemeSwitcher` và gỡ khối nút nổi `fixed bottom-4 right-4 z-50`**

1. Tại đầu tệp [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L1-L8), xóa dòng `import ThemeSwitcher from './components/ThemeSwitcher';`:

```tsx
import React, { useCallback, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import SweetAlertPopup from './components/SweetAlertPopup';
import TopNavbar from './components/TopNavbar';
```

2. Tại cuối tệp [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L480-L493), xóa khối `<div className="fixed bottom-4 right-4 z-50"><ThemeSwitcher /></div>`:

```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
      <Analytics />
    </ThemeProvider>
  );
};

export default App;
```

- [x] **Step 3.4: Chạy Vitest xác nhận `TC-36`, `TC-37` và các test liên quan PASS (TDD GREEN)**

Run:
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-console-and-tinymce-fix.test.ts
```
Expected: Tất cả test cases (bao gồm `TC-25`, `TC-26`, `TC-30`, `TC-31`, `TC-32`, `TC-35`, `TC-36`, `TC-37`) đều **PASS**.

- [x] **Step 3.5: Kiểm tra TypeScript tĩnh (`tsc --noEmit`), Đóng gói Build & Chạy toàn bộ 15 Test Suites**

Run:
```powershell
npx tsc --noEmit
npx tsc -p ontap-web/tsconfig.json --noEmit
cd ontap-web; npm run build; cd ..
npm run build:portal
npx vitest run scripts/
```
Expected:
- Cả 2 lệnh `tsc` trả về Exit Code `0` (không lỗi `noUnusedLocals` hay lỗi kiểu dữ liệu ở `Footer.tsx`).
- Build `ontap-web` (xuất ra `public/ontap/assets/`) và `build:portal` thành công 100%.
- Toàn bộ 15/15 test suites trong `scripts/` (bao gồm `scripts/ontap-electron-runtime-guard.test.ts`) đều **PASS**.

- [x] **Step 3.6: Kiểm định chất lượng UI (`impeccable` + `taste-skill`) & Nghiệm thu trình duyệt (`/chrome-test`)**

1. Kiểm tra các quy tắc `impeccable` (`craft`, `polish`) và `taste-skill` (`consistency.mjs`, `perf.mjs`) theo [`DESIGN.md`](file:///d:/Antigravity/TNDNB/DESIGN.md) §7.9:
   - Mục `"Giao diện"` trong menu 3 gạch đạt chiều cao chạm tối thiểu `44px`, có `role="switch"` và `aria-checked`, viền focus `focus-visible:ring-2`.
   - Chỉ số `100%` của `ZoomBar` ở góc dưới bên phải màn hình thi [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) hoàn toàn thông thoáng trên cả Desktop (`1280×800`) và Mobile (`390×844`).
   - Mở phiên mới (kể cả khi hệ điều hành bật `prefers-color-scheme: dark` hoặc còn lưu `localStorage.ontap_theme="dark"`) luôn hiển thị **Theme Sáng** (`data-theme="light"`).
2. Đồng bộ trạng thái hoàn thành `[x]` vào [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md) và [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md).

---

## 4. Bảng Bảo Toàn Quy Tắc Bất Biến (Invariant Guardrails)

| Thành phần | Quy tắc bất biến phải bảo toàn | Nguồn kiểm chứng |
|---|---|---|
| [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) | Giữ nguyên nút `<Menu />` từ `lucide-react`, `onNavigate('account')`, `onLogout`, `hidden md:flex` ẩn `Thi trực tuyến` trên mobile, không đưa `Thoát` ra ngoài menu | `TC-25`, `TC-26`, `TC-32` |
| [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) | Không còn `fixed bottom-4 left-1/2`, `animate-bounce`, hoặc `require()` / `userAgent` nhận diện nhầm Electron; không còn import dư thừa vi phạm `noUnusedLocals: true` | `TC-30`, `TC-36`, `ontap-electron-runtime-guard.test.ts` |
| [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) & [`ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) | Bảo toàn symbol `toggleTheme`; tương thích với `Footer.tsx` qua prop `variant` tùy chọn (`variant = 'icon'`); chịu lỗi `SecurityError` khi truy cập `sessionStorage` / `localStorage` | `TC-36`, `TC-37`, `ontap-dual-theme-and-sidebar.test.ts` |
| [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) | Không làm mất bất kỳ class tương phản Dark Mode WCAG AA và các selector bất biến nào đã hoàn thành ở Phase 01–04 | `TC-31`, `TC-35` |
| [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) & Root Portal | Tuyệt đối không đưa Dark Mode hoặc `ThemeSwitcher` sang Root Portal | `portal-login-dashboard.test.ts` |

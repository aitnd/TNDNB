# Phase 02: Cải Tiến App Shell, Thanh Điều Hướng & Các Màn Hình Khởi Đầu / Bảng Điều Khiển (`ontap-web`)

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)
**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)

---

## Global Constraints

1. **Chuẩn hóa Hệ Thống Token Ngữ Nghĩa (`Maritime EdTech High-Craft Dual Theme`):**
   - Toàn bộ các component thuộc App Shell, Cổng đón tiếp và Bảng điều khiển bắt buộc sử dụng các utility class ngữ nghĩa của [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css): `bg-background`, `bg-card`, `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-muted`, `border-border`, `ring-ring`.
2. **Loại bỏ 100% Hiệu Ứng AI-Slop, Neon Orbs & Glass-Premium Cũ:**
   - Trong [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx), xóa bỏ lớp viền phát sáng cầu vồng `bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 ... blur-xl` và vòng `animate-pulse` quanh biểu tượng.
   - Trong [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx), xóa bỏ hoàn toàn các quả cầu neon `blur-[100px]`, `blur-[120px]`, `blur-2xl`, `animate-bounce-slow`, và class `glass-premium` gây lóa trên nền Sáng.
3. **Quy chuẩn Bố cục & Con số (`Impeccable v4.8.0` & `Taste-Skill v2.5.0`):**
   - [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) áp dụng bố cục **Split Window Card `7fr / 5fr`** (`md:col-span-7` & `md:col-span-5`).
   - [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) áp dụng bố cục **Bento Asymmetric 12-Col** (`lg:col-span-4` Hồ sơ & Tiến bộ học tập / `lg:col-span-8` Lời chào, Tác vụ chính & Lưới quản trị).
   - Mọi chỉ số thống kê trên `WelcomeModal.tsx`, `AdminStatsBar.tsx`, `ProgressDashboard.tsx`, `WeatherWidget.tsx` bắt buộc gắn class `tabular-nums`.
   - Bảo toàn 100% [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`git diff = 0`).

---

## Files & Interfaces

### Danh sách Files tác động trong Phase 02
- Modify (Test): [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
- Modify (App Shell & Navigation):
  - [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
  - [ontap-web/components/MobileHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileHeader.tsx)
  - [ontap-web/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx)
  - [ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx)
- Modify (Entry & Bento Dashboard):
  - [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx)
  - [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx)
  - [ontap-web/components/WelcomeHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeHeader.tsx)
  - [ontap-web/components/QuickActionsGrid.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuickActionsGrid.tsx)
  - [ontap-web/components/StudentCard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/StudentCard.tsx)
  - [ontap-web/components/WeatherWidget.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx)
  - [ontap-web/components/AdminStatsBar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdminStatsBar.tsx)
  - [ontap-web/components/ProgressDashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ProgressDashboard.tsx)
- Modify (Auth Screens):
  - [ontap-web/components/LoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx)
  - [ontap-web/components/RegisterScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/RegisterScreen.tsx)
  - [ontap-web/components/WindowsLoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WindowsLoginScreen.tsx)

### Interfaces & Contracts (Giữ nguyên 100% chữ ký Props để không gãy `App.tsx`)
```tsx
// ontap-web/components/WelcomeModal.tsx
export interface WelcomeModalProps {
  onStart: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

// ontap-web/components/Dashboard.tsx
export interface DashboardProps {
  userProfile: UserProfile;
  onStart: () => void;
  onHistoryClick: () => void;
  onClassClick: () => void;
  onOnlineExamClick?: () => void;
  onNotificationClick?: () => void;
  onStatsClick?: () => void;
  onSettingsClick?: () => void;
  onUserManagerClick?: () => void;
}
```

---

## Review Focus (5 Tình Huống Biên & Failure Modes Trọng Tâm)

1. **Độ tin cậy của bài test `RED` ở Phase 02 sau khi Phase 01 đã gỡ `theme === 'premium'`:**
   - *Nguyên nhân:* Ở Phase 01, các phép so sánh `theme === 'premium'` đã được tháo bỏ để vượt qua `tsc --noEmit`, nhưng `Dashboard.tsx` vẫn còn nguyên quả cầu neon `blur-[100px]`, `blur-[120px]`, `glass-premium` và `WelcomeModal.tsx` vẫn là thẻ đơn 1 cột có `from-cyan-500 via-blue-500 to-violet-500 ... blur-xl`.
   - *Kiểm chứng:* Bài test `RED` trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts) kiểm tra trực tiếp việc xóa sạch `blur-[120px]`, `blur-[100px]`, `glass-premium`, đồng thời bắt buộc sự hiện diện của `md:col-span-7` & `md:col-span-5` trong `WelcomeModal.tsx` và `lg:col-span-4` & `lg:col-span-8` kèm `bg-card` & `border-border` trong `Dashboard.tsx`.
2. **Độ tương phản chữ trên `TopNavbar.tsx` và `MobileBottomNav.tsx` khi chuyển đổi Sáng / Tối:**
   - *Kiểm chứng:* Sử dụng `bg-card/95 backdrop-blur-md border-b border-border text-foreground` để thích ứng tức thì với cả `[data-theme='light']` và `[data-theme='dark']`.
3. **Tràn khung nhìn trên màn hình di động `390px` tại `WelcomeModal.tsx` và `Dashboard.tsx`:**
   - *Kiểm chứng:* Sử dụng lưới responsive `grid-cols-1 md:grid-cols-12` và `grid-cols-1 lg:grid-cols-12 gap-6`, đảm bảo vùng chạm mọi nút CTA đạt tối thiểu `min-h-[44px]`.
4. **Chỉ số thống kê nhảy chữ trên `AdminStatsBar.tsx`, `ProgressDashboard.tsx`, `WeatherWidget.tsx`:**
   - *Kiểm chứng:* Gắn `tabular-nums` cho toàn bộ phần tử hiển thị số lượng học viên online, điểm trung bình, số đề đã làm và nhiệt độ thời tiết.
5. **Trạng thái thông báo lỗi / thành công trên `LoginScreen.tsx`, `RegisterScreen.tsx`, `WindowsLoginScreen.tsx`:**
   - *Kiểm chứng:* Khung biểu mẫu dùng `bg-card text-card-foreground border border-border rounded-2xl shadow-sm`, ô nhập liệu dùng `bg-background border-input text-foreground focus:ring-2 focus:ring-ring`, và hộp lỗi dùng `bg-destructive/10 text-destructive border border-destructive/20`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### Task 2.1, 2.2, 2.3 & 2.4: Nâng Cấp App Shell, Split-Window `WelcomeModal`, Bento `Dashboard` & Các Màn Hình Xác Thực

#### Step 2.1: Viết test thất bại (`RED`) trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
Bổ sung khối `describe('Phase 02: ...')` vào cuối [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):

```ts
describe('Phase 02: App Shell, Split-Window WelcomeModal & Bento 12-Col Dashboard', () => {
  it('Task 2.2: WelcomeModal.tsx áp dụng bố cục Split Window (md:col-span-7 & md:col-span-5), tabular-nums và xóa sạch viền neon blur-xl', () => {
    const welcomeModal = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/WelcomeModal.tsx'),
      'utf8'
    )

    expect(welcomeModal).not.toContain('via-blue-500 to-violet-500')
    expect(welcomeModal).not.toContain('blur-xl')
    expect(welcomeModal).toContain('md:col-span-7')
    expect(welcomeModal).toContain('md:col-span-5')
    expect(welcomeModal).toContain('tabular-nums')
  })

  it('Task 2.3: Dashboard.tsx áp dụng Bento 12-Col (lg:col-span-4 & lg:col-span-8) chuẩn semantic tokens, xóa sạch blur-[120px], blur-[100px] và glass-premium', () => {
    const dashboard = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx'),
      'utf8'
    )

    expect(dashboard).not.toContain('blur-[120px]')
    expect(dashboard).not.toContain('blur-[100px]')
    expect(dashboard).not.toContain('animate-bounce-slow')
    expect(dashboard).not.toContain('glass-premium')
    expect(dashboard).toContain('lg:col-span-4')
    expect(dashboard).toContain('lg:col-span-8')
    expect(dashboard).toContain('bg-card')
    expect(dashboard).toContain('border-border')
  })
})
```

#### Step 2.2: Chạy test — xác nhận FAIL (`Verify RED`)
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì `WelcomeModal.tsx` hiện vẫn chứa `via-blue-500 to-violet-500` / `blur-xl` và chưa có `md:col-span-7` & `md:col-span-5`; `Dashboard.tsx` hiện vẫn chứa `blur-[100px]`, `blur-[120px]`, `animate-bounce-slow` và `glass-premium`.

#### Step 2.3: Implement tối thiểu (`GREEN`)

1. **Task 2.1 — Chuẩn hóa App Shell & Điều hướng:**
   - [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx): Chuẩn hóa thanh header dùng `bg-card/95 backdrop-blur-md border-b border-border text-foreground`, các link điều hướng dùng `text-muted-foreground hover:text-foreground` và trạng thái active dùng `bg-primary/10 text-primary font-semibold`.
   - [ontap-web/components/MobileHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileHeader.tsx) & [ontap-web/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx): Thay nền trắng/xám cố định bằng `bg-card/95 backdrop-blur-md border-border text-foreground`, nút điều hướng đạt vùng chạm `min-h-[44px]`.
   - [ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx): Dùng `bg-primary/10 text-foreground border-b border-primary/20`.

2. **Task 2.2 — Thiết kế lại [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) theo bố cục Split Window (`7fr / 5fr`):**
   ```tsx
   import React from 'react';
   import { HelmIcon3D } from './icons';
   import { CheckCircle2, BookOpen, ShieldCheck, Award } from 'lucide-react';

   interface WelcomeModalProps {
     onStart: () => void;
     onLoginClick: () => void;
     onRegisterClick: () => void;
   }

   const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onLoginClick, onRegisterClick }) => {
     return (
       <div className="min-h-[78vh] flex items-center justify-center px-4 py-8">
         <div className="max-w-4xl w-full bg-card text-card-foreground border border-border rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
           {/* Cột trái (7/12): Thông điệp học thuật & Hành động chính */}
           <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between">
             <div>
               <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-5">
                 <HelmIcon3D className="h-4 w-4 text-primary" />
                 <span>Hệ thống Đào tạo &amp; Sát hạch Thủy nội địa</span>
               </div>

               <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                 Ôn tập Trắc nghiệm Phương tiện Thủy nội địa
               </h1>

               <p className="text-base text-muted-foreground leading-relaxed mb-6">
                 Ngân hàng câu hỏi chuẩn hóa theo chương trình đào tạo thuyền viên, người lái phương tiện thủy nội địa kèm chế độ thi thử sát đề thực tế.
               </p>

               <ul className="space-y-2.5 mb-8 text-sm text-foreground">
                 <li className="flex items-center gap-2.5">
                   <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                   <span>Ôn luyện theo từng môn chuyên ngành có giải thích trực quan</span>
                 </li>
                 <li className="flex items-center gap-2.5">
                   <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                   <span>Tự động lưu câu hay sai để ôn tập củng cố trọng tâm</span>
                 </li>
                 <li className="flex items-center gap-2.5">
                   <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                   <span>Hỗ trợ làm bài ngoại tuyến (Offline-First) tốc độ cao</span>
                 </li>
               </ul>
             </div>

             <div>
               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                 <button
                   onClick={onStart}
                   className="min-h-[46px] px-6 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                 >
                   Bắt đầu ôn tập ngay
                 </button>
                 <button
                   onClick={onLoginClick}
                   className="min-h-[46px] px-6 py-3 rounded-xl font-semibold text-base border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                 >
                   Đăng nhập học viên
                 </button>
               </div>
               <div className="mt-4">
                 <button
                   onClick={onRegisterClick}
                   className="text-sm font-medium text-primary hover:underline min-h-[36px]"
                 >
                   Chưa có tài khoản học viên? Đăng ký ngay →
                 </button>
               </div>
             </div>
           </div>

           {/* Cột phải (5/12): Thống kê học vụ chuẩn tabular-nums */}
           <div className="md:col-span-5 bg-muted/50 border-t md:border-t-0 md:border-l border-border p-6 md:p-8 flex flex-col justify-between gap-6">
             <div>
               <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                 Thông số Hệ thống Học liệu
               </h2>
               <div className="space-y-3">
                 <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
                   <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                     <BookOpen className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="text-xl font-bold text-foreground tabular-nums">100%</p>
                     <p className="text-xs text-muted-foreground">Bám sát bộ câu hỏi sát hạch hiện hành</p>
                   </div>
                 </div>

                 <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
                   <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                     <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="text-xl font-bold text-foreground tabular-nums">30 câu / đề</p>
                     <p className="text-xs text-muted-foreground">Cấu trúc đề thi thử chuẩn thời gian thực</p>
                   </div>
                 </div>

                 <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
                   <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                     <Award className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="text-xl font-bold text-foreground tabular-nums">24/7</p>
                     <p className="text-xs text-muted-foreground">Đồng bộ lịch sử làm bài đa thiết bị</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
               Đơn vị đào tạo: <strong className="text-foreground font-semibold">Công ty CP Tư vấn và Giáo dục Ninh Bình</strong> • Hotline hỗ trợ: <span className="font-semibold text-foreground tabular-nums">0229 628 2969</span>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default WelcomeModal;
   ```

3. **Task 2.3 — Chuẩn hóa Bento 12-Col [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) & các Widget con:**
   - Trong [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx):
     - Xóa hoàn toàn khối `Background Decorations` chứa `blur-[100px]`, `blur-[120px]`, `animate-bounce-slow` và xóa lớp glow `from-cyan-500 via-blue-500 to-violet-600 ... blur-2xl` quanh `<StudentCard />`.
     - Đổi thẻ tiến bộ học tập sang `w-full bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm`.
     - Đổi khung phải `lg:col-span-8` từ `glass-premium rounded-[32px] ... border-white/10 shadow-3xl` sang `bg-card text-card-foreground rounded-2xl p-6 md:p-8 border border-border shadow-sm relative`.
     - Đổi nút mở Google Analytics từ `bg-card/40 dark:bg-zinc-800/40 ...` sang `bg-card text-card-foreground border border-border hover:bg-muted/60 rounded-xl px-5 py-3.5 transition-colors`.
   - Đồng bộ semantic tokens và `tabular-nums` cho [ontap-web/components/WelcomeHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeHeader.tsx), [ontap-web/components/QuickActionsGrid.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuickActionsGrid.tsx), [ontap-web/components/StudentCard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/StudentCard.tsx), [ontap-web/components/WeatherWidget.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx), [ontap-web/components/AdminStatsBar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdminStatsBar.tsx), và [ontap-web/components/ProgressDashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ProgressDashboard.tsx).

4. **Task 2.4 — Chuẩn hóa các màn hình Xác thực:**
   - [ontap-web/components/LoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx), [ontap-web/components/RegisterScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/RegisterScreen.tsx), [ontap-web/components/WindowsLoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WindowsLoginScreen.tsx): Bỏ hoàn toàn các lớp nền gradient neon tối cố định; sử dụng khung biểu mẫu `bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-6 md:p-8`, các ô `<input>` dùng `bg-background border border-input text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring`.

#### Step 2.4: Chạy test — xác nhận PASS (`Verify GREEN`) & Kiểm định UI Craft (`Impeccable v4.8.0` + `Taste-Skill v2.5.0`)
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
node "C:\Users\HorizonServers\.gemini\config\skills\taste-skill\scripts\consistency.mjs" d:\Antigravity\TNDNB\ontap-web\components
node "C:\Users\HorizonServers\.gemini\config\skills\taste-skill\scripts\perf.mjs" d:\Antigravity\TNDNB\ontap-web\components
git diff ontap-web/components/ExamQuizScreen.tsx
```
- **Checklist Kiểm định `Impeccable` (`craft`, `polish`, `typeset`, `colorize`):**
  - Mọi tiêu đề `h1..h3` hiển thị đứng (`font-style: normal`), dấu Tiếng Việt rõ nét trên `Be Vietnam Pro`.
  - Chuyển đổi qua lại giữa Sáng (`light`) và Tối (`dark`) bằng `ThemeSwitcher` không còn bất kỳ mảng nền xám/trắng lạc quẻ hay quả cầu neon blur nào.
  - `git diff ontap-web/components/ExamQuizScreen.tsx` bằng `0`.

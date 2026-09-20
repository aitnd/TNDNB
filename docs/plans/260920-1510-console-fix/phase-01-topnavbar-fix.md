# Phase 1: Khắc Phục Lỗi Async JSX Trong TopNavbar & Triển Khai ErrorBoundary

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [task.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🔴 **Critical** / 🟠 **High**

---

## 1. Mục Tiêu & Giá Trị Mang Lại

### 1.1. Mục tiêu
1. Xóa bỏ hoàn toàn lỗi hiển thị `[object Promise]` trên thanh điều hướng chính (TopNavbar), khôi phục hiển thị chính xác số phiên bản ứng dụng (ví dụ: `3.19.2`).
2. Thiết lập rào chắn bảo vệ ErrorBoundary tại tầng layout chính (App.tsx) bọc quanh TopNavbar và AlertMarquee, đảm bảo khi các widget này gặp lỗi runtime bất ngờ, toàn bộ màn hình chính và các luồng làm bài thi của học viên **không bao giờ bị crash trắng xóa (White Screen of Death)**.

### 1.2. Giá trị sản phẩm (Product Value)
- **Độ tin cậy (Reliability)**: Nâng cao tính thẩm mỹ chuyên nghiệp cho hệ thống ôn thi công lập.
- **Tính liên tục của dịch vụ (Continuity)**: Ngay cả khi API GitHub releases gặp lỗi hoặc mạng ngắt kết nối, học viên vẫn tiếp tục học tập và làm bài trắc nghiệm mà không bị gián đoạn.

---

## 2. Các Bước Thực Hiện (TDD Bite-Sized Tasks)

### Task 1.1: Sửa lỗi Async JSX trong TopNavbar.tsx
**1. Verify (Trạng thái hiện tại):**
- getLatestVersion() trả về Promise<string>. Giao diện render trực tiếp {getLatestVersion()} gây lỗi `[object Promise]`.

**2. Implement (GREEN):**
Sửa file `ontap-web/components/TopNavbar.tsx`:
```diff
--- a/ontap-web/components/TopNavbar.tsx
+++ b/ontap-web/components/TopNavbar.tsx
@@ -17,6 +17,14 @@ interface TopNavbarProps {
 const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout }) => {
     const [showChangelog, setShowChangelog] = React.useState(false);
     const [showLinksDropdown, setShowLinksDropdown] = React.useState(false);
     const [showSystemDropdown, setShowSystemDropdown] = React.useState(false);
+    const [latestVersion, setLatestVersion] = React.useState<string>('...');
+
+    React.useEffect(() => {
+        getLatestVersion()
+            .then((ver) => setLatestVersion(ver))
+            .catch(() => setLatestVersion('3.19.2'));
+    }, []);
 
     return (
@@ -165,7 +173,7 @@ const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout
                                 <button
                                     onClick={() => setShowChangelog(true)}
                                     className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                 >
-                                    v{getLatestVersion()}
+                                    v{latestVersion}
                                 </button>
                             </div>
```

**3. Verify PASS:**
- Mở file trên trình duyệt, không còn thấy `[object Promise]`, thấy version hiển thị bình thường.
- `npx tsc --noEmit` pass không lỗi.

### Task 1.2: Tạo mới ErrorBoundary.tsx
**1. Verify:** Dự án hiện chưa có ErrorBoundary nào để bắt lỗi UI.

**2. Implement (GREEN):**
Tạo file mới `ontap-web/components/ErrorBoundary.tsx`:
```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary - ${this.props.name || 'Unknown'}] Đã bắt ngoại lệ:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-3 my-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <span>Một thành phần giao diện tạm thời không khả dụng.</span>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="ml-2 px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded text-xs hover:opacity-80"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**3. Verify PASS:**
- File được tạo, không lỗi cú pháp.

### Task 1.3: Tích hợp ErrorBoundary bọc TopNavbar và AlertMarquee
**1. Verify:** `App.tsx` chưa bọc error boundary.

**2. Implement (GREEN):**
Sửa file `ontap-web/App.tsx`:
```diff
--- a/ontap-web/App.tsx
+++ b/ontap-web/App.tsx
@@ -48,6 +48,7 @@ import ChangeLogModal from './components/ChangelogModal';
 import { useAppInitialization } from './hooks/useAppInitialization';
+import ErrorBoundary from './components/ErrorBoundary';
 
@@ -418,10 +419,12 @@ export function App() {
       {!isMobileApp && (
-        <>
-          <TopNavbar
-            userProfile={userProfile}
-            onNavigate={handleTopNavNavigate}
-            onLogout={handleLogout}
-          />
-          <AlertMarquee />
-        </>
+        <ErrorBoundary name="TopNavAndMarquee">
+          <TopNavbar
+            userProfile={userProfile}
+            onNavigate={handleTopNavNavigate}
+            onLogout={handleLogout}
+          />
+          <AlertMarquee />
+        </ErrorBoundary>
       )}
```

**3. Verify PASS:**
- `npx tsc --noEmit` chạy pass sạch lỗi.
- Layout trên trình duyệt hiển thị bình thường.

### Task 1.4: Commit chung Phase 1
```bash
git add ontap-web/components/TopNavbar.tsx ontap-web/components/ErrorBoundary.tsx ontap-web/App.tsx
git commit -m "fix: resolve async JSX in TopNavbar, add ErrorBoundary"
```

# Phase 1: Khắc Phục Lỗi Async JSX Trong TopNavbar & Triển Khai ErrorBoundary

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [	ask.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🔴 **Critical** / 🟠 **High**

---

## 1. Mục Tiêu & Giá Trị Mang Lại

### 1.1. Mục tiêu
1. Xóa bỏ hoàn toàn lỗi hiển thị [object Promise] trên thanh điều hướng chính (TopNavbar), khôi phục hiển thị chính xác số phiên bản ứng dụng (ví dụ: 3.19.2).
2. Thiết lập rào chắn bảo vệ ErrorBoundary tại tầng layout chính (App.tsx) bọc quanh TopNavbar và AlertMarquee, đảm bảo khi các widget này gặp lỗi runtime bất ngờ, toàn bộ màn hình chính và các luồng làm bài thi của học viên **không bao giờ bị crash trắng xóa (White Screen of Death)**.

### 1.2. Giá trị sản phẩm (Product Value)
- **Độ tin cậy (Reliability)**: Nâng cao tính thẩm mỹ chuyên nghiệp cho hệ thống ôn thi công lập.
- **Tính liên tục của dịch vụ (Continuity)**: Ngay cả khi API GitHub releases gặp lỗi hoặc mạng ngắt kết nối, học viên vẫn tiếp tục học tập và làm bài trắc nghiệm mà không bị gián đoạn.

---

## 2. Bug 1: Sửa Lỗi Render Promise Trong TopNavbar (🔴 Critical)

### 2.1. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
- **Tập tin**: [TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) (Dòng 4, 168)
- **Nguyên nhân kỹ thuật**:
  - Tại dòng 4: import ChangelogModal, { getLatestVersion } from './ChangelogModal';
  - Hàm getLatestVersion() trong [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx#L12-L19) được định nghĩa là một hàm bất đồng bộ:
    `	ypescript
    export const getLatestVersion = async (): Promise<string> => {
      try {
        const releases = await getGitHubReleases();
        return releases.length > 0 ? releases[0].version : 0.0.0;
      } catch (e) {
        return 0.0.0;
      }
    };
    `
  - Tại dòng 168 của TopNavbar.tsx:
    `	sx
    <button
        onClick={() => setShowChangelog(true)}
        className=text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors
    >
        v{getLatestVersion()}
    </button>
    `
  - getLatestVersion() trả về một Promise<string>, không phải là một chuỗi thuần túy (string). Trong React 19 / JSX, việc render trực tiếp một đối tượng Promise sẽ khiến JavaScript chuyển đổi đối tượng này thành chuỗi [object Promise], hoặc có thể gây lỗi invalid React child.

### 2.2. Giải pháp kỹ thuật (Implementation)
Chuyển đổi luồng dữ liệu sang mô hình state bất đồng bộ chuẩn của React:
1. Thêm state latestVersion với giá trị mặc định là '...' (hoặc fallback từ __APP_VERSION__ / '3.19.2').
2. Dùng hook useEffect với dependency array rỗng [] để gọi getLatestVersion() khi component được mount, sau đó lưu kết quả vào state.
3. Thay thế biểu thức {getLatestVersion()} trong JSX bằng {latestVersion}.

#### Code Diff dự kiến:
`diff
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
                                     className=text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors
                                 >
-                                    v{getLatestVersion()}
+                                    v{latestVersion}
                                 </button>
                             </div>
`

---

## 3. Bug 2: Tạo Mới ErrorBoundary & Bọc Vùng Giao Diện Đầu Trang (🟠 High)

### 3.1. Phân tích nguyên nhân gốc rễ
- **Tập tin**: [App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) (Dòng 418-428)
- **Vấn đề**: Hiện tại cụm thanh điều hướng và marquee thông báo:
  `	sx
  {!isMobileApp && (
    <>
      <TopNavbar
        userProfile={userProfile}
        onNavigate={handleTopNavNavigate}
        onLogout={handleLogout}
      />
      <AlertMarquee />
    </>
  )}
  `
  đang nằm trực tiếp bên trong App.tsx mà không có bất kỳ một cơ chế bắt lỗi (ErrorBoundary) nào. Nếu có lỗi bất ngờ xảy ra trong TopNavbar (ví dụ: lỗi parse userProfile, lỗi DOM event) hoặc trong AlertMarquee (lỗi Firestore subscription, lỗi component Marquee), React sẽ unmount toàn bộ cây DOM gốc, khiến học viên chỉ nhìn thấy màn hình trắng xóa.

### 3.2. Giải pháp kỹ thuật

#### Bước 1: Tạo component ErrorBoundary.tsx
Tạo mới tập tin [ErrorBoundary.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ErrorBoundary.tsx):
`	sx
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
    console.error([ErrorBoundary - ] Đã bắt ngoại lệ:, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className=p-3 my-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between>
          <span>Một thành phần giao diện tạm thời không khả dụng.</span>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className=ml-2 px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded text-xs hover:opacity-80
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
`

#### Bước 2: Tích hợp vào App.tsx
Bọc cụm TopNavbar và AlertMarquee bằng ErrorBoundary:
`diff
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
+        <ErrorBoundary name=TopNavAndMarquee>
+          <TopNavbar
+            userProfile={userProfile}
+            onNavigate={handleTopNavNavigate}
+            onLogout={handleLogout}
+          />
+          <AlertMarquee />
+        </ErrorBoundary>
       )}
`

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu Phase 1

1. **Kiểm tra biên dịch tĩnh (Static Type Check)**:
   `ash
   cd d:\Antigravity\TNDNB\ontap-web
   npx tsc --noEmit
   `
   *Yêu cầu*: Hoàn thành với mã thoát 0, không có lỗi type ở TopNavbar.tsx, ErrorBoundary.tsx, và App.tsx.

2. **Kiểm tra hiển thị Version**:
   - Mở ứng dụng trên trình duyệt.
   - Quan sát góc trên bên phải thanh TopNavbar:
     - Trước khi sửa: hiển thị [object Promise].
     - Sau khi sửa: hiển thị 3.19.2 (hoặc số phiên bản lấy từ GitHub release gần nhất).
   - Nhấp vào nút phiên bản: Modal Changelog vẫn mở bình thường.

3. **Kiểm tra khả năng chịu lỗi (Fault-tolerance Test)**:
   - Thử nghiệm chèn một 	hrow new Error(Test Crash) tạm thời bên trong TopNavbar.tsx.
   - Kết quả mong đợi: Phần nội dung ứng dụng (AppRoutes) vẫn hiển thị đầy đủ, không bị màn hình trắng; ErrorBoundary bắt lỗi và render fallback UI thanh lịch.

---

## 5. Danh Sách Tập Tin Tác Động Trong Phase 1
- [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
- [ontap-web/components/ErrorBoundary.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ErrorBoundary.tsx) *(Tạo mới)*
- [ontap-web/App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx)

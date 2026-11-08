# Phase 04: Tối Ưu Gợi Ý Cài Đặt App PWA Cho Cả Khách Chưa Đăng Nhập & Học Viên Trên Mobile (App Name: "Giáo dục Ninh Bình")

> **Mã kế hoạch**: `261108-2025-authoritative-changelog-and-recent-plans-sync`  
> **Tài liệu**: Đặc tả kỹ thuật Phase 04 (Global PWA Install Experience for Guests & Authenticated Users, Rebranded to "Giáo dục Ninh Bình")  
> **Tệp tác động**:
> - [`ontap-web/public/manifest.json`](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json) & [`public/ontap/manifest.json`](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json) (đổi `name` & `short_name` thành `"Giáo dục Ninh Bình"`)
> - [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html) (thêm meta tags iOS Apple PWA & `application-name`)
> - [`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx) (tiêu đề `"Cài đặt Giáo dục Ninh Bình vào màn hình chính"`, module-level prompt capture, dual guides cho iOS & Android)
> - [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) (tích hợp banner cho khách truy cập lần đầu)
> - [`ontap-web/components/LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx) (tích hợp banner cho khách chọn hạng bằng)
> - [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) (tinh chỉnh vị trí đồng bộ)
> - [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) & [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md) (ghi nhận tính năng)  
> **Mục tiêu**: Đưa trải nghiệm cài đặt PWA tiếp cận 100% người dùng di động (bao gồm cả khách vãng lai chưa đăng nhập), đổi tên App PWA khi cài ra màn hình chính thành chuẩn nhận diện **"Giáo dục Ninh Bình"**, giải quyết triệt để vấn đề mất sự kiện `beforeinstallprompt`, hỗ trợ hướng dẫn 3 bước thông minh cho cả iOS Safari và Android In-App Browser (Zalo, Messenger, Facebook), đồng thời bảo toàn tính tập trung tuyệt đối trong phòng thi.

---

## 1. Phân Tích Hiện Trạng & Yêu Cầu Đổi Tên App

### 1.1 Vấn đề Nhận Diện Tên Ứng Dụng (App Naming)
- **Hiện tại**: File `manifest.json` đang để `"short_name": "TNDNB"`, `"name": "TNDNB Ôn Thi"`.
- **Yêu cầu mới**: Sau khi người dùng cài đặt ra màn hình chính điện thoại (Home Screen), icon ứng dụng phải hiển thị tên thương hiệu trang trọng và thân thiện: **"Giáo dục Ninh Bình"**.
- **Giải pháp**:
  1. Cập nhật đồng bộ cả 2 file `manifest.json` (`ontap-web/public/manifest.json` và `public/ontap/manifest.json`):
     ```json
     {
       "name": "Giáo dục Ninh Bình",
       "short_name": "Giáo dục Ninh Bình",
       "start_url": "/ontap/",
       "display": "standalone",
       "background_color": "#ffffff",
       "theme_color": "#3b82f6",
       "icons": [
         { "src": "/ontap/icon-192.png", "sizes": "192x192", "type": "image/png" },
         { "src": "/ontap/icon-512.png", "sizes": "512x512", "type": "image/png" }
       ]
     }
     ```
  2. Bổ sung các meta tags tương thích sâu với iOS Safari và WebKit trong `ontap-web/index.html`:
     ```html
     <meta name="apple-mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-status-bar-style" content="default" />
     <meta name="apple-mobile-web-app-title" content="Giáo dục Ninh Bình" />
     <meta name="application-name" content="Giáo dục Ninh Bình" />
     <link rel="apple-touch-icon" href="/ontap/icon-192.png" />
     ```

### 1.2 Bỏ Sót Khách Vãng Lai (Guest Blind Spot)
- Component [`PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx) hiện chỉ được gọi tại [`Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx).
- Hàng ngàn thí sinh, người học mới truy cập qua link Zalo/Facebook vào `/ontap` ([`WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx)) hoặc chọn hạng bằng ([`LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx)) hoàn toàn không nhận được banner gợi ý cài đặt.

### 1.3 Mất Sự Kiện `beforeinstallprompt` (Lifecycle Race Condition)
- `beforeinstallprompt` kích hoạt ngay khi nạp trang. Khi component mount trễ, biến sự kiện đã bị bỏ lỡ.
- Bắt sự kiện tại **Module Top-Level** (`window.addEventListener('beforeinstallprompt', ...)`) và lưu vào `(window as any).__deferredPwaPrompt`.

---

## 2. Kiến Trúc & Thiết Kế Luồng Cài Đặt 3 Kịch Bản

```mermaid
flowchart TD
    subgraph BrowserLifecycle ["Vòng Đời Trình Duyệt Mobile"]
        PageLoad["Tải trang web lần đầu"]
        TopLevelCapture["Bắt sự kiện 'beforeinstallprompt' ở Top-Level Module<br/>(Lưu vào window.__deferredPwaPrompt)"]
    end

    subgraph UserContext ["Bối Cảnh Người Dùng"]
        GuestUser["Khách chưa đăng nhập<br/>(/ontap WelcomeModal hoặc LicenseSelectionScreen)"]
        AuthUser["Học viên đã đăng nhập<br/>(Dashboard)"]
        ExamUser["Thí sinh đang thi<br/>(ExamQuizScreen / QuizScreen)"]
    end

    subgraph BannerLogic ["PwaInstallBanner Engine"]
        CheckMobile{"Là Thiết Bị Mobile &<br/>Chưa Cài Standalone?"}
        CheckDismiss{"Chưa bị tắt<br/>trong 7 ngày?"}
        RenderBanner["Hiển Thị Banner:<br/>'Cài đặt Giáo dục Ninh Bình vào màn hình chính'"]
        HideBanner["Ẩn Banner"]
    end

    subgraph InstallFlow ["3 Kịch Bản Cài Đặt Khi Bấm Nút"]
        HasNativePrompt{"Có window.__deferredPwaPrompt?"}
        NativeInstall["1. Gọi native prompt()<br/>(Android Chrome / Edge / Samsung)"]
        IsIosCheck{"Là thiết bị iOS?"}
        IosGuide["2. Mở Modal Hướng dẫn iOS 3 bước<br/>(Nút Share ➔ Thêm vào MH chính ➔ Thêm)"]
        AndroidGuide["3. Mở Modal Hướng dẫn Android Fallback 3 bước<br/>(Menu ⋮ ➔ Thêm vào MH chính / Mở bằng Chrome)"]
    end

    PageLoad --> TopLevelCapture
    GuestUser --> CheckMobile
    AuthUser --> CheckMobile
    ExamUser -->|Tuyệt đối cấm hiển thị| HideBanner

    CheckMobile -- Không --> HideBanner
    CheckMobile -- Có --> CheckDismiss
    CheckDismiss -- Đã đóng gần đây --> HideBanner
    CheckDismiss -- Chưa đóng --> RenderBanner

    RenderBanner -->|Bấm [+ Thêm vào MH chính]| HasNativePrompt
    HasNativePrompt -- Có --> NativeInstall
    HasNativePrompt -- Không --> IsIosCheck
    IsIosCheck -- iOS --> IosGuide
    IsIosCheck -- Android / In-App --> AndroidGuide
```

---

## 3. Chi Tiết Triển Khai Kỹ Thuật

### 3.1 Bắt Sự Kiện Module Top-Level trong `PwaInstallBanner.tsx`
```typescript
// Bắt sự kiện ngay khi file script được tải vào bộ nhớ trình duyệt
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    (window as any).__deferredPwaPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
  });
}
```

### 3.2 Tiêu Đề & Nội Dung Banner Thống Nhất Thương Hiệu
- **Tiêu đề**: `"Cài đặt Giáo dục Ninh Bình vào màn hình chính"`
- **Mô tả**: `"Trải nghiệm toàn màn hình như ứng dụng di động, tải nhanh và ôn thi mượt mà hơn."`
- **Nút hành động chính**: `[+ Thêm vào MH chính]` (Gradient xanh dương nổi bật)
- **Nút đóng**: `[✕]` (Lưu `pwa_dismissed` timestamp vào `localStorage`, ẩn trong 7 ngày)

### 3.3 Modal Hướng Dẫn Kép (iOS Safari & Android Fallback)
1. **Modal iOS Safari**:
   - Bước 1: Nhấn vào biểu tượng **Chia sẻ** (Share icon ⎋) ở thanh công cụ dưới trình duyệt Safari.
   - Bước 2: Cuộn xuống danh sách tùy chọn và nhấn **"Thêm vào MH chính"** (Add to Home Screen ➕).
   - Bước 3: Nhấn **"Thêm"** (Add) ở góc trên bên phải để xác nhận tên **"Giáo dục Ninh Bình"**.
2. **Modal Android Fallback (Zalo / In-app WebView / Chrome Menu)**:
   - Bước 1: Nhấn vào biểu tượng **Menu 3 chấm** (`⋮`) ở góc trên bên phải màn hình.
   - Bước 2: Chọn **"Thêm vào màn hình chính"** (hoặc chọn **"Mở bằng Chrome"** nếu đang ở trong Zalo/Messenger).
   - Bước 3: Xác nhận **"Thêm"** để đưa ứng dụng **"Giáo dục Ninh Bình"** ra màn hình chính điện thoại.

---

## 4. Các Vị Trí Tích Hợp Trên Hệ Thống

| Vị trí | Tệp tin | Mục đích & Trải nghiệm |
|---|---|---|
| **Màn hình Welcome (Khách mới)** | [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) | Khách vãng lai lần đầu mở web lập tức thấy banner cài đặt ở đầu modal, kích thích thêm App ra màn hình chính ngay. |
| **Màn hình Chọn Hạng Bằng (Khách)** | [`ontap-web/components/LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx) | Khách chưa đăng nhập chuẩn bị vào thi thử thấy banner nhắc nhở cài đặt tiện lợi. |
| **Bàn làm việc Học viên (Đã đăng nhập)** | [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) | Học viên chính thức ôn luyện hàng ngày có shortcut truy cập nhanh 1 chạm. |
| **Phòng thi & Luyện câu hỏi** | [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx), [`QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) | **TUYỆT ĐỐI KHÔNG HIỂN THỊ** để đảm bảo 100% sự tập trung, không che khuất thời gian và câu hỏi thi. |

---

## 5. Danh Sách Nhiệm Vụ Chi Tiết (TDD Implementation Steps)

### Task 4: Tối Ưu Gợi Ý Cài Đặt App PWA "Giáo dục Ninh Bình" Toàn Hệ Thống

**Files:**
- Create: [`scripts/pwa-install-banner.test.ts`](file:///d:/Antigravity/TNDNB/scripts/pwa-install-banner.test.ts)
- Modify: [`ontap-web/public/manifest.json`](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json)
- Modify: [`public/ontap/manifest.json`](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json)
- Modify: [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html)
- Modify: [`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx)
- Modify: [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx)
- Modify: [`ontap-web/components/LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx)
- Modify: [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx)
- Modify: [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) & [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md)

---

- [ ] **Step 4.1: Viết test thất bại (RED)**
  Tạo tệp [`scripts/pwa-install-banner.test.ts`](file:///d:/Antigravity/TNDNB/scripts/pwa-install-banner.test.ts) với nội dung kiểm thử đầy đủ:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import fs from 'node:fs';
  import path from 'node:path';

  describe('Global PWA Install Banner & App Branding "Giáo dục Ninh Bình" (Phase 04 Verification)', () => {
    const rootDir = process.cwd();

    it('TC-CP07: manifest.json và public/ontap/manifest.json đổi tên ứng dụng thành "Giáo dục Ninh Bình"', () => {
      const webManifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'ontap-web/public/manifest.json'), 'utf8'));
      const portalManifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'public/ontap/manifest.json'), 'utf8'));

      expect(webManifest.name).toBe('Giáo dục Ninh Bình');
      expect(webManifest.short_name).toBe('Giáo dục Ninh Bình');
      expect(portalManifest.name).toBe('Giáo dục Ninh Bình');
      expect(portalManifest.short_name).toBe('Giáo dục Ninh Bình');
    });

    it('TC-CP08: ontap-web/index.html có đầy đủ meta tags PWA cho iOS & Android với tên "Giáo dục Ninh Bình"', () => {
      const htmlCode = fs.readFileSync(path.resolve(rootDir, 'ontap-web/index.html'), 'utf8');

      expect(htmlCode).toContain('apple-mobile-web-app-title" content="Giáo dục Ninh Bình"');
      expect(htmlCode).toContain('application-name" content="Giáo dục Ninh Bình"');
      expect(htmlCode).toContain('apple-mobile-web-app-capable" content="yes"');
      expect(htmlCode).toContain('apple-touch-icon');
    });

    it('TC-CP09: PwaInstallBanner được tích hợp vào WelcomeModal, LicenseSelectionScreen và Dashboard', () => {
      const welcomeModal = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/WelcomeModal.tsx'), 'utf8');
      const licenseSelect = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/LicenseSelectionScreen.tsx'), 'utf8');
      const dashboard = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx'), 'utf8');

      expect(welcomeModal).toContain('PwaInstallBanner');
      expect(licenseSelect).toContain('PwaInstallBanner');
      expect(dashboard).toContain('PwaInstallBanner');
    });

    it('TC-CP10: PwaInstallBanner TUYỆT ĐỐI không được gắn vào ExamQuizScreen và QuizScreen để tránh phân tâm thi cử', () => {
      const examQuiz = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'), 'utf8');
      const practiceQuiz = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/QuizScreen.tsx'), 'utf8');

      expect(examQuiz).not.toContain('PwaInstallBanner');
      expect(practiceQuiz).not.toContain('PwaInstallBanner');
    });

    it('TC-CP11: PwaInstallBanner có tiêu đề "Cài đặt Giáo dục Ninh Bình vào màn hình chính" và hỗ trợ 3 luồng cài đặt', () => {
      const bannerCode = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/PwaInstallBanner.tsx'), 'utf8');
      
      expect(bannerCode).toContain('Cài đặt Giáo dục Ninh Bình vào màn hình chính');
      expect(bannerCode).toMatch(/__deferredPwaPrompt|beforeinstallprompt/);
      expect(bannerCode).toContain('Thêm vào MH chính');
      expect(bannerCode).toMatch(/Android|Hướng dẫn cài đặt|Cài đặt ứng dụng/);
    });
  });
  ```

- [ ] **Step 4.2: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/pwa-install-banner.test.ts
  ```
  *Kỳ vọng*: Test FAIL vì `manifest.json` hiện đang mang tên cũ, `index.html` thiếu meta tags, `PwaInstallBanner.tsx` chưa đổi tiêu đề và chưa tích hợp vào `WelcomeModal.tsx` và `LicenseSelectionScreen.tsx`.

- [ ] **Step 4.3: Implement — Cập nhật Manifest (GREEN)**
  Cập nhật cả [`ontap-web/public/manifest.json`](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json) và [`public/ontap/manifest.json`](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json):
  ```json
  {
    "name": "Giáo dục Ninh Bình",
    "short_name": "Giáo dục Ninh Bình",
    "start_url": "/ontap/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#004A99",
    "icons": [
      {
        "src": "/ontap/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/ontap/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

- [ ] **Step 4.4: Implement — Bổ sung Meta Tags iOS & Application Name (GREEN)**
  Trong `<head>` của [`ontap-web/index.html`](file:///d:/Antigravity/TNDNB/ontap-web/index.html), bổ sung các thẻ meta chuẩn PWA:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Giáo dục Ninh Bình" />
  <meta name="application-name" content="Giáo dục Ninh Bình" />
  <link rel="apple-touch-icon" href="/ontap/icon-192.png" />
  ```

- [ ] **Step 4.5: Implement — Nâng Cấp Toàn Diện `PwaInstallBanner.tsx` (GREEN)**
  Thay thế mã nguồn [`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx):
  ```tsx
  import React, { useState, useEffect } from 'react';
  import { Smartphone, X, Share, PlusSquare, MoreVertical } from 'lucide-react';
  import { triggerHaptic } from '../utils/nativeUX';

  const DISMISS_KEY = 'ontap_pwa_prompt_dismissed_until';
  const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày
  const DISMISS_EVENT = 'ontap-pwa-banner-dismissed';

  // 1. Module-Level Capture: Bắt sự kiện beforeinstallprompt ngay khi script nạp vào trình duyệt
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      (window as any).__deferredPwaPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
    });
  }

  export const PwaInstallBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIos, setIsIos] = useState(false);
    const [showIosGuide, setShowIosGuide] = useState(false);
    const [showAndroidGuide, setShowAndroidGuide] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;

      // Kiểm tra chế độ PWA Standalone
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Kiểm tra cờ ẩn 7 ngày
      try {
        const dismissedUntil = localStorage.getItem(DISMISS_KEY);
        if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
          return;
        }
      } catch {
        // Bỏ qua lỗi localStorage
      }

      // Nhận diện iOS
      const userAgent = window.navigator.userAgent || '';
      const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      setIsIos(isIosDevice);

      // Đọc prompt có sẵn từ module top-level
      if ((window as any).__deferredPwaPrompt) {
        setDeferredPrompt((window as any).__deferredPwaPrompt);
        setIsVisible(true);
      } else if (isIosDevice) {
        setIsVisible(true);
      } else {
        // Fallback hiển thị cho Android / Mobile để hướng dẫn qua menu nếu không có prompt
        setIsVisible(true);
      }

      // Lắng nghe sự kiện prompt đến sau
      const onPromptAvailable = () => {
        if ((window as any).__deferredPwaPrompt) {
          setDeferredPrompt((window as any).__deferredPwaPrompt);
          setIsVisible(true);
        }
      };

      // Lắng nghe đồng bộ đóng banner từ các component khác
      const onBannerDismissed = () => {
        setIsVisible(false);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsVisible(false);
        setDeferredPrompt(null);
        (window as any).__deferredPwaPrompt = null;
      };

      window.addEventListener('pwa-prompt-available', onPromptAvailable);
      window.addEventListener(DISMISS_EVENT, onBannerDismissed);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('pwa-prompt-available', onPromptAvailable);
        window.removeEventListener(DISMISS_EVENT, onBannerDismissed);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }, []);

    const handleInstallClick = async () => {
      triggerHaptic('light');

      if (isIos) {
        setShowIosGuide(true);
        setShowAndroidGuide(false);
        return;
      }

      const promptToUse = deferredPrompt || (window as any).__deferredPwaPrompt;
      if (promptToUse) {
        promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsVisible(false);
          (window as any).__deferredPwaPrompt = null;
        }
        setDeferredPrompt(null);
      } else {
        // Android fallback / In-app WebView: Mở hướng dẫn Android 3 bước
        setShowAndroidGuide(true);
        setShowIosGuide(false);
      }
    };

    const handleDismiss = () => {
      triggerHaptic('light');
      try {
        const hideUntil = Date.now() + DISMISS_DURATION_MS;
        localStorage.setItem(DISMISS_KEY, String(hideUntil));
      } catch {
        // Bỏ qua lỗi
      }
      setIsVisible(false);
      // Phát sự kiện đồng bộ ẩn tất cả các banner khác
      window.dispatchEvent(new CustomEvent(DISMISS_EVENT));
    };

    if (!isVisible || isInstalled) {
      return null;
    }

    return (
      <div className="w-full lg:hidden mb-3 animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-4 text-white shadow-md border border-white/20">
          {/* Nút đóng ✕ */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
            aria-label="Đóng thông báo"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">
                Cài đặt Giáo dục Ninh Bình vào màn hình chính
              </h3>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                Trải nghiệm toàn màn hình như ứng dụng di động, tải siêu tốc và ôn thi mượt mà hơn.
              </p>
            </div>
          </div>

          {/* Nút bấm Hành Động Kích Thước Lớn */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-sm hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <PlusSquare size={17} />
              <span>Thêm vào MH chính</span>
            </button>
          </div>

          {/* Modal/Sheet Hướng Dẫn iOS Safari */}
          {showIosGuide && (
            <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white space-y-2 animate-in fade-in">
              <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                <span>🍎 Hướng dẫn Thêm vào màn hình chính trên iPhone/iPad:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-white/95 pl-1 leading-relaxed">
                <li>
                  Chạm vào biểu tượng <Share className="inline w-3.5 h-3.5 mx-1" /> <strong>Chia sẻ</strong> ở thanh dưới trình duyệt Safari.
                </li>
                <li>
                  Cuộn xuống chọn <strong>&ldquo;Thêm vào MH chính&rdquo;</strong> (Add to Home Screen).
                </li>
                <li>
                  Chạm vào <strong>&ldquo;Thêm&rdquo;</strong> ở góc trên bên phải để xác nhận tên <strong>Giáo dục Ninh Bình</strong>.
                </li>
              </ol>
              <button
                onClick={() => setShowIosGuide(false)}
                className="mt-2 text-[11px] underline text-white/80 hover:text-white block text-center w-full py-1"
              >
                Đã hiểu, thu gọn hướng dẫn
              </button>
            </div>
          )}

          {/* Modal/Sheet Hướng Dẫn Android Fallback / In-App Browser */}
          {showAndroidGuide && (
            <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white space-y-2 animate-in fade-in">
              <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                <span>🤖 Hướng dẫn cài đặt ứng dụng trên Android:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-white/95 pl-1 leading-relaxed">
                <li>
                  Chạm vào biểu tượng Menu 3 chấm <MoreVertical className="inline w-3.5 h-3.5 mx-1" /> ở góc trên bên phải trình duyệt.
                </li>
                <li>
                  Chọn <strong>&ldquo;Cài đặt ứng dụng&rdquo;</strong> hoặc <strong>&ldquo;Thêm vào màn hình chính&rdquo;</strong> (hoặc chọn <em>Mở bằng Chrome</em> nếu đang ở Zalo/Facebook).
                </li>
                <li>
                  Nhấn <strong>&ldquo;Cài đặt&rdquo;</strong> hoặc <strong>&ldquo;Thêm&rdquo;</strong> để hoàn tất đưa icon <strong>Giáo dục Ninh Bình</strong> ra màn hình.
                </li>
              </ol>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="mt-2 text-[11px] underline text-white/80 hover:text-white block text-center w-full py-1"
              >
                Đã hiểu, thu gọn hướng dẫn
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PwaInstallBanner;
  ```

- [ ] **Step 4.6: Implement — Tích Hợp Vào `WelcomeModal.tsx` & `LicenseSelectionScreen.tsx` (GREEN)**
  - Trong [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx), import `PwaInstallBanner` và đặt ở ngay đầu phần nội dung cuộn bên dưới modal header:
    ```tsx
    import { PwaInstallBanner } from './PwaInstallBanner';
    // ...
    {/* PWA Banner cho khách truy cập lần đầu */}
    <div className="px-6 pt-4 pb-0">
      <PwaInstallBanner />
    </div>
    ```
  - Trong [`ontap-web/components/LicenseSelectionScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx), import `PwaInstallBanner` và đặt ngay phía trên danh sách các thẻ hạng bằng thi:
    ```tsx
    import { PwaInstallBanner } from './PwaInstallBanner';
    // ...
    {/* PWA Banner cho khách chọn hạng bằng */}
    <PwaInstallBanner />
    ```

- [ ] **Step 4.7: Implement — Bổ Sung Ghi Chú Tính Năng Vào CHANGELOG (GREEN)**
  Đồng bộ nội dung tính năng PWA "Giáo dục Ninh Bình" vào mục `[3.22.0]` trong [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) và [`CHANGELOG_DEV.md`](file:///d:/Antigravity/TNDNB/CHANGELOG_DEV.md).

- [ ] **Step 4.8: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/pwa-install-banner.test.ts
  ```
  *Kỳ vọng*: Toàn bộ 5 test cases (`TC-CP07` đến `TC-CP11`) đều PASS 100%.

- [ ] **Step 4.9: Commit**
  ```bash
  git add ontap-web/public/manifest.json public/ontap/manifest.json ontap-web/index.html ontap-web/components/PwaInstallBanner.tsx ontap-web/components/WelcomeModal.tsx ontap-web/components/LicenseSelectionScreen.tsx ontap-web/components/Dashboard.tsx scripts/pwa-install-banner.test.ts CHANGELOG.md CHANGELOG_DEV.md
  git commit -m "feat(pwa): rebrand app to 'Giáo dục Ninh Bình', add module-level prompt capture and universal install banner for guests and students"
  ```


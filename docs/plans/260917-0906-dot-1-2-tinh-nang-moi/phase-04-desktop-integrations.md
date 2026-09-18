# Phase 04: Platform Integrations (Web & Win)

**Mục tiêu:** Cài đặt các tính năng nền tảng riêng biệt cho Web (PWA) và Windows (Electron, IPC, Sync).
**Dependencies:** Phase 03 hoàn thành.
**Commit:** Gộp commit cuối Phase.

---

## Implementation Steps (TDD Enriched)

### Task 1: PWA Manifest (Feature 12)

**Files:**
- Create: `ontap-web/public/manifest.json`
- Create: Tạo icon `ontap-web/public/icon-192.png` và `ontap-web/public/icon-512.png` từ `logo1.ico`
  (⚠️ ĐẶT Ở `public/` GỐC — Vite `emptyOutDir: true` xóa sạch output `../public/ontap`, để nhầm vào `public/ontap/` là mất file sau build)
- Modify: `ontap-web/index.html`

**Interfaces:**
- Consumes: PWA Manifest API

- [ ] **Step 1.1: Tạo manifest.json và Icons**
  - Chuyển đổi `logo1.ico` thành 2 file png 192x192 và 512x512 đặt vào thư mục `public/` GỐC của ontap-web (sau build thành `/ontap/icon-*.png`, khớp `src` trong manifest)
  ```json
  // ontap-web/public/manifest.json
  {
    "name": "TNDNB Ôn Thi",
    "short_name": "TNDNB",
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

- [ ] **Step 1.2: Đăng ký PWA (Installable)**
  - Ensure `manifest.json` is linked in `index.html`:
    `<link rel="manifest" href="/ontap/manifest.json" />`
  - *(Ghi chú: Tính năng Notification (F8) đã được làm ở Phase 03 dùng Local Notification, không cần setup Server Push ở bước này)*

- [ ] **Step 1.3: Service Worker tối thiểu (BẮT BUỘC để hiện nút Cài đặt)**
  - Trình duyệt chỉ hiện prompt cài đặt khi có SW (kèm manifest + icons). Tạo file RIÊNG `ontap-web/public/sw-pwa.js` (không đụng `sw.js` quảng cáo), chỉ fetch passthrough, không push server.
  - Đăng ký ĐÚNG 1 lần trong `useEffect` (để trần ngoài component là đăng ký lại mỗi render):
  ```tsx
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ontap/sw-pwa.js').catch(() => {});
    }
  }, []);
  ```
  - Trình duyệt chỉ hiện prompt cài đặt khi có SW (kèm manifest + icons). Tạo file RIÊNG `ontap-web/public/sw-pwa.js` (không đụng `sw.js` quảng cáo), chỉ fetch passthrough, không push server:
  ```javascript
  // ontap-web/public/sw-pwa.js
  self.addEventListener('install', (e) => self.skipWaiting());
  self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', (e) => { /* passthrough mặc định, không cache */ });
  ```

### Task 2: Electron System Tray & Window Controls (Feature 15, 16)

**Files:**
- Modify: `ontap-win/electron/main.cjs`

**Interfaces:**
- Consumes: Electron `Tray`, `Menu`, `globalShortcut`

> ⚠️ **Lưu ý kiến trúc `main.cjs`:**
> - `mainWindow` được khai báo **cục bộ** trong hàm `createWindow()` (dòng 45).
> - Icon thật: `path.join(__dirname, '../public/assets/img/logo1.ico')` (dòng 54).
> - Cần trả `mainWindow` ra biến module-level hoặc truyền tham số.

- [ ] **Step 2.1: Kéo mainWindow ra module-level, chặn instance thứ 2 & Implement Tray**
  ```javascript
  // ontap-win/electron/main.cjs
  // Đầu file — thêm vào require hiện có (dòng 1):
  const { app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage, globalShortcut } = require('electron');
  
  // Chặn mở app 2 lần (tránh 2 cửa sổ + 2 khay + 2 bộ hẹn giờ).
  // Pattern chuẩn Electron: if + quit ở top-level (KHÔNG dùng return ngoài function — lỗi syntax CJS).
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }
  
  let tray = null;
  let win = null; // Module-level reference

  // Trong createWindow(): GIỮ NGUYÊN biến cục bộ `const mainWindow` hiện có
  // (đừng rename — hàng chục closure bên dưới đang dùng nó). Chỉ thêm 2 dòng:
  function createWindow() {
    const mainWindow = new BrowserWindow({ /* giữ nguyên config hiện tại */ });
    // ... giữ nguyên code cũ ...
    
    // Thêm cuối createWindow():
    win = mainWindow; // Đồng bộ ra biến module để shortcut/second-instance dùng
    createTray(mainWindow);
    return mainWindow;
  }
  
  function createTray(mainWindow) {
    const iconPath = path.join(__dirname, '../public/assets/img/logo1.ico');
    tray = new Tray(nativeImage.createFromPath(iconPath));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Mở ứng dụng', click: () => mainWindow.show() },
      { label: 'Thoát', click: () => { app.isQuitting = true; app.quit(); } }
    ]);
    tray.setToolTip('TNDNB - Ôn Thi');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => mainWindow.show());
    
    // Thu nhỏ xuống khay thay vì tắt
    mainWindow.on('close', (e) => {
      if (!app.isQuitting) {
        e.preventDefault();
        mainWindow.hide();
      }
    });
  }
  ```

- [ ] **Step 2.2: Implement Global Shortcut + Cleanup**
  ```javascript
  // ontap-win/electron/main.cjs
  // Trong app.whenReady callback (SAU createWindow):
  app.whenReady().then(() => {
    createWindow(); // dùng biến module `win`, KHÔNG tạo biến local mới tên mainWindow
    
    // Ctrl+Alt+T (KHÔNG dùng Ctrl+Shift+T vì trùng phím mở lại tab đã đóng của Chrome)
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      if (!win) return;
      if (win.isVisible()) win.hide();
      else { win.show(); win.focus(); }
    });
  });

  // Focus cửa sổ cũ khi user mở app lần 2 (thay vì im lặng thoát):
  app.on('second-instance', () => {
    if (win) { win.show(); win.focus(); }
  });
  
  // BẮT BUỘC cleanup khi thoát:
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
  ```

### Task 3: Sync Data Chủ Động (Feature 17)

**Files:**
- Modify: `ontap-win/services/dataService.ts`
- Modify: `ontap-win/services/syncService.ts`
- Modify: `ontap-win/components/ChangelogModal.tsx` (nhét block cập nhật đề vào modal sẵn có — KHÔNG tạo file mới)
- Modify: `ontap-win/App.tsx` (check lúc khởi động)

**Interfaces:**
- Consumes: `supabase` (import từ `./supabaseClient`)

- [ ] **Step 3.1: Hàm check version an toàn (dataService)**
  ```typescript
  // ontap-win/services/dataService.ts
  import { supabase } from './supabaseClient';
  
  export const shouldUpdateQuestions = async (): Promise<boolean> => {
    try {
      // ⚠️ Đã fix lỗi nuốt theo review: Query an toàn đếm tổng câu hỏi hoặc lấy created_at mới nhất
      // để tránh crash nếu bảng không có cột updated_at
      const { data, error } = await supabase
        .from('questions')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        // Fallback kiểm tra count nếu rỗng
        const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
        const localCount = parseInt(localStorage.getItem('questions_last_count') || '0', 10);
        return (count || 0) > localCount;
      }
      
      const serverTs = new Date(data.created_at).getTime();
      const localTs = parseInt(localStorage.getItem('questions_last_sync') || '0', 10);
      
      return serverTs > localTs;
    } catch { return false; }
  };
  ```

- [ ] **Step 3.2: Hàm thực hiện Tải Dữ Liệu (syncService)**
  ```typescript
  // ontap-win/services/syncService.ts
  import { supabase } from './supabaseClient'; 
  import { saveLicensesOffline } from './offlineService';
  import type { License } from '../types';

  // Định nghĩa interface để loại bỏ hoàn toàn 'any'
  interface AnswerRow { id: string; text: string }
  interface QuestionRow { id: string; text: string; image?: string | null; correct_answer_id: string; answers?: AnswerRow[] | null }
  interface SubjectRow { id: string; name: string; questions?: QuestionRow[] | null }
  interface LicenseRow { id: string; name: string; subjects?: SubjectRow[] | null }

  export const fetchAndSaveQuestions = async (): Promise<boolean> => {
    if (!navigator.onLine) return false;
    try {
      const { data } = await supabase
        .from('licenses')
        .select(`id, name, display_order, subjects (id, name, display_order, questions (*, answers (id, text)))`)
        .order('display_order', { ascending: true });

      if (data) {
        const licenses: License[] = (data as LicenseRow[]).map((license) => ({
          id: license.id, name: license.name,
          subjects: (license.subjects || []).map((s) => ({
            id: s.id, name: s.name,
            questions: (s.questions || []).map((q) => ({
              id: q.id, text: q.text, image: q.image ?? undefined,
              correctAnswerId: q.correct_answer_id,
              answers: (q.answers || []).map((a) => ({ id: a.id, text: a.text })),
            })),
          })),
        }));
        await saveLicensesOffline(licenses);
        
        // Lưu lại mốc thời gian và tổng câu để đối chiếu
        localStorage.setItem('questions_last_sync', Date.now().toString());
        localStorage.setItem('questions_last_count', licenses.flatMap(l => l.subjects.flatMap(s => s.questions)).length.toString());
        return true;
      }
      return false;
    } catch { return false; }
  };
  ```

- [ ] **Step 3.3: Thêm block cập nhật đề vào ChangelogModal sẵn có**
  - **Không tạo file mới.** Modal mở bằng nút version trên TopNavbar chính là `ontap-win/components/ChangelogModal.tsx` (đã có sẵn flow check/download update app) — nhét thêm 1 block "Cập nhật Gói Đề Thi" ngay dưới block cập nhật app, tái dùng layout/nút của nó.
  - Sửa `ontap-win/components/ChangelogModal.tsx`:
  ```tsx
  import React, { useState } from 'react'; // Bổ sung import React chuẩn (file hiện thiếu)
  import { shouldUpdateQuestions } from '../services/dataService';
  import { fetchAndSaveQuestions } from '../services/syncService';

  // Bên trong component ChangelogModal, thêm state (cạnh các state updateStatus sẵn có):
  const [dataSyncStatus, setDataSyncStatus] = useState<'idle' | 'checking' | 'has_update' | 'updating' | 'latest' | 'error'>('idle');

  const handleCheckDataUpdate = async () => {
    setDataSyncStatus('checking');
    const needsUpdate = await shouldUpdateQuestions();
    setDataSyncStatus(needsUpdate ? 'has_update' : 'latest');
  };

  const handleUpdateData = async () => {
    setDataSyncStatus('updating');
    const success = await fetchAndSaveQuestions();
    setDataSyncStatus(success ? 'latest' : 'error');
  };

  // JSX thêm vào bên dưới block "Cập nhật ứng dụng" trong ChangelogModal
  // (BỎ comment — code dưới chạy nguyên văn, chỉ đổi class cho khớp theme modal):
  /*
  <div className="mt-6 border-t border-slate-700 pt-6">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🔄 Cập nhật Gói Đề Thi</h3>
    <div className="flex gap-4">
      <div className="flex-1 bg-slate-800 p-4 rounded-lg">
        <div className="text-slate-400 text-sm">Lần cập nhật trước</div>
        <div className="font-mono mt-1 text-white">
          {localStorage.getItem('questions_last_sync') 
            ? new Date(parseInt(localStorage.getItem('questions_last_sync')!)).toLocaleDateString('vi-VN') 
            : 'Chưa từng đồng bộ'}
        </div>
      </div>
      <button 
        onClick={dataSyncStatus === 'has_update' ? handleUpdateData : handleCheckDataUpdate}
        disabled={dataSyncStatus === 'checking' || dataSyncStatus === 'updating' || dataSyncStatus === 'latest'}
        className="px-6 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white"
      >
        {dataSyncStatus === 'checking' ? 'Đang kiểm tra...' : 
         dataSyncStatus === 'has_update' ? 'Tải ngay' : 
         dataSyncStatus === 'updating' ? 'Đang tải...' : 'Kiểm tra'}
      </button>
    </div>
    <div className="text-sm mt-2">
      {dataSyncStatus === 'latest' && <span className="text-green-400">✅ Dữ liệu câu hỏi đã mới nhất!</span>}
      {dataSyncStatus === 'has_update' && <span className="text-amber-400">⚠️ Có gói câu hỏi mới. Vui lòng tải về.</span>}
      {dataSyncStatus === 'error' && <span className="text-red-400">❌ Cập nhật thất bại. Vui lòng thử lại.</span>}
    </div>
  </div>
  */
  ```

- [ ] **Step 3.4: Check đề mới lúc khởi động (App.tsx)**
  ```tsx
  // ontap-win/App.tsx
  import React, { useEffect } from 'react'; // Bổ sung import đầy đủ
  import { shouldUpdateQuestions } from './services/dataService';

  // Trong component App, thêm effect (cạnh các effect khởi động sẵn có):
  useEffect(() => {
    // Chỉ check lúc mới mở app, KHÔNG DÙNG setInterval.
    // Kết quả cache vào localStorage để ChangelogModal đọc lúc mở (không auto-bật modal gây phiền).
    shouldUpdateQuestions().then(needsUpdate => {
      localStorage.setItem('questions_has_update', needsUpdate ? '1' : '0');
    });
  }, []);
  ```
  - Trong `ChangelogModal`, khởi tạo `dataSyncStatus` từ cache: mở modal mà `questions_has_update === '1'` thì hiện thẳng trạng thái `has_update` (kèm nút "Tải ngay"), khỏi bấm Kiểm tra lại.

### Task 4: Chuyển đổi Fullscreen (Feature 19)

**Files:**
- Modify: `ontap-win/electron/main.cjs`
- Create: `ontap-win/utils/windowUtils.ts`

**Interfaces:**
- Consumes: `ipcMain.handle`, `window.electron.invoke()`

- [ ] **Step 4.1: Đón sự kiện IPC ở Main**
  ```javascript
  // ontap-win/electron/main.cjs
  // Thêm vào sau createWindow (trong app.whenReady):
  ipcMain.handle('toggle-fullscreen', (event) => {
    // Đổi tên biến thành bw (browserWindow) để không shadow biến win toàn cục
    const bw = BrowserWindow.fromWebContents(event.sender);
    if (bw) {
      bw.setFullScreen(!bw.isFullScreen());
    }
  });
  ```

- [ ] **Step 4.2: Gửi sự kiện IPC từ React**
  ```tsx
  // ontap-win/utils/windowUtils.ts
  export const toggleFullscreen = () => {
    if (window.electron) {
      window.electron.invoke('toggle-fullscreen');
    } else if (document.documentElement.requestFullscreen) {
      // Fallback cho Web
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };
  ```

---
Next Phase: [Phase 05: Testing & Release](./phase-05-testing.md)

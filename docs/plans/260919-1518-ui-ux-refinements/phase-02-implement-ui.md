# Phase 2: UI Implementation

## Objectives
- Fix nested scroll on the Result screen (Web & Win).
- Sync the Answer Sheet layout and mechanism on Web to match Windows.
- Enhance Electron system tray context menu.

## Implementation Steps (TDD Enriched)

### Task 2.1: Result Screen — Fix Nested Scroll (Web)

**Files:**
- [`ontap-web/components/ResultsScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx#L90) — dòng 90
- [`ontap-web/components/ExamResultsScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx#L105) — dòng 105

**Hiện trạng (BUG):**

Cả 2 file đều có container giới hạn chiều cao 50vh + overflow-y-auto, tạo thanh scroll lồng bên trong page scroll:

```tsx
// ResultsScreen.tsx:90
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">

// ExamResultsScreen.tsx:105
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
```

**Code thay đổi:**

```tsx
// TRƯỚC
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">

// SAU — Xóa max-h-[50vh] và overflow-y-auto, giữ space-y-6 pr-2
<div className="space-y-6 pr-2">
```

Thực hiện trên cả 2 file:
1. `ontap-web/components/ResultsScreen.tsx` dòng 90: Xóa `max-h-[50vh] overflow-y-auto`
2. `ontap-web/components/ExamResultsScreen.tsx` dòng 105: Xóa `max-h-[50vh] overflow-y-auto`

**Manual Check:**
```
1. Chạy: cd ontap-web && npm run dev
2. Làm bài ôn tập → nộp bài → vào trang Kết quả (/ontap/ketqua)
3. Kiểm tra:
   ✅ Chỉ có 1 thanh scroll (thanh scroll của trình duyệt/window)
   ✅ Không có thanh scroll con bên trong vùng danh sách câu hỏi
   ✅ Danh sách câu hỏi mở rộng tự nhiên theo nội dung
4. Lặp lại với trang Kết quả thi thử (/ontap/ketquathi)
5. Resize cửa sổ xuống 768px width → vẫn chỉ 1 scroll
```

---

### Task 2.2: Result Screen — Fix Nested Scroll (Windows)

**Files:**
- [`ontap-win/components/ResultsScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ResultsScreen.tsx#L73) — dòng 73
- [`ontap-win/components/ExamResultsScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamResultsScreen.tsx#L77) — dòng 77

**Hiện trạng (BUG):**

```tsx
// ontap-win ResultsScreen.tsx:73
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">

// ontap-win ExamResultsScreen.tsx:77
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
```

**Code thay đổi:**

```tsx
// TRƯỚC
<div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">

// SAU
<div className="space-y-6 pr-2">
```

Thực hiện trên cả 2 file:
1. `ontap-win/components/ResultsScreen.tsx` dòng 73: Xóa `max-h-[50vh] overflow-y-auto`
2. `ontap-win/components/ExamResultsScreen.tsx` dòng 77: Xóa `max-h-[50vh] overflow-y-auto`

**Manual Check:**
```
1. Chạy: cd ontap-win && npm run dev (Electron dev mode)
2. Làm bài ôn tập → nộp bài → mở Kết quả
3. Kiểm tra:
   ✅ Chỉ có 1 thanh scroll (của cửa sổ Electron)
   ✅ Danh sách câu hỏi không bị cắt ở 50% viewport
4. Lặp lại với Kết quả thi thử
```

---

### Task 2.3: Web Answer Sheet — Redesign to 5-Column Layout (QuizScreen)
> ⚠️ **Superseded by Phase 4 Task 4.3**: Bảng checkbox sẽ bị xóa, onClick sẽ được khôi phục. Xem `phase-04-rename-cleanup.md`.

**Files:**
- [`ontap-web/components/QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx#L170-L184) — dòng 170-184

**Hiện trạng:**

Hiện tại đáp án được render thành **button full-width** trực tiếp bên dưới nội dung câu hỏi, mỗi button chứa cả text + logic chọn:

```tsx
// QuizScreen.tsx:170-184
<button
  key={answer.id}
  onClick={() => handleAnswerSelect(answer.id)}
  disabled={isAnswered && (!isPracticeMode || selectedAnswer === currentQuestion.correctAnswerId)}
  className={buttonClass}
  style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}
>
  <span className="flex-grow"><span className='font-bold mr-2'>{String.fromCharCode(65 + index)}. </span>{answer.text}</span>
  {showReveal && (
    <>
      {isCorrect && <CheckIcon3D className="h-6 w-6 text-success ml-3" />}
      {isSelected && !isCorrect && <XIcon3D className="h-6 w-6 text-destructive ml-3" />}
    </>
  )}
</button>
```

**Thiết kế mới (giống Win app):**
- Bên **trái**: Text câu hỏi + đáp án (read-only, không clickable)
- Bên **phải**: Bảng checkbox 5 cột `| Câu | A | B | C | D |` — chỉ chọn qua checkbox

**Hướng dẫn refactor:**
1. Tách phần hiển thị text đáp án thành div read-only (xóa `onClick` trên text)
2. Thêm component bảng `AnswerSheet` bên phải với 5 cột
3. Bind `handleAnswerSelect` chỉ vào checkbox trong bảng
4. Giữ nguyên logic `isAnswered`, `showReveal`, icons ✅❌

**Manual Check:**
```
1. Chạy: cd ontap-web && npm run dev
2. Mở bài ôn tập → chọn môn → vào Quiz (/ontap/lambai)
3. Kiểm tra:
   ✅ Text đáp án hiển thị nhưng KHÔNG phản hồi khi click
   ✅ Bảng checkbox 5 cột hiển thị bên phải
   ✅ Click checkbox → đáp án được chọn, highlight đúng
   ✅ Sau khi chọn → icon ✅/❌ hiện đúng vị trí (mode ôn tập)
4. Resize 768px → bảng checkbox responsive (có thể stack dưới câu hỏi)
```

---

### Task 2.4: Web Answer Sheet — Audit ExamQuizScreen & ExamQuizScreen2
> ⚠️ **Superseded by Phase 4 Task 4.4**: Mobile sẽ cho phép click text đáp án (dùng `md:` breakpoint). Xem `phase-04-rename-cleanup.md`.

**Files:**
- [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx#L176-L188) — dòng 176-188
- [`ontap-web/components/ExamQuizScreen2.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen2.tsx#L219-L241) — dòng 219-241

**Hiện trạng ExamQuizScreen.tsx:**
```tsx
// ExamQuizScreen.tsx:176-188
<button
  key={answer.id}
  onClick={() => handleAnswerSelect(answer.id)}
  className={buttonClass}
  style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}
>
  <div className="flex items-start w-full">
    <span className="font-bold mr-2 min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
    <span>{answer.text}</span>
  </div>
</button>
```

**Hiện trạng ExamQuizScreen2.tsx:**
```tsx
// ExamQuizScreen2.tsx:223-241
<div 
  key={answer.id} 
  onClick={() => {
    triggerHaptic('light');
    handleAnswerSelect(currentQuestion.id, answer.id);
  }}
  className={`flex items-start p-3 md:p-2 rounded-xl ...`}
>
  <div className={`flex-none w-8 h-8 rounded-full ...`}>
    {String.fromCharCode(65 + index)}
  </div>
  <p ...>{answer.text}</p>
</div>
```

⚠️ **Lưu ý:** `ExamQuizScreen2.tsx` **đã có** component custom checkbox ở **dòng 29-38** (`SquareCheckbox`) và được gọi ở bảng bên phải (dòng 290-305). Cần kiểm tra xem `onClick` trên text answer (dòng 225-228) có cần disable hay không để đồng nhất với checkbox.

```tsx
// ExamQuizScreen2.tsx:290-305 — Answer sheet đã có
<SquareCheckbox
  checked={userAnswers[q.id] === a.id}
  onChange={() => handleAnswerSelect(q.id, a.id)}
/>
```

**Hành động:**
1. `ExamQuizScreen.tsx`: Refactor tương tự Task 2.3 — chuyển sang bảng 5 cột
2. `ExamQuizScreen2.tsx`: **Disable `onClick`** trên text answer (dòng 225-228) — giữ selection chỉ qua checkbox bảng bên phải

**Manual Check:**
```
1. Mở bài thi thử (/ontap/thithu)
2. Click vào text đáp án → KHÔNG có phản hồi
3. Click vào checkbox trong bảng bên phải → đáp án được chọn
4. Kiểm tra bảng scroll ngang trên mobile (nếu quá rộng)
```

---

### Task 2.5: Tray Context Menu — Electron Desktop

**Files:**
- [`ontap-win/electron/main.cjs`](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L196-L218) — hàm `createTray()`

**Hiện trạng:**
```js
// main.cjs:196-218
function createTray(mainWindow) {
    const isDevEnv = process.env.ELECTRON_MODE === 'true';
    const iconPath = isDevEnv 
      ? path.join(__dirname, '../public/assets/img/logo1.ico')
      : path.join(__dirname, '../dist/assets/img/logo1.ico');

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

**Đã có sẵn:** Hàm `setupAutoLaunch()` tại [dòng 37-48](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L37-L48):
```js
// main.cjs:37-48
function setupAutoLaunch() {
    if (process.platform === 'win32') {
        const loginSettings = app.getLoginItemSettings();
        if (!loginSettings.openAtLogin) {
            app.setLoginItemSettings({
                openAtLogin: true,
                path: app.getPath('exe')
            });
        }
    }
}
```

**Đã có sẵn:** `autoUpdater` setup tại [dòng 19-29](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L19-L29) và check update tại [dòng 240-248](file:///d:/Antigravity/TNDNB/ontap-win/electron/main.cjs#L240-L248).

**Code thay đổi — Menu mới:**
```js
// main.cjs — Thay thế contextMenu trong createTray()
function createTray(mainWindow) {
    const isDevEnv = process.env.ELECTRON_MODE === 'true';
    const iconPath = isDevEnv 
      ? path.join(__dirname, '../public/assets/img/logo1.ico')
      : path.join(__dirname, '../dist/assets/img/logo1.ico');

    tray = new Tray(nativeImage.createFromPath(iconPath));

    const buildContextMenu = () => {
        const loginSettings = app.getLoginItemSettings();
        const isAutoStart = loginSettings.openAtLogin;

        return Menu.buildFromTemplate([
            { label: 'Mở ứng dụng', click: () => { mainWindow.show(); mainWindow.focus(); } },
            { type: 'separator' },
            {
                label: `Khởi động cùng Windows (${isAutoStart ? 'Bật' : 'Tắt'})`,
                click: () => {
                    app.setLoginItemSettings({
                        openAtLogin: !isAutoStart,
                        path: app.getPath('exe')
                    });
                    tray.setContextMenu(buildContextMenu());
                }
            },
            {
                label: 'Kiểm tra cập nhật',
                click: () => {
                    if (autoUpdater) {
                        autoUpdater.checkForUpdates().catch(err => {
                            log.error('Manual update check failed:', err);
                        });
                    } else {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Cập nhật',
                            message: 'Không thể kiểm tra cập nhật trong chế độ phát triển.'
                        });
                    }
                }
            },
            { type: 'separator' },
            { label: 'Thoát', click: () => { app.isQuitting = true; app.quit(); } }
        ]);
    };

    tray.setToolTip('TNDNB - Ôn Thi');
    tray.setContextMenu(buildContextMenu());
    tray.on('click', () => { mainWindow.show(); mainWindow.focus(); });

    mainWindow.on('close', (e) => {
        if (!app.isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
}
```

**Manual Check:**
```
1. Build & chạy Electron: cd ontap-win && npm run build && npm run electron
   (Hoặc dev mode: npm run dev rồi chạy electron riêng)
2. App khởi động → icon xuất hiện ở System Tray (khay hệ thống)
3. Right-click icon tray → Context menu hiện:
   ✅ "Mở ứng dụng" — click → cửa sổ hiện lên và focus
   ✅ "Khởi động cùng Windows (Bật)" — click → label đổi thành "(Tắt)"
   ✅ "Kiểm tra cập nhật" — click → autoUpdater chạy (hoặc dialog thông báo nếu dev)
   ✅ "Thoát" — click → app thoát hoàn toàn
4. Đóng cửa sổ (X) → app thu nhỏ xuống tray (không thoát)
5. Mở Task Manager → kiểm tra app.getLoginItemSettings() sau khi toggle
```

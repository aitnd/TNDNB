# Phase 3: Content Zoom Implementation
Status: Done (2026-09-15, implemented — tsc --noEmit sạch + vite build pass cả 2 project)

**Objective:** Add a scoped zoom slider that scales text/content without breaking the overall app layout (navbars, modals).

## Implementation Steps

### 1. Create useFontScale Hook
Create this hook to manage the scale (range 50% to 200%, default 100%, step 10%) backed by localStorage.
```typescript
import { useState, useEffect } from 'react';

export const useFontScale = () => {
  const [scale, setScale] = useState<number>(() => {
    const saved = localStorage.getItem('quiz-font-scale');
    if (!saved) return 1;
    const parsed = parseFloat(saved);
    return isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 0.5), 2);
  });

  useEffect(() => {
    localStorage.setItem('quiz-font-scale', scale.toString());
  }, [scale]);

  const increase = () => setScale(s => Math.min(Math.round((s + 0.1) * 10) / 10, 2));
  const decrease = () => setScale(s => Math.max(Math.round((s - 0.1) * 10) / 10, 0.5));
  
  const handleManualInput = (val: number) => {
    if (isNaN(val)) return;
    setScale(Math.min(Math.max(Math.round(val * 10) / 10, 0.5), 2));
  };

  return { scale, setScale: handleManualInput, increase, decrease };
};
```

### 2. Create ZoomBar Component
A sticky/fixed bottom bar simulating MS Word's status bar:
*(Lưu ý Implement: Nếu dùng `sticky bottom-0` không bám đáy màn hình do ancestor bị cuộn (scroll trên body), hãy đổi sang `fixed bottom-0 left-0 w-full` và đệm `padding-bottom` cho container, cẩn thận không đè `MobileBottomNav`)*

```tsx
interface ZoomBarProps {
  scale: number;
  setScale: (v: number) => void;
  increase: () => void;
  decrease: () => void;
}

export const ZoomBar = ({ scale, setScale, increase, decrease }: ZoomBarProps) => {
  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-slate-900 border-t dark:border-slate-700 text-slate-800 dark:text-slate-200 p-2 flex justify-end items-center gap-2 z-50">
      <button onClick={decrease} className="px-2 text-xl">-</button>
      <input 
        type="range" min="0.5" max="2" step="0.1" 
        value={scale} 
        onChange={(e) => setScale(parseFloat(e.target.value))} 
        className="w-32"
      />
      <button onClick={increase} className="px-2 text-xl">+</button>
      <span className="w-12 text-right">{Math.round(scale * 100)}%</span>
    </div>
  );
};
```

### 3. Inject into Quiz Screens (6 màn: Web 3 + Win 3)
**Scope — web cũng có đủ 3 màn** (`ontap-web/components/` có QuizScreen, ExamQuizScreen, ExamQuizScreen2). User web thi thử/thi online mới có zoom:
- `ontap-web/components/QuizScreen.tsx`
- `ontap-web/components/ExamQuizScreen.tsx`
- `ontap-web/components/ExamQuizScreen2.tsx`
- `ontap-win/components/QuizScreen.tsx`
- `ontap-win/components/ExamQuizScreen.tsx`
- `ontap-win/components/ExamQuizScreen2.tsx`

**Quy tắc quan trọng: KHÔNG import chéo project.**
Mỗi dự án Vite giữ file riêng (copy logic giống nhau). Bài học cũ: import chéo `ontap-web ↔ ontap-win` gây lỗi bundler.
- `ontap-web/hooks/useFontScale.ts` + `ontap-web/components/ZoomBar.tsx` ← bản web
- `ontap-win/hooks/useFontScale.ts` + `ontap-win/components/ZoomBar.tsx` ← bản win

**Action mỗi màn:**
- Import hook và component.
- Áp `style={{ '--content-scale': scale } as React.CSSProperties}` lên wrapper nội dung quiz.
- Class Tailwind cố định (`text-2xl`, `text-lg`...) KHÔNG tự scale theo CSS variable — phải override tường minh font-size trên phần tử nội dung (h2 câu hỏi, nút đáp án), ví dụ:
  `style={{ fontSize: 'calc(1.25rem * var(--content-scale, 1))' }}`
  Ảnh minh họa giữ nguyên kích thước (chỉ scale chữ).
- Inject `<ZoomBar ... />` ngay trước thẻ đóng `</div>` ngoài cùng của màn Quiz.

## Files to Create/Modify
- `ontap-web/hooks/useFontScale.ts` — NEW
- `ontap-win/hooks/useFontScale.ts` — NEW (copy logic, KHÔNG import chéo)
- `ontap-web/components/ZoomBar.tsx` — NEW
- `ontap-win/components/ZoomBar.tsx` — NEW
- `ontap-web/components/QuizScreen.tsx` — MODIFY (nhúng ZoomBar + CSS var)
- `ontap-web/components/ExamQuizScreen.tsx` — MODIFY
- `ontap-web/components/ExamQuizScreen2.tsx` — MODIFY
- `ontap-win/components/QuizScreen.tsx` — MODIFY
- `ontap-win/components/ExamQuizScreen.tsx` — MODIFY
- `ontap-win/components/ExamQuizScreen2.tsx` — MODIFY

## Verification:
- Open a quiz on each of the 6 screens (web 3 + win 3). Adjust the slider at the bottom.
- Verify ONLY the questions and answers scale in size. The top navbar, modals, and the zoom bar itself must NOT scale.
- Refresh the page and ensure the scale persists (localStorage key `quiz-font-scale`).

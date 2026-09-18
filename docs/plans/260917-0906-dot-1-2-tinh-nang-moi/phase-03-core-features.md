# Phase 03: Core Features (Web & Win)

**Mục tiêu:** Xây dựng các tính năng nâng cao trải nghiệm học tập và tương tác của người dùng.
**Dependencies:** Phase 02 hoàn thành.
**Commit:** Gộp commit cuối Phase — không commit từng task nhỏ.

---

## Implementation Steps (TDD Enriched)

### Task 1: Luyện lại câu sai (Zustand State)

**Files:**
- Modify: `ontap-web/stores/useAppStore.ts`
- Test: `ontap-web/stores/useAppStore.test.ts` (đặt cạnh file gốc)

**Interfaces:**
- Consumes: `questionIds: string[]`
- Produces: `incorrectQuestionIds: string[]`, `addIncorrectQuestions()`, `removeIncorrectQuestion()`

- [ ] **Step 1.1: Viết test thất bại (RED)**
  ```typescript
  // ontap-web/stores/useAppStore.test.ts
  import { useAppStore } from './useAppStore';

  describe('useAppStore - Incorrect Questions', () => {
    beforeEach(() => {
      localStorage.clear();
      useAppStore.setState({ incorrectQuestionIds: [] });
    });

    it('should add and deduplicate incorrect questions', () => {
      useAppStore.getState().addIncorrectQuestions(['q1', 'q2']);
      useAppStore.getState().addIncorrectQuestions(['q2', 'q3']);
      expect(useAppStore.getState().incorrectQuestionIds).toEqual(['q1', 'q2', 'q3']);
    });
    
    it('should remove a question when answered correctly', () => {
      useAppStore.setState({ incorrectQuestionIds: ['q1', 'q2', 'q3'] });
      useAppStore.getState().removeIncorrectQuestion('q2');
      expect(useAppStore.getState().incorrectQuestionIds).toEqual(['q1', 'q3']);
    });
  });
  ```
  Run: `cd ontap-web && npm run test:run -- stores/useAppStore.test.ts`
  Expected: FAIL

- [ ] **Step 1.2: Implement tối thiểu (GREEN)**
  > ⚠️ BẮT BUỘC thêm 3 field vào `interface AppStore` trước (không là lỗi TS thiếu field):
  ```typescript
  incorrectQuestionIds: string[];
  addIncorrectQuestions: (ids: string[]) => void;
  removeIncorrectQuestion: (id: string) => void;
  ```
  ```typescript
  // ontap-web/stores/useAppStore.ts
  // Helper chống crash khi localStorage dính rác (trắng trang nếu JSON.parse ném lỗi lúc init)
  const safeParseList = (v: string | null): string[] => {
    try {
      const parsed = JSON.parse(v || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };
  incorrectQuestionIds: safeParseList(localStorage.getItem('incorrectQuestionIds')),
  
  addIncorrectQuestions: (ids: string[]) => set((state) => {
    const newIds = Array.from(new Set([...state.incorrectQuestionIds, ...ids]));
    localStorage.setItem('incorrectQuestionIds', JSON.stringify(newIds));
    return { incorrectQuestionIds: newIds };
  }),
  
  removeIncorrectQuestion: (id: string) => set((state) => {
    const newIds = state.incorrectQuestionIds.filter(qId => qId !== id);
    localStorage.setItem('incorrectQuestionIds', JSON.stringify(newIds));
    return { incorrectQuestionIds: newIds };
  }),
  ```
  Run: `cd ontap-web && npm run test:run -- stores/useAppStore.test.ts`
  Expected: PASS
  *(Copy state sang `ontap-win/stores/useAppStore.ts`)*

### Task 2: Logic gom câu sai sau nộp bài & Xóa khi làm đúng

**Files:**
- Modify: `ontap-web/components/ExamQuizScreen2.tsx`
- Modify: `ontap-win/components/ExamQuizScreen2.tsx` (cùng logic)
- Modify: `ontap-web/components/QuizScreen.tsx` (đề `incorrect_practice` render ở màn luyện `/ontap/lambai`, không phải màn thi)
- Modify: `ontap-win/components/QuizScreen.tsx` (cùng logic)

**Interfaces:**
- Consumes: `userAnswers`, `quiz.questions`, `addIncorrectQuestions`, `removeIncorrectQuestion`
- Hàm thật trong file: `handleFinishQuiz()` (nộp bài, dòng 101), `handleAnswerSelect(questionId, answerId)` (chọn đáp án, dòng 132, **2 tham số**)

- [ ] **Step 2.1: Gom câu sai khi nộp bài (web + win)**
  ```tsx
  // ontap-web/components/ExamQuizScreen2.tsx (và ontap-win tương tự)
  // BÊN TRONG block if (window.confirm(...)) { ... }, TRƯỚC onFinish():
  // (Bỏ qua câu CHƯA trả lời — undefined không tính là sai)
  // BẮT BUỘC thêm 2 dòng này ở đầu component (kèm import useAppStore) — thiếu là ReferenceError:
  // import { useAppStore } from '../stores/useAppStore';
  const addIncorrectQuestions = useAppStore(state => state.addIncorrectQuestions);
  const handleFinishQuiz = useCallback(() => {
      const finalAnswers = latestAnswers.current;
      // ... (giữ nguyên logic confirm hiện có) ...
      if (window.confirm(confirmationMessage)) {
          // ← GOM CÂU SAI Ở ĐÂY, trước onFinish
          const incorrectIds = quiz.questions
            .filter(q => finalAnswers[q.id] !== undefined && finalAnswers[q.id] !== q.correctAnswerId)
            .map(q => q.id);
          if (incorrectIds.length > 0) {
            addIncorrectQuestions(incorrectIds);
          }
          onFinish(finalAnswers);
      }
  }, [quiz.questions.length, onFinish]);
  ```

- [ ] **Step 2.2: Xoá câu sai nếu đang ở mock quiz (màn luyện QuizScreen)**
  ```tsx
  // ontap-web/components/QuizScreen.tsx (và ontap-win tương tự)
  // Đề incorrect_practice CHỈ render ở QuizScreen (route /ontap/lambai) —
  // KHÔNG đặt ở ExamQuizScreen2 (quiz.id ở đó không bao giờ là 'incorrect_practice').
  // Trong handleAnswerSelect(answerId) — handler này chỉ 1 tham số, lấy currentQuestionId từ closure:
  if (quiz.id === 'incorrect_practice' && answerId === currentQuestion.correctAnswerId) {
    removeIncorrectQuestion(currentQuestionId);
  }
  ```

- [ ] **Step 2.3: Nút "Luyện câu sai" trên Dashboard**
  > ⚠️ Toàn bộ code dưới nằm TRONG thân component (sau hooks rules — cấm gọi hook ngoài component):
  ```tsx
  // ontap-web/components/SubjectSelectionScreen.tsx (hoặc Dashboard)
  // Component này chỉ nhận { subjects, progress, onSelect, onBack } —
  // lấy thêm từ store + router, KHÔNG trông chờ props:
  import { useAppStore } from '../stores/useAppStore';
  import { useNavigate } from 'react-router-dom';

  // allQuestions flatten từ store (2 bên giống nhau):
  // const allQuestions = licenses.flatMap(l => l.subjects.flatMap(s => s.questions));
  const licenses = useAppStore(state => state.licenses);
  const incorrectQuestionIds = useAppStore(state => state.incorrectQuestionIds);
  const setCurrentQuiz = useAppStore(state => state.setCurrentQuiz);
  const navigate = useNavigate();
  const allQuestions = licenses.flatMap(l => l.subjects.flatMap(s => s.questions));
  const handlePracticeIncorrect = () => {
    const incorrectQs = allQuestions.filter(q => incorrectQuestionIds.includes(q.id));
    if (incorrectQs.length === 0) return alert("Tuyệt vời, bạn không có câu sai nào!");
    
    // Dùng id đặc biệt để nhận diện, không cần thêm field vào type Quiz
    setCurrentQuiz({
      id: 'incorrect_practice',
      title: `Luyện tập câu sai (${incorrectQs.length} câu)`,
      questions: incorrectQs,
    });
    // Route luyện thật là /ontap/lambai (render QuizScreen), KHÔNG phải /thi-truc-tuyen
    navigate('/ontap/lambai');
  };
  ```

- [ ] **Step 2.4: Gom câu sai khi nộp bài luyện ở QuizScreen (web + win)**
  - Đề `incorrect_practice` render ở `QuizScreen` nên khi nộp bài luyện cũng phải gom tiếp (câu nào vẫn sai thì ở lại danh sách).
  - ⚠️ **Khác biệt chữ ký (không copy nguyên Step 2.1):** `QuizScreen.handleFinishQuiz()` không có `window.confirm`/`latestAnswers` (gọi thẳng `onFinish(userAnswers)`) — gom từ `userAnswers` hiện tại, vẫn bỏ qua câu chưa trả lời (`undefined`). Phần xóa-khi-đúng đã làm ở Step 2.2, không lặp lại.

- [ ] **Step 2.5: Mở khóa (Unlock) vòng lặp và ẩn Đáp Án (Web + Win)**
  - ⚠️ Nếu học viên chọn sai, không được khóa cứng đáp án. Phải cho phép chọn lại.
  - 🧠 **Sư phạm (Review 4):** Ở mode luyện sai, KHÔNG reveal (bật sáng xanh) đáp án đúng nếu học viên chọn sai, buộc họ phải tự suy luận bấm tiếp đến khi đúng.
  - Sửa logic `QuizScreen.tsx` (dòng 72-76 và dòng disabled) bằng cách nhận diện mode:
  ```tsx
  // 1. Sửa file: ontap-web/components/QuizScreen.tsx
  // 2. COPY Y HỆT đoạn sửa này sang: ontap-win/components/QuizScreen.tsx
  const isPracticeMode = quiz.id === 'incorrect_practice';

  // Ở đầu hàm handleAnswerSelect:
  const handleAnswerSelect = (answerId: string) => {
    // Lock nếu KHÔNG PHẢI mode luyện sai HOẶC đã chọn trúng đáp án đúng
    if (isAnswered && (!isPracticeMode || selectedAnswer === currentQuestion.correctAnswerId)) return;
    // ...
  };
  
  // Ở prop disabled của button hiển thị đáp án:
  // Đảm bảo nút KHÔNG bị vô hiệu hóa khi chọn sai ở mode luyện tập
  // disabled={isAnswered && (!isPracticeMode || selectedAnswer === currentQuestion.correctAnswerId)}

  // Ở render button (JSX), ẩn hiệu ứng Reveal đáp án đúng nếu đang luyện và chưa click trúng:
  // (Tìm chỗ logic đang highlight màu xanh cho correctAnswerId)
  const isCorrect = answer.id === currentQuestion.correctAnswerId;
  const isSelected = selectedAnswer === answer.id;
  const showReveal = isAnswered && (!isPracticeMode || isSelected); // 🟢 ĐIỂM KEY MỚI
  
  // VD cấu trúc style (tùy thuộc UI hiện tại):
  // className={... showReveal && isCorrect ? 'bg-green-500' : isSelected && !isCorrect ? 'bg-red-500' : ''}
  ```

### Task 3: Tìm kiếm câu hỏi (Utility & UI)

**Files:**
- Create: `ontap-web/utils/searchUtils.ts` (copy sang `ontap-win/utils/searchUtils.ts`)
- Test: `ontap-web/utils/searchUtils.test.ts` (copy sang `ontap-win`)
- Modify: `ontap-web/components/SubjectSelectionScreen.tsx` (và bản `ontap-win` tương ứng)

**Interfaces:**
- Consumes: `term: string`, `questions: Question[]`
- Produces: `filteredQuestions: Question[]`

- [ ] **Step 3.1: Viết test thất bại (RED)**
  ```typescript
  // ontap-web/utils/searchUtils.test.ts
  import { searchQuestions } from './searchUtils';
  import type { Question } from '../types';

  describe('searchQuestions', () => {
    const mockQs: Question[] = [
      { id: '1', text: 'Biển báo giao thông', answers: [], correctAnswerId: 'a1' }
    ];
    it('should find questions ignoring accents', () => {
      const result = searchQuestions(mockQs, 'bien bao');
      expect(result.length).toBe(1);
    });
  });
  ```
  Run: `cd ontap-web && npm run test:run -- utils/searchUtils.test.ts`
  Expected: FAIL

- [ ] **Step 3.2: Implement tối thiểu (GREEN)**
  ```typescript
  // ontap-web/utils/searchUtils.ts
  import type { Question } from '../types';

  export const normalizeStr = (str: string): string =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  export const searchQuestions = (questions: Question[], term: string): Question[] => {
    if (!term.trim()) return questions;
    const normalized = normalizeStr(term);
    return questions.filter(q =>
      normalizeStr(q.text).includes(normalized) ||
      q.answers?.some(a => normalizeStr(a.text).includes(normalized))
    );
  };
  ```
  Run: `cd ontap-web && npm run test:run -- utils/searchUtils.test.ts`
  Expected: PASS

- [ ] **Step 3.3: Gắn UI Search Bar**
  ```tsx
  // ontap-web/components/SubjectSelectionScreen.tsx
  import { searchQuestions } from '../utils/searchUtils';
  
  // BẮT BUỘC: Derive allQuestions từ store (tương tự như Step 2.3)
  const licenses = useAppStore(state => state.licenses);
  const allQuestions = useMemo(() => 
    licenses.flatMap(l => l.subjects?.flatMap(s => s.questions || []) || []), 
  [licenses]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredQs = useMemo(() => searchQuestions(allQuestions, searchTerm), [allQuestions, searchTerm]);
  // Render <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
  ```

### Task 4: Báo cáo tiến bộ (Progress Chart)

**Files:**
- Create: `ontap-web/components/ProgressDashboard.tsx`
- Create: `ontap-win/components/ProgressDashboard.tsx` (copy y hệt)

> ⚠️ `recharts` đã có sẵn trong cả `ontap-web` và `ontap-win` (`^3.6.0`). Chỉ cần verify `node_modules/recharts` tồn tại, KHÔNG cần install.

- [ ] **Step 4.1: Verify Recharts**
  Run: `cd ontap-web && npm ls recharts` — xác nhận `recharts@3.x.x` đã cài.
  Run: `cd ontap-win && npm ls recharts` — tương tự.

- [ ] **Step 4.2: Implement Chart Component**
  ```tsx
  // ontap-web/components/ProgressDashboard.tsx
  import { useMemo } from 'react';
  import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
  import type { ExamResult } from '../services/historyService';

  export const ProgressDashboard = ({ history }: { history: ExamResult[] }) => {
    const data = useMemo(() => {
      const grouped: Record<string, { scores: number[] }> = {};
      history.forEach(h => {
        const title = h.quizTitle || 'Khác';
        if (!grouped[title]) grouped[title] = { scores: [] };
        grouped[title].scores.push(h.score);
      });
      return Object.entries(grouped).map(([name, val]) => ({
        name: name.length > 20 ? name.slice(0, 20) + '...' : name,
        highScore: Math.max(...val.scores)
      }));
    }, [history]);

    if (data.length === 0) {
      return <p>Chưa có dữ liệu — làm vài bài thi rồi quay lại nhé!</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="highScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  ```

- [ ] **Step 4.3: Gắn ProgressDashboard vào Dashboard (web + win)**
  ```tsx
  // ontap-web/components/Dashboard.tsx (và ontap-win tương ứng)
  // Đặt TẤT CẢ trong thân component Dashboard (cấm gọi hook ngoài component):
  import { useState, useEffect } from 'react';
  import { useAppStore } from '../stores/useAppStore';
  import { ProgressDashboard } from './ProgressDashboard';
  import { getExamHistory } from '../services/userService'; // (win: hàm lấy lịch sử tương ứng)
  import type { ExamResult } from '../services/historyService';
  const userId = useAppStore(s => s.userProfile?.id ?? 'guest');
  const [history, setHistory] = useState<ExamResult[]>([]);
  useEffect(() => { getExamHistory(userId).then(setHistory); }, [userId]);
  // Render <ProgressDashboard history={history} /> trong layout Dashboard
  ```

### Task 5: Hook Phím tắt làm bài

**Files:**
- Create: `ontap-web/hooks/useExamKeyboard.ts` (copy sang `ontap-win/hooks/useExamKeyboard.ts`)
- Test: cùng cách test colocate như Task 1/3 (`hooks/useExamKeyboard.test.ts`, mock KeyboardEvent). Nếu tốn công mock quá → ghi rõ BỎ QUA test hook, chỉ test tay theo Test Criteria. (copy sang `ontap-win/hooks/useExamKeyboard.ts`)
- Modify: `ontap-web/components/ExamQuizScreen2.tsx` (và `ontap-win/components/ExamQuizScreen2.tsx`)

- [ ] **Step 5.1: Implement Hook**
  ```typescript
  // ontap-web/hooks/useExamKeyboard.ts
  import { useEffect } from 'react';
  import type { Question } from '../types';

  export const useExamKeyboard = (
    onNext: () => void,
    onPrev: () => void,
    onSelectAnswer: (answerId: string) => void,
    currentQuestion: Question | undefined
  ) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        if (['input', 'textarea'].includes(tag)) return;
        
        if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
        
        const keyMap: Record<string, number> = { '1':0, '2':1, '3':2, '4':3, 'a':0, 'b':1, 'c':2, 'd':3 };
        const idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined && currentQuestion?.answers?.[idx]) {
          onSelectAnswer(currentQuestion.answers[idx].id);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentQuestion, onNext, onPrev, onSelectAnswer]);
  };
  ```

- [ ] **Step 5.2: Gắn vào ExamQuizScreen2 (Adapter bọc state)**
  ```tsx
  // ontap-web/components/ExamQuizScreen2.tsx
  import { useExamKeyboard } from '../hooks/useExamKeyboard';
  // ...
  // handleAnswerSelect có signature (questionId, answerId) — cần wrap lại.
  // Hook PHẢI gọi trước mọi early-return trong component; adapter guard currentQuestion
  // vì lúc đó quiz có thể rỗng (early-return ở trên đã xử lý hiển thị).
  useExamKeyboard(
    () => setCurrentQuestionIndex(prev => Math.min(prev + 1, quiz.questions.length - 1)),
    () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0)),
    (answerId) => { if (currentQuestion) handleAnswerSelect(currentQuestion.id, answerId); },
    currentQuestion
  );
  ```

### Task 6: Nhắc học mỗi ngày + Streak (Feature 8)

**Files:**
- Modify: `ontap-web/stores/useAppStore.ts` (và `ontap-win/stores/useAppStore.ts`)
- Create: `ontap-web/components/ReminderSettings.tsx` (copy sang `ontap-win`)

**Interfaces:**
- Produces: `streakCount`, `lastActiveDate`, `updateStreak()`

- [ ] **Step 6.1: Logic Streak trong Store (dùng localStorage)**
  ```typescript
  // ontap-web/stores/useAppStore.ts
  // Store hiện khai báo create<AppStore>((set) => ...) — action updateStreak
  // cần đọc state nên phải thêm tham số `get`: create<AppStore>((set, get) => ...)
  // (sửa đúng chỗ khai báo create, cả web và win).
  const safeParseCount = (v: string | null): number => {
    const n = parseInt(v || '0', 10);
    return isNaN(n) ? 0 : n;
  };
  streakCount: safeParseCount(localStorage.getItem('streakCount')),
  lastActiveDate: localStorage.getItem('lastActiveDate') || '',
  
  updateStreak: () => {
    // Ngày LOCAL (không dùng toISOString vì đó là giờ UTC, lệch múi giờ VN)
    const dayStr = (d: Date): string =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = dayStr(new Date());
    const { lastActiveDate, streakCount } = get();
    if (lastActiveDate === today) return; // Đã cập nhật hôm nay
    
    const yesterday = dayStr(new Date(Date.now() - 86400000));
    const newStreak = lastActiveDate === yesterday ? streakCount + 1 : 1;
    
    localStorage.setItem('streakCount', newStreak.toString());
    localStorage.setItem('lastActiveDate', today);
    set({ streakCount: newStreak, lastActiveDate: today });
  },
  ```
  *(Copy sang `ontap-win/stores/useAppStore.ts`)*

- [ ] **Step 6.2: Gọi updateStreak + lên lịch nhắc khi mở app**
  ```tsx
  // ontap-web/App.tsx (component gốc, mount 1 lần)
  // App.tsx nằm CÙNG cấp với utils/ nên import './utils/reminder' (KHÔNG phải '../utils/...')
  // ontap-web/App.tsx hiện chỉ import useCallback — BỔ SUNG useEffect vào dòng import React:
  // import React, { useCallback, useEffect } from 'react';
  import { scheduleLocalReminder } from './utils/reminder';
  useEffect(() => {
    useAppStore.getState().updateStreak();
    // Xin quyền TRƯỚC khi hẹn giờ — nếu chưa granted thì timer nổ cũng im lặng.
    const boot = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      const saved = localStorage.getItem('reminderTime');
      if (saved) scheduleLocalReminder(saved, () => {});
    };
    boot();
    // (scheduleLocalReminder tự hẹn lại mỗi ngày sau khi nổ — không cần interval ngoài.)
  }, []);
  ```
  *(Hàm `scheduleLocalReminder(time, onFire)` tách ra `ontap-web/utils/reminder.ts` (copy sang win) để App và ReminderSettings dùng chung — KHÔNG định nghĩa trong file component.)*

- [ ] **Step 6.3: UI Cài đặt giờ nhắc + Local Notification**

  > ⚠️ **Quyết định kiến trúc (đã chốt): LOCAL-ONLY.**
  > - Web: Nhắc bằng `Notification API` khi tab đang mở. Tắt tab = mất nhắc (chấp nhận).
  > - Win: Dùng `new Notification('title', {body})` trực tiếp từ renderer (vì `contextIsolation: false, nodeIntegration: true`). **KHÔNG cần IPC qua main.**
  > - Server push (FCM/VAPID) để đợt sau.

  ```tsx
  // ontap-web/utils/reminder.ts (copy sang ontap-win/utils/reminder.ts)
  // Helper dùng chung cho App startup (Step 6.2) và trang Cài đặt
  let activeTimer: ReturnType<typeof setTimeout> | null = null;

  export const scheduleLocalReminder = (time: string, onSaved: (t: string) => void) => {
    localStorage.setItem('reminderTime', time);
    onSaved(time);

    // Hủy timer cũ nếu user đổi giờ (không thì 2 timer cùng nổ)
    if (activeTimer) clearTimeout(activeTimer);

    // Tính delta ms từ bây giờ đến giờ nhắc
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1); // Nếu đã qua → mai
    const delta = target.getTime() - now.getTime();

    // Đặt timer (chỉ sống khi tab/app đang mở).
    // Sau khi nổ thì TỰ HẸN LẠI cho ngày mai (không thì chỉ nhắc đúng 1 lần duy nhất).
    activeTimer = setTimeout(function fire() {
      if (Notification.permission === 'granted') {
        new Notification('Nhắc nhở học tập 📚', {
          body: 'Đến giờ ôn thi rồi bạn ơi!'
        });
      }
      scheduleLocalReminder(time, () => {});
    }, delta);
  };
  ```

  ```tsx
  // ontap-web/components/ReminderSettings.tsx (copy sang ontap-win)
  import { useState, useEffect } from 'react';
  import { scheduleLocalReminder } from '../utils/reminder';

  export const ReminderSettings: React.FC = () => {
    const [reminderTime, setReminderTime] = useState(
      localStorage.getItem('reminderTime') || '19:00'
    );

    const saveReminder = (time: string) => scheduleLocalReminder(time, setReminderTime);

    // Xin quyền Notification khi mount trang Cài đặt
    // (Lên lịch lại giờ đã lưu chạy ở App startup — Step 6.2 — vì timer mất khi tắt app)
    useEffect(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }, []);

    return (
      <div>
        <label>Giờ nhắc học mỗi ngày</label>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => saveReminder(e.target.value)}
        />
      </div>
    );
  };
  ```

---
Next Phase: [Phase 04: Platform Integrations](./phase-04-desktop-integrations.md)


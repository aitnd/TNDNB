# Phase 03: Nâng Cấp Luồng Học Tập, Ôn Tập Từng Môn (`QuizScreen`) & Màn Hình Kết Quả (Bảo Toàn Tuyệt Đối `ExamQuizScreen.tsx`)

**Spec:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)
**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)

---

## Global Constraints

1. **Ràng Buộc Bất Di Bất Dịch — Bảo Toàn 100% [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx):**
   - Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào trong [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (màn hình làm bài thi thử sát hạch được gọi tại `/ontap/thithu`, `/ontap/giamkhao/thithu` và bên trong `ThiTrucTuyenPage.tsx`).
   - Kết quả chạy lệnh `git diff ontap-web/components/ExamQuizScreen.tsx` phải luôn bằng `0` (trống hoàn toàn).
2. **Xóa bỏ 100% Class Nền Sáng Cứng Trên `QuizScreen.tsx` (`/ontap/lambai`):**
   - Trong [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx#L224-L244), bảng lưới điều hướng câu hỏi (`Question Navigation Grid`) hiện đang hardcode `bg-gray-50 rounded-xl border border-gray-200`, `bg-green-100 text-green-700 border-green-300`, `bg-red-100 text-red-700 border-red-300`, và `text-gray-500 border-gray-200` khiến giao diện bị chói lóa và mất độ tương phản khi bật chế độ Tối (`dark`). Bắt buộc chuyển toàn bộ sang semantic tokens và cặp màu trạng thái chuẩn Dual-Theme.
3. **Tabular Numerals (`tabular-nums`) & Vùng chạm chuẩn EdTech (`>= 44x44px`):**
   - Mọi con số đếm môn học, số câu hỏi (`LicenseSelectionScreen.tsx`, `SubjectSelectionScreen.tsx`), bộ đếm `Câu X / Y` & nút số thứ tự trên bảng lưới (`QuizScreen.tsx`), và điểm số / tỷ lệ phần trăm (`ResultsScreen.tsx`, `ExamResultsScreen.tsx`) bắt buộc gắn class `tabular-nums`.

---

## Files & Interfaces

### Danh sách Files tác động trong Phase 03
- Modify (Test): [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
- Modify (Learning Entry & Selection):
  - [ontap-web/components/LicenseSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx)
  - [ontap-web/components/NameInputScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NameInputScreen.tsx)
  - [ontap-web/components/ModeSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ModeSelectionScreen.tsx)
  - [ontap-web/components/SubjectSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/SubjectSelectionScreen.tsx)
  - [ontap-web/components/GiamKhaoSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/GiamKhaoSelectionScreen.tsx)
- Modify (Practice Quiz & Results):
  - [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx)
  - [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx)
  - [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx)
  - [ontap-web/components/ThiTrucTuyenPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThiTrucTuyenPage.tsx) *(chỉ chuẩn hóa phần Sảnh chờ / Nhập thông tin thí sinh)*
- **DO NOT TOUCH (Protected 100%):**
  - [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`git diff === ''`)

### Interfaces & Contracts (Giữ nguyên 100% chữ ký Props)
```tsx
// ontap-web/components/LicenseSelectionScreen.tsx
export interface LicenseSelectionScreenProps {
  licenses: License[];
  onSelect: (license: License) => void;
  onBack: () => void;
}

// ontap-web/components/QuizScreen.tsx
export interface QuizScreenProps {
  quiz: Quiz;
  onFinish: (answers: UserAnswers) => void;
  onBack: () => void;
  initialIndex?: number;
  initialAnswers?: UserAnswers;
  onProgressUpdate?: (index: number, timeLeft: number, answers: UserAnswers) => void;
}
```

---

## Review Focus (5 Tình Huống Biên & Failure Modes Trọng Tâm)

1. **Nguy cơ chỉnh sửa nhầm `ExamQuizScreen.tsx` khi nâng cấp `ThiTrucTuyenPage.tsx` hoặc `QuizScreen.tsx`:**
   - *Nguyên nhân:* `ThiTrucTuyenPage.tsx` import và render `<ExamQuizScreen />` khi thí sinh bước vào phòng thi sát hạch.
   - *Kiểm chứng:* Chỉ cập nhật phần Sảnh chờ bên ngoài `ThiTrucTuyenPage.tsx`; chạy kiểm định tự động `execSync('git diff ontap-web/components/ExamQuizScreen.tsx') === ''` trong Vitest.
2. **Lỗi chói mắt & mất chữ ở bảng lưới câu hỏi (`Question Navigation Grid`) của `QuizScreen.tsx` khi bật chế độ Tối (`dark`):**
   - *Nguyên nhân:* Dòng 225 và 236 của [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx#L225-L237) đang dùng `bg-gray-50 border-gray-200` và `text-gray-500 border-gray-200`, đồng thời đáp án đang chọn dòng 181 dùng `bg-primary/10 border-primary ring-2 ring-primary text-primary-foreground` (khiến chữ trắng `text-primary-foreground` nằm trên nền nhạt `bg-primary/10` bị mờ ở chế độ Sáng!).
   - *Kiểm chứng:* Sửa dòng 181 thành `bg-primary/10 border-primary ring-2 ring-primary text-primary font-semibold` và thay toàn bộ khung lưới câu hỏi sang `bg-muted/50 border border-border rounded-xl` với 4 trạng thái màu chuẩn Dual-Theme.
3. **Thẻ chọn hạng bằng `LicenseSelectionScreen.tsx` bo góc quá đà `rounded-[2.5rem]` và thiếu `tabular-nums`:**
   - *Kiểm chứng:* Đưa về chuẩn thiết kế **Bento License Card** (`rounded-2xl border border-border bg-card hover:border-primary/60 shadow-sm`), gắn `tabular-nums` cho badge `{license.subjects.length} môn • {totalQuestions} câu`.
4. **Trải nghiệm tìm kiếm nhanh câu hỏi trong `SubjectSelectionScreen.tsx`:**
   - *Kiểm chứng:* Ô tìm kiếm dùng `bg-background border-input text-foreground`, kết quả đáp án đúng dùng `text-emerald-600 dark:text-emerald-400 font-semibold` rõ nét trên cả 2 chế độ.
5. **Hiển thị đối chiếu kết quả trên `ResultsScreen.tsx` và `ExamResultsScreen.tsx`:**
   - *Kiểm chứng:* Toàn bộ điểm số, số câu đúng/sai và tỷ lệ đạt gắn `tabular-nums`, khung câu hỏi xem lại dùng `bg-card border border-border rounded-2xl`.

---

## Implementation Steps (TDD Enriched — Bite-Sized Workflow)

### Task 3.1, 3.2, 3.3 & 3.4: Nâng Cấp Luồng Học Tập, `QuizScreen.tsx` & Màn Hình Kết Quả (Bảo Toàn Tuyệt Đối `ExamQuizScreen.tsx`)

#### Step 3.1: Viết test thất bại (`RED`) trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts)
Bổ sung khối `describe('Phase 03: ...')` vào [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts):

```ts
describe('Phase 03: Learning Flow, Dual-Theme QuizScreen & 100% Protected ExamQuizScreen', () => {
  it('Task 3.1 & 3.3: LicenseSelectionScreen.tsx và QuizScreen.tsx áp dụng chuẩn Dual-Theme semantic tokens + tabular-nums, xóa sạch bg-gray-50/border-gray-200 cứng', () => {
    const licenseScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/LicenseSelectionScreen.tsx'),
      'utf8'
    )
    const quizScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/QuizScreen.tsx'),
      'utf8'
    )
    const resultsScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/ResultsScreen.tsx'),
      'utf8'
    )

    expect(licenseScreen).toContain('tabular-nums')
    expect(licenseScreen).not.toContain('rounded-[2.5rem]')

    expect(quizScreen).toContain('tabular-nums')
    expect(quizScreen).not.toContain('bg-gray-50')
    expect(quizScreen).not.toContain('border-gray-200')
    expect(quizScreen).not.toContain('bg-primary/10 border-primary ring-2 ring-primary text-primary-foreground')

    expect(resultsScreen).toContain('tabular-nums')
  })

  it('Task 3.4: Bảo toàn tuyệt đối ExamQuizScreen.tsx (git diff === "")', () => {
    const examQuizDiff = execSync('git diff ontap-web/components/ExamQuizScreen.tsx', {
      cwd: rootDir,
      encoding: 'utf8',
    })
    expect(examQuizDiff.trim()).toBe('')
  })
})
```

#### Step 3.2: Chạy test — xác nhận FAIL (`Verify RED`)
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
```
- **Kết quả kỳ vọng:** Test `FAIL` vì `LicenseSelectionScreen.tsx` vẫn chứa `rounded-[2.5rem]` và thiếu `tabular-nums`; `QuizScreen.tsx` vẫn chứa `bg-gray-50`, `border-gray-200`, thiếu `tabular-nums`, và còn lỗi tương phản `bg-primary/10 ... text-primary-foreground`.

#### Step 3.3: Implement tối thiểu (`GREEN`)

1. **Task 3.1 — Chuẩn hóa [ontap-web/components/LicenseSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx):**
   - Thiết kế thẻ chọn Hạng bằng theo mẫu **Bento License Card**:
   ```tsx
   <button
     key={license.id}
     onClick={() => { triggerHaptic('medium'); onSelect(license); }}
     className="group relative flex flex-col items-center justify-between p-6 bg-card text-card-foreground rounded-2xl text-center border border-border shadow-sm hover:border-primary/60 hover:shadow-md active:scale-[0.98] transition-all min-h-[180px]"
   >
     <div className="mb-3 transform group-hover:scale-105 transition-transform duration-300">
       {getLicenseIcon(license)}
     </div>
     <h3 className="text-base md:text-lg font-bold text-foreground leading-snug mb-3">
       {license.name}
     </h3>
     <div className="bg-secondary px-3 py-1 rounded-full border border-border">
       <p className="text-xs font-semibold text-primary tabular-nums">
         {license.subjects.length} môn • {totalQuestions} câu
       </p>
     </div>
   </button>
   ```

2. **Task 3.2 — Chuẩn hóa các màn hình Thiết lập Phiên học:**
   - [ontap-web/components/NameInputScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NameInputScreen.tsx), [ontap-web/components/ModeSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ModeSelectionScreen.tsx), [ontap-web/components/SubjectSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/SubjectSelectionScreen.tsx), và [ontap-web/components/GiamKhaoSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/GiamKhaoSelectionScreen.tsx):
     - Chuyển toàn bộ khung thẻ sang `bg-card text-card-foreground border border-border rounded-2xl shadow-sm`.
     - Gắn `tabular-nums` cho toàn bộ badge đếm số câu hỏi, điểm cao nhất và thời gian làm bài.

3. **Task 3.3 — Đại tu [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) (`/ontap/lambai`):**
   - Mở rộng khung chứa lên `max-w-5xl mx-auto` để bố cục 2 cột (Câu hỏi bên trái + Bảng lưới 240px bên phải) thoáng đãng, dễ đọc.
   - Gắn `tabular-nums` cho dòng tiến độ: `<span className="tabular-nums font-medium">Câu {currentQuestionIndex + 1} / {quiz.questions.length}</span>`.
   - Sửa trạng thái đáp án đang chọn (chưa reveal) từ `text-primary-foreground` sang `bg-primary/10 border-primary ring-2 ring-primary text-primary font-semibold`.
   - Chuẩn hóa **Bảng lưới điều hướng câu hỏi (`Question Navigation Grid`)** bằng 4 trạng thái màu rõ ràng trên cả Light và Dark mode:
   ```tsx
   <div className="w-full md:w-[240px] flex-none">
     <div className="flex flex-wrap gap-2 justify-center p-3.5 bg-muted/50 rounded-xl border border-border">
       {quiz.questions.map((q, index) => {
         const hasAnswered = userAnswers[q.id] !== undefined;
         const isCorrect = userAnswers[q.id] === q.correctAnswerId;
         const isCurrent = currentQuestionIndex === index;
         return (
           <button
             key={q.id}
             onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(index); }}
             className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs tabular-nums transition-colors ${
               isCurrent
                 ? 'bg-primary text-primary-foreground ring-2 ring-ring shadow-sm'
                 : hasAnswered
                   ? isCorrect
                     ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                     : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                   : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
             }`}
           >
             {index + 1}
           </button>
         );
       })}
     </div>
   </div>
   ```

4. **Task 3.4 — Chuẩn hóa màn hình Kết quả & Sảnh chờ Thi trực tuyến (Bảo toàn 100% `ExamQuizScreen.tsx`):**
   - [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx) & [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx): Thay nền trắng/xám cố định bằng `bg-card text-card-foreground border border-border rounded-2xl`, gắn `tabular-nums` cho điểm tổng kết, phần trăm đúng và thời gian hoàn thành.
   - [ontap-web/components/ThiTrucTuyenPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThiTrucTuyenPage.tsx): Chỉ chuẩn hóa các thẻ Sảnh chờ / Chọn hạng bằng / Nhập SBD trước khi vào phòng thi; **giữ nguyên tuyệt đối nhánh render `<ExamQuizScreen />` và không chạm tới file `ExamQuizScreen.tsx`**.

#### Step 3.4: Chạy test — xác nhận PASS (`Verify GREEN`) & Kiểm định UI Craft (`Impeccable v4.8.0` + `Taste-Skill v2.5.0`)
```powershell
npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts
git diff ontap-web/components/ExamQuizScreen.tsx
node "C:\Users\HorizonServers\.gemini\config\skills\taste-skill\scripts\consistency.mjs" d:\Antigravity\TNDNB\ontap-web\components
node "C:\Users\HorizonServers\.gemini\config\skills\taste-skill\scripts\perf.mjs" d:\Antigravity\TNDNB\ontap-web\components
```
- **Tiêu chí nghiệm thu Phase 03:**
  - Bộ test Vitest `PASS` 100%.
  - `git diff ontap-web/components/ExamQuizScreen.tsx` trống hoàn toàn (`0 bytes`).
  - Kiểm định `Impeccable` (`craft`, `polish`, `typeset`, `colorize`) xác nhận bảng câu hỏi trên `/ontap/lambai` có độ tương phản đạt chuẩn WCAG AAA trên cả Light và Dark mode.

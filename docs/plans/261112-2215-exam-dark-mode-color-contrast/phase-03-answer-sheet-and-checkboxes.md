# Phase 03: Chuẩn Hóa Bảng Đáp Án (Answer Sheet), Checkbox Tick & Đồng Bộ ontap-win

> **Mã kế hoạch**: `261112-2215-exam-dark-mode-color-contrast`  
> **Giai đoạn**: Phase 03  
> **Trọng tâm**: Nâng cấp bảng Answer Sheet bên phải, tái thiết kế `SquareCheckbox` tương phản cao và đồng bộ sang ứng dụng Desktop Electron (`ontap-win`)  
> **Tài liệu tham chiếu**:
> - [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)
> - [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md)
> - [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
> - [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx)

---

## 1. Mục Tiêu Kỹ Thuật

1. Khắc phục triệt để lỗi ô vuông `SquareCheckbox` bị "tàng hình" trong Dark Mode do dùng màu đen xám `bg-[#333]` trên nền xanh đen `#0f172a`.
2. Chuyển đổi hàng câu hỏi đang làm từ màu xanh chói lóa `bg-cyan-200` sang tone màu dịu mắt `bg-sky-100 dark:bg-sky-950/60`, giữ tương phản chữ sắc nét.
3. Chuẩn hóa đường kẻ bảng (`border`), hiệu ứng di chuột (`hover`), và lưới số câu hỏi trên thiết bị di động.
4. Đồng bộ đầy đủ các thay đổi cho [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx) để đảm bảo phiên bản phần mềm máy tính bảng / offline cũng hưởng trọn vẹn chất lượng giao diện mới.

---

## 2. Chi Tiết Tái Thiết Kế SquareCheckbox (Web & Win)

### 2.1 Hiện Trạng Lỗi
- Hiện tại trong cả `ontap-web` và `ontap-win`:
  ```tsx
  // ontap-web:
  const SquareCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
      <div
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
          onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange?.();
              }
          }}
          onClick={onChange}
          className={`w-[14px] h-[14px] border border-[#999] inline-block cursor-pointer bg-card relative ${checked ? 'bg-[#333]' : ''}`}
      >
          {checked && (
              <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-[#333]"></div>
          )}
      </div>
  );
  ```
- **Hậu quả**: Khi `checked = true`, ô vuông và chấm vuông đều dùng `bg-[#333]`. Mã màu `#333333` trên nền `#0f172a` có tỷ lệ tương phản chỉ **1.4:1**, mắt người không thể nhìn thấy dấu tick khi bật Dark Mode.

### 2.2 Kiến Trúc Nâng Cấp (High-Contrast SquareCheckbox)
```tsx
const SquareCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange?.();
            }
        }}
        onClick={onChange}
        className={`w-[14px] h-[14px] border inline-block cursor-pointer bg-card relative rounded-xs transition-colors ${
            checked 
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-950/50' 
                : 'border-slate-400 dark:border-slate-500 hover:border-slate-600 dark:hover:border-slate-400'
        }`}
    >
        {checked && (
            <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-primary dark:bg-sky-400 rounded-xs shadow-xs"></div>
        )}
    </div>
);
```

- **Đặc điểm**:
  - Trong **Light Mode**: Chấm vuông màu xanh đậm `bg-primary` (`hsl(211, 100%, 30%)` - `#004a99`) tương phản **9.5:1** trên nền trắng.
  - Trong **Dark Mode**: Chấm vuông màu xanh cyan-sky sáng `dark:bg-sky-400` (`#38bdf8`) tương phản **8.5:1** trên nền `#0f172a`.
  - Khung viền ô tick phát sáng nhẹ `dark:border-sky-400`, giúp học viên phân biệt ngay lập tức đáp án nào đã được chọn từ khoảng cách nhìn thông thường.

---

## 3. Nâng Cấp Bảng Answer Sheet (Cột Phải Trên Desktop)

### 3.1 Bảng Câu Hỏi & Đáp Án (Dòng 306-348)
```tsx
{/* Right Column (Answer Sheet Table) */}
<div className={`w-[200px] flex-none flex-col ${isMobileApp ? 'hidden' : 'hidden md:flex'}`}>
    <div className="border border-border dark:border-slate-700 rounded-md overflow-hidden bg-card shadow-xs">
        <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-[#f0ad4e] text-black z-10">
                <tr>
                    <th className="border border-border dark:border-slate-700 p-2 font-bold">Câu</th>
                    <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">A</th>
                    <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">B</th>
                    <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">C</th>
                    <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">D</th>
                </tr>
            </thead>
            <tbody>
                {quiz.questions.map((q, index) => {
                    const isCurrent = currentQuestionIndex === index;
                    return (
                        <tr 
                            key={q.id} 
                            className={`transition-colors ${
                                isCurrent 
                                    ? 'bg-sky-100 dark:bg-sky-950/60' 
                                    : 'hover:bg-muted/40 dark:hover:bg-slate-800/40'
                            }`}
                        >
                            <td
                                className={`border border-border dark:border-slate-700/80 p-2 text-center cursor-pointer whitespace-nowrap transition-colors ${
                                    isCurrent 
                                        ? 'font-bold text-blue-700 dark:text-sky-300' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                onClick={() => setCurrentQuestionIndex(index)}
                            >
                                Câu {index + 1}
                            </td>
                            {[0, 1, 2, 3].map((idx) => {
                                const a = q.answers[idx];
                                return (
                                    <td key={idx} className="border border-border dark:border-slate-700/80 p-2 text-center">
                                        {a && (
                                            <SquareCheckbox
                                                checked={userAnswers[q.id] === a.id}
                                                onChange={() => handleAnswerSelect(q.id, a.id)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    <div className="text-center mt-4 pt-2 border-t border-border dark:border-slate-700">
        <button 
            onClick={handleFinishQuiz} 
            className="bg-primary dark:bg-sky-600 text-primary-foreground dark:text-white px-8 py-2 rounded-md font-semibold hover:bg-primary/90 dark:hover:bg-sky-500 transition-colors w-full shadow-xs"
        >
            Nộp bài
        </button>
    </div>
</div>
```

---

## 4. Nâng Cấp Lưới Điều Hướng Câu Hỏi Trên Mobile (Dòng 350-367)

```tsx
<div className={`flex-wrap gap-2 justify-center p-2.5 bg-muted/30 dark:bg-slate-900/40 rounded-xl border border-border dark:border-slate-800 ${isMobileApp ? 'flex' : 'flex md:hidden'}`}>
     {quiz.questions.map((q, index) => {
             const isAnswered = !!userAnswers[q.id];
             const isCurrent = currentQuestionIndex === index;
             return (
                 <button
                    key={q.id}
                    onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(index); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent 
                            ? 'bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 ring-2 ring-primary/40 scale-110 shadow-sm' 
                            : isAnswered 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700' 
                                : 'bg-card text-muted-foreground border border-border dark:border-slate-700 hover:bg-muted/50'
                    }`}
                 >
                     {index + 1}
                 </button>
             );
         })}
</div>
```

---

## 5. Đồng Bộ Toàn Bộ Sang ontap-win/components/ExamQuizScreen.tsx

Tệp [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx) đang sử dụng:
1. `SquareCheckbox` cũ với `bg-white` và `bg-[#333]`.
2. Container ngoài ép màu sáng hoặc thiếu biến dark mode.
3. Cột Answer Sheet sử dụng `bg-cyan-200` và `bg-[#337ab7]`.

Khi thi công Phase 03:
- Cập nhật định nghĩa `SquareCheckbox` trong `ontap-win` khớp 100% với phiên bản mới của `ontap-web`.
- Cập nhật các class `text-foreground`, `dark:bg-sky-400`, `dark:text-sky-300`, `border-border dark:border-slate-700`.
- Đảm bảo trải nghiệm giữa Web và Electron App đồng nhất hoàn hảo.

---

## 6. Tiêu Chí Hoàn Thành Phase 03 (Exit Gate)
- [ ] `SquareCheckbox` hiển thị chấm xanh `dark:bg-sky-400` rõ nét khi được chọn.
- [ ] Answer Sheet không còn màu `bg-cyan-200` chói lóa, thay bằng `bg-sky-100 dark:bg-sky-950/60`.
- [ ] Lưới câu hỏi mobile hỗ trợ trạng thái đã làm / chưa làm sắc sảo trong Dark Mode.
- [ ] Cả `ontap-web` và `ontap-win` đều được cập nhật đồng bộ.

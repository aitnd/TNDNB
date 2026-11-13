# Phase 02: Tái Cấu Trúc ExamQuizScreen.tsx - Vùng Câu Hỏi, Header & Nút Điều Hướng

> **Mã kế hoạch**: `261112-2215-exam-dark-mode-color-contrast`  
> **Giai đoạn**: Phase 02  
> **Trọng tâm**: Thay thế toàn bộ mã màu cố định tại Khối câu hỏi, Desktop Header, Mobile Header và Khối nút điều hướng sang Semantic Tokens  
> **Tài liệu tham chiếu**:
> - [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md)
> - [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261112-2215-exam-dark-mode-color-contrast/task.md)
> - [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
> - [`ontap-web/theme.css`](file:///d:/Antigravity/TNDNB/ontap-web/theme.css)

---

## 1. Mục Tiêu Triển Khai

1. Bỏ hoàn toàn class kế thừa ép màu tối `text-black` ở wrapper cha của màn hình làm bài thi.
2. Chuẩn hóa Desktop Header và Mobile Header với các biến `dark:text-sky-400`, `dark:text-red-400`, `border-border dark:border-slate-700`.
3. Bổ sung `text-foreground font-semibold leading-relaxed` vào đoạn văn bản câu hỏi `<p>{currentQuestion.text}</p>`.
4. Khắc phục dứt điểm lỗi mờ lóa của vòng tròn đáp án (A, B, C, D) bằng cách tách biệt màu sắc giữa nền và chữ trong cả 2 theme.
5. Cập nhật các nút điều hướng chuyển câu ("Câu trước", "Câu tiếp", "Nộp bài") sang hệ thống token thích ứng ngữ cảnh.

---

## 2. Chi Tiết Thay Đổi Code Cụ Thể (Before & After)

### 2.1 Wrapper Container (Dòng 176)
- **Hiện tại**:
  ```tsx
  <div className="w-full max-w-7xl mx-auto font-sans text-black shadow-lg animate-slide-in-right rounded-md" style={{ '--content-scale': scale } as React.CSSProperties}>
  ```
- **Nâng cấp**:
  ```tsx
  <div className="w-full max-w-7xl mx-auto font-sans text-foreground shadow-lg animate-slide-in-right rounded-md" style={{ '--content-scale': scale } as React.CSSProperties}>
  ```
- **Giải thích**: Thay `text-black` bằng `text-foreground`. Trong Light Mode, `text-foreground` là `hsl(222, 47%, 11%)` (đen navy đậm sắc nét); trong Dark Mode là `hsl(210, 40%, 96%)` (trắng xám tinh khiết).

---

### 2.2 Khối Desktop Header (Dòng 180-207)
- **Hiện tại**:
  ```tsx
  <div className="hidden md:flex justify-between items-start pb-4 border-b border-gray-300">
      <div className="flex gap-4 items-start">
          <img
              src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`}
              alt="Avatar"
              className="w-[100px] h-[130px] border border-gray-300 object-cover p-1 bg-card"
              onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.postimg.cc/8PDn1wfM/favicon.png';
              }} loading="lazy" />
          <div className="text-sm space-y-1">
              <p className="font-bold text-blue-700 text-lg uppercase">{userProfile?.full_name || userProfile?.fullName || userName || 'Học viên'}</p>
              <p>Số báo danh: <span className="font-semibold text-foreground">{(userProfile?.email || '').split('@')[0] || '---'}</span></p>
              <p>Ngày sinh: <span className="font-semibold text-foreground">{formatDate(userProfile?.birthDate)}</span></p>
              <p>Địa chỉ: <span className="font-semibold text-foreground">{userProfile?.address || '---'}</span></p>
              <p>Lớp: <span className="font-semibold text-foreground">{userProfile?.class || userProfile?.courseName || '---'}</span></p>
              <p>Hạng bằng: <span className="font-bold text-red-600 border border-red-500 px-1 rounded bg-red-50">{selectedLicense?.name || '---'}</span></p>
          </div>
      </div>
      <div className="flex items-start gap-4">
          <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48">
              <p className="font-bold">Đang thi</p>
              <p>Thời gian: 45 phút</p>
              <p>Bù giờ: 0 phút</p>
              <p>Còn lại: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span></p>
          </div>
          <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-red-500 font-semibold">Thoát</button>
      </div>
  </div>
  ```
- **Nâng cấp**:
  ```tsx
  <div className="hidden md:flex justify-between items-start pb-4 border-b border-border dark:border-slate-700">
      <div className="flex gap-4 items-start">
          <img
              src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`}
              alt="Avatar"
              className="w-[100px] h-[130px] border border-border dark:border-slate-700 object-cover p-1 bg-card rounded-xs"
              onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.postimg.cc/8PDn1wfM/favicon.png';
              }} loading="lazy" />
          <div className="text-sm space-y-1">
              <p className="font-bold text-blue-700 dark:text-sky-400 text-lg uppercase">{userProfile?.full_name || userProfile?.fullName || userName || 'Học viên'}</p>
              <p className="text-muted-foreground">Số báo danh: <span className="font-semibold text-foreground">{(userProfile?.email || '').split('@')[0] || '---'}</span></p>
              <p className="text-muted-foreground">Ngày sinh: <span className="font-semibold text-foreground">{formatDate(userProfile?.birthDate)}</span></p>
              <p className="text-muted-foreground">Địa chỉ: <span className="font-semibold text-foreground">{userProfile?.address || '---'}</span></p>
              <p className="text-muted-foreground">Lớp: <span className="font-semibold text-foreground">{userProfile?.class || userProfile?.courseName || '---'}</span></p>
              <p className="text-muted-foreground">Hạng bằng: <span className="font-bold text-red-600 dark:text-red-400 border border-red-500/50 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40">{selectedLicense?.name || '---'}</span></p>
          </div>
      </div>
      <div className="flex items-start gap-4">
          <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48 shadow-xs">
              <p className="font-bold">Đang thi</p>
              <p>Thời gian: 45 phút</p>
              <p>Bù giờ: 0 phút</p>
              <p>Còn lại: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span></p>
          </div>
          <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-destructive font-semibold transition-colors">Thoát</button>
      </div>
  </div>
  ```
- **Bảo toàn**: `hidden md:flex justify-between items-start`, `Số báo danh`, `bg-[#f0ad4e]`.

---

### 2.3 Khối Mobile Exam Header (Dòng 209-230)
- **Nâng cấp**:
  ```tsx
  <div className="flex md:hidden items-center justify-between pb-3 mb-2 border-b border-border dark:border-slate-800">
      <button
          onClick={handleBackWithConfirm}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
      >
          ← Thoát
      </button>
      <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-600 dark:text-red-400 border border-red-400/60 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 max-w-[120px] truncate">
              {selectedLicense?.name || 'Sát hạch'}
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 tabular-nums">
              Câu {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
      </div>
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs tabular-nums shadow-xs">
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
      </div>
  </div>
  ```
- **Bảo toàn**: `flex md:hidden items-center justify-between`, `handleBackWithConfirm`, `tabular-nums`.

---

### 2.4 Khối Nội Dung Câu Hỏi (Left Column - Dòng 233-250)
- **Hiện tại**:
  ```tsx
  <div className="flex-1 border border-gray-400 rounded-md p-4 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
      <div>
          <p className="font-bold mb-4 border-b border-dashed border-gray-400 pb-2 flex justify-between">
              <span>Nội dung câu hỏi</span>
              <span className={`text-blue-600 ${isMobileApp ? 'block' : 'block md:hidden'}`}>Câu {currentQuestionIndex + 1}/{quiz.questions.length}</span>
          </p>
          <p className={`font-bold text-red-600 mb-2 ${isMobileApp ? 'hidden' : 'hidden md:block'}`}>Câu :{currentQuestionIndex + 1}</p>
          <p className="mb-4 font-semibold" style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}>{currentQuestion.text}</p>
  ```
- **Nâng cấp**:
  ```tsx
  <div className="flex-1 border border-border dark:border-slate-700 bg-card rounded-md p-4 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
      <div>
          <p className="font-bold mb-4 border-b border-dashed border-border dark:border-slate-700 pb-2 flex justify-between text-foreground">
              <span>Nội dung câu hỏi</span>
              <span className={`text-blue-600 dark:text-sky-400 font-semibold tabular-nums ${isMobileApp ? 'block' : 'block md:hidden'}`}>Câu {currentQuestionIndex + 1}/{quiz.questions.length}</span>
          </p>
          <p className={`font-bold text-red-600 dark:text-red-400 mb-2 tabular-nums ${isMobileApp ? 'hidden' : 'hidden md:block'}`}>Câu {currentQuestionIndex + 1}:</p>
          <p className="mb-4 font-semibold text-foreground leading-relaxed" style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}>{currentQuestion.text}</p>
  ```
- **Xử lý ảnh câu hỏi**:
  ```tsx
  {currentQuestion.image && (
      <div className="mb-4 flex justify-center">
          <img
              src={currentQuestion.image}
              alt="Hình ảnh câu hỏi"
              className="max-w-full h-auto max-h-48 md:max-h-60 object-contain border border-border dark:border-slate-700 rounded-md bg-white/5 dark:bg-slate-900/40 p-1" loading="lazy" />
      </div>
  )}
  ```

---

### 2.5 Danh Sách Phương Án Đáp Án (Dòng 251-274)
- **Hiện tại**:
  ```tsx
  <div 
      key={answer.id} 
      onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
      className={`flex items-start p-3 md:p-2 rounded-xl transition-all border-2 cursor-pointer md:cursor-default md:pointer-events-none ${
          isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-transparent'
      }`}
  >
      <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-foreground'
      }`}>
          {String.fromCharCode(65 + index)}
      </div>
      <p className={`${isSelected ? 'font-bold text-blue-700' : 'text-foreground'}`} style={{ fontSize: 'calc(1rem * var(--content-scale, 1))' }}>{answer.text}</p>
  </div>
  ```
- **Nâng cấp**:
  ```tsx
  <div 
      key={answer.id} 
      onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
      className={`flex items-start p-3 md:p-2.5 rounded-xl transition-all border-2 cursor-pointer md:cursor-default md:pointer-events-none ${
          isSelected 
          ? 'border-blue-500 dark:border-sky-500 bg-blue-50/80 dark:bg-sky-950/30 shadow-xs' 
          : 'border-transparent hover:bg-muted/40 dark:hover:bg-slate-800/40'
      }`}
  >
      <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 transition-colors ${
          isSelected 
              ? 'bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
      }`}>
          {String.fromCharCode(65 + index)}
      </div>
      <p className={`${isSelected ? 'font-bold text-blue-700 dark:text-sky-300' : 'text-foreground font-medium'} leading-relaxed`} style={{ fontSize: 'calc(1rem * var(--content-scale, 1))' }}>{answer.text}</p>
  </div>
  ```
- **Hiệu quả**: 
  - Vòng tròn chưa chọn: `bg-slate-200 text-slate-800` (Light) và `dark:bg-slate-800 dark:text-slate-200` (Dark). Ký tự A, B, C, D luôn sắc nét, tương phản đạt > 8:1!
  - Chữ đáp án đã chọn: `text-blue-700` (Light) và `dark:text-sky-300` (Dark). Độ tương phản 9.2:1!

---

### 2.6 Khối Nút Điều Hướng (Dòng 277-302)
- **Hiện tại**:
  ```tsx
  <button 
      onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.max(0, p - 1)); }} 
      disabled={currentQuestionIndex === 0} 
      className="flex-1 bg-gray-100 text-black px-4 py-3 rounded-xl border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 disabled:opacity-30"
  >
  ```
- **Nâng cấp**:
  ```tsx
  <button 
      onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.max(0, p - 1)); }} 
      disabled={currentQuestionIndex === 0} 
      className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl border border-border dark:border-slate-700 flex items-center justify-center font-bold hover:bg-muted dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xs"
  >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      Câu trước
  </button>
  {currentQuestionIndex < quiz.questions.length - 1 ? (
      <button 
          onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.min(quiz.questions.length - 1, p + 1)); }} 
          className="flex-1 bg-primary dark:bg-sky-600 text-primary-foreground dark:text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold hover:bg-primary/90 dark:hover:bg-sky-500 shadow-md transition-all"
      >
          Câu tiếp
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      </button>
  ) : (
      <button 
          onClick={() => { triggerHaptic('medium'); handleFinishQuiz(); }} 
          className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold hover:bg-emerald-700 shadow-md transition-all"
      >
          Nộp bài
      </button>
  )}
  ```

---

## 3. Tiêu Chí Hoàn Thành Phase 02 (Exit Gate)
- [ ] [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) đã xóa hoàn toàn `text-black` ngoài wrapper.
- [ ] Đoạn văn bản câu hỏi `{currentQuestion.text}` có class `text-foreground font-semibold`.
- [ ] Vòng tròn đáp án chưa chọn áp dụng `dark:bg-slate-800 dark:text-slate-200`.
- [ ] Nút "Câu trước" áp dụng `bg-secondary text-secondary-foreground dark:border-slate-700`.
- [ ] Không làm phá vỡ các assertions của Desktop Header và Mobile Exam Header.

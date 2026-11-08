# Phase 01: Ẩn Thông Tin Cá Nhân Trên Mobile & Tạo Mobile Exam Header Gọn Gàng

> **Mã kế hoạch**: `261107-1135-mobile-exam-screen-and-resume-banner`  
> **Tài liệu**: Kế hoạch kỹ thuật chi tiết Phase 01  
> **Tệp tác động**: [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)  
> **Mục tiêu**: Loại bỏ khối thông tin cá nhân cồng kềnh trên điện thoại di động, đưa nội dung câu hỏi và đáp án lên đầu màn hình, trong khi giữ nguyên 100% giao diện sát hạch trên Desktop.

---

## 1. Mục Tiêu Kỹ Thuật (Objectives)

1. **Giải phóng không gian hiển thị trên Mobile**:
   - Tiết kiệm hơn **180px** chiều cao của viewport trên điện thoại di động.
   - Học viên khi vào thi thử trên điện thoại nhìn thấy ngay câu hỏi và các phương án chọn A, B, C, D mà không cần cuộn trang.
2. **Ẩn hoàn toàn thông tin cá nhân trên Mobile**:
   - Ẩn ảnh thẻ học viên (`w-[100px] h-[130px]`).
   - Ẩn các dòng chữ: Họ tên, Số báo danh, Ngày sinh, Địa chỉ, Lớp, Hạng bằng.
   - Ẩn hộp màu cam chiếm diện tích `w-48`.
3. **Tạo Mobile Exam Header Siêu Gọn (~38px)**:
   - Nút `[← Thoát]` có gắn popup xác nhận (`handleBackWithConfirm`).
   - Huy hiệu hạng bằng thi (`selectedLicense?.name`).
   - Số thứ tự câu hỏi: `Câu X/Y`.
   - Đồng hồ đếm ngược: `⏱️ MM:SS` (font mono, `tabular-nums` chống giật layout).
4. **Bảo toàn 100% giao diện Desktop (`md:flex`)**:
   - Trên màn hình máy tính bàn, laptop (`min-width: 768px`), giữ nguyên 100% giao diện thông tin cá nhân, ảnh thẻ và hộp cam truyền thống để phục vụ công tác sát hạch chính quy.

---

## 2. Chi Tiết Thay Đổi Mã Nguồn

### 2.1 File Cần Chỉnh Sửa
- **Đường dẫn**: [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)
- **Vị trí**: Dòng 179 - 206.

### 2.2 So Sánh Mã Nguồn (Before vs After)

#### Trước khi sửa (Dòng 179 - 206):
```tsx
            <div className="bg-card p-4">
                <div className="flex justify-between items-start pb-4 border-b border-gray-300">
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
                            <p>Còn lại: <span className="font-bold">{formatTime(timeLeft)}</span></p>
                        </div>
                        <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-red-500 font-semibold">Thoát</button>
                    </div>
                </div>
```

#### Sau khi nâng cấp (Tách biệt Desktop & Mobile Header):
```tsx
            <div className="bg-card p-4">
                {/* 1. Desktop Header: Giữ nguyên vẹn 100% cho màn hình máy tính (md:flex) */}
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
                            <p>Còn lại: <span className="font-bold">{formatTime(timeLeft)}</span></p>
                        </div>
                        <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-red-500 font-semibold">Thoát</button>
                    </div>
                </div>

                {/* 2. Mobile Exam Header: Siêu gọn gàng (~38px), ẩn hoàn toàn info cá nhân (flex md:hidden) */}
                <div className="flex md:hidden items-center justify-between pb-3 mb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBackWithConfirm}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            ← Thoát
                        </button>
                        <span className="text-xs font-bold text-red-600 border border-red-400 px-1.5 py-0.5 rounded bg-red-50 max-w-[120px] truncate">
                            {selectedLicense?.name || 'Thi thử'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-600">
                            Câu {currentQuestionIndex + 1}/{quiz.questions.length}
                        </span>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs tabular-nums">
                            <span>⏱️</span>
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>
```

---

## 3. Đánh Giá Trải Nghiệm Người Dùng (UX Improvements)

| Yếu tố | Trước khi tối ưu | Sau khi tối ưu |
|---|---|---|
| **Chiều cao thanh đầu trang trên mobile** | ~220px - 250px | **~38px** (giảm 82%) |
| **Vị trí câu hỏi & đáp án A, B, C, D** | Bị đè xuống nửa dưới, đáp án C, D rơi khỏi màn hình | **Nằm ngay nửa trên màn hình**, xem trọn vẹn câu hỏi & 4 đáp án |
| **Thao tác làm bài trên mobile** | Phải liên tục dùng ngón tay vuốt lên xuống | **1 chạm chọn đáp án ngay lập tức**, cực kỳ mượt mà |
| **Nút thoát bài thi** | Nút nhỏ bị ép sát mép phải hộp màu cam | **Nút `← Thoát` rõ ràng**, dễ bấm, có popup hỏi xác nhận |
| **Tính tương thích Desktop** | Chuẩn thi trắc nghiệm máy tính | **Giữ nguyên 100% không đổi một pixel nào** |

---

## 4. Danh Mục Kiểm Tra Khi Thi Công (Execution Checklist)

- [ ] Thêm class `hidden md:flex` vào header máy tính trong [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx).
- [ ] Bổ sung khối `flex md:hidden` với nút Thoát, nhãn hạng bằng, tiến độ câu hỏi và đồng hồ đếm ngược `tabular-nums`.
- [ ] Kiểm tra TypeScript compiler bằng `npx tsc --noEmit`.
- [ ] Kiểm tra responsive trên các kích thước màn hình: 375px (iPhone SE), 390px (iPhone 12/13/14), 430px (iPhone Pro Max), 768px (iPad/Tablet), 1024px+ (Desktop).

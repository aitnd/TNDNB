# Kế Hoạch Triển Khai Tính Năng Mới (Đợt 1 + 2)

Dưới đây là danh sách toàn bộ các tác vụ cần thực hiện. Khi hoàn thành, hãy đánh dấu `[x]`.

## Phase 01: Setup & Initialization
- [ ] **Bước 1: Khởi tạo branch mới**
- [ ] **Bước 2: Review Code & Dependencies**
- [ ] **Bước 3: Chuẩn bị Supabase / Local Storage**

## Phase 02: Bug Fixes (Detailed)

### 📋 Nguyên nhân gốc (Root Cause Analysis)

### 📐 Quy tắc nghiệp vụ (Business Rules - từ Owner)

### ✅ Checklist sửa lỗi
- [ ] **Bước 1.1: Tạo hàm helper `calculateIsPass()` dùng chung**
- [ ] **Bước 1.2: Sửa `ExamResultsScreen.tsx` (cả web và win)**
- [ ] **Bước 1.3: Sửa `HistoryScreen.tsx` (CHỈ bản Web)**
- [ ] **Bước 1.4: Sửa logic lưu kết quả thi để thêm trường `isPassed` (cả Web & Win)**
- [ ] **Bước 1.5: Sửa tất cả HistoryModal (8 file) để fallback dữ liệu cũ**

### 📋 Nguyên nhân gốc

### ✅ Checklist sửa lỗi
- [ ] **Bước 2.1: Sửa lỗi truyền prop `userName` bị rỗng từ gốc**
- [ ] **Bước 2.2: Thêm fallback an toàn vào bên trong 4 Component (Web & Win)**
- [ ] Ôn tập 18 câu đúng 18/18 → hiện "ĐẠT" ✅
- [ ] Ôn tập 18 câu đúng 17/18 → hiện "KHÔNG ĐẠT"
- [ ] Thi thử 30 câu đúng 25/30 → hiện "ĐẠT" ✅
- [ ] Thi thử 30 câu đúng 24/30 → hiện "KHÔNG ĐẠT"
- [ ] Thi thử 30 câu đúng 30/30 → hiện "ĐẠT" ✅
- [ ] Lịch sử cũ (không có trường `isPassed`) vẫn tính lại đúng
- [ ] Tên học viên hiển thị đúng ở màn hình kết quả (cả Thi thử lẫn Ôn tập)
- [ ] Nếu user chưa có tên → hiện "Học viên ẩn danh"

## Phase 03: Core Features (Web & Win)

### Task 1: Luyện lại câu sai (Zustand State)
- [ ] **Step 1.1: Viết test thất bại (RED)**
- [ ] **Step 1.2: Implement tối thiểu (GREEN)**

### Task 2: Logic gom câu sai sau nộp bài & Xóa khi làm đúng
- [ ] **Step 2.1: Gom câu sai khi nộp bài (web + win)**
- [ ] **Step 2.2: Xoá câu sai nếu đang ở mock quiz (màn luyện QuizScreen)**
- [ ] **Step 2.3: Nút "Luyện câu sai" trên Dashboard**
- [ ] **Step 2.4: Gom câu sai khi nộp bài luyện ở QuizScreen (web + win)**
- [ ] **Step 2.5: Mở khóa (Unlock) vòng lặp và ẩn Đáp Án (Web + Win)**

### Task 3: Tìm kiếm câu hỏi (Utility & UI)
- [ ] **Step 3.1: Viết test thất bại (RED)**
- [ ] **Step 3.2: Implement tối thiểu (GREEN)**
- [ ] **Step 3.3: Gắn UI Search Bar**

### Task 4: Báo cáo tiến bộ (Progress Chart)
- [ ] **Step 4.1: Verify Recharts**
- [ ] **Step 4.2: Implement Chart Component**
- [ ] **Step 4.3: Gắn ProgressDashboard vào Dashboard (web + win)**

### Task 5: Hook Phím tắt làm bài
- [ ] **Step 5.1: Implement Hook**
- [ ] **Step 5.2: Gắn vào ExamQuizScreen2 (Adapter bọc state)**

### Task 6: Nhắc học mỗi ngày + Streak (Feature 8)
- [ ] **Step 6.1: Logic Streak trong Store (dùng localStorage)**
- [ ] **Step 6.2: Gọi updateStreak + lên lịch nhắc khi mở app**
- [ ] **Step 6.3: UI Cài đặt giờ nhắc + Local Notification**

## Phase 04: Platform Integrations (Web & Win)

### Task 1: PWA Manifest (Feature 12)
- [ ] **Step 1.1: Tạo manifest.json và Icons**
- [ ] **Step 1.2: Đăng ký PWA (Installable)**
- [ ] **Step 1.3: Service Worker tối thiểu (BẮT BUỘC để hiện nút Cài đặt)**

### Task 2: Electron System Tray & Window Controls (Feature 15, 16)
- [ ] **Step 2.1: Kéo mainWindow ra module-level, chặn instance thứ 2 & Implement Tray**
- [ ] **Step 2.2: Implement Global Shortcut + Cleanup**

### Task 3: Sync Data Chủ Động (Feature 17)
- [ ] **Step 3.1: Hàm check version an toàn (dataService)**
- [ ] **Step 3.2: Hàm thực hiện Tải Dữ Liệu (syncService)**
- [ ] **Step 3.3: Thêm block cập nhật đề vào ChangelogModal sẵn có**
- [ ] **Step 3.4: Check đề mới lúc khởi động (App.tsx)**

### Task 4: Chuyển đổi Fullscreen (Feature 19)
- [ ] **Step 4.1: Đón sự kiện IPC ở Main**
- [ ] **Step 4.2: Gửi sự kiện IPC từ React**

## Phase 05: Testing & Release
- [ ] **Bước 1: Web Testing**
- [ ] **Bước 2: Win Testing (Electron)**
- [ ] **Bước 3: Build & Release**
- [ ] **Bước 4: Kế hoạch Rollback**


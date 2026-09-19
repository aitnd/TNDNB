# Kế Hoạch Triển Khai Tính Năng Mới (Đợt 1 + 2)

Dưới đây là danh sách toàn bộ các tác vụ cần thực hiện. Khi hoàn thành, hãy đánh dấu `[x]`.

## Phase 01: Setup & Initialization
- [x] **Bước 1: Khởi tạo branch mới**
- [x] **Bước 2: Review Code & Dependencies**
- [x] **Bước 3: Chuẩn bị Supabase / Local Storage**

## Phase 02: Bug Fixes (Detailed)

### 📋 Nguyên nhân gốc (Root Cause Analysis)

### 📐 Quy tắc nghiệp vụ (Business Rules - từ Owner)

### ✅ Checklist sửa lỗi
- [x] **Bước 1.1: Tạo hàm helper `calculateIsPass()` dùng chung**
- [x] **Bước 1.2: Sửa `ExamResultsScreen.tsx` (cả web và win)**
- [x] **Bước 1.3: Sửa `HistoryScreen.tsx` (CHỈ bản Web)**
- [x] **Bước 1.4: Sửa logic lưu kết quả thi để thêm trường `isPassed` (cả Web & Win)**
- [x] **Bước 1.5: Sửa tất cả HistoryModal (8 file) để fallback dữ liệu cũ**

### 📋 Nguyên nhân gốc

### ✅ Checklist sửa lỗi
- [x] **Bước 2.1: Sửa lỗi truyền prop `userName` bị rỗng từ gốc**
- [x] **Bước 2.2: Thêm fallback an toàn vào bên trong 4 Component (Web & Win)**
- [x] Ôn tập 18 câu đúng 18/18 → hiện "ĐẠT" ✅
- [x] Ôn tập 18 câu đúng 17/18 → hiện "KHÔNG ĐẠT"
- [x] Thi thử 30 câu đúng 25/30 → hiện "ĐẠT" ✅
- [x] Thi thử 30 câu đúng 24/30 → hiện "KHÔNG ĐẠT"
- [x] Thi thử 30 câu đúng 30/30 → hiện "ĐẠT" ✅
- [x] Lịch sử cũ (không có trường `isPassed`) vẫn tính lại đúng
- [x] Tên học viên hiển thị đúng ở màn hình kết quả (cả Thi thử lẫn Ôn tập)
- [x] Nếu user chưa có tên → hiện "Học viên ẩn danh"

## Phase 03: Core Features (Web & Win)

### Task 1: Luyện lại câu sai (Zustand State)
- [x] **Step 1.1: Viết test thất bại (RED)**
- [x] **Step 1.2: Implement tối thiểu (GREEN)**

### Task 2: Logic gom câu sai sau nộp bài & Xóa khi làm đúng
- [x] **Step 2.1: Gom câu sai khi nộp bài (web + win)**
- [x] **Step 2.2: Xoá câu sai nếu đang ở mock quiz (màn luyện QuizScreen)**
- [x] **Step 2.3: Nút "Luyện câu sai" trên Dashboard**
- [x] **Step 2.4: Gom câu sai khi nộp bài luyện ở QuizScreen (web + win)**
- [x] **Step 2.5: Mở khóa (Unlock) vòng lặp và ẩn Đáp Án (Web + Win)**

### Task 3: Tìm kiếm câu hỏi (Utility & UI)
- [x] **Step 3.1: Viết test thất bại (RED)**
- [x] **Step 3.2: Implement tối thiểu (GREEN)**
- [x] **Step 3.3: Gắn UI Search Bar**

### Task 4: Báo cáo tiến bộ (Progress Chart)
- [x] **Step 4.1: Verify Recharts**
- [x] **Step 4.2: Implement Chart Component**
- [x] **Step 4.3: Gắn ProgressDashboard vào Dashboard (web + win)**

### Task 5: Hook Phím tắt làm bài
- [x] **Step 5.1: Implement Hook**
- [x] **Step 5.2: Gắn vào ExamQuizScreen2 (Adapter bọc state)**

### Task 6: Nhắc học mỗi ngày + Streak (Feature 8)
- [x] **Step 6.1: Logic Streak trong Store (dùng localStorage)**
- [x] **Step 6.2: Gọi updateStreak + lên lịch nhắc khi mở app**
- [x] **Step 6.3: UI Cài đặt giờ nhắc + Local Notification**

## Phase 04: Platform Integrations (Web & Win)

### Task 1: PWA Manifest (Feature 12)
- [x] **Step 1.1: Tạo manifest.json và Icons**
- [x] **Step 1.2: Đăng ký PWA (Installable)**
- [x] **Step 1.3: Service Worker tối thiểu (BẮT BUỘC để hiện nút Cài đặt)**

### Task 2: Electron System Tray & Window Controls (Feature 15, 16)
- [x] **Step 2.1: Kéo mainWindow ra module-level, chặn instance thứ 2 & Implement Tray**
- [x] **Step 2.2: Implement Global Shortcut + Cleanup**

### Task 3: Sync Data Chủ Động (Feature 17)
- [x] **Step 3.1: Hàm check version an toàn (dataService)**
- [x] **Step 3.2: Hàm thực hiện Tải Dữ Liệu (syncService)**
- [x] **Step 3.3: Thêm block cập nhật đề vào ChangelogModal sẵn có**
- [x] **Step 3.4: Check đề mới lúc khởi động (App.tsx)**

### Task 4: Chuyển đổi Fullscreen (Feature 19)
- [x] **Step 4.1: Đón sự kiện IPC ở Main**
- [x] **Step 4.2: Gửi sự kiện IPC từ React**

## Phase 05: Testing & Release
- [ ] **Bước 1: Web Testing**
- [ ] **Bước 2: Win Testing (Electron)**
- [ ] **Bước 3: Build & Release**
- [ ] **Bước 4: Kế hoạch Rollback**


# Phase 04: Profile Integration & Auto-unlocks
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Tích hợp giao diện Bộ sưu tập huy hiệu mới phân nhóm bằng Tiêu đề dạng Grid, bổ sung MiniRoleBadge vào các view hiển thị tên cá nhân và thiết lập trigger tự động cày tiến trình học tập.

## Implementation Steps
1. [ ] **Chỉnh sửa `AccountScreen.tsx` (Web và Win):**
   - Import `MiniRoleBadge` từ `./Badges/MiniRoleBadge`.
   - Tìm thẻ hiển thị tên `<h2>{myInfo.fullName}</h2>` (dòng 233) và thay thế bằng cấu trúc Flexbox căn giữa hiển thị tên kèm `<MiniRoleBadge role={myInfo.role} />`.
2. [ ] **Nâng cấp `BadgeList.tsx` (Web và Win):**
   - Thiết kế giao diện danh sách huy hiệu chung dạng Grid.
   - Sử dụng các tiêu đề phân nhóm:
     *   `👑 HUY HIỆU CHỨC DANH (ROLES)`
     *   `📖 HUY HIỆU ÔN TẬP (PRACTICE)`
     *   `⚓ HUY HIỆU THI THỬ (MOCK EXAMS)`
     *   `🔥 HUY HIỆU CHUYÊN CẦN & ĐẶC BIỆT`
   - Thay thế `BadgeIcon` cũ bằng `BadgeIcon3D` để áp dụng chuyển động nghiêng 3D.
3. [ ] **Thiết lập Trigger cày Ôn tập / Thi thử tự động:**
   - Trong `handleQuizFinish` của Web App (`App.tsx`), thêm logic tính toán số câu trả lời đúng và tổng số câu hỏi đã làm.
   - Gọi `BadgeService.updateBadgeProgress` để ghi nhận tiến trình ôn tập lên Firestore.
   - Đồng bộ hóa logic này vào trang thi thử của Windows App (`App.tsx`).

## Files to Create/Modify
- `d:/Antigravity/TNDNB/ontap-web/components/AccountScreen.tsx` - [MODIFY] Hiển thị MiniRoleBadge cạnh tên hồ sơ
- `d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeList.tsx` - [MODIFY] Giao diện Grid phân nhóm bằng tiêu đề
- `d:/Antigravity/TNDNB/ontap-web/App.tsx` - [MODIFY] Thêm trigger gọi updateBadgeProgress khi nộp bài
- Đồng bộ các file trên sang `ontap-win/` tương ứng.

## Test Criteria
- Đăng nhập tài khoản Admin/Leader, truy cập `/ontap/profile` xem có hiện Huy hiệu Admin vàng óng bên cạnh tên không.
- Làm một bài ôn tập 5 câu hỏi, bấm nộp bài, kiểm tra xem tiến trình của Huy hiệu Ôn tập có nhảy lên +5 không, và popup chúc mừng có nổ pháo hoa Confetti khi đạt mốc không.

# Phase 02: Backend & BadgeService Updates
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Cập nhật tệp định nghĩa hằng số huy hiệu và API logic lưu trữ để hỗ trợ đầy đủ 22 thành tích mới + 5 Role. Khắc phục triệt để lỗi lệch ID (`achievement_1` và `achievement_perfect`).

## Implementation Steps
1. [ ] **Mở rộng type định nghĩa huy hiệu:**
   Cập nhật `badges.ts` (Web và Win) để mở rộng các groups (`on_tap`, `thi_thu`, `streak`, `interaction`, `special`, `role`) và levels (`dong`, `bac`, `vang`, `kim_cuong`, `dac_biet`, `role`).
2. [ ] **Khai báo 22 Huy hiệu mới:**
   Khai báo đầy đủ danh sách 22 huy hiệu thành tích và 5 huy hiệu Role trong `BADGE_DEFINITIONS` với các mô tả chi tiết, Icon tương ứng, và chỉ số điều kiện mở khóa (ví dụ: `targetValue: 50` câu ôn tập).
3. [ ] **Ánh xạ ID cũ (ID Aliasing):**
   Trong `badgeService.ts` (hàm `unlockBadge` và `updateBadgeProgress`), thêm đoạn code tự động chuyển đổi:
   - Nếu `badgeId === 'achievement_1'` ➔ chuyển thành `lan_dau_ra_khoi`.
   - Nếu `badgeId === 'achievement_perfect'` ➔ chuyển thành `diem_tuyet_doi`.
   Điều này giúp giữ nguyên mã nguồn cũ ở các trang thi mà không bị lỗi.
4. [ ] **Viết thêm hàm hỗ trợ ôn tập:**
   Bổ sung hàm `increasePracticeProgress(uid, questionsCount)` để cộng dồn tiến trình làm bài của học viên và tự động mở khóa các mốc huy hiệu ôn tập.

## Files to Create/Modify
- `d:/Antigravity/TNDNB/ontap-web/constants/badges.ts` - [MODIFY] Định nghĩa 22 huy hiệu + 5 Role mới
- `d:/Antigravity/TNDNB/ontap-web/services/badgeService.ts` - [MODIFY] Thêm ID mapping, sửa logic unlock và thêm hàm cày ôn tập
- `d:/Antigravity/TNDNB/ontap-win/constants/badges.ts` - [MODIFY] Đồng bộ với bản Web
- `d:/Antigravity/TNDNB/ontap-win/services/badgeService.ts` - [MODIFY] Đồng bộ với bản Web

## Test Criteria
- Unit test hoặc test thủ công hàm `unlockBadge` truyền vào `achievement_1` xem Firestore có tạo bản ghi `lan_dau_ra_khoi` hay không.
- Kiểm tra TypeScript compile của tệp `badges.ts` không báo lỗi đỏ.

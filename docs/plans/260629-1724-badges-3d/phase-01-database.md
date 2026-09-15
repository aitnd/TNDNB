# Phase 01: Database & Seed Script
Status: ⬜ Pending
Dependencies: None

## Objective
Đảm bảo Firestore đã sẵn sàng lưu trữ cho 22 Huy hiệu thành tích mới và 5 Role. Cấu trúc lưu trữ sẽ là:
`users/{uid}/userBadges/{badgeId}`
Trường dữ liệu:
- `badgeId` (string)
- `isUnlocked` (boolean)
- `isNew` (boolean)
- `currentProgress` (number)
- `targetValue` (number)
- `unlockedAt` (Timestamp | null)
- `updatedAt` (Timestamp)

## Implementation Steps
1. [ ] **Seed Data script:** Viết một script tiện ích `/scripts/seedBadges.js` để có thể chạy khi cần thiết lập mặc định (mở khóa trước cho các admin hoặc reset toàn bộ tiến trình cho học viên mới).
2. [ ] **Firebase Rules:** Kiểm tra tệp rules bảo mật của Firestore để đảm bảo học viên chỉ có quyền đọc tiến trình huy hiệu của mình, và chỉ có Admin/Teacher được phép ghi trực tiếp (unlock/revoke badge). Học viên chỉ được ghi tiến trình học tập (`exam_results`), và một Firebase Function (nếu có) hoặc Logic Client an toàn sẽ tự động unlock.

## Files to Create/Modify
- `d:/Antigravity/TNDNB/scripts/seedBadges.js` - [NEW] Script node để thiết lập/dọn dẹp huy hiệu trên Firestore
- `d:/Antigravity/TNDNB/firestore.rules` - [MODIFY] Cập nhật security rules nếu cần thiết để bảo vệ dữ liệu huy hiệu

## Test Criteria
- Chạy thử script seed cho tài khoản test và kiểm tra cấu trúc lưu trữ trên Firestore Emulator/Console.
- Test quyền đọc ghi của học viên (không được tự ý gọi API thay đổi `isUnlocked` trực tiếp mà không qua logic hợp lệ).

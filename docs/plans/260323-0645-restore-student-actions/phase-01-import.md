# Phase 01: Import Học viên bằng Excel
Status: ⬜ Pending
Dependencies: None

## Objective
Khôi phục giao diện và chức năng Thêm học viên hàng loạt từ Excel bị sót khi nâng cấp ClassDetail.

## Requirements
### Functional
- [ ] Thêm nút 'Nhập từ Excel' (có biểu tượng Excel) trên góc phải giao diện Quản lý Học viên.
- [ ] Phục hồi component `ImportStudentModal.tsx` và mount nó khi nhấn nút nhập Excel ở `StudentsTab.tsx`.

### Non-Functional
- [ ] Giữ nguyên các thao tác trực quan theo theme mới (hiệu ứng, icon, nút hover đẹp, tooltip).

## Files to Modify
- `ontap-win/components/ClassDetail/StudentsTab.tsx`
- `ontap-win/components/ImportStudentModal.tsx` (kiểm tra lại code styling mới nếu cần).

## Notes
Nút "Nhập Excel" nên được đặt màu Lục Nhạt (emerald) để nhận diện nhanh chức năng Import.

---
Next Phase: `phase-02-actions.md`

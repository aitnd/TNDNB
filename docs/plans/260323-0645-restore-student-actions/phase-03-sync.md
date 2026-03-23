# Phase 03: Đồng bộ ontap-web và ontap-win
Status: ⬜ Pending
Dependencies: phase-02

## Objective
Gộp thay đổi `StudentsTab.tsx` sang bản web để đảm bảo parity code như đã hứa.

## Requirements
- Copy toàn vẹn `StudentsTab.tsx` qua `ontap-web/components/ClassManagement/StudentsTab.tsx`.
- Đồng bộ `ImportStudentModal.tsx` qua Web hoặc chia sẻ chung (tuỳ). Web chưa có ImportModal thì copy qua.

## Notes
Xác nhận ImportStudentModal được import chính xác.
Test compile cả 2 nền tảng.
Sau khi làm xong, quay lại cập nhật checkbox.

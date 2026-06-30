# Phase 01: Cập nhật app/layout.tsx
Status: ⬜ Pending
Dependencies: None

## Objective
Sửa đổi cách nhúng script Monetag sang thẻ HTML thô trong NextJS layout.

## Implementation Steps
1. [ ] Cập nhật `app/layout.tsx`:
   - Định nghĩa khối `<head>` bên trong `<html>` của Root Layout.
   - Thêm thẻ `<script src="https://quge5.com/88/tag.min.js" data-zone="254797" async data-cfasync="false"></script>` thô vào trong `<head>`.
   - Gỡ bỏ component `<Script id="monetag-multitag" ... />` của Next.js ở cuối thẻ `<body>`.

## Files to Create/Modify
- [MODIFY] [layout.tsx (Portal Layout)](file:///d:/Antigravity/TNDNB/app/layout.tsx)

## Test Criteria
- Build NextJS portal thành công.

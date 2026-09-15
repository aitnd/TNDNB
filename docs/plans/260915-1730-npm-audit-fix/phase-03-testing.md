# Phase 3: Testing
Status: Pending

## Objectives
Ensure updates do not break the application — test tương ứng tầng rủi ro đã đụng.

## Steps
1. **Web Project (`ontap-web`)**:
   - Run `npm run dev` and verify UI renders.
   - Run `npm run build` to ensure successful compilation.
   - Run `npm run test:run` (vitest phải xanh).
   - Nếu đụng 🟡 `socket.io-parser`: test tính năng realtime (socket connect/disconnect).
   - Nếu đụng 🔴 `websocket-driver`: smoke test Firebase Realtime DB đọc/ghi.
2. **Win Project (`ontap-win`)**:
   - Run `npm run dev` để verify.
   - Run `npm run test:run` (vitest phải xanh).
   - Nếu đụng `tar`/`js-yaml`/builder chain: chạy `npm run electron:build:x64` thử + kiểm tra app khởi động (updater đọc `latest.yml` không lỗi).
   - Nếu đụng 🔴 `websocket-driver`: smoke test Firebase realtime như web.
3. **Rollback**: bất kỳ bước nào fail do overrides → revert `package.json` + `package-lock.json`, `npm install` lại, ghi lại gói đó vào danh sách "giữ nguyên có lý do".

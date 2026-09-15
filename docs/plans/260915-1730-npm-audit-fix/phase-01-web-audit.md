# Phase 1: Web Audit Fix
Status: Done (2026-09-15 — 15 vulns → 2 moderate, 0H/0C, test 7/7 + build pass, không cần overrides)

## Objectives (đã rà soát audit full 2026-09-15: 15 vulns — 6 High + 1 Critical)
Fix theo tầng rủi ro, mục tiêu **0 Critical/High** (low/moderate giữ lại có lý do):

| Gói | Mức | Chuỗi cha | Tầng |
|---|---|---|---|
| `postcss`, `nanoid`, `browserslist`, `brace-expansion` | High | transitive sâu (tailwind chain) | 🟢 `audit fix` tự xong |
| `undici@7.28.0` | High | `jsdom` (dev, test only) | 🟢 `audit fix` |
| `socket.io-parser@4.2.6` | High | `socket.io@4.8.3` (direct dep) | 🟡 overrides/bump + test realtime |
| `websocket-driver@0.7.4` | Critical | `firebase@12.8.0` → realtime DB (production) | 🔴 CUỐI CÙNG, có rollback |

## Steps
1. Backup: `git stash` hoặc commit checkpoint trước khi chạy (để rollback).
2. Execute `npm audit fix` in `ontap-web` (xử lý nhóm 🟢).
3. Re-run `npm audit`: nhóm 🟡 còn sót thì thêm `"overrides"` vào `package.json` (KHÔNG đè `uuid` cũ):
   Example:
   ```json
   "overrides": {
     "uuid": "^11.1.1",
     "socket.io-parser": "^4.2.7"
   }
   ```
4. Run `npm install` để áp overrides.
5. Nhóm 🔴 (`websocket-driver`): chỉ đụng sau khi 🟢🟡 xanh — thử overrides, smoke test Firebase realtime DB, fail thì revert.
6. Re-run `npm audit` xác nhận 0 Critical/High; ghi lại low/moderate nào cố ý giữ + lý do vào task.md.

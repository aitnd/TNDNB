# Phase 2: Win Audit Fix
Status: Done (2026-09-15 — 25 vulns → 2 moderate, 0H/0C, test 7/7 + build pass + tsc sạch, không cần overrides)

## Objectives (đã rà soát audit full 2026-09-15: 25 vulns — 12 High + 2 Critical)
Fix theo tầng rủi ro, mục tiêu **0 Critical/High**:

| Gói | Mức | Chuỗi cha | Tầng |
|---|---|---|---|
| `tar@7.5.16` | Critical | `electron-builder` chain (build-time) | 🟢 overrides `^7.5.21`, rủi ro runtime thấp |
| `brace-expansion`, `browserslist`, `nanoid`, `postcss` | High | transitive sâu | 🟢 `audit fix` |
| `undici` | High | `node-gyp`/`@electron/get`/`jsdom` (dev/build) | 🟢 `audit fix` |
| `fast-uri` | High | `ajv` ← builder (build-time) | 🟢 `audit fix`/overrides |
| `shell-quote` | High | `concurrently` (dev CLI) | 🟢 theo concurrently |
| `axios@1.17.0` | High | `wait-on` (dev CLI) | 🟢 `audit fix`/overrides |
| `concurrently@10.0.3` | High | **direct devDep** | 🟢 bump thẳng version đã vá |
| `@xmldom/xmldom` | High | transitive (trace `npm ls` lúc làm) | 🟡 overrides + build thử |
| `js-yaml@4.2.0` | High | `electron-updater` + builder (updater parse yml lúc chạy!) | 🟡 overrides + smoke test auto-update |
| `socket.io-parser@4.2.6` | High | `socket.io@4.8.1` (direct dep, cũ hơn web 1 patch) | 🟡 bump socket.io đồng bộ web + test realtime |
| `websocket-driver@0.7.4` | Critical | `firebase@12.6.0` → realtime DB | 🔴 CUỐI CÙNG, có rollback |

⚠️ Cảnh báo riêng:
- `js-yaml`: updater đọc `latest.yml` bằng nó — sau override phải verify Electron khởi động + check update không lỗi.
- `websocket-driver`: như web, chỉ đụng sau cùng.

## Steps
1. Backup: commit checkpoint trước khi chạy.
2. Execute `npm audit fix` in `ontap-win` (nhóm 🟢).
3. Bump `concurrently` trực tiếp nếu còn flag.
4. Nhóm 🟡: thêm `"overrides"` từng gói (giữ `uuid` cũ), `npm install`, build thử Electron.
5. Nhóm 🔴 (`websocket-driver`): sau cùng, smoke test Firebase realtime, fail thì revert.
6. Re-run `npm audit` xác nhận 0 Critical/High; ghi low/moderate giữ lại + lý do vào task.md.

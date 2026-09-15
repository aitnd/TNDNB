# Double-Sync Plan: npm audit fix for TNDNB (260915-1730)

## 1. Overview
The TNDNB project consists of `ontap-web` and `ontap-win`. Both projects currently have multiple security vulnerabilities (Critical and High) as reported by `npm audit` **full (gồm devDependencies)** — rà soát 2026-09-15: web 15 vulns (6H+1C), win 25 vulns (12H+2C).

## 2. Strategy — fix theo tầng rủi ro
1. 🟢 Nhóm an toàn trước: chạy `npm audit fix` (chỉ bump semver-compatible: postcss/nanoid/browserslist/brace-expansion, undici qua jsdom, tar/fast-uri/shell-quote/axios qua builder/dev chain).
2. 🟡 Nhóm cần overrides + test: `socket.io-parser` (socket.io direct dep), `js-yaml` (electron-updater parse yml lúc chạy), `concurrently` (bump direct devDep), `@xmldom/xmldom` (trace chuỗi lúc làm).
3. 🔴 Cuối cùng: `websocket-driver` (nằm trong `firebase` realtime DB cả 2 project) — chỉ đụng sau khi 🟢🟡 xanh, có rollback (revert package-lock + node_modules), smoke test realtime.
4. Mục tiêu: **0 Critical/High**. Low/Moderate còn lại được ghi nhận kèm lý do (không ép 0 tuyệt đối).
5. Root portal (`D:\Antigravity\TNDNB` — Next RCE...) **ngoài scope** plan này, xử lý riêng.

## 3. Scope
- `D:\Antigravity\TNDNB\ontap-web`
- `D:\Antigravity\TNDNB\ontap-win`

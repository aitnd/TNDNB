# Tasks for npm audit fix (rà soát 2026-09-15 — audit full)

- [x] **Phase 1: Web Audit Fix** (15 vulns: 6H+1C → 2 moderate, 0H/0C — DONE 2026-09-15)
  - [x] Backup: package.json + package-lock.json copy ra Temp (rollback không cần git)
  - [x] Navigate to `ontap-web`
  - [x] Run `npm audit fix` (nhóm 🟢 — 30 packages changed, xong trong 1 lượt, KHÔNG cần overrides, nhóm 🟡🔴 tự hết theo)
  - [x] Run `npm audit` verify: 0 Critical/High
  - [x] Verify: `npm run test:run` 7/7 xanh + `npm run build` pass 14s

- [x] **Phase 2: Win Audit Fix** (25 vulns: 12H+2C → 2 moderate, 0H/0C — DONE 2026-09-15)
  - [x] Backup: package.json + package-lock.json copy ra Temp
  - [x] Navigate to `ontap-win`
  - [x] Run `npm audit fix` (48 packages changed, 1 lượt, KHÔNG cần overrides/bump tay — cả `tar`, `js-yaml`, `websocket-driver→0.7.5`, `socket.io-parser→4.2.7` đều lên patch semver-safe)
  - [x] Verify: `npm run test:run` 7/7 xanh + `npm run build` pass + `tsc --noEmit` sạch
  - [x] Ghi low/moderate cố ý giữ + lý do (mục "Kept vulnerabilities" cuối file)

- [ ] **Phase 3: Testing & Verification**
  - [ ] Build `ontap-web` (`npm run build`)
  - [ ] Run tests for `ontap-web` (`npm run test:run` phải xanh)
  - [ ] Build `ontap-win` (`npm run build`)
  - [ ] Run tests for `ontap-win` (`npm run test:run` phải xanh)
  - [ ] Smoke test realtime (nếu đụng parser/driver) + updater (nếu đụng js-yaml)
  - [ ] Ensure the application starts properly without runtime errors

## Kept vulnerabilities (ghi khi kết thúc — vuln nào giữ lại + lý do)
- `ontap-web`: 2 moderate `react-router`/`react-router-dom` (GHSA-wrjc..., GHSA-337j...) — fix đòi `npm audit fix --force` lên v7.18.3 (breaking change, app đang dùng API v6) → giữ, tách task migrate riêng.
- `ontap-win`: 2 moderate `react-router`/`react-router-dom` — cùng lý do như web → giữ.

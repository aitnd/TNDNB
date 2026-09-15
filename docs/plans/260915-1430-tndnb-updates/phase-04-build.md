# Phase 4: Build Pipeline & Architecture Split
Status: Done (2026-09-15, verified)
Dependencies: Không (có thể chạy song song với Phase 2/3)

## Objective
Sửa cấu hình electron-builder để build tách riêng x64 và ia32, không ghi đè lên nhau.

## Hiện trạng (package.json dòng 71)
```json
"artifactName": "Onthi-${version}-Setup.${ext}"
```
- Thiếu `${arch}` → bản ia32 ghi đè bản x64 (cùng tên file).
- Prefix hiện tại là `Onthi-` (KHÔNG phải `TNDNB`).
- `electron/installer.nsh` là file rác 2 byte (chỉ chứa BOM `FF FE`).
- Thư mục output: `release/` (dòng 73).

## Implementation Steps

### Step 1: Sửa artifactName (package.json dòng 71)
**TRƯỚC:**
```json
"artifactName": "Onthi-${version}-Setup.${ext}"
```
**SAU:**
```json
"artifactName": "Onthi-${version}-${arch}-Setup.${ext}"
```
Giữ prefix `Onthi-` để auto-update link và link tải cũ không gãy.

### Step 2: Xóa installer.nsh và reference
1. Xóa file `electron/installer.nsh` (2 byte rác).
2. Trong `package.json` dòng 114, xóa dòng:
```json
"include": "electron/installer.nsh"
```
Cấu hình nsis sau khi sửa:
```json
"nsis": {
  "oneClick": false,
  "perMachine": true,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true
}
```

### Step 3: Thêm build scripts
Thêm vào `scripts` trong `package.json` (giữ bước `vite build` như script `electron:build` hiện tại để tránh đóng gói `dist/` cũ):
```json
"electron:build:x64": "cross-env ELECTRON_BUILD=true vite build && electron-builder --win --x64",
"electron:build:ia32": "cross-env ELECTRON_BUILD=true vite build && electron-builder --win --ia32",
"electron:build:all": "cross-env ELECTRON_BUILD=true vite build && electron-builder --win --x64 --ia32"
```

### Step 4: Verify Auto-Update Config
- electron-builder v26 gộp chung 1 file `latest.yml` duy nhất (KHÔNG sinh `latest-ia32.yml` riêng). File này liệt kê cả 3 exe trong `files`, electron-updater tự chọn đúng file theo arch máy — auto-update per-arch vẫn chạy.
- Kiểm tra publish config (dòng 116-120) vẫn đúng provider `github`.
- Lưu ý: `perMachine: true` → cài trên máy x32 đòi quyền admin.

## Kết quả thực tế (verified 2026-09-15, user chấp nhận)
- Mỗi lệnh build sinh 3 file (vì `win.target.arch: [x64, ia32]` còn nguyên trong config nên CLI `--x64`/`--ia32` bị bỏ qua — 3 scripts `:x64`/`:ia32`/`:all` cho output giống hệt nhau):
  - `Onthi-3.16.0-x64-Setup.exe` (209 MB), `Onthi-3.16.0-ia32-Setup.exe` (195.5 MB), `Onthi-3.16.0-Setup.exe` universal (404 MB)
- Mục tiêu cốt lõi ĐẠT: x64 và ia32 không còn ghi đè nhau. Bản universal là bonus (updater trỏ `path` vào đó).
- Không warning/error về installer.nsh.

## Files to Modify
- [ontap-win/package.json](file:///d:/Antigravity/TNDNB/ontap-win/package.json) — artifactName, scripts, nsis config
- [ontap-win/electron/installer.nsh](file:///d:/Antigravity/TNDNB/ontap-win/electron/installer.nsh) — DELETE

## File kỳ vọng sau build (thư mục `release/`)
```
release/
├── Onthi-X.Y.Z-x64-Setup.exe
├── Onthi-X.Y.Z-ia32-Setup.exe
├── Onthi-X.Y.Z-Setup.exe            # universal (luôn sinh kèm do config arch còn cả 2)
├── latest.yml                        # 1 file duy nhất, liệt kê cả 3 exe, updater tự chọn theo arch
└── ... (các file .blockmap)
```

## Verification (Manual)
| Test | Thao tác | Kỳ vọng |
|------|---------|---------|
| Build x64 | `cd ontap-win && npm run electron:build:x64` | Output: `Onthi-X.Y.Z-x64-Setup.exe` |
| Build ia32 | `cd ontap-win && npm run electron:build:ia32` | Output: `Onthi-X.Y.Z-ia32-Setup.exe` |
| Không ghi đè | `cd ontap-win && npm run electron:build:all` | Cả 2 file tồn tại đồng thời trong `release/` |
| Không warning | Build xong | Không có warning/error về installer.nsh |
| Rollback | Nếu ia32 fail | Revert package.json, ghi issue |

## Win 7 Note
Nhánh chính: Windows 10+ (x64 + ia32 tách riêng). Người dùng Win 7 dùng bản Web offline. Không duy trì nhánh Electron 22.

---
Next Phase: [Phase 5 - Testing](file:///d:/Antigravity/TNDNB/docs/plans/260915-1430-tndnb-updates/phase-05-testing.md)

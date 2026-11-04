# Plan: Sửa lỗi màn hình trắng & cập nhật phiên bản (Bản Hậu Review)

## 1. Mục tiêu (PRD)
- Sửa dứt điểm màn hình trắng (do thiếu .env, lỗi throw tĩnh ở module, trùng lặp instance).
- Sửa lỗi Update version, đồng bộ lại quy trình publish chuẩn CI/CD.

## 2. Kiến trúc & Giải pháp
- **P0 - Gốc rễ màn hình trắng:** Bổ sung biến \VITE_SUPABASE_*\ vào \.env\ và \.env.example\.
- **P1 - Phòng thủ vững chắc:** Chuyển \supabaseClient\ sang lazy-init để không crash ở module evaluation. Gắn \ErrorBoundary\ tại \index.tsx\ làm tuyến phòng thủ số 2.
- **P2 - App & Tray:** Khắc phục \main.cjs\ (thiếu \s\, \process.exit\, bắt lỗi \createTray\, \loadFile\).
- **P3 - Versioning:** Sửa logic sort version (\isVersionLower\, lọc draft/prerelease) trong \UpdateService.ts\, gỡ bỏ \window.require\ sai chuẩn. Thay version tĩnh trong \TopNavbar.tsx\.
- **P4 - Nghiệm thu & Publish:** Chẩn đoán lỗi version, Bump version lên \3.19.4\, smoke-test unpacked, verify \latest.yml\ + \.blockmap\ và \pp_links.version\ trên Firestore. Thêm bước grep-bundle vào quy trình build.

## 3. Các giai đoạn thi công
- **Phase 1:** Fix White Screen (Env, Supabase, main.cjs, index.tsx, .env.example).
- **Phase 2:** Fix Version Check (UpdateService.ts, ChangelogModal.tsx, TopNavbar.tsx).
- **Phase 3:** Chẩn đoán, Publish & Acceptance (Version 3.19.4, Smoke Test, Firestore).


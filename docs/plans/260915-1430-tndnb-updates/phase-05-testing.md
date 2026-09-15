# Phase 5: Testing & Verification

**Objective:** Nghiệm thu tổng hợp cả 3 mảng (login, zoom, build). Phase này aggregate tiêu chí đã defined ở Phase 2/3/4 — PASS khi tất cả checklist dưới đây xanh.

## 1. Login Test (từ Phase 2 — đủ 3 luồng mỗi file)
- [ ] Sai mật khẩu → button hết quay trong < 2 giây, toast đúng message
- [ ] Mất mạng (tắt WiFi) → button hết quay sau tối đa 15 giây, toast "Mất kết nối", user ấn lại nút Đăng nhập
- [ ] Timeout (giả lập mạng rất chậm) → button hết quay sau 15 giây, toast "Kết nối quá chậm"
- [ ] Tài khoản đã lưu + vân tay khi mạng chập chờn → button unlock sau tối đa 15s, không treo
- [ ] Sau mỗi lần lỗi → sửa được username/password ngay, KHÔNG cần restart app
- [ ] Test trên cả Web và Win
- [ ] Chạy vitest `authTimeout` xanh ở cả 2 project (`ontap-web` và `ontap-win`)

## 2. Zoom Test (từ Phase 3)
- [ ] Slider kéo 50% → 200%, text nội dung quiz scale đúng trên cả 6 màn (web 3 + win 3: QuizScreen, ExamQuizScreen, ExamQuizScreen2)
- [ ] Nút +/- step đúng 10%, hiển thị đúng XX%
- [ ] Navbar, modal, dropdown KHÔNG bị ảnh hưởng
- [ ] Giá trị zoom persist sau reload (localStorage key `quiz-font-scale`)
- [ ] Web và Win hành vi giống nhau

## 3. Build Check (từ Phase 4)
- [ ] `cd ontap-web && npm run build` web thành công (không lỗi TS/bundler)
- [ ] `release/` có đủ: `Onthi-X.Y.Z-x64-Setup.exe`, `Onthi-X.Y.Z-ia32-Setup.exe` (+ universal `Onthi-X.Y.Z-Setup.exe`), `latest.yml` duy nhất liệt kê cả 3 (+ blockmap)
- [ ] 2 file .exe KHÔNG ghi đè nhau
- [ ] Build không báo warning/error về `installer.nsh` missing
- [ ] Smoke test: cài thử trên máy x64 và x32 (Win 10)
- [ ] Rollback: nếu build ia32 fail → revert thay đổi package.json, ghi issue

## Deliverables
- Sign-off login ổn định (7/7 case login xanh — gồm saved-account, vân tay và vitest).
- Sign-off zoom an toàn (5/5 case zoom xanh — 6 màn).
- Sign-off build tách arch sạch (6/6 case build xanh).

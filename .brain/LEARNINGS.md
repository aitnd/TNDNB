# 🎓 LEARNINGS & CORRECTIONS

## 2026-06-26
### Corrections
- **Changelog Double-Encoding**: Các file CHANGELOG.md bị lỗi font chữ tiếng Việt do double-encoding. Khắc phục bằng cách viết script NodeJS đọc file ở hệ encoding `latin1` (ISO-8859-1) và chuyển đổi ghi lại với định dạng UTF-8 chuẩn.
- **Git index.lock Conflict**: GitHub Desktop chạy nền chiếm dụng tệp `.git/index.lock` gây lỗi commit. Cần tắt tiến trình GitHub Desktop hoặc xoá thủ công tệp `.git/index.lock` trước khi chạy lệnh git commit tiếp theo.
- **Firebase Private Key Leak**: File `ontap-win/server/serviceAccountKey.json` vô tình bị Git theo dõi (tracked) dù đã có trong `.gitignore`. Khắc phục bằng cách chạy `git rm --cached ontap-win/server/serviceAccountKey.json` và commit lại trạng thái đã untrack.

## 2026-06-29
### Corrections
- **Sub-agent API Quota Limit (429)**: Chạy song song quá nhiều sub-agent hoặc gọi các agent có prompt phức tạp liên tục dễ dẫn đến lỗi vượt hạn mức (Resource Exhausted 429). Khắc phục bằng cách thực hiện đồng bộ file thủ công (hoặc script PowerShell trực tiếp) và chia nhỏ tác vụ để tránh quá tải hạn mức.

## 2026-06-30
### Corrections
- **Monetag Static Verification**: Thẻ `<Script>` động của Next.js không được bot quét tĩnh của Monetag nhận diện. Phải sử dụng thẻ `<script>` HTML tĩnh thô trực tiếp trong `<head>` của `layout.tsx` để hoàn tất cài đặt thành công.
- **Framer Motion Opacity Bug**: Cấu hình `initial={{ opacity: 0 }}` mà không chỉ định `opacity: 1` trong animate object của motion components làm ẩn vĩnh viễn Huy hiệu Admin.

## 2026-09-15
### Corrections
- **Login Hang Root Cause:** Nút đăng nhập kẹt không phải do thiếu `finally` mà do (1) `finally` có điều kiện `if (!auth.currentUser)` và (2) promise Firebase treo vĩnh viễn khi mạng chập chờn (`navigator.onLine` vẫn true nên không rơi vào nhánh offline). Fix = `finally` vô điều kiện + `timeoutWrapper` 15s bọc TẤT CẢ call site (mỗi LoginScreen có 3: handleLogin/saved/biometric; WindowsLoginScreen 2 qua performLogin).
- **Scoped Font Zoom:** Quiz/Exam screens dùng class Tailwind rem cố định (`text-2xl`, `text-lg`) nên CSS variable không tự ăn — phải override tường minh `fontSize: calc(<base>rem * var(--content-scale, 1))` giữ đúng base từng phần tử. ExamQuizScreen2 web/win khác base nhau (1.125rem vs 1rem), phải đọc code từng file.
- **electron-builder arch:** `win.target.arch: [x64, ia32]` trong config đè CLI `--x64/--ia32` — 3 scripts cho output giống hệt nhau (x64 + ia32 + universal). `latest.yml` duy nhất liệt kê cả 3, updater tự chọn theo arch (không cần latest-ia32.yml).
- **npm audit --omit=dev che vuln:** tar/fast-uri/shell-quote/undici nằm ở chuỗi dev, audit thiếu flag tưởng đã hết. Luôn audit full khi review bảo mật.
- **Subagent Read-Only Block:** Khi subagent bị policy read-only từ chối ghi, main agent tự áp patch đã verify (ghi log rõ) thay vì stall — đúng tinh thần "Rulings, not Stalls".


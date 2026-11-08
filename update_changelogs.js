const fs = require('fs');

const date = '2026-11-08';

const newEntryUser = `## [3.22.0] - ${date}
### 🌟 Tính năng mới (New Features)
- **Nhật ký Thay đổi Kép (Người dùng & Kỹ thuật):** Khôi phục màn hình Lịch sử cập nhật tốc độ tức thì (hoạt động cả khi mất mạng), bổ sung thanh chuyển đổi linh hoạt giữa góc nhìn **👤 Người dùng** và **💻 Kỹ thuật (Dev)** cùng toàn bộ lịch sử hơn 45 phiên bản từ những ngày đầu xây dựng hệ thống.
- **Cài đặt Ứng dụng Nhanh trên Điện thoại (Smart App Banner):** Tích hợp thanh gợi ý cài đặt ứng dụng (PWA) ngay trên trình duyệt di động Android và hướng dẫn trực quan cho iOS Safari, tự động ẩn thông minh trong 7 ngày khi người dùng bấm đóng.
- **Lưu Trữ Cấu Hình Hệ Thống Kép Bền Vững:** Nâng cấp tính năng lưu cài đặt quản trị (\`/ontap/settings\`) đồng thời trên cả máy chủ tốc độ cao Cloudflare KV và cơ sở dữ liệu dự phòng Firestore, đảm bảo cấu hình không bao giờ bị thất lạc.
- **Lối Tắt Ôn Tập Trực Tiếp Trên Cổng Thông Tin:** Bổ sung mục truy cập nhanh **Ôn tập & Thi thử** ngay trên thanh công cụ của Cổng thông tin chính và trang Quản lý đào tạo.

### 🚀 Giao diện & Trải nghiệm (UI/UX Overhaul)
- **Tối Ưu Màn Hình Làm Bài Thi Trên Điện Thoại (First Fold Focus):** Ẩn toàn bộ phần thông tin cá nhân (ảnh thẻ, số báo danh, lớp, địa chỉ) khi đang làm bài trên điện thoại; thay bằng thanh tiêu đề siêu gọn hiển thị đồng hồ đếm ngược và tiến độ câu hỏi, giúp câu hỏi và 4 đáp án A, B, C, D hiện ngay trên màn hình đầu tiên mà không cần cuộn trang (trên máy tính giữ nguyên giao diện phòng thi chuẩn).
- **Thanh Nhắc Làm Bài Thi Dở Thông Minh (Resume Session Banner):** Thay thế nút vàng nổi "Làm bài tiếp" từng che khuất màn hình điện thoại nhỏ bằng thanh thông báo gọn gàng ngay dưới đầu trang, bổ sung nút **✕ Bỏ qua** để học viên thoải mái thoát ra chọn đề thi hoặc môn học khác.
- **Tối Giản Bảng Điều Khiển Di Động & Menu 3 Gạch:** Đưa Thẻ học viên lên vị trí đầu tiên và nút lớn **"VÀO ÔN TẬP / THI THỬ"** ngay bên dưới; gom các nút phụ (Tài khoản, Đăng xuất, Đổi giao diện) vào Menu 3 gạch ngang gọn gàng ở góc phải màn hình.
- **Tinh Giản Hộp Thoại Chào Mừng (Welcome Modal):** Thiết kế lại hộp thoại giới thiệu trang trọng với biểu tượng bánh lái tàu 3D ở chính giữa, loại bỏ các thông số quảng cáo rườm rà và giữ nguyên thông tin liên hệ chính thức của nhà trường.
- **Đồng Bộ Phông Chữ Tiếng Việt & Giao Diện Sáng/Tối:** Chuẩn hóa phông chữ tiếng Việt sắc nét trên toàn bộ Cổng thông tin (khắc phục triệt để hiện tượng chữ to chữ bé ở các ký tự có dấu phức tạp) và nâng cấp giao diện Ôn tập sang tông màu Hàng hải hiện đại (hỗ trợ cả chế độ Sáng và Tối).
- **Chuẩn Hóa Giao Diện Cổng Thông Tin Chính:** Khóa giao diện chuẩn **Hallmark Editorial** trang trọng, loại bỏ các hiệu ứng tuyết rơi và nhạc nền tự phát gây phân tâm người đọc.

### 🔧 Sửa lỗi & Ổn định hệ thống (Bug Fixes & Stability)
- **Tối Ưu Trải Nghiệm Đăng Nhập Thuận Tiện:** Mặc định tích sẵn 2 ô **☑ Ghi nhớ đăng nhập** và **☑ Lưu tài khoản này**; tắt hộp thoại cảnh báo đăng nhập thiết bị mới gây gián đoạn và bỏ yêu cầu tự động xin quyền vị trí GPS khi vừa vào trang.
- **Tăng Tốc Độ Tải Bài Viết & Khắc Phục Lỗi Hiển Thị Trang Chủ:** Tối ưu hóa đường truyền tải tin tức đạt tốc độ tức thì (\`< 50ms\`) và khắc phục triệt để lỗi nháy giao diện trên thanh trượt tin nổi bật.
- **Khôi Phục Trình Soạn Thảo Văn Bản & Liên Kết Chân Trang:** Mở khóa đầy đủ chức năng trình soạn thảo bài viết TinyMCE cho quản trị viên và sửa lỗi liên kết trang Tuyển dụng ở chân trang.
- **Vận Hành Êm Ái Cho Khách Vãng Lai (Zero-Noise Console):** Tự động dùng cấu hình mặc định an toàn khi học viên làm bài thử không cần đăng nhập, loại bỏ hoàn toàn các thông báo lỗi kết nối ngầm.

`;

const newEntryDev = `## [3.22.0] - ${date}
### 💻 Kiến trúc & Core Engine (Architecture & Core)
- **Dual-Changelog Raw Markdown Engine (\`parseChangelog.ts\`):** Khôi phục bộ parser regex nội bộ đọc trực tiếp từ \`CHANGELOG.md?raw\` và \`CHANGELOG_DEV.md?raw\` thông qua Vite static asset bundling (0ms latency, 100% PWA offline-first); phân loại tự động 6 nhóm section (\`Sparkles\`, \`Rocket\`, \`Wrench\`, \`Shield\`, \`Code\`, \`List\`); khôi phục 41 phiên bản lịch sử (\`3.19.0\` ➔ \`3.6.0\`) bị cắt nhầm trong commit \`0c7116f3\`.
- **Segregated Web vs Windows Modal Architecture (\`ChangelogModal.tsx\`):** Tích hợp Segmented Control Tab Switcher (\`[👤 Người dùng]\` / \`[💻 Kỹ thuật (Dev)]\`) trên cả \`ontap-web\` và \`ontap-win\` nhưng bảo toàn tuyệt đối khối Electron Auto-Updater (\`window.electron.downloadUpdate\`, \`installUpdate\`, \`onUpdateProgress\`) và bộ đồng bộ gói câu hỏi offline (\`shouldUpdateQuestions\`, \`fetchAndSaveQuestions\`) trên bản Windows.
- **Edge-First Article Caching (\`lib/d1-articles.ts\`):** Tối ưu hóa truy vấn bài viết qua Cloudflare D1/KV/R2 với cơ chế stale-while-revalidate giúp giảm TTFB xuống \`< 50ms\`.

### 🚀 Frontend & Responsive UI (UI/UX Engineering)
- **Exam UI Responsive Bifurcation (\`ExamQuizScreen.tsx\`):** Tách biệt hoàn toàn Desktop Header (\`hidden md:flex\`) giữ nguyên bố cục phòng thi chuẩn và Mobile Exam Header (\`flex md:hidden\`) siêu mỏng ~38px gồm nút \`[← Thoát]\`, nhãn hạng bằng, tiến độ \`Câu X/Y\` và đồng hồ \`⏱️ MM:SS\` (\`font-mono tabular-nums\`), đẩy câu hỏi cùng 4 đáp án A, B, C, D lên trọn vẹn First Fold.
- **Dismissible Resume Exam Alert Banner (\`App.tsx\`):** Thay thế nút nổi FAB \`fixed bottom-4 left-1/2 animate-bounce\` bằng \`Alert Banner\` đặt cố định dưới \`TopNavbar\` (\`bg-amber-500/10 border-b border-amber-500/30\`), bổ sung nút \`[✕ Bỏ qua]\` (\`setResumeSessionAvailable(false)\`) chỉ ẩn tạm thời trong phiên mà không xóa \`localStorage\` (\`examSessionData\`).
- **Mobile Dashboard & Hamburger Drawer (\`Dashboard.tsx\`, \`TopNavbar.tsx\`):** Tái cấu trúc bố cục Mobile-First đưa Thẻ học viên lên vị trí số 1 và CTA "VÀO ÔN TẬP / THI THỬ" ngay bên dưới; gom các action phụ vào Hamburger Drawer; tích hợp \`SmartAppBanner\` hỗ trợ \`beforeinstallprompt\` (Android) và hướng dẫn Safari (iOS) kèm TTL 7 ngày (\`tndnb_pwa_banner_dismissed_until\`).
- **Minimal Centered Welcome Modal (\`WelcomeModal.tsx\`):** Chuyển đổi từ Grid 2 cột sang thẻ đơn trung tâm (\`max-w-lg text-center\`) với \`HelmIcon3D\`, loại bỏ toàn bộ stat cards tự tạo (\`100%\`, \`30 câu / đề\`, \`24/7\`) và bullet points dư thừa.
- **Self-Hosted Vietnamese Typography & Dual-Theme (\`app/layout.tsx\`, \`ontap-web\`):** Chuyển sang nạp local \`@fontsource/be-vietnam-pro\`, \`@fontsource/merriweather\`, \`@fontsource/jetbrains-mono\` trên 13 tệp Portal giúp triệt tiêu lỗi fallback glyph tiếng Việt ("chữ to chữ bé"); đồng bộ hệ màu Maritime EdTech Dual-Theme (\`light\`/\`dark\`) và khóa theme \`hallmark\` mặc định cho Portal.

### 🛡️ Bảo mật, API & Persistence (Security & Data Layer)
- **Guest Auth Guard (\`ontap-web/services/adminConfigService.ts\`):** Bổ sung điều kiện kiểm tra \`if (!auth?.currentUser)\` ở đầu hàm \`getUsageConfig()\` và \`getGitHubConfig()\` để trả về cấu hình mặc định tĩnh ngay lập tức cho khách vãng lai, triệt tiêu 100% lỗi \`FirebaseError: Missing or insufficient permissions\` trên DevTools Console.
- **Dual-Storage Settings & Private Repo Fallback (\`app/api/ontap/settings/route.ts\`, \`releases/list/route.ts\`):** Thiết lập cơ chế ghi song song Cloudflare KV + Firestore Fallback cho trang cài đặt và trả về mảng rỗng \`200 OK\` êm ái khi kho GitHub \`aitnd/TNDNB\` ở chế độ Private.
- **Auth & TinyMCE License Cleanup (\`RichTextEditor.tsx\`, \`AuthContext.tsx\`):** Cấu hình \`license_key: 'gpl'\` và \`promotion: false\` cho self-hosted TinyMCE; gỡ bỏ lệnh gọi \`supabase.auth.setSession\` không tương thích RS256 Firebase JWT; mặc định bật \`rememberMe = true\` & \`saveCredentials = true\`, tắt \`LoginNotificationModal\` và gỡ bỏ \`requestGeolocationPermission()\` tự động khi mount.
- **React Hydration Mismatch Fix (\`HomePageClient.tsx\`):** Bọc \`FeaturedSlider\` qua \`next/dynamic\` với \`{ ssr: false }\` và skeleton cố định chiều cao \`h-[380px]\`, triệt tiêu hoàn toàn lỗi React Hydration \`#418\` và \`#425\`.

### 🧪 Kiểm thử & Build Pipeline (Testing & Tooling)
- **Automated Vitest Suite (\`scripts/\`):** Mở rộng bộ test tự động kiểm tra đồng bộ phiên bản Monorepo \`v3.22.0\` (\`version-sync.test.ts\`), kiểm thử đơn vị bộ parser Markdown kép & bảo toàn Windows Updater (\`changelog-parser.test.ts\`), kiểm thử responsive Mobile Exam UI (\`mobile-exam-ui-cleanup.test.ts\`) và Guest Auth Guard (\`welcome-modal-and-console-clean.test.ts\`).

`;

function updateChangelog(filePath, entry) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('## [3.22.0]')) {
      console.log('Already up to date: ' + filePath);
      return;
    }
    if (/^# Changelog/i.test(content)) {
      content = content.replace(/^# Changelog\s*\n+/i, '# Changelog\n\n' + entry);
    } else {
      content = entry + content;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
}

updateChangelog('CHANGELOG.md', newEntryUser);
updateChangelog('ontap-web/CHANGELOG.md', newEntryUser);
updateChangelog('ontap-win/CHANGELOG.md', newEntryUser);
updateChangelog('CHANGELOG_DEV.md', newEntryDev);

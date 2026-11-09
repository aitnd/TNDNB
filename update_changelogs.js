const fs = require('fs');

const date = '2026-11-08';

const newEntryUser = `## [3.22.0] - ${date}

### Nâng cấp Trải nghiệm Thi thử Di động & Tối ưu Hệ thống (Web & App Win)
- **Tối ưu phòng thi trên điện thoại:** Thu gọn phần thông tin cá nhân khi đang làm bài, giúp câu hỏi và 4 đáp án hiển thị trọn vẹn ngay trên màn hình mà không cần cuộn trang.
- **Nhắc làm bài dở gọn gàng:** Thay nút nổi che màn hình bằng thanh nhắc nhỏ ở đầu trang, có nút bỏ qua để học viên thoải mái chọn đề thi khác.
- **Cài đặt ứng dụng nhanh:** Hỗ trợ cài đặt ứng dụng **"Giáo dục Ninh Bình"** ra màn hình chính điện thoại kèm hướng dẫn chi tiết cho cả iPhone và Android.
- **Giao diện bảng điều khiển mới:** Đưa Thẻ học viên và nút **"Vào Ôn Tập / Thi Thử"** lên đầu trang, gom các mục phụ vào menu góc phải gọn gàng.
- **Đăng nhập & Vận hành mượt mà:** Tự động ghi nhớ tài khoản đăng nhập, tăng tốc độ mở trang tin tức và đồng bộ phông chữ tiếng Việt rõ nét trên mọi thiết bị.

`;

const newEntryDev = `## [3.22.0] - ${date}
### 💻 Kiến trúc & Core Engine (Architecture & Core)
- **Dual-Changelog Raw Markdown Engine (\`parseChangelog.ts\`):** Khôi phục bộ parser regex nội bộ đọc trực tiếp từ \`CHANGELOG.md?raw\` và \`CHANGELOG_DEV.md?raw\` thông qua Vite static asset bundling (0ms latency, 100% PWA offline-first); phân loại tự động 6 nhóm section (\`Sparkles\`, \`Rocket\`, \`Wrench\`, \`Shield\`, \`Code\`, \`List\`); khôi phục 41 phiên bản lịch sử (\`3.19.0\` ➔ \`3.6.0\`) bị cắt nhầm trong commit \`0c7116f3\`.
- **Segregated Web vs Windows Modal Architecture (\`ChangelogModal.tsx\`):** Tích hợp Segmented Control Tab Switcher (\`[👤 Người dùng]\` / \`[💻 Kỹ thuật (Dev)]\`) trên cả \`ontap-web\` và \`ontap-win\` nhưng bảo toàn tuyệt đối khối Electron Auto-Updater (\`window.electron.downloadUpdate\`, \`installUpdate\`, \`onUpdateProgress\`) và bộ đồng bộ gói câu hỏi offline (\`shouldUpdateQuestions\`, \`fetchAndSaveQuestions\`) trên bản Windows.
- **Edge-First Article Caching (\`lib/d1-articles.ts\`):** Tối ưu hóa truy vấn bài viết qua Cloudflare D1/KV/R2 với cơ chế stale-while-revalidate giúp giảm TTFB xuống \`< 50ms\`.

### 🚀 Frontend & Responsive UI (UI/UX Engineering)
- **Exam UI Responsive Bifurcation (\`ExamQuizScreen.tsx\`):** Tách biệt hoàn toàn Desktop Header (\`hidden md:flex\`) giữ nguyên bố cục phòng thi chuẩn và Mobile Exam Header (\`flex md:hidden\`) siêu mỏng ~38px gồm nút \`[← Thoát]\`, nhãn hạng bằng, tiến độ \`Câu X/Y\` và đồng hồ \`⏱️ MM:SS\` (\`font-mono tabular-nums\`), đẩy câu hỏi cùng 4 đáp án A, B, C, D lên trọn vẹn First Fold.
- **Dismissible Resume Exam Alert Banner (\`App.tsx\`):** Thay thế nút nổi FAB \`fixed bottom-4 left-1/2 animate-bounce\` bằng \`Alert Banner\` đặt cố định dưới \`TopNavbar\` (\`bg-amber-500/10 border-b border-amber-500/30\`), bổ sung nút \`[✕ Bỏ qua]\` (\`setResumeSessionAvailable(false)\`) chỉ ẩn tạm thời trong phiên mà không xóa \`localStorage\` (\`examSessionData\`).
- **Mobile Dashboard, Hamburger Drawer & PWA Rebranding (\`Dashboard.tsx\`, \`PwaInstallBanner.tsx\`, \`manifest.json\`):** Tái cấu trúc bố cục Mobile-First đưa Thẻ học viên lên vị trí số 1; đổi tên thương hiệu ứng dụng khi cài đặt thành **"Giáo dục Ninh Bình"**; mở rộng banner cài đặt PWA cho cả khách chưa đăng nhập (\`WelcomeModal\`, \`LicenseSelectionScreen\`); bắt sự kiện \`beforeinstallprompt\` ở module top-level (\`__deferredPwaPrompt\`), hỗ trợ modal hướng dẫn 3 bước trực quan cho iOS Safari và Android in-app browser.
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

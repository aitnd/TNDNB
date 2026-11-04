const fs = require('fs');

const date = new Date().toISOString().split('T')[0];

const newEntryUser = `## [3.21.0] - ${date}
### Tính năng mới & Nâng cấp Hạ tầng Cloudflare Offline-First (Web, App Win & Portal)
- **Hạ tầng Ảnh Cloudflare R2 CDN:** Toàn bộ 280+ ảnh câu hỏi sát hạch được phân phối qua mạng biên Cloudflare R2 CDN tốc độ cao, hỗ trợ PWA offline pre-caching tải siêu tốc ngay cả khi mất mạng.
- **Dữ liệu Offline-First (Cloudflare D1 & Dexie):** Đồng bộ cơ sở dữ liệu câu hỏi và phân hạng giấy phép thông qua Cloudflare D1, lưu trữ cục bộ với IndexedDB (Dexie) giúp ôn tập và thi thử ngoại tuyến 100% mượt mà.
- **Tăng tốc Cập nhật App Windows:** Tích hợp Worker CDN Proxy giúp tải bản cài đặt \`.exe\` mới nhất cực nhanh, khắc phục triệt để tình trạng nghẽn mạng tải từ GitHub Releases.
- **Thiết kế Cổng thông tin Editorial Báo chí:** Tái thiết kế toàn diện Cổng thông tin đào tạo theo chuẩn Editorial báo chí (N6 Masthead 3 tầng, H2 Split Diptych tiêu điểm và bản tin học vụ đánh số 01..04, loại bỏ hoàn toàn các nút tiện ích và phong cách AI-slop).
- **Tách luồng triển khai Monorepo:** Ứng dụng \`ontap-web\` triển khai độc lập trên Cloudflare Pages (băng thông unmetered), Cổng thông tin Next.js Root Portal vận hành tối ưu trên Vercel.

`;

const newEntryDev = `## [3.21.0] - ${date}
### Cloudflare R2, D1, Worker Proxy, Editorial Redesign & Split Deployment
- **Infra (R2 CDN & Pre-caching):** Migrated 280+ exam question images to Cloudflare R2 bucket with custom CDN domain and Cache-First Service Worker pre-caching for PWA offline operation.
- **Database (Cloudflare D1 & Dexie):** Replaced legacy live queries with D1 edge database snapshots, HTTP API endpoints, and Dexie IndexedDB offline caching with delta synchronization.
- **Update Proxy (Worker):** Deployed Cloudflare Worker proxy (\`/releases/*\`) to accelerate GitHub Release \`.exe\` asset downloads for \`ontap-win\`.
- **Portal UI/UX (Hallmark Editorial):** Redesigned Root Portal header (N6 Newspaper Masthead with zero yellow pill buttons) and homepage (H2 Split Diptych with 7fr Lead Story and 5fr Numbered Briefing column), strictly adhering to Hallmark Gate 38a (roman display, font-style: normal).
- **Deployment Architecture:** Configured Dual-Target Deployment for \`ontap-web\` with \`CF_PAGES=1\` build targeting Cloudflare Pages dist with \`_redirects\` and \`_headers\`, and dynamic proxy rewrites on Vercel Root Portal.

`;

function updateChangelog(filePath, entry) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('## [3.21.0]')) {
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

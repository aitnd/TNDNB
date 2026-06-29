const fs = require('fs');
const path = require('path');

const newVersion = '3.12.0';
const date = new Date().toISOString().split('T')[0];

const changelogEntry = `
## [${newVersion}] - ${date}
### Cập nhật hệ thống bảo trì & IVT Shield
- **Tính năng:** Tách độc lập 3 công tắc bảo trì cho trang chính (Portal), Web và Win.
- **Tính năng:** Thêm nút bật/tắt quảng cáo (AdSense, Adsterra, Monetag) cho trang chính Portal.
- **Bảo mật:** Áp dụng giới hạn click AdSense (IVT Shield) để chống Invalid Traffic cho Portal.
- **Tính năng:** Đổi đơn vị thời gian cooldown quảng cáo từ 'giờ' sang 'phút' trên toàn hệ thống.
- **UI:** Cập nhật màn hình admin config đồng bộ cho Web và Win.
`;

const updatePackageJson = (dir) => {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkg.version = newVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
        console.log(`Updated version in ${pkgPath} to ${newVersion}`);
    }
};

const updateChangelog = (dir) => {
    const clPath = path.join(dir, 'CHANGELOG.md');
    if (fs.existsSync(clPath)) {
        let content = fs.readFileSync(clPath, 'utf8');
        // Insert after the main title or at the top if no main title
        if (content.includes('# Changelog\n')) {
            content = content.replace('# Changelog\n', '# Changelog\n' + changelogEntry);
        } else {
            content = changelogEntry + '\n' + content;
        }
        fs.writeFileSync(clPath, content);
        console.log(`Updated ${clPath}`);
    }
};

const dirs = [
    'd:\\Antigravity\\TNDNB',
    'd:\\Antigravity\\TNDNB\\ontap-web',
    'd:\\Antigravity\\TNDNB\\ontap-win'
];

dirs.forEach(dir => {
    updatePackageJson(dir);
    updateChangelog(dir);
});

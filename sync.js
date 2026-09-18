const fs = require('fs');
const path = require('path');

const files = [
  'phase-01-setup.md',
  'phase-02-fix-bugs.md',
  'phase-03-core-features.md',
  'phase-04-desktop-integrations.md',
  'phase-05-testing.md'
];
const dir_path = 'd:/Antigravity/TNDNB/docs/plans/260917-0906-dot-1-2-tinh-nang-moi';
let content = '# Kế Hoạch Triển Khai Tính Năng Mới (Đợt 1 + 2)\n\nDưới đây là danh sách toàn bộ các tác vụ cần thực hiện. Khi hoàn thành, hãy đánh dấu `[x]`.\n\n';

for (const f of files) {
    const full_path = path.join(dir_path, f);
    if (fs.existsSync(full_path)) {
        const text = fs.readFileSync(full_path, 'utf-8');
        
        const title_match = text.match(/^#\s+(.+)$/m);
        if (title_match) {
            content += `## ${title_match[1]}\n`;
        } else {
            content += `## ${f.replace('.md', '')}\n`;
        }
        
        const lines = text.split('\n');
        for (const line of lines) {
            const h3_match = line.match(/^###\s+(.+)/);
            if (h3_match) {
                content += `\n### ${h3_match[1]}\n`;
            } else if (line.match(/^\-\s+\[\s\]\s+/)) {
                content += line + '\n';
            }
        }
        content += '\n';
    }
}

fs.writeFileSync(path.join(dir_path, 'task.md'), content, 'utf-8');
fs.writeFileSync('C:/Users/HorizonServers/.gemini/antigravity/brain/c3e26b6b-b859-4de7-8910-a365408cfb82/task.md', content, 'utf-8');
fs.writeFileSync('C:/Users/HorizonServers/.gemini/antigravity/brain/c3e26b6b-b859-4de7-8910-a365408cfb82/implementation_plan.md', content, 'utf-8');
console.log('Done');

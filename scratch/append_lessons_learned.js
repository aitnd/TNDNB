const fs = require('fs');
const path = 'd:/Antigravity/TNDNB/CHANGELOG_DEV.md';

let content = fs.readFileSync(path, 'utf8');

const target = '- **Rules of Hooks:** Refactored early returns in `AdminStatsBar.tsx` and `QuizScreen.tsx` to strictly occur after hook declarations, preventing React state mismatch errors across `ontap-web` and `ontap-win`.';

const append = `
- **Markdown Formatting & Font Issue:** Diagnosed recurring "lỗi font" in changelog rendering. Root cause: Missing newline (\\n\\n) before markdown headings (## [Version]) caused parsers to merge headings with previous list items, breaking UI typography and font scaling. Preventive measure: Always ensure strict double-newline separation between changelog blocks.`;

if (content.includes(target) && !content.includes('Markdown Formatting & Font Issue')) {
  content = content.replace(target, target + append);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully added Lessons Learned to CHANGELOG_DEV.md');
} else {
  console.log('Target string not found or already added.');
}

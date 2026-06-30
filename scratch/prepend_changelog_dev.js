const fs = require('fs');
const path = 'd:/Antigravity/TNDNB/CHANGELOG_DEV.md';

let content = fs.readFileSync(path, 'utf8');

const prefix = `## [3.14.0] - 2026-06-29
### Gamification v2.0 - Complete Integration
- **BadgeAdminModal:** Implemented 3D icon rendering and manual grant/revoke functions using BadgeService for Admins and Leaders.
- **App.tsx Triggers:** Integrated \`increasePracticeProgress\` and \`increaseMockTestProgress\` into \`saveExamResult\` flows on both Web and Win platforms.
- **Fragment Fix:** Fixed React Fragment errors in UserManagerScreen.tsx on both platforms.
- **Constants Sync:** Synced \`badges.ts\` definitions for unified mock test and practice progress.

### QA Fixes
- **TypeScript Strict Compliance:** Fixed unused variables (\`StudentAnswers\`, \`CONG_THUC_TRON_DE\`, \`loading\`, \`filterRole\`, \`sortKey\`, \`sortOrder\`, \`headTeacher\`, \`router\`) across various components and API routes (\`nop-bai\`, \`thi\`, \`dang-bai/sua\`, \`dang-bai/tao-moi\`, \`ho-so\`, \`ClassDetail\`, \`PostManager\`, \`StudentClassView\`, \`TeacherRoomList\`) to successfully pass the Next.js \`next build\` process.
- **Rules of Hooks:** Refactored early returns in \`AdminStatsBar.tsx\` and \`QuizScreen.tsx\` to strictly occur after hook declarations, preventing React state mismatch errors across \`ontap-web\` and \`ontap-win\`.

`;

if (content.trim().startsWith('## [3.13.0]')) {
  fs.writeFileSync(path, prefix + content.trim() + '\n', 'utf8');
  console.log('Successfully prepended v3.14.0 to CHANGELOG_DEV.md');
} else {
  console.log('File does not start with ## [3.13.0] as expected.');
}

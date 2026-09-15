const fs = require('fs');

const path = 'd:/Antigravity/TNDNB/CHANGELOG_DEV.md';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `### QA Fixes
- **TypeScript Strict Compliance:** Fixed unused variables (\`StudentAnswers\`, \`CONG_THUC_TRON_DE\`, \`loading\`, \`filterRole\`, \`sortKey\`, \`sortOrder\`, \`headTeacher\`, \`router\`) across various components and API routes (\`nop-bai\`, \`thi\`, \`dang-bai/sua\`, \`dang-bai/tao-moi\`, \`ho-so\`, \`ClassDetail\`, \`PostManager\`, \`StudentClassView\`, \`TeacherRoomList\`) to successfully pass the Next.js \`next build\` process.
- **Conflict Resolution UI:** Upgraded \`ImportStudentModal.tsx\` and \`CreateStudentModal.tsx\` (Web & Win) with a pre-check verification step displaying conflict comparison tables and enforcing a double-confirmation prompt for active (unlocked) accounts before overwrite.
- **Codebase Cleanups & Modularity:** Cleaned up unused imports/variables in \`Navbar\`, \`StudentsTab\`, \`PortalMaintenanceWrapper\`, \`admin/page.tsx\`, and \`quan-ly/[roomId]/page.tsx\`. Added \`.env*\` to \`ontap-win/.gitignore\`.`;

const replaceStr = `### QA Fixes
- **TypeScript Strict Compliance:** Fixed unused variables (\`StudentAnswers\`, \`CONG_THUC_TRON_DE\`, \`loading\`, \`filterRole\`, \`sortKey\`, \`sortOrder\`, \`headTeacher\`, \`router\`) across various components and API routes (\`nop-bai\`, \`thi\`, \`dang-bai/sua\`, \`dang-bai/tao-moi\`, \`ho-so\`, \`ClassDetail\`, \`PostManager\`, \`StudentClassView\`, \`TeacherRoomList\`) to successfully pass the Next.js \`next build\` process.
- **Rules of Hooks:** Refactored early returns in \`AdminStatsBar.tsx\` and \`QuizScreen.tsx\` to strictly occur after hook declarations, preventing React state mismatch errors across \`ontap-web\` and \`ontap-win\`.
- **Conflict Resolution UI:** Upgraded \`ImportStudentModal.tsx\` and \`CreateStudentModal.tsx\` (Web & Win) with a pre-check verification step displaying conflict comparison tables and enforcing a double-confirmation prompt for active (unlocked) accounts before overwrite.
- **Codebase Cleanups & Modularity:** Cleaned up unused imports/variables in \`Navbar\`, \`StudentsTab\`, \`PortalMaintenanceWrapper\`, \`admin/page.tsx\`, and \`quan-ly/[roomId]/page.tsx\`. Added \`.env*\` to \`ontap-win/.gitignore\`.`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed CHANGELOG_DEV.md');
} else {
  console.log('Target string not found!');
}

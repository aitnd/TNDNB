const fs = require('fs');
const files = [
  'ontap-web/components/ExamQuizScreen.tsx',
  'ontap-web/components/ThiTrucTuyenPage.tsx',
  'ontap-web/components/SubjectSelectionScreen.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace bg-white without dark: prefix
  content = content.replace(/(?<!dark:)bg-white/g, 'bg-card');
  
  // Replace text-gray-800, text-gray-700, text-slate-800, text-slate-700
  content = content.replace(/text-(gray|slate)-(700|800|900)/g, 'text-foreground');
  
  // Replace text-gray-600, text-slate-600, text-gray-500, text-slate-500
  content = content.replace(/text-(gray|slate)-(500|600)/g, 'text-muted-foreground');

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});

const fs = require('fs');
let file = 'ontap-web/components/SubjectSelectionScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/dark:bg-slate-800/g, '');
content = content.replace(/dark:border-slate-700/g, '');
content = content.replace(/dark:text-white/g, '');
content = content.replace(/border-slate-200/g, 'border-border');
content = content.replace(/bg-slate-100 dark:bg-slate-700/g, 'bg-secondary');

fs.writeFileSync(file, content);
console.log('Fixed SubjectSelectionScreen');

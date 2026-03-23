const fs = require('fs');
const filePath = 'E:\\Antigravity\\TNDNB\\ontap-web\\components\\ClassManagementScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The file currently has literal \n characters instead of real newlines in some parts
// and possibly \\n if I messed up the escape.
content = content.replace(/\\n/g, '\n');

fs.writeFileSync(filePath, content);
console.log('File fixed.');

const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('ontap-web/components', file => {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // bg-white -> bg-card
  content = content.replace(/(?<!dark:)bg-white/g, 'bg-card');
  
  // text-slate-600 / text-gray-600 -> text-muted-foreground
  content = content.replace(/text-(slate|gray)-600/g, 'text-muted-foreground');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

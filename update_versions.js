const fs = require('fs');

const files = [
  'package.json',
  'ontap-web/package.json',
  'ontap-win/package.json',
  'cloudflare-worker/package.json',
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/"version":\s*"[^"]+"/, '"version": "3.21.0"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file + ' to 3.21.0');
  }
});

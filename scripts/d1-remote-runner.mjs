import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const fileArg = process.argv[2];
if (!fileArg) {
  console.error('Usage: node scripts/d1-remote-runner.mjs <path-to-sql-file>');
  process.exit(1);
}

const sqlPath = path.resolve(process.cwd(), fileArg);
const content = fs.readFileSync(sqlPath, 'utf8').replace(/\r\n/g, ' ').replace(/\n/g, ' ');

// Tách các câu lệnh kết thúc bằng dấu ;
const statements = [];
let current = '';
let inString = false;
let stringChar = '';

for (let i = 0; i < content.length; i++) {
  const c = content[i];
  if (!inString && (c === "'" || c === '"')) {
    inString = true;
    stringChar = c;
    current += c;
  } else if (inString && c === stringChar) {
    if (c === "'" && content[i + 1] === "'") {
      // Escaped quote
      current += "''";
      i++;
    } else {
      inString = false;
      current += c;
    }
  } else if (!inString && c === ';') {
    const trimmed = current.trim();
    if (trimmed.length > 0) {
      statements.push(trimmed);
    }
    current = '';
  } else {
    current += c;
  }
}
if (current.trim().length > 0) {
  statements.push(current.trim());
}

console.log(`Đã đọc ${statements.length} câu lệnh SQL từ ${sqlPath}`);

// Gom câu lệnh theo batch (khoảng 20 câu lệnh 1 lần)
const BATCH_SIZE = 20;
const workerCwd = path.resolve(process.cwd(), 'cloudflare-worker');

for (let i = 0; i < statements.length; i += BATCH_SIZE) {
  const batch = statements.slice(i, i + BATCH_SIZE);
  const combinedSql = batch.join('; ') + ';';
  console.log(`Đang thực thi batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(statements.length / BATCH_SIZE)} (${batch.length} câu lệnh)...`);
  
  try {
    execFileSync('npx.cmd', ['wrangler', 'd1', 'execute', 'tndnb-d1-prod', '--remote', `--command=${combinedSql}`], {
      cwd: workerCwd,
      stdio: 'pipe',
      encoding: 'utf8',
      shell: false
    });
  } catch (err) {
    console.error(`Lỗi thực thi batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err.message);
    if (err.stdout) console.error('STDOUT:', err.stdout);
    if (err.stderr) console.error('STDERR:', err.stderr);
    process.exit(1);
  }
}

console.log('✅ Hoàn tất thực thi toàn bộ câu lệnh SQL lên D1 Remote!');

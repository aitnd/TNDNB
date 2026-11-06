import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const imagesDir = path.resolve(process.cwd(), 'ontap-win/public/question_images');
const bucketName = process.env.R2_BUCKET_NAME || 'tndnb-assets';
const workerDir = path.resolve(process.cwd(), 'cloudflare-worker');

export function listLocalQuestionImages(dirPath = imagesDir) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((fileName) => ({
      fileName,
      localPath: path.join(dirPath, fileName),
      r2Key: `question-images/${fileName}`
    }));
}

async function uploadSingleImageWithRetry(item, index, total, maxRetries = 3) {
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await execFileAsync(
        npxCmd,
        [
          'wrangler',
          'r2',
          'object',
          'put',
          `${bucketName}/${item.r2Key}`,
          '--file',
          item.localPath,
          '--cache-control',
          'public,max-age=31536000,immutable'
        ],
        { cwd: workerDir, shell: true }
      );
      if ((index + 1) % 20 === 0 || index + 1 === total) {
        console.log(`[${index + 1}/${total}] Tiến độ tải lên R2...`);
      }
      return;
    } catch (err) {
      if (attempt < maxRetries) {
        console.warn(`[Retry ${attempt}/${maxRetries}] Thử lại tải ảnh ${item.r2Key}...`);
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      } else {
        console.error(`Thất bại sau ${maxRetries} lần với ${item.r2Key}:`, err.message);
        throw err;
      }
    }
  }
}

async function runMigration() {
  const files = listLocalQuestionImages();
  const total = files.length;
  console.log(`Tìm thấy ${total} ảnh trong ${imagesDir}. Bắt đầu đồng bộ lên R2 bucket '${bucketName}'...`);

  // Dùng concurrency 5 để network ổn định không bị throttle
  const CONCURRENCY = 5;
  let activeIndex = 0;

  async function worker() {
    while (activeIndex < files.length) {
      const idx = activeIndex++;
      const item = files[idx];
      await uploadSingleImageWithRetry(item, idx, total);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker());
  await Promise.all(workers);

  console.log('✅ Hoàn tất đồng bộ 100% ảnh câu hỏi lên Cloudflare R2!');
}

if (process.argv[1] && process.argv[1].endsWith('migrate-images-to-r2.mjs')) {
  runMigration().catch((err) => {
    console.error('Migration thất bại:', err);
    process.exit(1);
  });
}

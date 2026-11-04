import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const imagesDir = path.resolve(process.cwd(), 'ontap-win/public/question_images');
const bucketName = process.env.R2_BUCKET_NAME || 'tndnb-assets';

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

if (process.argv[1] && process.argv[1].endsWith('migrate-images-to-r2.mjs')) {
  const files = listLocalQuestionImages();
  console.log(`Tìm thấy ${files.length} ảnh trong ${imagesDir}. Bắt đầu đẩy lên R2 bucket '${bucketName}'...`);

  for (const item of files) {
    execFileSync(
      'npx',
      [
        'wrangler',
        'r2',
        'object',
        'put',
        `${bucketName}/${item.r2Key}`,
        '--file',
        item.localPath,
        '--cache-control',
        'public, max-age=31536000, immutable'
      ],
      { stdio: 'inherit', shell: true }
    );
  }
  console.log('Hoàn tất đồng bộ 100% ảnh câu hỏi lên Cloudflare R2!');
}

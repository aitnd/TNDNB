import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const releaseDir = path.resolve(process.cwd(), 'ontap-win/release');
const bucketName = process.env.R2_BUCKET_NAME || 'tndnb-assets';

export function listReleaseArtifacts(dirPath = releaseDir) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => /\.(exe|yml|yaml|blockmap)$/i.test(f))
    .map((fileName) => {
      const isMetadata = fileName.endsWith('.yml') || fileName.endsWith('.yaml');
      return {
        fileName,
        localPath: path.join(dirPath, fileName),
        r2Key: `releases/${fileName}`,
        cacheControl: isMetadata
          ? 'public, s-maxage=60, stale-while-revalidate=120'
          : 'public, max-age=604800, s-maxage=604800, immutable'
      };
    });
}

if (process.argv[1] && process.argv[1].endsWith('upload-release-to-r2.mjs')) {
  const files = listReleaseArtifacts();
  if (files.length === 0) {
    console.log(`Không tìm thấy artifact nào trong ${releaseDir}. Vui lòng chạy build trước.`);
    process.exit(0);
  }

  console.log(`Tìm thấy ${files.length} artifacts trong ${releaseDir}. Đẩy lên R2 bucket '${bucketName}'...`);

  for (const item of files) {
    console.log(`-> Uploading ${item.fileName} to ${bucketName}/${item.r2Key}...`);
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
        item.cacheControl
      ],
      { stdio: 'inherit', shell: true }
    );
  }
  console.log('Hoàn tất tải toàn bộ release artifacts lên Cloudflare R2!');
}

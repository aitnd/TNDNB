import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const sqlEscape = (val) => {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
};

export function normalizeQuestionImageForR2(questionId, rawImage, r2BaseUrl) {
  if (!rawImage || String(rawImage).trim() === '') {
    return null;
  }
  const cleanBase = (r2BaseUrl || 'https://cdn.tndnb.vn').replace(/\/+$/, '');
  return `${cleanBase}/question-images/${questionId}.png`;
}

export function generateSeedSqlFromLicenses(licenses, r2BaseUrl = 'https://cdn.tndnb.vn') {
  const lines = [];
  let totalQuestions = 0;

  licenses.forEach((lic, licIdx) => {
    lines.push(
      `INSERT OR REPLACE INTO licenses (id, name, display_order) VALUES (${sqlEscape(lic.id)}, ${sqlEscape(lic.name)}, ${lic.displayOrder ?? licIdx + 1});`
    );

    (lic.subjects || []).forEach((sub, subIdx) => {
      lines.push(
        `INSERT OR REPLACE INTO subjects (id, license_id, name, display_order) VALUES (${sqlEscape(sub.id)}, ${sqlEscape(lic.id)}, ${sqlEscape(sub.name)}, ${sub.displayOrder ?? subIdx + 1});`
      );

      (sub.questions || []).forEach((q, qIdx) => {
        totalQuestions++;
        const normalizedImage = normalizeQuestionImageForR2(q.id, q.image, r2BaseUrl);
        lines.push(
          `INSERT OR REPLACE INTO questions (id, subject_id, text, image, correct_answer_id, display_order) VALUES (${sqlEscape(q.id)}, ${sqlEscape(sub.id)}, ${sqlEscape(q.text)}, ${sqlEscape(normalizedImage)}, ${sqlEscape(q.correctAnswerId || q.correct_answer_id)}, ${qIdx + 1});`
        );

        (q.answers || []).forEach((ans, ansIdx) => {
          lines.push(
            `INSERT OR REPLACE INTO answers (id, question_id, text, display_order) VALUES (${sqlEscape(ans.id)}, ${sqlEscape(q.id)}, ${sqlEscape(ans.text)}, ${ansIdx + 1});`
          );
        });
      });
    });
  });

  const contentHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(licenses))
    .digest('hex');

  const now = Date.now();
  lines.push(
    `INSERT OR REPLACE INTO sync_meta (id, version, content_hash, total_questions, updated_at) VALUES ('questions_bank', 1, ${sqlEscape(contentHash)}, ${totalQuestions}, ${now});`
  );

  return {
    sql: lines.join('\n'),
    contentHash,
    totalQuestions
  };
}

// Chạy trực tiếp từ CLI: node scripts/migrate-to-d1.mjs
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  const r2BaseUrl = process.env.VITE_R2_PUBLIC_URL || 'https://cdn.tndnb.vn';
  const jsonPath = path.resolve(process.cwd(), 'ontap-win/data/questions_db.json');
  const outSqlPath = path.resolve(process.cwd(), 'cloudflare-worker/migrations/0002_seed_data.sql');

  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const { sql, contentHash, totalQuestions } = generateSeedSqlFromLicenses(rawData, r2BaseUrl);

  fs.mkdirSync(path.dirname(outSqlPath), { recursive: true });
  fs.writeFileSync(outSqlPath, sql, 'utf8');
  console.log(`[D1 Seed] Đã tạo ${outSqlPath} (${totalQuestions} câu hỏi, hash=${contentHash})`);
}

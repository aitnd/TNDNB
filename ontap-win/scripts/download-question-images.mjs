/**
 * Script tải ảnh câu hỏi từ Supabase Database (table questions, cột image)
 * Chạy: node scripts/download-question-images.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Cấu hình Supabase
const supabaseUrl = 'https://hykypgxaegmufdothwbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Folder đích
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'question_images');

// Hàm tải file
async function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filePath);

        protocol.get(url, (response) => {
            // Follow redirects
            if (response.statusCode === 302 || response.statusCode === 301) {
                const redirectUrl = response.headers.location;
                const redirectProtocol = redirectUrl.startsWith('https') ? https : http;
                redirectProtocol.get(redirectUrl, (res) => {
                    res.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                }).on('error', reject);
            } else if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else {
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
}

// Lấy tên file từ URL hoặc tạo tên dựa trên ID
function getFileName(url, questionId) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const originalName = path.basename(pathname);
        // Giữ nguyên extension gốc
        const ext = path.extname(originalName) || '.webp';
        return `${questionId}${ext}`;
    } catch {
        return `${questionId}.webp`;
    }
}

async function main() {
    console.log('=== Tải ảnh câu hỏi từ Supabase (Table questions) ===\n');

    // Tạo folder nếu chưa có
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`Đã tạo folder: ${OUTPUT_DIR}`);
    }

    // Query bảng questions, lấy id và image
    console.log('Đang query bảng questions...');

    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, image')
        .not('image', 'is', null)
        .neq('image', '');

    if (error) {
        console.error('Lỗi query database:', error.message);
        return;
    }

    if (!questions || questions.length === 0) {
        console.log('Không tìm thấy câu hỏi nào có ảnh.');
        return;
    }

    console.log(`Tìm thấy ${questions.length} câu hỏi có ảnh.\n`);

    // Tải từng ảnh
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const question of questions) {
        if (!question.image) continue;

        const fileName = getFileName(question.image, question.id);
        const filePath = path.join(OUTPUT_DIR, fileName);

        // Skip nếu file đã tồn tại
        if (fs.existsSync(filePath)) {
            skipped++;
            continue;
        }

        try {
            process.stdout.write(`[${downloaded + failed + 1}/${questions.length}] Tải: ${fileName}... `);
            await downloadFile(question.image, filePath);
            console.log('✓');
            downloaded++;
        } catch (err) {
            console.log(`✗ (${err.message})`);
            failed++;
        }
    }

    console.log(`\n=== Hoàn thành ===`);
    console.log(`Tải mới: ${downloaded}`);
    console.log(`Đã có sẵn: ${skipped}`);
    console.log(`Lỗi: ${failed}`);
    console.log(`Folder: ${OUTPUT_DIR}`);
}

main().catch(console.error);

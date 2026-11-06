import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');

describe('TinyMCE Self-Hosted Local Configuration', () => {
  it('Test 1: Kiểm tra file public/tinymce/tinymce.min.js tồn tại và kích thước > 100KB', () => {
    const tinymceMinJsPath = path.resolve(rootDir, 'public/tinymce/tinymce.min.js');
    expect(fs.existsSync(tinymceMinJsPath)).toBe(true);

    const stats = fs.statSync(tinymceMinJsPath);
    // Kích thước > 100KB (100 * 1024 bytes = 102400)
    expect(stats.size).toBeGreaterThan(100 * 1024);
  });

  it('Test 2: Kiểm tra app/quan-ly/dang-bai/tao-moi/page.tsx chứa tinymceScriptSrc="/tinymce/tinymce.min.js" và KHÔNG còn NEXT_PUBLIC_TINYMCE_API_KEY', () => {
    const taoMoiPath = path.resolve(rootDir, 'app/quan-ly/dang-bai/tao-moi/page.tsx');
    expect(fs.existsSync(taoMoiPath)).toBe(true);

    const content = fs.readFileSync(taoMoiPath, 'utf8');
    expect(content).toContain('tinymceScriptSrc="/tinymce/tinymce.min.js"');
    expect(content).not.toContain('NEXT_PUBLIC_TINYMCE_API_KEY');
  });

  it('Test 3: Kiểm tra app/quan-ly/dang-bai/sua/[postId]/page.tsx chứa tinymceScriptSrc="/tinymce/tinymce.min.js" và KHÔNG còn NEXT_PUBLIC_TINYMCE_API_KEY', () => {
    const suaPath = path.resolve(rootDir, 'app/quan-ly/dang-bai/sua/[postId]/page.tsx');
    expect(fs.existsSync(suaPath)).toBe(true);

    const content = fs.readFileSync(suaPath, 'utf8');
    expect(content).toContain('tinymceScriptSrc="/tinymce/tinymce.min.js"');
    expect(content).not.toContain('NEXT_PUBLIC_TINYMCE_API_KEY');
  });
});

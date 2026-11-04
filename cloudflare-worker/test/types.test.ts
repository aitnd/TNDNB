import { describe, it, expect } from 'vitest';
import { parseAllowedOrigins } from '../src/types';

describe('Cloudflare Worker Types & Origin Parser', () => {
  it('phân tách danh sách ALLOWED_ORIGINS chuẩn xác và loại bỏ khoảng trắng thừa', () => {
    const raw = 'https://tndnb.vn, http://localhost:5173 , app://. ';
    const origins = parseAllowedOrigins(raw);
    expect(origins).toEqual([
      'https://tndnb.vn',
      'http://localhost:5173',
      'app://.'
    ]);
  });

  it('trả về mảng mặc định nếu chuỗi rỗng', () => {
    expect(parseAllowedOrigins('')).toEqual(['*']);
  });
});

import { describe, it, expect } from 'vitest';
import { normalizeQuestionImageForR2, generateSeedSqlFromLicenses } from './migrate-to-d1.mjs';

describe('D1 Migration & R2 Image URL Normalizer', () => {
  it('normalizeQuestionImageForR2 trả về null nếu câu hỏi không có ảnh và trả về URL R2 chuẩn nếu có ảnh', () => {
    expect(normalizeQuestionImageForR2('nvmt_1', null, 'https://cdn.tndnb.vn')).toBeNull();
    expect(
      normalizeQuestionImageForR2(
        'nvmt_10',
        '/question-images/img_m3_nvmt_q10_1766072186145.jpg',
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');
  });

  it('generateSeedSqlFromLicenses tạo câu lệnh INSERT SQL hợp lệ kèm SHA-256 contentHash', () => {
    const sample = [
      {
        id: 'maytruong-h1',
        name: 'Máy trưởng H1',
        subjects: [
          {
            id: 'nvmt',
            name: 'Nghiệp vụ',
            questions: [
              {
                id: 'nvmt_1',
                text: "Câu hỏi có dấu nháy đơn 'test'",
                image: '/question-images/old.jpg',
                correctAnswerId: 'nvmt_1_1',
                answers: [{ id: 'nvmt_1_1', text: 'Đáp án đúng' }]
              }
            ]
          }
        ]
      }
    ];

    const result = generateSeedSqlFromLicenses(sample, 'https://cdn.tndnb.vn');
    expect(result.totalQuestions).toBe(1);
    expect(result.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.sql).toContain("INSERT OR REPLACE INTO licenses");
    expect(result.sql).toContain("Câu hỏi có dấu nháy đơn ''test''");
    expect(result.sql).toContain("https://cdn.tndnb.vn/question-images/nvmt_1.png");
  });
});

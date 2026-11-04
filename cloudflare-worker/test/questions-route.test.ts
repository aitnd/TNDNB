import { describe, it, expect } from 'vitest';
import { assembleLicensesTree, handleQuestionsRoutes } from '../src/routes/questions';

describe('D1 Questions Route & Tree Assembler', () => {
  it('assembleLicensesTree ghép chính xác 4 bảng phẳng thành cây License[] và natural sort câu hỏi', () => {
    const licenses = [{ id: 'maytruong-h1', name: 'Máy trưởng hạng nhất - M1', display_order: 1 }];
    const subjects = [{ id: 'nvmt', license_id: 'maytruong-h1', name: 'Nghiệp vụ máy trưởng', display_order: 1 }];
    const questions = [
      { id: 'nvmt_10', subject_id: 'nvmt', text: 'Câu 10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png', correct_answer_id: 'nvmt_10_1' },
      { id: 'nvmt_2', subject_id: 'nvmt', text: 'Câu 2', image: null, correct_answer_id: 'nvmt_2_1' }
    ];
    const answers = [
      { id: 'nvmt_2_1', question_id: 'nvmt_2', text: 'Đáp án A câu 2', display_order: 1 },
      { id: 'nvmt_10_1', question_id: 'nvmt_10', text: 'Đáp án A câu 10', display_order: 1 }
    ];

    const tree = assembleLicensesTree(licenses, subjects, questions, answers);
    expect(tree).toHaveLength(1);
    expect(tree[0].subjects[0].questions.map((q) => q.id)).toEqual(['nvmt_2', 'nvmt_10']);
    expect(tree[0].subjects[0].questions[0].correctAnswerId).toBe('nvmt_2_1');
    expect(tree[0].subjects[0].questions[1].image).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');
  });

  it('GET /api/v1/meta/version trả về đúng thông tin phiên bản từ bảng sync_meta', async () => {
    const mockDb: any = {
      prepare: () => ({
        first: async () => ({
          id: 'questions_bank',
          version: 5,
          content_hash: 'sha256-xyz',
          total_questions: 1250,
          updated_at: 1762240000000
        })
      })
    };
    const req = new Request('https://api.tndnb.vn/api/v1/meta/version');
    const res = await handleQuestionsRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      id: 'questions_bank',
      version: 5,
      contentHash: 'sha256-xyz',
      totalQuestions: 1250,
      updatedAt: 1762240000000
    });
  });
});

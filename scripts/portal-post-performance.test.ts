import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

const rootDir = path.resolve(__dirname, '..');

describe('Task 1.5: Root Portal Post Navigation Performance (<50ms ISR + Skeleton) & Exam API Supabase Fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('app/bai-viet/[postId]/page.tsx bật ISR revalidate = 60, có authorCache + timeout 1500ms và gom Promise.all xóa waterfall', () => {
    const postPagePath = path.resolve(rootDir, 'app/bai-viet/[postId]/page.tsx');
    const content = fs.readFileSync(postPagePath, 'utf8');

    expect(content).not.toContain('export const revalidate = 0');
    expect(content).toContain('export const revalidate = 60');
    expect(content).toContain('authorCache');
    expect(content).toContain('Promise.race');
    expect(content).toContain('1500');
    expect(content).toContain('Promise.all');
  });

  it('app/bai-viet/[postId]/loading.tsx tồn tại và hiển thị khung xương Editorial Skeleton đồng bộ với page.module.css', () => {
    const loadingPath = path.resolve(rootDir, 'app/bai-viet/[postId]/loading.tsx');
    expect(fs.existsSync(loadingPath)).toBe(true);

    const loadingContent = fs.readFileSync(loadingPath, 'utf8');
    expect(loadingContent).toContain("import styles from './page.module.css'");
    expect(loadingContent).toContain('styles.container');
    expect(loadingContent).toContain('aria-busy="true"');
  });

  it('app/api/thi/[licenseId]/route.ts tự động fallback sang Supabase khi Cloudflare Worker lỗi DNS/mạng và bảo mật đáp án đúng', async () => {
    const routePath = path.resolve(rootDir, 'app/api/thi/[licenseId]/route.ts');
    const routeSource = fs.readFileSync(routePath, 'utf8');
    expect(routeSource).toContain(".from('licenses')");

    // Giả lập fetch Cloudflare Worker ném lỗi DNS ERR_NAME_NOT_RESOLVED
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    vi.resetModules();
    vi.doMock('../utils/supabaseClient', () => ({
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'hang-ba',
                  name: 'Thuyền trưởng hạng ba',
                  subjects: [
                    {
                      id: 'luat-gt',
                      name: 'Pháp luật GTĐTNĐ',
                      questions: [
                        {
                          id: 'q1',
                          text: 'Câu hỏi mẫu số 1?',
                          correct_answer_id: 'a1',
                          answers: [
                            { id: 'a1', text: 'Đáp án A' },
                            { id: 'a2', text: 'Đáp án B' }
                          ]
                        }
                      ]
                    }
                  ]
                },
                error: null
              })
            }))
          }))
        }))
      }
    }));

    try {
      const { GET } = await import('../app/api/thi/[licenseId]/route');
      const req = new NextRequest('http://localhost:3001/api/thi/hang-ba?limit=10');
      const res = await GET(req, { params: { licenseId: 'hang-ba' } });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.licenseName).toBe('Thuyền trưởng hạng ba');
      expect(body.questions).toHaveLength(1);
      expect(body.questions[0].correct_answer_id).toBeUndefined();
      expect(body.questions[0].correctAnswerId).toBeUndefined();
    } finally {
      globalThis.fetch = originalFetch;
      vi.doUnmock('../utils/supabaseClient');
    }
  });
});

import { describe, it, expect, vi } from 'vitest';
import {
  resolveQuestionImageUrl,
  extractAllQuestionImageUrls,
  precacheAllQuestionImages
} from '../imageHelper';

describe('R2 Image Helper & Precache Trigger (ontap-web)', () => {
  it('resolveQuestionImageUrl trả về null nếu câu hỏi không có ảnh', () => {
    expect(resolveQuestionImageUrl({ id: 'nvmt_1', image: null })).toBeNull();
  });

  it('resolveQuestionImageUrl giữ nguyên URL https:// của R2 hoặc chuẩn hóa đường dẫn tương đối sang R2 CDN', () => {
    expect(
      resolveQuestionImageUrl(
        { id: 'nvmt_10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png' },
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');

    expect(
      resolveQuestionImageUrl(
        { id: 'nvmt_14', image: '/question-images/img_m3_nvmt_q14.jpg' },
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_14.png');
  });

  it('extractAllQuestionImageUrls lọc danh sách URL ảnh duy nhất không trùng lặp từ License[]', () => {
    const licenses: any = [
      {
        id: 'm1',
        name: 'M1',
        subjects: [
          {
            id: 's1',
            name: 'S1',
            questions: [
              { id: 'q1', image: null, answers: [] },
              { id: 'q2', image: '/question-images/old2.jpg', answers: [] },
              { id: 'q2', image: '/question-images/old2.jpg', answers: [] }
            ]
          }
        ]
      }
    ];

    const urls = extractAllQuestionImageUrls(licenses, 'https://cdn.tndnb.vn');
    expect(urls).toEqual(['https://cdn.tndnb.vn/question-images/q2.png']);
  });

  it('precacheAllQuestionImages gửi postMessage PRECACHE_QUESTION_IMAGES tới Service Worker controller', () => {
    const postMessageSpy = vi.fn();
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        serviceWorker: {
          controller: { postMessage: postMessageSpy }
        }
      },
      configurable: true
    });

    const licenses: any = [
      {
        id: 'm1',
        name: 'M1',
        subjects: [
          {
            id: 's1',
            name: 'S1',
            questions: [{ id: 'nvmt_10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png', answers: [] }]
          }
        ]
      }
    ];

    precacheAllQuestionImages(licenses);
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: 'PRECACHE_QUESTION_IMAGES',
      urls: ['https://cdn.tndnb.vn/question-images/nvmt_10.png']
    });
  });
});

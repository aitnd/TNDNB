import { describe, it, expect } from 'vitest';
import { timeoutWrapper } from './authTimeout';

describe('timeoutWrapper', () => {
  it('resolve nhanh khi promise thành công', async () => {
    const fast = Promise.resolve('ok');
    await expect(timeoutWrapper(fast, 1000)).resolves.toBe('ok');
  });

  it('reject với "timeout" khi promise treo quá lâu', async () => {
    const hang = new Promise(() => {}) as Promise<string>; // never resolves
    await expect(timeoutWrapper(hang, 100)).rejects.toThrow('timeout');
  });
});

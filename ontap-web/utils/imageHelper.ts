import type { License } from '../types';

export const getR2PublicBaseUrl = (overrideBase?: string): string => {
  const raw =
    overrideBase ||
    (import.meta as any).env?.VITE_R2_PUBLIC_URL ||
    '';
  return String(raw).replace(/\/+$/, '');
};

export function resolveQuestionImageUrl(
  question: { id: string; image?: string | null },
  r2BaseUrl?: string
): string | null {
  if (!question || !question.image) return null;
  const trimmed = question.image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = getR2PublicBaseUrl(r2BaseUrl);
  const prefix = base ? `${base}/question-images` : '/question-images';
  return `${prefix}/${question.id}.png`;
}

export function resolveQuestionImageFallbackUrl(
  question: { id: string; image?: string | null }
): string | null {
  if (!question || !question.image) return null;
  const trimmed = question.image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `/ontap/question_images/${question.id}.png`;
}

export function extractAllQuestionImageUrls(
  licenses: License[],
  r2BaseUrl?: string
): string[] {
  const urlSet = new Set<string>();
  for (const lic of licenses || []) {
    for (const sub of lic.subjects || []) {
      for (const q of sub.questions || []) {
        const resolved = resolveQuestionImageUrl(q, r2BaseUrl);
        if (resolved) {
          urlSet.add(resolved);
        }
      }
    }
  }
  return Array.from(urlSet);
}

export function precacheAllQuestionImages(licenses: License[]): void {
  try {
    const urls = extractAllQuestionImageUrls(licenses);
    if (urls.length === 0) return;

    if (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRECACHE_QUESTION_IMAGES',
        urls
      });
    }
  } catch {
    // Không chặn luồng chính nếu trình duyệt không hỗ trợ SW
  }
}

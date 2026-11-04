import type { SyntheticEvent } from 'react';

export const getR2FallbackUrl = (questionId: string, originalUrl?: string | null): string | null => {
  if (originalUrl && /^https?:\/\//i.test(originalUrl)) {
    return originalUrl;
  }
  const r2Base = ((import.meta as any).env?.VITE_R2_PUBLIC_URL || 'https://cdn.tndnb.vn').replace(/\/+$/, '');
  return `${r2Base}/question-images/${questionId}.png`;
};

export function getLocalImageSrc(question: { id: string; image?: string | null }): string | null {
  if (!question.image) return null;
  const ext = '.png';
  const isElectron = (window as any).electron?.isElectron;
  const resourcesPath = (window as any).electron?.resourcesPath;

  if (isElectron && resourcesPath && !(import.meta as any).env?.DEV) {
    const normalizedPath = resourcesPath.replace(/\\/g, '/');
    return `file://${normalizedPath}/question_images/${question.id}${ext}`;
  }

  return `/question_images/${question.id}${ext}`;
}

export function handleImageError(
  e: SyntheticEvent<HTMLImageElement, Event>,
  originalUrl?: string | null,
  questionId?: string
) {
  const img = e.currentTarget;
  if (img.dataset.fallbackAttempted === 'true') {
    img.style.display = 'none';
    return;
  }

  img.dataset.fallbackAttempted = 'true';
  const fallbackUrl = questionId
    ? getR2FallbackUrl(questionId, originalUrl)
    : originalUrl;

  if (fallbackUrl && img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    img.style.display = 'none';
  }
}

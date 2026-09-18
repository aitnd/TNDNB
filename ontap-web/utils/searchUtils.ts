import type { Question } from '../types';

export const normalizeStr = (str: string): string =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const searchQuestions = (questions: Question[], term: string): Question[] => {
  if (!term.trim()) return questions;
  const normalized = normalizeStr(term);
  return questions.filter(q =>
    normalizeStr(q.text).includes(normalized) ||
    q.answers?.some(a => normalizeStr(a.text).includes(normalized))
  );
};

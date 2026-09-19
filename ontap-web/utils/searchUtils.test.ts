import { searchQuestions } from './searchUtils';
import type { Question } from '../types';

describe('searchQuestions', () => {
  const mockQs: Question[] = [
    { id: '1', text: 'Biển báo giao thông', answers: [], correctAnswerId: 'a1' }
  ];
  it('should find questions ignoring accents', () => {
    const result = searchQuestions(mockQs, 'bien bao');
    expect(result.length).toBe(1);
  });
});
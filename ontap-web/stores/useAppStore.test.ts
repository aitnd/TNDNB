import { useAppStore } from './useAppStore';

describe('useAppStore - Incorrect Questions', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({ incorrectQuestionIds: [] });
  });

  it('should add and deduplicate incorrect questions', () => {
    useAppStore.getState().addIncorrectQuestions(['q1', 'q2']);
    useAppStore.getState().addIncorrectQuestions(['q2', 'q3']);
    expect(useAppStore.getState().incorrectQuestionIds).toEqual(['q1', 'q2', 'q3']);
  });
  
  it('should remove a question when answered correctly', () => {
    useAppStore.setState({ incorrectQuestionIds: ['q1', 'q2', 'q3'] });
    useAppStore.getState().removeIncorrectQuestion('q2');
    expect(useAppStore.getState().incorrectQuestionIds).toEqual(['q1', 'q3']);
  });
});

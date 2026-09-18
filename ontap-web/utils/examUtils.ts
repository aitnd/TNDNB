// ontap-web/utils/examUtils.ts
export function calculateIsPass(
  score: number, 
  totalQuestions: number, 
  examType: 'Ôn tập' | 'Thi thử' | string
): boolean {
  if (examType === 'Thi thử') {
    return score >= 25; // Đề thi thử luôn 30 câu, cần >= 25 để đạt
  }
  // Ôn tập: phải đúng hết mới đạt
  return score === totalQuestions;
}

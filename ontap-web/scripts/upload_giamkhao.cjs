const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://hykypgxaegmufdothwbv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY'
);

const DATA_DIR = 'e:/Antigravity/TNDNB/ontap-web/data/parsed_giamkhao';

async function uploadSubject(filePath) {
  console.log(`Processing ${filePath}...`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const { subject_id, questions } = content;

  // 1. Xóa dữ liệu cũ (optional nhưng an toàn)
  // Lưu ý: CASCADE sẽ tự động xóa answers khi xóa questions nếu cấu trúc DB cho phép
  // Nếu không, ta cần xóa thủ công.
  console.log(`  Deleting old questions for subject ${subject_id}...`);
  const { error: delError } = await supabase.from('questions').delete().eq('subject_id', subject_id);
  if (delError) console.error('  Error deleting old questions:', delError);

  for (let i = 0; i < questions.length; i++) {
    const qData = questions[i];
    const questionId = `${subject_id}_q${i + 1}`;

    // 2. Insert question
    const { error: qError } = await supabase.from('questions').insert({
      id: questionId,
      text: qData.text,
      subject_id: subject_id,
      display_order: i + 1
    });

    if (qError) {
      console.error(`  Error inserting question ${questionId}:`, qError);
      continue;
    }

    // 3. Insert answers
    const answersToInsert = qData.answers.map((a, idx) => ({
      id: `${questionId}_a${idx + 1}`,
      text: a.text,
      question_id: questionId,
      display_order: idx + 1
    }));

    const { data: insertedAnswers, error: aError } = await supabase
      .from('answers')
      .insert(answersToInsert)
      .select();

    if (aError) {
      console.error(`  Error inserting answers for ${questionId}:`, aError);
      continue;
    }

    // 4. Update correct_answer_id
    if (qData.correct_answer_index !== -1) {
      const correctAnsId = `${questionId}_a${qData.correct_answer_index + 1}`;
      const { error: uError } = await supabase
        .from('questions')
        .update({ correct_answer_id: correctAnsId })
        .eq('id', questionId);
      
      if (uError) console.error(`  Error updating correct_answer_id for ${questionId}:`, uError);
    }
  }
  console.log(`  Done subject ${subject_id}.`);
}

async function run() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    await uploadSubject(path.join(DATA_DIR, file));
  }
  console.log('All subjects uploaded successfully!');
}

run();

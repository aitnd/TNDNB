
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://hykypgxaegmufdothwbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importData() {
    const rawData = fs.readFileSync('/tmp/questions_to_import.json', 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`Starting import of ${questions.length} questions...`);

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // 1. Insert Question
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .insert({
                subject_id: q.subject_id,
                text: q.text
            })
            .select()
            .single();

        if (qError) {
            console.error(`Error inserting question ${i+1}:`, qError);
            continue;
        }

        const questionId = qData.id;

        // 2. Insert Answers
        const answerInserts = q.answers.map(a => ({
            question_id: questionId,
            text: a.text
        }));

        const { data: aData, error: aError } = await supabase
            .from('answers')
            .insert(answerInserts)
            .select();

        if (aError) {
            console.error(`Error inserting answers for question ${i+1}:`, aError);
            continue;
        }

        // 3. Map Correct Answer ID back to Question
        const correctLetter = q.correct_letter; // A, B, C, or D
        const letterIndex = correctLetter.charCodeAt(0) - 65; // 0, 1, 2, 3
        
        if (aData[letterIndex]) {
            const correctAnswerId = aData[letterIndex].id;
            const { error: uError } = await supabase
                .from('questions')
                .update({ correct_answer_id: correctAnswerId })
                .eq('id', questionId);

            if (uError) {
                console.error(`Error updating correct answer for question ${i+1}:`, uError);
            }
        } else {
            console.error(`Correct answer index ${letterIndex} out of bounds for question ${i+1}`);
        }

        if ((i + 1) % 10 === 0) {
            console.log(`Imported ${i + 1}/${questions.length} questions...`);
        }
    }

    console.log('Import finished.');
}

importData();

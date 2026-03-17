import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://hykypgxaegmufdothwbv.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const data = JSON.parse(fs.readFileSync('/tmp/giam_khao_cm_all.json', 'utf8'));

async function importSubject(subjectId, questions) {
    console.log(`Importing ${subjectId} (${questions.length} questions)...`);
    
    for (const q of questions) {
        // 1. Insert question
        const { error: qError } = await supabase
            .from('questions')
            .insert({
                id: q.id,
                subject_id: subjectId,
                text: q.text,
                correct_answer_id: null // Set later
            });
            
        if (qError) {
            console.error(`  Error inserting question ${q.id}:`, qError.message);
            continue;
        }
        
        // 2. Insert answers
        const answersToInsert = q.answers.map(a => ({
            id: a.id,
            question_id: q.id,
            text: a.text
        }));
        
        const { error: aError } = await supabase
            .from('answers')
            .insert(answersToInsert);
            
        if (aError) {
            console.error(`  Error inserting answers for ${q.id}:`, aError.message);
        }
        
        // 3. Update question with correct_answer_id
        if (q.correctAnswerId) {
            const { error: uError } = await supabase
                .from('questions')
                .update({ correct_answer_id: q.correctAnswerId })
                .eq('id', q.id);
            if (uError) {
                console.error(`  Error updating correct answer for ${q.id}:`, uError.message);
            }
        }
    }
}

async function main() {
    if (!SUPABASE_ANON_KEY) {
        console.error("Missing SUPABASE_ANON_KEY env var");
        process.exit(1);
    }
    
    for (const [subjectId, questions] of Object.entries(data)) {
        await importSubject(subjectId, questions);
    }
    console.log("Import finished.");
}

main();

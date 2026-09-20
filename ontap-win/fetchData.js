import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function for natural sorting of questions (e.g., q2 before q10)
const naturalSortQuestions = (a, b) => {
    const getNum = (id) => {
        const match = id.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(a.id) - getNum(b.id);
};

async function run() {
    const { data, error } = await supabase
        .from('licenses')
        .select(`
      id,
      name,
      display_order,
      subjects (
        id,
        name,
        display_order,
        questions (
          *,
          answers (
            id,
            text
          )
        )
      )
    `)
        .order('display_order', { ascending: true })
        .order('display_order', { foreignTable: 'subjects', ascending: true });

    if (error) {
        console.error("Error fetching data:", error);
        process.exit(1);
    }

    if (!data) {
        console.error("No data found");
        process.exit(1);
    }


    const formattedData = data.map((license) => ({
        id: license.id,
        name: license.name,
        subjects: license.subjects
            .map((subject) => ({
                id: subject.id,
                name: subject.name,
                questions: (subject.questions || [])
                    .sort(naturalSortQuestions)
                    .map((question) => ({
                        id: question.id,
                        text: question.question || question.text, // Handle both just in case
                        image: question.image,
                        correctAnswerId: question.correct_answer || question.correct_answer_id,
                        answers: (question.answers || []).map((answer) => ({
                            id: answer.id,
                            text: answer.text,
                        }))
                    }))
            }))
    }));

    // Ensure directory exists
    const dataDir = './data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    fs.writeFileSync('./data/questions_db.json', JSON.stringify(formattedData, null, 2));
}

run();

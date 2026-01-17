
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hykypgxaegmufdothwbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    console.log('Inserting category...');
    const { error } = await supabase
        .from('categories')
        .upsert({ id: 'gioi-thieu-viec-lam', name: 'Giới thiệu việc làm' });

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! Category inserted.');
    }
}

main();

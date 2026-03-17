
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hykypgxaegmufdothwbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24pLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkIds() {
    const { data: licenses, error: lError } = await supabase.from('licenses').select('id, name');
    if (lError) console.error(lError);
    console.log('--- Licenses ---');
    console.log(JSON.stringify(licenses, null, 2));

    const { data: subjects, error: sError } = await supabase.from('subjects').select('id, name, license_id');
    if (sError) console.error(sError);
    console.log('--- Subjects ---');
    console.log(JSON.stringify(subjects, null, 2));
}

checkIds();


import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://hykypgxaegmufdothwbv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importSql() {
    const sqlPath = '/media/horizon/HDD1/Antigravity/TNDNB/ontap-web/import_giám_khảo_fixed.sql';
    console.log('Reading SQL file...');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual commands
    // This is a simple split, assuming commands end with ; and don't contain ; inside strings
    const commands = sql.split(';').map(c => c.trim()).filter(c => c.length > 0);
    
    console.log(`Executing ${commands.length} SQL commands...`);
    
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i] + ';';
        const { error } = await supabase.rpc('execute_sql', { sql_query: cmd });
        
        if (error) {
            // Some Supabase setups don't have execute_sql RPC
            // Plan B: Use the raw SQL execution if available or try another way
            console.error(`Error executing command ${i+1}:`, error);
            console.log('Attempting alternative import method...');
            break; 
        }
        
        if ((i + 1) % 50 === 0) {
            console.log(`Executed ${i + 1}/${commands.length} commands...`);
        }
    }
    
    console.log('Import attempt finished.');
}

importSql();

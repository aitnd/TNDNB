const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hykypgxaegmufdothwbv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY'
);

async function verify() {
  const subjects = [
    'gk2_dieudong', 'gk2_hanghai', 'gk2_kttv', 'gk2_ktvt', 'gk2_luong', 'gk2_nvtt', 'gk2_ttvt'
  ];

  console.log('=== VERIFICATION OF UPLOADED SUBJECTS ===');
  for (const sid of subjects) {
    const { count: qCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('subject_id', sid);
    const { count: aCount } = await supabase.from('answers').select('id', { count: 'exact', head: true }).like('id', `${sid}_%`);
    const { data: qNoAns } = await supabase.from('questions').select('id').eq('subject_id', sid).is('correct_answer_id', null);
    
    console.log(`Subject ${sid}:`);
    console.log(`  Questions: ${qCount}`);
    console.log(`  Answers: ${aCount}`);
    console.log(`  Questions without correct answer: ${qNoAns ? qNoAns.length : 0}`);
  }

  // Kiểm tra license_id của các môn này
  const { data: subsData } = await supabase.from('subjects').select('id, name, license_id').in('id', subjects);
  console.log('\n=== SUBJECT LICENSING ===');
  subsData.forEach(s => console.log(`  ${s.id} ("${s.name}") is in License ID: ${s.license_id}`));
}

verify();

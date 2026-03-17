import os

def split_sql():
    sql_file = 'e:\\Antigravity\\TNDNB\\insert_questions.sql'
    if not os.path.exists(sql_file):
        print(f"File {sql_file} not found")
        return
        
    with open(sql_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Deletes
    deletes = [l.strip() for l in lines if l.startswith('DELETE')]
    with open('tmp_sql_deletes.sql', 'w', encoding='utf-8') as f:
        f.write('\n'.join(deletes))

    # Groups by subject
    groups = {}
    current_subject = None
    
    # Lines are: questions, then answers, then updates for that question.
    # We need to preserve the order to avoid foreign key violations.
    # Actually, the file is ordered: 
    #   Q1
    #   A1a, A1b, A1c, A1d
    #   Update Q1 Correct
    #   Q2...
    
    # We just need to split it by subjects. Each subject is a block.
    # The subject_id is in the INSERT INTO questions ... VALUES ('id', 'text', 'subject_id', ...)
    # Wait, the column order in INSERT is: (id, text, subject_id, display_order)
    # So it's the 3rd value.
    
    current_subject_sql = []
    current_subject = None
    
    for l in lines:
        if l.startswith('INSERT INTO questions'):
            # Extract subject_id
            # Pattern: ('id', 'text', 'subject_id', display_order)
            # parts = l.split(',') 
            # This is risky if text contains commas.
            # Better to find 'gk2_' in the line.
            
            # For gk2 subjects: gk2_dieudong, etc.
            subject_ids = ['gk2_dieudong', 'gk2_hanghai', 'gk2_kttv', 'gk2_ktvt', 'gk2_luong', 'gk2_nvtt', 'gk2_ttvt']
            found_subject = None
            for sid in subject_ids:
                if f"'{sid}'" in l:
                    found_subject = sid
                    break
            
            if found_subject and found_subject != current_subject:
                if current_subject:
                    with open(f'tmp_sql_{current_subject}.sql', 'w', encoding='utf-8') as f:
                        f.write('\n'.join(current_subject_sql))
                current_subject = found_subject
                current_subject_sql = []
        
        if current_subject:
            current_subject_sql.append(l.strip())
            
    # Write last subject
    if current_subject:
        with open(f'tmp_sql_{current_subject}.sql', 'w', encoding='utf-8') as f:
            f.write('\n'.join(current_subject_sql))

if __name__ == '__main__':
    split_sql()

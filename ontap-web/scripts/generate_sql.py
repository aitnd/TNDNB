import json
import os

def escape_sql(text):
    if text is None:
        return 'NULL'
    return "'" + text.replace("'", "''") + "'"

def generate_sql(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    subject_id = data['subject_id']
    questions = data['questions']
    
    sql_statements = []
    
    # Delete old records
    sql_statements.append(f"DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE subject_id = {escape_sql(subject_id)});")
    sql_statements.append(f"DELETE FROM questions WHERE subject_id = {escape_sql(subject_id)};")
    
    # Insert questions and answers
    q_inserts = []
    a_inserts = []
    updates = []
    
    for i, q in enumerate(questions):
        q_id = f"{subject_id}_q{i+1}"
        q_inserts.append(f"({escape_sql(q_id)}, {escape_sql(q['text'])}, {escape_sql(subject_id)}, {i+1})")
        
        for j, a in enumerate(q['answers']):
            a_id = f"{q_id}_a{j+1}"
            a_inserts.append(f"({escape_sql(a_id)}, {escape_sql(a['text'])}, {escape_sql(q_id)})")
            
            if j == q.get('correct_answer_index', -1):
                updates.append(f"UPDATE questions SET correct_answer_id = {escape_sql(a_id)} WHERE id = {escape_sql(q_id)};")

    if q_inserts:
        sql_statements.append(f"INSERT INTO questions (id, text, subject_id, display_order) VALUES {', '.join(q_inserts)};")
    
    if a_inserts:
        # Batch answers in groups of 100 to avoid too long strings
        for k in range(0, len(a_inserts), 100):
            batch = a_inserts[k:k+100]
            sql_statements.append(f"INSERT INTO answers (id, text, question_id) VALUES {', '.join(batch)};")
            
    sql_statements.extend(updates)
    
    return "\n".join(sql_statements)

# Process all subjects and save SQL files
parsed_dir = "e:/Antigravity/TNDNB/ontap-web/data/parsed_giamkhao"
sql_dir = "e:/Antigravity/TNDNB/ontap-web/data/sql_giamkhao"
if not os.path.exists(sql_dir):
    os.makedirs(sql_dir)

for filename in os.listdir(parsed_dir):
    if filename.endswith(".json"):
        sid = filename.replace(".json", "")
        print(f"Generating SQL for {sid}...")
        sql = generate_sql(os.path.join(parsed_dir, filename))
        with open(os.path.join(sql_dir, f"{sid}.sql"), "w", encoding="utf-8") as f:
            f.write(sql)

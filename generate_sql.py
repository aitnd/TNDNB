import json
import os
import uuid

subjects_map = {
    "tmp_dieu_dong.docx.json": "gk2_dieudong",
    "tmp_hang_hai.docx.json": "gk2_hanghai",
    "tmp_khi_tuong_thuy_van.docx.json": "gk2_kttv",
    "tmp_kinh_te_van_tai.docx.json": "gk2_ktvt",
    "tmp_luong_chay_tau_thuyen.docx.json": "gk2_luong",
    "tmp_nghiep_vu_thuyen_truong.docx.json": "gk2_nvtt",
    "tmp_thong_tin_vo_tuyen.docx.json": "gk2_ttvt"
}

sql_statements = []

# Clear existing data for these subjects
subject_ids = list(subjects_map.values())
ids_str = ", ".join([f"'{s}'" for s in subject_ids])
sql_statements.append(f"DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE subject_id IN ({ids_str}));")
sql_statements.append(f"DELETE FROM questions WHERE subject_id IN ({ids_str});")

for filename, subject_id in subjects_map.items():
    filepath = os.path.join("e:\\Antigravity\\TNDNB", filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for i, q in enumerate(data):
        q_id = f"{subject_id}_q{i+1}"
        q_text = q['text'].replace("'", "''")
        
        sql_statements.append(f"INSERT INTO questions (id, text, subject_id, display_order) VALUES ('{q_id}', '{q_text}', '{subject_id}', {i+1});")
        
        correct_ans_id = None
        for j, opt in enumerate(q['options']):
            ans_id = f"{q_id}_a{j+1}"
            ans_text = opt.replace("'", "''")
            sql_statements.append(f"INSERT INTO answers (id, text, question_id) VALUES ('{ans_id}', '{ans_text}', '{q_id}');")
            
            if q['correct'] and opt == q['correct']:
                correct_ans_id = ans_id
        
        if correct_ans_id:
            sql_statements.append(f"UPDATE questions SET correct_answer_id = '{correct_ans_id}' WHERE id = '{q_id}';")

with open("e:\\Antigravity\\TNDNB\\insert_questions.sql", 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re

NAMESPACES = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

def parse_docx(file_path, subject_id):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return None

    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        xml_content = zip_ref.read('word/document.xml')

    root = ET.fromstring(xml_content)
    paragraphs = root.findall('.//w:p', NAMESPACES)

    questions = []
    current_q = None

    for p in paragraphs:
        # Extract full text of paragraph and check for red color
        p_text = ""
        is_red = False
        
        runs = p.findall('.//w:r', NAMESPACES)
        for r in runs:
            # Check for text content
            t_node = r.find('w:t', NAMESPACES)
            if t_node is not None and t_node.text:
                run_text = t_node.text
                p_text += run_text
                
                # Check for color in run properties
                rPr = r.find('w:rPr', NAMESPACES)
                if rPr is not None:
                    color = rPr.find('w:color', NAMESPACES)
                    if color is not None:
                        val = color.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
                        if val and val.upper() == "FF0000":
                            is_red = True

        p_text = p_text.strip()
        if not p_text:
            continue

        # Detect question (e.g., "Câu 01.", "Câu 1:")
        if re.match(r'^Câu\s+\d+[:.]', p_text, re.IGNORECASE):
            if current_q:
                questions.append(current_q)
            
            # Clean up question text (remove "Câu XX.")
            clean_text = re.sub(r'^Câu\s+\d+[:.]\s*', '', p_text, flags=re.IGNORECASE)
            current_q = {
                "text": clean_text,
                "answers": [],
                "correct_answer_index": -1
            }
        elif current_q:
            # It's an option
            # Clean up common option prefixes (A., B., C., D.)
            option_text = re.sub(r'^[A-D]\.\s*', '', p_text)
            
            current_q["answers"].append({"text": option_text})
            if is_red:
                current_q["correct_answer_index"] = len(current_q["answers"]) - 1

    if current_q:
        questions.append(current_q)

    return {
        "subject_id": subject_id,
        "questions": questions
    }

# Mapping configuration
FILES = [
    ("dieu dong.docx", "gk2_dieudong"),
    ("hang hai.docx", "gk2_hanghai"),
    ("khi tuong thuy van.docx", "gk2_kttv"),
    ("kinh te van tai.docx", "gk2_ktvt"),
    ("luong chay tau thuyen.docx", "gk2_luong"),
    ("nghiep vu thuyen truong.docx", "gk2_nvtt"),
    ("thong tin vo tuyen.docx", "gk2_ttvt")
]

BASE_DIR = "D:/Download"
OUTPUT_DIR = "e:/Antigravity/TNDNB/ontap-web/data/parsed_giamkhao"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

for filename, sid in FILES:
    print(f"Parsing {filename}...")
    result = parse_docx(os.path.join(BASE_DIR, filename), sid)
    if result:
        output_file = os.path.join(OUTPUT_DIR, f"{sid}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"  -> Saved {len(result['questions'])} questions to {output_file}")

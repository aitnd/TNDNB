import zipfile
import xml.etree.ElementTree as ET
import sys
import os
import json

def get_text_with_color(docx_path):
    questions = []
    current_question = None
    current_options = []
    correct_answer_text = None

    namespace = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }

    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            paragraphs = tree.findall('.//w:p', namespace)
            
            for p in paragraphs:
                text_parts = []
                is_red = False
                
                # Extract text and check color from runs
                runs = p.findall('.//w:r', namespace)
                for r in runs:
                    t_elt = r.find('w:t', namespace)
                    if t_elt is not None:
                        t_text = t_elt.text
                        if t_text:
                            text_parts.append(t_text)
                            
                            # Check color in run properties
                            rPr = r.find('w:rPr', namespace)
                            if rPr is not None:
                                color = rPr.find('w:color', namespace)
                                if color is not None:
                                    color_val = color.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
                                    if color_val and color_val.upper() == 'FF0000':
                                        is_red = True
                
                text = "".join(text_parts).strip()
                # Remove extra internal whitespace/newlines
                text = " ".join(text.split())
                
                if not text:
                    continue
                
                # Logic to identify question vs choice
                if text.lower().startswith('câu'):
                    # Save previous question
                    if current_question:
                        questions.append({
                            'text': current_question,
                            'options': current_options,
                            'correct': correct_answer_text
                        })
                    
                    current_question = text
                    current_options = []
                    correct_answer_text = None
                elif current_question:
                    # It's an option
                    current_options.append(text)
                    if is_red:
                        correct_answer_text = text
            
            # Add last question
            if current_question:
                questions.append({
                    'text': current_question,
                    'options': current_options,
                    'correct': correct_answer_text
                })
                
    except Exception as e:
        print(f"Error parsing {docx_path}: {e}")
        return []

    return questions

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python parse_docx.py <path_to_docx> <output_json>")
        sys.exit(1)
    
    results = get_text_with_color(sys.argv[1])
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

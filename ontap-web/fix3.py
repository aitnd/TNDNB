import os
import re

files_to_fix = {
    "components/ClassDetail/StudentsTab.tsx": [
        (r"\s*const filtered = availableStudents\.filter\([\s\S]*?\);\s*", "\n"),
        (r"const handleAddExistingStudent = async \(studentId: string\) => \{[\s\S]*?\}\s*catch \(error\) \{[\s\S]*?\}\s*\};\s*", "")
    ],
    "components/Dashboard.tsx": [
        (r"import \{ BookOpenIcon3D \} from '\.\./constants/BookOpenIcon3D';\s*\n", "")
    ],
    "vite.config.ts": [
        (r", loadEnv", ""),
        (r"defineConfig\(\(\{ mode \}\) => \{", "defineConfig(() => {")
    ]
}

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
        else:
            print(f"No changes made in {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for file, replacements in files_to_fix.items():
    replace_in_file(file, replacements)

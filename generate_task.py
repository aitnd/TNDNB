import os
import re

files = [
  'phase-01-setup.md',
  'phase-02-fix-bugs.md',
  'phase-03-core-features.md',
  'phase-04-desktop-integrations.md',
  'phase-05-testing.md'
]
dir_path = r'd:\Antigravity\TNDNB\docs\plans\260917-0906-dot-1-2-tinh-nang-moi'
content = '# K? Ho?ch Tri?n Khai Tính Nang M?i (Ð?t 1 + 2)\n\nDu?i dây là danh sách toàn b? các tác v? c?n th?c hi?n. Khi hoàn thành, hãy dánh d?u [x].\n\n'

for f in files:
    full_path = os.path.join(dir_path, f)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as file:
            text = file.read()
            
        title_match = re.search(r'(?m)^#\s+(.+)$', text)
        if title_match:
            content += f'## {title_match.group(1)}\n'
        else:
            content += f'## {f.replace(".md", "")}\n'
            
        lines = text.split('\n')
        for line in lines:
            h3_match = re.match(r'^###\s+(.+)', line)
            if h3_match:
                content += f'\n### {h3_match.group(1)}\n'
            elif re.match(r'^\-\s+\[\s\]\s+', line):
                content += line + '\n'
        content += '\n'

with open(os.path.join(dir_path, 'task.md'), 'w', encoding='utf-8') as file:
    file.write(content)

with open(r'C:\Users\HorizonServers\.gemini\antigravity\brain\c3e26b6b-b859-4de7-8910-a365408cfb82\task.md', 'w', encoding='utf-8') as file:
    file.write(content)
print('Done')

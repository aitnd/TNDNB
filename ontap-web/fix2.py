import os
import re

files_to_fix = {
    "components/AdSenseLoader.tsx": [
        (r"const loadMonetagScript = \(\) => \{[\s\S]*?\};\s*", ""),
        (r"console\.log\('\[Ads\] Monetag script injected\.'\);", "")
    ],
    "components/AnalyticsPage.tsx": [
        (r"const \[, setError\] = useState<string \| null>\(null\);\s*\n", ""),
        (r"setError\(", "// setError(")
    ],
    "components/Badges/BadgeUnlockPopup.tsx": [
        (r"import React, \{ useEffect \} from 'react';", "import React from 'react';")
    ],
    "components/ClassDetail/StudentsTab.tsx": [
        (r"const \[, setLoadingAvailable\] = useState\(false\);\s*\n", ""),
        (r"const \[, setAvailableStudents\] = useState<UserProfile\[\]>\(\[\]\);\s*\n", ""),
        (r"setLoadingAvailable\(", "// setLoadingAvailable("),
        (r"setAvailableStudents\(", "// setAvailableStudents("),
        (r"const handleAddExistingStudent = async \(studentId: string\) => \{[\s\S]*?\}\s*catch \(error\) \{[\s\S]*?\}\s*\};\s*", "")
    ],
    "components/ClassManagementScreen.tsx": [
        (r"const \[classStats\] = useState<Record<string, number>>\(\{\}\);\s*\n", "")
    ],
    "components/Dashboard.tsx": [
        (r"import \{ BookOpenIcon3D \} from '\.\./constants/BookOpenIcon3D';\s*\n", ""),
        (r"\s*const isAdmin = \['admin', 'quan_ly', 'lanh_dao', 'giao_vien'\].includes\(userRole\);\s*\n", "\n")
    ],
    "components/ImportStudentModal.tsx": [
        (r"const handleFileUpload = \(file: File\) => \{", "const handleFileUpload = (_file: File) => {")
    ],
    "components/NativeSettingsModal.tsx": [
        (r"\s*const \[loading, setLoading\] = useState\(true\);\s*\n", "\n"),
        (r"\s*setLoading\(false\);\s*\n", "\n")
    ],
    "components/OnlineStatsWidget.tsx": [
        (r"import React, \{ useEffect, useState \} from 'react';", "import { useEffect, useState } from 'react';")
    ],
    "services/authSessionService.ts": [
        (r"const SINGLE_SESSION_ROLES = \['hoc_vien'\];\s*\n", "")
    ],
    "services/biometricService.ts": [
        (r"\s*const simplified = true; // Use simple verify \(no crypto object\)\s*", "\n")
    ],
    "vite.config.ts": [
        (r"\s*const env = loadEnv\(mode, '\.', ''\);\s*\n", "\n")
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

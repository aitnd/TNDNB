import os
import re

files_to_fix = {
    "App.tsx": [
        (r"import WindowsDownloadRedirect from '\./components/WindowsDownloadRedirect';\s*\n", ""),
        (r"import WeatherWidget from '\./components/WeatherWidget';\s*\n", ""),
        (r"\{ loadSession, getLicensePreference \}", "{ loadSession }")
    ],
    "components/AccountScreen.test.tsx": [
        (r"import React from 'react';\s*\n", "")
    ],
    "components/AccountScreen.tsx": [
        (r"import \{ useAppStore \} from '\.\./stores/useAppStore';\s*\n", ""),
        (r", usageConfig \}", " }")
    ],
    "components/AdSenseLoader.tsx": [
        (r"\s*const \[shouldLoadAds, setShouldLoadAds\] = useState\(false\);\s*\n", "\n"),
        (r"const handler = \(e: MouseEvent\) => \{", "const handler = () => {"),
        (r"\s*const loadMonetagScript = \(\) => \{\s*if \(document\.getElementById\('monetag-script'\)\) return;\s*const script = document\.createElement\('script'\);\s*script\.id = 'monetag-script';\s*script\.src = 'https://alwingulla\.com/88/tag\.min\.js';\s*script\.setAttribute\('data-zone', '8910406'\);\s*script\.async = true;\s*document\.body\.appendChild\(script\);\s*console\.log\('\[Ads\] Monetag script injected\.'\);\s*\};\s*", "\n")
    ],
    "components/AnalyticsPage.tsx": [
        (r", Bar", ""),
        (r"\s*const \[error, setError\] = useState<string \| null>\(null\);\s*\n", "\n"),
        (r"data\.devices\.map\(\(entry: any, index: number\) =>", "data.devices.map((_: any, index: number) =>")
    ],
    "components/Badges/BadgeAdminModal.tsx": [
        (r", BadgeDefinition", "")
    ],
    "components/Badges/BadgeList.tsx": [
        (r"import \{ useAppStore \} from '\.\./\.\./stores/useAppStore';\s*\n", "")
    ],
    "components/Badges/BadgeListener.tsx": [
        (r", UserBadgeProgress", "")
    ],
    "components/Badges/BadgeUnlockPopup.tsx": [
        (r", useEffect", ""),
        (r", BadgeDefinition", "")
    ],
    "components/ClassDetail/ClassList.tsx": [
        (r", FaEllipsisV", "")
    ],
    "components/ClassDetail/StudentsTab.tsx": [
        (r"\s*const \[availableStudents, setAvailableStudents\] = useState<UserProfile\[\]>\(\[\]\);\s*\n", "\n"),
        (r"\s*const \[loadingAvailable, setLoadingAvailable\] = useState\(false\);\s*\n", "\n"),
        (r"\s*const handleAddExistingStudent = async \(studentId: string\) => \{[\s\S]*?\}\s*catch \(error\) \{[\s\S]*?\}\s*\};\s*", "\n")
    ],
    "components/ClassManagementScreen.tsx": [
        (r", getCountFromServer", ""),
        (r"const getRoleWeight = \(role: string\) => \{[\s\S]*?\};\s*", ""),
        (r"const getRoleRank = \(role: string\) => \{[\s\S]*?\};\s*", ""),
        (r"\s*const \[classStats, setClassStats\] = useState<Record<string, number>>\(\{\}\);\s*\n", "\n"),
        (r"\(error\) => \{\s*\}\)", "() => {\n            })"),
        (r"\(error\) => \{\s*setDeviceCounts", "() => {\n            setDeviceCounts")
    ],
    "components/CreateStudentModal.tsx": [
        (r", FaShieldAlt", "")
    ],
    "components/Dashboard.tsx": [
        (r"import \{ BookOpenIcon3D \} from '\.\./constants/BookOpenIcon3D';\s*\n", ""),
        (r"\s*const isAdmin = userProfile\?\.role === 'admin' \|\| userProfile\?\.role === 'superadmin' \|\| userProfile\?\.role === 'owner';\s*\n", "\n")
    ],
    "components/ExamResultsScreen.tsx": [
        (r"filteredQuestions\.map\(\(question, index\) =>", "filteredQuestions.map((question) =>")
    ],
    "components/HistoryScreen.tsx": [
        (r"const getTypeStyles = \(type: string\) => \{[\s\S]*?\};\s*", ""),
        (r"const formatTime = \(seconds: number\) => \{[\s\S]*?\};\s*", "")
    ],
    "components/ImportStudentModal.tsx": [
        (r"\(file\) =>", "() =>")
    ],
    "components/MailboxScreen.tsx": [
        (r", onBack", ""),
        (r"\s*const messagesEndRef = useRef<HTMLDivElement>\(null\);\s*\n", "\n"),
        (r"\s*const fileInputRef = useRef<HTMLInputElement>\(null\);\s*\n", "\n"),
        (r"const PlusIconBtn = \(\{ icon, onClick \}: \{ icon: React\.ReactNode, onClick: \(\) => void \}\) => \([\s\S]*?\);\s*", "")
    ],
    "components/MarqueeNotifier.tsx": [
        (r"import Marquee from 'react-fast-marquee';\s*\n", "")
    ],
    "components/MusicPlayer.tsx": [
        (r"\s*const playMusic = async \(\) => \{[\s\S]*?\}\s*catch \(err\) \{[\s\S]*?\}\s*\}\s*\};\s*", "\n")
    ],
    "components/NativeSettingsModal.tsx": [
        (r"\s*const \[loading, setLoading\] = useState\(false\);\s*\n", "\n")
    ],
    "components/NotificationMgmtScreen.tsx": [
        (r"\s*const iso = d\.toISOString\(\)\.slice\(0, 16\);\s*\n", "\n"),
        (r", deleteDoc", ""),
        (r", doc \} = await import", " } = await import")
    ],
    "components/OnlineStatsWidget.tsx": [
        (r"import React from 'react';\s*\n", "")
    ],
    "components/ResultsScreen.tsx": [
        (r"filteredQuestions\.map\(\(question, index\) =>", "filteredQuestions.map((question) =>")
    ],
    "components/UserManagerScreen.test.tsx": [
        (r"import React from 'react';\s*\n", "")
    ],
    "components/UserManagerScreen.tsx": [
        (r", FaSave", ""),
        (r", FaUserPlus", "")
    ],
    "services/authSessionService.ts": [
        (r"const SINGLE_SESSION_ROLES = \['user', 'student'\];\s*\n", "")
    ],
    "services/biometricService.ts": [
        (r"\s*let simplified = \{[\s\S]*?\};\s*", "\n")
    ],
    "services/fcmClient.ts": [
        (r"\(notification\)", "()"),
        (r"\(notification\)", "()")
    ],
    "services/historyService.ts": [
        (r", deleteDoc, doc", "")
    ],
    "services/notificationService.ts": [
        (r"\s*const courseDocRef = doc\(db, 'courses', targetId\);\s*\n", "\n"),
        (r"\(userId: string, classId\?: string, userRole\?: string\)", "(userId: string, _classId?: string, userRole?: string)")
    ],
    "vite.config.ts": [
        (r"\(\{ mode, env \}\)", "({ mode })")
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

# Apply to all files
for file, replacements in files_to_fix.items():
    replace_in_file(file, replacements)

const fs = require('fs');
const path = 'd:/Antigravity/TNDNB/ontap-web/components/ClassManagementScreen.tsx';

let content = fs.readFileSync(path, 'utf8');

// Add classStats state
if (!content.includes('const [classStats, setClassStats]')) {
    content = content.replace(
        'const [creatorProfiles, setCreatorProfiles] = useState<Record<string, {name: string, role: string}>>({});',
        'const [creatorProfiles, setCreatorProfiles] = useState<Record<string, {name: string, role: string}>>({});\n    const [classStats, setClassStats] = useState<Record<string, number>>({});'
    );
}

// Add getCountFromServer import
if (!content.includes('getCountFromServer')) {
    content = content.replace(
        'getDocs } from \'firebase/firestore\';',
        'getDocs, getCountFromServer } from \'firebase/firestore\';'
    );
}

// Fetch stats logic
const fetchStatsLogic = `
            // Fetch class student counts
            if (coursesData.length > 0) {
                const fetchCounts = async () => {
                    const counts: Record<string, number> = {};
                    await Promise.all(coursesData.map(async (c) => {
                        try {
                            const sq = query(collection(db, 'users'), where('courseId', '==', c.id), where('role', '==', 'hoc_vien'));
                            const snapshot = await getCountFromServer(sq);
                            counts[c.id] = snapshot.data().count;
                        } catch(e) {
                            counts[c.id] = 0;
                        }
                    }));
                    setClassStats(counts);
                };
                fetchCounts();
            }
`;

if (!content.includes('// Fetch class student counts')) {
    content = content.replace(
        'fetchUsers();\n            }',
        'fetchUsers();\n            }\n' + fetchStatsLogic
    );
}

// Pass classStats to ClassList
if (!content.includes('classStats={classStats}')) {
    content = content.replace(
        'canCreateClass={canCreateClass}',
        'canCreateClass={canCreateClass}\n                    classStats={classStats}'
    );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Updated ClassManagementScreen.tsx');

import { Rocket, Zap, Shield, Monitor, Code, Settings, List } from 'lucide-react';

export interface ChangelogSection {
  icon: any;
  title: string;
  color: string;
  bgColor: string;
  items: string[];
}

export interface ChangelogVersion {
  version: string;
  date: string;
  isLatest: boolean;
  sections: ChangelogSection[];
}

const SECTION_CONFIG: Record<string, { icon: any; color: string; bgColor: string }> = {
  'Added': { icon: Rocket, color: 'text-cyan-500', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  '🚀 Features': { icon: Rocket, color: 'text-cyan-500', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  'Fixed': { icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  '🐛 Bug Fixes': { icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  'Changed': { icon: Monitor, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  'Security': { icon: Shield, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  '📝 Documentation': { icon: Code, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
  'Kỹ thuật': { icon: Settings, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  'default': { icon: List, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
};

export const parseChangelog = (text: string): ChangelogVersion[] => {
  const versions: ChangelogVersion[] = [];
  const lines = text.split('\n');
  
  let currentVersion: ChangelogVersion | null = null;
  let currentSection: ChangelogSection | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Version header: ## [3.9.1] - 2026-03-22 - Title
    if (line.startsWith('## ')) {
      const header = line.substring(3);
      const versionMatch = header.match(/\[(.*?)\]/);
      const version = versionMatch ? versionMatch[1] : '';
      
      // Skip entries that don't look like semantic versions (like research dates [2026-03-22])
      if (!version || /^\d{4}-\d{2}-\d{2}$/.test(version)) {
          continue;
      }

      // Date extraction: usually after version [v] - YYYY-MM-DD
      let date = '';
      const dateMatch = header.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
         const d = new Date(dateMatch[0]);
         date = d.toLocaleDateString('vi-VN');
      }

      currentVersion = {
        version,
        date: date || 'N/A',
        isLatest: versions.length === 0,
        sections: []
      };
      versions.push(currentVersion);
      currentSection = null;
      continue;
    }

    if (!currentVersion) continue;

    // Section header: ### Added
    if (line.startsWith('### ')) {
      const title = line.substring(4).trim();
      const config = SECTION_CONFIG[title] || SECTION_CONFIG['default'];
      
      currentSection = {
        icon: config.icon,
        title,
        color: config.color,
        bgColor: config.bgColor,
        items: []
      };
      currentVersion.sections.push(currentSection);
      continue;
    }

    // List item: - Something
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.substring(2).trim();
      if (currentSection) {
        currentSection.items.push(item);
      } else {
        // Handle items without a section (create a default one)
        const defaultTitle = 'Cập nhật';
        const config = SECTION_CONFIG['default'];
        currentSection = {
          icon: config.icon,
          title: defaultTitle,
          color: config.color,
          bgColor: config.bgColor,
          items: [item]
        };
        currentVersion.sections.push(currentSection);
      }
    }
  }

  return versions;
};

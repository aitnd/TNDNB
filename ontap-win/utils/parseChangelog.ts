import { Rocket, Shield, Code, List, Sparkles, Wrench } from 'lucide-react';

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

export const getSectionConfig = (title: string): { icon: any; color: string; bgColor: string } => {
  const lower = title.toLowerCase();

  if (/tính năng|feature|added|mới/i.test(lower)) {
    return { icon: Sparkles, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' };
  }
  if (/giao diện|ui|ux|hiển thị|trải nghiệm|changed/i.test(lower)) {
    return { icon: Rocket, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
  }
  if (/sửa lỗi|vá lỗi|khắc phục|fix|bug/i.test(lower)) {
    return { icon: Wrench, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
  }
  if (/bảo mật|security/i.test(lower)) {
    return { icon: Shield, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' };
  }
  if (/kỹ thuật|dev|infra|hạ tầng|database|build|refactor/i.test(lower)) {
    return { icon: Code, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
  }

  return { icon: List, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-900/30' };
};

export const parseChangelog = (text: string): ChangelogVersion[] => {
  if (!text || typeof text !== 'string') return [];
  const versions: ChangelogVersion[] = [];
  const lines = text.split('\n');

  let currentVersion: ChangelogVersion | null = null;
  let currentSection: ChangelogSection | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('## ')) {
      const header = line.substring(3);
      const versionMatch = header.match(/\[(.*?)\]/);
      const version = versionMatch ? versionMatch[1] : '';

      if (!version || /^\d{4}-\d{2}-\d{2}$/.test(version)) {
        continue;
      }

      let date = '';
      const dateMatch = header.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        const [year, month, day] = dateMatch[0].split('-');
        date = `${day}/${month}/${year}`;
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

    if (line.startsWith('### ')) {
      const title = line.substring(4).trim();
      const config = getSectionConfig(title);

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

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.substring(2).trim();
      if (currentSection) {
        currentSection.items.push(item);
      } else {
        const defaultTitle = 'Cập nhật';
        const config = getSectionConfig(defaultTitle);
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

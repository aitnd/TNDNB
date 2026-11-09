import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, X } from 'lucide-react';
import changelogUserRaw from '../CHANGELOG.md?raw';
import changelogDevRaw from '../../CHANGELOG_DEV.md?raw';
import { parseChangelog, ChangelogVersion } from '../utils/parseChangelog';

interface ChangelogModalProps {
  onClose: () => void;
}

export const getLatestVersion = async (): Promise<string> => {
  try {
    const parsed = parseChangelog(changelogUserRaw);
    return parsed.length > 0 ? parsed[0].version : '3.22.0';
  } catch {
    return '3.22.0';
  }
};

const renderInlineMarkdown = (text: string) => {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'user' | 'dev'>('user');

  const userChangelog = useMemo<ChangelogVersion[]>(() => parseChangelog(changelogUserRaw), []);
  const devChangelog = useMemo<ChangelogVersion[]>(() => parseChangelog(changelogDevRaw), []);

  const currentList = activeTab === 'user' ? userChangelog : devChangelog;
  const latestRelease = currentList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in tabular-nums">
      <div className="bg-card text-card-foreground w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-sm">
              <Rocket size={22} className="animate-float" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                Lịch sử cập nhật
              </h2>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider tabular-nums">
                Phiên bản: v{latestRelease?.version || '3.22.0'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-4 pb-2 bg-card border-b border-border flex justify-center">
          <div className="inline-flex p-1 bg-muted rounded-xl border border-border shadow-xs">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-4 sm:px-6 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[38px] flex items-center gap-1.5 ${
                activeTab === 'user'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>👤</span>
              <span>Người dùng</span>
            </button>
            <button
              onClick={() => setActiveTab('dev')}
              className={`px-4 sm:px-6 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[38px] flex items-center gap-1.5 ${
                activeTab === 'dev'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>💻</span>
              <span>Kỹ thuật (Dev)</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {latestRelease ? (
            <div className="relative">
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="px-3.5 py-1.5 rounded-xl font-black text-sm shadow-sm tabular-nums bg-primary text-primary-foreground">
                  v{latestRelease.version}
                </div>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {latestRelease.date}
                </span>
                {latestRelease.isLatest && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
                    MỚI NHẤT
                  </span>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-4 pl-2 border-l-2 border-border ml-4 pb-2">
                {latestRelease.sections.map((section, sIdx) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={sIdx} className="bg-card rounded-xl p-4 border border-border transition-all">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`p-2 rounded-lg ${section.bgColor}`}>
                          <IconComponent size={16} className={section.color} />
                        </div>
                        <span className={`font-black text-xs uppercase tracking-wider ${section.color}`}>
                          {section.title}
                        </span>
                      </div>
                      <ul className="space-y-2 ml-1">
                        {section.items.map((item: string, iIdx: number) => (
                          <li key={iIdx} className="flex items-start gap-2.5 text-sm text-foreground font-normal leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                            <span>{renderInlineMarkdown(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Chưa có dữ liệu cập nhật
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/30 flex flex-col sm:flex-row gap-3 justify-between items-center w-full">
          <p className="text-[11px] text-muted-foreground font-medium text-center sm:text-left">
            Phát triển bởi Horizon TND với tâm huyết ❤️
          </p>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                navigate('/ontap/changelog');
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-card hover:bg-muted text-foreground rounded-xl font-bold text-xs transition-all border border-border min-h-[44px] flex items-center justify-center text-center"
            >
              Xem tất cả
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-xs min-h-[44px] flex items-center justify-center shadow-sm transition-all"
            >
              Tuyệt vời!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;

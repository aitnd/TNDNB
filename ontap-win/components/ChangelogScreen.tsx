import React, { useState, useMemo } from 'react';
import { Rocket } from 'lucide-react';
import { ArrowLeftIcon3D } from './icons';
import changelogUserRaw from '../CHANGELOG.md?raw';
import changelogDevRaw from '../../CHANGELOG_DEV.md?raw';
import { parseChangelog, ChangelogVersion } from '../utils/parseChangelog';

const triggerHaptic = (_type: string) => {};

interface ChangelogScreenProps {
  onBack: () => void;
}

const renderInlineMarkdown = (text: string) => {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const ChangelogScreen: React.FC<ChangelogScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'user' | 'dev'>('user');

  const userChangelog = useMemo<ChangelogVersion[]>(() => parseChangelog(changelogUserRaw), []);
  const devChangelog = useMemo<ChangelogVersion[]>(() => parseChangelog(changelogDevRaw), []);

  const currentList = activeTab === 'user' ? userChangelog : devChangelog;
  const currentVersion = currentList[0]?.version || '3.22.0';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right pb-24 tabular-nums">
      <div className="relative text-center mb-6 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
        </button>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Rocket className="h-8 w-8 text-indigo-600 animate-float" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Lịch sử cập nhật</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium tabular-nums">
          Phiên bản hiện tại: v{currentVersion}
        </p>
      </div>

      {/* Segmented Control Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('user'); }}
            className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[40px] flex items-center gap-1.5 ${
              activeTab === 'user'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>👤</span>
            <span>Người dùng</span>
          </button>
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('dev'); }}
            className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[40px] flex items-center gap-1.5 ${
              activeTab === 'dev'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>💻</span>
            <span>Kỹ thuật (Dev)</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-6">
        <div className="space-y-8">
          {currentList.map((release, rIdx) => (
            <div key={rIdx} className="relative">
              {/* Version Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`px-4 py-2 rounded-2xl font-black text-sm shadow-sm tabular-nums ${release.isLatest
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  v{release.version}
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest tabular-nums">
                  {release.date}
                </span>
                {release.isLatest && (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200/50">
                    MỚI NHẤT
                  </span>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-6 pl-2 border-l-2 border-slate-100 dark:border-slate-700 ml-6 pb-2">
                {release.sections.map((section, sIdx) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={sIdx} className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-5 border border-slate-100/50 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${section.bgColor} group-hover:scale-110 transition-transform`}>
                          <IconComponent size={18} className={section.color} />
                        </div>
                        <span className={`font-black text-xs uppercase tracking-wider ${section.color}`}>
                          {section.title}
                        </span>
                      </div>
                      <ul className="space-y-2.5 ml-1">
                        {section.items.map((item: string, iIdx: number) => (
                          <li key={iIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                            <span>{renderInlineMarkdown(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Phát triển bởi Horizon TND với tâm huyết ❤️
        </p>
      </div>
    </div>
  );
};

export default ChangelogScreen;

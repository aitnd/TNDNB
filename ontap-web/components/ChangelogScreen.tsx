import React, { useEffect, useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { parseChangelog, ChangelogVersion } from '../utils/parseChangelog';
import { triggerHaptic } from '../utils/nativeUX';
import { ArrowLeftIcon3D } from './icons';
// @ts-ignore
import changelogRaw from '../CHANGELOG.md?raw';

interface ChangelogScreenProps {
  onBack: () => void;
}

const ChangelogScreen: React.FC<ChangelogScreenProps> = ({ onBack }) => {
  const [changelogData, setChangelogData] = useState<ChangelogVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('https://daotaothuyenvien.com/ontap/CHANGELOG.md', {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const text = await response.text();
          const parsed = parseChangelog(text);
          if (parsed.length > 0) {
            setChangelogData(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải Changelog từ remote:', error);
      }

      const localData = parseChangelog(changelogRaw);
      setChangelogData(localData);
      setLoading(false);
    };

    fetchChangelog();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right pb-24">
      <div className="relative text-center mb-8 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
        </button>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Rocket className="h-8 w-8 text-indigo-600 animate-float" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Lịch sử cập nhật</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {loading ? 'Đang kiểm tra...' : `Phiên bản hiện tại: v${changelogData[0]?.version}`}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu mới nhất...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {changelogData.map((release, rIdx) => (
              <div key={rIdx} className="relative">
                {/* Version Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${release.isLatest
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                    v{release.version}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
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
                          <span className={`font-black text-xs uppercase tracking-widest ${section.color}`}>
                            {section.title}
                          </span>
                        </div>
                        <ul className="space-y-3 ml-2">
                          {section.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mt-2 flex-shrink-0"></span>
                              <span>{item}</span>
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
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Phát triển bởi Horizon TND với tâm huyết ❤️
        </p>
      </div>
    </div>
  );
};

export default ChangelogScreen;

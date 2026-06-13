import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, Rocket, Loader2 } from 'lucide-react';       
import { parseChangelog, ChangelogVersion } from '../utils/parseChangelog';
// @ts-ignore
import changelogRaw from '../CHANGELOG.md?raw';

interface ChangelogModalProps {
  onClose: () => void;
}


// 💥 Hàm lấy phiên bản mới nhất từ Changelog để hiển thị trên Navbar
export const getLatestVersion = (): string => {
  try {
    const parsed = parseChangelog(changelogRaw);
    return parsed[0]?.version || "3.9.2";
  } catch (e) {
    return "3.9.2";
  }
};

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  const [changelogData, setChangelogData] = useState<ChangelogVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        // 💖 Thử tải từ server để có dữ liệu mới nhất
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

      // 💖 Fallback: Dùng bản đính kèm trong app nếu không có mạng
      const localData = parseChangelog(changelogRaw);
      setChangelogData(localData);
      setLoading(false);
    };

    fetchChangelog();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
              <Rocket size={24} className="animate-float" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                Lịch sử cập nhật
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                {loading ? 'Đang kiểm tra...' : `Phiên bản hiện tại: v${changelogData[0]?.version}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-400 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu mới nhất...</p>
            </div>
          ) : (
            changelogData.map((release, rIdx) => (
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
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center md:text-left">
            Phát triển bởi Horizon TND với tâm huyết ❤️
          </p>
          <button
            onClick={onClose}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/30 active:scale-95 transition-all"
          >
            Tuyệt vời!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
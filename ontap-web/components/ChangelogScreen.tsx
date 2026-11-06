import React, { useEffect, useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../utils/nativeUX';
import { ArrowLeftIcon3D } from './icons';
import { getGitHubReleases } from '../services/releaseService';

interface ChangelogScreenProps {
  onBack: () => void;
}

const ChangelogScreen: React.FC<ChangelogScreenProps> = ({ onBack }) => {
  const [changelogData, setChangelogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const releases = await getGitHubReleases();
        if (releases.length > 0) {
          const parsed = releases.map((rel, index) => ({
            version: rel.version,
            date: new Date(rel.created_at || Date.now()).toLocaleDateString('vi-VN'),
            isLatest: index === 0,
            sections: [
              {
                icon: Rocket,
                title: 'Cập nhật',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                items: rel.release_notes ? rel.release_notes.split('\n') : ['Cập nhật hiệu suất và vá lỗi']
              }
            ]
          }));
          setChangelogData(parsed);
        }
      } catch (error) {
        console.error('Lỗi khi tải Changelog từ remote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right pb-24 pt-20 tabular-nums">
      <div className="relative text-center mb-8 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-2 rounded-2xl shadow-sm border border-border active:scale-95 transition-all text-foreground hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-7 w-7 text-foreground" />
        </button>
        <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-primary/20">
          <Rocket className="h-8 w-8 animate-float" />
        </div>
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Lịch sử cập nhật</h1>
        <p className="text-sm text-muted-foreground mt-1 font-semibold tabular-nums">
          {loading ? 'Đang kiểm tra...' : `Phiên bản hiện tại: v${changelogData[0]?.version}`}
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Đang tải dữ liệu mới nhất...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {changelogData.map((release, rIdx) => (
              <div key={rIdx} className="relative">
                {/* Version Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`px-3.5 py-1.5 rounded-xl font-black text-sm shadow-sm tabular-nums ${release.isLatest
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    v{release.version}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                    {release.date}
                  </span>
                  {release.isLatest && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
                      MỚI NHẤT
                    </span>
                  )}
                </div>

                {/* Sections */}
                <div className="space-y-4 pl-2 border-l-2 border-border ml-4 pb-2">
                  {release.sections.map((section: any, sIdx: number) => {
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
        <p className="text-[11px] text-muted-foreground font-medium">
          Phát triển bởi Horizon TND với tâm huyết ❤️
        </p>
      </div>
    </div>
  );
};

export default ChangelogScreen;

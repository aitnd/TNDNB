import * as React from 'react';
import { X, Shield, Smartphone, Rocket, Zap, Monitor, Layout, Code, RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { parseChangelog, ChangelogVersion } from '../utils/parseChangelog';
// @ts-ignore
import changelogRaw from '../CHANGELOG.md?raw';

interface ChangelogModalProps {
  onClose: () => void;
}

// 💖 Phân tích dữ liệu từ file MD
const CHANGELOG_DATA: ChangelogVersion[] = parseChangelog(changelogRaw);

export const getLatestVersion = () => {
  return CHANGELOG_DATA[0]?.version || '3.0.0';
};

// So sánh version (trả về true nếu v1 < v2)
const isVersionLower = (v1: string, v2: string): boolean => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return true;
    if (p1 > p2) return false;
  }
  return false;
};

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  const [currentVersion, setCurrentVersion] = React.useState<string>('...');
  const [updateStatus, setUpdateStatus] = React.useState<'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const latestVersion = getLatestVersion();

  // Lấy version hiện tại của app từ Electron
  React.useEffect(() => {
    const getVersion = async () => {
      try {
        // @ts-ignore - Electron API
        if (window.electron?.appVersion) {
          setCurrentVersion(window.electron.appVersion);
        } else if (window.electron?.invoke) {
          const version = await window.electron.invoke('get-app-version');
          setCurrentVersion(version);
        } else {
          setCurrentVersion(latestVersion);
        }
      } catch (e) {
        setCurrentVersion(latestVersion);
      }
    };
    getVersion();

    // Lắng nghe sự kiện update từ main process
    // @ts-ignore
    if (window.electron) {
      // @ts-ignore
      window.electron.onUpdateProgress?.((percent: number) => {
        setDownloadProgress(percent);
        setUpdateStatus('downloading');
      });
      // @ts-ignore
      window.electron.onUpdateDownloaded?.(() => {
        setUpdateStatus('ready');
      });
      // @ts-ignore
      window.electron.onUpdateError?.((err: string) => {
        setUpdateStatus('error');
        setErrorMessage(err);
      });
    }
  }, [latestVersion]);

  // Kiểm tra cập nhật thủ công
  const handleCheckUpdate = () => {
    setUpdateStatus('checking');
    setErrorMessage('');
    try {
      // @ts-ignore - Gửi lệnh check update cho main process
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('download-update');

        // Timeout sau 10 giây nếu không có response
        setTimeout(() => {
          setUpdateStatus((prev) => {
            if (prev === 'checking') {
              if (!isVersionLower(currentVersion, latestVersion)) {
                return 'idle';
              }
            }
            return prev;
          });
        }, 10000);
      } else {
        setUpdateStatus('error');
        setErrorMessage('Chức năng này chỉ hoạt động trên ứng dụng Windows');
      }
    } catch (e: any) {
      setUpdateStatus('error');
      setErrorMessage(e.message || 'Không thể kiểm tra cập nhật');
    }
  };

  // Cài đặt cập nhật
  const handleInstallUpdate = () => {
    try {
      // @ts-ignore
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('install-update');
      }
    } catch (e) {
      console.error('Install update failed:', e);
    }
  };

  const hasUpdate = isVersionLower(currentVersion, latestVersion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <Rocket size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Cập nhật ứng dụng
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kiểm tra và cài đặt phiên bản mới
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* UPDATE STATUS SECTION */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50">
          <div className="flex items-center justify-between gap-4">
            {/* Version Info */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phiên bản hiện tại</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">v{currentVersion}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phiên bản mới nhất</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">v{latestVersion}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {updateStatus === 'checking' ? (
                <button disabled className="flex items-center gap-2 px-4 py-2.5 bg-gray-400 text-white rounded-xl font-medium">
                  <RefreshCw size={18} className="animate-spin" />
                  Đang kiểm tra...
                </button>
              ) : updateStatus === 'downloading' ? (
                <div className="text-center">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(downloadProgress)}%</span>
                </div>
              ) : updateStatus === 'ready' ? (
                <button onClick={handleInstallUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
                  <CheckCircle size={18} />
                  Khởi động lại
                </button>
              ) : updateStatus === 'error' ? (
                <button onClick={handleCheckUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
                  <AlertCircle size={18} />
                  Thử lại
                </button>
              ) : hasUpdate ? (
                <button onClick={handleCheckUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-colors shadow-lg">
                  <Download size={18} />
                  Cập nhật ngay
                </button>
              ) : (
                <button onClick={handleCheckUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors">
                  <RefreshCw size={18} />
                  Kiểm tra
                </button>
              )}
            </div>
          </div>

          {/* Status Message */}
          {updateStatus === 'error' && errorMessage && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              ⚠️ {errorMessage}
            </p>
          )}
          {updateStatus === 'ready' && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
              ✅ Bản cập nhật đã sẵn sàng! Nhấn "Khởi động lại" để cài đặt.
            </p>
          )}
          {!hasUpdate && currentVersion !== '...' && updateStatus === 'idle' && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              ✅ Bạn đang sử dụng phiên bản mới nhất!
            </p>
          )}
        </div>

        {/* Changelog Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            📋 Lịch sử cập nhật
          </h3>
          {CHANGELOG_DATA.map((release, rIdx) => (
            <div key={rIdx} className="relative">
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${release.isLatest ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
                  v{release.version}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{release.date}</span>
                {release.isLatest && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                    MỚI NHẤT
                  </span>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-4 pl-2">
                {release.sections.map((section, sIdx) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={sIdx} className="rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                      <div className={`flex items-center gap-2 px-4 py-2.5 ${section.bgColor}`}>
                        <IconComponent size={18} className={section.color} />
                        <span className={`font-semibold text-sm ${section.color}`}>{section.title}</span>
                      </div>
                      <ul className="p-4 space-y-2 bg-white dark:bg-slate-800/50">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              {rIdx < CHANGELOG_DATA.length - 1 && (
                <div className="border-t border-dashed border-gray-200 dark:border-slate-700 mt-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Cập nhật liên tục để phục vụ bạn tốt hơn ❤️</span>
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
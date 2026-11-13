import React, { useState, useEffect } from 'react';
import { Smartphone, X, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { triggerHaptic } from '../utils/nativeUX';

const DISMISS_KEY = 'ontap_pwa_prompt_dismissed_until';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày
const DISMISS_EVENT = 'ontap-pwa-banner-dismissed';

// 1. Module-Level Capture: Bắt sự kiện beforeinstallprompt ngay khi script nạp vào trình duyệt
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    (window as any).__deferredPwaPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
  });
}

export const PwaInstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Kiểm tra chế độ PWA Standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Kiểm tra cờ ẩn 7 ngày
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }
    } catch {
      // Bỏ qua lỗi localStorage
    }

    // Nhận diện iOS
    const userAgent = window.navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // Đọc prompt có sẵn từ module top-level
    if ((window as any).__deferredPwaPrompt) {
      setDeferredPrompt((window as any).__deferredPwaPrompt);
      setIsVisible(true);
    } else if (isIosDevice) {
      setIsVisible(true);
    } else {
      // Fallback hiển thị cho Android / Mobile để hướng dẫn qua menu nếu không có prompt
      setIsVisible(true);
    }

    // Lắng nghe sự kiện prompt đến sau
    const onPromptAvailable = () => {
      if ((window as any).__deferredPwaPrompt) {
        setDeferredPrompt((window as any).__deferredPwaPrompt);
        setIsVisible(true);
      }
    };

    // Lắng nghe đồng bộ đóng banner từ các component khác
    const onBannerDismissed = () => {
      setIsVisible(false);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as any).__deferredPwaPrompt = null;
    };

    window.addEventListener('pwa-prompt-available', onPromptAvailable);
    window.addEventListener(DISMISS_EVENT, onBannerDismissed);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-prompt-available', onPromptAvailable);
      window.removeEventListener(DISMISS_EVENT, onBannerDismissed);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic('light');

    if (isIos) {
      setShowIosGuide(true);
      setShowAndroidGuide(false);
      return;
    }

    const promptToUse = deferredPrompt || (window as any).__deferredPwaPrompt;
    if (promptToUse) {
      promptToUse.prompt();
      const choiceResult = await promptToUse.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
        (window as any).__deferredPwaPrompt = null;
      }
      setDeferredPrompt(null);
    } else {
      // Android fallback / In-app WebView: Mở hướng dẫn Android 3 bước
      setShowAndroidGuide(true);
      setShowIosGuide(false);
    }
  };

  const handleDismiss = () => {
    triggerHaptic('light');
    try {
      const hideUntil = Date.now() + DISMISS_DURATION_MS;
      localStorage.setItem(DISMISS_KEY, String(hideUntil));
    } catch {
      // Bỏ qua lỗi
    }
    setIsVisible(false);
    // Phát sự kiện đồng bộ ẩn tất cả các banner khác
    window.dispatchEvent(new CustomEvent(DISMISS_EVENT));
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="w-full lg:hidden mb-3 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-4 text-white shadow-md border border-white/20">
        {/* Nút đóng ✕ */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
          aria-label="Đóng thông báo"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white leading-tight">
              Cài đặt Giáo dục Ninh Bình vào màn hình chính
            </h3>
            <p className="text-xs text-white mt-1 leading-relaxed">
              Trải nghiệm toàn màn hình như ứng dụng di động, tải siêu tốc và ôn thi mượt mà hơn.
            </p>
          </div>
        </div>

        {/* Nút bấm Hành Động Kích Thước Lớn */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-sm hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PlusSquare size={17} />
            <span>Thêm vào MH chính</span>
          </button>
        </div>

        {/* Modal/Sheet Hướng Dẫn iOS Safari */}
        {showIosGuide && (
          <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white space-y-2 animate-in fade-in">
            <div className="font-semibold flex items-center gap-1.5 text-amber-200">
              <span>🍎 Hướng dẫn Thêm vào màn hình chính trên iPhone/iPad:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-white/95 pl-1 leading-relaxed">
              <li>
                Chạm vào biểu tượng <Share className="inline w-3.5 h-3.5 mx-1" /> <strong>Chia sẻ</strong> ở thanh dưới trình duyệt Safari.
              </li>
              <li>
                Cuộn xuống chọn <strong>&ldquo;Thêm vào MH chính&rdquo;</strong> (Add to Home Screen).
              </li>
              <li>
                Chạm vào <strong>&ldquo;Thêm&rdquo;</strong> ở góc trên bên phải để xác nhận tên <strong>Giáo dục Ninh Bình</strong>.
              </li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-2 text-[11px] underline text-white/80 hover:text-white block text-center w-full py-1"
            >
              Đã hiểu, thu gọn hướng dẫn
            </button>
          </div>
        )}

        {/* Modal/Sheet Hướng Dẫn Android Fallback / In-App Browser */}
        {showAndroidGuide && (
          <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white space-y-2 animate-in fade-in">
            <div className="font-semibold flex items-center gap-1.5 text-amber-200">
              <span>🤖 Hướng dẫn cài đặt ứng dụng trên Android:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-white/95 pl-1 leading-relaxed">
              <li>
                Chạm vào biểu tượng Menu 3 chấm <MoreVertical className="inline w-3.5 h-3.5 mx-1" /> ở góc trên bên phải trình duyệt.
              </li>
              <li>
                Chọn <strong>&ldquo;Cài đặt ứng dụng&rdquo;</strong> hoặc <strong>&ldquo;Thêm vào màn hình chính&rdquo;</strong> (hoặc chọn <em>Mở bằng Chrome</em> nếu đang ở Zalo/Facebook).
              </li>
              <li>
                Nhấn <strong>&ldquo;Cài đặt&rdquo;</strong> hoặc <strong>&ldquo;Thêm&rdquo;</strong> để hoàn tất đưa icon <strong>Giáo dục Ninh Bình</strong> ra màn hình.
              </li>
            </ol>
            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-2 text-[11px] underline text-white/80 hover:text-white block text-center w-full py-1"
            >
              Đã hiểu, thu gọn hướng dẫn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PwaInstallBanner;

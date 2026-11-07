import React, { useState, useEffect } from 'react';
import { Smartphone, X, Share, PlusSquare } from 'lucide-react';

const DISMISS_KEY = 'ontap_pwa_prompt_dismissed_until';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày

export const PwaInstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra môi trường client
    if (typeof window === 'undefined') return;

    // 2. Tự động ẩn 100% nếu ứng dụng đang chạy ở chế độ PWA Standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Kiểm tra xem người dùng đã bấm đóng banner trong vòng 7 ngày qua chưa
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }
    } catch {
      // Bỏ qua lỗi localStorage nếu trình duyệt ở chế độ private mode
    }

    // 4. Nhận diện thiết bị iOS / iPadOS Safari
    const userAgent = window.navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Trên iOS Safari không có sự kiện beforeinstallprompt, hiển thị banner cho phép mở hướng dẫn
      setIsVisible(true);
    }

    // 5. Lắng nghe sự kiện beforeinstallprompt cho Android / Chromium (Chrome, Edge, Cốc Cốc)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // 6. Lắng nghe khi cài đặt thành công
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Xử lý khi bấm nút "Cài đặt / Thêm ra MH chính"
  const handleInstallClick = async () => {
    if (isIos) {
      // iOS: Mở hướng dẫn chi tiết
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback nếu trình duyệt không hỗ trợ prompt trực tiếp
      setShowIosGuide(true);
    }
  };

  // Xử lý khi bấm nút đóng ✕ (Lưu cờ ẩn 7 ngày vào localStorage)
  const handleDismiss = () => {
    try {
      const hideUntil = Date.now() + DISMISS_DURATION_MS;
      localStorage.setItem(DISMISS_KEY, String(hideUntil));
    } catch {
      // Bỏ qua lỗi lưu storage
    }
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="w-full lg:hidden mb-3 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-4 text-white shadow-md border border-white/20">
        {/* Nút đóng ✕ */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              Cài đặt TNDNB vào màn hình chính
            </h3>
            <p className="text-xs text-white/90 mt-1 leading-relaxed">
              Mở nhanh toàn màn hình, học mượt không cần nhập địa chỉ web.
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
            <ol className="list-decimal list-inside space-y-1 text-white/95 pl-1">
              <li>
                Chạm vào biểu tượng <Share className="inline w-3.5 h-3.5 mx-1" /> <strong>Chia sẻ</strong> ở thanh dưới trình duyệt.
              </li>
              <li>
                Cuộn xuống chọn <strong>&ldquo;Thêm vào MH chính&rdquo;</strong> (Add to Home Screen).
              </li>
              <li>
                Chạm vào <strong>&ldquo;Thêm&rdquo;</strong> ở góc trên bên phải để hoàn tất.
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
      </div>
    </div>
  );
};

export default PwaInstallBanner;

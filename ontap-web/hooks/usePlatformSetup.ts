import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { useAppStore } from '../stores/useAppStore';

export const usePlatformSetup = () => {
  const setIsMobileApp = useAppStore(state => state.setIsMobileApp);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('mode') === 'app';
    const isNative = Capacitor.isNativePlatform();

    if (isNative || isTestMode) {
      setIsMobileApp(true);
    } else {
      setIsMobileApp(false);
    }

    if (isNative) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
  }, [setIsMobileApp]);

  // Handle Hardware Back Button (Android)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let lastTimeBackPress = 0;
    const timePeriodToExit = 2000;

    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const currentPath = window.location.pathname;

      if (currentPath === '/ontap/dashboard' || currentPath === '/' || currentPath === '/ontap') {
        const timeNow = new Date().getTime();
        if (timeNow - lastTimeBackPress < timePeriodToExit) {
          CapacitorApp.exitApp();
        } else {
          lastTimeBackPress = timeNow;
          import('sonner').then(({ toast }) => toast('Nhấn Back lần nữa để thoát ứng dụng.'));
        }
      } else if (currentPath === '/ontap/lambai' || currentPath === '/ontap/thithu') {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Hủy bài kiểm tra?',
            text: 'Bạn có chắc chắn muốn thoát và hủy kết quả bài đang làm?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, Thoát',
            cancelButtonText: 'Tiếp tục làm bài',
          }).then((result) => {
            if (result.isConfirmed) {
              window.history.back();
            }
          });
        });
      } else {
        if (canGoBack) {
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      }
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, []);
};

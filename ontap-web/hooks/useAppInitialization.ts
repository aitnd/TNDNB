import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { auth, db } from '../services/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchLicenses } from '../services/dataService';
import { getUserProfile } from '../services/userService';
import { checkUsage, showLimitAlert } from '../services/usageService';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import { UserProfile, License } from '../types';

export const useAppInitialization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unsubProfileRef = useRef<(() => void) | null>(null);
  
  const [isLocked, setIsLocked] = useState(false);
  const [isBiometricChecking, setIsBiometricChecking] = useState(false);
  const [usageConfig, setUsageConfig] = useState<any>(null);

  const licenses = useAppStore(state => state.licenses);
  const setLicenses = useAppStore(state => state.setLicenses);
  const setSelectedLicense = useAppStore(state => state.setSelectedLicense);
  const setSubjects = useAppStore(state => state.setSubjects);
  const setSelectedSubject = useAppStore(state => state.setSelectedSubject);
  const setCurrentQuiz = useAppStore(state => state.setCurrentQuiz);
  const setUserAnswers = useAppStore(state => state.setUserAnswers);
  const setScore = useAppStore(state => state.setScore);
  const userName = useAppStore(state => state.userName);
  const setUserName = useAppStore(state => state.setUserName);
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const setResumeSessionAvailable = useAppStore(state => state.setResumeSessionAvailable);
  const isMobileApp = useAppStore(state => state.isMobileApp);
  const setIsMobileApp = useAppStore(state => state.setIsMobileApp);

  // Lắng nghe cấu hình bảo mật realtime từ Firestore
  useEffect(() => {
    import('firebase/firestore').then(({ onSnapshot, doc }) => {
      const unsubConfig = onSnapshot(doc(db, 'settings', 'usage_config'), (docSnap) => {
        if (docSnap.exists()) {
          setUsageConfig(docSnap.data());
        }
      }, (error) => {
        console.warn('⚠️ [App] usage_config onSnapshot error:', error.message);
      });

      return () => unsubConfig();
    });
  }, []);

  const handleBiometricUnlock = useCallback(async () => {
    if (isBiometricChecking) return;
    setIsBiometricChecking(true);
    try {
      const result = await NativeBiometric.isAvailable();
      if (result.isAvailable) {
        await NativeBiometric.verifyIdentity({
          reason: "Vui lòng xác thực để vào ứng dụng",
          title: "Xác thực bảo mật",
          subtitle: "Dùng vân tay hoặc khuôn mặt",
          description: "Bảo vệ thông tin cá nhân của bạn",
        });
        setIsLocked(false);
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error('Biometric error:', e);
    } finally {
      setIsBiometricChecking(false);
    }
  }, [isBiometricChecking]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('mode') === 'app';
    const isNative = Capacitor.isNativePlatform();

    if (isNative || isTestMode) {
      setIsMobileApp(true);
    } else {
      setIsMobileApp(false);
    }

    // Biometric Check
    if (isNative) {
      Preferences.get({ key: 'biometric_enabled' }).then(async (res) => {
        if (res.value === 'true') {
          setIsLocked(true);
          handleBiometricUnlock();
        }
      });
    }

    // Ẩn SplashScreen khi App load xong trên Native
    if (isNative) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
  }, [handleBiometricUnlock, setIsMobileApp]);

  // --- HARDWARE BACK BUTTON (ANDROID) ---
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

  // Load tên khách đã lưu từ localStorage
  useEffect(() => {
    if (!userProfile) {
      const savedGuestName = localStorage.getItem('ontap_guest_name');
      if (savedGuestName && !userName) {
        setUserName(savedGuestName);
      }
    }
  }, [userProfile, userName, setUserName]);

  // --- CUSTOM AUTO UPDATE CHECK (Windows) ---
  useEffect(() => {
    // @ts-ignore
    if (window.electron?.isElectron) {
      const checkUpdate = async () => {
        try {
          const { getUsageConfig } = await import('../services/adminConfigService');
          const config = await getUsageConfig();
          // @ts-ignore
          const currentVersion = window.electron.appVersion;
          const remoteVersion = config.app_links?.version;
          const downloadUrl = config.app_links?.windows;

          if (currentVersion && remoteVersion && downloadUrl) {
            const v1 = currentVersion.split('.').map(Number);
            const v2 = remoteVersion.split('.').map(Number);
            let hasUpdate = false;

            for (let i = 0; i < 3; i++) {
              if (v2[i] > v1[i]) { hasUpdate = true; break; }
              if (v2[i] < v1[i]) break;
            }

            if (hasUpdate) {
              const { default: Swal } = await import('sweetalert2');
              const result = await Swal.fire({
                title: 'Có bản cập nhật mới!',
                text: `Phiên bản ${remoteVersion} đã sẵn sàng. Bạn có muốn cập nhật ngay không?`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Cập nhật ngay',
                cancelButtonText: 'Để sau'
              });

              if (result.isConfirmed) {
                Swal.fire({
                  title: 'Đang tải cập nhật...',
                  html: 'Vui lòng không tắt ứng dụng.<br><b>0%</b>',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                    // @ts-ignore
                    window.electron.downloadUpdate(downloadUrl);
                  }
                });
              }
            }
          }
        } catch (err) {
          console.error("Update check failed:", err);
        }
      };

      setTimeout(checkUpdate, 3000);

      // @ts-ignore
      window.electron.onUpdateProgress((percent) => {
        const b = document.querySelector('.swal2-html-container b');
        if (b) b.textContent = `${Math.round(percent)}%`;
      });

      // @ts-ignore
      window.electron.onUpdateDownloaded(() => {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Tải xong!',
            text: 'Ứng dụng sẽ khởi động lại để cài đặt.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            // @ts-ignore
            window.electron.installUpdate();
          });
        });
      });

      // @ts-ignore
      window.electron.onUpdateError(() => {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire('Lỗi', 'Không thể tải bản cập nhật. Vui lòng thử lại sau.', 'error');
        });
      });
    }
  }, []);

  useEffect(() => {
    const loadLicenses = async () => {
      try {
        const data = await fetchLicenses();
        setLicenses(data);
      } catch (error) {
        console.error('Error loading licenses:', error);
      }
    };
    loadLicenses();
  }, [setLicenses]);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      setUserProfile(null);
      setUserName('');
      import('./sessionService').then(({ clearSession }) => clearSession());
      setResumeSessionAvailable(false);
      navigate('/ontap/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate, setResumeSessionAvailable, setUserName, setUserProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (unsubProfileRef.current) {
          unsubProfileRef.current();
          unsubProfileRef.current = null;
        }

        import('firebase/firestore').then(({ onSnapshot, doc }) => {
          unsubProfileRef.current = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
              if (profile.status === 'disabled') {
                import('sweetalert2').then(({ default: Swal }) => {
                  Swal.fire({
                    title: 'Tài khoản đã bị vô hiệu hoá',
                    text: 'Tài khoản của bạn đã bị vô hiệu hoá bởi quản trị viên. Vui lòng liên hệ để được hỗ trợ.',
                    icon: 'error',
                    confirmButtonText: 'Đồng ý'
                  }).then(() => {
                    auth.signOut();
                  });
                });
                return;
              }
              setUserProfile(profile);
              setUserName(profile.full_name || firebaseUser.displayName || '');
            }
          }, (error) => {
            console.warn('⚠️ [App] Profile onSnapshot error:', error.message);
          });
        });

        let profile = null;
        try {
          profile = await getUserProfile(firebaseUser.uid);
        } catch (fetchErr) {
          console.error("❌ Critical: Could not fetch user profile:", fetchErr);
        }

        if (profile === null) {
          console.warn("⚠️ Tài khoản Firebase Auth không có profile Firestore. Từ chối truy cập.");
          import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
              title: 'Tài khoản không tồn tại',
              text: 'Tài khoản của bạn không tồn tại trên hệ thống. Vui lòng liên hệ quản trị viên.',
              icon: 'error',
              confirmButtonText: 'Đồng ý'
            }).then(() => {
              auth.signOut();
            });
          });
          return;
        }

        if (profile.status === 'disabled') {
          import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
              title: 'Tài khoản đã bị vô hiệu hoá',
              text: 'Tài khoản của bạn đã bị vô hiệu hoá bởi quản trị viên. Vui lòng liên hệ để được hỗ trợ.',
              icon: 'error',
              confirmButtonText: 'Đồng ý'
            }).then(() => {
              auth.signOut();
            });
          });
          return;
        }

        import('../services/fcmClient').then(({ initializeFCM }) => {
          initializeFCM(firebaseUser.uid);
        });

        import('../services/authSessionService').then(({ enforceAndRecordSession }) => {
          enforceAndRecordSession(firebaseUser.uid);
        });

        import('../services/sessionService').then(({ loadSession }) => {
          const session = loadSession(firebaseUser.uid);
          if (session) {
            setCurrentQuiz(session.quiz);
            setUserAnswers(session.userAnswers);
            setSelectedLicense(session.selectedLicense);
            setSelectedSubject(session.selectedSubject);
          } else {
            if (profile?.defaultLicenseId) {
              const fastFound = licenses.find(l => l.id === profile.defaultLicenseId);
              if (fastFound) {
                setSelectedLicense(fastFound);
              }
            }
          }
        });

      } else {
        if (unsubProfileRef.current) {
          unsubProfileRef.current();
          unsubProfileRef.current = null;
        }
        setUserProfile(null);
        setUserName('');
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfileRef.current) {
        unsubProfileRef.current();
        unsubProfileRef.current = null;
      }
    };
  }, [licenses, setCurrentQuiz, setSelectedLicense, setSelectedSubject, setUserAnswers, setUserName, setUserProfile]);

  // 💖 KIỂM TRA TRẠNG THÁI PHIÊN ĐĂNG NHẬP 💖
  useEffect(() => {
    if (!userProfile) return;

    import('../services/authSessionService').then(({ checkCurrentSessionStatus, updateLastActive }) => {
      updateLastActive();

      const unsubSession = checkCurrentSessionStatus((isLoggedOut) => {
        if (isLoggedOut) {
          import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
              title: 'Phiên đăng nhập hết hạn',
              text: 'Tài khoản của bạn đã được đăng xuất từ thiết bị khác hoặc bởi quản trị viên.',
              icon: 'warning',
              confirmButtonText: 'Đồng ý'
            }).then(() => {
              handleLogout();
            });
          });
        }
      });

      return () => unsubSession();
    });
  }, [userProfile, handleLogout]);

  // 🔒 KHÓA CHUỘT PHẢI & CHẶN COPY BẢO MẬT (Động theo cấu hình role)
  useEffect(() => {
    const examPaths = ['/ontap/lambai', '/ontap/thithu', '/ontap/giamkhao/lambai', '/ontap/giamkhao/thithu'];
    const isExamScreen = examPaths.includes(location.pathname);

    if (!isExamScreen) return;

    const currentRole = userProfile?.role || 'guest';
    const isCopyPreventedByDefault = ['guest', 'free_user', 'verified_user', 'vip_user'].includes(currentRole);
    const preventCopy = usageConfig 
      ? (usageConfig[currentRole]?.preventCopy ?? isCopyPreventedByDefault)
      : isCopyPreventedByDefault;

    if (!preventCopy) return;

    const originalUserSelect = document.body.style.userSelect;
    const originalWebkitSelect = document.body.style.webkitUserSelect;
    // @ts-ignore
    const originalMsSelect = document.body.style.msUserSelect;
    // @ts-ignore
    const originalMozSelect = document.body.style.mozUserSelect;

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    // @ts-ignore
    document.body.style.msUserSelect = 'none';
    // @ts-ignore
    document.body.style.mozUserSelect = 'none';

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: 'Cảnh báo bảo mật',
          text: 'Tính năng sao chép đề thi đã bị cấm!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Cảnh báo bảo mật',
            text: 'Không được phép sử dụng phím tắt sao chép!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy as any);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.userSelect = originalUserSelect;
      document.body.style.webkitUserSelect = originalWebkitSelect;
      // @ts-ignore
      document.body.style.msUserSelect = originalMsSelect;
      // @ts-ignore
      document.body.style.mozUserSelect = originalMozSelect;

      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy as any);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname, userProfile, usageConfig]);

  useEffect(() => {
    if (location.pathname === '/ontap/lambai' || location.pathname === '/ontap/thithu') {
      setResumeSessionAvailable(false);
      return;
    }

    const sessionUserId = userProfile?.id || 'guest';
    import('../services/sessionService').then(({ loadSession }) => {
      const session = loadSession(sessionUserId);
      if (session) {
        setResumeSessionAvailable(true);
      } else {
        setResumeSessionAvailable(false);
      }
    });
  }, [location.pathname, userProfile, setResumeSessionAvailable]);

  return {
    isLocked,
    setIsLocked,
    isBiometricChecking,
    handleBiometricUnlock,
    usageConfig,
    handleLogout
  };
};

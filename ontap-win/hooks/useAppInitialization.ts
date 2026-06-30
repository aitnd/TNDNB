import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { auth, db } from '../services/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchLicenses } from '../services/dataService';
import { syncData } from '../services/syncService';
import { UserProfile } from '../types';
import { toast } from 'sonner';

export const useAppInitialization = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const setLicenses = useAppStore(state => state.setLicenses);
  const licenses = useAppStore(state => state.licenses);
  const userName = useAppStore(state => state.userName);
  const setUserName = useAppStore(state => state.setUserName);
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const setIsMobileApp = useAppStore(state => state.setIsMobileApp);

  const [usageConfig, setUsageConfig] = useState<any>(null);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('mode') === 'app';
    // const isNative = Capacitor.isNativePlatform();

    if (isTestMode) { // Removed isNative check for Windows App
      setIsMobileApp(true);
    } else {
      setIsMobileApp(false);
    }
  }, []);

  // Load tên khách đã lưu từ localStorage (chạy khi userProfile thay đổi hoặc lúc đầu)
  useEffect(() => {
    if (!userProfile) {
      const savedGuestName = localStorage.getItem('ontap_guest_name');
      if (savedGuestName && !userName) {
        setUserName(savedGuestName);
      }
    }
  }, [userProfile, userName]);

  // --- CUSTOM AUTO UPDATE CHECK (Windows) ---
  useEffect(() => {
    if (window.electron?.isElectron) {
      const checkUpdate = async () => {
        try {
          const { getUsageConfig } = await import('../services/adminConfigService');
          const config = await getUsageConfig();
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
      window.electron.onUpdateError((err) => {
        console.error('Update error:', err);
        toast.error('Không thể tải bản cập nhật. Vui lòng thử lại sau.', {
          position: 'bottom-right',
          duration: 5000
        });
      });
    }
  }, []);

  useEffect(() => {
    const loadLicenses = async () => {
      try {
        if (navigator.onLine) {
          const data = await fetchLicenses();
          setLicenses(data);
        } else {
          const { getLicensesOffline } = await import('../services/offlineService');
          const data = await getLicensesOffline();
          setLicenses(data);
        }
      } catch (error) {
        console.error('Error loading licenses:', error);
      }
    };
    loadLicenses();
  }, []);

  // --- KHÔI PHỤC SESSION TỪ LOCAL STORAGE ---
  useEffect(() => {
    const restoreSession = async () => {
      const savedSession = localStorage.getItem('rememberSession');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          // Kiểm tra session còn hợp lệ (trong 30 ngày)
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - session.timestamp < thirtyDays) {
            if (session.offline) {
              // Khôi phục từ offline storage
              const { getOfflineUser } = await import('../services/offlineService');
              const offlineUser = await getOfflineUser(session.email);
              if (offlineUser) {
                const profile: UserProfile = {
                  id: offlineUser.id,
                  full_name: offlineUser.full_name,
                  email: offlineUser.email,
                  role: offlineUser.role as any,
                  offlineAccess: true
                };
                setUserProfile(profile);
                setUserName(profile.full_name);
              }
            }
            // Nếu online, Firebase auth sẽ tự xử lý
          } else {
            // Session hết hạn, xóa đi
            localStorage.removeItem('rememberSession');
          }
        } catch (err) {
          console.error('Error restoring session:', err);
        }
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Online: Sync data
        syncData(firebaseUser.uid);

        import('firebase/firestore').then(({ onSnapshot, doc }) => {
          onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
              // 🔒 Kiểm tra trạng thái tài khoản disabled → force logout ngay lập tức
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
          });
        });
        // ... rest of the existing logic for online user
      } else {
        // Kiểm tra nếu có session đã lưu (offline hoặc ghi nhớ)
        const savedSession = localStorage.getItem('rememberSession');
        if (!navigator.onLine && userProfile) {
          // Keep the current offline profile
        } else if (!savedSession) {
          // Chỉ xóa profile nếu không có session lưu
          setUserProfile(null);
          setUserName('');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [licenses, navigate, location.pathname]);

  // 💖 KIỂM TRA TRẠNG THÁI PHIÊN ĐĂNG NHẬP (MỚI) 💖
  useEffect(() => {
    if (!userProfile) return;

    import('../services/authSessionService').then(({ checkCurrentSessionStatus, updateLastActive }) => {
      // Cập nhật hoạt động cuối cùng
      updateLastActive();

      // Lắng nghe trạng thái session
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
  }, [userProfile]);

  // 🔒 KHÓA CHUỘT PHẢI & CHẶN COPY BẢO MẬT (Động theo cấu hình role cho cả Win app)
  useEffect(() => {
    const examPaths = ['/ontap/lambai', '/ontap/thithu', '/ontap/giamkhao/lambai', '/ontap/giamkhao/thithu'];
    const isExamScreen = examPaths.includes(location.pathname);

    if (!isExamScreen) return;

    // Xác định role hiện tại (mặc định guest nếu không đăng nhập)
    const currentRole = userProfile?.role || 'guest';
    
    // Mặc định cấm copy đối với các role học viên/khách vãng lai nếu chưa tải xong cấu hình
    const isCopyPreventedByDefault = ['guest', 'free_user', 'verified_user', 'vip_user'].includes(currentRole);
    const preventCopy = usageConfig 
      ? (usageConfig[currentRole]?.preventCopy ?? isCopyPreventedByDefault)
      : isCopyPreventedByDefault;

    if (!preventCopy) return;

    // 1. Chặn bôi đen bằng CSS
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

    // 2. Chặn menu chuột phải
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 3. Chặn sự kiện copy
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

    // 4. Chặn phím tắt Ctrl+C, Cmd+C, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      // Ctrl+C hoặc Cmd+C
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

      // Ctrl+U
      if (isCtrlOrCmd && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy as any);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Khôi phục lại style cũ
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

  const handleLogout = async () => {
    import('../services/sessionService').then(({ clearSession }) => clearSession());
    localStorage.removeItem('rememberSession');
    await auth.signOut();
    navigate('/');
  };

  return { usageConfig, handleLogout };
};

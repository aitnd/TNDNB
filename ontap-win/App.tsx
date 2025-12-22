import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import ThemeSwitcher from './components/ThemeSwitcher';
import SnowEffect from './components/SnowEffect';
import SweetAlertPopup from './components/SweetAlertPopup';
import NotificationMgmtScreen from './components/NotificationMgmtScreen';
import { useAppStore, AppState } from './stores/useAppStore';
import { auth, db } from './services/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import WelcomeModal from './components/WelcomeModal';
import LoginScreen from './components/LoginScreen';
import WindowsLoginScreen from './components/WindowsLoginScreen';
import RegisterScreen from './components/RegisterScreen';
import LicenseSelectionScreen from './components/LicenseSelectionScreen';
import NameInputScreen from './components/NameInputScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ExamQuizScreen2 from './components/ExamQuizScreen2';
import ExamResultsScreen from './components/ExamResultsScreen';
import ResultsScreen from './components/ResultsScreen';
import Dashboard from './components/Dashboard';
import HistoryScreen from './components/HistoryScreen';
import MyClassScreen from './components/MyClassScreen';
import ClassManagementScreen from './components/ClassManagementScreen';
import AccountScreen from './components/AccountScreen';
import TopNavbar from './components/TopNavbar';
import MailboxScreen from './components/MailboxScreen';
import AdSenseLoader from './components/AdSenseLoader';
import MobileBottomNav from './components/MobileBottomNav';
import ThiTrucTuyenPage from './components/ThiTrucTuyenPage';
import OnlineExamManagementScreen from './components/OnlineExamManagementScreen';
import AnalyticsPage from './components/AnalyticsPage';
import DownloadAppPage from './components/DownloadAppPage';
import WindowsDownloadRedirect from './components/WindowsDownloadRedirect';
import UsageConfigPanel from './components/UsageConfigPanel';
import { License, Subject, Quiz, UserAnswers, UserProfile } from './types';
import { fetchLicenses } from './services/dataService';
import { saveExamResult, getUserProfile } from './services/userService';
import { checkUsage, incrementUsage, showLimitAlert } from './services/usageService';
// import { Capacitor } from '@capacitor/core';
import usePresence from './hooks/usePresence';
import AlertMarquee from './components/AlertMarquee';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const AppContent: React.FC = () => {
  usePresence();
  const navigate = useNavigate();
  const location = useLocation();

  const licenses = useAppStore(state => state.licenses);
  const setLicenses = useAppStore(state => state.setLicenses);
  const selectedLicense = useAppStore(state => state.selectedLicense);
  const setSelectedLicense = useAppStore(state => state.setSelectedLicense);
  const subjects = useAppStore(state => state.subjects);
  const setSubjects = useAppStore(state => state.setSubjects);
  const selectedSubject = useAppStore(state => state.selectedSubject);
  const setSelectedSubject = useAppStore(state => state.setSelectedSubject);
  const currentQuiz = useAppStore(state => state.currentQuiz);
  const setCurrentQuiz = useAppStore(state => state.setCurrentQuiz);
  const userAnswers = useAppStore(state => state.userAnswers);
  const setUserAnswers = useAppStore(state => state.setUserAnswers);
  const score = useAppStore(state => state.score);
  const setScore = useAppStore(state => state.setScore);
  const userName = useAppStore(state => state.userName);
  const setUserName = useAppStore(state => state.setUserName);
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const resumeSessionAvailable = useAppStore(state => state.resumeSessionAvailable);
  const setResumeSessionAvailable = useAppStore(state => state.setResumeSessionAvailable);
  const isMobileApp = useAppStore(state => state.isMobileApp);
  const setIsMobileApp = useAppStore(state => state.setIsMobileApp);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('mode') === 'app';
    // const isNative = Capacitor.isNativePlatform();

    if (isTestMode) { // Removed isNative check for Windows App
      setIsMobileApp(true);
    } else {
      setIsMobileApp(false);
    }

    // --- CUSTOM AUTO UPDATE CHECK (Windows) ---
    if (window.electron?.isElectron) {
      const checkUpdate = async () => {
        try {
          const { getUsageConfig } = await import('./services/adminConfigService');
          const config = await getUsageConfig();
          const currentVersion = window.electron.appVersion;
          const remoteVersion = config.app_links?.version;
          const downloadUrl = config.app_links?.windows;

          console.log(`Current: ${currentVersion}, Remote: ${remoteVersion}`);

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
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        import('firebase/firestore').then(({ onSnapshot, doc }) => {
          const unsubProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
              setUserProfile(profile);
              setUserName(profile.full_name || firebaseUser.displayName || '');
            }
          });
        });

        let profile = null;
        try {
          profile = await getUserProfile(firebaseUser.uid);
        } catch (fetchErr) {
          console.error("❌ Critical: Could not fetch user profile:", fetchErr);
        }

        if (profile === null) {
          const defaultProfile: UserProfile = {
            id: firebaseUser.uid,
            full_name: firebaseUser.displayName || 'Người dùng mới',
            email: firebaseUser.email || '',
            role: 'hoc_vien',
            photoURL: firebaseUser.photoURL || '',
            isVerified: false
          };

          try {
            const { setDoc, doc } = await import('firebase/firestore');
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile, { merge: true });
            profile = defaultProfile;
            setUserProfile(profile);
            setUserName(profile.full_name);
          } catch (err) {
            console.error("❌ Failed to create default profile:", err);
          }
        }

        import('./services/fcmClient').then(({ initializeFCM }) => {
          initializeFCM(firebaseUser.uid);
        });

        import('./services/sessionService').then(({ loadSession, getLicensePreference }) => {
          const session = loadSession(firebaseUser.uid);
          if (session) {
            setCurrentQuiz(session.quiz);
            setUserAnswers(session.userAnswers);
            setSelectedLicense(session.selectedLicense);
            setSelectedSubject(session.selectedSubject);

            // Do NOT auto-navigate. Just let the banner appear.
            // if (session.mode === 'online_exam') {
            //   navigate('/ontap/thithu');
            // } else {
            //   navigate('/ontap/lam-bai');
            // }
            return;
          }

          const checkLicenseLogic = async () => {
            if (profile?.defaultLicenseId) {
              const fastFound = licenses.find(l => l.id === profile.defaultLicenseId);
              if (fastFound) {
                setSelectedLicense(fastFound);
                return;
              }
            }
          };
          checkLicenseLogic();
        });

      } else {
        setUserProfile(null);
        setUserName('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [licenses, navigate, location.pathname]);

  const persistSession = useCallback((
    idx: number,
    time: number,
    answers: UserAnswers,
    quiz: Quiz | null,
    mode: 'practice' | 'online_exam'
  ) => {
    if (!quiz || !userProfile) return;
    import('./services/sessionService').then(({ saveSession }) => {
      saveSession(userProfile.id, quiz, mode, answers, idx, time, selectedLicense, selectedSubject);
    });
  }, [selectedLicense, selectedSubject, userProfile]);

  useEffect(() => {
    if (location.pathname === '/ontap/lam-bai' || location.pathname === '/ontap/thithu') {
      setResumeSessionAvailable(false);
      return;
    }

    if (userProfile) {
      import('./services/sessionService').then(({ loadSession }) => {
        const session = loadSession(userProfile.id);
        if (session) {
          setResumeSessionAvailable(true);
        } else {
          setResumeSessionAvailable(false);
        }
      });
    }
  }, [location.pathname, userProfile]);

  const resumeSession = () => {
    import('./services/sessionService').then(({ loadSession }) => {
      if (!userProfile) return;
      const session = loadSession(userProfile.id);
      if (session) {
        setCurrentQuiz(session.quiz);
        setUserAnswers(session.userAnswers);
        setSelectedLicense(session.selectedLicense);
        setSelectedSubject(session.selectedSubject);

        if (session.mode === 'online_exam') {
          navigate('/ontap/thithu');
        } else {
          navigate('/ontap/lam-bai');
        }
      }
    });
  };

  const handleStart = async () => {
    if (userProfile) {
      if (userProfile.defaultLicenseId) {
        const found = licenses.find(l => l.id === userProfile.defaultLicenseId);
        if (found) {
          setSelectedLicense(found);
          navigate('/ontap/chon-che-do');
          return;
        }
      }
      navigate('/ontap/chon-bang');
    } else {
      navigate('/ontap/chon-bang');
    }
  };

  const handleLicenseSelect = async (license: License) => {
    setSelectedLicense(license);
    import('./services/sessionService').then(({ saveLicensePreference }) => {
      saveLicensePreference(license.id);
    });

    if (userProfile) {
      navigate('/ontap/chon-che-do');
    } else {
      navigate('/ontap/nhap-ten');
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    navigate('/ontap/chon-che-do');
  };

  const startOnlineExam = async () => {
    if (!selectedLicense) return;
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => navigate('/ontap/dang-nhap'));
      return;
    }
    await incrementUsage(userProfile);

    const allQuestions: any[] = [];
    selectedLicense.subjects.forEach(subj => {
      allQuestions.push(...subj.questions);
    });
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 30);

    if (selected.length === 0) {
      alert("Chưa có câu hỏi nào cho hạng bằng này. Vui lòng thử lại sau.");
      return;
    }

    const examQuiz: Quiz = {
      id: `exam_${Date.now()}`,
      title: `Thi Thử - ${selectedLicense.name}`,
      questions: selected,
      timeLimit: 2700
    };

    setCurrentQuiz(examQuiz);
    setUserAnswers({});
    setScore(0);
    localStorage.removeItem('ontap_quiz_session');
    navigate('/ontap/thithu');
  };

  const handleModeSelect = async (mode: 'practice' | 'exam' | 'online_exam') => {
    if (mode === 'practice') {
      if (selectedLicense) {
        setSubjects(selectedLicense.subjects);
        navigate('/ontap/chon-mon');
      }
    } else if (mode === 'online_exam') {
      startOnlineExam();
    }
  };

  const handleSubjectSelect = async (subject: Subject) => {
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => navigate('/ontap/dang-nhap'));
      return;
    }
    await incrementUsage(userProfile);

    setSelectedSubject(subject);
    const newQuiz: Quiz = {
      id: subject.id,
      title: subject.name,
      questions: subject.questions,
      timeLimit: 0
    };
    setCurrentQuiz(newQuiz);
    setUserAnswers({});
    localStorage.removeItem('ontap_quiz_session');
    navigate('/ontap/lam-bai');
  };

  const handleQuizFinish = (answers: UserAnswers) => {
    if (currentQuiz) {
      import('./services/sessionService').then(({ clearSession }) => clearSession());
      setResumeSessionAvailable(false);

      let correctCount = 0;
      currentQuiz.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswerId) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setUserAnswers(answers);

      if (location.pathname === '/ontap/thithu') {
        if (userProfile) {
          saveExamResult(
            userProfile.id,
            selectedLicense!.id,
            selectedLicense!.name,
            null,
            'Thi thử',
            correctCount,
            30,
            currentQuiz.timeLimit! - 0
          );
        }
        navigate('/ontap/ket-qua-thi');
      } else {
        if (userProfile && selectedLicense) {
          const subjName = selectedSubject ? selectedSubject.name : null;
          saveExamResult(
            userProfile.id,
            selectedLicense.id,
            selectedLicense.name,
            subjName,
            'Ôn tập',
            correctCount,
            currentQuiz.questions.length,
            0
          );
        }
        navigate('/ontap/ket-qua');
      }
    }
  };

  const handleRetry = () => {
    if (location.pathname === '/ontap/ket-qua-thi') {
      startOnlineExam();
    } else {
      if (selectedSubject && selectedLicense) {
        handleSubjectSelect(selectedSubject);
      }
    }
  };

  const handleTopNavNavigate = (screen: string) => {
    switch (screen) {
      case 'dashboard': navigate('/ontap/dashboard'); break;
      case 'history': navigate('/ontap/lich-su'); break;
      case 'login': navigate('/ontap/dang-nhap'); break;
      case 'my_class': navigate('/ontap/lop-cua-toi'); break;
      case 'class_management': navigate('/ontap/quan-ly-lop'); break;
      case 'account': navigate(userProfile ? '/ontap/taikhoan' : '/ontap/dang-nhap'); break;
      case 'config': navigate('/ontap/cauhinh'); break;
      case 'notification_mgmt': navigate('/ontap/thongbao'); break;
      case 'online_exam_management': navigate('/ontap/quanlythi'); break;
      case 'mailbox': navigate('/ontap/hom-thu'); break;
      case 'thi_truc_tuyen': navigate('/ontap/thitructuyen'); break;
      case 'download_app': navigate('/ontap/download'); break;
      case 'analytics': navigate('/ontap/thong-ke'); break;
      default: navigate('/ontap/dashboard');
    }
  };

  const handleLogout = async () => {
    import('./services/sessionService').then(({ clearSession }) => clearSession());
    await auth.signOut();
    navigate('/');
  };

  // --- STRICT WINDOWS APP LOGIC ---
  // @ts-ignore
  const isElectron = window.electron?.isElectron || window.location.protocol === 'file:' || navigator.userAgent.toLowerCase().includes('electron');

  if (isElectron && !userProfile) {
    return (
      <div className={`min-h-screen bg-background text-foreground font-sans ${isMobileApp ? 'pb-16' : 'pt-0'}`}>
        <Toaster position="top-right" richColors expand={true} />
        <WindowsLoginScreen />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans transition-colors duration-300 ${isMobileApp ? 'pb-16' : 'pt-16'}`}>
      <SweetAlertPopup />
      <Toaster position="top-right" richColors expand={true} />

      {resumeSessionAvailable && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full shadow-xl z-50 animate-bounce cursor-pointer hover:bg-yellow-500 font-bold flex items-center gap-2"
          onClick={resumeSession}>
          <span>⚠️ Bạn đang có bài thi làm dở!</span>
          <span className="underline">Làm tiếp ngay</span>
        </div>
      )}

      <AdSenseLoader userProfile={userProfile} />

      {!isMobileApp && (
        <>
          <TopNavbar
            userProfile={userProfile}
            onNavigate={handleTopNavNavigate}
            onLogout={handleLogout}
          />
          <AlertMarquee />
        </>
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/ontap/dashboard" replace />} />
          <Route path="/ontap" element={<Navigate to="/ontap/dashboard" replace />} />

          <Route path="/ontap/dashboard" element={
            userProfile ? (
              <Dashboard
                userProfile={userProfile}
                onStart={() => navigate('/ontap/chon-bang')}
                onHistoryClick={() => navigate('/ontap/lich-su')}
                onClassClick={() => handleTopNavNavigate((userProfile?.role === 'hoc_vien') ? 'my_class' : 'class_management')}
                onOnlineExamClick={() => navigate('/ontap/quanlythi')}
              />
            ) : (
              <WelcomeModal onStart={handleStart} onLoginClick={() => navigate('/ontap/dang-nhap')} onRegisterClick={() => navigate('/ontap/dang-ky')} />
            )
          } />

          <Route path="/ontap/dang-nhap" element={!userProfile ? <LoginScreen onBack={() => navigate('/')} /> : <Navigate to="/ontap/dashboard" />} />
          <Route path="/ontap/windows-login" element={!userProfile ? <WindowsLoginScreen /> : <Navigate to="/ontap/dashboard" />} />
          <Route path="/ontap/dang-ky" element={<RegisterScreen onBack={() => navigate('/')} onSuccess={() => navigate('/ontap/dashboard')} />} />

          <Route path="/ontap/chon-bang" element={<LicenseSelectionScreen licenses={licenses} onSelect={handleLicenseSelect} onBack={() => navigate('/')} />} />
          <Route path="/ontap/nhap-ten" element={<NameInputScreen onNameSubmit={handleNameSubmit} onBack={() => navigate('/ontap/chon-bang')} />} />

          <Route path="/ontap/chon-che-do" element={
            <ModeSelectionScreen
              onModeSelect={handleModeSelect}
              licenseName={selectedLicense?.name || ''}
              userName={userName}
              onSwitchLicense={() => navigate('/ontap/chon-bang')}
            />
          } />

          <Route path="/ontap/chon-mon" element={
            <SubjectSelectionScreen
              subjects={subjects}
              progress={{}}
              onSelect={handleSubjectSelect}
              onBack={() => navigate('/ontap/chon-che-do')}
            />
          } />

          <Route path="/ontap/lam-bai" element={
            currentQuiz ? (
              <QuizScreen
                quiz={currentQuiz}
                onFinish={handleQuizFinish}
                onBack={() => navigate('/ontap/chon-mon')}
                initialAnswers={userAnswers}
                initialIndex={0}
                onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'practice')}
              />
            ) : <Navigate to="/ontap/chon-mon" replace />
          } />

          <Route path="/ontap/thithu" element={
            currentQuiz ? (
              <ExamQuizScreen2
                quiz={currentQuiz}
                onFinish={handleQuizFinish}
                onBack={() => navigate('/ontap/chon-che-do')}
                userName={userName}
                userProfile={userProfile}
                selectedLicense={selectedLicense}
                initialAnswers={userAnswers}
                onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'online_exam')}
              />
            ) : <Navigate to="/ontap/chon-che-do" replace />
          } />

          <Route path="/ontap/ket-qua" element={
            currentQuiz ? (
              <ResultsScreen
                quiz={currentQuiz}
                userAnswers={userAnswers}
                score={score}
                onRetry={handleRetry}
                onBack={() => navigate('/ontap/chon-mon')}
                userName={userName}
              />
            ) : <Navigate to="/ontap/chon-mon" replace />
          } />

          <Route path="/ontap/ket-qua-thi" element={
            currentQuiz ? (
              <ExamResultsScreen
                quiz={currentQuiz}
                userAnswers={userAnswers}
                score={score}
                onRetry={handleRetry}
                onBack={() => navigate('/ontap/chon-che-do')}
                userName={userName}
              />
            ) : <Navigate to="/ontap/chon-che-do" replace />
          } />

          <Route path="/ontap/lich-su" element={<HistoryScreen userProfile={userProfile!} onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/lop-cua-toi" element={<MyClassScreen userProfile={userProfile!} onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/quan-ly-lop" element={<ClassManagementScreen userProfile={userProfile!} onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/taikhoan" element={<AccountScreen userProfile={userProfile!} onBack={() => navigate('/ontap/dashboard')} onNavigate={handleTopNavNavigate} />} />
          <Route path="/ontap/cauhinh" element={userProfile ? <UsageConfigPanel /> : <Navigate to="/ontap/dang-nhap" />} />
          <Route path="/ontap/thongbao" element={userProfile ? <NotificationMgmtScreen userProfile={userProfile} /> : <Navigate to="/ontap/dang-nhap" />} />
          <Route path="/ontap/hom-thu" element={userProfile ? <MailboxScreen userProfile={userProfile} onBack={() => navigate('/ontap/dashboard')} /> : <Navigate to="/ontap/dang-nhap" />} />
          <Route path="/ontap/quanlythi" element={userProfile ? <OnlineExamManagementScreen userProfile={userProfile} onBack={() => navigate('/ontap/dashboard')} /> : <Navigate to="/ontap/dang-nhap" />} />
          <Route path="/ontap/thitructuyen" element={<ThiTrucTuyenPage />} />
          <Route path="/ontap/download" element={<DownloadAppPage />} />
          <Route path="/ontap/thong-ke" element={<AnalyticsPage onBack={() => navigate('/ontap/dashboard')} />} />

          {isMobileApp && (
            <MobileBottomNav
              userProfile={userProfile}
              currentScreen={location.pathname}
              onNavigate={handleTopNavNavigate}
              onLogout={handleLogout}
            />
          )}
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SnowEffect />
      <AppContent />
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        {/* @ts-ignore */}
        {window.electron?.isElectron || navigator.userAgent.toLowerCase().includes('electron') ? (
          <button
            onClick={() => {
              try {
                // @ts-ignore
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('toggle-devtools');
              } catch (e) {
                console.error("DevTools toggle failed", e);
              }
            }}
            className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
            title="Bật/Tắt DevTools"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          </button>
        ) : null}
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
};

export default App;

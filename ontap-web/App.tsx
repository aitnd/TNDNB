import React, { useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import ThemeSwitcher from './components/ThemeSwitcher';
import SnowEffect from './components/SnowEffect';
import SweetAlertPopup from './components/SweetAlertPopup';
import TopNavbar from './components/TopNavbar';
import AlertMarquee from './components/AlertMarquee';
import { useAppStore } from './stores/useAppStore'; 
import { useAppInitialization } from './hooks/useAppInitialization';
import { AppRoutes } from './routes/AppRoutes';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkUsage, incrementUsage, showLimitAlert } from './services/usageService';
import { Quiz, License, Subject, UserAnswers } from './types';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLocked,
    isBiometricChecking,
    handleBiometricUnlock,
    usageConfig,
    handleLogout
  } = useAppInitialization();

  const licenses = useAppStore(state => state.licenses);
  const selectedLicense = useAppStore(state => state.selectedLicense);
  const setSelectedLicense = useAppStore(state => state.setSelectedLicense);
  const setSubjects = useAppStore(state => state.setSubjects);
  const selectedSubject = useAppStore(state => state.selectedSubject);
  const setSelectedSubject = useAppStore(state => state.setSelectedSubject);
  const currentQuiz = useAppStore(state => state.currentQuiz);
  const setCurrentQuiz = useAppStore(state => state.setCurrentQuiz);
  const setUserAnswers = useAppStore(state => state.setUserAnswers);
  const setScore = useAppStore(state => state.setScore);
  const setUserName = useAppStore(state => state.setUserName);
  const userProfile = useAppStore(state => state.userProfile);
  const resumeSessionAvailable = useAppStore(state => state.resumeSessionAvailable);
  const isMobileApp = useAppStore(state => state.isMobileApp);

  const persistSession = useCallback((
    idx: number,
    time: number,
    answers: UserAnswers,
    quiz: Quiz | null,
    mode: 'practice' | 'online_exam'
  ) => {
    if (!quiz) return;
    const sessionUserId = userProfile?.id || 'guest';
    import('./services/sessionService').then(({ saveSession }) => {
      saveSession(sessionUserId, quiz, mode, answers, idx, time, selectedLicense, selectedSubject);
    });
  }, [selectedLicense, selectedSubject, userProfile]);

  const resumeSession = () => {
    import('./services/sessionService').then(({ loadSession }) => {
      const sessionUserId = userProfile?.id || 'guest';
      const session = loadSession(sessionUserId);
      if (session) {
        setCurrentQuiz(session.quiz);
        setUserAnswers(session.userAnswers);
        setSelectedLicense(session.selectedLicense);
        setSelectedSubject(session.selectedSubject);

        if (session.mode === 'online_exam') {
          navigate('/ontap/thithu');
        } else {
          navigate('/ontap/lambai');
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
          navigate('/ontap/chonchedo');
          return;
        }
      }
      navigate('/ontap/chonbang');
    } else {
      navigate('/ontap/chonbang');
    }
  };

  const handleLicenseSelect = async (license: License) => {
    setSelectedLicense(license);
    import('./services/sessionService').then(({ saveLicensePreference }) => {
      saveLicensePreference(license.id);
    });

    if (userProfile) {
      navigate('/ontap/chonchedo');
    } else {
      navigate('/ontap/nhapten');
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem('ontap_guest_name', name);
    navigate('/ontap/chonchedo');
  };

  const startOnlineExam = async () => {
    if (!selectedLicense) return;
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => navigate('/ontap/login'));
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
        navigate('/ontap/chonmon');
      }
    } else if (mode === 'online_exam') {
      startOnlineExam();
    }
  };

  const startGiamkhaoOnlineExam = async () => {
    if (!selectedLicense) return;
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => navigate('/ontap/login'));
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
    navigate('/ontap/giamkhao/thithu');
  };

  const handleGiamkhaoModeSelect = async (mode: 'practice' | 'exam' | 'online_exam') => {
    if (mode === 'practice') {
      if (selectedLicense) {
        setSubjects(selectedLicense.subjects);
        navigate('/ontap/giamkhao/chonmon');
      }
    } else if (mode === 'online_exam') {
      startGiamkhaoOnlineExam();
    }
  };

  const handleSubjectSelect = async (subject: Subject) => {
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => navigate('/ontap/login'));
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
    navigate('/ontap/lambai');
  };

  const handleQuizFinish = (answers: UserAnswers) => {
    if (currentQuiz) {
      import('./services/sessionService').then(({ clearSession }) => clearSession());
      useAppStore.getState().setResumeSessionAvailable(false);

      let correctCount = 0;
      currentQuiz.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswerId) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setUserAnswers(answers);

      const isGK = location.pathname.startsWith('/ontap/giamkhao');
      
      Promise.all([
        import('./services/usageService'),
        import('./services/userService')
      ]).then(([{ getUserRoleConfig }, { saveExamResult }]) => {
        const { param } = getUserRoleConfig(usageConfig!, userProfile);
        const showMonetag = param?.showMonetag || false;
        const maxCountdown = showMonetag ? (usageConfig?.monetagCountdownMaxPerSession ?? 0) : 0;
        const currentCountdownCount = parseInt(sessionStorage.getItem('MONETAG_COUNTDOWN_COUNT') || '0', 10);
        const showCountdownAd = maxCountdown > 0 && currentCountdownCount < maxCountdown;

        if (location.pathname === '/ontap/thithu' || location.pathname === '/ontap/giamkhao/thithu') {
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
          
          if (userProfile?.id) {
            import('./services/badgeService').then(({ BadgeService }) => {
              BadgeService.increaseMockTestProgress(userProfile.id, correctCount, 30).catch(console.error);
            });
          }

          navigate(isGK ? '/ontap/giamkhao/ketquathi' : '/ontap/ketquathi');
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
          const targetPath = isGK ? '/ontap/giamkhao/ketqua' : '/ontap/ketqua';
          
          if (userProfile?.id) {
            import('./services/badgeService').then(({ BadgeService }) => {
              BadgeService.increasePracticeProgress(userProfile.id, currentQuiz.questions.length).catch(console.error);
            });
          }

          if (showCountdownAd && !(window as any).electron) {
            sessionStorage.setItem('MONETAG_COUNTDOWN_COUNT', (currentCountdownCount + 1).toString());
            navigate('/ontap/ad-loading', {
              state: {
                redirectPath: targetPath,
                seconds: 5,
                message: 'Đang tải kết quả ôn tập...',
              }
            });
          } else {
            navigate(targetPath);
          }
        }
      });
    }
  };

  const handleRetry = () => {
    if (location.pathname === '/ontap/ketquathi') {
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
      case 'history': navigate('/ontap/history'); break;
      case 'login': navigate('/ontap/login'); break;
      case 'my_class': navigate('/ontap/my-class'); break;
      case 'class_management': navigate('/ontap/class-manager'); break;
      case 'account': navigate(userProfile ? '/ontap/profile' : '/ontap/login'); break;
      case 'config': navigate('/ontap/settings'); break;
      case 'notification_mgmt': navigate('/ontap/notifications'); break;
      case 'online_exam_management': navigate('/ontap/exam-manager'); break;
      case 'mailbox': navigate('/ontap/mailbox'); break;
      case 'thi_truc_tuyen': navigate('/ontap/online-exam'); break;
      case 'download_app': navigate('/ontap/download'); break;
      case 'analytics': navigate('/ontap/analytics'); break;
      case 'login_history': navigate('/ontap/login-history'); break;
      case 'giaitri': navigate('/ontap/games'); break;
      case 'changelog': navigate('/ontap/changelog'); break;
      case 'giam_khao': navigate('/ontap/giamkhao'); break;
      default: navigate('/ontap/dashboard');
    }
  };

  const isElectron = !!(window as any).electron?.isElectron || window.location.protocol === 'file:' || navigator.userAgent.toLowerCase().includes('electron');

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 text-white p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a13.916 13.916 0 00-6-11.571M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 2.04l-.054.09A13.916 13.916 0 0015 11c0 4.28 1.954 8.1 5.014 10.606M12 11a14 14 0 01-6 2m6-2a14 14 0 006 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Bảo mật ứng dụng</h1>
          <p className="text-slate-400 mb-12 max-w-xs leading-relaxed font-medium">
            Vui lòng xác thực vân tay hoặc khuôn mặt để tiếp tục sử dụng ứng dụng.
          </p>
          <button 
            onClick={handleBiometricUnlock}
            disabled={isBiometricChecking}
            className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isBiometricChecking ? 'Đang xác thực...' : 'Chạm để mở khóa'}
          </button>
        </div>
      </div>
    );
  }

  // --- Strict Windows App Login screen ---
  if (isElectron && !userProfile) {
    const WindowsLoginScreen = require('./components/WindowsLoginScreen').default;
    return (
      <div className={`min-h-screen bg-slate-900 text-white font-sans ${isMobileApp ? 'pb-16' : 'pt-0'}`}>
        <Toaster position="top-right" richColors expand closeButton />
        <WindowsLoginScreen />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${isMobileApp ? 'pb-32' : 'pt-16'}`}>
      <SweetAlertPopup />
      <Toaster position="top-right" richColors expand closeButton />

      {resumeSessionAvailable && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full shadow-xl z-50 animate-bounce cursor-pointer hover:bg-yellow-500 font-bold flex items-center gap-2"
          onClick={resumeSession}>
          <span>⚠️ Bạn đang có bài thi làm dở!</span>
          <span className="underline">Làm tiếp ngay</span>
        </div>
      )}
      
      {!isMobileApp && (
        <>
          <TopNavbar
            userProfile={userProfile}
            onNavigate={handleTopNavNavigate}
            onLogout={handleLogout}
          />
          <AlertMarquee />
          <div className="pt-16" />
        </>
      )}

      <AppRoutes
        usageConfig={usageConfig}
        handleStart={handleStart}
        handleLicenseSelect={handleLicenseSelect}
        handleNameSubmit={handleNameSubmit}
        handleModeSelect={handleModeSelect}
        handleGiamkhaoModeSelect={handleGiamkhaoModeSelect}
        handleSubjectSelect={handleSubjectSelect}
        handleQuizFinish={handleQuizFinish}
        handleRetry={handleRetry}
        persistSession={persistSession}
        handleTopNavNavigate={handleTopNavNavigate}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SnowEffect />
      <AppContent />
      <Analytics />
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
};

export default App;

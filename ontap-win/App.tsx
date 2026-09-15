import React, { useCallback, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import SnowEffect from './components/SnowEffect';
import { useAppStore } from './stores/useAppStore';
import { useAppInitialization } from './hooks/useAppInitialization';
import { AppRoutes } from './routes/AppRoutes';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkUsage, incrementUsage, showLimitAlert, getUserRoleConfig } from './services/usageService';
import { saveExamResult } from './services/userService';
import { BadgeService } from './services/badgeService';
import { License, Subject, Quiz, UserAnswers } from './types';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
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
  const setResumeSessionAvailable = useAppStore(state => state.setResumeSessionAvailable);

  const persistSession = useCallback((
    idx: number,
    time: number,
    answers: UserAnswers,
    quiz: Quiz | null,
    mode: 'practice' | 'online_exam'
  ) => {
    if (!quiz) return;
    // Dùng "guest" làm userId cho khách chưa đăng nhập
    const sessionUserId = userProfile?.id || 'guest';
    import('./services/sessionService').then(({ saveSession }) => {
      saveSession(sessionUserId, quiz, mode, answers, idx, time, selectedLicense, selectedSubject);
    });
  }, [selectedLicense, selectedSubject, userProfile]);

  useEffect(() => {
    if (location.pathname === '/ontap/lambai' || location.pathname === '/ontap/thithu') {
      setResumeSessionAvailable(false);
      return;
    }

    // Hỗ trợ cả khách (guest) và user đã đăng nhập
    const sessionUserId = userProfile?.id || 'guest';
    import('./services/sessionService').then(({ loadSession }) => {
      const session = loadSession(sessionUserId);
      if (session) {
        setResumeSessionAvailable(true);
      } else {
        setResumeSessionAvailable(false);
      }
    });
  }, [location.pathname, userProfile]);

  const resumeSession = () => {
    import('./services/sessionService').then(({ loadSession }) => {
      // Hỗ trợ cả khách (guest) và user đã đăng nhập
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
    // Lưu tên khách vào localStorage để persist
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
      setResumeSessionAvailable(false);

      let correctCount = 0;
      currentQuiz.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswerId) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setUserAnswers(answers);

      const { param } = getUserRoleConfig(usageConfig!, userProfile);
      const showMonetag = param?.showMonetag || false;
      const maxCountdown = showMonetag ? (usageConfig?.monetagCountdownMaxPerSession ?? 0) : 0;
      const currentCountdownCount = parseInt(sessionStorage.getItem('MONETAG_COUNTDOWN_COUNT') || '0', 10);
      const showCountdownAd = maxCountdown > 0 && currentCountdownCount < maxCountdown;

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
        
        // 🏅 Tăng tiến trình thi thử sau khi nộp bài
        if (userProfile?.id) {
          BadgeService.increaseMockTestProgress(userProfile.id, correctCount, 30).catch(console.error);
        }

        navigate('/ontap/ketquathi');
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
        
        // 🏅 Tăng tiến trình huy hiệu sau khi nộp bài
        if (userProfile?.id) {
          BadgeService.increasePracticeProgress(userProfile.id, currentQuiz.questions.length).catch(console.error);
        }

        const targetPath = '/ontap/ketqua';
        // ⏱️ Redirect qua trang đếm ngược nếu config bật (không áp dụng trên Electron)
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
      case 'usermanager': navigate('/ontap/usermanager'); break;
      case 'changelog': navigate('/ontap/changelog'); break;
      default: navigate('/ontap/dashboard');
    }
  };

  return (
    <AppRoutes
      usageConfig={usageConfig}
      handleStart={handleStart}
      handleLicenseSelect={handleLicenseSelect}
      handleNameSubmit={handleNameSubmit}
      handleModeSelect={handleModeSelect}
      handleSubjectSelect={handleSubjectSelect}
      handleQuizFinish={handleQuizFinish}
      handleRetry={handleRetry}
      persistSession={persistSession}
      handleTopNavNavigate={handleTopNavNavigate}
      handleLogout={handleLogout}
      resumeSession={resumeSession}
    />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SnowEffect />
      <AppContent />
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        {/* @ts-ignore */}
        {/* 
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
        */}
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
};

export default App;

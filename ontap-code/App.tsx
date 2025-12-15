import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import SnowEffect from './components/SnowEffect';
import MarqueeNotifier from './components/MarqueeNotifier';
import SweetAlertPopup from './components/SweetAlertPopup';
import NotificationMgmtScreen from './components/NotificationMgmtScreen';
import { auth, db } from './services/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import WelcomeModal from './components/WelcomeModal';
import LoginScreen from './components/LoginScreen';
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
import AdSenseLoader from './components/AdSenseLoader';
import MobileBottomNav from './components/MobileBottomNav';
import { License, Subject, Quiz, UserAnswers, UserProfile } from './types';
import { fetchLicenses } from './services/dataService';
import { saveExamResult, getUserProfile } from './services/userService';
import { checkUsage, incrementUsage, showLimitAlert } from './services/usageService';
import { Capacitor } from '@capacitor/core';

const AppState = {
  WELCOME: 'welcome',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  LICENSE_SELECTION: 'license_selection',
  NAME_INPUT: 'name_input',
  MODE_SELECTION: 'mode_selection',
  SUBJECT_SELECTION: 'subject_selection',
  IN_QUIZ: 'in_quiz',
  IN_ONLINE_EXAM: 'in_online_exam',
  RESULT: 'results',
  EXAM_RESULT: 'exam_result',
  HISTORY: 'history',
  MY_CLASS: 'my_class',
  CLASS_MANAGEMENT: 'class_management',
  REGISTER: 'register',
  ACCOUNT: 'account',
  NOTIFICATION_MGMT: 'notification_mgmt'
} as const;

type AppStateType = typeof AppState[keyof typeof AppState];

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppStateType>(AppState.WELCOME);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resumeSessionAvailable, setResumeSessionAvailable] = useState<boolean>(false);
  const [isMobileApp, setIsMobileApp] = useState<boolean>(false);

  useEffect(() => {
    // Check for native platform OR test mode via URL (?mode=app)
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('mode') === 'app';
    const isNative = Capacitor.isNativePlatform();

    console.log("DEBUG: Checking Platform Mode");
    console.log("- URL Search:", window.location.search);
    console.log("- isTestMode:", isTestMode);
    console.log("- isNative:", isNative);

    if (isNative || isTestMode) {
      console.log("SETTING MOBILE APP MODE: TRUE");
      setIsMobileApp(true);
    } else {
      console.log("SETTING MOBILE APP MODE: FALSE");
      setIsMobileApp(false);
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
        // 1. Authenticated
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        setUserName(profile?.full_name || firebaseUser.displayName || '');

        // Initialize FCM if Native
        import('./services/fcmClient').then(({ initializeFCM }) => {
          initializeFCM(firebaseUser.uid);
        });

        // 2. CHECK FOR ACTIVE SESSION (Priority 1)
        import('./services/sessionService').then(({ loadSession, getLicensePreference }) => {
          const session = loadSession(firebaseUser.uid);
          if (session) {
            console.log("Restoring session...", session);
            setCurrentQuiz(session.quiz);
            setUserAnswers(session.userAnswers);
            setSelectedLicense(session.selectedLicense);
            setSelectedSubject(session.selectedSubject);

            if (session.mode === 'online_exam') {
              setAppState(AppState.IN_ONLINE_EXAM);
            } else {
              setAppState(AppState.IN_QUIZ);
            }
            return; // Stop here if session restored
          }

          // 3. CHECK FOR DEFAULT LICENSE FROM CLASS (Priority 2)
          const checkLicenseLogic = async () => {
            // A. Check Default License ID in Profile
            if (profile?.defaultLicenseId) {
              const fastFound = licenses.find(l => l.id === profile.defaultLicenseId);
              if (fastFound) {
                setSelectedLicense(fastFound);
                setAppState(AppState.MODE_SELECTION);
                return;
              }
            }

            // B. Fallback: Check Course ID (Self-Heal)
            if (profile?.courseId) {
              try {
                const courseRef = doc(db, 'courses', profile.courseId);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                  const cData = courseSnap.data();
                  if (cData.licenseId) {
                    const fallbackFound = licenses.find(l => l.id === cData.licenseId);
                    if (fallbackFound) {
                      setSelectedLicense(fallbackFound);
                      setAppState(AppState.MODE_SELECTION);

                      import('firebase/firestore').then(({ updateDoc }) => {
                        updateDoc(doc(db, 'users', firebaseUser.uid), {
                          defaultLicenseId: cData.licenseId
                        }).catch(e => console.error("Self-heal error:", e));
                      });
                      return;
                    }
                  }
                }
              } catch (e) { console.error("Error in auth fallback:", e); }
            }

            // C. Check Personal Preference
            const savedLicenseId = getLicensePreference();
            if (savedLicenseId) {
              const foundLicense = licenses.find(l => l.id === savedLicenseId);
              if (foundLicense) {
                setSelectedLicense(foundLicense);
                setAppState(AppState.DASHBOARD);
              } else {
                setAppState(AppState.DASHBOARD);
              }
            } else {
              setAppState(AppState.DASHBOARD);
            }
          };

          checkLicenseLogic();
        });

      } else {
        // Signed out
        setUserProfile(null);
        setUserName('');
        setAppState(AppState.WELCOME);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [licenses]);

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
    if (appState === AppState.IN_QUIZ || appState === AppState.IN_ONLINE_EXAM) {
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
  }, [appState, userProfile]);

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
          setAppState(AppState.IN_ONLINE_EXAM);
        } else {
          setAppState(AppState.IN_QUIZ);
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
          setAppState(AppState.MODE_SELECTION);
          return;
        }
      } else if (userProfile.courseId) {
        try {
          const courseRef = doc(db, 'courses', userProfile.courseId);
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            const cData = courseSnap.data();
            if (cData.licenseId) {
              const found = licenses.find(l => l.id === cData.licenseId);
              if (found) {
                setSelectedLicense(found);
                setAppState(AppState.MODE_SELECTION);
                import('firebase/firestore').then(({ updateDoc }) => {
                  updateDoc(doc(db, 'users', userProfile.id), {
                    defaultLicenseId: cData.licenseId
                  }).catch(err => console.error("Self-heal failed:", err));
                });
                return;
              }
            }
          }
        } catch (e) { console.error("Error in license fallback:", e); }
      }

      import('./services/sessionService').then(({ getLicensePreference }) => {
        const saved = getLicensePreference();
        if (saved && licenses.find(l => l.id === saved)) {
          setSelectedLicense(licenses.find(l => l.id === saved)!);
          setAppState(AppState.DASHBOARD);
        } else {
          setAppState(AppState.LICENSE_SELECTION);
        }
      });
    } else {
      setAppState(AppState.LICENSE_SELECTION);
    }
  };

  const handleLoginClick = () => {
    setAppState(AppState.LOGIN);
  };

  const handleRegisterClick = () => {
    setAppState(AppState.REGISTER);
  };

  const handleLicenseSelect = async (license: License) => {
    setSelectedLicense(license);
    import('./services/sessionService').then(({ saveLicensePreference }) => {
      saveLicensePreference(license.id);
    });

    if (userProfile) {
      setAppState(AppState.MODE_SELECTION);
    } else {
      setAppState(AppState.NAME_INPUT);
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setAppState(AppState.MODE_SELECTION);
  };

  const startOnlineExam = async () => {
    if (!selectedLicense) return;
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => setAppState(AppState.LOGIN));
      return;
    }
    await incrementUsage(userProfile);

    const allQuestions: any[] = [];
    selectedLicense.subjects.forEach(subj => {
      allQuestions.push(...subj.questions);
    });
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 30);

    const examQuiz: Quiz = {
      id: `exam_${Date.now()}`,
      title: `Thi Thử - ${selectedLicense.name}`,
      questions: selected,
      timeLimit: 2700
    };

    setCurrentQuiz(examQuiz);
    setUserAnswers({});
    setScore(0);
    // Clear any previous session to ensure fresh start (especially timer)
    localStorage.removeItem('ontap_quiz_session');
    setAppState(AppState.IN_ONLINE_EXAM);
  };

  const handleModeSelect = async (mode: 'practice' | 'exam' | 'online_exam') => {
    if (mode === 'practice') {
      if (selectedLicense) {
        setSubjects(selectedLicense.subjects);
        setAppState(AppState.SUBJECT_SELECTION);
      }
    } else if (mode === 'online_exam') {
      startOnlineExam();
    }
  };

  const handleSubjectSelect = async (subject: Subject) => {
    const allowed = await checkUsage(userProfile);
    if (allowed !== 'ALLOWED') {
      await showLimitAlert(userProfile, () => setAppState(AppState.LOGIN));
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
    setAppState(AppState.IN_QUIZ);
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

      if (appState === AppState.IN_ONLINE_EXAM) {
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
        setAppState(AppState.EXAM_RESULT);
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
        setAppState(AppState.RESULT);
      }
    }
  };

  const handleRetry = () => {
    if (appState === AppState.EXAM_RESULT) {
      startOnlineExam();
    } else {
      if (selectedSubject && selectedLicense) {
        handleSubjectSelect(selectedSubject);
      }
    }
  };

  const handleTopNavNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      if (userProfile) {
        setAppState(AppState.DASHBOARD);
      } else {
        setAppState(AppState.WELCOME);
      }
    } else if (screen === 'history') {
      setAppState(AppState.HISTORY);
    } else if (screen === 'login') {
      setAppState(AppState.LOGIN);
    } else if (screen === 'my_class') {
      setAppState(AppState.MY_CLASS);
    } else if (screen === 'class_management') {
      setAppState(AppState.CLASS_MANAGEMENT);
    } else if (screen === 'account') {
      if (userProfile) {
        setAppState(AppState.ACCOUNT);
      } else {
        setAppState(AppState.LOGIN);
      }
    } else if (screen === 'notification_mgmt') {
      setAppState(AppState.NOTIFICATION_MGMT);
    }
  };

  const handleLogout = async () => {
    import('./services/sessionService').then(({ clearSession }) => clearSession());
    await auth.signOut();
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeModal onStart={handleStart} onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />;
      case AppState.LOGIN:
        return <LoginScreen onBack={() => setAppState(AppState.WELCOME)} />;
      case AppState.REGISTER:
        return <RegisterScreen onBack={() => setAppState(AppState.WELCOME)} onSuccess={() => setAppState(AppState.DASHBOARD)} />;
      case AppState.LICENSE_SELECTION:
        return <LicenseSelectionScreen licenses={licenses} onSelect={handleLicenseSelect} onBack={() => setAppState(AppState.WELCOME)} />;
      case AppState.NAME_INPUT:
        return <NameInputScreen onNameSubmit={handleNameSubmit} onBack={() => setAppState(AppState.LICENSE_SELECTION)} />;
      case AppState.MODE_SELECTION:
        return (
          <ModeSelectionScreen
            onModeSelect={handleModeSelect}
            licenseName={selectedLicense?.name || ''}
            userName={userName}
            onSwitchLicense={() => setAppState(AppState.LICENSE_SELECTION)}
          />
        );
      case AppState.SUBJECT_SELECTION:
        return (
          <SubjectSelectionScreen
            subjects={subjects}
            progress={{}}
            onSelect={handleSubjectSelect}
            onBack={() => setAppState(AppState.MODE_SELECTION)}
          />
        );
      case AppState.IN_QUIZ:
        return currentQuiz ? (
          <QuizScreen
            quiz={currentQuiz}
            onFinish={handleQuizFinish}
            onBack={() => setAppState(AppState.SUBJECT_SELECTION)}
            initialAnswers={userAnswers}
            initialIndex={(() => {
              try {
                const s = localStorage.getItem('ontap_quiz_session');
                return s ? JSON.parse(s).currentQuestionIndex : 0;
              } catch (e) { return 0; }
            })()}
            onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'practice')}
          />
        ) : null;
      case AppState.IN_ONLINE_EXAM:
        if (currentQuiz) {
          return (
            <ExamQuizScreen2
              quiz={currentQuiz}
              onFinish={handleQuizFinish}
              onBack={() => setAppState(AppState.MODE_SELECTION)}
              userName={userName}
              selectedLicense={selectedLicense}
              initialAnswers={userAnswers}
              initialIndex={(() => {
                try {
                  const s = localStorage.getItem('ontap_quiz_session');
                  return s ? JSON.parse(s).currentQuestionIndex : 0;
                } catch (e) { return 0; }
              })()}
              initialTime={(() => {
                try {
                  const s = localStorage.getItem('ontap_quiz_session');
                  return s ? JSON.parse(s).timeLeft : undefined;
                } catch (e) { return undefined; }
              })()}
              onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'online_exam')}
            />
          );
        }
        return null;
      case AppState.RESULT:
        return currentQuiz ? (
          <ResultsScreen
            quiz={currentQuiz}
            userAnswers={userAnswers}
            score={score}
            onRetry={handleRetry}
            onBack={() => setAppState(AppState.SUBJECT_SELECTION)}
            userName={userName}
          />
        ) : null;
      case AppState.EXAM_RESULT:
        return currentQuiz ? (
          <ExamResultsScreen
            quiz={currentQuiz}
            userAnswers={userAnswers}
            score={score}
            onRetry={handleRetry}
            onBack={() => setAppState(AppState.MODE_SELECTION)}
            userName={userName}
          />
        ) : null;
      case AppState.DASHBOARD:
        return (
          <Dashboard
            userProfile={userProfile!}
            onStart={() => setAppState(AppState.LICENSE_SELECTION)}
            onHistoryClick={() => setAppState(AppState.HISTORY)}
            onClassClick={() => handleTopNavNavigate((userProfile!.role === 'hoc_vien') ? 'my_class' : 'class_management')}
          />
        );
      case AppState.HISTORY:
        return <HistoryScreen userProfile={userProfile!} onBack={() => setAppState(AppState.DASHBOARD)} />;
      case AppState.MY_CLASS:
        return <MyClassScreen userProfile={userProfile!} onBack={() => setAppState(AppState.DASHBOARD)} />;
      case AppState.CLASS_MANAGEMENT:
        return <ClassManagementScreen userProfile={userProfile!} onBack={() => setAppState(AppState.DASHBOARD)} />;
      case AppState.ACCOUNT:
        return <AccountScreen userProfile={userProfile!} onBack={() => setAppState(AppState.DASHBOARD)} />;
      case AppState.NOTIFICATION_MGMT:
        return userProfile ? <NotificationMgmtScreen userProfile={userProfile} /> : null;
      default:
        return <WelcomeModal onStart={handleStart} onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300 pt-16">
      <MarqueeNotifier />
      <SweetAlertPopup />

      {resumeSessionAvailable && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full shadow-xl z-50 animate-bounce cursor-pointer hover:bg-yellow-500 font-bold flex items-center gap-2"
          onClick={resumeSession}>
          <span>⚠️ Bạn đang có bài thi làm dở!</span>
          <span className="underline">Làm tiếp ngay</span>
        </div>
      )}

      <AdSenseLoader userProfile={userProfile} />

      {/* Hide TopNavbar on Native App */}
      {!isMobileApp && (
        <TopNavbar
          userProfile={userProfile}
          onNavigate={handleTopNavNavigate}
          onLogout={handleLogout}
        />
      )}

      {renderContent()}

      {/* Show MobileBottomNav on Native App */}
      {isMobileApp && (
        <MobileBottomNav
          userProfile={userProfile}
          currentScreen={appState}
          onNavigate={handleTopNavNavigate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SnowEffect />
      <AppContent />
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
};

export default App;

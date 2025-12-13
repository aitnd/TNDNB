import React, { useState, useCallback, useEffect } from 'react';
import type { AppState, Quiz, UserAnswers, License, Subject, UserProgressData, Question, UserProfile } from './types';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabaseClient';

import WelcomeModal from './components/WelcomeModal';
import LicenseSelectionScreen from './components/LicenseSelectionScreen';
import NameInputScreen from './components/NameInputScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import ExamQuizScreen from './components/ExamQuizScreen';
import ExamResultsScreen from './components/ExamResultsScreen';
import OnlineExamScreen from './components/OnlineExamScreen';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ChangelogModal from './components/ChangelogModal';
import SnowEffect from './components/SnowEffect';
import MusicPlayer from './components/MusicPlayer'; // Import MusicPlayer

import { fetchLicenses } from './services/dataService';
import { HelmIcon3D } from './components/icons';
import { useTheme } from './contexts/ThemeContext';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const { theme } = useTheme();

  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Guest flow state
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<UserProgressData>({});
  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState(0);

  // Check user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch or create user profile if session exists.
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        // 1. Try to fetch the profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          // Profile exists, set it
          setUserProfile(data);
        } else if (error && (error.code === 'PGRST116' || error.details.includes('0 rows'))) {
          // Profile not found (PGRST116: "exact number of rows not returned")
          // 2. Create a new profile
          const userEmail = session.user.email || '';
          const newRole = userEmail.toLowerCase() === 'admin@onthihanghai.local' ? 'admin' : 'student';

          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ 
              id: session.user.id, 
              email: userEmail,
              role: newRole 
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError.message);
            setError('Không thể tạo hồ sơ người dùng mới. Vui lòng thử lại.');
            await supabase.auth.signOut();
          } else {
            setUserProfile(newProfile);
          }
        } else if (error) {
          console.error('Error fetching profile:', error.message);
          setError('Đã có lỗi xảy ra khi tải thông tin người dùng.');
          await supabase.auth.signOut();
        }
      } else {
        // No session, clear profile
        setUserProfile(null);
      }
    };

    fetchProfile();
  }, [session]);


  // Fetch licenses data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLicenses();
        setLicenses(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Không thể tải được bộ đề thi. Vui lòng kiểm tra lại kết nối mạng và làm mới trang.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Load progress from localStorage for guest flow
  useEffect(() => {
    if (!session && selectedLicense && userName) {
      const key = `progress_${userName}_${selectedLicense.id}`;
      const savedProgress = localStorage.getItem(key);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress({});
      }
    }
  }, [session, selectedLicense, userName]);

  // Save progress to localStorage for guest flow
  const saveProgress = (subjectId: string, newScore: number) => {
    if (session) return; // Don't save to localStorage if logged in
    const key = `progress_${userName}_${selectedLicense!.id}`;
    
    const newProgress = { ...userProgress };
    
    // Get existing progress or create a new one with defaults
    const subjectProgress = newProgress[subjectId] || {
      lastScore: null,
      lastScoreTimestamp: null,
      highScore: 0, // Start with 0 if no record exists
      highScoreTimestamp: null,
    };
    
    const now = Date.now();

    // Update last score info
    subjectProgress.lastScore = newScore;
    subjectProgress.lastScoreTimestamp = now;

    // Use nullish coalescing to safely handle old data (null/undefined)
    const oldHighScore = subjectProgress.highScore ?? 0;

    // Update high score if it's a new record
    if (newScore >= oldHighScore) {
      subjectProgress.highScore = newScore;
      subjectProgress.highScoreTimestamp = now;
    }
    
    // Update the main progress object with the modified subject data
    newProgress[subjectId] = subjectProgress;
    
    // Set the new state and save to localStorage
    setUserProgress(newProgress);
    localStorage.setItem(key, JSON.stringify(newProgress));
  };

  const handleStart = useCallback(() => setAppState('license_selection'), []);
  const handleShowLogin = useCallback(() => setAppState('login'), []);
  const handleLicenseSelect = useCallback((license: License) => {
    setSelectedLicense(license);
    setAppState('name_input');
  }, []);
  const handleNameSubmit = useCallback((name: string) => {
    setUserName(name);
    setAppState('mode_selection');
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAppState('welcome');
    // Reset guest state as well
    setSelectedLicense(null);
    setUserName('');
    setUserProgress({});
  };

  const startNewExam = useCallback(() => {
      if (!selectedLicense) return;
      const allQuestions = selectedLicense.subjects.flatMap(s => s.questions);
      const randomQuestions = shuffleArray(allQuestions).slice(0, 30);
      
      const examQuiz: Quiz = {
        id: 'exam-quiz',
        title: `Thi thử hạng ${selectedLicense.name}`,
        questions: randomQuestions.map((q: Question) => ({ ...q, answers: shuffleArray(q.answers) })),
        timeLimit: 45 * 60,
      };
      setCurrentQuiz(examQuiz);
      setUserAnswers({});
      setScore(0);
      setAppState('in_quiz');
  }, [selectedLicense]);

  const startOnlineExam = useCallback(() => {
    if (!selectedLicense) return;
    const allQuestions = selectedLicense.subjects.flatMap(s => s.questions);
    const randomQuestions = shuffleArray(allQuestions).slice(0, 30);
    
    const examQuiz: Quiz = {
      id: 'online-exam-quiz',
      title: `Thi Online hạng ${selectedLicense.name}`,
      questions: randomQuestions.map((q: Question) => ({ ...q, answers: shuffleArray(q.answers) })),
      timeLimit: 45 * 60, // 45 minutes
    };
    setCurrentQuiz(examQuiz);
    setUserAnswers({});
    setScore(0);
    setAppState('in_online_exam');
  }, [selectedLicense]);

  const handleModeSelect = useCallback((mode: 'practice' | 'exam' | 'online_exam') => {
    if (mode === 'practice') setAppState('subject_selection');
    else if (mode === 'exam') startNewExam();
    else if (mode === 'online_exam') startOnlineExam();
  }, [startNewExam, startOnlineExam]);
  
  const handleSubjectSelect = useCallback((subject: Subject) => {
      const practiceQuiz: Quiz = {
        id: subject.id,
        title: `Ôn tập: ${subject.name}`,
        questions: subject.questions.map((q: Question) => ({ ...q, answers: shuffleArray(q.answers) })),
      };
      setCurrentQuiz(practiceQuiz);
      setUserAnswers({});
      setScore(0);
      setAppState('in_quiz');
  }, []);

  const handleQuizFinish = useCallback((finalAnswers: UserAnswers) => {
    if (!currentQuiz) return;
    let correctCount = 0;
    currentQuiz.questions.forEach(q => {
      if (finalAnswers[q.id] === q.correctAnswerId) correctCount++;
    });
    setUserAnswers(finalAnswers);
    setScore(correctCount);
    if (currentQuiz.id !== 'exam-quiz' && currentQuiz.id !== 'online-exam-quiz') saveProgress(currentQuiz.id, correctCount);
    setAppState('results');
  }, [currentQuiz, saveProgress]);
  
  const handleBackToModeSelection = useCallback(() => {
      setCurrentQuiz(null);
      setUserAnswers({});
      setScore(0);
      setAppState('mode_selection');
  }, []);

  const handleBackToSubjectSelection = useCallback(() => {
      setCurrentQuiz(null);
      setUserAnswers({});
      setScore(0);
      setAppState('subject_selection');
  }, []);
  
  const handleBackFromQuiz = useCallback(() => {
    const isPracticeQuiz = currentQuiz && currentQuiz.id !== 'exam-quiz' && currentQuiz.id !== 'online-exam-quiz';
    if (isPracticeQuiz) handleBackToSubjectSelection();
    else handleBackToModeSelection();
  }, [currentQuiz, handleBackToSubjectSelection, handleBackToModeSelection]);

  const handleRetryQuiz = useCallback(() => {
    if (!currentQuiz) return;
    setUserAnswers({});
    setScore(0);
    if (currentQuiz.id === 'exam-quiz') startNewExam();
    else if (currentQuiz.id === 'online-exam-quiz') startOnlineExam();
    else setAppState('in_quiz');
  }, [currentQuiz, startNewExam, startOnlineExam]);

  const handleBackToWelcome = useCallback(() => {
    setSelectedLicense(null);
    setUserName('');
    setUserProgress({});
    setAppState('welcome');
  }, []);

  const handleBackToLicenseSelection = useCallback(() => {
      setUserName('');
      setUserProgress({});
      setAppState('license_selection');
  }, []);

  const handleRestart = useCallback(() => {
    setSelectedLicense(null);
    setUserName('');
    setCurrentQuiz(null);
    setUserAnswers({});
    setScore(0);
    setUserProgress({});
    setAppState('license_selection');
  }, []);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4 animate-slide-in-right">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
            {theme === 'tri-an' ? (
              <img src="https://i.postimg.cc/MH9hVp8S/happy-techers-day.jpg" alt="Icon Chúc mừng Ngày Nhà giáo" className="h-24 w-24 mx-auto mb-4 animate-pulse rounded-full object-cover" />
            ) : (
              <HelmIcon3D className="h-24 w-24 mx-auto text-primary mb-4 animate-pulse" />
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
              Ứng Dụng Ôn Tập
            </h1>
            {theme === 'tri-an' && (
              <p className="text-xl font-semibold text-primary mb-4">
                Kính mừng ngày Nhà giáo Việt Nam
              </p>
            )}
            <p className="text-lg text-muted-foreground">
              Hệ thống đang tải bộ đề thi mới nhất, vui lòng chờ trong giây lát...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
         <div className="text-center p-4 animate-slide-in-right">
            <div className="bg-destructive/20 border-2 border-destructive/50 rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-destructive-foreground mb-4">
                  Đã xảy ra lỗi
                </h1>
                <p className="text-lg text-destructive-foreground/80">{error}</p>
            </div>
        </div>
      );
    }
    
    if (session && userProfile) {
        return <Dashboard userProfile={userProfile} />;
    }

    // Guest Flow
    switch (appState) {
      case 'welcome':
        return <WelcomeModal onStart={handleStart} onLoginClick={handleShowLogin} />;
      case 'login':
        return <LoginScreen onBack={handleBackToWelcome} />;
      case 'license_selection':
        return <LicenseSelectionScreen licenses={licenses} onSelect={handleLicenseSelect} onBack={handleBackToWelcome} />;
      case 'name_input':
        return <NameInputScreen onNameSubmit={handleNameSubmit} onBack={handleBackToLicenseSelection}/>;
      case 'mode_selection':
        return <ModeSelectionScreen onModeSelect={handleModeSelect} licenseName={selectedLicense?.name || ''} userName={userName} onSwitchLicense={handleRestart} />;
      case 'subject_selection':
        return <SubjectSelectionScreen subjects={selectedLicense?.subjects || []} progress={userProgress} onSelect={handleSubjectSelect} onBack={() => setAppState('mode_selection')} />;
      case 'in_quiz':
        if (currentQuiz) {
          return currentQuiz.timeLimit !== undefined
            ? <ExamQuizScreen quiz={currentQuiz} onFinish={handleQuizFinish} onBack={handleBackFromQuiz} />
            : <QuizScreen quiz={currentQuiz} onFinish={handleQuizFinish} onBack={handleBackFromQuiz} />;
        }
        return null;
       case 'in_online_exam':
        if (currentQuiz) {
          return <OnlineExamScreen 
            quiz={currentQuiz} 
            onFinish={handleQuizFinish} 
            onBack={handleBackToModeSelection}
            userName={userName}
            selectedLicense={selectedLicense}
          />
        }
        return null;
      case 'results':
        if (currentQuiz) {
          const isExam = currentQuiz.id === 'exam-quiz' || currentQuiz.id === 'online-exam-quiz';
          return isExam
            ? <ExamResultsScreen quiz={currentQuiz} userAnswers={userAnswers} score={score} onRetry={handleRetryQuiz} onBack={handleBackToModeSelection} userName={userName} />
            : <ResultsScreen quiz={currentQuiz} userAnswers={userAnswers} score={score} onRetry={handleRetryQuiz} onBack={handleBackToSubjectSelection} userName={userName} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-foreground p-4 pb-20 transition-colors duration-500">
      {/* Kích hoạt hiệu ứng tuyết chỉ khi theme là 'noel' */}
      {theme === 'noel' && <SnowEffect />}
      {theme === 'noel' && <MusicPlayer />} {/* Thêm trình phát nhạc cho theme Noel */}
      
      {session && userProfile && <Header userProfile={userProfile} onLogout={handleLogout} />}
      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center">
        {renderContent()}
      </main>
      {isChangelogModalOpen && <ChangelogModal onClose={() => setIsChangelogModalOpen(false)} />}
      <Footer onVersionClick={() => setIsChangelogModalOpen(true)} />
    </div>
  );
};

export default App;
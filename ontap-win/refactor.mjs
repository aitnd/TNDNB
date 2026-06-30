import fs from 'fs';

const appTsx = fs.readFileSync('App.tsx', 'utf8');
const lines = appTsx.split('\n');

const getLines = (start, end) => lines.slice(start - 1, end).join('\n');

const useAppInitContent = `import { useState, useEffect } from 'react';
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
  const userName = useAppStore(state => state.userName);
  const setUserName = useAppStore(state => state.setUserName);
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const setIsMobileApp = useAppStore(state => state.setIsMobileApp);
  const setResumeSessionAvailable = useAppStore(state => state.setResumeSessionAvailable);
  const [usageConfig, setUsageConfig] = useState<any>(null);

` + getLines(90, 440) + `

  const handleLogout = async () => {
    import('../services/sessionService').then(({ clearSession }) => clearSession());
    localStorage.removeItem('rememberSession');
    await auth.signOut();
    navigate('/');
  };

  return { usageConfig, handleLogout };
};
`;

if (!fs.existsSync('hooks')) fs.mkdirSync('hooks');
fs.writeFileSync('hooks/useAppInitialization.ts', useAppInitContent);
console.log('Created hooks/useAppInitialization.ts');

const appRoutesContent = `import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';

import WelcomeModal from '../components/WelcomeModal';
import LoginScreen from '../components/LoginScreen';
import WindowsLoginScreen from '../components/WindowsLoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import LicenseSelectionScreen from '../components/LicenseSelectionScreen';
import NameInputScreen from '../components/NameInputScreen';
import ModeSelectionScreen from '../components/ModeSelectionScreen';
import SubjectSelectionScreen from '../components/SubjectSelectionScreen';
import QuizScreen from '../components/QuizScreen';
import ExamQuizScreen2 from '../components/ExamQuizScreen2';
import ExamResultsScreen from '../components/ExamResultsScreen';
import ResultsScreen from '../components/ResultsScreen';
import CountdownAdScreen from '../components/CountdownAdScreen';
import Dashboard from '../components/Dashboard';
import HistoryScreen from '../components/HistoryScreen';
import MyClassScreen from '../components/MyClassScreen';
import ClassManagementScreen from '../components/ClassManagementScreen';
import AccountScreen from '../components/AccountScreen';
import UserManagerScreen from '../components/UserManagerScreen';
import MailboxScreen from '../components/MailboxScreen';
import ChangelogScreen from '../components/ChangelogScreen';
import ThiTrucTuyenPage from '../components/ThiTrucTuyenPage';
import OnlineExamManagementScreen from '../components/OnlineExamManagementScreen';
import AnalyticsPage from '../components/AnalyticsPage';
import DownloadAppPage from '../components/DownloadAppPage';
import UsageConfigPanel from '../components/UsageConfigPanel';
import LoginHistoryScreen from '../components/LoginHistoryScreen';
import EntertainmentScreen from '../components/EntertainmentScreen';
import MaintenanceScreen from '../components/MaintenanceScreen';
import ProtectedRoute from '../components/ProtectedRoute';
import NotificationMgmtScreen from '../components/NotificationMgmtScreen';
import AdSenseLoader from '../components/AdSenseLoader';
import { BadgeListener } from '../components/Badges/BadgeListener';
import SweetAlertPopup from '../components/SweetAlertPopup';
import { Toaster } from 'sonner';
import TopNavbar from '../components/TopNavbar';
import AlertMarquee from '../components/AlertMarquee';
import MobileBottomNav from '../components/MobileBottomNav';

interface AppRoutesProps {
  usageConfig: any;
  handleStart: () => void;
  handleLicenseSelect: (license: any) => void;
  handleNameSubmit: (name: string) => void;
  handleModeSelect: (mode: 'practice' | 'exam' | 'online_exam') => void;
  handleSubjectSelect: (subject: any) => void;
  handleQuizFinish: (answers: any) => void;
  handleRetry: () => void;
  persistSession: any;
  handleTopNavNavigate: (screen: string) => void;
  handleLogout: () => void;
  resumeSession: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  usageConfig,
  handleStart,
  handleLicenseSelect,
  handleNameSubmit,
  handleModeSelect,
  handleSubjectSelect,
  handleQuizFinish,
  handleRetry,
  persistSession,
  handleTopNavNavigate,
  handleLogout,
  resumeSession
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const licenses = useAppStore(state => state.licenses);
  const selectedLicense = useAppStore(state => state.selectedLicense);
  const subjects = useAppStore(state => state.subjects);
  const selectedSubject = useAppStore(state => state.selectedSubject);
  const currentQuiz = useAppStore(state => state.currentQuiz);
  const userAnswers = useAppStore(state => state.userAnswers);
  const score = useAppStore(state => state.score);
  const userName = useAppStore(state => state.userName);
  const userProfile = useAppStore(state => state.userProfile);
  const isMobileApp = useAppStore(state => state.isMobileApp);
  const resumeSessionAvailable = useAppStore(state => state.resumeSessionAvailable);

` + getLines(715, 740) + `

  return (
    <div className={\`min-h-screen bg-background text-foreground font-sans transition-colors duration-300 \${isMobileApp ? 'pb-16' : 'pt-16'}\`}>
      <BadgeListener />
      <SweetAlertPopup />
      <Toaster position="top-right" richColors expand={true} closeButton />

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
` + getLines(770, 972) + `
      </AnimatePresence>
    </div>
  );
};
`;

if (!fs.existsSync('routes')) fs.mkdirSync('routes');
fs.writeFileSync('routes/AppRoutes.tsx', appRoutesContent);
console.log('Created routes/AppRoutes.tsx');

const newAppTsxContent = `import React, { useCallback } from 'react';
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

` + getLines(442, 706) + `

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

` + getLines(978, 1011);

fs.writeFileSync('App.tsx', newAppTsxContent);
console.log('Updated App.tsx');

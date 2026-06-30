import React from 'react';
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

  const currentQuiz = useAppStore(state => state.currentQuiz);
  const userAnswers = useAppStore(state => state.userAnswers);
  const score = useAppStore(state => state.score);
  const userName = useAppStore(state => state.userName);
  const userProfile = useAppStore(state => state.userProfile);
  const isMobileApp = useAppStore(state => state.isMobileApp);
  const resumeSessionAvailable = useAppStore(state => state.resumeSessionAvailable);

  // --- MAINTENANCE MODE CHECK ---
  const isMaintenanceBypassed = location.pathname === '/ontap/login-admin' || userProfile?.role === 'admin';
  if (usageConfig?.isMaintenanceWin && !isMaintenanceBypassed) {
    return (
      <MaintenanceScreen 
        message={usageConfig.maintenanceMessage} 
        estimatedTime={usageConfig.maintenanceEstimatedTime}
        maintenanceEndTime={usageConfig.maintenanceEndTime}
        safetyInfo={usageConfig.maintenanceSafetyInfo}
        contactInfo={usageConfig.maintenanceContact}
      />
    );
  }

  // --- STRICT WINDOWS APP LOGIC ---
  // @ts-ignore
  const isElectron = window.electron?.isElectron || window.location.protocol === 'file:' || navigator.userAgent.toLowerCase().includes('electron');

  if (isElectron && !userProfile) {
    return (
      <div className={`min-h-screen bg-background text-foreground font-sans ${isMobileApp ? 'pb-16' : 'pt-0'}`}>
        <Toaster position="top-right" richColors expand={true} closeButton />
        <WindowsLoginScreen />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans transition-colors duration-300 ${isMobileApp ? 'pb-16' : 'pt-16'}`}>
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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/ontap/dashboard" replace />} />
          <Route path="/ontap" element={<Navigate to="/ontap/dashboard" replace />} />

          <Route path="/ontap/dashboard" element={
            userProfile ? (
              <Dashboard
                userProfile={userProfile}
                onStart={() => navigate('/ontap/chonbang')}
                onHistoryClick={() => navigate('/ontap/history')}
                onClassClick={() => handleTopNavNavigate((userProfile?.role === 'hoc_vien') ? 'my_class' : 'class_management')}
                onOnlineExamClick={() => navigate('/ontap/exam-manager')}
                onNotificationClick={() => navigate('/ontap/notifications')}
                onStatsClick={() => navigate('/ontap/analytics')}
                onSettingsClick={() => navigate('/ontap/settings')}
                onUserManagerClick={() => navigate('/ontap/usermanager')}
              />
            ) : (
              <WelcomeModal onStart={handleStart} onLoginClick={() => navigate('/ontap/login')} onRegisterClick={() => navigate('/ontap/register')} />
            )
          } />

          <Route path="/ontap/login" element={!userProfile ? <LoginScreen onBack={() => navigate('/')} /> : <Navigate to="/ontap/dashboard" />} />
          <Route path="/ontap/login-admin" element={!userProfile ? <LoginScreen onBack={() => navigate('/')} /> : <Navigate to="/ontap/dashboard" />} />
          <Route path="/ontap/windows-login" element={!userProfile ? <WindowsLoginScreen /> : <Navigate to="/ontap/dashboard" />} />
          <Route path="/ontap/register" element={<RegisterScreen onBack={() => navigate('/')} onSuccess={() => navigate('/ontap/dashboard')} />} />

          <Route path="/ontap/chonbang" element={<LicenseSelectionScreen licenses={licenses} onSelect={handleLicenseSelect} onBack={() => navigate('/')} />} />
          <Route path="/ontap/nhapten" element={<NameInputScreen onNameSubmit={handleNameSubmit} onBack={() => navigate('/ontap/chonbang')} />} />

          <Route path="/ontap/chonchedo" element={
            <ModeSelectionScreen
              onModeSelect={handleModeSelect}
              licenseName={selectedLicense?.name || ''}
              userName={userName}
              onSwitchLicense={() => navigate('/ontap/chonbang')}
            />
          } />

          <Route path="/ontap/chonmon" element={
            <SubjectSelectionScreen
              subjects={subjects}
              progress={{}}
              onSelect={handleSubjectSelect}
              onBack={() => navigate('/ontap/chonchedo')}
            />
          } />

          <Route path="/ontap/lambai" element={
            currentQuiz ? (
              <QuizScreen
                quiz={currentQuiz}
                onFinish={handleQuizFinish}
                onBack={() => navigate('/ontap/chonmon')}
                initialAnswers={userAnswers}
                initialIndex={0}
                onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'practice')}
              />
            ) : <Navigate to="/ontap/chonmon" replace />
          } />

          <Route path="/ontap/thithu" element={
            currentQuiz ? (
              <ExamQuizScreen2
                quiz={currentQuiz}
                onFinish={handleQuizFinish}
                onBack={() => navigate('/ontap/chonchedo')}
                userName={userName}
                userProfile={userProfile}
                selectedLicense={selectedLicense}
                initialAnswers={userAnswers}
                onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'online_exam')}
              />
            ) : <Navigate to="/ontap/chonchedo" replace />
          } />

          <Route path="/ontap/ad-loading" element={<CountdownAdScreen />} />

          <Route path="/ontap/ketqua" element={
            currentQuiz ? (
              <ResultsScreen
                quiz={currentQuiz}
                userAnswers={userAnswers}
                score={score}
                onRetry={handleRetry}
                onBack={() => navigate('/ontap/chonmon')}
                userName={userName}
              />
            ) : <Navigate to="/ontap/chonmon" replace />
          } />

          <Route path="/ontap/ketquathi" element={
            currentQuiz ? (
              <ExamResultsScreen
                quiz={currentQuiz}
                userAnswers={userAnswers}
                score={score}
                onRetry={handleRetry}
                onBack={() => navigate('/ontap/chonchedo')}
                userName={userName}
              />
            ) : <Navigate to="/ontap/chonchedo" replace />
          } />

          <Route path="/ontap/history" element={userProfile ? <HistoryScreen userProfile={userProfile} onBack={() => navigate('/ontap/dashboard')} /> : <Navigate to="/ontap/login" replace />} />
          <Route path="/ontap/my-class" element={userProfile ? <MyClassScreen userProfile={userProfile} onBack={() => navigate('/ontap/dashboard')} /> : <Navigate to="/ontap/login" replace />} />
          <Route path="/ontap/class-manager" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <ClassManagementScreen userProfile={userProfile!} usageConfig={usageConfig} onBack={() => navigate('/ontap/dashboard')} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/class-manager/:courseId" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <ClassManagementScreen userProfile={userProfile!} usageConfig={usageConfig} onBack={() => navigate('/ontap/dashboard')} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/profile" element={userProfile ? <AccountScreen userProfile={userProfile} usageConfig={usageConfig} onBack={() => navigate('/ontap/dashboard')} onNavigate={handleTopNavNavigate} /> : <Navigate to="/ontap/login" replace />} />
          <Route path="/ontap/usermanager" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <UserManagerScreen userProfile={userProfile!} usageConfig={usageConfig} onBack={() => navigate('/ontap/dashboard')} onNavigate={handleTopNavNavigate} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/settings" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao']} userProfile={userProfile}>
              <UsageConfigPanel userProfile={userProfile!} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/notifications" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <NotificationMgmtScreen userProfile={userProfile!} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/mailbox" element={userProfile ? <MailboxScreen userProfile={userProfile} onBack={() => navigate('/ontap/dashboard')} /> : <Navigate to="/ontap/login" />} />
          <Route path="/ontap/exam-manager" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <OnlineExamManagementScreen userProfile={userProfile!} onBack={() => navigate('/ontap/dashboard')} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/online-exam" element={<ThiTrucTuyenPage />} />
          <Route path="/ontap/download" element={<DownloadAppPage />} />
          <Route path="/ontap/analytics" element={
            <ProtectedRoute roles={['admin', 'quan_ly', 'lanh_dao', 'giao_vien']} userProfile={userProfile}>
              <AnalyticsPage onBack={() => navigate('/ontap/dashboard')} />
            </ProtectedRoute>
          } />
          <Route path="/ontap/login-history" element={<LoginHistoryScreen onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/games" element={<EntertainmentScreen onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/changelog" element={<ChangelogScreen onBack={() => navigate('/ontap/dashboard')} />} />
          <Route path="/ontap/lichsucapnhat" element={<Navigate to="/ontap/changelog" replace />} />
          <Route path="/ontap/lich-su-cap-nhat" element={<Navigate to="/ontap/changelog" replace />} />

          {/* Redirects từ URL cũ có dấu gạch ngang */}
          <Route path="/ontap/lam-bai" element={<Navigate to="/ontap/lambai" replace />} />
          <Route path="/ontap/chon-che-do" element={<Navigate to="/ontap/chonchedo" replace />} />
          <Route path="/ontap/chon-bang" element={<Navigate to="/ontap/chonbang" replace />} />
          <Route path="/ontap/nhap-ten" element={<Navigate to="/ontap/nhapten" replace />} />
          <Route path="/ontap/chon-mon" element={<Navigate to="/ontap/chonmon" replace />} />
          <Route path="/ontap/ket-qua-thi" element={<Navigate to="/ontap/ketquathi" replace />} />
          <Route path="/ontap/ket-qua" element={<Navigate to="/ontap/ketqua" replace />} />

          {/* Hỗ trợ tương thích ngược cho URL Tiếng Việt sang Tiếng Anh mới */}
          <Route path="/ontap/dangnhap" element={<Navigate to="/ontap/login" replace />} />
          <Route path="/ontap/dang-nhap" element={<Navigate to="/ontap/login" replace />} />
          <Route path="/ontap/dangky" element={<Navigate to="/ontap/register" replace />} />
          <Route path="/ontap/dang-ky" element={<Navigate to="/ontap/register" replace />} />
          <Route path="/ontap/windowslogin" element={<Navigate to="/ontap/windows-login" replace />} />
          <Route path="/ontap/windows-login" element={<Navigate to="/ontap/windows-login" replace />} />
          
          <Route path="/ontap/lichsu" element={<Navigate to="/ontap/history" replace />} />
          <Route path="/ontap/lich-su" element={<Navigate to="/ontap/history" replace />} />
          <Route path="/ontap/lopcuatoi" element={<Navigate to="/ontap/my-class" replace />} />
          <Route path="/ontap/lop-cua-toi" element={<Navigate to="/ontap/my-class" replace />} />
          
          <Route path="/ontap/quanlylop" element={<Navigate to="/ontap/class-manager" replace />} />
          <Route path="/ontap/quan-ly-lop" element={<Navigate to="/ontap/class-manager" replace />} />
          <Route path="/ontap/quanlylop/:courseId" element={<Navigate to="/ontap/class-manager/:courseId" replace />} />
          
          <Route path="/ontap/taikhoan" element={<Navigate to="/ontap/profile" replace />} />
          <Route path="/ontap/cauhinh" element={<Navigate to="/ontap/settings" replace />} />
          <Route path="/ontap/thongbao" element={<Navigate to="/ontap/notifications" replace />} />
          
          <Route path="/ontap/homthu" element={<Navigate to="/ontap/mailbox" replace />} />
          <Route path="/ontap/hom-thu" element={<Navigate to="/ontap/mailbox" replace />} />
          
          <Route path="/ontap/quanlythi" element={<Navigate to="/ontap/exam-manager" replace />} />
          <Route path="/ontap/thitructuyen" element={<Navigate to="/ontap/online-exam" replace />} />
          <Route path="/ontap/thi-truc-tuyen" element={<Navigate to="/ontap/online-exam" replace />} />
          
          <Route path="/ontap/thongke" element={<Navigate to="/ontap/analytics" replace />} />
          <Route path="/ontap/thong-ke" element={<Navigate to="/ontap/analytics" replace />} />
          
          <Route path="/ontap/lichsudangnhap" element={<Navigate to="/ontap/login-history" replace />} />
          <Route path="/ontap/giaitri" element={<Navigate to="/ontap/games" replace />} />

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

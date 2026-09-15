import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import GiamKhaoSelectionScreen from '../components/GiamKhaoSelectionScreen';
import MaintenanceScreen from '../components/MaintenanceScreen';
import ProtectedRoute from '../components/ProtectedRoute';
import NotificationMgmtScreen from '../components/NotificationMgmtScreen';
import AdSenseLoader from '../components/AdSenseLoader';
import { BadgeListener } from '../components/Badges/BadgeListener';

interface AppRoutesProps {
  usageConfig: any;
  handleStart: () => void;
  handleLicenseSelect: (license: any) => void;
  handleNameSubmit: (name: string) => void;
  handleModeSelect: (mode: 'practice' | 'exam' | 'online_exam') => void;
  handleGiamkhaoModeSelect: (mode: 'practice' | 'exam' | 'online_exam') => void;
  handleSubjectSelect: (subject: any) => void;
  handleQuizFinish: (answers: any) => void;
  handleRetry: () => void;
  persistSession: any;
  handleTopNavNavigate: (screen: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  usageConfig,
  handleStart,
  handleLicenseSelect,
  handleNameSubmit,
  handleModeSelect,
  handleGiamkhaoModeSelect,
  handleSubjectSelect,
  handleQuizFinish,
  handleRetry,
  persistSession,
  handleTopNavNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const licenses = useAppStore(state => state.licenses);
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
  const userName = useAppStore(state => state.userName);
  const userProfile = useAppStore(state => state.userProfile);

  const maintenanceMode = usageConfig?.isMaintenanceWeb ?? false;
  const isMaintenanceBypassed = location.pathname === '/ontap/login-admin' || userProfile?.role === 'admin';

  if (maintenanceMode && !isMaintenanceBypassed) {
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

  return (
    <>
      <AdSenseLoader userProfile={userProfile} />
      <BadgeListener />

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
            <WelcomeModal 
              onStart={handleStart} 
              onLoginClick={() => navigate('/ontap/login')} 
              onRegisterClick={() => navigate('/ontap/register')} 
            />
          )
        } />

        <Route path="/ontap/login" element={!userProfile ? <LoginScreen onBack={() => navigate('/')} /> : <Navigate to="/ontap/dashboard" />} />
        <Route path="/ontap/login-admin" element={!userProfile ? <LoginScreen onBack={() => navigate('/')} /> : <Navigate to="/ontap/dashboard" />} />
        <Route path="/ontap/windows-login" element={!userProfile ? <WindowsLoginScreen /> : <Navigate to="/ontap/dashboard" />} />
        <Route path="/ontap/register" element={<RegisterScreen onBack={() => navigate('/')} onSuccess={() => navigate('/ontap/dashboard')} />} />

        {/* ===== GIÁM KHẢO ROUTES ===== */}
        <Route path="/ontap/giamkhao" element={
          userProfile && ['admin', 'giao_vien', 'quan_ly', 'lanh_dao'].includes(userProfile.role)
            ? <GiamKhaoSelectionScreen
              licenses={licenses}
              onSelectLicense={(license) => {
                setSelectedLicense(license);
                setSubjects(license.subjects);
                navigate('/ontap/giamkhao/chonchedo');
              }}
              onBack={() => navigate('/ontap/dashboard')}
            />
            : <Navigate to="/ontap/dashboard" replace />
        } />

        <Route path="/ontap/giamkhao/chonchedo" element={
          userProfile && ['admin', 'giao_vien', 'quan_ly', 'lanh_dao'].includes(userProfile.role) && selectedLicense
            ? <ModeSelectionScreen
              onModeSelect={handleGiamkhaoModeSelect}
              licenseName={selectedLicense?.name || ''}
              userName={userName}
              onSwitchLicense={() => navigate('/ontap/giamkhao')}
            />
            : <Navigate to="/ontap/giamkhao" replace />
        } />

        <Route path="/ontap/giamkhao/chonmon" element={
          userProfile && ['admin', 'giao_vien', 'quan_ly', 'lanh_dao'].includes(userProfile.role) && selectedLicense
            ? <SubjectSelectionScreen
              subjects={subjects}
              progress={{}}
              onSelect={async (subject) => {
                const allowed = await import('../services/usageService').then(({ checkUsage }) => checkUsage(userProfile));
                if (allowed !== 'ALLOWED') {
                  await import('../services/usageService').then(({ showLimitAlert }) => showLimitAlert(userProfile, () => navigate('/ontap/dangnhap')));
                  return;
                }
                await import('../services/usageService').then(({ incrementUsage }) => incrementUsage(userProfile));
                setSelectedSubject(subject);
                const newQuiz = {
                  id: subject.id,
                  title: subject.name,
                  questions: subject.questions,
                  timeLimit: 0
                };
                setCurrentQuiz(newQuiz);
                setUserAnswers({});
                localStorage.removeItem('ontap_quiz_session');
                navigate('/ontap/giamkhao/lambai');
              }}
              onBack={() => navigate('/ontap/giamkhao/chonchedo')}
            />
            : <Navigate to="/ontap/giamkhao" replace />
        } />

        <Route path="/ontap/giamkhao/lambai" element={
          currentQuiz ? (
            <QuizScreen
              quiz={currentQuiz}
              onFinish={handleQuizFinish}
              onBack={() => navigate('/ontap/giamkhao/chonmon')}
              initialAnswers={userAnswers}
              initialIndex={0}
              onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'practice')}
            />
          ) : <Navigate to="/ontap/giamkhao/chonmon" replace />
        } />

        <Route path="/ontap/giamkhao/thithu" element={
          currentQuiz ? (
            <ExamQuizScreen2
              quiz={currentQuiz}
              onFinish={handleQuizFinish}
              onBack={() => navigate('/ontap/giamkhao')}
              userName={userName}
              userProfile={userProfile}
              selectedLicense={selectedLicense}
              initialAnswers={userAnswers}
              onProgressUpdate={(idx, time, ans) => persistSession(idx, time, ans, currentQuiz, 'online_exam')}
            />
          ) : <Navigate to="/ontap/giamkhao" replace />
        } />

        <Route path="/ontap/giamkhao/ketqua" element={
          currentQuiz ? (
            <ResultsScreen
              quiz={currentQuiz}
              userAnswers={userAnswers}
              score={score}
              onRetry={() => {
                if (selectedSubject && selectedLicense) {
                  const newQuiz = {
                    id: selectedSubject.id,
                    title: selectedSubject.name,
                    questions: selectedSubject.questions,
                    timeLimit: 0
                  };
                  setCurrentQuiz(newQuiz);
                  setUserAnswers({});
                  localStorage.removeItem('ontap_quiz_session');
                  navigate('/ontap/giamkhao/lambai');
                }
              }}
              onBack={() => navigate('/ontap/giamkhao/chonmon')}
              userName={userName}
            />
          ) : <Navigate to="/ontap/giamkhao/chonmon" replace />
        } />

        <Route path="/ontap/giamkhao/ketquathi" element={
          currentQuiz ? (
            <ExamResultsScreen
              quiz={currentQuiz}
              userAnswers={userAnswers}
              score={score}
              onRetry={() => navigate('/ontap/giamkhao')}
              onBack={() => navigate('/ontap/giamkhao')}
              userName={userName}
            />
          ) : <Navigate to="/ontap/giamkhao" replace />
        } />
        {/* ===== END GIÁM KHẢO ROUTES ===== */}

        <Route path="/ontap/chonbang" element={
          <LicenseSelectionScreen 
            licenses={licenses.filter(l => !['Lý thuyết chung', 'Chuyên môn'].includes(l.name))} 
            onSelect={handleLicenseSelect} 
            onBack={() => navigate('/')} 
          />
        } />
        
        <Route path="/ontap/nhapten" element={
          <NameInputScreen 
            onNameSubmit={handleNameSubmit} 
            onBack={() => navigate('/ontap/chonbang')} 
          />
        } />

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

        {/* Redirects từ URL cũ */}
        <Route path="/ontap/lam-bai" element={<Navigate to="/ontap/lambai" replace />} />
        <Route path="/ontap/chon-che-do" element={<Navigate to="/ontap/chonchedo" replace />} />
        <Route path="/ontap/chon-bang" element={<Navigate to="/ontap/chonbang" replace />} />
        <Route path="/ontap/nhap-ten" element={<Navigate to="/ontap/nhapten" replace />} />
        <Route path="/ontap/chon-mon" element={<Navigate to="/ontap/chonmon" replace />} />
        <Route path="/ontap/ket-qua-thi" element={<Navigate to="/ontap/ketquathi" replace />} />
        <Route path="/ontap/ket-qua" element={<Navigate to="/ontap/ketqua" replace />} />

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
      </Routes>
    </>
  );
};

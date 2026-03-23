import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../services/firebaseClient';
import { ArrowLeftIcon3D, HelmIcon3D } from './icons';
import { FaFingerprint, FaCheckSquare, FaSquare, FaKey } from 'react-icons/fa';
import { saveCredentials, performBiometricLogin, hasSavedCredentials } from '../services/biometricService';
import { resolveEmailFromUsername } from '../services/authService';

// Import Saved Accounts
import SavedAccountsList from './SavedAccountsList';
import {
  getSavedAccounts,
  saveAccount,
  getAccountPassword,
  updateLastLogin,
  hasSavedAccounts as checkHasSavedAccounts,
  SavedAccount
} from '../services/savedAccountsService';

interface LoginScreenProps {
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Biometric States
  const [rememberMe, setRememberMe] = useState(false);
  const [canBioLogin, setCanBioLogin] = useState(false);

  // Saved Accounts States
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [saveThisAccount, setSaveThisAccount] = useState(true); // Mặc định tick lưu tài khoản

  useEffect(() => {
    checkBiometricStatus();
    loadSavedAccounts();
  }, []);

  const checkBiometricStatus = async () => {
    const hasCreds = await hasSavedCredentials();
    setCanBioLogin(hasCreds);
  };

  // Load danh sách tài khoản đã lưu
  const loadSavedAccounts = () => {
    const accounts = getSavedAccounts();
    setSavedAccounts(accounts);
    // Nếu có tài khoản đã lưu, hiển thị danh sách
    if (accounts.length > 0) {
      setShowSavedAccounts(true);
    }
  };

  // Xử lý khi chọn tài khoản từ danh sách
  const handleSelectSavedAccount = async (savedAcc: SavedAccount) => {
    setLoading(true);
    setError(null);

    try {
      const savedPassword = await getAccountPassword(savedAcc.email);

      if (savedPassword) {
        // Có mật khẩu đã lưu -> đăng nhập tự động
        await setPersistence(auth, browserLocalPersistence);
        await signInWithEmailAndPassword(auth, savedAcc.email, savedPassword);
        updateLastLogin(savedAcc.email);
        // Success handled by App.tsx
      } else {
        // Không có mật khẩu -> điền email và yêu cầu nhập password
        setAccount(savedAcc.email);
        setShowSavedAccounts(false);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Saved account login failed:", err);
      // Nếu đăng nhập thất bại (mật khẩu cũ), yêu cầu nhập lại
      setAccount(savedAcc.email);
      setShowSavedAccounts(false);
      setError('Mật khẩu đã lưu không còn hợp lệ. Vui lòng nhập lại.');
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError(null);
    const creds = await performBiometricLogin();
    if (creds) {
      try {
        await setPersistence(auth, browserLocalPersistence);
        await signInWithEmailAndPassword(auth, creds.email, creds.pass);
      } catch (err: any) {
        setLoading(false);
        console.error("Bio login failed:", err);
        setError('Đăng nhập vân tay thất bại (phiên hết hạn hoặc đổi mật khẩu).');
      }
    } else {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Resolve username to email if necessary
      const loginEmail = await resolveEmailFromUsername(account);

      // Set Persistence based on Remember Me
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);

      // Save credentials for Biometric if "Remember Me" is checked
      if (rememberMe) {
        await saveCredentials(loginEmail, password);
      }

      // Lưu tài khoản nếu được chọn
      if (saveThisAccount) {
        // Lấy thông tin user từ auth (sẽ có sau khi đăng nhập thành công)
        const user = auth.currentUser;
        saveAccount(
          loginEmail,
          user?.displayName || account,
          password, // Lưu password đã mã hóa
          user?.photoURL || undefined
        );
      }

      // Success is handled by onAuthStateChanged in App.tsx
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/invalid-email') {
        setError('Tên đăng nhập hoặc email không hợp lệ.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Tài khoản hoặc mật khẩu không chính xác.');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      if (!auth.currentUser) setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMsg(`Đã gửi email khôi phục đến ${resetEmail}. Vui lòng kiểm tra hộp thư (cả mục Spam).`);
      setResetEmail('');
    } catch (err: any) {
      console.error("Reset password failed:", err);
      if (err.code === 'auth/user-not-found') {
        setError('Email này chưa được đăng ký.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email không hợp lệ.');
      } else {
        setError('Gửi email thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER: FORGOT PASSWORD SCREEN ---
  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto p-4 animate-slide-in-right">
        <div className="relative text-center mb-10">
          <button
            onClick={() => { setShowForgotPassword(false); setError(null); setSuccessMsg(null); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted transition-all duration-300"
          >
            <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
          </button>
          <div className="h-20 w-20 mx-auto text-primary mb-4 flex items-center justify-center bg-primary/10 rounded-full">
            <FaKey className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Khôi phục mật khẩu</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleResetPassword}>
            {error && <p className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-center text-sm">{error}</p>}
            {successMsg && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center text-sm">{successMsg}</p>}

            <div className="mb-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">Email đăng ký</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-300"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: SAVED ACCOUNTS LIST ---
  if (showSavedAccounts && savedAccounts.length > 0) {
    return (
      <div className="w-full max-w-md mx-auto p-4 animate-slide-in-right">
        <div className="relative text-center mb-10">
          <button
            onClick={onBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 transform hover:scale-110"
            aria-label="Quay lại"
          >
            <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
          </button>
          <HelmIcon3D className="h-20 w-20 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground">Chào mừng trở lại</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Chọn tài khoản để đăng nhập
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg">
          <SavedAccountsList
            accounts={savedAccounts}
            onSelectAccount={handleSelectSavedAccount}
            onUseOtherAccount={() => setShowSavedAccounts(false)}
            onAccountRemoved={loadSavedAccounts}
          />
        </div>
      </div>
    );
  }

  // --- RENDER: LOGIN SCREEN ---
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-slide-in-right">
      <div className="relative text-center mb-10">
        <button
          onClick={() => {
            // Nếu có tài khoản đã lưu, quay lại danh sách. Nếu không, quay lại trang trước
            if (savedAccounts.length > 0) {
              setShowSavedAccounts(true);
              setError(null);
            } else {
              onBack();
            }
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 transform hover:scale-110"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
        </button>
        <HelmIcon3D className="h-20 w-20 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Đăng nhập</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Truy cập vào hệ thống quản lý học tập.
        </p>
      </div>

      <div className="bg-card p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleLogin}>
          {error && <p className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label htmlFor="account" className="block text-sm font-medium text-card-foreground mb-2">
              Tài khoản
            </label>
            <input
              id="account"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Nhập tài khoản hoặc email"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-300"
              required
              autoFocus
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-300"
              required
            />
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* LƯU TÀI KHOẢN CHECKBOX */}
          <div className="mb-4 flex items-center gap-2 cursor-pointer" onClick={() => setSaveThisAccount(!saveThisAccount)}>
            {saveThisAccount ? (
              <FaCheckSquare className="text-primary text-xl" />
            ) : (
              <FaSquare className="text-gray-400 text-xl" />
            )}
            <span className="text-sm text-muted-foreground select-none">Lưu tài khoản này</span>
          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className="mb-6 flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
            {rememberMe ? (
              <FaCheckSquare className="text-primary text-xl" />
            ) : (
              <FaSquare className="text-gray-400 text-xl" />
            )}
            <span className="text-sm text-muted-foreground select-none">Ghi nhớ đăng nhập</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300 disabled:opacity-50 disabled:cursor-wait mb-4"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>

          {/* BIOMETRIC BUTTON */}
          {canBioLogin && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleBiometricAuth}
                disabled={loading}
                className="flex flex-col items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaFingerprint className="text-3xl" />
                </div>
                <span className="text-sm font-medium">Đăng nhập bằng vân tay</span>
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
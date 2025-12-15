import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseClient';
import { ArrowLeftIcon3D, HelmIcon3D } from './icons';
import { FaFingerprint, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { saveCredentials, performBiometricLogin, hasSavedCredentials } from '../services/biometricService';

import { resolveEmailFromUsername } from '../services/authService';

interface LoginScreenProps {
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Biometric States
  const [rememberMe, setRememberMe] = useState(false);
  const [canBioLogin, setCanBioLogin] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const hasCreds = await hasSavedCredentials();
    setCanBioLogin(hasCreds);
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError(null);
    const creds = await performBiometricLogin();
    if (creds) {
      try {
        await signInWithEmailAndPassword(auth, creds.email, creds.pass);
        // Success handled by App.tsx
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

      await signInWithEmailAndPassword(auth, loginEmail, password);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await saveCredentials(loginEmail, password);
      }

      // Success is handled by onAuthStateChanged in App.tsx
    } catch (err: any) {
      console.error("Login failed:", err);
      // Custom friendly error
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

          {/* REMEMBER ME CHECKBOX */}
          <div className="mb-6 flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
            {rememberMe ? (
              <FaCheckSquare className="text-primary text-xl" />
            ) : (
              <FaSquare className="text-gray-400 text-xl" />
            )}
            <span className="text-sm text-muted-foreground select-none">Ghi nhớ đăng nhập (Vân tay)</span>
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
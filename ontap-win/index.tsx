import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const FullScreenFallback = ({ error }: { error: Error | null }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(error?.stack || error?.message || 'Unknown error');
    alert('Đã copy lỗi!');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8d7da', color: '#721c24', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Đã xảy ra lỗi nghiêm trọng</h1>
      <p style={{ marginBottom: '20px', whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '80%', overflow: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #f5c6cb' }}>
        {error?.message || 'Không rõ nguyên nhân'}
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleCopy}
          style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Copy Log
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Tải lại ứng dụng
        </button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary name="Root" fallback={(error) => <FullScreenFallback error={error} />}>
      <AuthProvider>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

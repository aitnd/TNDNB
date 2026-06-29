import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Wrench, ShieldAlert, Clock, Mail, RefreshCw } from 'lucide-react';
import useCountdown from '../hooks/useCountdown';

interface MaintenanceScreenProps {
  message?: string;
  estimatedTime?: string;
  /** ISO 8601 timestamp cho bộ đếm ngược (ví dụ: "2026-06-29T15:00:00+07:00") */
  maintenanceEndTime?: string;
  safetyInfo?: string;
  contactInfo?: string;
}

/** Ô hiển thị một đơn vị thời gian trong bộ đếm ngược */
const CountdownBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-white/5 border border-white/15 backdrop-blur-md rounded-2xl w-[72px] h-[80px] flex items-center justify-center shadow-lg overflow-hidden">
      {/* Hiệu ứng gradient tinh tế */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-3xl font-bold text-white tabular-nums relative z-10"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">{label}</span>
  </div>
);

/** Dấu hai chấm phân cách giữa các ô countdown */
const CountdownSeparator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[80px] px-1">
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="text-2xl font-bold text-blue-400/60"
    >
      :
    </motion.span>
  </div>
);

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ message, estimatedTime, maintenanceEndTime, safetyInfo, contactInfo }) => {
  const countdown = useCountdown(maintenanceEndTime);
  const [autoReloadSeconds, setAutoReloadSeconds] = useState(10);

  // Tự động reload khi hết giờ bảo trì
  useEffect(() => {
    if (!countdown.isOver) return;

    const timer = setInterval(() => {
      setAutoReloadSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.isOver]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
      >
        
        {/* Floating Icons Animation */}
        <div className="flex justify-center items-center mb-8 relative h-32">
          {/* Bánh răng 1: Bên Trái/Dưới (dùng wrapper div để tránh bị ghi đè translate) */}
          <div className="absolute -translate-x-14 -translate-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-20 h-20 text-blue-400/25" />
            </motion.div>
          </div>
          
          {/* Bánh răng 2: Bên Phải/Trên */}
          <div className="absolute translate-x-14 translate-y-4">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-14 h-14 text-purple-400/30" />
            </motion.div>
          </div>

          {/* Icon Wrench ở Giữa lơ lửng & lắc nhẹ cực kỳ sinh động */}
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 bg-gradient-to-tr from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-purple-500/30 cursor-pointer"
          >
            <Wrench className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Typography */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mb-4"
        >
          {countdown.isOver ? 'Bảo Trì Hoàn Tất!' : 'Hệ Thống Đang Bảo Trì'}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed"
        >
          {countdown.isOver 
            ? `Hệ thống đang được khởi động lại. Trang sẽ tự tải lại sau ${autoReloadSeconds} giây...`
            : (message || 'Hệ thống đang được bảo trì để nâng cấp và mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau ít phút!')
          }
        </motion.p>

        {/* Countdown Timer hoặc Text Pill fallback */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          {countdown.isActive && !countdown.isOver ? (
            /* Bộ đếm ngược Glassmorphic 4 ô */
            <div className="flex items-start justify-center gap-1 sm:gap-2">
              <CountdownBlock value={countdown.days} label="Ngày" />
              <CountdownSeparator />
              <CountdownBlock value={countdown.hours} label="Giờ" />
              <CountdownSeparator />
              <CountdownBlock value={countdown.minutes} label="Phút" />
              <CountdownSeparator />
              <CountdownBlock value={countdown.seconds} label="Giây" />
            </div>
          ) : countdown.isOver ? (
            /* Nút tải lại trang khi hết giờ */
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
            >
              <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '2s' }} />
              Tải Lại Trang
            </motion.button>
          ) : (
            /* Fallback: hiển thị text tĩnh khi không có maintenanceEndTime */
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-200">
                  {estimatedTime ? `Thời gian dự kiến: ${estimatedTime}` : 'Thời gian dự kiến: Sớm nhất có thể'}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Safety Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-200">
              {safetyInfo || 'Dữ liệu của bạn an toàn 100%'}
            </span>
          </div>
        </motion.div>

        {/* Footer/Contact */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.7, duration: 0.8 }}
           className="border-t border-white/10 pt-6 mt-6"
        >
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Cần hỗ trợ gấp? Liên hệ: <a href={contactInfo?.includes('@') ? `mailto:${contactInfo}` : '#'} className="text-blue-400 hover:text-blue-300 transition-colors">{contactInfo || 'contact@daotaothuyenvien.com'}</a>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default MaintenanceScreen;
